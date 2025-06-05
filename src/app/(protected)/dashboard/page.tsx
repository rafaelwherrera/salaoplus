import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import SignOutButton from "./_components/sign-out-button";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.salon) {
    redirect("/salons-form");
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
