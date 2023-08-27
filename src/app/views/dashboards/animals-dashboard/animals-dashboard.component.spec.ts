import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalsDashboardComponent } from './animals-dashboard.component';

describe('AnimalsDashboardComponent', () => {
  let component: AnimalsDashboardComponent;
  let fixture: ComponentFixture<AnimalsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimalsDashboardComponent]
    });
    fixture = TestBed.createComponent(AnimalsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
