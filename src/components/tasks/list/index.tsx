import {Alert, Button} from "@heroui/react"
import { RiDeleteBin2Fill } from "react-icons/ri";
import { TasksListProps } from "../types";

export default function TasksList({tasks, onDelete}:TasksListProps){
    
    return(
        <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-3 gap-3 mb-20">
            {tasks?.map((task,index)=>(
                <Alert
                key={index}
                hideIcon
                description={task.created_at}
                endContent={
                <Button onClick={()=> {onDelete(task.id)}} color="danger" size="sm" isIconOnly variant="flat">
                    <RiDeleteBin2Fill size={18}/>
                </Button>
                }
                title={task.title}
                variant="faded"
            />
            ))}
            
        </div>
    )
}