"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "bb_cookie_consent";

export type ConsentValue = "granted" | "denied" | null;

function safeGetItem(): ConsentValue {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function safeSetItem(value: ConsentValue) {
  try {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage unavailable (private browsing, blocked cookies, etc.) — the
    // banner will simply reappear next visit rather than throwing.
  }
  listeners.forEach((listener) => listener());
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setConsent(value: ConsentValue) {
  safeSetItem(value);
}

export function useConsent(): ConsentValue {
  return useSyncExternalStore(
    subscribe,
    safeGetItem,
    () => null // server snapshot: never assume consent during SSR
  );
}
