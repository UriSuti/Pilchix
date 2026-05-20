import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import ViewLocal from './viewLocal/ViewLocal'
import ViewLanding from './viewLanding/ViewLanding'

function App() {

  const [local, setLocal] = useState(8);

  return (
    <ViewLocal local={local} />
  )
}

export default App