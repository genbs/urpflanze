import { ISceneChildPropArguments, IShapeLoopRepetition, TSceneChildProp } from "./scene-child";
import { vec2 } from 'gl-matrix';
import { IShapePrimitiveProps, IShapePrimitiveSettings } from "./shape-base";
/**
 *
 * @category Core.Props and Settings Interfaces
 */
export interface IShapeBufferProps extends IShapePrimitiveProps {
}
/**
 *
 * @category Core.Props and Settings Interfaces
 */
export interface IShapeBufferSettings extends IShapeBufferProps, IShapePrimitiveSettings {
    shape?: Float32Array | Array<number>;
}
/**
 *
 * @category Core.Types
 */
export declare type TShapeLoopGeneratorFormula = (shape_loop_repetition: IShapeLoopRepetition, prop_arguments: ISceneChildPropArguments) => vec2;
/**
 *
 * @category Core.Interfaces
 */
export interface IShapeLoopGenerator {
    start?: TSceneChildProp<number>;
    end?: TSceneChildProp<number>;
    inc?: TSceneChildProp<number>;
    vertex?: TShapeLoopGeneratorFormula;
}
/**
 *
 * @category Core.Props and Settings Interfaces
 */
export interface IShapeLoopProps extends IShapePrimitiveProps {
    /**
     *  <a href="[base_url]/IShapeLoopGenerator">IShapeLoopGenerator</a> for more details
     * @order -21
     */
    loop?: IShapeLoopGenerator;
}
/**
 *
 * @category Core.Props and Settings Interfaces
 */
export interface IShapeLoopSettings extends IShapeLoopProps, IShapePrimitiveSettings {
    shapeLoopPropsDependencies?: Array<string>;
}
/**
 *
 * @category Core.Primitive Interfaces
 */
export interface IRegularPolygonProps extends IShapeLoopProps {
    sideNumber?: TSceneChildProp<number>;
}
/**
 *
 * @category Core.Primitive Interfaces
 */
export interface IRegularPolygonSettings extends IRegularPolygonProps, IShapeLoopSettings {
}
/**
 *
 * @category Core.Primitive Interfaces
 */
export interface IRoseProps extends IShapeLoopProps {
    n?: TSceneChildProp<number>;
    d?: TSceneChildProp<number>;
}
/**
 *
 * @category Core.Primitive Interfaces
 */
export interface IRoseSettings extends IRoseProps, IShapeLoopSettings {
}
/**
 *
 * @category Core.Types
 */
export declare type TSpiralType = 'ARCHIMEDE' | 'HYPERBOLIC' | 'FERMAT' | 'LITUUS' | 'LOGARITHMIC';
/**
 *
 * @category Core.Primitive Interfaces
 */
export interface ISpiralProps extends IShapeLoopProps {
    spiral?: TSpiralType;
    twists?: TSceneChildProp<number>;
    twists_start?: TSceneChildProp<number>;
}
/**
 *
 * @category Core.Primitive Interfaces
 */
export interface ISpiralSettings extends ISpiralProps, IShapeLoopSettings {
}
/**
 *
 * @category Core.Primitive Interfaces
 */
export interface ILissajousProps extends IShapeLoopProps {
    wx?: TSceneChildProp<number>;
    wy?: TSceneChildProp<number>;
    wz?: TSceneChildProp<number>;
}
/**
 *
 * @category Core.Primitive Interfaces
 */
export interface ILissajousSettings extends ILissajousProps, IShapeLoopSettings {
}
//# sourceMappingURL=shape-primitive.d.ts.map