import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fqa } from './fqa';

describe('Fqa', () => {
  let component: Fqa;
  let fixture: ComponentFixture<Fqa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fqa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fqa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
