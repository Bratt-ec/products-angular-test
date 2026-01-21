import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GlobalService } from '@/core/services/global.service';
import { TranslatePipe } from "@/shared/pipes/translate.pipe";

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

    private _global = inject(GlobalService)

    @Input() message: string = 'labels.loading';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';

    get isLoading() {
        return this._global.isLoading
    }
}
