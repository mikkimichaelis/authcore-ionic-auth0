export interface ILocationService {
    getGps(): Promise<{lat: number, lon: number}>;
    getZipGps(zip: string): Promise<{lat: number, lon: number}>;
}