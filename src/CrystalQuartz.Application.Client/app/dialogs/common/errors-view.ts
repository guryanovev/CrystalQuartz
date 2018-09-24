import { ErrorMessage } from '../../api';

export class ErrorsView implements js.IView<ErrorMessage[]> {
    template = `
<div class="properties-panel">
    <header>Errors</header>
    <ul class="errors"></ul>
</div>`;

    init(dom: js.IDom, errors: ErrorMessage[]) {
        dom('ul').observes(errors, ErrorMessageView);
    }
}

class ErrorMessageView implements js.IView<ErrorMessage> {
    template = `<li class="error-message"></li>`;

    init(dom: js.IDom, errorMessage: ErrorMessage) {
        const $li = dom('li');
        $li.observes(errorMessage.text);
        $li.$.css('padding-left', (errorMessage.level * 15) + 'px');
    }
}