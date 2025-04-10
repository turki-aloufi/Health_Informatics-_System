import { SidebarService } from '@/app/services/sidebar.service'
import { CommonModule } from '@angular/common'
import { Component, signal } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { SvgIconComponent } from 'angular-svg-icon'
import { PopoverModule } from 'primeng/popover'
import { UserMenuComponent } from '../../shared/user-menu/user-menu/user-menu.component'
import { OverlayBadgeModule } from 'primeng/overlaybadge'

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    ButtonModule,
    SvgIconComponent,
    PopoverModule,
    UserMenuComponent,
    OverlayBadgeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isScrolled = signal(false)
  isMobile: boolean = false

  private lastScrollPosition = 0

  constructor(
    private sidebarService: SidebarService,
    private breakpointObserver: BreakpointObserver,
  ) {}
  ngOnInit(): void {
    this.onScroll()
    window.addEventListener('scroll', this.onScroll.bind(this))

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isMobile = result.matches

        // Update the sidebar service with current state
        if (this.isMobile) {
          this.sidebarService.closeSidebar()
        } else {
          this.sidebarService.openSidebar()
        }
      })
    // this.currentUser = this.authService.currentUser()
  }

  private onScroll(): void {
    const currentScroll = window.scrollY

    // Only show border when scrolling down AND not at the top
    this.isScrolled.set(currentScroll > 0)

    this.lastScrollPosition = currentScroll
  }

  sideBarOpen() {
    return this.sidebarService.isSidebarOpen()
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar()
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll.bind(this))
  }
}
