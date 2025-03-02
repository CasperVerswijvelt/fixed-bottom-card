const CARD_VERSION = "0.1.0-alpha";

class FixedBottomCard extends HTMLElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass) {
    // Initialize the content if it's not there yet.
    this._hass = hass;
    if (this.card) this.card.hass = hass;
  }

  async setConfig(config) {
    if (!typeof config.card === "object") {
      throw new Error("You need to define a card to wrap.");
    }
    if (!typeof config.padding === "number") {
      throw new Error("You need to define a padding (px number).");
    }
    if (!typeof config["bottom-bar-height"] === "string") {
      throw new Error(
        "You need to define a bottom bar height (css property string)."
      );
    }
    this.config = config;

    this.card = await this.createCard(this.config.card);
    this.placeholder = document.createElement("div");

    this.card.style.position = "fixed";
    this.card.style.bottom = `calc(${this.config.padding}px + ${this.config["bottom-bar-height"]})`;
    this.card.style.zIndex = "1";
    this.card.style.filter = "drop-shadow(0 0 20px var(--view-background))";

    this.append(this.placeholder, this.card);

    // Observe actual card size (height) and update placeholder
    new ResizeObserver((entries) => {
      const entry = entries[0];
      this.placeholder.style.height = `${
        entry.contentRect.height + 2 * this.config.padding
      }px`;
    }).observe(this.card);

    // Observe placeholder size (width) and update card
    //  since it can no longer take width from its parent
    //  due to the fixed positioning
    new ResizeObserver((entries) => {
      const entry = entries[0];
      this.card.style.width = `${entry.contentRect.width}px`;
    }).observe(this.placeholder);
  }

  async createCard(cardConfig) {
    const helpers = await window.loadCardHelpers();
    const element = helpers.createCardElement(cardConfig);
    if (this._hass) element.hass = this.hass;
    return element;
  }
}

customElements.define("fixed-bottom-card", FixedBottomCard);
window.customCards.push({
  type: "fixed-bottom-card",
  name: "Fixed Bottom Card",
  description: "Fixes a card to the bottom of the screen",
  preview: false,
  documentationURL: "https://github.com/todo",
});

console.info(
  `%c  Fixed Bottom Card %c ${CARD_VERSION}  `,
  "background-color: #555;color: #fff;padding: 3px 2px 3px 3px;border-radius: 14px 0 0 14px;font-family: DejaVu Sans,Verdana,Geneva,sans-serif;text-shadow: 0 1px 0 rgba(1, 1, 1, 0.3)",
  "background-color: #506eac;color: #fff;padding: 3px 3px 3px 2px;border-radius: 0 14px 14px 0;font-family: DejaVu Sans,Verdana,Geneva,sans-serif;text-shadow: 0 1px 0 rgba(1, 1, 1, 0.3)"
);
