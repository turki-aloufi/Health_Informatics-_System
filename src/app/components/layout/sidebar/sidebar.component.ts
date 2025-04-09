import { Component, signal } from '@angular/core'
import { DrawerModule } from 'primeng/drawer'
import { ButtonModule } from 'primeng/button'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { SidebarService } from '@/app/services/sidebar.service'
import { CommonModule } from '@angular/common'
import { MenuModule } from 'primeng/menu'
import { PanelMenuModule } from 'primeng/panelmenu'
import { MenuItem } from 'primeng/api'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { SvgIconComponent } from 'angular-svg-icon'
import { LogoComponent } from '../../shared/logo/logo/logo.component'

interface ExtendedMenuItem extends MenuItem {
  routerLinkActiveOptions?: Record<string, any>
}
@Component({
  selector: 'app-sidebar',
  imports: [
    DrawerModule,
    ButtonModule,
    CommonModule,
    PanelMenuModule,
    MenuModule,
    RouterLinkActive,
    RouterLink,
    SvgIconComponent,
    LogoComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  visible: boolean = true
  isMobile: boolean = false
  items = signal<ExtendedMenuItem[]>([])

  constructor(
    private breakpointObserver: BreakpointObserver,
    public sidebarService: SidebarService,
  ) {}

  ngOnInit() {
    this.items.set([
      {
        label: 'Dashboard',
        icon: 'assets/images/view_cozy_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg',
        routerLink: 'doctor/dashboard/',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Dashboard',
        icon: 'assets/images/view_cozy_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg',
        routerLink: 'admin/dashboard/',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Dashboard',
        icon: 'assets/images/view_cozy_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg',
        routerLink: 'patient/dashboard/',
        routerLinkActiveOptions: { exact: true },
      },
    ])

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isMobile = result.matches

        if (this.isMobile) {
          this.sidebarService.closeSidebar()
        } else {
          this.sidebarService.openSidebar()
        }
      })
  }
  closeCallback(event: any) {
    this.sidebarService.closeSidebar()
  }
  closeSidebar() {
    this.sidebarService.closeSidebar()
  }

  isSidebarOpen(): boolean {
    return this.sidebarService.isSidebarOpen()
  }
}
