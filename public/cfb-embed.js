class CfbVisualizerElement extends HTMLElement {
  connectedCallback() {
    if (this.querySelector('iframe')) return;
    this.style.display = 'block';
    this.style.width = '100%';
    this.style.background = '#090909';
    this.style.height = '2400px';

    const iframe = document.createElement('iframe');
    iframe.src = 'https://cfb-ai-generator.tek123168.workers.dev/?embed=1';
    iframe.title = 'Carolina Flatbeds AI Flatbed Visualizer';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('allow', 'clipboard-write');
    iframe.style.width = '100%';
    iframe.style.height = '2400px';
    iframe.style.border = '0';
    iframe.style.display = 'block';
    iframe.style.background = '#090909';

    this._onMessage = (event) => {
      if (event.origin !== 'https://cfb-ai-generator.tek123168.workers.dev') return;
      const data = event.data;
      if (data && data.type === 'cfb-resize' && typeof data.height === 'number' && data.height > 200) {
        const nextHeight = `${Math.ceil(data.height) + 8}px`;
        iframe.style.height = nextHeight;
        this.style.height = nextHeight;
      }
    };
    window.addEventListener('message', this._onMessage);
    this.appendChild(iframe);
  }

  disconnectedCallback() {
    if (this._onMessage) {
      window.removeEventListener('message', this._onMessage);
      this._onMessage = null;
    }
  }
}

if (!customElements.get('cfb-visualizer')) {
  customElements.define('cfb-visualizer', CfbVisualizerElement);
}
