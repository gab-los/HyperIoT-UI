import { HttpErrorResponse } from '@angular/common/http';

/** Fields of the user form that can receive an error from the server. */
export const USER_FORM_FIELDS = ['username', 'name', 'lastname', 'email', 'password', 'passwordConfirm'] as const;
export type UserFormField = (typeof USER_FORM_FIELDS)[number];

export interface UserSaveError {
  /** Field the error belongs to; missing for errors of the whole form. */
  field?: UserFormField;
  message: string;
}

interface HyperIoTErrorBody {
  type?: string;
  errorMessages?: string[];
  validationErrors?: { field?: string; message?: string }[];
}

const DUPLICATE_ENTITY = 'it.acsoftware.hyperiot.base.exception.HyperIoTDuplicateEntityException';
const VALIDATION = 'it.acsoftware.hyperiot.base.exception.HyperIoTValidationException';

/** Maps a server field name (e.g. `huser-username`, `lastName`) to a form field. */
function toFormField(serverField: string | undefined): UserFormField | undefined {
  const name = (serverField ?? '').replace(/^huser-/i, '').toLowerCase();
  return USER_FORM_FIELDS.find(field => field.toLowerCase() === name);
}

/** Turns the error of a create or update call into messages for the form. */
export function parseUserSaveError(error: unknown): UserSaveError[] {
  const body = (error instanceof HttpErrorResponse ? error.error : null) as HyperIoTErrorBody | null;

  if (body?.type === DUPLICATE_ENTITY) {
    const field = toFormField(body.errorMessages?.[0]);
    return [{ field, message: $localize`:@@HYT_duplicate_entity:Already in use` }];
  }

  if (body?.type === VALIDATION && Array.isArray(body.validationErrors) && body.validationErrors.length > 0) {
    return body.validationErrors.map(validationError => ({
      field: toFormField(validationError.field),
      message: validationError.message || $localize`:@@HYT_pattern_error_default_message:Invalid input`,
    }));
  }

  return [{ message: $localize`:@@HYT_unknown_error:Error executing your request` }];
}
