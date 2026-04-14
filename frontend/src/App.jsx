import { useState } from 'react'
import Particles from './components/Particles'
import Nav       from './components/Nav'
import Landing   from './pages/Landing'
import FormPage  from './pages/FormPage'
import Results   from './pages/Results'
import Awareness from './pages/Awareness'
import Chat      from './pages/Chat'
import { C }     from './tokens'

export default function App() {
  const [page,   setPage]   = useState('home')
  const [result, setResult] = useState(null)

  return (
    <>
      <Particles />
      <Nav page={page} go={setPage} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {page === 'home'      && <Landing   go={setPage} />}
        {page === 'check'     && <FormPage  go={setPage} setResult={setResult} />}
        {page === 'results'   && <Results   result={result} go={setPage} />}
        {page === 'awareness' && <Awareness />}
        {page === 'chat'      && <Chat />}
      </div>

      <footer style={{
        textAlign: 'center', padding: '20px', fontSize: 11, color: C.muted,
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(236,72,153,0.09)',
        background: 'rgba(255,255,255,0.5)',
      }}>
        🌸 BloomCheck — PCOS Awareness & Early Detection · For informational purposes only · Always consult a healthcare professional
      </footer>
    </>
  )
}
