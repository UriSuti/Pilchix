import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import ViewLocal from './viewLocal/ViewLocal'
import ViewLanding from './viewLanding/ViewLanding'

function App() {

  const [local, setLocal] = useState(null);


  return (
    local !== null? <ViewLocal local={local} /> : <ViewLanding local={local} setLocal={setLocal} />
    
  )
}

export default App