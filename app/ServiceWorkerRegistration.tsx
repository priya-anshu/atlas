"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister())),
      );
      void caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith("atlas-study-library-")).map((key) => caches.delete(key))),
      );
      return;
    }

    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => undefined);

    if (document.readyState === "complete") {
      void register();
      return;
    }

    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
