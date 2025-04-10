import { Component, OnInit, HostListener } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChartModule } from 'primeng/chart'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { ToastModule } from 'primeng/toast'
import { TableModule } from 'primeng/table'
import { DividerModule } from 'primeng/divider'
import { ScrollPanelModule } from 'primeng/scrollpanel'
import { MessageService } from 'primeng/api'
import { PatientDashboardService } from '@/app/services/patient-dashbarod.service'
import { User } from '@/app/models/user.model'
import { Subscription } from 'rxjs'
import { AuthService } from '@/app/services/auth.service'
import { Router } from '@angular/router'

@Component({
  standalone: true,
  selector: 'app-patient-dashboard',
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
    ScrollPanelModule,
  ],
  providers: [MessageService, PatientDashboardService],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css',
})
export class PatientDashboardComponent implements OnInit {
  loading = true
  summary: any = null
  patientProfile: any = null
  upcomingAppointments: any[] = []
  appointmentHistory: any[] = []
  appointmentsTrend: any[] = []
  isMobile = false

  user?: User
  private userSubscription?: Subscription

  // Chart data
  chartData: any = {
    appointmentStatus: null,
    appointmentsTrend: null,
  }

  // Trend period dropdown
  trendPeriodOptions = [
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 30 Days', value: 30 },
    { label: 'Last 90 Days', value: 90 },
  ]
  selectedTrendPeriod: any = this.trendPeriodOptions[1] // Default to 30 days

  constructor(
    private dashboardService: PatientDashboardService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.checkScreenSize()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize()
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768
  }

  ngOnInit(): void {
    this.loadDashboardData()
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user
    })
  }

  getChartOptions(chartType: string): any {
    const fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    const fontSize = this.isMobile ? 10 : 12
    const titleFontSize = this.isMobile ? 12 : 14

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: fontFamily,
              size: fontSize,
            },
            boxWidth: this.isMobile ? 10 : 15,
          },
        },
        title: {
          font: {
            family: fontFamily,
            size: titleFontSize,
            weight: 'bold',
          },
        },
        tooltip: {
          bodyFont: {
            family: fontFamily,
            size: fontSize,
          },
          titleFont: {
            family: fontFamily,
            size: fontSize,
          },
        },
      },
    }

    switch (chartType) {
      case 'pie':
      case 'doughnut':
        return {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: {
              ...baseOptions.plugins.legend,
            },
          },
        }

      case 'line':
        return {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                font: {
                  family: fontFamily,
                  size: fontSize,
                },
              },
              grid: {
                display: !this.isMobile,
              },
            },
            x: {
              ticks: {
                font: {
                  family: fontFamily,
                  size: fontSize,
                },
                maxRotation: this.isMobile ? 45 : 0,
                maxTicksLimit: this.isMobile ? 7 : 15,
              },
              grid: {
                display: false,
              },
            },
          },
        }

      default:
        return baseOptions
    }
  }

  loadDashboardData(): void {
    this.loading = true

    // Get appointments summary
    this.dashboardService.getAppointmentsSummary().subscribe({
      next: data => {
        this.summary = data
        this.createAppointmentStatusChart()

        // Load additional data
        this.loadPatientProfile()
        this.loadUpcomingAppointments()
        this.loadAppointmentHistory()
        this.loadAppointmentsTrend()
      },
      error: err => {
        this.handleError(err, 'Failed to load dashboard summary')
        this.loading = false
      },
    })
  }

  loadPatientProfile(): void {
    this.dashboardService.getMyProfile().subscribe({
      next: data => {
        this.patientProfile = data
      },
      error: err => {
        this.handleError(err, 'Failed to load patient profile')
      },
    })
  }

  loadUpcomingAppointments(): void {
    this.dashboardService.getUpcomingAppointments().subscribe({
      next: data => {
        this.upcomingAppointments = data
      },
      error: err => {
        this.handleError(err, 'Failed to load upcoming appointments')
      },
    })
  }

  loadAppointmentHistory(): void {
    this.dashboardService.getAppointmentHistory().subscribe({
      next: data => {
        this.appointmentHistory = data
      },
      error: err => {
        this.handleError(err, 'Failed to load appointment history')
      },
    })
  }

  loadAppointmentsTrend(): void {
    const days = this.selectedTrendPeriod.value
    this.dashboardService.getAppointmentsTrend(days).subscribe({
      next: data => {
        this.appointmentsTrend = data.trend || []
        this.createAppointmentsTrendChart()
        this.loading = false
      },
      error: err => {
        this.handleError(err, 'Failed to load appointments trend')
        this.loading = false
      },
    })
  }

  navigateToBookingPage() {
    this.router.navigate(['patient/booking'])
  }

  createAppointmentStatusChart(): void {
    if (!this.summary || !this.summary.appointmentsByStatus) return

    const statusData = this.summary.appointmentsByStatus

    this.chartData.appointmentStatus = {
      labels: ['Scheduled', 'Completed', 'Cancelled'],
      datasets: [
        {
          data: [
            statusData.scheduled,
            statusData.completed,
            statusData.cancelled,
          ],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
        },
      ],
    }
  }

  createAppointmentsTrendChart(): void {
    if (!this.appointmentsTrend || this.appointmentsTrend.length === 0) return

    // Format dates for better display
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString(
        'en-US',
        this.isMobile
          ? { month: 'short', day: 'numeric' }
          : { month: 'short', day: 'numeric' },
      )
    }

    // If mobile, reduce the number of labels to prevent overcrowding
    let trend = [...this.appointmentsTrend]
    if (this.isMobile && trend.length > 10) {
      const skipFactor = Math.ceil(trend.length / 10)
      trend = trend.filter((_, i) => i % skipFactor === 0)
    }

    this.chartData.appointmentsTrend = {
      labels: trend.map((item: any) => formatDate(item.date)),
      datasets: [
        {
          label: 'Appointments',
          data: trend.map((item: any) => item.count),
          borderColor: '#26A69A',
          backgroundColor: 'rgba(38, 166, 154, 0.1)',
          borderWidth: this.isMobile ? 1 : 2,
          fill: true,
          tension: 0.3,
        },
      ],
    }
  }

  // Helper functions for formatting and displaying data
  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  formatDateTime(dateStr: string | undefined): string {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  getStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Scheduled',
      1: 'Completed',
      2: 'Cancelled',
    }
    return statusMap[status] || 'Unknown'
  }

  getGenderText(gender: number | undefined): string {
    if (gender === undefined) return 'N/A'
    return gender === 0 ? 'Male' : 'Female'
  }

  handleError(error: any, fallbackMessage: string): void {
    console.error(error)

    let errorMessage = fallbackMessage
    if (error instanceof Error) {
      errorMessage = error.message || fallbackMessage
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000,
    })
  }
}
