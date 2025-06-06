import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AddClienteButton } from "@/components/AddClienteButton";
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
import { clientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { clientsTableColumns } from "./_components/table-columns";

const ClientesPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session.user.salon) {
    redirect("/clinic-form");
  }
  const clients = await db.query.clientsTable.findMany({
    where: eq(clientsTable.salonId, session.user.salon.id),
  });
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Clientes</PageTitle>
          <PageDescription>Gerencie os clientes da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddClienteButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={clients} columns={clientsTableColumns} />
      </PageContent>
    </PageContainer>
  );
};

export default ClientesPage;
