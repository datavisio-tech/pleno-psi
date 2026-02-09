"use client";

import { useEffect } from "react";

export default function NavigationGuard(): null {
  useEffect(() => {
    function isBadUrl(u: string | null | undefined) {
      return typeof u === "string" && u.includes("[object Object]");
    }

    function onClick(e: MouseEvent) {
      const el = (e.target as Element)?.closest?.("a");
      if (!el) return;
      const href = (el as HTMLAnchorElement).getAttribute("href");
      if (isBadUrl(href)) {
        e.preventDefault();
        console.error("Blocked navigation to malformed URL:", href);
        // Optionally show user-friendly message
        return;
      }
    }

    // Sanitize existing anchors and observe DOM for new ones
    function sanitizeAnchor(a: HTMLAnchorElement) {
      try {
        const href = a.getAttribute("href");
        if (href && isBadUrl(href)) {
          a.setAttribute("href", "#");
          a.dataset["sanitized"] = "true";
          console.warn("Sanitized malformed anchor href", href, a);
        }
      } catch (e) {
        /* ignore */
      }
    }

    function sanitizeAll() {
      const anchors = Array.from(document.getElementsByTagName("a"));
      anchors.forEach((a) => sanitizeAnchor(a as HTMLAnchorElement));
    }

    sanitizeAll();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && (m.target as Element).nodeName === "A") {
          sanitizeAnchor(m.target as HTMLAnchorElement);
        }
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === Node.ELEMENT_NODE) {
              const el = n as Element;
              if (el.nodeName === "A") sanitizeAnchor(el as HTMLAnchorElement);
              el.querySelectorAll &&
                el
                  .querySelectorAll("a")
                  .forEach((aa) => sanitizeAnchor(aa as HTMLAnchorElement));
            }
          });
        }
      }
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });

    // Intercept anchor clicks
    window.addEventListener("click", onClick, true);

    // Wrap history.pushState/replaceState to catch programmatic navigations
    const origPush = window.history.pushState.bind(window.history);
    const origReplace = window.history.replaceState.bind(window.history);

    window.history.pushState = (
      data: any,
      title: string,
      url?: string | null,
    ) => {
      if (isBadUrl(url as any)) {
        console.error("Blocked history.pushState to malformed URL:", url);
        console.trace();
        return;
      }
      return origPush(data, title, url as any);
    };

    window.history.replaceState = (
      data: any,
      title: string,
      url?: string | null,
    ) => {
      if (isBadUrl(url as any)) {
        console.error("Blocked history.replaceState to malformed URL:", url);
        console.trace();
        return;
      }
      return origReplace(data, title, url as any);
    };

    return () => {
      window.removeEventListener("click", onClick, true);
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
      try {
        observer.disconnect();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return null;
}
