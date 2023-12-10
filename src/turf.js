function arrEqual (arr1, arr2) { // TESTED
	if (typeof arr1 == "object") {
		return (arrEqual(arr1[0], arr2[0]) && arrEqual(arr1[1], arr2[1]))
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
	return partitionOfSimpleFracPolygonsByDisjointness([ [ xMin, yMin ], [ xMax, yMin ], [ xMax, yMax ], [ xMin, yMax ] ], ...simpleFracPolygons)
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
	maxAbsVal = 0
	for (fracPolygon of fracMultipolygon1) {
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
	for (fracPolygon of fracMultipolygon2) {
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
	complementOfFracMultipolygon1 = complementOfFracMultipolygon(fracMultipolygon1, [ -maxAbsVal, 1 ], [ maxAbsVal, 1 ], [ -maxAbsVal, 1 ], [ maxAbsVal, 1 ])
	return complementOfFracMultipolygon(unionOfManyFracMultipolygons(complementOfFracMultipolygon1, fracMultipolygon2), [ -maxAbsVal, 1 ], [ maxAbsVal, 1 ], [ -maxAbsVal, 1 ], [ maxAbsVal, 1 ])
}

function findOneFracTriangleFromSimpleFracPolygon (simpleFracPolygon) {
	if (simpleFracPolygon.length == 4) {
		return {
			triangle: simpleFracPolygon,
			fracDiff: null
		}
	} else {
		remainder = simpleFracPolygon
		for (i = 1; i < simpleFracPolygon.length; i++) {
			oppFracLineSegment = oppSide(simpleFracPolygon[i], simpleFracPolygon)
			if (fracLineSegmentInSimpleFracPolygon(oppFracLineSegment, simpleFracPolygon)) {
				triangle = [ simpleFracPolygon[i], ...oppFracLineSegment, simpleFracPolygon[i] ]
				remainder.pop()
				fracDiff = remainder.filter(function (fracVertex) {
					return !arrEqual(fracVertex, simpleFracPolygon[i])
				})
				
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
				testFracLineSegment = [ simpleFracPolygon[i-1], simpleFracPolygon[i] ])
				if (!isParallelTo(testFracLineSegment, fracLineSegment) && cutFracPointOfNonParallelFracLineSegments(testFracLineSegment, fracLineSegment)) {
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
	midpoint = [ fracProduct(fracSum(A[0], B[0]), [ 1, 2 ]), fracProduct(fracSum(A[1], B[1]), [ 1, 2 ]) ]
	for (fracTriangle of fracTriangles) {
		if (fracPointInFracTriangle(midpoint, fracTriangle) == "interior") {
			return "interior"
		}
	}
	return "boundary"
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
	xMin = null
	for (fracLineSegment of fracLineSegments) {
		if (fracPointOnFracLineSegment(fracPoint, fracLineSegment) != "exterior") {
			return "boundary"
		}
		filteredFracLineSegments.push((fracLineSegment)
		if (!xMin || fracDifference(fracLineSegment[0][0], xMin)[0] < 0) {
			xMin = fracLineSegment[0][0]
		}
		if (fracDifference(fracLineSegment[1][0], xMin)[0] < 0) {
			xMin = fracLineSegment[1][0]
		}
	}
	testFracLineSegment = [ [ fracDifference(xMin, [ 1, 1 ]), fracPoint[1] ], fracPoint ]
	intersections = []
	for (filteredFracLineSegment of filteredFracLineSegments) {
		intersection = intersectionFracPointOfNonParallelFracLineSegments(filteredFracLineSegment, testFracLineSegment)
		if (intersection) {
			intersections.push(intersection)
		}
	}
	cuts = removeDuplicates(intersections).filter(function (cut) {
		return (fracDifference(cut[0], fracPoint[0])[0] < 0)
	})
	if (cuts.length % 2 == 0) {
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
		if (xMatch && fracProduct(fracDifference(fracLineSegment[0][1], fracPoint[1]), fracDifference(fracLineSegment[1][1], fracPoint[1]))[0] < 0)
			return "interior"
		} else {
			return "exterior"
		}
	} else {
		xBetween = (fracProduct(fracDifference(fracLineSegment[0][0], fracPoint[0]), fracDifference(fracLineSegment[1][0], fracPoint[0]))[0] < 0) {
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
					testFracLineSegment = [ fracPolygon[0][j], fracPolygon[i][k] ]
					if (fracLineSegmentInFracPolygon(testFracLineSegment, fracPolygon)) {
						check = true
						for (newEdge of newEdges) {
							if (!isParallelTo(newEdge, testFracLineSegment) && cutFracPointOfNonParallelFracLineSegments(newEdge, testFracLineSegment)) {
								check = false
								break
							}
						}
						if (check) {
							newEdges.push(testFracLineSegment)
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
		weaklySimplePolygon = [ edges[0][0] ]
		newElement = null
		bool = true
		while (!arrEqual(newElement, edges[0][0])) {
			attempt = nextVertexIndices(newElement, newEdges)
			if (bool && attempt) {
				i = attempt[0]
				j = attempt[1]
				newElement = newEdges[i][j]
				bool = false
			} else {
				indices = nextVertexIndices(newElement, edges)
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
		return cutFracPointOfNonParallelFracLineSegments(fracLineSegment2, fracLineSegment1)
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
		if (fracPointInFracTriangle(fracPoint, fracTriangle2) == "exterior") {
			return false
		}
	}
	return true
}

function isVertical (fracLineSegment) {
	return arrEqual(fracLineSegment[0][0], fracLineSegment[1][0])
}

function nextFracVertexIndices (thisFracVertex, fracEdges) {
	for (a = 0; a < fracEdges.length; a++) {
		for (b = 0; b < 2; b++) {
			if (arrEqual(fracEdges[a][b], thisFracVertex)) {
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
	return result
}

function partitionOfSimpleFracPolygonsByDisjointness (simpleFracPolygons) {
	// return multipolygon
	superset = simpleFracPolygons.map(function () {
		return []
	})
	for (i = 0; i < simpleFracPolygons.length; i++) {
		for (j = 0; j < simpleFracPolygons.length; j++) {
			if (i != j && fracPointInFracMultipolygon(simpleFracPolygons[i][0], [ simpleFracPolygons[j] ])) {
				superset[i].push(j)
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

function unionOfManyFracTraiangles (...fracTriangles) {
	// return multipolygon
	indicesOfRedundantFracTriangles = []
	for (i = 0; i < fracTriangles.length; i++) {
		for (j = 0; j < fracTriangles.length; j++) {
			if (i != j && isSubsetOf(fracTriangles[i], fracTriangles[j])) {
				indicesOfRedundantFracTriangles.push(i)
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
		simpleFracPolygon = fracEdges[fracEdges.length - 1]
		fracEdges.pop()
		while (!arrEqual(simpleFracPolygon[simpleFracPolygon.length - 1], simpleFracPolygon[0])) {
			indices = nextFracVertexIndices(simpleFracPolygon[simpleFracPolygon.length - 1], fracEdges)
			i = indices[0]
			j = indices[1]
			simpleFracPolygon.push(fracEdges[i][j])
			arr1 = (i > 0) ? fracEdges.slice(0, i) : []
			arr2 = (i < fracEdges.length - 1) ? fracEdges.slice(i + 1) : []
			fracEdges = arr1.concat(arr2)
		}
		simpleFracPolygons.push(simpleFracPolygon)
	}
	return partitionOfSimpleFracPolygonsByDisjointness(simpleFracPolygons)
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
