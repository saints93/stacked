import { NextRequest, NextResponse } from "next/server";
import {
  getProjectBySlug,
  updateProject,
  deleteProject,
  isDevelopment,
  type Project,
} from "@/lib/cms";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

// GET /api/projects/[slug] - Get a single project
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    const project = getProjectBySlug(
      slug,
      isDevelopment() && includeUnpublished
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[slug] - Update a project
export async function PUT(request: NextRequest, { params }: RouteContext) {
  // Only allow in development mode
  if (!isDevelopment()) {
    return NextResponse.json(
      { error: "Project updates are only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const updates = body as Partial<Project>;

    const result = updateProject(slug, updates);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Project not found" ? 404 : 400 }
      );
    }

    return NextResponse.json({ success: true, slug: updates.slug || slug });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[slug] - Delete a project
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  // Only allow in development mode
  if (!isDevelopment()) {
    return NextResponse.json(
      { error: "Project deletion is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const { slug } = await params;

    const result = deleteProject(slug);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Project not found" ? 404 : 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
