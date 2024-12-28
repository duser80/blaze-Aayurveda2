export interface AdjustedFormField {
  label: string;
  name: string;
  field: "field" | "select" | "image" | "slider";
  errors: any;
  required?: boolean;
  inputType?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "date"
    | "checkbox"
    | "radio"
    | "button"
    | "color"
    | "datetime-local"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "time"
    | "url"
    | "week";
  options?: { value: any; name: string }[] | string[];
  min?: number;
  max?: number;
  suggestionText?: string;
  children?: JSX.Element | JSX.Element[];
}

// Adjusted interface with conditional types
export type FormField = AdjustedFormField &
  (
    | { field: "select"; options: { value: any; name: string }[] }
    | { field: "field" | "image"; options?: never }
    | {
        field: "slider";
        options?: never;
        min: number;
        max: number;
        unit: string;
      }
    | {
        field: "field";
        inputType: "date";
        minDate: Date;
        maxDate: Date;
      }
  );
