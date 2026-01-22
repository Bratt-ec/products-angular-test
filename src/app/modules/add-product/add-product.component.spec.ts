import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { FormService } from '@/core/services/form.service';
import { ProductService } from '@/infrastructure/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { ProductCreatedResponse, ProductData } from '@dto/product.dto';
import { LangService } from '@/core/services/lang.service';
import { format, addYears } from 'date-fns';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let formServiceSpy: jasmine.SpyObj<FormService>;
  let locationSpy: jasmine.SpyObj<Location>;
  let activatedRouteStub: any;
  let langServiceSpy: jasmine.SpyObj<LangService>;

  // Mock data
  const mockProduct: ProductData = {
    id: 'test-id',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'http://example.com/logo.png',
    date_release: new Date('2024-01-01'),
    date_revision: new Date('2025-01-01')
  };

  const productEditSignal = signal<ProductData | null>(null);

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getOne', 'create', 'update', 'existId']);
    Object.defineProperty(productServiceSpy, 'productEdit', { get: () => productEditSignal });

    formServiceSpy = jasmine.createSpyObj('FormService', ['validate']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    langServiceSpy = jasmine.createSpyObj('LangService', ['_']);
    langServiceSpy._.and.callFake((key: string) => key);

    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => key === 'id' ? null : null // Default no ID
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [AddProductComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: FormService, useValue: formServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: LangService, useValue: langServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    fixture.detectChanges();
    expect(component.form).toBeDefined();
    expect(component.form.get('id')?.value).toBe('id-00');
  });

  describe('Validation', () => {
    beforeEach(() => {
        fixture.detectChanges();
    });

    it('should be invalid when empty', () => {
        component.form.patchValue({ id: '', name: '', description: '', logo: '', date_release: '', date_revision: '' });
        expect(component.form.valid).toBeFalse();
    });

    it('isValidReviewDate should return false if release > review', () => {
        activatedRouteStub.snapshot.paramMap.get = () => '123';
        const release = '2025-01-01';
        const review = '2024-01-01'; // Before release
        component.form.patchValue({ date_release: release, date_revision: review });

        expect(component.isValidReviewDate()).toBeFalse();
        expect(component.form.get('date_revision')?.hasError('invalidReviewDate')).toBeTrue();
    });

    it('isValidReviewDate should return false if review is less than 1 year after release', () => {
        activatedRouteStub.snapshot.paramMap.get = () => '123';
        const release = '2024-01-01';
        const review = '2024-06-01'; // Less than 1 year
        component.form.patchValue({ date_release: release, date_revision: review });

        expect(component.isValidReviewDate()).toBeFalse();
    });

    it('isValidReviewDate should return true if review is exactly 1 year after release', () => {
        activatedRouteStub.snapshot.paramMap.get = () => '123';
        const release = '2024-01-01';
        const review = '2025-01-01'; // Exact 1 year
        component.form.patchValue({ date_release: release, date_revision: review });

        expect(component.isValidReviewDate()).toBeTrue();
    });
  });

  describe('Edit Mode', () => {
      it('should load product data if productId and productEdit are present', fakeAsync(() => {
          activatedRouteStub.snapshot.paramMap.get = () => '123';
          productServiceSpy.getOne.and.returnValue(Promise.resolve(mockProduct));
          productEditSignal.set(null);

          fixture.detectChanges(); // ngOnInit starts setEditable
          tick(); // wait for getOne promise

          expect(productServiceSpy.getOne).toHaveBeenCalledWith('123');
          expect(component.form.get('name')?.value).toBe('Test Product');
          expect(component.form.get('id')?.disabled).toBeTrue();
      }));
  });

  describe('Actions', () => {
      beforeEach(() => {
          fixture.detectChanges();
      });

      it('should go back on reset', () => {
          spyOn(component.form, 'reset');
          component.reset();
          expect(component.form.reset).toHaveBeenCalled();
      });

      it('should create product when valid and id does not exist', fakeAsync(() => {
          const todayStr = format(new Date(), 'yyyy-MM-dd');
          const nextYearStr = format(addYears(new Date(), 1), 'yyyy-MM-dd');

          component.form.patchValue({
              id: 'new-id',
              name: 'New Product',
              description: 'Valid Description 10 chars',
              logo: 'http://img.com/a.png',
              date_release: todayStr,
              date_revision: nextYearStr
          });

          productServiceSpy.existId.and.returnValue(Promise.resolve(false));
          productServiceSpy.create.and.returnValue(Promise.resolve(mockProduct));

          component.onValidate(); // Fire and forget
          tick(); // Wait for existId and create

          expect(productServiceSpy.existId).toHaveBeenCalledWith('new-id');
          expect(productServiceSpy.create).toHaveBeenCalled();
          expect(locationSpy.back).toHaveBeenCalled();
      }));

      it('should set error if id exists during creation', fakeAsync(() => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const nextYearStr = format(addYears(new Date(), 1), 'yyyy-MM-dd');

        component.form.patchValue({
            id: 'exist-id',
            name: 'New Product',
            description: 'Valid Description 10 chars',
            logo: 'http://img.com/a.png',
            date_release: todayStr,
            date_revision: nextYearStr
        });

        productServiceSpy.existId.and.returnValue(Promise.resolve(true));

        component.onValidate();
        tick();

        expect(productServiceSpy.create).not.toHaveBeenCalled();
        expect(component.form.get('id')?.hasError('idRepeated')).toBeTrue();
      }));
  });
});
