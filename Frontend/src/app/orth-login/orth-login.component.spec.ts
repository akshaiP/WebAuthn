import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrthLoginComponent } from './orth-login.component';

describe('OrthLoginComponent', () => {
  let component: OrthLoginComponent;
  let fixture: ComponentFixture<OrthLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrthLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrthLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
