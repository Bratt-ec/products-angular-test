import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { delay, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  private existingIds:string[] = [];


  checkIdExists(id: string): Observable<boolean> {
    const exists = this.existingIds.includes(id);
    return of(exists).pipe(delay(500)); // Simulate delay
  }

  validateUniqueId(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.checkIdExists(control.value).pipe(
        map(exists => (exists ? { idTaken: true } : null))
      );
    };
  }
}
