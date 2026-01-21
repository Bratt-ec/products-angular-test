import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FieldInputForm } from '../models/form.model';
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private form: FormBuilder = inject(FormBuilder)
  private lang = inject(LangService)
  /**
   * Builds a form group based on the given base form.
   *
   * @param {FieldInputForm[]} baseForm - The base form to build the form group from.
   * @return {FormGroup} The built form group.
   */
  build(baseForm: FieldInputForm[]): FormGroup {
    const group = this.form.group({});
    for (const iForm of baseForm) {
      if (iForm.multiple && iForm.inputs) {
        if (!iForm.isSurvey) {
          for (const iMultipleInput of iForm.inputs) {
            if (iMultipleInput.type == 'radio' && !iForm.defaultValue) {
              group.addControl(iMultipleInput.formControlName, new FormControl(null, { validators: iMultipleInput.validations }))
            } else {
              group.addControl(iMultipleInput.formControlName, new FormControl(iMultipleInput.value, { validators: iMultipleInput.validations }))
            }
          }
        } else {
          group.addControl(iForm.formControlName, new FormControl([], { validators: iForm.validations }))
        }
      } else {
        if (!iForm.multiple && iForm.inputs) {
          for (const iMultipleInput of iForm.inputs) {
            group.addControl(iMultipleInput.formControlName, new FormControl(iMultipleInput.value, { validators: iMultipleInput.validations }))
          }
        }
        if (iForm.formControlName !== '') {
          group.addControl(iForm.formControlName, new FormControl(iForm.value, { validators: iForm.validations }))
        }
      }
    }
    return group;
  }

  /**
   * Returns the validation message for the specified input field in a form.
   *
   * @param {string} fieldInput - The name of the input field.
   * @param {FormGroup<any>} formCtrl - The form control object.
   * @return {string} The validation message for the input field.
   */
  validate(fieldInput: string, formCtrl: FormGroup<any>): string {

    const inputCtrl = formCtrl.get(fieldInput)!;

    if (!inputCtrl) return '';

    const { errors } = inputCtrl!;

    if (!inputCtrl.touched) return '';

    if (errors) {

      if (errors['idRepeated']) return this.lang._('validations.id_repeated');
      if (errors['invalidReviewDate']) return this.lang._('validations.invalid_review_date');
      if (errors['urlImage']) return this.lang._('validations.url_image');

      if (errors['minlength']) {
        const min = errors['minlength']['requiredLength'];
        return this.lang._('validations.min_length', { min });
      }
      if (errors['min']) {
        const min = errors['min']['min'];
        return this.lang._('validations.min_value', { min });
      }
      if (errors['max']) {
        const max = errors['max']['max'];
        return this.lang._('validations.max_value', { max });
      }
      if (errors['email']) return this.lang._('validations.email');
      if (errors['maxlength']) {
        const reqLength = errors['maxlength']['requiredLength'];
        return this.lang._('validations.max_length', { reqLength });
      }
      if (errors['required']) return this.lang._('validations.required');
    }

    if (inputCtrl.touched && inputCtrl.status == "INVALID") return this.lang._('validations.required');

    return '';
  }
}
