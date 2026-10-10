"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Images, Play } from "lucide-react";
import { projectCategories, projects, type Project } from "@/content/projects";
import { GALLERY_FILTER_EVENT } from "@/lib/galleryFilter";
import { whatsappLink } from "@/lib/whatsapp";
import { ProjectFilter } from "./ProjectFilter";
import { ProjectLightbox } from "./ProjectLightbox";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

type CategoryId = (typeof projectCategories)[number]["id"];
const INITIAL_COUNT = 9;

const categoryLabel = (id: string) => projectCategories.find((c) => c.id === id)?.label ?? id;

export function ProjectGallery() {
  const [filter, setFilter] = useState<CategoryId>("all");
  const [showAll, setShowAll] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter],
  );
  const visible = filter === "all" && !showAll ? filtered.slice(0, INITIAL_COUNT) : filtered;

  const counts = useMemo(() => {
    const c = Object.fromEntries(projectCategories.map((cat) => [cat.id, 0])) as Record<CategoryId, number>;
    c.all = projects.length;
    for (const p of projects) for (const cat of p.categories) c[cat] += 1;
    return c;
  }, []);

  // Service cards can request a filter (e.g. "See projects" on Shower Cubicles).
  useEffect(() => {
    const onFilter = (e: Event) => {
      const id = (e as CustomEvent<CategoryId>).detail;
      if (projectCategories.some((c) => c.id === id)) {
        setFilter(id);
        setShowAll(true);
      }
    };
    window.addEventListener(GALLERY_FILTER_EVENT, onFilter);
    return () => window.removeEventListener(GALLERY_FILTER_EVENT, onFilter);
  }, []);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative overflow-hidden bg-midnight py-20 text-white sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(60%_100%_at_20%_0%,rgba(48,53,143,0.75),transparent)]"
      />
      <div className="relative mx-auto max-w-[86rem] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="projects-heading" className="sash text-[length:var(--text-h2)] font-[640]">
              Work we&rsquo;ve completed.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              Real photographs from our sites — homes, bathrooms, offices and building exteriors. Select any project to
              see it larger.
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <a
              href={whatsappLink(
                "Hello Whaliyy Aluminium Concept, I've been looking at your projects and would like to discuss something similar.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-light"
            >
              <WhatsAppIcon className="size-4" /> Discuss a project on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10">
          <ProjectFilter
            active={filter}
            counts={counts}
            onChange={(id) => {
              setFilter(id);
              setShowAll(id !== "all");
            }}
          />
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"} in {categoryLabel(filter)}
        </p>

        {filtered.length === 0 ? (
          <p className="mt-12 text-white/70">No projects in this category yet.</p>
        ) : (
          <ul key={filter} className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {visible.map((project, i) => (
              <li key={project.id} className="fade-scale mb-5 break-inside-avoid" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <ProjectCard project={project} onOpen={() => setOpenIndex(filtered.indexOf(project))} />
              </li>
            ))}
          </ul>
        )}

        {filter === "all" && !showAll && filtered.length > INITIAL_COUNT ? (
          <div className="mt-6 flex justify-center">
            <button type="button" className="btn btn-ghost-light" onClick={() => setShowAll(true)}>
              Show all {filtered.length} projects
            </button>
          </div>
        ) : null}

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-white/15 pt-10 sm:flex-row sm:items-center">
          <p className="text-[clamp(1.6rem,1.2rem+1.4vw,2.5rem)] font-[640] leading-tight [font-stretch:118%]">
            Your vision. Our craftsmanship.
          </p>
          <Link href="/quote" className="btn btn-light shrink-0">
            Start Your Project
          </Link>
        </div>
      </div>

      <ProjectLightbox
        projects={filtered}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
        categoryLabel={categoryLabel}
      />
    </section>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const cover = project.media[0];
  const coverImage = cover.type === "image" ? cover : null;
  const photoCount = project.media.filter((m) => m.type === "image").length;
  const hasVideo = project.media.some((m) => m.type === "video");

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-[4px] bg-midnight-900 text-left ring-1 ring-white/10 focus-visible:ring-2 focus-visible:ring-signal"
      aria-label={`View project: ${project.title} (${project.workType})`}
    >
      {coverImage ? (
        <Image
          src={coverImage.src}
          alt={coverImage.alt}
          width={coverImage.width}
          height={coverImage.height}
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
          placeholder="blur"
          blurDataURL={coverImage.blur}
          className="h-auto w-full transition-transform duration-700 ease-[var(--ease-glide)] group-hover:scale-[1.035]"
        />
      ) : null}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight-900/90 via-midnight-900/10 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <span>
          <span className="block text-[0.8rem] font-medium text-white/70">{project.workType}</span>
          <span className="mt-1 block text-[1.15rem] font-[640] leading-snug [font-stretch:112%]">{project.title}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-white/80">
          {hasVideo ? (
            <span className="glass-dark inline-flex items-center gap-1 rounded-full px-2.5 py-1">
              <Play className="size-3" aria-hidden="true" /> Video
            </span>
          ) : null}
          {photoCount > 1 ? (
            <span className="glass-dark inline-flex items-center gap-1 rounded-full px-2.5 py-1">
              <Images className="size-3" aria-hidden="true" /> {photoCount}
            </span>
          ) : null}
        </span>
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        View project
      </span>
    </button>
  );
}
