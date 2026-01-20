import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FieldInputForm } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private form: FormBuilder
  ) { }
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

    // if(inputCtrl.status == 'INVALID') return AppText.err_field_invalid;

    if (errors) {
    // console.log(errors);

      if (errors['existCode']) return 'The entered code is already registered';
      if (errors['repeated']) return 'The code is already added';
      if (errors['invalidReviewDate']) return 'The date must be one year after the date of release';

      if (errors['minlength']) {
        const min = errors['minlength']['requiredLength'];
        return `The field must be at least ${min} characters long.`;
      }
      if (errors['min']) {
        const min = errors['min']['min'];
        return `The minimum value is ${min}`;
      }
      if (errors['max']) {
        const min = errors['max']['max'];
        return `The maximum value is ${min}`;
      }
      if (errors['email']) return 'Enter a valid email address';
      if (errors['maxlength']) {
        const reqLength = errors['maxlength']['requiredLength'];
        return `The field must have a maximum of ${reqLength} characters`;
      }
      if (errors['noMatchPassword']) return 'Passwords do not match';
      if (errors['required']) return 'Field is required';
      if (errors['pattern'] && fieldInput.includes('password')) return 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character: .@$!%*?&'
    }

    if (inputCtrl.touched && inputCtrl.status == "INVALID") return 'Enter a valid value';

    const passwordFields = ['password', 'new_password', 'confirm_password'];
    if (passwordFields.includes(fieldInput)) {

      const newPassword = formCtrl.get('new_password') || formCtrl.get('password')!;
      const confirmPassword = formCtrl.get('confirm_password')!;

      if (confirmPassword && newPassword) {
        if (newPassword?.value !== confirmPassword?.value) {
          confirmPassword.setErrors({ noMatchPassword: true });
          return 'Passwords do not match';
        } else {
          confirmPassword.setErrors(null);
        }
      }
    }

    return '';
  }
}
