/**
 * Clerk Configuration Helper
 * 
 * Ensures consistent and valid keys across development, preview environments,
 * and production. If a live production key is provided whose custom DNS domain
 * (e.g. clerk.reportliai.sbs) is not yet active, falls back to the active test
 * credentials to prevent total application crash (code="failed_to_load_clerk_js").
 */

const FALLBACK_DEV_PUBLISHABLE_KEY = "pk_test_ZXhjaXRpbmctbWFuYXRlZS0xMTY3LmNsZXJrLmFjY291bnRzLmRldiQ";
const FALLBACK_DEV_SECRET_KEY = "sk_test_UXce92zyjs8800YY1asjfnFKIHjT6eN90FPmucCtiM";

export function getClerkKeys() {
  const envPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const envSec = process.env.CLERK_SECRET_KEY;

  const isLivePub = envPub?.startsWith("pk_live_");
  const isLiveSec = envSec?.startsWith("sk_live_");

  // If user provided a live publishable key AND live secret key, use them in full Production Mode!
  if (isLivePub && isLiveSec) {
    return {
      publishableKey: envPub!,
      secretKey: envSec!,
      isProduction: true,
      isFallback: false,
      originalLiveKey: envPub,
    };
  }

  // If user provided a live publishable key but secret key is still a test key or missing,
  // we must prevent Clerk SDK mismatch fatal error:
  // "Publishable key and secret key must belong to the same environment"
  if (isLivePub && !isLiveSec) {
    return {
      publishableKey: FALLBACK_DEV_PUBLISHABLE_KEY,
      secretKey: envSec?.startsWith("sk_test_") ? envSec : FALLBACK_DEV_SECRET_KEY,
      isProduction: false,
      isFallback: true,
      originalLiveKey: envPub,
      fallbackReason: "Missing sk_live_... secret key to match pk_live_...",
    };
  }

  // Standard development or configured test mode
  return {
    publishableKey: envPub || FALLBACK_DEV_PUBLISHABLE_KEY,
    secretKey: envSec || FALLBACK_DEV_SECRET_KEY,
    isProduction: false,
    isFallback: false,
    originalLiveKey: null,
  };
}
