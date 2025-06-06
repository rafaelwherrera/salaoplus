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

import AddProfissionalButton from "../_components/add-profissional-button";

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
        <h1>Profissionais</h1>
      </PageContent>
    </PageContainer>
  );
};

export default Profissionais;
