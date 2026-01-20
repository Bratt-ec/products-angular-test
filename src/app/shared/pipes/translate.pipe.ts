import { LangService } from '@/core/services/lang.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(
    private lang: LangService
  ) { }

  transform(key: string, replace?:any): unknown {
    return this.lang._(key, replace);
  }

}
