import './app/index.less';
import './bootstrap/bootstrap.js';
//import 'jquery';
import * as js from 'exports-loader?js!./lib/john-smith';

//import { Application } from './app/application';

//console.log('pre-run');

import bootstrapper from './app/app-bootstrapper/bootstrapper';

$(bootstrapper);
