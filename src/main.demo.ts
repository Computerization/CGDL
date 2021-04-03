import CGDLTextureManager from "./CGDLTextureManager.js";

/*
myCGDL = new CGDL();
myTexture = new Texture(0, myCGDL.context, "C:/Users/admin/Desktop/projects/computerization/CGDL/images/actor2.png");
myTexture.setHeight(50);
myTexture.setWidth(50);
myTexture.show();
*/
let ctm = CGDLTextureManager;

// Initialize the module
ctm.loadUtils();
ctm.cgdlInit("bd");

// Load three images. When running the programme, please change the directory of the images
let src1: string = "./images/actor1.png";
let src2: string = "./images/actor2.png";
let src3: string = "./images/actor3.png";

// Load the images as resources
let id1: number = ctm.cgdlAppendSrc(src1);
let id2: number = ctm.cgdlAppendSrc(src2);
let id3: number = ctm.cgdlAppendSrc(src3);

// End of importing image resources (Not neccessary)
ctm.cgdlEndAppending();

// Draw all the images on the canvas
let cid1: number = ctm.cgdlDrawImg(id1, 50, 50, 20, 20);
let cid2: number = ctm.cgdlDrawImg(id1, 50, 70, 10, 20);
let cid3: number = ctm.cgdlDrawImg(id2, 80, 80, 20, 20);
let cid4: number = ctm.cgdlDrawImg(id3, 120, 120, 20, 20);

// Make the images move and scale
let demo_movement: number = setInterval(() => {
  ctm.cgdlModifyImg(cid1, null, 2, null, null, 1, true, false, false, true);
  ctm.cgdlModifyImg(cid2, null, 1, 3, null, -1, true, true, false, true);
}, 10);
