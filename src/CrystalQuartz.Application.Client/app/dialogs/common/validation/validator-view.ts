export class ValidationError implements js.IView<string> {
    template = '<li></li>';

    init(dom: js.IDom, viewModel: string) {
        dom('li').observes(viewModel);
    }
}

export class ValidatorView implements js.IView<{ errors: js.IObservable<string[]> }> {
    template = '<ul class="cq-validator"></ul>';
    init(dom: js.IDom, viewModel: { errors: js.IObservable<string[]> }) {
        dom('ul').observes(viewModel.errors, ValidationError);
    }
}