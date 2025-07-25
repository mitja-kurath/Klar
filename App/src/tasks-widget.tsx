import React from 'react'
import ReactDOM from 'react-dom/client'
import { TasksWidgetApp } from './components/widgets/TasksWidgetApp'
import { StandaloneThemeProvider } from './contexts/StandaloneThemeContext'
import './App.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StandaloneThemeProvider>
      <TasksWidgetApp />
    </StandaloneThemeProvider>
  </React.StrictMode>,
)



