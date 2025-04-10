import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="flex justify-center items-center p-4">
      <p-progressSpinner [strokeWidth]="'4'" [style]="{ width: '50px', height: '50px' }"></p-progressSpinner>
      <span class="ml-3 text-surface-600">{{ message }}</span>
    </div>
  `,
  styles: []
})
export class LoadingComponent {
  @Input() message: string = 'Loading...';
}