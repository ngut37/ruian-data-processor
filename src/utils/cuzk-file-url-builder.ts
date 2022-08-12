import { daysOfMonthsMap } from '../types/days-in-months-map';

const CUZK_URL_BASE = 'https://vdp.cuzk.cz/vymenny_format/soucasna/';

enum DATA_TYPE {
  complete = 'U',
  incremental = 'Z',
}

enum DATA_SET {
  complete = 'K',
  basic = 'Z',
}

enum SOURCE {
  current = 'S',
  historic = 'H',
}

enum STRUCTURE {
  basic = 'Z',
  generalizedBorders = 'G',
  originalHBorders = 'H',
  pictures = 'O',
}

enum SCOPE {
  state = 'ST',
  municipality = 'OB',
}

type OptionsVariations = {
  dataType: DATA_TYPE;
  dataSet: DATA_SET;
  source: SOURCE;
  structure: STRUCTURE;
  scope: SCOPE;
  municipalityId?: number;
};

//20220630_ST_UZSZ

const OPTIONS: OptionsVariations = {
  scope: SCOPE.state,
  dataType: DATA_TYPE.complete,
  dataSet: DATA_SET.basic,
  source: SOURCE.current,
  structure: STRUCTURE.basic,
};

export const cuzkUrlBuilder = (
  date: Date = new Date(),
  options: OptionsVariations = OPTIONS
) => {
  // Probably use moment.js for this case
  // to set the moment to last day of the given  month
  // and to easily get formatted date in YYYYMMDD format
  const month = date.getMonth() === 0 ? 12 : date.getMonth();
  const year = month === 12 ? date.getFullYear() - 1 : date.getFullYear();
  const daysInMonth = daysOfMonthsMap[month];

  const concatenatedDate = `${year}${
    month < 10 ? `0${month}` : month
  }${daysInMonth}`;

  const { scope, dataType, dataSet, source, structure, municipalityId } =
    options;

  let mappedScope = '';
  if (scope === SCOPE.municipality) {
    if (!municipalityId)
      throw new Error(
        'If scope is SCOPE.municipality, municipalityId needs to be provided.'
      );
    mappedScope = `${SCOPE.municipality}_${municipalityId}`;
  } else {
    mappedScope = SCOPE.state;
  }

  const concatenatedOptions = `${mappedScope}_${dataType}${dataSet}${source}${structure}`;

  return (
    CUZK_URL_BASE + `${concatenatedDate}_${concatenatedOptions}` + '.xml.zip'
  );
};
