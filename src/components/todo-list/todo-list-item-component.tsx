import { Edit, Delete } from "@mui/icons-material";
import { ListItem, Stack, IconButton, ListItemButton, ListItemIcon, Checkbox, ListItemText, Typography } from "@mui/material";
import moment from "moment";
import { FC } from "react";
import { TodoItem } from "../../common/interfaces/todo-item.interface";

interface TodoItemProps {
    item: TodoItem;
    onIsDoneChangedHandler: (item: TodoItem, isChecked: boolean) => void;
    onEditButtonClickedHandler: (item: TodoItem) => void;
    onRemoveButtonClickedHandler: (item: TodoItem) => void;
}

const TodoListItem: FC<TodoItemProps> = ({ item, onIsDoneChangedHandler, onEditButtonClickedHandler, onRemoveButtonClickedHandler }) => {
    /** Callback volaný kliknutí na položku */
    const toggleHandler = () => {
        onIsDoneChangedHandler(item, !item.finishedAt);
    };

    return (
        <ListItem
            key={item._id}
            // Další akce úkolu - editace, smazání
            secondaryAction={
                <Stack direction="row">
                    {/* Editace */}
                    <IconButton onClick={() => onEditButtonClickedHandler(item)}>
                        <Edit />
                    </IconButton>
                    {/* Smazání */}
                    <IconButton onClick={() => onRemoveButtonClickedHandler(item)}>
                        <Delete />
                    </IconButton>
                </Stack>
            }
            disablePadding
        >
            {/* Zaškrtnutí úkolu */}
            <ListItemButton onClick={toggleHandler}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={!!item.finishedAt}
                        disableRipple
                    />
                </ListItemIcon>
                {/* Název úkolu */}
                <ListItemText
                    primary={item.name}
                    secondary={
                        <>
                            {!!item.deadline &&
                                <Typography variant="subtitle2" sx={{ fontSize: "10pt" }}>{moment(item.deadline).format("MMMM Do YYYY, h:mm:ss a")}</Typography>
                            }
                            <Typography variant="subtitle1" sx={{ fontSize: "10pt" }}>{item.description}</Typography>
                        </>
                    }
                    sx={{ paddingRight: 7, wordBreak: "break-all" }}
                />
            </ListItemButton>
        </ListItem>
    );
}

export default TodoListItem;