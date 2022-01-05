import { Add, FilterAlt, FilterAltOff } from "@mui/icons-material";
import { Container, IconButton, List, Paper, Stack, TextField, Typography } from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { TodoItem } from "../../common/interfaces/todo-item.interface";
import TodoEditor from "../todo-editor/todo-editor.component";
import TodoListItem from "./todo-list-item-component";
import TodoService from "../../services/todo.service";
import TodoRemoveDialog from "./todo-remove-dialog.component";
import { useDebounce } from "../../hooks/use-debounce.hook";

interface TodoListProps {

}

const TodoList: FC<TodoListProps> = (props) => {
    // Hledaný výraz.
    const [searchTerm, setSearchTerm] = useState<string>("");
    const searchTermDebounced = useDebounce(searchTerm, 150);

    // Příznak, zda-li se mají zobrazovat jen hotové úkoly.
    const [showOnlyUndone, setShowOnlyUndone] = useState<boolean>(false);

    // Příznak, zda-li je editor úkolu otevřen.
    const [todoEditorOpened, setTodoEditorOpened] = useState<boolean>(false);

    // Příznak, zda-li je dialog pro smazání úkolu otevřený.
    const [todoRemoveDialogOpenned, setTodoRemoveDialogOpenned] = useState<boolean>(false);

    // Úkol, který je aktuálně využíván (editován / mazán).
    const [currentTodoItem, setCurrentTodoItem] = useState<TodoItem | null>(null);

    const [todos, setTodos] = useState<TodoItem[]>([]);

    /** Callback volaný při hledaného výrazu */
    const searchTermOnChangeHandler = useCallback((ev) => {
        setSearchTerm(ev.target.value);
    }, [setSearchTerm]);

    /** Callback volaný při kliknutí na tlačítko pro přepnutí filtru */
    const onFilterToggleHandler = useCallback(() => {
        setShowOnlyUndone(!showOnlyUndone);
    }, [setShowOnlyUndone, showOnlyUndone]);

    /** Callback volaný po kliknutí na tlačítko pro přidání úkolu */
    const onAddButtonClickedHandler = useCallback(() => {
        setTodoEditorOpened(true);
    }, [setTodoEditorOpened]);

    /** Callback volaný po uzavření editoru úkolu */
    const onTodoEditorClosedHandler = useCallback(() => {
        setTodoEditorOpened(false);
        setCurrentTodoItem(null);
    }, [setTodoEditorOpened, setCurrentTodoItem]);

    const onTodoEditorSuccessHandler = useCallback(() => {
        setTodoEditorOpened(false);
        setCurrentTodoItem(null);
        refreshTodos();
    }, [setTodoEditorOpened, setCurrentTodoItem]);

    const onTodoEditorOpennedHandler = useCallback((item: TodoItem) => {
        setCurrentTodoItem(item);
        setTodoEditorOpened(true);
    }, [setCurrentTodoItem, setTodoEditorOpened]);

    const onTodoRemoveDialogAbortHandler = useCallback(() => {
        setTodoRemoveDialogOpenned(false);
        setCurrentTodoItem(null);
    }, [setTodoRemoveDialogOpenned, setCurrentTodoItem]);

    const onTodoRemoveDialogSuccessHandler = useCallback(() => {
        setTodoRemoveDialogOpenned(false);
        setCurrentTodoItem(null);
        refreshTodos();
    }, [setTodoRemoveDialogOpenned]);

    const onTodoRemoveDialogOpennedHandler = useCallback((item: TodoItem) => {
        setCurrentTodoItem(item);
        setTodoRemoveDialogOpenned(true);
    }, [setCurrentTodoItem, setTodoRemoveDialogOpenned]);

    /** Načte všechny úkoly uživatele */
    const refreshTodos = async () => {
        const todosRes = await TodoService.getAll();
        setTodos(todosRes);
    };

    // Při prvním renderu komponenty načtu úkoly.
    useEffect(() => {
        refreshTodos();
    }, []);

    /** Callback volaný po změně zaškrnutí */
    const onIsDoneChangedHandler = useCallback((item: TodoItem, isDone: boolean) => {
        TodoService
            .changeState(item, isDone)
            .then(refreshTodos);
    }, []);

    // Seznam úkolů pro render.
    const todosMemo = useMemo(() => {
        return todos
            .filter(t =>
                (!showOnlyUndone || !t.finishedAt) &&
                (t.name.indexOf(searchTermDebounced) > -1 || (t.description && t.description.indexOf(searchTermDebounced) > -1))
            )
            .map(t => <TodoListItem item={t} onIsDoneChangedHandler={onIsDoneChangedHandler} onEditButtonClickedHandler={onTodoEditorOpennedHandler} onRemoveButtonClickedHandler={onTodoRemoveDialogOpennedHandler} />);
    }, [todos, searchTermDebounced, showOnlyUndone, onIsDoneChangedHandler, onTodoEditorOpennedHandler, onTodoRemoveDialogOpennedHandler]);

    return (
        <>
            <TodoRemoveDialog isOpenned={todoRemoveDialogOpenned} item={currentTodoItem} onAbortHandler={onTodoRemoveDialogAbortHandler} onSuccessHandler={onTodoRemoveDialogSuccessHandler} />
            <TodoEditor open={todoEditorOpened} onClose={onTodoEditorClosedHandler} item={currentTodoItem} onSuccess={onTodoEditorSuccessHandler} />
            <Container maxWidth="sm" sx={{ p: 0 }}>
                <Paper elevation={3}>
                    <Stack sx={{ p: 1, maxHeight: "80vh" }}>
                        {/* Vyhledávání */}
                        <Stack direction="row">
                            <TextField value={searchTerm} onChange={searchTermOnChangeHandler} placeholder="Zadejte hledaný výraz" fullWidth />
                            <IconButton color="primary" onClick={onFilterToggleHandler}>
                                {showOnlyUndone
                                    ? <FilterAltOff />
                                    : <FilterAlt />
                                }
                            </IconButton>
                            <IconButton color="primary" onClick={onAddButtonClickedHandler}>
                                <Add />
                            </IconButton>
                        </Stack>
                        {/* Seznam úkolů */}
                        {todos.length > 0
                            ?
                            <List sx={{ overflowY: "auto" }}>
                                {todosMemo}
                            </List >
                            :
                            <Typography variant="caption" sx={{ pt: 1, textAlign: "center" }}>Aktuálně nemáte žádné úkoly</Typography>
                        }
                    </Stack>
                </Paper>
            </Container>
        </>
    );
}

export default TodoList;