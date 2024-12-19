import draw2d from "../packages";

/**
 * @class
 *
 * Command to set the image of a draw2d.shape.basic.Image node with CommandStack support.
 *
 * @extends draw2d.command.Command
 */
draw2d.command.CommandSetImage = draw2d.command.Command.extend({
  NAME: "draw2d.command.CommandSetImage",

  init: function (node, newImage) {
    this._super("Set Image");
    this.node = node;
    this.newImage = newImage;
    this.oldImage = node.getPath();
    this.isImageChanged = false;
  },

  canExecute: function () {
    return (
      !this.isImageChanged && this.node instanceof draw2d.shape.basic.Image
    );
  },

  execute: function () {
    this.node.setPath(this.newImage);

    this.node.repaint();

    this.isImageChanged = true;
  },

  undo: function () {
    this.node.setPath(this.oldImage);

    this.isImageChanged = false;
  },

  redo: function () {
    this.execute();
  },
});
