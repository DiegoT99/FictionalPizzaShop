import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CheckoutSuccess from './pages/CheckoutSuccess.jsx'
import CheckoutCancel from './pages/CheckoutCancel.jsx'

function RouteEntry() {
  const pathname = window.location.pathname

  if (pathname === '/checkout/success') {
    return <CheckoutSuccess />
  }

  if (pathname === '/checkout/cancel') {
    return <CheckoutCancel />
  }

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouteEntry />
  </StrictMode>,
)
