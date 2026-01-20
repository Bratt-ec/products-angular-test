import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResultApi } from './result-api';
import { HeadersApi, PerformApi } from './api.model';
import { GlobalService } from '@/core/services/global.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {

  protected http = inject(HttpClient);
  protected _global = inject(GlobalService);
  // protected _ui = inject();


  async request<T extends ResponseAPI>(params: PerformApi<T>): Promise<ResultApi<T>> {
    const { loadMsg, successMsg, showLoad, catchError, dataField } = params;

    // let loader: MatDialogRef<AppLoaderComponent> | undefined;

    // if (showLoad) loader = this._global.showLoading(loadMsg);

    try {
      const action$ = this.action(params);

      if (!action$) return ResultApi.failure<T>('NEED HTTP REQUEST');

      const response = await lastValueFrom(action$);
      if (this._global.isInvalidResponse(response)) {
        return ResultApi.failure<T>(`Invalid API Response, dont exist field: ${dataField}`);
      }

      if (successMsg) this._global.showToast(successMsg, 'success');
      return ResultApi.success<T>(response);
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
    if (data.request) {
      const { action, url, params, body, multipart } = data.request;
      let headers: HeadersApi;
      // if (multipart) headers = MULTIPART_HEADERS.headers;
      return this.http.request<T>(action, url, { params, body, headers });
    }

    return data.request$;
  }
}
