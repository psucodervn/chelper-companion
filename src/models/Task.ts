import { Message, MessageAction } from './messaging';
import { Sendable } from './Sendable';

export abstract class Task implements Sendable {
  async send(): Promise<void> {
    const handleMessage = (message: Message, sender: browser.runtime.MessageSender) => {
      if (sender.tab) return;

      if (message.action === MessageAction.TaskSent) {
        browser.runtime.onMessage.removeListener(handleMessage);
        return;
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);

    await browser.runtime.sendMessage({
      action: MessageAction.SendTask,
      payload: {
        message: this.toString(),
      },
    });
  }
}
