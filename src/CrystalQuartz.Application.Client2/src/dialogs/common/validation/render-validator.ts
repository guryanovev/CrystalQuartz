// import { Validators } from './validators';
// import {ValidatorView} from './validator-view';
//
// export const RENDER_VALIDATOR = (dom: js.IListenerDom, validatorDom: js.IListenerDom, source: js.IObservable < any >, validators: Validators, observationOptions: js.ListenerOptions = null) => {
//
//     dom.observes(source, observationOptions);
//     var sourceValidator = validators.findFor(source);
//     if (sourceValidator) {
//         validatorDom.render(ValidatorView, <any>{ errors: sourceValidator.errors });
//
//         sourceValidator.errors.listen(errors => {
//             if (errors && errors.length > 0) {
//                 dom.$.addClass('cq-error-control');
//             } else {
//                 dom.$.removeClass('cq-error-control');
//             }
//         });
//
//         dom.on((observationOptions ? observationOptions.event : null) || 'blur').react(sourceValidator.makeDirty, sourceValidator);
//     }
// }
