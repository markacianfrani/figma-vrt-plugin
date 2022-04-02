import { PageI } from "./Page";

export class PageSet {
  _pages: any = [];

  addPage(page: PageI) {
    this._pages.push(page);
    this._pages = [...new Set(this._pages)];
  }

  get pages(): [] {
    return this._pages;
  }

  clearPages() {
    this._pages = [];
  }

  getPageByNodeId(nodeId: string) {
    return this._pages.find((page: PageI) => page.nodeId === nodeId);
  }
}
