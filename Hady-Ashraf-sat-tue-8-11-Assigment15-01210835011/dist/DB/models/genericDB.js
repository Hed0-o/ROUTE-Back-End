export class Storage {
    items = [];
    addItem(item) {
        this.items.push(item);
    }
    removeItem(item) {
        this.items = this.items.filter((i) => i !== item);
    }
    getItems() {
        return this.items;
    }
}
//# sourceMappingURL=genericDB.js.map