/**
Requirements: a canvas with id `cgdl-canvas`.
*/
class CGDLTextureManager {
    static loadUtils() {
        CGDLTextureManager.cgdl_src_list = [];
        CGDLTextureManager.cgdl_img_loaded = [];
        CGDLTextureManager.cgdl_span_load = false;
        CGDLTextureManager.cgdl_span_clock = null;
        CGDLTextureManager.cgdl_first_init = false;
        CGDLTextureManager.cgdl_img_loading = true;
        CGDLTextureManager.cgdl_img_all_loaded = false;
        CGDLTextureManager.cgdl_load_id = 0;
        CGDLTextureManager.cgdl_span_clock_img_loading = true;
        CGDLTextureManager.cgdl_img_main_loop = null;
        CGDLTextureManager.cgdl_img_main_loop_prev_running = false;
        CGDLTextureManager.cgdl_img_commands = [];
        CGDLTextureManager.cgdl_canvas = document.getElementById("cgdl-canvas");
    }
    /**
      * Draw the image by context `ctx` as the command `cmd` required to. Should not be called manually.
      */
    static __cgdlRunCmd(cmd, ctx) {
        let img = document.getElementById("cgdl-resource-img-" + cmd.img_id);
        ctx.drawImage(img, cmd.x, cmd.y, cmd.width, cmd.height);
    }
    /**
      * Update the loading state of the resource span tag. Should not be called manually.
      */
    static __cgdlSpanLoader() {
        console.log("CGDL span loaded");
        CGDLTextureManager.cgdl_span_load = true;
    }
    /**
      * Start loading the image with id `id`. Should not be called manually.
      * @id The id of this image
      */
    static __cgdlAppendSrc(id) {
        let src = CGDLTextureManager.cgdl_src_list[id];
        let img = `<img id="cgdl-resource-img-${id}" src="${src}" height="0" width="0" onload="CGDLTextureManager.__cgdlLoader(${id})"/>`;
        document.getElementById("cgdl-resource-span").innerHTML += img;
    }
    /**
      * Update the loading state of any image resources. Should not be called manually.
      * @id The id of the image which has just finished loading
      */
    static __cgdlLoader(id) {
        if (!CGDLTextureManager.cgdl_img_loaded[id]) {
            console.log(`The image ${id} has been loaded`);
            CGDLTextureManager.cgdl_img_loaded[id] = true;
        }
    }
    /**
      * Load image and canvas updating loop. The main algorithm in this module.
      * @bid : the dom id of the body tag
      */
    static cgdlInit(bid) {
        if (!CGDLTextureManager.cgdl_first_init) {
            CGDLTextureManager.cgdl_first_init = true;
            document.getElementById(bid).innerHTML += '<span id="cgdl-resource-span"></span>';
            document.getElementById("cgdl-resource-span").addEventListener("load", CGDLTextureManager.__cgdlSpanLoader);
            window.CGDLTextureManager = CGDLTextureManager;
            // After the span tag is loaded, the images will start loading
            CGDLTextureManager.cgdl_span_clock = setInterval(() => {
                let flag = CGDLTextureManager.cgdl_span_clock_img_loading;
                if (!flag) {
                    if (CGDLTextureManager.cgdl_img_loaded.every(Boolean)) {
                        console.log("Images have all been loaded");
                        clearInterval(CGDLTextureManager.cgdl_span_clock);
                    }
                }
                if (CGDLTextureManager.cgdl_load_id >= CGDLTextureManager.cgdl_src_list.length) {
                    flag = false;
                    if ((!CGDLTextureManager.cgdl_img_loading) && CGDLTextureManager.cgdl_span_clock_img_loading) {
                        CGDLTextureManager.cgdl_span_clock_img_loading = false;
                        console.log("Images have all started loading");
                    }
                }
                if (flag) {
                    console.log("Start loading: " + CGDLTextureManager.cgdl_load_id);
                    CGDLTextureManager.__cgdlAppendSrc(CGDLTextureManager.cgdl_load_id);
                    CGDLTextureManager.cgdl_load_id += 1;
                }
            }, 100, 0);
            // The main loop of the images. Each time: clear the canvas, draw images, save the canvas
            CGDLTextureManager.cgdl_img_main_loop = setInterval(() => {
                if (!CGDLTextureManager.cgdl_img_main_loop_prev_running) {
                    CGDLTextureManager.cgdl_img_main_loop_prev_running = true;
                    let ctx = document.getElementById("cgdl-canvas").getContext("2d");
                    ctx.save();
                    ctx.clearRect(0, 0, CGDLTextureManager.cgdl_canvas.width, CGDLTextureManager.cgdl_canvas.height);
                    for (let cmd of CGDLTextureManager.cgdl_img_commands) {
                        if (!CGDLTextureManager.cgdl_img_loaded[cmd.img_id])
                            continue; // undecided: break?
                        CGDLTextureManager.__cgdlRunCmd(cmd, ctx);
                    }
                    ctx.restore();
                    CGDLTextureManager.cgdl_img_main_loop_prev_running = false;
                }
            }, 1, 0);
        }
        else
            throw "Already initialized!";
    }
    /**
      * Append an image to the resources of this game.
      * @src The directory of this image
      * @return The CGDL identity of this image
      */
    static cgdlAppendSrc(src) {
        let id = CGDLTextureManager.cgdl_src_list.length;
        console.log("Start to append image: " + id);
        CGDLTextureManager.cgdl_src_list.push(src);
        CGDLTextureManager.cgdl_img_loaded.push(false);
        return id;
    }
    /**
      * Stop appending images. This will stop the image loading loop.
      */
    static cgdlEndAppending() {
        CGDLTextureManager.cgdl_img_loading = false;
    }
    /**
      * Draw a new image on the canvas.
      * @img_id The id of the image resource, the accepted values are all in the returns of the function cgdlAppendSrc, one id can be used multiple times but they will create more than one image
      * @x The x-coordinate of the image on the canvas
      * @y The y-coordinate of the image on the canvas
      * @w The width of the image on the canvas
      * @h The height of the image on the canvas
      * @return The id of the command operating this image
      */
    static cgdlDrawImg(img_id, x, y, w, h) {
        let cmd_id = CGDLTextureManager.cgdl_img_commands.length;
        CGDLTextureManager.cgdl_img_commands.push({ img_id: img_id, x: x, y: y, width: w, height: h });
        return cmd_id;
    }
    /**
      * Modify an existing image on the canvas: basic version
      * @cmd_id the id of the command, which is the return of the function `cgdlDrawing`
      * The variables `x`, `y`, `w, `h` accept the input `null` if there are no variations with the corresponding variable
      * @img_id The new id of the image resource.
      * @x When `x_app` is false, it represents the new x-coordinate of the image on the canvas.
      *   When `x_app` is true, it represents the change in x-coordinate of the image on the canvas.
      * @y When `y_app` is false, it represents the new y-coordinate of the image on the canvas.
      *   When `y_app` is true, it represents the change in y-coordinate of the image on the canvas.
      * @w When `w_app` is false, it represents the new width of the image on the canvas.
      *   When `w_app` is true, it represents the change in width of the image on the canvas.
      * @h When `h_app` is false, it represents the new height of the image on the canvas.
      *   When `h_app` is true, it represents the change in height of the image on the canvas.
      * @x_app Represents `x_coordinate_appending_form` if `x_app` is `true`; represents `x_coordinate_setting_form` if `x_app` is `false`.
      * @y_app Represents `y_coordinate_appending_form` if `y_app` is `true`; represents `y_coordinate_setting_form` if `y_app` is `false`.
      * @w_app Represents `width_appending_form` if `w_app` is `true`, represents `width_setting_form` if `w_app` is `false`.
      * @h_app Represents `height_appending_form` if `h_app` is `true`, represents `height_setting_form` if `h_app` is `false`.
      *
      * Note: If appending form is used for any variable, the initial value of that variable will be the change in value.
      */
    static cgdlModifyImg(cmd_id, img_id, x, y, w, h, x_app, y_app, w_app, h_app) {
        img_id = img_id !== null && img_id !== void 0 ? img_id : CGDLTextureManager.cgdl_img_commands[cmd_id].img_id;
        x = x !== null && x !== void 0 ? x : CGDLTextureManager.cgdl_img_commands[cmd_id].x;
        y = y !== null && y !== void 0 ? y : CGDLTextureManager.cgdl_img_commands[cmd_id].y;
        w = w !== null && w !== void 0 ? w : CGDLTextureManager.cgdl_img_commands[cmd_id].width;
        h = h !== null && h !== void 0 ? h : CGDLTextureManager.cgdl_img_commands[cmd_id].height;
        if (x_app)
            x = CGDLTextureManager.cgdl_img_commands[cmd_id].x + x;
        if (y_app)
            y = CGDLTextureManager.cgdl_img_commands[cmd_id].y + y;
        if (w_app)
            w = CGDLTextureManager.cgdl_img_commands[cmd_id].width + w;
        if (h_app)
            h = CGDLTextureManager.cgdl_img_commands[cmd_id].width + h;
        CGDLTextureManager.cgdl_img_commands[cmd_id] = { img_id: img_id, x: x, y: y, width: w, height: h };
    }
}
export default CGDLTextureManager;
