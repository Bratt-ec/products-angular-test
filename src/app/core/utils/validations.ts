import { AbstractControl } from "@angular/forms";

export class AppValidation {

    static urlImage(control: AbstractControl) {
        const value = control.value;
        if (!value) return null;
        const regex = /^https?:\/\/.*\/.*\.(png|webp|jpeg|jpg)\??.*$/gmi;
        return regex.test(value) ? null : { urlImage: true };
    }
}