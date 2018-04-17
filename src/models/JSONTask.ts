import { Task } from './Task';

export class JSONTask extends Task {
  name: string;
  group: string;

  constructor(name: string, group: string) {
    super();
    this.name = name;
    this.group = group;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
