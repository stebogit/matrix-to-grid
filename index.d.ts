/// <reference types="geojson" />

import {Points} from '@turf/helpers';

declare function matrixToGrid(matrix: Array<Array<number>>, property?: string): Points;
declare namespace matrixToGrid { }
export = matrixToGrid;
