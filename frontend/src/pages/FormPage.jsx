import { useState } from 'react'
import { C } from '../tokens'

/* ── Sub-components ── */
function Field({ label, icon, placeholder, value, onChange, type = 'text', hint, unit, error }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        {label}
        {unit && <span style={{ fontSize: 12, color: C.muted, marginLeft: 2 }}>({unit})</span>}
      </div>
      <input
        className={`pcos-input${error ? ' err' : ''}`}
        type={type} inputMode={type === 'number' ? 'decimal' : 'text'}
        placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
      />
      {error && <div style={{ fontSize: 12, color: '#f43f5e', marginTop: 4 }}>⚠ {error}</div>}
      {hint && !error && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function Toggle({ label, icon, desc, value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 16px', borderRadius: 14,
      background: value ? C.pinkLight : 'rgba(248,245,255,0.8)',
      border: `1.5px solid ${value ? C.pink + '55' : 'transparent'}`,
      transition: 'all 0.25s', marginBottom: 10, cursor: 'pointer', userSelect: 'none',
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{label}</div>
          {desc && <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{desc}</div>}
        </div>
      </div>
      <label className="toggle-sw" onClick={e => e.stopPropagation()}>
        <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
        <div className="tog-track" />
      </label>
    </div>
  )
}

function BmiBadge({ bmi }) {
  if (!bmi || isNaN(bmi) || !isFinite(bmi)) return null
  const b = parseFloat(bmi)
  const [cat, col] = b < 18.5 ? ['Underweight', '#60a5fa']
    : b < 25 ? ['Healthy weight', '#6ee7b7']
    : b < 30 ? ['Overweight', C.pink]
    : ['Obese', '#f43f5e']
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 50, background: col + '22', border: `1px solid ${col}44`, marginBottom: 20 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: col }}>BMI {b.toFixed(1)}</span>
      <span style={{ fontSize: 12, color: col }}>{cat}</span>
    </div>
  )
}

/* ── Main form ── */
const INIT = {
  age: '', heightCm: '', weightKg: '', cycle_length: '',
  weight_gain: false, hair_growth: false, skin_darkening: false,
  hair_loss: false, pimples: false, mood_swings: false,
  fast_food: false, reg_exercise: true,
}

const STEPS = [
  { title: 'About You',      sub: 'Basic info to get started',         emoji: '💁‍♀️' },
  { title: 'Your Symptoms',  sub: 'Select everything that applies',     emoji: '🩺' },
  { title: 'Lifestyle',      sub: 'Your everyday habits',              emoji: '🌿' },
]

export default function FormPage({ go, setResult }) {
  const [step, setStep]     = useState(0)
  const [f, setF]           = useState(INIT)
  const [errs, setErrs]     = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const bmi = (f.heightCm && f.weightKg)
    ? parseFloat(f.weightKg) / ((parseFloat(f.heightCm) / 100) ** 2)
    : null

  const validateStep0 = () => {
    const e = {}
    const a = parseFloat(f.age), h = parseFloat(f.heightCm),
          w = parseFloat(f.weightKg), c = parseFloat(f.cycle_length)
    if (!f.age || isNaN(a) || a < 10 || a > 65)         e.age          = 'Enter a valid age between 10 and 65'
    if (!f.heightCm || isNaN(h) || h < 100 || h > 220)  e.heightCm     = 'Enter height in cm (e.g. 163)'
    if (!f.weightKg || isNaN(w) || w < 30  || w > 200)  e.weightKg     = 'Enter weight in kg (e.g. 60)'
    if (!f.cycle_length || isNaN(c) || c < 10 || c > 120) e.cycle_length = 'Enter cycle length in days (e.g. 28)'
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 0 && !validateStep0()) return
    setErrs({})
    setStep(s => s + 1)
  }

  const submit = async () => {
    setLoading(true)
    const payload = {
      age:            parseFloat(f.age),
      height_cm:      parseFloat(f.heightCm),
      weight_kg:      parseFloat(f.weightKg),
      cycle_length:   parseFloat(f.cycle_length),
      weight_gain:    f.weight_gain  ? 1 : 0,
      hair_growth:    f.hair_growth  ? 1 : 0,
      skin_darkening: f.skin_darkening ? 1 : 0,
      hair_loss:      f.hair_loss    ? 1 : 0,
      pimples:        f.pimples      ? 1 : 0,
      mood_swings:    f.mood_swings  ? 1 : 0,
      fast_food:      f.fast_food    ? 1 : 0,
      reg_exercise:   f.reg_exercise ? 1 : 0,
    }

    try {
      const res  = await fetch('/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setResult(data)
    } catch {
      // Offline heuristic fallback
      const bmiVal = bmi || 22
      const cl     = parseFloat(f.cycle_length)
      const raw =
        (bmiVal > 28 ? 0.09 : bmiVal > 25 ? 0.04 : -0.02) +
        (cl > 40 ? 0.16 : cl > 35 ? 0.09 : cl < 21 ? 0.06 : 0) +
        (f.weight_gain    ? 0.10 : 0) +
        (f.hair_growth    ? 0.12 : 0) +
        (f.skin_darkening ? 0.09 : 0) +
        (f.hair_loss      ? 0.07 : 0) +
        (f.pimples        ? 0.07 : 0) +
        (f.mood_swings    ? 0.05 : 0) +
        (f.fast_food      ? 0.04 : 0) +
        (f.reg_exercise   ? -0.08 : 0.04) + 0.12
      const score = Math.min(0.93, Math.max(0.05, raw))
      const pct   = Math.round(score * 1000) / 10

      const cat = pct < 35
        ? { label: 'Low Risk',      color: '#6ee7b7', emoji: '🌿', message: 'Your symptoms suggest a lower likelihood of PCOS. Keep maintaining those healthy habits!', suggestions: ['Keep up regular exercise (150 min/week)', 'Maintain a balanced, nutritious diet', 'Track your cycle each month', 'Annual gynaecological check-ups are always a good idea'] }
        : pct < 65
        ? { label: 'Moderate Risk', color: '#fbbf24', emoji: '🌸', message: 'Some of your symptoms are associated with PCOS. A visit to a gynaecologist would be a great next step.', suggestions: ['Book a gynaecologist appointment soon', 'Ask your doctor about a hormonal blood panel', 'Consider a pelvic ultrasound', 'Cut back on refined sugars and processed foods', 'Try gentle movement — yoga or daily walks work great'] }
        : { label: 'High Risk',     color: '#f472b6', emoji: '💜', message: 'Several symptoms are commonly linked with PCOS. Please consult a doctor — PCOS is very manageable with support!', suggestions: ['See a doctor or gynaecologist as soon as possible', 'Request a full hormonal blood panel', 'Ask about a pelvic ultrasound', 'Discuss treatment options — many effective ones exist', 'Connect with a PCOS support community', 'Focus on a low-glycemic diet and consistent movement'] }

      const factors = []
      if (cl > 35)           factors.push({ feature: 'Irregular Cycle',    impact: 'increases', value: `${cl} days` })
      if (f.hair_growth)     factors.push({ feature: 'Excess Hair Growth', impact: 'increases', value: 'Yes' })
      if (f.weight_gain)     factors.push({ feature: 'Weight Gain',        impact: 'increases', value: 'Yes' })
      if (bmiVal > 25)       factors.push({ feature: 'BMI',                impact: 'increases', value: bmiVal.toFixed(1) })
      if (f.skin_darkening)  factors.push({ feature: 'Skin Darkening',     impact: 'increases', value: 'Yes' })
      if (f.reg_exercise)    factors.push({ feature: 'Regular Exercise',   impact: 'decreases', value: 'Yes' })
      setResult({ probability: pct, ...cat, key_factors: factors })
    }

    setLoading(false)
    go('results')
  }

  const s = STEPS[step]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 20px 40px' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
          {STEPS.map((_, i) => <div key={i} className={`step-dot${i === step ? ' active' : i < step ? ' done' : ''}`} />)}
        </div>

        <div className="glass" style={{ padding: '36px 30px', animation: 'slide-in 0.4s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>{s.emoji}</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, marginBottom: 6, background: `linear-gradient(135deg,${C.pink},${C.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.title}</h2>
            <p style={{ fontSize: 13, color: C.muted }}>{s.sub}</p>
          </div>

          {/* Step 0 — Basic info */}
          {step === 0 && <>
            <Field label="Age" icon="🎂" placeholder="e.g. 26" type="number" value={f.age} onChange={v => set('age', v)} error={errs.age} hint="Years" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Height" icon="📏" placeholder="e.g. 163" type="number" unit="cm" value={f.heightCm} onChange={v => set('heightCm', v)} error={errs.heightCm} />
              <Field label="Weight" icon="⚖️" placeholder="e.g. 60"  type="number" unit="kg" value={f.weightKg}  onChange={v => set('weightKg', v)}  error={errs.weightKg} />
            </div>
            {bmi && <BmiBadge bmi={bmi} />}
            <Field label="Menstrual Cycle Length" icon="📅" placeholder="e.g. 28" type="number" unit="days" value={f.cycle_length} onChange={v => set('cycle_length', v)} error={errs.cycle_length} hint="Days from start of one period to the next. Typical: 21–35" />
          </>}

          {/* Step 1 — Symptoms */}
          {step === 1 && <>
            <Toggle label="Unexpected Weight Gain"     icon="⚖️" desc="Gained weight without major diet change"        value={f.weight_gain}    onChange={v => set('weight_gain', v)} />
            <Toggle label="Excess Facial or Body Hair" icon="🪒" desc="Upper lip, chin, chest or back"                 value={f.hair_growth}    onChange={v => set('hair_growth', v)} />
            <Toggle label="Skin Darkening"             icon="🌑" desc="Dark patches on neck, armpits or groin"         value={f.skin_darkening} onChange={v => set('skin_darkening', v)} />
            <Toggle label="Scalp Hair Loss or Thinning" icon="💆" desc="Noticeable thinning or excess shedding"        value={f.hair_loss}      onChange={v => set('hair_loss', v)} />
            <Toggle label="Persistent Acne or Pimples" icon="🫧" desc="Ongoing breakouts, especially on jaw or chin"   value={f.pimples}        onChange={v => set('pimples', v)} />
            <Toggle label="Frequent Mood Swings"       icon="🌊" desc="Mood changes or emotional sensitivity"          value={f.mood_swings}    onChange={v => set('mood_swings', v)} />
          </>}

          {/* Step 2 — Lifestyle */}
          {step === 2 && <>
            <Toggle label="Frequent Fast Food"  icon="🍟" desc="3 or more times per week"   value={f.fast_food}    onChange={v => set('fast_food', v)} />
            <Toggle label="Regular Exercise"    icon="🏃‍♀️" desc="At least 3 times per week" value={f.reg_exercise} onChange={v => set('reg_exercise', v)} />
            <div className="glass" style={{ padding: 18, marginTop: 10, textAlign: 'center', background: `linear-gradient(135deg,${C.pinkLight}66,${C.purpleLight}66)` }}>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                💡 <strong style={{ color: C.text }}>Did you know?</strong> Regular movement reduces PCOS symptoms by up to 50% and greatly improves insulin sensitivity.
              </p>
            </div>
          </>}

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            {step > 0
              ? <button className="btn sec" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>← Back</button>
              : <div style={{ flex: 1 }} />
            }
            {step < STEPS.length - 1
              ? <button className="btn" onClick={next} style={{ flex: 1 }}>Next →</button>
              : <button className="btn" onClick={submit} disabled={loading} style={{ flex: 1 }}>
                  {loading
                    ? <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Analysing…</>
                    : 'Get My Results 🎯'}
                </button>
            }
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: C.muted, marginTop: 14 }}>Step {step + 1} of {STEPS.length} · Not a medical diagnosis</p>
        </div>
      </div>
    </div>
  )
}
