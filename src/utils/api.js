// Pollinations AI API utilities
// Image: https://image.pollinations.ai/prompt/{prompt}?model=flux&width=1280&height=720&nologo=true&seed=42
// Video: https://gen.pollinations.ai/video/{prompt}?model=seedance&duration=5&aspectRatio=16:9 (requires API key)

export const IMAGE_MODELS = [
  { id: 'flux', label: 'Flux', desc: 'Fast, high quality', free: true },
  { id: 'flux-realism', label: 'Flux Realism', desc: 'Photorealistic', free: true },
  { id: 'flux-anime', label: 'Flux Anime', desc: 'Anime & illustration', free: true },
  { id: 'flux-3d', label: 'Flux 3D', desc: '3D rendered style', free: true },
  { id: 'turbo', label: 'Turbo', desc: 'Ultra fast', free: true },
  { id: 'seedream', label: 'Seedream', desc: 'Dreamlike quality', free: true },
  { id: 'gptimage', label: 'GPT Image', desc: 'OpenAI powered', free: false },
  { id: 'any-dark', label: 'Any Dark', desc: 'Dark aesthetic', free: true },
]

export const VIDEO_MODELS = [
  { id: 'seedance', label: 'Seedance', desc: 'Best quality, smooth motion', free: false },
  { id: 'wan', label: 'Wan', desc: 'Open source, versatile', free: false },
  { id: 'wan-fast', label: 'Wan Fast', desc: 'Quick generation', free: false },
  { id: 'ltx-2', label: 'LTX-2', desc: 'High detail frames', free: false },
  { id: 'nova-reel', label: 'Nova Reel', desc: 'Amazon Nova model', free: false },
]

export const ASPECT_RATIOS = {
  '16:9': { w: 1280, h: 720, label: 'Landscape 16:9' },
  '9:16': { w: 720, h: 1280, label: 'Portrait 9:16' },
  '1:1':  { w: 1024, h: 1024, label: 'Square 1:1' },
  '4:3':  { w: 1024, h: 768, label: 'Classic 4:3' },
  '21:9': { w: 1920, h: 820, label: 'Cinematic 21:9' },
}

export function buildImageUrl(prompt, { model = 'flux', aspectRatio = '16:9', seed, nologo = true } = {}) {
  const ar = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS['16:9']
  const s = seed ?? Math.floor(Math.random() * 999999)
  const encoded = encodeURIComponent(prompt)
  return {
    url: `https://image.pollinations.ai/prompt/${encoded}?width=${ar.w}&height=${ar.h}&model=${model}&nologo=${nologo}&seed=${s}`,
    seed: s,
    width: ar.w,
    height: ar.h,
  }
}

export async function generateVideo(prompt, { model = 'seedance', aspectRatio = '16:9', duration = 5, audio = false, apiKey } = {}) {
  if (!apiKey) throw new Error('API_KEY_REQUIRED')
  const encoded = encodeURIComponent(prompt)
  const ar = aspectRatio // e.g. "16:9"
  const url = `https://gen.pollinations.ai/video/${encoded}?model=${model}&duration=${duration}&aspectRatio=${encodeURIComponent(ar)}&audio=${audio}`
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

export async function generateImage(prompt, options = {}) {
  const { url, seed, width, height } = buildImageUrl(prompt, options)
  // Use fetch to verify image loads and get blob URL
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image generation failed: HTTP ${res.status}`)
  const blob = await res.blob()
  if (blob.size < 1000) throw new Error('Received invalid image data')
  return { url: URL.createObjectURL(blob), directUrl: url, seed, width, height }
}
