import { useState, useRef } from 'react'
import { Wand2, Upload, X, Key, ExternalLink } from 'lucide-react'
import { generateVideo, ASPECT_RATIOS } from '../../utils/api'
import { GeneratorLayout, Panel } from './GeneratorLayout'
import Button from '../ui/Button'
import { Textarea, RangeSlider, Chips, Toggle } from '../ui/Input'
import { useAuth } from '../../context/AuthContext'

const MOTION_STRENGTHS = ['Subtle', 'Moderate', 'Strong', 'Extreme']
const TRANSITIONS = ['Smooth Fade', 'Dissolve', 'Zoom Pulse', 'Warp', 'Pan Sweep', 'Morph']

const LOADING_STEPS = ['Analyzing image…', 'Generating motion…', 'Applying transitions…', 'Rendering frames…', 'Finalizing…']

export default function Img2VidGenerator() {
  const { apiKey } = useAuth()
  const [sourceUrl, setSourceUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const [motionStrength, setMotionStrength] = useState('Moderate')
  const [transition, setTransition] = useState('Smooth Fade')
  const [duration, setDuration] = useState(5)
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [withAudio, setWithAudio] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    setSourceUrl(URL.createObjectURL(file))
  }

  const generate = async () => {
    if (!apiKey) { setError('api_key_required'); return }
    setLoading(true); setError(''); setResult(null)
    let step = 0; setLoadingMsg(LOADING_STEPS[0])
    const interval = setInterval(() => { step = Math.min(step + 1, LOADING_STEPS.length - 1); setLoadingMsg(LOADING_STEPS[step]) }, 6000)
    try {
      const motionMap = { Subtle: 'gentle slow', Moderate: 'smooth natural', Strong: 'dynamic', Extreme: 'intense fast' }
      const fullPrompt = (prompt || 'animate this scene with natural smooth motion') +
        `, ${motionMap[motionStrength]} motion, ${transition.toLowerCase()} transition, high quality cinematic video`
      const videoUrl = await generateVideo(fullPrompt, { model: 'seedance', aspectRatio, duration, audio: withAudio, apiKey })
      setResult({ type: 'video', url: videoUrl, prompt: fullPrompt, model: 'seedance (img2vid)', aspectRatio })
    } catch (err) {
      if (err.message === 'API_KEY_REQUIRED') setError('api_key_required')
      else setError(err.message || 'Animation failed. Please try again.')
    } finally { clearInterval(interval); setLoading(false) }
  }

  const controls = (
    <>
      {!apiKey && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl">
          <Key size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-300">API Key Required</p>
            <p className="text-xs text-amber-400/70 mt-0.5">Image-to-video generation requires a Pollinations API key.</p>
            <a href="https://enter.pollinations.ai" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-amber-300 underline mt-1 hover:text-amber-200">Get free key <ExternalLink size={10} /></a>
          </div>
        </div>
      )}

      <Panel title="Source Image">
        <div onClick={() => fileRef.current.click()}
          className="cursor-pointer border-2 border-dashed border-slate-700/60 hover:border-blue-500/40 rounded-xl p-6 text-center transition-all relative group">
          {sourceUrl ? (
            <div>
              <img src={sourceUrl} alt="" className="max-h-48 mx-auto rounded-lg object-contain" />
              <button onClick={e => { e.stopPropagation(); setSourceUrl(''); fileRef.current.value = '' }}
                className="absolute top-3 right-3 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all cursor-pointer">
                <X size={13} />
              </button>
            </div>
          ) : (
            <div className="text-slate-500 group-hover:text-slate-400 transition-colors">
              <Upload size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Upload reference image</p>
              <p className="text-xs mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </Panel>

      <Panel title="Animation Prompt">
        <Textarea rows={3} placeholder="Describe the motion: camera slowly pans right, leaves sway in the wind, water ripples gently…"
          value={prompt} onChange={e => setPrompt(e.target.value)} />
      </Panel>

      <Panel title="Motion Settings">
        <div className="space-y-4">
          <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Motion Strength</p><Chips options={MOTION_STRENGTHS} value={motionStrength} onChange={setMotionStrength} /></div>
          <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Transition Effect</p><Chips options={TRANSITIONS} value={transition} onChange={setTransition} /></div>
          <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Aspect Ratio</p><Chips options={Object.keys(ASPECT_RATIOS)} value={aspectRatio} onChange={setAspectRatio} /></div>
          <RangeSlider label="Duration" value={duration} min={2} max={15} unit="s" onChange={setDuration} />
          <Toggle label="Generate ambient audio" checked={withAudio} onChange={setWithAudio} />
        </div>
      </Panel>

      <Button variant="primary" size="xl" className="w-full" loading={loading} disabled={!apiKey && !loading} onClick={generate}>
        <Wand2 size={18} />{loading ? loadingMsg : 'Animate Image'}
      </Button>
    </>
  )

  return (
    <GeneratorLayout controls={controls} outputTitle="Animated Output" result={result} loading={loading} loadingMsg={loadingMsg}
      error={error === 'api_key_required' ? null : error} onRegenerate={generate}
      meta={result ? [{ label: 'Model', value: result.model }, { label: 'Duration', value: `${duration}s` }, { label: 'Ratio', value: result.aspectRatio }] : []} />
  )
}
