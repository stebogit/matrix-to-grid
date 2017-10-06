import { FeatureCollection, Point, Units, Coord } from '@turf/helpers';

export default function matrixToGrid(
    matrix: number[][],
    origin: Coord,
    cellSize: number,
    options?: {
        zProperty?: string,
        properties?: object,
        units?: Units
    }
): FeatureCollection<Point>;
