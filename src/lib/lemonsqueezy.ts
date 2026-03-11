import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  onError: (error) => {
    console.error("[LemonSqueezy] Error:", error);
  },
});

export const VARIANTS: Record<string, string> = {
  PREMIUM: process.env.LEMONSQUEEZY_PREMIUM_VARIANT_ID!,
  FAMILLE: process.env.LEMONSQUEEZY_FAMILLE_VARIANT_ID!,
};

export interface CreateCheckoutOptions {
  plan: "PREMIUM" | "FAMILLE";
  userEmail: string;
  userId: string;
  locale?: string;
}

export async function createCheckoutUrl({
  plan,
  userEmail,
  userId,
  locale = "fr",
}: CreateCheckoutOptions): Promise<string> {
  const variantId = VARIANTS[plan];
  if (!variantId) {
    throw new Error(`Unknown plan: ${plan}`);
  }

  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

  const checkout = await createCheckout(storeId, variantId, {
    checkoutOptions: {
      embed: false,
    },
    checkoutData: {
      email: userEmail,
      custom: {
        user_id: userId,
      },
    },
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/profile?upgraded=true`,
      receiptButtonText: "Retour à Pawmedic",
      receiptThankYouNote: "Merci pour votre abonnement Pawmedic !",
    },
  });

  if (checkout.error) {
    throw new Error(checkout.error.message);
  }

  const checkoutUrl = checkout.data?.data?.attributes?.url;
  if (!checkoutUrl) {
    throw new Error("No checkout URL returned");
  }

  return checkoutUrl;
}

export const PLAN_NAMES: Record<string, string> = {
  FREE: "Gratuit",
  PREMIUM: "Premium",
  FAMILLE: "Famille",
};
