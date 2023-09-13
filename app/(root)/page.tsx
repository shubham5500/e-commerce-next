import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
    return (
      <main className="flex">
        This is a protected route
        <UserButton afterSignOutUrl="/"/>
      </main>
    )
  }
  