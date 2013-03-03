/*
 * Simple compass control for leaftlet maps. Using the data os giroscope.
 * Autor: Rafa Cuestas Rodíguez  -  rafa[at]puigverd.org
 * https://github.com/rafacuest
 */

Compass = L.Control.extend({
	options: {
		position: 'topright',
		icon: null
	},
	
	initialize: function (options) {
		L.setOptions(this, options);
		this._Compasss = {};
		
		if (window.DeviceOrientationEvent){
			window.addEventListener('deviceorientation', setAngleIcon, true);
			 
			function setAngleIcon(event){
				
				lCorrection = 270;
				lAngle = lCorrection - Math.round(event.alpha);
				
				compas.setAngle(lAngle);
				if( document.getElementById("debug") != null ){
					document.getElementById("debug").innerHTML = "Alpha is:"+event.alpha + "<br />Angle is:"+lAngle;
					}
				}
			
			} else {
				if( document.getElementById("debug") != null ){
					document.getElementById("debug").innerHTML = "The device dosen't have a gyroscope";
					}
			}
	},
	
	onAdd: function (map) {
		this._container = L.DomUtil.create('div', 'compass');
		L.DomEvent.disableClickPropagation(this._container);
	
		map
			.on('layeradd', this._onLayerAdd, this)
			.on('layerremove', this._onLayerRemove, this);
	
		this._update();
	
		return this._container;
	},
	
	onRemove: function (map) {
		map
			.off('layeradd', this._onLayerAdd)
			.off('layerremove', this._onLayerRemove);
	},
	
	setAngle: function ( lAngle ) {
		this._update( lAngle );
		return this;
	},
	
	_update: function ( lAngle ) {
		if (!this._map) { return; }
	
		var attribs = [];
	
		for (var i in this._Compasss) {
			if (this._Compasss.hasOwnProperty(i) && this._Compasss[i]) {
				attribs.push(i);
			}
		}
	
		var prefixAndAttribs = [];
	
		if (this.options.prefix) {
			prefixAndAttribs.push(this.options.prefix);
		}
		if (attribs.length) {
			prefixAndAttribs.push(attribs.join(', '));
		}
		//
		this._container.style.transformOrigin='50% 50%';
		this._container.style.msTransformOrigin='50% 50%';
		this._container.style.webkitTransformOrigin='50% 50%';
		this._container.style.MozTransformOrigin='50% 50%';
		this._container.style.OTransformOrigin='50% 50%';
		
		this._container.style.WebkitTransform =  ' rotate(' + lAngle + 'deg)';
		this._container.style.MozTransform = 'rotate(' + lAngle + 'deg)';
		this._container.style.MsTransform = 'rotate(' + lAngle + 'deg)';
		this._container.style.OTransform = 'rotate(' + lAngle + 'deg)';
		
		if( this.options.icon != null ){
			this._container.innerHTML = "<img src='"+this.options.icon+"' />";
		}
		else{
			this._container.innerHTML = "↑";
		}
		
		
	},
	
	
	_onLayerAdd: function (e) {
		if (e.layer.getCompass) {
			this.addCompass(e.layer.getCompass());
		}
	},
	
	_onLayerRemove: function (e) {
		if (e.layer.getCompass) {
			this.removeCompass(e.layer.getCompass());
		}
	}
});
