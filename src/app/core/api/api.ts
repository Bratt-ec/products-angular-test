import { environment } from "@env/environment";

const BASE_URL = environment.apiUrl
export class Api {
    static readonly product = {
        add: `${BASE_URL}/products/create`,
        get:  (id:string) => `${BASE_URL}/products/${id}`,
        list: `${BASE_URL}/products`
    }
}