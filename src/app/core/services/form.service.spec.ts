import { TestBed } from '@angular/core/testing';
import { FormService } from './form.service';
import { LangService } from './lang.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FieldInputForm } from '../models/form.model';

describe('FormService', () => {
  let service: FormService;
  let langServiceSpy: jasmine.SpyObj<LangService>;

  beforeEach(() => {
    langServiceSpy = jasmine.createSpyObj('LangService', ['_']);
    langServiceSpy._.and.callFake((key: string) => key);

    TestBed.configureTestingModule({
      providers: [
        FormService,
        FormBuilder,
        { provide: LangService, useValue: langServiceSpy }
      ]
    });
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('build should create a FormGroup from FieldInputForm array', () => {
    const baseForm: FieldInputForm[] = [
      {
        type: 'text',
        formControlName: 'testField',
        value: '',
        validations: [Validators.required],
        multiple: false,
        isSurvey: false
      }
    ];
    const formGroup = service.build(baseForm);
    expect(formGroup).toBeDefined();
    expect(formGroup.get('testField')).toBeDefined();
  });

  it('validate should return empty string if control is valid or untouched', () => {
    const formGroup = new FormBuilder().group({
      testField: ['', Validators.required]
    });
    const result = service.validate('testField', formGroup);
    expect(result).toBe('');
  });

  it('validate should return translated error message if control is invalid and touched', () => {
    const formGroup = new FormBuilder().group({
      testField: ['', Validators.required]
    });
    formGroup.get('testField')?.markAsTouched();

    // Trigger validation
    formGroup.get('testField')?.updateValueAndValidity();

    // Since langService is mocked to return the key, we expect the key
    const result = service.validate('testField', formGroup);
    expect(result).toBe('validations.required');
  });

  it('validate should return custom error message for idRepeated', () => {
    const formGroup = new FormBuilder().group({
        id: ['']
    });
    formGroup.get('id')?.setErrors({ idRepeated: true });
    formGroup.get('id')?.markAsTouched();

    const result = service.validate('id', formGroup);
    expect(result).toBe('validations.id_repeated');
  });
});
