import { d1Run } from "./d1.js";

export async function saveUpload(file: {
  key: string;
  name: string;
  size: number;
  ufsUrl: string;
}): Promise<void> {
  await d1Run(
    "INSERT INTO uploads (id, key, url, name, size) VALUES (?, ?, ?, ?, ?) ON CONFLICT(key) DO NOTHING",
    [crypto.randomUUID(), file.key, file.ufsUrl, file.name, String(file.size)],
  );
}
