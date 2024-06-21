import { FaviconStatus } from './startup.view-model';

interface IFaviconStatusRenderer {
    draw(context: CanvasRenderingContext2D): void;
}

const
    COLOR_PRIMARY = '#38C049',
    COLOR_SECONDARY = '#E5D45B',
    COLOR_ERROR = '#CB4437',
    COLOR_WHITE = '#FFFFFF';

function drawCircle(context: CanvasRenderingContext2D, color: string, angleStart: number, angleEnd: number, radius: number = 5){
    context.beginPath();
    context.arc(8, 8, radius, angleStart, angleEnd);
    context.fillStyle = color;
    context.fill();
}

class LoadingFaviconRenderer implements IFaviconStatusRenderer {
    draw(context: CanvasRenderingContext2D): void {
        drawCircle(context, COLOR_WHITE, 0, Math.PI * 2, 6);
        drawCircle(context, COLOR_PRIMARY, Math.PI / 2, Math.PI * 1.5);
        drawCircle(context, COLOR_SECONDARY, Math.PI * 1.5, Math.PI / 2);
    }
}

class SolidFaviconRenderer implements IFaviconStatusRenderer {
    constructor(private color: string){}

    draw(context: CanvasRenderingContext2D): void {
        drawCircle(context, this.color, 0, 2 * Math.PI);

        context.strokeStyle = COLOR_WHITE;
        context.stroke();
    }
}

class BrokenFaviconRenderer implements IFaviconStatusRenderer {
    constructor(){}

    draw(context: CanvasRenderingContext2D): void {
        drawCircle(context, COLOR_PRIMARY, Math.PI / 2, Math.PI * 1.5);
        drawCircle(context, COLOR_SECONDARY, Math.PI * 1.5, Math.PI / 2);

        context.beginPath();

        const
            crossOriginX = 9,
            crossOriginY = 8,
            crossWidth = 5;

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
    _factory: {[key: string]: () => IFaviconStatusRenderer } = {};

    constructor(){
        this._factory[FaviconStatus.Loading] = () => new LoadingFaviconRenderer();
        this._factory[FaviconStatus.Ready] = () => new SolidFaviconRenderer(COLOR_SECONDARY);
        this._factory[FaviconStatus.Active] = () => new SolidFaviconRenderer(COLOR_PRIMARY);
        this._factory[FaviconStatus.Broken] = () => new BrokenFaviconRenderer();
    }

    render(faviconStatus: FaviconStatus) {
        const
            $canvas = document.createElement('canvas'),
            $link = document.createElement('link'), // $('<link class="cq-favicon" rel="icon" type="image"/>'),
            canvas:any = $canvas;

        $link.setAttribute('class', 'cq-favicon');
        $link.setAttribute('rel', 'icon');
        $link.setAttribute('type', 'image');

        if (typeof canvas.getContext == 'function') {
            $canvas.setAttribute('width', '16');
            $canvas.setAttribute('height', '16');

            const context = canvas.getContext('2d');

            this._factory[faviconStatus]().draw(context);

            $link.setAttribute('href', canvas.toDataURL('image/png'));

            const prevFavicon = document.getElementsByClassName('cq-favicon');
            if (prevFavicon !== undefined && prevFavicon.length > 0) {
                prevFavicon.item(0)!.remove();
            }

            document.getElementsByTagName('head')![0]!.append($link);
            // const $head = $('head');
            // $head.find('.cq-favicon').remove();
            // $head.append($link);
        }
    }
}
