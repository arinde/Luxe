import { v4 as uuidv4 } from "uuid";


export function generateTxnRef(): string {
  const myuuid = uuidv4()
  // return `LUXE_${userId}_${Date.now()}`;
  return myuuid;
}
