import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import { DatePicker } from "./_components/date-pickers";

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
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Gerencie os agendamentos da sua clínica
            </p>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default Dashboard;
