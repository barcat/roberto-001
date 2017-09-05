import guid from 'guid';

export default class Note {
  constructor(range, parentGridId) {
    this.id = guid.raw();
    this.parentGridId = parentGridId;
    this.range = range;
    this.isFocused = false;
    this.value = 'some txt';
  }
}
