import { dispatch, handleEvent } from './codeMessageHandler';
figma.showUI(__html__, { width: 500, height: 600 });

// The following shows how messages from the UI code can be handled in the main code.
handleEvent('createNode', () => {
	const node = figma.createRectangle();
	node.name = node.id;

	// This shows how the main code can send messages to the UI code.
	dispatch('nodeCreated', node.id);
});


handleEvent('fetchPages', () => {
	const pages = figma.root.children.map(page => {
		return {
			name: page.name,
			nodeId: page.id
		}
	})

	// This shows how the main code can send messages to the UI code.
	dispatch('pagesFetched', pages);
});
