import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScannerComponent } from './create-scanner.component';

describe('CreateScannerComponent', () => {
  let component: CreateScannerComponent;
  let fixture: ComponentFixture<CreateScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
