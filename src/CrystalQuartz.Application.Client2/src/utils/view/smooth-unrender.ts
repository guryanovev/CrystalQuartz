import { Listenable, ObservableValue } from 'john-smith/reactive';
import { OnUnrender } from 'john-smith/view/hooks';

export class SmoothUnrenderHandler implements OnUnrender {
  private readonly _removing = new ObservableValue<boolean>(false);

  public removing: Listenable<boolean> = this._removing;

  constructor(private readonly _duration: number = 1000) {}

  public onUnrender(unrender: () => void): void {
    this._removing.setValue(true);

    setTimeout(() => {
      unrender();
    }, this._duration);
  }
}
