import { component$, useSignal, $ } from "@builder.io/qwik";
import { supabase } from "~/lib/supabase";
import logoDark from "~/assets/gridlio-logo-darkmode.webp";

export const AuthPanel = component$(() => {
  const email = useSignal("");
  const password = useSignal("");
  const message = useSignal("");
  const loading = useSignal(false);

  const signUp$ = $(async () => {
    loading.value = true;
    message.value = "";

    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    loading.value = false;
    message.value = error
      ? error.message
      : "Account created. Check your email if confirmation is enabled.";
  });

  const signIn$ = $(async () => {
    loading.value = true;
    message.value = "";

    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    loading.value = false;
    message.value = error ? error.message : "Signed in successfully.";
  });

  return (
    <div class="grid min-h-screen place-items-center bg-neutral-100 px-6 py-10">
      <div class="w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <div class="grid min-h-[720px] lg:grid-cols-[1.05fr_0.95fr]">
          <div class="bg-neutral-950 px-8 py-8 text-white lg:px-12 lg:py-14">
            <div class="max-w-md">
              <div>
                <img
                  src={logoDark}
                  alt="Gridlio"
                  class="w-[200px] max-w-none opacity-90"
                />
              </div>

              <h1 class="mt-10 text-5xl font-semibold leading-[1.05] tracking-tight">
                Plan your feed before you post.
              </h1>

              <p class="mt-5 text-base leading-7 text-white/70">
                Upload, paste, and reorder images in a clean visual planner.
                Preview your layout across mobile, tablet, and desktop before
                publishing.
              </p>

              <div class="mt-10 grid gap-4">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p class="text-sm font-medium">Visual planning</p>
                  <p class="mt-1.5 text-sm leading-6 text-white/60">
                    Reorder posts and see how the full grid will look.
                  </p>
                </div>

                <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p class="text-sm font-medium">Fast import</p>
                  <p class="mt-1.5 text-sm leading-6 text-white/60">
                    Add images by upload, drag and drop, or clipboard paste.
                  </p>
                </div>

                <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p class="text-sm font-medium">Your own workspace</p>
                  <p class="mt-1.5 text-sm leading-6 text-white/60">
                    Each account keeps its own saved images and ordering.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center bg-white px-8 py-10 lg:px-12 lg:py-14">
            <div class="mx-auto w-full max-w-md rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-8 shadow-sm">
              <div>
                <h2 class="text-3xl font-semibold tracking-tight text-neutral-900">
                  Welcome back
                </h2>

                <p class="mt-3 text-sm leading-6 text-neutral-500">
                  Sign in to continue, or create an account to save your feed
                  drafts.
                </p>
              </div>

              <div class="mt-8 space-y-5">
                <div>
                  <label class="mb-2 block text-sm font-medium text-neutral-700">
                    Email
                  </label>
                  <input
                    class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
                    type="email"
                    placeholder="you@example.com"
                    value={email.value}
                    onInput$={(e) => {
                      email.value = (e.target as HTMLInputElement).value;
                    }}
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <input
                    class="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
                    type="password"
                    placeholder="Your password"
                    value={password.value}
                    onInput$={(e) => {
                      password.value = (e.target as HTMLInputElement).value;
                    }}
                  />
                </div>
              </div>

              <div class="mt-7 grid gap-3 sm:grid-cols-2">
                <button
                  class="rounded-2xl bg-neutral-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
                  onClick$={signIn$}
                  disabled={loading.value}
                >
                  Log in
                </button>

                <button
                  class="rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 disabled:opacity-50"
                  onClick$={signUp$}
                  disabled={loading.value}
                >
                  Create account
                </button>
              </div>

              {message.value && (
                <div class="mt-5 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
                  {message.value}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});