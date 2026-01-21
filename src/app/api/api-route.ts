import { environment as env } from "@env/environment";

const BASE_URL = env.apiUrl
export class ApiRoute {
    static readonly product = {
        add: `${BASE_URL}products`,
        get: (id: string) => `${BASE_URL}products/${id}`,
        list: `${BASE_URL}products`,
        verifyId: (id: string) => `${BASE_URL}products/verification/${id}`
    }

}