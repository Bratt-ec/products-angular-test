import { TranslatePipe } from './translate.pipe';
import { LangService } from '@/core/services/lang.service';
import { TestBed } from '@angular/core/testing';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let langServiceSpy: jasmine.SpyObj<LangService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LangService', ['_']);
    spy._.and.callFake((key: string) => `translated_${key}`);

    TestBed.configureTestingModule({
      providers: [
        TranslatePipe,
        { provide: LangService, useValue: spy }
      ]
    });

    pipe = TestBed.inject(TranslatePipe);
    langServiceSpy = TestBed.inject(LangService) as jasmine.SpyObj<LangService>;
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform key using LangService', () => {
    const key = 'hello';
    const result = pipe.transform(key);
    expect(langServiceSpy._).toHaveBeenCalledWith(key, undefined);
    expect(result).toBe('translated_hello');
  });

  it('should pass replace parameters to LangService', () => {
    const key = 'hello_name';
    const replace = { name: 'World' };
    pipe.transform(key, replace);
    expect(langServiceSpy._).toHaveBeenCalledWith(key, replace);
  });
});
