import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import ViewLocal from './viewLocal/viewLocal'

function App() {
  
  return (
    <ViewLocal/>
  )
}

export default App