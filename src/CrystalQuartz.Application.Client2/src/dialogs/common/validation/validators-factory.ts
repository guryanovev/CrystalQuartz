export class ValidatorsFactory {
  static required<T>(message: string) {
    return (value: T) => {
      if (!value) {
        return [message];
      }

      return [];
    };
  }

  static isInteger<T>(message: string) {
    return (value: T) => {
      if (value === null || value === undefined) {
        return [];
      }

      const rawValue = value.toString();

      for (let i = 0; i < rawValue.length; i++) {
        const char = rawValue.charAt(i);
        if (char < '0' || char > '9') {
          return [message];
        }
      }

      return [];
    };
  }
}
