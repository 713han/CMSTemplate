$(document).ready(function () {
	list.init();
});


var list = (function (o) {
    "use strict";
    
    var $el,
		$itemInfo,
        $pagelist,
        $orderInfo;

    o.init = function () {
        DOMCache();
        bindEvent();
        initOnce();
    };

    var DOMCache = function () {
        $el = $(".UserListWrap");
        $itemInfo = $el.find(".table");
        $pagelist = $el.find(".pagination");
    }; 

    var pagInationTemplate = function (currentPageNo, totalPageNo) {
    	var current = parseInt(currentPageNo);
    	var total = parseInt(totalPageNo);    	
    	var pagelimit = parseInt(10);
    	
    	var startTmp = current - ((current - 1) % pagelimit) ;    	
        var start = startTmp - ((current > pagelimit) ? 1 : 0);
        var endTmp = startTmp + pagelimit;
        var end = (endTmp > total) ? total : endTmp;
    	
        var html = '';
        if (current > 1) {
            html += '<li><a class="page" href="#" pageid="1">«</a></li>';
        } else {
        	html += '<li class="disabled"><a class="page" href="#" pageid="1">«</a></li>';
        }        
        for (var i = start; i <= end; i++) {
            if (i == current) {
                html += '<li class="active"><a class="page" href="#" pageid="' + i + '">' + i + '</a></li>';
            } else {
            	html += '<li><a class="page" href="#" pageid="' + i + '">' + i + '</a></li>';
            }            
        }
        if (current < total) {
            html += '<li><a class="page" href="#" pageid="' + total + '">»</a></li>';
        } else {
        	html += '<li class="disabled"><a class="page" href="#" pageid="' + total + '">»</a></li>';
        }
        return html;
    };

    var itemTemplate = function (data) {
        var html = '<thead>' +
						'<tr>' +
							'<th>#</th>' +
							'<th>ID</th>' +
							'<th>Nick Name</th>' +
							'<th>User Name</th>' +
							'<th>Date</th>' +
							'<th>Status</th>' +							
							'<th>Edit</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>';

        for (var i = 0; i < data.Object.result.length; i++) {
            var obj = data.Object.result[i];
            var enableHtml = '<button type="button" class="btn btn-danger btn-sm btn-enable" actionID="' + obj.id + '" ></span><span class="glyphicon glyphicon-remove"></span></button>';
            var disableHtml = '<button type="button" class="btn btn-success btn-sm btn-sm btn-disable" actionID="' + obj.id + '" ></span><span class="glyphicon glyphicon-ok"></span></button>';
            html +=
            	'<tr>' +
    				'<td>' + (i+1) + '</td>' +
    				'<td>' + obj.id + '</td>' +
    				'<td>' + obj.nickname + '</td>' +
    				'<td>' + obj.username + '</td>' +    				
    				'<td>' +
    					'建立:' + moment(obj.createdate).format('YYYY-MM-DD HH:mm:ss') + '<br />' +
    					'登入:' + moment(obj.lastlogindate).format('YYYY-MM-DD HH:mm:ss') + 
    				'</td>' +
    				'<td>' +  ((obj.isactive[0] == 1) ? 'Enable' : 'Disable') + '</td>' +
    				'<td>' +
    					((obj.isactive[0] == 1) ? disableHtml : enableHtml) +
    					'<button type="button" class="btn btn-primary btn-sm btn-edit" actionID="' + obj.id + '"></span><span class="glyphicon glyphicon-edit"></span></button>' +
    				'</td>' +
    			'</tr>';
        }
        html += '<tbody>';
        return html;
    };

    var loadItem = function (pageNo) {
        pageNo = pageNo ? pageNo : 1;
        var $appendItem;
        $.post("userlist", { page: pageNo }, function (response) {
            if (response.status === false) {
                alert(response.msg);
            } else {
                $appendItem = $(itemTemplate(response));
                $itemInfo.html($appendItem);
                refreshPagInation(response.Object.paging.currentPage, response.Object.paging.totalPage);
            }
        });
        return false;
    };

    var refreshPagInation = function (currentPageNo, totalPageNo) {
        var $pagInationTemplate = $(pagInationTemplate(currentPageNo, totalPageNo));
        $pagelist.html($pagInationTemplate);
    };

    var bindEvent = function () {
    	$pagelist.on("click", ".page", function () {
            var 
				$this = $(this),
				id = $this.attr("pageid");
            loadItem(id);
            return false;
        });
    	
    	$itemInfo.on("click", ".btn-enable", function () {
    		var
    			$this = $(this),
    			id = $this.attr("actionid"),
    			pageid = $pagelist.find(".active .page").attr("pageid");
    		
    		$.post('enableuser', { id: id, active: 1 }, function (response) {
    			loadItem(pageid);
            });
        });
    	
    	$itemInfo.on("click", ".btn-disable", function () {
    		var
    			$this = $(this),
    			id = $this.attr("actionid"),
    			pageid = $pagelist.find(".active .page").attr("pageid");
    		
    		$.post('enableuser', { id: id, active: 0 }, function (response) {
    			loadItem(pageid);
            });
        });
    	
    	$itemInfo.on("click", ".btn-edit", function () {
    		var
				$this = $(this),
				id = $this.attr("actionid");
    		window.location = 'profile/' + id;
        });
    };

    var initOnce = function () {
        loadItem();
    };

    return o;

})(list || {});