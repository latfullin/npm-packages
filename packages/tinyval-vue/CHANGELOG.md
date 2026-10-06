# Changelog

## 0.1.0

First release.

- `useForm`: values for `v-model`, visible errors (`mode`: blur, input, submit), `touched`, `dirty`, `changes`, async checks with debounce, `handleSubmit`, server errors (`setErrors`, Laravel 422 from axios / ofetch handled automatically), field methods, focus on the first error
- `useField`, `useFieldArray`, `useFormContext`
- Components: `TvForm`, `TvField`, `TvError`, `TvFieldArray`
- `useDraft` (draft in localStorage), `useLeaveGuard` (page close and vue-router navigation)
