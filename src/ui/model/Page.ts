export interface PageI {
	name: string;
	nodeId: string;
	baselineImage: string | null
	comparisionImage: string | null
	diffImage: string | null
	status: string
	diffPercent: number
      }
      
      export class Page implements PageI {
	name = "";
	nodeId = "";
	baselineImage: string | null = null
	comparisionImage: string | null = null
	diffImage: string | null = null
	status = ''
	diffPercent = 0
      
      
	constructor(name: string, nodeId: string) {
	  this.name = name;
	  this.nodeId = nodeId;
	}
      
	setBaselineImage(image: string) {
	  this.baselineImage = image
	}
      
	clearBaselineImage() {
	  this.baselineImage = null
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
      