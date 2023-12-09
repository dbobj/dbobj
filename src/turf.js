function arrEqual (arr1, arr2) { // TESTED
	if (typeof arr1 == "object") {
		return (arrEqual(arr1[0], arr2[0]) && arrEqual(arr1[1], arr2[1]))
	} else {
		return (arr1 === arr2)
	}
}

function cutFracPointOfNonParallelFracEquations (fracEquation, nonVerticalFracEquation) { // TESTED
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

function fracAreaOfSimpleFracPolygon (simpleFracPolygon) { // TESTED
    fracArea = [ 0, 1 ]
    for (i = 1; i < simpleFracPolygon.length; i++) {
    	fracChange = fracDifference(fracProduct(simpleFracPolygon[i - 1][0], simpleFracPolygon[i][1]), fracProduct(simpleFracPolygon[i - 1][1], simpleFracPolygon[i][0]))
        fracArea = fracSum(fracArea, fracChange)
    }
    return fracProduct(fracArea, [ 1, 2 ])
}

function fracAsFracStr (arr) { // TESTED
	if (!arr) {
		return undefined
	}
	if (typeof arr[0] == "number") {
		return arr[0] + "/" + arr[1]
	} else {
		return arr.map(fracAsFracStr)
	}
}

function fracAsNum (arr) { // TESTED
	if (!arr) {
		return undefined
	}
	if (typeof arr[0] == "number") {
		return arr[0] / arr[1]
	} else {
		return arr.map(fracAsNum)
	}
}

function fracDifference (fracA, fracB) { // TESTED
	if (fracA && fracB) {
		return fracReduce([ fracA[0] * fracB[1] - fracB[0] * fracA[1] , fracA[1] * fracB[1] ])
	} else {
		return undefined
	}
}

function fracEquationFromTwoFracPoints (fracPointA, fracPointB) { // TESTED
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

function fracInequalitiesOfFracTriangle (fracTriangle) { // TESTED
	// fracTriangle = [ fracPointA, fracPointB, fracPointC, fracPointA ]
	fracVertices = fracTriangle
	fracVertices.pop()
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
	PQ = fracEquationFromTwoFracPoints(fracVertexP, fracVertexQ)
	QR = fracEquationFromTwoFracPoints(fracVertexQ, fracVertexR)
	PR = fracEquationFromTwoFracPoints(fracVertexP, fracVertexR)
	if (arrEqual(fracVertexP[0], fracVertexQ[0])) {
		// [ [ undefined, alpha ], sign ] means x is "greater than or equal to" (for sign = 1) or "less than or equal to" (for sign = -1) alpha
		// [ [ m, c ], sign ] means y is "greater than or equal to" (for sign = 1) or "less than or equal to" (for sign = -1) mx + c
		// inequalities are in the order of [ PQ, QR, PR ]
		return [
			[ [ undefined, fracVertexP[0] ], 1 ],
			[ QR, -1 ],
			[ PR, 1 ]
		]
	}
	if (arrEqual(fracVertexQ[0], fracVertexR[0])) {
		return [
			[ PR, 1 ],
			[ [ undefined, fracVertexP[0] ], -1 ],
			[ QR, -1 ]
		]
	}
	PQ = fracEquationFromTwoFracPoints(fracVertexP, fracVertexQ)
	QR = fracEquationFromTwoFracPoints(fracVertexQ, fracVertexR)
	PR = fracEquationFromTwoFracPoints(fracVertexP, fracVertexR)
	if (fracDifference(fracVertexQ[1], substituteFracIntoFracEquation(fracVertexQ[0], PR))[0] < 0) {
		return [ [ PQ, 1 ], [ QR, 1 ], [ PR, -1 ] ]
	} else {
		return [ [ PQ, -1 ], [ QR, -1 ], [ PR, 1 ] ]
	}
}

function fracLineSegmentInUnionOfFracTriangles (fracLineSegment, ...fracTriangles) { // TESTED
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
	fracPoints = []
	for (fracPolygon of fracMultipolygon) {
		for (simpleFracPolygon of fracPolygon) {
			for (i = 1; i < simpleFracPolygon.length; i++) {
				fracLineSegments.push([ simpleFracPolygon[i-1], simpleFracPolygon[i] ])
				fracPoints.push(simpleFracPolygon[i])
			}
		}
	}
	fracPoints.sort(function (fracPointA, fracPointB) {
		return sortFrac(fracPointA[0], fracPointB[0])
	})
	xMin = fracDifference(fracPoints[0][0], [ 1, 1 ])
	xMax = fracSum(fracPoints[fracPoints.length - 1][0], [ 1, 1 ])
	testLineSegment = [ [ xMin, fracPoint[1] ], [ xMax, fracPoint[1] ] ]
	// ...
}

function fracPointInFracTriangle (fracPoint, fracTriangle) { // TESTED
	// return "interior", "boundary" or "exterior"
	return fracPointSatisfiesFracInequalities(fracPoint, fracInequalitiesOfFracTriangle(fracTriangle))
}

function fracPointSatisfiesFracInequalities (fracPoint, fracInequalities) { // TESTED
	result = fracInequalities.map(function (fracInequality) {
		return fracPointSatisfiesFracInequality(fracPoint, fracInequality)
	})
	if (result.indexOf("exterior") > -1) {
		return "exterior"
	}
	if (result.indexOf("boundary") > -1) {
		return "boundary"
	}
	return "interior"
}

function fracPointSatisfiesFracInequality (fracPoint, fracInequality) { // TESTED
	if (fracInequality[0][0]) {
		test = substituteFracIntoFracEquation(fracPoint[0], fracInequality[0])
		if (arrEqual(fracPoint[1], test)) {
			return "boundary"
		}
		if (fracDifference(fracPoint[1], test)[0] * fracInequality[1] > 0) {
			return "interior"
		} else {
			return "exterior"
		}
	} else {
		if (arrEqual(fracPoint[1], fracInequality[0][1])) {
			return "boundary"
		}
		if (fracDifference(fracPoint[1], fracInequality[0][1])[0] * fracInequality[1] > 0) {
			return "interior"
		} else {
			return "exterior"
		}
	}
}

function fracProduct (fracA, fracB) { // TESTED
	if (fracA && fracB) {
		return fracReduce([ fracA[0] * fracB[0], fracA[1] * fracB[1] ])
	} else {
		return undefined
	}
}

function fracQuotient (fracA, fracB) { // TESTED
	if (fracA && fracB) {
		return fracProduct(fracA, [ fracB[1], fracB[0] ])
	} else {
		return undefined
	}
}

function fracReduce (frac) { // TESTED
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

function fracSlopeFromTwoFracPoints (fracPointA, fracPointB) { // TESTED
	return fracQuotient(fracDifference(fracPointA[1], fracPointB[1]), fracDifference(fracPointA[0], fracPointB[0]))
}

function fracSum (fracA, fracB) { // TESTED
	if (fracA && fracB) {
		return fracReduce([ fracA[0] * fracB[1] + fracB[0] * fracA[1] , fracA[1] * fracB[1] ])
	} else {
		return undefined
	}
}

function intHCF (a, b) { // TESTED
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

function isNewElement (testElement, arr) { // TESTED
	for (element of arr) {
		if (arrEqual(element, testElement)) {
			return false
		}
	}
	return true
}

function isParallelTo (fracLineSegment1, fracLineSegment2) { // TESTED
	fracSlope1 = fracSlopeFromTwoFracPoints(...fracLineSegment1)
	fracSlope2 = fracSlopeFromTwoFracPoints(...fracLineSegment2)
	if (fracSlope1 && fracSlope2) {
		return arrEqual(fracSlope1, fracSlope2)
	} else {
		return (fracSlope1 == fracSlope2)
	}
}

function isSubsetOf (fracTriangle1, fracTriangle2) { // TESTED
	// return true if and only if fracTriangle1 is a subset of fracTriangle2
	for (fracPoint of fracTriangle1) {
		if (fracPointInFracTriangle(fracPoint, fracTriangle2) == "exterior") {
			return false
		}
	}
	return true
}

function isVertical (fracLineSegment) { // TESTED
	return arrEqual(fracLineSegment[0][0], fracLineSegment[1][0])
}

function nextFracVertexIndices (thisFracVertex, fracEdges) { // TESTED
	for (a = 0; a < fracEdges.length; a++) {
		for (b = 0; b < 2; b++) {
			if (arrEqual(fracEdges[a][b], thisFracVertex)) {
				return [ a, 1 - b ]
			}
		}
	}
}

function partitionOfFracEdgesByUnionOfManyFracTraiangles (...fracTriangles) { // TESTED
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

function removeDuplicates (arr) { // TESTED
	result = []
	for (el of arr) {
		if (isNewElement(el, result)) {
			result.push(el)
		}
	}
	return result
}

function sortFrac (fracA, fracB) { // TESTED
	return (fracDifference(fracA, fracB)[0] > 0) - 0.5
}

function substituteFracIntoFracEquation (fracX, fracEquation) { // TESTED
	// fracEquation is not a vertical line
	return fracSum(fracProduct(fracEquation[0], fracX), fracEquation[1])
}

function unorderedCutFracPointsOfTwoFracTriangles (fracTriangle1, fracTriangle2) { // TESTED
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
