import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DatatableComponent } from './datatable.component';
import { LangService } from '@/core/services/lang.service';
import { By } from '@angular/platform-browser';
import { EActionTable } from './datatable.model';

describe('DatatableComponent', () => {
  let component: DatatableComponent;
  let fixture: ComponentFixture<DatatableComponent>;
  let langServiceSpy: jasmine.SpyObj<LangService>;

  const mockData = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    logo: `img${i + 1}.png`
  }));

  const mockColumns = [
    { data: 'name', label: 'Name' },
    { data: 'logo', label: 'Logo' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LangService', ['_']);
    spy._.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [DatatableComponent],
      providers: [
        { provide: LangService, useValue: spy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatatableComponent);
    component = fixture.componentInstance;
    langServiceSpy = TestBed.inject(LangService) as jasmine.SpyObj<LangService>;

    // Initial setup
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('isLoad', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Rendering', () => {
    it('should behave correctly with defaults (page size 5)', () => {
      // With 15 items and page size 5, should show 5 items
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows.length).toBe(5);
      expect(rows[0].nativeElement.textContent).toContain('Product 1');
      expect(rows[4].nativeElement.textContent).toContain('Product 5');
    });

    it('should show logo image if column data is logo', () => {
        const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
        const img = rows[0].query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.nativeElement.src).toContain('img1.png');
    });
  });

  describe('Pagination', () => {
    it('should calculate total pages correctly', () => {
      expect(component.totalPages).toBe(3); // 15 / 5 = 3
    });

    it('should navigate to next page', () => {
      component.changePage(1);
      fixture.detectChanges();

      expect(component.currentPage).toBe(2);
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows[0].nativeElement.textContent).toContain('Product 6');
    });

    it('should navigate to previous page', () => {
      component.currentPage = 2; // set to page 2 first
      fixture.detectChanges();

      component.changePage(-1);
      fixture.detectChanges();

      expect(component.currentPage).toBe(1);
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows[0].nativeElement.textContent).toContain('Product 1');
    });

    it('should not go below page 1', () => {
       component.changePage(-1);
       expect(component.currentPage).toBe(1);
    });

    it('should not go above total pages', () => {
       component.currentPage = 3;
       component.changePage(1);
       expect(component.currentPage).toBe(3);
    });

    it('should change page size', () => {
        const select = fixture.debugElement.query(By.css('.select-page-size')).nativeElement;
        select.value = '10';
        select.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        expect(component.sizePage).toBe(10);
        expect(component.totalPages).toBe(2); // 15 / 10 = 1.5 => 2

        const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
        expect(rows.length).toBe(10);
    });
  });

  describe('Search', () => {
    it('should filter data based on search input', fakeAsync(() => {
      const input = fixture.debugElement.query(By.css('.search-input')).nativeElement;
      input.value = 'Product 1'; // Should match Product 1, Product 10, Product 11...
      input.dispatchEvent(new Event('input'));

      tick(300); // debounce
      fixture.detectChanges();

      // "Product 1", "Product 10", "Product 11", "Product 12", "Product 13", "Product 14", "Product 15"
      // Total 7 matches. Page size 5. Should show 5 rows.
      // Filtered data length should be 7.
      expect(component.filteredData.length).toBe(7);

      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows[0].nativeElement.textContent).toContain('Product 1');
    }));

    it('should reset filter when search is empty', fakeAsync(() => {
        // First search
        component.onSearchTable('Product 1');
        fixture.detectChanges();
        expect(component.filteredData.length).toBe(7);

        // search empty
        const input = fixture.debugElement.query(By.css('.search-input')).nativeElement;
        input.value = '';
        input.dispatchEvent(new Event('input'));

        tick(300);
        fixture.detectChanges();

        expect(component.filteredData.length).toBe(15);
    }));
  });

  describe('Actions', () => {
      it('should toggle dropdown', () => {
          component.openDropdown(0);
          expect(component.dropdownOpen).toBe(0);

          component.openDropdown(0); // Toggle off
          expect(component.dropdownOpen).toBeNull();
      });

      it('should emit edit action', () => {
          spyOn(component.onAction, 'emit');
          component.dropdownOpen = 0;
          fixture.detectChanges();

          const editBtn = fixture.debugElement.query(By.css('.menu-content .txt-info')); // Edit btn
          // Need to render the menu first. bind dropdownOpen to 0 (first row index)
          // The template shows menu if dropdownOpen === i

          // Let's verify menu is visible
          expect(editBtn).toBeTruthy();
          editBtn.nativeElement.click();

          expect(component.onAction.emit).toHaveBeenCalledWith({ action: EActionTable.Edit, data: mockData[0] });
          expect(component.dropdownOpen).toBeNull(); // Should close
      });

      it('should emit delete action', () => {
          spyOn(component.onAction, 'emit');
          component.dropdownOpen = 0;
          fixture.detectChanges();

          const deleteBtn = fixture.debugElement.query(By.css('.menu-content .txt-danger'));
          deleteBtn.nativeElement.click();

          expect(component.onAction.emit).toHaveBeenCalledWith({ action: EActionTable.Delete, data: mockData[0] });
      });
  });
});
