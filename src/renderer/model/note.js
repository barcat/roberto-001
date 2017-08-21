import guid from 'guid';

export default class Note {
  constructor(range) {
    this.id = guid.raw();
    this.range = range;
    this.isFocused = false;
    this.value = 'some txt';
  }
}
