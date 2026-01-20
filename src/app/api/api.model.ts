import { HttpHeaders, HttpParams } from "@angular/common/http";

export type ApiParamsHTTP = HttpParams | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;


export type PerformApi<T> = {
    loadMsg?: string;
    /** Must be a key of lang.json */
    successMsg?: string;
    showLoad?: boolean;
    catchError?: boolean;
    dataField?: any;
    request: RequestApi;
};

export type ActionsHTTP = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type RequestApi = {
    action: ActionsHTTP;
    url: string;
    params?: ApiParamsHTTP;
    body?: unknown;
    multipart?: boolean;
};

export type HeadersApi = HttpHeaders | Record<string, string | string[]> | undefined;


export type ResponseAPI<TParam> = {
    data: TParam;
};


export type ErrorApi = {
    name: string;
    message: string;
    stack: string;
}