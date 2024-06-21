import {AbstractCommand} from './abstract-command';
import {InputType} from '../api';

import {InputTypeVariant} from '../api';

export class GetInputTypesCommand extends AbstractCommand<InputType[]> {
    code = 'get_input_types';
    message = 'Loading job data map types';

    constructor() {
        super();
    }

    mapper = (dto: any): InputType[] => {
        if (!dto.i) {
            return [];
        }

        return dto.i.map((x: any) => ({
            code: x['_'],
            label: x['l'],
            hasVariants: !!x['v']
        }));
    };
}

export class GetInputTypeVariantsCommand extends AbstractCommand<InputTypeVariant[]> {
    code = 'get_input_type_variants';
    message = ''; // todo

    constructor(inputType: InputType) {
        super();

        this.message = 'Loading options for type ' + inputType.label;

        this.data = {
            inputTypeCode: inputType.code
        };
    }

    mapper = (dto: any): InputTypeVariant[] => {
        if (!dto.i) {
            return [];
        }

        return dto.i.map((x: any) => ({
            value: x['_'],
            label: x['l']
        }));
    };
}
