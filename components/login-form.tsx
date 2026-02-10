"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { loginClient } from "@/lib/loginClient";
import { cn } from "@/lib/utils";

export const loginSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "O e-mail é obrigatório" })
      .email({ message: "E-mail inválido" }),
    password: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres",
    }),
  })
  .required();

export type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  onSubmit,
  ...props
}: React.ComponentProps<"div"> & {
  onSubmit?: (data: LoginFormData) => void | Promise<void>;
}) {
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams?.get("email") || "";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: initialEmail, password: "" },
  });

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    setError,
  } = form;

  const [authError, setAuthError] = React.useState<string | null>(null);

  async function onSubmitInternal(data: LoginFormData) {
    console.log("[Login] Submit iniciado:", data.email);

    setAuthError(null);
    setLoading(true);

    let success = false; // ✅ controle correto do fluxo

    try {
      console.log("[Login] Loading ativado");

      if (onSubmit) {
        console.log("[Login] Executando callback onSubmit");

        // 🔌 AQUI você chamaria a API REAL (ex: Auth.js, backend próprio)
        // const response = await onSubmit(data);

        await Promise.resolve(onSubmit(data));

        success = true;
        console.log("[Login] Login real bem-sucedido");
      } else {
        console.warn(
          "[Login] Nenhum onSubmit fornecido — usando /api/login...",
        );

        // show modal/dialog by setting loading true (handled by state)
        const res = await loginClient({
          email: data.email,
          password: data.password,
        });

        if (!res.success) {
          const message = res.message || "Credenciais inválidas";

          if (res.fieldErrors) {
            Object.entries(res.fieldErrors).forEach(([field, msg]) => {
              // @ts-ignore
              setError(field, { type: "server", message: String(msg) });
            });
          }

          setAuthError(message);
          success = false;
        } else {
          // Server sets HttpOnly cookie on success; client just proceeds
          success = true;
        }
      }
    } catch (error: any) {
      console.error("[Login] Erro no login:", error);

      const message =
        error?.message ||
        error?.error ||
        error?.detail ||
        "Erro no login. Verifique suas credenciais.";

      setAuthError(message);

      // 🧩 Se a API retornar erros por campo
      if (error?.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, msg]) => {
          // @ts-ignore
          setError(field, { type: "server", message: String(msg) });
        });
      }

      success = false;
    } finally {
      setLoading(false);
      console.log("[Login] Loading desativado");
      console.log("[Login] Submit finalizado");
    }

    // 🚦 DECISÃO FINAL
    if (success) {
      console.log("[Login] Redirecionando para /");
      router.replace("/");
    } else {
      console.log("[Login] Login falhou — permanecendo na página");
      alert(authError || "Login falhou. Verifique suas credenciais.");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Loading dialog shown while `loading` is true */}
      <AlertDialog open={loading} onOpenChange={() => {}}>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Entrando...</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Aguardando resposta do servidor. Por favor, aguarde.
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Faça login com sua conta Apple ou Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={rhfHandleSubmit(onSubmitInternal)}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Entrar com Apple
                </Button>
                <Button variant="outline" type="button">
                  <svg
                    xmlns="http://www.w3.org.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Entrar com Google
                </Button>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Cadastrar com</span>
                  <span className="sr-only">Cadastrar com Meta</span>
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Ou continue com
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  {...register("email")}
                  placeholder="meu@email.com"
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input
                  id="password"
                  {...register("password")}
                  type="password"
                />
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
                <FieldDescription className="text-center">
                  Não possui uma conta? <a href="/auth/register">Cadastre-se</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Conheça nossos <a href="/edocs/termos">Termos de Serviço</a> e{" "}
        <a href="/edocs/politicas">Política de Privacidade</a>.
      </FieldDescription>
    </div>
  );
}
