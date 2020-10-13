import {
	IBaseRepetition,
	IRepetition,
	ISceneChildPropArguments,
	ISceneChildProps,
	ISceneChildSettings,
	TSceneChildProp,
} from '@core/types/scene-child'
import SceneChild from '@core/SceneChild'
import ShapePrimitive from '@core/shapes/ShapePrimitive'
import Shape from '@core/shapes/Shape'

/**
 * Object for index the buffer
 *
 * @category Core.Interfaces
 */
export interface IBufferIndex {
	/**
	 * Reference to shape
	 */
	shape: ShapePrimitive
	/**
	 * Parent indexing
	 */
	parent?: Omit<IBufferIndex, 'shape'> & { shape: Shape }
	/**
	 * Frame length
	 */
	frame_length: number

	/**
	 * Current repetition reference oof frame
	 */
	repetition: IRepetition
}

/**
 * Callback to pass at vertextCallback property
 *
 * @category Core.Types
 */
export type TVertexCallback = (
	vertex: Array<number> | Float32Array,
	prop_arguments: ISceneChildPropArguments,
	vertex_repetition: IBaseRepetition
) => void

/**
 * ShapeBaseSettings
 *
 * @category Core.Props and Settings Interfaces
 */
export interface IShapeBaseSettings extends ISceneChildSettings {
	// With this parameter the shape will be created at each repetition,
	// useful if you want to encapsulate this shape in another and use its <mark>repetition</mark> object.
	// fillColor, strokeColor and lineWidth don't need to as they are generated during the buffer stream.
	bUseParent?: boolean

	// Callback to apply transform at any vertex
	vertexCallback?: TVertexCallback
}

// Shape

/**
 * Shape settings
 *
 * @category Core.Props and Settings Interfaces
 */
export interface IShapeSettings extends IShapeBaseSettings {
	/**
	 * shape to apply repetitions and transformation
	 */
	shape?: SceneChild
}

/**
 *
 *
 * @category Core.Enums
 */
export enum EShapePrimitiveAdaptMode {
	/**
	 * The buffer is not changed
	 * @order 1
	 */
	None,

	/**
	 * The buffer is scaled in a range between [-1, -1] and [1,1]
	 * @order 2
	 */
	Scale = 1 << 1,

	/**
	 * The buffer is scaled in a range between [-1, -1] and [1,1] and is centered
	 * @order 3
	 */
	Center = 1 << 2,

	/**
	 * The buffer is adapted centrally and expanded in a range between [-1, -1] and [1,1]
	 * @order 4
	 */
	Fill = 1 << 3,
}

/**
 *
 * @category Core.Props and Settings Interfaces
 */
export interface IShapePrimitiveProps extends ISceneChildProps {
	/**
	 * scalar that multiplies the buffer or loop
	 * @order -20
	 */
	sideLength?: TSceneChildProp<number | Array<number>>

	/**
	 * fill color of the shape, hsl or rgb is preferred
	 * @order -19
	 */
	fillColor?: TSceneChildProp<number | string>

	/**
	 * stroke color oh the shape, hsl or rgb is preferred
	 * @order -18
	 */
	strokeColor?: TSceneChildProp<number | string>

	/**
	 * stroke dimension
	 * @order -17
	 */
	lineWidth?: TSceneChildProp<number>
}

/**
 *
 * @category Core.Props and Settings Interfaces
 */
export interface IShapePrimitiveSettings extends IShapePrimitiveProps, IShapeBaseSettings {
	/**
	 * Adapt buffer mode, see <a href="[base_url]/EShapePrimitiveAdaptMode">EShapePrimitiveAdaptMode</a> for more details
	 */
	adaptMode?: EShapePrimitiveAdaptMode

	/**
	 * Callback to apply transform at any vertex
	 */
	bCloseShape?: boolean
}

/**
 * Size of a buffer and its position relative to the scene.
 * cx|y is the center
 *
 * @category Core.Interfaces
 */
export interface IShapeBounding {
	/**
	 * @order 1
	 */
	x: number

	/**
	 * @order 2
	 */
	y: number

	/**
	 * @order 3
	 */
	cx: number
	/**
	 * @order 4
	 */
	cy: number

	/**
	 * @order 5
	 */
	width: number

	/**
	 * @order 5
	 */
	height: number
}
