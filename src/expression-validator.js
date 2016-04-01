function ExpressionValidator(options) {
    if (!(this instanceof ExpressionValidator)) {
        return new ExpressionValidator(options);
    }
    Validator.call(this, options);

    // this._header = true;
    this._duplicates = {};
    this._sorted = true;
    this._columnsSize = null;

}

ExpressionValidator.prototype = Object.create(Validator.prototype);

ExpressionValidator.prototype.validateLine = function (line) {

    if (this.isHeaderLine(line)) { // parse Header
        this.parseHeader(line);
    } else {
        this.parseData(line);
    }

}

ExpressionValidator.prototype.isHeaderLine = function (line) {
    return line.startsWith("#");
}

ExpressionValidator.prototype.parseHeader = function (line) {}

ExpressionValidator.prototype.parseData = function (line) {
    // var columns = line.split("\t");
    this.addLog("info", "checking line");

    // if (this._columnsSize == null) {
    //     this._columnsSize = columns.length;
    // }
    //
    // if (columns.length < 3) {
    //     this.addLog("error", "Must contain at least 3 columns");
    // }
    //
    // if (this._columnsSize != columns.length) {
    //     this.addLog("error", "All ines must have the same number of columns");
    // }
    //
    // // Chromosome
    // var chr = columns[0];
    // if (chr == "") {
    //     this.addLog("error", "Chromosome must not be empty");
    // }
    //
    // if (chr.search(" ") >= 0) {
    //     this.addLog("error", "Chromosome must not contain whitespaces");
    // }
    //
    // // Start
    // var start = columns[1]
    // if (start == "") {
    //     this.addLog("error", "Start must not be empty");
    // }
    // start = parseInt(start)
    // if (isNaN(start)) {
    //     this.addLog("error", "Start must be numeric");
    // } else {
    //     if (start < 0) {
    //         this.addLog("error", "Start must be greater or equal than 0");
    //     }
    // }
    //
    // // Start
    // var end = columns[1]
    // if (end == "") {
    //     this.addLog("error", "End must not be empty");
    // }
    // end = parseInt(end)
    // if (isNaN(end)) {
    //     this.addLog("error", "End must be numeric");
    // } else {
    //     if (end < 0) {
    //         this.addLog("error", "End must be greater or equal than 0");
    //     }
    //     if (end > start) {
    //         this.addLog("error", "End must be greater or equal than Start");
    //     }
    // }

}
