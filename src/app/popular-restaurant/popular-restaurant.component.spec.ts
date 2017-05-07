import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularRestaurantComponent } from './popular-restaurant.component';

describe('PopularRestaurantComponent', () => {
  let component: PopularRestaurantComponent;
  let fixture: ComponentFixture<PopularRestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularRestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
