/* eslint-disable react/jsx-key */
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  Dispatch,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
  SVGProps,
  useEffect,
  useState,
} from "react";
import {
  ExclamationTriangleIcon,
  PlayIcon,
  TrashIcon,
  XMarkIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { createPortal } from "react-dom";
import { SmallModal } from "./tailwind/smallmodal";
import { classNames } from "../utils";
import Button from "./tailwind/button";
import { Input } from "./tailwind/input";
import { Switch } from "./tailwind/switch";
import { Textarea } from "./tailwind/textarea";
import { Modal } from "./library/modal";

export const DEFAULT_SELECTED_TAB = "Algemeen";

const validateTab = (tab: DetailTab2O) => {
  let valid = true;

  tab.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (
        field.validateCallback &&
        !field.validateCallback(field?.label ? field?.label : "", field.value)
          .valid
      ) {
        valid = false;
      }
    });
  });

  return valid;
};

// ===========================================================================
// ===========================================================================
// ===========================================================================

export interface DetailSchema2O {
  identifier: string;
  object: any;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  tabs: DetailTab2O[];
  specialAction?: {
    action: () => void;
  };
}

export interface DetailTab2O {
  title: string;
  sections: DetailSection2O[];
  hideCallback?: (value?: string) => boolean;
  buttons: DetailButton2O[];
}

export interface DetailSection2O {
  title: string;
  hideTitle?: boolean;
  description?: string;
  width: number;
  fields: DetailField2O[];
  hideCallback?: (value?: string) => boolean;
}

export interface DetailField2O {
  grid: string;
  name: string;
  label: string;
  value?: any;
  required?: boolean;
  type: string;
  max?: number;
  min?: number;
  step?: number;
  placeholder?: string;
  caption?: string;
  className?: string;
  error_caption?: string;
  icon?: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & RefAttributes<SVGSVGElement>
  >;
  // combobox?: {
  //   items: ComboboxItem[];
  //   query?: string;
  //   setQuery?: any;
  // };
  url?: {
    url: string;
  };

  selectbox?: {
    items: string;
  };
  linkbutton?: {
    link: string;
    text: string;
  };
  daybutton?: {
    click: any;
  };
  table?: {
    onCreate?: (item: any) => void;
    columns: any[];
    items: any[];
    onSelect?: (item: any) => void;
    selection?: any;
    showCreateCallback?: (value?: string) => boolean;
    lazyLoading?: boolean;
    loadMore?: boolean;
    loadMoreCallback?: () => void;
    loading?: boolean;
  };
  fasttable?: {
    columns: any[];
    items: any[];
  };
  detail?: {
    open: boolean;
    setOpen: any;
    title: string;
    caption?: string;
    schema: DetailSchema2O;
  };
  dropzone?: {
    selectedFile: File | null;
    setSelectedFile: Dispatch<SetStateAction<File | null>>;
  };
  multidropzone?: {
    selectedFiles: File[] | null;
    setSelectedFiles: Dispatch<SetStateAction<File[] | null>>;
  };
  custom?: {
    setObject: any;
  };
  callback: (name: string, value: any) => any;
  disableCallback?: (value?: string) => boolean;
  hideCallback?: (value?: string) => boolean;
  validateCallback?: (
    lable: string,
    value: string
  ) => {
    valid: boolean;
    message?: string;
  };
}

export interface DetailButton2O {
  text: string;
  validate: boolean;
  callback: () => void;
  hideCallback?: (object: any) => boolean;
  disableCallback?: (object: any) => boolean;
  modal?: {
    header: string;
    body: string;
  };
}

// ===========================================================================
// ===========================================================================
// ===========================================================================

export const DetailForm2O: React.FC<{
  title: string;
  caption?: string;
  schema: DetailSchema2O;
}> = ({ title, caption, schema }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [modal, setModal] = useState<DetailButton2O | undefined>();
  const [showDeveloperView, setShowDeveloperView] = useState(false);

  useEffect(() => {
    schema.setSelectedTab(DEFAULT_SELECTED_TAB);
  }, []);

  // Add event handler to prevent input changes from blocking camera controls
  const handlePointerUp = (e: React.PointerEvent) => {
    // Release pointer capture to prevent blocking camera controls
    if (e.target instanceof HTMLElement) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <main onPointerUp={handlePointerUp}>
      <header className="border-b border-gray-200 dark:border-white/5 relative">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto py-4">
            <ul
              role="list"
              className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-500 sm:px-6 lg:px-8"
            >
              {schema.tabs.map(
                (tab, number) =>
                  (tab.hideCallback ? tab.hideCallback() : true) && (
                    <li
                      key={`${tab.title}_tab_${number}`}
                      className={classNames(
                        tab.title === schema.selectedTab
                          ? "text-primary-400"
                          : "",
                        "cursor-pointer"
                      )}
                      onClick={() => schema.setSelectedTab(tab.title)}
                    >
                      {tab.title}
                    </li>
                  )
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowDeveloperView(!showDeveloperView)}
              className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
            >
              <BeakerIcon className="h-3.5 w-3.5" />
            </button>
            {schema.specialAction && (
              <XMarkIcon
                className="w-6 h-6 text-gray-400 dark:text-white z-80 cursor-pointer"
                onClick={schema.specialAction.action}
              />
            )}
          </div>
        </div>
      </header>

      {/* Developer View Modal */}
      {showDeveloperView &&
        createPortal(
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <BeakerIcon className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Ontwikkelaar Weergave
                  </h3>
                </div>
                <button
                  onClick={() => setShowDeveloperView(false)}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* JSON Content */}
              <div className="flex-1 p-4 min-h-0 overflow-auto">
                <pre className="text-sm font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                  {JSON.stringify(schema.object, null, 2)}
                </pre>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <Button primary onClick={() => setShowDeveloperView(false)}>
                  Sluiten
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <div>
        {schema.tabs.map(
          (tab, index) =>
            (tab.hideCallback ? tab.hideCallback() : true) && (
              <div key={`${schema.identifier}_tab_container_${index}`}>
                {tab.title === schema.selectedTab ? (
                  <Tab2O
                    key={`${schema.identifier}_tab_${index}`}
                    identifier={`${schema.identifier}_tab_${index}`}
                    tab={tab}
                    isSubmit={isSubmit}
                    setIsSubmit={setIsSubmit}
                    schema={schema}
                    setModal={setModal}
                  />
                ) : null}
              </div>
            )
        )}
      </div>
      {modal !== undefined && (
        <SmallModal
          open={modal !== undefined}
          setOpen={() => {
            setModal(undefined);
          }}
        >
          <>
            <DeleteForm2O
              title={modal.modal?.header ? modal.modal?.header : ""}
              text={modal.modal?.body ? modal.modal?.body : ""}
              handleDelete={modal.callback}
              close={() => {
                setModal(undefined);
              }}
            />
          </>
        </SmallModal>
      )}
    </main>
  );
};

export const Tab2O: React.FC<{
  identifier: string;
  tab: DetailTab2O;
  schema: DetailSchema2O;
  isSubmit: boolean;
  setIsSubmit: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<DetailButton2O | undefined>>;
}> = ({ identifier, tab, schema, isSubmit, setIsSubmit, setModal }) => {
  return (
    <article className="divide-y divide-gray-200 dark:divide-white/5">
      {tab.sections.map(
        (section, index) =>
          (section.hideCallback ? section.hideCallback() : true) && (
            <Section2O
              key={`${identifier}_section_${index}`}
              identifier={`${identifier}_section_${index}`}
              section={section}
              isSubmit={isSubmit}
              schema={schema}
            />
          )
      )}

      <footer>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 md:py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          <div />

          <form className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 sm:max-w-full sm:grid-cols-6">
              <div className="col-span-full">
                <div className="flex items-center justify-end gap-x-6">
                  {tab.buttons &&
                    tab.buttons.map((button, index) => {
                      const shouldRender =
                        !button.hideCallback ||
                        button.hideCallback(schema.object) === false;
                      if (!shouldRender) return null;
                      return (
                        <Button
                          key={`${identifier}_button_${button.text}_${index}`}
                          primary
                          onClick={() => {
                            setIsSubmit(true);
                            if (validateTab(tab) && button.callback) {
                              if (!button.modal) {
                                button.callback();
                              } else {
                                setModal(button);
                              }
                            }
                          }}
                        >
                          {button.text}{" "}
                          <span className="inline ml-1">
                            <PlayIcon
                              className="h-3 w-3 text-white"
                              aria-hidden="true"
                            />
                          </span>
                        </Button>
                      );
                    })}
                </div>
              </div>
            </div>
          </form>
        </div>
      </footer>
    </article>
  );
};

export const Section2O: React.FC<{
  identifier: string;
  section: DetailSection2O;
  isSubmit: boolean;
  schema: DetailSchema2O;
}> = ({ identifier, section, isSubmit, schema }) => {
  return section.hideTitle === true ? (
    <section>
      <div
        className={classNames(
          "grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 sm:px-6 lg:px-8 ",
          section.hideTitle ? "" : "py-12"
        )}
      >
        <form className="md:col-span-2">
          <div
            className={classNames(
              "grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-full sm:grid-cols-6 ",
              section.hideTitle ? "" : ""
            )}
          >
            {section.fields.map((field, index) => (
              <Field2O
                key={`${identifier}_field_${index}`}
                identifier={`${identifier}_field_${index}`}
                field={field}
                isSubmit={isSubmit}
                schema={schema}
              />
            ))}
          </div>
        </form>
      </div>
    </section>
  ) : (
    <section>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <header>
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
            {section.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            {section.description}
          </p>
        </header>

        <form className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-full sm:grid-cols-6">
            {section.fields.map((field, index) => (
              <Field2O
                key={`${identifier}_field_${index}`}
                identifier={`${identifier}_field_${index}`}
                field={field}
                isSubmit={isSubmit}
                schema={schema}
              />
            ))}
          </div>
        </form>
      </div>
    </section>
  );
};

export const Field2O: React.FC<{
  identifier: string;
  field: DetailField2O;
  isSubmit: boolean;
  schema: DetailSchema2O;
}> = ({ identifier, field, isSubmit, schema }) => {
  const [isTimeOut, setIsTimeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeOut(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {((field.hideCallback && field.hideCallback()) ||
        !field.hideCallback) && (
        <div
          className={classNames(
            field.grid,
            field.type !== "queryBuilder" &&
              field.type !== "actionBuilder" &&
              field.type !== "texture"
              ? ""
              : ""
          )}
        >
          <label
            htmlFor={identifier}
            className={classNames(
              isSubmit &&
                field.validateCallback &&
                !field.validateCallback(
                  field?.label ? field?.label : "",
                  field.value
                ).valid
                ? "text-red"
                : "text-gray-900 dark:text-white",
              "block text-sm font-medium leading-6"
            )}
          >
            {field.label && field.label.length > 0 ? field.label : ""}
            {field.required && <span>*</span>}{" "}
            {isSubmit &&
              field.validateCallback &&
              !field.validateCallback(
                field?.label ? field?.label : "",
                field.value
              ).valid &&
              isTimeOut && (
                <span>{`(${
                  field.validateCallback(
                    field?.label ? field?.label : "",
                    field.value
                  ).message
                })`}</span>
              )}
          </label>
          <div className="mt-2">
            {(field.type === "text" ||
              field.type === "number" ||
              field.type === "email" ||
              field.type === "size" ||
              field.type === "money") && (
              <Input
                type={field.type}
                name={field.name}
                id={identifier}
                placeholder={field.placeholder}
                value={field.value}
                max={field.max}
                min={field.min}
                step={field.step}
                icon={field.icon}
                onChange={(e: any) =>
                  field.callback && field.callback(field.name, e.target.value)
                }
                className={field.className}
                disabled={
                  field.disableCallback ? field.disableCallback() : false
                }
              />
            )}

            {field?.type === "url" && field.url && (
              <div
                className={classNames(
                  "flex rounded-md border-0 dark:bg-white/5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6",
                  (field.disableCallback ? field.disableCallback() : false)
                    ? "bg-grey-100 text-grey-500"
                    : "",
                  field.className || ""
                )}
              >
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm font-light lowercase">
                  {field.url.url}
                </span>
                <input
                  id={identifier}
                  type="text"
                  name={field.name}
                  autoComplete={field.name}
                  value={field.value}
                  className={classNames(
                    "block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6",
                    field.className ? field.className : "",
                    (field.disableCallback ? field.disableCallback() : false)
                      ? "bg-grey-100 text-gray-500"
                      : "text-gray-900 dark:text-white"
                  )}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    field.callback && field.callback(field.name, e.target.value)
                  }
                  disabled={
                    field.disableCallback ? field.disableCallback() : false
                  }
                />
              </div>
            )}

            {field.type === "time" && (
              <Input
                type={field.type}
                id={identifier}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.callback(field.name, e.target.value)}
                className={field.className}
                disabled={
                  field.disableCallback ? field.disableCallback() : false
                }
              />
            )}

            {field.type === "datetime-local" && (
              <Input
                type={field.type}
                id={identifier}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.callback(field.name, e.target.value)}
                className={field.className}
                disabled={
                  field.disableCallback ? field.disableCallback() : false
                }
              />
            )}

            {field.type === "date" && (
              <Input
                type={field.type}
                id={identifier}
                placeholder={field.placeholder}
                value={field.value}
                className={field.className}
                onChange={(e) => field.callback(field.name, e.target.value)}
                disabled={
                  field.disableCallback ? field.disableCallback() : false
                }
              />
            )}

            {field.type === "switch" && (
              <Switch
                checked={field.value ? field.value : false}
                onChange={(e: any) => field.callback(field.name, e)}
                disabled={field.disableCallback && !field.disableCallback()}
              />
            )}


            {field.type === "select" && field.selectbox && (
              <>
                <select
                  id="location"
                  name="location"
                  value={field.value}
                  className={
                    "rounded-md w-full border-0 dark:bg-white/5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                  }
                  onChange={(e) => field.callback(field.name, e.target.value)}
                  disabled={field.disableCallback && !field.disableCallback()}
                >
                  <option value="kies">Kies</option>
                  {field.selectbox.items
                    ?.split(",")
                    .map((item: any, index: number) => (
                      <option
                        value={item}
                        key={`${identifier}_option_${item}_${index}`}
                      >
                        {item}
                      </option>
                    ))}
                </select>
              </>
            )}

            {field.type === "textarea" && (
              <Textarea
                id={identifier}
                placeholder={field.placeholder}
                className={field.className}
                value={field.value}
                onChange={(e) => field.callback(field.name, e.target.value)}
                disabled={
                  field.disableCallback ? field.disableCallback() : false
                }
                style={{ width: "100%" }}
                rows={4}
              />
            )}

            

            {field.type === "add-button" && field.callback && (
              <>
                <Button
                  quaternary
                  onClick={() => field.callback("", "")}
                  disabled={field.disableCallback && field.disableCallback()}
                  className="mt-6"
                >
                  Toevoegen{" "}
                  <span className="inline ml-1">
                    <PlusIcon
                      className="h-3 w-3 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </Button>
              </>
            )}

           

            {field.type === "detail" && field.detail && (
              <Modal open={field.detail.open} setOpen={field.detail.setOpen}>
                <>
                  {field.detail.open && ( // important condition to reset detail state
                    <DetailForm2O
                      schema={field.detail.schema}
                      title={field.detail.title}
                      caption={field.detail.caption}
                    />
                  )}
                </>
              </Modal>
            )}

            {field.type === "title" && (
              <>
                <h2 className="w-full font-medium text-lg">{field.value}</h2>
              </>
            )}
            </div>
          {field.caption && (
            <p className="ml-0.5 mt-1 text-xs font-light leading-6 text-grey-500">
              {field.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export const DeleteForm2O: React.FC<{
  title: string;
  text: string;
  handleDelete: () => void;
  close: () => void;
}> = ({ title, text, handleDelete, close }) => {
  return (
    <div className="self-center px-8">
      <div className="sm:flex sm:items-start mb-6">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon
            className="h-6 w-6 text-cego-red"
            aria-hidden="true"
          />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-lg font-semibold leading-6 mb-4 dark:text-white text-gray-900"
          >
            {title}
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-base dark:text-white text-gray-900">{text}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          tertiary
          onClick={() => {
            close();
          }}
        >
          {"Annuleren"}{" "}
        </Button>

        <Button
          secondary
          onClick={() => {
            handleDelete();
          }}
        >
          {"Verwijderen"}{" "}
          <span className="inline ml-1">
            <TrashIcon className="h-3 w-3 text-cego-white" aria-hidden="true" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default DetailForm2O;