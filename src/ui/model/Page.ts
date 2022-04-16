export interface PageI {
	name: string;
	nodeId: string;
	baselineImage: string | null
	comparisionImage: string | null
	diffImage: string | null
	status: string
	diffPercent: number
	isVisible: boolean
      }
      
      export class Page implements PageI {
	name = "";
	nodeId = "";
	baselineImage: string | null = null
	baselineImageNodeId: string | null = null
	comparisionImage: string | null = null
	diffImage: string | null = null
	status = 'Waiting for Baseline'
	diffPercent = 0
	isVisible = true
	frameId: string = null
      
      
	constructor(name: string, nodeId: string) {
	  this.name = name;
	  this.nodeId = nodeId;
	}


	setFrameId(image: string) {
		this.frameId = image
	}
      
	setBaselineImage(image: string) {
	  this.baselineImage = image
	}
      
	setBaselineImageNodeId(nodeId: string) {
		this.baselineImageNodeId = nodeId
	}

	clearBaselineImage() {
	  this.baselineImage = null
	}
      
	setVisibility(value: boolean) {
		this.isVisible = value
	}
	toggleVisibility() {
		this.isVisible = !this.isVisible
	}

	setComparisionImage(image: string) {
	  this.comparisionImage = image
	}
      
	clearComparisionImage() {
	  this.comparisionImage = null
	}
      
	setDiffImage(image: string) {
	  this.diffImage = image
	}
      
	clearDiffImage() {
	  this.diffImage = null
	}
      }
      