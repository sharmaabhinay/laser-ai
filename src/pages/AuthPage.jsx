import { useState } from 'react'
import { Sparkles, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function AuthPage({ mode = 'login', setPage }) {
  const { login, signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const isLogin = mode === 'login'

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!isLogin && !form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (!isLogin && form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate(); setErrors(e)
    if (Object.keys(e).length) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const res = isLogin ? login(form.email, form.password) : signup(form.name, form.email, form.password)
    if (res.error) { setErrors({ submit: res.error }); setLoading(false) }
    else setPage('studio')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="font-black text-2xl text-white">Visio<span className="text-cyan-400">AI</span></span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="text-slate-400 text-sm">{isLogin ? 'Sign in to access your studio' : 'Start generating AI videos & images for free'}</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                </div>
                {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
              </div>
            )}

            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">{errors.submit}</div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setPage(isLogin ? 'signup' : 'login')} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer">
              {isLogin ? 'Sign Up Free' : 'Sign In'}
            </button>
          </div>

          {!isLogin && (
            <p className="mt-3 text-center text-xs text-slate-600">
              By signing up you agree to our Terms of Service and Privacy Policy
            </p>
          )}
        </div>

        <div className="mt-4 text-center">
          <button onClick={() => setPage('studio')} className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
            Continue without account →
          </button>
        </div>
      </div>
    </div>
  )
}
