(function ($){
    
    $.fn.canvas = function(opt, params) {
        
        if (!$(this).data("self")) {
            
            self = {
                
                options: {
                    
                    serverAddr: "http://localhost:5900",
                    radiusPoint: 5,
                    colorPointDefault: "blue",
                    sizeCenterGravity: 20,
                    strokeWidth: 2
                },
                
                _init: function(elm) {
                    
                    self.options = $.extend(self.options, opt);
                    self.element = $(elm);
                    self._create();
                },
                
                _create: function() {

                    self.canvas = $('<canvas></canvas>')
                    .attr('style','border: 1px solid black')
                    .click(self._createCenterGravity)
                    .appendTo(self.element);

                    self.ctx = self.canvas[0].getContext('2d');
                    
                    $(window).resize(resizeWindow);
                    
                    function resizeWindow(){
                    
                        self.canvas.attr({
                            width: self.canvas[0].parentElement.clientWidth,
                            height: self.canvas[0].parentElement.clientHeight
                        });
                        //self._draw();
                    }

                    resizeWindow();

                    self.counterCenterGravity = 1;
                    self.arrayCenterGravity = [];
                    self.arrayClasters = [];
                },
                
                _error: function(message) {
                    
                    alert("Error: " + message);
                    
                },

                _createCenterGravity: function(e) {

                    if (self.npoints) {

                        if (self.counterCenterGravity < self.npoints) {
                            
                            var sizeRect = self.options.sizeCenterGravity;
                            var x = e.offsetX-sizeRect/2;
                            var y = e.offsetY-sizeRect/2;
                            var color = 'rgb(' + 
                                        self._getRandomInt(255) + ',' + 
                                        self._getRandomInt(255) + ',' + 
                                        self._getRandomInt(255) + ')';
                            self.arrayCenterGravity.push({ "x": x, "y": y, "color": color , "points": []});
                            self.drawRect(x,y,sizeRect,color);
                            self.counterCenterGravity++;

                        }
                        else {
                            
                            self._error("Превышено число точек тяжести");
                            return;
                        }
                    }                                            
                    else{
                        
                        self._error("Точки не сгенерированны");
                    }
                },

                _getRandomInt: function (max) {
                    return Math.floor(Math.random() * (max + 1));
                },

                _draw: function() {

                    self.counterCenterGravity = 1;

                    self.ctx.clearRect(0,0,self.canvas.width(),self.canvas.height());
                   
                    if (self.arrayClasters.length) {

                        $.each(self.arrayClasters, function(index, claster){
                            self.drawRect(claster.x, claster.y, self.options.sizeCenterGravity, claster.color);
                            $.each(claster.points, function(index, point){
                                var temp_xy = self.options.sizeCenterGravity/2;
                                self.drawStroke(claster.x + temp_xy, claster.y + temp_xy, point.x, point.y, claster.color);
                                self.drawPoint(point.x, point.y, self.options.radiusPoint, claster.color); 
                            });
                        });
                    }
                    else {
                        
                        $.each(self.arrayPoints, function(index, value){
                            self.drawPoint(value.x, value.y, self.options.radiusPoint, self.options.colorPointDefault);
                        });
                    }
                    
                },

                _compare: function(obj1, obj2) {
                    return JSON.stringify(obj1) === JSON.stringify(obj2);
                },

                generate: function(npoints) {

                    if (npoints) {
                        
                        self.npoints = npoints;

                        data = JSON.stringify({
                            "npoints": npoints,
                            "width_canvas": Math.floor(self.canvas.width()),
                            "height_canvas": Math.floor(self.canvas.height()),
                            "radiusPoint": self.options.radiusPoint
                        });
    
                        $.ajax({
                            type: 'POST',
                            url: self.options.serverAddr + "/generate",
                            data: {"data": data},
                            dataType: 'json'
                        }).done(function(response){
                           
                            if (response instanceof Array) {
                                
                                self.arrayPoints = response;
                                self.arrayClasters = [];
                                self.arrayCenterGravity = [];
                                self._draw();
                            }    
                            
                        }).fail(function(err){
                            self._error(err);
                        });
                    }
                    else {
                        self._error("Поле количества точек пусто");
                    }                       
                },
                
                clast: function() {
                    
                    if (typeof(self.arrayPoints) == "undefined") {
                        self._error("Точки не сгенерированы");
                    }

                    if (!self.arrayCenterGravity.length) {
                        
                        self._error("Отсутствуют центры тяжести");
                    }
                    
                    if (self.arrayCenterGravity.length && self.arrayPoints.length) {
                        
                        if (typeof(this.data_send) === 'undefined'){
                            this.defaultData = {
                                "arrayPoints": self.arrayPoints,
                                "arrayClasters": self.arrayCenterGravity
                            };
                        }

                        self.sendData(this.defaultData);
                    }                  
                },

                sendData: function(dataObj) {
                    
                    if (typeof(this.lastObj) === 'undefined'){
                        this.lastObj = {};
                    }
 
                    if (!self._compare(this.lastObj, dataObj)) {
                        
                        for (var key in dataObj) {
                            this.lastObj[key] = dataObj[key];
                        }
                        
                        $.ajax({
                            type: 'POST',
                            url: self.options.serverAddr + "/clast",
                            data: {"data": JSON.stringify(dataObj)},
                            dataType: 'json'
                        }).done(function(response){
                            dataObj.arrayClasters = response;
                            self.arrayClasters = dataObj.arrayClasters;
                            self._draw();
                            self.sendData(dataObj);
                        }).fail(function(error){
                            self._error(error);
                        });
                        
                    }
                    else {
                        console.log("compare");
                        this.lastObj = undefined;
                        return;
                    }
                    
                },

                drawPoint: function(x,y,r,color) {

                    self.ctx.beginPath();
                    self.ctx.fillStyle = color;
                    self.ctx.arc(x,y,r,2 * Math.PI,false);
                    self.ctx.fill();
                    self.ctx.closePath();
                },
                
                drawRect: function(x,y,sizeSide,color) {
                    
                    self.ctx.beginPath();
                    self.ctx.fillStyle = color;
                    self.ctx.rect(x, y, sizeSide, sizeSide);
                    self.ctx.fill();
                    self.ctx.closePath();
                    
                },

                drawStroke: function(x1,y1,x2,y2,color) {
                    
                    self.ctx.beginPath();
                    self.ctx.strokeStyle = color;
                    self.ctx.lineWidth = self.options.strokeWidth;
                    self.ctx.moveTo(x1,y1);
                    self.ctx.lineTo(x2,y2);
                    self.ctx.stroke();
                    self.ctx.closePath();
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
        
        return self.element;
    };
    
})(jQuery);