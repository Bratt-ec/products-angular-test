import { AbstractControl } from "@angular/forms";

export class AppValidation {

    static urlImage(control: AbstractControl) {
        const value = control.value;
        if (!value) return null;
        const regex = /^https?:\/\/.*\/.*\.(png|webp|jpeg|jpg)\??.*$/gmi;
        return regex.test(value) ? null : { urlImage: true };
    }

    static todayMinDate(control: AbstractControl) {
        const value = control.value;
        if (!value) return null;
        const date = new Date(value);
        const today = new Date();
        console.log(date.getDate(), today.getDate(), date.getMonth(), today.getMonth(), date.getFullYear(), today.getFullYear());

        if (date.getDate() + 1 < today.getDate() || date.getMonth() < today.getMonth() || date.getFullYear() < today.getFullYear()) return { todayMinDate: true };
        return null;
    }
}