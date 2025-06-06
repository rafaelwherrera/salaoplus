import { eq } from "drizzle-orm";
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
import { db } from "@/db";
import { professionalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddProfissionalButton from "../_components/add-profissional-button";
import ProfissionalCard from "../_components/profissional-card";

const Profissionais = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/login");
  }
  if (!session.user.salon) {
    redirect("/salons-form");
  }

  const profissionais = await db.query.professionalsTable.findMany({
    where: eq(professionalsTable.salonId, session.user.salon.id),
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Profissionais</PageTitle>
          <PageDescription>
            Gerencie os profissionais do seu salão
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddProfissionalButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-3 gap-6">
          {profissionais.map((profissional) => (
            <ProfissionalCard
              key={profissional.id}
              profissional={profissional}
            />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default Profissionais;
