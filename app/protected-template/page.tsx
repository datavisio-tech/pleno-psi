"use client";

import AuthenticatedPage from "@/components/AuthenticatedPage";
import { SignupProfileForm } from "@/components/cadastro_user-form";
import { GalleryVerticalEnd } from "lucide-react";

/**
 * Página de exemplo que usa `AuthenticatedPage` como template.
 *
 * Copie este arquivo quando precisar criar novas páginas que devem
 * estar acessíveis apenas para usuários autenticados.
 *
 * Comentei as seções para facilitar apresentação/treinamento.
 */

export default function ProtectedTemplatePage() {
  return (
    <>
      <AuthenticatedPage>
        <GalleryVerticalEnd className="size-4" />
        <div className="p-6">
          <h1 className="text-2xl font-bold">
            Bem-vindo à Página Protegida template!
          </h1>
          <p className="text-muted-foreground mt-4">
            Esta página só pode ser acessada por usuários autenticados. Aqui
            você pode colocar qualquer conteúdo que desejar, como dashboards,
            perfis ou outras informações sensíveis.
          </p>
          <SignupProfileForm />
        </div>
        {/*


<div
      Conteúdo da página: coloque aqui seus componentes específicos.
      - Use cards, grids e componentes do design system.
      - Esse conteúdo só será mostrado se o usuário estiver autenticado.
    */}
      </AuthenticatedPage>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
          <SignupProfileForm />
        </div>
      </div>
    </>
  );
}
