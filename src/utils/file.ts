import fs from 'fs';
import Https from 'https';
import JSZip from 'jszip';

export const downloadFile = async (url: string, targetFilePath: string) => {
  return await new Promise((resolve, reject) => {
    Https.get(url, (response) => {
      const code = response.statusCode ?? 0;

      if (code >= 400) {
        return reject(new Error(response.statusMessage));
      }

      // handle redirects
      if (code > 300 && code < 400 && !!response.headers.location) {
        return downloadFile(response.headers.location, targetFilePath);
      }

      // save the file to disk
      const fileWriter = fs
        .createWriteStream(targetFilePath)
        .on('finish', () => {
          resolve({});
        });

      response.pipe(fileWriter);
    }).on('error', (error) => {
      reject(error);
    });
  });
};

export const unzip = async (
  targetFilePath: string,
  dir: string
): Promise<string[]> => {
  const fileContent = fs.readFileSync(targetFilePath);
  const jszipInstance = new JSZip();
  const result = await jszipInstance.loadAsync(fileContent);
  const keys = Object.keys(result.files);

  const cwd = createDirectoryInCwd(dir);

  for (let key of keys) {
    const item = result.files[key];
    if (item.dir) {
      fs.mkdirSync(`${cwd}/${item.name}`);
    } else {
      fs.writeFileSync(
        `${cwd}/${item.name}`,
        Buffer.from(await item.async('arraybuffer'))
      );
    }
  }

  return keys.map((key) => `${cwd}/${key}`);
};

/**
 *
 * @param path path to the folder to be created
 */
export const createDirectoryInCwd = (path: string): string => {
  const startsWithSlash = path[0] === '/';

  const createdFolderPath = `${process.cwd()}${
    startsWithSlash ? '' : '/'
  }${path}`;
  try {
    fs.mkdirSync(createdFolderPath);
    return createdFolderPath;
  } catch {
    // directory already exists
    return createdFolderPath;
  }
};
