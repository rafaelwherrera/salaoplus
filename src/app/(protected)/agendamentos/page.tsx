import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import {
  appointmentsTable,
  clientsTable,
  professionalsTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

import AddAgendamentoButton from "./_components/add-agendamento-button";
import { appointmentsTableColumns } from "./_components/table-columns";

const AppointmentsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session.user.salon) {
    redirect("/clinic-form");
  }
  // if (!session.user.salon.plan) {
  //   redirect("/new-subscription");
  // }
  const [clients, professionals, appointments] = await Promise.all([
    db.query.clientsTable.findMany({
      where: eq(clientsTable.salonId, session.user.salon.id),
    }),
    db.query.professionalsTable.findMany({
      where: eq(professionalsTable.salonId, session.user.salon.id),
    }),
    db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.salonId, session.user.salon.id),
      with: {
        client: true,
        professional: true,
      },
    }),
  ]);

  const filters = [
    {
      id: "client",
      label: "Cliente",
      type: "search",
      placeholder: "Buscar cliente",
    },
    {
      id: "professional",
      label: "Profissional",
      type: "search",
      placeholder: "Buscar profissional",
    },
    {
      id: "date",
      label: "Data",
      type: "date",
      placeholder: "Buscar data",
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: ["confirmado", "cancelado"],
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAgendamentoButton
            clients={clients}
            professionals={professionals}
          />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable
          data={appointments}
          columns={appointmentsTableColumns}
          filters={filters}
        />
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
