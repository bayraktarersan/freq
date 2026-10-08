import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, AudioLines, Check, ChevronRight, CircleHelp, Download, Headphones, House, Layers3, Music2, Pause, Play, SlidersHorizontal, Sparkles, Target, Trash2, TrendingUp, UserRound, Volume2, X } from 'lucide-react';
import { getLesson, lessons, paths, skillNames, text, tx, ui, type Locale, type PathId, type SkillId, type Text } from './content';
import { advanceQuestion, answerQuestion, initialProgress, makeQuestion, newSession, parseProgress, recommendedLesson, ROUND_COUNT, skillStats, STORAGE_KEY, type Progress, type Question } from './model';
import { AudioEngine, type AudioStatus, type Variant } from './audio';

type Page = 'today' | 'paths' | 'path' | 'skills' | 'profile' | 'practice' | 'summary';
const pathIds: PathId[] = ['mix', 'music', 'exam'];
const skillIds: SkillId[] = ['eq', 'direction', 'interval', 'chord', 'memory'];
const pathIcon = { mix: SlidersHorizontal, music: Music2, exam: Target };

function Brand() { return <span className="brand"><span className="brand-bars" aria-hidden="true"><i /><i /><i /><i /></span>freq<span className="brand-dot">.</span></span>; }
function Tag({ children, className = '' }: { children: ReactNode; className?: string }) { return <span className={`tag ${className}`}>{children}</span>; }
function PathIcon({ path, size = 23 }: { path: PathId; size?: number }) { const Icon = pathIcon[path]; return <Icon size={size} aria-hidden="true" />; }

function FrequencyArt({ small = false }: { small?: boolean }) {
  return <div className={`frequency-art ${small ? 'small' : ''}`} aria-hidden="true">
    <div className="art-grid" /><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
    <svg viewBox="0 0 400 210"><defs><linearGradient id="wave-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#c8ed86" stopOpacity=".23" /><stop offset="1" stopColor="#c8ed86" stopOpacity="0" /></linearGradient></defs>
      <path d="M0 151 C32 151 40 130 58 130 S85 163 105 156 S134 136 151 124 S176 37 209 37 S240 116 262 129 S297 148 321 143 S361 130 400 130 L400 210 L0 210 Z" fill="url(#wave-fill)" />
      <path d="M0 151 C32 151 40 130 58 130 S85 163 105 156 S134 136 151 124 S176 37 209 37 S240 116 262 129 S297 148 321 143 S361 130 400 130" stroke="#c8ed86" strokeWidth="2.5" fill="none" />
      <circle cx="209" cy="37" r="6" fill="#c8ed86" /><circle cx="209" cy="37" r="13" stroke="#c8ed86" strokeOpacity=".3" fill="none" />
    </svg>
    <div className="art-frequencies"><span>20 Hz</span><span>1 kHz</span><span>20 kHz</span></div>
    <div className="art-label"><AudioLines size={16} /> LISTEN CLOSELY</div>
  </div>;
}

function EqCurve({ question, locale }: { question: Question; locale: Locale }) {
  const points = Array.from({ length: 140 }, (_, i) => {
    const x = i / 139 * 420;
    const hz = 30 * Math.pow(16000 / 30, i / 139);
    // Analytical magnitude response of the same peaking biquad used by Web Audio.
    const rate = 48000, A = Math.pow(10, question.gain! / 40);
    const w0 = 2 * Math.PI * question.frequency! / rate, alpha = Math.sin(w0) / (2 * question.q!);
    const b = [1 + alpha * A, -2 * Math.cos(w0), 1 - alpha * A];
    const a = [1 + alpha / A, -2 * Math.cos(w0), 1 - alpha / A];
    const w = 2 * Math.PI * hz / rate;
    const mag = (c: number[]) => Math.hypot(c[0] + c[1] * Math.cos(w) + c[2] * Math.cos(2 * w), -c[1] * Math.sin(w) - c[2] * Math.sin(2 * w));
    const db = 20 * Math.log10(mag(b) / mag(a));
    return `${x.toFixed(2)},${(65 - db * 4.4).toFixed(2)}`;
  }).join(' ');
  return <div className="eq-curve"><svg viewBox="0 0 420 130" role="img" aria-label={tx(text('Yanıtın EQ eğrisi', 'EQ response for the answer'), locale)}>
    {[25, 65, 105].map(y => <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="currentColor" strokeOpacity=".12" />)}
    <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2.3" />
  </svg><div><span>30 Hz</span><span>1 kHz</span><span>16 kHz</span></div></div>;
}

function AudioPlayer({ engine, question, locale, volume, onVolume, onHeard }: {
  engine: AudioEngine; question: Question; locale: Locale; volume: number; onVolume: (value: number) => void; onHeard?: (v: Variant) => void;
}) {
  const [status, setStatus] = useState<AudioStatus>(engine.status);
  const [variant, setVariant] = useState<Variant>('a');
  const pair = question.kind === 'eq' || question.kind === 'memory';
  const callback = useRef(onHeard); callback.current = onHeard;
  useEffect(() => engine.subscribe(setStatus), [engine]);
  useEffect(() => { engine.stop(); setVariant('a'); return () => engine.stop(); }, [engine, question.seed, question.kind]);
  const play = async (v: Variant = variant) => {
    setVariant(v);
    const didPlay = await engine.play(question, v, () => callback.current?.(v));
    if (didPlay && question.kind === 'eq') callback.current?.(v);
  };
  const toggle = () => { if (status === 'playing' || status === 'preparing') engine.stop(); else void play(); };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest('input,button,select,textarea,[role="dialog"]') || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.code === 'Space') { event.preventDefault(); toggle(); }
      else if (pair && ['a', 'b'].includes(event.key.toLowerCase())) { event.preventDefault(); void play(event.key.toLowerCase() as Variant); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });
  return <div className={`audio-player ${status === 'playing' ? 'is-playing' : ''}`}>
    <div className="player-top"><span className="eyebrow">{tx(text('DİNLEME ALANI', 'LISTENING SPACE'), locale)}</span><span className="audio-mark" aria-hidden="true"><Headphones size={16} /></span></div>
    <div className="waveform" aria-hidden="true">{Array.from({ length: 49 }, (_, i) => <i key={i} style={{ height: `${10 + Math.abs(Math.sin(i * 2.6) * Math.cos(i * 0.29)) * 64}px`, animationDelay: `${i * 0.023}s` }} />)}</div>
    {pair && <div className="ab-controls" role="group" aria-label={tx(text('A/B dinleme', 'A/B listening'), locale)}>
      {(['a', 'b'] as Variant[]).map(v => <button key={v} className={`ab-button ${variant === v ? 'selected' : ''}`} aria-pressed={variant === v} onClick={() => void play(v)} disabled={status === 'preparing'}><span className="ab-letter">{v.toUpperCase()}</span><span>{tx(question.kind === 'eq' ? v === 'a' ? ui.original : ui.changed : v === 'a' ? ui.melodyA : ui.melodyB, locale)}</span><Volume2 size={17} /></button>)}
    </div>}
    <div className="player-bottom"><button className="play-button" onClick={toggle} aria-label={tx(status === 'playing' || status === 'preparing' ? ui.pause : ui.play, locale)}>{status === 'playing' || status === 'preparing' ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}<span>{tx(status === 'preparing' ? ui.preparing : status === 'playing' ? ui.pause : ui.play, locale)}</span></button>
      <label className="volume-control"><Volume2 size={18} /><span className="sr-only">{tx(ui.volume, locale)}</span><input aria-label={tx(ui.volume, locale)} type="range" min="0.05" max="0.8" step="0.01" value={volume} onChange={e => onVolume(Number(e.target.value))} /></label>
    </div>
    {status === 'error' && <p className="notice" role="alert">{tx(ui.audioError, locale)}</p>}
  </div>;
}

function Modal({ title, copy, cancel, action, onCancel, onAction, children }: { title: string; copy: string; cancel: string; action: string; onCancel: () => void; onAction: () => void; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Tab') {
        const buttons = ref.current?.querySelectorAll<HTMLButtonElement>('button');
        if (!buttons?.length) return;
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key); return () => { document.removeEventListener('keydown', key); previous?.focus(); };
  }, [onCancel]);
  return <div className="modal-overlay"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={ref}><h2 id="modal-title">{title}</h2><p>{copy}</p>{children}<div className="modal-actions"><button className="button secondary" onClick={onCancel}>{cancel}</button><button className="button" onClick={onAction}>{action}</button></div></div></div>;
}

export function App() {
  const [progress, setProgress] = useState<Progress>(() => { try { return parseProgress(localStorage.getItem(STORAGE_KEY)); } catch { return initialProgress(); } });
  const [storageError, setStorageError] = useState(false);
  const [page, setPage] = useState<Page>(() => progress.session ? 'practice' : 'today');
  const [selectedPath, setSelectedPath] = useState<PathId>(progress.path);
  const [resetOpen, setResetOpen] = useState(false);
  const [pendingLesson, setPendingLesson] = useState<string | null>(null);
  const [heard, setHeard] = useState<Variant[]>([]);
  const engine = useMemo(() => new AudioEngine(), []);
  const mainRef = useRef<HTMLElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const locale = progress.locale;
  const t = (value: Text) => tx(value, locale);
  const session = progress.session;
  const lesson = session ? getLesson(session.lessonId) : null;
  const question = useMemo(() => session ? makeQuestion(session.lessonId, session.seed, session.index) : null, [session?.lessonId, session?.seed, session?.index]);
  const guided = useMemo(() => lesson ? makeQuestion(lesson.id, 2026, 0) : null, [lesson?.id]);
  const answered = session?.answers[session.index];
  const requiredHeard: Variant[] = question && ['eq', 'memory'].includes(question.kind) ? ['a', 'b'] : ['a'];
  const canAnswer = requiredHeard.every(v => heard.includes(v));
  const recommended = recommendedLesson(progress);

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); setStorageError(false); } catch { setStorageError(true); } }, [progress]);
  useEffect(() => { document.documentElement.lang = locale; document.title = locale === 'tr' ? 'Freq · Kulağını geliştir' : 'Freq · Train your ears'; }, [locale]);
  useEffect(() => engine.setVolume(progress.volume), [engine, progress.volume]);
  useEffect(() => { const pause = () => { if (document.hidden) engine.stop(); }; const hide = () => engine.stop(); document.addEventListener('visibilitychange', pause); window.addEventListener('pagehide', hide); return () => { document.removeEventListener('visibilitychange', pause); window.removeEventListener('pagehide', hide); engine.stop(); }; }, [engine]);
  useEffect(() => { engine.stop(); mainRef.current?.focus(); window.scrollTo({ top: 0, behavior: 'instant' }); }, [engine, page]);
  useEffect(() => { setHeard([]); }, [session?.id, session?.index, session?.started]);
  useEffect(() => { if (answered) feedbackRef.current?.focus(); }, [answered]);

  const navigate = (next: Page) => { engine.stop(); setPage(next); };
  const setVolume = (volume: number) => { engine.setVolume(volume); setProgress(p => ({ ...p, volume })); };
  const start = (id: string) => {
    engine.stop();
    if (session && session.lessonId !== id) { setPendingLesson(id); return; }
    if (!session) setProgress(p => ({ ...p, session: newSession(id) }));
    navigate('practice');
  };
  const goPath = (path: PathId) => { setSelectedPath(path); navigate('path'); };
  const chooseAnswer = (choice: string) => { if (!canAnswer || answered) return; setProgress(p => answerQuestion(p, choice)); engine.stop(); };
  useEffect(() => {
    if (page !== 'practice' || !session?.started || answered || !canAnswer || pendingLesson) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,button,select,textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
      const index = Number(e.key) - 1;
      if (index >= 0 && index < (question?.options.length ?? 0)) chooseAnswer(question!.options[index].id);
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });
  const nextQuestion = () => {
    if (!session || !answered) return;
    engine.stop(); setProgress(p => advanceQuestion(p));
    if (session.index === ROUND_COUNT - 1) navigate('summary');
    else requestAnimationFrame(() => mainRef.current?.focus());
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `freq-progress-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const completedQuestions = progress.attempts.length;
  const totalAccuracy = completedQuestions ? Math.round(progress.attempts.filter(a => a.correct).length / completedQuestions * 100) : null;
  const nav = [{ page: 'today' as const, icon: House, label: ui.today }, { page: 'paths' as const, icon: Layers3, label: ui.paths }, { page: 'skills' as const, icon: TrendingUp, label: ui.skills }, { page: 'profile' as const, icon: UserRound, label: ui.profile }];
  const activeNav = page === 'path' ? 'paths' : page === 'practice' || page === 'summary' ? 'today' : page;
  const playerProps = { engine, locale, volume: progress.volume, onVolume: setVolume };
  const path = page === 'practice' && lesson ? lesson.path : page === 'path' ? selectedPath : progress.path;

  return <div className={`app theme-${paths[path].color}`}>
    <a href="#main" className="skip-link">{t(ui.skipLink)}</a>
    <aside className="sidebar"><button className="brand-button" onClick={() => navigate('today')} aria-label="Freq"><Brand /></button>
      <span className="sidebar-label">{t(text('SENİN ALANIN', 'YOUR SPACE'))}</span>
      <nav aria-label={t(text('Ana gezinme', 'Main navigation'))}>{nav.map(({ page: p, icon: Icon, label }) => <button key={p} onClick={() => navigate(p)} aria-current={activeNav === p ? 'page' : undefined} className={`nav-item ${activeNav === p ? 'active' : ''}`}><Icon size={20} /><span>{t(label)}</span>{activeNav === p && <span className="nav-dot" />}</button>)}</nav>
      <div className="sidebar-bottom"><div className="mini-note"><Headphones size={23} /><p>{t(text('Her gün biraz\ndaha dikkatli dinle.', 'Listen a little\ncloser every day.'))}</p></div><span className="edition">{t(ui.early)}</span></div>
    </aside>
    <div className="workspace"><header className="topbar"><div className="mobile-brand"><Brand /></div><span className="breadcrumb">{t(nav.find(n => n.page === activeNav)!.label)}{page === 'path' && <><ChevronRight size={14} />{t(paths[selectedPath].short)}</>}</span>
      <div className="topbar-right"><span className="local-badge"><span />{t(text('Kişisel dinleme alanı', 'Personal listening space'))}</span><div className="language-switch" role="group" aria-label={t(ui.language)}>{(['tr', 'en'] as Locale[]).map(l => <button key={l} aria-pressed={locale === l} onClick={() => setProgress(p => ({ ...p, locale: l }))}>{l.toUpperCase()}</button>)}</div></div></header>
    <main id="main" ref={mainRef} tabIndex={-1} className={`main-content ${page === 'practice' ? 'practice-main' : ''}`}>
      {storageError && <p className="notice storage-notice" role="status">{t(ui.storageError)}</p>}
      {page === 'today' && <>
        <section className="home-hero"><div className="hero-copy"><div className="eyebrow"><span className="tiny-star">✳</span>{t(ui.studio)}</div><h1>{t(ui.welcome)}</h1><p className="lead">{t(ui.welcomeSub)}</p><div className="active-path"><span className="active-path-icon"><PathIcon path={progress.path} size={18} /></span><div><span>{t(ui.active)}</span><strong>{t(paths[progress.path].title)}</strong></div><button className="icon-button" onClick={() => navigate('paths')} aria-label={t(ui.allPaths)}><ArrowRight size={19} /></button></div></div><FrequencyArt /></section>
        <section className="dashboard-grid"><div className="next-card"><div className="card-heading"><span className="eyebrow">{session ? t(text('YARIM KALAN PRATİĞİN', 'YOUR UNFINISHED PRACTICE')) : t(ui.next)}</span><Tag>{t(ui.levels)} {session ? getLesson(session.lessonId).level : recommended.level}</Tag></div><div className="next-body"><span className="next-icon"><AudioLines size={36} strokeWidth={1.5} /></span><div><h2>{t(session ? getLesson(session.lessonId).title : recommended.title)}</h2><p>{t(session ? getLesson(session.lessonId).description : recommended.description)}</p></div></div><div className="next-footer"><div className="lesson-meta"><span><Headphones size={15} />{t(ui.minutes)}</span><span>•</span><span>{t(ui.questions)}</span></div><button className="button" onClick={() => start(session?.lessonId ?? recommended.id)}>{t(session ? ui.resume : ui.start)}<ArrowRight size={18} /></button></div></div>
          <div className="stats-card"><span className="eyebrow">{t(text('KÜÇÜK ADIMLAR, GERÇEK PRATİK', 'SMALL STEPS, REAL PRACTICE'))}</span><div className="stat-row"><span>{t(ui.sessions)}</span><strong>{progress.results.length.toString().padStart(2, '0')}</strong></div><div className="stat-row"><span>{t(ui.total)}</span><strong>{completedQuestions.toString().padStart(2, '0')}</strong></div><div className="stat-row"><span>{t(ui.accuracy)}</span><strong>{totalAccuracy === null ? '—' : `${totalAccuracy}%`}</strong></div><button className="text-button" onClick={() => navigate('skills')}>{t(text('Becerilerine göz at', 'See your skills'))}<ArrowUpRightIcon /></button></div></section>
        <section className="paths-section"><div className="section-heading"><h2>{t(text('Üç yol. Bir dinleme alışkanlığı.', 'Three paths. One listening habit.'))}</h2><button className="text-button" onClick={() => navigate('paths')}>{t(ui.allPaths)}<ArrowRight size={16} /></button></div><div className="path-cards">{pathIds.map(p => <button key={p} className={`path-card color-${paths[p].color}`} onClick={() => goPath(p)}><span className="path-card-top"><span className="path-card-icon"><PathIcon path={p} /></span>{progress.path === p ? <Tag>{t(ui.selected)}</Tag> : <ArrowRight size={19} />}</span><span className="path-card-title">{t(paths[p].title)}</span><span className="path-card-desc">{t(paths[p].description)}</span><span className="path-card-bottom">{t(ui.available)}<ChevronRight size={17} /></span></button>)}</div></section>
        <aside className="listening-note"><span className="note-icon"><Sparkles size={23} /></span><div><span className="eyebrow">{t(ui.learnTip)}</span><h3>{t(ui.tipHome)}</h3><p>{t(ui.tipHomeCopy)}</p></div></aside>
      </>}
      {page === 'paths' && <><PageHeading label={t(text('ÖĞRENME YOLLARI', 'LEARNING PATHS'))} title={t(ui.choose)} copy={t(ui.chooseSub)} /><div className="full-path-list">{pathIds.map((p, i) => <section className={`full-path color-${paths[p].color}`} key={p}><div className="full-path-number">0{i + 1}</div><div className="full-path-content"><div className="eyebrow">{t(paths[p].label)}</div><h2><PathIcon path={p} />{t(paths[p].title)}</h2><p>{t(paths[p].description)}</p><div className="lesson-chips">{lessons.filter(l => l.path === p).map(l => <span key={l.id}>{t(l.title)}</span>)}</div></div><button className="button secondary" onClick={() => goPath(p)}>{t(ui.viewPath)}<ArrowRight size={18} /></button></section>)}</div></>}
      {page === 'path' && <><button className="text-button back-link" onClick={() => navigate('paths')}><ArrowLeft size={17} />{t(ui.allPaths)}</button><PageHeading label={t(paths[selectedPath].label)} title={t(paths[selectedPath].title)} copy={t(paths[selectedPath].description)} /><div className="path-detail-meta"><Tag><PathIcon path={selectedPath} size={14} />{t(ui.available)}</Tag><button className="text-button" onClick={() => setProgress(p => ({ ...p, path: selectedPath }))}>{progress.path === selectedPath ? <Check size={16} /> : <ArrowDown size={16} />}{t(progress.path === selectedPath ? ui.selected : ui.makeActive)}</button></div><div className="lesson-list">{lessons.filter(l => l.path === selectedPath).map(l => { const attempts = progress.attempts.filter(a => a.lessonId === l.id); return <div className="lesson-row" key={l.id}><span className="level-number">0{l.level}</span><div className="lesson-row-copy"><span className="eyebrow">{t(ui.levels)} {l.level}</span><h2>{t(l.title)}</h2><p>{t(l.description)}</p>{attempts.length > 0 && <span className="attempt-count">{attempts.length} {t(text('yanıt', 'answers'))} · {Math.round(attempts.filter(a => a.correct).length / attempts.length * 100)}%</span>}</div><button className="button secondary" onClick={() => start(l.id)}>{t(session?.lessonId === l.id ? ui.resume : ui.start)}<ArrowRight size={18} /></button></div>; })}</div><aside className="roadmap-note"><CircleHelp size={22} /><div><h3>{t(ui.future)}</h3><p>{t(selectedPath === 'mix' ? ui.roadmapMix : selectedPath === 'music' ? ui.roadmapMusic : ui.roadmapExam)}</p></div></aside></>}
      {page === 'skills' && <><PageHeading label={t(text('BECERİ HARİTAN', 'YOUR SKILL MAP'))} title={t(ui.skillsTitle)} copy={t(ui.skillsSub)} /><div className="skill-grid">{skillIds.map(skill => { const stats = skillStats(progress, skill); return <section className="skill-card" key={skill}><div className="skill-card-top"><AudioLines size={21} /><span>{stats.count > 0 ? `${stats.count} ${t(text('yanıt', 'answers'))}` : t(ui.notYet)}</span></div><h2>{t(skillNames[skill])}</h2><strong className="skill-score">{stats.accuracy === null ? '—' : `${stats.accuracy}%`}</strong><div className="skill-bar" role="meter" aria-label={t(skillNames[skill])} aria-valuemin={0} aria-valuemax={100} aria-valuenow={stats.accuracy ?? 0} aria-valuetext={stats.accuracy === null ? t(ui.notYet) : `${stats.accuracy}%`}><span style={{ width: `${stats.accuracy ?? 0}%` }} /></div><button className="text-button" onClick={() => start(lessons.find(l => l.skill === skill)!.id)}>{t(text('Bu beceriyi çalış', 'Practise this skill'))}<ArrowRight size={16} /></button></section>; })}</div>{!completedQuestions && <p className="empty-state">{t(ui.noData)}</p>}{progress.results.length > 0 && <section className="recent-section"><h2>{t(ui.recent)}</h2>{progress.results.slice(-5).reverse().map(result => <div className="recent-row" key={result.id}><span className="recent-icon"><PathIcon path={getLesson(result.lessonId).path} size={18} /></span><div><strong>{t(getLesson(result.lessonId).title)}</strong><span>{new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short' }).format(new Date(result.at))}</span></div><span className="recent-score">{result.correct}/{result.total}</span></div>)}</section>}</>}
      {page === 'profile' && <><PageHeading label={t(ui.profile)} title={t(ui.profileTitle)} copy={t(ui.profileSub)} /><div className="settings-grid"><section className="setting-card"><h2>{t(ui.language)}</h2><div className="setting-options">{(['tr', 'en'] as Locale[]).map(l => <button key={l} className={locale === l ? 'selected' : ''} aria-pressed={locale === l} onClick={() => setProgress(p => ({ ...p, locale: l }))}>{l === 'tr' ? 'Türkçe' : 'English'}{locale === l && <Check size={17} />}</button>)}</div><h2>{t(ui.defaultPath)}</h2><div className="setting-options vertical">{pathIds.map(p => <button key={p} className={progress.path === p ? 'selected' : ''} aria-pressed={progress.path === p} onClick={() => setProgress(v => ({ ...v, path: p }))}><PathIcon path={p} size={18} />{t(paths[p].title)}{progress.path === p && <Check size={17} />}</button>)}</div></section><section className="setting-card"><h2><Headphones size={21} />{t(ui.setupTitle)}</h2><p>{t(ui.setupCopy)}</p><AudioPlayer {...playerProps} question={makeQuestion('eq-1', 101, 0)} /><p className="small-copy">{t(ui.headphoneSub)}</p></section><section className="setting-card"><h2>{t(ui.install)}</h2><p>{t(ui.installCopy)}</p><Tag>{t(text('Web · iPhone · Android', 'Web · iPhone · Android'))}</Tag><p className="small-copy">{t(text('Mağaza uygulamaları bu sürümün kapsamına henüz dahil değil.', 'Store apps are not yet included in this edition.'))}</p></section><section className="setting-card"><h2>{t(ui.local)}</h2><p>{t(ui.deviceOnly)}</p><div className="data-actions"><button className="button secondary" onClick={download}><Download size={17} />{t(ui.export)}</button><button className="text-button danger" onClick={() => setResetOpen(true)}><Trash2 size={16} />{t(ui.reset)}</button></div></section></div></>}
      {page === 'practice' && session && lesson && question && <>
        <div className="practice-heading"><button className="text-button" onClick={() => navigate('today')}><ArrowLeft size={17} />{t(ui.exit)}</button><span>{t(paths[lesson.path].short)} · {t(ui.levels)} {lesson.level}</span></div>
        {!session.started ? <div className="lesson-intro"><div className="eyebrow">{t(ui.before)}</div><h1>{t(lesson.title)}</h1><p className="lead">{t(lesson.description)}</p><div className="intro-columns"><div><div className="intro-section"><span className="intro-step">01</span><div><h2>{t(ui.listenFor)}</h2><p>{t(lesson.learn)}</p></div></div><div className="intro-section"><span className="intro-step">02</span><div><h2>{t(ui.how)}</h2><p>{t(lesson.listen)}</p></div></div><div className="intro-tip"><Headphones size={21} /><p>{t(lesson.tip)}</p></div></div><div className="guided-example"><span className="eyebrow">{t(ui.guided)}</span><p>{t(ui.guidedCaption)}</p><div className="example-answer"><Check size={17} />{t(ui.correctAnswer)}: <strong>{t(guided!.options.find(o => o.id === guided!.correct)!.label)}</strong></div><AudioPlayer {...playerProps} question={guided!} />{guided!.kind === 'eq' && <EqCurve question={guided!} locale={locale} />}</div></div><button className="button large intro-start" onClick={() => { engine.stop(); setProgress(p => ({ ...p, session: p.session ? { ...p.session, started: true } : null })); }}>{t(ui.begin)}<ArrowRight size={18} /></button><p className="small-copy">{t(ui.questions)} · {t(ui.minutes)} · {t(ui.saved)}</p></div> : <div className="exercise"><div className="question-progress"><span>{t(ui.question)} <strong>{session.index + 1}</strong> / {ROUND_COUNT}</span><span>{t(lesson.title)}</span></div><div className="round-bars" aria-hidden="true">{Array.from({ length: ROUND_COUNT }, (_, i) => <i key={i} className={i < session.index ? 'done' : i === session.index ? 'current' : ''} />)}</div><h1>{t(question.kind === 'eq' ? ui.mixQuestion : question.kind === 'direction' ? ui.directionQuestion : question.kind === 'interval' ? ui.intervalQuestion : question.kind === 'chord' ? ui.chordQuestion : ui.memoryQuestion)}</h1><p className="exercise-sub">{t(lesson.listen)}</p><AudioPlayer key={`${session.id}-${session.index}`} {...playerProps} question={question} onHeard={v => setHeard(h => h.includes(v) ? h : [...h, v])} /><div className="answer-heading"><span className="eyebrow">{t(text('YANITINI SEÇ', 'CHOOSE YOUR ANSWER'))}</span>{!canAnswer && !answered && <span className="listen-first">{t(ui.answerFirst)}</span>}</div><div className={`answer-options options-${question.options.length}`}>{question.options.map((option, i) => <button key={option.id} data-testid={`answer-${option.id}`} className={`answer-option ${answered && option.id === question.correct ? 'is-correct' : ''} ${answered?.choice === option.id && !answered.correct ? 'is-incorrect' : ''}`} disabled={!!answered || !canAnswer} onClick={() => chooseAnswer(option.id)}><span className="answer-key">{i + 1}</span><span className="answer-copy"><strong>{t(option.label)}</strong>{option.detail && <span>{t(option.detail)}</span>}</span>{answered && option.id === question.correct && <Check size={21} />}{answered?.choice === option.id && !answered.correct && <X size={21} />}</button>)}</div>
        {answered && <div ref={feedbackRef} tabIndex={-1} className={`feedback ${answered.correct ? 'correct' : 'review'}`} role="status"><div className="feedback-heading">{answered.correct ? <Check size={22} /> : <Headphones size={22} />}<h2>{t(answered.correct ? ui.correct : ui.incorrect)}</h2></div><p><strong>{t(ui.correctAnswer)}: {t(question.options.find(o => o.id === question.correct)!.label)}.</strong> {t(question.explanation)}</p>{question.kind === 'eq' && <EqCurve question={question} locale={locale} />}<p className="feedback-replay">{t(text('Yukarıdaki Dinle ve A/B düğmeleriyle örneği tekrar duyabilirsin.', 'Use the Listen and A/B buttons above to hear the example again.'))}</p><button className="button" onClick={nextQuestion}>{t(session.index === ROUND_COUNT - 1 ? ui.finish : ui.nextQuestion)}<ArrowRight size={18} /></button></div>}
        <p className="keyboard-note">{t(ui.shortcut)}</p></div>}
      </>}
      {page === 'summary' && progress.results.length > 0 && <div className="summary"><div className="summary-icon"><Check size={36} /></div><div className="eyebrow">{t(text('PRATİK TAMAMLANDI', 'PRACTICE COMPLETE'))}</div><h1>{t(ui.complete)}</h1><p className="lead">{t(ui.completeSub)}</p><div className="summary-score"><strong>{progress.results.at(-1)!.correct}<span> / {ROUND_COUNT}</span></strong><span>{t(ui.accuracy)}</span></div><h2>{t(getLesson(progress.results.at(-1)!.lessonId).title)}</h2><p className="summary-tip">{t(getLesson(progress.results.at(-1)!.lessonId).tip)}</p><div className="summary-actions"><button className="button" onClick={() => start(progress.results.at(-1)!.lessonId)}>{t(ui.again)}<ArrowRight size={18} /></button><button className="button secondary" onClick={() => navigate('today')}>{t(ui.home)}</button></div><p className="small-copy">{t(ui.saved)}</p></div>}
      <footer className="page-footer"><span>freq. <span className="footer-divider">/</span> {t(text('Biraz daha dikkatli dinle.', 'Listen a little closer.'))}</span><span>{t(ui.early)}</span></footer>
    </main></div>
    <nav className="mobile-nav" aria-label={t(text('Mobil gezinme', 'Mobile navigation'))}>{nav.map(({ page: p, icon: Icon, label }) => <button key={p} className={activeNav === p ? 'active' : ''} onClick={() => navigate(p)} aria-current={activeNav === p ? 'page' : undefined}><Icon size={21} /><span>{t(label)}</span></button>)}</nav>
    {resetOpen && <Modal title={t(ui.resetTitle)} copy={t(ui.resetCopy)} cancel={t(ui.cancel)} action={t(ui.delete)} onCancel={() => setResetOpen(false)} onAction={() => { engine.stop(); setProgress(p => ({ ...initialProgress(), locale: p.locale, path: p.path, volume: p.volume })); setResetOpen(false); navigate('today'); }}><button className="text-button" onClick={download}><Download size={16} />{t(ui.export)}</button></Modal>}
    {pendingLesson && <Modal title={t(text('Yarım kalan bir pratiğin var.', 'You have an unfinished practice.'))} copy={t(text('Yeni pratiğe geçersen bu oturum kapanır. Şimdiye kadar yanıtladığın sorular beceri kayıtlarında kalır.', 'Starting a new practice closes this session. Answers already given remain in your skill records.'))} cancel={t(ui.resume)} action={t(text('Yeni pratiğe geç', 'Start the new practice'))} onCancel={() => { setPendingLesson(null); navigate('practice'); }} onAction={() => { setProgress(p => ({ ...p, session: newSession(pendingLesson) })); setPendingLesson(null); navigate('practice'); }} />}
  </div>;
}
function ArrowUpRightIcon() { return <ArrowRight size={16} className="diagonal-arrow" />; }
function PageHeading({ label, title, copy }: { label: string; title: string; copy: string }) { return <div className="page-heading"><div className="eyebrow">{label}</div><h1>{title}</h1><p className="lead">{copy}</p></div>; }
