import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// The full-bleed pale blue field. Dotted ink rules mark its edges so the colour
// reads as a shape on the page, not a background. Sections alternate paper and
// field; no two neighbours share a tone.
const bandVariants = cva("w-full border-dotted border-foreground", {
  variants: {
    tone: {
      paper: "bg-background text-foreground",
      field: "bg-field text-field-foreground",
    },
    rules: {
      both: "border-y-[1.5px]",
      top: "border-t-[1.5px]",
      bottom: "border-b-[1.5px]",
      none: "border-0",
    },
  },
  defaultVariants: { tone: "field", rules: "both" },
});

function Band({
  className,
  tone,
  rules,
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof bandVariants>) {
  return (
    <section
      data-slot="band"
      className={cn(bandVariants({ tone, rules }), className)}
      {...props}
    />
  );
}

// The 2px ink border used on product windows (the app window, the notes pane).
const windowVariants = cva("border-2 border-ink text-card-foreground", {
  variants: {
    // A dashed edge marks something that is not available yet.
    edge: {
      solid: "",
      dashed: "border-dashed",
    },
    tone: {
      card: "bg-card",
      paper: "bg-background",
      muted: "bg-muted",
    },
    radius: {
      default: "rounded-xl",
      lg: "rounded-2xl",
    },
    // A product window lifted off the page by a hard ink offset, no blur.
    lift: {
      none: "",
      hard: "shadow-[6px_7px_0_var(--ink)]",
      soft: "shadow-[4px_5px_0_var(--ink)]",
    },
  },
  defaultVariants: { tone: "card", radius: "default", lift: "none", edge: "solid" },
});

function Window({
  className,
  tone,
  radius,
  lift,
  edge,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof windowVariants>) {
  return (
    <div
      data-slot="window"
      className={cn(windowVariants({ tone, radius, lift, edge }), className)}
      {...props}
    />
  );
}

export { Band, Window, bandVariants, windowVariants };
