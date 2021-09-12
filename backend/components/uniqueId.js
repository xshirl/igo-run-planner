/**
 * splits samples according to barcode collisions, allocates samples with unique barcodes to different lanes
 * @return {String} returns randomly generated string that serves as unique id
 */

var ID = function () {
  return Math.random().toString(36).substr(2, 9);
};

module.exports = ID;
