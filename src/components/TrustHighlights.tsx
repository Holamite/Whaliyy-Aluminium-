import { Building2, Gem, Ruler, Wrench } from "lucide-react";
import { highlights } from "@/content/copy";

const icons = [Ruler, Gem, Building2, Wrench];

export function TrustHighlights() {
  return (
    <section aria-label="Why clients choose us" className="relative border-y border-midnight/10 bg-white">
      <ul className="mx-auto grid max-w-[86rem] sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, i) => {
          const Icon = icons[i];
          return (
            <li
              key={item.title}
              className="flex gap-4 border-midnight/10 px-4 py-7 sm:px-6 lg:px-10 lg:py-9 [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-b-0 lg:[&:not(:last-child)]:border-r"
            >
              <Icon className="mt-0.5 size-6 shrink-0 text-royal" strokeWidth={1.6} aria-hidden="true" />
              <div>
                <h3 className="text-[1.05rem] font-[640] text-midnight [font-stretch:112%]">{item.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
