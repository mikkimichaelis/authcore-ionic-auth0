import { Component, Input, OnInit } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'date-badge',
  templateUrl: './date-badge.component.html',
  styleUrls: ['./date-badge.component.scss'],
})
export class DateBadgeComponent implements OnInit {

@Input() date: DateTime;
  
  public get month(): string {
    return this.date.toLocaleString({ month: 'long' });
  }

  public get day(): string {
    return this.date.toLocaleString({ day: '2-digit' });
  }

  public get dow(): string {
    return this.date.toLocaleString({ weekday: 'long' }).substring(0, 3);
  }

  public get time(): string {
    return this.date.toLocaleString({ hour: '2-digit', minute: '2-digit', hour12: true }); //=> '11:32'
  }

  constructor() { }

  ngOnInit() {}

}
