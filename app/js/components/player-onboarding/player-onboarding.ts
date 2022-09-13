export default class PlayerOnboarding extends HTMLElement {
    private shadow: ShadowRoot | null = null;

    public href = '-';

    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        if (this.shadow)
            this.shadow.innerHTML = `<div>I'm a player with the href ${this.href}</div>`;
    }

    static get observedAttributes(): string[] {
        return ['href'];
    }

    attributeChangedCallback(property: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) return;

        switch (property) {
            case 'href':
                this[property] = newValue;
                break;

            default:
        }

        console.log('prop change: ', property);
    }
}

customElements.define('player-onboarding', PlayerOnboarding);
