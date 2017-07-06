exports.Card = Card

class Card extends Layer
	GROW_FACTOR: 1.25
	MAX_SIZE: 13
	MIN_SIZE: 1
	isInside: (layer) ->
		(@x > layer.x) && (@x < layer.x + layer.width) && (@y > layer.y) && (@y < layer.y + layer.height)
	constructor: (@task, @delegate) ->
		# key = @task.toLowerCase().split(" ").join("_")
		# pos_str = localStorage.getItem("cardpos:#{key}")
		# if pos_str != null
		if typeof @task == 'object'
			@xInit = @task.x #parseInt(pos_str.split(",")[0])
			@yInit = @task.y #parseInt(pos_str.split(",")[1])
			@task = @task.text
			# @pointsEstimate = @task.size || @MIN_SIZE
		else
			@xInit = (Canvas.width / 2)
			@yInit = (Canvas.height / 2)
		@pointsEstimate = Card::MIN_SIZE
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

		@text = text

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

		# foobar = new TextLayer
		# text: "Hello"
		# fontSize: 32

  	# @pointsEstimateLabel = new TextLayer
		# 	parent: this
		# 	fontSize: 16
		# 	text: "#{@pointsEstimate} pt."

		# event_types = [
		# 	Events.Tap,
		# 	Events.DoubleTap,
		# 	Events.LongPress,
		# 	Events.Move,
		# 	Events.DragStart,
		# 	Events.Drag,
		# 	Events.DragEnd
		# ]
		#
		# for event_type in event_types
		# 	@on event_type, (event) =>
		# 		console.log(this, event_type, @delegate)
		# 		if !_.isNil(@delegate) && !_.isNil(@delegate["onCardEvent"])
		# 			@delegate.onCardEvent(this, event_type, event)

		# @onDragEnd ->
			# if @isInside(workplace) && workplace.active
			# 	@animate
			# 		x: Align.center
			# 		y: Align.center
			# key = @task.toLowerCase().split(" ").join("_")
			# localStorage.setItem("cardpos:#{key}", "#{@x},#{@y}")

	toObject: () ->
		{text: @task, x: @x, y: @y}

	grow: () ->
		if @pointsEstimate == Card::MAX_SIZE
			return @pointsEstimate
		newWidth = @width * (Card::GROW_FACTOR)
		newHeight = @height * (Card::GROW_FACTOR)
		@animate
			width: newWidth
			height: newHeight
		@text.animate
			x: ((newWidth / 2) - (@text.width / 2))
			y: ((newHeight / 2) - (@text.height / 2))
		if @pointsEstimate == 1
			@pointsEstimate = 2
		else if @pointsEstimate == 2
			@pointsEstimate = 3
		else if @pointsEstimate == 3
			@pointsEstimate = 5
		else if @pointsEstimate == 5
			@pointsEstimate = 8
		else if @pointsEstimate == 8
			@pointsEstimate = @MAX_SIZE
		return @pointsEstimate

	shrink: () ->
		if @pointsEstimate == Card::MIN_SIZE
			return @pointsEstimate
		newWidth = @width * (1 / Card::GROW_FACTOR)
		newHeight = @height * (1 / Card::GROW_FACTOR)
		@animate
			width: newWidth
			height: newHeight
		@text.animate
			x: ((newWidth / 2) - (@text.width / 2))
			y: ((newHeight / 2) - (@text.height / 2))
		if @pointsEstimate == 2
			@pointsEstimate = @MIN_SIZE
		else if @pointsEstimate == 3
			@pointsEstimate = 2
		else if @pointsEstimate == 5
			@pointsEstimate = 3
		else if @pointsEstimate == 8
			@pointsEstimate = 5
		else if @pointsEstimate == 13
			@pointsEstimate = 8
		return @pointsEstimate
