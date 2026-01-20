import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, input, Input, OnDestroy, OnInit, output } from '@angular/core';
import { TranslatePipe } from '../pipes/translate.pipe';
import { ActionData, ColumnData, EActionTable } from './datatable.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'datatable',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss'
})
export class DatatableComponent implements OnInit, OnDestroy, AfterViewInit {

  data = input<any[]>([]);
  isLoad = input<boolean>(true)
  columns = input<ColumnData[]>([]);

  pageSize = input<number>(5);
  loading = input<boolean>(false);
  actions = input<boolean>(true);

  onAction = output<ActionData>();

  filteredData: any[] = [];

  private searchbarTxt = new Subject<string>();
  actionsTb = EActionTable;
  dropdownOpen: number | null = null;
  currentPage = 1;

  constructor() {
    this.searchbarTxt
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.onSearchTable(value);
      });

    effect(() => {
      if (!this.isLoad()) {
        this.filteredData = this.data();
      }
    })
  }
  ngAfterViewInit(): void {
    document.addEventListener('clickOutside', () => {
      this.dropdownOpen = null;
    });
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.searchbarTxt.complete();
    document.removeEventListener('clickOutside', () => {
      this.dropdownOpen = null;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize());
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize();
    return this.filteredData.slice(start, start + this.pageSize());
  }

  changePage(step: number): void {
    this.dropdownOpen = null;
    const newPage = this.currentPage + step;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }

  goToPage(page: number): void {
    this.dropdownOpen = null;
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onSearch(ev: Event) {
    this.dropdownOpen = null;
    const target = ev.target as HTMLInputElement;
    this.searchbarTxt.next(target.value);
  }

  onSearchTable(value: string) {
    this.dropdownOpen = null;
    const searchTerm = value.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredData = this.data();
      this.currentPage = 1;
      return;
    }

    this.filteredData = this.data().filter(row => {
      return this.columns().some(column => {
        const cellValue = row[column.data];
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(searchTerm);
      });
    });

    this.currentPage = 1;
  }

  onActionTable(action: EActionTable, data: any) {
    this.dropdownOpen = null;
    this.onAction.emit({ action, data });
  }

  openDropdown(i: number | null) {
    this.dropdownOpen = this.dropdownOpen === i ? null : i;
  }
}
