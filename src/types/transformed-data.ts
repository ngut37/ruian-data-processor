/**
 * GPS coordinates [longitude, latitude]
 * If specifying latitude and longitude coordinates, list the longitude first, and then latitude
 * (see https://www.mongodb.com/docs/manual/reference/geojson).
 */
export type Coordinates = [number, number];

export type Point = {
  type: 'Point' | 'Polygon' | 'LineString'; // GeoJSON point types of mongo
  coordinates: Coordinates;
};

export type State = {
  id: number;
  name: string;
  point: Point;
};

export type Region = {
  id: number;
  name: string;
  point: Point;
};

export type District = {
  id: number;
  name: string;
  point?: Point; // Prague has no point
  region: number; // relation to Region
};

export type Mop = {
  id: number;
  name: string;
  point: Point;
  region: number; // ID of Prague region
};
