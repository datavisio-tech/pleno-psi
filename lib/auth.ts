export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse =
  | { ok: true; user: { email: string; name: string } }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function login(data: LoginPayload): Promise<LoginResponse> {
  return new Promise((resolve) =>
    setTimeout(() => {
      if (data.email === "admin@teste.com" && data.password === "12345678") {
        resolve({ ok: true, user: { email: data.email, name: "Admin Teste" } });
      } else {
        resolve({ ok: false, error: "Credenciais inválidas" });
      }
    }, 600),
  );
}

export default login;

export type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export type RegisterResponse =
  | { ok: true; user: { email: string; name: string } }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function register(
  data: RegisterPayload,
): Promise<RegisterResponse> {
  return new Promise((resolve) =>
    setTimeout(() => {
      // Simula validação de servidor: email já cadastrado
      if (data.email === "exists@teste.com") {
        resolve({
          ok: false,
          error: "E-mail já cadastrado",
          fieldErrors: { email: "E-mail já existe" },
        });
        return;
      }

      // Simula sucesso quando senha tem 8+ e confirma
      if (data.password && data.password.length >= 8) {
        resolve({
          ok: true,
          user: { email: data.email, name: "Usuário Teste" },
        });
      } else {
        resolve({
          ok: false,
          error: "Senha inválida",
          fieldErrors: { password: "Senha muito curta" },
        });
      }
    }, 600),
  );
}

export { register as registerMock };
