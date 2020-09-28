import Scene from "../../core/Scene";
import DrawerCanvas from "../drawer-canvas/DrawerCanvas";
import { DrawOptions } from "../types/drawer-canvas";
import { IRenderSettings } from "../types/renedrer";
declare class SVGExporter {
    parse(drawer: DrawerCanvas, settings: IRenderSettings): string;
    static draw(scene: Scene, options: DrawOptions, resolution: number, decimals: number): Array<string>;
}
export default SVGExporter;
