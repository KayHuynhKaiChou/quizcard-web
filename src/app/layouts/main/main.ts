import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/common/header/header.component';
import { SidebarComponent } from '../../components/common/sidebar/sidebar.component';
import { ChatWidgetComponent } from '../../components/chat/chat-widget/chat-widget.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    ChatWidgetComponent,
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class MainLayoutComponent {

}
