
import { DesignClient } from '../../DesignClient'

export enum SnapshotType {
	BASELINE = 'Baseline',
	COMPARISION = 'Comparision',
	DIFF = 'Diff'
}

export class CanvasTestFrame {
	pageName = ''
	pageNodeId = ''
	node = null
	name = ''
	client = null

	constructor(node, name) {
		this.node = node
		this.name = name
		this.client = new DesignClient()
	}

	initialize() {
		return new Promise(async(resolve, reject) => {

			this.node.name = this.name
			this.node.resize(3500, 1200)
			this.node.layoutMode = 'HORIZONTAL'
			this.node.paddingTop = 10
			this.node.paddingLeft = 10
			this.node.paddingBottom = 10
			this.node.paddingRight = 10
			this.node.itemSpacing = 20
			this.node.primaryAxisAlignItems = "CENTER"
			this.node.counterAxisAlignItems = 'CENTER'
			await this.initializeSnapshot(SnapshotType.BASELINE)
			await this.initializeSnapshot(SnapshotType.COMPARISION)
			await this.initializeSnapshot(SnapshotType.DIFF)
			resolve(true)
		})
	}

	async initializeSnapshot(snapshotType: SnapshotType) {
		return new Promise(async (resolve, reject) => {

			let baselineSnapshotFrame = await this.node.children.find(node => node.type === "FRAME" && node.name === snapshotType)
			if (!baselineSnapshotFrame) {
				baselineSnapshotFrame = await this.client.createSnapshotFrame(snapshotType) as FrameNode
				this.node.appendChild(baselineSnapshotFrame)
			}
			resolve(baselineSnapshotFrame)
		})
	}

	async paintSnapshot(snapshotType: SnapshotType, image) {
		return new Promise(async (resolve, reject) => {

			let arr = Uint8Array.from(Object.values(image))
			if (snapshotType === SnapshotType.DIFF) {
				const data = image.replace("data:image/png;base64,", "")
				arr = figma.base64Decode(data)
			}

			let snapshotFrame = await this.node.children.find(node => node.name === snapshotType)
			if (!snapshotFrame) {
				console.error('could not find frame', this.node.children);
				snapshotFrame = await this.initializeSnapshot(snapshotType)
				// reject()
			}
			const snapshotImage = snapshotFrame.children.find(node => node.name === 'Image')
			if (!snapshotImage) {
				console.error('could not find image');
				reject()
			}
			try {
				const img = figma.createImage(arr)
				snapshotImage.fills = [{
					imageHash: img.hash,
					scaleMode: "FIT",
					scalingFactor: 1,
					type: "IMAGE",
				}]




				resolve({
					pageName: this.name,
					type: snapshotType,
					rect: snapshotImage
				})


			} catch (e) {
				console.error('image too large', e);
				reject(e)


			}
		})

	}

	async getSnapshotImageFrame(snapshotType: SnapshotType) {
		const frame = this.node.children.find(node => node.name === snapshotType)
		if (!frame) {
			return null
		} else {
			return frame.children.find(node => node.name === 'Image')
		}



	}

	async snapshotIsPainted(snapshotType: SnapshotType) {
		const imageFrame = await this.getSnapshotImageFrame(snapshotType)
		if (!imageFrame) {
			console.error('Could not find Image');
		} else {
			return imageFrame.fills[0].type === 'IMAGE'
		}
	}
}