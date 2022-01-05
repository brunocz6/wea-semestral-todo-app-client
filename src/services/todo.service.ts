import axios from "axios";
import { TodoItem } from "../common/interfaces/todo-item.interface";
import { API_FULL_ROUTES } from "../config";
import AuthorizationService from "./authorize.service";

class TodoService {
    /**
     * Vytvoří úkol.
     */
    create = (todo: Omit<TodoItem, "_id" | "createdAt" | "user" | "updatedAt" | "finishedAt">) => {
        return axios.post(
            API_FULL_ROUTES.todos,
            todo,
            {
                headers: AuthorizationService.getAuthHeader()
            }
        );
    };

    /**
     * Upraví úkol.
     */
    update = (todo: Omit<TodoItem, "createdAt" | "user" | "updatedAt">) => {
        return axios.put(
            API_FULL_ROUTES.updateTodo.replace("{todoId}", todo._id),
            todo,
            {
                headers: AuthorizationService.getAuthHeader()
            }
        );
    };

    /**
     * Odstraní úkol.
     */
    delete = (id: string) => {
        return axios.delete(
            API_FULL_ROUTES.deleteTodo.replace("{todoId}", id),
            {
                headers: AuthorizationService.getAuthHeader()
            }
        );
    };

    /**
     * Načte úkol s předaným Id.
     * @param id Id úkolu, který se má načíst.
     */
    get = (id: string) => {
        return axios.get(
            API_FULL_ROUTES.getTodo.replace("{todoId}", id),
            {
                headers: AuthorizationService.getAuthHeader()
            }
        ).then(res => res.data);
    };

    /**
     * Vrací všechny úkolu aktuálně přihlášeného uživatele.
     */
    getAll = () => {
        return axios.get(
            API_FULL_ROUTES.todos,
            {
                headers: AuthorizationService.getAuthHeader()
            }
        ).then(res => res.data);
    };

    /**
     * Označí úkol za dokončený nebo nedokončený (nastaví datum a čas dokončení na aktuální nebo na undefined).
     */
    changeState = (todo: TodoItem, isDone: boolean) => {
        todo.finishedAt = isDone ? new Date() : undefined;
        return this.update(todo);
    };
}

export default new TodoService();