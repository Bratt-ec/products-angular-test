import { BaseApiService } from '@/api/base-api.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _baseApi = inject(BaseApiService);

  getAll(){}
}
