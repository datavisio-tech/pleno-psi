"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

// Schema for address
const addressSchema = z.object({
  zip_code: z.string().min(1, "CEP é obrigatório"),
  street: z.string().min(1, "Logradouro é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  // country fields: persisted to DB (country_flag_svg must be saved)
  country_name: z.string().min(1, "País é obrigatório"),
  country_code: z.string().min(1),
  country_flag_svg: z.string().optional(),
});

const guardianSchema = z.object({
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  email: z.string().email("Email inválido"),
});

type AddressForm = z.infer<typeof addressSchema>;
type GuardianForm = z.infer<typeof guardianSchema>;

export default function CadastroAddressPage() {
  const router = useRouter();

  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      zip_code: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      country_name: "",
      country_code: "",
      country_flag_svg: "",
    },
  });

  const guardianForm = useForm<GuardianForm>({
    resolver: zodResolver(guardianSchema),
    defaultValues: {
      full_name: "",
      cpf: "",
      phone: "",
      email: "",
    },
  });

  const [patientIsResponsible, setPatientIsResponsible] = React.useState<
    boolean | null
  >(null);
  const [isMinor, setIsMinor] = React.useState(false);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [countries, setCountries] = React.useState<CountryItem[] | null>(null);
  const [loadingCountries, setLoadingCountries] = React.useState(false);
  const [cepError, setCepError] = React.useState<string | null>(null);

  // On mount, fetch profile to determine birth_date and prefill guardian when needed
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;
        const j = await res.json().catch(() => null);
        if (j?.success && j.person) {
          const p = j.person;
          if (p.birth_date) {
            const birth = new Date(p.birth_date);
            const age = Math.floor(
              (Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
            );
            setIsMinor(age < 18);
          }
          // default patient is self-responsible
          setPatientIsResponsible(true);
        }
      } catch (e) {
        // ignore
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  // fetch countries for Select
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingCountries(true);
      try {
        const list = await fetchCountries();
        if (!mounted) return;
        setCountries(list);
      } catch (e) {
        // ignore for now
      } finally {
        if (mounted) setLoadingCountries(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  function handleSkip() {
    // Skipping for now — in real flow, persist progress and allow later completion
    router.replace("/");
  }

  function handleContinue() {
    // Validate address and guardian (if shown/required)
    const okAddress = addressForm.trigger();
    Promise.resolve(okAddress).then((addrValid) => {
      if (!addrValid) return;

      if (isMinor) {
        // guardian required
        if (patientIsResponsible) {
          // populate guardian with patient data (would use profile data)
          // TODO: persist address and guardian as needed
          router.replace("/");
        } else {
          guardianForm.trigger().then((gValid) => {
            if (!gValid) return;
            // TODO: persist address and guardian
            router.replace("/");
          });
        }
      } else {
        // adult: guardian optional
        if (patientIsResponsible || patientIsResponsible === null) {
          // continue
          // TODO: persist address
          router.replace("/");
        } else {
          guardianForm.trigger().then((gValid) => {
            if (!gValid) return;
            // TODO: persist address and guardian
            router.replace("/");
          });
        }
      }
    });
  }

  // watch zip and country selection
  const zipWatcher = addressForm.watch("zip_code");
  const countryCode = addressForm.watch("country_code");

  React.useEffect(() => setCepError(null), [zipWatcher]);

  async function handleCepBlur() {
    setCepError(null);
    if (!zipWatcher || !countryCode) return;
    if (countryCode.toUpperCase() !== "BR") return;
    const cleaned = String(zipWatcher).replace(/[^0-9]/g, "");
    if (cleaned.length < 8) {
      setCepError("CEP inválido");
      return;
    }
    try {
      const res = await fetchBrazilAddressByCep(cleaned);
      // fill fields but keep editable
      addressForm.setValue("street", res.street || "");
      addressForm.setValue("neighborhood", res.neighborhood || "");
      addressForm.setValue("city", res.city || "");
      addressForm.setValue("state", res.state || "");
      setCepError(null);
    } catch (e: any) {
      setCepError(e?.message || "CEP não encontrado");
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Card>
          <CardContent>
            <Form {...addressForm}>
              <form onSubmit={(e) => e.preventDefault()}>
                <FieldGroup>
                  <h2 className="text-xl font-semibold">Endereço</h2>
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
                            addressForm.setValue(
                              "country_flag_svg",
                              found.flag,
                            );
                          } else {
                            addressForm.setValue("country_code", val || "");
                            addressForm.setValue("country_name", "");
                            addressForm.setValue("country_flag_svg", "");
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              loadingCountries ? "Carregando..." : "Selecione"
                            }
                          >
                            {/* show inline flag and name if selected */}
                            {addressForm.getValues("country_flag_svg") ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={addressForm.getValues(
                                    "country_flag_svg",
                                  )}
                                  alt="flag"
                                  className="h-4 w-4"
                                />
                                <span>
                                  {addressForm.getValues("country_name")}
                                </span>
                              </div>
                            ) : null}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-auto">
                          {loadingCountries && (
                            <SelectItem value="" disabled>
                              Carregando...
                            </SelectItem>
                          )}
                          {(countries || []).map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              <div className="flex items-center gap-2">
                                <img
                                  src={c.flag}
                                  alt={`flag-${c.code}`}
                                  className="h-4 w-4"
                                />
                                <span>{c.name}</span>
                              </div>
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
                      <FieldLabel>Complemento</FieldLabel>
                      <Input {...addressForm.register("number")} />
                    </Field>
                    <Field>
                      <FieldLabel>Bairro</FieldLabel>
                      <Input {...addressForm.register("neighborhood")} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    {/* Cidade ocupa mais espaço */}
                    <Field className="col-span-9">
                      <FieldLabel>Cidade</FieldLabel>
                      <Input {...addressForm.register("city")} />
                    </Field>

                    {/* UF curta (2 caracteres), apenas sugestão */}
                    <Field className="col-span-3">
                      <FieldLabel>Estado (UF)</FieldLabel>
                      <Input
                        {...addressForm.register("state")}
                        maxLength={2}
                        placeholder="UF"
                        className="uppercase"
                      />
                    </Field>
                  </div>

                  <FieldSeparator />

                  <h3 className="text-lg font-medium">Responsável legal</h3>
                  <Field>
                    <FieldLabel>
                      O paciente é o próprio responsável legal?
                    </FieldLabel>
                    <div className="mt-2 flex gap-4">
                      <Button
                        type="button"
                        variant={patientIsResponsible ? undefined : "ghost"}
                        onClick={() => setPatientIsResponsible(true)}
                      >
                        Sim
                      </Button>
                      <Button
                        type="button"
                        variant={
                          patientIsResponsible === false ? undefined : "ghost"
                        }
                        onClick={() => setPatientIsResponsible(false)}
                      >
                        Não
                      </Button>
                    </div>
                  </Field>

                  {patientIsResponsible === false && (
                    <>
                      <FieldSeparator />
                      <h4 className="text-md font-medium">
                        Dados do responsável legal
                      </h4>
                      <Form {...guardianForm}>
                        <Field>
                          <FieldLabel>Nome completo</FieldLabel>
                          <Input {...guardianForm.register("full_name")} />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>CPF</FieldLabel>
                            <Input {...guardianForm.register("cpf")} />
                          </Field>
                          <Field>
                            <FieldLabel>Telefone</FieldLabel>
                            <Input {...guardianForm.register("phone")} />
                          </Field>
                        </div>
                        <Field>
                          <FieldLabel>Email</FieldLabel>
                          <Input {...guardianForm.register("email")} />
                        </Field>
                      </Form>
                    </>
                  )}

                  <FieldSeparator />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleContinue}
                      className="flex-1"
                    >
                      Submeter Cadastro
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleSkip}
                      className="flex-1"
                    >
                      Pular por enquanto
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
