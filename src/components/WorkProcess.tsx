import { processSteps } from "@/content/copy";
import { SectionHeading } from "./SectionHeading";

export function WorkProcess() {
  return (
    <section aria-labelledby="process-heading" className="border-y border-midnight/10 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[86rem] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          id="process-heading"
          title="From first message to finished installation."
          intro="A clear, four-step process so you always know what happens next."
        />
        <ol className="relative mt-14 grid gap-10 lg:grid-cols-4 lg:gap-8">
          {/* Timeline rail: vertical on mobile, horizontal on desktop */}
          <span aria-hidden="true" className="absolute bottom-2 left-[1.375rem] top-2 w-px bg-alu/60 lg:hidden" />
          <span aria-hidden="true" className="absolute left-0 right-0 top-[1.375rem] hidden h-px bg-alu/60 lg:block" />
          {processSteps.map((step, i) => (
            <li key={step.title} className="relative grid grid-cols-[2.75rem_1fr] gap-5 lg:block">
              <span className="relative z-10 flex size-11 items-center justify-center rounded-full border border-royal/25 bg-white text-sm font-semibold tabular-nums text-royal shadow-[0_0_0_6px_white]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="lg:mt-7 lg:pr-6">
                <h3 className="text-[1.2rem] font-[640] text-midnight [font-stretch:114%]">{step.title}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
