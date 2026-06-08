export function generateTxnRef(userId: string): string {
  return `LUXE_${userId}_${Date.now()}`;
}
