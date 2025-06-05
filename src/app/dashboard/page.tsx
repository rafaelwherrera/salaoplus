import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { usersToSalonsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import SignOutButton from "./components/sign-out-button";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }
  const salons = await db.query.usersToSalonsTable.findMany({
    where: eq(usersToSalonsTable.userId, session.user.id),
  });

  if (salons.length === 0) {
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
