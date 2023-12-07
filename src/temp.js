function arrEqual (arr1, arr2) {
	
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

function nextFracVertex (fracVertex1, fracVertex2, fracEdges) {
	// dependency: arrEqual
}

function partitionOfFracEdgesByUnionOfManyFracTraiangles (...fracTriangles) {
	// dependency: unorderedCutFracPointsOfTwoFracTriangles, removeDuplicates, arrEqual, sortFrac
}

function partitionOfFracTrianglesByUnion (...fracTriangles) {
	// ...
	// example of return: [ [ fracTriangle1, fracTriangle2 ], [ fracTriangle3 ] ]
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
