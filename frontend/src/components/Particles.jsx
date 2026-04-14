import { useMemo } from 'react'
import { C } from '../tokens'

export default function Particles() {
  const ps = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 25 + Math.random() * 65,
    sz: 3 + Math.random() * 7,
    del: Math.random() * 5,
    dur: 4 + Math.random() * 4,
    color: [C.pink, C.lavender, C.mauve, '#fb7185', C.pinkLight][~~(Math.random() * 5)],
  })), [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {ps.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.sz, height: p.sz, borderRadius: '50%',
          background: p.color, opacity: 0.45,
          animation: `particle ${p.dur}s ease ${p.del}s infinite`,
        }} />
      ))}
    </div>
  )
}
