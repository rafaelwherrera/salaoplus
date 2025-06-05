import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";

import { auth } from "@/lib/auth";

import SignOutButton from "./components/sign-out-button";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
    toast.error("Você precisa estar logado para acessar esta página");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h1>{session?.user?.name}</h1>
      <SignOutButton />
    </div>
  );
};

export default Dashboard;
