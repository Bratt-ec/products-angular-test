import { AppRoutes } from '@/core/utils/app-routes';
import { DatatableComponent } from '@/shared/datatable/datatable.component';
import { TranslatePipe } from '@/shared/pipes/translate.pipe';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-products',
  imports: [DatatableComponent,TranslatePipe],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {
  sampleData = [
    // { name: 'Alice', age: 30, country: 'USA' },
    // { name: 'Bob', age: 25, country: 'Canada' },
    // { name: 'Charlie', age: 35, country: 'UK' }
  ];

  columns = [
    { data: 'name', label: 'labels.name' },
    { data: 'age', label: 'labels.age' },
    { data: 'country', label: 'labels.country' }
  ];

  constructor(
    private router:Router
  ){}

  addProduct() {
    this.router.navigate([AppRoutes.add_product]);
  }
}
