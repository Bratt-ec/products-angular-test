import { inject, Injectable, signal } from '@angular/core';
import { ConfirmDialogData } from './confirm-dialog.component';
import { LangService } from '@/core/services/lang.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private lang = inject(LangService)

  private isVisibleSignal = signal(false);
  private dialogDataSignal = signal<ConfirmDialogData>({
    title: 'labels.confirm_action',
    message: 'labels.are_you_sure',
    confirmText: 'labels.confirm',
    cancelText: 'labels.cancel',
    type: 'info'
  });

  private resolveCallback?: (result: boolean) => void;

  readonly isVisible = this.isVisibleSignal.asReadonly();
  readonly dialogData = this.dialogDataSignal.asReadonly();

  /**
   * Show a confirm dialog and return a promise that resolves when user confirms or cancels
   * @param data Dialog configuration
   * @returns Promise<boolean> - true if confirmed, false if cancelled
   */
  confirm(data: Partial<ConfirmDialogData>): Promise<boolean> {
    const fullData: ConfirmDialogData = {
      title: data.title || 'labels.confirm_action',
      message: data.message || 'labels.are_you_sure',
      confirmText: data.confirmText || 'labels.confirm',
      cancelText: data.cancelText || 'labels.cancel',
      type: data.type || 'info'
    };

    this.dialogDataSignal.set(fullData);
    this.isVisibleSignal.set(true);

    return new Promise<boolean>((resolve) => {
      this.resolveCallback = resolve;
    });
  }

  /**
   * Handle user confirmation
   */
  handleConfirm(): void {
    this.isVisibleSignal.set(false);
    if (this.resolveCallback) {
      this.resolveCallback(true);
      this.resolveCallback = undefined;
    }
  }

  /**
   * Handle user cancellation
   */
  handleCancel(): void {
    this.isVisibleSignal.set(false);
    if (this.resolveCallback) {
      this.resolveCallback(false);
      this.resolveCallback = undefined;
    }
  }

  /**
   * Quick method for delete confirmation
   */
  confirmDelete(itemName: string): Promise<boolean> {
    return this.confirm({
      title: 'pages.confirm_delete',
      message: this.lang._('pages.msg_confirm_delete', { name: itemName }),
      confirmText: 'labels.delete',
      cancelText: 'labels.cancel',
      type: 'danger'
    });
  }

  /**
   * Quick method for save confirmation
   */
  confirmSave(message?: string): Promise<boolean> {
    return this.confirm({
      title: 'dialogs.save_changes',
      message: message || 'dialogs.msg_save_changes',
      confirmText: 'labels.save',
      cancelText: 'labels.cancel',
      type: 'success'
    });
  }
}
