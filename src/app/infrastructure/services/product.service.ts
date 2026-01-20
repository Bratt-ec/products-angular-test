import { ApiRoute } from '@/api/api-route';
import { BaseApiService } from '@/api/base-api.service';
import { inject, Injectable } from '@angular/core';
import { ProductData } from '../dto/product.dto';
import { ResponseAPI } from '@/api/api.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _baseApi = inject(BaseApiService);

  async getAll() {
    const response = await this._baseApi.request<ResponseAPI<ProductData[]>>({
      request: {
        action: 'get',
        url: ApiRoute.product.list,
      }
    })

    if (response.isFailure) return null

    return response.value.data
  }

  async create(product: ProductData) {
    const response = await this._baseApi.request<ResponseAPI<ProductData>>({
      catchError: true,
      successMsg: 'messages.product_created',
      request: {
        action: 'post',
        url: ApiRoute.product.add,
        body: product,
      }
    })

    if (response.isFailure) return null

    return response.value.data
  }
}
