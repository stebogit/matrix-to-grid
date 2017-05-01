import {BBox} from '@turf/helpers'
import * as pointGrid from '@turf/point-grid'
import * as matrixToGrid from '../'

const bbox: BBox = [-95, 30, -85, 40]
const points = pointGrid(bbox, 50, 'miles')
const array = matrixToGrid(points)
