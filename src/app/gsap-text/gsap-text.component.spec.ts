import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GsapTextComponent } from './gsap-text.component';

describe('GsapTextComponent', () => {
  let component: GsapTextComponent;
  let fixture: ComponentFixture<GsapTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GsapTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsapTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
