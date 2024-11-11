import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalLoginComponent } from './normal-login.component';

describe('OrthLoginComponent', () => {
  let component: NormalLoginComponent;
  let fixture: ComponentFixture<NormalLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormalLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
