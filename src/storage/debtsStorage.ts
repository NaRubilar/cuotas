import type { Debt } from "../models/Debt";

const KEY = "cuotas_pwa_debts_v1";

export function loadDebts(): Debt[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Debt[];
  } catch {
    return [];
  }
}

export function saveDebts(debts: Debt[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(debts));
  } catch {
    // si storage está lleno o bloqueado, no rompemos la app
  }
}

export function clearDebts() {
  localStorage.removeItem(KEY);
}
