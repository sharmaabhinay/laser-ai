import { useState } from 'react'
import { Layers, Plus, Trash2, Play, ChevronDown, ChevronUp } from 'lucide-react'
import { generateImage } from '../../utils/api'
import { Panel } from './GeneratorLayout'
import { OutputPanel } from './GeneratorLayout'
import Button from '../ui/Button'
import { Chips } from '../ui/Input'
import { useGallery } from '../../context/GalleryContext'

const TRANSITIONS = ['Cut', 'Fade', 'Dissolve', 'Zoom', 'Slide', 'Wipe']
const SCENE_MODELS = ['flux', 'flux-realism', 'flux-anime', 'turbo']
const GLOBAL_STYLES = ['Cinematic', 'Anime', 'Documentary', 'Noir', 'Fantasy', 'Sci-Fi']

const mkScene = (id) => ({ id, prompt: '', duration: 3, model: 'flux-realism', transition: 'Dissolve', result: null, loading: false, error: '' })

export default function ComposeGenerator() {
  const { addItem } = useGallery()
  const [scenes, setScenes] = useState([mkScene(1), mkScene(2)])
  const [globalStyle, setGlobalStyle] = useState('Cinematic')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [generating, setGenerating] = useState(false)
  const [finalResult, setFinalResult] = useState(null)
  const [finalError, setFinalError] = useState('')

  const upd = (id, key, val) => setScenes(s => s.map(sc => sc.id === id ? { ...sc, [key]: val } : sc))

  const previewScene = async (id) => {
    const s = scenes.find(sc => sc.id === id)
    if (!s?.prompt.trim()) return
    upd(id, 'loading', true); upd(id, 'error', '')
    try {
      const p = s.prompt + `, ${globalStyle} style, cinematic frame`
      const res = await generateImage(p, { model: s.model, aspectRatio })
      upd(id, 'result', res.url); upd(id, 'loading', false)
      addItem({ type: 'image', url: res.url, directUrl: res.directUrl, prompt: p, model: s.model, aspectRatio })
    } catch (err) { upd(id, 'error', 'Failed'); upd(id, 'loading', false) }
  }

  const generateAll = async () => {
    const valid = scenes.filter(s => s.prompt.trim())
    if (!valid.length) { setFinalError('Add prompts to at least one scene.'); return }
    setGenerating(true); setFinalError(''); setFinalResult(null)
    let firstUrl = null
    for (const s of valid) {
      upd(s.id, 'loading', true)
      try {
        const p = s.prompt + `, ${globalStyle} style, cinematic frame`
        const res = await generateImage(p, { model: s.model, aspectRatio })
        upd(s.id, 'result', res.url); upd(s.id, 'loading', false)
        if (!firstUrl) firstUrl = res.url
        addItem({ type: 'image', url: res.url, directUrl: res.directUrl, prompt: p, model: s.model, aspectRatio })
      } catch { upd(s.id, 'error', 'Failed'); upd(s.id, 'loading', false) }
    }
    if (firstUrl) setFinalResult({ type: 'image', url: firstUrl, prompt: `Multi-scene: ${valid.length} scenes`, model: 'compose', aspectRatio })
    else setFinalError('All scenes failed to generate.')
    setGenerating(false)
  }

  const totalDuration = scenes.reduce((a, s) => a + s.duration, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
      <div className="space-y-4">
        <Panel title="Global Settings">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Global Style</p><Chips options={GLOBAL_STYLES} value={globalStyle} onChange={setGlobalStyle} /></div>
            <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Aspect Ratio</p><Chips options={['16:9','9:16','1:1']} value={aspectRatio} onChange={setAspectRatio} /></div>
          </div>
        </Panel>

        {scenes.map((s, idx) => (
          <div key={s.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-300 text-xs font-black flex items-center justify-center">{idx + 1}</span>
                <span className="text-sm font-semibold text-slate-300">Scene {idx + 1}</span>
                <span className="text-xs text-slate-500 font-mono">{s.duration}s</span>
                {s.result && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-glow" />}
              </div>
              <div className="flex items-center gap-2">
                {scenes.length > 1 && (
                  <button onClick={() => setScenes(sc => sc.filter(x => x.id !== s.id))} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"><Trash2 size={13} /></button>
                )}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-start">
                <div className="space-y-2">
                  <textarea rows={2} placeholder={`Scene ${idx + 1}: describe what happens…`} value={s.prompt}
                    onChange={e => upd(s.id, 'prompt', e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 transition-all resize-none" />
                  <div className="grid grid-cols-3 gap-2">
                    <select value={s.model} onChange={e => upd(s.id, 'model', e.target.value)}
                      className="bg-slate-950/80 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500 cursor-pointer">
                      {SCENE_MODELS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <select value={s.transition} onChange={e => upd(s.id, 'transition', e.target.value)}
                      className="bg-slate-950/80 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500 cursor-pointer">
                      {TRANSITIONS.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <div className="flex items-center gap-1.5">
                      <input type="range" min={1} max={10} value={s.duration} onChange={e => upd(s.id, 'duration', +e.target.value)}
                        className="flex-1 h-1 bg-slate-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 cursor-pointer" />
                      <span className="text-xs text-cyan-400 font-mono w-6 text-right">{s.duration}s</span>
                    </div>
                  </div>
                  {s.error && <p className="text-xs text-red-400">{s.error}</p>}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-28 h-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {s.loading ? (
                      <div className="w-5 h-5 border-2 border-t-cyan-400 border-slate-700 rounded-full animate-spin-slow" />
                    ) : s.result ? (
                      <img src={s.result} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-600">No preview</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs w-full" disabled={s.loading || !s.prompt.trim()} onClick={() => previewScene(s.id)}>
                    <Play size={10} />Preview
                  </Button>
                </div>
              </div>

              {idx < scenes.length - 1 && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-[10px] text-slate-600 font-mono">{s.transition} ›</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button disabled={scenes.length >= 8} onClick={() => setScenes(s => [...s, mkScene(Date.now())])}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-700/60 hover:border-blue-500/40 text-slate-500 hover:text-slate-400 text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
            <Plus size={16} />Add Scene {scenes.length >= 8 && '(max 8)'}
          </button>
          <Button variant="primary" size="md" loading={generating} disabled={scenes.every(s => !s.prompt.trim())} onClick={generateAll} className="flex-1">
            <Layers size={16} />{generating ? 'Generating…' : `Generate All (${scenes.filter(s => s.prompt.trim()).length})`}
          </Button>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 self-start space-y-4">
        <OutputPanel title="Composition Preview" result={finalResult} loading={generating} loadingMsg="Generating scenes…"
          error={finalError} onRegenerate={generateAll}
          meta={finalResult ? [{ label: 'Scenes', value: scenes.filter(s => s.result).length.toString() }, { label: 'Total', value: `${totalDuration}s` }, { label: 'Style', value: globalStyle }] : []} />

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Sequence</p>
          <div className="space-y-2">
            {scenes.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${s.result ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>{i + 1}</div>
                <p className="flex-1 text-xs text-slate-400 truncate">{s.prompt || <span className="text-slate-700 italic">Empty</span>}</p>
                <span className="text-[10px] font-mono text-slate-600 shrink-0">{s.duration}s</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-xs">
            <span className="text-slate-500">Total Duration</span>
            <span className="font-mono text-cyan-400">{totalDuration}s</span>
          </div>
        </div>
      </div>
    </div>
  )
}
