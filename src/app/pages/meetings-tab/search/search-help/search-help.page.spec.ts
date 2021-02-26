import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchHelpPage } from './search-help.page';

describe('SearchHelpPage', () => {
  let component: SearchHelpPage;
  let fixture: ComponentFixture<SearchHelpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchHelpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchHelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
