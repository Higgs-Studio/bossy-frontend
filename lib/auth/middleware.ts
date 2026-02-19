import { z } from 'zod';

export type ActionState = {
  error?: string;
  errorCode?: string;
  success?: string;
  successCode?: string;
  [key: string]: any;
};

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData) => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      // We treat Zod messages as i18n-friendly "error codes" for UI.
      return { errorCode: result.error.errors[0].message };
    }

    return action(result.data, formData);
  };
}
