import { FormService } from '@/core/services/form.service';
import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'msg-validation',
  imports: [],
  templateUrl: './msg-validation.component.html',
  styleUrl: './msg-validation.component.scss'
})
export class MsgValidationComponent {

  /** Name of de field form assigned */
  @Input() formField!: string;
  /** Text color to message */
  @Input() textColor!: string;
  /** The FormGrup when formField exist */
  @Input() formCtrl!: FormGroup<any>;
  /** Define simple message to show, without use Form @default '' */
  @Input() message: string = '';

  constructor(
    public _form: FormService
  ) { }

  ngOnInit() {
    if (this.formCtrl) {
      if (!this.formField) {
        throw ('err_need_form_field');
      }
    }
  }

  get fieldMsgValidation() {
    return this._form.validate(this.formField, this.formCtrl)
  }

}
