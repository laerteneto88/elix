import * as symbols from './symbols.js';


/**
 * Exposes the text content of a list's items as an array of strings.
 *
 * @module ItemsTextMixin
 */
export default function ItemsTextMixin(Base) {

  // The class prototype added by the mixin.
  class ItemsText extends Base {

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        itemsForTexts: null,
        texts: null
      });
    }

    // Default implementation returns an item's `alt` attribute or its
    // `textContent`, in that order.
    [symbols.getItemText](item) {
      return getItemText(item);
    }

    refineState(state) {
      let result = super.refineState ? super.refineState(state) : true;
      const items = state.items;
      const itemsChanged = items !== state.itemsForTexts;
      if (itemsChanged) {
        const texts = getTextsFromItems(items, this[symbols.getItemText]);
        if (texts) {
          Object.freeze(texts);
        }
        Object.assign(state, {
          texts,
          itemsForTexts: items
        });
        result = false;
      }
      return result;
    }
  }

  return ItemsText;
}


export function getItemText(item) {
  return item.getAttribute('alt') || item.textContent;
}


export function getTextsFromItems(items, getText = getItemText) {
  return items ?
    Array.prototype.map.call(items, item => getText(item)) :
    null;
}
