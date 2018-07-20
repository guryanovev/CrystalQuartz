import './app/index.less';
import './bootstrap/bootstrap.js';

import * as js from 'exports-loader?js!./lib/john-smith';

import bootstrapper from './app/app-bootstrapper/bootstrapper';

$(bootstrapper);
