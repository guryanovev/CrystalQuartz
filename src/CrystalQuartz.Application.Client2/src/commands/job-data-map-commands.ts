import { InputType, InputTypeVariant } from '../api';
import { AbstractCommand } from './abstract-command';

export class GetInputTypesCommand extends AbstractCommand<InputType[]> {
  public code = 'get_input_types';
  public message = 'Loading job data map types';

  public constructor() {
    super();
  }

  public mapper = (dto: any): InputType[] => {
    if (!dto.i) {
      return [];
    }

    return dto.i.map((x: any) => ({
      code: x['_'],
      label: x['l'],
      hasVariants: !!x['v'],
    }));
  };
}

export class GetInputTypeVariantsCommand extends AbstractCommand<InputTypeVariant[]> {
  public code = 'get_input_type_variants';
  public message = ''; // todo

  public constructor(inputType: InputType) {
    super();

    this.message = 'Loading options for type ' + inputType.label;

    this.data = {
      inputTypeCode: inputType.code,
    };
  }

  public mapper = (dto: any): InputTypeVariant[] => {
    if (!dto.i) {
      return [];
    }

    return dto.i.map((x: any) => ({
      value: x['_'],
      label: x['l'],
    }));
  };
}
