import './App.css'
import { Routes, Route } from 'react-router-dom'
import ViewLanding from './viewLanding/ViewLanding.jsx'
import ViewLocal from './viewLocal/viewLocal.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ViewLanding />} />
      <Route path="/:storeSlug" element={<ViewLocal />} />
    </Routes>
  )
}

export default App