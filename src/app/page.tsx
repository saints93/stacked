import Link from "next/link";
import { getFeaturedProjects, getPublishedProjects } from "@/lib/cms";
// import HeroStackAnimation from "@/components/HeroStackAnimation";
import HeroGalleryWall from "@/components/HeroGalleryWall";

const isVideo = (src?: string) =>
  !!src && /\.(mp4|webm|mov)$/i.test(src as string);

const getHeroBackground = (project: any) => {
  const hero = project.heroImages || [];
  const gallery = project.galleryImages || project.images || [];

  // Prefer Hero 2 as background if it is an image (poster / banner)
  const hero2 = hero[1];
  if (hero2 && !isVideo(hero2)) return hero2;

  // Otherwise use first non-video hero media
  const nonVideoHero = hero.find((src: string) => src && !isVideo(src));
  if (nonVideoHero) return nonVideoHero;

  // Fallback to first non-video gallery image
  const galleryImage = gallery.find((src: string) => src && !isVideo(src));
  if (galleryImage) return galleryImage;

  // Last resort fallback
  return project.mainImage || "/images/image.svg";
};

const getHeroInnerImage = (project: any) => {
  const hero = project.heroImages || [];

  // When there are 2 hero images and no video,
  // use Hero 1 (index 0) for the inner box on the homepage card.
  const hero1 = hero[0];
  if (hero1 && !isVideo(hero1)) return hero1;

  // Fallback to any non-video hero
  const nonVideoHero = hero.find((src: string) => src && !isVideo(src));
  if (nonVideoHero) return nonVideoHero;

  // Fallback to the same image used for the background
  return getHeroBackground(project);
};

const getHeroVideo = (project: any): string | null => {
  const hero = project.heroImages || [];

  const first = hero[0];
  if (first && isVideo(first)) return first;

  const anyVideo = hero.find((src: string) => src && isVideo(src));
  return anyVideo || null;
};

// Simple seeded random for consistent server/client results
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Fisher-Yates shuffle algorithm with seed for SSR consistency
const shuffleArray = <T,>(array: T[], seed: number = 42): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Home() {
  const featuredProjects = getFeaturedProjects();
  const allProjects = getPublishedProjects();

  // Get images for the homepage animations
  const projectImages = featuredProjects.length > 0
    ? featuredProjects
    : allProjects.slice(0, 6);

  // Collect ALL gallery images from ALL published projects for the header animation
  const allGalleryImages: string[] = [];
  allProjects.forEach((p: any) => {
    // Add gallery images
    const gallery = p.galleryImages || p.images || [];
    allGalleryImages.push(...gallery.filter((src: string) => src && !isVideo(src)));
    // Also add hero images (non-video)
    const hero = p.heroImages || [];
    allGalleryImages.push(...hero.filter((src: string) => src && !isVideo(src)));
    // Add main image if exists
    if (p.mainImage && !isVideo(p.mainImage)) {
      allGalleryImages.push(p.mainImage);
    }
  });

  // Get unique images and shuffle them deterministically (for SSR consistency)
  const uniqueGalleryImages = [...new Set(allGalleryImages)];
  // Use stable seed based on array length for consistent server/client rendering
  const shuffledImages = shuffleArray(uniqueGalleryImages, uniqueGalleryImages.length);
  // Pass more images for the animation (up to 50 for variety in the large grid)
  const uniqueHeaderImages = shuffledImages.slice(0, 50);

  const defaultImages = [
    "/images/Frame-4_2Frame 4.webp",
    "/images/Frame-21_1Frame 21.webp",
    "/images/Frame-20_1Frame 20.webp",
    "/images/Frame-15_1Frame 15.webp",
    "/images/Frame-18_1Frame 18.webp",
    "/images/Frame-9_1Frame 9.webp",
    "/images/Frame-17_1Frame 17.webp",
    "/images/Frame-12_1Frame 12.webp",
    "/images/Frame-11_1Frame 11.webp",
    "/images/Frame-19_1Frame 19.webp",
    "/images/Frame-3_1Frame 3.webp",
    "/images/Frame-6_1Frame 6.webp",
    "/images/Frame-1_1Frame 1.webp",
  ];

  // Ensure we have at least 20 images for good variety
  while (uniqueHeaderImages.length < 20) {
    uniqueHeaderImages.push(defaultImages[uniqueHeaderImages.length % defaultImages.length]);
  }

  return (
    <>
      <header className="section-home-header">
        <div className="w-layout-grid header-component-grid">
          <div
            id="w-node-aab418f6-d2a9-1dcb-1ba6-c27db90be681-92b96127"
            className="heading-wrapper"
          >
            <h1 className="header-heading">STACKED</h1>
            <div className="tm">TM</div>
          </div>
          <div
            id="w-node-df85a55d-780a-5a11-22b4-cd1172ceac5d-92b96127"
            className="padding-global"
          >
            <div className="container-large">
              <div className="w-layout-grid header-content-grid">
                <div
                  id="w-node-_508f2cb9-ebfc-ac7d-acfc-b1d77dc56a3b-92b96127"
                  className="header-content-item"
                >
                  <p className="header-text">
                    Where creativity meets strategy to shape your brand's
                    future.
                  </p>
                </div>
                <div
                  id="w-node-_24238a8e-fb55-4b6f-c1af-5594b281b9db-92b96127"
                  className="scroll-down-wrapper"
                >
                  <div className="alternate-text-container">
                    <div className="alternate-text-wrap">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="alternate-text-container-01">
                          <div className="alternate-text-item _01">
                            <div className="alternate-text">Scroll</div>
                          </div>
                          <div className="alternate-text-item _02">
                            <div className="alternate-text">Down</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="scroll-down-block">
                    <div className="square-bracket left">[</div>
                    <div className="arrow-down w-embed">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13.0001 16.1716L18.3641 10.8076L19.7783 12.2218L12.0001 20L4.22192 12.2218L5.63614 10.8076L11.0001 16.1716V4H13.0001V16.1716Z"></path>
                      </svg>
                    </div>
                    <div className="square-bracket right">]</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-image-wrapper">
          {/* <HeroStackAnimation images={uniqueHeaderImages} /> */}
          <HeroGalleryWall images={uniqueHeaderImages} />
        </div>
        <div className="header-opacity" />
      </header>

      <section className="section-home-about">
        <div className="padding-global">
          <div className="container-large">
            <div className="divider-line" />
            <div className="padding-section-large">
              <div className="w-layout-grid about-component-grid">
                <div
                  id="w-node-_3859a8ce-6d50-3d2e-ff9c-d371c9d92f05-92b96127"
                  className="subtitle-sticky"
                >
                  <div className="subtitle-wrapper">
                    <div className="square" />
                    <div className="subtitle">about us</div>
                  </div>
                </div>
                <div
                  id="w-node-_940fb4c2-f73e-e7c0-5fc6-320fd41fc1a6-92b96127"
                  className="max-width-medium"
                >
                  <p className="intro-text">
                    <span className="text-color-alternate">
                      As a full-service digital agency
                    </span>
                    , we specialize in crafting bespoke solutions that blend
                    creativity, technology, and strategy to transform ideas into
                    impactful experiences.
                  </p>
                </div>
              </div>
              <div className="spacer-huge" />
              <div
                data-w-id="483ec2dd-9ab8-6de8-16d7-70d78ff42f22"
                className="partner-row-wrapper"
              >
                {[1, 2, 3].map((rowIndex) => (
                  <div key={rowIndex} className="w-layout-grid partner-component-grid">
                    <div className="partner-item">
                      <img loading="lazy" src="/images/Springfield.svg" alt="" className="partner-logo" />
                    </div>
                    <div className="partner-item">
                      <img loading="lazy" src="/images/Delaware.svg" alt="" className="partner-logo" />
                    </div>
                    <div className="partner-item">
                      <img loading="lazy" src="/images/Sweden.svg" alt="" className="partner-logo" />
                    </div>
                    <div className="partner-item">
                      <img loading="lazy" src="/images/Umbrella.svg" alt="" className="partner-logo" />
                    </div>
                  </div>
                ))}
                <div className="partner-opacity left" />
                <div className="partner-opacity right" />
              </div>
              <div className="spacer-huge" />
              <div className="w-layout-grid about-component-grid">
                <div
                  id="w-node-_0fe7ab1d-f24a-4fb8-a91c-d03d0ec063b9-92b96127"
                  className="max-width-medium"
                >
                  <div className="spacer-medium" />
                  <div className="button-wrapper">
                    <Link href="/about" className="main-button w-inline-block">
                      <div className="link-button-wrap">
                        <div className="arrow-block">
                          <div className="arrow-button left-01 w-embed">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                            </svg>
                          </div>
                          <div className="arrow-button left-02 w-embed">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="button-container">
                          <div className="button-text">More About Us</div>
                          <div className="button-text is-hover">More About Us</div>
                        </div>
                        <div className="arrow-block">
                          <div className="arrow-button right-01 w-embed">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
                            </svg>
                          </div>
                          <div className="arrow-button right-02 w-embed">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="underline-wrapper">
                        <div className="underline-button" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-home-project">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-section-large">
              <div className="w-layout-grid projects-component-grid">
                <div
                  id="w-node-e2a62a85-638e-833e-aa9c-4dcae2f3f6a7-92b96127"
                  className="subtitle-sticky"
                >
                  <div className="subtitle-wrapper">
                    <div className="square" />
                    <div className="subtitle">Selected ©projects</div>
                  </div>
                </div>
                <div
                  id="w-node-_1a3942ec-f177-be44-057a-93d4486f9e0b-92b96127"
                  className="button-wrapper"
                >
                  <Link href="/contact" className="main-button w-inline-block">
                    <div className="link-button-wrap">
                      <div className="arrow-block">
                        <div className="arrow-button left-01 w-embed">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                          </svg>
                        </div>
                        <div className="arrow-button left-02 w-embed">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="button-container">
                        <div className="button-text">Get in touch</div>
                        <div className="button-text is-hover">Get in touch</div>
                      </div>
                      <div className="arrow-block">
                        <div className="arrow-button right-01 w-embed">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
                          </svg>
                        </div>
                        <div className="arrow-button right-02 w-embed">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="underline-wrapper">
                      <div className="underline-button" />
                    </div>
                  </Link>
                </div>
                <div className="projects-wrapper">
                  <div className="project-content-wrapper">
                    <div className="w-dyn-list">
                      <div className="project-inner-grid w-dyn-items">
                        {projectImages.slice(0, 4).map((project: any) => {
                          const heroVideo = getHeroVideo(project);
                          const heroBackground = getHeroBackground(project);
                          const heroInnerImage = getHeroInnerImage(project);

                          return (
                            <div className="w-dyn-item" key={project.slug}>
                              <Link
                                href={`/projects/${project.slug}`}
                                className="project-link-item w-inline-block"
                              >
                                <div className="project-content">
                                  <div className="project-image-wrapper">
                                    {/* Outer background: static hero/banner image */}
                                    <img
                                      src={heroBackground}
                                      loading="lazy"
                                      alt={project.name}
                                      className="project-image"
                                    />
                                  </div>
                                </div>
                                <div className="project-thumbnail-wrapper">
                                  <div className="project-thumbnail-block">
                                    {heroVideo ? (
                                      <video
                                        src={heroVideo}
                                        className="project-image"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                      />
                                    ) : (
                                      <img
                                        loading="lazy"
                                        src={heroInnerImage}
                                        alt={project.name}
                                        className="project-image"
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="project-label">
                                  <div className="project-label-name">
                                    {project.name}
                                  </div>
                                  {project.service && (
                                    <div className="project-label-service">
                                      {project.service}
                                    </div>
                                  )}
                                </div>
                                <div className="project-overlay" />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                      {projectImages.length === 0 && (
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
        </div>
      </section>

      <section className="section-home-service">
        <div className="padding-global">
          <div className="container-large">
            <div className="divider-line" />
            <div className="padding-section-large">
              <div className="w-layout-grid service-component-grid">
                <div className="subtitle-sticky">
                  <div className="subtitle-wrapper">
                    <div className="square" />
                    <div className="subtitle">Services we offer</div>
                  </div>
                </div>
                <div className="services-content-wrapper">
                  {[
                    {
                      title: "Branding",
                      image: projectImages[0]
                        ? getHeroBackground(projectImages[0])
                        : "/images/Frame-17_1Frame 17.webp",
                      text:
                        "• Crafting unique and memorable brand identities.\n" +
                        "• Developing cohesive visual and verbal brand guidelines.\n" +
                        "• Positioning brands strategically to connect with target audiences.\n" +
                        "• Creating logos, color schemes, and brand assets that resonate.",
                    },
                    {
                      title: "Design",
                      image: projectImages[1]
                        ? getHeroBackground(projectImages[1])
                        : "/images/Frame-9_1Frame 9.webp",
                      text:
                        "• Designing user-friendly, visually stunning websites.\n" +
                        "• Developing responsive, SEO-optimized platforms.\n" +
                        "• Integrating modern features for seamless functionality.\n" +
                        "• Providing ongoing maintenance and performance enhancements.",
                    },
                    {
                      title: "Strategy",
                      image: projectImages[2]
                        ? getHeroBackground(projectImages[2])
                        : "/images/Frame-12_1Frame 12.webp",
                      text:
                        "• Conducting in-depth market and competitor analysis.\n" +
                        "• Developing data-driven marketing campaigns.\n" +
                        "• Optimizing ROI with tailored advertising strategies.\n" +
                        "• Aligning business goals with measurable digital tactics.",
                    },
                    {
                      title: "Content",
                      image: projectImages[3]
                        ? getHeroBackground(projectImages[3])
                        : "/images/Frame-1_1Frame 1.webp",
                      text:
                        "• Crafting compelling copy and visuals for diverse platforms.\n" +
                        "• Building content strategies tailored to brand goals.\n" +
                        "• Producing blogs, videos, and social media posts.\n" +
                        "• Ensuring consistent, on-brand messaging across channels.",
                    },
                  ].map((service, index) => (
                    <div key={index} className="service-content-item">
                      <div className="service-top-container">
                        <div className="service-title-wrapper">
                          <div className="accordion-title-flex">
                            <h2 className="service-title">{service.title}</h2>
                            <h2 className="service-title alternate-accordion-title">
                              {service.title}
                            </h2>
                          </div>
                        </div>
                        <div className="plus-icon-circle">
                          <div className="line" />
                          <div className="line vertical" />
                        </div>
                      </div>
                      <div className="service-content-wrapper">
                        <img
                          src={service.image}
                          loading="lazy"
                          sizes="(max-width: 1279px) 100vw, 1280px"
                          alt={service.title}
                          className="service-image"
                        />
                        <div className="service-content-block">
                          <p className="service-text">
                            {service.text.split("\n").map((line, i) => (
                              <span key={i}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                      <div className="service-underline-block">
                        <div className="service-track-line" />
                        <div className="service-track-progress" />
                      </div>
                    </div>
                  ))}
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
