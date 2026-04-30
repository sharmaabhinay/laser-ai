import { useState } from 'react'
import { User, Key, Shield, Bell, Palette, LogOut, Save, Eye, EyeOff, ExternalLink, Image, Film, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useGallery } from '../context/GalleryContext'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export default function ProfilePage({ setPage }) {
  const { user, logout, apiKey, saveApiKey } = useAuth()
  const { items } = useGallery()
  const [tab, setTab] = useState('profile')
  const [keyInput, setKeyInput] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)
  const [keySaved, setKeySaved] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-slate-300 font-semibold mb-3">Sign in to view your profile</p>
          <Button variant="primary" onClick={() => setPage('login')}>Sign In</Button>
        </div>
      </div>
    )
  }

  const handleSaveKey = () => {
    saveApiKey(keyInput.trim())
    setKeySaved(true); setTimeout(() => setKeySaved(false), 2000)
  }

  const imageCount = items.filter(i => i.type === 'image').length
  const videoCount = items.filter(i => i.type === 'video').length
  const joinedDate = new Date(user.joined).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api', label: 'API Key', icon: Key },
    { id: 'stats', label: 'Stats', icon: Palette },
  ]

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-blue-500/30 shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white">{user.name}</h1>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="blue">Free Plan</Badge>
              <Badge variant="green">{user.credits} credits remaining</Badge>
              <span className="text-xs text-slate-600 flex items-center gap-1"><Clock size={10} />Joined {joinedDate}</span>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={() => { logout(); setPage('studio') }}>
            <LogOut size={14} />Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-5">
          {/* Sidebar */}
          <div className="flex sm:flex-col gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer flex-1 sm:flex-none ${tab === id ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            {tab === 'profile' && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-white">Profile Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ label: 'Full Name', value: user.name }, { label: 'Email', value: user.email }, { label: 'Plan', value: 'Free' }, { label: 'Credits', value: `${user.credits} remaining` }].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm text-slate-200 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl text-sm text-blue-300">
                  <p className="font-semibold mb-1">🚀 Upgrade to Pro</p>
                  <p className="text-blue-400/70 text-xs">Unlock video generation, more credits, and priority processing.</p>
                  <button onClick={() => setPage('pricing')} className="mt-2 text-xs underline text-blue-300 hover:text-blue-200 cursor-pointer">View Plans →</button>
                </div>
              </div>
            )}

            {tab === 'api' && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-white">Pollinations API Key</h2>
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                  <p className="text-sm font-semibold text-amber-300">🔑 Why you need an API key</p>
                  <p className="text-xs text-amber-400/70">An API key unlocks real video generation (Seedance, Wan, LTX-2) and removes rate limits on image generation. Get a free publishable key at enter.pollinations.ai.</p>
                  <a href="https://enter.pollinations.ai" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-300 underline hover:text-amber-200">
                    Get your free API key <ExternalLink size={10} />
                  </a>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Publishable API Key (pk_...)</label>
                  <div className="relative">
                    <input type={showKey ? 'text' : 'password'} placeholder="pk_xxxxxxxxxxxxxxxx"
                      value={keyInput} onChange={e => setKeyInput(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-4 py-3 pr-12 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono" />
                    <button type="button" onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer">
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">Only use publishable keys (pk_) — never secret keys in browser apps</p>
                </div>
                <Button variant={keySaved ? 'outline' : 'primary'} onClick={handleSaveKey} disabled={!keyInput.trim()}>
                  <Save size={14} />{keySaved ? 'Saved!' : 'Save API Key'}
                </Button>
                {apiKey && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                    ✓ API key is set — video generation is enabled
                  </div>
                )}
              </div>
            )}

            {tab === 'stats' && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-white">Your Stats</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Images Generated', value: imageCount, icon: '🖼', color: 'blue' },
                    { label: 'Videos Generated', value: videoCount, icon: '🎬', color: 'purple' },
                    { label: 'Total Saved', value: items.length, icon: '💾', color: 'green' },
                    { label: 'Credits Used', value: 50 - user.credits, icon: '⚡', color: 'amber' },
                    { label: 'Credits Left', value: user.credits, icon: '🎯', color: 'cyan' },
                    { label: 'Plan', value: 'Free', icon: '🌟', color: 'slate' },
                  ].map(({ label, value, icon, color }) => (
                    <div key={label} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className="text-xl font-black text-white">{value}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Activity</p>
                  {items.slice(0, 5).length === 0 ? (
                    <p className="text-xs text-slate-600 italic">No activity yet — start generating!</p>
                  ) : (
                    <div className="space-y-2">
                      {items.slice(0, 5).map(item => (
                        <div key={item.id} className="flex items-center gap-2.5 text-xs">
                          <span>{item.type === 'video' ? '🎬' : '🖼'}</span>
                          <span className="flex-1 text-slate-400 truncate">{item.prompt}</span>
                          <span className="text-slate-600 shrink-0">{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
