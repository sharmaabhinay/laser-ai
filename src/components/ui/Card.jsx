export default function Card({ children, className = '', glow = false }) {
  return (
    <div className={`bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-sm ${glow ? 'shadow-lg shadow-blue-900/20' : ''} ${className}`}>
      {children}
    </div>
  )
}
