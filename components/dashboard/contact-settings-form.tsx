"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  updateContactSettingsAction,
  type ContactSettingsState,
} from "@/lib/actions/contact-settings";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";

interface ToggleDef {
  key: "acceptingNewClients" | "acceptsRequestsViaVsi" | "offersSupervision" | "offersGroupWork";
  label: string;
  hint: string;
}

const TOGGLES: ToggleDef[] = [
  {
    key: "acceptingNewClients",
    label: "Приймає нових клієнтів",
    hint: "Якщо вимкнено, простір показує «У листі очікування».",
  },
  {
    key: "acceptsRequestsViaVsi",
    label: "Приймає звернення через VSI",
    hint: "Якщо вимкнено, форма заявки на сторінці фахівця не показується.",
  },
  {
    key: "offersSupervision",
    label: "Пропонує супервізію",
    hint: "З'явиться в розділі «Супервізія», коли він запрацює.",
  },
  {
    key: "offersGroupWork",
    label: "Пропонує групову роботу",
    hint: "Позначка для колег і клієнтів, які шукають групу.",
  },
];

function Toggle({
  name,
  defaultChecked,
  label,
  hint,
}: {
  name: string;
  defaultChecked: boolean;
  label: string;
  hint: string;
}) {
  // Некерований чекбокс: DOM сам володіє станом, а перемикач реагує
  // через peer-checked. Це навмисно — керований useState(defaultChecked)
  // «застряг» на початковому значенні після revalidate: сервер повертає
  // нові props, але вже змонтований інпут ігнорує їх.
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] p-4",
        touch,
      )}
    >
      <span>
        <span className={cn("block text-sm font-medium", ink.strong)}>{label}</span>
        <span className={cn("mt-0.5 block text-[13px] leading-relaxed", ink.soft)}>{hint}</span>
      </span>
      <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className={cn("peer sr-only", focusRing)}
        />
        <span
          aria-hidden
          className="h-6 w-11 rounded-full bg-[#142744]/15 transition-colors peer-checked:bg-[#1C3557] motion-reduce:transition-none"
        />
        <span
          aria-hidden
          className="absolute left-0.5 h-5 w-5 rounded-full bg-[#FFFDF8] shadow transition-transform peer-checked:translate-x-5 motion-reduce:transition-none"
        />
      </span>
    </label>
  );
}

export function ContactSettingsForm({ initial }: { initial: Record<ToggleDef["key"], boolean> }) {
  const [state, formAction, pending] = useActionState<ContactSettingsState | null, FormData>(
    (prev, fd) => updateContactSettingsAction(prev, fd),
    null,
  );

  useEffect(() => {
    if (state?.ok) toast.success("Збережено");
    if (state?.ok === false) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="mt-8 max-w-lg space-y-3">
      {TOGGLES.map((t) => (
        <Toggle
          key={t.key}
          name={t.key}
          defaultChecked={initial[t.key]}
          label={t.label}
          hint={t.hint}
        />
      ))}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
          "transition-colors hover:bg-[#142744] disabled:opacity-60 motion-reduce:transition-none",
          touch,
          focusRing,
        )}
      >
        {pending ? "Зберігаємо…" : "Зберегти"}
      </button>
    </form>
  );
}
