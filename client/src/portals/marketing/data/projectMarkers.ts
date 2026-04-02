import {
  marketingGalleryProjects,
  marketingHomeEvidenceSlugs,
} from "@shared/marketing-content";

export const projectMarkers = marketingHomeEvidenceSlugs
  .map((slug) =>
    marketingGalleryProjects.find((project) => project.slug === slug),
  )
  .filter((project): project is (typeof marketingGalleryProjects)[number] => Boolean(project))
  .map((project) => ({
    id: project.markerId,
    label: project.title,
    lat: project.coordinates.lat,
    lng: project.coordinates.lng,
    tone: project.status,
    slug: project.slug,
  }));
