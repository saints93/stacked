"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Project = {
  name: string;
  slug: string;
  published: boolean;
  featuredOnHomepage: boolean;
  homepageOrder: number;
  mainImage: string;
  heroImages?: string[];
  galleryImages?: string[];
  images?: string[];
  service: string;
  year: string;
  shortDescription: string;
  updatedAt: string;
};

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const isVideo = (src?: string) =>
    !!src && /\.(mp4|webm|mov)$/i.test(src || "");

  const getThumbnail = (project: Project) => {
    const hero = project.heroImages || [];
    const gallery = project.galleryImages || project.images || [];

    // Prefer Hero 2 as poster if it is an image
    const heroPoster = hero[1];
    if (heroPoster && !isVideo(heroPoster)) return heroPoster;

    // Otherwise use first non-video hero media
    const heroImage = hero.find((src) => src && !isVideo(src));
    if (heroImage) return heroImage;

    // Fallback to first non-video gallery image
    const galleryImage = gallery.find((src) => src && !isVideo(src));
    if (galleryImage) return galleryImage;

    // Last resort placeholder
    return "/images/image.svg";
  };

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects?includeUnpublished=true");
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setProjects(data.projects);
      }
    } catch (err) {
      setError("Failed to fetch projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublished(slug: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/projects/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  }

  async function deleteProject(slug: string) {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          background: #050505;
          color: #fff;
          padding: 2rem 1.5rem 3rem;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 auto 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #222;
        }
        .admin-title {
          font-size: 1.5rem;
          font-weight: 600;
        }
        .admin-subtitle {
          color: #666;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .admin-btn {
          padding: 0.55rem 1.2rem;
          background: #111;
          color: #f5f5f5;
          border: 1px solid #333;
          border-radius: 999px;
          font-weight: 500;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition:
            background-color 0.15s ease,
            border-color 0.15s ease,
            opacity 0.15s ease;
        }
        .admin-btn:hover {
          background: #181818;
          border-color: #555;
        }
        .admin-btn-outline {
          background: transparent;
          border-color: #333;
          color: #f5f5f5;
        }
        .admin-btn-outline:hover {
          background: #181818;
          border-color: #555;
        }
        .admin-btn-danger {
          background: #dc2626;
          border-color: #dc2626;
          color: #fff;
        }
        .admin-btn-danger:hover {
          background: #ef4444;
          border-color: #ef4444;
        }
        .admin-btn-small {
          padding: 0.4rem 0.9rem;
          font-size: 0.7rem;
        }
        .projects-grid {
          display: grid;
          gap: 1rem;
        }
        .project-card {
          display: grid;
          grid-template-columns: 72px 1fr auto;
          gap: 1rem;
          padding: 0.9rem 1rem;
          background: #0f0f0f;
          border: 1px solid #202020;
          border-radius: 10px;
          align-items: center;
        }
        .project-thumbnail {
          width: 80px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
          background: #222;
        }
        .project-info {
          min-width: 0;
        }
        .project-name {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .project-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: #666;
        }
        .project-status {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .status-published {
          background: #166534;
          color: #4ade80;
        }
        .status-draft {
          background: #854d0e;
          color: #fbbf24;
        }
        .status-featured {
          background: #1e40af;
          color: #60a5fa;
        }
        .project-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .admin-loading,
        .admin-error {
          text-align: center;
          padding: 4rem;
          color: #666;
        }
        .admin-error {
          color: #dc2626;
        }
        .empty-state {
          text-align: center;
          padding: 4rem;
          color: #666;
        }
        .back-link {
          color: #666;
          text-decoration: none;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          display: inline-block;
        }
        .back-link:hover {
          color: #fff;
        }
        @media (min-width: 1024px) {
          .admin-header,
          .projects-grid {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>

      <Link href="/" className="back-link">
        ← Back to Site
      </Link>

      <div className="admin-header">
        <div>
          <h1 className="admin-title">Project Manager</h1>
          <p className="admin-subtitle">
            {projects.length} project{projects.length !== 1 ? "s" : ""} • Development Mode
          </p>
        </div>
        <Link href="/admin/new" className="admin-btn">
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet.</p>
          <Link href="/admin/new" className="admin-btn" style={{ marginTop: "1rem" }}>
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.slug} className="project-card">
              <img
                src={getThumbnail(project)}
                alt={project.name}
                className="project-thumbnail"
              />
              <div className="project-info">
                <div className="project-name">{project.name}</div>
                <div className="project-meta">
                  <span>{project.service}</span>
                  <span>{project.year}</span>
                  <span>/{project.slug}</span>
                </div>
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  <span className={`project-status ${project.published ? "status-published" : "status-draft"}`}>
                    {project.published ? "Published" : "Draft"}
                  </span>
                  {project.featuredOnHomepage && (
                    <span className="project-status status-featured">
                      Featured #{project.homepageOrder}
                    </span>
                  )}
                </div>
              </div>
              <div className="project-actions">
                <button
                  type="button"
                  onClick={() => window.open(`/projects/${project.slug}`, "_blank")}
                  className="admin-btn admin-btn-outline admin-btn-small"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/admin/edit/${project.slug}`)}
                  className="admin-btn admin-btn-outline admin-btn-small"
                >
                  Edit
                </button>
                <button
                  onClick={() => togglePublished(project.slug, project.published)}
                  className="admin-btn admin-btn-outline admin-btn-small"
                >
                  {project.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => deleteProject(project.slug)}
                  className="admin-btn admin-btn-danger admin-btn-small"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
