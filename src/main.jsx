import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './providers/AppProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </AppProvider>
  </StrictMode>,
)
