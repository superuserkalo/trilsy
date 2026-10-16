import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";

// Two looks. `menu` is the compact chevron list (the mobile menu). `faq` is the
// question list: dotted ink rules between rows, a large question and a plus
// that turns into a cross as the row opens.
const itemVariants = cva("", {
  variants: {
    variant: {
      menu: "not-last:border-b",
      faq: "border-b-[1.5px] border-dotted border-foreground/40 first:border-t-[1.5px]",
    },
  },
  defaultVariants: { variant: "menu" },
});

const triggerVariants = cva(
  "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg text-left transition-[color,background-color,border-color,box-shadow,opacity] duration-(--duration-base) ease-trilsy outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto",
  {
    variants: {
      variant: {
        menu: "border border-transparent py-5 text-sm font-medium hover:underline focus-visible:border-ring focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
        faq: "-mx-2 gap-6 px-2 py-5 text-lg leading-snug font-semibold tracking-[-0.005em] text-balance transition-colors duration-(--duration-base) ease-trilsy hover:text-secondary **:data-[slot=accordion-trigger-icon]:mt-0.5 **:data-[slot=accordion-trigger-icon]:size-5",
      },
    },
    defaultVariants: { variant: "menu" },
  },
);

const contentVariants = cva(
  "[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
  {
    variants: {
      variant: {
        menu: "pt-0 pb-2.5",
        faq: "max-w-[40em] pt-0 pr-11 pb-6 text-base leading-relaxed text-foreground/80",
      },
    },
    defaultVariants: { variant: "menu" },
  },
);

type Variant = NonNullable<VariantProps<typeof triggerVariants>["variant"]>;

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  variant,
  ...props
}: AccordionPrimitive.Item.Props & VariantProps<typeof itemVariants>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(itemVariants({ variant }), className)}
      {...props}
    />
  );
}

// `level` sets the heading that wraps the trigger (Base UI defaults to h3), so a
// list straight under an h1 does not skip a level.
function AccordionTrigger({
  className,
  children,
  variant,
  level = 3,
  ...props
}: AccordionPrimitive.Trigger.Props & { variant?: Variant; level?: 2 | 3 | 4 }) {
  const faq = variant === "faq";
  const Heading = `h${level}` as const;
  return (
    <AccordionPrimitive.Header className="flex" render={<Heading />}>
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(triggerVariants({ variant }), className)}
        {...props}
      >
        {children}
        <HugeiconsIcon
          icon={faq ? Add01Icon : ArrowDown01Icon}
          strokeWidth={2}
          data-slot="accordion-trigger-icon"
          className={cn(
            "pointer-events-none shrink-0 transition-transform duration-(--duration-base) ease-trilsy",
            faq
              ? "group-aria-expanded/accordion-trigger:rotate-45"
              : "group-aria-expanded/accordion-trigger:rotate-180",
          )}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  variant,
  ...props
}: AccordionPrimitive.Panel.Props & { variant?: Variant }) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-(--duration-base) ease-trilsy data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn(contentVariants({ variant }), className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
