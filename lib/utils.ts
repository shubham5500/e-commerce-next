import { auth } from "@clerk/nextjs"
import { type ClassValue, clsx } from "clsx"
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function redirectUnauthorized() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in')
  }
  return userId;
}

export const formatter = new Intl.NumberFormat("en-IN", {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})