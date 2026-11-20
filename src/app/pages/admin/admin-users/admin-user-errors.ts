import { SaveError, parseSaveError } from '../admin-save-errors';

/** Fields of the user form that can receive an error from the server. */
export const USER_FORM_FIELDS = ['username', 'name', 'lastname', 'email', 'password', 'passwordConfirm'] as const;
export type UserFormField = (typeof USER_FORM_FIELDS)[number];

export type UserSaveError = SaveError<UserFormField>;

/** Turns the error of a create or update call into messages for the user form. */
export function parseUserSaveError(error: unknown): UserSaveError[] {
  return parseSaveError(error, USER_FORM_FIELDS);
}
