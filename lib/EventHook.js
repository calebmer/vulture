import Hook from './Hook'

/**
 * Hooks an event onto a DOM node. Complies with the `virtual-dom` hook
 * contract.
 *
 * @class
 * @param {string} The event to attach the listener to.
 * @param {function} The event listener.
 */

class EventHook extends Hook {
  constructor(event, listener) {
    super()
    this.event = event
    this.listener = listener
  }

  hook(node) {
    node.addEventListener(this.event, this.listener)
  }

  unhook(node) {
    node.removeEventListener(this.event, this.listener)
  }
}

export default EventHook
