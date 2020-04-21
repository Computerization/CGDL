//Contributors: Twilight
//2D Game Design Library PROTOTYPE
"use strict"

var timer = null;

class CGDL {
    /*
	#canvas;
	#context;
    */
	constructor() {
		this.canvas=document.getElementById("cgdl-canvas");
		if(this.canvas.getContext){
			this.context=this.canvas.getContext("2d");
		}
	}
    /*
	get canvas() {
		return this.#canvas;
	}

	get context() {
		return this.#context;
	}
	*/
}

class CGDLSystem {
    /*
	#id;
	#type;
	#context;
    */
	constructor(id, type, context) {
		this.id = id;
		this.type = type;
		this.context = context;
	}
    /*
	get id() {
		return this.#id;
	}

	get type() {
		return this.#type;
	}

	get context() {
		return this.#context;
	}
	*/
}

class Texture extends CGDLSystem {
	/*
	#src;
	#img;
	#height;
	#width;
	*/
	constructor(id, context, src) {
		super(id, 0, context);
		this.src = src;
	}

	setHeight(h) {
		this.height = h;
	}

	setWidth(w) {
		this.width = w;
	}

	show() {
		var body = document.getElementById("bd");
		body.innerHTML = body.innerHTML + "<div height='0' width='0'>" + "<img src='" + this.src + "' id='new_img' height='50' width='50'/></div>";
		var img = document.getElementById("new_img");
		console.log(img);
		var height = this.height;
		var width = this.width;
		var context = this.context;
		context.drawImage(img, height, width);
		/*
		dom.onload = function() {
			console.log("onload");
			console.log(dom);
			context.drawImage(dom, height, width);
			console.log("Drawn");
		}
		*/
	}

}

class Geometric extends CGDLSystem {

	constructor(id, context) {
		super(id, 1, context);
	}

}

class Actor extends CGDLSystem {
    /*
	static APPEARANCE_TEXTURE = 0;
	static APPEARANCE_GEOMETRIC = 1;
	#appearanceType = undefined;
    */
	constructor(id, context, appearanceType) {
		super(id, 2, context);
		this.appearanceType = appearanceType;
		this.APPEARANCE_TEXTURE = 0;
		this.APPEARANCE_GEOMETRIC = 1;
	}

	bindTexture(textureData) {
		if (this.appearanceType != this.APPEARANCE_TEXTURE) {
			throw "CGDLError : Apperance Type does not match with this method.";
		}

	}
	
	bindGeometric(geometricData) {
		if (this.appearanceType != this.APPEARANCE_GEOMETRIC) {
			throw "CGDLError : Apperance Type does not match with this method.";
		}
	}
}
