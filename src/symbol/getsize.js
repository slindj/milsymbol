module.exports = function(){
  if (typeof this.width === 'undefined' || typeof this.height === 'undefined') {
    this.updateSymbol();
  }
  return {width:this.width, height:this.height};
}