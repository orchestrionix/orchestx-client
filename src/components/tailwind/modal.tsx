import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actions?: React.ReactElement;
  lightDismiss?: boolean;
  children?: React.ReactElement;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<Props> = ({ 
  children, 
  open, 
  setOpen, 
  actions, 
  lightDismiss = true,
  title,
  size = 'lg'
}) => {
  const handleClose = () => {
    if (lightDismiss) {
      setOpen(false);
    }
  };

  const sizeClasses = {
    sm: 'sm:max-w-lg',
    md: 'sm:max-w-2xl',
    lg: 'sm:max-w-4xl',
    xl: 'sm:max-w-7xl',
    full: 'sm:max-w-[98%]'
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center sm:p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel 
                className={`relative transform overflow-hidden sm:rounded-xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full h-screen sm:h-auto sm:my-8 ${sizeClasses[size]}`}
              >
                {/* Header */}
                <div className='flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700'>
                  {title && (
                    <Dialog.Title className='text-lg font-medium text-gray-900 dark:text-white'>
                      {title}
                    </Dialog.Title>
                  )}
                  <button
                    type='button'
                    className='rounded-lg p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    onClick={() => setOpen(false)}
                  >
                    <span className='sr-only'>Close</span>
                    <XMarkIcon className='h-5 w-5' aria-hidden='true' />
                  </button>
                </div>

                {/* Content */}
                <div className='px-4 sm:px-6 py-4 flex-1 h-[calc(100vh-8rem)] sm:h-auto sm:max-h-[calc(100vh-12rem)] overflow-y-auto'>
                  {children}
                </div>

                {/* Footer */}
                {actions && (
                  <div className='px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700'>
                    <div className='flex flex-row-reverse gap-2'>
                      {actions}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export { Modal };