import { FeatureCollection, Point, Units } from '@turf/helpers';

export default function matrixToGrid(
    matrix: number[][],
    options?: {
        zProperty?: string,
        properties?: object,
        units?: Units
    }
): FeatureCollection<Point>;
