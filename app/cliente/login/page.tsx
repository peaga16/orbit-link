import { Suspense } from 'react';
import { ClientLoginForm } from '@/components/client/client-login-form';

export default function ClientLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808]" />}>
      <ClientLoginForm />
    </Suspense>
  );
}
