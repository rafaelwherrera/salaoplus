import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SalonsForm from "./_components/form";

const SalonsFormPage = () => {
  return (
    <div>
      <Dialog open={true}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">Adicionar Salão</DialogTitle>
              <DialogDescription className="text-center">
                Adicione um novo salão para continuar.
              </DialogDescription>
            </DialogHeader>
            <SalonsForm />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default SalonsFormPage;
