// gitvsgit jquery widget v 0.1.4 (http://git.io/XIauew)
// by @fatbattk

;(function($){
	$.fn.gvg = function(){
		var table_class = 'gvg-ring',	// class name of generated table.
			header_html = '<thead><tr><th>Repos</th><th>Created</th><th>Updated</th><th>Stars</th><th>Forks</th><th>Open Issues</th></tr></thead>',	// html added to table header.
			footer_html = '<tfoot><tr><th colspan="6">made with /<a href="//git.io/XIauew" target="_blank">gitvsgit</a></th></tr></tfoot>',	// html added to table footer.
			api_cache   = {},	// cache of api responses.
			addCSS = function(){
				$('head').prepend('<style type="text/css">'+
					'div.gvg{background-color:#eee;border-radius:3px;padding:3px;width:500px;}'+
					'table.'+ table_class +'{border:1px solid #ccc;font:13px Helvetica,arial,sans-serif;width:100%;}'+
					'.'+ table_class +' td{background-color:#fff;font-size:12px;padding:6px;}'+
					'.'+ table_class +' .hilite td{background-color:#e6f1f6;}'+
					'.'+ table_class +' thead th,.'+ table_class +' tfoot th{background-color:#fafafa;color:#555;}'+
					'.'+ table_class +' thead th{background-image:-moz-linear-gradient(top,#fafafa,#eaeaea);background-image:-webkit-linear-gradient(top,#fafafa,#eaeaea);background-image:-ms-linear-gradient(top,#fafafa,#eaeaea);background-image:linear-gradient(top,#fafafa,#eaeaea);background-repeat:repeat-x;border-bottom:1px solid #d8d8d8;font-size:13px;padding:4px;}'+
					'.'+ table_class +' tfoot th{font-size:10px;padding:2px 4px;text-align:right;}'+
					'</style>');
			},
			validRepo = function(str){
				if(str.length>3 && str.indexOf('/')!==-1){
					return true;
				}
				return false;
			},
			getHilites = function(obj){
				if(obj.data('highlight')){
					return obj.data('highlight').split(',');
				}
				return [];
			},
			doAjax = function(url){
				if(typeof api_cache[url]==='undefined'){
					api_cache[url] = $.getJSON(url);
				}
				return api_cache[url];
			},
			// http://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
			htmlEntities = function(str){
				return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
			},
			formatDate = function(date){
				return new Date(date).toDateString().replace(/[a-z]+ (.*?)/i,'');
			},
			formatNumber = function(num){
				return String(num).replace(/\B(?=(\d{3})+(?!\d))/g,',');
			},
			buildTableBody = function(arg,hilites,rcount){
				var response = arg[0],
					table_body = '',
					d = {};

				for(var i=0; i<rcount; i++){
					if(rcount>1){
						response = arg[i][0];
					}
					if(response){
						d = response.data;

						// success.
						if(response.meta.status===200 || response.meta.status===304){
							table_body += '<tr';
							if(hilites.length>0 && $.inArray(d.full_name,hilites)>-1){
								table_body += ' class="hilite"';
							}
							table_body += '><td title="'+ htmlEntities(d.description) +'"><a href="'+ d.html_url +'" target="_blank">'+ htmlEntities(d.full_name) +'</a></td><td>'+ formatDate(d.created_at) +'</td><td>'+ formatDate(d.updated_at) +'</td><td align="right">'+ formatNumber(d.watchers_count) +'</td><td align="right">'+ formatNumber(d.forks_count) +'</td><td align="right">'+ formatNumber(d.open_issues_count) +'</td></tr>';
						}
						// fail.
						else if(response.meta.status===403){
							table_body += '<tr><td colspan="6" align="center">'+ htmlEntities(d.message) +'</td></tr>';
						}
					}
				}

				return table_body;
			},
			addTable = function(obj,id,body){
				obj.html('<table class="'+ table_class +'" id="'+ table_class +'-'+ id +'" border="0" cellspacing="1" cellpadding="2">'+ header_html + footer_html +'<tbody>'+ body +'</tbody></table>');
			};

		addCSS();
		// loop each <div.gvg>.
		return this.each(function(idx){
			var $gvg   = $(this),	// selected dom.
				$repos = $gvg.data('repos');	// csv of repos.

			if(!validRepo($repos)){
				return;
			}

			var repo            = $repos.split(','),	// array of repos.
				repo_count      = repo.length,	// number of repo.
				repo_highlights = getHilites($gvg),	// array of repos that need "hilite" class.
				xhr             = [];	// array of XMLHTTPRequest objects.

			// loop each <data-repos=>.
			for(var i=0; i<repo_count; i++){
				if(validRepo(repo[i])){
					// https://developer.github.com/v3/repos/#get
					xhr[i] = doAjax('https://api.github.com/repos/'+ repo[i] +'?callback=?');
				}
			}

			// generate table when all ajax call is complete.
			$.when.apply(this,xhr).done(function(){
				var body = buildTableBody(arguments,repo_highlights,repo_count);	// html of table body.

				addTable($gvg,idx,body);
			});
		});
	};

	// self-invoke.
	$('div.gvg').gvg();
})(jQuery);
