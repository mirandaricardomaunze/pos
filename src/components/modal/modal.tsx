import { XMarkIcon } from '@heroicons/react/24/solid';
import type { ModalProps } from '../../types/modal';


const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container com fundo transparente */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-content"
        className={`relative w-full transform rounded-lg backdrop-blur-md bg-white/20 shadow-xl transition-all duration-300 ease-out sm:my-8 sm:align-middle ${sizeClasses[size]}`}
      >
        {/* Top border primary */}
        <div className="h-1 w-full bg-blue-500 rounded-t-lg" />

        {/* Modal Header */}
        <div className="flex justify-between items-start p-4 border-b border-white/30">
          <h3
            id="modal-title"
            className="text-lg font-semibold text-blue-600"
          >
            {title}
          </h3>
          <button
            type="button"
            className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div
          id="modal-content"
          className="p-4 overflow-y-auto max-h-[80vh] text-blue"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
