---
name: update-roadmap-releases
description: Refresh the Roadmap and Releases sections of the portfolio site from each connected project's GitHub repo. For each project it infers upcoming roadmap items and the single latest release from repo state (via the gh CLI), then rewrites roadmapMap and releaseMap in src/components/Changes.tsx. Use when the user asks to update/refresh the roadmap and releases on the site. Exactly one release is kept per project.
---

# Update Roadmap & Releases

Regenerate the `roadmapMap` and `releaseMap` in `src/components/Changes.tsx` from the
live state of each connected project's GitHub repository.

Data comes from GitHub via the `gh` CLI. For each project you **infer** the roadmap and
the latest release from repo state (README, recent commits, open issues/PRs, version
files, existing releases/tags). You are not copying a single canonical file, you are
summarising what the repo tells you into the site's data shape.

## Golden rules

- **Exactly one release per project.** `releaseMap[project]` must contain a single entry:
  the latest/current release. If the existing map has several, collapse to the newest one.
- **Roadmap = what's coming next**, not what already shipped. Prefer open issues/PRs,
  `TODO`/`ROADMAP` files, and clearly in-progress work in recent commits. Drop items that
  the latest release already delivered.
- **Only touch `roadmapMap` and `releaseMap`** in `src/components/Changes.tsx`. Do not
  change the surrounding builder functions, types, or any other file.
- **Keys are fixed.** The `ChangeProject` type is `finska | gym_junkie | balderdash |
  downer_helper`. Keep those four keys present in both maps (an empty `[]` is valid when a
  project has nothing to show or its repo is unreachable). Do not invent new keys without
  also updating the `ChangeProject` type.

## Project → repo mapping

| site key       | GitHub repo(s)                                    | release link fallback |
|----------------|---------------------------------------------------|-----------------------|
| `finska`       | `moates695/finska`                                | Expo build / Play Store (`woodchuckPlayStoreLink`) |
| `gym_junkie`   | `moates695/gym_tracker` (app) + `moates695/gym_tracker_server` (backend) | Expo build / `gymJunkiePlayStoreLink` |
| `balderdash`   | `moates695/balderdash`                            | Expo (`expoLink`) |
| `downer_helper`| PyPI package `downerhelper` (repo may be private/inaccessible under current auth) | `downerhelperLink` (PyPI) |

Repo names can drift. If a `gh` call 404s, run `gh repo list moates695 --limit 100` (and
try other orgs the user owns) to relocate it. If a repo is genuinely unreachable, **leave
that project's existing entries untouched** and note it in your summary, rather than
blanking it.

## Steps

1. **Confirm tooling.** `gh auth status` should show a logged-in account. If not, stop and
   tell the user to run `gh auth login`.

2. **Gather repo state** for each project. Useful, low-noise commands:
   - `gh repo view <repo> --json name,description,pushedAt,url`
   - `gh release list -R <repo> --limit 5` and `gh release view -R <repo> <tag> --json tagName,name,body,url,publishedAt` (latest release + notes, if any exist)
   - `gh api repos/<repo>/tags --jq '.[0:5][].name'` (fall back to tags when there are no Releases)
   - `gh issue list -R <repo> --state open --limit 20 --json number,title,labels,body`
   - `gh pr list -R <repo> --state open --limit 20 --json number,title,body`
   - Version + notes files:
     `gh api repos/<repo>/contents/app.json --jq '.content' | base64 -d` (Expo apps → `expo.version`),
     `.../contents/package.json`, `.../contents/pyproject.toml`, and any
     `CHANGELOG.md` / `ROADMAP.md` / `TODO.md`. A missing file returns 404 — that's fine, skip it.
   - `gh api repos/<repo>/commits --jq '.[0:15][].commit.message'` to see what's landed recently.

   For `gym_junkie`, look at **both** repos and merge: app-facing changes usually live in
   `gym_tracker`, backend/API work in `gym_tracker_server`.

3. **Infer the single latest release** per project → one `ReleaseBareData`:
   - `header`: short lowercase label, matching the existing style (e.g. `gym junkie internal`, `woodchuck internal testing`).
   - `version`: the current version. Prefer a GitHub Release tag; else the version file
     (Expo `app.json` `expo.version`, `package.json`, `pyproject.toml`); else the newest git tag.
   - `link`: a GitHub Release URL if one exists; otherwise reuse the existing valid link in
     the current `releaseMap`, or the fallback from the mapping table (import names live in
     `src/middleware/links.ts` — reuse those constants where the existing entries do, or an
     inline URL matching the current entries' style).
   - `points`: 3 to 6 concise bullets of what this release delivers, drawn from release
     notes / changelog / the commits since the previous version.

4. **Infer roadmap items** per project → an array of `RoadmapBareData`:
   - `header`: short lowercase label.
   - `chipKey`: one of `feature`, `improvement`, `bug_fix` (these are the only valid
     roadmap chips; verify against `src/middleware/chipMap.tsx`).
   - `points`: 2 to 4 bullets describing the upcoming work and its current status.
   - Source from open issues/PRs, `TODO`/`ROADMAP` files, and in-progress commit trails.
     Exclude anything the latest release already shipped. 0 to 3 items per project is
     typical; an empty `[]` is fine when there's nothing credible to show.

5. **Rewrite the two maps** in `src/components/Changes.tsx`, preserving the file's exact
   formatting: 2-space indentation, single quotes, trailing commas, key order
   `finska, gym_junkie, balderdash, downer_helper`. Keep the `RoadmapMap` / `ReleaseMap`
   type annotations and every builder function below the maps unchanged.

6. **Verify.** Run `npx tsc --noEmit` (or `npm run build`) and confirm it type-checks. A
   common failure is a `chipKey` or link constant that doesn't exist — fix by using a valid
   `ChipKey` and importing the link from `src/middleware/links.ts`.

7. **Summarise** to the user: per project, the release version chosen and how many roadmap
   items were written, plus any repo you couldn't reach and therefore left as-is. Do **not**
   commit, push, or deploy unless the user asks.

## Site copy conventions (these strings render on the live site)

- **No em-dashes (—) anywhere in the strings.** Use commas, colons, "to" for ranges, or
  hyphens. (This is a hard project rule — see `CLAUDE.md`.)
- Australian English spelling (customise, colour, etc.).
- Lowercase, terse headers and bullet points, matching the existing entries' voice. No
  trailing full stops on bullets.
- Keep bullets factual and specific ("backend complete, frontend in progress"), not marketing fluff.
