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
    <div class="min-h-screen bg-black md:bg-neutral-100 md:grid md:place-items-center md:px-6 md:py-8">
      <div class="mx-auto w-full max-w-6xl overflow-hidden bg-black md:rounded-[2rem] md:bg-white md:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <div class="flex min-h-screen flex-col md:min-h-0 md:grid md:min-h-[760px] md:grid-cols-[1fr_1fr] lg:min-h-[720px] lg:grid-cols-[1.05fr_0.95fr]">
          <div class="flex flex-1 items-center bg-neutral-950 px-6 py-10 text-white sm:px-8 md:px-10 md:py-12 lg:block lg:px-12 lg:py-14">
            <div class="mx-auto w-full max-w-md">
              <img
                src={logoDark}
                alt="Gridlio"
                class="w-[145px] max-w-none opacity-90 sm:w-[165px] lg:w-[200px]"
                width={200}
                height={48}
              />

              <h1 class="mt-8 text-[2rem] font-semibold leading-[1.02] tracking-tight sm:text-[2.35rem] md:text-[2.6rem] lg:mt-10 lg:text-5xl">
                Plan your feed before you post.
              </h1>

              <p class="mt-4 max-w-[30rem] text-[15px] leading-7 text-white/72 sm:text-base lg:mt-5">
                Upload, paste, and reorder images in a clean visual planner.
                Preview your layout across mobile, tablet, and desktop before
                publishing.
              </p>

              <div class="mt-10 hidden gap-4 lg:grid">
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

          <div class="w-full rounded-t-[2rem] bg-white px-6 py-8 sm:px-8 sm:py-10 md:rounded-none md:px-10 md:py-12 lg:flex lg:items-center lg:justify-center lg:bg-white lg:px-12 lg:py-14">
            <div class="mx-auto w-full max-w-md">
              <div class="md:rounded-[1.5rem] md:border md:border-neutral-200 md:bg-neutral-50 md:p-8 md:shadow-sm">
                <h2 class="text-3xl font-semibold tracking-tight text-neutral-900">
                  Welcome back
                </h2>

                <p class="mt-3 text-sm leading-6 text-neutral-500">
                  Sign in to continue, or create an account to save your feed
                  drafts.
                </p>

                <div class="mt-8 space-y-5">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-neutral-700">
                      Email
                    </label>
                    <input
                      class="w-full rounded-full border border-neutral-200 bg-white px-5 py-4 text-[16px] outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
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
                      class="w-full rounded-full border border-neutral-200 bg-white px-5 py-4 text-[16px] outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
                      type="password"
                      placeholder="Your password"
                      value={password.value}
                      onInput$={(e) => {
                        password.value = (e.target as HTMLInputElement).value;
                      }}
                    />
                  </div>
                </div>

                <div class="mt-7 flex flex-col gap-3 sm:grid sm:grid-cols-2 md:flex md:flex-col lg:grid lg:grid-cols-2">
                  <button
                    class="w-full rounded-full bg-neutral-900 px-5 py-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
                    onClick$={signIn$}
                    disabled={loading.value}
                  >
                    Log in
                  </button>

                  <button
                    class="w-full rounded-full border border-neutral-200 bg-white px-5 py-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 disabled:opacity-50"
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
    </div>
  );
});