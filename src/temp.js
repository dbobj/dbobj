function arrEqual (arr1, arr2) {
	
}

function combinationsOfPairs (arr) {
	combinations = []
	for (i = 0; i < arr.length; i++) {
		for (j = i + 1; j < arr.length; j++) {
			combinations.push([ arr[i], arr[j] ])
		}
	}
	return combinations
}

function cutFracPointOfNonParallelFracEquations (fracEquation, nonVerticalFracEquation) {
	// dependency: fracDifference, fracQuotient, substituteFracIntoFracEquation
}

function cutFracPointOfNonParallelFracLineSegments (fracLineSegment1, fracLineSegment2) {
	// dependency: isVertical, fracEquationFromTwoFracPoints, cutFracPointOfNonParallelFracEquations, fracDifference, fracProduct
}

function fracDifference (fracA, fracB) {
	// dependency: fracReduce
}

function fracEquationFromTwoFracPoints (fracPointA, fracPointB) {
	// dependency: fracSlopeFromTwoFracPoints, fracProduct, fracDifference
	// [ m, c ] means y = mx + c while [ undefined, alpha ] means x = alpha
}

function fracInequalitiesOfFracTriangle (fracTriangle) {
	// dependency: arrEqual, fracDifference, fracEquationFromTwoFracPoints, substituteFracIntoFracEquation
	// fracTriangle = [ fracPointA, fracPointB, fracPointC ]
	// [ [ undefined, alpha ], sign ] means x is "greater than or equal to" (for sign = 1) or "less than or equal to" (for sign = -1) alpha
	// [ [ m, c ], sign ] means y is "greater than or equal to" (for sign = 1) or "less than or equal to" (for sign = -1) mx + c
}

function fracLineSegmentInUnionOfFracTriangles (fracLineSegment, ...fracTriangles) { // NO DEPENDENCY
	// dependency: fracSum, fracProduct, fracPointInFracTriangle
	// return false for boundary case
}

function fracPointInFracTriangle (fracPoint, fracTriangle) {
	// dependency: fracInequalitiesOfFracTriangle, fracPointSatisfiesFracInequalities
	// return true for boundary case
}

function fracPointSatisfiesFracInequalities (fracPoint, fracInequalities) {
	// dependency: fracPointSatisfiesFracInequality
	// return true for boundary case
}

function fracPointSatisfiesFracInequality (fracPoint, fracInequality) {
	// dependency: substituteFracIntoFracEquation
	// return true for boundary case
}

function fracProduct (fracA, fracB) {
	// dependency: fracReduce
}

function fracQuotient (fracA, fracB) {
	// dependency: fracProduct
}

function fracReduce (frac) {
	// dependency: intHCF
}

function fracSlopeFromTwoFracPoints (fracPointA, fracPointB) {
	// dependency: fracDifference, fracQuotient
}

function fracSum (fracA, fracB) {
	// dependency: fracReduce
}

function fracVal (frac) {
	
}

function intHCF (a, b) {
	
}

function isDisjointFracTrianglePair (fracTriangle1, fracTriangle2) {
	// no triangle is a subset of another
	// ...
}

function isNewElement (testElement, arr) {
	// dependency: arrEqual
}

function isParallelTo (fracLineSegment1, fracLineSegment2) {
	// dependency: fracSlopeFromTwoFracPoints, arrEqual
}

function isSubsetOf (fracTriangle1, fracTriangle2) {
	// dependency: fracPointInFracTriangle
}

function isVertical (fracLineSegment) {
	// dependency: arrEqual
}

function partitionOfFracEdgesByUnionOfManyFracTraiangles (...fracTriangles) {
	cutPoints = fracTriangles.map(function (fracTriangle) {
		return [
			[ fracTriangle[0], fracTriangle[1] ],
			[ fracTriangle[1], fracTriangle[2] ],
			[ fracTriangle[0], fracTriangle[2] ]
		]
	})
	for (i = 0; i < fracTriangles.length; i++) {
		for (j = i + 1; j < fracTriangles.length; j++) {
			unorderedCutPoints = unorderedCutFracPointsOfTwoFracTriangles(fracTriangles[i], fracTriangles[j])
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
	return result
}

function removeDuplicates (arr) {
	// dependency: isNewElement
}

function sortFrac (fracA, fracB) {
	// dependency: fracDifference
}

function substituteFracIntoFracEquation (fracX, fracEquation) {
	// dependency: fracProduct, fracSum
	// fracEquation is not a vertical line
}

function unionOfManyConnectedFracTriangles (...connectedFracTriangles) {
	// ...
	// return polygon
}

function unionOfManyFracTraiangles (...fracTriangles) {
	// ...
	// return multipolygon
}

function unorderedCutFracPointsOfTwoFracTriangles (fracTriangle1, fracTriangle2) {
	// dependency: isParallelTo, cutFracPointOfNonParallelFracLineSegments
	// format of return: { a: [ ... ], b: [ ...], c: [ ...], d: [ ...], e: [ ...], f: [ ...] }
}
