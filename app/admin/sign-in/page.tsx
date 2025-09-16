'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';

export default function AdminSignInPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) {
        setMessage(`שגיאה: ${error.message}`);
      } else {
        setMessage('קישור הכניסה נשלח לאימייל שלך!');
      }
    } catch (error) {
      setMessage('אירעה שגיאה בלתי צפויה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">כניסת מנהל</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            הזן את כתובת האימייל שלך לקבלת קישור כניסה
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-8">
          <form className="space-y-6" onSubmit={handleMagicLinkSignIn}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                כתובת אימייל
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="admin@example.com"
                data-testid="input-email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors disabled:opacity-50"
              data-testid="button-magic-link"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {loading ? 'שולח...' : 'שלח קישור כניסה'}
            </button>
          </form>

          {message && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              הקישור יישלח לכתובת האימייל שלך ויהיה תקף למשך 24 שעות
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
