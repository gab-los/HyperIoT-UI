import { HttpErrorResponse } from '@angular/common/http';

export interface SaveError<F extends string> {
  /** Field the error belongs to; missing for errors of the whole form. */
  field?: F;
  message: string;
}

interface HyperIoTErrorBody {
  type?: string;
  errorMessages?: string[];
  validationErrors?: { field?: string; message?: string }[];
}

const DUPLICATE_ENTITY = 'it.acsoftware.hyperiot.base.exception.HyperIoTDuplicateEntityException';
const VALIDATION = 'it.acsoftware.hyperiot.base.exception.HyperIoTValidationException';

/** Maps a server field name (e.g. `huser-username`, `lastName`) to one of the form fields. */
function toFormField<F extends string>(serverField: string | undefined, fields: readonly F[]): F | undefined {
  const name = (serverField ?? '').replace(/^[a-z]+-/i, '').toLowerCase();
  return fields.find(field => field.toLowerCase() === name);
}

/**
 * Turns the error of a save call into messages for a form: duplicates and validation errors
 * of the HyperIoT back end go to their field when the form has it.
 */
export function parseSaveError<F extends string>(error: unknown, fields: readonly F[]): SaveError<F>[] {
  const body = (error instanceof HttpErrorResponse ? error.error : null) as HyperIoTErrorBody | null;

  if (body?.type === DUPLICATE_ENTITY) {
    return [{ field: toFormField(body.errorMessages?.[0], fields), message: $localize`:@@HYT_duplicate_entity:Already in use` }];
  }

  if (body?.type === VALIDATION && Array.isArray(body.validationErrors) && body.validationErrors.length > 0) {
    return body.validationErrors.map(validationError => ({
      field: toFormField(validationError.field, fields),
      message: validationError.message || $localize`:@@HYT_pattern_error_default_message:Invalid input`,
    }));
  }

  return [{ message: $localize`:@@HYT_unknown_error:Error executing your request` }];
}
