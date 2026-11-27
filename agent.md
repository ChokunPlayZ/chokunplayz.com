# Agent guidelines

## Writing code

- Read the surrounding code and follow the repository’s conventions. Reuse existing helpers and components when they fit.
- Make the smallest change that fully solves the problem. Keep unrelated edits out of the diff.
- Use clear names and straightforward control flow. Use comments to explain decisions the code alone can’t show.
- Preserve behavior callers rely on. Handle edge cases and failures where they affect the change.
- Review the diff and run the checks that cover the change. Add or update a focused test when it catches a regression the current tests miss.

## Finishing a task

- Always commit task changes before handing back. Stage only the changes for the task and review the staged diff.
- Use `(type): explain` for the commit subject. Pick a type such as `feat`, `fix`, `refactor`, `docs`, `test`, or `chore`, and describe the actual change. For example, `(fix): handle missing photo metadata` describes a bug fix.
- Push the commit to the task branch’s upstream unless the user asks to keep it local. Report the commit, verification results, and any push failure.
