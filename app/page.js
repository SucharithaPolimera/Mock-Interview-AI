'use client';
import SignInPage from './(auth)/sign-in/[[...sign-in]]/page';
import SignUpPage from './(auth)/sign-up/[[...sign-up]]/page';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect logged-in users to /dashboard automatically
    router.push('/dashboard');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignInPage>
        <p>Redirecting...</p>
        {typeof window !== 'undefined' && (window.location.href = '/dashboard')}
      </SignInPage>

      <SignUpPage>
        <SignInPage afterSignInUrl="/dashboard" />
        {mode === 'signup' ? <SignUpPage afterSignUpUrl="/dashboard" /> : <SignUpPage afterSignInUrl="/dashboard" />}
      </SignUpPage>
    </div>
  );
}
