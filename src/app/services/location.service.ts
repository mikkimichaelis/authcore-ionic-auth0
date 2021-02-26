import { Injectable } from '@angular/core';
import { ILocationService } from './location.service.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationService implements ILocationService {

  geo: any;

  // private geo: Geolocation
  constructor() { }

  async getGps(): Promise<{lat: number, lon: number}> {
    const pos = await this.geo.getCurrentPosition();
    return { lat: pos.coords.latitude, lon: pos.coords.longitude };
  }

  async getZipGps(zip: string): Promise<{lat: number, lon: number}> {
    return Promise.resolve({ lat: 39.8249268571429, lon: -84.8946604285714 });
  }
}
