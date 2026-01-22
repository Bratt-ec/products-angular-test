import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListProductsComponent } from './list-products.component';
import { ProductService } from '@/infrastructure/services/product.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { ProductData } from '@/infrastructure/dto/product.dto';
import { AppRoutes } from '@/core/utils/app-routes';
import { EActionTable } from '@/shared/datatable/datatable.model';
import { DatatableComponent } from '@/shared/datatable/datatable.component';
import { TranslatePipe } from '@/shared/pipes/translate.pipe';

describe('ListProductsComponent', () => {
  let component: ListProductsComponent;
  let fixture: ComponentFixture<ListProductsComponent>;
  let productServiceSpy: any; // Type as any to avoid strict SpyObj signal issues
  let routerSpy: jasmine.SpyObj<Router>;

  // Signals
  const mockProductsSignal = signal<ProductData[]>([]);
  const mockProductEditSignal = signal<ProductData | null>(null);

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getAll', 'delete']);

    // Assign signals properly
    // We use any-cast above so direct assignment works without TS complaining about Spy types
    productServiceSpy.products = mockProductsSignal;
    productServiceSpy.productEdit = mockProductEditSignal;

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ListProductsComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    // Remove real deps to avoid transitive dependency issues (since we don't render them anyway)
    .overrideComponent(ListProductsComponent, {
      remove: { imports: [DatatableComponent, TranslatePipe] }
    })
    // Empty template -> No child components rendered -> No mocks needed in template
    .overrideTemplate(ListProductsComponent, '')
    .compileComponents();

    fixture = TestBed.createComponent(ListProductsComponent);
    component = fixture.componentInstance;
    productServiceSpy.getAll.and.returnValue(Promise.resolve([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate to add product page', () => {
    component.addProduct();
    expect(routerSpy.navigate).toHaveBeenCalledWith([AppRoutes.add_product]);
  });

  it('should navigate to edit product page on edit action', () => {
    const mockProduct = { id: '123' } as ProductData;
    const action = { action: EActionTable.Edit, data: mockProduct };

    component.onAction(action);

    expect(mockProductEditSignal()).toEqual(mockProduct);
    expect(routerSpy.navigate).toHaveBeenCalledWith([AppRoutes.go_to_edit_product('123')]);
  });

  it('should delete product on delete action', () => {
    const mockProduct = { id: '123' } as ProductData;
    const action = { action: EActionTable.Delete, data: mockProduct };

    component.onAction(action);

    expect(productServiceSpy.delete).toHaveBeenCalledWith(mockProduct);
  });
});
