import { HtmlDefinition, View } from 'john-smith/view';
import Action from './action';
import Separator from './separator';

export default class ActionView implements View {
  constructor(private readonly action: Action | Separator) {}

  template(): HtmlDefinition {
    const action = this.action;
    if (action instanceof Separator) {
      return (
        <li>
          <hr class="dropdown-divider" />
        </li>
      );
    } else {
      return (
        <li>
          <a
            href="#"
            class="dropdown-item"
            $className={{ disabled: action.disabled, 'link-danger': action.isDanger }}
            _click={() => {
              if (!action.disabled.getValue()) {
                action.execute();
              }
            }}
          >
            <span>{action.title}</span>
          </a>
        </li>
      );
    }
  }

  // init(dom: js.IDom, action: Action) {
  //     const container = dom('li');
  //     const link = dom('a');
  //
  //     dom('li').className('disabled').observes(action.disabled);
  //
  //     dom('span').observes(action.title);
  //
  //     if (action.isDanger) {
  //         //link.$.prepend('<span class="danger">!</span>');
  //         container.$.addClass('danger');
  //     }
  //
  //     link.on('click').react(() => {
  //         if (!container.$.is('.disabled')) {
  //             action.execute();
  //         }
  //     });
  // }
}
