import { FaviconStatus } from './startup.view-model';

interface IFaviconStatusRenderer {
  draw(context: CanvasRenderingContext2D): void;
}

const COLOR_PRIMARY = '#38C049';
const COLOR_SECONDARY = '#E5D45B';
const COLOR_ERROR = '#CB4437';
const COLOR_WHITE = '#FFFFFF';

function drawCircle(
  context: CanvasRenderingContext2D,
  color: string,
  angleStart: number,
  angleEnd: number,
  radius: number = 5
) {
  context.beginPath();
  context.arc(8, 8, radius, angleStart, angleEnd);
  context.fillStyle = color;
  context.fill();
}

class LoadingFaviconRenderer implements IFaviconStatusRenderer {
  public draw(context: CanvasRenderingContext2D): void {
    drawCircle(context, COLOR_WHITE, 0, Math.PI * 2, 6);
    drawCircle(context, COLOR_PRIMARY, Math.PI / 2, Math.PI * 1.5);
    drawCircle(context, COLOR_SECONDARY, Math.PI * 1.5, Math.PI / 2);
  }
}

class SolidFaviconRenderer implements IFaviconStatusRenderer {
  public constructor(private color: string) {}

  public draw(context: CanvasRenderingContext2D): void {
    drawCircle(context, this.color, 0, 2 * Math.PI);

    context.strokeStyle = COLOR_WHITE;
    context.stroke();
  }
}

class BrokenFaviconRenderer implements IFaviconStatusRenderer {
  public constructor() {}

  public draw(context: CanvasRenderingContext2D): void {
    drawCircle(context, COLOR_PRIMARY, Math.PI / 2, Math.PI * 1.5);
    drawCircle(context, COLOR_SECONDARY, Math.PI * 1.5, Math.PI / 2);

    context.beginPath();

    const crossOriginX = 9;
    const crossOriginY = 8;
    const crossWidth = 5;

    context.beginPath();
    context.strokeStyle = COLOR_ERROR;
    context.lineWidth = 2;
    context.moveTo(crossOriginX, crossOriginY);
    context.lineTo(crossOriginX + crossWidth, crossOriginY + crossWidth);
    context.moveTo(crossOriginX, crossOriginY + crossWidth);
    context.lineTo(crossOriginX + crossWidth, crossOriginY);
    context.stroke();
  }
}

export class FaviconRenderer {
  private _factory: { [key: string]: () => IFaviconStatusRenderer } = {};

  public constructor() {
    this._factory[FaviconStatus.Loading] = () => new LoadingFaviconRenderer();
    this._factory[FaviconStatus.Ready] = () => new SolidFaviconRenderer(COLOR_SECONDARY);
    this._factory[FaviconStatus.Active] = () => new SolidFaviconRenderer(COLOR_PRIMARY);
    this._factory[FaviconStatus.Broken] = () => new BrokenFaviconRenderer();
  }

  public render(faviconStatus: FaviconStatus) {
    const $canvas = document.createElement('canvas');
    const $link = document.createElement('link');

    $link.setAttribute('class', 'cq-favicon');
    $link.setAttribute('rel', 'icon');
    $link.setAttribute('type', 'image');

    if (typeof $canvas.getContext == 'function') {
      $canvas.setAttribute('width', '16');
      $canvas.setAttribute('height', '16');

      const context = $canvas.getContext('2d');

      if (context !== null) {
        this._factory[faviconStatus]().draw(context);
      }

      $link.setAttribute('href', $canvas.toDataURL('image/png'));

      const prevFavicon = document.getElementsByClassName('cq-favicon');
      if (prevFavicon !== undefined && prevFavicon.length > 0) {
        prevFavicon.item(0)!.remove();
      }

      document.getElementsByTagName('head')![0]!.append($link);
    }
  }
}
