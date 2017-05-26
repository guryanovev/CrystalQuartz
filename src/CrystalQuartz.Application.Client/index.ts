import './app/index.less';
import * as js from 'exports-loader?js!./lib/john-smith';

import { Application } from './app/application';

$(() => {
    //window["js"] = js;

    new Application().run();
});
