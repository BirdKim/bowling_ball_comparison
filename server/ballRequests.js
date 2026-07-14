import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const requestsFilePath = path.join(__dirname, 'data', 'ball-requests.json');

async function readRequests() {
  try {
    const file = await fs.readFile(requestsFilePath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(path.dirname(requestsFilePath), { recursive: true });
      await fs.writeFile(requestsFilePath, '[]');
      return [];
    }
    throw error;
  }
}

async function writeRequests(requests) {
  await fs.writeFile(requestsFilePath, JSON.stringify(requests, null, 2));
}

export async function listBallRequests() {
  return readRequests();
}

export async function addBallRequest(payload) {
  const requests = await readRequests();
  const requestEntry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...payload,
  };

  requests.unshift(requestEntry);
  await writeRequests(requests);
  return requestEntry;
}
