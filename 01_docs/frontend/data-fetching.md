# Data Fetching

## Library

Use:

TanStack Query

Reason:

- caching
- automatic refetch
- loading states
- error handling

---

## Hook Pattern

All API calls must be wrapped in hooks.

Example:

hooks/useTimeline.ts

Hooks return:

data
loading
error

Example:

const { data, isLoading } = useTimeline()

---

## Query Keys

Use consistent query keys.

Examples:

timeline
events
letters
media
profile

---

## Caching

Timeline data can be cached for 60 seconds.

Example:

staleTime: 60000

---

## Mutation Pattern

For create/update/delete operations use:

useMutation()

Example:

createEvent
createLetter
uploadMedia

---

## Error Handling

Hooks must handle errors and return safe states.

UI components must never crash on API errors.