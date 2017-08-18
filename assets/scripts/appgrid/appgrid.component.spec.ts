import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGridComponent } from './appgrid.component';

describe('AppGridComponent', () => {
  let component: AppGridComponent;
  let fixture: ComponentFixture<AppGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
