(function ($){
    
    'use strict';
    $.fn.model = function(opt, params) {
        
        if (!$(this).data("self")) {
            
            self = {
                
                options: {},
                
                _init: function(elm) {
                    
                    self.options = $.extend(self.options, opt);
                    self.element = $(elm);
                    self._create();
                },
                
                _create: function() {
                    
                    self.viewport = `
                        <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
                            <div class="col-7 border">
                                <div class="row py-3">
                                    <div class="col">
                                        <div id="render" style="width: 100%; height: 500px;"></div>
                                    </div>
                                </div>
                                <div class="row pb-3">
                                    <div class="col">
                                        <button id="gbutton" class="btn btn-primary btn-block">Сгенерировать</button>
                                    </div>
                                    <div class="col">
                                        <input id="npoints" type="text" class="form-control">
                                    </div>
                                    <div class="col">
                                        <button id="cbutton" class="btn btn-success btn-block">Кластеризовать</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                    self.element.append(self.viewport);

                    self.canvas = self.element.find(('#render')).canvas();
                    self.gbutton  = self.element.find("#gbutton").click(self._generate);
                    self.npoints = self.element.find("#npoints");
                    self.cbutton = self.element.find("#cbutton").click(self._clast);
                },
                
                _error: function(message) {
                    
                    alert(message);
                },

                _generate: function() {
                    
                    self.canvas.canvas("generate",npoints.value);
                },

                _clast: function() {

                    self.canvas.canvas("clast");
                }
            }
            
            self._init(this);
            self.element.data("self", self);
        }
        else {
            
            var self = $(this).data("self");
             
            if ((typeof opt == 'string' || opt instanceof String) && opt.substring(0,1) != "_") {
                return self[opt](params);
            }
            else {
                console.log("can't call private method" + opt);
            }
            
        }
    };
    
    $('#main').model();
    
})(jQuery);