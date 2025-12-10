"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide global marketing nav on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Helper to determine if a link is current
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Helper to get link classes
  const getLinkClass = (href: string, baseClass: string) => {
    return isActive(href)
      ? `${baseClass} w--current`
      : baseClass;
  };

  return (
    <div
      id="top"
      data-animation="default"
      data-collapse="all"
      data-duration="0"
      data-easing="ease"
      data-easing2="ease"
      role="banner"
      className="navbar w-nav"
      suppressHydrationWarning
    >
      <div className="padding-global">
        <div className="container-large">
          <div className="w-layout-grid nav-component-grid">
            <Link
              href="/"
              id="w-node-_016c42d0-27ae-d0d7-3914-01d3df01ab5e-df01ab5a"
              data-w-id="016c42d0-27ae-d0d7-3914-01d3df01ab5e"
              aria-current={isActive("/") ? "page" : undefined}
              className={getLinkClass("/", "brand-link w-inline-block")}
            >
              <div className="logo-wrap">
                <img
                  src="/images/logo.svg"
                  loading="lazy"
                  alt="Logo - Boldery Webflow Template"
                  className="logo"
                />
                <img
                  src="/images/logo.svg"
                  loading="lazy"
                  alt="Logo - Boldery Webflow Template"
                  className="alternate-logo"
                />
              </div>
            </Link>
            <div className="nav-menu-wrapper" suppressHydrationWarning>
              <nav
                role="navigation"
                id="w-node-_016c42d0-27ae-d0d7-3914-01d3df01ab64-df01ab5a"
                className="nav-menu w-nav-menu"
                suppressHydrationWarning
              >
                <div className="background-navbar" />
                <div className="nav-menu-content">
                  <div className="nav-link-overflow">
                    <Link
                      data-w-id="016c42d0-27ae-d0d7-3914-01d3df01ab66"
                      href="/"
                      aria-current={isActive("/") ? "page" : undefined}
                      className={getLinkClass("/", "nav-link w-inline-block")}
                    >
                      <div className="nav-text">Home</div>
                      <div className="nav-text is-hover">Home</div>
                    </Link>
                  </div>
                  <div className="nav-link-overflow">
                    <Link
                      data-w-id="016c42d0-27ae-d0d7-3914-01d3df01ab6b"
                      href="/about"
                      aria-current={isActive("/about") ? "page" : undefined}
                      className={getLinkClass("/about", "nav-link w-inline-block")}
                    >
                      <div className="nav-text">About</div>
                      <div className="nav-text is-hover">About</div>
                    </Link>
                  </div>
                  <div className="nav-link-overflow">
                    <Link
                      data-w-id="016c42d0-27ae-d0d7-3914-01d3df01ab70"
                      href="/projects"
                      aria-current={isActive("/projects") ? "page" : undefined}
                      className={getLinkClass("/projects", "nav-link w-inline-block")}
                    >
                      <div className="nav-text">Projects</div>
                      <div className="nav-text is-hover">Projects</div>
                    </Link>
                  </div>
                  <div className="nav-link-overflow">
                    <Link
                      data-w-id="016c42d0-27ae-d0d7-3914-01d3df01ab75"
                      href="/services"
                      aria-current={isActive("/services") ? "page" : undefined}
                      className={getLinkClass("/services", "nav-link w-inline-block")}
                    >
                      <div className="nav-text">Services</div>
                      <div className="nav-text is-hover">Services</div>
                    </Link>
                  </div>
                  <div className="nav-link-overflow">
                    <Link
                      data-w-id="289887cd-aafa-92ee-b3ac-156ee3faba4a"
                      href="/contact"
                      aria-current={isActive("/contact") ? "page" : undefined}
                      className={getLinkClass("/contact", "nav-link w-inline-block")}
                    >
                      <div className="nav-text">Contact</div>
                      <div className="nav-text is-hover">Contact</div>
                    </Link>
                  </div>
                </div>
              </nav>
              <div
                id="w-node-_016c42d0-27ae-d0d7-3914-01d3df01ab7a-df01ab5a"
                data-w-id="016c42d0-27ae-d0d7-3914-01d3df01ab7a"
                className="menu-button w-nav-button"
                suppressHydrationWarning
              >
                <div className="menu-wrapper">
                  <div className="menu-button-block">
                    <div className="menu-dot" />
                    <div className="menu-dot" />
                    <div className="menu-dot" />
                  </div>
                  <div className="vertical-menu-block">
                    <div className="menu-dot vertical" />
                    <div className="menu-dot vertical" />
                    <div className="menu-dot vertical" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
