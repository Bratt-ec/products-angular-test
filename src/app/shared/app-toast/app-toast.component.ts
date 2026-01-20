import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { ToastType } from './toast.model';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './app-toast.component.html',
  styleUrl: './app-toast.component.scss'
})
export class AppToastComponent {

  toast = inject(ToastService);


  getClasses(type: ToastType): string {
    return `toast-${type}`;
  }
}
