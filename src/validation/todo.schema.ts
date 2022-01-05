import { object, string, date } from "yup";

export const todoSchema = object({
    name: string()
        .required("Name is required")
        .max(100, "Name must be shorter than 100 chars."),
    description: string()
        .max(1000, "Description must be shorter than 1000 chars."),
    deadline: date()
});