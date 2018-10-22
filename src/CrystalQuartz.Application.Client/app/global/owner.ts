import __each from 'lodash/each';

export class Owner implements js.IDisposable {
    private _properties: js.IDisposable[] = [];

    own<T extends js.IDisposable>(property: T): T {
        this._properties.push(property);

        return property;
    }

    dispose(){
        __each(this._properties, p => p.dispose());
    }
}