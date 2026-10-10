"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Project } from "@/content/projects";
import { projectWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

type Props = {
  projects: Project[];
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  categoryLabel: (id: string) => string;
};

export function ProjectLightbox({ projects, index, onIndexChange, onClose, categoryLabel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const project = index !== null ? projects[index] : null;

  // Open/close the native modal dialog (gives us focus trapping and Escape for free).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!project && dialog.open) dialog.close();
  }, [project]);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!project || index === null) return;
      const next = mediaIndex + dir;
      if (next >= 0 && next < project.media.length) {
        setMediaIndex(next);
        return;
      }
      // Past the last/first photo: move to the neighbouring project.
      const ni = (index + dir + projects.length) % projects.length;
      onIndexChange(ni);
      setMediaIndex(dir === 1 ? 0 : projects[ni].media.length - 1);
    },
    [project, index, mediaIndex, projects, onIndexChange],
  );

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, step]);

  const handleClose = () => {
    document.body.style.overflow = "";
    setMediaIndex(0);
    onClose();
  };

  const media = project?.media[mediaIndex];

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-labelledby="lightbox-title"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-white open:flex"
    >
      {project && media ? (
        <div className="fade-scale flex h-full w-full flex-col lg:flex-row" onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}>
          {/* Media stage */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-2 pt-16 sm:px-16 lg:py-10">
            {media.type === "image" ? (
              <Image
                key={media.src}
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                sizes="(min-width: 1024px) 65vw, 100vw"
                loading="eager"
                placeholder="blur"
                blurDataURL={media.blur}
                className="fade-scale max-h-full w-auto max-w-full rounded-[3px] object-contain shadow-2xl"
                style={{ maxHeight: "min(100%, 86dvh)" }}
              />
            ) : (
              <video
                key={media.src}
                src={media.src}
                poster={media.poster}
                controls
                playsInline
                muted
                autoPlay
                preload="metadata"
                aria-label={media.alt}
                className="fade-scale max-h-full max-w-full rounded-[3px] bg-black shadow-2xl"
                style={{ maxHeight: "min(100%, 86dvh)" }}
              />
            )}

            <button
              type="button"
              onClick={() => step(-1)}
              className="glass-dark absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-white/15 sm:left-4"
              aria-label="Previous"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="glass-dark absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full transition hover:bg-white/15 sm:right-4"
              aria-label="Next"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          {/* Details panel */}
          <aside className="glass-dark max-h-[42dvh] shrink-0 overflow-y-auto border-t border-white/10 p-5 sm:p-7 lg:max-h-none lg:w-[24rem] lg:border-l lg:border-t-0 lg:pt-20">
            <p className="text-sm text-white/65">
              {project.categories.map(categoryLabel).join(", ")}
            </p>
            <h3 id="lightbox-title" className="mt-1.5 text-2xl font-[650] [font-stretch:115%]">
              {project.title}
            </h3>
            {project.categories.map(categoryLabel).join(", ") !== project.workType ? (
              <p className="mt-1 text-sm font-medium text-white/80">{project.workType}</p>
            ) : null}
            <p className="mt-4 leading-relaxed text-white/80">{project.description}</p>
            {project.details?.length ? (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/75">
                {project.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : null}

            {project.media.length > 1 ? (
              <div className="mt-6">
                <p className="text-sm text-white/60" aria-live="polite">
                  {mediaIndex + 1} of {project.media.length}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.media.map((m, i) => (
                    <button
                      key={m.src}
                      type="button"
                      onClick={() => setMediaIndex(i)}
                      aria-label={`Show ${m.type === "video" ? "video" : `photo ${i + 1}`}`}
                      aria-current={i === mediaIndex}
                      className={`relative size-16 overflow-hidden rounded-[3px] ring-offset-2 ring-offset-midnight transition ${
                        i === mediaIndex ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={m.type === "image" ? m.src : m.poster}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      {m.type === "video" ? (
                        <span className="absolute inset-0 grid place-items-center bg-black/40 text-[0.65rem] font-semibold">
                          Video
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-7 grid gap-2.5">
              <a
                href={projectWhatsAppLink(project.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-whatsapp text-white hover:brightness-95"
              >
                <WhatsAppIcon className="size-4" /> Ask about a project like this
              </a>
              <Link href="/quote" className="btn btn-ghost-light" onClick={() => dialogRef.current?.close()}>
                Request a Free Quote
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/50">
              Project {index! + 1} of {projects.length}. Use the arrow keys to browse.
            </p>
          </aside>

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="glass-dark absolute right-3 top-3 inline-flex size-12 items-center justify-center rounded-full transition hover:bg-white/15 sm:right-5 sm:top-5"
            aria-label="Close project view"
          >
            <X className="size-6" />
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
