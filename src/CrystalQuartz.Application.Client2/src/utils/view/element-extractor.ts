import { DomElement } from 'john-smith/view';

export const EXTRACT_ELEMENT = (domElement: DomElement): HTMLElement => {
  return (domElement as unknown as { element: HTMLElement }).element;
};
