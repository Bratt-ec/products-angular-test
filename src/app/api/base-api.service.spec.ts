import { TestBed } from '@angular/core/testing';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '@/core/services/global.service';
import { ToastService } from '@/shared/app-toast/toast.service';
import { LangService } from '@/core/services/lang.service';
import { of, throwError } from 'rxjs';
import { PerformApi } from './api.model';

describe('BaseApiService', () => {
  let service: BaseApiService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let langServiceSpy: jasmine.SpyObj<LangService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['request']);
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['showLoader', 'hideLoader', 'isInvalidResponse', 'catchError']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    langServiceSpy = jasmine.createSpyObj('LangService', ['_']);
    langServiceSpy._.and.callFake((key: string) => key);

    TestBed.configureTestingModule({
      providers: [
        BaseApiService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LangService, useValue: langServiceSpy }
      ]
    });
    service = TestBed.inject(BaseApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('request should handle successful API call', async () => {
    const mockResponse = { data: 'test' };
    httpClientSpy.request.and.returnValue(of(mockResponse));
    globalServiceSpy.isInvalidResponse.and.returnValue(false);

    const params: PerformApi<any> = {
      request: { action: 'get', url: 'test-url', params: {}, body: {} },
      showLoad: true,
      successMsg: 'messages.success',
      dataField: 'data'
    };

    const result = await service.request(params);

    expect(globalServiceSpy.showLoader).toHaveBeenCalled();
    expect(httpClientSpy.request).toHaveBeenCalled();
    expect(globalServiceSpy.hideLoader).toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalled();
    expect(result.isSuccess).toBeTrue();
    expect(result.value).toEqual(mockResponse);
  });

  it('request should handle API error', async () => {
    const errorResponse = new Error('API Failed');
    httpClientSpy.request.and.returnValue(throwError(() => errorResponse));

    const params: PerformApi<any> = {
      request: { action: 'get', url: 'test-url', params: {}, body: {} },
      showLoad: true,
      catchError: true,
      dataField: 'data'
    };

    const result = await service.request(params);

    expect(globalServiceSpy.showLoader).toHaveBeenCalled();
    expect(globalServiceSpy.catchError).toHaveBeenCalledWith(errorResponse);
    expect(globalServiceSpy.hideLoader).toHaveBeenCalled();
    expect(result.isSuccess).toBeFalse();
    expect(result.error).toBe('API Failed');
  });

  it('request should return failure on invalid response', async () => {
    const mockResponse = { error: 'Invalid' };
    httpClientSpy.request.and.returnValue(of(mockResponse));
    globalServiceSpy.isInvalidResponse.and.returnValue(true);

    const params: PerformApi<any> = {
      request: { action: 'get', url: 'test-url', params: {}, body: {} },
      showLoad: false,
      dataField: 'data'
    };

    const result = await service.request(params);

    expect(globalServiceSpy.isInvalidResponse).toHaveBeenCalledWith(mockResponse);
    expect(result.isSuccess).toBeFalse();
    expect(result.error).toContain('Invalid API Response');
  });
});
