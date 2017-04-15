export class ObjectId {
  $oid: string;

  static of(data) {
    if (data && data.constructor.name !== ObjectId.name) {
      if (data.$oid === undefined) {
        return new ObjectId();
      }

      return new ObjectId({ '$oid': data.$oid });
    }
    return data;
  }

  constructor(data = {}) {
    Object.assign(this, data);
  }

  str() {
    return `${this.$oid}`;
  }
}

export class Date {
  $date: number;

  static of(data) {
    if (data && data.constructor.name !== Date.name) {
      if (data.$date === undefined) {
        return new Date();
      }

      return new Date({ '$date': data.$date });
    }
    return data;
  }

  getValue() {
    return this.$date;
  }

  constructor(data = {}) {
    Object.assign(this, data);
  }
}


export class FilterModel {
  onlyVeg: boolean;
  onlyOpen: boolean;
  onlyNew: boolean;
  searchText: string;
  others: any;

  constructor(searchText = '') {
    this.onlyNew = false;
    this.onlyOpen = false;
    this.onlyVeg = false;
    this.searchText = searchText;
    this.others = {};
  }
}

export class OptionModel {
  label: string;
  value: string;
  checked: boolean;

  constructor(label: string, value: string = null, checked = false) {
    this.label = label;
    this.value = value || label;
    this.checked = checked;
  }

  getId() {
    return this.value.trim().replace(' ', '_');
  }
}
