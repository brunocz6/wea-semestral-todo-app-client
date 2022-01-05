/**
 * Rozhraní definující položku k dokončení.
 */
export interface TodoItem {
    _id: string;
    user: string;
    name: string;
    description: string | undefined;
    createdAt: Date;
    updatedAt: Date;
    finishedAt: Date | undefined;
    deadline: Date | undefined;
}