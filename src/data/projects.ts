// This file is now a re-export from the CMS library for backwards compatibility
// The actual data is stored in content/projects/*.json files

export type { Project } from "@/lib/cms";
export {
  getPublishedProjects as getProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getPublishedProjects,
} from "@/lib/cms";

// For static generation, we need to get all project slugs
import { getAllProjectsIncludingDrafts, getPublishedProjects } from "@/lib/cms";

export function getAllProjectSlugs(): string[] {
  const projects = getPublishedProjects();
  return projects.map((p) => p.slug);
}

// Get all projects as an array (for backwards compatibility)
export function projects() {
  return getPublishedProjects();
}
