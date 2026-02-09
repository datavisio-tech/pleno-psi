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
