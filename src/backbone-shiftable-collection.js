/*
  Backbone ModalView
  http://github.com/amiliaapp/backbone-bootstrap-widgets

  Copyright (c) 2014 Amilia Inc.
  Written by Martin Drapeau
  Licensed under the MIT @license
 */
(function(){

	// Backbone Shiftable Collection View
	// Renders a collection and adds action buttons:
	//  - delete: To remove a model
	//  - move-left: To shift a model left
	//  - move-right: To shift a model right
	// Also allows the user to single-select a model. When a model is selected,
	// the action butons appear. Otherwise, they only appear on hover.
	// To use, subclass to provide your own template.

	Backbone.ShiftableCollectionView = Backbone.View.extend({
        className: "shiftable-collection",
        template: _.template([
            '<div class="shiftable-collection-item">',
            '	<div>Model <%=__index%></div>',
            '   <a href="#" class="action delete">&times;</a>',
            '   <a href="#" class="action move-left">&#8592;</a>',
            '   <a href="#" class="action move-right">&#8594;</a>',
            '</div>'
        ].join("\n")),
        events: {
            "click .shiftable-collection-item": "onClick",
            "click .delete": "onDelete",
            "click .move-left": "onMoveLeft",
            "click .move-right": "onMoveRight"
        },
        initialize: function(options) {
        	this.listenTo(this.collection, "add remove reset", this.render);
        },
        render: function() {
            var $items = this.$el,
                template = this.template;
            $items.empty();
            this.collection.each(function(model, index) {
                var $item = template(_.extend({__index: index}, model.toJSON()));
                $items.append($item);
            });
            return this;
        },
        select: function(model) {
            var index = this.collection.indexOf(model);
            if (index < 0 || index >= this.collection.size()) return this;
            this.$el.find(".shiftable-collection-item")
                .removeClass("selected")
                .eq(index).addClass("selected");
            return this;
        },
        onClick: function(e) {
            this.$el.find(".shiftable-collection-item").removeClass("selected");
            $(e.currentTarget).addClass("selected");
        },
        onDelete: function(e) {
            e.preventDefault();
            var model = this._getModelFromEvent(e);

            this.collection.remove(model);

            return false;
        },
        onMoveLeft: function(e) {
            e.preventDefault();
            var model = this._getModelFromEvent(e),
                index = this.collection.indexOf(model);

            if (index == 0) return;

            this.collection.remove(model, {silent: true});
            this.collection.add(model, {at: index-1});

            return false;
        },
        onMoveRight: function(e) {
            e.preventDefault();
            var model = this._getModelFromEvent(e),
                index = this.collection.indexOf(model);

            if (index >= this.collection.size()-1) return;

            this.collection.remove(model, {silent: true});
            this.collection.add(model, {at: index+1});

            return false;
        },
        _getModelFromEvent: function(e) {
        	var $item = $(e.currentTarget).closest(".shiftable-collection-item"),
        		index = this.$el.find(".shiftable-collection-item").index($item),
        		model = this.collection.at(index);
        	return model;  
        }
	});

}).call(this);
