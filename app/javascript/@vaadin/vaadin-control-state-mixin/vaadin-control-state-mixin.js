/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/
/**
 * A private mixin to avoid problems with dynamic properties and Polymer Analyzer.
 * No need to expose these properties in the API docs.
 * @polymerMixin
 */
const TabIndexMixin = superClass => class VaadinTabIndexMixin extends superClass {
  static get properties() {
    var properties = {
      /**
       * Internal property needed to listen to `tabindex` attribute changes.
       *
       * For changing the tabindex of this component use the native `tabIndex` property.
       * @private
       */
      tabindex: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
        observer: '_tabindexChanged'
      }
    };

    if (window.ShadyDOM) {
      // ShadyDOM browsers need the `tabIndex` in order to notify when the user changes it programmatically.
      properties['tabIndex'] = properties.tabindex;
    }

    return properties;
  }
};

/**
 * Polymer.IronControlState is not a proper 2.0 class, also, its tabindex
 * implementation fails in the shadow dom, so we have this for vaadin elements.
 * @polymerMixin
 */
export const ControlStateMixin = superClass => class VaadinControlStateMixin extends TabIndexMixin(superClass) {
  static get properties() {
    return {
      /**
       * Specify that this control should have input focus when the page loads.
       */
      autofocus: {
        type: Boolean
      },

      /**
       * Stores the previous value of tabindex attribute of the disabled element
       */
      _previousTabIndex: {
        type: Number
      },

      /**
       * If true, the user cannot interact with this element.
       */
      disabled: {
        type: Boolean,
        observer: '_disabledChanged',
        reflectToAttribute: true
      },

      _isShiftTabbing: {
        type: Boolean
      }
    };
  }

  ready() {
    this.addEventListener('focusin', e => {
      if (e.composedPath()[0] === this) {
        this._focus(e);
      } else if (e.composedPath().indexOf(this.focusElement) !== -1 && !this.disabled) {
        this._setFocused(true);
      }
    });
    this.addEventListener('focusout', e => this._setFocused(false));

    // In super.ready() other 'focusin' and 'focusout' listeners might be
    // added, so we call it after our own ones to ensure they execute first.
    // Issue to watch out: when incorrect, <vaadin-combo-box> refocuses the
    // input field on iOS after “Done” is pressed.
    super.ready();

    // This fixes the bug in Firefox 61 (https://bugzilla.mozilla.org/show_bug.cgi?id=1472887)
    // where focusout event does not go out of shady DOM because composed property in the event is not true
    const ensureEventComposed = e => {
      if (!e.composed) {
        e.target.dispatchEvent(new CustomEvent(e.type, {
          bubbles: true,
          composed: true,
          cancelable: false
        }));
      }
    };
    this.shadowRoot.addEventListener('focusin', ensureEventComposed);
    this.shadowRoot.addEventListener('focusout', ensureEventComposed);

    this.addEventListener('keydown', e => {
      if (!e.defaultPrevented && e.keyCode === 9) {
        if (e.shiftKey) {
          // Flag is checked in _focus event handler.
          this._isShiftTabbing = true;
          HTMLElement.prototype.focus.apply(this);
          this._setFocused(false);
          // Event handling in IE is asynchronous and the flag is removed asynchronously as well
          setTimeout(() => this._isShiftTabbing = false, 0);
        } else {
          // Workaround for FF63-65 bug that causes the focus to get lost when
          // blurring a slotted component with focusable shadow root content
          // https://bugzilla.mozilla.org/show_bug.cgi?id=1528686
          // TODO: Remove when safe
          const firefox = window.navigator.userAgent.match(/Firefox\/(\d\d\.\d)/);
          if (firefox
            && parseFloat(firefox[1]) >= 63
            && parseFloat(firefox[1]) < 66
            && this.parentNode
            && this.nextSibling) {
            const fakeTarget = document.createElement('input');
            fakeTarget.style.position = 'absolute';
            fakeTarget.style.opacity = 0;
            fakeTarget.tabIndex = this.tabIndex;

            this.parentNode.insertBefore(fakeTarget, this.nextSibling);
            fakeTarget.focus();
            fakeTarget.addEventListener('focusout', () => this.parentNode.removeChild(fakeTarget));
          }
        }

      }
    });

    if (this.autofocus && !this.focused && !this.disabled) {
      window.requestAnimationFrame(() => {
        this._focus();
        this._setFocused(true);
        this.setAttribute('focus-ring', '');
      });
    }

    this._boundKeydownListener = this._bodyKeydownListener.bind(this);
    this._boundKeyupListener = this._bodyKeyupListener.bind(this);
  }

  /**
   * @protected
   */
  connectedCallback() {
    super.connectedCallback();

    document.body.addEventListener('keydown', this._boundKeydownListener, true);
    document.body.addEventListener('keyup', this._boundKeyupListener, true);
  }

  /**
   * @protected
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    document.body.removeEventListener('keydown', this._boundKeydownListener, true);
    document.body.removeEventListener('keyup', this._boundKeyupListener, true);

    // in non-Chrome browsers, blur does not fire on the element when it is disconnected.
    // reproducible in `<vaadin-date-picker>` when closing on `Cancel` or `Today` click.
    if (this.hasAttribute('focused')) {
      this._setFocused(false);
    }
  }

  _setFocused(focused) {
    if (focused) {
      this.setAttribute('focused', '');
    } else {
      this.removeAttribute('focused');
    }

    // focus-ring is true when the element was focused from the keyboard.
    // Focus Ring [A11ycasts]: https://youtu.be/ilj2P5-5CjI
    if (focused && this._tabPressed) {
      this.setAttribute('focus-ring', '');
    } else {
      this.removeAttribute('focus-ring');
    }
  }

  _bodyKeydownListener(e) {
    this._tabPressed = e.keyCode === 9;
  }

  _bodyKeyupListener() {
    this._tabPressed = false;
  }

  /**
   * Any element extending this mixin is required to implement this getter.
   * It returns the actual focusable element in the component.
   */
  get focusElement() {
    window.console.warn(`Please implement the 'focusElement' property in <${this.localName}>`);
    return this;
  }

  _focus(e) {
    if (this._isShiftTabbing) {
      return;
    }

    this.focusElement.focus();
    this._setFocused(true);
  }

  /**
   * Moving the focus from the host element causes firing of the blur event what leads to problems in IE.
   * @private
   */
  focus() {
    if (!this.focusElement || this.disabled) {
      return;
    }

    this.focusElement.focus();
    this._setFocused(true);
  }

  /**
   * Native bluring in the host element does nothing because it does not have the focus.
   * In chrome it works, but not in FF.
   * @private
   */
  blur() {
    this.focusElement.blur();
    this._setFocused(false);
  }

  _disabledChanged(disabled) {
    this.focusElement.disabled = disabled;
    if (disabled) {
      this.blur();
      this._previousTabIndex = this.tabindex;
      this.tabindex = -1;
      this.setAttribute('aria-disabled', 'true');
    } else {
      if (typeof this._previousTabIndex !== 'undefined') {
        this.tabindex = this._previousTabIndex;
      }
      this.removeAttribute('aria-disabled');
    }
  }

  _tabindexChanged(tabindex) {
    if (tabindex !== undefined) {
      this.focusElement.tabIndex = tabindex;
    }

    if (this.disabled && this.tabindex) {
      // If tabindex attribute was changed while checkbox was disabled
      if (this.tabindex !== -1) {
        this._previousTabIndex = this.tabindex;
      }
      this.tabindex = tabindex = undefined;
    }

    if (window.ShadyDOM) {
      this.setProperties({tabIndex: tabindex, tabindex: tabindex});
    }
  }

  /**
   * @protected
   */
  click() {
    if (!this.disabled) {
      super.click();
    }
  }
};
