import { Component, Input } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html',
})
export class LogoComponent {
  @Input() width: number = 33
  @Input() height: number = 33
  @Input() color: string = 'currentColor'

  svg?: SafeHtml

  constructor(private sanitizer: DomSanitizer) {}

  async ngOnInit() {}
}
