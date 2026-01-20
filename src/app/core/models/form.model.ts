import { ValidatorFn } from "@angular/forms";

export type TypeInput = "text" | "email" | "password" | "number" | "date" | "radio" | "checkbox" | "select" | "phone" | "textarea" | "country";

export type InputMode = "decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url"

export interface FieldInputForm {
  name?: string;
  type: TypeInput;
  value?: any;
  label?: string;
  formControlName: string;
  placeholder?: string;
  maxLength?: number;
  multiple?: boolean;
  orientation?: 'horizontal' | 'vertical';
  /** Options that have include if type = select */
  minDateLimit?: Date;
  todayLimit?: boolean;
  hidden?: boolean;
  options?: FieldOptionSelect[];
  inputs?: FieldInputForm[];
  validations?: ValidatorFn[];
  fill?: "outline" | "solid";
  shape?: "round";
  /** Ionicon or custom icon name to slot end */
  iconSuffix?: string;
  /** Ionicon or custom icon name to slot start */
  iconPrefix?: string;
  inputMode?: InputMode;
  defaultValue?: boolean;
  isSurvey?: boolean;
  readonly?: boolean;
}

export interface FieldOptionSelect {
  value: string;
  label: string;
}