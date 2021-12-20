export interface Validator {
  validate(val: any): void;
}

const EMAIL_PATTERN = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/i;
export class EmptyValidator implements Validator {
  message: string;
  allowEmpty: boolean;

  constructor(message: string, allowEmpty: boolean = false) {
    this.message = message;
    this.allowEmpty = allowEmpty;
  }

  validate(val: any): void {
    if (val === undefined || val === null || val === '') {
      if (this.allowEmpty) return;
      throw new Error(this.message);
    }
  }
}

class EmailValidator implements Validator {
  validate(val: any): void {
    if (!val) return;
    if (!EMAIL_PATTERN.test(val)) {
      throw new Error(`${val} 'Is Not A Valid Email Format')`);
    }
  }
}

const NAME_PATH_PATTERN = /^([a-zA-Z0-9_.-])+$/i;
class NamePathValidator implements Validator {
  validate(val: any): void {
    if (!NAME_PATH_PATTERN.test(val)) {
      throw new Error(`${val} 'Is Not A Valid Name Path Format')`);
    }
  }
}

export class PatternValidator implements Validator {
  pattern: RegExp;
  allowEmpty: boolean;
  message?: string;

  constructor(pattern: RegExp, allowEmpty: boolean = false, message?: string) {
    this.pattern = pattern;
    this.allowEmpty = allowEmpty;
    this.message = message;
  }

  validate(val: any): void {
    if (!val && !this.allowEmpty) {
      throw new Error('Field cannot be empty!');
    }
    if (!this.pattern.test(val)) {
      let mesg = this.message;
      if (!mesg) mesg = `${val} 'Is Not A Valid Format')`;
      throw new Error(mesg);
    }
  }
}

class PositiveNumberValidator implements Validator {
  validate(val: any): void {
    if (val <= 0) {
      throw new Error('Expect A Number Greater Than 0');
    }
  }
}

class ZeroAndGreaterValidator implements Validator {
  validate(val: any): void {
    if (val < 0) {
      throw new Error('Expect A Number Equals Or Greater Than 0');
    }
  }
}

export class NumberRangeValidator {
  min: number;
  max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  validate(val: any): void {
    if (val < this.min || val > this.max) {
      throw new Error(val + " is not in the range " + this.min + " - " + this.max);
    }
  }
}

export const EMPTY_VALIDATOR: Validator = new EmptyValidator('Field Cannot Be Empty');
export const EMAIL_VALIDATOR: Validator = new EmailValidator();
export const NAME_VALIDATOR: Validator = new NamePathValidator();
export const POSITIVE_NUMBER_VALIDATOR: Validator = new PositiveNumberValidator();
export const ZERO_AND_GREATER_VALIDATOR: Validator = new ZeroAndGreaterValidator();
