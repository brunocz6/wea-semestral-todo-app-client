import { object, string, ref } from "yup";

export const registerValidationSchema = object().shape({
    name: string().required("Name is required"),
    password: string()
        .required("Password is required")
        .min(6, "Password is too short - should be 6 chars minimum.")
        .matches(/^[a-zA-A0-9_.-]*$/, "Password can only contain Latin letters.")
        .nullable(),
    passwordConfirmation: string()
        .oneOf(
            [ref("password"), null],
            "Passwords must match"
        )
        .nullable(),
    email: string()
        .email("Must be a valid e-mail.")
        .required("Email is required")
        .nullable()
});