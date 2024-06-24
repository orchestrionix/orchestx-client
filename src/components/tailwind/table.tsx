/* eslint-disable jsx-a11y/anchor-is-valid */
/* This example requires Tailwind CSS v2.0+ */
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { classNames } from "../../utils";
import { useScrollPosition, Scroll } from "../../utils/hooks/useScrollPosition";


export interface IColumn {
  key: string | number;
  onHeaderClick?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    fieldName?: IColumn
  ) => void;
  sortable?: boolean;
  isSortedDescending?: boolean;
  isSorted?: boolean;
  name: string;
  fieldName?: string;
  render: (item: any) => any;
}

interface TableProps {
  columns: IColumn[];
  items: any[];
  lazyLoading?: boolean;
  loadMore?: boolean;
  loadMoreCallback?: () => void;
  // shimmer?: boolean;
  loading?: boolean;
  // shimmerLength?: number;
  onClick?: (item: any) => void;
  onDoubleClick?: (item: any) => void;
  selection?: any;
}

const Table: React.FC<TableProps> = ({
  columns,
  items,
  loadMore,
  loadMoreCallback = () => ({}),
  lazyLoading,
  loading,
  onClick,
  onDoubleClick,
  selection,
}) => {
  const ref = useRef(null);
  const scroll = useScrollPosition({
    wait: 500,
    element: ref,
  });
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const isRefBottomAboveViewport = (input: Scroll): boolean => {
    if (input && input.rect && input.viewport) {
      if (input.rect.bottom < input.viewport.h) return true;
    }
    return false;
  };

  useEffect(() => {
    if (loadMore && lazyLoading && !loading) {
      const shouldLoadMore = isRefBottomAboveViewport(scroll);

      if (shouldLoadMore) {
        console.log("loadmore");
        loadMoreCallback();
      }
    }
  }, [scroll]);

  const handleClick = (item: any) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      if (onDoubleClick) onDoubleClick(item);
    } else {
      const timeout = setTimeout(() => {
        if (onClick) onClick(item);
        setClickTimeout(null);
      }, 250);
      setClickTimeout(timeout);
    }
  };

  return (
    <div className="mt-4 flex flex-col text-white">
      <div>
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-md">
            <table
              className="min-w-full divide-y divide-grey-700 z-10"
              ref={ref}
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-md sm:pl-6 capitalized w-20"
                    key={`col-custom`}
                  >
                    <span>{""}</span>
                  </th>
                  {columns.map((col, i) => {
                    return (
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm
                         sm:pl-6 capitalized"
                        key={`col-${i}_${col.name}`}
                        onClick={
                          col.sortable
                            ? (e) => {
                                if (col.onHeaderClick)
                                  col.onHeaderClick(e, col);
                              }
                            : undefined
                        }
                      >
                        <a
                          href="#"
                          className={`group inline-flex ${
                            col.sortable
                              ? "hover:cursor-pointer"
                              : "hover:cursor-default"
                          }`}
                        >
                          {col.name}
                          {col.sortable &&
                            col.isSorted &&
                            col.isSortedDescending && (
                              <span className="ml-2 flex-none rounded group-hover:visible group-focus:visible">
                                <ChevronDownIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          {col.sortable &&
                            col.isSorted &&
                            !col.isSortedDescending && (
                              <span className="ml-2 flex-none rounded group-hover:visible group-focus:visible">
                                <ChevronDownIcon
                                  className="h-5 w-5 rotate-180"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          {col.sortable && !col.isSorted && (
                            <span className="invisible ml-2 flex-none rounded group-hover:visible group-focus:visible">
                              <ChevronDownIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </a>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {items.length > 0 && !loading ? (
                  <>
                    {items.map((item, i) => (
                      <tr
                        key={`${item.id}_${i}`}
                        className={classNames(
                          "hover:bg-grey-900 hover:text-gold rounded-xl",
                          (selection?.index && selection?.index === item?.index) ? "bg-grey-900 text-gold" : '',
                        )}
                        onClick={() => handleClick(item)}
                      >

                          <td
                            className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-small sm:pl-6"
                            key={`custom_colnumber`}
                          >
                            <span className="text-ellipsis overflow-hidden">
                              {i + 1}
                            </span>
                          </td>
                          {columns.map((col, index) => {
                            return (
                              <td
                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-small sm:pl-6"
                                key={`${item.id}_${col.key}_${index}`}
                              >
                                {col.render(item)}
                              </td>
                            );
                          })}
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {items.length < 1 && !loading ? (
                      <tr key="empty">
                        <td
                          className="whitespace-nowrap py-4 text-sm font-medium text-center content-center"
                          colSpan={columns.length + 1}
                        >
                          <div className="mx-auto">
                            <h3 className="mt-2 text-sm font-semibold">
                              Niets gevonden
                            </h3>
                            <p className="mt-1 text-sm">...</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                  </>
                )}
                {loading && (
                  <tr key="loading">
                    <td
                      className="whitespace-nowrap py-4 text-sm font-medium text-center content-center"
                      colSpan={columns.length}
                    >
                      <div className="mx-auto">
                        <svg
                          className="animate-spin ml-2 mr-3 h-6 w-6 inline"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Table };
