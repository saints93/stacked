import fs from "fs";
import path from "path";

// Project type definition
export type Project = {
  name: string;
  slug: string;
  published: boolean;
  featuredOnHomepage: boolean;
  homepageOrder: number;
  // New fields
  heroImages: string[];
  galleryImages: string[];
  // Legacy image fields kept for compatibility
  mainImage?: string;
  images?: string[];
  service: string;
  year: string;
  shortDescription: string;
  overviewHtml: string;
  challengesHtml: string;
  websiteLink: string;
  testimonial: {
    picture: string;
    name: string;
    subtitle: string;
    quote: string;
  };
  nextProjectSlug: string;
  createdAt: string;
  updatedAt: string;
};

// Path to the content/projects directory
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

// Ensure the projects directory exists
function ensureProjectsDir() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  }
}

// Normalize raw JSON into a fully-populated Project object
function normalizeProject(raw: any): Project {
  const heroImages: string[] = Array.isArray(raw.heroImages)
    ? raw.heroImages.filter((x: unknown) => typeof x === "string")
    : [];

  // If no heroImages but we have a mainImage, seed from it
  if (heroImages.length === 0 && typeof raw.mainImage === "string" && raw.mainImage) {
    heroImages.push(raw.mainImage);
  }

  const galleryImages: string[] = Array.isArray(raw.galleryImages)
    ? raw.galleryImages.filter((x: unknown) => typeof x === "string")
    : Array.isArray(raw.images)
    ? raw.images.filter((x: unknown) => typeof x === "string")
    : [];

  const normalized: Project = {
    name: raw.name ?? "",
    slug: raw.slug ?? "",
    published: Boolean(raw.published),
    featuredOnHomepage: Boolean(raw.featuredOnHomepage),
    homepageOrder:
      typeof raw.homepageOrder === "number" ? raw.homepageOrder : 999,
    heroImages,
    galleryImages,
    mainImage:
      typeof raw.mainImage === "string" && raw.mainImage
        ? raw.mainImage
        : heroImages[0] ?? "",
    images:
      Array.isArray(raw.images) && raw.images.length > 0
        ? raw.images
        : galleryImages,
    service: raw.service ?? "",
    year: raw.year ?? "",
    shortDescription: raw.shortDescription ?? "",
    overviewHtml: raw.overviewHtml ?? "<h3>Overview</h3><p></p>",
    challengesHtml: raw.challengesHtml ?? "<h3>Challenges</h3><p></p>",
    websiteLink: raw.websiteLink ?? "",
    testimonial: {
      picture: raw.testimonial?.picture ?? "",
      name: raw.testimonial?.name ?? "",
      subtitle: raw.testimonial?.subtitle ?? "",
      quote: raw.testimonial?.quote ?? "",
    },
    nextProjectSlug: raw.nextProjectSlug ?? "",
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof raw.updatedAt === "string"
        ? raw.updatedAt
        : new Date().toISOString(),
  };

  return normalized;
}

// Get all projects from JSON files
export function getAllProjects(includeUnpublished = false): Project[] {
  ensureProjectsDir();

  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));

  const projects: Project[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(PROJECTS_DIR, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const raw = JSON.parse(content);
      const project = normalizeProject(raw);

      // In production, only include published projects
      // In development, include all if includeUnpublished is true
      const isDev = process.env.NODE_ENV === "development";
      if (project.published || (isDev && includeUnpublished)) {
        projects.push(project);
      }
    } catch (error) {
      console.error(`Error reading project file ${file}:`, error);
    }
  }

  return projects.sort((a, b) => {
    // Sort by homepageOrder first, then by name
    if (a.homepageOrder !== b.homepageOrder) {
      return a.homepageOrder - b.homepageOrder;
    }
    return a.name.localeCompare(b.name);
  });
}

// Get published projects only
export function getPublishedProjects(): Project[] {
  return getAllProjects(false);
}

// Get all projects including drafts (for admin)
export function getAllProjectsIncludingDrafts(): Project[] {
  return getAllProjects(true);
}

// Get a single project by slug
export function getProjectBySlug(
  slug: string,
  includeUnpublished = false
): Project | null {
  ensureProjectsDir();

  const filePath = path.join(PROJECTS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const raw = JSON.parse(content);
    const project = normalizeProject(raw);

    // Check if we should return unpublished projects
    const isDev = process.env.NODE_ENV === "development";
    if (project.published || (isDev && includeUnpublished)) {
      return project;
    }
    return null;
  } catch (error) {
    console.error(`Error reading project ${slug}:`, error);
    return null;
  }
}

// Get projects featured on homepage
export function getFeaturedProjects(): Project[] {
  const projects = getPublishedProjects();
  return projects
    .filter((p) => p.featuredOnHomepage)
    .sort((a, b) => a.homepageOrder - b.homepageOrder);
}

// Create a new project
export function createProject(project: Project): { success: boolean; error?: string } {
  ensureProjectsDir();

  const filePath = path.join(PROJECTS_DIR, `${project.slug}.json`);

  // Check if project already exists
  if (fs.existsSync(filePath)) {
    return { success: false, error: "Project with this slug already exists" };
  }

  try {
    const now = new Date().toISOString();
    const projectWithDates: Project = {
      ...project,
      createdAt: project.createdAt || now,
      updatedAt: now,
      // Ensure legacy fields are in sync
      mainImage: project.heroImages?.[0] || project.mainImage || "",
      images: project.galleryImages ?? project.images ?? [],
    };

    fs.writeFileSync(filePath, JSON.stringify(projectWithDates, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project file" };
  }
}

// Update an existing project
export function updateProject(
  slug: string,
  updates: Partial<Project>
): { success: boolean; error?: string } {
  ensureProjectsDir();

  const filePath = path.join(PROJECTS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return { success: false, error: "Project not found" };
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const existingRaw = JSON.parse(content);
    const existingProject = normalizeProject(existingRaw);

    const merged: Project = {
      ...existingProject,
      ...updates,
      heroImages: updates.heroImages ?? existingProject.heroImages,
      galleryImages: updates.galleryImages ?? existingProject.galleryImages,
      updatedAt: new Date().toISOString(),
    };

    // Keep legacy fields in sync
    merged.mainImage = merged.heroImages?.[0] || merged.mainImage || "";
    merged.images = merged.galleryImages ?? merged.images ?? [];

    // If slug changed, rename the file
    if (updates.slug && updates.slug !== slug) {
      const newFilePath = path.join(PROJECTS_DIR, `${updates.slug}.json`);
      if (fs.existsSync(newFilePath)) {
        return {
          success: false,
          error: "A project with the new slug already exists",
        };
      }
      fs.writeFileSync(newFilePath, JSON.stringify(merged, null, 2), "utf-8");
      fs.unlinkSync(filePath);
    } else {
      fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), "utf-8");
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

// Delete a project
export function deleteProject(slug: string): { success: boolean; error?: string } {
  ensureProjectsDir();

  const filePath = path.join(PROJECTS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return { success: false, error: "Project not found" };
  }

  try {
    fs.unlinkSync(filePath);
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

// Generate a slug from a name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Get a template for a new project
export function getProjectTemplate(): Omit<Project, "createdAt" | "updatedAt"> {
  return {
    name: "",
    slug: "",
    published: false,
    featuredOnHomepage: false,
    homepageOrder: 999,
    heroImages: [],
    galleryImages: [],
    mainImage: "",
    images: [],
    service: "",
    year: new Date().getFullYear().toString(),
    shortDescription: "",
    overviewHtml: "<h3>Overview</h3><p></p>",
    challengesHtml: "<h3>Challenges</h3><p></p>",
    websiteLink: "",
    testimonial: {
      picture: "",
      name: "",
      subtitle: "",
      quote: "",
    },
    nextProjectSlug: "",
  };
}

// Check if we're in development mode
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}
