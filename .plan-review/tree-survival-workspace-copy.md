# Tree survival workspace: text-only update

## Goal and scope
Update only the workspace section immediately after the four-feature benefits section on the home page. Preserve the existing design, structure, styling, imagery, icons, spacing rules, and all dates. No redesign or new functionality.

## Repository findings
- The section is `<section className="workspace page-section" id="workspace">` in `src/App.tsx`.
- Its embedded dashboard preview is the `TaskBoard` function in the same file. It is used only once.
- The preview's search placeholder is a static `<span>`, not a functional input. Replace its displayed literal without introducing an input or changing behavior.
- The dates currently displayed are `24 Mar` and `12/03/2026 - 26/03/2026`.

## Implementation
Edit only text in `src/App.tsx`.

### Section copy
- Heading: `Your all-in-one tree survival workspace`
- Description: `Plant trees, assign caretakers, and track survival in one simple platform. Keep every planter motivated and every tree counted.`
- Feature title: `Turn plantings into living forests`
- Feature description: `Break down drives into simple tasks, track survival in real time, and help every planter stay motivated.`

Preserve the existing heading's two-line structure by putting the existing `<br />` after `tree`: `Your all-in-one tree` / `survival workspace`.
Preserve the description's existing line-break structure by putting its `<br />` after `simple`: `Plant trees, assign caretakers, and track survival in one simple` / `platform. Keep every planter motivated and every tree counted.`
These line breaks do not alter the requested wording.

### Dashboard preview replacements
| Existing text | Exact replacement |
| --- | --- |
| Kubik product design system | Hunza plantation drive |
| Search for inspiration to provide a rich co... | Search for a tree, planter or plot nearby |
| Vintage app.pdf | Survival report.pdf |
| Meeting with Arthur Taylor | Meeting with Forest Department |
| Regent App Redesign | Chinar Planting Campaign |
| Design Lead | Field Lead |
| Smith K. | Ahmed K. |
| Weekly Board Meeting | Weekly Survival Review |

## Preservation constraints
- Keep all JSX containers, class names, colors, icons, images, shadows, typography, alignment, padding, margins, and responsive rules unchanged.
- Keep `24 Mar` and `12/03/2026 - 26/03/2026` exactly unchanged.
- Keep the `Name` label, avatar initial `R`, search glyph, status dot, and calendar glyph unchanged.
- Do not modify the hero, benefits section, other dashboard illustrations, other pages, or CSS.
- Insert full requested text without manually shortening it or adding ellipses. Allow existing wrapping rules to apply; do not compensate for copy length with design changes.
- No backend, dependencies, routing changes, or new interactions are required.

## Verification
- Inspect the scoped diff to confirm only the twelve requested text replacements and existing line-break placement change.
- Confirm all replacement strings match the requested spelling, capitalization, and punctuation.
- Confirm both dates and all class names remain unchanged.
- Run `git diff --check` for whitespace errors.
- As this is a localized copy-only edit, skip builds, typechecks, tests, and runtime checks per repository workflow instructions.

## Acceptance criteria
The workspace section shows all supplied tree-survival copy verbatim, retains both dates and its existing visual styling, and no other section changes.
