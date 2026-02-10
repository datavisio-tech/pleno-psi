// Centraliza configurações derivadas de variáveis de ambiente.
// Mantemos `APP_NAME` como uma constante importável para facilitar testes
// e para evitar uso direto de `process.env` espalhado pelo código.

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Pleno PSI";

export default {
  APP_NAME,
};
