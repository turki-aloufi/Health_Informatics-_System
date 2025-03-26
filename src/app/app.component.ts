import { Component } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'app-root',
  imports: [ButtonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Health_Informatics_System'
}
