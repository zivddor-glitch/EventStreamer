import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '../lib/queryClient';
import { useLocation } from 'wouter';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [, navigate] = useLocation();

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      return apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
    },
    onSuccess: () => {
      // Invalidate any cached admin queries and navigate to admin
      queryClient.invalidateQueries({ queryKey: ['/api/admin'] });
      navigate('/admin');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      loginMutation.mutate(password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">כניסת מנהל</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            הזן את סיסמת המנהל לגישה למערכת
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                סיסמת מנהל
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="הזן סיסמת מנהל"
                data-testid="input-password"
              />
            </div>

            {loginMutation.error && (
              <div className="text-destructive text-sm" data-testid="text-error">
                שגיאה בהתחברות - בדק את הסיסמה
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors disabled:opacity-50"
              data-testid="button-login"
            >
              {loginMutation.isPending ? 'מתחבר...' : 'התחבר'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}