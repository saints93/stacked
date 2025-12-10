"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";

type ProjectData = {
  name: string;
  slug: string;
  published: boolean;
  featuredOnHomepage: boolean;
  homepageOrder: number;
  heroImages: string[];
  galleryImages: string[];
  // Legacy fields for compatibility with older JSON
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
};

type ProjectSummary = {
  slug: string;
  name: string;
};

export default function EditProjectPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [allProjects, setAllProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the project to edit
        const projectRes = await fetch(`/api/projects/${slug}?includeUnpublished=true`);
        const projectData = await projectRes.json();

        if (projectData.error) {
          setError(projectData.error);
          setLoading(false);
          return;
        }

        setProject(projectData.project);

        // Fetch all projects for the "next project" dropdown
        const allRes = await fetch("/api/projects?includeUnpublished=true");
        const allData = await allRes.json();

        if (allData.projects) {
          setAllProjects(allData.projects.map((p: ProjectSummary) => ({ slug: p.slug, name: p.name })));
        }
      } catch (err) {
        setError("Failed to load project");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="admin-container">
        <style jsx>{`
          .admin-container {
            min-height: 100vh;
            background: #0a0a0a;
            color: #fff;
            padding: 2rem;
          }
          .loading {
            color: #666;
            padding: 2rem;
          }
        `}</style>
        <div className="loading">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="admin-container">
        <style jsx>{`
          .admin-container {
            min-height: 100vh;
            background: #0a0a0a;
            color: #fff;
            padding: 2rem;
          }
          .error {
            color: #dc2626;
            padding: 2rem;
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
        `}</style>
        <Link href="/admin" className="back-link">
          ← Back to Projects
        </Link>
        <div className="error">{error || "Project not found"}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fff;
          padding: 2rem;
        }
        .admin-header {
          margin-bottom: 2rem;
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
      `}</style>

      <Link href="/admin" className="back-link">
        ← Back to Projects
      </Link>

      <div className="admin-header">
        <h1 className="admin-title">Edit Project</h1>
        <p className="admin-subtitle">{project.name}</p>
      </div>

      <ProjectForm initialData={project} isEditing={true} allProjects={allProjects} />
    </div>
  );
}
