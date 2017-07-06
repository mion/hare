exports.Button = Button

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
