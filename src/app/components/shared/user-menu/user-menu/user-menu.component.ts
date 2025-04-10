import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
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
import { Observable, Subscription } from 'rxjs'
import { User } from '@/app/models/user.model'
@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
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
export class UserMenuComponent implements OnInit, OnDestroy {
  menuItem?: MenuItem[]
  user?: User
  private userSubscription?: Subscription

  selectedLanguage?: { name: string; code: string }
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user
    })

    this.menuItem = []
    // this.currentUser = this.authService.currentUser()
  }

  onLogout() {
    this.authService.logout()
  }
  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
  }
}
