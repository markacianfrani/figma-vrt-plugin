import { DesignClient } from "../../DesignClient"
import { CanvasTestFrame } from "./CanvasTestFrame"
export class CanvasTestPage {
	pageFrames = []
	node: any
	client: any

	constructor() {
		this.client = new DesignClient()
	}

	check() {
		if (this.node) {
			if (this.node.removed) {
				const page = this.client.findOrCreatePage('_test')
				this.node = page
			}
		} else {
			const page = this.client.findOrCreatePage('_test')
			this.node = page
		}
		return this.node
	}

	addFrame(frame) {
		this.pageFrames.push(frame)
	}

	async findFrameByName(pageName) {
		this.check()

		let frame = this.node.children.find(node => node.name === pageName)
		if (!frame) {
			// const newFrame = this.client.findOrCreateFrame(pageName, this.node)
			const newFrame = figma.createFrame()
			newFrame.name = pageName
			frame = new CanvasTestFrame(newFrame, pageName)
			await frame.initialize()
			this.node.appendChild(newFrame)
			return frame

		} else {
			return new CanvasTestFrame(frame, pageName)
		}

	}

	alignFrames() {
		let position = 0 
		this.node.children.map(node => {
			node.y = position
			position = position + 2000
		})
	}

}