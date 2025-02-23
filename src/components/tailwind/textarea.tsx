import React from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Textarea: React.FC<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >
> = ({ className, ...props }) => {
  return (
    <textarea
      className={classNames(
        'block w-full rounded-md border-0 dark:bg-white/5 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6',
        props.disabled ? 'bg-grey-100 text-grey-500' : '',
        className || '',
      )}
      {...props}
    />
  );
};

export { Textarea };