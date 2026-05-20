import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import ViewLanding from './viewLanding/ViewLanding'

function App() {
  
  return (
    <div className="App">
      <ViewLanding />
    </div>  
  )
}

export default App