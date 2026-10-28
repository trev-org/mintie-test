# Mintlify agent instructions

## Updates from `trev-org/mintie-test-code`

Treat `trev-org/mintie-test-code/algorithms/` as the source of truth for the
algorithm documentation.

1. If the merged source pull request does not change `algorithms/**`, make no
   documentation changes and do not open a pull request.
2. For a changed problem, read its `problem.json`, `solution.ts`, and
   `solution.test.ts`.
3. Update the matching pages in:
   - `problems/<slug>.mdx`
   - `es/problems/<slug>.mdx`
   - `fr/problems/<slug>.mdx`
4. For a changed pattern, read its `pattern.json` and update the matching pages
   under `algorithms/`, `es/algorithms/`, and `fr/algorithms/`.
5. Copy TypeScript implementations exactly from `solution.ts`. Do not rewrite,
   optimize, or translate code.
6. Copy names, algorithm steps, examples, edge cases, time complexity, and
   space complexity from structured metadata. Translate prose naturally for
   Spanish and French while preserving technical meaning.
7. Keep all three locales in parity. Never update only one locale.
8. Change navigation in `docs.json` only when a problem or pattern is added,
   removed, or renamed.
9. Do not modify Operations, References, Changelog, or retired SSO pages.
10. Cite the triggering source pull request in the documentation pull request.
    Open changes for review and never merge them automatically.
