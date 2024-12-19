import draw2d from "../../packages";
const { Canvg } = require("canvg");

/**
 * @class
 *
 * Converts the canvas document into a PNG Image.
 *
 * @example
 *    // example how to create a PNG image and set an
 *    // image src attribute.
 *    //
 *    let writer = new draw2d.io.png.Writer();
 *    writer.marshal(canvas, function(png){
 *        $("#preview").attr("src",png);
 *    });
 *
 * @author Andreas Herz
 * @author Bartolomei Robert
 * @extends draw2d.io.Writer
 */
draw2d.io.png.Writer = draw2d.io.Writer.extend(
  /** @lends draw2d.io.png.Writer */
  {
    init: function () {
      this._super();
    },

    /**
     *
     * Export the content to a PNG image. The result can be set as <b>src="...."</b> because
     * the result is encoded as data source url <b>data:image/png;base64....</b>
     * <br>
     * <br>
     *
     * Method signature has been changed from version 2.10.1 to version 3.0.0.<br>
     * The parameter <b>resultCallback</b> is required and new. The method calls
     * the callback instead of return the result.
     *
     * @param {draw2d.Canvas} canvas
     * @param {Function} resultCallback the method to call on success. The first argument is the dataUrl, the second is the base64 formated png image
     * @param {String} resultCallback.img  The image as data source url <b>data:image/png;base64....</b>
     * @param {String} resultCallback.base64  the image encoded in base64
     * @param {draw2d.geo.Rectangle} cropBoundingBox optional cropping/clipping bounding box
     */
    marshal: function (canvas, resultCallback, cropBoundingBox) {
      if (typeof resultCallback !== "function") {
        throw "Writer.marshal method requires a callback function";
      }

      let s = canvas.getPrimarySelection();
      canvas.setCurrentSelection(null);
      let svg = canvas
        .getHtmlContainer()
        .html()
        .replace(/>\s+/g, ">")
        .replace(/\s+</g, "<")
        .replace(/xmlns="[^"]+"/g, "")
        .replace(/<img[^>]*>/gi, "");
      canvas.setCurrentSelection(s);
      // wrap the SVG content with the SVG root node
      svg = `<?xml version="1.0" standalone="no"?>\n
             <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n
             "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n
             <svg xmlns="http://www.w3.org/2000/svg" version="1.1">\n
             ${svg}\n</svg>`; // updated

      let width = cropBoundingBox ? cropBoundingBox.w : canvas.getWidth();
      let height = cropBoundingBox ? cropBoundingBox.h : canvas.getHeight();
      let dx = cropBoundingBox ? -cropBoundingBox.x : 0;
      let dy = cropBoundingBox ? -cropBoundingBox.y : 0;

      let canvasElement = document.createElement("canvas");
      canvasElement.width = width;
      canvasElement.height = height;
      let ctx = canvasElement.getContext("2d");

      let canvgInstance = Canvg.fromString(ctx, svg, { ignoreClear: true }); // updated
      ctx.translate(dx, dy); // updated
      canvgInstance.render().then(function () {
        // updated
        let png = canvasElement.toDataURL("image/png");
        resultCallback(png);
      });
    },
  }
);
