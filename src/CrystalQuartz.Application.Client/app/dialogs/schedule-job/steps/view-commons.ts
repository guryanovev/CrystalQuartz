import __each from 'lodash/each';

export const CHANGE_DOM_DISPLAY = (blocks: { code: string, dom: js.IListenerDom }[], currentCode: string) => {
    __each(blocks, block => {
        block.dom.$.css('display', currentCode === block.code ? 'block' : 'none');
    });
}