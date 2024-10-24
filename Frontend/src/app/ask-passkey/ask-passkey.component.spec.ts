import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskPasskeyComponent } from './ask-passkey.component';

describe('AskPasskeyComponent', () => {
  let component: AskPasskeyComponent;
  let fixture: ComponentFixture<AskPasskeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskPasskeyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskPasskeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
