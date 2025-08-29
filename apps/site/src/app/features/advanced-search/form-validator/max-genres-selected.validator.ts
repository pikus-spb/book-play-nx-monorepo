import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxGenresSelectedValidator(max = 3): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const formValue = formGroup.value;
    if (formValue) {
      const genresNum = Object.entries(formValue).reduce(
        (memo, [key, value]) => {
          if (value) {
            memo++;
          }
          return memo;
        },
        0
      );

      if (genresNum > max) {
        return { maxGenres: { actual: genresNum, max } };
      }
    }
    return null;
  };
}
