import { useState, useCallback } from 'react'
import { Image } from 'lucide-react'
import { generateImage, IMAGE_MODELS, ASPECT_RATIOS } from '../../utils/api'
import { GeneratorLayout, Panel } from './GeneratorLayout'
import Button from '../ui/Button'
import { Textarea, RangeSlider, Toggle, Chips } from '../ui/Input'
import { useGallery } from '../../context/GalleryContext'

const STYLES = ['Photorealistic', 'Cinematic', 'Anime', 'Oil Painting', 'Watercolor', 'Sketch', '3D Render', 'Pixel Art', 'Comic', 'Neon']
const LIGHTING = ['Natural', 'Golden Hour', 'Blue Hour', 'Studio', 'Dramatic', 'Soft Diffused', 'Neon', 'Backlit']
const QUALITIES = [{ id: 'draft', label: 'Draft', desc: 'Fastest' }, { id: 'standard', label: 'Standard', desc: 'Balanced' }, { id: 'hd', label: 'HD', desc: 'Best quality' }]

export default function ImageGenerator() {
  const { addItem } = useGallery()
  const [prompt, setPrompt] = useState('')
  const [negPrompt, setNegPrompt] = useState('')
  const [model, setModel] = useState('flux')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [style, setStyle] = useState('Photorealistic')
  const [lighting, setLighting] = useState('Natural')
  const [quality, setQuality] = useState('standard')
  const [seed, setSeed] = useState('')
  const [autoEnhance, setAutoEnhance] = useState(true)
  const [batchCount, setBatchCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [error, setError] = useState('')

  const buildPrompt = useCallback(() => {
    let p = prompt.trim()
    if (style !== 'Photorealistic') p += `, ${style} style`
    if (lighting !== 'Natural') p += `, ${lighting} lighting`
    if (autoEnhance) p += ', highly detailed, professional quality, sharp focus'
    if (negPrompt.trim()) p += ` --no ${negPrompt.trim()}`
    return p
  }, [prompt, style, lighting, autoEnhance, negPrompt])

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true); setError(''); setResults([])
    try {
      const fullPrompt = buildPrompt()
      const generated = []
      for (let i = 0; i < batchCount; i++) {
        const s = seed ? parseInt(seed) + i : undefined
        const res = await generateImage(fullPrompt, { model, aspectRatio, seed: s })
        generated.push(res)
        addItem({ type: 'image', url: res.url, directUrl: res.directUrl, prompt: fullPrompt, model, aspectRatio, seed: res.seed })
      }
      setResults(generated); setActiveIdx(0)
    } catch (err) {
      setError(err.message || 'Image generation failed. Check connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentResult = results[activeIdx]
    ? { type: 'image', url: results[activeIdx].url, directUrl: results[activeIdx].directUrl, prompt: buildPrompt(), model, aspectRatio }
    : null

  const meta = currentResult ? [
    { label: 'Model', value: model },
    { label: 'Ratio', value: aspectRatio },
    { label: 'Seed', value: results[activeIdx]?.seed?.toString() },
    { label: 'Size', value: results[activeIdx] ? `${results[activeIdx].width}×${results[activeIdx].height}` : '' },
    { label: 'Prompt', value: buildPrompt() },
  ] : []

  const controls = (
    <>
      <Panel title="Prompt">
        <div className="space-y-3">
          <Textarea label="Image Description" rows={4} maxLength={600}
            placeholder="A serene Japanese garden at dawn, cherry blossoms falling gently into a koi pond…"
            value={prompt} onChange={e => setPrompt(e.target.value)} hint={`${prompt.length}/600`} />
          <Textarea label="Negative Prompt" rows={2} placeholder="blurry, ugly, watermark, text, distorted…"
            value={negPrompt} onChange={e => setNegPrompt(e.target.value)} />
        </div>
      </Panel>

      <Panel title="Model">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {IMAGE_MODELS.map(m => (
            <button key={m.id} onClick={() => setModel(m.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${model === m.id ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' : 'bg-slate-900/60 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}>
              <div className="text-xs font-bold">{m.label}</div>
              <div className="text-[10px] mt-0.5 opacity-70 truncate">{m.desc}</div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Style & Lighting">
        <div className="space-y-4">
          <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Visual Style</p><Chips options={STYLES} value={style} onChange={setStyle} /></div>
          <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Lighting</p><Chips options={LIGHTING} value={lighting} onChange={setLighting} /></div>
        </div>
      </Panel>

      <Panel title="Output Settings">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Aspect Ratio</p>
            <Chips options={Object.keys(ASPECT_RATIOS)} value={aspectRatio} onChange={setAspectRatio} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Quality</p>
            <div className="grid grid-cols-3 gap-2">
              {QUALITIES.map(q => (
                <button key={q.id} onClick={() => setQuality(q.id)}
                  className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${quality === q.id ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' : 'bg-slate-900/60 border-slate-700/50 text-slate-400 hover:border-slate-600'}`}>
                  <div className="text-xs font-bold">{q.label}</div>
                  <div className="text-[10px] opacity-60">{q.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <RangeSlider label="Batch Count" value={batchCount} min={1} max={4} unit=" images" onChange={setBatchCount} />
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Seed <span className="text-slate-600 normal-case">(optional)</span></label>
            <input type="number" placeholder="Random" value={seed} onChange={e => setSeed(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 transition-all font-mono" />
          </div>
          <Toggle label="Auto-enhance prompt" checked={autoEnhance} onChange={setAutoEnhance} />
        </div>
      </Panel>

      <Button variant="primary" size="xl" className="w-full" loading={loading} disabled={!prompt.trim()} onClick={generate}>
        <Image size={18} />{loading ? 'Generating…' : `Generate ${batchCount > 1 ? `${batchCount} Images` : 'Image'}`}
      </Button>
    </>
  )

  return (
    <GeneratorLayout
      controls={controls}
      outputTitle="Image Output"
      result={currentResult}
      loading={loading}
      loadingMsg="Generating image…"
      error={error}
      onRegenerate={generate}
      meta={meta}
    />
  )
}
