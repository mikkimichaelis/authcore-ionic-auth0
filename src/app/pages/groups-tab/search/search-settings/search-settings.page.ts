import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PickerController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ISearchSettings } from '../../../../models/search-settings';
import * as _ from "lodash";

@Component({
  selector: 'app-search-settings',
  templateUrl: './search-settings.page.html',
  styleUrls: ['./search-settings.page.scss'],
})
export class SearchSettingsPage implements OnInit {

  @Input() input: ISearchSettings;
  settings: ISearchSettings;

  weekdayOptions = [
    [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ]
  ]

  get gps(): string {
    if( this.settings.gps ) {
      return 'gps';
    } else {
      return 'zipcode';
    }
  }
  set gps(value: string) {
    if( value === 'gps') {
      this.settings.gps = true;
    } else if( value === 'zipcode') {
      this.settings.gps = false;
    }
  }

  get byDay(): string {
    if( this.settings.byAnyDay ) {
      return 'any';
    } else if( this.settings.byDay === 'today' ) {
      return 'today';
    } else {
      return 'specific';
    }
  }
  set byDay(value: string) {
    if( value === 'any') {
      this.settings.byAnyDay = true;
    } else if( value === 'today') {
      this.settings.byAnyDay = false;
      this.settings.byDay = 'today';
    } else if( value === 'specific') {
      this.settings.byAnyDay = false;
      //this.openPicker();
    }
  }

  get byTime(): string {
    if( !this.settings.bySpecificTime && !this.settings.byRelativeTime ) {
      return 'any';
    } else if( this.settings.bySpecificTime ) {
      return 'specific';
    } else if( this.settings.byRelativeTime ) {
      return 'relative';
    } else {
      return null;
    }
  }
  set byTime(value: string) {
    if( value === 'any') {
      this.settings.bySpecificTime = false;
      this.settings.byRelativeTime = false;
    } else if( value === 'specific') {
      this.settings.bySpecificTime = true;
      this.settings.byRelativeTime = false;
      // show time picker
      const date = new Date();
      this.settings.bySpecific.start === null ? date.toUTCString() : this.settings.bySpecific.start;
      this.settings.bySpecific.end  === null ? (new Date((date.setHours(date.getHours() + 2)))).toUTCString() : this.settings.bySpecific.end;
    } else if( value === 'relative') {
      this.settings.bySpecificTime = false;
      this.settings.byRelativeTime = true;
    }
  }

  constructor(private modalCtrl: ModalController, private pickerController: PickerController, private translateService: TranslateService) { }

  ngOnInit() {
    this.settings = _.cloneDeep(this.input);

    const rv = [];
    this.weekdayOptions[0].forEach(async day => {
      let tx = await this.translateService.get(day).toPromise()
      rv.push(tx);
    });
    this.weekdayOptions[0] = rv;
  }

  async save() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    await this.modalCtrl.dismiss(this.settings);
  }

  async cancel() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    await this.modalCtrl.dismiss();
  }

  updateBySpecificTime(property: string, value)  {
    this.settings.bySpecific[property] = value;
  }

  async openPicker(numColumns = 1, numOptions = 7, columnOptions = this.weekdayOptions){
    const picker = await this.pickerController.create({
      columns: this.getColumns(numColumns, numOptions, columnOptions),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            this.settings.byDay = value['col-0'].text;
          }
        }
      ]
    });

    await picker.present();
  }

  getColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }

    return options;
  }

}
