import { IMapAndPathData } from "@/api";

export class XiaomiMap {
    private viewportContainer: HTMLDivElement;
    private drawCanvas: HTMLCanvasElement;
    private viewport: HTMLCanvasElement;
    private scale: number = 1.0;
    private viewportPosition: [number, number] = [512, 512];
    private selectedPoint: [number, number] | undefined;
    private toolbar: HTMLElement | null = null;
    private data: IMapAndPathData | null = null;

    constructor(element: string | HTMLDivElement) {
        this.drawCanvas = document.createElement("canvas");
        this.drawCanvas.width = 1024;
        this.drawCanvas.height = 1024;

        if (element instanceof HTMLDivElement) {
            this.viewportContainer = element;
        } else {
            this.viewportContainer = document.getElementById(element) as HTMLDivElement;
        }
        this.viewport = document.createElement("canvas");


        const resize = () => {
            const rect = this.viewportContainer.getBoundingClientRect();
            if (this.viewportContainer.parentElement) {
               // this.viewportContainer.parentElement.style.position = "relative";
            }
            this.viewport.width = this.viewportContainer.offsetWidth;
            this.viewport.height = this.viewportContainer.offsetHeight;
            this.updateViewport();
        };

        window.addEventListener("resize", resize, { passive: false });
        resize();

        this.viewport.style.position = "relative";

        const middle = this.transformMapToViewport([512, 512]);
        this.viewportPosition[0] = this.viewportPosition[0] - this.viewport.width / 2;
        this.viewportPosition[1] = this.viewportPosition[1] - this.viewport.height / 2;



        this.viewportContainer.appendChild(this.viewport);
        this.viewportContainer.addEventListener("touchmove", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        this.viewport.style.touchAction = "none";
        this.viewport.addEventListener("mousedown", (e) => {
            const rect = this.viewport.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
        });

        this.viewport.addEventListener("mousewheel", (e: any) => {
            const rect = this.viewport.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xpos = x / this.scale;
            const ypos = y / this.scale;

            if (e.wheelDelta > 0) {
                this.scale += 0.2 * this.scale;
            } else {
                this.scale -= 0.2 * this.scale;
            }
            if (this.scale < 1) { this.scale = 1.0; }


            this.viewportPosition[0] -= x / this.scale - xpos;
            this.viewportPosition[1] -= y / this.scale - ypos;

            this.updateViewport();
        });

        let start: [number, number] | undefined;
        let moved = false;
        this.viewport.addEventListener("pointerdown", (e) => {
            const rect = this.viewport.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.viewportContainer.dispatchEvent(new CustomEvent("mapmove"));
            start = [x, y];
            moved = false;
            e.preventDefault();
            e.stopPropagation();
        });
        this.viewport.style.touchAction = "none";
        this.viewport.addEventListener("pointermove", (e) => {
            if (typeof start === "undefined") { return; }
            moved = true;
            const rect = this.viewport.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xdiff = start[0] - x;
            const ydiff = start[1] - y;

            this.viewportPosition[0] += xdiff / this.scale;
            this.viewportPosition[1] += ydiff / this.scale;

            // Don't move the map out of the view on the left
            if (this.viewportPosition[0] > 1024 - 10) {
                this.viewportPosition[0] = 1024 - 10;
            }


            // Don't move the map out of the view on the right
            if (this.viewportPosition[0] < -1 * this.viewport.width / this.scale + 10) {
               this.viewportPosition[0] = -1 * this.viewport.width / this.scale + 10;
            }

            if (this.viewportPosition[1] > 1024 - 10) {
                this.viewportPosition[1] = 1024 - 10;
            }


            if (this.viewportPosition[1] < -1 * this.viewport.height / this.scale + 10) {
                this.viewportPosition[1] = -1 * this.viewport.height / this.scale + 10;
            }

/*
            if (this.viewportPosition[1] < -10) { this.viewportPosition[1] = -10; }
            if (this.viewportPosition[0] + this.viewport.width / this.scale - 10 > 1024) {
                this.viewportPosition[0] = 1024 - this.viewport.width / this.scale + 10;
            }
            if (this.viewportPosition[1] + this.viewport.height / this.scale - 10 > 1024) {
                this.viewportPosition[1] = 1024 - this.viewport.height / this.scale + 10;
            }*/

            start[0] = x;
            start[1] = y;

            this.updateViewport();
            e.preventDefault();
            e.stopPropagation();
        });
        this.viewport.addEventListener("pointerup", (e) => {
            this.viewportContainer.dispatchEvent(new CustomEvent("stopmapmove"));
            if (!moved && typeof start !== "undefined") {
                this.selectedPoint = this.transformViewportToMap(start);
                this.drawToolBar();
            }
            start = undefined;
           /* if (this.viewportPosition[0] < 0) { this.viewportPosition[0] = 0; }
            if (this.viewportPosition[1] < 0) { this.viewportPosition[1] = 0; }
            if (this.viewportPosition[0] + this.viewport.width / this.scale > 1024) {
                this.viewportPosition[0] = 1024 - this.viewport.width / this.scale;
            }
            if (this.viewportPosition[1] + this.viewport.height / this.scale > 1024) {
                this.viewportPosition[1] = 1024 - this.viewport.height / this.scale;
            }*/



            this.updateViewport();
            e.preventDefault();
            e.stopPropagation();
        });

        // this.drawToolBar();
    }

    public transformViewportToMap(point: [number, number]): [number, number] {

        return [
            this.viewportPosition[0] + point[0] / this.scale,
            this.viewportPosition[1] + point[1] / this.scale,
        ];
    }


    public transformMapToViewport(point: [number, number]): [number, number] {
        return [
            (point[0] - this.viewportPosition[0]) * this.scale,
            (point[1] - this.viewportPosition[1]) * this.scale,
        ];
    }

    public updateMapData(test: IMapAndPathData) {
        this.drawCanvas.width = 1024;
        this.drawCanvas.height = 1024;
        const ctx = this.drawCanvas.getContext("2d")!;

        ctx.imageSmoothingEnabled = false;

        const imageData = ctx.getImageData(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        const data = new DataView(test.map);

        let bytePos = 0;
        while (bytePos < data.byteLength) {
            const pos = data.getUint32(bytePos++);
            bytePos += 3;
            const r = data.getUint8(bytePos++);
            const g = data.getUint8(bytePos++);
            const b = data.getUint8(bytePos++);
            if (r === 0) {
                imageData.data[pos] = 102;
                imageData.data[pos + 1] = 153;
                imageData.data[pos + 2] = 255;
                imageData.data[pos + 3] = 255;
            } else {
                imageData.data[pos] = 0;
                imageData.data[pos + 1] = 118;
                imageData.data[pos + 2] = 255;
                imageData.data[pos + 3] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        this.data = test;
        this.updateViewport();
    }

    public updateViewport() {
        const ctx = this.viewport.getContext("2d")!;
        ctx.save();
        const grd = ctx.createLinearGradient(0, 0, 0, this.viewport.height);
        grd.addColorStop(0, "rgba(18,45,55,1)");
        grd.addColorStop(1, "rgba(38,65,75,1)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, this.viewport.width, this.viewport.height);
        ctx.restore();
        ctx.imageSmoothingEnabled = false;
        const srcStartX = this.viewportPosition[0] * this.scale * -1;
        const srcStartY = this.viewportPosition[1] * this.scale * -1;
        ctx.drawImage(this.drawCanvas, srcStartX, srcStartY, 1024 * this.scale, 1024 * this.scale);

        this.drawPath();
        this.drawSpecialPoints();
    }

    private drawPath() {
        if (this.data && this.data.path) {
            let first = true;
            const ctx = this.viewport.getContext("2d")!;
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#FFFFFF";
            const data = new DataView(this.data.path);
            let bytePos = 0;
            while (bytePos < data.byteLength) {
                const x = data.getUint32(bytePos++);
                bytePos += 3;
                const y = data.getUint32(bytePos++);
                bytePos += 3;

                const coord = this.transformMapToViewport([x / 4, y / 4]);
                if (first) {
                    ctx.moveTo(coord[0], coord[1]);
                } else {
                    ctx.lineTo(coord[0], coord[1]);
                }
                first = false;
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    }

    private drawSpecialPoints() {
        const chargerPoint: [number, number] = [1024 / 2, 1024 / 2];
        this.drawSphere(this.transformMapToViewport(chargerPoint), "rgba(0,255,0,1)");


        if (this.selectedPoint) {
            this.drawSphere(this.transformMapToViewport(this.selectedPoint), "rgba(255,0,0,1)");
        }

        // let bot
        // this.drawSphere(point, "rgba(0,255,0,1)");

    }

    private drawSphere(point: [number, number], color: string ) {
        const ctx = this.viewport.getContext("2d")!;
        ctx.save();
        const grd = ctx.createRadialGradient(point[0], point[1], 1, point[0], point[1], 6 * 2);
        grd.addColorStop(0, color);
        grd.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(point[0], point[1], 6, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }


    private drawToolBar() {
        this.removeToolBar();
        this.toolbar = document.createElement("ons-bottom-toolbar");

        this.toolbar.appendChild(this.createButton("Goto",
            "ion-home, material:md-home", typeof this.selectedPoint !== "undefined"));
        this.viewportContainer.appendChild(this.toolbar);
    }

    private createButton(text: string, icon: string, enabled: boolean) {
        const button = document.createElement("ons-button");
        if (!enabled) { button.setAttribute("disabled", "true"); }
        button.setAttribute("modifier", "quiet");
        button.innerHTML = `<div class='tabbar__icon'>
                                <v-ons-icon icon='${icon}'/></div>
                            <div class='tabbar__label'>${text}</div>`;
        button.addEventListener("click", () => {
            (window as any).ons.notification.alert("GoTo started.");
        });
        return button;
    }

    private removeToolBar() {
        if (!this.toolbar || !this.toolbar.parentElement) { return; }
        this.toolbar.parentElement.removeChild(this.toolbar);
    }
}
