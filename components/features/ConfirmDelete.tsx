"use client";

import { useState } from "react";
import { deleteProduct } from "@/lib/actions";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";

export default function ConfirmDelete({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function handleDelete() {
    const fd = new FormData();
    fd.set("id", id);
    await deleteProduct(fd); // server action
    router.refresh();
  }

  return (
    <>
      {/* Кнопка «Delete» */}
      <button
        onClick={() => setOpen(true)}
        className="ml-2 inline-flex gap-1 rounded-md bg-blue-900 px-2 py-1 text-sm text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>{" "}
        Delete
      </button>

      {/* Собственно модалка */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="mb-4 text-lg font-semibold">
          Do you really want to delete &rdquo;{name}&rdquo;?
        </h3>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border bg-gray-300 px-3 py-1"
          >
            No
          </button>

          <form
            action={handleDelete}
            onSubmit={() => setOpen(false)} // мгновенно закрыть
          >
            <button className="rounded-md bg-red-600 px-3 py-1 text-white">
              Yes
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
