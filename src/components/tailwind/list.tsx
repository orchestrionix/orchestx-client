
import {  DocumentOutline, EllipsisHorizontalSolid, FolderOutline } from "../icons";

interface TableProps {
    items: any[];
    onSelect?: (item: any) => void;
}

const List: React.FC<TableProps> = ({
    items,
    onSelect
}) => {

    return (
        <div>
            {items.length > 0 ? (
                <>
                    {items.map((item, i) => (
                        <div
                            key={i.toString()+item.name} // random number as key, does not really matter, is for react rendering
                            className="flex items-center space-x-2 sm:space-x-4 p-1 sm:p-4 hover:bg-grey-900 text-white hover:text-gold cursor-pointer"
                            onClick={() => {
                                if (onSelect) onSelect(item);
                            }}
                        >
                            <div className="flex-shrink-0 h-14 w-14 items-center justify-center bg-gradient-to-b from-black to-grey-900 hidden sm:flex">
                                {item?.type === "file" ? (
                                    <DocumentOutline className='h-6 w-6' />
                                ) : (
                                    <FolderOutline className='h-6 w-6' />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-normal truncate">
                                    {item.name} {/* Song Title */}
                                </p>
                                <p className="text-xs sm:text-sm text-grey-300 truncate">
                                    {item.type === 'file' ? item.extension : 'Folder'} {/* Artist Name */}
                                </p>
                            </div>

                            {item.type === 'file' ? (<div className="flex-shrink-0 h-14 w-14 flex items-center justify-center hover:cursor-pointer">
                                {/* Placeholder for Album Cover Image */}
                                <EllipsisHorizontalSolid className='h-6 w-6' />
                            </div>) : (<div className="flex-shrink-0 h-14 w-14 flex items-center justify-center ">
                                {/* Keep icon as placholder to force fit it to its size, color transparant*/}
                                <EllipsisHorizontalSolid className='h-6 w-6 text-transparent' />
                            </div>)}

                        </div>
                    ))}
                </>
            ) : (
                <>
                    {items.length < 1 ? (
                        <div></div>
                    ) : (
                        <></>
                    )}
                </>
            )}
        </div>
    );
};

export { List };