import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import { FC, useCallback } from "react";
import { TodoItem } from "../../common/interfaces/todo-item.interface";
import TodoService from "../../services/todo.service";

interface TodoRemoveDialogProps {
    item: TodoItem | null,
    isOpenned: boolean;
    onAbortHandler: (item: TodoItem) => void;
    onSuccessHandler: (item: TodoItem) => void;
}

const TodoRemoveDialog: FC<TodoRemoveDialogProps> = ({ item, isOpenned, onAbortHandler, onSuccessHandler }) => {
    /** Callback volaný po kliknutí na "Nemazat" */
    const onCancelButtonClickedHandler = useCallback(() => {
        if (!!item) {
            onAbortHandler(item);
        }
    }, [item, onAbortHandler]);

    /** Callback volaný po kliknutí na "Smazat úkol" */
    const onRemoveButtonClickedHandler = useCallback(() => {
        if (!!item) {
            // Smažu úkol
            TodoService.delete(item._id)
                // pak skryju okno
                .then(() => {
                    onSuccessHandler(item);
                });
        }
    }, [item, onSuccessHandler]);

    return (
        <Dialog open={isOpenned}>
            <DialogTitle>
                Opravdu si přejete smazat úkol?
            </DialogTitle>
            <DialogContent>
                <Typography>
                    Kliknutím na tlačítko "Smazat úkol" provedete smazání. Opak provedete kliknutím na tlačítko "Nemazat".
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancelButtonClickedHandler}>Nemazat</Button>
                <Button onClick={onRemoveButtonClickedHandler}>Smazat úkol</Button>
            </DialogActions>
        </Dialog >
    );
}

export default TodoRemoveDialog;