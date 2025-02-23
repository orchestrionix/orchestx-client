import React, {
    ForwardRefExoticComponent,
    RefAttributes,
    SVGProps,
  } from "react";
  import { EnvelopeIcon } from "@heroicons/react/20/solid";
  
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  
  const Input: React.FC<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    > & {
      callback?: (name: string | undefined, value: string) => void;
      icon?: ForwardRefExoticComponent<
        Omit<SVGProps<SVGSVGElement>, "ref"> & {
          title?: string;
          titleId?: string;
        } & RefAttributes<SVGSVGElement>
      >;
    }
  > = ({ className, type, callback, icon, ...props }) => {
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numericValue = value.replace(/[^0-9.]/g, "");
      if (props.onChange) {
        const updatedEvent = {
          ...e,
          target: { ...e.target, value: numericValue },
        };
        props.onChange(updatedEvent);
      }
      if (callback) {
        callback(props.name, numericValue);
      }
    };
  
    if (type === "money") {
      return (
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">€</span>
          </div>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="0.00"
            step="0.01"
            aria-describedby="price-currency"
            className={classNames(
              "block w-full rounded-md border-0 dark:bg-white/5  y-1.5 pl-10 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6",
              props.disabled ? "bg-grey-100 text-grey-500" : "",
              className || ""
            )}
            onChange={handlePriceChange}
            {...props}
          />
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pr-4">
            <span id="price-currency" className="text-gray-500 sm:text-sm">
              EUR
            </span>
          </div>
        </div>
      );
    }
  
    if (type === "size") {
      return (
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">
              <span className="w-4 h-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m17.5 10.5l2 2M14 14l2 2m-5.5 1.5l2 2M10.536 4.678c1.364-1.365 2.047-2.047 2.808-2.363a4.14 4.14 0 0 1 3.17 0c.761.316 1.444.998 2.808 2.363c1.365 1.364 2.047 2.047 2.363 2.808a4.14 4.14 0 0 1 0 3.17c-.316.761-.998 1.444-2.363 2.808l-5.857 5.858c-1.365 1.365-2.048 2.047-2.809 2.363a4.14 4.14 0 0 1-3.17 0c-.761-.316-1.444-.998-2.808-2.363c-1.365-1.364-2.047-2.047-2.363-2.808a4.14 4.14 0 0 1 0-3.17c.316-.761.998-1.444 2.363-2.808z"
                    color="currentColor"
                  />
                </svg>
              </span>
            </span>
          </div>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="0.00"
            step="0.01"
            aria-describedby="price-currency"
            className={classNames(
              "block w-full rounded-md border-0 dark:bg-white/5  y-1.5 pl-10 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6",
              props.disabled ? "bg-grey-100 text-grey-500" : "",
              className || ""
            )}
            onChange={handlePriceChange}
            {...props}
          />
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pr-4">
            <span id="price-currency" className="text-gray-500 sm:text-sm">
              mm
            </span>
          </div>
        </div>
      );
    }
  
    if (icon) {
      return (
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon &&
              React.createElement(icon, {
                className: "h-5 w-5 text-gray-400",
                "aria-hidden": "true",
              })}
          </div>
          <input
            type={type}
            className={classNames(
              "block w-full rounded-md border-0 dark:bg-white/5 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6",
              "pl-10",
              props.disabled ? "bg-grey-100 text-grey-500" : "",
              className || ""
            )}
            {...props}
          />
        </div>
      );
    }
  
    return (
      <input
        className={classNames(
          "block w-full rounded-md border-0 dark:bg-white/5 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6",
          props.disabled ? "bg-grey-100 text-grey-500" : "",
          className || ""
        )}
        type={type}
        {...props}
      />
    );
  };
  
  export { Input };