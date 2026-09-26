"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import React from "react";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  /** Opens the link in a new tab, both from the trigger and from the preview card. */
  external?: boolean;
} & ({ isStatic: true; imageSrc: string } | { isStatic?: false; imageSrc?: never });

type Status = "loading" | "ready" | "error";

// Microlink renders a live screenshot of the page. Its free tier is rate limited, so the error state matters.
const screenshotUrl = (url: string, width: number, height: number, colorScheme: string) =>
  `https://api.microlink.io/?${new URLSearchParams({
    url,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    colorScheme,
    "viewport.isMobile": "true",
    "viewport.deviceScaleFactor": "1",
    "viewport.width": String(width * 3),
    "viewport.height": String(height * 3),
  })}`;

// Link that shows a screenshot of its destination above it on hover or keyboard focus.
export const LinkPreview = ({
  children,
  url,
  className,
  width = 240,
  height = 150,
  external = false,
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) => {
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotion();
  const [isOpen, setOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("loading");

  // The theme is only known on the client, so the screenshot URL waits for mount.
  React.useEffect(() => setIsMounted(true), []);

  const src = isStatic ? imageSrc : isMounted ? screenshotUrl(url, width, height, resolvedTheme === "light" ? "light" : "dark") : "";

  // A server-rendered image can finish loading before hydration attaches onLoad, so read its state directly.
  const preload = React.useRef<HTMLImageElement>(null);
  React.useEffect(() => {
    const img = preload.current;
    if (img?.complete) setStatus(img.naturalWidth ? "ready" : "error");
    else setStatus("loading");
  }, [src]);

  // The card drifts a little toward the pointer's position along the trigger.
  const x = useMotionValue(0);
  const translateX = useSpring(x, { stiffness: 100, damping: 15 });

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) / 2);
  };

  const target = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <>
      {/* Warm the cache so the screenshot is ready by the first hover. */}
      {src ? (
        <img
          ref={preload}
          src={src}
          alt=""
          aria-hidden="true"
          className="hidden"
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
        />
      ) : null}

      <HoverCardPrimitive.Root openDelay={80} closeDelay={100} onOpenChange={setOpen}>
        <HoverCardPrimitive.Trigger onMouseMove={handleMouseMove} className={className} href={url} {...target}>
          {children}
        </HoverCardPrimitive.Trigger>

        {/* Portalled, because the scroll-reveal transform on list items would otherwise trap the fixed card. */}
        <HoverCardPrimitive.Portal forceMount>
          <HoverCardPrimitive.Content
            forceMount
            side="top"
            align="center"
            sideOffset={10}
            className="z-40 [transform-origin:var(--radix-hover-card-content-transform-origin)]"
          >
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ x: translateX }}
                >
                  {/* The one elevated surface on the page: it floats over the card it previews. */}
                  <a
                    href={url}
                    {...target}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block rounded-lg border border-line bg-raised p-1 shadow-[0_8px_24px_rgb(0_0_0/0.18)] transition-colors duration-200 ease-out hover:border-line-strong"
                  >
                    {status === "error" ? (
                      <span
                        className="flex items-center justify-center rounded-md bg-tag px-4 text-center text-xs text-muted"
                        style={{ width, height }}
                      >
                        Preview unavailable. Open the link to see the page.
                      </span>
                    ) : (
                      <span className="relative block overflow-hidden rounded-md bg-tag" style={{ width, height }}>
                        {status === "loading" && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-faint">
                            Loading preview
                          </span>
                        )}
                        {src && (
                          <img
                            src={src}
                            alt=""
                            width={width}
                            height={height}
                            onLoad={() => setStatus("ready")}
                            className={cn(
                              "h-full w-full object-cover object-top transition-opacity duration-200",
                              status === "ready" ? "opacity-100" : "opacity-0",
                            )}
                          />
                        )}
                      </span>
                    )}
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </HoverCardPrimitive.Content>
        </HoverCardPrimitive.Portal>
      </HoverCardPrimitive.Root>
    </>
  );
};
