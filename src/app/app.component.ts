import { Component } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { ButtonModule } from 'primeng/button'
import { SidebarComponent } from './components/layout/sidebar/sidebar.component'
import { SidebarService } from './services/sidebar.service'
import { CommonModule } from '@angular/common'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { NavbarComponent } from './components/layout/navbar/navbar.component'
import { filter } from 'rxjs'

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
  currentUrl: string = ''

  constructor(
    public sidebarService: SidebarService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url
      })
  }

  ngOnInit() {
    // Monitor screen size changes
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isMobile = result.matches
      })
    this.currentUrl = this.router.url
  }

  isAuthPage(): boolean {
    return (
      this.currentUrl.includes('/login') ||
      this.currentUrl.includes('/register') ||
      this.currentUrl.includes('/auth')
    )
  }
  toggleSidebar() {
    this.sidebarService.toggleSidebar()
  }

  isMobileView(): boolean {
    return this.isMobile
  }

  title = 'Health_Informatics_System'
}
