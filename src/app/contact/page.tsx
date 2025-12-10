import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Stacked",
  description: "Get in touch with Stacked. Let's discuss your next project.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <header className="page-header contact-header">
        <div className="padding-global">
          <div className="container-large">
            <div className="page-header-content">
              <div className="subtitle-wrapper">
                <div className="square" />
                <div className="subtitle">Contact</div>
              </div>
              <h1 className="page-title">
                Let's Talk
              </h1>
              <p className="page-intro">
                Have a project in mind? We'd love to hear about it. 
                Reach out and let's create something great together.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Options */}
      <section className="contact-section">
        <div className="padding-global">
          <div className="container-large">
            <div className="contact-single">
              {/* WhatsApp - Primary */}
              <div className="contact-card primary">
                <div className="contact-card-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <h2 className="contact-card-title">WhatsApp</h2>
                <p className="contact-card-text">
                  The fastest way to reach us. Send us a message and we'll respond within 24 hours.
                </p>
                <a 
                  href="https://wa.me/15551234567?text=Hi%20there!%20I%27d%20like%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-card-btn"
                >
                  Message Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="content-section alt-bg">
        <div className="padding-global">
          <div className="container-large">
            <div className="content-grid">
              <div className="content-label">
                <div className="subtitle-wrapper">
                  <div className="square" />
                  <div className="subtitle">FAQ</div>
                </div>
              </div>
              <div className="content-body">
                <div className="faq-list">
                  <div className="faq-item">
                    <h3 className="faq-question">What's your typical process?</h3>
                    <p className="faq-answer">
                      We start with a discovery call to understand your needs, then move through 
                      strategy, design, and development phases with regular check-ins along the way.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h3 className="faq-question">How long does a project take?</h3>
                    <p className="faq-answer">
                      Project timelines vary based on scope. A brand identity might take 4-6 weeks, 
                      while a full website could be 8-12 weeks. We'll provide a detailed timeline upfront.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h3 className="faq-question">What's your pricing like?</h3>
                    <p className="faq-answer">
                      We offer project-based pricing tailored to your specific needs. 
                      Reach out with your project details and we'll provide a custom quote.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

