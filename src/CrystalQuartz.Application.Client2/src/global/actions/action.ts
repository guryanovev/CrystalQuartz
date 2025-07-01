import { ObservableValue } from 'john-smith/reactive';

export default class Action {
  public disabled = new ObservableValue<boolean>(false);

  public constructor(
    public title: string,
    private callback: () => void,
    private confirmMessage?: string
  ) {}

  public set enabled(value: boolean) {
    this.disabled.setValue(!value);
  }

  public get isDanger() {
    return !!this.confirmMessage;
  }

  public execute() {
    if (!this.confirmMessage || confirm(this.confirmMessage)) {
      this.callback();
    }
  }
}
