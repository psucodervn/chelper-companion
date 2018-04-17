import { MessageAction } from './models/messaging';

let id: number;

export function init(tabId: number) {
  id = tabId;
}

/**
 * Enables the parse button for this tab.
 */
export async function enableParsing() {
  await browser.runtime.sendMessage({
    action: MessageAction.EnableParsing,
    payload: {
      tabId: id,
    },
  });
}

/**
 * Disables the parse button for this tab.
 */
export async function disableParsing() {
  await browser.runtime.sendMessage({
    action: MessageAction.DisableParsing,
    payload: {
      tabId: id,
    },
  });
}

export function htmlToElement(html: string): Element {
  return new DOMParser().parseFromString(html, 'text/html').body;
}
