// Higher ORder Component
// É um componente que recebe um componente e o renderiza
// mas antes de renderizá-lo, executa alguma ação
// ou, passa alguma prop extra pra esse componente

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

const WithAuthentication = async ({
  children,
  mustHavePlan = false,
  mustHaveClinic = false,
}: {
  children: React.ReactNode;
  mustHavePlan?: boolean;
  mustHaveClinic?: boolean;
}) => {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session?.user) {
    logger.info("with-authentication: session is null", {
      correlationId: hdrs.get("x-correlation-id") ?? undefined,
    });
    redirect("/authentication");
  }

  // request context for logging
  const requestCtx = {
    correlationId: hdrs.get("x-correlation-id") ?? undefined,
    userId: session.user.id,
    clinicId: session.user.clinic?.id,
  };

  if (mustHavePlan && !session.user.plan) {
    logger.info("with-authentication: user has no plan", requestCtx);
    redirect("/new-subscription");
  }
  if (mustHaveClinic && !session.user.clinic) {
    logger.info("with-authentication: user has no clinic", requestCtx);
    redirect("/clinic-form");
  }

  // render children (session valid)
  logger.info("with-authentication: session valid", requestCtx);
  return children;
};

export default WithAuthentication;
