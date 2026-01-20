import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResultApi } from './result-api';
import { HeadersApi, PerformApi, ResponseAPI } from './api.model';
import { GlobalService } from '@/core/services/global.service';
import { lastValueFrom } from 'rxjs';
import { ToastService } from '@/shared/app-toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  protected http = inject(HttpClient);
  protected _global = inject(GlobalService);
  protected _toast = inject(ToastService);


  async request<T>(params: PerformApi<T>): Promise<ResultApi<T>> {
    const { loadMsg, successMsg, showLoad, catchError, dataField } = params;
    try {
      const action$ = this.action(params);

      if (!action$) return ResultApi.failure<T>('NEED HTTP REQUEST');

      const response = await lastValueFrom(action$);
      if (this._global.isInvalidResponse(response)) {
        return ResultApi.failure<T>(`Invalid API Response, dont exist field: ${dataField}`);
      }

      if (successMsg) this._toast.show({ message: successMsg, type: 'success' });
      return ResultApi.success<T>(response as T);
    } catch (error: unknown) {
      if (catchError) this._global.catchError(error);
      let msgError = 'API Error';
      if (error instanceof Error) {
        msgError = error.message;
      } else if (typeof error === 'string') {
        msgError = error;
      }

      return ResultApi.failure<T>(msgError);
    } finally {
      // if (loader) loader.close();
    }
  }


  protected action<T>(data: PerformApi<T>) {
    const { action, url, params, body, multipart } = data.request;
    let headers: HeadersApi;
    // if (multipart) headers = MULTIPART_HEADERS.headers;
    return this.http.request<T>(action, url, { params, body, headers });
  }
}
