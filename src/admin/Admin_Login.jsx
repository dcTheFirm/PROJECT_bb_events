// ===============================
// AdminLogin.jsx
// Admin panel login component with:
// - Login/logout
// - Forgot password
// ===============================

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


function AdminLogin({ onLogin }) {
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Login handler
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    const { error, data } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
    } else {
      if (onLogin) onLogin(data.user);
    }
    setLoading(false);
  }

  // Forgot password handler
  async function handleResetPassword(e) {
    e.preventDefault();
    setAuthError('');
    setResetSent(false);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail || authEmail);
    if (error) {
      setAuthError(error.message);
    } else {
      setResetSent(true);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-8 bg-[#23272f] rounded shadow border border-gray-800 selection:bg-gray-700 selection:text-white">
      <h2 className="text-xl font-bold mb-4 text-gray-100">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="Admin Email"
          value={authEmail}
          onChange={e => setAuthEmail(e.target.value)}
          required
          className="mb-2 bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700"
        />
        <Input
          type="password"
          placeholder="Password"
          value={authPassword}
          onChange={e => setAuthPassword(e.target.value)}
          required
          className="mb-4 bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700"
        />
        {authError && <div className="text-red-400 mb-2">{authError}</div>}
        <Button type="submit" className="w-full bg-blue-700 text-white hover:bg-blue-800" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      {/* Forgot password link */}
      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-blue-400 hover:underline text-sm"
          onClick={() => setShowForgot(v => !v)}
        >
          Forgot password?
        </button>
      </div>
      {/* Show forgot password field if toggled */}
      {showForgot && (
        <form onSubmit={handleResetPassword} className="mt-4">
          <Input
            type="email"
            placeholder="Enter email to recover password"
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
            className="mb-2 bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700"
          />
          <Button type="submit" variant="outline" className="w-full mb-2">
            Send Recovery Email
          </Button>
        </form>
      )}
      {resetSent && <div className="text-green-400 text-sm text-center">Reset email sent!</div>}
    </div>
  );
}

export default AdminLogin;