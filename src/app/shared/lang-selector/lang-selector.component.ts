import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '../../core/services/lang.service';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

@Component({
  selector: 'app-lang-selector',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './lang-selector.component.html',
  styleUrls: ['./lang-selector.component.scss']
})
export class LangSelectorComponent {
  private _lang = inject(LangService);
  isOpen = false;

  get currentLang() {
    return this._lang.current;
  }

  get languages() {
    return this._lang.languages;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectLanguage(languageCode: string) {
    this._lang.switch(languageCode);
    this.isOpen = false;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}
