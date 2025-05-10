import ViewModel from './command-progress-view-model';
import { DomElement, HtmlDefinition, View} from 'john-smith/view';
import 'john-smith/binding/ext/className';
import {ObservableValue} from "john-smith/reactive";
import {OnInit} from "john-smith/view/hooks";
import {OptionalDisposables} from 'john-smith/common';
import {DomEngine} from 'john-smith/view/dom-engine';

export default class CommandProgressView implements View, OnInit {
    private _visible = new ObservableValue<boolean>(false);

    constructor(private readonly viewModel: ViewModel) {
    }

    public onInit(): OptionalDisposables {
        let timer: ReturnType<typeof setTimeout> | null = null;

        return this.viewModel.active.listen(value => {
            if (value) {
                if (timer !== null) {
                    clearTimeout(timer);
                    timer = null;
                }

                this._visible.setValue(true);
            } else {
                timer = setTimeout(() => {
                    this._visible.setValue(false);
                }, 1000);
            }
        });
    }

    template(): HtmlDefinition {
        return <div class="progress-indicator" $className={{ 'progress-indicator--visible': this._visible }}>
            <div class="loader"></div>

                    <p>{this.viewModel.currentCommand}</p>
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
