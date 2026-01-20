import { Injectable, signal } from '@angular/core';
import { ToastData, ToastOptions, ToastType } from './toast.model';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    protected readonly DEF_DISMISS_TIME = 3000;

    private _state = signal<{ visible: boolean; message: string; type: ToastType }>({
        visible: false,
        message: '',
        type: 'info',
    });

    state = this._state.asReadonly();

    private timeoutId: any;

    show(options: ToastOptions) {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this._state.set({ visible: true, message: options.message, type: options.type });
        this.timeoutId = setTimeout(() => {
            this.hide();
        }, options.duration ?? this.DEF_DISMISS_TIME);
    }

    hide() {
        this._state.update((s) => ({ ...s, visible: false }));
    }
}