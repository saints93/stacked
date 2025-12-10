import { NextRequest, NextResponse } from "next/server";
import {
  getAllProjectsIncludingDrafts,
  getPublishedProjects,
  createProject,
  isDevelopment,
  type Project,
} from "@/lib/cms";

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    // Only allow unpublished projects in development mode
    const projects =
      isDevelopment() && includeUnpublished
        ? getAllProjectsIncludingDrafts()
        : getPublishedProjects();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  // Only allow in development mode
  if (!isDevelopment()) {
    return NextResponse.json(
      { error: "Project creation is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const project = body as Project;

    // Validate required fields
    if (!project.name || !project.slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const result = createProject(project);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, slug: project.slug });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
