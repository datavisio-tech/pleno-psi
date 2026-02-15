import { headers } from "next/headers";
import { redirect } from "next/navigation";

import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

type Props = {
  searchParams?: { session_id?: string };
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SuccessPage = async ({ searchParams }: Props) => {
  const sessionId = searchParams?.session_id ?? null;
  logger.info("subscription.success: page requested", {
    module: "subscription.success",
    metadata: { sessionId },
  });

  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) {
    logger.info("subscription.success: no session, redirecting to authentication", {
      module: "subscription.success",
      metadata: { sessionId },
    });
    redirect("/authentication");
  }

  const userId = session!.user.id;

  // Check immediately and then poll up to 5 seconds
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) });
    const plan = user?.plan ?? null;
    logger.info("subscription.success: plan check", {
      module: "subscription.success",
      metadata: { sessionId, userId, plan, attempt },
    });
    if (plan) {
      logger.info("subscription.success: plan active, redirecting to dashboard", {
        module: "subscription.success",
        metadata: { sessionId, userId, plan, waitedMs: attempt * 1000 },
      });
      redirect("/dashboard");
    }
    // wait 1s before next check
    await sleep(1000);
  }

  // If still not active after polling, render a waiting page with meta-refresh
  logger.info("subscription.success: plan not active after wait, rendering waiting page", {
    module: "subscription.success",
    metadata: { sessionId, userId },
  });

  return (
    <WithAuthentication mustHaveClinic>
      <div className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold">Confirmando assinatura</h1>
        <p className="mt-4">Aguardando confirmação do pagamento. Esta página será atualizada automaticamente.</p>
        <p className="mt-2 text-sm text-muted-foreground">Se a confirmação não ocorrer em até alguns segundos, atualize manualmente.</p>
        <meta httpEquiv="refresh" content="5" />
      </div>
    </WithAuthentication>
  );
};

export default SuccessPage;
