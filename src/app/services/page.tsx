import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Stacked",
  description: "Explore our services - Branding, Design, Strategy, and Content creation.",
};

const services = [
  {
    title: "Branding",
    description: "We create distinctive brand identities that capture your essence and resonate with your audience.",
    features: [
      "Brand strategy & positioning",
      "Logo design & visual identity",
      "Brand guidelines & systems",
      "Brand messaging & voice",
    ],
  },
  {
    title: "Design",
    description: "User-centered design that combines aesthetics with functionality to create memorable experiences.",
    features: [
      "Website design & development",
      "UI/UX design",
      "Mobile app design",
      "Design systems",
    ],
  },
  {
    title: "Strategy",
    description: "Data-driven strategies that align your business goals with actionable digital tactics.",
    features: [
      "Market & competitor analysis",
      "Digital marketing strategy",
      "Growth optimization",
      "Performance analytics",
    ],
  },
  {
    title: "Content",
    description: "Compelling content that tells your story and engages your audience across all channels.",
    features: [
      "Content strategy",
      "Copywriting & messaging",
      "Social media content",
      "Video & photography",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <header className="page-header">
        <div className="padding-global">
          <div className="container-large">
            <div className="page-header-content">
              <div className="subtitle-wrapper">
                <div className="square" />
                <div className="subtitle">Services</div>
              </div>
              <h1 className="page-title">
                What We Do
              </h1>
              <p className="page-intro">
                We offer a full suite of digital services designed to help your 
                brand stand out and succeed in today's competitive landscape.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Services List */}
      <section className="services-page-section">
        <div className="padding-global">
          <div className="container-large">
            <div className="services-list">
              {services.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-card-header">
                    <span className="service-number">0{index + 1}</span>
                    <h2 className="service-card-title">{service.title}</h2>
                  </div>
                  <p className="service-card-description">{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, i) => (
                      <li key={i} className="service-feature">{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="content-section alt-bg">
        <div className="padding-global">
          <div className="container-large">
            <div className="content-grid">
              <div className="content-label">
                <div className="subtitle-wrapper">
                  <div className="square" />
                  <div className="subtitle">Our Process</div>
                </div>
              </div>
              <div className="content-body">
                <div className="process-grid">
                  <div className="process-item">
                    <span className="process-number">01</span>
                    <h3 className="process-title">Discovery</h3>
                    <p className="process-text">
                      We dive deep into understanding your brand, goals, and audience.
                    </p>
                  </div>
                  <div className="process-item">
                    <span className="process-number">02</span>
                    <h3 className="process-title">Strategy</h3>
                    <p className="process-text">
                      We develop a tailored plan to achieve your objectives.
                    </p>
                  </div>
                  <div className="process-item">
                    <span className="process-number">03</span>
                    <h3 className="process-title">Create</h3>
                    <p className="process-text">
                      We bring your vision to life with meticulous attention to detail.
                    </p>
                  </div>
                  <div className="process-item">
                    <span className="process-number">04</span>
                    <h3 className="process-title">Launch</h3>
                    <p className="process-text">
                      We deliver and support you through implementation and beyond.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="simple-contact-section">
        <div className="padding-global">
          <div className="container-large">
            <div className="simple-contact-content">
              <h2 className="simple-contact-title">Let's Work Together</h2>
              <p className="simple-contact-subtitle">
                Ready to elevate your brand? Get in touch to discuss your project.
              </p>
              <a 
                href="https://wa.me/15551234567?text=Hi%20there!%20I%27d%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="simple-contact-btn"
              >
                <svg className="whatsapp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Start a Project
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

