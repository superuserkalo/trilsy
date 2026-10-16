"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { headerLinks, useCaseGroups, useCasePath } from "@/lib/site";

const getIsland = () => document.querySelector<HTMLElement>("[data-island]");

// Desktop navigation. The Use cases panel is anchored to the island, not to its
// trigger, so it drops under the whole island at the island's width. Base UI
// handles hover, click, arrow keys, Escape and focus return.
export function HeaderNav() {
  return (
    <NavigationMenu
      aria-label="Main"
      anchor={getIsland}
      align="center"
      sideOffset={8}
      className="hidden flex-none lg:flex"
    >
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Use cases</NavigationMenuTrigger>
          <NavigationMenuContent className="w-[min(906px,calc(100vw-2rem))] p-3">
            <div className="grid grid-cols-2 gap-x-3">
              {useCaseGroups.map((group) => (
                <ul
                  key={group.label}
                  aria-label={group.label}
                  className="flex flex-col"
                >
                  {group.items.map((item) => (
                    <li key={item.slug}>
                      <NavigationMenuLink
                        closeOnClick
                        className="flex-col items-start gap-0.5"
                        render={<Link href={useCasePath(item.slug)} />}
                      >
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-sm leading-snug text-muted-foreground">
                          {item.lead}
                        </span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {headerLinks.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink
              render={<Link href={link.href} />}
              className={cn(
                navigationMenuTriggerStyle(),
                "hover:bg-muted focus-visible:bg-muted",
              )}
            >
              {link.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
