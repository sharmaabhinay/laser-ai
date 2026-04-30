export default function Button({ children, variant = 'primary', size = 'md', className = '', loading = false, disabled = false, onClick, type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-900/40 hover:shadow-blue-700/50 hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200',
    ghost: 'hover:bg-slate-800/60 text-slate-300 hover:text-white',
    danger: 'bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300',
    outline: 'border border-blue-500/40 hover:border-blue-400 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
    icon: 'p-2.5',
  }
  return (
    <button type={type} disabled={disabled || loading} onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin-slow" />}
      {children}
    </button>
  )
}
