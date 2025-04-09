import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { AvatarModule } from 'primeng/avatar'
import { ButtonModule } from 'primeng/button'
import { Router, RouterLink } from '@angular/router'
import { MenuItem } from 'primeng/api'
import { MenuModule } from 'primeng/menu'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { SvgIconComponent } from 'angular-svg-icon'
import { PopoverModule } from 'primeng/popover'
import { SelectModule } from 'primeng/select'
import { AuthService } from '@/app/services/auth.service'
@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
    RouterLink,
    MenuModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    SvgIconComponent,
    PopoverModule,
    SelectModule,
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent implements OnInit {
  // currentUser?: CurrentUser
  menuItem?: MenuItem[]

  selectedLanguage?: { name: string; code: string }
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.menuItem = [
      {
        label: 'general.profile',
        icon: 'assets/images/person_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg',
        routerLink: '/profile',
      },
    ]
    // this.currentUser = this.authService.currentUser()
  }

  // onLogout() {
  //   this.authService.logout().subscribe({
  //     next: value => {
  //       this.router.navigate(['/'])
  //     },
  //   })
  // }
}
