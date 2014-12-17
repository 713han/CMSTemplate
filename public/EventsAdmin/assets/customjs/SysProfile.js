$(document).ready(function() {    
	SysProfile.init();
});

var SysProfile = (function (o) {
    "use strict";

    var $Wrap;

    o.init = function () {
        DOMCache();
        bindEvent();
        initOnce();
    }

    var DOMCache = function () {
        $Wrap = $(".ProfileWrap");
    }

    var bindEvent = function () {
    	$Wrap.find(".btnUpdate").on("click", function () {    	
    		$Wrap.find(".btnUpdate").attr("disabled", true);
    		
    		var userid = $Wrap.find("#userID").val();
    		var nickname = $Wrap.find("#nickname").val();
            
            var userrole = $Wrap.find("#tt").tree('getChecked');
            var roleIDs = new Array(userrole.length);
            for (var i = 0; i < userrole.length; i++) {
            	roleIDs[i] = userrole[i].id;
            }
            
        	$.post('../profile', { userid: userid, nickname: nickname, roleIDs: roleIDs }, function (response) {
                
        		if (response.status === true) {                    
                    $Wrap.find(".alert")
                    	 .removeClass("alert-danger")
                    	 .addClass("alert-success")
                    	 .text("User ID:" + response.Object + " has been updated.");
                    
                    $Wrap.find(".alert").fadeIn();
                    
                    setTimeout(function(){		
                    	$Wrap.find(".alert").fadeOut();
                	},5000);
                    
                    $Wrap.find(".btnUpdate").attr("disabled", false);
                } else {
                	$Wrap.find(".alert")
     			   	     .removeClass("alert-success")
     			   	     .addClass("alert-danger")
     			   	     .text("Alert:" + response.msg);
     
                	$Wrap.find(".alert").fadeIn();
                	
                	setTimeout(function(){		
                    	$Wrap.find(".alert").fadeOut();
                	},5000);
                	
                	$Wrap.find(".btnUpdate").attr("disabled", false);
                }
                
        		$Wrap.find(".btnUpdate").attr("disabled", false);
            });
        });
    }

    var initOnce = function () {
    	$Wrap.find(".alert").hide();
    }

    return o;

})(SysProfile || {});