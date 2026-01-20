import { Routes } from '@angular/router';
import { AppRoutes } from './core/utils/app-routes';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./modules/list-products/list-products.component').then(m => m.ListProductsComponent)
    },
    {
        path: AppRoutes.add_product,
        loadComponent: () => import('./modules/add-product/add-product.component').then(m => m.AddProductComponent)
    },
    {
        path: AppRoutes.edit_product,
        loadComponent: () => import('./modules/add-product/add-product.component').then(m => m.AddProductComponent)
    },
];
