var Util=require('../util');
function ResBody(){
    this.data=[];
    this.code=Util.SUCCESS;
    this.failure="";
}
module.exports = ResBody;