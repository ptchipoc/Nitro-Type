import { useMutation } from "@tanstack/react-query";
import { registerAction } from "../actions/register.action";

export const useRegister = () => {
    return useMutation({
        mutationFn: registerAction,
        onSuccess: (data) => {
            // Handle successful registration, e.g., show a success message or redirect
        }
    });


}