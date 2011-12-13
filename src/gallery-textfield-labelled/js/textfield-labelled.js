var Lang = Y.Lang,
  Widget = Y.Widget,
  Node = Y.Node;

/* TextfieldLabelled class constructor */
function TextfieldLabelled (config) {
  TextfieldLabelled.superclass.constructor.apply(this, arguments);
}

/*
 * Required NAME static field, to identify the Widget class and
 * used as an event prefix, to generate class names etc.
 * TODO: Check if camel case is essential as it creates inconsistancy
 * between the bound/content box class names (lcase) and all others (ccase).
 */
TextfieldLabelled.NAME = "textfieldlabelled";

/*
 * The attribute configuration for the TextfieldLabelled widget. Attributes can be
 * defined with default values, get/set functions and validator functions
 * as with any other class extending Base.
 */
TextfieldLabelled.ATTRS = {
  // The current value of the textfieldLabelled.
  // TODO: Is validation on non-user fields necessary?
  // TODO: Am I treating the id correctly? (wot if there is no id in the markup??)
  value: { value:'', validator: Lang.isString },
  type: { value:'text', validator: Lang.isString },
  srcNodeid: {value:'', validator: Lang.isString },
  label: { value: '', validator: Lang.isString }
};

/* Static constant used to identify the classname applied to the textfieldLabelleds value field */
TextfieldLabelled.TEXTF_CLASS=Y.ClassNameManager.getClassName(TextfieldLabelled.NAME,"textf");
TextfieldLabelled.LABEL_CLASS=Y.ClassNameManager.getClassName(TextfieldLabelled.NAME,"label");


/*
 * The HTML_PARSER static constant is used by the Widget base class to populate
 * the configuration for the textfieldLabelled instance from markup already on the page.
 *
 * The TextfieldLabelled class attempts to set the value of the textfieldLabelled widget if it
 * finds the appropriate input element on the page.
 */
TextfieldLabelled.HTML_PARSER = {
  value: function (srcNode) { return srcNode.get("value"); },
  type: function (srcNode){ return srcNode.get("type"); },
  srcNodeid: function (srcNode){ return srcNode.get("id"); }
};

/* TextfieldLabelled extends the base Widget class */
Y.extend(TextfieldLabelled, Widget, {

  /*
   * initializer is part of the lifecycle introduced by
   * the Widget class. It is invoked during construction,
   * and can be used to setup instance specific state.
   *
   * The TextfieldLabelled class does not need to perform anything
   * specific in this method, but it is left in as an example.
   */
  initializer: function() {
    //    TextfieldLabelled.superclass.initializer.apply(this,arguments);
    // Not doing anything special during initialization
  },

  /*
   * destructor is part of the lifecycle introduced by
   * the Widget class. It is invoked during destruction,
   * and can be used to cleanup instance specific state.
   *
   * The textfieldLabelled cleans up any node references it's holding
   * onto. The Widget classes destructor will purge the
   * widget's bounding box of event listeners, so textfieldLabelled
   * only needs to clean up listeners it attaches outside of
   * the bounding box.
   */
  destructor : function() {
    this.inputNode = null;
    this.labelNode = null;
  },

  /*
   * renderUI
   * Creates inputNode (the textfield) and labelNode (the label overlay)
   * Resizes the contentBox to the size of thte inputNode.
   */
  renderUI : function() {
    var contentBox = this.get("contentBox");

    var label = Node.create(
      '<label for="'+this.get('srcNodeid')+'" class="'+TextfieldLabelled.LABEL_CLASS+'" unselectable="on">'+this.get('label')+'</label>'
    );
    contentBox.appendChild(label);

    var input = contentBox.one("." + TextfieldLabelled.TEXTF_CLASS); // TODO: Check why this would ever exist on render?
    if (!input) {
      input = Node.create(
        '<input id="'+this.get('srcNodeid')+'" type="'+this.get('type')+'" title="'+this.get('label')+'" class="'+TextfieldLabelled.TEXTF_CLASS+'" />'
      );
      contentBox.appendChild(input);
    }

    contentBox.setStyle("width", input.getStyle("width"));
    contentBox.setStyle("height", input.getStyle("height"));
    this.inputNode = input;
    this.labelNode = label;
  },

  /*
   * bindUI
   *
   * * labelNode & contentBox
   *   - Bind focus to relay focus to textbox (as it has a higher z-index)
   * * inputNode
   *   - 'blur' - if no content -> redisplay label
   *   - 'keypres/keydown' - remove label
   */
  bindUI : function() {
    var keyeventname = (Y.UA.webkit || Y.UA.ie)? 'keydown':'keypress';

    this.inputNode.on(keyeventname, function(){
      this.labelNode.addClass('withcontent');
    }, this );

    this.inputNode.on("blur", function(){
      if (this.inputNode.get('value')==""){
        this.labelNode.removeClass('withcontent');
      }
    }, this);

    this.labelNode.on("focus", function(){
      this.inputNode.focus();
    }, this);
    this.get('contentBox').on("focus",function(){
      this.inputNode.focus();
    }, this);
  },

  /*
   * syncUI is intended to be used by the Widget subclass to
   * update the UI to reflect the current state of the widget.
   *
   * For textfieldLabelled, the method sets the value of the input field,
   */
  syncUI : function() {
    this.inputNode.set("value", this.get("value"));
    if (this.get('value')==""){
      this.labelNode.removeClass('withcontent');
    } else {
      this.labelNode.addClass('withcontent');
    }
  },

  /*
   * Override the default content box value, since we don't want the srcNode
   * to be the content box for textfieldLabelled.
   */
  _defaultCB : function() {
    return null;
  }
});

