function Repeat (value: number): any {
  const times = function times (n: number) {
    return function (f: any) {
      const iter = function iter (i: number) {
        if (i === n) return;
        f(i);
        iter(i + 1);
      };
      return iter(0);
    };
  };
  return times(value);
}


document.addEventListener('DOMContentLoaded', () => {
  class MyComponent extends HTMLElement {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor () {
      super();
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          canvas {
            background-color: black;
            border: 2px solid black;
          }
        </style>
        <canvas id="grid"></canvas>
      `;
      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback (): void {
      const { shadowRoot } = this;
      const count = 9;
      const spacer = [8, 2];

      let size = (this.offsetWidth >= this.offsetHeight) ? this.offsetHeight : this.offsetWidth;
      const box = Math.floor((size - (spacer[0] * spacer[1])) / count);
      size = (box * count) + (spacer[0] * spacer[1]);

      this.canvas = shadowRoot.getElementById('grid');
      this.canvas.setAttribute('height', `${size}px`);
      this.canvas.setAttribute('width', `${size}px`);
      this.context = this.canvas.getContext('2d');;
      this._drawGrid(count, box, spacer);
      this.canvas.addEventListener('click', (event) => { this._handleClick(event); });
    }
    _drawGrid (count: number, box: number, spacer: number[]) {
      const positions = [];
      const modulus =  Math.floor(count / spacer[1]) - 1;
      Repeat(count) ((i: number) => { positions.push(i * box); });
      let offsetX = 0;
      let offsetY = 0;
      Repeat(count) ((i: number) => {
        for (const [index, position] of positions.entries()) {
          this.context.fillStyle = "#ffffff";
          this.context.fillRect(position + offsetX, positions[i] + offsetY, box, box);
          this.context.strokeStyle = "#000000";
          this.context.lineWidth   = 1;
          this.context.strokeRect(position + offsetX, positions[i] + offsetY, box, box);
          // -- Add a little space for styling --
          if ((index + 1) % modulus === 0) { offsetX = offsetX + spacer[0]; }
          if ((index + 1) % count === 0) { offsetX = 0; }
          if ((i + 1) % modulus === 0 && index === (count - 1)) { offsetY = offsetY + spacer[0]; }
        }
      });
    }
    _handleClick (event: MouseEvent) {
      console.log(event.offsetX, event.offsetY);
    }
  }
  customElements.define('my-component', MyComponent);
}, false);