import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { SidebarComponent } from './components/layout/sidebar/sidebar.component'
import { SidebarService } from './services/sidebar.service'
import { CommonModule } from '@angular/common'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { NavbarComponent } from './components/layout/navbar/navbar.component'

@Component({
  selector: 'app-root',
  imports: [
    ButtonModule,
    SidebarComponent,
    RouterOutlet,
    CommonModule,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private isMobile = false

  constructor(
    public sidebarService: SidebarService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {
    // Monitor screen size changes
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isMobile = result.matches
      })
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar()
  }

  isMobileView(): boolean {
    return this.isMobile
  }

  title = 'Health_Informatics_System'
}
