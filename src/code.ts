import { dispatch, handleEvent } from './codeMessageHandler';
import pixelmatch from "pixelmatch"
figma.showUI(__html__, { width: 500, height: 600 });

figma.ui.onmessage = async (message) => {
	
	if (message.action === 'fetchPages') {
		console.log('heard new pages');
		
		

		const pages = figma.root.children.map(async(page) => {
			const image = await page.exportAsync()
			return {
				name: page.name,
				nodeId: page.id,
				image: image
			}

		})

		const result = await Promise.all(pages)
		dispatch('pagesFetched', result)


	}

}

// The following shows how messages from the UI code can be handled in the main code.
handleEvent('createNode', () => {
	const node = figma.createRectangle();
	node.name = node.id;

	// This shows how the main code can send messages to the UI code.
	dispatch('nodeCreated', node.id);
});


handleEvent('oldfetchPages', () => {
	// const testPages = await figma.root.children
	// const page = await testPages[0].exportAsync()
	// console.log('page', page);
	
	
	const pages = figma.root.children.map((page) => {

		

		// const diffCount = pixelmatch(
		// 	img1.data,
		// 	img2.data,
		// 	diff.data,
		// 	{ threshold: 0.1 }
		//       );
		
		return {
			name: page.name,
			nodeId: page.id,
		}
	})

	// This shows how the main code can send messages to the UI code.
	dispatch('pagesFetched', pages);
});
