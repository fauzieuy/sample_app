import '@vaadin/vaadin-material-styles/color.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

const $_documentContainer = html`<dom-module id="material-placeholder-styles">
  <template>
    <style>
      input[slot="input"]::-webkit-input-placeholder,
      textarea[slot="textarea"]::-webkit-input-placeholder {
        color: var(--material-disabled-text-color);
        transition: opacity 0.175s 0.05s;
        opacity: 1;
      }

      input[slot="input"]::-ms-input-placeholder,
      textarea[slot="textarea"]::-ms-input-placeholder {
        color: var(--material-disabled-text-color);
      }

      input[slot="input"]::-moz-placeholder,
      textarea[slot="textarea"]::-moz-placeholder {
        color: var(--material-disabled-text-color);
        transition: opacity 0.175s 0.05s;
        opacity: 1;
      }

      input[slot="input"]::placeholder,
      textarea[slot="textarea"]::placeholder {
        color: var(--material-disabled-text-color);
        transition: opacity 0.175s 0.1s;
        opacity: 1;
      }

      [has-label]:not([focused]):not([invalid]):not([theme="always-float-label"]) > input[slot="input"]::-webkit-input-placeholder,
      [has-label]:not([focused]):not([invalid]):not([theme="always-float-label"]) > input[slot="textarea"]::-webkit-input-placeholder {
        opacity: 0;
        transition-delay: 0;
      }

      [has-label]:not([focused]):not([invalid]):not([theme="always-float-label"]) > input[slot="input"]::-moz-placeholder,
      [has-label]:not([focused]):not([invalid]):not([theme="always-float-label"]) > input[slot="textarea"]::-moz-placeholder {
        opacity: 0;
        transition-delay: 0;
      }

      [has-label]:not([focused]):not([invalid]):not([theme="always-float-label"]) > input[slot="input"]::placeholder,
      [has-label]:not([focused]):not([invalid]):not([theme="always-float-label"]) > input[slot="textarea"]::placeholder {
        opacity: 0;
        transition-delay: 0;
      }

      /* IE11 doesn’t show the placeholder when the input is focused, so it’s basically useless for this theme */
      [has-label] > input[slot="input"]:-ms-input-placeholder,
      [has-label] > input[slot="textarea"]:-ms-input-placeholder {
        opacity: 0;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
