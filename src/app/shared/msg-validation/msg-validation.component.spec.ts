import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgValidationComponent } from './msg-validation.component';

describe('MsgValidationComponent', () => {
  let component: MsgValidationComponent;
  let fixture: ComponentFixture<MsgValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsgValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
