"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpserProfissional from "./upsert-profissional";

const AddProfissionalButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus />
          Adicionar Profissional
        </Button>
      </DialogTrigger>
      <UpserProfissional onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

export default AddProfissionalButton;
