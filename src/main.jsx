import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { TemplateurlProvider } from './context/Templateurl';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TemplateurlProvider>
    <BrowserRouter>
    
        <App />
    
     </BrowserRouter>
  </TemplateurlProvider>
  </StrictMode>,
)
