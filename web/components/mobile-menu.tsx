"use client";

import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { headerLinks, useCaseGroups, useCasePath } from "@/lib/site";

// Phone menu: the same items as the island, Use cases expanded in place.
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" className="lg:hidden" />
        }
      >
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
        <span className="sr-only">Menu</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(22rem,100vw-1rem)] max-w-none gap-0 overflow-y-auto border-l-[3px] border-field bg-card sm:max-w-none"
      >
        <SheetHeader className="p-5 pb-3">
          <SheetTitle className="font-display text-2xl font-semibold">
            Trilsy
          </SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Main" className="flex flex-col px-3 pb-6">
          <Accordion>
            <AccordionItem value="use-cases" className="border-0">
              <AccordionTrigger className="items-center rounded-lg px-3 py-3 font-sans text-base font-medium hover:no-underline">
                Use cases
              </AccordionTrigger>
              <AccordionContent className="[&_a]:no-underline">
                <ul className="flex flex-col pb-2">
                  {useCaseGroups.flatMap((group) => group.items).map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={useCasePath(item.slug)}
                        onClick={close}
                        className="flex flex-col rounded-lg px-3 py-2 no-underline hover:bg-muted focus-visible:bg-muted"
                      >
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-sm leading-snug text-muted-foreground">
                          {item.lead}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {headerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-lg px-3 py-3 text-base font-medium hover:bg-muted focus-visible:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
