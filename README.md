# Advaita Sharma — portfolio ("Dev console")

A dark, IDE-inspired developer portfolio: file-tree sidebar, typed terminal hero, bento About, repo-style project rows with case-study pages, a ⌘K command palette, cursor spotlight on cards, and a photo wall. Light mode via the theme toggle. Vite + React + TypeScript + Tailwind v4 + Framer Motion; two Vercel serverless routes (contact form, guestbook).

## Setup

```bash
npm install
cp .env.example .env     # add RESEND_API_KEY etc.
npm run dev              # http://127.0.0.1:5173 (a dev shim serves /api, no Vercel CLI needed)
npm run build
```

| Variable | Used by | Notes |
|---|---|---|
| `RESEND_API_KEY` | `/api/rishta`, `/api/guestbook` | email delivery |
| `RISHTA_TO_EMAIL` | same | where messages land |
| `RISHTA_FROM_EMAIL` | same | sender on a Resend-verified domain |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | `/api/guestbook` | optional free Redis (upstash.com) that stores guestbook notes |
| `MODERATION_SECRET` | `/api/guestbook` | any long random string; protects your private inbox link |
| `GUESTBOOK_AUTO_PUBLISH` | `/api/guestbook` | `true` to publish notes instantly; default is approval |

## What happens to messages

- **Contact form ("Let's talk")** → emailed to `RISHTA_TO_EMAIL` through Resend with the visitor as Reply-To (just hit **Reply**), and, when Upstash is configured, also archived in your private inbox page.
- **"Things people say about me"** (guestbook, in the Life section) → saved in Upstash Redis and held until **you approve it** on your private inbox page (the default). Set `GUESTBOOK_AUTO_PUBLISH=true` to publish notes straight away; suspicious ones (links, blocked words, all-caps, repeated characters) are still held.
- **Your private inbox page:** every email contains a link to `/api/guestbook?review=<token>` showing all contact messages (with a Reply link) and all guestbook notes (Approve / Remove from site). The token comes from `MODERATION_SECRET`; change that value to revoke the link.
- Without Upstash configured: messages are emailed only, and guestbook notes are not shown on the site.

## Optional: "Sign in with Google" on the guestbook

Visitors can sign in with Google so their note shows a verified name and their real profile photo (a green tick). Their email is stored privately (visible only on your inbox page) and never shown publicly. It switches on when you set a Google Client ID:

1. Open https://console.cloud.google.com/apis/credentials, create a project if asked, set up the OAuth consent screen (External, app name "Advaita Sharma portfolio", your email).
2. Create credentials, OAuth client ID, type **Web application**. Under *Authorized JavaScript origins* add `https://advaita-sharma.vercel.app` and `http://localhost:5173`.
3. Copy the Client ID and put the same value in `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` (in `.env` and in Vercel), then redeploy.

Without a Client ID the guestbook simply works without the Google button.

## Where things live

- `src/data/site.ts`: all content and the photo list. `null` values show a "to be added" comment.
- `src/data/projectDetails.ts` and `src/data/flows.ts`: the detailed case studies and horizontal workflow diagrams for employer projects (generic wording, no internal names, no security details).
- `public/assets/images`: your photos and certificate crops. All were rotated upright and **stripped of EXIF metadata** (camera model, timestamps, any location). Do the same for any new photo you add.
- `public/assets/logos` + `src/data/techIcons.ts`: organisation logos and tech icons (Simple Icons, CC0). Logos are trademarks of their owners; check your employer's brand rules before keeping the Maersk logo.
- `src/index.css`: tokens (dark/light), terminal chrome, spotlight, palette styles.
- `src/components/Palette.tsx`: ⌘K / Ctrl+K command palette.
- `api/rishta.ts`, `api/guestbook.ts`: validated, honeypot-protected, rate-limited (in-memory; swap `api/_lib/guard.ts` for Upstash / Vercel KV for strict limits).
- Motion (typed terminal, reveals, spotlight, scroll bar) is switched off under `prefers-reduced-motion`.

## Confidentiality

- Employer projects show **hand-drawn workflow diagrams, not screenshots or video**. Diagrams use generic labels: no internal system names, tables, URLs, customers, country rollout lists or figures. Do not add real screenshots unless your employer has approved them in writing.
- The work-log document used as a source (`doc adv.docx`) is derived from internal pages: keep it out of this repo.
- Internal product codenames beyond P2R / AFR / CostraX (which you chose to show) are not used. Impact numbers stay hidden until confirmed.
- Phone number is never published (it appears in a slide screenshot on LinkedIn; it was not copied). Colleagues' names and photos were not used.

## Deploy

Import the GitHub repo in Vercel, add the env vars, deploy.

## Still to fill (search for "to be added")

- Distances for the BeAthlit Persistence Run and the Apollo Commitment Run; your short story; NCC story
- Per-project contribution for P2R / AFR / Cost to Serve; confirmed impact numbers; confirmation that those project names are public-safe
- Optional: screenshots for Zephyr / drone swarm / BHEL app (the LinkedIn screenshots were not reused because they contain other people's names and a phone number)
- Verify the Zephyr link (`https://lnkd.in/gyPTGvHq`, copied from your LinkedIn post) opens your itch.io page
