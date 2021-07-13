import got from "got";
import { createWriteStream } from "fs";
import { promisify } from "util";
import * as stream from "stream";
const pipeline = promisify(stream.pipeline);

export async function downloadFile(fromUrl: string, toFile: string) {
  const downloadStream = got.stream(fromUrl);
  const fileWriterStream = createWriteStream(toFile);

  downloadStream
    .on("downloadProgress", ({ transferred, total, percent }) => {
      const percentage = Math.round(percent * 100);
      console.error(`progress: ${transferred}/${total} (${percentage}%)`);
    })
    .on("error", (error) => {
      console.error(`Download failed: ${error.message}`);
    });

  await pipeline(downloadStream, fileWriterStream)
    .then(() => console.log(`File downloaded to ${toFile}`));
}