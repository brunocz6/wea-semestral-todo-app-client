import { Close } from "@mui/icons-material";
import { DateTimePicker } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { TodoItem } from "../../common/interfaces/todo-item.interface";
import { useDebounce } from "../../hooks/use-debounce.hook";
import { useValidation } from "../../hooks/use-validation.hook";
import { todoSchema } from "../../validation/todo.schema";
import TodoService from "../../services/todo.service";
import InputValidation from "../../common/input-validation.component";
import { useEffect } from "react";

interface TodoEditorProps {
    item: TodoItem | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const TodoEditor: FC<TodoEditorProps> = ({ item, open, onClose, onSuccess }) => {
    // Název
    const [name, setName] = useState<string | null>(null);
    const nameDebounced = useDebounce(name, 1000);

    // Popis
    const [description, setDescription] = useState<string | null>(null);
    const descriptionDebounced = useDebounce(description, 1000);

    // Max. datum dokončení
    const [deadline, setDeadline] = useState<Date | undefined>();

    // Objekt pro validační knihovnu yup reprezentující data formuláře.
    const formData = useMemo(() => ({
        _id: item?._id,
        name: nameDebounced,
        description: descriptionDebounced,
        deadline
    }), [item, nameDebounced, descriptionDebounced, deadline]);

    const [isValid, validationErrors] = useValidation({
        schema: todoSchema,
        object: formData
    });

    /** Callback volaný při změně názvu */
    const nameOnChangeHandler = useCallback((ev) => {
        setName(ev.target.value);
    }, [setName]);

    /** Callback volaný při změně popisku */
    const descriptionOnChangeHandler = useCallback((ev) => {
        setDescription(ev.target.value);
    }, [setDescription]);

    /** Callback volaný při změně max. datumu dokončení */
    const deadlineOnChangeHandler = useCallback((value) => {
        setDeadline(value);
    }, [setDeadline]);

    /** Callback volaný při potvrzení formuláře */
    const onSubmitHandler = useCallback(() => {
        const save = async () => {
            if (!item) {
                await TodoService.create(formData as TodoItem);
            }
            else {
                await TodoService.update(formData as TodoItem);
            }
        };

        if (isValid) {
            save().then(() => {
                // Zavolám callback po úspěšném uložení změn z okna.
                onSuccess();

                // Vyčistím hodnoty okna.
                setName(null);
                setDescription(null);
                setDeadline(undefined);
            });
        }
    }, [isValid, formData, onSuccess, item]);

    // Po změně zvoleného úkolu.
    useEffect(() => {
        setName(item?.name || null);
        setDescription(item?.description || null);

        if (!!item && !!item.deadline) {
            setDeadline(new Date(item.deadline));
        }
        else {
            setDeadline(undefined);
        }
    }, [item]);

    return (
        <Dialog open={open}>
            {/* Nadpis okna */}
            <DialogTitle>
                {!!item ? "Upravit úkol" : "Přidat úkol"}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            {/* Obsah okna */}
            <DialogContent>
                {/* Název */}
                <TextField value={name} onChange={nameOnChangeHandler} label="Název" fullWidth sx={{ mt: 1, mb: 1 }} />
                <InputValidation errors={validationErrors} fieldKey="name" value={nameDebounced} />
                {/* Popis */}
                <TextField value={description} onChange={descriptionOnChangeHandler} label="Popis" fullWidth sx={{ mt: 1, mb: 1 }} />
                <InputValidation errors={validationErrors} fieldKey="description" value={descriptionDebounced} />
                {/* Max. datum dokončení */}
                <DateTimePicker
                    label="Max. datum dokončení"
                    value={deadline}
                    onChange={deadlineOnChangeHandler}
                    renderInput={(params) => <TextField {...params}
                        fullWidth
                        sx={{ mt: 1, mb: 1 }} />}
                />
                <InputValidation errors={validationErrors} fieldKey="deadline" value={deadline?.toString()} />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="error" onClick={onClose} fullWidth>Zahodit změny</Button>
                <Button variant="contained" color="success" onClick={onSubmitHandler} fullWidth>Uložit</Button>
            </DialogActions>
        </Dialog>
    );
}

export default TodoEditor;