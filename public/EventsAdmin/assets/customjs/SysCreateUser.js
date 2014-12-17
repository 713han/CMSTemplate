$(document).ready(function() {    
	CreateUser.init();
});

var CreateUser = (function (o) {
    "use strict";

    var $Wrap;

    o.init = function () {
        DOMCache();
        bindEvent();
        initOnce();
    }

    var DOMCache = function () {
        $Wrap = $(".CreateUserWrap");
    }

    var bindEvent = function () {
    	$Wrap.find(".btnCreateUser").on("click", function () {    	
    		$Wrap.find(".btnCreateUser").attr("disabled", true);
    		
    		var nickname = $Wrap.find("#nickname").val();
            var username = $Wrap.find("#username").val();
            var password = $Wrap.find("#password").val();
            
            var userrole = $Wrap.find("#tt").tree('getChecked');
            var roleIDs = new Array(userrole.length);
            for (var i = 0; i < userrole.length; i++) {
            	roleIDs[i] = userrole[i].id;
            }
            
        	$.post('createUser', { nickname: nickname, username: username, password: password, roleIDs: roleIDs }, function (response) {
                if (response.status === true) {
                    $Wrap.find("#nickname").val("");
                    $Wrap.find("#username").val("");
                    $Wrap.find("#password").val("");
                    
                    $Wrap.find(".alert")
                         .removeClass("alert-danger")
                         .addClass("alert-success")
                         .text("User ID:" + response.Object + " has been created.");
                    
                    $Wrap.find(".alert").fadeIn();
                    
                    setTimeout(function(){		
                    	$Wrap.find(".alert").fadeOut();
                	},5000);
                    
                    $Wrap.find(".btnCreateUser").attr("disabled", false);
                } else {
                	$Wrap.find(".alert")
     			   		 .removeClass("alert-success")
     			   		 .addClass("alert-danger")
     			   		 .text("Alert:" + response.msg);
     
                	$Wrap.find(".alert").fadeIn();
                	
                	setTimeout(function(){		
                    	$Wrap.find(".alert").fadeOut();
                	},5000);
                	
                	$Wrap.find(".btnCreateUser").attr("disabled", false);
                }
            });
        });
    }

    var initOnce = function () {
    	$Wrap.find(".alert").hide();
    }

    return o;

})(CreateUser || {});