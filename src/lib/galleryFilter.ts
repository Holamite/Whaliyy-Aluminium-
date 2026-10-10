import type { ProjectCategoryId } from "@/content/projects";

/** Lets service cards (and anything else) switch the gallery filter. */
export const GALLERY_FILTER_EVENT = "whaliyy:gallery-filter";

export function requestGalleryFilter(id: ProjectCategoryId | "all") {
  window.dispatchEvent(new CustomEvent(GALLERY_FILTER_EVENT, { detail: id }));
}
