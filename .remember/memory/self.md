# Self Memory - Known Mistakes and Fixes

## General Guidelines

- Always read @self.md and @project.md before starting any task
- Update memory files after completing tasks
- Use shadcn components when possible
- Prefer existing code patterns over creating new ones

## Mistakes and Fixes

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
