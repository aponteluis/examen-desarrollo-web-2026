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
      onClick={(e:any) =>
        ref.current && !isClickInsideRectangle(e, ref.current) && onClose()
      }
      className="w-[400px] rounded-lg border-gray-400 p-6 backdrop:bg-black/30"
    >
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      <div className="mb-6">{children}</div>

      <div className="flex gap-5">
        <button 
          onClick={proceedAndClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Proceed
        </button>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
        >
          Close
        </button>
      </div>
    </dialog>
  );
};

export default DialogModal;