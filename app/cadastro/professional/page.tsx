"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AuthenticatedPage from "@/components/AuthenticatedPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Form, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CountryItem,
  fetchBrazilAddressByCep,
  fetchCountries,
} from "@/lib/country";

// Schemas separated by block
const addressSchema = z.object({
  country_code: z.string().min(1, "País é obrigatório"),
  country_name: z.string().min(1),
  zip_code: z.string().min(1, "CEP é obrigatório"),
  street: z.string().min(1, "Logradouro é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
});

const professionalSchema = z.object({
  professional_license: z
    .string()
    .min(1, "Registro profissional é obrigatório"),
  professional_entity: z.string().min(1, "Entidade de classe é obrigatória"),
  nome_resp: z.string().min(1, "Nome do responsável é obrigatório"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  price: z
    .string()
    .regex(/^\d+(?:[.,]\d{1,2})?$/, "Preço inválido")
    .optional()
    .or(z.string().min(1)),
});

const clinicSchema = z.object({
  name: z.string().min(1, "Nome da clínica é obrigatório"),
  legal_name: z.string().optional(),
  cnpj: z.string().optional(),
  // minimal address for clinic
  clinic_country_code: z.string().min(1),
  clinic_zip_code: z.string().min(1),
  clinic_street: z.string().min(1),
  clinic_number: z.string().min(1),
  clinic_city: z.string().min(1),
  clinic_state: z.string().min(1),
});

type AddressForm = z.infer<typeof addressSchema>;
type ProfessionalForm = z.infer<typeof professionalSchema>;
type ClinicForm = z.infer<typeof clinicSchema>;

export default function ProfessionalOnboarding() {
  const router = useRouter();

  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country_code: "BR",
      country_name: "Brasil",
      zip_code: "",
      street: "",
      number: "",
      city: "",
      state: "",
    },
  });

  const profForm = useForm<ProfessionalForm>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      professional_license: "",
      professional_entity: "",
      nome_resp: "",
      specialty: "",
      price: "",
    },
  });

  const clinicForm = useForm<ClinicForm>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: "",
      legal_name: "",
      cnpj: "",
      clinic_country_code: "BR",
      clinic_zip_code: "",
      clinic_street: "",
      clinic_number: "",
      clinic_city: "",
      clinic_state: "",
    },
  });

  const [countries, setCountries] = React.useState<CountryItem[] | null>(null);
  const [loadingCountries, setLoadingCountries] = React.useState(false);
  const [cepError, setCepError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [clinicMode, setClinicMode] = React.useState<
    "none" | "associate" | "create"
  >("none");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingCountries(true);
      try {
        const list = await fetchCountries();
        if (!mounted) return;
        setCountries(list);
      } catch (e) {
        console.error("countries load error", e);
      } finally {
        if (mounted) setLoadingCountries(false);
      }
    })();
    // fetch current user name to prefill `nome_resp`
    (async () => {
      try {
        const res = await fetch("/api/me");
        const j = await res.json().catch(() => ({}));
        if (res.ok && j?.user?.name) {
          profForm.setValue("nome_resp", j.user.name);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // CEP blur for professional address
  async function handleCepBlur() {
    setCepError(null);
    const zip = addressForm.getValues("zip_code") || "";
    const country = (addressForm.getValues("country_code") || "").toUpperCase();
    if (!zip || country !== "BR") return;
    const cleaned = String(zip).replace(/[^0-9]/g, "");
    if (cleaned.length < 8) {
      setCepError("CEP inválido");
      return;
    }
    try {
      const res = await fetchBrazilAddressByCep(cleaned);
      addressForm.setValue("street", res.street || "");
      addressForm.setValue("city", res.city || "");
      addressForm.setValue("state", res.state || "");
      addressForm.setValue("zip_code", res.cep || cleaned);
      setCepError(null);
    } catch (e: any) {
      setCepError(e?.message || "CEP não encontrado");
    }
  }

  async function handleSubmitAll() {
    // client-side validation across blocks
    const okAddress = await addressForm.trigger();
    const okProf = await profForm.trigger();
    let okClinic = true;
    if (clinicMode === "create") okClinic = await clinicForm.trigger();

    if (!okAddress || !okProf || !okClinic) return;

    // Prepare payloads for backend persistence
    const payload = {
      address: addressForm.getValues(), // would persist to `addresses` and set persons.address_id
      professional: profForm.getValues(), // would persist to `professionals` table
      clinic: clinicMode === "create" ? clinicForm.getValues() : null, // persist clinics + address + clinic_users
      associateExistingClinic: clinicMode === "associate" ? true : false, // flow to associate
    };

    // Persist blocks through server endpoints
    try {
      setIsSubmitting(true);

      // 1) Save address -> POST /api/address
      const addressRes = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip_code: payload.address.zip_code,
          street: payload.address.street,
          number: payload.address.number,
          neighborhood: null,
          city: payload.address.city,
          state: payload.address.state,
          country_name: payload.address.country || "",
          country_code: payload.address.country || "",
        }),
      });
      const ajson = await addressRes.json().catch(() => ({}));
      if (!addressRes.ok || !ajson.success) {
        console.error("address save failed", ajson);
        setIsSubmitting(false);
        return;
      }

      // 2) Save professional -> POST /api/professional
      const profRes = await fetch("/api/professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.professional),
      });
      const pjson = await profRes.json().catch(() => ({}));
      if (!profRes.ok || !pjson.success) {
        console.error("professional save failed", pjson);
        setIsSubmitting(false);
        return;
      }

      // 3) Clinics flow
      if (payload.associateExistingClinic) {
        // UI should provide clinic id; currently not implemented search selection
        // No-op
      } else if (payload.clinic) {
        const clinicRes = await fetch("/api/clinics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload.clinic),
        });
        const cjson = await clinicRes.json().catch(() => ({}));
        if (!clinicRes.ok || !cjson.success) {
          console.error("clinic create failed", cjson);
          setIsSubmitting(false);
          return;
        }
        // optionally associate professional to new clinic
        if (cjson.clinic?.id) {
          await fetch("/api/clinic-associate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clinic_id: cjson.clinic.id }),
          }).catch(() => null);
        }
      }

      router.replace("/");
    } catch (e) {
      console.error("onboarding submit error", e);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSkip() {
    router.replace("/");
  }

  return (
    <AuthenticatedPage>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-lg flex-col gap-6">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold">
                Dados da Conta Profissional
              </h2>
              <br />
              {/* Clinica Block*/}
              <FieldSeparator />
              <Form {...clinicForm}>
                <form onSubmit={(e) => e.preventDefault()}>
                  <FieldGroup>
                    <h3 className="text-lg font-medium">Dados da Clínica</h3>
                    <Field>
                      <FieldLabel>Nome Empresa</FieldLabel>
                      <Input {...clinicForm.register("name")} />
                    </Field>
                    <Field>
                      <FieldLabel>Nome Fantasia</FieldLabel>
                      <Input {...clinicForm.register("legal_name")} />
                    </Field>
                    <Field>
                      <FieldLabel>CNPJ</FieldLabel>
                      <Input {...clinicForm.register("cnpj")} />
                    </Field>
                  </FieldGroup>
                </form>
              </Form>
              <br />

              {/* Professional block */}
              <FieldSeparator />
              <Form {...profForm}>
                <form onSubmit={(e) => e.preventDefault()}>
                  <FieldGroup>
                    <h3 className="text-lg font-medium">Responsável técnico</h3>
                    <Field>
                      <FieldLabel>Nome do Profissional Responsável</FieldLabel>
                      <Input
                        {...profForm.register("nome_resp")}
                        readOnly
                        disabled
                      />
                      <p className="text-muted-foreground mt-2 text-sm">
                        Nome do usuário logado (não editável).
                      </p>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Numero do Registro</FieldLabel>
                        <Input {...profForm.register("professional_license")} />
                        {/* numero do conselho de classe */}
                      </Field>
                      <Field>
                        <FieldLabel>Entidade de Classe</FieldLabel>
                        <Input
                          {...profForm.register("professional_entity")}
                          placeholder="Ex: CRM, CRO, COREME"
                        />
                        <p className="text-muted-foreground mt-2 text-sm">
                          Ex.: CRM, CRO, COREME — informe o conselho ao qual
                          pertence.
                        </p>
                      </Field>
                    </div>
                  </FieldGroup>
                </form>
              </Form>
              <br />
              <FieldSeparator />

              {/* Address block */}
              <Form {...addressForm}>
                <form onSubmit={(e) => e.preventDefault()}>
                  <FieldGroup>
                    <h3 className="text-lg font-medium">
                      Endereço do profissional
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>País</FieldLabel>
                        <Select
                          value={
                            addressForm.getValues("country_code") || undefined
                          }
                          onValueChange={(val) => {
                            const found = (countries || []).find(
                              (c) => c.code === val,
                            );
                            if (found) {
                              addressForm.setValue("country_code", found.code);
                              addressForm.setValue("country_name", found.name);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                loadingCountries ? "Carregando..." : "Selecione"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {(countries || []).map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </Field>

                      <Field>
                        <FieldLabel>CEP</FieldLabel>
                        <Input
                          {...addressForm.register("zip_code")}
                          onBlur={handleCepBlur}
                        />
                        {cepError ? (
                          <div className="text-destructive text-sm">
                            {cepError}
                          </div>
                        ) : (
                          <FormMessage />
                        )}
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel>Logradouro</FieldLabel>
                      <Input {...addressForm.register("street")} />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Número</FieldLabel>
                        <Input {...addressForm.register("number")} />
                      </Field>
                      <Field>
                        <FieldLabel>Cidade</FieldLabel>
                        <Input {...addressForm.register("city")} />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>Estado (UF)</FieldLabel>
                        <Input {...addressForm.register("state")} />
                      </Field>
                      <div />
                    </div>
                  </FieldGroup>
                </form>
              </Form>

              <FieldSeparator />

              <FieldSeparator />

              {/* Clinic association */}
              <FieldGroup>
                {clinicMode === "associate" && (
                  <div className="mt-4">
                    <Field>
                      <FieldLabel>Buscar clínica (nome ou CNPJ)</FieldLabel>
                      <Input placeholder="Pesquisar..." />
                      <FormMessage />
                      <p className="text-muted-foreground mt-2 text-sm">
                        Selecione uma clínica para vinculá-la ao seu perfil.
                        (Busca não implementada — demo)
                      </p>
                    </Field>
                  </div>
                )}

                {clinicMode === "create" && (
                  <div className="mt-4">
                    <Form {...clinicForm}>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <Field>
                          <FieldLabel>Nome da clínica</FieldLabel>
                          <Input {...clinicForm.register("name")} />
                        </Field>
                        <Field>
                          <FieldLabel>Nome empresarial</FieldLabel>
                          <Input {...clinicForm.register("legal_name")} />
                        </Field>
                        <Field>
                          <FieldLabel>CNPJ</FieldLabel>
                          <Input {...clinicForm.register("cnpj")} />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>CEP (clínica)</FieldLabel>
                            <Input
                              {...clinicForm.register("clinic_zip_code")}
                            />
                          </Field>
                          <Field>
                            <FieldLabel>Rua/Logradouro</FieldLabel>
                            <Input {...clinicForm.register("clinic_street")} />
                          </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>Número</FieldLabel>
                            <Input {...clinicForm.register("clinic_number")} />
                          </Field>
                          <Field>
                            <FieldLabel>Cidade</FieldLabel>
                            <Input {...clinicForm.register("clinic_city")} />
                          </Field>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}
              </FieldGroup>

              <FieldSeparator />

              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleSubmitAll}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Enviando..." : "Concluir cadastro"}
                </Button>
                <Button variant="ghost" onClick={handleSkip} className="flex-1">
                  Pular por enquanto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedPage>
  );
}
