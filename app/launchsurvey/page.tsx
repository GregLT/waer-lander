'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const VOUCHER_CODE = 'SURVEY20'

// ─── QUESTION DATA ────────────────────────────────────────────────────────────
interface Opt { k: string; label: string; hasText?: boolean; fixed?: boolean }

const Q2_OPTS: Opt[] = [
  { k:'tiktok',    label:'TikTok' },
  { k:'instagram', label:'Instagram' },
  { k:'creator',   label:'Creator or influencer' },
  { k:'friend',    label:'Friend or family' },
  { k:'google',    label:'Google' },
  { k:'press',     label:'Press or article' },
  { k:'other',     label:'Other', hasText:true, fixed:true },
]
const Q3_OPTS: Opt[] = [
  { k:'scents',   label:'The scents' },
  { k:'vials',    label:'The vials and format' },
  { k:'refill',   label:'The refillable idea' },
  { k:'look',     label:'The look of the brand' },
  { k:'wardrobe', label:'The wardrobe concept' },
  { k:'creator',  label:'A creator I follow' },
  { k:'none',     label:'None of these', fixed:true },
  { k:'other',    label:'Other', hasText:true, fixed:true },
]
const Q6_OPTS: Opt[] = [
  { k:'price',      label:'Price felt too high' },
  { k:'trust',      label:"Wasn't sure I could trust a new brand" },
  { k:'smell',      label:'Wanted to smell it first before buying' },
  { k:'timing',     label:'Just not the right time' },
  { k:'gift',       label:'Was thinking about it as a gift' },
  { k:'range',      label:"Wasn't sure the fragrance range was right for me" },
  { k:'clarity',    label:'Not clear enough how it works' },
  { k:'site',       label:'Had a problem on site or checkout' },
  { k:'scent_pick', label:'Not sure which scent to pick' },
  { k:'nothing',    label:'Nothing specific', fixed:true },
  { k:'other',      label:'Other', hasText:true, fixed:true },
]
const Q6A_OPTS: Opt[] = [
  { k:'upfront', label:'The upfront cost' },
  { k:'sub',     label:'Did not want a subscription' },
  { k:'cheaper', label:'Cheaper alternatives available' },
  { k:'value',   label:'Not enough value for money' },
]
const Q6C_OPTS: Opt[] = [
  { k:'desc',     label:'The scent descriptions did not help enough' },
  { k:'too_many', label:'Too many options' },
  { k:'no_sample',label:'No way to sample or discover first' },
  { k:'similar',  label:'Some scents seemed too similar' },
]
const Q8_OPTS: Opt[] = [
  { k:'jo_malone',  label:'Jo Malone' },
  { k:'mm',         label:'Maison Margiela' },
  { k:'phlur',      label:'Phlur' },
  { k:'glossier',   label:'Glossier' },
  { k:'boy_smells', label:'Boy Smells' },
  { k:'sol',        label:'Sol de Janeiro' },
  { k:'byredo',     label:'Byredo' },
  { k:'highstreet', label:'High street' },
  { k:'dept',       label:'Department store counters' },
  { k:'other',      label:'Other', hasText:true, fixed:true },
]
const Q9_OPTS: Opt[] = [
  { k:'18-22', label:'18-22' },
  { k:'23-27', label:'23-27' },
  { k:'28-34', label:'28-34' },
  { k:'35+',   label:'35+' },
  { k:'pnts',  label:'Prefer not to say', fixed:true },
]

// ─── UTILS ───────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function randomize(opts: Opt[]): Opt[] {
  return [...shuffle(opts.filter(o => !o.fixed)), ...opts.filter(o => o.fixed)]
}
function genId() {
  return 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10)
}
function getDevice() {
  const ua = navigator.userAgent
  if (/Mobi|Android/i.test(ua)) return 'mobile'
  if (/iPad|Tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Screen =
  | 'intro' | 'q1' | 'q2' | 'q3' | 'q4'
  | 'q5_no' | 'q6_no' | 'q6a' | 'q6b' | 'q6c' | 'q7_no'
  | 'q5_yes' | 'q6d_yes'
  | 'q8' | 'q9' | 'q10' | 'thanks' | 'done'

interface Answers {
  q1?: string
  q2?: string; q2_other?: string; q2_order?: string[]
  q3?: string[]; q3_other?: string; q3_order?: string[]
  q4?: string
  q5_no?: string
  q6?: string[]; q6_other?: string; q6_order?: string[]
  q6a?: string; q6b?: string; q6c?: string; q6c_order?: string[]
  q7_no?: string
  q5_yes?: string; q6d_yes?: string
  q8?: string[]; q8_other?: string; q8_order?: string[]
  q9?: string
  q10_email?: string; q10_consent?: boolean
}

interface Orders {
  q2: Opt[]; q3: Opt[]; q6: Opt[]; q6c: Opt[]; q8: Opt[]
}

const PROGRESS: Record<Screen, number> = {
  intro:0, q1:8, q2:17, q3:25, q4:33,
  q5_no:42, q5_yes:42,
  q6_no:50, q6d_yes:55,
  q6a:57, q6b:61, q6c:65,
  q7_no:72, q8:80, q9:88, q10:95,
  thanks:100, done:100,
}

const STEP_LABEL: Partial<Record<Screen,string>> = {
  q1:'Q1', q2:'Q2', q3:'Q3', q4:'Q4',
  q5_no:'Q5', q6_no:'Q6', q6a:'Q6a', q6b:'Q6b', q6c:'Q6c', q7_no:'Q7',
  q5_yes:'Q5', q6d_yes:'Q6', q8:'Q8', q9:'Q9', q10:'Q10',
}

// ─── SAVE ─────────────────────────────────────────────────────────────────────
async function saveToAPI(payload: Record<string, unknown>) {
  try {
    await fetch('/api/launchsurvey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch { /* non-fatal */ }
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function LaunchSurvey() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [answers, setAnswers] = useState<Answers>({})
  const [orders, setOrders] = useState<Orders | null>(null)
  const [isBuyer, setIsBuyer] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)
  const historyRef = useRef<Screen[]>([])

  const respondentIdRef = useRef<string>('')
  const startedAtRef    = useRef<number>(0)
  const srcRef          = useRef('')
  const cmpRef          = useRef('')
  const bParamRef       = useRef<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    srcRef.current = params.get('src') || ''
    cmpRef.current = params.get('cmp') || ''
    bParamRef.current = params.get('b')

    if (bParamRef.current === '1') setIsBuyer(true)
    if (bParamRef.current === '0') setIsBuyer(false)

    try {
      let id = localStorage.getItem('waer_survey_rid')
      if (!id) { id = genId(); localStorage.setItem('waer_survey_rid', id) }
      respondentIdRef.current = id
      if (localStorage.getItem('waer_survey_done')) setScreen('done')
    } catch {
      respondentIdRef.current = genId()
    }

    setOrders({
      q2:  randomize(Q2_OPTS),
      q3:  randomize(Q3_OPTS),
      q6:  randomize(Q6_OPTS),
      q6c: randomize(Q6C_OPTS),
      q8:  randomize(Q8_OPTS),
    })
  }, [])

  const save = useCallback((partial: boolean, extra: Partial<Answers> = {}) => {
    const merged = { ...answers, ...extra }
    const now = Date.now()
    saveToAPI({
      respondent_id: respondentIdRef.current,
      started_at: new Date(startedAtRef.current || now).toISOString(),
      device: getDevice(),
      src: srcRef.current,
      cmp: cmpRef.current,
      b_param: bParamRef.current,
      buyer: isBuyer,
      completed: !partial,
      current_screen: screen,
      ...(partial ? {} : {
        completed_at: new Date(now).toISOString(),
        time_taken_s: Math.round((now - (startedAtRef.current || now)) / 1000),
      }),
      q2_order: orders?.q2.map(o => o.k),
      q3_order: orders?.q3.map(o => o.k),
      q6_order: orders?.q6.map(o => o.k),
      q6c_order: orders?.q6c.map(o => o.k),
      q8_order: orders?.q8.map(o => o.k),
      ...merged,
    })
    if (!partial) {
      try { localStorage.setItem('waer_survey_done', '1') } catch {}
    }
  }, [answers, isBuyer, orders, screen])

  function nextFrom(from: Screen): Screen {
    const b = bParamRef.current
    switch (from) {
      case 'intro':    return 'q1'
      case 'q1':       return 'q2'
      case 'q2':       return 'q3'
      case 'q3':
        if (b === '1') return 'q5_yes'
        if (b === '0') return 'q5_no'
        return 'q4'
      case 'q4': {
        const buyer = answers.q4 === 'yes'
        setIsBuyer(buyer)
        return buyer ? 'q5_yes' : 'q5_no'
      }
      case 'q5_no':    return 'q6_no'
      case 'q6_no': {
        const q6 = answers.q6 || []
        if (q6.includes('price'))      return 'q6a'
        if (q6.includes('site'))       return 'q6b'
        if (q6.includes('scent_pick')) return 'q6c'
        return 'q7_no'
      }
      case 'q6a': {
        const q6 = answers.q6 || []
        if (q6.includes('site'))       return 'q6b'
        if (q6.includes('scent_pick')) return 'q6c'
        return 'q7_no'
      }
      case 'q6b': {
        if ((answers.q6 || []).includes('scent_pick')) return 'q6c'
        return 'q7_no'
      }
      case 'q6c':     return 'q7_no'
      case 'q7_no':   return 'q8'
      case 'q5_yes':  return 'q6d_yes'
      case 'q6d_yes': return 'q8'
      case 'q8':      return 'q9'
      case 'q9':      return 'thanks'
      default:        return 'thanks'
    }
  }

  function goBack() {
    const prev = historyRef.current.pop()
    if (prev) { setScreen(prev); window.scrollTo(0, 0) }
  }

  function go(to: Screen, updatedAnswers?: Answers, partial = true) {
    const merged = updatedAnswers ? updatedAnswers : answers
    historyRef.current.push(screen)
    setAnswers(merged)
    setScreen(to)
    window.scrollTo(0, 0)
    saveToAPI({
      respondent_id: respondentIdRef.current,
      started_at: new Date(startedAtRef.current || Date.now()).toISOString(),
      device: getDevice(),
      src: srcRef.current,
      cmp: cmpRef.current,
      b_param: bParamRef.current,
      buyer: isBuyer,
      completed: !partial,
      current_screen: to,
      ...(partial ? {} : {
        completed_at: new Date().toISOString(),
        time_taken_s: Math.round((Date.now() - (startedAtRef.current || Date.now())) / 1000),
      }),
      q2_order: orders?.q2.map(o => o.k),
      q3_order: orders?.q3.map(o => o.k),
      q6_order: orders?.q6.map(o => o.k),
      q6c_order: orders?.q6c.map(o => o.k),
      q8_order: orders?.q8.map(o => o.k),
      ...merged,
    })
    if (!partial) {
      try { localStorage.setItem('waer_survey_done', '1') } catch {}
    }
  }

  function advance(updatedAnswers?: Answers, partial = true) {
    const next = nextFrom(screen)
    go(next, updatedAnswers, partial && next !== 'thanks')
  }

  function skip() { go(nextFrom(screen)) }

  if (!orders) return <div style={{ minHeight:'100vh', background:'var(--color-bg)' }} />

  return (
    <>
      <style>{`
        .survey-img-panel { display: none; }
        @media (min-width: 768px) { .survey-img-panel { display: block; } }
      `}</style>
      <div style={{ minHeight:'100vh', display:'flex', background:'var(--color-bg)', color:'var(--color-text)' }}>
        {/* Left: survey */}
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
          {screen !== 'intro' && screen !== 'thanks' && screen !== 'done' && (
            <div style={{ height:2, background:'rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:20 }}>
              <div style={{ height:'100%', background:'var(--accent)', width:`${PROGRESS[screen]}%`, transition:'width 0.35s ease' }} />
            </div>
          )}
          <div style={{ maxWidth:540, width:'100%', padding:'0 clamp(20px,5vw,56px)' }}>
            {screen !== 'intro' && screen !== 'thanks' && screen !== 'done' && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 0 0' }}>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  {historyRef.current.length > 0 && (
                    <button onClick={goBack} style={{ background:'none', border:'none', padding:0, cursor:'pointer', color:'var(--color-text-40)', display:'flex', alignItems:'center', gap:6, fontFamily:'var(--font-display)', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M5 1L1 5L5 9M1 5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Back
                    </button>
                  )}
                  <Image src="/assets/WAER_Wordmark_Black.png" alt="WAER" width={80} height={28} style={{ objectFit:'contain', height:28, width:'auto' }} />
                </div>
                <span style={{ fontFamily:'var(--font-display)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-40)' }}>{STEP_LABEL[screen] || ''}</span>
              </div>
            )}

            {screen === 'intro'    && <IntroScreen    onStart={() => { startedAtRef.current = Date.now(); setScreen('q1') }} />}
            {screen === 'done'     && <AlreadyDone />}
            {screen === 'thanks'   && <ThanksScreen copied={copied} onCopy={() => { navigator.clipboard.writeText(VOUCHER_CODE).catch(() => {}); setCopied(true) }} />}
            {screen === 'q1'       && <Q1  answers={answers} onNext={a => advance(a)} onSkip={skip} />}
            {screen === 'q2'       && <Q2  answers={answers} opts={orders.q2} onNext={a => advance(a)} />}
            {screen === 'q3'       && <Q3  answers={answers} opts={orders.q3} onNext={a => advance(a)} />}
            {screen === 'q4'       && <Q4  answers={answers} onNext={a => { const buyer = a.q4 === 'yes'; setIsBuyer(buyer); go(buyer ? 'q5_yes' : 'q5_no', a) }} />}
            {screen === 'q5_no'    && <Q5no  answers={answers} onNext={a => advance(a)} onSkip={skip} />}
            {screen === 'q6_no'    && <Q6no  answers={answers} opts={orders.q6} onNext={a => { const next = nextFrom('q6_no'); go(next, a) }} />}
            {screen === 'q6a'      && <Q6a  answers={answers} onNext={a => { const next = nextFrom('q6a'); go(next, a) }} />}
            {screen === 'q6b'      && <Q6b  answers={answers} onNext={a => { const next = nextFrom('q6b'); go(next, a) }} onSkip={skip} />}
            {screen === 'q6c'      && <Q6c  answers={answers} opts={orders.q6c} onNext={a => advance(a)} />}
            {screen === 'q7_no'    && <Q7no  answers={answers} onNext={a => advance(a)} onSkip={skip} />}
            {screen === 'q5_yes'   && <Q5yes  answers={answers} onNext={a => advance(a)} onSkip={skip} />}
            {screen === 'q6d_yes'  && <Q6dyes  answers={answers} onNext={a => advance(a)} onSkip={skip} />}
            {screen === 'q8'       && <Q8  answers={answers} opts={orders.q8} onNext={a => advance(a)} onSkip={skip} />}
            {screen === 'q9'       && <Q9  answers={answers} onNext={a => { go('thanks', a, false) }} onSkip={() => go('thanks', answers, false)} />}
          </div>
        </div>

        {/* Right: sticky image panel */}
        <div className="survey-img-panel" style={{ width:'42%', flexShrink:0, position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>
          <Image
            src="/assets/art-direction-vial-2.jpg"
            alt=""
            fill
            style={{ objectFit:'cover', objectPosition:'center' }}
            priority
          />
        </div>
      </div>
    </>
  )
}

// ─── SCREEN COMPONENTS ───────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ paddingTop:48, paddingBottom:64 }}>
      <Image src="/assets/WAER_Wordmark_Black.png" alt="WAER" width={100} height={32} style={{ objectFit:'contain', height:32, width:'auto', marginBottom:48 }} />
      <h1 style={s.heading}>Got two minutes?</h1>
      <p style={{ ...s.body, maxWidth:420, marginBottom:40 }}>
        We're a few weeks into WAER and we're building it with the people who use it. Got 2 minutes to tell us what you honestly think? No right answers, and a few words is plenty.
      </p>
      <button style={s.btnPrimary} onClick={onStart}>Start</button>
    </div>
  )
}

function AlreadyDone() {
  return (
    <div style={{ paddingTop:48, paddingBottom:64 }}>
      <Image src="/assets/WAER_Wordmark_Black.png" alt="WAER" width={100} height={32} style={{ objectFit:'contain', height:32, width:'auto', marginBottom:48 }} />
      <h1 style={s.heading}>Already done!</h1>
      <p style={{ ...s.body, maxWidth:400 }}>It looks like you've already completed this survey from this device. Thank you for taking the time.</p>
    </div>
  )
}

function ThanksScreen({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <div style={{ paddingTop:72, paddingBottom:80, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
      <div style={{ width:52, height:52, border:'2px solid var(--accent)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)', marginBottom:28 }}>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M2 8L8 14L20 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h2 style={{ ...s.heading, marginBottom:8 }}>Thank you for taking the time to share your thoughts about WAER.</h2>
      <p style={{ ...s.body, marginBottom:28 }}>Here's a little thank you from us - 20% off your next order.</p>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'18px 20px', border:'1px solid rgba(0,0,0,0.15)', borderRadius:4, background:'rgba(0,0,0,0.04)', width:'100%', maxWidth:380 }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase' }}>{VOUCHER_CODE}</span>
        <button style={s.btnCopy} onClick={onCopy}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
    </div>
  )
}

// ─── QUESTION SCREENS ────────────────────────────────────────────────────────

function Q1({ answers, onNext, onSkip }: { answers: Answers; onNext: (a: Answers) => void; onSkip: () => void }) {
  const [val, setVal] = useState(answers.q1 || '')
  return (
    <QWrap section="About you" heading="Where did you hear about WAER?" sub="Take your time. A few words is fine.">
      <textarea style={s.textarea} placeholder="Type anything..." value={val} onChange={e => setVal(e.target.value)} />
      <NavRow onNext={() => onNext({ ...answers, q1: val })} onSkip={onSkip} />
    </QWrap>
  )
}

function Q2({ answers, opts, onNext }: { answers: Answers; opts: Opt[]; onNext: (a: Answers) => void }) {
  const [sel, setSel] = useState(answers.q2 || '')
  const [other, setOther] = useState(answers.q2_other || '')
  return (
    <QWrap section="About you" heading="Where did you first hear about WAER?" sub="Pick one.">
      <SingleSelect opts={opts} selected={sel} otherVal={other} onSelect={setSel} onOther={setOther} />
      <NavRow onNext={() => sel ? onNext({ ...answers, q2: sel, q2_other: other || undefined }) : undefined} disabled={!sel} />
    </QWrap>
  )
}

function Q3({ answers, opts, onNext }: { answers: Answers; opts: Opt[]; onNext: (a: Answers) => void }) {
  const [sel, setSel] = useState<string[]>(answers.q3 || [])
  const [other, setOther] = useState(answers.q3_other || '')
  return (
    <QWrap section="About you" heading="What caught your attention?" sub="Pick everything that applied.">
      <MultiSelect opts={opts} selected={sel} otherVal={other} onSelect={setSel} onOther={setOther} />
      <NavRow onNext={() => sel.length ? onNext({ ...answers, q3: sel, q3_other: other || undefined }) : undefined} disabled={!sel.length} />
    </QWrap>
  )
}

function Q4({ answers, onNext }: { answers: Answers; onNext: (a: Answers) => void }) {
  const [sel, setSel] = useState(answers.q4 || '')
  const opts: Opt[] = [{ k:'no', label:'Not yet' }, { k:'yes', label:'Yes' }]
  return (
    <QWrap section="Your experience" heading="Have you bought from WAER?">
      <SingleSelect opts={opts} selected={sel} onSelect={setSel} />
      <NavRow onNext={() => sel ? onNext({ ...answers, q4: sel }) : undefined} disabled={!sel} />
    </QWrap>
  )
}

function Q5no({ answers, onNext, onSkip }: { answers: Answers; onNext: (a: Answers) => void; onSkip: () => void }) {
  const [val, setVal] = useState(answers.q5_no || '')
  return (
    <QWrap section="Not bought yet" heading="What was going through your head when you didn't buy?" sub="Anything at all, even if it's vague.">
      <textarea style={s.textarea} placeholder="Type anything..." value={val} onChange={e => setVal(e.target.value)} />
      <NavRow onNext={() => onNext({ ...answers, q5_no: val })} onSkip={onSkip} />
    </QWrap>
  )
}

function Q6no({ answers, opts, onNext }: { answers: Answers; opts: Opt[]; onNext: (a: Answers) => void }) {
  const [sel, setSel] = useState<string[]>(answers.q6 || [])
  const [other, setOther] = useState(answers.q6_other || '')
  return (
    <QWrap section="Not bought yet" heading="What got in the way?" sub="Tick everything that applies.">
      <MultiSelect opts={opts} selected={sel} otherVal={other} onSelect={setSel} onOther={setOther} />
      <NavRow onNext={() => sel.length ? onNext({ ...answers, q6: sel, q6_other: other || undefined }) : undefined} disabled={!sel.length} />
    </QWrap>
  )
}

function Q6a({ answers, onNext }: { answers: Answers; onNext: (a: Answers) => void }) {
  const [sel, setSel] = useState(answers.q6a || '')
  return (
    <QWrap section="Price concern" heading="What felt too expensive about it?" sub="Pick the closest one.">
      <SingleSelect opts={Q6A_OPTS} selected={sel} onSelect={setSel} />
      <NavRow onNext={() => sel ? onNext({ ...answers, q6a: sel }) : undefined} disabled={!sel} />
    </QWrap>
  )
}

function Q6b({ answers, onNext, onSkip }: { answers: Answers; onNext: (a: Answers) => void; onSkip: () => void }) {
  const [val, setVal] = useState(answers.q6b || '')
  return (
    <QWrap section="Site or checkout" heading="What was the problem on the site?" sub="A few words helps us fix it.">
      <textarea style={s.textarea} placeholder="Describe what happened..." value={val} onChange={e => setVal(e.target.value)} />
      <NavRow onNext={() => onNext({ ...answers, q6b: val })} onSkip={onSkip} />
    </QWrap>
  )
}

function Q6c({ answers, opts, onNext }: { answers: Answers; opts: Opt[]; onNext: (a: Answers) => void }) {
  const [sel, setSel] = useState(answers.q6c || '')
  return (
    <QWrap section="Scent selection" heading="What made it hard to choose a scent?" sub="Pick the closest one.">
      <SingleSelect opts={opts} selected={sel} onSelect={setSel} />
      <NavRow onNext={() => sel ? onNext({ ...answers, q6c: sel }) : undefined} disabled={!sel} />
    </QWrap>
  )
}

function Q7no({ answers, onNext, onSkip }: { answers: Answers; onNext: (a: Answers) => void; onSkip: () => void }) {
  const [val, setVal] = useState(answers.q7_no || '')
  return (
    <QWrap section="Not bought yet" heading="Is there anything that would make you buy?" sub="No pressure if nothing comes to mind.">
      <textarea style={s.textarea} placeholder="Type anything..." value={val} onChange={e => setVal(e.target.value)} />
      <NavRow onNext={() => onNext({ ...answers, q7_no: val })} onSkip={onSkip} />
    </QWrap>
  )
}

function Q5yes({ answers, onNext, onSkip }: { answers: Answers; onNext: (a: Answers) => void; onSkip: () => void }) {
  const [val, setVal] = useState(answers.q5_yes || '')
  return (
    <QWrap section="You bought" heading="What made you decide to buy?" sub="Whatever tipped it for you.">
      <textarea style={s.textarea} placeholder="Type anything..." value={val} onChange={e => setVal(e.target.value)} />
      <NavRow onNext={() => onNext({ ...answers, q5_yes: val })} onSkip={onSkip} />
    </QWrap>
  )
}

function Q6dyes({ answers, onNext, onSkip }: { answers: Answers; onNext: (a: Answers) => void; onSkip: () => void }) {
  const [val, setVal] = useState(answers.q6d_yes || '')
  return (
    <QWrap section="You bought" heading="Anything you wish was different about the experience?" sub="Packaging, site, product -- anything goes.">
      <textarea style={s.textarea} placeholder="Type anything..." value={val} onChange={e => setVal(e.target.value)} />
      <NavRow onNext={() => onNext({ ...answers, q6d_yes: val })} onSkip={onSkip} />
    </QWrap>
  )
}

function Q8({ answers, opts, onNext, onSkip }: { answers: Answers; opts: Opt[]; onNext: (a: Answers) => void; onSkip: () => void }) {
  const [sel, setSel] = useState<string[]>(answers.q8 || [])
  const [other, setOther] = useState(answers.q8_other || '')
  return (
    <QWrap section="Your taste" heading="Which of these brands do you buy from or consider?" sub="Tick all that apply.">
      <MultiSelect opts={opts} selected={sel} otherVal={other} onSelect={setSel} onOther={setOther} />
      <NavRow onNext={() => onNext({ ...answers, q8: sel, q8_other: other || undefined })} onSkip={onSkip} />
    </QWrap>
  )
}

function Q9({ answers, onNext, onSkip }: { answers: Answers; onNext: (a: Answers) => void; onSkip: () => void }) {
  const [sel, setSel] = useState(answers.q9 || '')
  return (
    <QWrap section="Almost done" heading="How old are you?">
      <SingleSelect opts={Q9_OPTS} selected={sel} onSelect={setSel} />
      <NavRow onNext={() => onNext({ ...answers, q9: sel })} onSkip={onSkip} />
    </QWrap>
  )
}

function Q10({ answers, onNext, onSkip }: { answers: Answers; onNext: (a: Answers) => void; onSkip: () => void }) {
  const [email, setEmail]     = useState(answers.q10_email || '')
  const [consent, setConsent] = useState(answers.q10_consent || false)
  return (
    <QWrap section="Last one" heading="Want to hear from us?" sub="Drop your email if you'd like updates from WAER. Completely optional.">
      <input
        type="email"
        style={s.input}
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:28, cursor:'pointer' }} onClick={() => setConsent(c => !c)}>
        <div style={{ flexShrink:0, width:20, height:20, border:'1.5px solid', borderColor: consent ? 'var(--color-text)' : 'rgba(0,0,0,0.3)', borderRadius:3, marginTop:2, background: consent ? 'var(--color-text)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.1s' }}>
          {consent && <svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 3.5L3.5 6L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
        </div>
        <span style={{ fontSize:13, color:'var(--color-text-40)', lineHeight:1.55 }}>We'll only use this to tell you about WAER. Unsubscribe any time.</span>
      </div>
      <NavRow nextLabel="Submit" onNext={() => onNext({ ...answers, q10_email: email || undefined, q10_consent: consent })} onSkip={onSkip} />
    </QWrap>
  )
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────

function QWrap({ section, heading, sub, children }: { section: string; heading: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingTop:32, paddingBottom:56 }}>
      <div style={{ fontFamily:'var(--font-display)', fontSize:11, fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--accent)', marginBottom:10 }}>{section}</div>
      <h2 style={s.heading}>{heading}</h2>
      {sub && <p style={{ ...s.body, marginBottom:28 }}>{sub}</p>}
      {children}
    </div>
  )
}

function SingleSelect({ opts, selected, otherVal = '', onSelect, onOther }: { opts: Opt[]; selected: string; otherVal?: string; onSelect: (k: string) => void; onOther?: (v: string) => void }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:28 }}>
      {opts.map(opt => (
        <div key={opt.k}>
          <button
            style={{ ...s.optBtn, ...(selected === opt.k ? s.optBtnSel : {}) }}
            onClick={() => onSelect(opt.k)}
          >
            <span style={{ ...s.dot, ...(selected === opt.k ? s.dotSel : {}) }}>
              {selected === opt.k && <span style={{ width:6, height:6, borderRadius:'50%', background:'white' }} />}
            </span>
            {opt.label}
          </button>
          {opt.hasText && selected === opt.k && (
            <input style={{ ...s.input, marginTop:6 }} type="text" placeholder="Please specify..." value={otherVal} onChange={e => onOther?.(e.target.value)} onClick={e => e.stopPropagation()} />
          )}
        </div>
      ))}
    </div>
  )
}

function MultiSelect({ opts, selected, otherVal = '', onSelect, onOther }: { opts: Opt[]; selected: string[]; otherVal?: string; onSelect: (ks: string[]) => void; onOther?: (v: string) => void }) {
  function toggle(k: string) {
    if (k === 'none') { onSelect(['none']); return }
    const without = selected.filter(x => x !== 'none')
    if (without.includes(k)) onSelect(without.filter(x => x !== k))
    else onSelect([...without, k])
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:28 }}>
      {opts.map(opt => {
        const sel = selected.includes(opt.k)
        return (
          <div key={opt.k}>
            <button
              style={{ ...s.optBtn, ...(sel ? s.optBtnSel : {}) }}
              onClick={() => toggle(opt.k)}
            >
              <span style={{ ...s.dot, borderRadius:3, ...(sel ? s.dotSel : {}) }}>
                {sel && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              </span>
              {opt.label}
            </button>
            {opt.hasText && sel && (
              <input style={{ ...s.input, marginTop:6 }} type="text" placeholder="Please specify..." value={otherVal} onChange={e => onOther?.(e.target.value)} onClick={e => e.stopPropagation()} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function NavRow({ onNext, onSkip, disabled = false, nextLabel = 'Next' }: { onNext: () => void; onSkip?: () => void; disabled?: boolean; nextLabel?: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16 }}>
      <button style={{ ...s.btnPrimary, opacity: disabled ? 0.35 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }} onClick={onNext} disabled={disabled}>{nextLabel}</button>
      {onSkip && <button style={s.btnSkip} onClick={onSkip}>Skip</button>}
    </div>
  )
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = {
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(22px, 5.5vw, 30px)',
    fontWeight: 700,
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
    lineHeight: 1.15,
    marginBottom: 6,
    textWrap: 'balance' as const,
  },
  body: {
    fontSize: 14,
    color: 'var(--color-text-40)',
    lineHeight: 1.6,
  },
  textarea: {
    width: '100%',
    minHeight: 110,
    padding: '14px 16px',
    border: '1px solid rgba(0,0,0,0.18)',
    borderRadius: 4,
    background: 'transparent',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    resize: 'vertical' as const,
    marginBottom: 20,
    outline: 'none',
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    border: '1px solid rgba(0,0,0,0.18)',
    borderRadius: 4,
    background: 'transparent',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    marginBottom: 12,
    outline: 'none',
  },
  optBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '14px 16px',
    border: '1px solid rgba(0,0,0,0.18)',
    borderRadius: 4,
    background: 'transparent',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    cursor: 'pointer',
    textAlign: 'left' as const,
    minHeight: 52,
    transition: 'border-color 0.1s',
  },
  optBtnSel: {
    borderColor: 'var(--color-text)',
    background: 'rgba(0,0,0,0.04)',
  },
  dot: {
    flexShrink: 0,
    width: 18,
    height: 18,
    border: '1.5px solid rgba(0,0,0,0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.1s',
  },
  dotSel: {
    background: 'var(--color-text)',
    borderColor: 'var(--color-text)',
  },
  btnPrimary: {
    padding: '14px 28px',
    background: 'var(--color-text)',
    color: 'var(--color-bg)',
    border: 'none',
    borderRadius: 4,
    fontFamily: 'var(--font-display)',
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    minWidth: 110,
    transition: 'opacity 0.1s',
  },
  btnSkip: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-40)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    cursor: 'pointer',
    padding: '4px 0',
  },
  btnCopy: {
    padding: '8px 16px',
    background: 'var(--color-text)',
    color: 'var(--color-bg)',
    border: 'none',
    borderRadius: 3,
    fontFamily: 'var(--font-display)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    flexShrink: 0,
    whiteSpace: 'nowrap' as const,
  },
}
