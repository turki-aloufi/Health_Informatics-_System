import { AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Directive({
  selector: '[baseChart]',
  standalone: true
})
export class BaseChartDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: any;
  
  private chart: Chart | null = null;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private createChart(): void {
    if (!this.data) return;
    
    const ctx = this.elementRef.nativeElement.getContext('2d');
    if (!ctx) return;
    
    this.chart = new Chart(ctx, {
      type: this.data.type,
      data: this.data.data,
      options: this.data.options || {}
    });
  }

  private updateChart(): void {
    if (!this.chart || !this.data) return;
    
    this.chart.data = this.data.data;
    if (this.data.options) {
      this.chart.options = this.data.options;
    }
    
    this.chart.update();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}