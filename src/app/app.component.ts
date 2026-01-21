import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LangService } from './core/services/lang.service';
import { AppToastComponent } from "./shared/app-toast/app-toast.component";
import { LoaderComponent } from "./shared/loader/loader.component";
import { ConfirmDialogComponent } from "./shared/confirm-dialog/confirm-dialog.component";
import { ConfirmDialogService } from './shared/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, AppToastComponent, LoaderComponent, ConfirmDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private lang:LangService,
    public _confirmDialog: ConfirmDialogService
  ){
    this.lang.load();
  }
}
