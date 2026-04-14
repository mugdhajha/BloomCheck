import { C } from '../tokens'

const links = [
  { id: 'home',      label: 'Home' },
  { id: 'check',     label: 'Check Risk' },
  { id: 'awareness', label: 'Awareness' },
  { id: 'chat',      label: 'AI Chat' },
]

export default function Nav({ page, go }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 28px',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(236,72,153,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
           onClick={() => go('home')}>
        <span style={{ fontSize: 22 }}>🌸</span>
        <span style={{
          fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700,
          background: `linear-gradient(135deg,${C.pink},${C.lavender})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>BloomCheck</span>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {links.map(l => (
          <button key={l.id} onClick={() => go(l.id)} style={{
            padding: '7px 16px', border: 'none', borderRadius: 50,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.2s',
            background: page === l.id
              ? `linear-gradient(135deg,${C.pink},${C.lavender})`
              : 'transparent',
            color: page === l.id ? 'white' : C.muted,
          }}>{l.label}</button>
        ))}
      </div>
    </nav>
  )
}
