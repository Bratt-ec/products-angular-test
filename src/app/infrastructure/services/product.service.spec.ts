import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { BaseApiService } from '@/api/base-api.service';
import { ConfirmDialogService } from '@/shared/confirm-dialog/confirm-dialog.service';
import { LangService } from '@/core/services/lang.service';
import { ProductData, PayloadUpdateProduct } from '@dto/product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let baseApiSpy: jasmine.SpyObj<BaseApiService>;
  let confirmDialogSpy: jasmine.SpyObj<ConfirmDialogService>;
  let langSpy: jasmine.SpyObj<LangService>;

  const mockProduct: ProductData = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'logo.png',
    date_release: new Date(),
    date_revision: new Date()
  };

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('BaseApiService', ['request']);
    const dialogSpy = jasmine.createSpyObj('ConfirmDialogService', ['confirmSave', 'confirmDelete']);
    const lSpy = jasmine.createSpyObj('LangService', ['_']);

    lSpy._.and.returnValue('Translated Text');

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: BaseApiService, useValue: apiSpy },
        { provide: ConfirmDialogService, useValue: dialogSpy },
        { provide: LangService, useValue: lSpy }
      ]
    });
    service = TestBed.inject(ProductService);
    baseApiSpy = TestBed.inject(BaseApiService) as jasmine.SpyObj<BaseApiService>;
    confirmDialogSpy = TestBed.inject(ConfirmDialogService) as jasmine.SpyObj<ConfirmDialogService>;
    langSpy = TestBed.inject(LangService) as jasmine.SpyObj<LangService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should call API and return products when cache is empty', async () => {
      const mockResponse = { isFailure: false, value: { data: [mockProduct] } };
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));

      const result = await service.getAll();

      expect(result).toEqual([mockProduct]);
      expect(baseApiSpy.request).toHaveBeenCalled();
      expect(service.products).toEqual([mockProduct]);
    });

    it('should return cached products if available', async () => {
      // First call to populate cache
      const mockResponse = { isFailure: false, value: { data: [mockProduct] } };
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));
      await service.getAll();

      baseApiSpy.request.calls.reset();

      // Second call
      const result = await service.getAll();

      expect(result).toEqual([mockProduct]);
      expect(baseApiSpy.request).not.toHaveBeenCalled();
    });

    it('should return null on API failure', async () => {
      const mockResponse = { isFailure: true };
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));

      const result = await service.getAll();

      expect(result).toBeNull();
    });
  });

  describe('getOne', () => {
    it('should call API and return product', async () => {
      const mockResponse = { isFailure: false, value: mockProduct };
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));

      const result = await service.getOne('1');

      expect(result).toEqual(mockProduct);
      expect(baseApiSpy.request).toHaveBeenCalled();
    });

    it('should return null on API failure', async () => {
      const mockResponse = { isFailure: true };
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));

      const result = await service.getOne('1');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should call API and update products list', async () => {
      const newProduct = { ...mockProduct, id: '2' };
      const mockResponse = { isFailure: false, value: { data: newProduct } };
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));

      const result = await service.create(newProduct);

      expect(result).toEqual(newProduct);
      expect(baseApiSpy.request).toHaveBeenCalled();
      // Since cache is initially empty, we can't easily check 'update' unless we populate it first
      // But we can check that `service.products` logic works?
      // Initially, products is []. After create, it should be [newProduct]?
      // Wait, update with empty list: [] => [...[], newProduct] => [newProduct]
      // Let's verify service.products
      expect(service.products).toContain(newProduct);
    });

    it('should return null on API failure', async () => {
      const mockResponse = { isFailure: true };
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));

      const result = await service.create(mockProduct);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should confirm and call API to update product', async () => {
      confirmDialogSpy.confirmSave.and.returnValue(Promise.resolve(true));
      const payload: PayloadUpdateProduct = { ...mockProduct, name: 'Updated Name' };
      const mockResponse = { isFailure: false, value: { data: payload } };
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));

      // Populate cache first to verify update
      // Or just check if map logic runs?
      // The service uses `this._products.update(products => products.map(...))`
      // If products is empty, map returns empty.
      // So let's pre-populate cache.
      // We can use a trick to set private signal, or just call create/getAll first.
      // Let's call create to add 'mockProduct'
      const createResponse = { isFailure: false, value: { data: mockProduct } };
      baseApiSpy.request.and.returnValue(Promise.resolve(createResponse as any));
      await service.create(mockProduct);

      // Now update
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));
      const result = await service.update(payload);

      expect(result).toEqual(payload);
      expect(confirmDialogSpy.confirmSave).toHaveBeenCalled();
      expect(baseApiSpy.request).toHaveBeenCalled();
      expect(service.products.find(p => p.id === '1')?.name).toBe('Updated Name');
    });

    it('should return null if user cancels confirmation', async () => {
      confirmDialogSpy.confirmSave.and.returnValue(Promise.resolve(false));
      const payload: PayloadUpdateProduct = { ...mockProduct };

      const result = await service.update(payload);

      expect(result).toBeNull();
      expect(baseApiSpy.request).not.toHaveBeenCalled();
    });

    it('should return null on API failure', async () => {
        confirmDialogSpy.confirmSave.and.returnValue(Promise.resolve(true));
        const mockResponse = { isFailure: true };
        baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));
        const payload: PayloadUpdateProduct = { ...mockProduct };

        const result = await service.update(payload);

        expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should confirm and call API to delete product', async () => {
      confirmDialogSpy.confirmDelete.and.returnValue(Promise.resolve(true));
      const mockResponse = { isFailure: false, value: {} };
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));

      // Populate cache
      const createResponse = { isFailure: false, value: { data: mockProduct } };
      baseApiSpy.request.and.returnValue(Promise.resolve(createResponse as any));
      await service.create(mockProduct);

      expect(service.products.length).toBe(1);

      // Delete
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));
      const result = await service.delete(mockProduct);

      expect(result).toBeTrue();
      expect(confirmDialogSpy.confirmDelete).toHaveBeenCalled();
      expect(baseApiSpy.request).toHaveBeenCalled();
      expect(service.products.length).toBe(0);
    });

    it('should return false if user cancels', async () => {
      confirmDialogSpy.confirmDelete.and.returnValue(Promise.resolve(false));

      const result = await service.delete(mockProduct);

      expect(result).toBeFalse();
      expect(baseApiSpy.request).not.toHaveBeenCalled();
    });
  });

  describe('existId', () => {
    it('should call API and return boolean', async () => {
      const mockResponse = { isFailure: false, value: true };
      baseApiSpy.request.and.returnValue(Promise.resolve(mockResponse as any));

      const result = await service.existId('123');

      expect(result).toBeTrue();
      expect(baseApiSpy.request).toHaveBeenCalled();
    });
  });
});
