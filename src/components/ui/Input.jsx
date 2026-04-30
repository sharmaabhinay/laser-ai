export function Input({ label, error, hint, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>}
      <input
        className={`w-full bg-slate-900/80 border ${error ? 'border-red-500/60' : 'border-slate-700/60'} rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function Textarea({ label, error, hint, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
          {hint && <span className="text-xs text-slate-500">{hint}</span>}
        </div>
      )}
      <textarea
        className={`w-full bg-slate-900/80 border ${error ? 'border-red-500/60' : 'border-slate-700/60'} rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>}
      <select
        className={`w-full bg-slate-900/80 border ${error ? 'border-red-500/60' : 'border-slate-700/60'} rounded-xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function RangeSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
          <span className="text-xs font-mono text-cyan-400">{value}{unit}</span>
        </div>
      )}
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50 [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`w-11 h-6 rounded-full transition-all duration-200 ${checked ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : 'bg-slate-700'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${checked ? 'left-6' : 'left-1'}`} />
        </div>
      </div>
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
    </label>
  )
}

export function Chips({ options, value, onChange, multi = false }) {
  const isActive = (opt) => multi ? (value || []).includes(opt) : value === opt
  const handleClick = (opt) => {
    if (multi) {
      const arr = value || []
      onChange(isActive(opt) ? arr.filter(v => v !== opt) : [...arr, opt])
    } else {
      onChange(opt)
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => handleClick(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${isActive(opt) ? 'bg-blue-600/25 border-blue-500/60 text-blue-300' : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'}`}>
          {opt}
        </button>
      ))}
    </div>
  )
}
