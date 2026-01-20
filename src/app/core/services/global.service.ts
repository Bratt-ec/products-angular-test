import { ToastService } from '@/shared/app-toast/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private _toast = inject(ToastService)
  private lang = inject(LangService)

  /**
   * Checks if the API response is invalid.
   *
   * @param {any} response - The API response.
   * @return {boolean} Returns true if the response is a success, otherwise false.
   */
  isInvalidResponse(response: any): boolean {

    if (response.error) throw response.error;

    // if (response.value !== ApiSuccess) {
    //   return true;
    // }

    return false;
  }

  catchError(catchErr: HttpErrorResponse | unknown) {
    if (catchErr instanceof HttpErrorResponse) {
      if (catchErr.error) {
        // ui catch error
        this._toast.show({
          message: catchErr.error.message,
          type: 'error'
        });
        return
      }
    }

    this._toast.show({
      message: this.lang._('messages.error_global'),
      type: 'error'
    });
  }

}
