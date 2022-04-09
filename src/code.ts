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
		const page = figma.root.children.find(node => node.id === message.data)
		const image = await page.exportAsync()
		dispatch('baselineSnapshotsFetched', {
				name: page.name,
				nodeId: page.id,
				image: image
		})
	}

	if (message.action === 'snapshotComparision') {
		const page = figma.root.children.find(node => node.id === message.data)
		const image = await page.exportAsync()
		dispatch('comparisionSnapshotsFetched', {
				name: page.name,
				nodeId: page.id,
				image: image
		})

	}

}

