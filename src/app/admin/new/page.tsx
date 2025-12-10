"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

type ProjectSummary = {
  slug: string;
  name: string;
};

export default function NewProjectPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects?includeUnpublished=true");
        const data = await res.json();
        if (data.projects) {
          setProjects(data.projects.map((p: ProjectSummary) => ({ slug: p.slug, name: p.name })));
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

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
        .loading {
          color: #666;
          padding: 2rem;
        }
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .admin-container {
            padding: 1.5rem 1rem;
          }
          .admin-header {
            margin-bottom: 1.5rem;
            padding-bottom: 0.75rem;
          }
          .admin-title {
            font-size: 1.25rem;
          }
          .back-link {
            font-size: 0.8rem;
          }
        }
        
        @media (max-width: 480px) {
          .admin-container {
            padding: 1rem 0.75rem;
          }
          .admin-title {
            font-size: 1.1rem;
          }
          .back-link {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <Link href="/admin" className="back-link">
        ← Back to Projects
      </Link>

      <div className="admin-header">
        <h1 className="admin-title">New Project</h1>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <ProjectForm allProjects={projects} />
      )}
    </div>
  );
}
