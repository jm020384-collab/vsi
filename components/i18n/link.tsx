"use client";

import { forwardRef, type ComponentProps } from "react";
import NextLink from "next/link";

import { useI18n } from "@/lib/i18n/client";
import { localizeHref } from "@/lib/i18n/config";

/** next/link, що не випускає читача з обраної мови. */
const Link = forwardRef<HTMLAnchorElement, ComponentProps<typeof NextLink>>(function Link(
  { href, ...props },
  ref,
) {
  const { locale } = useI18n();
  return (
    <NextLink
      ref={ref}
      {...props}
      href={typeof href === "string" ? localizeHref(href, locale) : href}
    />
  );
});

export default Link;
