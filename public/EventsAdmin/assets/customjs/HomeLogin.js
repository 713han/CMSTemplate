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
        $Wrap = $(".login_form");
    }

    var bindEvent = function () {
    	$Wrap.find("#inputPassword").keydown(function(e){
            if (e.keyCode == '13'){
            	submit();
            }
        });
    	
    	$Wrap.find(".btn-login").on("click", submit);
    }
    
    var submit = function(){
    	$Wrap.find(".btn-login").attr("disabled", true);
		
        var username = $Wrap.find("#inputEmail").val();
        var password = $Wrap.find("#inputPassword").val();
        
    	$.post('login', { username: username, password: password }, function (response) {
            if (response.status === true){
            	window.location = response.redirect;
            }else{       
            	$Wrap.find(".alert").fadeOut();
            	
            	$Wrap.find(".alert")
 			   		 .removeClass("alert-success")
 			   		 .addClass("alert-danger")
 			   		 .text(response.msg);
 
            	$Wrap.find(".alert").fadeIn();                	
            	
            	$Wrap.find(".btn-login").attr("disabled", false);
            }
        });
    };

    var initOnce = function () {
    	$Wrap.find(".alert").hide();
    };

    return o;

})(CreateUser || {});