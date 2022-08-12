import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

import { createDirectoryInCwd, downloadFile, unzip } from './utils/file';
import {
  transformRuianData,
  trimCompleteRuianData,
} from './utils/xml-to-object-mapper';
import { RuianXMLDataset } from './types/ruian-data';
import { cuzkUrlBuilder } from './utils/cuzk-file-url-builder';

(async () => {
  const artifactsDirectory = '/artifacts';
  const artifactsDirectoryPath = createDirectoryInCwd(artifactsDirectory);

  const targetFilePath = artifactsDirectoryPath + '/file.zip';

  await downloadFile(cuzkUrlBuilder(), targetFilePath);

  const [filePath] = await unzip(targetFilePath, artifactsDirectory);

  const file = fs.readFileSync(filePath);

  const parser = new XMLParser();

  const parsedResult = parser.parse(file) as RuianXMLDataset;

  const trimmedRuianData = trimCompleteRuianData(
    parsedResult['vf:VymennyFormat']['vf:Data']
  );

  transformRuianData(trimmedRuianData);
})();
