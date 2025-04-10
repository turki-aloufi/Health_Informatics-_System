import { Component, OnDestroy, signal } from '@angular/core'
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
import { AuthService } from '@/app/services/auth.service'
import { CurrentUser, User, UserRole } from '@/app/models/user.model'
import { firstValueFrom, Observable, Subscription } from 'rxjs'
import { TokenService, TokenType } from '@/app/services/token.service'

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
export class SidebarComponent implements OnDestroy {
  visible: boolean = true
  isMobile: boolean = false
  items = signal<ExtendedMenuItem[]>([])
  user?: User
  private userSubscription?: Subscription

  constructor(
    private breakpointObserver: BreakpointObserver,
    public sidebarService: SidebarService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user
      if (user) {
        this.updateSidebarMenu()
      } else {
        this.items.set([])
      }
    })

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

  updateSidebarMenu() {
    switch (this.user?.role) {
      case UserRole.Admin:
        this.items.set([
          {
            label: 'Dashboard',
            icon: 'assets/images/view_cozy_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg',
            routerLink: 'admin/dashboard/',
            routerLinkActiveOptions: { exact: true },
          },

          {
            label: 'Doctors Management',
            icon: 'assets/images/stethoscope_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg',
            routerLink: 'admin/doctor-management/',
            routerLinkActiveOptions: { exact: true },
          },

          {
            label: 'Patients Management',
            icon: 'assets/images/personal_injury_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 (1).svg',
            routerLink: 'admin/patients/',
            routerLinkActiveOptions: { exact: true },
          },          {
            label: 'Appointments Management',
            icon: 'assets/images/event_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg',
            routerLink: 'admin/admin-appointments/',
            routerLinkActiveOptions: { exact: true },
          },
        ])
        break
      case UserRole.Patient:
        this.items.set([
          {
            label: 'Appointments ',
            icon: 'assets/images/view_cozy_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg',
            routerLink: 'patient/dashboard/',
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: 'Booking ',
            icon: 'assets/images/confirmation_number_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg',
            routerLink: '/patient/booking',
            routerLinkActiveOptions: { exact: true },
          },
        ])
        break
      case UserRole.Doctor:
        this.items.set([
          {
            label: 'Dashboard',
            icon: 'assets/images/view_cozy_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg',
            routerLink: 'doctor/dashboard/',
            routerLinkActiveOptions: { exact: true },
          },
          // {
          //   label: 'Patients',
          //   icon: 'assets/images/personal_injury_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 (1).svg',
          //   routerLink: 'doctor/patients/',
          //   routerLinkActiveOptions: { exact: true },
          // },
        ])
        break
      default:
        this.items.set([])
    }
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

  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
  }
}
