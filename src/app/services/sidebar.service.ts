import { computed, Injectable, signal } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isOpenSignal = signal<boolean>(false)

  readonly isOpen = computed(() => this.isOpenSignal())

  constructor() {
    this.openSidebar()
  }

  openSidebar() {
    this.isOpenSignal.set(true)
  }

  closeSidebar() {
    this.isOpenSignal.set(false)
  }

  toggleSidebar() {
    this.isOpenSignal.update(value => !value)
  }

  isSidebarOpen(): boolean {
    return this.isOpenSignal()
  }
}
