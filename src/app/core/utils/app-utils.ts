export const toAwait = (ms?: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


import { BackendErrorResponse } from '@/api/api.model';
import { FormGroup } from '@angular/forms';

/**
 * Maps backend validation errors to Angular Form Controls.
 * @param form The FormGroup to update
 * @param errorResponse The JSON object received from the backend
 */
export function setBackendErrors(errorResponse: BackendErrorResponse) {
  if (!errorResponse?.errors || !Array.isArray(errorResponse.errors)) {
    return [];
  }

  let message:string[] = [];

  errorResponse.errors.forEach((error) => {
    const firstMessage = Object.values(error.constraints)[0];
    message.push(firstMessage)
  });

  return message
}