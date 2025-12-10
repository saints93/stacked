import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getPublishedProjects } from "@/lib/cms";
import GallerySlider from "@/components/GallerySlider";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: "Project Not Found" };
  }
  return {
    title: `${project.name} | Stacked`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projects = getPublishedProjects();
  const nextProject =
    projects.find((p) => p.slug === project.nextProjectSlug) ?? projects[0];

  const rawHeroImages =
    project.heroImages && project.heroImages.length > 0
      ? project.heroImages
      : project.mainImage
      ? [project.mainImage]
      : [];

  // Filter out legacy Webflow CDN images so only explicitly uploaded
  // project assets (e.g. /projects/ghostbets/...) are used as the hero.
  const heroImages = rawHeroImages.filter(
    (src) => src && !src.startsWith("https://cdn.prod.website-files.com")
  );

  const galleryImages =
    project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : project.images ?? [];

  const isVideo = (src?: string) =>
    !!src && /\.(mp4|webm|mov)$/i.test(src);

  // Hero images (non-video) are pushed into the gallery
  const heroImageGallery = heroImages.filter(
    (src) => src && !isVideo(src)
  );

  const combinedGallery = Array.from(
    new Set([...heroImageGallery, ...galleryImages])
  );

  // Hero 1 = video (if video), Hero 2 = image poster
  const hero1 = heroImages[0];
  const hero2 = heroImages[1];

  const mainHeroVideo = isVideo(hero1) ? hero1 : undefined;

  // If there is a hero video, show it as the first gallery "card"
  const galleryMedia = mainHeroVideo
    ? [mainHeroVideo, ...combinedGallery]
    : combinedGallery;

  const heroPoster =
    (!isVideo(hero2) && hero2) ||
    heroImages.find((src) => src && !isVideo(src)) ||
    galleryImages.find((src) => src && !isVideo(src)) ||
    hero1 ||
    hero2;

  return (
    <>
      {/* Hero Section */}
      <header className="project-hero">
        <div className="padding-global">
          <div className="container-large">
            <div className="project-hero-content">
              <div className="project-hero-info">
                <div className="project-meta-row">
                  <span className="project-service">{project.service}</span>
                  <span className="project-divider">•</span>
                  <span className="project-year">{project.year}</span>
                </div>
                <h1 className="project-title">{project.name}</h1>
                <p className="project-description">
                  {project.shortDescription}
                </p>
                {project.websiteLink && (
                  <a
                    href={project.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    View Live Project →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Media */}
      {(mainHeroVideo || heroPoster) && (
        <section className="project-main-image">
          <div className="padding-global">
            <div className="container-large">
              <div className="main-image-wrapper">
                {mainHeroVideo ? (
                  <video
                    src={mainHeroVideo}
                    className="main-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster={heroPoster}
                  />
                ) : (
                  heroPoster && (
                    <img
                      src={heroPoster}
                      alt={project.name}
                      className="main-image"
                    />
                  )
                )}
              </div>
              {/* Only show a secondary hero image when there is no video */}
              {!mainHeroVideo && hero2 && !isVideo(hero2) && (
                <div className="secondary-hero-wrapper">
                  <img
                    src={hero2}
                    alt={`${project.name} secondary`}
                    className="secondary-hero-image"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Overview Section */}
      <section className="project-section project-section-overview">
        <div className="padding-global">
          <div className="container-large">
            <div className="project-content-grid">
              <div className="project-section-label">
                <div className="section-indicator">
                  <div className="indicator-dot" />
                  <span>Overview</span>
                </div>
              </div>
              <div className="project-section-content">
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: project.overviewHtml }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="project-section project-section-challenges">
        <div className="padding-global">
          <div className="container-large">
            <div className="project-content-grid">
              <div className="project-section-label">
                <div className="section-indicator">
                  <div className="indicator-dot" />
                  <span>Challenges</span>
                </div>
              </div>
              <div className="project-section-content">
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: project.challengesHtml }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Gallery */}
      {galleryMedia.length > 0 && (
        <section className="project-gallery-horizontal">
          <div className="padding-global">
            <div className="container-large">
              <div className="gallery-header">
                <div className="section-indicator">
                  <div className="indicator-dot" />
                  <span>Gallery</span>
                </div>
              </div>
              <GallerySlider images={galleryMedia} projectName={project.name} />
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      {project.testimonial && project.testimonial.name && (
        <section className="project-testimonial">
          <div className="padding-global">
            <div className="container-large">
              <div className="testimonial-wrapper">
                <div className="testimonial-quote">
                  <span className="quote-mark">"</span>
                  <p className="quote-text">{project.testimonial.quote}</p>
                </div>
                <div className="testimonial-author">
                  {project.testimonial.picture && (
                    <img
                      src={project.testimonial.picture}
                      alt={project.testimonial.name}
                      className="author-image"
                    />
                  )}
                  <div className="author-info">
                    <span className="author-name">
                      {project.testimonial.name}
                    </span>
                    <span className="author-title">
                      {project.testimonial.subtitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Next Project Section */}
      {nextProject && nextProject.slug !== project.slug && (
        <section className="next-project">
          <div className="padding-global">
            <div className="container-large">
              <div className="divider-line" />
              <div className="next-project-content">
                <span className="next-label">Next Project</span>
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="next-project-link"
                >
                  <h2 className="next-project-name">{nextProject.name}</h2>
                  <div className="next-project-arrow">→</div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
