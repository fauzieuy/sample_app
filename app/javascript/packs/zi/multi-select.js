import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'multiselect-combo-box/multiselect-combo-box.js';
import '@vaadin/vaadin-combo-box';

class MultiSelect extends PolymerElement {
    static get template() {
        return html`
            <div id="formContainer">
                <multiselect-combo-box label="Select items"></multiselect-combo-box>   
                <vaadin-combo-box label="Select items"></vaadin-combo-box>
            </div>
        `;
    }

    static get properties() {
        return {
            formAuthenticityToken: String
        };
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
    }

}
customElements.define('multi-select', MultiSelect);
