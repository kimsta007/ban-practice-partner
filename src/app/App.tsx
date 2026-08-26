import { useState, useEffect, type FormEvent, type ReactNode } from "react"
import banLogo from "@/imports/ban_logo.png"
import heroPhoto from "@/imports/hero.jpg"
import carelonLogo from "@/imports/carelon-logo.png"
import acqLogo from "@/imports/acq-logo.png"

// Public by nature — this ships in the bundle. Abuse is handled at the endpoint
// (honeypot, server-side validation, reserved concurrency), not by hiding it.
const FORM_ENDPOINT = "https://gkpuj7yc7xpfnwb2xj2ekxgrfm0jedhg.lambda-url.us-east-1.on.aws/"
const CONTACT_EMAIL = "info@banpractice.com"

const ROYAL_BLUE = "#1660D4"
const BLUE_DEEP = "#1254BC"
const BLUE_TINT = "#E8EFF9"
const ICE = "#F4F7FC"
const CYAN = "#40A5EC"
const CYAN_DEEP = "#2B7FC4"
const INK = "#1A2D52"
const SECONDARY_TEXT = "#4A5F87"
const MUTED = "#6278A0"
const BORDER = "#E1E6F0"

const HEADLINE_GRADIENT = "linear-gradient(90deg, #5BC8F5 0%, #40A5EC 100%)"
const HERO_OVERLAY = `linear-gradient(170deg, ${ICE} 0%, ${BLUE_TINT} 55%, #DCE9FA 100%)`
// Regular hexagon with rounded corners, normalized to a 0-1 bounding box so it
// scales to any element size via clipPathUnits="objectBoundingBox".
const HEX_CLIP_ID = "hero-hex-round"
const HEX_ROUND_PATH =
  "M0.42,0.04 Q0.50,0.00 0.58,0.04 L0.92,0.21 Q1.00,0.25 1.00,0.33 L1.00,0.67 Q1.00,0.75 0.92,0.79 L0.58,0.96 Q0.50,1.00 0.42,0.96 L0.08,0.79 Q0.00,0.75 0.00,0.67 L0.00,0.33 Q0.00,0.25 0.08,0.21 Z"
const HEX_CLIP = `url(#${HEX_CLIP_ID})`

const HERO_HEXAGONS = [
  { size: 92, top: "2%", left: "4%", tint: ROYAL_BLUE, factor: 0.14 },
  { size: 56, top: "58%", left: "0%", tint: CYAN, factor: 0.34 },
  { size: 130, top: "66%", left: "60%", tint: BLUE_DEEP, factor: 0.1 },
  { size: 48, top: "6%", left: "82%", tint: CYAN, factor: 0.44 },
  { size: 78, top: "36%", left: "86%", tint: ROYAL_BLUE, factor: 0.28 },
  { size: 90, top: "64%", left: "20%", tint: CYAN_DEEP, factor: 0.25 },
] as const

const BTN_SIZES = {
  sm: { height: 42, padding: "8px 20px", fontSize: 14, icon: 14 },
  md: { height: 48, padding: "10px 24px", fontSize: 14, icon: 15 },
  lg: { height: 52, padding: "12px 28px", fontSize: 16, icon: 15 },
} as const

type PrimaryButtonProps = {
  children: ReactNode
  href?: string
  size?: keyof typeof BTN_SIZES
  block?: boolean
  withArrow?: boolean
  className?: string
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
}

function PrimaryButton({
  children,
  href,
  size = "md",
  block = false,
  withArrow = true,
  className = "",
  onClick,
  type = "button",
  disabled,
}: PrimaryButtonProps) {
  const s = BTN_SIZES[size]
  // Full-width buttons may wrap; fixed-width ones stay on one line. Height is a
  // floor rather than a fixed value so a long label grows the button instead of
  // overflowing it.
  const classes = `group ${block ? "flex w-full text-center" : "inline-flex whitespace-nowrap"} items-center justify-center gap-2 rounded-full font-bold text-white transition-colors bg-[#1660D4] hover:bg-[#1254BC] disabled:opacity-60 ${className}`
  const style = {
    minHeight: s.height,
    padding: s.padding,
    fontSize: s.fontSize,
  }
  const inner = (
    <>
      {children}
      {withArrow && (
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes} style={style} onClick={onClick}>
        {inner}
      </a>
    )
  }
  return (
    <button type={type} className={classes} style={style} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  )
}

const HEADER_H = 80

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

// Kept in the order the sections appear on the page, so the active-link
// underline advances left to right as you scroll.
const NAV_LINKS = [
  { label: "Existing Paths", id: "existing-paths" },
  { label: "Support", id: "support" },
  { label: "Existing Practices", id: "existing-practices" },
  { label: "How It Works", id: "how-it-works" },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState("")

  // The glass tint only has the hero photo to read against. Past it the bar
  // crosses white and navy sections, so it goes solid to stay legible.
  const [overHero, setOverHero] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => {
      setOverHero(window.scrollY < window.innerHeight - HEADER_H)
      setScrolled(window.scrollY > 10)
    }
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    window.addEventListener("resize", handler)
    return () => {
      window.removeEventListener("scroll", handler)
      window.removeEventListener("resize", handler)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: `-${HEADER_H + 24}px 0px -60% 0px`, threshold: 0 },
    )
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const navText = "#374151"
  const navTextActive = ROYAL_BLUE
  const navHover = "hover:text-gray-900"

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300"
      style={{
        height: HEADER_H,
        background: !scrolled
          ? "transparent"
          : overHero
            ? "rgba(255,255,255,0.8)"
            : "rgba(255,255,255,0.95)",
        borderBottom: `1px solid ${!scrolled ? "transparent" : overHero ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: !scrolled
          ? "none"
          : "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)",
      }}
    >
      <div className="flex h-full w-full items-center justify-between gap-6 px-6 md:px-10">
        <a
          href="#top"
          className="flex shrink-0 items-center"
          aria-label="Behavior Analyst Network — home"
        >
          <img
            src={banLogo}
            alt="Behavior Analyst Network"
            className="h-16 w-auto object-contain"
          />
        </a>

        <nav className="hidden items-center gap-6 min-[1120px]:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.id
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`group relative whitespace-nowrap py-2 text-sm font-semibold transition-colors ${navHover}`}
                style={{ color: isActive ? navTextActive : navText }}
              >
                {l.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2px] origin-left rounded-full transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                  style={{ background: navTextActive }}
                  aria-hidden="true"
                />
              </a>
            )
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 min-[1120px]:flex">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${navHover}`}
            style={{ color: navText }}
          >
            <PhoneIcon />
            Talk to us
          </a>
          <PrimaryButton href="#apply" size="sm">
            Apply to Join BAN
          </PrimaryButton>
        </div>

        <button
          className="min-[1120px]:hidden -mr-2 p-2 rounded-lg transition-colors"
          style={{ color: menuOpen ? ROYAL_BLUE : navText }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div
        className={`min-[1120px]:hidden fixed left-0 right-0 border-b overflow-hidden transition-all duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          top: HEADER_H,
          background: "white",
          borderColor: BORDER,
          maxHeight: menuOpen ? "calc(100vh - " + HEADER_H + "px)" : 0,
          boxShadow: "0 16px 32px -20px rgba(16,24,40,0.25)",
        }}
      >
        <nav className="px-6 py-3 flex flex-col">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="flex items-center justify-between py-4 text-base font-semibold"
              style={{
                color: active === l.id ? ROYAL_BLUE : INK,
                borderBottom: `1px solid ${BORDER}`,
              }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 3l5 5-5 5"
                  stroke={MUTED}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ))}
          <PrimaryButton
            href="#apply"
            size="lg"
            block
            className="mt-5 mb-3"
            onClick={() => setMenuOpen(false)}
          >
            Apply to Join BAN
          </PrimaryButton>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="pb-4 text-sm font-semibold text-center"
            style={{ color: MUTED }}
            onClick={() => setMenuOpen(false)}
          >
            Talk to us
          </a>
        </nav>
      </div>
    </header>
  )
}

function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 500)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])
  return (
    <div
      className={`min-[1120px]:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-[#E1E6F0] transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <PrimaryButton href="#apply" size="lg" block>
        Apply to Join BAN
      </PrimaryButton>
    </div>
  )
}

function HeroHexArt({ scrollY }: { scrollY: number }) {
  const maxSize = Math.max(...HERO_HEXAGONS.map((h) => h.size))

  return (
    <div
      className="relative w-full lg:w-[46%] flex items-center justify-center"
      style={{ minHeight: 380, filter: `drop-shadow(0px 10px 24px rgba(18, 84, 188, 0.35))` }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <clipPath id={HEX_CLIP_ID} clipPathUnits="objectBoundingBox">
            <path d={HEX_ROUND_PATH} />
          </clipPath>
        </defs>
      </svg>

      {HERO_HEXAGONS.map((h, i) => {
        const blur = Math.round((1 - h.size / maxSize) * 10)
        return (
          <div
            key={i}
            aria-hidden="true"
            className="absolute"
            style={{
              width: h.size,
              height: h.size,
              top: h.top,
              left: h.left,
              clipPath: HEX_CLIP,
              background: `linear-gradient(160deg, ${h.tint} 0%, rgba(255,255,255,0.4) 100%)`,
              opacity: 0.32,
              filter: blur ? `blur(${blur}px)` : undefined,
              transform: `translateY(${scrollY * h.factor}px)`,
              willChange: "transform",
            }}
          />
        )
      })}

      <div
        className="relative"
        style={{
          width: "min(78%, 340px)",
          aspectRatio: "1 / 1.05",
          clipPath: HEX_CLIP,
          transform: `translateY(${scrollY * 0.06}px)`,
          willChange: "transform",
        }}
      >
        <img
          src={heroPhoto}
          alt="A BAN Practice Partner leading a session"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(190deg, rgba(22,96,212,0.12) 0%, rgba(18,84,188,0.06) 100%)",
          }}
        />
      </div>
    </div>
  )
}

const HERO_LETTER_STEP = 0.026

function AnimatedLetters({
  text,
  startIndex,
  gradient,
}: {
  text: string
  startIndex: number
  gradient?: boolean
}) {
  const totalChars = text.length
  const tokens = text.split(/(\s+)/).filter((t) => t.length > 0)
  let charPos = 0

  return (
    <>
      {tokens.map((token, ti) => {
        const isSpace = /^\s+$/.test(token)
        const letters = Array.from(token).map((ch) => {
          const pos = charPos++
          const globalIndex = startIndex + pos
          return (
            <span
              key={globalIndex}
              className={`hero-letter${gradient ? " bg-clip-text text-transparent" : ""}`}
              style={{
                animationDelay: `${globalIndex * HERO_LETTER_STEP}s`,
                ...(gradient
                  ? {
                      backgroundImage: HEADLINE_GRADIENT,
                      backgroundSize: `${totalChars}ch 100%`,
                      backgroundPosition: `${-pos}ch 0`,
                    }
                  : {}),
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          )
        })
        return isSpace ? (
          <span key={`s-${ti}`}>{letters}</span>
        ) : (
          <span key={`w-${ti}`} className="inline-block" style={{ whiteSpace: "nowrap" }}>
            {letters}
          </span>
        )
      })}
    </>
  )
}

function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const headlinePlain = "Lead a practice "
  const headlineAccent = "without going it alone."
  const heroLetterCount = headlinePlain.length + headlineAccent.length
  const heroTextDelay = heroLetterCount * HERO_LETTER_STEP + 0.35

  useEffect(() => {
    let raf = 0
    const handler = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => {
      window.removeEventListener("scroll", handler)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: "80vh", paddingTop: HEADER_H }}
    >
      <div
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{ background: HERO_OVERLAY }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-col lg:flex-row items-center gap-12 px-6 py-16 md:py-20">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6 lg:w-[54%]">
          <h1
            className="font-extrabold"
            style={{
              fontSize: "clamp(36px, 4.6vw, 58px)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: INK,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <AnimatedLetters text={headlinePlain} startIndex={0} />
            <AnimatedLetters
              text={headlineAccent}
              startIndex={headlinePlain.length}
              gradient
            />
          </h1>
          <div
            className="mt-2 flex flex-col justify-center gap-4 sm:flex-row hero-fade-up"
            style={{ animationDelay: `${heroTextDelay}s` }}
          >
            <PrimaryButton href="#apply" size="lg" className="shadow-lg">
              Start Your Application
            </PrimaryButton>
            <a
              href="#existing-practices"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border px-8 text-base font-bold backdrop-blur-sm transition-all hover:bg-white"
              style={{
                minHeight: 52,
                borderColor: ROYAL_BLUE,
                background: "rgba(255,255,255,0.5)",
                color: ROYAL_BLUE,
              }}
            >
              Explore a Practice Transition
            </a>
          </div>
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold hero-fade-up"
            style={{ color: MUTED, animationDelay: `${heroTextDelay + 0.15}s` }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="flex-shrink-0 opacity-70"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 7.25v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="8" cy="4.9" r="0.9" fill="currentColor" />
            </svg>
            Now Enrolling Founding Practice Partners in Massachusetts
          </span>{" "}
        </div>

        <HeroHexArt scrollY={scrollY} />
      </div>

      <svg
        className="absolute bottom-0 left-0 z-[2] w-full"
        style={{ height: "7vw", minHeight: 48, maxHeight: 110 }}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" fill={ICE} />
      </svg>
    </section>
  )
}

function Meter({ level, onDark }: { level: number; onDark?: boolean }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-4 h-1.5 rounded-full"
          style={{
            background:
              i < level
                ? onDark
                  ? "white"
                  : ROYAL_BLUE
                : onDark
                  ? "rgba(255,255,255,0.30)"
                  : BORDER,
          }}
        />
      ))}
    </span>
  )
}

function ThirdPath() {
  const cards = [
    {
      kicker: "Path 01",
      title: "Traditional Employment",
      desc: "Stability, but limited control over how the practice operates and limited financial participation beyond your own work.",
      autonomy: 1,
      support: 2,
      highlight: false,
    },
    {
      kicker: "Path 02",
      title: "Starting Alone",
      desc: "More autonomy, along with forming a company, obtaining payer contracts, finding clients, recruiting staff, managing payroll, maintaining compliance, and solving every problem yourself.",
      autonomy: 3,
      support: 1,
      highlight: false,
    },
    {
      kicker: "Path 03",
      title: "BAN Practice Partner",
      desc: "Lead the clinical practice while an accredited network provides the people, systems, infrastructure, and support behind it.",
      autonomy: 3,
      support: 3,
      highlight: true,
    },
  ]

  return (
    <section id="existing-paths" className="py-20 md:py-28" style={{ background: ICE }}>
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mb-12 md:mb-14">
          <span
            className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase mb-4 px-3 py-1 rounded-full"
            style={{ background: BLUE_TINT, color: ROYAL_BLUE }}
          >
            The Third Path
          </span>
          <h2
            className="font-bold"
            style={{
              fontSize: "clamp(28px, 3.5vw, 42px)",
              color: INK,
              fontFamily: "Montserrat, sans-serif",
              lineHeight: 1.15,
            }}
          >
            There should be a path between another BCBA job and starting from scratch.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {cards.map((card) => {
            const dark = card.highlight
            return (
              <article
                key={card.title}
                className="relative rounded-2xl p-7 flex flex-col"
                style={{
                  background: dark
                    ? `linear-gradient(165deg, ${ROYAL_BLUE} 0%, ${BLUE_DEEP} 100%)`
                    : "white",
                  border: dark ? "1px solid rgba(255,255,255,0.22)" : `1px solid ${BORDER}`,
                  boxShadow: "0 1px 3px rgba(16,24,40,0.04)",
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span
                    className="text-[11px] font-bold tracking-[0.14em] uppercase"
                    style={{ color: dark ? "white" : MUTED }}
                  >
                    {card.kicker}
                  </span>
                  {dark && (
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.18)", color: "white" }}
                    >
                      Recommended
                    </span>
                  )}
                </div>

                <h3
                  className="font-bold leading-snug mb-3"
                  style={{
                    fontSize: 21,
                    color: dark ? "white" : INK,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-[15px] leading-relaxed mb-8"
                  style={{ color: dark ? "#E8EFF9" : SECONDARY_TEXT }}
                >
                  {card.desc}
                </p>

                <dl
                  className="mt-auto pt-5 flex flex-col gap-3"
                  style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.20)" : BORDER}` }}
                >
                  {[
                    { label: "Autonomy", value: card.autonomy },
                    { label: "Support behind you", value: card.support },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4">
                      <dt
                        className="text-xs font-semibold"
                        style={{ color: dark ? "#E8EFF9" : MUTED }}
                      >
                        {row.label}
                      </dt>
                      <dd className="m-0">
                        <Meter level={row.value} onDark={dark} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function YouLead() {
  const youLead = [
    "Clinical decisions and treatment quality",
    "Which clients are right for the practice",
    "Caseload size and pace of growth",
    "Clinical development of the BT team",
    "Practice culture and standards",
    "Relationships with the families served",
  ]

  const banSupports = [
    "Qualified client opportunities",
    "Intake and service coordination",
    "Benefits verification and authorizations",
    "Payer administration, billing, and collections",
    "BT recruiting, employment, onboarding, payroll, and workforce support",
    "Accreditation and compliance infrastructure",
    "Scheduling and operational support",
    "AI-powered technology systems",
  ]

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-[1180px] px-6">
        <h2
          className="font-bold mb-3 text-center"
          style={{
            fontSize: "clamp(28px, 3.5vw, 42px)",
            color: INK,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          You lead the care. <span style={{ color: ROYAL_BLUE }}>BAN carries the machinery.</span>
        </h2>
        <p className="text-center text-lg mb-14" style={{ color: SECONDARY_TEXT }}>
          A clean division of ownership — so you can focus entirely on clinical outcomes.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6 items-stretch">
          {[
            {
              tag: "You",
              title: "You Lead",
              blurb: "Every decision that shapes the care itself stays with you.",
              items: youLead,
              footer: "You retain clinical authority over the practice you lead.",
            },
            {
              tag: "BAN",
              title: "BAN Supports",
              blurb: "Every function that usually pulls a clinician away from care.",
              items: banSupports,
              footer: null,
            },
          ].map((col) => (
            <div
              key={col.title}
              className="rounded-2xl p-8 flex flex-col"
              style={{
                background: col.tag === "You" ? "white" : ICE,
                border: `1px solid ${BORDER}`,
                boxShadow: col.tag === "You" ? "0 1px 3px rgba(16,24,40,0.04)" : "none",
              }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <h3
                  className="font-bold text-xl"
                  style={{ color: INK, fontFamily: "Montserrat, sans-serif" }}
                >
                  {col.title}
                </h3>
                <span className="text-xs font-semibold" style={{ color: MUTED }}>
                  {col.items.length} responsibilities
                </span>
              </div>
              <p className="text-sm mb-6" style={{ color: MUTED }}>
                {col.blurb}
              </p>

              <ul className="flex flex-col">
                {col.items.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 py-3"
                    style={{ borderTop: i === 0 ? "none" : `1px solid ${BORDER}` }}
                  >
                    <svg
                      className="mt-1 flex-shrink-0"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8.5l3.2 3.2L13 5"
                        stroke={col.tag === "You" ? ROYAL_BLUE : CYAN_DEEP}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[15px] leading-snug" style={{ color: SECONDARY_TEXT }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {col.footer && (
                <p className="mt-auto pt-6 text-sm font-semibold" style={{ color: ROYAL_BLUE }}>
                  {col.footer}
                </p>
              )}
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl px-8 py-7 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
          style={{
            background: "white",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 1px 3px rgba(16,24,40,0.04)",
          }}
        >
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: BLUE_TINT, border: `1px solid ${BORDER}` }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <rect
                x="2"
                y="5"
                width="18"
                height="12"
                rx="2"
                stroke={ROYAL_BLUE}
                strokeWidth="1.6"
              />
              <path d="M7 9h8M7 12h5" stroke={ROYAL_BLUE} strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[15px] leading-relaxed" style={{ color: SECONDARY_TEXT }}>
            <strong style={{ color: INK }}>
              BAN combines proven practice management infrastructure with AI-powered systems
            </strong>{" "}
            designed to reduce administrative friction across intake, scheduling, documentation,
            authorization workflows, billing, workforce coordination, and practice visibility.
          </p>
        </div>
      </div>
    </section>
  )
}

const supportNodes = [
  { label: "Peer BCBA Consultation", lines: ["Peer BCBA", "Consultation"] },
  { label: "Experienced Clinical Leadership", lines: ["Experienced", "Clinical", "Leadership"] },
  { label: "Difficult Case & Family Support", lines: ["Difficult Case", "& Family", "Support"] },
  { label: "Staffing & Coverage Planning", lines: ["Staffing &", "Coverage", "Planning"] },
  { label: "Compliance & Accreditation", lines: ["Compliance &", "Accreditation"] },
  { label: "Caseload & Capacity Planning", lines: ["Caseload &", "Capacity", "Planning"] },
  { label: "Training & Development", lines: ["Training &", "Development"] },
  { label: "Operational Coaching", lines: ["Operational", "Coaching"] },
]

const NET = { cx: 380, cy: 380, coreR: 104, nodeR: 62, orbit: 248 }

function NetworkDiagram() {
  const nodes = supportNodes.map((n, i) => {
    const angle = ((-90 + i * 45) * Math.PI) / 180
    return {
      ...n,
      x: NET.cx + NET.orbit * Math.cos(angle),
      y: NET.cy + NET.orbit * Math.sin(angle),
      ux: Math.cos(angle),
      uy: Math.sin(angle),
    }
  })

  return (
    <figure className="relative m-0 mx-auto w-full max-w-[560px]">
      <svg
        viewBox="0 0 760 760"
        className="block w-full h-auto"
        role="img"
        aria-label={`The BAN Practice Partner surrounded by network support: ${supportNodes
          .map((n) => n.label)
          .join(", ")}.`}
      >
        <defs>
          <radialGradient id="net-core" cx="50%" cy="22%" r="88%">
            <stop offset="0%" stopColor="#3B78E8" />
            <stop offset="52%" stopColor="#1660D4" />
            <stop offset="100%" stopColor="#1254BC" />
          </radialGradient>
          <radialGradient id="net-node" cx="50%" cy="18%" r="95%">
            <stop offset="0%" stopColor="#2A6BEA" />
            <stop offset="100%" stopColor="#1660D4" />
          </radialGradient>
          <linearGradient id="net-link" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1660D4" />
            <stop offset="100%" stopColor="#5BC8F5" />
          </linearGradient>
        </defs>

        <circle
          cx={NET.cx}
          cy={NET.cy}
          r={NET.orbit}
          fill="none"
          stroke="#1660D4"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeDasharray="7 9"
        />

        {nodes.map((n) => (
          <line
            key={`spoke-${n.label}`}
            x1={NET.cx + n.ux * NET.coreR}
            y1={NET.cy + n.uy * NET.coreR}
            x2={n.x - n.ux * NET.nodeR}
            y2={n.y - n.uy * NET.nodeR}
            stroke="url(#net-link)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}

        <circle cx={NET.cx} cy={NET.cy} r={NET.coreR} fill="url(#net-core)" />
        <text
          x={NET.cx}
          y={NET.cy - 14}
          textAnchor="middle"
          fill="white"
          fontFamily="Montserrat, sans-serif"
          fontSize="44"
          fontWeight="800"
          letterSpacing="1"
        >
          BAN
        </text>
        <text
          x={NET.cx}
          y={NET.cy + 18}
          textAnchor="middle"
          fill="white"
          fontFamily="Montserrat, sans-serif"
          fontSize="21"
          fontWeight="700"
          letterSpacing="0.6"
        >
          PRACTICE
        </text>
        <text
          x={NET.cx}
          y={NET.cy + 44}
          textAnchor="middle"
          fill="white"
          fontFamily="Montserrat, sans-serif"
          fontSize="21"
          fontWeight="700"
          letterSpacing="0.6"
        >
          PARTNER
        </text>

        {nodes.map((n) => (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r={NET.nodeR} fill="url(#net-node)" />
            {n.lines.map((line, li) => (
              <text
                key={line}
                x={n.x}
                y={n.y - (n.lines.length - 1) * 8 + li * 16 + 5}
                textAnchor="middle"
                fill="white"
                fontFamily="Montserrat, sans-serif"
                fontSize="13"
                fontWeight="700"
              >
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </figure>
  )
}

function SupportNetwork() {
  return (
    <section
      id="support"
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background: ICE,
        scrollMarginTop: HEADER_H,
      }}
    >
      <div className="relative mx-auto max-w-[1180px] px-6">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,540px)] gap-12 lg:gap-14 items-center">
          <div>
            <span
              className="inline-block text-xs font-bold tracking-[0.14em] uppercase mb-5 px-3 py-1 rounded-full"
              style={{
                background: BLUE_TINT,
                color: ROYAL_BLUE,
              }}
            >
              The Support Network
            </span>
            <h2
              className="font-bold mb-5 leading-tight"
              style={{
                fontSize: "clamp(28px, 3.5vw, 42px)",
                color: INK,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Independent should never mean isolated.
            </h2>
            <p className="text-lg leading-relaxed mb-5" style={{ color: SECONDARY_TEXT }}>
              The hardest part of going alone is not simply the paperwork. It is becoming the only
              person expected to solve every clinical, staffing, family, payer, and compliance
              problem.
            </p>
            <p className="text-lg leading-relaxed mb-8" style={{ color: SECONDARY_TEXT }}>
              BAN is a clinical and operating network, not merely a back office vendor. Practice
              Partners retain meaningful autonomy while gaining experienced people to call when
              something difficult lands on their desk.
            </p>

            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supportNodes.map((node) => (
                <div
                  key={node.label}
                  className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold leading-snug"
                  style={{
                    background: "white",
                    color: INK,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  {node.label}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <NetworkDiagram />
          </div>
        </div>
      </div>
    </section>
  )
}

function Financial() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="max-w-[640px] mx-auto text-center">
          <h2
            className="font-bold mb-5"
            style={{
              fontSize: "clamp(28px, 3.5vw, 42px)",
              color: INK,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Your earnings should not stop at your own billable calendar.
          </h2>
          <p
            className="text-left sm:text-center text-lg leading-relaxed mb-12"
            style={{ color: SECONDARY_TEXT }}
          >
            BAN Practice Partners are compensated for their own clinical work and participate in
            eligible revenue generated across the BCBA and BT-delivered services of the practice
            they lead. The model is designed to recognize the broader value created when a Practice
            Partner builds a strong team, develops technicians, serves more families responsibly,
            and maintains high standards of care.
          </p>
        </div>

        <div className="relative mb-12">
          <ol className="relative grid sm:grid-cols-3 gap-4 sm:gap-5 list-none p-0 m-0">
            {[
              { num: "01", title: "Your clinical work", caption: "and the services you deliver" },
              {
                num: "02",
                title: "Practice revenue",
                caption: "across BCBA and BT-delivered care",
              },
              {
                num: "03",
                title: "Practice Partner participation",
                caption: "transparent, defined in writing",
              },
            ].map((step, i) => {
              const last = i === 2
              return (
                <li
                  key={step.num}
                  className="relative rounded-2xl px-6 py-6 flex flex-col items-center text-center"
                  style={{
                    background: last
                      ? `linear-gradient(165deg, ${ROYAL_BLUE} 0%, ${BLUE_DEEP} 100%)`
                      : "white",
                    border: `1px solid ${last ? "transparent" : BORDER}`,
                    boxShadow: last ? "none" : "0 1px 3px rgba(16,24,40,0.04)",
                  }}
                >
                  {!last && (
                    <span
                      className="absolute z-10 flex items-center justify-center left-1/2 -translate-x-1/2 -bottom-[18px] sm:left-auto sm:translate-x-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:-right-[19px]"
                      aria-hidden="true"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="rotate-90 sm:rotate-0"
                      >
                        <path
                          d="M3.5 8h9M8.5 4l4 4-4 4"
                          stroke={ROYAL_BLUE}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-4"
                    style={{
                      background: last ? "rgba(255,255,255,0.16)" : ICE,
                      color: last ? "white" : MUTED,
                    }}
                  >
                    {step.num}
                  </span>
                  <p
                    className="text-[15px] font-bold leading-snug mb-1"
                    style={{ color: last ? "white" : INK, fontFamily: "Montserrat, sans-serif" }}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm leading-snug" style={{ color: last ? "#d5e0ff" : MUTED }}>
                    {step.caption}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>

        <div
          className="max-w-[640px] mx-auto rounded-2xl px-8 py-6 text-center"
          style={{ background: "white", border: `1px solid ${BORDER}` }}
        >
          <p className="text-base font-semibold mb-1" style={{ color: INK }}>
            Clear economics before you commit.
          </p>
          <p className="text-[15px] leading-relaxed" style={{ color: SECONDARY_TEXT }}>
            Each candidate will receive a written explanation of the compensation model and sample
            practice economics before joining.
          </p>
        </div>
      </div>
    </section>
  )
}

function ExistingPractices() {
  const items = [
    "Accreditation and quality systems",
    "Compliance support",
    "Payer and billing administration",
    "BT workforce operations",
    "Clinical consultation",
    "AI-powered technology",
    "Operational management",
  ]

  return (
    <section
      id="existing-practices"
      className="py-20 md:py-28"
      style={{ background: ICE, scrollMarginTop: HEADER_H }}
    >
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          <div>
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
              style={{ background: "white", color: ROYAL_BLUE, border: `1px solid ${BORDER}` }}
            >
              Existing ABA Practices
            </span>
            <h2
              className="font-bold mb-5 leading-tight"
              style={{
                fontSize: "clamp(26px, 3vw, 38px)",
                color: INK,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Accreditation should not be the reason a good practice stalls or closes.
            </h2>
            <p className="text-lg leading-relaxed mb-5" style={{ color: SECONDARY_TEXT }}>
              Accreditation can be rigorous, expensive, and time-consuming. Some small ABA practices
              struggle to complete the process, lack the infrastructure needed to maintain it, or
              decide they no longer want to devote months of leadership attention to it.
            </p>
            <p className="text-lg leading-relaxed mb-8" style={{ color: SECONDARY_TEXT }}>
              BAN may offer another path. Existing practice owners can explore transitioning into an
              accredited network while continuing to provide clinical leadership and support the
              families and clinicians who already depend on them.
            </p>
            <PrimaryButton href="#apply" size="md">
              Explore a Practice Transition
            </PrimaryButton>
          </div>

          <div
            className="rounded-2xl p-8"
            style={{
              background: "white",
              border: `1px solid ${BORDER}`,
              boxShadow: "0 2px 24px rgba(22,96,212,0.06)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${CYAN}18` }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M10 2L2 7v6c0 3.5 3.5 6 8 6s8-2.5 8-6V7L10 2z"
                    stroke={CYAN_DEEP}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10l2 2 4-4"
                    stroke={CYAN_DEEP}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3
                className="font-bold text-lg"
                style={{ color: INK, fontFamily: "Montserrat, sans-serif" }}
              >
                Infrastructure BAN May Provide
              </h3>
            </div>
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 py-2.5 border-b last:border-b-0"
                  style={{ borderColor: BORDER }}
                >
                  <svg
                    className="flex-shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5l3.2 3.2L13 5"
                      stroke={CYAN_DEEP}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[15px] font-medium" style={{ color: INK }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p
              className="text-xs leading-relaxed mt-6 pt-5"
              style={{ color: MUTED, borderTop: `1px solid ${BORDER}` }}
            >
              Practice transitions are evaluated individually and remain subject to clinical,
              compliance, staffing, payer, and operational due diligence.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Apply and Align",
      desc: "Tell us about your experience, clinical interests, preferred geography, and what you want the next stage of your career to look like.",
    },
    {
      num: "02",
      title: "Design the Practice",
      desc: "Together, we define the initial caseload, schedule, service model, staffing needs, and growth plan.",
    },
    {
      num: "03",
      title: "Build the Launch",
      desc: "BAN establishes the operating workflows, begins matching qualified client opportunities, and builds the needed BT capacity.",
    },
    {
      num: "04",
      title: "Lead and Grow",
      desc: "You begin serving families, developing the clinical team, and participating in the performance of the practice with ongoing network support.",
    },
  ]

  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 bg-white"
      style={{ scrollMarginTop: HEADER_H }}
    >
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="text-center mb-14">
          <h2
            className="font-bold mb-3"
            style={{
              fontSize: "clamp(28px, 3.5vw, 42px)",
              color: INK,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            From application to practice launch.
          </h2>
          <p className="text-lg" style={{ color: SECONDARY_TEXT }}>
            A straightforward path from your first conversation to leading a practice.
          </p>
        </div>

        <div className="hidden md:grid grid-cols-4 gap-6 relative">
          <div
            className="absolute top-[52px] left-[12.5%] right-[12.5%] h-px"
            style={{ background: BORDER }}
            aria-hidden="true"
          />

          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center relative">
              <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center font-bold text-base mb-5 relative z-10"
                style={{
                  background: "white",
                  border: `1.5px solid ${BORDER}`,
                  color: INK,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {step.num}
              </div>
              <h3
                className="font-bold text-base mb-2"
                style={{ color: INK, fontFamily: "Montserrat, sans-serif" }}
              >
                {step.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: SECONDARY_TEXT }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="md:hidden flex flex-col gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{
                    background: "white",
                    border: `1.5px solid ${BORDER}`,
                    color: INK,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {step.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 my-2" style={{ background: BORDER, minHeight: 32 }} />
                )}
              </div>
              <div className="pb-8 pt-1">
                <h3
                  className="font-bold text-base mb-1.5"
                  style={{ color: INK, fontFamily: "Montserrat, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-[15px] leading-relaxed" style={{ color: SECONDARY_TEXT }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FIELD_BASE =
  "w-full h-12 px-4 rounded-[10px] text-[15px] border outline-none transition-all focus:border-[#1660D4] focus:ring-4 focus:ring-[#1660D4]/12"

function FieldLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-sm font-semibold mb-2" style={{ color: INK }}>
      {children}
      {required && (
        <span style={{ color: "#DC2626" }} aria-hidden="true">
          *
        </span>
      )}
    </span>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p
      id={id}
      className="flex items-center gap-1.5 text-[13px] mt-1.5"
      style={{ color: "#DC2626" }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.75v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="8" cy="11.2" r="0.85" fill="currentColor" />
      </svg>
      {message}
    </p>
  )
}

function FormSection({
  step,
  title,
  hint,
  children,
}: {
  step: string
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <fieldset className="m-0 p-0 border-0">
      <legend className="flex items-baseline gap-2.5 mb-1 p-0">
        <span
          className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold flex-shrink-0"
          style={{ background: BLUE_TINT, color: ROYAL_BLUE }}
          aria-hidden="true"
        >
          {step}
        </span>
        <span
          className="text-base font-bold"
          style={{ color: INK, fontFamily: "Montserrat, sans-serif" }}
        >
          {title}
        </span>
      </legend>
      {hint && (
        <p className="text-sm mb-5 ml-[34px]" style={{ color: MUTED }}>
          {hint}
        </p>
      )}
      <div className={hint ? "flex flex-col gap-4" : "mt-5 flex flex-col gap-4"}>{children}</div>
    </fieldset>
  )
}

function OptionCards({
  name,
  options,
  value,
  onChange,
  columns = 2,
}: {
  name: string
  options: string[]
  value: string
  onChange: (v: string) => void
  columns?: 1 | 2
}) {
  return (
    <div
      className={`grid gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
      role="radiogroup"
      aria-label={name}
    >
      {options.map((opt) => {
        const on = value === opt
        return (
          <label
            key={opt}
            className="relative flex items-center gap-3 px-4 py-3.5 rounded-[10px] border cursor-pointer transition-all text-[15px] font-medium hover:border-[#1660D4]/50 has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-[#1660D4]/20"
            style={{
              borderColor: on ? ROYAL_BLUE : BORDER,
              background: on ? BLUE_TINT : "white",
              color: on ? ROYAL_BLUE : SECONDARY_TEXT,
              boxShadow: on ? `0 0 0 1px ${ROYAL_BLUE}` : "none",
            }}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={on}
              onChange={() => onChange(opt)}
              className="absolute inset-0 w-full h-full m-0 opacity-0 appearance-none cursor-pointer"
            />
            <span
              className="w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
              style={{ borderColor: on ? ROYAL_BLUE : "#C6D2E6" }}
              aria-hidden="true"
            >
              {on && <span className="w-2 h-2 rounded-full" style={{ background: ROYAL_BLUE }} />}
            </span>
            {opt}
          </label>
        )
      })}
    </div>
  )
}

function SelectChevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
    >
      <path
        d="M4 6.5l4 4 4-4"
        stroke={MUTED}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const APPLY_ASSURANCES = [
  "Confidential — nothing is shared without your say-so",
  "No obligation and no cost to apply",
  "A BCBA on our team reviews every application",
  "You'll hear back within two business days",
]

function ApplicationForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    certStatus: "",
    situation: "",
    interest: "",
    bcbaFinder: "",
    message: "",
    website: "", // honeypot — see the hidden input below
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  // Kept out of `errors` deliberately: that object drives the "N fields need
  // attention" counter, and a network failure is not a field problem.
  const [submitError, setSubmitError] = useState<string | null>(null)

  const required = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "state",
    "certStatus",
    "situation",
    "interest",
  ]
  const labels: Record<string, string> = {
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Mobile phone",
    state: "State",
    certStatus: "BCBA certification status",
    situation: "Current professional situation",
    interest: "Primary interest",
    bcbaFinder: "BCBAfinder profile",
    message: "Short message",
  }

  const formatRules: Record<string, (v: string) => string | null> = {
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : "Enter a valid email address."),
    phone: (v) =>
      v.replace(/\D/g, "").length >= 10 ? null : "Enter a phone number with at least 10 digits.",
    bcbaFinder: (v) =>
      /^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(v)
        ? null
        : "Enter a full URL starting with http:// or https://",
  }

  const fieldError = (k: string): string | null => {
    const value = String(form[k as keyof typeof form] ?? "").trim()
    if (!value) return required.includes(k) ? `${labels[k]} is required.` : null
    return formatRules[k]?.(value) ?? null
  }

  const completed = required.filter((k) => !fieldError(k)).length
  const progress = Math.round((completed / required.length) * 100)
  const errorCount = Object.keys(errors).length

  const validate = () => {
    const e: Record<string, string> = {}
    ;[...required, ...Object.keys(formatRules)].forEach((k) => {
      const message = fieldError(k)
      if (message) e[k] = message
    })
    return e
  }

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field])
      setErrors((e) => {
        const next = { ...e }
        delete next[field]
        return next
      })
  }

  const handleBlur = (field: string) => {
    if (!form[field as keyof typeof form]) return
    const message = fieldError(field)
    setErrors((e) => {
      const next = { ...e }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`submit failed: ${res.status}`)
      setSubmitted(true)
    } catch {
      setSubmitError(
        `Something went wrong sending your application. Please try again, or email us at ${CONTACT_EMAIL} and we'll pick it up from there.`,
      )
    } finally {
      setSubmitting(false)
    }
  }

  const fieldStyle = (field: string) => ({
    borderColor: errors[field] ? "#F1AEAE" : BORDER,
    background: errors[field] ? "#FEF4F4" : "white",
    color: INK,
  })

  const textInput = (field: keyof typeof form, type: string, placeholder: string) => (
    <label className="block">
      <FieldLabel required={required.includes(field)}>{labels[field]}</FieldLabel>
      <input
        type={type}
        className={FIELD_BASE}
        style={fieldStyle(field)}
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        onBlur={() => handleBlur(field)}
        placeholder={placeholder}
        aria-invalid={!!errors[field]}
        aria-describedby={errors[field] ? `${field}-err` : undefined}
      />
      <FieldError id={`${field}-err`} message={errors[field]} />
    </label>
  )

  const selectField = (field: keyof typeof form, placeholder: string, options: string[]) => (
    <label className="block">
      <FieldLabel required>{labels[field]}</FieldLabel>
      <span className="relative block">
        <select
          className={`${FIELD_BASE} appearance-none cursor-pointer pr-11`}
          style={fieldStyle(field)}
          value={form[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          aria-invalid={!!errors[field]}
          aria-describedby={errors[field] ? `${field}-err` : undefined}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <SelectChevron />
      </span>
      <FieldError id={`${field}-err`} message={errors[field]} />
    </label>
  )

  return (
    <section
      id="apply"
      className="py-20 md:py-28"
      style={{ background: ICE, scrollMarginTop: HEADER_H }}
    >
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="grid lg:grid-cols-[1fr_620px] gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
              style={{ background: "white", color: ROYAL_BLUE, border: `1px solid ${BORDER}` }}
            >
              Apply to Join BAN
            </span>
            <h2
              className="font-bold mb-4 leading-tight"
              style={{
                fontSize: "clamp(28px, 3.5vw, 42px)",
                color: INK,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Build more than a caseload.
            </h2>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: SECONDARY_TEXT, maxWidth: "42ch" }}
            >
              Lead a practice with an accredited platform, a clinical community, and an operating
              network behind you.
            </p>

            <ul className="flex flex-col gap-3.5 list-none p-0 mb-8">
              {APPLY_ASSURANCES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="mt-1 flex-shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5l3.2 3.2L13 5"
                      stroke={ROYAL_BLUE}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[15px] leading-snug" style={{ color: SECONDARY_TEXT }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-[15px]" style={{ color: MUTED }}>
              Questions first?{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold hover:underline decoration-1 underline-offset-2"
                style={{ color: ROYAL_BLUE }}
              >
                Email the BAN team
              </a>
              .
            </p>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "white",
              border: `1px solid ${BORDER}`,
              boxShadow: "0 8px 40px -16px rgba(16,24,40,0.14)",
            }}
          >
            {submitted ? (
              <div className="flex flex-col items-center text-center px-8 py-16 gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: BLUE_TINT }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <path
                      d="M8 16l6 6 10-10"
                      stroke={ROYAL_BLUE}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="font-bold text-2xl"
                  style={{ color: INK, fontFamily: "Montserrat, sans-serif" }}
                >
                  Thank you, {form.firstName || "and welcome"}.
                </h3>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: SECONDARY_TEXT, maxWidth: "42ch" }}
                >
                  Your information has been received. A member of the BAN team will contact you
                  within two business days at {form.email || "the address you provided"}.
                </p>
              </div>
            ) : (
              <>
                <div
                  className="px-6 md:px-8 pt-6 pb-5"
                  style={{ borderBottom: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-baseline justify-between gap-4 mb-2.5">
                    <span className="text-sm font-bold" style={{ color: INK }}>
                      Practice Partner application
                    </span>
                    <span
                      className="text-[13px] font-semibold tabular-nums"
                      style={{ color: MUTED }}
                    >
                      {completed} of {required.length} required
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full rounded-full overflow-hidden"
                    style={{ background: BLUE_TINT }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${ROYAL_BLUE} 0%, ${CYAN} 100%)`,
                      }}
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Application completion"
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="px-6 md:px-8 py-8 flex flex-col gap-9"
                >
                  {/*
                    Honeypot. Positioned off-screen rather than display:none —
                    some bots skip hidden inputs but fill positioned ones. Kept
                    out of the tab order and the accessibility tree.
                  */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute w-px h-px -left-[9999px] overflow-hidden"
                  />

                  {errorCount > 0 && (
                    <div
                      className="flex items-start gap-3 px-4 py-3.5 rounded-[10px]"
                      style={{ background: "#FEF4F4", border: "1px solid #F1AEAE" }}
                      role="alert"
                      aria-live="polite"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className="mt-px flex-shrink-0"
                      >
                        <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5" />
                        <path
                          d="M8 4.75v4"
                          stroke="#DC2626"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <circle cx="8" cy="11.2" r="0.85" fill="#DC2626" />
                      </svg>
                      <p className="text-sm font-medium" style={{ color: "#991B1B" }}>
                        {errorCount === 1
                          ? "One field needs attention before you can submit."
                          : `${errorCount} fields need attention before you can submit.`}
                      </p>
                    </div>
                  )}

                  <FormSection
                    step="1"
                    title="About you"
                    hint="How we reach you for a confidential conversation."
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      {textInput("firstName", "text", "Jane")}
                      {textInput("lastName", "text", "Smith")}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {textInput("email", "email", "jane@yourpractice.com")}
                      {textInput("phone", "tel", "(617) 555-0100")}
                    </div>
                  </FormSection>

                  <FormSection
                    step="2"
                    title="Your credentials"
                    hint="Where you practice and where you are in certification."
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      {selectField("state", "Select your state", [
                        "Massachusetts",
                        "Connecticut",
                        "Rhode Island",
                        "New Hampshire",
                        "Vermont",
                        "Maine",
                        "New York",
                        "New Jersey",
                        "Pennsylvania",
                        "Other",
                      ])}
                      {selectField("certStatus", "Select status", [
                        "Active BCBA",
                        "Active BCBA-D",
                        "In progress",
                        "Other",
                      ])}
                    </div>
                    <label className="block">
                      <FieldLabel>
                        {labels.bcbaFinder}{" "}
                        <span className="font-medium" style={{ color: MUTED }}>
                          (optional)
                        </span>
                      </FieldLabel>
                      <input
                        type="url"
                        className={FIELD_BASE}
                        style={fieldStyle("bcbaFinder")}
                        value={form.bcbaFinder}
                        onChange={(e) => handleChange("bcbaFinder", e.target.value)}
                        onBlur={() => handleBlur("bcbaFinder")}
                        placeholder="https://www.bcbafinder.com/your-profile"
                        aria-invalid={!!errors.bcbaFinder}
                        aria-describedby={errors.bcbaFinder ? "bcbaFinder-err" : undefined}
                      />
                      <FieldError id="bcbaFinder-err" message={errors.bcbaFinder} />
                    </label>
                  </FormSection>

                  <FormSection
                    step="3"
                    title="What you're looking for"
                    hint="So the right person on our team reaches out."
                  >
                    <div>
                      <FieldLabel required>{labels.situation}</FieldLabel>
                      <OptionCards
                        name="situation"
                        options={[
                          "Employed BCBA",
                          "Independent BCBA",
                          "Existing practice owner",
                          "Other",
                        ]}
                        value={form.situation}
                        onChange={(v) => handleChange("situation", v)}
                      />
                      <FieldError id="situation-err" message={errors.situation} />
                    </div>

                    <div>
                      <FieldLabel required>{labels.interest}</FieldLabel>
                      <OptionCards
                        name="interest"
                        columns={1}
                        options={[
                          "Launching a BAN practice",
                          "Transitioning an existing practice",
                          "Learning more",
                        ]}
                        value={form.interest}
                        onChange={(v) => handleChange("interest", v)}
                      />
                      <FieldError id="interest-err" message={errors.interest} />
                    </div>

                    <label className="block">
                      <FieldLabel>
                        {labels.message}{" "}
                        <span className="font-medium" style={{ color: MUTED }}>
                          (optional)
                        </span>
                      </FieldLabel>
                      <textarea
                        className={`${FIELD_BASE} h-auto py-3 resize-none`}
                        style={fieldStyle("message")}
                        rows={3}
                        value={form.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Anything you'd like us to know before we connect..."
                      />
                    </label>
                  </FormSection>

                  <div className="flex flex-col gap-3">
                    {submitError && (
                      <div
                        className="flex items-start gap-3 px-4 py-3.5 rounded-[10px]"
                        style={{ background: "#FEF4F4", border: "1px solid #F1AEAE" }}
                        role="alert"
                        aria-live="assertive"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                          className="mt-px flex-shrink-0"
                        >
                          <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5" />
                          <path d="M8 4.75v4" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
                          <circle cx="8" cy="11.2" r="0.85" fill="#DC2626" />
                        </svg>
                        <p className="text-sm font-medium" style={{ color: "#991B1B" }}>
                          {submitError}
                        </p>
                      </div>
                    )}
                    <PrimaryButton
                      type="submit"
                      size="lg"
                      block
                      disabled={submitting}
                      withArrow={!submitting}
                    >
                      {submitting ? (
                        <>
                          <svg
                            className="animate-spin"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle
                              cx="9"
                              cy="9"
                              r="7"
                              stroke="rgba(255,255,255,0.3)"
                              strokeWidth="2"
                            />
                            <path
                              d="M9 2a7 7 0 017 7"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </PrimaryButton>
                    <p className="text-xs text-center leading-relaxed" style={{ color: MUTED }}>
                      Submitting does not create a partnership or employment relationship.
                      Participation terms are governed by written agreement.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
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

function Footer() {
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

export default function App() {
  return (
    <div
      id="top"
      className="min-h-screen"
      style={{ fontFamily: "Montserrat, sans-serif", color: INK }}
    >
      <Header />
      <StickyMobileCTA />
      <main>
        <Hero />
        <ThirdPath />
        <YouLead />
        <SupportNetwork />
        <Financial />
        <ExistingPractices />
        <HowItWorks />
        <ApplicationForm />
      </main>
      <Footer />
    </div>
  )
}
