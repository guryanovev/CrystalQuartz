import { OptionalDisposables } from 'john-smith/common';
import { IDialogViewModel } from './dialog-view-model';
import { DomElement, DomElementClasses, HtmlDefinition, View } from 'john-smith/view';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OnInit } from 'john-smith/view/hooks';

export default abstract class DialogViewBase<T extends IDialogViewModel<any>> implements View, OnInit {
    private _classes: DomElementClasses | null = null;

    constructor(protected readonly viewModel: T, private readonly title?: string) {
    }

    public onInit(root: DomElement | null, domEngine: DomEngine): OptionalDisposables {

        if (root !== null) {
            const classes = root.createClassNames();
            classes.add('showing');

            setTimeout(() => {
                classes.remove('showing');
            }, 10);
        }
    }

    template(): HtmlDefinition {
        console.log('template', this.viewModel);

        return <div class="dialog-container">
            <section class="dialog">
                <header>
                    <a href="#" class="js_close" __click={this.close}>&times;</a>

                    <h2>{this.title ?? 'Title'}</h2>
                </header>

                {this.getBodyContent()}
                {this.getFooterContent()}
            </section>
        </div>;
    }

    protected getBodyContent(): JSX.IElement {
        return <span>todo</span>;
    }

    protected getFooterContent(): JSX.IElement {
        return <footer><span class="flex-fill"></span><a href="#" class="btn btn-secondary" _click={this.viewModel.cancel}>Close</a></footer>;
    }

    protected close() {
        this.viewModel.cancel();
    }

    // abstract template: string;

    // init(dom: js.IDom, viewModel:T) {
    //     dom('.js_close').on('click').react(viewModel.cancel); /* todo: base class */
    //
    //     dom.$.addClass('showing');
    //     setTimeout(() => {
    //         dom.$.removeClass('showing');
    //     }, 10);
    //
    //     dom.onUnrender().listen(() => {
    //         dom.$.addClass('showing');
    //         setTimeout(() => {
    //             dom.$.remove();
    //         }, 1000);
    //     });
    // }
}
