exports.ExplorationSlider = ExplorationSlider

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
