"use client";

import { useActionState, useRef, useState } from "react";

import { Modal } from "@/components/ui/Modal";

import { deleteCategory, type DeleteCategoryActionState } from "./actions";

type DeleteCategoryButtonProps = {
  categoryId: string;
  categoryName: string;
  productCount: number;
};

const initialState: DeleteCategoryActionState = { status: "idle", message: "" };

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  productCount,
}: DeleteCategoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [state, formAction, isPending] = useActionState(deleteCategory, initialState);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentCount =
    state.status === "error" && state.productCount !== undefined
      ? state.productCount
      : productCount;
  const hasProducts = currentCount > 0;

  function handleOpen() {
    setFormKey((k) => k + 1);
    setOpen(true);
  }

  function handleClose() {
    if (isPending) return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:border-red-500 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        onClick={handleOpen}
        ref={triggerRef}
        type="button"
      >
        Excluir
      </button>

      <Modal
        closable={!isPending}
        onClose={handleClose}
        open={open}
        role="alertdialog"
        title="Excluir categoria"
        footer={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
            {state.status === "error" && state.message ? (
              <p className="w-full text-sm font-medium text-red-700" role="alert">
                {state.message}
              </p>
            ) : null}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-zinc-500 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:opacity-50"
                disabled={isPending}
                onClick={handleClose}
                type="button"
              >
                Cancelar
              </button>
              <form action={formAction} key={formKey}>
                <input name="categoryId" type="hidden" value={categoryId} />
                <button
                  aria-busy={isPending || undefined}
                  aria-disabled={hasProducts || undefined}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isPending || hasProducts}
                  type="submit"
                >
                  {isPending ? "Excluindo…" : "Excluir permanentemente"}
                </button>
              </form>
            </div>
          </div>
        }
      >
        <div className="space-y-3 text-sm leading-6 text-zinc-700">
          <p>
            <strong className="font-semibold text-zinc-950">&ldquo;{categoryName}&rdquo;</strong> será excluída
            permanentemente. Esta ação não pode ser desfeita.
          </p>
          {hasProducts ? (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-amber-800">
              Esta categoria possui{" "}
              <strong className="font-semibold">{currentCount} produto(s)</strong> vinculado(s).
              Mova ou exclua os produtos antes de excluir a categoria.
            </p>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
