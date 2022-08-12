import fs from 'fs';
import { CompleteRuianData, RuianData } from '../types/ruian-data';

import { District, Mop, Point, Region, State } from '../types/transformed-data';
import { krovakStringToGps } from './krovat-to-gps';

const PRAGUE_REGION_NAME = 'Prah';
const CAPITAL_WORD_PART = 'Hlavn';

export const trimCompleteRuianData = (
  completeData: CompleteRuianData
): RuianData => {
  const trimmedRuianData: RuianData = {
    'vf:Staty': completeData['vf:Staty'],
    'vf:Vusc': completeData['vf:Vusc'],
    'vf:Okresy': completeData['vf:Okresy'],
    'vf:Mop': completeData['vf:Mop'],
  };

  return trimmedRuianData;
};

export const transformState = (
  ruianState: RuianData['vf:Staty']['vf:Stat']
): State => {
  const krovakString =
    ruianState['sti:Geometrie']['sti:DefinicniBod']['gml:Point']['gml:pos'];

  const gpsCoordinates = krovakStringToGps(krovakString);

  const mappedState: State = {
    id: ruianState['sti:Kod'],
    name: ruianState['sti:Nazev'],
    point: {
      type: 'Point',
      coordinates: gpsCoordinates,
    },
  };

  return mappedState;
};

export const transformRegions = (
  ruianRegions: RuianData['vf:Vusc']['vf:Vusc']
): Region[] => {
  const mappedRegions: Region[] = ruianRegions.map((ruianRegion) => {
    const krovakString =
      ruianRegion['vci:Geometrie']['vci:DefinicniBod']['gml:Point']['gml:pos'];
    const gpsCoordinates = krovakStringToGps(krovakString);
    const pointType: Point['type'] = 'Point';

    return {
      id: ruianRegion['vci:Kod'],
      name: ruianRegion['vci:Nazev'],
      point: {
        type: pointType,
        coordinates: gpsCoordinates,
      },
    };
  });

  return mappedRegions;
};

export const transformDistricts = (
  ruianDistricts: RuianData['vf:Okresy']['vf:Okres']
): District[] => {
  const mappedDistricts: District[] = ruianDistricts
    .map((ruianDistrict) => {
      let point: District['point'];
      if (ruianDistrict['oki:Geometrie']) {
        const krovakString =
          ruianDistrict['oki:Geometrie']['oki:DefinicniBod']['gml:Point'][
            'gml:pos'
          ];
        point = {
          type: 'Point',
          coordinates: krovakStringToGps(krovakString),
        };
      }

      return {
        id: ruianDistrict['oki:Kod'],
        name: ruianDistrict['oki:Nazev'],
        point,
        region: ruianDistrict['oki:Vusc']['vci:Kod'],
      };
    })
    .filter(Boolean);

  return mappedDistricts;
};

export const transformMops = (
  ruianMops: RuianData['vf:Mop']['vf:Mop'],
  pragueRegionId: number
): Mop[] => {
  const mappedMops: Mop[] = ruianMops.map((ruianMop) => {
    const krovakString =
      ruianMop['mpi:Geometrie']['mpi:DefinicniBod']['gml:Point']['gml:pos'];
    const gpsCoordinates = krovakStringToGps(krovakString);
    const pointType: Point['type'] = 'Point';

    return {
      id: ruianMop['mpi:Kod'],
      name: ruianMop['mpi:Nazev'],
      point: {
        type: pointType,
        coordinates: gpsCoordinates,
      },
      region: pragueRegionId,
    };
  });

  return mappedMops;
};

export const transformRuianData = (ruianData: RuianData) => {
  const regions = transformRegions(ruianData['vf:Vusc']['vf:Vusc']);

  const pragueRegion = regions.find((region) => {
    const regionNameLowerCase = region.name.toLocaleLowerCase();
    const includesCapitalWord = regionNameLowerCase.includes(
      CAPITAL_WORD_PART.toLocaleLowerCase()
    );
    const includesPragueWord = regionNameLowerCase.includes(
      PRAGUE_REGION_NAME.toLocaleLowerCase()
    );

    return includesCapitalWord && includesPragueWord;
  });

  const mappedRuianData = {
    state: transformState(ruianData['vf:Staty']['vf:Stat']),
    regions,
    districts: transformDistricts(ruianData['vf:Okresy']['vf:Okres']),
    mops: transformMops(ruianData['vf:Mop']['vf:Mop'], pragueRegion?.id),
  };

  fs.writeFile(
    process.cwd() + '/artifacts/mappedCadastreData.json',
    JSON.stringify(mappedRuianData),
    'utf8',
    () => {}
  );
};
