import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HrSettings } from './hr-settings';

describe('HrSettings', () => {
  let component: HrSettings;
  let fixture: ComponentFixture<HrSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(HrSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
