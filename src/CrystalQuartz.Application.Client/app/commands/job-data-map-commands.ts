import {AbstractCommand} from './abstract-command';
import {InputType} from '../api';

import __map from 'lodash/map';
import {InputTypeVariant} from '../api';

export class GetInputTypesCommand extends AbstractCommand<InputType[]> {
    constructor() {
        super();

        this.code = 'get_input_types';
        this.message = 'Loading job data map types';
    }

    mapper = (dto: any): InputType[] => {
        if (!dto.i) {
            return [];
        }

        return __map(dto.i, x => ({
            code: x['_'],
            label: x['l'],
            hasVariants: !!x['v']
        }));
    };
}

export class GetInputTypeVariantsCommand extends AbstractCommand<InputTypeVariant[]> {
    constructor(inputType: InputType) {
        super();

        this.code = 'get_input_type_variants';
        this.message = 'Loading options for type ' + inputType.label;
        this.data = {
            inputTypeCode: inputType.code
        };
    }

    mapper = (dto: any): InputTypeVariant[] => {
        if (!dto.i) {
            return [];
        }

        return __map(dto.i, x => ({
            value: x['_'],
            label: x['l']
        }));
    };
}