import { useState } from 'react'
import { Sparkles, Menu, X, Key, LogOut, User, Image, Film, Library, Zap, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useGallery } from '../../context/GalleryContext'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { Input } from '../ui/Input'
import Badge from '../ui/Badge'

export default function Navbar({ page, setPage }) {
  const { user, logout, apiKey, saveApiKey } = useAuth()
  const { items } = useGallery()
  const [menuOpen, setMenuOpen] = useState(false)
  const [keyModal, setKeyModal] = useState(false)
  const [keyInput, setKeyInput] = useState(apiKey)
  const [userMenu, setUserMenu] = useState(false)

  const navItems = [
    { id: 'studio', label: 'Studio', icon: Sparkles },
    { id: 'gallery', label: 'Gallery', icon: Library, badge: items.length || null },
    { id: 'pricing', label: 'Pricing', icon: Zap },
  ]

  const handleSaveKey = () => {
    saveApiKey(keyInput.trim())
    setKeyModal(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={() => setPage('studio')} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-black text-lg text-white tracking-tight">Visio<span className="text-cyan-400">AI</span></span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon, badge }) => (
              <button key={id} onClick={() => setPage(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${page === id ? 'bg-blue-600/20 text-blue-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                <Icon size={15} />
                {label}
                {badge ? <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center">{badge > 99 ? '99+' : badge}</span> : null}
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button onClick={() => setKeyModal(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer
              bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20">
              <Key size={12} />
              {apiKey ? 'API Key ✓' : 'Add API Key'}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white">{user.avatar}</div>
                  <span className="hidden md:block text-sm text-slate-200 font-medium max-w-24 truncate">{user.name.split(' ')[0]}</span>
                  <Badge variant="green">{user.credits} credits</Badge>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => { setPage('profile'); setUserMenu(false) }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all cursor-pointer">
                      <User size={14} />Profile
                    </button>
                    <button onClick={() => { setKeyModal(true); setUserMenu(false) }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all cursor-pointer">
                      <Key size={14} />API Key
                    </button>
                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button onClick={() => { logout(); setUserMenu(false) }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
                        <LogOut size={14} />Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setPage('login')}>Sign In</Button>
                <Button variant="primary" size="sm" onClick={() => setPage('signup')}>Get Started</Button>
              </div>
            )}

            <button className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-950 border-b border-slate-800 p-4 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setPage(id); setMenuOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${page === id ? 'bg-blue-600/20 text-blue-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                <Icon size={16} />{label}
              </button>
            ))}
            <button onClick={() => { setKeyModal(true); setMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer">
              <Key size={16} />{apiKey ? 'Change API Key' : 'Add API Key'}
            </button>
            {!user && (
              <div className="pt-2 flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setPage('login'); setMenuOpen(false) }}>Sign In</Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => { setPage('signup'); setMenuOpen(false) }}>Sign Up</Button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* API Key Modal */}
      <Modal open={keyModal} onClose={() => setKeyModal(false)} title="Pollinations API Key">
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-300 space-y-1">
            <p className="font-semibold">🔑 Why add an API key?</p>
            <p className="text-amber-400/80">An API key unlocks <strong>real video generation</strong> using Seedance, Wan, LTX-2, and more models. Without it, only image generation works.</p>
            <a href="https://enter.pollinations.ai" target="_blank" rel="noreferrer" className="inline-block mt-1 underline text-amber-300 hover:text-amber-200">Get your free key at enter.pollinations.ai →</a>
          </div>
          <Input label="Publishable API Key (pk_...)" placeholder="pk_xxxxxxxxxxxxxxxx" value={keyInput} onChange={e => setKeyInput(e.target.value)}
            hint="Use a publishable key (pk_) — never secret keys (sk_) in browser apps" />
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setKeyModal(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={handleSaveKey}>Save Key</Button>
          </div>
        </div>
      </Modal>

      {/* Overlay for user menu */}
      {userMenu && <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />}
    </>
  )
}
