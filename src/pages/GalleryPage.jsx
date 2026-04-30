import { useState } from 'react'
import { Film, Image, Search, Trash2, X, Download, ExternalLink, Filter } from 'lucide-react'
import { useGallery } from '../context/GalleryContext'
import Button from '../components/ui/Button'

const FILTERS = ['All', 'Video', 'Image']

export default function GalleryPage() {
  const { items, removeItem, clearAll } = useGallery()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = items.filter(i => {
    const matchType = filter === 'All' || (filter === 'Video' ? i.type === 'video' : i.type === 'image')
    const matchSearch = !search || i.prompt?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const fmt = (iso) => new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">My Gallery</h1>
            <p className="text-slate-500 text-sm mt-0.5">{items.length} saved generation{items.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input placeholder="Search by prompt…" value={search} onChange={e => setSearch(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-blue-500 transition-all w-52" />
            </div>
            <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${filter === f ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{f}</button>
              ))}
            </div>
            {items.length > 0 && <Button variant="danger" size="sm" onClick={() => { if (confirm('Clear all?')) clearAll() }}>Clear All</Button>}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4 animate-float">🎨</div>
            <p className="text-slate-400 font-medium">{items.length === 0 ? 'No generations yet' : 'Nothing matches your filter'}</p>
            <p className="text-slate-600 text-sm mt-1">{items.length === 0 ? 'Go to Studio and create something amazing' : 'Try adjusting your search or filter'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(item => (
              <div key={item.id} className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-slate-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40"
                onClick={() => setSelected(item)}>
                <div className="aspect-video bg-slate-950 overflow-hidden">
                  {item.type === 'video' ? (
                    <video src={item.url} muted loop className="w-full h-full object-cover"
                      onMouseEnter={e => e.target.play()} onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0 }} />
                  ) : (
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 left-2">
                  <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${item.type === 'video' ? 'bg-blue-600/80 text-white' : 'bg-purple-600/80 text-white'}`}>
                    {item.type === 'video' ? <Film size={9} /> : <Image size={9} />}
                    {item.type}
                  </span>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); removeItem(item.id) }}
                    className="w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all cursor-pointer">
                    <X size={11} />
                  </button>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{item.prompt}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] font-mono text-slate-600">{item.model}</span>
                    <span className="text-[10px] text-slate-600">{fmt(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {selected.type === 'video' ? <Film size={15} className="text-blue-400" /> : <Image size={15} className="text-purple-400" />}
                <span className="text-sm font-semibold text-white capitalize">{selected.type}</span>
                <span className="text-xs text-slate-500">— {selected.model}</span>
              </div>
              <div className="flex items-center gap-2">
                {selected.directUrl && <Button variant="ghost" size="sm" onClick={() => window.open(selected.directUrl, '_blank')}><ExternalLink size={13} />Original</Button>}
                <button onClick={() => { const a = document.createElement('a'); a.href = selected.url; a.download = `visioai-${selected.id}.${selected.type === 'video' ? 'mp4' : 'jpg'}`; a.click() }}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"><Download size={16} /></button>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"><X size={16} /></button>
              </div>
            </div>
            <div className="bg-slate-950 flex items-center justify-center max-h-[65vh]">
              {selected.type === 'video'
                ? <video src={selected.url} controls autoPlay loop playsInline className="max-h-[65vh] w-full object-contain" />
                : <img src={selected.url} alt={selected.prompt} className="max-h-[65vh] w-full object-contain" />}
            </div>
            {selected.prompt && (
              <div className="p-4">
                <p className="text-xs text-slate-500 mb-1">PROMPT</p>
                <p className="text-sm text-slate-300">{selected.prompt}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
