// have a grid that is true/false (filled or not filled)
// if the whole line is full then get rid of the line
//
//TODO DAS??
function begin() {
    board.start(); //set up the board
    while (True) {
        //generate a piece
    }
}

var board = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 270;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

var piece(shape, x, y, font) {
    //i think shape will be like a string of what it's supposed to look like ??
    this.update = function() {
        // update location (redraw)
    }
    this.collision = function() {
        // cant run into blocks that are right or left to it
    }
    this.stop = function() {
        // at stop stop moving

    }
}
