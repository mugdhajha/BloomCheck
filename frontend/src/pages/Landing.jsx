import { C } from '../tokens'

const stats = [
  { n: '1 in 10', d: 'women globally' },
  { n: '70%',     d: 'go undiagnosed' },
  { n: '#1',      d: 'infertility cause' },
  { n: '50%',     d: 'risk reduction with lifestyle' },
]

const howIt = [
  { e: '📋', t: 'Tell us about you',  d: 'Age, height, weight and a few visible symptom questions.' },
  { e: '🤖', t: 'AI Analysis',        d: 'Our model evaluates your inputs against known PCOS patterns.' },
  { e: '📊', t: 'Get Results',        d: 'Personalised risk score, key factors and recommendations.' },
]

export default function Landing({ go }) {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 80 }}>
      {/* Hero */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '60px 20px 48px', position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: 90, marginBottom: 24, animation: 'float 5s ease-in-out infinite', filter: 'drop-shadow(0 8px 20px rgba(236,72,153,0.3))' }}>🌸</div>
        <div style={{ display: 'inline-block', padding: '5px 18px', borderRadius: 50, background: C.pinkLight, color: C.pink, fontSize: 12, fontWeight: 600, letterSpacing: '0.4px', marginBottom: 16 }}>
          PCOS Early Detection & Awareness
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px,6vw,62px)', fontWeight: 700, lineHeight: 1.12, marginBottom: 20,
          background: `linear-gradient(135deg,${C.rose},${C.pink},${C.lavender})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Understand Your Body.<br />Detect PCOS Early.
        </h1>
        <p style={{ fontSize: 16, color: C.muted, maxWidth: 500, lineHeight: 1.75, marginBottom: 36 }}>
          Answer a few questions about your health and visible symptoms. Get a personalised PCOS risk assessment in under 2 minutes.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn" onClick={() => go('check')} style={{ fontSize: 16, padding: '14px 36px' }}>🌺 Check Your Risk</button>
          <button className="btn sec" onClick={() => go('awareness')}>📖 Learn About PCOS</button>
        </div>
        <p style={{ marginTop: 14, fontSize: 11, color: C.muted }}>🔒 100% private · No data stored · Not a medical diagnosis</p>
      </section>

      {/* Stats */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 16, padding: '0 24px 48px', maxWidth: 820, margin: '0 auto', zIndex: 1, position: 'relative' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass" style={{ padding: '22px', textAlign: 'center', animation: `fade-up 0.5s ease ${i * 0.1}s both` }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, background: `linear-gradient(135deg,${C.pink},${C.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>{s.d}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 72px', zIndex: 1, position: 'relative' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, textAlign: 'center', marginBottom: 34, background: `linear-gradient(135deg,${C.pink},${C.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          {howIt.map((s, i) => (
            <div key={i} className="glass" style={{ padding: '24px', textAlign: 'center', animation: `fade-up 0.5s ease ${0.2 + i * 0.1}s both` }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{s.e}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, marginBottom: 8 }}>{s.t}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
