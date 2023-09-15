import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoDataService {
  private dbName = 'geoDataDB';
  private dbVersion = 1;
  private db: IDBDatabase | undefined;
  private dbReady: Promise<void>;

  constructor() {
    this.dbReady = this.initDB();
    this.dbReady.then(() => this.preloadData());
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event);
        reject(new Error('Error opening IndexedDB.'));
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('geoData')) {
          db.createObjectStore('geoData');
        }
      };
    });
  }

  public async preloadData(): Promise<void> {
    const baseFiles = ['brazil-states.geojson'];
    const stateCodes = [
      ...Array.from({ length: 7 }, (_, i) => i + 11),
      ...Array.from({ length: 9 }, (_, i) => i + 21),
      ...Array.from({ length: 3 }, (_, i) => i + 31),
      35,
      ...Array.from({ length: 3 }, (_, i) => i + 41),
      ...Array.from({ length: 4 }, (_, i) => i + 50),
    ];

    const stateFiles = stateCodes.map(code => `geojs-${code}-mun.json`);

    const allFiles = [...baseFiles, ...stateFiles];

    for (const file of allFiles) {
      try {
        //console.log(`Loading data for: ${file}`); // Log de depuração
        await this.loadGeoData(file, `assets/${file}`);
        //console.log(`Data loaded for: ${file}`); // Log de depuração
      } catch (error) {
        console.error(`Error loading data for: ${file}`, error);
      }
    }
}


  public async getGeoData(key: string): Promise<any> {
    return new Promise((resolve, reject) => {

      const transaction = this.db?.transaction(['geoData'], 'readonly');
      const objectStore = transaction?.objectStore('geoData');
      const request = objectStore?.get(key);

      request?.addEventListener('success', (event: any) => {
        resolve(event.target.result);
      });

      request?.addEventListener('error', (event) => {
        reject(event);
      });
    });
  }

  public async setGeoData(key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction(['geoData'], 'readwrite');
      const objectStore = transaction?.objectStore('geoData');
      const request = objectStore?.put(data, key);

      request?.addEventListener('success', () => {
        resolve();
      });

      request?.addEventListener('error', (event) => {
        reject(event);
      });
    });
  }

  private async loadGeoData(key: string, url: string): Promise<any> {
    let data = await this.getGeoData(key);
    if (!data) {
      const response = await fetch(url);
      data = await response.json();
      await this.setGeoData(key, data);
    }
    return data;
  }
}
