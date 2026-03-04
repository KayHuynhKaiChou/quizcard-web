import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LoadingOverlayComponent } from './components/common/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, LoadingOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

}
