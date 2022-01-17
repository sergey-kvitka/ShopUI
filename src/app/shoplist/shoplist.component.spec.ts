import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoplistComponent } from './shoplist.component';

describe('ShoplistComponent', () => {
  let component: ShoplistComponent;
  let fixture: ComponentFixture<ShoplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoplistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
