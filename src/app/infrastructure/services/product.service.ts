import { ApiRoute } from '@/api/api-route';
import { BaseApiService } from '@/api/base-api.service';
import { inject, Injectable, signal } from '@angular/core';
import { ProductCreatedResponse, ProductData } from '@dto/product.dto';
import { ResponseAPI } from '@/api/api.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _baseApi = inject(BaseApiService);

  private _products = signal<ProductData[]>([])

  get products() {
    return this._products()
  }

  async getAll() {

    if (this.products.length) return this.products

    const response = await this._baseApi.request<ResponseAPI<ProductData[]>>({
      request: {
        action: 'get',
        url: ApiRoute.product.list,
      }
    })

    if (response.isFailure) return null

    this._products.set(response.value.data)
    return response.value.data
  }

  async create(product: ProductData) {
    const response = await this._baseApi.request<ResponseAPI<ProductCreatedResponse>>({
      catchError: true,
      showLoad: true,
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

  async existId(id: string) {
    const response = await this._baseApi.request<boolean>({
      showLoad: true,
      request: {
        action: 'get',
        url: ApiRoute.product.verifyId(id),
      }
    })
    return response.value
  }
}
