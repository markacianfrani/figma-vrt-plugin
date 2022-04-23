import { dispatch, handleEvent } from './codeMessageHandler';
figma.showUI(__html__, { width: 900, height: 900 });
import { DesignClient } from './DesignClient'
import { CanvasTestFrame } from './ui/model/CanvasTestFrame';
import { CanvasTestPage } from './ui/model/CanvasTestPage';
import { SnapshotType } from './ui/model/CanvasTestFrame';

const client = new DesignClient()
const TestPage = new CanvasTestPage()

figma.ui.onmessage = async (message) => {
	if (message.action === 'push') {
		// check if test page exists and do something
		if (TestPage.pageFrames.length < 1) {
			console.error('Need frames');
		}
		const frames = TestPage.pageFrames
		const pluginFrames = message.data
		frames.map(frame => {
			const pluginFrame = pluginFrames._pages.find(page => page.name === frame.name)
			if (!pluginFrame) {
				console.error('cant find pluginframe');
			}

			frame.paintSnapshot(SnapshotType.BASELINE, pluginFrame.baselineImage)
		})
		



	}

	if (message.action === 'query') {
		// check if test page exists and do something
		if (TestPage.pageFrames.length < 1) {
			console.error('Need frames');
		}

		const pageFrames = TestPage.pageFrames;
		pageFrames.map(async (pageFrame) => {
			const hasBaseline = pageFrame.snapshotIsPainted(SnapshotType.BASELINE)
			if (hasBaseline) {
				const imageFrame = await pageFrame.getSnapshotImageFrame(SnapshotType.BASELINE)
				const image = await imageFrame.exportAsync({
					format: "PNG",
					constraint: {
						type: "WIDTH",
						value: 1048
					}
				})
				dispatch('importSnapshotFromDocument', {
					name: pageFrame.name,
					type: SnapshotType.BASELINE,
					image: image
				})

			}

			const hasComparision = pageFrame.snapshotIsPainted(SnapshotType.COMPARISION)
			if (hasComparision) {
				const imageFrame = await pageFrame.getSnapshotImageFrame(SnapshotType.COMPARISION)
				const image = await imageFrame.exportAsync({
					format: "PNG",
					constraint: {
						type: "WIDTH",
						value: 1048
					}
				})
				dispatch('importSnapshotFromDocument', {
					name: pageFrame.name,
					type: SnapshotType.COMPARISION,
					image: image
				})

			}
		})

	}
	if (message.action === 'setup') {
		let testPage = client.findOrCreatePage('_test')
		let position = 0
		const pages = figma.root.children.filter(node => message.data.includes(node.id))
		pages.map(async (page) => {

			let frame = client.findOrCreateFrame(page.name, testPage)
			const canvasFrame = new CanvasTestFrame(frame, page.name)
			canvasFrame.initialize()
			TestPage.addFrame(canvasFrame)

			frame.y = position
			position = position + 2000

			testPage.appendChild(frame)


			console.log('frames', TestPage.pageFrames);

			dispatch('setupComplete', {
				page: page.id,
				frameId: frame.id,
			})
		})




	}

	if (message.action === 'paint') {
		// check if canvas page isnt set and do something about it.
		const testPage = TestPage.check()
		const { snapshotType, image, pageName } = message.data
		const page = figma.root.children.find(node => node.name === pageName) as PageNode

		// if (!testPage) {
		// 	testPage = client.findOrCreatePage('_test')
		// 	TestPage.setNode(testPage)
		// 	// throw new Error('cant find page')
		// }
		try {
			let figmaFrame = await TestPage.findFrameByName(pageName)
			// let figmaFrame = TestPage.pageFrames.find(frame => frame.name === pageName)
			// if (!figmaFrame) {
			// 	let frame = client.findOrCreateFrame(page.name, testPage)
			// 	figmaFrame = new CanvasTestFrame(frame, page.name)
			// 	figmaFrame.initialize()
			// 	TestPage.addFrame(figmaFrame)
			// 	testPage.appendChild(frame)
			// 	// create new frame

			console.log('figma', figmaFrame);
			

			// }
			TestPage.alignFrames()
			const result = await figmaFrame.paintSnapshot(snapshotType, image)
			dispatch('baselinePainted', result)
		} catch (e) {
			console.error(e);

		}
	}



	if (message.action === 'fetchPages') {
		const result = await client.fetchPages()
		dispatch('pagesFetched', result)
	}

	if (message.action === 'snapshotBaseline') {
		const page = figma.root.children.find(node => node.id === message.data)
		const image = await page.exportAsync({
			format: "PNG",
			constraint: {
				type: "WIDTH",
				value: 3048
			}
		})
		dispatch('baselineSnapshotsFetched', {
			name: page.name,
			nodeId: page.id,
			image: image
		})
	}

	if (message.action === 'snapshotComparision') {
		const page = figma.root.children.find(node => node.id === message.data)
		const image = await page.exportAsync(
			{
				format: "PNG",
				constraint: {
					type: "WIDTH",
					value: 3048
				}
			}
		)
		dispatch('comparisionSnapshotsFetched', {
			name: page.name,
			nodeId: page.id,
			image: image
		})

	}

}

