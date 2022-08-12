export type RuianGeometry = {
  'gml:Point': {
    'gml:pos': string;
  };
};

export type RuianState = {
  'sti:DatumVzniku': string;
  'sti:Geometrie': {
    'sti:DefinicniBod': RuianGeometry;
  };
  'sti:GlobalniIdNavrhu': number;
  'sti:IdTransakce': number;
  'sti:Kod': number;
  'sti:Nazev': string;
  'sti:NutsLau': string;
  'sti:PlatiOd': string;
};

export type RuianRegion = {
  'vci:DatumVzniku': string;
  'vci:Geometrie': {
    'vci:DefinicniBod': RuianGeometry;
  };
  'vci:GlobalniIdNavrhu': number;
  'vci:IdTransakce': number;
  'vci:Kod': number;
  'vci:Nazev': string;
  'vci:NutsLau': string;
  'vci:PlatiOd': string;

  // not used (there 8 e.g. Střední Čechy, Jihozápad etc.)
  'vci:RegionSoudrznosi': {
    'rsi:Kod': number;
  };
};

export type RuianDistrict = {
  'oki:DatumVzniku': string;
  'oki:Geometrie': {
    'oki:DefinicniBod': RuianGeometry;
  };
  'oki:GlobalniIdNavrhu': number;
  'oki:IdTransakce': number;
  'oki:Kod': number;
  'oki:Nazev': string;
  // not needed
  'oki:NespravneUdaje': Record<string, any>;
  'oki:Nespravny': boolean;
  'oki:NutsLau': string;
  'oki:PlatiOd': string;
  'oki:Vusc': {
    'vci:Kod': number;
  };
};

export type RuianMop = {
  'mpi:DatumVzniku': string;
  'mpi:Geometrie': {
    'mpi:DefinicniBod': RuianGeometry;
  };
  'mpi:GlobalniIdNavrhu': number;
  'mpi:IdTransakce': number;
  'mpi:Kod': number;
  'mpi:Nazev': string;
  'mpi:PlatiOd': string;
  'mpi:Obec': {
    'oki:Kod': number;
  };
};

// export type RuianMomc = {
//   'mci:DatumVzniku': string;
//   'mci:Geometrie': {
//     'mci:DefinicniBod': RuianGeometry;
//   };
//   'mci:GlobalniIdNavrhu': number;
//   'mci:IdTransakce': number;
//   'mci:Kod': number;
//   'mci:MluvnickeCharakterisiky': {
//     'com:Pad2': string;
//     'com:Pad3': string;
//     'com:Pad4': string;
//     'com:Pad6': string;
//     'com:Pad7': string;
//   };
//   'mci:Mop': {
//     'mpi:Kod': number;
//   };
//   'mci:Nazev': string;
//   'mci:Obec': {
//     'oki:Kod': number;
//   };
//   'mci:PlatiOd': string;
//   'mci:SpravniObvod': {
//     'spi:Kod': number;
//   };
//   'mci:VlajkaText': string;
//   'mci:ZnakText': string;
// };

/**
 * JSON form of XML data from CUZK
 */
export type RuianXMLDataset = {
  'vf:VymennyFormat': {
    // not needed for parsing
    'vf:Hlavicka': Record<string, any>;

    'vf:Data': CompleteRuianData;
  };
};

/**
 * Used fields of the RUIAN state dataset
 */
export type RuianData = {
  /**
   * States containing only the state of the Czech Republic
   */
  'vf:Staty': {
    'vf:Stat': RuianState;
  };

  /**
   * Regions
   */
  'vf:Vusc': {
    'vf:Vusc': RuianRegion[];
  };

  /**
   * Districts
   */
  'vf:Okresy': {
    'vf:Okres': RuianDistrict[];
  };

  /**
   * Main parts of Prague (1-10)
   */
  'vf:Mop': {
    'vf:Mop': RuianMop[];
  };
};

/**
 * These type extends used fields from XML with not-used ones
 */
export type CompleteRuianData = RuianData & {
  'vf:Zsj': Record<string, any>;
  'vf:SpravniObvody': Record<string, any>;
  'vf:RegionySoudrznosti': Record<string, any>;
  'vf:Pou': Record<string, any>;
  'vf:Orp': Record<string, any>;
  'vf:KatastralniUzemi': Record<string, any>;
  'vf:CastiObci': Record<string, any>;
  // City parts (including subparts of Prague (11-22))
  'vf:Momc': Record<string, any>;
};
