export default function Badge({ children, variant = 'default' }) {
  const v = {
    default: 'bg-slate-800 text-slate-300',
    blue: 'bg-blue-600/20 text-blue-300 border border-blue-500/30',
    green: 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30',
    amber: 'bg-amber-600/20 text-amber-300 border border-amber-500/30',
    red: 'bg-red-600/20 text-red-300 border border-red-500/30',
    purple: 'bg-purple-600/20 text-purple-300 border border-purple-500/30',
  }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${v[variant]}`}>{children}</span>
}
