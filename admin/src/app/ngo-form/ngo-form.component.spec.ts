import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgoFormComponent } from './ngo-form.component';

describe('NgoFormComponent', () => {
  let component: NgoFormComponent;
  let fixture: ComponentFixture<NgoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
