import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MeetingListingComponent } from './components/meeting-listing/meeting-listing.component';
import { DateBadgeComponent } from './components/date-badge/date-badge.component';
@NgModule({
  declarations: [MeetingListingComponent, DateBadgeComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MeetingListingComponent,
    DateBadgeComponent,
  ],
  providers: [
  ]
})
export class SharedModule { }
