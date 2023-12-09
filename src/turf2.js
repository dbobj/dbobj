function fracPointInSimpleFracPolygon (fracPoint, simpleFracPolygon) {
	// return "interior", "boundary" or "exterior"
}

function isReflexAngle (fracPoint, simpleFracPolygon) {
	// return true or false
}

function partitionOfSimpleFracPolygonsByDisjointness (simpleFracPolygons) {
	superset = simpleFracPolygons.map(function () {
		return []
	})
	for (i = 0; i < simpleFracPolygons.length; i++) {
		for (j = 0; j < simpleFracPolygons.length; j++) {
			if (i != j && fracPointInSimpleFracPolygon(simpleFracPolygons[i][0], simpleFracPolygons[j])) {
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
			criterion2 = (fracAreaOfsimpleFracPolygon(simpleFracPolygon)[0] > 0) - 0.5
			if (criterion1 * criterion2 < 0) {
				simpleFracPolygon.reverse()
			}
			return simpleFracPolygon
		})
	})
}

function triangulateSimpleFracPolygon (simpleFracPolygon) {
	// return array of triangles
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