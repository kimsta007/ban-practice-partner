import acqLogo from "@/imports/acq-logo.png"
import banLogo from "@/imports/ban_logo.png"
import carelonLogo from "@/imports/carelon-logo.png"

const INK = "#1A2D52"
const MUTED = "#6278A0"
const BORDER = "#E1E6F0"

export const CONTACT_EMAIL = "info@banpractice.com"

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy.html" },
  { label: "Terms", href: "/terms.html" },
  { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
]

// Icons render only once a href is filled in, so no dead links ship.
const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "X",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
]

/**
 * Shared by the landing page and the legal pages so the footer only exists
 * once — the participation disclaimer in particular needs to read identically
 * everywhere it appears.
 */
export function SiteFooter() {
  return (
    <footer style={{ background: "white" }}>
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-10 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex shrink-0 flex-col items-center gap-3 lg:items-start">
          <img
            src={banLogo}
            alt="Behavior Analyst Network"
            className="h-10 w-auto object-contain"
          />
          {SOCIAL_LINKS.some((s) => s.href) && (
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.filter((s) => s.href).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-[#1660D4]"
                  style={{ color: INK }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.18em] whitespace-nowrap"
            style={{ color: INK }}
          >
            Supported by:
          </p>
          <div className="flex items-center gap-4">
            <img
              src={carelonLogo}
              alt="Carelon Autism Provider Excellence Program"
              className="h-16 w-auto object-contain"
            />
            <img
              src={acqLogo}
              alt="ACQ Accredited Healthcare"
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>

        <nav className="flex shrink-0 flex-wrap items-center justify-center gap-8">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-semibold whitespace-nowrap transition-colors hover:text-[#1660D4]"
              style={{ color: INK }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t" style={{ borderColor: BORDER }} />

      <div className="mx-auto max-w-[1180px] px-6 py-5 text-center">
        <p className="text-xs" style={{ color: MUTED }}>
          &copy; {new Date().getFullYear()} Behavior Analyst Network. All rights reserved.
        </p>
        <p
          className="mx-auto mt-3 max-w-[80ch] text-xs leading-relaxed"
          style={{ color: "#94a3b8" }}
        >
          Participation in BAN does not constitute a partnership, franchise, equity interest, or
          ownership right. Participation terms are governed by written agreement and applicable
          payer, licensing, ethical, accreditation, and regulatory requirements.
        </p>
      </div>
    </footer>
  )
}
