import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actions?: React.ReactElement;
  lightDismiss?: boolean;
  children?: React.ReactElement;
}

const ModalV2: React.FC<Props> = ({ children, open, setOpen }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-400 dark:bg-gray-800 opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto my-auto'>
          <div className='flex align-middle h-screen w-screen justify-center'>
            <div className='flex items-end justify-center text-center sm:items-center h-5/6 2xl:h-5/6 w-5/6 self-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 text-left shadow-xl transition-all sm:w-full p-0 sm:max-w-6xl h-full'>
                  <div className='h-full'>
                    <div className='absolute top-0 right-0 block pt-4 pr-4'>
                      <button
                        type='button'
                        className='rounded-md text-gray-500 dark:text-gray-500 hover:text-gray-500 hover:dark:text-gray-500 focus:outline-none'
                        onClick={() => setOpen(false)}
                      >
                        <span className='sr-only'>Close</span>
                        <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                      </button>
                    </div>
                    <div className='h-full overflow-y-auto'>{children}</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export { ModalV2 };