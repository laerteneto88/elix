//
// NOTE: This is a prototype, and not yet ready for real use.
//

import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import OpenCloseMixin from '../mixins/OpenCloseMixin.js';
import OverlayMixin from '../mixins/OverlayMixin.js';
import PopupModalityMixin from '../mixins/PopupModalityMixin.js';
import ShadowReferencesMixin from '../mixins/ShadowReferencesMixin.js';
import ShadowTemplateMixin from '../mixins/ShadowTemplateMixin.js';
import symbols from '../mixins/symbols.js';


const mixins = [
  AttributeMarshallingMixin,
  KeyboardMixin,
  OpenCloseMixin,
  OverlayMixin,
  PopupModalityMixin,
  ShadowReferencesMixin,
  ShadowTemplateMixin
];

// Apply the above mixins to HTMLElement.
const base = mixins.reduce((cls, mixin) => mixin(cls), HTMLElement);


class PopupCore extends base {

  connectedCallback() {
    if (super.connectedCallback) { super.connectedCallback(); }

    // Set default ARIA role for the dialog.
    if (this.getAttribute('role') == null && this[symbols.defaults].role) {
      this.setAttribute('role', this[symbols.defaults].role);
    }
  }

  get [symbols.defaults]() {
    const defaults = super[symbols.defaults] || {};
    defaults.role = 'tooltip';
    return defaults;
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          align-items: center;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
          left: 0;
          outline: none;
          pointer-events: none;
          position: fixed;
          top: 0;
          width: 100%;
        }

        :host(:not(.visible)) {
          display: none;
        }

        #overlayContent {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          pointer-events: initial;
        }
      </style>
      <div id="overlayContent">
        <slot></slot>
      </div>
    `;
  }

}


class Popup extends PopupCore {}


customElements.define('elix-popup', Popup);
export default Popup;
