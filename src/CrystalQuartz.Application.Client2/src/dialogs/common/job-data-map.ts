import { BidirectionalValue, ObservableList, ObservableValue } from 'john-smith/reactive';
import { Event } from 'john-smith/reactive/event';
import { InputType, InputTypeVariant } from '../../api';
import { GetInputTypeVariantsCommand } from '../../commands/job-data-map-commands';
import { CommandService } from '../../services';

export class JobDataMapItem {
  public value = new BidirectionalValue<string | null>((_) => true, null);
  public selectedVariantValue = new ObservableValue<string | null>(null);
  public error = new ObservableValue<string | null>(null);
  public inputTypeCode = new BidirectionalValue<string | null>(
    (candidate) => this.setInputTypeCode(candidate),
    null
  );
  public variants = new ObservableList<InputTypeVariant>();
  public hasVariants = new ObservableValue<boolean>(false);

  public onRemoved = new Event<any>();

  public constructor(
    public key: string,
    public inputTypes: InputType[],
    public cachedVariants: { [inputTypeCode: string]: InputTypeVariant[] },
    private commandService: CommandService
  ) {
    if (inputTypes.length > 0) {
      this.inputTypeCode.requestUpdate(inputTypes[0].code);
    }
  }

  public remove() {
    this.onRemoved.trigger(null);
  }

  private setInputTypeCode(value: string | null) {
    if (value === null) {
      return;
    }

    const inputType = this.inputTypes.find((x) => x.code === value);
    if (inputType && inputType.hasVariants) {
      if (this.cachedVariants[inputType.code]) {
        this.setVariants(this.cachedVariants[inputType.code]);
      } else {
        this.commandService
          .executeCommand(new GetInputTypeVariantsCommand(inputType))
          .then((variants) => {
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

  public getActualValue(): string {
    if (this.hasVariants.getValue()) {
      return this.selectedVariantValue.getValue()!;
    }

    return this.value.getValue()!;
  }

  private setVariants(variants: InputTypeVariant[]) {
    this.variants.setValue(variants);

    if (variants.length > 0) {
      this.selectedVariantValue.setValue(variants[0].value);
    }
  }
}
