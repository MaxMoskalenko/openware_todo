import { deleteTasks, postTasks, putTasks } from 'helpers/axiosRequests';
import { useRouter } from 'next/dist/client/router';
import React from 'react'
import { TaskSidebar } from 'components/TaskSidebar'
import classNames from 'classnames';
interface TodoPageProps {
    selectedList: any;
    tasks: any;
}

export const TodoPage: React.FC<TodoPageProps> = ({ selectedList, tasks }: TodoPageProps): JSX.Element => {
    const router = useRouter();
    const [isCompletedExist, setIsCompletedExist] = React.useState<boolean>(false);
    const [isCompletedOpen, setIsCompletedOpen] = React.useState<boolean>(true);
    const [emptyRowsHeight, setEmptyRowsHeight] = React.useState<number>(0);
    const [newListName, setNewListName] = React.useState<string>('');
    const [selectedTaskId, setSelectedTaskId] = React.useState<number>(0);

    const renderOpenTaskRows = React.useMemo(() => {
        return tasks.map((task: any) => {
            if (task.Status.toLowerCase() != 'open') {
                return null;
            }
            return (
                <div
                    className={classNames("flex border-b py-3 hover:bg-gray-100", { "bg-yellow-100 hover:bg-yellow-100": task.Id == selectedTaskId })}
                    key={`task-${selectedList.Id}-id-${task.Id}`}
                    onClick={() => setSelectedTaskId(task.Id)}
                >
                    <img
                        src="/icons/circle-yellow.svg"
                        alt="Circle icon"
                        className="w-5"
                        onClick={() => { putTasks(selectedList.Id, task.Id, task.Name, task.Description, 'completed', router) }}
                    />
                    <span className="text-lg ml-5">{task.Name}</span>
                </div>
            )
        })
    }, [tasks, selectedTaskId])

    const renderCompletedTaskRows = React.useMemo(() => {
        return tasks.map((task: any) => {
            if (task.Status.toLowerCase() != 'completed') {
                return null;
            }
            return (
                <div
                    className={classNames("flex border-b py-3 hover:bg-gray-100", { "bg-yellow-100 hover:bg-yellow-100": task.Id == selectedTaskId })}
                    key={`task-id-${selectedList.Id}-${task.Id}`}
                    onClick={() => setSelectedTaskId(task.Id)}
                >
                    <img
                        src="/icons/completed.svg"
                        alt="Circle icon"
                        className="w-5"
                        onClick={() => { putTasks(selectedList.Id, task.Id, task.Name, task.Description, 'open', router) }}
                    />
                    <span className="text-lg ml-5 line-through" >{task.Name}</span>
                </div>
            )
        })
    }, [tasks, selectedTaskId])

    const renderEmptyRows = React.useMemo(() => {
        return Array.from(Array(Math.ceil(emptyRowsHeight / 52)).keys()).map((_, index) => {
            return (
                <div className="flex border-b py-3 h-12" key={`task-id-${selectedList.Id}-${index}`} />
            )
        });
    }, [emptyRowsHeight])

    React.useEffect(() => {
        setEmptyRowsHeight(document.getElementById('empty-rows').clientHeight);
        let completedTrigger = false;
        tasks.forEach((task: any) => {
            if (task.Status.toLowerCase() == 'completed') {
                completedTrigger = true;
            }
        })
        setIsCompletedExist(completedTrigger)
    }, [tasks])

    React.useEffect(() => {
        setSelectedTaskId(-1);
    }, [selectedList.Id])

    const handleAdditionOfNewList = React.useCallback(() => {
        if (newListName == '')
            return
        postTasks(selectedList.Id, newListName, router);
        setNewListName('')
    }, [newListName, selectedList.Id])

    const getSelectedTask = () => {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].Id == selectedTaskId) {                
                return tasks[i]
            }
        }
        setSelectedTaskId(-1);
        return {}
    }

    return (
        <div className="flex h-screen w-full">
            <div className="px-3 flex flex-col w-full">
                <div className="flex mt-5">
                    <span className="text-lg font-semibold" id="menu-button" aria-expanded="true" aria-haspopup="true">{selectedList.Name}</span>
                    <span className="text-lg font-semibold ml-1 cursor-pointer">···</span>
                </div>
                <div className="flex text-yellow-300 border-b py-3">
                    <img src="/icons/plus-yellow.svg" alt="Plus icon" className="w-5 cursor-pointer" onClick={handleAdditionOfNewList} />
                    <input
                        type="text"
                        className="border-none focus:outline-none focus:bg-white w-10/12 ml-5 placeholder-yellow-300 text-lg text-black"
                        placeholder="Add a task"
                        value={newListName}
                        onChange={(e) => { setNewListName(e.target.value) }}
                        onKeyDown={(e) => { e.keyCode == 13 && handleAdditionOfNewList() }}
                    />
                </div>
                <div className="flex flex-col">
                    {renderOpenTaskRows}
                </div>
                {
                    isCompletedExist &&
                    (
                        isCompletedOpen ?
                            <>
                                <div className="flex border-b py-3">
                                    <img src="/icons/arrow-top.svg" alt="Arrow top icon" className="w-5 cursor-pointer" onClick={() => setIsCompletedOpen(false)} />
                                    <span className="text-lg ml-5">Completed</span>
                                </div>
                                {renderCompletedTaskRows}
                            </>
                            :
                            <div className="flex border-b py-3">
                                <img src="/icons/arrow-right.svg" alt="Arrow top icon" className="w-5 cursor-pointer" onClick={() => setIsCompletedOpen(true)} />
                                <span className="text-lg ml-5">Completed</span>
                            </div>
                    )
                }
                <div id="empty-rows" className="h-full w-full">
                    {renderEmptyRows}
                </div >
            </div>
            {
                selectedTaskId != -1 &&
                <TaskSidebar
                    task={getSelectedTask()}
                    listId={selectedList.Id}
                    onClose={() => setSelectedTaskId(-1)}
                    onDeletion={() => { setSelectedTaskId(-1); deleteTasks(selectedList.Id, getSelectedTask().Id, router) }}
                />
            }
        </div>
    );
}
