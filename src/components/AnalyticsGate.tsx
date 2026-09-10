"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useConsent } from "../lib/consent";

export function AnalyticsGate({ gaId }: { gaId: string }) {
  const consent = useConsent();

  if (consent !== "granted") return null;

  return <GoogleAnalytics gaId={gaId} />;
}
