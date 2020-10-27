import SceneChild from "../../core/SceneChild";
import DrawerCanvas from "../drawers/drawer-canvas/DrawerCanvas";
import { IProject, IProjectSceneChild } from "../types/project";
/**
 *
 * @category Services.Exporters
 * @class JSONExporter
 */
declare class JSONExporter {
    static parse(drawer: DrawerCanvas, name?: string): string;
    static toString(project: IProject): string;
    static parseAsProject(drawer: DrawerCanvas, name?: string): IProject;
    static parseSceneChild(sceneChild: SceneChild, parent_id?: string | number, depth?: number): IProjectSceneChild;
}
export default JSONExporter;
//# sourceMappingURL=JSONExporter.d.ts.map