import { TestBed } from '@angular/core/testing';
import { LangService } from './lang.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('LangService', () => {
  let service: LangService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    // Mock get to return dummy data for load()
    httpClientSpy.get.and.returnValue(of({ en: { hello: 'Hello' } }));

    TestBed.configureTestingModule({
      providers: [
        LangService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(LangService);

    // Spy on localStorage to avoid side effects
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue('en');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('load should fetch language file', async () => {
    await service.load();
    expect(httpClientSpy.get).toHaveBeenCalledWith('assets/lang/lang.json', jasmine.any(Object));
    expect(service.lang).toBeDefined();
  });

  it('switch should update locale and save preference', () => {
    service.switch('es');
    expect(service.locale).toBe('es');
    expect(localStorage.setItem).toHaveBeenCalledWith('app-language', 'es');
  });

  it('_ should return translation key if translation not found', () => {
    service.lang = null; // Ensure no lang loaded
    const result = service._('test.key');
    expect(result).toBe('key');
  });

  it('_ should return translation if found', () => {
      service.lang = { en: { test: { key: 'Translated Value' } } };
      // Force locale to 'en'
      service.switch('en');
      const result = service._('test.key');
      expect(result).toBe('Translated Value');
  });
});
