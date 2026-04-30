import { Check, Zap, Crown, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'

const PLANS = [
  { name: 'Free', price: '$0', period: 'forever', icon: Sparkles, color: 'slate', features: ['50 image generations/mo', 'All image models', 'Gallery storage (100 items)', 'HD downloads', 'Community support'], cta: 'Get Started Free', popular: false },
  { name: 'Pro', price: '$12', period: 'per month', icon: Zap, color: 'blue', features: ['500 image generations/mo', '100 video generations/mo', 'All video models (Seedance, Wan, LTX)', 'Priority generation queue', 'No watermarks', '4K downloads', '4GB gallery storage', 'Email support'], cta: 'Start Pro Trial', popular: true },
  { name: 'Studio', price: '$39', period: 'per month', icon: Crown, color: 'amber', features: ['Unlimited image generations', '500 video generations/mo', 'All premium models', 'API access', 'Batch generation', 'Custom watermarks', 'Commercial license', '50GB gallery storage', 'Priority support', 'Early access to new models'], cta: 'Start Studio', popular: false },
]

export default function PricingPage() {
  const colors = { slate: { bg: 'bg-slate-800/60', border: 'border-slate-700', badge: '', btn: 'secondary' }, blue: { bg: 'bg-blue-900/20', border: 'border-blue-500/40', badge: 'bg-blue-500', btn: 'primary' }, amber: { bg: 'bg-amber-900/20', border: 'border-amber-500/40', badge: 'bg-amber-500', btn: 'outline' } }

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/25 text-blue-400 text-xs font-semibold mb-5">
          <Zap size={12} />Simple, transparent pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Choose your plan</h1>
        <p className="text-slate-400 max-w-lg mx-auto mb-12">Start free. Scale when you need more power. All plans include access to Pollinations AI's cutting-edge models.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(plan => {
            const c = colors[plan.color]
            const Icon = plan.icon
            return (
              <div key={plan.name} className={`relative ${c.bg} border ${c.border} rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 ${plan.popular ? 'ring-1 ring-blue-500/30' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-black px-4 py-1 rounded-full">MOST POPULAR</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-9 h-9 rounded-xl ${plan.popular ? 'bg-blue-600' : plan.color === 'amber' ? 'bg-amber-600/40' : 'bg-slate-700'} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-black text-white">{plan.name}</p>
                    <p className="text-xs text-slate-500">{plan.period}</p>
                  </div>
                </div>
                <div className="mb-5">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm ml-1">/{plan.period.split(' ')[0]}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={14} className={`shrink-0 mt-0.5 ${plan.popular ? 'text-blue-400' : plan.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={c.btn} size="md" className="w-full">{plan.cta}</Button>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-slate-600 text-sm">All plans come with a 7-day money-back guarantee. No questions asked.</p>
      </div>
    </div>
  )
}
