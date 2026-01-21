import { ApiRoute } from '@/api/api-route';
import { BaseApiService } from '@/api/base-api.service';
import { inject, Injectable, signal } from '@angular/core';
import { PayloadUpdateProduct, ProductCreatedResponse, ProductData } from '@dto/product.dto';
import { ResponseAPI } from '@/api/api.model';
import { ConfirmDialogService } from '@/shared/confirm-dialog/confirm-dialog.service';
import { LangService } from '@/core/services/lang.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _baseApi = inject(BaseApiService);
  private _confirmDialog = inject(ConfirmDialogService);
  private lang = inject(LangService);

  productEdit = signal<ProductData | null>(null)

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

  async getOne(id: string) {
    const response = await this._baseApi.request<ProductData>({
      showLoad: true,
      request: {
        action: 'get',
        url: ApiRoute.product.get(id),
      }
    })
    if (response.isFailure) return null
    return response.value
  }

  async create(product: ProductData) {
    const response = await this._baseApi.request<ProductCreatedResponse>({
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

    this._products.update(products => [...products, response.value.data])

    return response.value.data
  }

  async update(payload: PayloadUpdateProduct) {

    const confirmed = await this._confirmDialog.confirmSave(this.lang._('pages.msg_confirm_update', { name: payload.name }))
    if (!confirmed) return null

    const response = await this._baseApi.request<ProductCreatedResponse>({
      catchError: true,
      showLoad: true,
      successMsg: 'messages.product_updated',
      request: {
        action: 'put',
        url: ApiRoute.product.get(payload.id),
        body: payload,
      }
    })

    if (response.isFailure) return null

    this._products.update(products => products.map(p => p.id === payload.id ? response.value.data : p))

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

  async delete(product: ProductData) {
    const confirmed = await this._confirmDialog.confirmDelete(product.name)
    if (!confirmed) return false
    const response = await this._baseApi.request<any>({
      catchError: true,
      showLoad: true,
      successMsg: 'messages.product_deleted',
      request: {
        action: 'delete',
        url: ApiRoute.product.get(product.id),
      }
    })

    if (response.isFailure) return false

    this._products.update(products => products.filter(p => p.id !== product.id))

    return true
  }
}
