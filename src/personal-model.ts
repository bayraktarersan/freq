import { getLesson, lessons, text, usesLoop, type PathId, type SkillId, type Text } from './content';
import { makeQuestion, type Progress } from './model';
import { evaluateAnswer } from './music-model';
import type { PersonalAnswer, PersonalMode, PersonalProgress, PersonalResult, PersonalSession, QuestionRef } from './personal-types';

export const PERSONAL_RESULT_LIMIT = 100;
const DAY = 86_400_000;
const RETRY = 10 * 60_000;
export const personalSkills: Record<PathId, SkillId[]> = {
  mix: ['eq', 'loudness', 'compression', 'attack', 'release', 'masking', 'stereo', 'reverb', 'delay'],
  music: ['direction', 'interval', 'chord', 'rhythm', 'tonic', 'degree', 'function', 'melodic-dictation', 'rhythmic-dictation', 'rhythm-repeat'],
  exam: ['memory', 'interval', 'chord', 'degree', 'melodic-dictation', 'rhythmic-dictation'],
};
export const initialPersonalProgress = (): PersonalProgress => ({ version: 1, active: null, results: [] });
export const skillLessons = (skill: SkillId) => lessons.filter(l => l.skill === skill).sort((a,b) => a.level-b.level);
export const refQuestion = (ref: QuestionRef) => makeQuestion(ref.lessonId, ref.seed, ref.index, ref.source);
export const refIdentity = (ref: QuestionRef) => JSON.stringify([ref.lessonId, ref.seed, ref.index, usesLoop(getLesson(ref.lessonId).skill) ? ref.source ?? 'studio' : null]);
const exampleIdentity = (ref:QuestionRef) => JSON.stringify([ref.lessonId,(ref.seed+ref.index*2654435761)>>>0,usesLoop(getLesson(ref.lessonId).skill)?ref.source??'studio':null]);
const freshRef = (lessonId: string, seed: number, index: number, source?: QuestionRef['source']): QuestionRef => ({ lessonId, seed: (seed + index * 2654435761) >>> 0, index: 0, ...(usesLoop(getLesson(lessonId).skill) ? { source: source ?? 'studio' } : {}) });

/** The second probe steps up only after a correct first probe. Two answers are a starting suggestion. */
export function placementItems(path: PathId, seed: number, answers: PersonalAnswer[] = [], source: QuestionRef['source'] = 'studio'): QuestionRef[] {
  return personalSkills[path].flatMap((skill,i) => {
    const available=skillLessons(skill), first=available[0];
    const next=answers[i*2]?.correct ? available[1] ?? first : first;
    return [freshRef(first.id,seed,i*2,source),freshRef(next.id,seed,i*2+1,source)];
  });
}
export type Evidence = { id: string; sessionId: string; lessonId: string; correct: boolean; at: number; ref?: QuestionRef; review?: QuestionRef['review']; choice?: string };
export function studyEvidence(progress: Progress): Evidence[] {
  const manual: Evidence[]=progress.attempts.map(a=>({id:`manual:${a.sessionId}:${a.index}`,sessionId:a.sessionId,lessonId:a.lessonId,correct:a.correct,at:Date.parse(a.at),...(a.response?{ref:{lessonId:a.lessonId,seed:a.response.seed,index:a.index,source:a.source},choice:a.response.choice}:{})}));
  const p=progress.personal;
  const sessions: PersonalSession[] = [...(p?.results ?? []), ...(p?.active ? [p.active] : [])];
  const personal: Evidence[]=sessions.filter(s=>s.mode!=='placement').flatMap(s=>s.answers.flatMap((a,i)=>a.choice===null?[]:[{id:`personal:${s.id}:${i}`,sessionId:s.id,lessonId:s.items[i].lessonId,correct:a.correct,at:a.at,ref:s.items[i],review:s.items[i].review,choice:a.choice}]));
  const unique=new Map<string,Evidence>();
  for(const e of [...manual,...personal])if(!unique.has(e.id))unique.set(e.id,e);
  return [...unique.values()].sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id));
}
export type SkillEstimate = { skill: SkillId; level: number; samples: number; accuracy: number | null; reason: 'new' | 'placement' | 'up' | 'down' | 'support' | 'steady'; placementAt: number | null; placementAnswered: number; placementCorrect: number; lastAt: number | null; explanation: Text };
export function skillEstimate(progress: Progress, skill: SkillId): SkillEstimate {
  const available=skillLessons(skill);
  const placement=progress.personal?.results.filter(s=>s.mode==='placement'&&s.status==='completed'&&s.answers.some((a,i)=>a.choice!==null&&getLesson(s.items[i].lessonId).skill===skill)).sort((a,b)=>b.finishedAt-a.finishedAt)[0];
  const probes=placement?.answers.filter((_,i)=>getLesson(placement.items[i].lessonId).skill===skill)??[];
  let pos=0, reason:SkillEstimate['reason']=placement?'placement':'new';
  if(placement) {
    const answers=placement.answers.filter((_,i)=>getLesson(placement.items[i].lessonId).skill===skill);
    if(answers.length===2&&answers.every(a=>a.correct))pos=Math.min(1,available.length-1);
  }
  const seen=new Set<string>(placement?.items.map(exampleIdentity));
  let window:Evidence[]=[], lastAt:number|null=null;
  for(const e of studyEvidence(progress)) {
    if(getLesson(e.lessonId).skill!==skill || e.review || placement && e.at<=placement.finishedAt)continue;
    // Exact repeats may improve recall, but cannot independently raise difficulty.
    const identity=e.ref?exampleIdentity(e.ref):e.id;
    if(seen.has(identity))continue; seen.add(identity); lastAt=e.at;
    if(getLesson(e.lessonId).level!==available[pos].level)continue;
    window=[...window,e].slice(-10);
    const distinct=new Set(window.map(v=>v.sessionId)).size;
    const correct=window.filter(v=>v.correct).length;
    if(window.length===10&&distinct>=2&&correct>=8&&pos<available.length-1){pos++;window=[];reason='up';}
    else if(window.length>=6&&distinct>=2&&window.slice(-6).filter(v=>v.correct).length<=2&&pos>0){pos--;window=[];reason='down';}
    else if(window.length>=6&&distinct>=2&&window.slice(-6).filter(v=>v.correct).length<=2&&pos===0)reason='support';
    else if(reason==='new'||reason==='support')reason='steady';
  }
  const explanation=reason==='support'?text('İlk aşamada zorlanıyorsun. Önce dersin açıklamalı örneklerini yeniden dinle, ardından kısa tekrarlarla pekiştir.', 'The first stage is proving difficult. Revisit the guided lesson examples, then reinforce them with short reviews.'):available.length===1 ? text('Bu beceride tek pratik aşaması var; yeni örneklerle pekiştir.', 'This skill has one practice stage; reinforce it with fresh examples.') : reason==='up' ? text('En az iki oturumda son 10 yeni sorunun en az 8’i doğru: bir sonraki seviye önerildi.', 'At least 8 of the last 10 fresh questions were correct across two or more sessions: the next level is suggested.') : reason==='down' ? text('En az iki oturumda son 6 yeni sorunun en fazla 2’si doğru: daha rahat bir seviye önerildi.', 'At most 2 of the last 6 fresh questions were correct across two or more sessions: an easier level is suggested.') : reason==='placement' ? text('İki başlangıç sorusuna dayalı geçici öneri. Yeni pratiklerle netleşecek.', 'A tentative suggestion based on two placement probes. Fresh practice will refine it.') : reason==='new' ? text('Henüz yeterli veri yok; ilk aşamadan güvenli bir başlangıç.', 'There is not enough evidence yet; start with the first stage.') : text('Seviye değişikliği için farklı oturumlardan daha fazla yeni yanıt gerekiyor.', 'More fresh answers across separate sessions are needed to change the level.');
  return {skill,level:available[pos].level,samples:window.length,accuracy:window.length?Math.round(window.filter(e=>e.correct).length/window.length*100):null,reason,placementAt:placement?.finishedAt??null,placementAnswered:probes.filter(a=>a.choice!==null).length,placementCorrect:probes.filter(a=>a.correct).length,lastAt,explanation};
}
export type ReviewCard = { id: string; ref: QuestionRef; createdAt: number; dueAt: number; successes: number; resolved: boolean };
export function reviewCards(progress: Progress): ReviewCard[] {
  const cards=new Map<string,ReviewCard>();
  for(const e of studyEvidence(progress)) {
    if(!e.ref)continue;
    if(!e.review) {
      if(!e.correct)cards.set(e.id,{id:e.id,ref:e.ref,createdAt:e.at,dueAt:Math.min(8.64e15,e.at+RETRY),successes:0,resolved:false});
      continue;
    }
    let card=cards.get(e.review.id);
    // Keep a review alive even after its original session ages out of retained history.
    if(!card){const {review:_review,...original}=e.ref;card={id:e.review.id,ref:original,createdAt:e.review.createdAt,dueAt:Math.min(8.64e15,e.review.createdAt+RETRY),successes:0,resolved:false};cards.set(card.id,card);}
    if(!e.correct){card.successes=0;card.resolved=false;card.dueAt=Math.min(8.64e15,e.at+RETRY);}
    else if(e.at>=card.dueAt&&!card.resolved){card.successes++;card.resolved=card.successes>=4;card.dueAt=card.resolved?e.at:Math.min(8.64e15,e.at+[1,3,7][card.successes-1]*DAY);}
  }
  return [...cards.values()].filter(c=>!c.resolved).sort((a,b)=>a.dueAt-b.dueAt||a.id.localeCompare(b.id));
}
export function personalPlan(progress: Progress, path=progress.path, now=Date.now()) {
  const estimates=personalSkills[path].map(s=>skillEstimate(progress,s));
  const focus=[...estimates].sort((a,b)=>{
    const priority=(s:SkillEstimate)=>s.reason==='down'||s.reason==='support'?3:s.samples>0&&s.accuracy!==null&&s.accuracy<60?2:s.lastAt===null?1:0;
    return priority(b)-priority(a)||(a.lastAt??0)-(b.lastAt??0)||personalSkills[path].indexOf(a.skill)-personalSkills[path].indexOf(b.skill);
  })[0];
  const cards=reviewCards(progress).filter(c=>personalSkills[path].includes(getLesson(c.ref.lessonId).skill)).slice(0,200);
  const due=cards.filter(c=>c.dueAt<=now);
  return {focus,estimates,cards,due,lesson:skillLessons(focus.skill).find(l=>l.level===focus.level)!};
}

export function startPersonal(progress: Progress, mode:PersonalMode, path=progress.path, now=Date.now(), seed=crypto.getRandomValues(new Uint32Array(1))[0], id:string=crypto.randomUUID()): Progress {
  const p=progress.personal??initialPersonalProgress();
  if(p.active)return progress;
  const plan=personalPlan(progress,path,now),source=progress.eqSource??'studio';
  let items:QuestionRef[];
  if(mode==='placement')items=placementItems(path,seed,[],source);
  else {
    const reviews=(mode==='review'?plan.cards:plan.due).slice(0,mode==='review'?5:2).map(c=>({...c.ref,review:{id:c.id,createdAt:c.createdAt}}));
    if(mode==='review'&&!reviews.length)return progress;
    items=mode==='review'?reviews:[...reviews,...Array.from({length:5-reviews.length},(_,i)=>freshRef(plan.lesson.id,seed,i,source))];
  }
  return {...progress,personal:{...p,active:{id,mode,path,seed,startedAt:now,items,index:0,answers:[]}}};
}
export function answerPersonal(progress:Progress, choice:string|null, now=Date.now()):Progress {
  const p=progress.personal,s=p?.active;
  if(!p||!s||s.answers[s.index]||now<s.startedAt||now<(s.answers.at(-1)?.at??0))return progress;
  const correct=choice===null?false:evaluateAnswer(refQuestion(s.items[s.index]),choice);
  if(correct===null)return progress;
  const answers=[...s.answers,{choice,correct,at:now}];
  const items=s.mode==='placement'?placementItems(s.path,s.seed,answers,s.items[0].source):s.items;
  return {...progress,personal:{...p,active:{...s,answers,items}}};
}
export function advancePersonal(progress:Progress, now=Date.now()):Progress {
  const p=progress.personal,s=p?.active;
  if(!p||!s||!s.answers[s.index]||now<(s.answers.at(-1)?.at??s.startedAt))return progress;
  if(s.index<s.items.length-1)return {...progress,personal:{...p,active:{...s,index:s.index+1}}};
  const result:PersonalResult={...s,finishedAt:now,status:'completed'};
  return {...progress,personal:{...p,active:null,results:[...p.results,result].slice(-PERSONAL_RESULT_LIMIT)}};
}
export function endPersonal(progress:Progress, now=Date.now()):Progress {
  const p=progress.personal,s=p?.active;
  if(!p||!s||now<(s.answers.at(-1)?.at??s.startedAt))return progress;
  return {...progress,personal:{...p,active:null,results:[...p.results,{...s,finishedAt:now,status:'ended' as const}].slice(-PERSONAL_RESULT_LIMIT)}};
}
