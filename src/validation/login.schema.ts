import { object, string } from "yup";

export const loginSchema = object({
    password: string()
        .required("Password is required")
        .min(6, "Password is too short - should be 6 chars minimum")
        .matches(/^[a-zA-A0-9_.-]*$/, "Password can only contain Latin letters.")
        .nullable(),
    email: string()
        .required("Email is required")
        .email("Must be a valid email")
        .nullable()
});