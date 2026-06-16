import { v4 as uuidv4 } from "uuid";


export function generateTxnRef(amount: number): string {
  const myuuid = uuidv4()
  // return `LUXE_${userId}_${Date.now()}`;
  return myuuid;
}
