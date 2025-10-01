"use client";

import { useActionState } from "react";

export type ResendState = { ok: boolean; message: string } | null;

type Props = {
  email: string;
  action: (
    prevState: ResendState,
    formData: FormData
  ) => Promise<{ ok: boolean; message: string }>;
};

export function VerifyFormClient({ email, action }: Props) {
  const [resState, formAction] = useActionState<ResendState, FormData>(action, null);

  return (
    <>
      {resState?.message ? (
        <div
          className={
            "rounded p-3 text-sm " +
            (resState.ok
              ? "border border-green-300 bg-green-50 text-green-800"
              : "border border-yellow-300 bg-yellow-50 text-yellow-800")
          }
        >
          {resState.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Resend verification email
        </button>
      </form>
    </>
  );
}
