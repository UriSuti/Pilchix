import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { NavLoadingProvider } from './context/NavLoadingContext.jsx'
import App from './App.jsx'
import './index.css'
import { MarcaAuthProvider } from './context/MarcaAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MarcaAuthProvider>
          <ToastProvider>
            <NavLoadingProvider>
              <App />
            </NavLoadingProvider>
          </ToastProvider>
        </MarcaAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)