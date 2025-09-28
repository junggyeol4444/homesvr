'use client';

import { FormEvent, useState } from 'react';

export function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        window.location.reload();
        return;
      }

      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(data?.message ?? '로그인에 실패했습니다. 비밀번호를 확인해 주세요.');
    } catch (err) {
      console.error(err);
      setError('로그인 요청 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card mx-auto flex max-w-md flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">관리자 로그인</h2>
        <p className="mt-2 text-sm text-slate-300">
          환경 변수 <code className="rounded bg-black/40 px-2 py-1">ADMIN_PASSWORD</code>에 설정한 비밀번호로 접속할 수 있습니다.
        </p>
      </div>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        비밀번호
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-base text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/60"
        />
      </label>
      {error ? <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="button-primary h-12 justify-center text-base disabled:opacity-60"
      >
        {isSubmitting ? '확인 중...' : '로그인'}
      </button>
    </form>
  );
}
