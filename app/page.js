'use client';
import SignInPage from './(auth)/sign-in/[[...sign-in]]/page';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div>
      {!isSignedIn && <SignInPage afterSignInUrl="/dashboard" />}
    </div>
  );
}
