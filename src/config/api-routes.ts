import CONFIG from "./default";

/**
 * Url endpointů v API (bez předpony).
 */
export const API_ROUTES = {
    sessions: "sessions",
    users: "users",
    todos: "todos"
}

/**
 * Url endpointů v API (kompletní cesty).
 */
export const API_FULL_ROUTES = {
    sessions: CONFIG.apiUrl + API_ROUTES.sessions,
    users: CONFIG.apiUrl + API_ROUTES.users,
    todos: CONFIG.apiUrl + API_ROUTES.todos,
    updateTodo: `${CONFIG.apiUrl}${API_ROUTES.todos}/{todoId}`,
    getTodo: `${CONFIG.apiUrl}${API_ROUTES.todos}/{todoId}`,
    deleteTodo: `${CONFIG.apiUrl}${API_ROUTES.todos}/{todoId}`,
}