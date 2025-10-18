export interface Task{
    id: string
    title: string
    created_at: string
}

export interface TasksListProps{
    tasks?: Task[]
    onDelete: (id: string) => void;
}