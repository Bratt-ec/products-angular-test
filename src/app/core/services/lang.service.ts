import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  private _language: any;

  private _locale: string = 'en';

  public get locale(): string {
    return this._locale;
  }
  public set locale(value: string) {
    this._locale = value;
  }

  public get lang(): any {
    return this._language;
  }
  public set lang(value: any) {
    this._language = value;
  }

  constructor(
    private http: HttpClient
  ) { }

  async load() {
    const response = await lastValueFrom(this.http.get("assets/lang/lang.json", { responseType: 'json' }));
    console.log(response);
    this._language = response;
  }

  _(key: string, replace?: any) {

    if (!key.match(/^[\w-]+(?:\.[\w-]+)+$/)) {
      // return "Invalid key";
      return key;
    }
    let segments = key.split('.');
    const lastSegment = segments[segments.length - 1];

    if (this._language) {
      let translation = this.search(segments, this._language[this._locale]);
      if (translation !== false) {
        return this.replaceKeys(translation, replace);
      }
      return lastSegment;
    }

    return lastSegment;
  }

  /**
   * @description
   * Find the keys to the translations
   * @param {Array} segments
   * @param {Array} data
   * @returns {Boolean | Array} Key
   */
  private search(segments: any, data: any): any {
    let segment = segments[0];
    if (typeof data[segment] == "undefined") {
      return false;
    }
    if (segments.length > 1) {
      segments.shift();
      return this.search(segments, data[segment]);
    }
    return data[segment];
  }

  /**
   * @description
   * Receive a translations object and replace a translation key inside that object
   * @param {Array} translation Array of translations
   * @param {Array} replace Translation key
   * @returns {Array} Translation key
   */
  private replaceKeys(translation: any, replace: any): any {
    if (replace) {
      for (const key in replace) {
        if (replace[key]) {
          translation = translation.replace(':' + key, replace[key]);
        } else {
          translation = translation.replace(':' + key, '');
        }
      }
    }
    return translation;
  }
}
