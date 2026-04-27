import { type MouseEvent, useEffect, useRef } from "react";

const isClickInsideRectangle = (e: MouseEvent, element: HTMLElement) => {
  const r = element.getBoundingClientRect();

  return (
    e.clientX > r.left &&
    e.clientX < r.right &&
    e.clientY > r.top &&
    e.clientY < r.bottom
  );
};

type Props = {
  title: string;
  isOpened: boolean;
  onProceed: () => void;
  onClose: () => void;
  children: React.ReactNode;
};

const DialogModal = ({
  title,
  isOpened,
  onProceed,
  onClose,
  children,
}: Props) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpened) {
      ref.current?.showModal();
      document.body.classList.add("modal-open"); // prevent bg scroll
    } else {
      ref.current?.close();
      document.body.classList.remove("modal-open");
    }
  }, [isOpened]);

  const proceedAndClose = () => {
    onProceed();
    onClose();
  };

  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) =>
        ref.current && !isClickInsideRectangle(e, ref.current) && onClose()
      }
      className="fixed inset-0 m-auto h-fit w-[calc(100%-2rem)] max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl backdrop:bg-black/40"
    >
      <h3 className="mb-4 text-xl font-semibold text-slate-800">{title}</h3>

      <div className="mb-6 text-slate-600">{children}</div>

      <div className="flex gap-3">
        <button
          onClick={proceedAndClose}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
        >
          Borrar
        </button>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Cerrar
        </button>
      </div>
    </dialog>
  );
};

export default DialogModal;