import { InputType, InputTypeVariant } from '../api';
import { AbstractTypedCommand } from './abstract-command';

type GetInputTypesDto = { i: undefined | { _: string; l: string; v: 1 | undefined }[] };
export class GetInputTypesCommand extends AbstractTypedCommand<InputType[], GetInputTypesDto> {
  public code = 'get_input_types';
  public message = 'Loading job data map types';

  public constructor() {
    super({});
  }

  public typedMapper = (dto: GetInputTypesDto): InputType[] => {
    if (!dto.i) {
      return [];
    }

    return dto.i.map((x) => ({
      code: x['_'],
      label: x['l'],
      hasVariants: !!x['v'],
    }));
  };
}

type GetInputTypeVariantsDto = { i: undefined | { _: string; l: string }[] };
export class GetInputTypeVariantsCommand extends AbstractTypedCommand<
  InputTypeVariant[],
  GetInputTypeVariantsDto
> {
  public code = 'get_input_type_variants';
  public message: string;

  public constructor(inputType: InputType) {
    super({
      inputTypeCode: inputType.code,
    });

    this.message = 'Loading options for type ' + inputType.label;
  }

  public typedMapper = (dto: GetInputTypeVariantsDto): InputTypeVariant[] => {
    if (!dto.i) {
      return [];
    }

    return dto.i.map((x) => ({
      value: x['_'],
      label: x['l'],
    }));
  };
}
