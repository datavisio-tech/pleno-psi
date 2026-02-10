"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<{
    id?: string;
    email?: string;
    name?: string;
  } | null>(null);
  const [needsProfile, setNeedsProfile] = React.useState(false);

  React.useEffect(() => {
    // Enforce authentication on client: validate server-side via /api/me (cookie-based)
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
        console.warn("[page] /api/me error", e);
        router.replace("/auth");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div>Carregando...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold">Painel Inicial</h1>

        {user ? (
          <div className="rounded-lg border p-6">
            <h2 className="mb-2 text-xl font-semibold">
              Bem-vindo{user.name ? `, ${user.name}` : ""}!
            </h2>
            <p>
              <strong>ID:</strong> {user.id || "-"}
            </p>
            <p>
              <strong>E-mail:</strong> {user.email}
            </p>

            {needsProfile ? (
              <div className="mt-4 rounded bg-yellow-50 p-4">
                <p className="mb-2">Seu cadastro está incompleto.</p>
                <p className="text-muted-foreground text-sm">
                  Encontramos a conta, mas não há informações pessoais
                  vinculadas. Por favor, conclua seu cadastro para liberar todas
                  as funcionalidades.
                </p>
                <div className="mt-4">
                  <Button onClick={() => (window.location.href = "/cadastro")}>
                    Concluir Cadastro
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-muted-foreground text-sm">
                  Conta pronta para uso.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
