import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { logger } from "@/lib/logger";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe secret key not found");
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    throw new Error("Stripe signature not found");
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    logger.error("stripe.webhooks.constructEvent failed", err as Error);
    throw err;
  }

  logger.info("stripe.webhook.received", {
    correlationId: undefined,
    module: "stripe.webhook",
    metadata: { type: event.type },
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logger.info("stripe.event", {
          module: "stripe.webhook",
          metadata: {
            type: event.type,
            sessionId: session.id ?? null,
            customer: session.customer ?? null,
            metadata: session.metadata ?? null,
          },
        });
        const userId = session.metadata?.userId as string | undefined;
        if (!userId) {
          logger.warn(
            "stripe.webhook: checkout.session.completed missing userId",
            {
              module: "stripe.webhook",
              metadata: { sessionId: session.id ?? null },
            },
          );
          break;
        }
        const customer =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const result = await db
          .update(usersTable)
          .set({
            stripeCustomerId: customer ?? null,
            plan: "PRO",
          })
          .where(eq(usersTable.id, userId));
        const updated =
          typeof result === "number"
            ? result
            : ((result as any)?.rowCount ?? null);
        logger.info("stripe.webhook.db.update", {
          module: "stripe.webhook",
          metadata: { userId, result },
        });
        logger.info("stripe.webhook.updated-user", {
          module: "stripe.webhook",
          metadata: { userId, updated },
        });
        logger.info("stripe.webhook: user plan updated", {
          module: "stripe.webhook",
          metadata: { userId, updated },
        });
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        logger.info("stripe.event", {
          module: "stripe.webhook",
          metadata: {
            type: event.type,
            invoiceId: invoice.id ?? null,
            customer: invoice.customer ?? null,
            metadata: invoice.metadata ?? null,
            subscription: invoice.subscription ?? null,
          },
        });
        let userId: string | undefined = undefined;
        // Try invoice metadata first
        if (invoice.metadata && (invoice.metadata as any).userId) {
          userId = (invoice.metadata as any).userId as string;
        }
        // If subscription id present, fetch subscription metadata
        if (!userId && invoice.subscription) {
          try {
            const subscriptionId =
              typeof invoice.subscription === "string"
                ? invoice.subscription
                : invoice.subscription.id;
            const subscription =
              await stripe.subscriptions.retrieve(subscriptionId);
            if (
              subscription &&
              subscription.metadata &&
              (subscription.metadata as any).userId
            ) {
              userId = (subscription.metadata as any).userId as string;
            }
          } catch (e) {
            logger.warn("stripe.webhook: failed to retrieve subscription", {
              module: "stripe.webhook",
              metadata: { invoiceId: invoice.id ?? null },
            });
          }
        }
        if (!userId) {
          logger.warn("stripe.webhook: invoice.paid missing userId", {
            module: "stripe.webhook",
            metadata: { invoiceId: invoice.id ?? null },
          });
          break;
        }
        const customer =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;
        const result = await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: invoice.subscription
              ? typeof invoice.subscription === "string"
                ? invoice.subscription
                : invoice.subscription.id
              : null,
            stripeCustomerId: customer ?? null,
            plan: "PRO",
          })
          .where(eq(usersTable.id, userId));
        const updated =
          typeof result === "number"
            ? result
            : ((result as any)?.rowCount ?? null);
        logger.info("stripe.webhook.db.update", {
          module: "stripe.webhook",
          metadata: { userId, result },
        });
        logger.info("stripe.webhook.updated-user", {
          module: "stripe.webhook",
          metadata: { userId, updated },
        });
        logger.info("stripe.webhook: user plan updated", {
          module: "stripe.webhook",
          metadata: { userId, updated },
        });
        break;
      }
      case "customer.subscription.deleted": {
        if (!event.data.object.id) {
          throw new Error("Subscription ID not found");
        }
        const subscription = await stripe.subscriptions.retrieve(
          event.data.object.id,
        );
        if (!subscription) {
          throw new Error("Subscription not found");
        }
        const userId = subscription.metadata.userId;
        if (!userId) {
          throw new Error("User ID not found");
        }
        const result = await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: null,
            stripeCustomerId: null,
            plan: null,
          })
          .where(eq(usersTable.id, userId));
        const updated =
          typeof result === "number"
            ? result
            : ((result as any)?.rowCount ?? null);
        logger.info("stripe.webhook.db.update", {
          module: "stripe.webhook",
          metadata: { userId, result },
        });
        logger.info("stripe.webhook.updated-user", {
          module: "stripe.webhook",
          metadata: { userId, updated },
        });
        logger.info("stripe.webhook: user plan updated", {
          module: "stripe.webhook",
          metadata: { userId, updated },
        });
      }
    }
  } catch (err) {
    logger.error("stripe.webhook.processing_error", err as Error);
    throw err;
  }
  return NextResponse.json({
    received: true,
  });
};
