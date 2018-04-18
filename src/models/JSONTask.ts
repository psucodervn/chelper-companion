import { Task } from './Task';

export class JSONTask extends Task {
  constructor(
    public site: string,
    public url: string,
    public name: string,
    public group: string,
    public timeLimit: string,
    public memoryLimit: string,
    public input: string,
    public output: string,
    public tests: {
      input: string,
      output: string,
    }[],
    public dirs: string[],
    public meta: object = {},
  ) {
    super();
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
