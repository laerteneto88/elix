import * as props from './props.js';
import symbols from './symbols.js';


/**
 * Mixin which manages the keydown handling for a component.
 *
 * This mixin handles several keyboard-related features.
 *
 * First, it wires up a single keydown event handler that can be shared by
 * multiple mixins on a component. The event handler will invoke a `keydown`
 * method with the event object, and any mixin along the prototype chain that
 * wants to handle that method can do so.
 *
 * If a mixin wants to indicate that keyboard event has been handled, and that
 * other mixins should *not* handle it, the mixin's `keydown` handler should
 * return a value of true. The convention that seems to work well is that a
 * mixin should see if it wants to handle the event and, if not, then ask the
 * superclass to see if it wants to handle the event. This has the effect of
 * giving the mixin that was applied last the first chance at handling a
 * keyboard event.
 *
 * Example:
 *
 *     [symbols.keydown](event) {
 *       let handled;
 *       switch (event.keyCode) {
 *         // Handle the keys you want, setting handled = true if appropriate.
 *       }
 *       // Prefer mixin result if it's defined, otherwise use base result.
 *       return handled || (super[symbols.keydown] && super[symbols.keydown](event));
 *     }
 *
 * Until iOS Safari supports the `KeyboardEvent.key` property
 * (see http://caniuse.com/#search=keyboardevent.key), mixins should generally
 * test keys using the legacy `keyCode` property, not `key`.
 *
 * A second feature provided by this mixin is that it implicitly makes the
 * component a tab stop if it isn't already, by setting `tabindex` to 0. This
 * has the effect of adding the component to the tab order in document order.
 *
 * @module KeyboardMixin
 */
export default function KeyboardMixin(Base) {

  // The class prototype added by the mixin.
  class Keyboard extends Base {

    constructor() {
      super();
      this.addEventListener('keydown', event => {
        this[symbols.raiseChangeEvents] = true;
        const handled = this[symbols.keydown](event);
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
        }
        this[symbols.raiseChangeEvents] = false;
      });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        tabindex: '0'
      });
    }

    hostProps(original) {
      const base = super.hostProps && super.hostProps(original);
      const tabindex = original.attributes.tabindex || this.state.tabindex;
      return props.merge(base, {
        attributes: {
          tabindex
        }
      });
    }

    [symbols.keydown](event) {
      if (super[symbols.keydown]) { return super[symbols.keydown](event); }
      return false;
    }

  }

  return Keyboard;
}
