import { environment as env } from "@env/environment";

export class ApiRoute {
    public static readonly PRODUCTS = `${env.apiUrl}products`;
    public static readonly CREATE_PRODUCT = `${env.apiUrl}products`;
    public static readonly UPDATE_PRODUCT = (id: string) => `${env.apiUrl}products/${id}`;
    public static readonly DELETE_PRODUCT = (id: string) => `${env.apiUrl}products/${id}`;
    public static readonly GET_PRODUCT = (id: string) => `${env.apiUrl}products/${id}`;
}