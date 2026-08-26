import type { ReactNode } from "react"

import banLogo from "@/imports/ban_logo.png"
import { CONTACT_EMAIL, SiteFooter } from "@/shared/SiteFooter"

const ROYAL_BLUE = "#1660D4"
const INK = "#1A2D52"
const SECONDARY_TEXT = "#4A5F87"
const MUTED = "#6278A0"
const BORDER = "#E1E6F0"
const ICE = "#F4F7FC"

export { CONTACT_EMAIL }

/**
 * The header is standalone — the landing page's is wired to its scroll-spy and
 * in-page anchors, none of which apply here. The footer is shared.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <div style={{ background: ICE, minHeight: "100%" }}>
      <header
        className="sticky top-0 z-10 px-6 md:px-10 py-4 flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderBottom: `1px solid ${BORDER}`,
          backdropFilter: "blur(8px)",
        }}
      >
        <a href="/" aria-label="BAN Practice Partner home">
          <img src={banLogo} alt="Behavior Analyst Network" className="h-8 w-auto" />
        </a>
        <a href="/" className="text-sm font-semibold hover:underline" style={{ color: ROYAL_BLUE }}>
          Back to site
        </a>
      </header>

      <main className="mx-auto max-w-[760px] px-6 md:px-8 py-12 md:py-16">
        <h1 className="text-[32px] md:text-[40px] font-bold leading-tight" style={{ color: INK }}>
          {title}
        </h1>
        <p className="mt-3 text-sm" style={{ color: MUTED }}>
          Last updated {updated}
        </p>

        <div
          className="mt-10 flex flex-col gap-8 text-[16px] leading-[26px]"
          style={{ color: SECONDARY_TEXT }}
        >
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[20px] font-bold leading-snug" style={{ color: INK }}>
        {heading}
      </h2>
      {children}
    </section>
  )
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2 pl-5" style={{ listStyleType: "disc" }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export function MailLink({ address = CONTACT_EMAIL }: { address?: string }) {
  return (
    <a href={`mailto:${address}`} style={{ color: ROYAL_BLUE, fontWeight: 600 }}>
      {address}
    </a>
  )
}
