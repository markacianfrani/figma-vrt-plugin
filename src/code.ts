import { dispatch, handleEvent } from './codeMessageHandler';
figma.showUI(__html__, { width: 900, height: 900 });

figma.ui.onmessage = async (message) => {
	
	if (message.action === 'fetchPages') {
		const pages = figma.root.children.map(async(page) => {
			return {
				name: page.name,
				nodeId: page.id,
			}

		})

		const result = await Promise.all(pages)
		dispatch('pagesFetched', result)
	}

	if (message.action === 'snapshotBaseline') {
		
		const pages = figma.root.children.map(async(page) => {
			const image = await page.exportAsync()
			return {
				name: page.name,
				nodeId: page.id,
				image: image
			}

		})

		const result = await Promise.all(pages)
		dispatch('baselineSnapshotsFetched', result)
	}

	if (message.action === 'snapshotComparision') {
		const pages = figma.root.children.map(async(page) => {
			const image = await page.exportAsync()
			return {
				name: page.name,
				nodeId: page.id,
				image: image
			}

		})

		const result = await Promise.all(pages)
		dispatch('comparisionSnapshotsFetched', result)
	}

}

