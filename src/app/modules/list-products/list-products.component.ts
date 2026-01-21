import { AppRoutes } from '@/core/utils/app-routes';
import { ProductData } from '@/infrastructure/dto/product.dto';
import { ProductService } from '@/infrastructure/services/product.service';
import { DatatableComponent } from '@/shared/datatable/datatable.component';
import { ActionData, ColumnData, EActionTable } from '@/shared/datatable/datatable.model';
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

  isLoad: boolean = true

  columns: ColumnData[] = [
    { data: 'logo', label: 'labels.logo', width: 70 },
    { data: 'id', label: 'labels.id',width: 116  },
    { data: 'name', label: 'labels.name_product' },
    { data: 'description', label: 'labels.description' },
    { data: 'date_revision', label: 'labels.review_date' },
    { data: 'date_release', label: 'labels.release_date' },
  ];

  constructor(
  ) {
    this.getList();
  }

  get products() {
    return this._product.products
  }

  async getList() {
    this.isLoad = true
    await this._product.getAll()
    this.isLoad = false
  }

  addProduct() {
    this.router.navigate([AppRoutes.add_product]);
  }

  onAction(ev: ActionData) {
    console.log(ev)
    if (ev.action == EActionTable.Edit) {
      this._product.productEdit.set(ev.data)
      this.router.navigate([AppRoutes.go_to_edit_product(ev.data.id)])
      return
    }

    if (ev.action == EActionTable.Delete) {
      this._product.delete(ev.data)
      return
    }
  }
}
