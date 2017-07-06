exports.ClusterView = ClusterView

class ClusterView extends Layer
	constructor: (@cluster) ->
		min_x = _.head(_.sortBy(@cluster.points, (point) -> point[0]))[0]
		max_x = _.head(_.reverse(_.sortBy(@cluster.points, (point) -> point[0])))[0]
		min_y = _.head(_.sortBy(@cluster.points, (point) -> point[1]))[1]
		max_y = _.head(_.reverse(_.sortBy(@cluster.points, (point) -> point[1])))[1]
		height = max_y - min_y
		width = max_x - min_x
		x = @cluster.centroid[0] - (width / 2)
		y = @cluster.centroy[0] - (height / 2)
		super
			x: x
			y: y
			width: width
			height: height
			backgroundColor: "#EEDDDD"
		@sendToBack()
