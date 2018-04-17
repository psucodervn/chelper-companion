import { Message, MessageAction } from './models/messaging';
import axios from 'axios';

declare global {
  const chrome: any;
}

const isChrome = window.navigator.userAgent.toLowerCase().includes('chrome');

async function checkTab(tabId: number, changeInfo: object, tab: browser.tabs.Tab) {
  await browser.tabs.sendMessage(tabId, {
    action: MessageAction.CheckTab,
    payload: {
      tabId,
      url: tab.url,
    },
  });
}

async function parse(tab: browser.tabs.Tab) {
  await browser.tabs.sendMessage(tab.id, {
    action: MessageAction.Parse
  });
}

async function send(tabId: number, message: string) {
  try {
    await axios.post('http://localhost:4243', message, {
      timeout: 500,
    })
  } catch (err) {
    await browser.tabs.sendMessage(tabId, {
      action: MessageAction.TaskSent,
    });
  }
}

function enablePageAction(tabId: number) {
  if (isChrome) {
    chrome.pageAction.show(tabId);
  } else {
    browser.pageAction.show(tabId);
  }
}

function disablePageAction(tabId: number) {
  if (isChrome) {
    chrome.pageAction.hide(tabId);
  } else {
    browser.pageAction.hide(tabId);
  }
}

async function handleMessage(message: Message, sender: browser.runtime.MessageSender) {
  if (!sender.tab) return;

  switch (message.action) {
    case MessageAction.EnableParsing:
      enablePageAction(message.payload.tabId);
      break;
    case MessageAction.DisableParsing:
      disablePageAction(message.payload.tabId);
      break;
    case MessageAction.SendTask:
      await send(sender.tab.id, message.payload.message);
      break;
  }
}

browser.tabs.onUpdated.addListener(checkTab);
browser.pageAction.onClicked.addListener(parse);
browser.runtime.onMessage.addListener(handleMessage);



