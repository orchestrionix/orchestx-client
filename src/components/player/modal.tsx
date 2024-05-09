import { Dialog, Transition } from '@headlessui/react';
import React, { Dispatch, Fragment, ReactNode, SetStateAction } from 'react';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export const Modal: React.FC<Props> = ({ open, setOpen, children }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-50 inset-0 overflow-y-auto'
        onClose={setOpen}
      >
        <div className='flex h-screen p-6 text-center xl:block xl:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-85 transition-opacity' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='hidden xl:inline-block xl:align-middle xl:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 xl:translate-y-0 xl:scale-95'
            enterTo='opacity-100 translate-y-0 xl:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 xl:scale-100'
            leaveTo='opacity-0 translate-y-4 xl:translate-y-0 xl:scale-95'
          >
            <div className='relative inline-block align-center rounded-2xl overflow-hidden shadow-xl transform transition-all xl:my-8 xl:align-middle xl:max-w-sm w-full h-full xl:p-6'>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};