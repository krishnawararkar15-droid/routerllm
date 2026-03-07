interface UpgradeBlockProps {
  feature: string
  description: string
  requiredPlan: 'pro' | 'max'
}

export default function UpgradeBlock({ feature, description, requiredPlan }: UpgradeBlockProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl"
      style={{backdropFilter: 'blur(8px)', background: 'rgba(10,13,20,0.85)'}}>
      <div className="text-center p-8 max-w-sm">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-white text-xl font-bold mb-2">{feature}</h3>
        <p className="text-gray-400 text-sm mb-6">{description}</p>
        <a href="/dashboard/billing"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl inline-block transition-all">
          Upgrade to {requiredPlan === 'pro' ? 'Pro — $29/mo' : 'Max — $99/mo'} →
        </a>
        <p className="text-gray-600 text-xs mt-3">7-day money back guarantee</p>
      </div>
    </div>
  )
}
