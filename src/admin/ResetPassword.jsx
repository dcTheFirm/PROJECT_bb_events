import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate(); // Added useNavigate hook

  useEffect(() => {
    // This effect runs once on component mount to handle the session from URL
    const handleSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error getting session:', sessionError.message);
        setError('Failed to retrieve session. Please try again.');
        setLoading(false);
        return;
      }

      if (session) {
        // Session is already active, user can proceed to reset password
        setLoading(false);
      } else {
        // No active session, check for tokens in URL hash
        const hash = window.location.hash;
        if (hash.includes('access_token') && hash.includes('refresh_token')) {
          // Supabase automatically handles setting the session from URL hash
          // when getSession() or onAuthStateChange() is called.
          // We just need to wait for it to be set.
          // For explicit handling, you might parse and set, but getSession() usually suffices.
          // Let's add a listener to confirm session is set
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
              setLoading(false);
              // Optionally, clear the hash from the URL after session is set
              navigate('/reset-password', { replace: true });
            } else if (event === 'SIGNED_OUT') {
              setLoading(false);
              setError('Session expired or invalid. Please request a new link.');
            }
          });
          // Cleanup subscription
          return () => subscription.unsubscribe();
        } else {
          setError('Invalid or missing tokens in URL. Please request a new password reset link.');
          setLoading(false);
        }
      }
    };

    handleSession();
  }, [navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(''); // Clear previous errors
    setSuccess(false); // Clear previous success messages

    const { error: resetError } = await supabase.auth.updateUser({
      password,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
      // Optionally redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/admin'); // Redirect to admin login or a success page
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-sm mx-auto mt-20 p-8 bg-[#23272f] rounded shadow border border-gray-800 text-center text-gray-100">
        Loading... Please wait.
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-8 bg-[#23272f] rounded shadow border border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-100">Reset Password</h2>
      <form onSubmit={handleReset}>
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-2 bg-[#18181b] text-gray-100"
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mb-4 bg-[#18181b] text-gray-100"
        />
        {error && <div className="text-red-400 mb-2">{error}</div>}
        {success && <div className="text-green-400 mb-2">Password updated successfully! Redirecting...</div>}
        <Button type="submit" className="w-full bg-blue-700 text-white hover:bg-blue-800">
          Reset Password
        </Button>
      </form>
    </div>
  );
}