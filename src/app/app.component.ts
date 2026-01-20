import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LangService } from './core/services/lang.service';
import { AppToastComponent } from "./shared/app-toast/app-toast.component";

@Component({
  selector: 'app-root',
  imports: [RouterModule, AppToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private lang:LangService
  ){
    this.lang.load();
  }
}
