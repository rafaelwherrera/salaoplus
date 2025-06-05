import { Plus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
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
          <Button className="cursor-pointer">
            <Plus />
            Adicionar Profissional
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>Profissionais</h1>
      </PageContent>
    </PageContainer>
  );
};

export default Profissionais;
