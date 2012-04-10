var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.core.TextElement",
        ["js.core.Element", "js.core.Binding"], function (Element, Binding) {

            return Element.inherit({
                _initializeBindings: function () {
                    this.$textBindings = {};
                    var textContent = this._getTextContentFromDescriptor(this.$descriptor);
                    // find bindings and register for onchange event
                    var key, binding;

                    var bindingDefs = Binding.findBindingDefinitions(textContent);
                    for(var i = 0 ; i < bindingDefs.length ; i++){
                        key = bindingDefs[i];
                        binding = Binding.create(key, this, key);
                        if (binding) {
                            this.$textBindings[key] = binding;
                            this.$[key] = this.$textBindings[key].getValue();
                        } else {
                            throw "could not create binding for " + key;
                        }
                    }
                },
                render: function () {
                    if (!this.$initialized) {
                        this._initialize(this.$creationPolicy);
                    }

                    this.$el = rAppid.document.createTextNode("");
                    if (this.$descriptor) {
                        this._renderTextContent(this._getTextContentFromDescriptor(this.$descriptor));
                    }

                    return this.$el;
                },
                _renderTextContent: function (textContent) {
                    for(var key in this.$textBindings){

                        if(this.$textBindings.hasOwnProperty(key)){
                            var val = this.$textBindings[key].getValue();
                            if(rAppid._.isUndefined(val) || val == null){
                                val = "";
                            }
                            textContent = textContent.split(key).join(val);
                        }
                    }
                    this.$el.data = textContent;

                },
                _commitChangedAttributes: function () {
                    if (this.$el && this.$descriptor) {
                        this._renderTextContent(this._getTextContentFromDescriptor(this.$descriptor));
                    }
                }
            });
        }
    );
});