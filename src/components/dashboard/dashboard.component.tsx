import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import AuthorizationService from "../../services/authorize.service";
import TodoList from "../todo-list/todo-list.component";

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: FC<DashboardProps> = ({ onLogout }) => {
    /** Callback volaný po kliknutí na tlačítko "Odhlásit" */
    const onLogoutButtonClick = () => {
        AuthorizationService
            .logout()
            .then(onLogout);
    };

    return (
        <>
            {/* Vrchní lišta */}
            <AppBar position="fixed">
                <Toolbar>
                    {/* Nadpis */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                    >
                        TodoApp
                    </Typography>
                    {/* Tlačítko pro odhlášení */}
                    <Box sx={{ display: "flex", flexDirection: "row-reverse", flexGrow: 1 }}>
                        <Button variant="contained" color="secondary" onClick={onLogoutButtonClick}>
                            Odhlásit se
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            {/* Seznam úkolů */}
            <Box sx={{ pt: 10 }}>
                <TodoList />
            </Box>
        </>
    );
}

export default Dashboard;