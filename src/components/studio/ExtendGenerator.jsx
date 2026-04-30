import { useState, useRef } from 'react'
import { Expand, Upload, X } from 'lucide-react'
import { generateImage, ASPECT_RATIOS } from '../../utils/api'
import { GeneratorLayout, Panel } from './GeneratorLayout'
import Button from '../ui/Button'
import { Textarea, Chips, Toggle } from '../ui/Input'
import { useGallery } from '../../context/GalleryContext'

const DIRECTIONS = ['Right', 'Left', 'Up', 'Down', 'All Sides']
const AMOUNTS = ['25%', '50%', '100%', '200%']

export default function ExtendGenerator() {
  const { addItem } = useGallery()
  const [sourceUrl, setSourceUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const [direction, setDirection] = useState('Right')
  const [amount, setAmount] = useState('50%')
  const [seamless, setSeamless] = useState(true)
  const [matchStyle, setMatchStyle] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    setSourceUrl(URL.createObjectURL(file))
  }

  const generate = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const factor = { '25%': 1.25, '50%': 1.5, '100%': 2.0, '200%': 3.0 }[amount]
      const baseW = 1280, baseH = 720
      const isH = direction === 'Right' || direction === 'Left' || direction === 'All Sides'
      const isV = direction === 'Up' || direction === 'Down' || direction === 'All Sides'
      const w = Math.min(isH ? Math.round(baseW * factor) : baseW, 2048)
      const h = Math.min(isV ? Math.round(baseH * factor) : baseH, 2048)

      const extPrompt = (prompt || 'beautiful natural environment extending seamlessly') +
        (seamless ? ', perfect seamless continuation, no visible seam' : '') +
        (matchStyle ? ', same style lighting and color palette' : '') +
        `, outpainting extended ${direction.toLowerCase()} by ${amount}, high quality`

      const seed = Math.floor(Math.random() * 999999)
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(extPrompt)}?width=${w}&height=${h}&model=flux&nologo=true&seed=${seed}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      if (blob.size < 1000) throw new Error('Invalid image received')
      const blobUrl = URL.createObjectURL(blob)
      const r = { type: 'image', url: blobUrl, directUrl: url, prompt: extPrompt, model: 'flux', aspectRatio: `${w}x${h}` }
      setResult(r)
      addItem(r)
    } catch (err) {
      setError(err.message || 'Extension failed. Please try again.')
    } finally { setLoading(false) }
  }

  const controls = (
    <>
      <Panel title="Source Image">
        <div onClick={() => fileRef.current.click()}
          className="cursor-pointer border-2 border-dashed border-slate-700/60 hover:border-blue-500/40 rounded-xl p-6 text-center transition-all relative group">
          {sourceUrl ? (
            <div>
              <img src={sourceUrl} alt="" className="max-h-44 mx-auto rounded-lg object-contain" />
              <button onClick={e => { e.stopPropagation(); setSourceUrl(''); fileRef.current.value = '' }}
                className="absolute top-3 right-3 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all cursor-pointer">
                <X size={13} />
              </button>
            </div>
          ) : (
            <div className="text-slate-500 group-hover:text-slate-400 transition-colors">
              <Upload size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Upload image to extend</p>
              <p className="text-xs mt-1">PNG, JPG, WEBP</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </Panel>

      <Panel title="Extension Prompt">
        <Textarea rows={3} placeholder="Describe what should appear in the extended area: rolling hills, ocean horizon, cityscape…"
          value={prompt} onChange={e => setPrompt(e.target.value)} />
      </Panel>

      <Panel title="Extension Settings">
        <div className="space-y-4">
          <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Direction</p><Chips options={DIRECTIONS} value={direction} onChange={setDirection} /></div>
          <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Amount</p><Chips options={AMOUNTS} value={amount} onChange={setAmount} /></div>
          <div className="space-y-3">
            <Toggle label="Seamless blending" checked={seamless} onChange={setSeamless} />
            <Toggle label="Match original style & lighting" checked={matchStyle} onChange={setMatchStyle} />
          </div>
        </div>
      </Panel>

      <Button variant="primary" size="xl" className="w-full" loading={loading} disabled={!sourceUrl && !prompt.trim()} onClick={generate}>
        <Expand size={18} />{loading ? 'Extending…' : `Extend ${direction} by ${amount}`}
      </Button>
    </>
  )

  return (
    <GeneratorLayout controls={controls} outputTitle="Extended Output" result={result} loading={loading} loadingMsg="Outpainting…"
      error={error} onRegenerate={generate}
      meta={result ? [{ label: 'Direction', value: direction }, { label: 'Amount', value: amount }, { label: 'Prompt', value: result.prompt }] : []} />
  )
}
