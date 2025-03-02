const CARD_VERSION = "0.1.0-alpha";

class FixedBottomCard extends HTMLElement {
  // Called whenever the home assistant state changes
  set hass(hass) {
    this._hass = hass;
    if (this.card) this.card.hass = hass;
  }

  async setConfig(config) {
    // Config validation
    if (!typeof config.card === "object") {
      throw new Error("You need to define a card to wrap.");
    }
    this.config = config;

    this.card = await this.createCard(this.config.card);
    this.placeholder = document.createElement("div");

    const spacing = this.config.spacing || "16px";
    const bottomBarHeight =
      this.config["bottom-bar-height"] || "var(--footer-height)";
    const filter =
      this.config.filter || "drop-shadow(0 0 20px var(--view-background))";
    const zIndex = this.config["z-index"] || "1";

    this.card.style.position = "fixed";
    this.card.style.bottom = `calc(${bottomBarHeight} + ${spacing})`;
    this.card.style.zIndex = zIndex;
    this.card.style.filter = filter;

    this.append(this.placeholder, this.card);

    // Observe actual card size (height) and update placeholder
    new ResizeObserver((entries) => {
      const entry = entries[0];
      this.placeholder.style.height = `calc(${entry.contentRect.height}px + ${spacing})`;
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
    if (this._hass) element.hass = this._hass;
    return element;
  }
}

customElements.define("fixed-bottom-card", FixedBottomCard);
window.customCards.push({
  type: "fixed-bottom-card",
  name: "Fixed Bottom Card",
  description: "Fixes a card to the bottom of the screen",
  preview: false,
  documentationURL: "https://github.com/ofekashery/vertical-stack-in-card",
});

console.info(
  `%c  Fixed Bottom Card %c ${CARD_VERSION}  `,
  "background-color: #555;color: #fff;padding: 3px 2px 3px 3px;border-radius: 14px 0 0 14px;font-family: DejaVu Sans,Verdana,Geneva,sans-serif;text-shadow: 0 1px 0 rgba(1, 1, 1, 0.3)",
  "background-color: #506eac;color: #fff;padding: 3px 3px 3px 2px;border-radius: 0 14px 14px 0;font-family: DejaVu Sans,Verdana,Geneva,sans-serif;text-shadow: 0 1px 0 rgba(1, 1, 1, 0.3)"
);
