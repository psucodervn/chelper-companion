import { DefaultParser } from '../../default/DefaultParser';
import { DefaultTask, DefaultWebsite } from '../../../models/DefaultTask';
import { Test } from "../../../models/Test";
import { Sendable } from "../../../models/Sendable";
import { htmlToElement } from "../../../utils";
import { CustomTask } from "../../../models/CustomTask";
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

  async parse(html: string): Promise<Sendable> {
    const task = new JSONTask("Problem A: Beginner", "Round 1A");
    return task;
  }
}
