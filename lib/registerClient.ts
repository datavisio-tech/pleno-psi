export type RegisterClientPayload = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

export async function registerClient(
  data: RegisterClientPayload,
): Promise<ApiResponse> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  return json as ApiResponse;
}
