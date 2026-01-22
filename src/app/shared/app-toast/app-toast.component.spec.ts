import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppToastComponent } from './app-toast.component';
import { ToastService } from './toast.service';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ToastType } from './toast.model';

describe('AppToastComponent', () => {
  let component: AppToastComponent;
  let fixture: ComponentFixture<AppToastComponent>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  // Create a writable signal to control the mock state
  const mockState = signal<{ visible: boolean; message: string; type: ToastType }>({
    visible: false,
    message: '',
    type: 'info'
  });

  beforeEach(async () => {
    mockState.set({ visible: false, message: '', type: 'info' });

    const spy = jasmine.createSpyObj('ToastService', ['hide', 'show']);
    // Mock the 'state' property getter to return our mock signal
    Object.defineProperty(spy, 'state', { get: () => mockState });

    await TestBed.configureTestingModule({
      imports: [AppToastComponent],
      providers: [
        { provide: ToastService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppToastComponent);
    component = fixture.componentInstance;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden when visible is false', () => {
    mockState.set({ visible: false, message: 'Hidden', type: 'info' });
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.toast-container'));
    expect(container).toBeNull();
  });

  it('should be visible and show message when visible is true', () => {
    const msg = 'Test Message';
    mockState.set({ visible: true, message: msg, type: 'info' });
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.toast-container'));
    const messageSpan = fixture.debugElement.query(By.css('.toast-message'));

    expect(container).toBeTruthy();
    expect(messageSpan.nativeElement.textContent).toContain(msg);
  });

  it('should have correct class for success type', () => {
    mockState.set({ visible: true, message: 'Success', type: 'success' });
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.toast-container'));
    expect(container.nativeElement.classList).toContain('toast-success');
  });

  it('should have correct class for error type', () => {
    mockState.set({ visible: true, message: 'Error', type: 'error' });
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.toast-container'));
    expect(container.nativeElement.classList).toContain('toast-error');
  });

  it('should call hide() when clicked', () => {
    mockState.set({ visible: true, message: 'Click me', type: 'info' });
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.toast-container'));
    container.nativeElement.click();

    expect(toastServiceSpy.hide).toHaveBeenCalled();
  });

  it('getClasses should return correct class string', () => {
    expect(component.getClasses('success')).toBe('toast-success');
    expect(component.getClasses('error')).toBe('toast-error');
    expect(component.getClasses('info')).toBe('toast-info');
  });
});
