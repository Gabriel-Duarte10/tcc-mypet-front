import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedAdsComponent } from './reported-ads.component';

describe('ReportedAdsComponent', () => {
  let component: ReportedAdsComponent;
  let fixture: ComponentFixture<ReportedAdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportedAdsComponent]
    });
    fixture = TestBed.createComponent(ReportedAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
