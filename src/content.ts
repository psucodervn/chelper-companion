import { Message, MessageAction } from './models/messaging';
import { Parser } from './parsers/Parser';
import { parsers } from './parsers/parsers';
import { disableParsing, enableParsing, init } from './utils';

// This package has no types
const Nanobar = require('nanobar');

let activeParser: Parser = null;


async function checkTab(tabId: number, url: string): Promise<void> {
  init(tabId);

  for (let i = 0; i < parsers.length; i++) {
    const parser = parsers[i];

    const hasMatchingPattern = parser
      .getRegularExpressions()
      .some(r => r.test(url));

    if (hasMatchingPattern && parser.canHandlePage()) {
      activeParser = parser;
      await activeParser.load();
      break;
    }
  }
}

async function parse() {
  await disableParsing();
  (window as any).nanoBar = new Nanobar();

  document.querySelectorAll('.bar').forEach(bar => {
    (bar as HTMLElement).style.backgroundColor = '#3498db';
  });

  try {
    const sendable = await activeParser.parse(document.body.innerHTML);
    (window as any).nanoBar.go(100);
    await sendable.send();
  } catch (err) {
    console.error(err);
  }

  await enableParsing();
}

async function handleMessage(message: Message, sender: browser.runtime.MessageSender) {
  if (sender.tab) return;

  switch (message.action) {
    case MessageAction.CheckTab:
      checkTab(message.payload.tabId, message.payload.url);
      break;
    case MessageAction.Parse:
      await parse();
      break;
  }
}

browser.runtime.onMessage.addListener(handleMessage);
