import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { isDevelopment } from "@/lib/cms";

// POST /api/upload - Upload an image or video
export async function POST(request: NextRequest) {
  // Only allow in development mode
  if (!isDevelopment()) {
    return NextResponse.json(
      { error: "Media upload is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const projectSlug = formData.get("projectSlug") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (support images + hero videos)
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
    ];

    const mimeType = file.type || "";
    const fileName = file.name.toLowerCase();

    const isAllowed =
      allowedTypes.includes(mimeType) ||
      mimeType.toLowerCase().includes("webm") ||
      fileName.endsWith(".webm") ||
      fileName.endsWith(".mp4");

    if (!isAllowed) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG, MP4, WEBM",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB to allow hero videos)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB" },
        { status: 400 }
      );
    }

    // Generate filename
    const ext = path.extname(file.name) || getExtensionFromMimeType(file.type);
    const timestamp = Date.now();
    const safeName = file.name
      .replace(ext, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const filename = `${safeName}-${timestamp}${ext}`;

    // Determine upload directory
    let uploadDir: string;
    let publicPath: string;

    if (projectSlug) {
      // Project-specific uploads go to /public/projects/[slug]/
      uploadDir = path.join(process.cwd(), "public", "projects", projectSlug);
      publicPath = `/projects/${projectSlug}/${filename}`;
    } else {
      // General uploads go to /public/uploads/
      uploadDir = path.join(process.cwd(), "public", "uploads");
      publicPath = `/uploads/${filename}`;
    }

    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: publicPath,
      filename,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
  };
  return mimeToExt[mimeType] || ".bin";
}
