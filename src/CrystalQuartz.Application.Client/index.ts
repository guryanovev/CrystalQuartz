import './app/index.less';
//import 'jquery';
import * as js from 'exports-loader?js!./lib/john-smith';

import { Application } from './app/application';

console.log('pre-run');

$(() => {
    //window["js"] = js;

    console.log('run');

    new Application().run();
});
