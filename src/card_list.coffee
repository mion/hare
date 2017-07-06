Card = require './card'

exports.CardList = CardList

class CardList
	constructor: () ->
		@cards = []
	save: () ->
		console.log "saving #{@cards.length} cards..."
		card_objects = _.map @cards, (card) -> card.toObject()
		json_string = JSON.stringify(card_objects)
		localStorage.setItem('card_objects', json_string)
	restore: () ->
		return false if _.isNil(localStorage.getItem('card_objects'))
		card_objects = JSON.parse(localStorage.getItem('card_objects'))
		console.log "restoring #{card_objects.length} cards..."
		restored_cards = _.map card_objects, (obj) => new Card(obj, this)
		_.forEach restored_cards, (card) => @addCard(card)
	add: (task) ->
		card = new Card(task, this)
		@addCard(card)
	addCard: (card) ->
		@cards.push(card)
		card.onDoubleTap =>
			# @remove(card)
			card.grow()
		card.onLongPress =>
			card.shrink() unless card.draggable.isDragging
		card.onDragEnd =>
			@save()
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
