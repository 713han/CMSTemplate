var RoleList = function(){
	this.id = '';
	this.text = '';
};

RoleList.prototype.set = function(id, text, check, child, result){
	this.id = id;
	this.text = text;
	
	this.checked = Boolean(check);
	
	if(child.length > 0){
		this.children = child;
	}
	result(this);
};




module.exports = RoleList;