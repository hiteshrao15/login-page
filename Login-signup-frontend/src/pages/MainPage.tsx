import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchDashboard } from '../api/axios'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'register'

export default function MainPage() {
  const { isAuthenticated, login, register, logout } = useAuth()
  const { showToast } = useToast()

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dashboardMsg, setDashboardMsg] = useState('')
  const [dashboardLoading, setDashboardLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setDashboardMsg('')
      return
    }

    setDashboardLoading(true)
    fetchDashboard()
      .then((res) => setDashboardMsg(res.data.msg))
      .catch(() => setDashboardMsg('Failed to load dashboard'))
      .finally(() => setDashboardLoading(false))
  }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      showToast('Please fill in all fields', 'error')
      return
    }

    setLoading(true)
    try {
      const message =
        mode === 'login'
          ? await login(email, password)
          : await register(email, password)
      showToast(message, 'success')
      setPassword('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    setEmail('')
    setPassword('')
    showToast('Logged out successfully', 'success')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-violet-600/40 via-cyan-500/30 to-pink-500/40 blur-xl" />

        <div className="glass-strong relative overflow-hidden rounded-[26px] p-8 shadow-2xl">
          <motion.div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          <div className="relative mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.15 }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/30"
            >
              <Sparkles className="h-7 w-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">
              Nova<span className="animated-gradient-text">Auth</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">
              {isAuthenticated
                ? 'You are signed in — welcome to your space'
                : 'Login or create an account to continue'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isAuthenticated ? (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.35 }}
              >
                <div className="relative mb-8 flex rounded-2xl bg-white/5 p-1">
                  {(['login', 'register'] as Mode[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMode(tab)}
                      className="relative flex-1 rounded-xl py-2.5 text-sm font-semibold capitalize transition-colors"
                    >
                      {mode === tab && (
                        <motion.span
                          layoutId="auth-tab"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 shadow-lg shadow-violet-500/30"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span
                        className={`relative z-10 flex items-center justify-center gap-2 ${
                          mode === tab ? 'text-white' : 'text-white/50 hover:text-white/80'
                        }`}
                      >
                        {tab === 'login' ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5" />
                        )}
                        {tab}
                      </span>
                    </button>
                  ))}
                </div>

                <motion.form
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="input-glow rounded-2xl bg-white/5 transition-all duration-300">
                    <label className="flex items-center gap-3 px-4 py-3.5">
                      <Mail className="h-5 w-5 shrink-0 text-violet-400" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                        autoComplete="email"
                      />
                    </label>
                  </div>

                  <div className="input-glow rounded-2xl bg-white/5 transition-all duration-300">
                    <label className="flex items-center gap-3 px-4 py-3.5">
                      <Lock className="h-5 w-5 shrink-0 text-cyan-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-white/40 transition hover:text-white/70"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="btn-shimmer group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-violet-500 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {mode === 'login' ? 'Sign in' : 'Create account'}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="grid grid-cols-3 gap-3"
                >
                  {[
                    { icon: ShieldCheck, label: 'Auth', value: 'Active', color: 'text-emerald-400' },
                    { icon: Activity, label: 'Token', value: 'JWT', color: 'text-cyan-400' },
                    { icon: CheckCircle2, label: 'Access', value: 'OK', color: 'text-violet-400' },
                  ].map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                        className="glass rounded-xl p-3 text-center"
                      >
                        <Icon className={`mx-auto mb-1.5 h-5 w-5 ${stat.color}`} />
                        <p className="text-[10px] uppercase tracking-wide text-white/40">
                          {stat.label}
                        </p>
                        <p className="text-sm font-bold text-white">{stat.value}</p>
                      </motion.div>
                    )
                  })}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, type: 'spring' }}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5"
                >
                  {dashboardLoading ? (
                    <div className="flex items-center gap-3 text-white/50">
                      <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                      <span className="text-sm">Loading dashboard...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-emerald-300/70">Backend response</p>
                      <p className="mt-1 text-xl font-bold text-white">{dashboardMsg}</p>
                    </>
                  )}
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 py-3.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
