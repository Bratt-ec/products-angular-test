import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../pipes/translate.pipe';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'labels.confirm_action';
  @Input() message: string = 'labels.are_you_sure';
  @Input() confirmText: string = 'labels.confirm';
  @Input() cancelText: string = 'labels.cancel';
  @Input() type: 'info' | 'warning' | 'danger' | 'success' = 'info';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.closeDialog();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.closeDialog();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  private closeDialog(): void {
    this.isVisible = false;
    this.closed.emit();
  }
}
