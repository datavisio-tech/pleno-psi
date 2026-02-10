"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { SignupProfileForm } from "@/components/cadastro_user-form";
import { APP_NAME } from "@/lib/config";

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any | null>(null);
  const [needsProfile, setNeedsProfile] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/me`, { cache: "no-store" });
        const j = await res.json().catch(() => null);
        if (res.ok && j?.success) {
          setUser(j.user || null);
          setNeedsProfile(Boolean(j.needsProfileCompletion));
        } else {
          router.replace("/auth");
        }
      } catch (e) {
        console.warn("[cadastro] /api/me error", e);
        router.replace("/auth");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Carregando...
      </main>
    );
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {APP_NAME}
        </a>
        <SignupProfileForm />
      </div>
    </div>
  );
}
