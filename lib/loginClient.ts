export type LoginClientPayload = { email: string; password: string };
export type LoginClientResponse = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  user?: any;
};

export async function loginClient(
  data: LoginClientPayload,
): Promise<LoginClientResponse> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json as LoginClientResponse;
}
