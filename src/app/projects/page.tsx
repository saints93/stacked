import Link from "next/link";
import { getPublishedProjects } from "@/lib/cms";

export const metadata = {
  title: "Projects | Stacked",
  description: "Discover the creativity and impact behind our projects.",
};

const isVideo = (src?: string) =>
  !!src && /\.(mp4|webm|mov)$/i.test(src as string);

const getThumbnail = (project: any) => {
  const hero = project.heroImages || [];
  const gallery = project.galleryImages || project.images || [];

  // Prefer Hero 2 as poster if it is an image
  const heroPoster = hero[1];
  if (heroPoster && !isVideo(heroPoster)) return heroPoster;

  // Otherwise use first non-video hero media
  const heroImage = hero.find((src: string) => src && !isVideo(src));
  if (heroImage) return heroImage;

  // Fallback to first non-video gallery image
  const galleryImage = gallery.find((src: string) => src && !isVideo(src));
  if (galleryImage) return galleryImage;

  // Last resort placeholder
  return project.mainImage || "/images/image.svg";
};

export default function ProjectsPage() {
  const projects = getPublishedProjects();

  return (
    <>
      <header className="section-projects-header">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-top-header">
              <div className="max-width-large align-center">
                <h1 className="heading-style-h1 text-align-center">
                  Selected Projects
                </h1>
              </div>
              <div className="max-width-medium align-center">
                <p className="text-size-small text-align-center">
                  Discover the creativity and impact behind our projects. From
                  innovative designs to strategic campaigns, these selected
                  works showcase our commitment to excellence and client
                  success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="section-projects-content">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-section-medium">
              <div
                id="w-node-_622f7e8c-b316-df88-a3ac-ba004b217994-4b217994"
                className="projects-wrapper"
              >
                <div className="project-content-wrapper">
                  <div className="w-dyn-list">
                    <div
                      role="list"
                      className="project-inner-grid w-dyn-items"
                    >
                      {projects.map((project) => (
                        <div
                          role="listitem"
                          className="w-dyn-item"
                          key={project.slug}
                        >
                          <Link
                            href={`/projects/${project.slug}`}
                            className="project-link-item w-inline-block"
                          >
                            <div className="project-content">
                              <div className="project-image-wrapper">
                                <img
                                  src={getThumbnail(project)}
                                  loading="lazy"
                                  alt={project.name}
                                  className="project-image"
                                />
                              </div>
                            </div>
                            <div
                              data-w-id="622f7e8c-b316-df88-a3ac-ba004b21799d"
                              className="project-thumbnail-wrapper"
                            >
                              <div className="project-thumbnail-block">
                                <img
                                  loading="lazy"
                                  src={getThumbnail(project)}
                                  alt={project.name}
                                  className="project-image"
                                />
                              </div>
                            </div>
                            <div className="project-name-block">
                              <div
                                data-w-id="622f7e8c-b316-df88-a3ac-ba004b2179a1"
                                className="project-name-wrapper"
                              >
                                <div className="project-name-link">
                                  <h2 className="project-name">
                                    {project.name}
                                  </h2>
                                  <h2 className="project-name dash">–</h2>
                                  <h2 className="project-name">
                                    {project.service}
                                  </h2>
                                  <h2 className="project-name dash">–</h2>
                                  <h2 className="project-name">
                                    {project.year}
                                  </h2>
                                </div>
                                <div className="project-name-link">
                                  <h2 className="project-name">
                                    {project.name}
                                  </h2>
                                  <h2 className="project-name dash">–</h2>
                                  <h2 className="project-name">
                                    {project.service}
                                  </h2>
                                  <h2 className="project-name dash">–</h2>
                                  <h2 className="project-name">
                                    {project.year}
                                  </h2>
                                </div>
                              </div>
                            </div>
                            <div className="project-overlay" />
                          </Link>
                        </div>
                      ))}
                    </div>
                    {projects.length === 0 && (
                      <div className="empty-state w-dyn-empty">
                        <div>No items found.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        data-w-id="a0b9187c-72cd-0bcd-a761-4d69a8beda07"
        className="call-to-action"
      >
        <div className="call-to-action-sticky">
          <div className="call-to-action-wrapper">
            <div className="cta-image-block">
              {projects.slice(0, 6).map((project, index) => (
                <div key={project.slug} className={`cta-image-item _0${index + 1}`}>
                  <div className="cta-image-wrapper">
                    <img
                      sizes="(max-width: 1279px) 100vw, 1280px"
                      alt={project.name}
                      src={getThumbnail(project)}
                      loading="lazy"
                      className="cta-image"
                    />
                  </div>
                </div>
              ))}
              <Link
                data-w-id="a0b9187c-72cd-0bcd-a761-4d69a8beda1d"
                href="/contact"
                className="cta-link w-inline-block"
              >
                <div className="cta-text">Get in</div>
                <div className="cta-arrow w-embed">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path>
                  </svg>
                </div>
                <div className="cta-text">touch</div>
                <div className="cta-circle" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
