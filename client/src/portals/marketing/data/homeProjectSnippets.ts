import {
  marketingGalleryProjects,
  marketingHomeEvidenceSlugs,
} from "@shared/marketing-content";

export const homeProjectSnippets = marketingHomeEvidenceSlugs
  .map((slug) =>
    marketingGalleryProjects.find((project) => project.slug === slug),
  )
  .filter((project): project is (typeof marketingGalleryProjects)[number] => Boolean(project))
  .map((project) => ({
    id: project.id,
    slug: project.slug,
    category: project.category,
    title: project.title,
    location: project.location,
    meta: project.homeMeta,
    proof: project.homeProof,
    markerId: project.markerId,
    tone: project.status,
  }));
