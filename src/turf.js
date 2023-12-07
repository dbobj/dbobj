function arrEqual (arr1, arr2) { // OK
	if (typeOf arr1 == "object") {
		for (i = 0; i < arr1.length; i++) {
			if (!arrEqual(arr1[i], arr2[i]) {
				return false
			}
		}
		return true
	} else {
		return (arr1 === arr2)
	}
}

function combinationsOfPairs (arr) { // OK
	combinations = []
	for (i = 0; i < arr.length; i++) {
		for (j = i + 1; j < arr.length; j++) {
			combinations.push([ arr[i], arr[j] ])
		}
	}
	return combinations
}

function fracDifference (fracA, fracB) { // OK
	if (fracA && fracB) {
		return fracReduce([ fracA[0] * fracB[1] - fracB[0] * fracA[1] , fracA[1] * fracB[1] ])
	} else {
		return undefined
	}
}

function fracEquationFromTwoFracPoints (fracPointA, fracPointB) { // OK
	// [ m, c ] means y = mx + c while [ undefined, alpha ] means x = alpha
	fracSlope = fracSlopeFromTwoFracPoints(fracPointA, fracPointB)
	fracX = fracPointA[0]
	fracY = fracPointB[1]
	if (fracSlope) {
		return [ fracSlope, fracDifference(fracY, fracProduct(fracSlope, fracX)) ]
	} else {
		return [ undefined, fracX ]
	}
}

function fracInequalitiesOfFracTriangle (fracTriangle) { // OK
	// fracTriangle = [ fracPointA, fracPointB, fracPointC ]
	fracVertices = fracTriangle
	fracVertices.sort(function (fracVertexA, fracVertexB) {
		if (arrEqual(fracVertexA[0], fracVertexB[0])) {
			return (fracDifference(fracVertexA[1], fracVertexB[1])[0] > 0) - 0.5
		} else {
			return (fracDifference(fracVertexA[0], fracVertexB[0])[0] > 0) - 0.5
		}
	})
	fracVertexP = fracVertices[0]
	fracVertexQ = fracVertices[1]
	fracVertexR = fracVertices[2]
	if (arrEqual(fracVertexP[0], fracVertexQ[0])) {
		// [ [ undefined, alpha ], sign ] means x is "greater than or equal to" (for sign = 1) or "less than or equal to" (for sign = -1) alpha
		// [ [ m, c ], sign ] means y is "greater than or equal to" (for sign = 1) or "less than or equal to" (for sign = -1) mx + c
		// inequalities are in the order of [ PQ, QR, PR ]
		return [
			[ [ undefined, fracVertexP[0] ], 1 ],
			[ fracEquationFromTwoFracPoints(fracVertexQ, fracVertexR), -1 ],
			[ fracEquationFromTwoFracPoints(fracVertexR, fracVertexR), 1 ]
		]
	}
	if (arrEqual(fracVertexQ[0], fracVertexR[0])) {
		return [
			[ fracEquationFromTwoFracPoints(fracVertexR, fracVertexR), 1 ],
			[ [ undefined, fracVertexP[0] ], -1 ],
			[ fracEquationFromTwoFracPoints(fracVertexQ, fracVertexR), -1 ]
		]
	}
	PQ = fracEquationFromTwoFracPoints(fracVertexP, fracVertexQ)
	QR = fracEquationFromTwoFracPoints(fracVertexQ, fracVertexR)
	PR = fracEquationFromTwoFracPoints(fracVertexP, fracVertexR)
	if (fracVertexQ[1] < substituteFracIntoFracEquation(fracVertexQ[0], PR)) {
		return [ [ PQ, 1 ], [ QR, 1 ], [ PR, -1 ] ]
	} else {
		return [ [ PQ, -1 ], [ QR, -1 ], [ PR, 1 ] ]
	}
}

function fracLineSegmentInUnionOfFracTriangles (fracLineSegment, ...fracTriangles) { // OK
	A = fracLineSegment[0]
	B = fracLineSegment[1]
	midpoint = [ fracProduct(fracSum(A[0], B[0]), [ 1, 2 ]), fracProduct(fracSum(A[1], B[1]), [ 1, 2 ]) ]
	for (fracTriangle of fracTriangles) {
		if (fracPointInFracTriangle(midpoint, fracTriangle) {
			return true
		}
	}
	return false
}

function fracPointInFracTriangle (fracPoint, fracTriangle) { // OK
	return fracPointSatisfiesFracInequalities(fracPoint, fracInequalitiesOfFracTriangle(fracTriangle))
}

function fracPointSatisfiesFracInequalities (fracPoint, fracInequalities) { // OK
	for (fracInequality of fracInequalities) {
		if (!fracPointSatisfiesFracInequality(fracPoint, fracInequality)) {
			return false
		}
	}
	return true
}

function fracPointSatisfiesFracInequality (fracPoint, fracInequality) { // OK
	test = substituteFracIntoFracEquation(fracPoint[0], fracInequality[0])
	return (fracPoint[1] == test || ((fracPoint[1] > test) - 0.5) * fracInequality[1] > 0)
}

function fracProduct (fracA, fracB) { // OK
	if (fracA && fracB) {
		return fracReduce([ fracA[0] * fracB[0], fracA[1] * fracB[1] ])
	} else {
		return undefined
	}
}

function fracQuotient (fracA, fracB) { // OK
	if (fracA && fracB) {
		return fracProduct(fracA, [ fracB[1], fracB[0] ])
	} else {
		return undefined
	}
}

function fracReduce (frac) { // OK
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

function fracSlopeFromTwoFracPoints (fracPointA, fracPointB) { // OK
	return fracQuotient(fracDifference(fracPointA[1], fracPointB[1]), fracDifference(fracPointA[0], fracPointB[0]))
}

function fracSum (fracA, fracB) { // OK
	if (fracA && fracB) {
		return fracReduce([ fracA[0] * fracB[1] + fracB[0] * fracA[1] , fracA[1] * fracB[1] ])
	} else {
		return undefined
	}
}

function fracVal (frac) { // OK
	if (frac) {
		return frac[0] / frac[1]
	} else {
		return undefined
	}
}

function intHCF (a, b) { // OK
	// a and b can be negative but intHCF(a, b) must be positive
	if (b == 0) {
		return Math.abs(a)
	} else {
		return intHCF(b, a % b)
	}
}

function intersectionOfNonParallelFracEquations (fracEquation, nonVerticalFracEquation) { // OK
	if (fracEquation[0]) {
		fracX = fracQuotient(fracDifference(fracEquation[1], nonVerticalFracEquation[1]), fracDifference(nonVerticalFracEquation[0], fracEquation[0]))
	} else {
		fracX = fracEquation[1]
	}
	fracY = substituteFracIntoFracEquation(fracX, nonVerticalFracEquation)
	return [ fracX, fracY ]
}

function intersectionOfNonParallelFracLineSegments (fracLineSegment1, fracLineSegment2) { // OK
	if (isVertical(fracLineSegment2)) {
		return intersectionOfNonParallelFracLineSegments(fracLineSegment2, fracLineSegment1)
	}
	fracEquation1 = fracEquationFromTwoFracPoints(...fracLineSegment1)
	fracEquation2 = fracEquationFromTwoFracPoints(...fracLineSegment2)
	intersection = intersectionOfNonParallelFracEquations(fracEquation1, fracEquation2)
	if (fracProduct(fracDifference(fracLineSegment2[0][0], intersection[0]), fracDifference(fracLineSegment2[1][0], intersection[0])) < 0) {
		return intersection
	} else {
		return null
	}
}

function isDisjointFracTrianglePair (fracTriangle1, fracTriangle2) {
	// ...
}

function isNewElement (testElement, arr) { // OK
	for (element of arr) {
		if (arrEqual(element, testElement) {
			return false
		}
	}
	return true
}

function isNewFracEdge (testFracEdge, fracEdges) { // OK
	for (fracEdge of fracEdges) {
		if (arrEqual(fracEdge[0], testFracEdge[0]) && arrEqual(fracEdge[1], testFracEdge[1])) {
			return false
		}
		if (arrEqual(fracEdge[0], testFracEdge[1]) && arrEqual(fracEdge[1], testFracEdge[0])) {
			return false
		}
	}
	return true
}

function isParallelTo (fracLineSegment1, fracLineSegment2) { // OK
	fracSlope1 = fracSlopeFromTwoFracPoints(...fracLineSegment1)
	fracSlope2 = fracSlopeFromTwoFracPoints(...fracLineSegment2)
	if (fracSlope1 && fracSlope2) {
		return arrEqual(fracSlope1, fracSlope2)
	} else {
		return (fracSlope1 == fracSlope2)
	}
}

function isSubsetOf (fracTriangle1, fracTriangle2) { // OK
	// return true if and only if fracTriangle1 is a subset of fracTriangle2
	for (fracPoint of fracTriangle1) {
		if (!fracPointInFracTriangle(fracPoint, fracTriangle2)) {
			return false
		}
	}
	return true
}

function isVertical (fracLineSegment) { // OK
	return arrEqual(fracLineSegment[0][1], fracLineSegment[1][1])
}

function nextFracVertex (fracVertex1, fracVertex2, fracEdges) { // OK
	for (fracEdge of fracEdges) {
		for (i = 0; i < 2; i++) {
			if (arrEqual(fracEdge[i], fracVertex2) && !arrEqual(fracEdge[1-i], fracVertex1)) {
				return fracEdge[1-i]
			}
		}
	}
}

function partitionOfEdgesByUnionOfManyFracTraiangles (...fracTriangles) { // OK
	cutPoints = fracTriangles.map(function (fracTriangle) {
		return [
			[ fracTriangle[0], fracTriangle[1] ],
			[ fracTriangle[1], fracTriangle[2] ],
			[ fracTriangle[0], fracTriangle[2] ]
		]
	})
	for (i = 0; i < fracTriangles.length; i++) {
		for (j = i + 1; j < fracTriangles.length; j++) {
			unorderedCutPoints = unorderedCutPointsOfTwoFracTriangles(fracTriangles[i], fracTriangles[j])
			cutPoints[i][0] = cutPoints[i][0].concat(unorderedCutPoints.a)
			cutPoints[i][1] = cutPoints[i][1].concat(unorderedCutPoints.b)
			cutPoints[i][2] = cutPoints[i][2].concat(unorderedCutPoints.c)
			cutPoints[j][0] = cutPoints[j][0].concat(unorderedCutPoints.d)
			cutPoints[j][1] = cutPoints[j][1].concat(unorderedCutPoints.e)
			cutPoints[j][2] = cutPoints[j][2].concat(unorderedCutPoints.f)
		}
	}
	for (i = 0; i < cutPoints.length; i++) {
		for (j = 0; j < 3; j++) {
			cutPoints[i][j] = removeDuplicates(cutPoints[i][j])
			cutPoints[i][j].sort(function (cutPointA, cutPointB) {
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
	return results
}

function partitionOfFracTrianglesByUnion (...fracTriangles) {
	// ...
	// example of return: [ [ fracTriangle1, fracTriangle2 ], [ fracTriangle3 ] ]
}

function removeDuplicates (arr) { // OK
	result = []
	for (element of arr) {
		if (isNewElement(element, result)) {
			result.push(element)
		}
	}
	return result
}		

function sortFrac (fracA, fracB) { // OK
	return (fracDifference(fracA, fracB)[0] > 0) - 0.5
}

function substituteFracIntoFracEquation (fracX, fracEquation) { // OK
	// fracEquation is not a vertical line
	return fracSum(fracProduct(fracEquation[0], fracX), fracEquation[1])
}

function unionOfManyFracTraiangles (...fracTriangles) {
	// return multipolygon
	if (isSubsetOf(fracTriangle1, fracTriangle2) {
		result = [ [ [ ...fracTriangle2, fracTriangle2[0] ] ] ]
	} else if (isSubsetOf(fracTriangle2, fracTriangle1) {
		result = [ [ [ ...fracTriangle1, fracTriangle1[0] ] ] ]
	} else {
		edges = partitionOfEdgesByUnionOfManyFracTraiangles(...fracTriangles).filter(function (edge) {
			return !fracLineSegmentInUnionOfFracTriangles (edge, ...fracTriangles)
		})
		if (edgesOfUnion.length > 6) {
			result = edgesOfUnion[0]
			while (!arrEqual(result[result.length - 1], result[0])) {
				result.push(nextFracVertex(result[result.length - 2], result[result.length - 1], edgesOfIntersection))
			}
		} else {
			result = [ [ [ ...fracTriangle1, fracTriangle1[0] ] ], [ [ ...fracTriangle2, fracTriangle2[0] ] ] ]
		}
	}
	for (polygon of result) {
		for (simplePolygon of polygon) {
			if (simplePolygonArea(simplePolygon) < 0) {
				simplePolygon.reverse()
			}
		}
	}
	return result
}

function unorderedCutPointsOfTwoFracTriangles (fracTriangle1, fracTriangle2) { // OK
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
	cutPoints = {
		a: [],
		b: [],
		c: [],
		d: [],
		e: [],
		f: []
	}
	for (fracLineSegment1 in fracLineSegments1) {
		for (fracLineSegment2 in fracLineSegments2) {
			if (!isParallelTo(fracLineSegments1[fracLineSegment1], fracLineSegments2[fracLineSegment2]) {
				cutPoint = intersectionOfNonParallelFracLineSegments(fracLineSegments1[fracLineSegment1], fracLineSegments2[fracLineSegment2])
				if (cutPoint) {
					cutPoints[fracLineSegment1].push(cutPoint)
					cutPoints[fracLineSegment2].push(cutPoint)
				}
			}
		}
	}
	return cutPoints
}
