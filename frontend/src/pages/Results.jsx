import { useEffect, useState } from 'react'
import { C } from '../tokens'

function RiskRing({ pct, color }) {
  const r = 76, circ = 2 * Math.PI * r
  const [disp, setDisp] = useState(0)

  useEffect(() => {
    let start = null
    const tick = ts => {
      if (!start) start = ts
      const p = Math.min(1, (ts - start) / 1500)
      setDisp(Math.round(pct * p * 10) / 10)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [pct])

  return (
    <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
      {[1, 2].map(i => (
        <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${color}44`, animation: `pulse-ring 2.2s ease ${i * 0.6}s infinite` }} />
      ))}
      <svg width={200} height={200} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={100} cy={100} r={r} fill="none" stroke="#f0e4f4" strokeWidth={13} />
        <circle cx={100} cy={100} r={r} fill="none" stroke={color} strokeWidth={13}
          strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 700, color, animation: 'count-up 0.8s ease' }}>{disp}%</span>
        <span style={{ fontSize: 11, color: C.muted }}>Risk Score</span>
      </div>
    </div>
  )
}

function Bar({ label, pct, color, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => { setTimeout(() => setW(pct), 150 + delay) }, [])
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 12, color: C.text }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>{pct}%</span>
      </div>
      <div style={{ height: 7, background: '#f0e4f4', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg,${color},${C.lavender})`, width: `${w}%`, transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${delay}ms` }} />
      </div>
    </div>
  )
}

const gData = [
  { r: 'South Asia', v: 22 }, { r: 'Middle East', v: 18 },
  { r: 'N. America', v: 15 }, { r: 'Europe', v: 12 },
  { r: 'East Asia',  v: 8  }, { r: 'Global Avg', v: 10 },
]
const lData = [
  { f: 'Sedentary',     v: 78 }, { f: 'High Sugar',    v: 72 },
  { f: 'Poor Sleep',    v: 65 }, { f: 'High Stress',   v: 60 },
  { f: 'Active',        v: 25 }, { f: 'Balanced Diet', v: 20 },
]

export default function Results({ result, go }) {
  if (!result) return (
    <div style={{ paddingTop: 140, textAlign: 'center' }}>
      <p style={{ color: C.muted, marginBottom: 20 }}>No results yet.</p>
      <button className="btn" onClick={() => go('check')}>Check Your Risk</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '90px 20px 50px', maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, textAlign: 'center', marginBottom: 7, background: `linear-gradient(135deg,${C.pink},${C.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Results</h1>
      <p style={{ textAlign: 'center', color: C.muted, marginBottom: 36, fontSize: 13 }}>🔒 Not a medical diagnosis · Please consult a healthcare professional</p>

      {/* Ring card */}
      <div className="glass" style={{ padding: '36px 28px', textAlign: 'center', marginBottom: 20, animation: 'fade-up 0.5s ease' }}>
        <RiskRing pct={result.probability} color={result.color} />
        <div style={{ display: 'inline-block', marginTop: 18, padding: '7px 26px', borderRadius: 50, background: result.color + '22', color: result.color, fontWeight: 700, fontSize: 17 }}>
          {result.emoji} {result.label}
        </div>
        <p style={{ color: C.muted, fontSize: 14, maxWidth: 440, margin: '14px auto 0', lineHeight: 1.7 }}>{result.message}</p>
      </div>

      {/* Factors + suggestions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18, marginBottom: 20 }}>
        <div className="glass" style={{ padding: '24px', animation: 'fade-up 0.5s ease 0.1s both' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 16, background: `linear-gradient(135deg,${C.pink},${C.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔍 Key Factors</h3>
          {(result.key_factors || []).length
            ? result.key_factors.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8, padding: '9px 12px', borderRadius: 11, background: f.impact === 'increases' ? '#fff0f5' : '#f0faf5', border: `1px solid ${f.impact === 'increases' ? C.pink + '33' : C.mint + '33'}` }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: f.impact === 'increases' ? C.rose : C.mint }}>{f.impact === 'increases' ? '↑' : '↓'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{f.feature}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{f.value}</div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: f.impact === 'increases' ? C.pink : '#059669', background: f.impact === 'increases' ? C.pinkLight : '#ecfdf5', padding: '2px 9px', borderRadius: 50 }}>
                  {f.impact === 'increases' ? 'Risk ↑' : 'Risk ↓'}
                </div>
              </div>
            ))
            : <p style={{ fontSize: 13, color: C.muted }}>No dominant individual factors detected.</p>
          }
        </div>

        <div className="glass" style={{ padding: '24px', animation: 'fade-up 0.5s ease 0.2s both' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, marginBottom: 16, background: `linear-gradient(135deg,${C.pink},${C.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>💡 Recommendations</h3>
          {(result.suggestions || []).map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, marginBottom: 9, padding: '9px 12px', borderRadius: 11, background: C.purpleLight, border: `1px solid ${C.lavender}33` }}>
              <span style={{ color: C.lavender, fontWeight: 700, flexShrink: 0 }}>✦</span>
              <span style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18, marginBottom: 28 }}>
        <div className="glass" style={{ padding: '24px', animation: 'fade-up 0.5s ease 0.3s both' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 16, color: C.text }}>🌍 Global Prevalence (%)</h3>
          {gData.map((d, i) => <Bar key={i} label={d.r} pct={d.v} color={C.pink} delay={i * 70} />)}
        </div>
        <div className="glass" style={{ padding: '24px', animation: 'fade-up 0.5s ease 0.4s both' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, marginBottom: 16, color: C.text }}>🏃 Lifestyle vs Risk (%)</h3>
          {lData.map((d, i) => <Bar key={i} label={d.f} pct={d.v} color={d.v > 50 ? C.rose : C.mint} delay={i * 70} />)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn sec" onClick={() => go('check')}>🔄 Recheck</button>
        <button className="btn" onClick={() => go('awareness')}>📖 Learn About PCOS</button>
        <button className="btn sec" onClick={() => go('chat')}>💬 Ask AI</button>
      </div>
    </div>
  )
}
