import { List } from 'john-smith/view/components';
import { ErrorMessage } from '../../api';
import 'john-smith/view';

export const ErrorsView = (errors: ErrorMessage[]) =>
    <div class="properties-panel">
        <header>Errors</header>
        <ul class="errors">
            <List view={errorMessage => <li style={'padding-left: ' + ((errorMessage.level + 1) * 15) + 'px'}>{errorMessage}</li>} model={errors}></List>
        </ul>
    </div>;
