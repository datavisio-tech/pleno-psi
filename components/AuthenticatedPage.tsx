"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Componente wrapper para páginas que exigem usuário autenticado.
 *
 * Uso (ex):
 * <AuthenticatedPage title="Meu Painel">
 *   <main>conteúdo protegido aqui</main>
 * </AuthenticatedPage>
 *
 * O componente realiza:
 * - Verificação de sessão chamando `/api/me` (cookie HttpOnly criado no login/register).
 * - Enquanto verifica, exibe uma tela de carregamento simples.
 * - Se sessão inválida, redireciona para `/auth`.
 * - Ao autenticar, renderiza os `children` passados.
 */

export type AuthenticatedPageProps = {
  children: React.ReactNode;
  title?: string;
};

export default function AuthenticatedPage({
  children,
  title,
}: AuthenticatedPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;

    // Faz a validação da sessão no backend. O backend deve ler o cookie `pleno.sid`.
    (async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        const j = await res.json().catch(() => null);
        if (!mounted) return;

        if (res.ok && j?.success) {
          // Sessão válida — mantém usuário em estado e rendeiza children
          setUser(j.user || null);
        } else {
          // Sessão inválida — redireciona para a tela de autenticação
          router.replace("/auth");
        }
      } catch (err) {
        console.warn("[AuthenticatedPage] /api/me error", err);
        router.replace("/auth");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  // Enquanto a verificação está em andamento mostramos um placeholder simples.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-2">Carregando sessão...</p>
          <div className="bg-muted h-2 w-48 rounded" />
        </div>
      </div>
    );
  }

  // A partir daqui, `user` é o usuário autenticado (ou `null` se não disponível).
  // Renderizamos o layout padrão e o conteúdo protegido.
  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-4xl p-6">{children}</main>
    </div>
  );
}
