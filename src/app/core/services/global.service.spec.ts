import { TestBed } from '@angular/core/testing';
import { GlobalService } from './global.service';
import { ToastService } from '@/shared/app-toast/toast.service';
import { LangService } from './lang.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('GlobalService', () => {
  let service: GlobalService;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let langServiceSpy: jasmine.SpyObj<LangService>;

  beforeEach(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    langServiceSpy = jasmine.createSpyObj('LangService', ['_']);
    langServiceSpy._.and.callFake((key: string) => key);

    TestBed.configureTestingModule({
      providers: [
        GlobalService,
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: LangService, useValue: langServiceSpy }
      ]
    });
    service = TestBed.inject(GlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle loader state', () => {
    expect(service.isLoading).toBeFalse();
    service.showLoader();
    expect(service.isLoading).toBeTrue();
    service.hideLoader();
    expect(service.isLoading).toBeFalse();
  });

  it('isInvalidResponse should check for errors', () => {
    expect(() => service.isInvalidResponse({ error: 'Some error' })).toThrow();
    expect(service.isInvalidResponse({ value: 'success' })).toBeFalse();
  });

  it('catchError should show toast on error', () => {
    const errorResponse = new HttpErrorResponse({ error: { message: 'Failed' }, status: 400 });
    service.catchError(errorResponse);
    expect(toastServiceSpy.show).toHaveBeenCalled();
  });

  it('catchError should show global error message for unknown error', () => {
    service.catchError('Unknown Error');
    expect(langServiceSpy._).toHaveBeenCalledWith('messages.error_global');
    expect(toastServiceSpy.show).toHaveBeenCalled();
  });
});
