import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalRecomendationComponent } from './final-recomendation.component';

describe('FinalRecomendationComponent', () => {
  let component: FinalRecomendationComponent;
  let fixture: ComponentFixture<FinalRecomendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalRecomendationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalRecomendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
