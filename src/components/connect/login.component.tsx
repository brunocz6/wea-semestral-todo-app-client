import { Person } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Avatar, Box, Container, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import InputValidation from "../../common/input-validation.component";
import { useDebounce } from "../../hooks/use-debounce.hook";
import { useValidation } from "../../hooks/use-validation.hook";
import { loginSchema } from "../../validation/login.schema";
import AuthorizationService from "../../services/authorize.service";

interface LoginProps {
    onSuccess: () => void;
}

/**
 * Komponenta - formulář pro přihlášení uživatele.
 */
const Login: FC<LoginProps> = ({ onSuccess }) => {
    // E-mail
    const [email, setEmail] = useState<string | null>(null);
    const emailDebounced = useDebounce(email, 1000);

    // Heslo
    const [password, setPassword] = useState<string | null>(null);
    const passwordDebounced = useDebounce(password, 1000);

    // Značí, zda-li formulář čeká na odpověď od serveru.
    const [isWaitingForServer, setIsWaitingForServer] = useState<boolean>(false);

    // Značí, zda-li se má zobrazit chybová hláška o neúspěšném přihlášení.
    const [showLoginFailedError, setShowLoginFailedError] = useState<boolean>(false);

    // Objekt pro validační knihovnu yup reprezentující data formuláře.
    const validatableForm = useMemo(() => ({
        email: emailDebounced,
        password: passwordDebounced,
    }), [emailDebounced, passwordDebounced]);

    const [isValid, validationErrors] = useValidation({
        schema: loginSchema,
        object: validatableForm
    });

    /** Callback volaný při změně e-mailu */
    const emailOnChangeHandler = useCallback((ev) => {
        setEmail(ev.target.value);
    }, [setEmail]);

    /** Callback volaný při změne hesla */
    const passwordOnChangeHandler = useCallback((ev) => {
        setPassword(ev.target.value);
    }, [setPassword]);

    /** Callback volaný při potvrzení formuláře */
    const onSubmitHandler = useCallback(() => {
        if (isValid) {
            setIsWaitingForServer(true);

            AuthorizationService
                .login(emailDebounced as string, passwordDebounced as string)
                .then(
                    () => {
                        setIsWaitingForServer(false);
                        onSuccess();
                    },
                    err => {
                        setIsWaitingForServer(false);
                        setShowLoginFailedError(true);
                    }
                );
        }
    }, [isValid, emailDebounced, onSuccess, passwordDebounced]);

    return (
        <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Container maxWidth="sm" >
                <Paper elevation={10}>
                    <Stack sx={{ p: 1, alignItems: "center" }}>
                        {/* Nadpis */}
                        <Avatar>
                            <Person />
                        </Avatar>
                        <Typography variant="h5" sx={{ p: 1 }}>
                            Přihlášení
                        </Typography>

                        {/* E-mail */}
                        <TextField value={email} onChange={emailOnChangeHandler} label="E-mail" fullWidth sx={{ mb: 1 }} />
                        <InputValidation errors={validationErrors} fieldKey="email" value={emailDebounced} />

                        {/* Heslo */}
                        <TextField type="password" value={password} onChange={passwordOnChangeHandler} label="Heslo" fullWidth sx={{ mb: 1 }} />
                        <InputValidation errors={validationErrors} fieldKey="password" value={password} />

                        {/* Registrace */}
                        <Typography variant="subtitle2" sx={{ alignSelf: "start", mb: 1 }}>
                            Stále ještě nemáte učet?&nbsp;
                            <Link to="/register">
                                Registrujte se
                            </Link>
                            &nbsp;nyní!
                        </Typography>

                        {/* Potvrzení formuláře */}
                        <LoadingButton onClick={onSubmitHandler} variant="contained" fullWidth loading={isWaitingForServer}>Přihlásit</LoadingButton>

                        {/* Hláška o selhání přihlášení */}
                        <Snackbar open={showLoginFailedError} autoHideDuration={5000}>
                            <Alert severity="error" sx={{ width: '100%' }}>
                                Přihlášení se nezdařilo.
                            </Alert>
                        </Snackbar>
                    </Stack>
                </Paper>
            </Container>

        </Box>
    );
}

Login.displayName = "LoginComponent";
export default Login;