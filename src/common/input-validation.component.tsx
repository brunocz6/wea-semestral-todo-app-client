import { Typography } from "@mui/material";
import { FC } from "react";

/** Parametry komponenty validace textového pole */
interface InputValidationProps {
    /** Objekt s výsledky validace. */
    errors: any,
    /** Klíč, pod kterým jsou uloženy výsledky validace. */
    fieldKey: string,
    /** Hodnota, který neprošla validací. */
    value: string | null | undefined
}

/**
 * Komponenta - validace textového pole.
 */
const InputValidation: FC<InputValidationProps> = ({ errors, fieldKey, value }) => {
    const errorsToShow = errors[fieldKey];

    if (value === null || !errorsToShow || errorsToShow.length === 0) {
        return <></>
    }

    return errorsToShow.map((e: string, i: number) => (
        <Typography sx={{ color: theme => theme.palette.error.main }} variant="caption" key={i}>{e}</Typography>
    ));
};

InputValidation.displayName = "InputValidationComponent";
export default InputValidation;