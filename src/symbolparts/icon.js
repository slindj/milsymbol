//Icon ##################################################################################
var ms = require('../ms.js');

module.exports = function icon(){
	var drawArray1 = [];
	var drawArray2 = [];
	var gbbox = new ms.BBox({x1:50,x2:150,y1:50,y2:150});
	var icons;
	
	//This is the building blocks we use to create icons
	var iconParts = [];
	//Main icon
	var icon = [];
	//Modifier 1 used in number based SIDCs
	var m1 = [];
	//Modifier 2 used in number based SIDCs
	var m2 = [];
	//Boundingboxes other than normal
	var specialbbox = [];

	if(this.icon){
		var fillColor = this.colors.fillColor[this.properties.affiliation];
		//So we don't happend to use civilian colors
		var neutralColor = this.colors.fillColor.Neutral;
		var iconColor = this.colors.iconColor[this.properties.affiliation];
		var iconFillColor = this.colors.iconFillColor[this.properties.affiliation];
		var none = this.colors.none[this.properties.affiliation];
		var black = this.colors.black[this.properties.affiliation];
		var white = this.colors.white[this.properties.affiliation];
		//Store previous used icons in memory.
		var icnet = (ms._STD2525?"2525":"APP6")+","+this.properties.dimension+this.properties.affiliation+this.properties.notpresent+',frame:'+this.frame+',alternateMedal:'+this.alternateMedal+',colors:{fillcolor:'+fillColor+',neutralColor'+neutralColor+',iconColor:'+iconColor+',iconFillColor:'+iconFillColor+',none:'+none+',black:'+black+',white:'+white+"}";
		if(ms._iconCache.hasOwnProperty(icnet)){
			iconParts = ms._iconCache[icnet].iconParts;
		}else{
			ms._iconCache[icnet] = {};
			iconParts = ms._iconCache[icnet].iconParts = ms._geticnParts(this.properties, this.colors, ms._STD2525, this.monoColor, this.alternateMedal);
		}

		//Letter based SIDCs.
		if(!this.properties.numberSIDC){
			//Sea mine exercise has stuff outsIde the boundingbox...
			//TODO see if we can fix this in another way.
			if(["WMGX--","WMMX--","WMFX--","WMX---","WMSX--"].indexOf(this.properties.functionid)!=-1){
				gbbox.y1 = 10;
				if(this.properties.affiliation != "Unknown"){gbbox.x2 = this.properties.baseGeometry.bbox.x2+20;}
			}

			//Try to fetch the icons form the cache
			if( ms._iconCache[icnet].hasOwnProperty('letterSIDC')){
				icons = ms._iconCache[icnet].letterSIDC.icons;
				specialbbox  = ms._iconCache[icnet].letterSIDC.bbox;
			}else{
				if (typeof ms._getLetterSIDCicn === 'function') {
					ms._iconCache[icnet].letterSIDC = ms._getLetterSIDCicn(iconParts,ms._STD2525);
					icons = ms._iconCache[icnet].letterSIDC.icons;
					specialbbox  = ms._iconCache[icnet].letterSIDC.bbox;
					//THIS IS JUST FOR Printing bottom coords of all equipment ===========================
		/*			This code dosen't work at the moment..... TODO
					if(element){
					listBBoxes = '';
					for (var property in sId) {
						if(property.substr(4,1) == 'E'){
							var BaseGeometry = document.createElementNS(ms._svgNS, "g");
							BaseGeometry.setAttribute('id', 'BaseGeometryEquipment');
								BaseGeometry.appendChild(
									BaseGeometry.ownerDocument.importNode(
										parseXML(
											'<g xmlns="'+ms._svgNS+'">' + sId[property] + '</g>'
										), true
									)
								);
							var svgSymbol = document.createElementNS(ms._svgNS, "svg");
							svgSymbol.setAttribute("width", 200);
							svgSymbol.setAttribute("height", 200);
							svgSymbol.setAttribute("version", 1.1);
							svgSymbol.setAttribute("baseProfile", "tiny");
							svgSymbol.setAttribute("xmlns", ms._svgNS);
							svgSymbol.appendChild(BaseGeometry);

							var targetElement = document.getElementById(element);
							if(targetElement.hasChildNodes()){
								targetElement.removeChild(targetElement.childNodes[0])
							}
							targetElement.appendChild(svgSymbol);
							var BBox = document.getElementById("BaseGeometryEquipment").getBBox()
							listBBoxes += '\'' + property.substr(4,6) + '\':' + (BBox.y+ BBox.height)+',';
						}
						}
					document.getElementById(element).innerHTML=listBBoxes;
				}
		*/
				}else{
					console.warn("ms._getLetterSIDCicn() is not present, you will need to load functionality for letter based SIDCs");
				}
			}
		}

		//Number based SIDCs.
		if(this.properties.numberSIDC){ //Number based SIDCs.
			var symbolSet = String(this.SIDC).substr(4,2);
			if( ms._iconCache[icnet].hasOwnProperty('numberSIDC')){
				if( ms._iconCache[icnet].numberSIDC.symbolSet.hasOwnProperty(symbolSet)){
					icons = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].icons;
					m1 = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].m1;
					m2 = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].m2;
					specialbbox = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].bbox;
				}else{
					if (typeof ms._getNumberSIDCicn === 'function') {
						ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet] = ms._getNumberSIDCicn(symbolSet,iconParts,ms._STD2525);
						icons = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].icons;
						m1 = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].m1;
						m2 = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].m2;
						specialbbox = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].bbox;
					}else{
						console.warn("ms._getNumberSIDCicn() is not present, you will need to load functionality for number based SIDCs");
					}
				}
			}else{
				ms._iconCache[icnet].numberSIDC = {};
				ms._iconCache[icnet].numberSIDC.symbolSet = {};
				if (typeof ms._getNumberSIDCicn === 'function') {
					ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet] = ms._getNumberSIDCicn(symbolSet,iconParts,ms._STD2525);
					icons = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].icons;
					m1 = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].m1;
					m2 = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].m2;
					specialbbox = ms._iconCache[icnet].numberSIDC.symbolSet[symbolSet].bbox;
					//for printing equipment bottom  set ms._element to the id of an html element and call milsymbol with an equipment sysbol
					/*
					if(ms._element){
					listBBoxes = '';
					sId = ms._iconCache[icnet].numberSIDC.symbolSet[15].icn;
					for (var property in sId) {
					console.log(property)
							var BaseGeometry = document.createElementNS("http://www.w3.org/2000/svg", "g");
							BaseGeometry.setAttribute('id', 'BaseGeometryEquipment');
								BaseGeometry.appendChild(
									BaseGeometry.ownerDocument.importNode(
										parseXML(
											'<g xmlns="'+"http://www.w3.org/2000/svg"+'">' + sId[property] + '</g>'
										), true
									)
								);
							var svgSymbol = document.createElementNS("http://www.w3.org/2000/svg", "svg");
							svgSymbol.setAttribute("width", 200);
							svgSymbol.setAttribute("height", 200);
							svgSymbol.setAttribute("version", 1.1);
							svgSymbol.setAttribute("baseProfile", "tiny");
							svgSymbol.setAttribute("id", property);

							svgSymbol.setAttribute("xmlns", "http://www.w3.org/2000/svg");
							svgSymbol.appendChild(BaseGeometry);

							var targetElement = document.getElementById(ms._element);
							if(targetElement.hasChildNodes()){
								targetElement.removeChild(targetElement.childNodes[0])
							}
							targetElement.appendChild(svgSymbol);
							console.log(targetElement)
							var BBox = document.getElementById("BaseGeometryEquipment").getBBox()
							listBBoxes +=  property + ':' + (BBox.y+ BBox.height)+',';

						}
					document.getElementById(ms._element).innerHTML=listBBoxes;
					}*/
				}else{
					console.warn("ms._getNumberSIDCicn() is not present, you will need to load functionality for number based SIDCs");
				}
			}
		}

	// Put all this togheter and return the Icon. ============================================
		var iconColor = this.colors.iconColor[this.properties.affiliation];
		if(this.properties.numberSIDC){
			//Number based SIDC
			drawArray2.push(icons[this.properties.functionid.substr(0,6)]);//Main symbol
			if(!icons.hasOwnProperty(this.properties.functionid.substr(0,6))){
				//We have some sepcial entity subtype and will try to find original symbol.
				drawArray2.push(icons[this.properties.functionid.substr(0,4)+'00']);
			}
			if(specialbbox.hasOwnProperty(this.properties.functionid.substr(0,6))){
				gbbox = new ms.BBox(specialbbox[this.properties.functionid.substr(0,6)]);
			}
			if(this.properties.functionid.substr(4,2) == '95')drawArray2.push(iconParts['GR.IC.FF.HEADQUARTERS OR HEADQUARTERS ELEMENT']);
			if(this.properties.functionid.substr(4,2) == '96')drawArray2.push(iconParts['GR.IC.FF.DIVISION AND BELOW SUPPORT']);
			if(this.properties.functionid.substr(4,2) == '97')drawArray2.push(iconParts['GR.IC.FF.CORPS SUPPORT']);
			if(this.properties.functionid.substr(4,2) == '98')drawArray2.push(iconParts['GR.IC.FF.THEATRE SUPPORT']);
			//Modifier 1
			drawArray2.push(this.properties.functionid.substr(6,2)!='00'?m1[this.properties.functionid.substr(6,2)]:[]);
			//Modifier 2
			drawArray2.push(this.properties.functionid.substr(8,2)!='00'?m2[this.properties.functionid.substr(8,2)]:[]);
		}else{
			//Letter based SIDC
			var genericSIDC = this.SIDC.substr(0,1)+'-'+this.SIDC.substr(2,1)+'-'+this.SIDC.substr(4,6);
			if(icons[genericSIDC]){
				drawArray2.push(icons[genericSIDC]);
			}
			if(specialbbox[genericSIDC]){
				gbbox = new ms.BBox(specialbbox[genericSIDC]);
			}
		}
	}
	//outline
	if(!(this.frame && this.fill) || this.monoColor){
		if (this.outlineWidth > 0) drawArray1.push(ms.outline(drawArray2, this.outlineWidth, this.strokeWidth, this.outlineColor));
	}
	return {pre: drawArray1, post: drawArray2, bbox: gbbox};
}