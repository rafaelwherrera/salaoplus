import { Plus } from "lucide-react";

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

const Profissionais = () => {
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
