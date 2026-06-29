import AnimatedBackground from './components/AnimatedBackground'
import { ToastProvider } from './components/Toast'
import MainPage from './pages/MainPage'

export default function App() {
  return (
    <ToastProvider>
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <MainPage />
      </div>
    </ToastProvider>
  )
}
