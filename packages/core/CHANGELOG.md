# vue-types

## 5.1.0

### Minor Changes

- ec32a30: Force stricter type for the `.validate(fn)` function arguments:

  ```ts
  // Before: v is of type unknown
  string().validate((v) => v === 'Hello') // <-- TS error!

  // After: v is of type string
  string().validate((v) => v === 'Hello') // <-- Works!
  ```

  This should not be a breaking change, but you should be aware of the new behavior.

## 5.0.4

### Patch Changes

- 9dfa28b: Allow the user to pass async functions as function props. Closes #397

## 5.0.4-next.0

### Patch Changes

- 9dfa28b: Allow the user to pass async functions as function props. Closes #397

## 5.0.3

### Patch Changes

- 8cb1ccb: - Accepts null as valid value in validateType util

  - fix docs: `nullable()` should be used for nullable required props.

  Closes #383

## 5.0.3-next.0

### Patch Changes

- 8cb1ccb: - Accepts null as valid value in validateType util

  - fix docs: `nullable()` should be used for nullable required props.

  Closes #383
