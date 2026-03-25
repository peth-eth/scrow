# Website

Marketing/documentation site for Smart Invoice. Built with Next.js + Chakra UI.

## Structure

- `pages/` — Next.js pages:
  - `index.jsx` — homepage
  - `about.jsx` — about page
  - `getting-started/[slug].jsx` — getting started docs (markdown-driven)
  - `arbitration/[slug].jsx` — arbitration docs
  - `tutorials/arbitrator/`, `tutorials/client/`, `tutorials/contractor/` — role-specific tutorials
  - `misc/[slug].jsx` — miscellaneous docs
- `components/` — React components:
  - `home/` — homepage sections (Hero, Demo, FAQ, Feature*, StoryOverview, Testimonials)
  - `about/` — about page sections (Hero, Story, Supporters, Team, Testimonials)
  - `layout/` — app shell (Layout, NavBar, Footer, Head, CallToAction)
  - `doc-layout/` — documentation page layout wrapper
  - `icons/` — SVG icon components (CheckSquare)
- `docs-v3/` — markdown documentation content
- `public/` — static assets

## Patterns

- Uses Chakra UI (NOT Tailwind) — this is the original marketing site, separate from the dapp
- Documentation pages use `gray-matter` + `remark` for markdown parsing
- Dynamic routes (`[slug].jsx`) load markdown files from `docs-v3/`

## Gotchas

- This site uses Chakra UI v2, NOT the Tailwind/shadcn setup from the dapp
- JSX files (not TSX) — no TypeScript in website components
- Separate `next.config.js` and `tsconfig.json` from the dapp
