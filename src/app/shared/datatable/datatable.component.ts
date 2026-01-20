import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { TranslatePipe } from '../pipes/translate.pipe';
import { ColumnData } from './datatable.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'datatable',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss'
})
export class DatatableComponent implements OnDestroy {

  @Input() data: any[] = [];
  @Input() columns: ColumnData[] = [];

  @Input() pageSize: number = 5;
  @Input() loading: boolean = false;


  private searchbarTxt = new Subject<string>();

  currentPage = 1;

  constructor() {
    this.searchbarTxt
      .pipe(debounceTime(800))
      .subscribe((value) => {
        this.onSearchTable(value);
      });
  }

  ngOnDestroy(): void {
    this.searchbarTxt.complete();
  }
  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
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

  onSearchTable(value: string) { }
}
