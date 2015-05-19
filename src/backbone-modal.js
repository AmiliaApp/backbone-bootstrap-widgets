/*
  Backbone ModalView
  http://github.com/amiliaapp/backbone-bootstrap-widgets

  Copyright (c) 2014 Amilia Inc.
  Written by Martin Drapeau
  Licensed under the MIT @license
 */
(function(){

  Backbone.ModalView = Backbone.View.extend({
    className: "modal backbone-modal",
    template: _.template([
      '<div class="modal-dialog">',
      '  <div class="modal-content">',
      '    <div class="modal-header">',
      '      <a type="button" class="close" aria-hidden="true">&times;</a>',
      '      <%=title%>',
      '    </div>',
      '    <div class="modal-body"><%=body%></div>',
      '    <div class="modal-footer">',
      '    </div>',
      '  </div>',
      '</div>',
    ].join("\n")),
    buttonTemplate: _.template('<a href="<%=href%>" class="btn <%=className%>"><%=label%></a>'),
    buttonDefaults: {
      className: "",
      href: "#",
      label: "",
      close: false
    },
    defaults: {
      title: "<h3>Info</h3>",
      backdrop: true,
      body: "",
      buttons: [{
        className: "btn-primary",
        href: "#",
        label: "Close",
        close: true
      }],
      postRender: function() {
        return this;
      }
    },
    initialize: function(options) {
      options || (options = {});
      _.defaults(this, this.defaults);
      _.extend(this, _.pick(options, _.keys(this.defaults)));
      _.bindAll(this, "close");
    },
    render: function() {
      var data = this.model ? this.model.toJSON() : {};

      var view = this;

      this.$el.html(this.template({
        title: _.template(this.title)(data),
        body: _.template(this.body)(data)
      }));

      this.$header = this.$el.find('.modal-header');
      this.$body = this.$el.find('.modal-body');
      this.$footer = this.$el.find('.modal-footer');

      _.each(this.buttons, function(button) {
        _.defaults(button, view.buttonDefaults);
        var $button = $(view.buttonTemplate(button));
        view.$footer.append($button);
        if (button.close) $button.on("click", view.close);
      });

      this.$el.modal({
        keyboard: false,
        backdrop: this.backdrop
      });

      this.$header.find("a.close").click(view.close);

      if(this.backdrop === true) {
        $('.modal-backdrop').off().click(view.close);
      }

      this.postRender();

      return this;
    },
    close: function(e) {
      if (e) e.preventDefault();
      var view = this;
      this.trigger("close", this);
      setTimeout(function() {
        view.$el.modal("hide");
        view.remove();
      }, 25);
    }
  });

}).call(this);
