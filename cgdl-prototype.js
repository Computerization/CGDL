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

/*
Requirements: a canvas with id cgdl-canvas.
*/
class CGDLTextureManager{
	static UtilsLoader(){
		CGDLTextureManager.cgdl_src_list = new Array();                             //the list of the directories of the image resources
		CGDLTextureManager.cgdl_img_loaded = new Array();                           //whether the image resources have been loaded
		CGDLTextureManager.cgdl_span_load = false;                                  //whether the resource span has been loaded
		CGDLTextureManager.cgdl_span_clock = null;                                  //the clock checking the loading state of the resource span, see function @_cgdlSpanLoader()
		CGDLTextureManager.cgdl_first_init = false;                                 //whether the module has already been initialized, see function @cgdlInit( bid )
		CGDLTextureManager.cgdl_img_loading = true;                                 //whether the images have all been uploaded as resources, see function @cgdlEndAppending()
		CGDLTextureManager.cgdl_img_all_loaded = false;                             //whether the images have all finished loading
		CGDLTextureManager.cgdl_load_id = 0;                                        //the current loading image
		CGDLTextureManager.cgdl_span_clock_img_loading = true;                      //whether the images have all started loading, see function @cgdlInit( bid )
		CGDLTextureManager.cgdl_img_main_loop = null;                               //the clock controlling the canvas and all the commands, see function @cgdlInit( bid )
		CGDLTextureManager.cgdl_img_main_loop_prev_running = false;                 //whether the main-loop clock is still in running when one or several intervals have passed, it may be deprocated.
		CGDLTextureManager.cgdl_img_commands = new Array();                         //each element is an array, [img_id: int, x: int, y: int, width: int, height: int]
		CGDLTextureManager.cgdl_canvas = document.getElementById( "cgdl-canvas" );  //the dom of the canvas
	}

	/**
	  * function _cgdlRunCmd : draw the image by context @ctx as the command @cmd required to. Please do not call this function manually or something unexpected may happen.
	  * parameters: Array CanvasRenderingContext2D
	  */
	static _cgdlRunCmd( cmd, ctx ) {
	  var img_id = cmd[0];
	  var img_x = cmd[1];
	  var img_y = cmd[2];
	  var img_w = cmd[3];
	  var img_h = cmd[4];
	  var img = document.getElementById( "cgdl-resource-img-" + img_id );
	  ctx.drawImage( img, img_x, img_y, img_w, img_h );
	}

	/**
	  * function cgdlInit : load image and canvas updating loop, the main algorithm in this module.
	  * parameters: string
	  * @bid : the dom id of the body tag
	  */
	static cgdlInit( bid ) {
	  if( !CGDLTextureManager.cgdl_first_init ) {
		CGDLTextureManager.cgdl_first_init = true;
		document.getElementById( bid ).innerHTML += '<span id="cgdl-resource-span" onload="CGDLTextureManager._cgdlSpanLoader()"></span>';
		//after the span tag is loaded, the images will start loading
		CGDLTextureManager.cgdl_span_clock = setInterval( function() {
		  var flag = true;
		  var end_flag = true;
		  if( !CGDLTextureManager.cgdl_span_clock_img_loading ) {
			flag = false;
			for( var i in CGDLTextureManager.cgdl_img_loaded ) {
			  if ( CGDLTextureManager.cgdl_img_loaded[i] == false ) {
				end_flag = false;
				break;
			  }
			}
			if ( end_flag ) {
			  console.log( "images have all been loaded" );
			  clearInterval( CGDLTextureManager.cgdl_span_clock );
			}
		  }
		  if( CGDLTextureManager.cgdl_load_id >= CGDLTextureManager.cgdl_src_list.length ) {
			flag = false;
			if ( ( !CGDLTextureManager.cgdl_img_loading ) && CGDLTextureManager.cgdl_span_clock_img_loading ){
			  CGDLTextureManager.cgdl_span_clock_img_loading = false;
			  console.log( "images have all started loading" );
			  flag = false;
			}
		  }
		  if( flag ) {
			console.log( "start loading : " + CGDLTextureManager.cgdl_load_id );
			CGDLTextureManager._cgdlAppendSrc( CGDLTextureManager.cgdl_load_id );
			CGDLTextureManager.cgdl_load_id += 1;
		  }
		}, 100, 0 );
		//the main loop of the images. Each time: clear the canvas, draw images, save the canvas
		CGDLTextureManager.cgdl_img_main_loop = setInterval( function() {
		if( !CGDLTextureManager.cgdl_img_main_loop_prev_running ) {
		  CGDLTextureManager.cgdl_img_main_loop_prev_running = true;
		  var ctx = document.getElementById( "cgdl-canvas" ).getContext( "2d" );
		  ctx.save();
		  ctx.clearRect( 0, 0, CGDLTextureManager.cgdl_canvas.width, CGDLTextureManager.cgdl_canvas.height );
		  for( var i in CGDLTextureManager.cgdl_img_commands ){
			var cmd = CGDLTextureManager.cgdl_img_commands[i];
			if ( CGDLTextureManager.cgdl_img_loaded[cmd[0]] == false ) continue;//undecided: break?
			CGDLTextureManager._cgdlRunCmd( cmd, ctx );
		  }
		  ctx.restore();
		  CGDLTextureManager.cgdl_img_main_loop_prev_running = false;
		  }
		}, 1, 0 );
	  }
	  else throw "already initialized!";
	}
	
	/**
	  * function _cgdlSpanLoader: update the loading state of the resource span tag, please do not call this function manually or something unexpected may happen.
	  * parameters: None
	  */
	static _cgdlSpanLoader() {
	  console.log( "cgdl span loaded" );
	  CGDLTextureManager.cgdl_span_load = true;
	}

	/**
	  * function cgdlAppendSrc: append an image to the resources of this game.
	  * parameters: string
	  * @src : the directory of this image
	  * return : the cgdl identity of this image
	  */
	static cgdlAppendSrc( src ) {
	  var id = CGDLTextureManager.cgdl_src_list.length;
	  console.log( "start to append image : " + id );
	  CGDLTextureManager.cgdl_src_list.push( src );
	  CGDLTextureManager.cgdl_img_loaded.push( false );
	  return id;
	}

	/**
	  * function _cgdlAppendSrc: start loading the image with id : @id. please do not call this function manually, or something unexpected may happen
	  * parameters: int
	  * @id : the id of this image
	  */
	static _cgdlAppendSrc( id ) {
	  var src = CGDLTextureManager.cgdl_src_list[id];
	  var img = '<img id="cgdl-resource-img-' + id + '" src="' + src + '" height="0" width="0" onload="CGDLTextureManager._cgdlLoader(' + id + ')"/>'
	  document.getElementById( "cgdl-resource-span" ).innerHTML += img;
	}

	/**
	  * function cgdlLoader: update the loading state of any image resources, please do not call this function manually, or something unexpected may happen
	  * parameters: int
	  * @id : the id of the image which has just finished loading
	  */
	static _cgdlLoader( id ) {
	  if ( ! CGDLTextureManager.cgdl_img_loaded[id] ) {
		console.log( "the image " + id + " has been loaded" );
		CGDLTextureManager.cgdl_img_loaded[id] = true;
	  }
	}

	/**
	  * function cgdlEndAppending: stop appending images, this will stop the image loading loop.
	  * parameters: None
	  */
	static cgdlEndAppending() {
	  CGDLTextureManager.cgdl_img_loading = false;
	}

	/**
	  * function cgdlDrawImg: draw a new image on the canvas
	  * parameters: int int int int int
	  * @img_id : the id of the image resource, the accepted values are all in the returns of the function cgdlAppendSrc, one id can be used multiple times but they will create more than one image
	  * @x : the x-coordinate of the image on the canvas
	  * @y : the y-coordinate of the image on the canvas
	  * @w : the width of the image on the canvas
	  * @h : the height of the image on the canvas
	  * return :  the id of the command operating this image
	  */
	static cgdlDrawImg( img_id, x, y, w, h ) {
	  var cmd_id = CGDLTextureManager.cgdl_img_commands.length;
	  CGDLTextureManager.cgdl_img_commands.push( [img_id, x, y, w, h] );
	  return cmd_id;
	}

	/**
	  * function cgdlModifyImg: modify an existing image on the canvas: basic version
	  * parameters: int int/null int/null int/null int/null
	  * @cmd_id : the id of the command, which is the return of the function cgdlDrawing
	  * The following variables all accept the input "null" if there are no variations with the corresponding variable
	  * @img_id : the new id of the image resource, the accepted values are all in the returns of the function cgdlAppendSrc
	  * @x : the new x-coordinate of the image on the canvas
	  * @y : the new y-coordinate of the image on the canvas
	  * @w : the new width of the image on the canvas
	  * @h : the new height of the image on the canvas
	  */
	static cgdlModifyImg( cmd_id, img_id, x, y, w, h ) {
	  if( img_id == null ) img_id = CGDLTextureManager.cgdl_img_commands[cmd_id][0];
	  if( x == null ) x = CGDLTextureManager.cgdl_img_commands[cmd_id][1];
	  if( y == null ) y = CGDLTextureManager.cgdl_img_commands[cmd_id][2];
	  if( w == null ) w = CGDLTextureManager.cgdl_img_commands[cmd_id][3];
	  if( h == null ) h = CGDLTextureManager.cgdl_img_commands[cmd_id][4];
	  CGDLTextureManager.cgdl_img_commands[cmd_id] = [img_id, x, y, w, h];
	}

	/**
	  * function cgdlModifyImg: modify an existing image on the canvas: basic version
	  * parameters: int int/null int/null int/null int/null bool bool bool bool
	  * @cmd_id : the id of the command, which is the return of the function cgdlDrawing
	  * The variables @x, @y, @w, @h accept the input "null" if there are no variations with the corresponding variable
	  * @img_id : the new id of the image resource, the accepted values are all in the returns of the function cgdlAppendSrc
	  * @x :
	  *   when x_app is false, it represents the new x-coordinate of the image on the canvas
	  *   when x_app is true, it represents the change in x-coordinate of the image on the canvas
	  * @y : 
	  *   when y_app is false, it represents the new y-coordinate of the image on the canvas
	  *   when y_app is true, it represents the change in y-coordinate of the image on the canvas
	  * @w : 
	  *   when w_app is false, it represents the new width of the image on the canvas
	  *   when w_app is true, it represents the change in width of the image on the canvas
	  * @h : 
	  *   when h_app is false, it represents the new height of the image on the canvas
	  *   when h_app is true, it represents the change in height of the image on the canvas
	  * @x_app : represents x_coordinate_appending_form if x_app is true, represents x_coordinate_setting_form if x_app is false
	  * @y_app : represents y_coordinate_appending_form if y_app is true, represents y_coordinate_setting_form if y_app is false
	  * @w_app : represents width_appending_form if w_app is true, represents width_setting_form if w_app is false
	  * @h_app : represents height_appending_form if h_app is true, represents height_setting_form if h_app is false
	  * Note : If appending form is used for any variable, the initial value of that variable will be the change in value.
	  */
	static cgdlModifyImg( cmd_id, img_id, x, y, w, h, x_app, y_app, w_app, h_app ) {
	  if( img_id == null) img_id = CGDLTextureManager.cgdl_img_commands[cmd_id][0];
	  if( x == null ) x = CGDLTextureManager.cgdl_img_commands[cmd_id][1];
	  if( x_app == true ) x = CGDLTextureManager.cgdl_img_commands[cmd_id][1] + x;
	  if( y == null ) y = CGDLTextureManager.cgdl_img_commands[cmd_id][2];
	  if( y_app == true ) y = CGDLTextureManager.cgdl_img_commands[cmd_id][2] + y;
	  if( w == null ) w = CGDLTextureManager.cgdl_img_commands[cmd_id][3];
	  if( w_app == true ) w = CGDLTextureManager.cgdl_img_commands[cmd_id][3] + w;
	  if( h == null ) h = CGDLTextureManager.cgdl_img_commands[cmd_id][4];
	  if( h_app == true ) h = CGDLTextureManager.cgdl_img_commands[cmd_id][4] + h;
	  CGDLTextureManager.cgdl_img_commands[cmd_id] = [img_id,x,y,w,h];
	}

	
	/*
	//demo of this module :

	var ctm = CGDLTextureManager;

	//initialize the module
	ctm.UtilsLoader();
	ctm.cgdlInit("main_body");

	//load three images, when running the programme, please change the directory of the images
	var src1 = "C:/Users/admin/Desktop/timg.jpg";
	var src2 = "C:/Users/admin/Desktop/Twilight.png";
	var src3 = "C:/Users/admin/Desktop/Twilight2.png";

	//load the images as resources
	var id1 = ctm.cgdlAppendSrc(src1);
	var id2 = ctm.cgdlAppendSrc(src2);
	var id3 = ctm.cgdlAppendSrc(src3);

	//End of importing image resources (Not neccessary)
	ctm.cgdlEndAppending();

	//Draw all the images on the canvas
	var cid1 = ctm.cgdlDrawImg(id1, 50, 50, 20, 20);
	var cid2 = ctm.cgdlDrawImg(id1, 50, 70, 10, 20);
	var cid3 = ctm.cgdlDrawImg(id2, 80, 80, 20, 20);
	var cid4 = ctm.cgdlDrawImg(id3, 120, 120, 20, 20);

	//Make the images move and scale
	var demo_movement = setInterval(function() {
	  ctm.cgdlModifyImg(cid1, null, 2, null, null, 1, true, false, false, true);
	  ctm.cgdlModifyImg(cid2, null, 1, 3, null, -1, true, true, false, true);
	},10);
	*/

}