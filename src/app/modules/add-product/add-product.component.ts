import { FormService } from '@/core/services/form.service';
import { VersionService } from '@/core/services/version.service';
import { MsgValidationComponent } from '@/shared/msg-validation/msg-validation.component';
import { TranslatePipe } from '@/shared/pipes/translate.pipe';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { differenceInYears } from 'date-fns';

@Component({
  selector: 'app-add-product',
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule, MsgValidationComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {

  form: FormGroup;

  fieldsForm = ['id', 'name', 'description', 'logo', 'releaseDate', 'reviewDate']

  constructor(
    private fb: FormBuilder,
    private _form: FormService,
    private _version: VersionService
  ) {
    this.form = this.fb.group({
      id: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        [this._version.validateUniqueId()]
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: [null, Validators.required],
      releaseDate: [new Date(), [Validators.required]],
      reviewDate: [new Date(), [Validators.required]]
    });
  }

  isValidReviewDate() {
    const { releaseDate, reviewDate } = this.form.value
    const release = new Date(releaseDate);
    const review = new Date(reviewDate);

    if (isNaN(release.getTime()) || isNaN(review.getTime())) return false;

    console.log(differenceInYears(review, release));

    if (differenceInYears(review, release) < 1) {
      this.form.get('reviewDate')?.setErrors({ invalidReviewDate: true });
      return false;
    }

    return true
  }

  isInvalid(field: string): boolean {
    return Boolean(this._form.validate(field, this.form))
  }

  toLabel(key: string): string {
    const labels: Record<string, string> = {
      id: 'labels.id',
      name: 'labels.name',
      description: 'labels.description',
      logo: 'labels.logo',
      releaseDate: 'labels.release_date',
      reviewDate: 'labels.review_date'
    };
    return labels[key] || key;
  }

  onValidate() {
    this.form.markAllAsTouched();

    const isValidReviewDate = this.isValidReviewDate()

    if (!isValidReviewDate) return
    if (this.form.invalid) return

    this.onCreate()
  }

  onCreate() { }
}
