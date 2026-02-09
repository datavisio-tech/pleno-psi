"use client";

// eslint-disable-next-line simple-import-sort/imports
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { registerMock } from "@/lib/auth";
import Image from "next/image";

/// ----------------------------------------------------------------
/// Schema Zod
/// ----------------------------------------------------------------
export const registerUserSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "O e-mail é obrigatório" })
      .email({ message: "E-mail inválido" }),

    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),

    confirmPassword: z
      .string()
      .min(8, { message: "A confirmação deve ter pelo menos 8 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem coincidir",
    path: ["confirmPassword"],
  });

export type RegisterUserFormData = z.infer<typeof registerUserSchema>;

/// ----------------------------------------------------------------
/// Container (React Hook Form + Zod)
/// ----------------------------------------------------------------
export function RegisterForm() {
  const form = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: RegisterUserFormData) {
    console.log("signup DATA:", data); // <-- Aqui você pode acessar os valores do formulário);
  }

  return <SignupForm form={form} onSubmit={onSubmit} />;
}

/// ----------------------------------------------------------------
/// UI (apenas apresentação)
/// ----------------------------------------------------------------
type SignupFormProps = React.ComponentProps<"div"> & {
  form: ReturnType<typeof useForm<RegisterUserFormData>>;
  onSubmit: (data: RegisterUserFormData) => void;
};

export function SignupForm({
  className,
  form,
  onSubmit,
  ...props
}: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form;

  const [loading, setLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  async function onSubmitInternal(data: RegisterUserFormData) {
    setAuthError(null);
    setLoading(true);
    let success = false;
    try {
      if (onSubmit) {
        await Promise.resolve(onSubmit(data));
        success = true;
      } else {
        const res = await registerMock({
          email: data.email,
          password: data.password,
        });
        if (!res.ok) {
          if ((res as any).fieldErrors) {
            Object.entries((res as any).fieldErrors).forEach(([field, msg]) => {
              // @ts-ignore
              setError(field, { type: "server", message: String(msg) });
            });
          }
          setAuthError(res.error || "Erro no registro");
          return;
        }
        success = true;
      }
    } catch (error: any) {
      const message = error?.message || "Erro no registro";
      setAuthError(String(message));
    } finally {
      setLoading(false);
    }

    if (success) {
      // opcional: você pode redirecionar aqui ou exibir uma mensagem de sucesso
      console.log("Registro bem-sucedido", data.email);
    }
  }

  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/img/capa.jpg"
              alt="Imagem"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          <form
            className="p-6 md:p-8"
            onSubmit={handleSubmit(onSubmitInternal)}
            noValidate
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Criar uma Conta</h1>
                <p className="text-muted-foreground text-sm">
                  Digite seu e-mail abaixo para criar sua conta
                </p>
              </div>

              {/* EMAIL */}
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="meu@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {/* SENHAS */}
              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirmar Senha
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                    />
                  </Field>
                </div>

                {(errors.password || errors.confirmPassword) && (
                  <FieldDescription className="text-destructive">
                    {errors.password?.message ||
                      errors.confirmPassword?.message}
                  </FieldDescription>
                )}
              </Field>

              {/* SUBMIT */}
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Enviando..." : "Criar Conta"}
                </Button>
                {authError && (
                  <FieldDescription className="text-destructive mt-2 text-center">
                    {authError}
                  </FieldDescription>
                )}
              </Field>

              <FieldSeparator>Ou continue com</FieldSeparator>

              {/* OAUTH */}
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button">
                  Apple
                </Button>
                <Button variant="outline" type="button">
                  Google
                </Button>
                <Button variant="outline" type="button">
                  Meta
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Já possui uma conta? <a href="/auth">Entrar</a>
              </FieldDescription>
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
