'use client';

import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { loginAction } from '@/actions/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const result = await loginAction(formData);
      if (result.success) {
        window.location.href = '/admin';
      } else {
        setError(result.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0f172a] to-[#1e293b] font-sans">
      <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[30px] p-[50px_40px] w-full max-w-[450px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] text-center animate-in fade-in zoom-in duration-500">
        <div className="mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-white font-extrabold text-[1.8rem] tracking-wider uppercase mb-1">SIMETRI</h2>
          <p className="text-[#94a3b8] text-[9px] font-bold uppercase tracking-widest">Sistem Manajemen Template Website Terintegrasi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94a3b8] group-focus-within:text-blue-500 transition-colors">
              <User size={20} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/20 border border-white/10 text-white p-[16px_20px_16px_50px] rounded-[15px] text-base outline-none focus:border-blue-500 focus:bg-black/40 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-[#64748b]"
              placeholder="Username Admin"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94a3b8] group-focus-within:text-blue-500 transition-colors">
              <Lock size={20} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 text-white p-[16px_20px_16px_50px] rounded-[15px] text-base outline-none focus:border-blue-500 focus:bg-black/40 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-[#64748b]"
              placeholder="Kata Sandi"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-[15px] text-lg font-extrabold cursor-pointer hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(59,130,246,0.4)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                <span>Masuk ke Workspace</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-[30px] text-[#64748b] text-[0.8rem]">
          &copy; 2026 ABG Sertilink Platform
        </div>
      </div>
    </div>
  );
}
