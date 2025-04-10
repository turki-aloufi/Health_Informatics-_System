import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAppointmentFormComponent } from './admin-appointment-form.component';

describe('AdminAppointmentFormComponent', () => {
  let component: AdminAppointmentFormComponent;
  let fixture: ComponentFixture<AdminAppointmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAppointmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAppointmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
