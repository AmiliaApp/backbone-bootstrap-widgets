$(document).ready(function() {

  // Basic modal dialog
  $("#btn-1").click(function(e) {
    var modal = new Backbone.ModalView({
      body: "Hello World!"
    });
    modal.render();
  });

  // Modal with postRender
  $("#btn-2").click(function(e) {
    new Backbone.ModalView({
      postRender: function() {
        this.$body.append("<h1>Hello World!</h1>");
      }
    }).render();
  });

  // Modal dialog with custom buttons, events and postRender function
  var MyModal = Backbone.ModalView.extend({
    title: "<h3>Modal with custom buttons</h3>",
    buttons: [{
      className: "btn-primary ok",
      label: "Ok"
    }, {
      className: "btn-default cancel",
      label: "Cancel",
      close: true
    }],
    events: {
      "click .modal-footer a.ok": "onOk",
      "click .modal-footer a.cancel": "onCancel",
      "hidden.bs.modal": "onHidden"
    },
    postRender: function() {
      var $h4 = $("<h4>").text("Events"),
          $p = $("<p>").text("Use Backbone.View <code>events</code> to bind buttons. Click on the buttons and look at the console.")
      this.$body.append($h4).append($p);
      return this;
    },
    onOk: function(e) {
      e.preventDefault();
      console.log("Ok clicked");
    },
    onCancel: function(e) {
      console.log("Cancel clicked");
    },
    onHidden: function(e) {
      console.log("Modal hidden");
    }
  });
  $("#btn-3").click(function(e) {
    new MyModal().render();
  });

  $("#btn-4").click(function(e) {
    var modal = new Backbone.ModalView({
      title: "<h3>Static backdrop</h3>",
      body: "You can't close the modal on clicking on the backdrop",
      backdrop: 'static'
    });
    modal.render();
  });

  $("#btn-5").click(function(e) {
    var modal = new Backbone.ModalView({
      model: new Backbone.Model({title: "Hello", name: "Example"}),
      title: "<h3><%=title%></h3>",
      body: "Hello, <%=name%>!",
    });
    modal.render();
  });

  // Backbone.ShiftableCollection Example
  var ImageGallery = Backbone.ShiftableCollectionView.extend({
    template: _.template([
      '<div class="col-md-2 shiftable-collection-item">',
      '  <img src="<%=image%>" alt="<%=name%>" />',
      '  <br/>',
      '  <span><%=name%></span>',
      '  <a href="#" class="action delete">&times;</a>',
      '  <a href="#" class="action move-left">&#8592;</a>',
      '  <a href="#" class="action move-right">&#8594;</a>',
      '</div>'
    ].join("\n"))
  });
  var images = new Backbone.Collection([
    {name: "Mario", image: "img/mario.png"},
    {name: "Luigi", image: "img/luigi.png"},
    {name: "Princess", image: "img/princess.png"},
    {name: "Yoshi", image: "img/yoshi.png"}
  ]);
  var imageGallery = new ImageGallery({
    collection: images,
    el: $("#shiftable-collection-example")
  }).render();


  // BackBone.FormView Example
  // Person with nested address
  var person = {
    id: 101,
    salutation: "Mr",
    firstName: "Andre",
    lastName: "Jones",
    adult: true,
    address: {
      address1: "1751 rue Richardson",
      address2: "Suite 3.105",
      city: "Montréal",
      postalCode: "H3K 1G6",
      province: "QC"
    },
    dateOfBirth: "1990-10-10",
    lifeGoal: "To become the best basketball player there is. I want to dunk!"
  };
  var person = new Backbone.Model(person);
  var form = new Backbone.FormView({
    el: "#form",
    model: person,
    schema: [
    {name: "id", label: "Id", control: "uneditableInput"},
    {
      name: "salutation",
      label: "Salutation",
      control: "radioInput",
      options: [
        {label: "Mr.", value: "Mr"},
        {label: "Mrs.", value: "Mrs"},
        {label: "Mme.", value: "Mme"}
      ]
    },
    {name: "firstName", label: "First Name", control: "input"},
    {name: "lastName", label: "Last Name", control: "input"},
    {name: "adult", label: "Adult", control: "booleanInput"},
    {control: "spacer"},
    {name: "address", nested: "address1", label: "Address1", control: "input"},
    {name: "address", nested: "address2", label: "Address2", control: "input"},
    {name: "address", nested: "city", label: "City", control: "input"},
    {name: "address", nested: "postalCode", label: "Postal Code", control: "input"},
    {
      name: "address",
      nested: "province",
      label: "Province",
      control: "select",
      options: [
        {label: "Alberta", value: "AB"},
        {label: "British Columbia", value: "BC"},
        {label: "Manitoba", value: "MB"},
        {label: "New Brunswick", value: "NB"},
        {label: "Newfoundland and Labrador", value: "NL"},
        {label: "Northwest Territories", value: "NT"},
        {label: "Nova Scotia", value: "NS"},
        {label: "Nunavut", value: "NU"},
        {label: "Ontario", value: "ON"},
        {label: "Prince Edward Island", value: "PE"},
        {label: "Québec", value: "QC"},
        {label: "Saskatchewan", value: "SK"},
        {label: "Yukon", value: "YT"}
      ]
    },
    {name: "dateOfBirth", label: "Date of birth", control: "datepicker", options: {format: "yyyy-mm-dd"}},
    {name: "lifeGoal", label: "Life goal", control: "textarea"}]
  });
  form.render();

  function updateObject() {
    $("#object").text(JSON.stringify(person.toJSON(), null, 2));
  }
  person.on("change", updateObject);
  updateObject();


  // Backbone.FormView Error Validation Example
  var model = new Backbone.Model({a: 101}),
      errorModel = new Backbone.Model();
  
  var form2 = new Backbone.FormView({
    el: "#form2",
    model: model,
    errorModel: errorModel,
    schema: [{name: "a", label: "Choose a number between 10 and 20. Press Enter to submit the form.", control: "input"}]
  });
  form2.render()

  $("#form2").on("submit", function(e) {
    e.preventDefault();

    errorModel.clear();

    var number = parseFloat(model.get("a"), 10);
    if (isNaN(number))
      errorModel.set({a: "Not a number!"});
    else if (number <= 10 || number >= 20)
      errorModel.set({a: "Must be between 10 and 20"})

    return false;
  });

});
