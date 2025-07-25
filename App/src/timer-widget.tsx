import React from 'react'
import ReactDOM from 'react-dom/client'
import { TimerWidgetApp } from './components/widgets/TimerWidgetApp'
import { StandaloneThemeProvider } from './contexts/StandaloneThemeContext'
import './App.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StandaloneThemeProvider>
      <TimerWidgetApp />
    </StandaloneThemeProvider>
  </React.StrictMode>,
)



