import Scene from '@core/Scene'

import SceneChild from '@core/SceneChild'
import { IDrawerSVGOptions } from '@services/types/drawer-canvas'
import { now } from 'src/Utilites'
import { vec2 } from 'gl-matrix'
import Drawer from '@services/drawers/Drawer'

class DrawerSVG extends Drawer<IDrawerSVGOptions, {}> {
	private container: HTMLElement

	constructor(
		scene: Scene | undefined,
		container: HTMLElement,
		drawerOptions: IDrawerSVGOptions = {},
		ratio: number | undefined = undefined,
		resolution = 0
	) {
		super(scene, ratio, resolution)

		this.container = container

		this.drawerOptions = {
			time: drawerOptions.time ?? 0,
			clear: drawerOptions.clear ?? true,
			decimals: drawerOptions.decimals || 2,
			noBackground: drawerOptions.noBackground ?? false,
			ghosts: drawerOptions.ghosts || 0,
			ghost_skip_time: drawerOptions.ghost_skip_time ?? 30,
			ghost_skip_function: drawerOptions.ghost_skip_function,
		}
	}

	/**
	 * Draw current scene
	 *
	 * @returns {number}
	 * @memberof DrawerCanvas
	 */
	public draw(): number {
		let draw_time = 0

		const timeline = this.timeline
		const drawAtTime = timeline.getTime()
		const drawerOptions: IDrawerSVGOptions & { ghost_index: number | undefined } = {
			...this.drawerOptions,
			ghost_index: undefined,
			clear: this.drawerOptions.clear || timeline.getCurrentFrame() <= 0,
			time: drawAtTime,
		}

		const paths: Array<SVGPathElement> = []

		if (drawerOptions.ghosts) {
			Drawer.eachGhosts(drawerOptions, timeline, ghostDrawerOptions => {
				draw_time += DrawerSVG.draw(this.scene, paths, ghostDrawerOptions, this.resolution)
			})
		}

		draw_time += DrawerSVG.draw(this.scene, paths, drawerOptions, this.resolution)

		this.appendSVGFromPaths(paths, drawerOptions)

		return draw_time
	}

	protected appendSVGFromPaths(paths: Array<SVGPathElement>, drawerOptions: IDrawerSVGOptions) {
		if (this.scene && this.container) {
			while (this.container.lastChild) this.container.removeChild(this.container.lastChild)

			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			svg.setAttribute('width', this.scene.width + '')
			svg.setAttribute('height', this.scene.height + '')
			svg.setAttribute('viewBox', `0 0 ${this.scene.width} ${this.scene.height}`)

			const comm = document.createComment('Created with Urpflanze.js')

			svg.appendChild(comm)

			if (!drawerOptions.noBackground) {
				const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
				background.setAttribute('width', this.scene.width + '')
				background.setAttribute('height', this.scene.height + '')
				background.setAttribute('fill', this.scene.background)

				svg.appendChild(background)
			}

			paths.forEach(path => svg.appendChild(path))

			this.container.appendChild(svg)
		}
	}

	public static draw(
		scene: Scene,
		paths: Array<SVGPathElement>,
		options: IDrawerSVGOptions & { ghost_index?: number },
		resolution?: number
	): number {
		const start_time = now()

		const time: number = options.time ?? 0
		const decimals: number = options.decimals as number
		const bGhost: boolean =
			typeof options.ghosts !== 'undefined' &&
			options.ghosts > 0 &&
			typeof options.ghost_index !== 'undefined' &&
			options.ghost_index > 0
		const ghostMultiplier: number = bGhost
			? 1 - (options.ghost_index as number) / ((options.ghosts as number) + 0.5)
			: 0

		const width: number = scene.width
		const height: number = scene.height
		resolution = resolution || width

		let logFillColorWarn = false
		let logStrokeColorWarn = false

		scene.current_time = time
		scene.getChildren().forEach((sceneChild: SceneChild) => {
			if (
				!sceneChild.data ||
				!(sceneChild.data.visible === false) ||
				!(bGhost && sceneChild.data.disableGhost === true)
			) {
				sceneChild.generate(time, true)

				sceneChild.stream(streamCallback => {
					const tempPath = []

					for (let i = 0; i < streamCallback.frame_length; i += 2) {
						tempPath.push(
							streamCallback.buffer[streamCallback.frame_buffer_index + i].toFixed(decimals) +
								' ' +
								streamCallback.buffer[streamCallback.frame_buffer_index + i + 1].toFixed(decimals)
						)
					}

					if (streamCallback.fillColor) {
						if (bGhost) {
							const color = Drawer.ghostifyColor(streamCallback.fillColor, ghostMultiplier)
							if (color) {
								streamCallback.fillColor = color
							} else if (!logFillColorWarn) {
								console.warn(`[Urpflanze:DrawerCanvas] Unable ghost fill color '${streamCallback.fillColor}', 
                            please enter a rgba or hsla color`)
								logFillColorWarn = true
							}
						}
					}

					if (streamCallback.strokeColor) {
						if (bGhost) {
							const color = Drawer.ghostifyColor(streamCallback.strokeColor, ghostMultiplier)
							if (color) {
								streamCallback.strokeColor = color
							} else if (!logStrokeColorWarn) {
								console.warn(`[Urpflanze:DrawerCanvas] Unable ghost stroke color '${streamCallback.strokeColor}', 
                            please enter a rgba or hsla color`)
								logStrokeColorWarn = true
							}
							streamCallback.lineWidth *= ghostMultiplier
						}
					}

					const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
					path.setAttribute('d', `M${tempPath.join(' L')} ${streamCallback.shape.isClosed() ? 'Z' : ''}`)
					path.setAttribute('fill', streamCallback.fillColor || 'none')
					if (streamCallback.strokeColor) {
						path.setAttribute('stroke', streamCallback.strokeColor)
						path.setAttribute('stroke-width', (streamCallback.lineWidth || 1) + '')
					}
					paths.push(path)
				})
			}
		})

		const end_time = now()

		return end_time - start_time
	}
}

export default DrawerSVG
