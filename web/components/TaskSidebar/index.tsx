import React from 'react'
import { useRouter } from 'next/dist/client/router'
import classNames from 'classnames';
import { NewListInput } from 'components/NewListInput'
import { SidebarListTitle } from 'components/SidebarListTitle'
import { deleteTasks, putTasks } from 'helpers/axiosRequests';

interface TaskSidebarProps {
    task: any;
    listId: number;
    onClose: () => void;
    onDeletion: () => void;
}

export const TaskSidebar: React.FC<TaskSidebarProps> = ({ task, listId, onClose, onDeletion }: TaskSidebarProps): JSX.Element => {
    const router = useRouter();
    const [description, setDescription] = React.useState<string>(task.Description);
    const [name, setName] = React.useState<string>(task.Name);

    React.useEffect(() => {
        setDescription(task.Description);
        setName(task.Name);
    }, [task])

    const handleUpdatingTaskName = React.useCallback(() => {
        if (name == '') {
            setName(task.Name);
            return;
        }
        putTasks(listId, task.Id, name, task.Description, task.Status, router)
    }, [name]);

    return (
        <div className="h-full bg-yellow-300 w-3/12 flex flex-col px-2">
            <div className="bg-white flex content-center p-3 my-3">
                <img
                    src={task.Status.toLowerCase() == "open" ? "/icons/circle-yellow.svg" : "/icons/completed.svg"}
                    alt="Circle icon"
                    className="w-5"
                    onClick={() => {
                        putTasks(
                            listId,
                            task.Id,
                            task.Name,
                            task.Description,
                            task.Status.toLowerCase() == "open" ? "completed" : "open", router
                        )
                    }}
                />
                <input
                    type="text"
                    className="border-none focus:outline-none focus:bg-white w-full ml-5 placeholder-yellow-300 text-lg text-black"
                    placeholder="Task name..."
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                    onKeyDown={(e) => { e.keyCode == 13 && handleUpdatingTaskName() }}
                />
            </div>
            <div>
                <textarea
                    rows={10}
                    className="w-full px-3 py-4"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={(e) => e.keyCode == 13 && putTasks(listId, task.Id, task.Name, description, task.Status, router)}
                />
            </div>
            <div className="h-full flex">
                <div className="border-t border-yellow-200 w-full self-end flex py-2 -mx-2">
                    <img src="/icons/arrow-right.svg" alt="Arrow right" className="w-1/12 ml-2 cursor-pointer" onClick={onClose} />
                    <span className="w-10/12 m-auto flex justify-center content-center">Created on Fri, October 15</span>
                    <img
                        src="/icons/trash.svg"
                        alt="Arrow right"
                        className="w-1/12 mr-2 cursor-pointer"
                        onClick={onDeletion}
                    />
                </div>
            </div>
        </div>
    );
}
