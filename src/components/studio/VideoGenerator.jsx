import { useState } from 'react'
import { Film, Key, ExternalLink, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { generateVideo, VIDEO_MODELS, ASPECT_RATIOS } from '../../utils/api'
import { GeneratorLayout, Panel } from './GeneratorLayout'
import Button from '../ui/Button'
import { Textarea, RangeSlider, Toggle, Chips } from '../ui/Input'

const STYLES = ['Cinematic', 'Documentary', 'Anime', '3D Animation', 'Photorealistic', 'Watercolor', 'Neon Noir', 'Vintage Film']
const CAMERAS = ['Static', 'Pan Left', 'Pan Right', 'Zoom In', 'Zoom Out', 'Orbit', 'Dolly Forward', 'Crane Up']
const MOODS = ['Epic', 'Calm', 'Mysterious', 'Joyful', 'Tense', 'Romantic', 'Melancholic', 'Energetic']

const LOADING_STEPS = [
  'Initializing model…', 'Processing your prompt…', 'Generating frames…',
  'Applying motion…', 'Rendering video…', 'Finalizing output…',
]

export default function VideoGenerator() {
  const { apiKey } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [negPrompt, setNegPrompt] = useState('')
  const [model, setModel] = useState('seedance')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState(5)
  const [style, setStyle] = useState('Cinematic')
  const [camera, setCamera] = useState('Static')
  const [mood, setMood] = useState('Epic')
  const [withAudio, setWithAudio] = useState(false)
  const [seed, setSeed] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const buildPrompt = () => {
    let p = prompt.trim()
    if (style !== 'Cinematic') p += `, ${style} style`
    if (camera !== 'Static') p += `, ${camera.toLowerCase()} camera movement`
    if (mood !== 'Epic') p += `, ${mood.toLowerCase()} mood`
    if (negPrompt.trim()) p += `. Avoid: ${negPrompt.trim()}`
    return p
  }

  const generate = async () => {
    if (!prompt.trim()) return
    if (!apiKey) { setError('api_key_required'); return }
    setLoading(true); setError(''); setResult(null)
    let step = 0
    setLoadingMsg(LOADING_STEPS[0])
    const interval = setInterval(() => {
      step = Math.min(step + 1, LOADING_STEPS.length - 1)
      setLoadingMsg(LOADING_STEPS[step])
    }, 8000)
    try {
      const fullPrompt = buildPrompt()
      const url = await generateVideo(fullPrompt, {
        model, aspectRatio, duration, audio: withAudio, apiKey,
        ...(seed ? { seed: parseInt(seed) } : {})
      })
      setResult({ type: 'video', url, prompt: fullPrompt, model, aspectRatio, directUrl: null })
    } catch (err) {
      if (err.message === 'API_KEY_REQUIRED') setError('api_key_required')
      else setError(err.message || 'Video generation failed. Please try again.')
    } finally {
      clearInterval(interval); setLoading(false)
    }
  }

  const controls = (
    <>
      {/* API Key warning */}
      {!apiKey && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl">
          <Key size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-300">API Key Required for Video</p>
            <p className="text-xs text-amber-400/70 mt-0.5">Video generation uses Pollinations AI models which require a free API key. Images work without a key.</p>
            <a href="https://enter.pollinations.ai" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-300 underline mt-1 hover:text-amber-200">
              Get free key at enter.pollinations.ai <ExternalLink size={10} />
            </a>
          </div>
        </div>
      )}

      <Panel title="Prompt">
        <div className="space-y-3">
          <Textarea label="Video Description" rows={4} maxLength={600}
            placeholder="A majestic golden eagle soaring over snow-capped mountains at sunrise, sweeping cinematic shot…"
            value={prompt} onChange={e => setPrompt(e.target.value)}
            hint={`${prompt.length}/600`} />
          <Textarea label="Negative Prompt" rows={2}
            placeholder="blurry, low quality, distorted, watermark, text…"
            value={negPrompt} onChange={e => setNegPrompt(e.target.value)} />
        </div>
      </Panel>

      <Panel title="Model">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VIDEO_MODELS.map(m => (
            <button key={m.id} onClick={() => setModel(m.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${model === m.id ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' : 'bg-slate-900/60 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}>
              <div className="text-sm font-semibold">{m.label}</div>
              <div className="text-xs mt-0.5 opacity-70">{m.desc}</div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Style & Motion">
        <div className="space-y-4">
          <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Visual Style</p><Chips options={STYLES} value={style} onChange={setStyle} /></div>
          <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Camera Movement</p><Chips options={CAMERAS} value={camera} onChange={setCamera} /></div>
          <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Mood</p><Chips options={MOODS} value={mood} onChange={setMood} /></div>
        </div>
      </Panel>

      <Panel title="Settings">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Aspect Ratio</p>
            <Chips options={Object.keys(ASPECT_RATIOS)} value={aspectRatio} onChange={setAspectRatio} />
          </div>
          <RangeSlider label="Duration" value={duration} min={2} max={30} unit="s" onChange={setDuration} />
          <Toggle label="Generate Audio (ambient soundtrack)" checked={withAudio} onChange={setWithAudio} />
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Seed <span className="text-slate-600 normal-case">(optional — leave empty for random)</span></label>
            <input type="number" placeholder="e.g. 42069" value={seed} onChange={e => setSeed(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 transition-all font-mono" />
          </div>
        </div>
      </Panel>

      <Button variant="primary" size="xl" className="w-full" loading={loading} disabled={!prompt.trim()} onClick={generate}>
        <Film size={18} />{loading ? loadingMsg : 'Generate Video'}
      </Button>
    </>
  )

  const meta = result ? [
    { label: 'Model', value: result.model },
    { label: 'Ratio', value: result.aspectRatio },
    { label: 'Prompt', value: result.prompt },
  ] : []

  return (
    <GeneratorLayout
      controls={controls}
      outputTitle="Video Output"
      result={error === 'api_key_required' ? null : result}
      loading={loading}
      loadingMsg={loadingMsg}
      error={error === 'api_key_required' ? null : error}
      onRegenerate={generate}
      meta={meta}
    />
  )
}
