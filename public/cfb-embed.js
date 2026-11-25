class CfbVisualizerElement extends HTMLElement {
  connectedCallback() {
    if (this.querySelector('iframe')) return;
    this.style.display = 'block';
    this.style.width = '100%';
    this.style.background = '#090909';
    this.style.height = '2400px';

    const iframe = document.createElement('iframe');
    const embedUrl = new URL('https://cfb-ai-generator.tek123168.workers.dev/');
    embedUrl.searchParams.set('embed', '1');
    try {
      const hostParams = new URLSearchParams(window.location.search);
      if (hostParams.get('test') === '1') embedUrl.searchParams.set('test', '1');
      if (hostParams.get('is_test') === '1') embedUrl.searchParams.set('is_test', '1');
    } catch {
      // Ignore cross-origin location read restrictions
    }
    iframe.src = embedUrl.toString();
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
      if (event.source !== iframe.contentWindow) return;
      const data = event.data;
      if (
        data &&
        data.type === 'cfb-resize' &&
        typeof data.height === 'number' &&
        Number.isFinite(data.height) &&
        data.height >= 200
      ) {
        const clampedHeight = Math.min(Math.max(Math.ceil(data.height) + 8, 600), 12000);
        const nextHeight = `${clampedHeight}px`;
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
