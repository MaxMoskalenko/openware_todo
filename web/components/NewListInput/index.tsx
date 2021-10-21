import React from 'react'
import classNames from 'classnames';

export const NewListInput: React.FC<{}> = (): JSX.Element => {
    const [isAddListInFocus, setIsAddListInFocus] = React.useState<boolean>(false);
    const [newListName, setNewListName] = React.useState<string>('');

    const handleListAddition = React.useCallback(() => {
        console.log('New list:', newListName);
        setNewListName('');
    }, [newListName])

    return (
        <div className={classNames("w-full flex mt-4", { "bg-white": isAddListInFocus })}>
            <img
                src="/icons/plus.svg"
                alt="Plus icon"
                className="mr-4 ml-2"
            />
            <input
                type="text"
                placeholder="New list"
                className="bg-yellow-300 placeholder-black border-none focus:outline-none focus:bg-white"
                onFocus={() => setIsAddListInFocus(true)}
                onBlur={() => setIsAddListInFocus(false)}
                onInput={(e) => setNewListName(e.target.value)}
                value={newListName}
                autoFocus={isAddListInFocus}
            />
            <span className={"m-auto text-yellow-300 cursor-pointer"} onClick={handleListAddition}>
                Add
            </span>
        </div>
    );
}
