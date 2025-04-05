import { MessageFlags } from 'discord.js';
import fetch from 'node-fetch';

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

/**
 * Posts a message to a specific thread in a Discord channel as a silent notification.
 * @param threadId - The ID of the thread to post the message to.
 * @param message - The message content to post.
 * @returns A promise resolving to the response from the Discord API.
 */
export async function postMessageToThread(message: string): Promise<void> {
  const threadId = process.env.DISCORD_THREAD_ID;
  if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
    throw new Error(
      'DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ID is not set in the environment variables.',
    );
  }

  const url = `https://discord.com/api/v10/channels/${threadId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: message,
      flags: MessageFlags.SuppressNotifications, // This flag is used to send a silent notification
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to post message: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  console.log(`Message posted successfully to thread ${threadId}`);
}
