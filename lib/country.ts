// Utilities to fetch countries list and Brazilian address by CEP
export type CountryItem = {
  name: string; // display name (pt or common)
  code: string; // cca2
  flag: string; // flags.svg
};

export async function fetchCountries(): Promise<CountryItem[]> {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,cca2,translations,flags",
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to load countries");
  const data = await res.json();
  const items: CountryItem[] = data
    .map((c: any) => {
      const pt =
        c.translations && c.translations.por && c.translations.por.common;
      const name = pt || (c.name && c.name.common) || c.cca2;
      return {
        name,
        code: (c.cca2 || "").toUpperCase(),
        flag: c.flags?.svg || "",
      };
    })
    .sort((a: CountryItem, b: CountryItem) => a.name.localeCompare(b.name));
  return items;
}

export type BrazilCepResult = {
  cep: string;
  state: string; // uf
  city: string; // localidade
  neighborhood: string; // bairro
  street: string; // logradouro
};

export async function fetchBrazilAddressByCep(
  cep: string,
): Promise<BrazilCepResult> {
  const cleaned = String(cep).replace(/[^0-9]/g, "");
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleaned}`);
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      try {
        const jsonErr = JSON.parse(txt || "null");
        throw new Error(
          jsonErr?.error ||
            "CEP não encontrado corrija ou continue preenchendo manualmente",
        );
      } catch (_) {
        throw new Error(
          txt ||
            "CEP não encontrado corrija ou continue preenchendo manualmente",
        );
      }
    }
    const j = await res.json();
    return {
      cep: j.cep,
      // BrasilAPI sometimes returns 'state'/'city' keys depending on service
      state: j.state || j.uf || "",
      city: j.city || j.localidade || "",
      neighborhood: j.neighborhood || j.bairro || "",
      street: j.street || j.logradouro || "",
    };
  } catch (err: any) {
    // network/CORS errors surface here as generic TypeError or similar
    throw new Error(
      "CEP não encontrado corrija ou continue preenchendo manualmente",
    );
  }
}
