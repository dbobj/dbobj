function arrEqual (arr1, arr2) {
	if (typeof arr1 == "object" && typeof arr2 == "object") {
		return (arrEqual(arr1[0], arr2[0]) && arrEqual(arr1[1], arr2[1]) && arrEqual(arr1[2], arr2[2]))
	} else {
		return (arr1 === arr2)
	}
}

function complementOfFracMultipolygon (fracMultipolygon, xMin, xMax, yMin, yMax) {
	simpleFracPolygons = []
	for (fracPolygon of fracMultipolygon) {
		for (simpleFracPolygon of fracPolygon) {
			simpleFracPolygons.push(simpleFracPolygon)
		}
	}
	simpleFracPolygonsInput = simpleFracPolygons.filter(function (simpleFracPolygon) {
		return (simpleFracPolygon.length != 5 || isNewElement([ xMin, yMin ], simpleFracPolygon) || isNewElement([ xMax, yMin ], simpleFracPolygon) || isNewElement([ xMax, yMax ], simpleFracPolygon) || isNewElement([ xMin, yMax ], simpleFracPolygon))
	})
	if (simpleFracPolygonsInput.length == simpleFracPolygons.length) {
		return partitionOfSimpleFracPolygonsByDisjointness([ [ xMin, yMin ], [ xMax, yMin ], [ xMax, yMax ], [ xMin, yMax ], [ xMin, yMin ] ], ...simpleFracPolygonsInput)
	} else {
		return partitionOfSimpleFracPolygonsByDisjointness(...simpleFracPolygonsInput)
	}
}

function cutFracPointOfNonParallelFracEquations (fracEquation, nonVerticalFracEquation) {
	if (fracEquation[0]) {
		fracX = fracQuotient(fracDifference(fracEquation[1], nonVerticalFracEquation[1]), fracDifference(nonVerticalFracEquation[0], fracEquation[0]))
	} else {
		fracX = fracEquation[1]
	}
	fracY = substituteFracIntoFracEquation(fracX, nonVerticalFracEquation)
	return [ fracX, fracY ]
}

function cutFracPointOfNonParallelFracLineSegments (fracLineSegment1, fracLineSegment2) {
	intersection = intersectionFracPointOfNonParallelFracLineSegments(fracLineSegment1, fracLineSegment2)
	if (!intersection) {
		return null
	}
	endpoints = fracLineSegment1.concat(fracLineSegment2)
	for (endpoint of endpoints) {
		if (arrEqual(endpoint, intersection)) {
			return null
		}
	}
	return intersection
}

function differenceOfFracMultipolygons (fracMultipolygon1, fracMultipolygon2) {
	maxAbs = 0
	for (fracPolygon of fracMultipolygon1) {
		for (fracSimplePolygon of fracPolygon) {
			for (fracVertex of fracSimplePolygon) {
				if (Math.abs(fracVertex[0][0]) > maxAbs) {
					maxAbs = Math.abs(fracVertex[0][0])
				}
				if (Math.abs(fracVertex[1][0]) > maxAbs) {
					maxAbs = Math.abs(fracVertex[1][0])
				}
			}
		}
	}
	for (fracPolygon of fracMultipolygon2) {
		for (fracSimplePolygon of fracPolygon) {
			for (fracVertex of fracSimplePolygon) {
				if (Math.abs(fracVertex[0][0]) > maxAbs) {
					maxAbs = Math.abs(fracVertex[0][0])
				}
				if (Math.abs(fracVertex[1][0]) > maxAbs) {
					maxAbs = Math.abs(fracVertex[1][0])
				}
			}
		}
	}
	complementOfFracMultipolygon1 = complementOfFracMultipolygon(fracMultipolygon1, [ -maxAbs, 1 ], [ maxAbs, 1 ], [ -maxAbs, 1 ], [ maxAbs, 1 ])
	union = unionOfManyFracMultipolygons(complementOfFracMultipolygon1, fracMultipolygon2)
	return complementOfFracMultipolygon(union, [ -maxAbs, 1 ], [ maxAbs, 1 ], [ -maxAbs, 1 ], [ maxAbs, 1 ])
}

function findOneFracTriangleFromSimpleFracPolygon (simpleFracPolygon) {
	if (simpleFracPolygon.length == 4) {
		return {
			triangle: simpleFracPolygon,
			fracDiff: null
		}
	} else {
		remainder = simpleFracPolygon
		for (iteratorI = 1; iteratorI < simpleFracPolygon.length; iteratorI++) {
			oppFracLineSegment = oppSide(simpleFracPolygon[iteratorI], simpleFracPolygon)
			if (fracLineSegmentInSimpleFracPolygon(oppFracLineSegment, simpleFracPolygon)) {
				triangle = [ simpleFracPolygon[iteratorI], ...oppFracLineSegment, simpleFracPolygon[iteratorI] ]
				remainder.pop()
				if (remainder.length == 4) {
					fracDiff = remainder.filter(function (element) {
						return !arrEqual(element, simpleFracPolygon[iteratorI])
					})
				} else {
					fracDiff = remainder.filter(function (element, index) {
						if (arrEqual(simpleFracPolygon[index - 1], oppFracLineSegment[0]) && arrEqual(simpleFracPolygon[(index + 1) % simpleFracPolygon.length], oppFracLineSegment[1])) {
							return false
						}
						if (arrEqual(simpleFracPolygon[index - 1], oppFracLineSegment[1]) && arrEqual(simpleFracPolygon[(index + 1) % simpleFracPolygon.length], oppFracLineSegment[0])) {
							return false
						}
						return true
					})
				}
				fracDiff.push(fracDiff[0])
				return {
					triangle: triangle,
					fracDiff: fracDiff
				}
			}
		}
	}
}

function fracAreaOfSimpleFracPolygon (simpleFracPolygon) {
    fracArea = [ 0, 1 ]
    for (i = 1; i < simpleFracPolygon.length; i++) {
    	fracChange = fracDifference(fracProduct(simpleFracPolygon[i - 1][0], simpleFracPolygon[i][1]), fracProduct(simpleFracPolygon[i - 1][1], simpleFracPolygon[i][0]))
        fracArea = fracSum(fracArea, fracChange)
    }
    return fracProduct(fracArea, [ 1, 2 ])
}

function fracAsFracStr (arr) {
	if (!arr) {
		return undefined
	}
	if (typeof arr[0] == "number") {
		return arr[0] + "/" + arr[1]
	} else {
		return arr.map(fracAsFracStr)
	}
}

function fracAsNum (arr) {
	if (!arr) {
		return undefined
	}
	if (typeof arr[0] == "number") {
		return arr[0] / arr[1]
	} else {
		return arr.map(fracAsNum)
	}
}

function fracDifference (fracA, fracB) {
	if (fracA && fracB) {
		return fracReduce([ fracA[0] * fracB[1] - fracB[0] * fracA[1] , fracA[1] * fracB[1] ])
	} else {
		return undefined
	}
}

function fracEquationFromTwoFracPoints (fracPointA, fracPointB) {
	// [ m, c ] means y = mx + c while [ undefined, alpha ] means x = alpha
	fracSlope = fracSlopeFromTwoFracPoints(fracPointA, fracPointB)
	fracX = fracPointA[0]
	fracY = fracPointA[1]
	if (fracSlope) {
		return [ fracSlope, fracDifference(fracY, fracProduct(fracSlope, fracX)) ]
	} else {
		return [ undefined, fracX ]
	}
}

function fracLineSegmentInFracMultipolygon (fracLineSegment, fracMultipolygon) {
	// return true or false
	for (fracPolygon of fracMultipolygon) {
		for (simpleFracPolygon of fracPolygon) {
			for (i = 1; i < simpleFracPolygon.length; i++) {
				testFracLineSegment = [ simpleFracPolygon[i-1], simpleFracPolygon[i] ]
				parallel = isParallelTo(testFracLineSegment, fracLineSegment)
				if (parallel && (arrEqual(testFracLineSegment[0], fracLineSegment[0]) || arrEqual(fracSlopeFromTwoFracPoints(testFracLineSegment[0], fracLineSegment[0]), fracSlopeFromTwoFracPoints(...fracLineSegment)))) {
					return false
				}
				if (!parallel && cutFracPointOfNonParallelFracLineSegments(testFracLineSegment, fracLineSegment)) {
					return false
				}
			}
		}
	}
	midpoint = [ fracProduct(fracSum(fracLineSegment[0][0], fracLineSegment[1][0]), [ 1, 2 ]), fracProduct(fracSum(fracLineSegment[0][1], fracLineSegment[1][1]), [ 1, 2 ]) ]
	return (fracPointInFracMultipolygon(midpoint, fracMultipolygon) != "exterior")
}

function fracLineSegmentInFracPolygon (fracLineSegment, fracPolygon) {
	// return true or false
	return fracLineSegmentInFracMultipolygon(fracLineSegment, [ fracPolygon ])
}

function fracLineSegmentInSimpleFracPolygon (fracLineSegment, simpleFracPolygon) {
	// return true or false
	return fracLineSegmentInFracMultipolygon(fracLineSegment, [ [ simpleFracPolygon ] ])
}

function fracLineSegmentInUnionOfFracTriangles (fracLineSegment, ...fracTriangles) {
	// return "interior" or "boundary"
	A = fracLineSegment[0]
	B = fracLineSegment[1]
	interior = 0
	boundary = 0
	for (fracTriangle of fracTriangles) {
		endpointA = fracPointInFracMultipolygon(A, [ [ fracTriangle ] ])
		endpointB = fracPointInFracMultipolygon(B, [ [ fracTriangle ] ])
		if (endpointA == "interior" || endpointB == "interior") {
			interior = interior + 1
		}
		if (endpointA == "boundary" && endpointB == "boundary") {
			boundary = boundary + 1
		}
	}
	if (interior > 0 || boundary > 1) {
		return "interior"
	} else {
		return "boundary"
	}
}

function fracPointInFracMultipolygon (fracPoint, fracMultipolygon) {
	fracLineSegments = []
	for (fracPolygon of fracMultipolygon) {
		for (simpleFracPolygon of fracPolygon) {
			for (i = 1; i < simpleFracPolygon.length; i++) {
				fracLineSegments.push([ simpleFracPolygon[i-1], simpleFracPolygon[i] ])
			}
		}
	}
	filteredFracLineSegments = []
	maxAbsVal = 0
	for (fracLineSegment of fracLineSegments) {
		if (fracPointOnFracLineSegment(fracPoint, fracLineSegment) != "exterior") {
			return "boundary"
		}
		filteredFracLineSegments.push(fracLineSegment)
		if (Math.abs(fracLineSegment[0][0][0]) > maxAbsVal) {
			maxAbsVal = Math.abs(fracLineSegment[0][0][0])
		}
		if (Math.abs(fracLineSegment[1][0][0]) > maxAbsVal) {
			maxAbsVal = Math.abs(fracLineSegment[1][0][0])
		}
	}
	testFracLineSegment = [ [ [ -maxAbsVal * 2, 1 ], fracPoint[1] ], fracPoint ]
	if (arrEqual(testFracLineSegment[0], testFracLineSegment[1])) {
		return "exterior"
	}
	intersections = []
	for (filteredFracLineSegment of filteredFracLineSegments) {
		if (!isParallelTo(filteredFracLineSegment, testFracLineSegment)) {
			intersection = intersectionFracPointOfHorizontalAndNonHorizontalFracLineSegment(testFracLineSegment, filteredFracLineSegment)
			if (intersection) {
				intersections.push(intersection)
			}
		}
	}
	cuts = removeDuplicates(intersections).filter(function (cut) {
		return (fracDifference(cut[0], fracPoint[0])[0] < 0)
	})
	cuts.sort(function (a, b) {
		if (!arrEqual(a[0], b[0])) {
			return sortFrac(a[0], b[0])
		}
		if (!arrEqual(a[1], b[1])) {
			return sortFrac(a[1], b[1])
		}
		return (a[2] > b[2])
	})
	result = []
	for (i = 0; i < cuts.length; i++) {
		if (result.length > 0) {
			lastResult = result[result.length - 1]
			if (arrEqual(cuts[i][0], lastResult[0]) && arrEqual(cuts[i][1], lastResult[1])) {
				result[result.length - 1][2] = result[result.length - 1][2] + cuts[i][2]
				continue
			}
		}
		result.push(cuts[i])
	}
	filteredResult = result.filter(function (cut) {
		return (cut[2] == 0)
	})
	if (filteredResult.length % 2 == 0) {
		return "exterior"
	} else {
		return "interior"
	}
}

function fracPointOnFracLineSegment (fracPoint, fracLineSegment) {
	if (arrEqual(fracLineSegment[0], fracPoint) || arrEqual(fracLineSegment[1], fracPoint)) {
		return "boundary"
	}
	if (isVertical(fracLineSegment)) {
		xMatch = (arrEqual(fracPoint[0], fracLineSegment[0][0]))
		if (xMatch && fracProduct(fracDifference(fracLineSegment[0][1], fracPoint[1]), fracDifference(fracLineSegment[1][1], fracPoint[1]))[0] < 0) {
			return "interior"
		} else {
			return "exterior"
		}
	} else {
		xBetween = (fracProduct(fracDifference(fracLineSegment[0][0], fracPoint[0]), fracDifference(fracLineSegment[1][0], fracPoint[0]))[0] < 0)
		if (xBetween && arrEqual(fracSlopeFromTwoFracPoints(fracLineSegment[0], fracPoint), fracSlopeFromTwoFracPoints(fracLineSegment[1], fracPoint))) {
			return "interior"
		} else {
			return "exterior"
		}
	}
}

function fracPolygonToWeaklySimplePolygon (fracPolygon) {
	if (fracPolygon.length == 1) {
		return fracPolygon[0]
	} else {
		edges = []
		for (simpleFracPolygon of fracPolygon) {
			for (i = 1; i < simpleFracPolygon.length; i++) {
				edges.push([ simpleFracPolygon[i-1], simpleFracPolygon[i] ])
			}
		}
		newEdges = []
		for (i = 1; i < fracPolygon.length; i++) {
			finish = false
			for (j = 0; j < fracPolygon[0].length; j++) {
				for (k = 0; k < fracPolygon[i].length; k++) {
					test = [ fracPolygon[0][j], fracPolygon[i][k] ]
					if (fracLineSegmentInFracPolygon(test, fracPolygon)) {
						check = true
						for (newEdge of newEdges) {
							if (!isParallelTo(newEdge, test) && cutFracPointOfNonParallelFracLineSegments(newEdge, test)) {
								check = false
								break
							}
						}
						if (check) {
							newEdges.push(test)
							finish = true
							break
						}
					}
				}
				if (finish) {
					break
				}
			}
		}
		startElements = undefined
		for (edge of edges) {
			included = false
			for (newEdge of newEdges) {
				for (newEdgeVertex of newEdge) {
					if (arrEqual(edge[0], newEdgeVertex) || arrEqual(edge[1], newEdgeVertex)) {
						included = true
						break
					}
				}
				if (included) {
					break
				}
			}
			if (!included) {
				startElements = edge
				break
			}
		}
		weaklySimplePolygon = startElements
		newElement = undefined
		bool = true
		while (!arrEqual(newElement, startElements[0])) {
			newElement = newElement ?? startElements[1]
			attempt = nextFracVertexIndices(weaklySimplePolygon[weaklySimplePolygon.length - 2], newElement, newEdges)
			if (bool && attempt) {
				i = attempt[0]
				j = attempt[1]
				newElement = newEdges[i][j]
				bool = false
			} else {
				indices = nextFracVertexIndices(weaklySimplePolygon[weaklySimplePolygon.length - 2], newElement, edges)
				i = indices[0]
				j = indices[1]
				newElement = edges[i][j]
				bool = true
			}
			weaklySimplePolygon.push(newElement)
		}
		return weaklySimplePolygon
	}
}

function fracProduct (fracA, fracB) {
	if (fracA && fracB) {
		return fracReduce([ fracA[0] * fracB[0], fracA[1] * fracB[1] ])
	} else {
		return undefined
	}
}

function fracQuotient (fracA, fracB) {
	if (fracA && fracB) {
		return fracProduct(fracA, [ fracB[1], fracB[0] ])
	} else {
		return undefined
	}
}

function fracReduce (frac) {
	if (!frac || frac[1] == 0) {
		return undefined
	}
	if (frac[0] == 0) {
		return [ 0, 1 ]
	}
	hcf = intHCF(frac[0], frac[1])
	if (frac[1] > 0) {
		return [ frac[0] / hcf, frac[1] / hcf ]
	} else {
		return [ -frac[0] / hcf, -frac[1] / hcf ]
	}
}

function fracSlopeFromTwoFracPoints (fracPointA, fracPointB) {
	return fracQuotient(fracDifference(fracPointA[1], fracPointB[1]), fracDifference(fracPointA[0], fracPointB[0]))
}

function fracSum (fracA, fracB) {
	if (fracA && fracB) {
		return fracReduce([ fracA[0] * fracB[1] + fracB[0] * fracA[1] , fracA[1] * fracB[1] ])
	} else {
		return undefined
	}
}

function intHCF (a, b) {
	// a and b can be negative but intHCF(a, b) must be positive
	if (b == 0) {
		return Math.abs(a)
	} else {
		return intHCF(b, a % b)
	}
}

function intersectionFracPointOfNonParallelFracLineSegments (fracLineSegment1, fracLineSegment2) {
	if (isVertical(fracLineSegment2)) {
		return intersectionFracPointOfNonParallelFracLineSegments(fracLineSegment2, fracLineSegment1)
	}
	fracEquation1 = fracEquationFromTwoFracPoints(...fracLineSegment1)
	fracEquation2 = fracEquationFromTwoFracPoints(...fracLineSegment2)
	intersectionFracPoint = cutFracPointOfNonParallelFracEquations(fracEquation1, fracEquation2)
	if (isVertical(fracLineSegment1)) {
		test1 = fracProduct(fracDifference(fracLineSegment1[0][1], intersectionFracPoint[1]), fracDifference(fracLineSegment1[1][1], intersectionFracPoint[1]))
	} else {
		test1 = fracProduct(fracDifference(fracLineSegment1[0][0], intersectionFracPoint[0]), fracDifference(fracLineSegment1[1][0], intersectionFracPoint[0]))
	}
	test2 = fracProduct(fracDifference(fracLineSegment2[0][0], intersectionFracPoint[0]), fracDifference(fracLineSegment2[1][0], intersectionFracPoint[0]))
	if (test1[0] > 0 || test2[0] > 0) {
		return null
	} else {
		return intersectionFracPoint
	}
}

function intersectionFracPointOfHorizontalAndNonHorizontalFracLineSegment (horizontalFracLineSegment, nonHorizontalFracLineSegment) {
	fracEquation1 = fracEquationFromTwoFracPoints(...horizontalFracLineSegment)
	fracEquation2 = fracEquationFromTwoFracPoints(...nonHorizontalFracLineSegment)
	intersectionFracPoint = cutFracPointOfNonParallelFracEquations(fracEquation2, fracEquation1)
	check = fracProduct(fracDifference(nonHorizontalFracLineSegment[0][1], intersectionFracPoint[1]), fracDifference(nonHorizontalFracLineSegment[1][1], intersectionFracPoint[1]))
	if (check[0] > 0) {
		return null
	}
	if (check[0] < 0) {
		return [ ...intersectionFracPoint, 0 ]
	}
	if (check[0] == 0) {
		test = fracSum(fracDifference(nonHorizontalFracLineSegment[0][1], intersectionFracPoint[1]), fracDifference(nonHorizontalFracLineSegment[1][1], intersectionFracPoint[1]))
		return [ ...intersectionFracPoint, (test[0] > 0) - 0.5 ]
	}
}

function intersectionOfManyFracMultipolygons(...fracMultipolygons) {
	maxAbsVal = 0
	for (fracMultipolygon of fracMultipolygons) {
		for (fracPolygon of fracMultipolygon) {
			for (fracSimplePolygon of fracPolygon) {
				for (fracVertex of fracSimplePolygon) {
					if (Math.abs(fracVertex[0][0]) > maxAbsVal) {
						maxAbsVal = Math.abs(fracVertex[0][0])
					}
					if (Math.abs(fracVertex[1][0]) > maxAbsVal) {
						maxAbsVal = Math.abs(fracVertex[1][0])
					}
				}
			}
		}
	}
	complements = fracMultipolygons.map(function (fracMultipolygon) {
		return complementOfFracMultipolygon(fracMultipolygon, [ -maxAbsVal, 1 ], [ maxAbsVal, 1 ], [ -maxAbsVal, 1 ], [ maxAbsVal, 1 ])
	})
	return complementOfFracMultipolygon(unionOfManyFracMultipolygons(...complements), [ -maxAbsVal, 1 ], [ maxAbsVal, 1 ], [ -maxAbsVal, 1 ], [ maxAbsVal, 1 ])
}

function isNewElement (testElement, arr) {
	for (element of arr) {
		if (arrEqual(element, testElement)) {
			return false
		}
	}
	return true
}

function isParallelTo (fracLineSegment1, fracLineSegment2) {
	fracSlope1 = fracSlopeFromTwoFracPoints(...fracLineSegment1)
	fracSlope2 = fracSlopeFromTwoFracPoints(...fracLineSegment2)
	if (fracSlope1 && fracSlope2) {
		return arrEqual(fracSlope1, fracSlope2)
	} else {
		return (fracSlope1 == fracSlope2)
	}
}

function isSubsetOf (fracTriangle1, fracTriangle2) {
	// return true if and only if fracTriangle1 is a subset of fracTriangle2
	for (fracPoint of fracTriangle1) {
		if (fracPointInFracMultipolygon(fracPoint, [ [ fracTriangle2 ] ]) == "exterior") {
			return false
		}
	}
	return true
}

function isVertical (fracLineSegment) {
	return arrEqual(fracLineSegment[0][0], fracLineSegment[1][0])
}

function nextFracVertexIndices (prevFracVertex, thisFracVertex, fracEdges) {
	for (a = 0; a < fracEdges.length; a++) {
		for (b = 0; b < 2; b++) {
			if (arrEqual(fracEdges[a][b], thisFracVertex) && !arrEqual(fracEdges[a][1-b], prevFracVertex)) {
				return [ a, 1 - b ]
			}
		}
	}
	return null
}

function oppSide (fracVertex, simpleFracPolygon) {
	if (arrEqual(simpleFracPolygon[0], fracVertex)) {
		return [ simpleFracPolygon[1], simpleFracPolygon[simpleFracPolygon.length - 2] ]
	}
	for (i = 1; i < simpleFracPolygon.length; i++) {
		if (arrEqual(simpleFracPolygon[i], fracVertex)) {
			return [ simpleFracPolygon[i-1], simpleFracPolygon[i+1] ]
		}
	}
}

function partitionOfFracEdgesByUnionOfManyFracTraiangles (...fracTriangles) {
	cutPoints = fracTriangles.map(function (fracTriangle) {
		return [
			[ fracTriangle[0], fracTriangle[1] ],
			[ fracTriangle[1], fracTriangle[2] ],
			[ fracTriangle[0], fracTriangle[2] ]
		]
	})
	for (iteratorI = 0; iteratorI < fracTriangles.length; iteratorI++) {
		for (iteratorJ = iteratorI + 1; iteratorJ < fracTriangles.length; iteratorJ++) {
			unorderedCutPoints = unorderedCutFracPointsOfTwoFracTriangles(fracTriangles[iteratorI], fracTriangles[iteratorJ])
			cutPoints[iteratorI][0] = cutPoints[iteratorI][0].concat(unorderedCutPoints.a)
			cutPoints[iteratorI][1] = cutPoints[iteratorI][1].concat(unorderedCutPoints.b)
			cutPoints[iteratorI][2] = cutPoints[iteratorI][2].concat(unorderedCutPoints.c)
			cutPoints[iteratorJ][0] = cutPoints[iteratorJ][0].concat(unorderedCutPoints.d)
			cutPoints[iteratorJ][1] = cutPoints[iteratorJ][1].concat(unorderedCutPoints.e)
			cutPoints[iteratorJ][2] = cutPoints[iteratorJ][2].concat(unorderedCutPoints.f)
		}
	}
	for (iteratorI = 0; iteratorI < cutPoints.length; iteratorI++) {
		for (iteratorJ = 0; iteratorJ < 3; iteratorJ++) {
			cutPoints[iteratorI][iteratorJ] = removeDuplicates(cutPoints[iteratorI][iteratorJ])
			cutPoints[iteratorI][iteratorJ].sort(function (cutPointA, cutPointB) {
				if (arrEqual(cutPointA[0], cutPointB[0])) {
					return sortFrac(cutPointA[1], cutPointB[1])
				} else {
					return sortFrac(cutPointA[0], cutPointB[0])
				}
			})
		}
	}
	result = []
	for (i = 0; i < cutPoints.length; i++) {
		for (j = 0; j < 3; j++) {
			for (k = 1; k < cutPoints[i][j].length; k++) {
				result.push([ cutPoints[i][j][k-1], cutPoints[i][j][k] ])
			}
		}
	}
	return removeDuplicates(result)
}

function partitionOfSimpleFracPolygonsByDisjointness (...simpleFracPolygons) {
	// return multipolygon
	simpleFracPolygonsInput = simpleFracPolygons
	superset = simpleFracPolygonsInput.map(function () {
		return []
	})
	for (iteratorI = 0; iteratorI < simpleFracPolygonsInput.length; iteratorI++) {
		for (iteratorJ = 0; iteratorJ < simpleFracPolygonsInput.length; iteratorJ++) {
			if (iteratorI != iteratorJ && fracPointInFracMultipolygon(simpleFracPolygonsInput[iteratorI][0], [ [ simpleFracPolygonsInput[iteratorJ] ] ]) == "interior") {
				superset[iteratorI].push(iteratorJ)
			}
		}
	}
	// superset = [ [], [ 0 ], [ 0 ], [ 0, 2 ], [ 0, 2 ], [ 0, 2, 4 ], [ 0, 2, 4 ], [ 0, 2, 4, 6 ], [ 0, 2, 4, 6 ] ]
	setObjs = superset.map(function (element, index) {
		return {
			setIndex: index,
			superset: element
		}
	})
/*
	setObjs = [
		{ setIndex: 0, superset: [] },
		{ setIndex: 1, superset: [ 0 ] },
		{ setIndex: 2, superset: [ 0 ] },
		{ setIndex: 3, superset: [ 0, 2 ] },
		{ setIndex: 4, superset: [ 0, 2 ] },
		{ setIndex: 5, superset: [ 0, 2, 4 ] },
		{ setIndex: 6, superset: [ 0, 2, 4 ] },
		{ setIndex: 7, superset: [ 0, 2, 4, 6 ] },
		{ setIndex: 8, superset: [ 0, 2, 4, 6 ] }
	]
*/
	fracMultipolygonIndices = []
	while (setObjs.length > 0) {
		elements = []
		parents = setObjs.filter(function (setObj) {
			return (setObj.superset.length == 0)
		}).map(function (setObj) {
			return setObj.setIndex
		})
		for (parent of parents) {
			child = setObjs.filter(function (setObj) {
				return arrEqual(setObj.superset, [ parent ])
			}).map(function (setObj) {
				return setObj.setIndex
			})
			fracMultipolygonIndices.push([ parent ].concat(child))
			elements.push(parent)
			elements = elements.concat(child)
		}
		setObjs = setObjs.filter(function (setObj) {
			return (setObj.superset.length > 1)
		})
		for (setObj of setObjs) {
			setObj.superset = setObj.superset.filter(function (element) {
				return (elements.indexOf(element) == -1)
			})
		}
	}
	return fracMultipolygonIndices.map(function (fracPolygonIndices) {
		return fracPolygonIndices.map(function (simpleFracPolygonIndex, i) {
			simpleFracPolygon = simpleFracPolygons[simpleFracPolygonIndex]
			criterion1 = (i == 0) - 0.5
			criterion2 = (fracAreaOfSimpleFracPolygon(simpleFracPolygon)[0] > 0) - 0.5
			if (criterion1 * criterion2 < 0) {
				simpleFracPolygon.reverse()
			}
			return simpleFracPolygon
		})
	})
}

function removeDuplicates (arr) {
	result = []
	for (el of arr) {
		if (isNewElement(el, result)) {
			result.push(el)
		}
	}
	return result
}

function sortFrac (fracA, fracB) {
	return (fracDifference(fracA, fracB)[0] > 0) - 0.5
}

function substituteFracIntoFracEquation (fracX, fracEquation) {
	// fracEquation is not a vertical line
	return fracSum(fracProduct(fracEquation[0], fracX), fracEquation[1])
}

function triangulateFracMultipolygon (fracMultipolygon) {
	// return array of triangles (as simple polygons)
	triangles = []
	for (fracPolygon of fracMultipolygon) {
		triangles = triangles.concat(triangulateFracPolygon(fracPolygon))
	}
	return triangles
}

function triangulateFracPolygon (fracPolygon) {
	// return array of triangles (as simple polygons)
	if (fracPolygon.length == 1) {
		return triangulateSimpleFracPolygon(fracPolygon[0])
	} else {
		return triangulateSimpleFracPolygon(fracPolygonToWeaklySimplePolygon(fracPolygon))
	}
}

function triangulateSimpleFracPolygon (simpleFracPolygon) {
	// return array of triangles (as simple polygons)
	triangles = []
	fracDiff = simpleFracPolygon
	while (fracDiff) {
		obj = findOneFracTriangleFromSimpleFracPolygon(fracDiff)
		triangles.push(obj.triangle)
		fracDiff = obj.fracDiff
	}
	return triangles
}

function unionOfManyFracMultipolygons (...fracMultipolygons) {
	fracTriangles = []
	for (fracMultipolygon of fracMultipolygons) {
		fracTriangles = fracTriangles.concat(triangulateFracMultipolygon(fracMultipolygon))
	}
	return unionOfManyFracTriangles(...fracTriangles)
}

function unionOfManyFracTriangles (...fracTriangles) {
	// return multipolygon
	indicesOfRedundantFracTriangles = []
	for (iteratorI = 0; iteratorI < fracTriangles.length; iteratorI++) {
		for (iteratorJ = 0; iteratorJ < fracTriangles.length; iteratorJ++) {
			if (iteratorI != iteratorJ && isSubsetOf(fracTriangles[iteratorI], fracTriangles[iteratorJ])) {
				indicesOfRedundantFracTriangles.push(iteratorI)
			}
		}
	}
	fracTrianglesInput = []
	for (i = 0; i < fracTriangles.length; i++) {
		if (indicesOfRedundantFracTriangles.indexOf(i) == -1) {
			fracTrianglesInput.push(fracTriangles[i])
		}
	}
	fracEdges = partitionOfFracEdgesByUnionOfManyFracTraiangles(...fracTrianglesInput).filter(function (fracEdge) {
		return (fracLineSegmentInUnionOfFracTriangles(fracEdge, ...fracTrianglesInput) == "boundary")
	})
	simpleFracPolygons = []
	while (fracEdges.length > 0) {
		simpleFracPolygonByEdges = [ fracEdges[fracEdges.length - 1] ]
		prevVertex = fracEdges[fracEdges.length - 1][0]
		thisVertex = fracEdges[fracEdges.length - 1][1]
		while (simpleFracPolygonByEdges.length == 1 || !arrEqual(simpleFracPolygonByEdges[simpleFracPolygonByEdges.length - 1], simpleFracPolygonByEdges[0])) {
			indices = nextFracVertexIndices(prevVertex, thisVertex, fracEdges)
			i = indices[0]
			j = indices[1]
			simpleFracPolygonByEdges.push([ thisVertex, fracEdges[i][j] ])
			prevVertex = thisVertex
			thisVertex = fracEdges[i][j]
			arr1 = (i > 0) ? fracEdges.slice(0, i) : []
			arr2 = (i < fracEdges.length - 1) ? fracEdges.slice(i + 1) : []
			fracEdges = arr1.concat(arr2)
		}
		simpleFracPolygon = simpleFracPolygonByEdges.map(function (edge) {
			return edge[0]
		})
		simpleFracPolygons.push(simpleFracPolygon)
	}
	return partitionOfSimpleFracPolygonsByDisjointness(...simpleFracPolygons)
}

function unorderedCutFracPointsOfTwoFracTriangles (fracTriangle1, fracTriangle2) {
	fracLineSegments1 = {
		a: [ fracTriangle1[0], fracTriangle1[1] ],
		b: [ fracTriangle1[1], fracTriangle1[2] ],
		c: [ fracTriangle1[0], fracTriangle1[2] ]
	}
	fracLineSegments2 = {
		d: [ fracTriangle2[0], fracTriangle2[1] ],
		e: [ fracTriangle2[1], fracTriangle2[2] ],
		f: [ fracTriangle2[0], fracTriangle2[2] ]
	}
	cutFracPoints = {
		a: [],
		b: [],
		c: [],
		d: [],
		e: [],
		f: []
	}
	for (fracLineSegment1 in fracLineSegments1) {
		for (fracLineSegment2 in fracLineSegments2) {
			if (!isParallelTo(fracLineSegments1[fracLineSegment1], fracLineSegments2[fracLineSegment2])) {
				cutFracPoint = cutFracPointOfNonParallelFracLineSegments(fracLineSegments1[fracLineSegment1], fracLineSegments2[fracLineSegment2])
				if (cutFracPoint) {
					cutFracPoints[fracLineSegment1].push(cutFracPoint)
					cutFracPoints[fracLineSegment2].push(cutFracPoint)
				}
			}
		}
	}
	return cutFracPoints
}