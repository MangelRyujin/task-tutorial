export interface Task{
    id: string
    title: string
    created_at: string
}

export interface TasksListProps{
    tasks?: Task[]
    onDelete: (id: string) => void;
}

export interface ChatProps{
    onCreate: (text: string) => void;
}