# Open-source health, fitness and nutrition projects

**Purpose:** a curated survey of the main self-hostable and client-side open-source projects a
Nurture team might learn from, reuse or integrate.

**Scope and limitations:** this is a **curated survey of the better-known projects by category**,
not an exhaustive catalogue and not a guarantee that every repository worldwide has been found.
Licences are stated only where the maintainers' own documentation makes them clear; anything
uncertain is marked **verify**. We do not invent repository URLs: where the canonical repository
is uncertain, the project is named and the reader is told to confirm it. Licence and maturity
details change, so every entry must be re-checked against the project's own repository and
`LICENSE` file before it is relied on. Nothing here is legal advice.

## How to keep discovering newer projects

This category moves quickly. Keep the survey current by watching:

- **GitHub topic pages** (for example `self-hosted`, `fitness`, `nutrition`, `health`) and GitHub
  code/topic search sorted by recent activity.
- **F-Droid**, the free-and-open-source Android app catalogue, which is where many mobile trackers
  live.
- **awesome-selfhosted** and other curated "Awesome" lists, which group self-hostable services by
  category.
- Project-independent signals: last commit date, open-issue response, release cadence, CI status
  and whether a `LICENSE` file is actually present and machine-detectable.

## Gym and strength logging

**wger** — an open workout and nutrition manager with a REST API, a web app and a companion mobile
app. Stack: Python/Django backend with a web front end and a Flutter mobile client. Platform:
self-hostable web plus Android/iOS app. Licence: **AGPL-3.0** (verify current text). Maturity:
long-running project with documentation, translations and active releases. Gaps: the interface is
functional rather than polished, and food data is thinner than a dedicated nutrition tracker.

**openGym** — a personal workout-tracking app. The canonical repository named by the project is
`github.com/DuarteSantos8/openGym`; **stack, platform and licence should be verified** against that
repository before use, as this survey could not confirm them.

**FitBook-style training diaries** — several open trackers imitate the printed "FitBook" workout
diary (grids of exercises, sets and reps). The pattern is well established, but no single canonical
repository can be named with confidence here; **treat this as a design pattern to look for rather
than a specific project**, and confirm any candidate's repository and licence directly.

## General workout and exercise tracking

**Feeel** — an open-source home-workout app offering guided bodyweight routines with no ads and no
tracking. Platform: Android (available via F-Droid). Licence: **GPL-3.0** (verify). Maturity: part
of the "Enjoying FOSS" family with a small, focused codebase and documentation. Gaps: home workouts
only; no strength-logging depth or nutrition.

**FitoTrack** — a privacy-friendly workout tracker for logging many activity types with optional
GPS. Platform: Android (F-Droid). Licence: **GPL-3.0** (verify). Maturity: established, actively
maintained Android project. Gaps: Android only; no nutrition or coaching layer.

**RunnerUp** — an open-source running and walking tracker with GPS, audio cues and history.
Platform: Android (F-Droid). Licence: **GPL-3.0** (verify). Gaps: running-centric and Android-only.

## Nutrition, calorie and micronutrient tracking

**OpenNutriTracker** — an open-source calorie and nutrition tracker focused on privacy, with no ads
and no user tracking. Stack: Flutter mobile app. Platform: Android/iOS (F-Droid). Licence:
**GPL-3.0** (verify). Maturity: F-Droid presence and steady releases. Gaps: a personal-scale project,
so database coverage and feature depth are smaller than commercial trackers.

**SparkyFitness** — a self-hosted fitness and nutrition tracker positioned as an open alternative to
commercial trackers. Platform: self-hostable server with a web and mobile client. Licence:
**not a standard open-source licence — commercial use is restricted**; the terms are source-available
rather than OSI-approved, and **the current terms must be verified**. Maturity: active, but the
licence is the single most important thing to check before any commercial use.

## Recipe and meal planning servers

**Mealie** — a self-hosted recipe manager and meal planner with a shopping list built from planned
meals. Stack: Python (FastAPI) backend with a Vue front end, distributed as a Docker image.
Platform: self-hosted web. Licence: **AGPL-3.0** (verify). Maturity: strong documentation, an active
community and regular releases. Gaps: it is a recipe and planning tool, not a calorie or
micronutrient tracker.

**Tandoor Recipes** — a self-hosted recipe manager with meal planning, shopping lists and scaling.
Stack: Python/Django. Platform: self-hosted web. Licence: **AGPL-3.0** (verify). Maturity: active
project with documentation and an API. Gaps: same as Mealie — planning and recipes, not nutrient
tracking.

**Grocy** — a self-hosted household manager covering stock, shopping lists, chores and recipes.
Stack: PHP. Platform: self-hosted web. Licence: **MIT** (verify). Maturity: mature, widely deployed,
well documented. Gaps: it is a household/pantry system first; nutrition is incidental.

## Food data sources

**Open Food Facts** — a collaborative, open food-products database with a public API, barcode
coverage and per-product nutrition. Licence: the **database is published under the Open Database
License (ODbL)**, with individual contents under a compatible contents licence; **this is a data
licence, not the app's licence**, and attribution/share-alike obligations apply. Gaps: crowd-sourced
data is inconsistent, coverage varies by country, and entries can be duplicated or mis-entered.

**USDA FoodData Central** — a public-domain nutrient dataset from the United States Department of
Agriculture. Licence: **public domain (US Government work)** (verify terms). Gaps: US-centric and
not a live product database; it is reference data to be mapped, not an app.

## Activity and GPS tracking

**OpenTracks** — an open-source sport and activity tracker for Android that records GPS tracks with
no ads and no tracking. Platform: Android (F-Droid and Play). Licence: **Apache-2.0** (verify).
Maturity: long-standing, actively maintained, with an ecosystem of companion apps. Gaps: Android
only; it is a recorder, not a coach or a nutrition tool.

(FitoTrack and RunnerUp, above, also sit in this category.)

## Health-record and self-hosting suites

**Fasten Health** — an open-source, self-hostable **personal health record** aggregator that connects
to health systems and consolidates records for the individual. Platform: self-hosted server with a
web/mobile client. Licence: **verify** — reported as a permissive/AGPL licence but this survey could
not confirm it. Gaps: oriented to clinical records, not fitness logging.

**Home Assistant** — a self-hosted home-automation platform with a large integration ecosystem that
some people use as a data hub. Platform: self-hosted. Licence: **Apache-2.0** (verify). Gaps: it is a
home-automation platform, not a health product; health use depends on third-party integrations.

## Wearable and device data bridges

**Gadgetbridge** — an open-source Android app that talks to many wearables (bands and watches) and
syncs their data locally **without the vendor cloud**. Platform: Android (F-Droid). Licence:
**GPL-3.0** (verify). Maturity: long-running, actively maintained, with broad device support. Gaps:
device support is community-driven and uneven; not all vendors or features are covered.

## Critical distinction: application code vs dataset vs media licence

The most common licence mistake in this category is assuming that one licence covers a whole
project. Three things can each carry a **different** licence:

| Layer | Example | What to check |
|---|---|---|
| **Application code** | wger, Mealie, Grocy | The repository `LICENSE` file and its SPDX identifier. |
| **Dataset** | Open Food Facts (ODbL) | The data licence, which can impose attribution or share-alike duties even when the app code is permissive. |
| **Media** | recipe photos, exercise images, icons | The media licence, which is often different again and sometimes non-commercial. |

A permissively licensed app can still ship food data or images under a different, more restrictive
licence. Always check all three layers before reusing content, and never assume the app's licence
extends to its bundled data or media.

## Comparison table

| Project | Category | Licence | Platform | Self-hostable | Mobile app | Maturity |
|---|---|---|---|---|---|---|
| wger | Gym/strength + nutrition | AGPL-3.0 (verify) | Web + mobile | Yes | Yes (Flutter) | Mature |
| openGym | Gym/strength | Verify | Verify | Verify | Verify | Verify |
| Feeel | General workouts | GPL-3.0 (verify) | Android | n/a | Yes | Active |
| FitoTrack | Workout/activity | GPL-3.0 (verify) | Android | n/a | Yes | Active |
| RunnerUp | Running | GPL-3.0 (verify) | Android | n/a | Yes | Active |
| OpenNutriTracker | Nutrition | GPL-3.0 (verify) | Android/iOS | n/a | Yes | Active |
| SparkyFitness | Fitness + nutrition | Non-OSI, restricted (verify) | Self-hosted | Yes | Yes | Active |
| Mealie | Recipes/meal plans | AGPL-3.0 (verify) | Web | Yes | Web | Mature |
| Tandoor Recipes | Recipes/meal plans | AGPL-3.0 (verify) | Web | Yes | Web | Active |
| Grocy | Household/pantry | MIT (verify) | Web | Yes | Web | Mature |
| Open Food Facts | Food data source | ODbL (database) | API/web | n/a | Yes | Mature |
| USDA FoodData Central | Food data source | Public domain (verify) | Data | n/a | No | Mature |
| OpenTracks | Activity/GPS | Apache-2.0 (verify) | Android | n/a | Yes | Mature |
| Fasten Health | Health records | Verify | Self-hosted | Yes | Yes | Active |
| Home Assistant | Hub | Apache-2.0 (verify) | Self-hosted | Yes | Yes | Mature |
| Gadgetbridge | Wearable bridge | GPL-3.0 (verify) | Android | n/a | Yes | Mature |

## How to choose

- **Match the licence to your intent.** Reusing code in a closed product rules out copyleft
  (AGPL/GPL) unless you comply fully; source-available projects like SparkyFitness may forbid
  commercial use outright.
- **Separate the data question from the code question.** You can often use an app and a completely
  different dataset; check both.
- **Prefer maintained projects.** Judge by recent commits, release cadence and issue response, not
  stars alone.
- **Check the deployment burden.** A self-hosted server needs updates, backups and a domain; an
  Android-only tracker needs none.

## Recommended self-hosted stack

For someone who wants a self-hosted setup today: **Mealie or Tandoor Recipes** for recipes and meal
planning, **Grocy** for the pantry and shopping list, **wger** for workouts, **OpenNutriTracker** for
calorie logging on the phone, **OpenTracks** (or FitoTrack) for GPS activity, **Gadgetbridge** to
pull wearable data locally, and **Open Food Facts** as the food data source. Keep the licences of
the recipe media and the food dataset separate from the app code, and re-verify each licence before
shipping anything.

## Method and limitations

This is a **desk survey of publicly documented projects**, written without live access to the
repositories; licence identifiers, stacks and maturity signals must therefore be confirmed against
each project's own repository and `LICENSE` file. Projects are included because they are well known
in the self-hosting and open-source communities, not because they were benchmarked. The survey
cannot guarantee completeness, and newer or niche projects may exist that are not listed here.
Where a fact could not be confirmed, it is marked **verify** rather than guessed, and no repository
URL is asserted unless the project itself states it.
