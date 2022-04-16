export class DesignClient {
	async fetchPages() {
		const pages = figma.root.children.map(async (page) => {
			return {
				name: page.name,
				nodeId: page.id,
			}

		})

		return await Promise.all(pages)

	}

	findOrCreatePage(pageName: string) {
		const page = figma.root.children.find(page => page.name === pageName)
		if (page) {
			return page
		} else {
			const newPage = figma.createPage()
			newPage.name = "_test"
			return newPage

		}
	}

	findOrCreateFrame(pageName: string, parent) {
		const page = parent.children.find(page => page.name === pageName)
		if (page) {
			return page
		} else {
			const newPage = figma.createFrame()
			newPage.name = pageName
			return newPage
		}
	}

	findOrCreateRectangle(pageName: string, parent) {
		const page = parent.children.find(page => page.name === pageName)
		if (page) {
			return page
		} else {
			const newPage = figma.createRectangle()
			newPage.name = pageName
			return newPage
		}
	}

	async createSnapshotFrame(name) {
		return new Promise(async(resolve, reject) => {

			const snapshotFrame = figma.createFrame()
			snapshotFrame.name = name
			snapshotFrame.resize(1000, 1000)
			snapshotFrame.layoutMode = 'VERTICAL'
			snapshotFrame.cornerRadius = 6
			snapshotFrame.strokeWeight = 6
			snapshotFrame.strokes = [{
				type: "SOLID",
				color: {
					r: 0.631372549019608,
					g: 0.631372549019608,
					b: 0.631372549019608,
				},
			}]

			let baselineHangtagFrame = figma.createFrame()
			baselineHangtagFrame.name = "hangtag"
			baselineHangtagFrame.resize(1000, 105)
			baselineHangtagFrame.layoutMode = "VERTICAL"
			baselineHangtagFrame.paddingTop = 16
			baselineHangtagFrame.paddingLeft = 16
			baselineHangtagFrame.paddingBottom = 16
			baselineHangtagFrame.paddingRight = 16
			const titleNode = figma.createText()
			await figma.loadFontAsync({ family: "Inter", style: "Regular" })
			titleNode.characters = name
			titleNode.fontSize = 60

			const baselineRectangle = figma.createRectangle()
			baselineRectangle.name = "Image"
			baselineRectangle.resize(1000, 1000)
			const fills = JSON.parse(JSON.stringify(baselineRectangle.fills))
			fills[0].color.r = 0.5
			baselineRectangle.fills = fills

			baselineHangtagFrame.appendChild(titleNode)

			snapshotFrame.appendChild(baselineRectangle)
			snapshotFrame.appendChild(baselineHangtagFrame)
			resolve(snapshotFrame)
		})

	}

}