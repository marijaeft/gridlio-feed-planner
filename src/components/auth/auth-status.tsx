import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { User } from "@supabase/supabase-js";
import { supabase } from "~/lib/supabase";

export const AuthStatus = component$(() => {
  const user = useSignal<User | null>(null);
  const loading = useSignal(true);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user ?? null;
    loading.value = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null;
      loading.value = false;
    });

    cleanup(() => {
      subscription.unsubscribe();
    });
  });

  const signOut$ = $(async () => {
    await supabase.auth.signOut();
    window.location.reload();
  });

  if (loading.value || !user.value) {
    return null;
  }

  const email = user.value.email ?? "";
  const initial = email.charAt(0).toUpperCase();

  return (
    <div class="flex items-center gap-4">
      <div class="hidden text-right sm:block">
        <p class="text-xs uppercase tracking-[0.12em] text-white/70">
          Logged in
        </p>
        <p class="max-w-[220px] truncate text-sm font-medium text-white">
          {email}
        </p>
      </div>

      <div class="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-sm font-semibold text-white ring-1 ring-white/15">
        {initial || "U"}
      </div>

      <button
        class="rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
        onClick$={signOut$}
      >
        Logout
      </button>
    </div>
  );
});