import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgoDetailComponent } from './ngo-detail.component';

describe('NgoDetailComponent', () => {
  let component: NgoDetailComponent;
  let fixture: ComponentFixture<NgoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
