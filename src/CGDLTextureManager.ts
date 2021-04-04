type command = {
  img_id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Requirements: a canvas with id `cgdl-canvas`.
 */
class CGDLTextureManager {
  /** The list of the directories of the image resources. */
  static src_list: string[];
  /** Whether the image resources have been loaded. */
  static img_loaded: boolean[];
  /** Whether the resource span has been loaded. */
  static span_load: boolean;
  /** The clock checking the loading state of the resource span. */
  static span_clock: number;
  /** Whether the module has already been initialized. */
  static first_init: boolean;
  /** Whether the images have all been uploaded as resources. */
  static img_loading: boolean;
  /** Whether the images have all finished loading. */
  static img_all_loaded: boolean;
  /** The current loading image. */
  static load_id: number;
  /** Whether the images have all started loading. */
  static span_clock_img_loading: boolean;
  /** The clock controlling the canvas and all the commands. */
  static img_main_loop: number;
  /** Whether the main-loop clock is still in running when one or several intervals have passed. May become deprecated. */
  static img_main_loop_prev_running: boolean;
  /** Each element is a command. */
  static img_commands: command[];
  /** The dom of the canvas. */
  static canvas: HTMLCanvasElement;

  static loadUtils(): void {
    CGDLTextureManager.src_list = [];
    CGDLTextureManager.img_loaded = [];
    CGDLTextureManager.span_load = false;
    CGDLTextureManager.span_clock = null;
    CGDLTextureManager.first_init = false;
    CGDLTextureManager.img_loading = true;
    CGDLTextureManager.img_all_loaded = false;
    CGDLTextureManager.load_id = 0;
    CGDLTextureManager.span_clock_img_loading = true;
    CGDLTextureManager.img_main_loop = null;
    CGDLTextureManager.img_main_loop_prev_running = false;
    CGDLTextureManager.img_commands = [];
    CGDLTextureManager.canvas = document.getElementById(
      "cgdl-canvas"
    ) as HTMLCanvasElement;
  }

  /**
   * Draw the image by context `ctx` as the command `cmd` required to. Should not be called manually.
   */
  static __runCmd(cmd: command, ctx: CanvasRenderingContext2D): void {
    let img: CanvasImageSource = document.getElementById(
      `cgdl-resource-img-${cmd.img_id}`
    ) as CanvasImageSource;
    ctx.drawImage(img, cmd.x, cmd.y, cmd.width, cmd.height);
  }

  /**
   * Update the loading state of the resource span tag. Should not be called manually.
   */
  static __spanLoader(): void {
    console.log("CGDL span loaded");
    CGDLTextureManager.span_load = true;
  }

  /**
   * Start loading the image with id `id`. Should not be called manually.
   * @param {number} `id` The id of this image
   */
  static __appendSrc(id: number) {
    let img: HTMLImageElement = document.createElement("img");
    img.id = `cgdl-resource-img-${id}`;
    img.src = CGDLTextureManager.src_list[id];
    img.width = 0;
    img.height = 0;
    img.addEventListener("load", () => CGDLTextureManager.__loader(id));
    document.getElementById("cgdl-resource-span").appendChild(img);
  }

  /**
   * Update the loading state of any image resources. Should not be called manually.
   * @param {number} `id` The id of the image which has just finished loading
   */
  static __loader(id: number) {
    if (!CGDLTextureManager.img_loaded[id]) {
      console.log(`The image ${id} has been loaded`);
      CGDLTextureManager.img_loaded[id] = true;
    }
  }

  /**
   * Load image and canvas updating loop. The main algorithm in this module.
   * @param {string} `bid` the dom id of the body tag
   */
  static init(bid: string): void {
    if (!CGDLTextureManager.first_init) {
      CGDLTextureManager.first_init = true;
      let span: HTMLSpanElement = document.createElement("span");
      span.id = "cgdl-resource-span";
      span.addEventListener("load", CGDLTextureManager.__spanLoader);
      document.getElementById(bid).appendChild(span);
      (window as any).CGDLTextureManager = CGDLTextureManager;
      // After the span tag is loaded, the images will start loading
      CGDLTextureManager.span_clock = setInterval(
        () => {
          let loading: boolean = CGDLTextureManager.span_clock_img_loading;
          if (!loading) {
            if (CGDLTextureManager.img_loaded.every(Boolean)) {
              console.log("Images have all been loaded");
              clearInterval(CGDLTextureManager.span_clock);
            }
          }
          if (
            CGDLTextureManager.load_id >= CGDLTextureManager.src_list.length
          ) {
            loading = false;
            if (
              !CGDLTextureManager.img_loading &&
              CGDLTextureManager.span_clock_img_loading
            ) {
              CGDLTextureManager.span_clock_img_loading = false;
              console.log("Images have all started loading");
            }
          }
          if (loading) {
            console.log("Start loading: " + CGDLTextureManager.load_id);
            CGDLTextureManager.__appendSrc(CGDLTextureManager.load_id);
            CGDLTextureManager.load_id += 1;
          }
        },
        100,
        0
      );
      // The main loop of the images. Each time: clear the canvas, draw images, save the canvas
      CGDLTextureManager.img_main_loop = setInterval(
        () => {
          if (!CGDLTextureManager.img_main_loop_prev_running) {
            CGDLTextureManager.img_main_loop_prev_running = true;
            let ctx: CanvasRenderingContext2D = (document.getElementById(
              "cgdl-canvas"
            ) as HTMLCanvasElement).getContext("2d");
            ctx.save();
            ctx.clearRect(
              0,
              0,
              CGDLTextureManager.canvas.width,
              CGDLTextureManager.canvas.height
            );
            for (let cmd of CGDLTextureManager.img_commands) {
              if (!CGDLTextureManager.img_loaded[cmd.img_id]) continue; // undecided: break?
              CGDLTextureManager.__runCmd(cmd, ctx);
            }
            ctx.restore();
            CGDLTextureManager.img_main_loop_prev_running = false;
          }
        },
        1,
        0
      );
    } else throw "Already initialized!";
  }

  /**
   * Append an image to the resources of this game.
   * @param {string} `src` The directory of this image
   * @returns {number} The CGDL identity of this image
   */
  static appendSrc(src: string): number {
    let id: number = CGDLTextureManager.src_list.length;
    console.log("Start to append image: " + id);
    CGDLTextureManager.src_list.push(src);
    CGDLTextureManager.img_loaded.push(false);
    return id;
  }

  /**
   * Stop appending images. This will stop the image loading loop.
   */
  static endAppending() {
    CGDLTextureManager.img_loading = false;
  }

  /**
   * Draw a new image on the canvas.
   * @param {number} `img_id` The id of the image resource, the accepted values are all in the returns of the function cgdlAppendSrc, one id can be used multiple times but they will create more than one image
   * @param {number} `x` The x-coordinate of the image on the canvas
   * @param {number} `y` The y-coordinate of the image on the canvas
   * @param {number} `w` The width of the image on the canvas
   * @param {number} `h` The height of the image on the canvas
   * @returns {number} The id of the command operating this image
   */
  static drawImg(
    img_id: number,
    x: number,
    y: number,
    w: number,
    h: number
  ): number {
    let cmd_id: number = CGDLTextureManager.img_commands.length;
    CGDLTextureManager.img_commands.push({
      img_id: img_id,
      x: x,
      y: y,
      width: w,
      height: h,
    });
    return cmd_id;
  }

  /**
   * Modify an existing image on the canvas: basic version
   * The variables `x`, `y`, `w, `h` accept the input `null` if there are no variations with the corresponding variable.
   * @param {number} `cmd_id` The id of the command, which is the return of the function `cgdlDrawing`
   * @param {number} `img_id` The new id of the image resource.
   * @param {number} `x` When `x_app` is false, it represents the new x-coordinate of the image on the canvas; when `x_app` is true, it represents the change in x-coordinate of the image on the canvas.
   * @param {number} `y` When `y_app` is false, it represents the new y-coordinate of the image on the canvas; when `y_app` is true, it represents the change in y-coordinate of the image on the canvas.
   * @param {number} `w` When `w_app` is false, it represents the new width of the image on the canvas; when `w_app` is true, it represents the change in width of the image on the canvas.
   * @param {number} `h` When `h_app` is false, it represents the new height of the image on the canvas; when `h_app` is true, it represents the change in height of the image on the canvas.
   * @param {number=} `x_app` Represents `x_coordinate_appending_form` if `x_app` is `true`; represents `x_coordinate_setting_form` if `x_app` is `false`.
   * @param {number=} `y_app` Represents `y_coordinate_appending_form` if `y_app` is `true`; represents `y_coordinate_setting_form` if `y_app` is `false`.
   * @param {number=} `w_app` Represents `width_appending_form` if `w_app` is `true`, represents `width_setting_form` if `w_app` is `false`.
   * @param {number=} `h_app` Represents `height_appending_form` if `h_app` is `true`, represents `height_setting_form` if `h_app` is `false`.
   *
   * Note: If appending form is used for any variable, the initial value of that variable will be the change in value.
   */
  static modifyImg(
    cmd_id: number,
    img_id: number,
    x: number,
    y: number,
    w: number,
    h: number,
    x_app?: boolean,
    y_app?: boolean,
    w_app?: boolean,
    h_app?: boolean
  ) {
    img_id = img_id ?? CGDLTextureManager.img_commands[cmd_id].img_id;
    x = x ?? CGDLTextureManager.img_commands[cmd_id].x;
    y = y ?? CGDLTextureManager.img_commands[cmd_id].y;
    w = w ?? CGDLTextureManager.img_commands[cmd_id].width;
    h = h ?? CGDLTextureManager.img_commands[cmd_id].height;
    if (x_app) x = CGDLTextureManager.img_commands[cmd_id].x + x;
    if (y_app) y = CGDLTextureManager.img_commands[cmd_id].y + y;
    if (w_app) w = CGDLTextureManager.img_commands[cmd_id].width + w;
    if (h_app) h = CGDLTextureManager.img_commands[cmd_id].width + h;
    CGDLTextureManager.img_commands[cmd_id] = {
      img_id: img_id,
      x: x,
      y: y,
      width: w,
      height: h,
    };
  }
}

export default CGDLTextureManager;
