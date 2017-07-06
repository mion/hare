# Disable annoying highlighted layers
Framer.Extras.Hints.disable()

clusterMaker = require "clusters"
Button = require './button'
CardList = require './card_list'

tasksQueue = []
console.log(JSON)

bug = (things) ->
	_.forEach things, (thing) -> console.log(thing)

######################################################
# main
######################################################
addButton = new Button("plus")
clusterButton = new Button("box", addButton)
cardList = new CardList()
cardList.restore()

addButton.onTap ->
	task = if _.isEmpty(tasksQueue)
		prompt("What's the task?")
	else
		tasksQueue.pop()
	if task != null
		cardList.add(task)

# clusterButton.onTap ->
# 	cardList.cluster()


leftmost = (layers) ->
	_.head(_.sortBy(layers, (l) -> l.x))
