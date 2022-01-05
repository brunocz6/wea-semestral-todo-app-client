import { Person } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Avatar, Box, Container, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputValidation from "../../common/input-validation.component";
import { useDebounce } from "../../hooks/use-debounce.hook";
import { useValidation } from "../../hooks/use-validation.hook";
import AuthorizationService from "../../services/authorize.service";
import { registerValidationSchema } from "../../validation/register.schema";

interface RegisterProps {

}

/**
 * Komponenta - formulář pro registraci uživatele.
 */
const Register: FC<RegisterProps> = (props) => {
    /** Metoda pro změnu stránky. */
    const navigate = useNavigate();

    // Jméno uživatele
    const [name, setName] = useState<string | null>(null);
    const nameDebounced = useDebounce(name, 1000);

    // E-mail uživatele (používá se pro přihlšení)
    const [email, setEmail] = useState<string | null>(null);
    const emailDebounced = useDebounce(email, 1000);

    // Heslo
    const [password, setPassword] = useState<string | null>(null);
    const passwordDebounced = useDebounce(password, 1000);

    // Potvrzení hesla
    const [passwordConfirmation, setPasswordConfirmation] = useState<string | null>(null);
    const passwordConfirmationDebounced = useDebounce(passwordConfirmation, 1000);

    // Značí, zda-li se formulář čeká na odpověď serveru.
    const [isWaitingForServer, setIsWaitingForServer] = useState<boolean>(false);

    // Značí, zda-li se má zobrazit hláška o úspěchu registrace.
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    // Značí, zda-li se má zobrazit hláška o selhání registrace.
    const [showError, setShowError] = useState<boolean>(false);

    // Objekt pro validační knihovnu yup reprezentující data formuláře.
    const validatableForm = useMemo(() => ({
        name: nameDebounced,
        email: emailDebounced,
        password: passwordDebounced,
        passwordConfirmation: passwordConfirmationDebounced
    }), [nameDebounced, emailDebounced, passwordDebounced, passwordConfirmationDebounced]);

    const [isValid, validationErrors] = useValidation({
        schema: registerValidationSchema,
        object: validatableForm
    });

    /** Callback volaný při změně jména */
    const nameOnChangeHandler = useCallback((ev) => {
        setName(ev.target.value);
    }, [setName]);

    /** Callback volaný při změně e-mailu */
    const emailOnChangeHandler = useCallback((ev) => {
        setEmail(ev.target.value);
    }, [setEmail]);

    /** Callback volaný při změne hesla */
    const passwordOnChangeHandler = useCallback((ev) => {
        setPassword(ev.target.value);
    }, [setPassword]);

    /** Callback volaný při změne hesla */
    const passwordConfirmationOnChangeHandler = useCallback((ev) => {
        setPasswordConfirmation(ev.target.value);
    }, [setPasswordConfirmation]);

    /** Pokusí se o registraci uživatele */
    const onSubmitHandler = useCallback(() => {
        if (isValid) {
            // Nastavím, že formulář čeká na odpověď od serveru.
            setIsWaitingForServer(true);

            // Pokusím se o API call - registrace.
            AuthorizationService
                .register(nameDebounced as string, emailDebounced as string, passwordDebounced as string, passwordConfirmationDebounced as string)
                .then(
                    res => {

                        if (res.status === 200) {
                            setShowSuccess(true);
                        }
                    },
                    err => {
                        setIsWaitingForServer(false);
                        setShowError(true);
                    }
                );
        }
    }, [isValid, validationErrors, nameDebounced, emailDebounced, passwordDebounced, passwordConfirmationDebounced]);

    /** Callback volaný po úspěšné registraci (zavolá se po schování hlášky o úspěchu) */
    const afterSuccess = useCallback(() => {
        setShowSuccess(false);
        navigate("/login");
    }, [setShowSuccess, navigate]);

    /** Callback volaný po selhání registrace (zavolá se po schování hlášky o selhání) */
    const afterFail = useCallback(() => {
        setShowError(false);
    }, [setShowError]);

    return (
        <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Container maxWidth="sm">
                <Paper elevation={10}>
                    <Stack sx={{ p: 1, alignItems: "center" }}>
                        {/* Nadpis */}
                        <Avatar>
                            <Person />
                        </Avatar>
                        <Typography variant="h5" sx={{ p: 1 }}>
                            Registrace
                        </Typography>

                        {/* E-mail */}
                        <TextField value={email} onChange={emailOnChangeHandler} label="E-mail" fullWidth sx={{ mb: 1 }} />
                        <InputValidation errors={validationErrors} fieldKey="email" value={emailDebounced} />

                        {/* Jméno */}
                        <TextField value={name} onChange={nameOnChangeHandler} label="Vaše jméno" fullWidth sx={{ mb: 1 }} />
                        <InputValidation errors={validationErrors} fieldKey="name" value={nameDebounced} />

                        {/* Heslo */}
                        <TextField type="password" value={password} onChange={passwordOnChangeHandler} label="Heslo" fullWidth sx={{ mb: 1 }} />
                        <InputValidation errors={validationErrors} fieldKey="password" value={passwordDebounced} />

                        {/* Potvrzení hesla */}
                        <TextField type="password" value={passwordConfirmation} onChange={passwordConfirmationOnChangeHandler} label="Potvrzení hesla" fullWidth sx={{ mb: 1 }} />
                        <InputValidation errors={validationErrors} fieldKey="passwordConfirmation" value={passwordConfirmationDebounced} />

                        <Typography variant="subtitle2" sx={{ alignSelf: "start", mb: 1 }}>
                            Již máte účet?&nbsp;
                            <Link to="/login">
                                Přihlašte se
                            </Link>
                            .
                        </Typography>

                        {/* Potvrzení formuláře */}
                        <LoadingButton onClick={onSubmitHandler} variant="contained" loading={isWaitingForServer} fullWidth>Registrovat</LoadingButton>

                        {/* Hláška o úspěšné registraci */}
                        <Snackbar open={showSuccess} autoHideDuration={2000} onClose={afterSuccess}>
                            <Alert onClose={afterSuccess} severity="success" sx={{ width: '100%' }}>
                                Registrace proběhla úspěšně.
                            </Alert>
                        </Snackbar>

                        {/* Hláška o selhání registrace */}
                        <Snackbar open={showError} autoHideDuration={5000} onClose={afterFail}>
                            <Alert onClose={afterFail} severity="error" sx={{ width: '100%' }}>
                                Registrace se nezdařila, zkontrolujte zadané údaje a zkuste to znovu.
                            </Alert>
                        </Snackbar>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}

Register.displayName = "RegisterComponent";
export default Register;