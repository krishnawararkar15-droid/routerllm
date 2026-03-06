import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ProfilePopupProps {
  userEmail: string;
  userPlan: string;
  onClose: () => void;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({ userEmail, userPlan, onClose }) => {
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<any>(null);
  const userKey = localStorage.getItem('routellm_key');

  useEffect(() => {
    if (userKey) {
      fetch('https://routerllm.onrender.com/stats/' + userKey)
        .then(r => r.json())
        .then(d => setStats(d))
        .catch(() => {});
    }
  }, [userKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const tokensUsed = stats?.tokens_used || 0;
  const tokenLimit = userPlan === 'free' ? 100000 : userPlan === 'pro' ? 1000000 : 10000000;
  const usagePercent = Math.min((tokensUsed / tokenLimit) * 100, 100);
  const usageColor = usagePercent < 60 ? 'bg-green-500' : usagePercent < 80 ? 'bg-yellow-500' : 'bg-red-500';

  const planColors: Record<string, string> = {
    free: 'bg-green-500/20 text-green-400 border-green-500/30',
    pro: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    max: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div 
      ref={popupRef}
      className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-2 w-64 z-50"
      style={{ background: '#111113', borderColor: 'rgba(255,255,255,0.1)' }}
    >
      {/* User Info */}
      <div className="p-3 border-b border-white/10" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', boxShadow: '0 0 12px rgba(59,130,246,0.4)' }}>
            {userEmail ? userEmail[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-white truncate">{userEmail || 'User'}</div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${planColors[userPlan] || planColors.free}`}>
              {(userPlan || 'free').toUpperCase()} PLAN
            </span>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-white/50 mb-1">
            <span>{tokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()} tokens</span>
            <span>{Math.round(usagePercent)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full ${usageColor} transition-all duration-300`} style={{ width: `${usagePercent}%` }} />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <Link to="/dashboard/keys" onClick={onClose} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all text-[12px]">
          <span>👤</span> My Account
        </Link>
        <Link to="/dashboard/usage" onClick={onClose} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all text-[12px]">
          <span>📊</span> Usage & Stats
        </Link>
        <Link to="/dashboard/alerts" onClick={onClose} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all text-[12px]">
          <span>🔔</span> Budget Alerts
        </Link>
        <Link to="/dashboard/billing" onClick={onClose} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all text-[12px]">
          <span>💳</span> Billing & Plans
        </Link>
        <Link to="/dashboard/security" onClick={onClose} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all text-[12px]">
          <span>🔒</span> Security
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 my-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* Bottom Actions */}
      <div className="py-1">
        {userPlan === 'free' && (
          <Link to="/dashboard/billing" onClick={onClose} className="flex items-center justify-center gap-2 mx-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-[12px] font-medium transition-all">
            🚀 Upgrade Plan
          </Link>
        )}
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-[12px]">
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};
