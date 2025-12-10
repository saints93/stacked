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
            <div className="contact-grid">
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

              {/* Email */}
              <div className="contact-card">
                <div className="contact-card-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"/>
                  </svg>
                </div>
                <h2 className="contact-card-title">Email</h2>
                <p className="contact-card-text">
                  Prefer email? Drop us a line and we'll get back to you soon.
                </p>
                <a 
                  href="mailto:hello@stacked.agency"
                  className="contact-card-btn"
                >
                  hello@stacked.agency
                </a>
              </div>

              {/* Location */}
              <div className="contact-card">
                <div className="contact-card-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"/>
                  </svg>
                </div>
                <h2 className="contact-card-title">Location</h2>
                <p className="contact-card-text">
                  We work remotely with clients worldwide.
                </p>
                <span className="contact-card-info">
                  Global / Remote
                </span>
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

