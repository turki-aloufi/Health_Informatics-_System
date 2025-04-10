import { Injectable } from '@angular/core'
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http'
import { Observable, catchError, map, throwError } from 'rxjs'
import { TokenType } from './token.service'

@Injectable({
  providedIn: 'root',
})
export class PatientDashboardService {
  private apiUrl = 'http://localhost:5098/api'

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error Response:', error)

    let errorMessage = 'An unknown error occurred'

    if (error.error) {
      console.log('Error details:', error.error)

      if (typeof error.error === 'string') {
        errorMessage = error.error
      } else if (typeof error.error === 'object') {
        if (error.error.msg) {
          errorMessage = error.error.msg
        } else if (error.error.message) {
          errorMessage = error.error.message
        } else if (error.error.errors) {
          try {
            errorMessage = JSON.stringify(error.error.errors)
          } catch (e) {
            console.error('Error extracting validation errors:', e)
          }
        }
      }
    }

    return throwError(() => new Error(errorMessage))
  }

  getMyAppointments(): Observable<any> {
    console.log('Fetching patient appointments...')
    return this.http.get<any>(`${this.apiUrl}/Appointments/me`).pipe(
      map(response => {
        console.log('Patient appointments response:', response)
        return response.data
      }),
      catchError(this.handleError),
    )
  }

  getMyProfile(): Observable<any> {
    console.log('Fetching patient profile...')
    return this.http.get<any>(`${this.apiUrl}/PatientProfile/me`).pipe(
      map(response => {
        console.log('Patient profile response:', response)
        return response
      }),
      catchError(this.handleError),
    )
  }

  getAppointmentsSummary(): Observable<any> {
    console.log('Calculating appointments summary...')
    return this.getMyAppointments().pipe(
      map(appointments => {
        // Calculate summary metrics from the appointments data
        const total = appointments.length

        // Filter appointments by status
        const scheduled = appointments.filter((a: any) => a.status === 0).length
        const completed = appointments.filter((a: any) => a.status === 1).length
        const cancelled = appointments.filter((a: any) => a.status === 2).length

        // Filter recent appointments (last 30 days)
        const now = new Date()
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(now.getDate() - 30)

        const recentAppointments = appointments.filter((a: any) => {
          const appointmentDate = new Date(a.appointmentDateTime)
          return appointmentDate >= thirtyDaysAgo
        }).length

        // Filter upcoming appointments
        const upcomingAppointments = appointments.filter((a: any) => {
          const appointmentDate = new Date(a.appointmentDateTime)
          return appointmentDate > now && a.status === 0 // scheduled status
        }).length

        return {
          totalAppointments: total,
          scheduledAppointments: scheduled,
          completedAppointments: completed,
          cancelledAppointments: cancelled,
          recentAppointments: recentAppointments,
          upcomingAppointments: upcomingAppointments,
          appointmentsByStatus: {
            scheduled,
            completed,
            cancelled,
          },
        }
      }),
      catchError(this.handleError),
    )
  }

  getAppointmentsTrend(days: number = 30): Observable<any> {
    console.log(`Calculating appointments trend for ${days} days...`)
    return this.getMyAppointments().pipe(
      map(appointments => {
        // Calculate a trend of appointments over time
        const now = new Date()
        const startDate = new Date(now)
        startDate.setDate(now.getDate() - days + 1) // +1 to include today

        // Create an array of dates for the trend
        const trend = []
        for (let i = 0; i < days; i++) {
          const date = new Date(startDate)
          date.setDate(startDate.getDate() + i)

          // Format the date as ISO string (YYYY-MM-DD)
          const dateStr = date.toISOString().split('T')[0]

          // Count appointments on this date
          const count = appointments.filter((a: any) => {
            const appointmentDate = new Date(a.appointmentDateTime)
            return appointmentDate.toISOString().split('T')[0] === dateStr
          }).length

          trend.push({ date: dateStr, count })
        }

        return { trend }
      }),
      catchError(this.handleError),
    )
  }

  getUpcomingAppointments(): Observable<any> {
    console.log('Fetching upcoming appointments...')
    return this.getMyAppointments().pipe(
      map(appointments => {
        const now = new Date()

        // Filter and sort upcoming appointments
        return appointments
          .filter((a: any) => {
            const appointmentDate = new Date(a.appointmentDateTime)
            return appointmentDate > now && a.status === 0 // scheduled status
          })
          .sort((a: any, b: any) => {
            return (
              new Date(a.appointmentDateTime).getTime() -
              new Date(b.appointmentDateTime).getTime()
            )
          })
          .map((appointment: any) => {
            // Add doctor name (in a real app, this would come from the API)
            return {
              ...appointment,
              doctorName: `Dr. ${this.getDoctorNameById(appointment.doctorId)}`,
            }
          })
      }),
      catchError(this.handleError),
    )
  }

  getAppointmentHistory(): Observable<any> {
    console.log('Fetching appointment history...')
    return this.getMyAppointments().pipe(
      map(appointments => {
        const now = new Date()

        // Filter and sort completed or cancelled appointments
        return appointments
          .filter((a: any) => {
            const appointmentDate = new Date(a.appointmentDateTime)
            return appointmentDate < now || a.status === 1 || a.status === 2 // past date or completed/cancelled
          })
          .sort((a: any, b: any) => {
            // Sort by date descending (most recent first)
            return (
              new Date(b.appointmentDateTime).getTime() -
              new Date(a.appointmentDateTime).getTime()
            )
          })
          .slice(0, 10) // Limit to 10 most recent appointments
          .map((appointment: any) => {
            // Add doctor name (in a real app, this would come from the API)
            return {
              ...appointment,
              doctorName: `Dr. ${this.getDoctorNameById(appointment.doctorId)}`,
            }
          })
      }),
      catchError(this.handleError),
    )
  }

  // Helper method to simulate doctor names (in a real app, doctor data would come from the API)
  private getDoctorNameById(doctorId: number): string {
    const doctorNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Jones',
      'Brown',
      'Davis',
      'Miller',
      'Wilson',
      'Moore',
      'Taylor',
    ]

    // Use the doctor ID to consistently get the same name for the same ID
    const index = doctorId % doctorNames.length
    return doctorNames[index]
  }
}
