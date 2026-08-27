import { cn } from "@/lib/utils";
import { ink } from "@/components/preview/vsi/theme";

export function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">Фаза 2</p>
      <h1
        className={cn("mt-3 text-3xl font-normal sm:text-4xl", ink.strong)}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
      >
        {title}
      </h1>
      <div className="border-[#142744]/18 mt-8 max-w-lg rounded-2xl border border-dashed bg-[#FFFDF8]/60 px-6 py-10">
        <p className={cn("text-[15px] leading-relaxed", ink.muted)}>{note}</p>
      </div>
    </div>
  );
}
