# BAN Practice Partner — handover

Everything needed to run, change, and deploy banpractice.com. Written 26 August 2026.

## What this is

A static recruiting landing page for BAN Practice Partners, plus an application form that
emails submissions. React + Vite + Tailwind v4, no backend except one Lambda function.

- **Live at:** https://www.banpractice.com (branch `demo-hs`)
- **Repo:** https://github.com/kimsta007/ban-practice-partner
- **Not** the same as `ban-portal-frontend` (GitLab), which held the previous banpractice.com
  site — an early-access funnel frozen since 30 December 2025 and replaced on 25 August 2026.

### Branches

`demo-hs` is what's deployed. `main`, `GSD-branch`, `GSD-branch-v2` are earlier design
variants and are **not** live. There is no staging environment.

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b
npm run lint
```

Pages: `/` (landing), `/privacy.html`, `/terms.html`.

## Infrastructure

AWS account **754151944121**, region **us-east-1** throughout.

| Thing | Value |
|---|---|
| S3 bucket | `banpractice-prod-front` |
| CloudFront distribution | `E1H0119APGORYN` |
| Lambda | `banpractice-apply-form` |
| Function URL | `https://gkpuj7yc7xpfnwb2xj2ekxgrfm0jedhg.lambda-url.us-east-1.on.aws/` |
| SES identity | `banpractice.com` (Easy DKIM + custom MAIL FROM `mail.banpractice.com`) |
| Lead inbox | `info@banpractice.com` — a Google Group in the Autism Allies Workspace tenant |

Bucket versioning is **on**, with a lifecycle rule `expire-noncurrent-versions` deleting
non-current versions after 30 days. That is the rollback window for a bad deploy.

## Deploying

**There is no CI.** Deployment is a manual sequence in the AWS console. Getting any step
wrong produces a broken site, so read this section before deploying.

```bash
BASE_PATH=/ npm run build
```

`BASE_PATH=/` is **required**. `vite.config.ts` defaults `base` to `/ban-practice-partner/`
for GitHub Pages; without the override every asset URL 404s on the root domain.

Then upload `dist/` to `s3://banpractice-prod-front`, preserving the `assets/` prefix, and
invalidate CloudFront `E1H0119APGORYN` with `/*`.

### Three traps in the console upload

1. **Content-Type must be set by hand for `.js` and `.css`.** The console uploads them as
   `application/octet-stream`. Chrome refuses to execute a module script served that way, so
   the site renders blank. Set it under Properties → Metadata → System defined → Content-Type
   (`text/javascript`, `text/css`). Images and `.html` are detected correctly.
2. **The metadata row silently disappears** when the Properties section re-renders. Re-expand
   Properties and confirm the value is still there immediately before clicking Upload. This
   has bitten every deploy so far.
3. **Missing paths return HTTP 200, not 404.** CloudFront serves `index.html` as an SPA
   fallback for anything it can't find, with `content-type: text/html`. A 200 therefore does
   not prove an asset exists — check the content type. That fallback response is also cached,
   so a broken asset stays broken for minutes after you fix it; invalidate before debugging
   the origin.

Because each upload pass can carry only one Content-Type override, group files: images
together, `.js` together, `.css` together, root HTML together.

### Verifying a deploy

```bash
curl -sS https://www.banpractice.com/ | grep -oE 'index-[A-Za-z0-9_-]+\.js'   # matches your build?
curl -sS -o /dev/null -D - https://www.banpractice.com/assets/<file>.js | grep -i content-type
```

Only files whose hash changed need uploading — diff the build against what's live rather than
re-uploading everything.

## The application form

`src/app/App.tsx` posts the form as JSON to the Lambda Function URL. The Lambda
(`lambda/apply-form/index.mjs`) sends two emails through SES and stores nothing.

- **Staff notification** → `info@banpractice.com`, `Reply-To` = applicant
- **Applicant confirmation** → applicant, `Reply-To` = `info@banpractice.com`

The staff email is awaited and its failure fails the request; the confirmation is best-effort,
because losing a lead matters more than losing a confirmation.

### Changing it

- **Recipients:** change Google Group membership, not code.
- **Copy or template:** edit `index.mjs`, `zip apply-form.zip index.mjs`, then Lambda → Code →
  Update from a .zip file. Pasting into the console editor has repeatedly truncated; use the zip.
- **Config:** `SES_FROM`, `NOTIFY_TO`, `LOGO_URL` are Lambda environment variables.

### Constraints that will look like bugs if you don't know them

- **DMARC on `banpractice.com` is `p=reject`.** Mail failing alignment is rejected outright,
  not spam-foldered. SES Easy DKIM is therefore mandatory — it's what makes the mail
  deliverable at all. The `rua` address points at GoDaddy's aggregator, not to us, so we never
  see the failure reports.
- **One SPF record only.** The apex holds
  `v=spf1 include:_spf.google.com include:amazonses.com -all`, covering Workspace and SES.
  Adding a second TXT record breaks SPF entirely; any new sender goes in this same line, and
  `-all` means anything unlisted is rejected.
- **Email clients strip web fonts.** Montserrat renders in Apple and Samsung Mail; Gmail and
  Outlook fall back to Helvetica/Arial by design.
- **Email clients strip base64 images.** The logo must be a hosted URL at a *stable* path
  (`/email/ban-logo.png`) — bundle asset names are content-hashed and change every build.
- **Gmail proxies and caches images**, so a URL that once returned the wrong thing stays
  broken in already-sent mail.
- The form endpoint is public and visible in the bundle. Defences are a honeypot field
  (`website`), server-side validation, and Lambda reserved concurrency of 5.

## Fonts

`src/styles/fonts.css` imports Montserrat globally, but the landing page applies it through
**23 separate inline `fontFamily` declarations** in `App.tsx` rather than one CSS rule. There
is no global `font-family`.

Consequence: the landing page's **body text is not Montserrat** — it falls back to the
system stack, so it renders differently on macOS, Windows, and Android. Only headings are
Montserrat. The legal pages set the font once on their wrapper and are consistent.

A single `body { font-family: Montserrat, sans-serif }` in `src/styles/index.css` would fix
this everywhere, at the cost of visibly changing the live landing page.

## Legal pages

`/privacy.html` and `/terms.html`, built as extra Vite entry points (`vite.config.ts` →
`rollupOptions.input`). Sources in `src/legal/`. They share the landing page's footer via
`src/shared/SiteFooter.tsx`.

The privacy policy describes the real data flow and states that the site sets no cookies and
runs no analytics — verified against the code, and true as long as nobody adds a tracker. **If
analytics are ever added, this policy becomes false and must be updated.**

**Two values were assumed and never confirmed**, both single constants in
`src/legal/privacy.tsx` and `src/legal/terms.tsx`:

- Operating entity is written as "Behavior Analyst Network"
- Governing law is Massachusetts

Neither has been reviewed by a lawyer.

## Open items

- **No CI.** `aws s3 sync dist/ s3://banpractice-prod-front --delete` plus one invalidation
  command would replace roughly forty console interactions per deploy and eliminate the
  Content-Type and metadata traps entirely.
- **`banpractice.com` without `www` returns 404.** Only `www` is served by CloudFront. The
  bare domain appears in email footers, so an apex→www redirect is worth adding.
- **Stale objects accumulate in the bucket** — the console can't delete, so each deploy leaves
  the previous build's hashed chunks behind. `--delete` on a sync would handle it.
- **Social links in the footer are `href="#"`** and go nowhere.
- **The browser CORS path has never been exercised end-to-end** — all form testing hit the
  Lambda directly with `curl`. Submitting the real form once from the live site would close this.
- **`http://localhost:5173` is still an allowed CORS origin** on the Function URL, left over
  from testing.
- **No bounce visibility.** `noreply@banpractice.com` has no mailbox; an SES configuration set
  with an SNS destination would surface bounces and complaints.

## Backup

The previous (December 2025) site is archived at
`~/Documents/GitHub/banpractice-backup-2026-08-25/` — 34 files. It exists only on that laptop
and is worth moving somewhere durable.
