# Self Memory - Known Mistakes and Fixes

## General Guidelines

- Always read @self.md and @project.md before starting any task
- Update memory files after completing tasks
- Use shadcn components when possible
- Prefer existing code patterns over creating new ones

## Mistakes and Fixes

### Mistake: Using deprecated TabsTrigger/TabsContent after Tabs API update

**Wrong**:

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="tab-1">
  <TabsList>
    <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">Content</TabsContent>
</Tabs>;
```

**Correct**:

```typescript
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";

<Tabs defaultValue="tab-1">
  <TabsList>
    <TabsTab value="tab-1">Tab 1</TabsTab>
  </TabsList>
  <TabsPanel value="tab-1">Content</TabsPanel>
</Tabs>;
```

### Mistake: Not checking for undefined when fetching data from arrays/maps

**Wrong**:

```typescript
const competition = competitions.find((c) => c.id === id);
// competition can be undefined!
const name = competition.name; // Runtime error if undefined
```

**Correct**:

```typescript
const competition = competitions.find((c) => c.id === id);
if (!competition) {
  return <div>Not found</div>; // Handle undefined case
}
// or use optional chaining
const name = competition?.name;
```

### Mistake: Missing import statements for components

**Wrong**:

```typescript
// Forgot to actually import
import { BookingDialog } from "@/components/booking-dialog"; // Missing
```

**Correct**:

```typescript
import { BookingDialog } from "@/components/booking-dialog";
```

### Mistake: PopoverTrigger doesn't support `asChild` prop in Base UI

**Wrong**:

```
<PopoverTrigger asChild>
  <Button>Click</Button>
</PopoverTrigger>
```

**Correct**:

```
<PopoverTrigger>
  <Button>Click</Button>
</PopoverTrigger>
```

### Mistake: Date format overflow in DateRangePicker

**Wrong**:

```
format(fromDate, "PPP", { locale: nb }) // Long format causes overflow
```

**Correct**:

```
<span className="truncate">
  {format(fromDate, "PP", { locale: nb })} // Shorter format with truncation
</span>
```

### Mistake: Server components can't use hooks

**Wrong**:

```typescript
export default async function Page() {
  const [state, setState] = useState(); // Error: can't use hooks in server component
  // ...
}
```

**Correct**:

```typescript
"use client";
export default function Page() {
  const [state, setState] = useState(); // Works in client component
  // ...
}

### Mistake: Using next/dynamic to import a module instead of a component
**Wrong**:
```

const ClientSection = dynamic(() => import("@/components/sidebar-navigation-handler"), { ssr: false });

```
This resolves to a module, causing a type error when rendered.

**Correct**:
```

import { SidebarNavigationHandler } from "@/components/sidebar-navigation-handler";
// or export default component and use dynamic(() => import("...")) that returns a component

```

### Mistake: Locale-dependent date formatting caused hydration mismatch
**Wrong**:
```
// In calendar day button attributes
data-day={day.date.toLocaleDateString()}
// And month dropdown using default locale
formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" })
```

**Correct**:
```
// Use locale-invariant, stable formatting
data-day={day.date.toISOString().slice(0, 10)}
formatMonthDropdown: (date) => new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)
```

### Mistake: Using a global booking session timer that affects the whole page
**Wrong**:
```
// Global session started on page load and rendered as a sticky banner
const SESSION_MINUTES = 15;
const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
// ... initialize sessionExpiresAt in useEffect and show banner in UI
{sessionExpiresAt && nowTs < sessionExpiresAt ? (/* banner */) : null}
```

**Correct**:
```
// No global session. Start a per-slot reservation only when user opens a slot dialog
const startReservation = (slotId: string) => {
  const expiresAt = Date.now() + 10 * 60 * 1000;
  setReservations((prev) => {
    const next = new Map(prev);
    next.set(slotId, expiresAt);
    persistReservations(competition.id, next);
    return next;
  });
};

// Derive isLocked for the specific slot
const isLocked = (() => {
  const exp = reservations.get(slot.id);
  return !!exp && exp > nowTs;
})();

// Pass overridden slot to table and show lock UI per-slot
slot: { ...slot, isLocked }
```
