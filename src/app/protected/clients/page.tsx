import { AddClienteButton } from "@/components/AddClienteButton";
import { PageHeader } from "@/components/PageHeader";

export default function ClientsPage() {
  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="Clientes"
        description="Gerencie os clientes do seu salão"
        action={<AddClienteButton />}
      />
    </div>
  );
}
