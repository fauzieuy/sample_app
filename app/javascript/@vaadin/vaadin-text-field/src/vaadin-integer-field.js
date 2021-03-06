/**
@license
Copyright (c) 2019 Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/
import '@polymer/polymer/polymer-element.js';

import '@polymer/polymer/lib/elements/custom-style.js';
import { NumberFieldElement } from './vaadin-number-field.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="vaadin-integer-field-template">

  
</dom-module>`;

document.head.appendChild($_documentContainer.content);

/**
* `<vaadin-integer-field>` is a Web Component for integer field control in forms.
*
* ```html
* <vaadin-integer-field label="Number">
* </vaadin-integer-field>
* ```
*
* @memberof Vaadin
* @demo demo/index.html
*/
class IntegerFieldElement extends NumberFieldElement {
  static get is() {
    return 'vaadin-integer-field';
  }

  static get version() {
    return '2.5.3';
  }

  static get properties() {
    // Hide inherited props that don't work with <input type="number"> from JSDoc.
    return {
      /**
       * @private
       */
      pattern: String,
      /**
       * @private
       */
      preventInvalidInput: Boolean,
      /**
       * @private
       */
      minlength: Number,
      /**
       * @private
       */
      maxlength: Number
    };
  }

  ready() {
    super.ready();
    this._enabledCharPattern = '[-+\\d]';
  }

  _valueChanged(newVal, oldVal) {
    if (newVal !== '' && !this.__isInteger(newVal)) {
      console.warn(`Trying to set non-integer value "${newVal}" to <vaadin-integer-field>.`
        + ` Clearing the value.`);
      this.value = '';
      return;
    }
    super._valueChanged(newVal, oldVal);
  }

  _stepChanged(newVal, oldVal) {
    if (!this.__hasOnlyDigits(newVal)) {
      console.warn(`Trying to set invalid step size "${newVal}",`
        + ` which is not a positive integer, to <vaadin-integer-field>.`
        + ` Resetting the default value 1.`);
      this.step = 1;
      return;
    }
    super._stepChanged(newVal, oldVal);
  }

  __isInteger(value) {
    return /^(-\d)?\d*$/.test(String(value));
  }

  __hasOnlyDigits(value) {
    return /^\d*$/.test(String(value));
  }
}

window.customElements.define(IntegerFieldElement.is, IntegerFieldElement);

export { IntegerFieldElement };
