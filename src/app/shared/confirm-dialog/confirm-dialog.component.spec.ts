import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { By } from '@angular/platform-browser';
import { LangService } from '@/core/services/lang.service';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    const langSpy = jasmine.createSpyObj('LangService', ['_']);
    langSpy._.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: LangService, useValue: langSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show dialog content by default (isVisible false)', () => {
    const overlay = fixture.debugElement.query(By.css('.dialog-overlay'));
    expect(overlay).toBeNull();
  });

  it('should show dialog content when isVisible is true', () => {
    component.isVisible = true;
    fixture.detectChanges();
    const overlay = fixture.debugElement.query(By.css('.dialog-overlay'));
    expect(overlay).toBeTruthy();
  });

  describe('Events', () => {
    beforeEach(() => {
        component.isVisible = true;
        fixture.detectChanges();
    });

    it('should emit confirmed and closed on confirm click', () => {
        spyOn(component.confirmed, 'emit');
        spyOn(component.closed, 'emit');

        const btn = fixture.debugElement.query(By.css('.dialog-button-confirm')).nativeElement;
        btn.click();

        expect(component.confirmed.emit).toHaveBeenCalled();
        expect(component.closed.emit).toHaveBeenCalled();
        expect(component.isVisible).toBeFalse();
    });

    it('should emit cancelled and closed on cancel click', () => {
        spyOn(component.cancelled, 'emit');
        spyOn(component.closed, 'emit');

        const btn = fixture.debugElement.query(By.css('.dialog-button-cancel')).nativeElement;
        btn.click();

        expect(component.cancelled.emit).toHaveBeenCalled();
        expect(component.closed.emit).toHaveBeenCalled();
        expect(component.isVisible).toBeFalse();
    });

    it('should emit cancelled and closed on backdrop click', () => {
        spyOn(component.cancelled, 'emit');
        spyOn(component.closed, 'emit');

        const overlay = fixture.debugElement.query(By.css('.dialog-overlay')).nativeElement;
        overlay.click();

        expect(component.cancelled.emit).toHaveBeenCalled();
        expect(component.closed.emit).toHaveBeenCalled();
        expect(component.isVisible).toBeFalse();
    });

    it('should NOT emit cancelled when clicking on dialog container (propagation check)', () => {
        spyOn(component.cancelled, 'emit');

        const container = fixture.debugElement.query(By.css('.dialog-container')).nativeElement;
        container.click();

        expect(component.cancelled.emit).not.toHaveBeenCalled();
    });
  });

  describe('Rendering', () => {
      beforeEach(() => {
          component.isVisible = true;
      });

      it('should display correct text content', () => {
          component.title = 'Test Title';
          component.message = 'Test Message';
          component.confirmText = 'Yes';
          component.cancelText = 'No';
          fixture.detectChanges();

          const title = fixture.debugElement.query(By.css('.dialog-title')).nativeElement;
          const message = fixture.debugElement.query(By.css('.dialog-message')).nativeElement;
          const confirmBtn = fixture.debugElement.query(By.css('.dialog-button-confirm')).nativeElement;
          const cancelBtn = fixture.debugElement.query(By.css('.dialog-button-cancel')).nativeElement;

          expect(title.textContent).toContain('Test Title');
          expect(message.textContent).toContain('Test Message');
          expect(confirmBtn.textContent).toContain('Yes');
          expect(cancelBtn.textContent).toContain('No');
      });

      it('should apply correct type class', () => {
          component.type = 'danger';
          fixture.detectChanges();

          const container = fixture.debugElement.query(By.css('.dialog-container')).nativeElement;
          const confirmBtn = fixture.debugElement.query(By.css('.dialog-button-confirm')).nativeElement;

          expect(container.classList).toContain('dialog-danger');
          expect(confirmBtn.classList).toContain('dialog-button-danger');
      });
  });
});
