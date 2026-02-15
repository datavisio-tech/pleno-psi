"use server";

import Stripe from "stripe";

import { protectedActionClient } from "@/lib/next-safe-action";
import { logger } from "@/lib/logger";

export const createStripeCheckout = protectedActionClient.action(
  async ({ ctx }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not found");
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
    });
    const metadata = { userId: ctx.user.id };
    logger.info("create-stripe-checkout: creating session", {
      module: "create-stripe-checkout",
      metadata,
    });

    const { id: sessionId } = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: ctx.user.email,
      line_items: [
        {
          price: process.env.STRIPE_ESSENTIAL_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/new-subscription`,
      metadata,
    });
    return {
      sessionId,
    };
  },
);
