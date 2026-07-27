import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/login-form';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808]" />}>
      <LoginForm />
    </Suspense>
  );
}
