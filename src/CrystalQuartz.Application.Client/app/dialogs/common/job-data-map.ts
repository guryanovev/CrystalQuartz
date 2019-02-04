import {InputType} from '../../api';
import {InputTypeVariant} from '../../api';

import __find from 'lodash/find';
import {CommandService} from '../../services';
import {GetInputTypeVariantsCommand} from '../../commands/job-data-map-commands';

export class JobDataMapItem {
    value = new js.ObservableValue<string>();
    selectedVariantValue = new js.ObservableValue<string>();
    error = new js.ObservableValue<string>();
    inputTypeCode = new js.ObservableValue<string>();
    variants = new js.ObservableList<InputTypeVariant>();
    hasVariants = new js.ObservableValue<boolean>();

    onRemoved = new js.Event();

    constructor(
        public key: string,
        public inputTypes: InputType[],
        public cachedVariants: { [inputTypeCode: string]: InputTypeVariant[] },
        private commandService: CommandService) {

        if (inputTypes.length > 0) {
            this.setInputTypeCode(inputTypes[0].code);
        }
    }

    remove() {
        this.onRemoved.trigger();
    }

    setInputTypeCode(value: string) {
        this.inputTypeCode.setValue(value);

        const inputType = __find(this.inputTypes, x => x.code === value);
        if (inputType && inputType.hasVariants) {
            if (this.cachedVariants[inputType.code]) {
                this.setVariants(this.cachedVariants[inputType.code]);
            } else {
                this.commandService
                    .executeCommand(new GetInputTypeVariantsCommand(inputType))
                    .then(variants => {
                        this.cachedVariants[inputType.code] = variants;
                        this.setVariants(variants);
                    });
            }

            this.hasVariants.setValue(true);
        } else {
            this.hasVariants.setValue(false);
            this.variants.setValue([]);
        }
    }

    getActualValue(): string {
        if (this.hasVariants.getValue()) {
            return this.selectedVariantValue.getValue();
        }

        return this.value.getValue();
    }

    private setVariants(variants: InputTypeVariant[]) {
        this.variants.setValue(variants);

        if (variants.length > 0) {
            this.selectedVariantValue.setValue(variants[0].value);
        }
    }
}