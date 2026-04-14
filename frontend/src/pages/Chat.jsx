import { useState, useEffect, useRef } from 'react'
import { C } from '../tokens'

/* ══════════════════════════════════════════════════════
   BLOOM — Simulated PCOS Chatbot (no API key required)
   Keyword-based NLP engine with 16 topic areas.
   Fully offline, instant responses with typing delay.
   ══════════════════════════════════════════════════════ */

const KB = [
  {
    keys: ['symptom', 'sign', 'feel', 'experience', 'notice', 'indicator'],
    reply: `Common PCOS symptoms include 🌸

• Irregular periods — cycles shorter than 21 or longer than 35 days
• Excess hair growth (hirsutism) on face, chest or back
• Acne or oily skin, especially on the jaw and chin
• Scalp hair thinning or hair loss
• Weight gain, particularly around the waist
• Skin darkening on the neck or armpits (acanthosis nigricans)
• Mood swings, anxiety or depression
• Fatigue and low energy levels

Not everyone experiences all symptoms — PCOS looks different for each person. A gynaecologist can give you a proper assessment. 💜`
  },
  {
    keys: ['diet', 'eat', 'food', 'nutrition', 'meal', 'sugar', 'carb', 'glyc'],
    reply: `Diet plays a huge role in managing PCOS 🥗

What to eat more of:
• Low-glycemic foods — oats, legumes, sweet potato, quinoa
• Anti-inflammatory foods — berries, leafy greens, fatty fish, turmeric
• Lean protein at every meal to stabilise blood sugar
• Healthy fats — avocado, olive oil, nuts and seeds

What to limit:
• Refined sugars — fizzy drinks, pastries, white bread
• Processed and fast foods
• High-GI foods that spike insulin quickly

Even small dietary changes can noticeably reduce symptoms. Many people find that reducing sugar alone improves cycle regularity. 🌿`
  },
  {
    keys: ['exercise', 'workout', 'gym', 'sport', 'active', 'fitness', 'walk', 'yoga', 'run'],
    reply: `Exercise is one of the most powerful tools for PCOS 🏃‍♀️

Best types for PCOS:
• Strength training — improves insulin sensitivity and builds muscle
• HIIT — efficient for fat loss and hormone balance
• Yoga — reduces cortisol, helps mood and cycle regularity
• Walking — gentle, sustainable and surprisingly effective

How much?
Aim for 150 minutes of moderate activity per week. Even 30 minutes of daily walking makes a meaningful difference.

Regular movement can reduce PCOS symptoms by up to 50% and is as effective as some medications for insulin resistance. 💪`
  },
  {
    keys: ['fertil', 'pregnant', 'baby', 'conceive', 'ovulat', 'ivf', 'reproduct'],
    reply: `PCOS and fertility 💜

PCOS is the leading cause of female infertility — but that does NOT mean you cannot conceive. Many people with PCOS have healthy pregnancies.

What helps:
• Lifestyle changes (even 5–10% weight loss can restore ovulation)
• Letrozole or Clomiphene to trigger ovulation
• Metformin to improve insulin sensitivity
• IVF if other approaches have not worked

Key fact: Irregular periods do not mean zero fertility — just unpredictable ovulation. OPK tests help track it.

Please consult a reproductive endocrinologist for a personalised plan. You are not alone. 🌸`
  },
  {
    keys: ['diagnos', 'test', 'blood', 'ultrasound', 'scan', 'confirm', 'detect', 'check'],
    reply: `How is PCOS diagnosed? 🔬

Doctors use the Rotterdam Criteria — you need at least 2 of these 3:

1. Irregular or absent ovulation (irregular periods)
2. Elevated androgens — blood tests or physical symptoms
3. Polycystic ovaries — 12+ follicles on ultrasound

Tests your doctor may run:
• Hormonal blood panel: LH, FSH, testosterone, AMH, prolactin
• Fasting glucose and insulin levels
• Pelvic ultrasound
• Thyroid function (to rule out other causes)

If you suspect PCOS, see a gynaecologist and ask specifically about these tests. 💪`
  },
  {
    keys: ['treat', 'medic', 'pill', 'metformin', 'inositol', 'spironolact', 'therapy', 'cure', 'manag'],
    reply: `PCOS treatment options 💊

There is no cure, but PCOS is very manageable. Treatment is personalised to your symptoms.

Hormonal treatments:
• Combined oral contraceptive pill — regulates periods, reduces androgens
• Progestin-only pill — helps cycle regulation

Metabolic treatments:
• Metformin — improves insulin resistance, often first-line
• Inositol (Myo + D-Chiro, 40:1 ratio) — improves insulin sensitivity and fertility

For hair and acne:
• Spironolactone — anti-androgen medication
• Topical retinoids for acne

Lifestyle as treatment:
Diet, exercise and stress management are as effective as medication for many symptoms.

Always consult your doctor before starting any medication. 🌿`
  },
  {
    keys: ['stress', 'mental', 'anxi', 'depress', 'mood', 'emotion', 'overwhelm', 'burnout', 'mind'],
    reply: `PCOS and mental health 🌊

Women with PCOS are 3x more likely to experience anxiety and depression. This is partly hormonal — elevated androgens and insulin resistance directly affect neurotransmitter levels.

What helps:
• Therapy or counselling, especially CBT
• Mindfulness and meditation — even 10 minutes/day reduces cortisol
• Regular sleep — 7–9 hours is non-negotiable for hormonal balance
• Support communities — PCOS groups help enormously
• Gentle movement — yoga and walking have proven mood benefits

You are not defined by your diagnosis. Please reach out to a mental health professional if you are struggling. 💜`
  },
  {
    keys: ['weight', 'bmi', 'fat', 'slim', 'lose', 'gain', 'obese', 'overweight', 'body'],
    reply: `PCOS and weight 💜

Why weight is harder with PCOS:
Insulin resistance (present in ~70% of cases) makes it harder for your body to use glucose efficiently, leading to fat storage — especially around the abdomen.

The good news:
Even a 5–10% reduction in body weight can restore ovulation, improve hormonal balance, reduce acne and excess hair, and lower diabetes risk.

Practical tips:
• Focus on low-GI foods and protein at every meal
• Strength training builds insulin-sensitive muscle tissue
• Do not severely restrict calories — this raises cortisol
• Work with a PCOS-aware dietitian if possible

Remember: PCOS causes weight gain. Be kind to yourself. 🌿`
  },
  {
    keys: ['hair', 'hirsut', 'facial', 'beard', 'shav', 'wax', 'laser', 'bald', 'thin', 'loss'],
    reply: `Hair changes with PCOS 💇

PCOS causes two opposite hair problems due to excess androgens:

Hirsutism (excess body or facial hair):
• Affects ~70% of PCOS cases
• Common on upper lip, chin, chest, abdomen and back
• Treatments: laser hair removal, electrolysis, spironolactone, eflornithine cream

Androgenic alopecia (scalp hair thinning):
• Hair thins at the crown and temples
• Treatments: Minoxidil (topical), anti-androgens, improving insulin resistance

Most effective long-term:
Addressing the underlying androgen excess through medication and lifestyle gives the best results.

Consult a dermatologist alongside your gynaecologist. 🌸`
  },
  {
    keys: ['skin', 'acne', 'dark', 'pigment', 'oily', 'pimpl', 'blackhead', 'patch'],
    reply: `PCOS and skin concerns 🫧

Acne:
PCOS acne is driven by androgens — it tends to appear on the jaw, chin and neck. It is often cystic and does not respond well to standard skincare alone.

Effective treatments:
• Spironolactone (anti-androgen)
• Combined oral contraceptive pill
• Low-GI diet (insulin spikes worsen acne)
• Topical retinoids (prescription)

Acanthosis nigricans (skin darkening):
Dark patches on the neck or armpits are a sign of insulin resistance. Improving insulin sensitivity typically causes this to fade over time.

Oily skin:
Caused by elevated androgens. Treated similarly to acne. 🌿`
  },
  {
    keys: ['sleep', 'tired', 'fatigue', 'energy', 'insomni', 'rest', 'exhaust'],
    reply: `PCOS and sleep 😴

Many people with PCOS experience:
• Fatigue despite adequate sleep (related to insulin resistance)
• Insomnia or disrupted sleep (hormonal fluctuations)
• Sleep apnoea — more common in PCOS, especially at higher BMI

Why sleep matters so much:
Poor sleep raises cortisol → worsens insulin resistance → worsens PCOS. Breaking this cycle matters.

Tips that help:
• Consistent sleep schedule, including weekends
• Avoid screens 1 hour before bed
• Cool, dark room
• No caffeine after 2pm
• Magnesium glycinate at night may help PCOS sleep quality

If you are exhausted despite enough sleep, ask your doctor to check thyroid and iron levels too. 💜`
  },
  {
    keys: ['supplement', 'vitamin', 'omega', 'zinc', 'magnesium', 'inositol', 'spearmint', 'berberine'],
    reply: `Supplements that may help with PCOS 💊

Most evidence-backed:
• Myo-Inositol + D-Chiro Inositol (40:1) — improves insulin sensitivity, ovulation, AMH
• Magnesium — helps with insulin resistance, sleep and mood
• Vitamin D — deficiency is very common in PCOS and worsens symptoms
• Omega-3 fatty acids — reduces inflammation and lowers androgens
• Zinc — helps with acne and hair loss

Emerging evidence:
• Berberine — similar effect to Metformin for insulin resistance
• Spearmint tea — 2 cups/day may reduce androgen levels
• NAC (N-acetyl cysteine) — antioxidant with some ovulation-improving evidence

Always discuss supplements with your doctor before starting. 🌿`
  },
  {
    keys: ['cause', 'reason', 'why', 'origin', 'genetic', 'inherit', 'root', 'trigger'],
    reply: `What causes PCOS? 🔬

PCOS does not have a single cause — it is a complex interplay of:

1. Insulin resistance
The most common underlying issue. Excess insulin stimulates the ovaries to produce androgens.

2. Hormonal imbalance
An elevated LH/FSH ratio disrupts the normal ovulation cycle.

3. Genetics
PCOS strongly runs in families. If your mother or sister has it, your risk is significantly higher.

4. Low-grade inflammation
Chronic inflammation stimulates androgen production.

None of this is your fault. PCOS is a biological condition — not a lifestyle failure. 💜`
  },
  {
    keys: ['what is', 'define', 'explain', 'tell me about', 'overview', 'basics', 'pcos mean', 'what does pcos'],
    reply: `What is PCOS? 🌸

Polycystic Ovary Syndrome (PCOS) is a hormonal disorder affecting approximately 1 in 10 women of reproductive age. It is one of the most common endocrine conditions worldwide.

The three main features (Rotterdam Criteria):
1. Irregular or absent ovulation (irregular periods)
2. Excess androgens (male hormones) causing physical symptoms
3. Polycystic ovaries visible on ultrasound

You only need 2 of the 3 for a diagnosis.

Root causes include insulin resistance, elevated LH/FSH ratio, genetics, and low-grade inflammation.

PCOS is lifelong but very manageable. With the right lifestyle, medical support, and awareness, most people live full, healthy lives. 💜`
  },
  {
    keys: ['hello', 'hi', 'hey', 'hiya', 'howdy', 'morning', 'evening', 'start', 'help', 'begin'],
    reply: `Hello! I am Bloom 🌸 — your PCOS wellness companion.

I can help with:
• Symptoms and what to look out for
• Diet and nutrition advice
• Exercise recommendations
• Treatment and medication info
• Fertility questions
• Mental health and emotional support
• Supplements and lifestyle tips
• Hair, skin and weight concerns

Everything is evidence-based, always free, and I am available any time.

What is on your mind today? 💜`
  },
  {
    keys: ['thank', 'thanks', 'appreciate', 'helpful', 'great', 'amazing', 'wonderful'],
    reply: `You are so welcome! 🌸

Remember — you are not alone in this journey. PCOS affects millions of people, and with the right knowledge and support, it is absolutely manageable.

Is there anything else you would like to know? I am always here to chat. 💜`
  },
]

function getReply(input) {
  const lower = input.toLowerCase().trim()

  for (const entry of KB) {
    if (entry.keys.some(k => lower.includes(k))) return entry.reply
  }

  const words = lower.split(/\s+/)
  for (const entry of KB) {
    for (const key of entry.keys) {
      if (words.some(w => w.length > 3 && key.includes(w))) return entry.reply
    }
  }

  return `That is a great question! 🌸

I may not have a specific answer for that exact phrasing, but here are topics I can help with:

• What is PCOS?          • Symptoms and signs
• Diet and nutrition     • Exercise and fitness
• Diagnosis and testing  • Treatment options
• Fertility              • Mental health support
• Hair and skin          • Weight management
• Supplements            • Causes of PCOS

Try asking about any of those topics — I am here for you! 💜`
}

const SUGG = [
  'What is PCOS?',
  'What are the symptoms?',
  'How does diet help?',
  'Best exercises for PCOS?',
  'Can PCOS affect fertility?',
]

export default function Chat() {
  const [msgs, setMsgs] = useState([{
    role: 'assistant',
    content: "Hi! I am Bloom 🌸 — your PCOS wellness companion.\n\nI am here to answer your questions about PCOS symptoms, diet, exercise, treatment, fertility, mental health, and more. Everything I share is evidence-based and always free — no sign-in needed.\n\nWhat would you like to know today? 💜"
  }])
  const [inp,  setInp]  = useState('')
  const [busy, setBusy] = useState(false)
  const ref = useRef(null)

  useEffect(() => { ref.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = (txt) => {
    const msg = (txt || inp).trim()
    if (!msg || busy) return
    setInp('')
    setMsgs(m => [...m, { role: 'user', content: msg }])
    setBusy(true)
    const reply = getReply(msg)
    const delay = 600 + Math.min(reply.length * 0.5, 900)
    setTimeout(() => {
      setMsgs(m => [...m, { role: 'assistant', content: reply }])
      setBusy(false)
    }, delay)
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div style={{ minHeight: '100vh', padding: '90px 20px 24px', maxWidth: 660, margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, textAlign: 'center', marginBottom: 6, background: `linear-gradient(135deg,${C.pink},${C.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Meet Bloom 🌸</h1>
      <p style={{ textAlign: 'center', color: C.muted, marginBottom: 10, fontSize: 13 }}>Your PCOS wellness companion · Always available · No sign-in needed</p>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 50, background: '#f0fdf4', border: '1px solid #6ee7b744', fontSize: 11, color: '#059669', fontWeight: 500 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          Online · Instant responses
        </span>
      </div>

      {msgs.length < 3 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18, justifyContent: 'center' }}>
          {SUGG.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{ padding: '6px 14px', borderRadius: 50, border: `1px solid ${C.pink}44`, background: C.pinkLight, color: C.pink, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{s}</button>
          ))}
        </div>
      )}

      <div className="glass" style={{ overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ height: 440, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 10, animation: 'fade-up 0.3s ease' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: m.role === 'assistant' ? `linear-gradient(135deg,${C.pink},${C.lavender})` : `linear-gradient(135deg,${C.lavender},${C.mauve})` }}>
                {m.role === 'assistant' ? '🌸' : '👤'}
              </div>
              <div style={{ maxWidth: '78%', padding: '11px 15px', borderRadius: 16, background: m.role === 'assistant' ? 'white' : `linear-gradient(135deg,${C.pinkLight},${C.purpleLight})`, border: `1px solid ${C.border}`, fontSize: 13, lineHeight: 1.8, color: C.text, borderTopLeftRadius: m.role === 'assistant' ? 3 : 16, borderTopRightRadius: m.role === 'user' ? 3 : 16, whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>
            </div>
          ))}
          {busy && (
            <div style={{ display: 'flex', gap: 10, animation: 'fade-up 0.3s ease' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${C.pink},${C.lavender})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌸</div>
              <div style={{ padding: '14px 18px', borderRadius: 16, borderTopLeftRadius: 3, background: 'white', border: `1px solid ${C.border}`, display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: C.pink, animation: `dot-blink 1.2s ease ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={ref} />
        </div>
        <div style={{ padding: '10px 14px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, background: 'rgba(255,255,255,0.9)' }}>
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={handleKey}
            placeholder="Ask Bloom anything about PCOS…"
            style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 50, padding: '10px 18px', fontSize: 13, outline: 'none', fontFamily: "'DM Sans',sans-serif", background: 'white', color: C.text, transition: 'border-color 0.2s' }}
            onFocus={e => (e.target.style.borderColor = C.pink)}
            onBlur={e  => (e.target.style.borderColor = C.border)}
          />
          <button className="btn" onClick={() => send()} disabled={busy || !inp.trim()} style={{ padding: '10px 18px', minWidth: 'auto', borderRadius: 50 }}>
            {busy ? <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : '➤'}
          </button>
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 10, color: C.muted }}>⚠️ For informational purposes only — not a substitute for professional medical advice.</p>
    </div>
  )
}
