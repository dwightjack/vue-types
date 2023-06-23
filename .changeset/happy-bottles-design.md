---
'vue-types': minor
---

Force stricter type for the `.validate(fn)` function arguments:

```ts
// Before: v is of type unknown
string().validate((v) => v === 'Hello') // <-- TS error!

// After: v is of type string
string().validate((v) => v === 'Hello') // <-- Works!
```

This should not be a breaking change, but you should be aware of the new behavior.
