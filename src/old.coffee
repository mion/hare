clusterMaker = require "clusters"

tasksQueue = [
	#"put cards in a list upon adding",
	#"auto re-order cards upon drag end",
]

class CardList
	constructor: () ->
		@cards = []
	add: (task) ->
		card = new Card(task, this)
		@cards.push(card)
		card.onDoubleTap =>
			@remove(card)
		return card
	remove: (card) ->
		pos = @cards.indexOf(card)
		@cards.splice(pos, 1)
		card.destroy()
	cardAt: (x, y) ->
		for card in @cards
			if card.x == x && card.y == y
				return card
		null
	cluster: () ->
		points = @cards.map (card) -> [card.x, card.y]
		clusterMaker.data(points)
		clusters = clusterMaker.clusters()
		console.log("clusters", clusters)
		for cluster in clusters
			cardsInside = []
			for pair in cluster.points
				c = @cardAt(pair[0], pair[1])
				cardsInside.push(c) unless _.isNil(c)
			tasks = cardsInside.map (card) -> card.task
			bigCard = @add(tasks.join("; "))
			bigCard.x = cluster.centroid[0]
			bigCard.y = cluster.centroid[1]
			cardsInside.forEach (card) => @remove(card)

class Workplace extends Layer
	constructor: () ->
		super
			width: Screen.width / 2
			height: Screen.height / 2
			x: Align.center
			y: Align.center
			backgroundColor: "#F9F9F9"
		@active = false
		@onLongPress ->
			if @active then @deactivate() else @activate()
	activate: () ->
		@animate
			backgroundColor: "#AAA"
		@active = true
	deactivate: () ->
		@active = false
		@animate
			backgroundColor: "#F9F9F9"

# workplace = new Workplace

class Button extends Layer
	constructor: (icon, button) ->
		BUTTON_SIZE = 75
		ICON_SIZE = 30
		PADDING = 15
		super
			width: BUTTON_SIZE
			height: BUTTON_SIZE
			x: if _.isNil(button) then Screen.width - BUTTON_SIZE - PADDING else button.x - BUTTON_SIZE - PADDING
			y: PADDING
			borderRadius: 15
			backgroundColor: "#EEE"
		@iconLayer = new Layer
			parent: this
			width: ICON_SIZE
			height: ICON_SIZE
			x: Align.center
			y: Align.center
			image: "images/icons/#{icon}.svg"

addButton = new Button("plus")
clusterButton = new Button("box", addButton)
cardList = new CardList()

addButton.onTap ->
	task = if _.isEmpty(tasksQueue)
		prompt("What's the task?")
	else
		tasksQueue.pop()
	if task != null
		cardList.add(task)

clusterButton.onTap ->
	cardList.cluster()

class ExplorationSlider extends SliderComponent
	constructor: () ->
		super
			x: Align.center
			y: 50
			min: 0.0
			max: 1.0
		@knob.draggable.momentum = false
		@knob.onDragEnd =>
			print(@value)

#slider = new ExplorationSlider

leftmost = (layers) ->
	_.head(_.sortBy(layers, (l) -> l.x))

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

class Card extends Layer
	instersectionArea: (layer) ->
	isInside: (layer) ->
		(@x > layer.x) && (@x < layer.x + layer.width) && (@y > layer.y) && (@y < layer.y + layer.height)
	constructor: (@task, @list) ->
		key = @task.toLowerCase().split(" ").join("_")
		pos_str = localStorage.getItem("cardpos:#{key}")
		if pos_str != null
			@xInit = parseInt(pos_str.split(",")[0])
			@yInit = parseInt(pos_str.split(",")[1])
		else
			@xInit = (Canvas.width / 2)
			@yInit = (Canvas.height / 2)
		super
			x: @xInit
			y: @yInit
			width: 100
			height: 100
			borderRadius: 8
			backgroundColor: "#FFFFCC"
			shadowX: 0
			shadowY: 3
			shadowBlur: 6
			shadowSpread: 0
			shadowColor: "rgba(0,0,0,0.25)"

		text = new TextLayer
			parent: this
			text: @task
			fontSize: 12
			fontFamily: "Inconsolata-g"
			color: "black"

		PADDING = 15
		@width = text.width + (2 * PADDING)
		@height = text.height + (2 * PADDING)
		text.x = Align.center
		text.y = Align.center

		newWidth = @width * (1.25)
		newHeight = @height * (1.25)
		_damping = 0.19 #slider.value
		grow = new Animation this,
			width: newWidth
			height: newHeight
			x: @xInit
			y: @yInit
			options:
				curve: Spring(damping: _damping)
				time: 0.5
		grow.start()

		stay = new Animation text,
			x: ((newWidth / 2) - (text.width / 2))
			y: ((newHeight / 2) - (text.height / 2))
			options:
				curve: Spring(damping: _damping)
				time: 0.5

		stay.start()

		@draggable.enabled = true
		@draggable.momentum = false
		@onDragEnd ->
			# if @isInside(workplace) && workplace.active
			# 	@animate
			# 		x: Align.center
			# 		y: Align.center
			key = @task.toLowerCase().split(" ").join("_")
			localStorage.setItem("cardpos:#{key}", "#{@x},#{@y}")

# 		@onDoubleTap =>
# 			@destroy()

		@onLongPressEnd =>
			# return
			newWidth = @width * (1.25)
			newHeight = @height * (1.25)
			@animate
				width: newWidth
				height: newHeight
			text.animate
				x: ((newWidth / 2) - (text.width / 2))
				y: ((newHeight / 2) - (text.height / 2))
		@onTap ->
			@bringToFront()

		@onPinch ->
			return
			newWidth = @width * (1 / 1.25)
			newHeight = @height * (1 / 1.25)
			@animate
				width: newWidth
				height: newHeight
			text.animate
				x: ((newWidth / 2) - (text.width / 2))
				y: ((newHeight / 2) - (text.height / 2))
