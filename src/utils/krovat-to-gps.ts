import { Coordinates } from '../types/transformed-data';

const e = 0.081696831215303;
const n = 0.97992470462083;
const konst_u_ro = 12310230.12797036;
const sinUQ = 0.863499969506341;
const cosUQ = 0.504348889819882;
const sinVQ = 0.420215144586493;
const cosVQ = 0.907424504992097;
const alfa = 1.000597498371542;
const k = 1.003419163966575;
const dx = 570.69;
const dy = 85.69;
const dz = 462.84;
const wz = ((-5.2611 / 3600) * Math.PI) / 180;
const wy = ((-1.58676 / 3600) * Math.PI) / 180;
const wx = ((-4.99821 / 3600) * Math.PI) / 180;
const m = 3.543e-6;

export const krovakStringToGps = (rawPoint: string, reverse?: boolean) => {
  const parsedRawPoint = rawPoint.split(' ');
  if (parsedRawPoint.length !== 2) return;

  let point: [number, number] = [
    Math.abs(Number.parseFloat(parsedRawPoint[0])),
    Math.abs(Number.parseFloat(parsedRawPoint[1])),
  ];

  if (reverse) {
    point = [point[1], point[0]];
  }

  return krovakToGps(point);
};

export const krovakToGps = ([y, x]: [number, number], h = 200) => {
  /* Přepočet vstupích údajů - vychazi z nejakeho skriptu, ktery jsem nasel na Internetu - nejsem autorem prepoctu. */
  /* Vypocet zemepisnych souradnic z rovinnych souradnic */
  let a = 6377397.15508;
  let ro = Math.sqrt(x * x + y * y);
  const epsilon = 2 * Math.atan(y / (ro + x));
  const D = epsilon / n;
  const S =
    2 * Math.atan(Math.exp((1 / n) * Math.log(konst_u_ro / ro))) - Math.PI / 2;
  const sinS = Math.sin(S);
  const cosS = Math.cos(S);
  const sinU = sinUQ * sinS - cosUQ * cosS * Math.cos(D);
  const cosU = Math.sqrt(1 - sinU * sinU);
  const sinDV = (Math.sin(D) * cosS) / cosU;
  const cosDV = Math.sqrt(1 - sinDV * sinDV);
  const sinV = sinVQ * cosDV - cosVQ * sinDV;
  const cosV = cosVQ * cosDV + sinVQ * sinDV;
  const Ljtsk = (2 * Math.atan(sinV / (1 + cosV))) / alfa;
  let t = Math.exp((2 / alfa) * Math.log((1 + sinU) / cosU / k));
  let pom = (t - 1) / (t + 1);
  let sinB;
  do {
    sinB = pom;
    pom = t * Math.exp(e * Math.log((1 + e * sinB) / (1 - e * sinB)));
    pom = (pom - 1) / (pom + 1);
  } while (Math.abs(pom - sinB) > 1e-15);

  const Bjtsk = Math.atan(pom / Math.sqrt(1 - pom * pom));

  /* Pravoúhlé souřadnice ve S-JTSK */
  a = 6377397.15508;
  let f_1 = 299.152812853;
  let e2 = 1 - (1 - 1 / f_1) * (1 - 1 / f_1);
  ro = a / Math.sqrt(1 - e2 * Math.sin(Bjtsk) * Math.sin(Bjtsk));
  const X = (ro + h) * Math.cos(Bjtsk) * Math.cos(Ljtsk);
  const Y = (ro + h) * Math.cos(Bjtsk) * Math.sin(Ljtsk);
  const Z = ((1 - e2) * ro + h) * Math.sin(Bjtsk);

  /* Pravoúhlé souřadnice v WGS-84 */
  const xn = dx + (1 + m) * (X + wz * Y - wy * Z);
  const yn = dy + (1 + m) * (-wz * X + Y + wx * Z);
  const zn = dz + (1 + m) * (wy * X - wx * Y + Z);

  /* Geodetické souřadnice v systému WGS-84 */
  a = 6378137.0;
  f_1 = 298.257223563;
  const a_b = f_1 / (f_1 - 1);
  const p = Math.sqrt(xn * xn + yn * yn);
  e2 = 1 - (1 - 1 / f_1) * (1 - 1 / f_1);
  const theta = Math.atan((zn * a_b) / p);
  const st = Math.sin(theta);
  const ct = Math.cos(theta);
  t = (zn + e2 * a_b * a * st * st * st) / (p - e2 * a * ct * ct * ct);
  const B = Math.atan(t);
  const L = 2 * Math.atan(yn / (p + xn));

  const lat = (B / Math.PI) * 180;
  const lon = (L / Math.PI) * 180;

  return [lon, lat] as Coordinates;
};
