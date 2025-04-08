import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MessageService } from 'primeng/api';
import { DashboardService } from '../../../services/admin-dashboard.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ChartModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    ProgressSpinnerModule,
    ToastModule,
    TableModule,
    DividerModule,
    ScrollPanelModule
  ],
  providers: [MessageService, DashboardService],
  template: `
    <div class="dashboard-container p-3 md:p-4">
      <h1 class="text-xl md:text-2xl font-bold mb-3 md:mb-4">Clinic Dashboard</h1>
      
      <!-- Loading Spinner -->
      <div *ngIf="loading" class="flex justify-center items-center h-64">
        <p-progressSpinner strokeWidth="4" [style]="{width: '50px', height: '50px'}"></p-progressSpinner>
      </div>
      
      <!-- Dashboard content -->
      <div *ngIf="!loading" class="grid">
        <!-- Summary Cards -->
        <div class="col-6 md:col-3 p-2">
          <p-card styleClass="h-full shadow-2">
            <div class="flex flex-column align-items-center text-center">
              <span class="text-3xl md:text-5xl font-bold text-blue-500">{{ summary?.totalAppointments || 0 }}</span>
              <span class="mt-2 text-base md:text-lg">Total Appointments</span>
            </div>
          </p-card>
        </div>
        
        <div class="col-6 md:col-3 p-2">
          <p-card styleClass="h-full shadow-2">
            <div class="flex flex-column align-items-center text-center">
              <span class="text-3xl md:text-5xl font-bold text-green-500">{{ summary?.weeklyAppointments || 0 }}</span>
              <span class="mt-2 text-base md:text-lg">Weekly Appointments</span>
            </div>
          </p-card>
        </div>
        
        <div class="col-6 md:col-3 p-2">
          <p-card styleClass="h-full shadow-2">
            <div class="flex flex-column align-items-center text-center">
              <span class="text-3xl md:text-5xl font-bold text-purple-500">{{ summary?.totalPatients || 0 }}</span>
              <span class="mt-2 text-base md:text-lg">Total Patients</span>
            </div>
          </p-card>
        </div>
        
        <div class="col-6 md:col-3 p-2">
          <p-card styleClass="h-full shadow-2">
            <div class="flex flex-column align-items-center text-center">
              <span class="text-3xl md:text-5xl font-bold text-orange-500">{{ summary?.totalDoctors || 0 }}</span>
              <span class="mt-2 text-base md:text-lg">Total Doctors</span>
            </div>
          </p-card>
        </div>

        <!-- Appointments by Status Chart -->
        <div class="col-12 lg:col-6 p-2">
          <p-card header="Appointments by Status" styleClass="h-full shadow-2">
            <div  class="chart-container">
              <p-chart type="pie" [data]="chartData.appointmentStatus" [options]="getChartOptions('pie')"></p-chart>
            </div>
          </p-card>
        </div>
        
        <!-- Patient Demographics -->
        <div class="col-12 lg:col-6 p-2 ">
          <p-card header="Patient Demographics" styleClass="h-full shadow-2">
            <div class="mb-3">
              <h3 class="text-base md:text-lg font-medium mb-2">Gender Distribution</h3>
              <div  class="chart-container ">
                <p-chart type="doughnut" [data]="chartData.genderDistribution" [options]="getChartOptions('doughnut')"></p-chart>
              </div>
            </div>
            <p-divider></p-divider>
            <div class="">
              <h3 class="text-base md:text-lg font-medium mb-2">Age Distribution</h3>
              <div  class="chart-container ">
                <p-chart type="bar" [data]="chartData.ageDistribution" [options]="getChartOptions('horizontalBar')"></p-chart>
              </div>
            </div>
          </p-card>
        </div>
        
        <!-- Doctor Workload Table -->
        <div class="col-12 lg:col-6 p-2">
          <p-card header="Doctor Workload" styleClass="h-full shadow-2">
            <p-scrollPanel [style]="{ width: '100%', height: isMobile ? '320px' : '420px' }">
              <div *ngIf="doctorWorkload && doctorWorkload.length > 0">
                <p-table [value]="doctorWorkload" styleClass="p-datatable-sm p-datatable-striped"
                  [scrollable]="true" [responsive]="true">
                  <ng-template pTemplate="header">
                    <tr>
                      <th>Doctor</th>
                      <th class="text-center">Total</th>
                      <th class="text-center">Scheduled</th>
                      <th class="text-center">Completed</th>
                      <th class="text-center">Cancelled</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-doctor>
                    <tr>
                      <td>{{ doctor.doctorName }}</td>
                      <td class="text-center">{{ doctor.appointmentCount }}</td>
                      <td class="text-center">{{ doctor.scheduledCount }}</td>
                      <td class="text-center">{{ doctor.completedCount }}</td>
                      <td class="text-center">{{ doctor.cancelledCount }}</td>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="emptymessage">
                    <tr>
                      <td colspan="5" class="text-center p-4">No doctor workload data available</td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
              <div *ngIf="!doctorWorkload || doctorWorkload.length === 0" class="text-center p-4">
                No doctor workload data available
              </div>
            </p-scrollPanel>
          </p-card>
        </div>
        
        <!-- Appointments Trend Chart -->
        <div class="col-12 p-2">
          <p-card header="Appointments Trend" styleClass="shadow-2">
            <div class="mb-3 flex justify-content-end">
              <p-dropdown [options]="trendPeriodOptions" [(ngModel)]="selectedTrendPeriod" 
                optionLabel="label" (onChange)="loadAppointmentsTrend()"></p-dropdown>
            </div>
            <div [style.height]="isMobile ? '220px' : '300px'" class="chart-container">
              <p-chart type="line" [data]="chartData.appointmentsTrend" [options]="getChartOptions('line')"></p-chart>
            </div>
          </p-card>
        </div>
      </div>
    </div>
    
    <p-toast></p-toast>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .chart-container {
      width: 100%;
      position: relative;
    }
    
    :host ::ng-deep .p-card {
      height: 100%;
    }
    
    :host ::ng-deep .p-card .p-card-body {
      padding: 1rem;
    }
    
    :host ::ng-deep .p-card .p-card-title {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    
    @media screen and (max-width: 768px) {
      :host ::ng-deep .p-card .p-card-body {
        padding: 0.75rem;
      }
      
      :host ::ng-deep .p-card .p-card-title {
        font-size: 0.875rem;
      }
      
      :host ::ng-deep .p-dropdown {
        font-size: 0.875rem;
      }
      
      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th,
      :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
        padding: 0.5rem;
        font-size: 0.75rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  summary: any = null;
  doctorWorkload: any[] = [];
  patientsDemographics: any = null;
  appointmentsTrend: any[] = [];
  isMobile = false;
  
  // Chart data
  chartData: any = {
    appointmentStatus: null,
    weeklyAppointments: null,
    genderDistribution: null,
    ageDistribution: null,
    appointmentsTrend: null
  };
  
  // Trend period dropdown
  trendPeriodOptions = [
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 30 Days', value: 30 },
    { label: 'Last 90 Days', value: 90 }
  ];
  selectedTrendPeriod: any = this.trendPeriodOptions[1]; // Default to 30 days

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  getChartOptions(chartType: string): any {
    const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
    const fontSize = this.isMobile ? 10 : 12;
    const titleFontSize = this.isMobile ? 12 : 14;
    
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: fontFamily,
              size: fontSize
            },
            boxWidth: this.isMobile ? 10 : 15
          }
        },
        title: {
          font: {
            family: fontFamily,
            size: titleFontSize,
            weight: 'bold'
          }
        },
        tooltip: {
          bodyFont: {
            family: fontFamily,
            size: fontSize
          },
          titleFont: {
            family: fontFamily,
            size: fontSize
          }
        }
      }
    };
    
    switch (chartType) {
      case 'pie':
      case 'doughnut':
        return {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: {
              ...baseOptions.plugins.legend
            }
          }
        };
        
      case 'bar':
        return {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                font: {
                  family: fontFamily,
                  size: fontSize
                }
              },
              grid: {
                display: !this.isMobile
              }
            },
            x: {
              ticks: {
                font: {
                  family: fontFamily,
                  size: fontSize
                },
                maxRotation: this.isMobile ? 45 : 0
              },
              grid: {
                display: false
              }
            }
          }
        };
        
      case 'horizontalBar':
        return {
          ...baseOptions,
          indexAxis: 'y',
          plugins: {
            ...baseOptions.plugins,
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                font: {
                  family: fontFamily,
                  size: fontSize
                }
              },
              grid: {
                display: !this.isMobile
              }
            },
            y: {
              ticks: {
                font: {
                  family: fontFamily,
                  size: fontSize
                }
              },
              grid: {
                display: false
              }
            }
          }
        };
        
      case 'line':
        return {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                font: {
                  family: fontFamily,
                  size: fontSize
                }
              },
              grid: {
                display: !this.isMobile
              }
            },
            x: {
              ticks: {
                font: {
                  family: fontFamily,
                  size: fontSize
                },
                maxRotation: this.isMobile ? 45 : 0,
                maxTicksLimit: this.isMobile ? 7 : 15
              },
              grid: {
                display: false
              }
            }
          }
        };
        
      default:
        return baseOptions;
    }
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Get dashboard summary
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.createAppointmentStatusChart();
        this.createWeeklyAppointmentsChart();
        
        // Load additional data
        this.loadDoctorsWorkload();
        this.loadPatientsDemographics();
        this.loadAppointmentsTrend();
      },
      error: (err) => {
        this.handleError(err, 'Failed to load dashboard summary');
        this.loading = false;
      }
    });
  }

  loadDoctorsWorkload(): void {
    this.dashboardService.getDoctorsWorkload().subscribe({
      next: (data) => {
        this.doctorWorkload = data.doctorWorkloads || [];
      },
      error: (err) => {
        this.handleError(err, 'Failed to load doctors workload');
      }
    });
  }

  loadPatientsDemographics(): void {
    this.dashboardService.getPatientsDemographics().subscribe({
      next: (data) => {
        this.patientsDemographics = data;
        this.createGenderDistributionChart();
        this.createAgeDistributionChart();
      },
      error: (err) => {
        this.handleError(err, 'Failed to load patients demographics');
      }
    });
  }

  loadAppointmentsTrend(): void {
    const days = this.selectedTrendPeriod.value;
    this.dashboardService.getAppointmentsTrend(days).subscribe({
      next: (data) => {
        this.appointmentsTrend = data.trend || [];
        this.createAppointmentsTrendChart();
        this.loading = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to load appointments trend');
        this.loading = false;
      }
    });
  }

  createAppointmentStatusChart(): void {
    if (!this.summary || !this.summary.appointmentsByStatus) return;
    
    const statusData = this.summary.appointmentsByStatus;
    
    this.chartData.appointmentStatus = {
      labels: ['Scheduled', 'Completed', 'Cancelled'],
      datasets: [{
        data: [statusData.scheduled, statusData.completed, statusData.cancelled],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
      }]
    };
  }

  createWeeklyAppointmentsChart(): void {
    if (!this.summary || !this.summary.weeklyAppointmentsByDay) return;
    
    const weekData = this.summary.weeklyAppointmentsByDay;
    const dayLabels = this.isMobile 
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Map the weeklyAppointmentsByDay to an array based on the day index
    const data = dayLabels.map((_, i) => {
      const dayOfWeek = i as unknown as DayOfWeek; // Sunday = 0, Monday = 1, etc.
      return weekData[dayOfWeek] || 0;
    });
    
    this.chartData.weeklyAppointments = {
      labels: dayLabels,
      datasets: [{
        label: 'Appointments',
        data: data,
        backgroundColor: '#42A5F5'
      }]
    };
  }

  createGenderDistributionChart(): void {
    if (!this.patientsDemographics || !this.patientsDemographics.genderDistribution) return;
    
    const genderData = this.patientsDemographics.genderDistribution;
    const maleCount = genderData.find((g: any) => g.gender === 0)?.count || 0;
    const femaleCount = genderData.find((g: any) => g.gender === 1)?.count || 0;
    
    this.chartData.genderDistribution = {
      labels: ['Male', 'Female'],
      datasets: [{
        data: [maleCount, femaleCount],
        backgroundColor: ['#42A5F5', '#EC407A']
      }]
    };
  }

  createAgeDistributionChart(): void {
    if (!this.patientsDemographics || !this.patientsDemographics.ageDistribution) return;
    
    const ageData = this.patientsDemographics.ageDistribution;
    
    this.chartData.ageDistribution = {
      labels: ageData.map((a: any) => a.ageGroup),
      datasets: [{
        label: 'Patients',
        data: ageData.map((a: any) => a.count),
        backgroundColor: '#7E57C2'
      }]
    };
  }

  createAppointmentsTrendChart(): void {
    if (!this.appointmentsTrend || this.appointmentsTrend.length === 0) return;
    
    // Format dates for better display
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', 
        this.isMobile ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric' }
      );
    };
    
    // If mobile, reduce the number of labels to prevent overcrowding
    let trend = [...this.appointmentsTrend];
    if (this.isMobile && trend.length > 10) {
      const skipFactor = Math.ceil(trend.length / 10);
      trend = trend.filter((_, i) => i % skipFactor === 0);
    }
    
    this.chartData.appointmentsTrend = {
      labels: trend.map((item: any) => formatDate(item.date)),
      datasets: [{
        label: 'Appointments',
        data: trend.map((item: any) => item.count),
        borderColor: '#26A69A',
        backgroundColor: 'rgba(38, 166, 154, 0.1)',
        borderWidth: this.isMobile ? 1 : 2,
        fill: true,
        tension: 0.3
      }]
    };
  }

  handleError(error: any, fallbackMessage: string): void {
    console.error(error);
    
    let errorMessage = fallbackMessage;
    if (error instanceof Error) {
      errorMessage = error.message || fallbackMessage;
    }
    
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    });
  }
}

// Helper enum to match backend
enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}