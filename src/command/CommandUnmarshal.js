import draw2d from "../packages";

/**
 * @class
 *
 * Command to unmarshal and add figures to the canvas with CommandStack support.
 *
 * @extends draw2d.command.Command
 */
draw2d.command.CommandUnmarshal = draw2d.command.Command.extend({
  NAME: "draw2d.command.CommandUnmarshal",

  init: function (canvas, marshaledFigures) {
    this._super(draw2d.Configuration.i18n.command.addShape);
    this.marshaledFigures = marshaledFigures;
    this.canvas = canvas;
    this.areFiguresAdded = false;
    this.reader = new draw2d.io.json.Reader();
  },

  canExecute: function () {
    return !this.areFiguresAdded;
  },

  execute: function () {
    this.reader.unmarshal(this.canvas, this.marshaledFigures);

    this.areFiguresAdded = true;
  },

  undo: function () {
    this.marshaledFigures.forEach((figure) => {
      this.canvas.remove(figure);
    });

    this.areFiguresAdded = false;
  },

  redo: function () {
    this.execute();
  },
});
