import { C } from '../tokens'

const symptoms = [
  { e: '📅', t: 'Irregular Periods',    d: 'Cycles shorter than 21 or longer than 35 days, or missed periods entirely.' },
  { e: '⚗️', t: 'Elevated Androgens',  d: 'Excess male hormones cause hirsutism, jaw acne, and scalp hair thinning.' },
  { e: '🔬', t: 'Polycystic Ovaries',  d: '12+ immature follicles visible on ultrasound — gives PCOS its name.' },
  { e: '⚖️', t: 'Weight Changes',      d: 'Insulin resistance makes weight management harder. Even 5% loss helps.' },
  { e: '🍬', t: 'Insulin Resistance',  d: 'Up to 70% of PCOS cases involve insulin resistance, raising diabetes risk.' },
  { e: '😔', t: 'Mental Health',       d: 'PCOS raises risk of anxiety and depression — hormones directly affect mood.' },
]

const tips = [
  { e: '🥗', t: 'Anti-inflammatory Diet',  d: 'Leafy greens, berries, whole grains, omega-3s. Limit refined sugars.' },
  { e: '🏃‍♀️', t: 'Regular Exercise',      d: '150 min/week of moderate activity. HIIT and strength training boost insulin sensitivity.' },
  { e: '😴', t: 'Prioritise Sleep',        d: '7–9 hours is essential. Poor sleep worsens insulin resistance significantly.' },
  { e: '🧘', t: 'Stress Management',       d: 'Chronic stress elevates cortisol, disrupting hormonal balance. Try yoga or therapy.' },
  { e: '💊', t: 'Medical Support',         d: 'Hormonal contraceptives, Metformin, and Inositol are common effective treatments.' },
  { e: '👥', t: 'Community',               d: 'Connect with others who have PCOS. Shared experiences really help with management.' },
]

export default function Awareness() {
  const gradText = { background: `linear-gradient(135deg,${C.pink},${C.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }

  return (
    <div style={{ minHeight: '100vh', padding: '90px 20px 50px', maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, textAlign: 'center', marginBottom: 10, background: `linear-gradient(135deg,${C.rose},${C.pink},${C.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Understanding PCOS</h1>
      <p style={{ textAlign: 'center', color: C.muted, fontSize: 15, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>Polycystic Ovary Syndrome — complex, common, and very manageable with the right knowledge.</p>

      {/* What is PCOS */}
      <div className="glass" style={{ padding: '28px', marginBottom: 28, animation: 'fade-up 0.5s ease' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 14, color: C.pink }}>🌺 What is PCOS?</h2>
        <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, marginBottom: 10 }}>
          PCOS is a hormonal disorder affecting approximately <strong>1 in 10 women</strong> of reproductive age. It involves a complex interaction of genetic, hormonal, and environmental factors that disrupt the normal menstrual cycle.
        </p>
        <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8 }}>
          It's characterised by excess androgen production, irregular ovulation, and often polycystic ovarian morphology visible on ultrasound — though you don't need all three criteria for a diagnosis.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 18, flexWrap: 'wrap' }}>
          {[{ n: '10%', d: 'of women affected' }, { n: '70%', d: 'go undiagnosed' }, { n: '50%+', d: 'have insulin resistance' }].map((s, i) => (
            <div key={i} style={{ flex: 1, minWidth: 110, padding: '14px', borderRadius: 12, textAlign: 'center', background: `linear-gradient(135deg,${C.pinkLight},${C.purpleLight})` }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: C.pink }}>{s.n}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 16, ...gradText }}>🩺 Signs & Symptoms</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14, marginBottom: 30 }}>
        {symptoms.map((s, i) => (
          <div key={i} className="glass" style={{ padding: '20px', animation: `fade-up 0.5s ease ${i * 0.07}s both` }}>
            <div style={{ fontSize: 26, marginBottom: 9 }}>{s.e}</div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 7 }}>{s.t}</h3>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>{s.d}</p>
          </div>
        ))}
      </div>

      {/* Prevention */}
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 16, ...gradText }}>🌿 Management & Prevention</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14, marginBottom: 28 }}>
        {tips.map((s, i) => (
          <div key={i} className="glass" style={{ padding: '20px', borderTop: `3px solid ${C.lavender}`, animation: `fade-up 0.5s ease ${i * 0.07}s both` }}>
            <div style={{ fontSize: 26, marginBottom: 9 }}>{s.e}</div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 7 }}>{s.t}</h3>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>{s.d}</p>
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: '24px', textAlign: 'center', background: `linear-gradient(135deg,${C.pinkLight}88,${C.purpleLight}88)` }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: C.text, marginBottom: 8 }}>"PCOS is not a sentence — it's a starting point."</p>
        <p style={{ fontSize: 13, color: C.muted }}>With the right support, lifestyle changes, and medical guidance, most people with PCOS live full, healthy lives.</p>
      </div>
    </div>
  )
}
