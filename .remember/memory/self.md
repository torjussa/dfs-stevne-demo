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

```
