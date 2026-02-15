export type SessionLike = {
  user?: {
    clinic?: {
      id?: string;
    } | null;
  } | null;
};

export function getRequiredClinicId(session: SessionLike) {
  const clinicId = session?.user?.clinic?.id;

  if (!clinicId) {
    const err = new Error("Missing clinic context");
    // attach code for callers that expect status
    (err as any).status = 403;
    throw err;
  }

  return clinicId;
}
