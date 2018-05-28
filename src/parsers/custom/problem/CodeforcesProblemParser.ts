import { DefaultParser } from '../../default/DefaultParser';
import { DefaultWebsite } from '../../../models/DefaultTask';
import { Sendable } from "../../../models/Sendable";
import { htmlToElement } from "../../../utils";
import { JSONTask } from "../../../models/JSONTask";

export class CodeforcesProblemParser extends DefaultParser {
  website: DefaultWebsite = DefaultWebsite.Codeforces;

  getMatchPatterns(): string[] {
    return [
      'http://codeforces.com/contest/*/problem/*',
      'http://codeforces.com/problemset/problem/*/*',
      'http://codeforces.com/gym/*/problem/*',
      'http://codeforces.com/group/*/contest/*/problem/*',
    ];
  }

  async parse(html: string, url: string = ''): Promise<Sendable> {
    const elem = htmlToElement(html);
    const group =  elem.querySelector('.rtable > tbody:nth-child(1) > tr:nth-child(1) > th:nth-child(1) > a:nth-child(1)').textContent;

    const header = elem.querySelector('div.header');
    header.querySelectorAll('div.property-title').forEach((value, index, listObj) => listObj[index].remove());
    const name = header.querySelector('.title').textContent;
    const timeLimit = header.querySelector('.time-limit').textContent;
    const memoryLimit = header.querySelector('.memory-limit').textContent;
    let input = header.querySelector('.input-file').textContent;
    if (input === 'standard input') input = 'stdin';
    let output = header.querySelector('.output-file').textContent;
    if (output === 'standard output') output = 'stdout';

    const sampleTests = elem.querySelector('div.sample-test');
    const inputs: string[] = [], outputs: string[] = [];
    sampleTests.querySelectorAll('div.input > pre').forEach(value => {
      inputs.push(value.innerHTML.replace(/<br>/g, '\n'));
    });
    sampleTests.querySelectorAll('div.output > pre').forEach(value => {
      outputs.push(value.innerHTML.replace(/<br>/g, '\n'));
    });
    console.assert(inputs.length !== output.length, "invalid sample tests format");
    const tests = inputs.map((value, index) => ({ input: value, output: outputs[index] }) );
    const dirs = this.getDirs(url);

    return new JSONTask(
      this.website,
      url,
      name,
      group,
      timeLimit,
      memoryLimit,
      input,
      output,
      tests,
      dirs,
    );
  }

  private getDirs(url: string): string[] {
    let regexs = [
      /contest\/(\d+)\/problem\/(\S+)/i,
      /problemset\/problem\/(\d+)\/(\S+)/i,
      /gym\/(\d+)\/problem\/(\S+)/i,
      /group\/.*\/contest\/(\d+)\/problem\/(\S+)/i,
    ];
    for (let re of regexs) {
      let matches = url.match(re);
      if (matches !== null) return matches.slice(1);
    }
    return [];
  }
}
