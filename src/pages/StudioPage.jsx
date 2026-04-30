import { useState } from 'react'
import { Film, Image, Wand2, Expand, Layers, Sparkles } from 'lucide-react'
import VideoGenerator from '../components/studio/VideoGenerator'
import ImageGenerator from '../components/studio/ImageGenerator'
import Img2VidGenerator from '../components/studio/Img2VidGenerator'
import ExtendGenerator from '../components/studio/ExtendGenerator'
import ComposeGenerator from '../components/studio/ComposeGenerator'

const TABS = [
  { id: 'video', label: 'Text to Video', icon: Film, badge: 'HOT' },
  { id: 'image', label: 'Text to Image', icon: Image },
  { id: 'img2vid', label: 'Image to Video', icon: Wand2, badge: 'NEW' },
  { id: 'extend', label: 'Outpaint', icon: Expand },
  { id: 'compose', label: 'Multi-Scene', icon: Layers },
]

export default function StudioPage() {
  const [tab, setTab] = useState('video')

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/4 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Tab bar */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-1.5 min-w-max">
            {TABS.map(({ id, label, icon: Icon, badge }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer
                  ${tab === id ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                <Icon size={15} />
                {label}
                {badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${badge === 'HOT' ? 'bg-red-500/80 text-white' : 'bg-cyan-500/80 text-slate-900'}`}>{badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div key={tab} className="animate-fade-up">
          {tab === 'video' && <VideoGenerator />}
          {tab === 'image' && <ImageGenerator />}
          {tab === 'img2vid' && <Img2VidGenerator />}
          {tab === 'extend' && <ExtendGenerator />}
          {tab === 'compose' && <ComposeGenerator />}
        </div>
      </div>
    </div>
  )
}
