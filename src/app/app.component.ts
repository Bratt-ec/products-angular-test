import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LangService } from './core/services/lang.service';
import { AppToastComponent } from "./shared/app-toast/app-toast.component";
import { LoaderComponent } from "./shared/loader/loader.component";

@Component({
  selector: 'app-root',
  imports: [RouterModule, AppToastComponent, LoaderComponent],
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
