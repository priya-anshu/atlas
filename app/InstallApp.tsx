"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallApp() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (!installPrompt) return null;

  return (
    <button
      className="install-button"
      onClick={async () => {
        await installPrompt.prompt();
        await installPrompt.userChoice;
        setInstallPrompt(null);
      }}
      type="button"
    >
      <Download aria-hidden="true" size={16} />
      Install app
    </button>
  );
}
