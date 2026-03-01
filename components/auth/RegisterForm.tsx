'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { validateSignupForm } from '@/lib/utils/validation';
import { signup } from '@/lib/api/auth';

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validateSignupForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await signup(form);
      router.push('/login');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : '회원가입에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {serverError}
        </div>
      )}

      <Input
        label="이메일"
        type="email"
        name="username"
        placeholder="example@email.com"
        value={form.username}
        onChange={(e) => handleChange('username', e.target.value)}
        error={errors.username}
        required
      />

      <Input
        label="이름"
        type="text"
        name="name"
        placeholder="이름을 입력하세요"
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
      />

      <Input
        label="비밀번호"
        type="password"
        name="password"
        placeholder="8자 이상, 영문+숫자+특수문자"
        value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={errors.password}
        required
      />

      <Input
        label="비밀번호 확인"
        type="password"
        name="confirmPassword"
        placeholder="비밀번호를 다시 입력하세요"
        value={form.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        회원가입
      </Button>

      <p className="text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
