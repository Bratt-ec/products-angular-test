import { CommonModule } from '@angular/common';
import { Component, effect, input, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe } from '../pipes/translate.pipe';
import { ColumnData } from './datatable.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'datatable',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss'
})
export class DatatableComponent implements OnInit, OnDestroy {

  @Input() data: any[] = [];
  isLoad = input<boolean>(true)
  @Input() columns: ColumnData[] = [];

  @Input() pageSize: number = 5;
  @Input() loading: boolean = false;

  filteredData: any[] = [];

  private searchbarTxt = new Subject<string>();

  currentPage = 1;

  constructor() {
    this.searchbarTxt
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.onSearchTable(value);
      });

    effect(() => {
      if (!this.isLoad()) {
        this.filteredData = this.data;
      }
    })
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.searchbarTxt.complete();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  changePage(step: number): void {
    const newPage = this.currentPage + step;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }


  onSearch(ev: Event) {
    const target = ev.target as HTMLInputElement;
    this.searchbarTxt.next(target.value);
  }

  onSearchTable(value: string) {
    const searchTerm = value.toLowerCase().trim();

    if (!searchTerm) {
      this.filteredData = this.data;
      this.currentPage = 1;
      return;
    }

    this.filteredData = this.data.filter(row => {
      return this.columns.some(column => {
        const cellValue = row[column.data];
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(searchTerm);
      });
    });

    this.currentPage = 1;
  }
}
