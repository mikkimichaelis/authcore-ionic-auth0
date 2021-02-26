import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  get darkTheme(): string {
    return this.settings.darkTheme.toString();
  }
  set darkTheme(value: string) {
    this.settings.darkTheme = value === 'true' ? true : false;
  }

  constructor(private settings: SettingsService) { }

  ngOnInit() {
  }

}
