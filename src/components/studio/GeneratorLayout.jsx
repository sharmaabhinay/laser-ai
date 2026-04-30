import { Download, RefreshCw, ExternalLink, Save, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useGallery } from '../../context/GalleryContext'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export function GeneratorLayout({ controls, outputTitle, result, loading, loadingMsg, error, onRegenerate, meta }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">
      {/* Controls */}
      <div className="space-y-4">{controls}</div>
      {/* Output */}
      <div className="lg:sticky lg:top-24 self-start space-y-4">
        <OutputPanel title={outputTitle || 'Output'} result={result} loading={loading} loadingMsg={loadingMsg} error={error} onRegenerate={onRegenerate} meta={meta} />
      </div>
    </div>
  )
}

export function OutputPanel({ title, result, loading, loadingMsg, error, onRegenerate, meta }) {
  const { addItem } = useGallery()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!result) return
    addItem({ type: result.type, url: result.url, directUrl: result.directUrl, prompt: result.prompt, model: result.model, aspectRatio: result.aspectRatio })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const handleDownload = () => {
    if (!result?.url) return
    const a = document.createElement('a')
    a.href = result.url
    a.download = `visioai-${result.type}-${Date.now()}.${result.type === 'video' ? 'mp4' : 'jpg'}`
    a.click()
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">{title}</span>
        {result && <Badge variant={result.type === 'video' ? 'blue' : 'purple'}>{result.type === 'video' ? '🎬 Video' : '🖼 Image'}</Badge>}
      </div>
      <div className="p-4">
        {/* Media area */}
        <div className="rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center relative">
          {loading && <LoadingState msg={loadingMsg} />}
          {!loading && !result && !error && <EmptyState />}
          {!loading && error && <ErrorState msg={error} />}
          {!loading && result && (
            result.type === 'video'
              ? <video src={result.url} controls autoPlay loop playsInline className="w-full h-full object-contain" />
              : <img src={result.url} alt={result.prompt} className="w-full h-full object-contain" />
          )}
        </div>

        {/* Actions */}
        {result && !loading && (
          <div className="mt-3 flex gap-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={onRegenerate} className="flex-1 min-w-24">
              <RefreshCw size={13} />Regenerate
            </Button>
            <Button variant={saved ? 'outline' : 'secondary'} size="sm" onClick={handleSave} className="flex-1 min-w-24">
              {saved ? <Check size={13} /> : <Save size={13} />}{saved ? 'Saved!' : 'Save'}
            </Button>
            <Button variant="secondary" size="icon" onClick={handleDownload} title="Download"><Download size={14} /></Button>
            {result.directUrl && <Button variant="secondary" size="icon" onClick={() => window.open(result.directUrl, '_blank')} title="Open original"><ExternalLink size={14} /></Button>}
          </div>
        )}

        {/* Meta info */}
        {result && !loading && meta && (
          <div className="mt-3 p-3 bg-slate-950/60 rounded-xl space-y-1.5">
            {meta.map(({ label, value }) => value && (
              <div key={label} className="flex items-start gap-2 text-xs">
                <span className="text-slate-500 shrink-0 w-16">{label}</span>
                <span className="text-slate-300 font-mono break-all">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingState({ msg }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950">
      <div className="relative">
        <div className="w-14 h-14 border-2 border-slate-800 rounded-full" />
        <div className="absolute inset-0 w-14 h-14 border-2 border-t-cyan-400 border-transparent rounded-full animate-spin-slow" />
      </div>
      <div className="text-center">
        <p className="text-sm text-slate-300 font-medium">{msg || 'Generating…'}</p>
        <p className="text-xs text-slate-600 mt-1">This may take a few moments</p>
      </div>
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-glow" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center text-2xl animate-float">🎨</div>
      <div>
        <p className="text-sm font-medium text-slate-400">Output appears here</p>
        <p className="text-xs text-slate-600 mt-1">Configure settings and click generate</p>
      </div>
    </div>
  )
}

function ErrorState({ msg }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="text-3xl">⚠️</div>
      <div>
        <p className="text-sm font-semibold text-red-400">Generation Failed</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">{msg}</p>
      </div>
    </div>
  )
}

export function Panel({ title, children, className = '' }) {
  return (
    <div className={`bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 ${className}`}>
      {title && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{title}</h3>}
      {children}
    </div>
  )
}
