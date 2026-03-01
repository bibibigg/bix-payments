"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { login } from "@/lib/api/auth";
import { decodeJwt } from "@/lib/utils/jwt";
import { validateEmail } from "@/lib/utils/validation";
import { useAuthStore } from "@/store/authStore";

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("이메일과 비밀번호를 입력해주세요");
      return;
    }

    const emailError = validateEmail(form.username);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await login(form);
      const { name, username } = decodeJwt(accessToken);
      setAuth({ accessToken, refreshToken }, { name, username });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <Input
        label="이메일"
        type="email"
        name="username"
        placeholder="example@email.com"
        value={form.username}
        onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
        required
      />

      <Input
        label="비밀번호"
        type="password"
        name="password"
        placeholder="비밀번호를 입력하세요"
        value={form.password}
        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        로그인
      </Button>

      <p className="text-center text-sm text-gray-500">
        계정이 없으신가요?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
