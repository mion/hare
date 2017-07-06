exports.Workplace = Workplace

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
