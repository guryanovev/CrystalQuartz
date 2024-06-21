import ViewModel from './command-progress-view-model';
import { HtmlDefinition, View } from 'john-smith/view';

export default class CommandProgressView implements View {
    constructor(private readonly viewModel: ViewModel) {
    }

    template(): HtmlDefinition {
        return <div class="progress-indicator">
                <div>
                    <img src="loading.gif" />
                    <p>{this.viewModel.currentCommand}</p>
                </div>
            </div>;
    }

    // todo
    // init(dom: js.IDom, viewModel: ViewModel) {
    //     dom('.js_commandMessage').observes(viewModel.currentCommand);
    //
    //     var timer = null;
    //     viewModel.active.listen((value => {
    //         if (value) {
    //             if (timer) {
    //                 clearTimeout(timer);
    //                 timer = null;
    //             }
    //
    //             dom.$.stop().show();
    //         } else {
    //             timer = setTimeout(() => {
    //                 dom.$.fadeOut();
    //             }, 1000);
    //         }
    //     }));
    // }
}
