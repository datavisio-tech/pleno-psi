"use client";

// eslint-disable-next-line simple-import-sort/imports
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";

/* ------------------------------------------------------------------ */
/* Schema                                                             */
/* ------------------------------------------------------------------ */
const baseSchema = z.object({
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  nome_social: z.string().optional(),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  gender: z.string().optional(),
  birth_date: z.string().optional(),
});

const patientSchema = baseSchema.extend({ role: z.literal("patient") });

const professionalSchema = baseSchema.extend({
  role: z.literal("professional"),
  profession: z.string().min(2, "Profissão obrigatória"),
});

const formSchema = z.discriminatedUnion("role", [
  patientSchema,
  professionalSchema,
]);

type FormData = z.infer<typeof formSchema>;

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export function SignupProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [role, setRole] = useState<"patient" | "professional">("patient");

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "patient",
      full_name: "",
      nome_social: "",
      cpf: "",
      phone: "",
      profession: "",
      gender: "",
      birth_date: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = methods;

  function switchRole(nextRole: "patient" | "professional") {
    setRole(nextRole);
    setValue("role", nextRole);
  }

  function onSubmit(data: FormData) {
    console.log("[SignupProfileForm]", data);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-1">
          {/* Form */}
          <Form {...methods}>
            <form
              className="p-6 md:p-8"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <FieldGroup>
                {/* Header */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Complete seu cadastro</h1>
                  <p className="text-muted-foreground text-sm">
                    Precisamos de mais algumas informações
                  </p>
                </div>

                {/* Tipo de perfil */}
                <Field>
                  <FieldLabel>Você é paciente ou profissional?</FieldLabel>
                  <div className="flex w-full gap-2 rounded-lg p-2">
                    <button
                      type="button"
                      onClick={() => switchRole("patient")}
                      className={cn(
                        "flex-1 rounded-md py-2 text-center text-sm font-medium transition",
                        role === "patient"
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-muted-foreground",
                      )}
                    >
                      Sou paciente
                    </button>

                    <button
                      type="button"
                      onClick={() => switchRole("professional")}
                      className={cn(
                        "flex-1 rounded-md py-2 text-center text-sm font-medium transition",
                        role === "professional"
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-muted-foreground",
                      )}
                    >
                      Sou profissional
                    </button>
                    <FieldSeparator />
                  </div>
                </Field>
                <FieldSeparator />

                {/* Nome */}
                <Field>
                  <div className="grid grid-cols-1 gap-4">
                    <Field>
                      <FieldLabel>Nome completo</FieldLabel>
                      <Input {...register("full_name")} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <Field>
                      <FieldLabel>Como prefere ser chamado?</FieldLabel>
                      <Input {...register("nome_social")} />
                    </Field>
                  </div>

                  {(errors.full_name || errors.nome_social) && (
                    <FieldDescription className="text-destructive">
                      {errors.full_name?.message || errors.nome_social?.message}
                    </FieldDescription>
                  )}
                </Field>

                {/* Profissão */}

                {role === "professional" && (
                  <Field>
                    <FieldLabel>Profissão</FieldLabel>
                    <Select
                      onValueChange={(v) => setValue("profession", v as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Psicóloga(o)">
                          Psicóloga(o)
                        </SelectItem>
                        <SelectItem value="Psiquiatra">Psiquiatra</SelectItem>
                        <SelectItem value="Terapeuta">Terapeuta</SelectItem>
                        <SelectItem value="Psicanalista">
                          Psicanalista
                        </SelectItem>
                        <SelectItem value="Estudante">Estudante</SelectItem>
                        <SelectItem value="Fonoaudióloga(o)">
                          Fonoaudióloga(o)
                        </SelectItem>
                        <SelectItem value="Secretária(o)">
                          Secretária(o)
                        </SelectItem>
                        <SelectItem value="administrativo">
                          Administrativo
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {errors.profession && (
                      <FieldDescription className="text-destructive">
                        {errors.profession.message}
                      </FieldDescription>
                    )}
                  </Field>
                )}

                {/* Sexo + Data de nascimento (somente paciente) */}
                {role === "patient" && (
                  <Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Sexo</FieldLabel>
                        <Select
                          onValueChange={(v) => setValue("gender", v as any)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Feminino</SelectItem>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="other">Outros</SelectItem>
                            <SelectItem value="prefer_not_say">
                              Prefiro não dizer
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {errors.gender && (
                          <FieldDescription className="text-destructive">
                            {errors.gender.message}
                          </FieldDescription>
                        )}
                      </Field>

                      <FormField
                        control={control}
                        name="birth_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nascimento</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Field>
                )}

                {/* CPF / Telefone */}
                <Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>CPF</FieldLabel>
                      <Input
                        placeholder="000.000.000-00"
                        {...register("cpf")}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Telefone</FieldLabel>
                      <Input
                        placeholder="(11) 99999-9999"
                        {...register("phone")}
                      />
                    </Field>
                  </div>

                  {(errors.cpf || errors.phone) && (
                    <FieldDescription className="text-destructive">
                      {errors.cpf?.message || errors.phone?.message}
                    </FieldDescription>
                  )}
                </Field>

                <FieldSeparator />

                {/* Submit */}
                <Field>
                  <Button type="submit" className="w-full">
                    Próximo
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
