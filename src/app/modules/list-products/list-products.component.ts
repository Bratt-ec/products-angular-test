import { AppRoutes } from '@/core/utils/app-routes';
import { ProductData } from '@/infrastructure/dto/product.dto';
import { ProductService } from '@/infrastructure/services/product.service';
import { DatatableComponent } from '@/shared/datatable/datatable.component';
import { ColumnData } from '@/shared/datatable/datatable.model';
import { TranslatePipe } from '@/shared/pipes/translate.pipe';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-products',
  imports: [DatatableComponent, TranslatePipe],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {

  private router = inject(Router);
  private _product = inject(ProductService);

  products: ProductData[] = [];

  columns: ColumnData[] = [
    { data: 'logo', label: 'labels.logo', width: 100 },
    { data: 'id', label: 'labels.id' },
    { data: 'name', label: 'labels.name_product' },
    { data: 'description', label: 'labels.description' },
    { data: 'date_revision', label: 'labels.review_date' },
    { data: 'date_release', label: 'labels.release_date' },
  ];

  constructor(
  ) {
    this.getList();
  }

  async getList() {
    const response = await this._product.getAll()
    if (!response) return
    this.products = response
  }

  addProduct() {
    this.router.navigate([AppRoutes.add_product]);
  }
}
