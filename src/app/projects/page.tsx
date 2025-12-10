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

      {/* Simple Contact Section */}
      <section className="simple-contact-section">
        <div className="padding-global">
          <div className="container-large">
            <div className="simple-contact-content">
              <h2 className="simple-contact-title">Let's Work Together</h2>
              <p className="simple-contact-subtitle">Ready to start your next project? Get in touch with us.</p>
              <a 
                href="https://wa.me/15551234567?text=Hi%20there!%20I%27d%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="simple-contact-btn"
              >
                <svg className="whatsapp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
