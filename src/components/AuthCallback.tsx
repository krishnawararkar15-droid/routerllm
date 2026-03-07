import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email

        // Register user in our backend to get subscription key
        try {
          const response = await fetch('https://routerllm.onrender.com/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              password: session.user.id // use Google user ID as password
            })
          })
          const data = await response.json()
          if (data.subscription_key) {
            localStorage.setItem('routellm_key', data.subscription_key)
            localStorage.setItem('routellm_email', email)
            localStorage.setItem('routellm_plan', data.plan || 'free')
            navigate('/dashboard')
          }
        } catch (err) {
          console.error('Backend registration failed:', err)
          navigate('/login')
        }
      } else {
        navigate('/login')
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Signing you in...</p>
      </div>
    </div>
  )
}
