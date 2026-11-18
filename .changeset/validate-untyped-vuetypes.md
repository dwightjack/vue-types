---
'vue-types': minor
---

`validateType` now runs custom validators for VueTypes definitions that have no native `type` (e.g. `symbol()`, `any().validate(...)`, `oneOf()`, or `toType()`/`toValidableType()` with `type` set to `undefined` or `true`). Previously these validators were silently skipped.

- This also applies when such definitions are nested in `shape`, `arrayOf`, `objectOf` and `oneOfType`, so values that used to pass may now fail validation (e.g. `arrayOf(symbol())` rejects `[1]`).
- Optional (non-`required`) props still accept `null` and `undefined` without calling the validator.
- Validators of `required` untyped definitions now receive `null`/`undefined` through `validateType` and must handle them.
- Raw Vue prop options with `type: undefined` or `type: true` keep the previous behavior.
- Docs: fix the `validateType` error-return flag (`true`) and a regular-expression example.
