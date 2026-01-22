import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MsgValidationComponent } from './msg-validation.component';
import { FormService } from '@/core/services/form.service';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('MsgValidationComponent', () => {
  let component: MsgValidationComponent;
  let fixture: ComponentFixture<MsgValidationComponent>;
  let formServiceSpy: jasmine.SpyObj<FormService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('FormService', ['validate']);

    await TestBed.configureTestingModule({
      imports: [MsgValidationComponent],
      providers: [
        { provide: FormService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgValidationComponent);
    component = fixture.componentInstance;
    formServiceSpy = TestBed.inject(FormService) as jasmine.SpyObj<FormService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should throw error if formCtrl is provided without formField', () => {
    component.formCtrl = new FormGroup({});
    // formField is explicitly not set or undefined
    expect(() => component.ngOnInit()).toThrow('err_need_form_field');
  });

  it('should call FormService.validate when using formCtrl', () => {
    component.formCtrl = new FormGroup({
      testField: new FormControl('')
    });
    component.formField = 'testField';
    formServiceSpy.validate.and.returnValue('Validation Error');

    fixture.detectChanges(); // triggers ngOnInit and template update

    expect(formServiceSpy.validate).toHaveBeenCalledWith('testField', component.formCtrl);

    const span = fixture.debugElement.query(By.css('.form-error')).nativeElement;
    expect(span.textContent).toContain('Validation Error');
  });

  it('should display static message when formCtrl is not used', () => {
    component.message = 'Static Error Message';
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('.form-error')).nativeElement;
    expect(span.textContent).toContain('Static Error Message');
  });

  it('should not display anything if no error or message', () => {
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.form-error'));
    expect(span).toBeNull();
  });
});
