import React from 'react'
import classNames from 'classnames';
import { postLists } from 'helpers/axiosRequests';
import { useRouter } from 'next/dist/client/router';

export const NewListInput: React.FC<{}> = (): JSX.Element => {
    const router = useRouter()
    const [isAddListInFocus, setIsAddListInFocus] = React.useState<boolean>(false);
    const [newListName, setNewListName] = React.useState<string>('');

    const handleListAddition = React.useCallback(() => {
        if(newListName == ''){
            return
        }
        postLists(newListName, router)
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
                className="bg-yellow-300 placeholder-black border-none focus:outline-none focus:bg-white w-10/12"
                onFocus={() => setIsAddListInFocus(true)}
                onBlur={() => setIsAddListInFocus(false)}
                onInput={(e) => setNewListName(e.target.value)}
                value={newListName}
                autoFocus={isAddListInFocus}
                onKeyDown={(e) => {e.keyCode == 13 && handleListAddition()}}
            />
            <span className={"text-yellow-300 cursor-pointer mr-2"} onClick={handleListAddition}>
                Add
            </span>
        </div>
    );
}
