import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="padding-global">
        <div className="container-large">
          <div className="divider-line" />
          <div className="footer-padding">
            <div className="footer-top-content">
              <Link
                href="/"
                aria-current="page"
                className="footer-logo-link w-inline-block w--current"
              >
                <img
                  src="/images/footer-logo.svg"
                  loading="lazy"
                  alt="Logo - Boldery Webflow Template"
                  className="footer-logo"
                />
              </Link>
              <div className="spacer-small" />
              <div className="max-width-small align-center">
                <p className="text-size-regular text-align-center">
                  Building brands for the future
                </p>
              </div>
            </div>
            <div className="w-layout-grid footer-component-grid">
              <div
                id="w-node-_37b78ce8-6c56-439d-e460-72774bac88a0-4bac888f"
                className="footer-content-block"
              >
                <Link
                  href="/"
                  data-w-id="37b78ce8-6c56-439d-e460-72774bac88a1"
                  aria-current="page"
                  className="link-button w-inline-block w--current"
                >
                  <div className="link-wrap">
                    <div className="link-text">Home</div>
                    <div className="link-text is-hover">Home</div>
                  </div>
                </Link>
                <Link
                  href="/about"
                  data-w-id="37b78ce8-6c56-439d-e460-72774bac88a7"
                  className="link-button w-inline-block"
                >
                  <div className="link-wrap">
                    <div className="link-text">About</div>
                    <div className="link-text is-hover">About</div>
                  </div>
                </Link>
                <Link
                  href="/services"
                  data-w-id="37b78ce8-6c56-439d-e460-72774bac88ad"
                  className="link-button w-inline-block"
                >
                  <div className="link-wrap">
                    <div className="link-text">Services</div>
                    <div className="link-text is-hover">Services</div>
                  </div>
                </Link>
                <Link
                  href="/projects"
                  data-w-id="37b78ce8-6c56-439d-e460-72774bac88b3"
                  className="link-button w-inline-block"
                >
                  <div className="link-wrap">
                    <div className="link-text">Projects</div>
                    <div className="link-text is-hover">Projects</div>
                  </div>
                </Link>
                <Link
                  href="/contact"
                  data-w-id="37b78ce8-6c56-439d-e460-72774bac88c5"
                  className="link-button w-inline-block"
                >
                  <div className="link-wrap">
                    <div className="link-text">Contact</div>
                    <div className="link-text is-hover">Contact</div>
                  </div>
                </Link>
              </div>
              <div
                id="w-node-_37b78ce8-6c56-439d-e460-72774bac889c-4bac888f"
                className="back-to-top-block"
              >
                <div className="back-to-top-item">
                  <a
                    href="#top"
                    data-w-id="37b78ce8-6c56-439d-e460-72774bac889e"
                    className="back-to-top-link w-inline-block"
                  >
                    <div className="scroll-down-wrapper">
                      <div className="scroll-down-block">
                        <div className="square-bracket left">[</div>
                        <div className="arrow-down w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M13.0001 7.82843V20H11.0001V7.82843L5.63614 13.1924L4.22192 11.7782L12.0001 4L19.7783 11.7782L18.3641 13.1924L13.0001 7.82843Z"></path>
                          </svg>
                        </div>
                        <div className="square-bracket right">]</div>
                      </div>
                      <div className="spacer-small" />
                      <div className="alternate-text-container">
                        <div className="alternate-text-wrap">
                          <div className="alternate-text-container-01">
                            <div className="alternate-text-item _01">
                              <div className="alternate-text">Back</div>
                            </div>
                            <div className="alternate-text-item _02">
                              <div className="alternate-text">To Top</div>
                            </div>
                          </div>
                          <div className="alternate-text-container-01">
                            <div className="alternate-text-item _01">
                              <div className="alternate-text">Back</div>
                            </div>
                            <div className="alternate-text-item _02">
                              <div className="alternate-text">To Top</div>
                            </div>
                          </div>
                          <div className="alternate-text-container-01">
                            <div className="alternate-text-item _01">
                              <div className="alternate-text">Back</div>
                            </div>
                            <div className="alternate-text-item _02">
                              <div className="alternate-text">To Top</div>
                            </div>
                          </div>
                          <div className="alternate-text-container-01">
                            <div className="alternate-text-item _01">
                              <div className="alternate-text">Back</div>
                            </div>
                            <div className="alternate-text-item _02">
                              <div className="alternate-text">To Top</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="divider-line" />
          </div>
        </div>
      </div>
    </footer>
  );
}
