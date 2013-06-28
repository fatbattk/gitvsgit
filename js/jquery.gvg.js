// gitvsgit jquery widget v 0.1 (http://git.io/XIauew)
// by @fatbattk

(function($){
	var $gvgs = $('div.gvg');
	if($gvgs.length)
	{
		var gvg_table_class = 'gvg-ring',
			footer = 'made with /<a href="https://github.com/fatbattk/gitvsgit" target="_blank">gitvsgit</a>',
			i = 0;

		$('head').prepend('<style type="text/css">'
						+'div.gvg{background-color:#EEE;border-radius:3px;padding:3px;width:500px;}'
						+'table.'+ gvg_table_class +'{border:1px solid #CCC;font:13px Helvetica,arial,sans-serif;width:100%;}'
						+'.'+ gvg_table_class +' td{background-color:#FFF;font-size:12px;padding:6px;}'
						+'.'+ gvg_table_class +' thead th,.'+ gvg_table_class +' tfoot th{background-color:#FAFAFA;color:#555;}'
						+'.'+ gvg_table_class +' thead th{background-image:-moz-linear-gradient(#FAFAFA,#EAEAEA);background-repeat:repeat-x;border-bottom:1px solid #D8D8D8;font-size:13px;padding:4px;}'
						+'.'+ gvg_table_class +' tfoot th{font-size:10px;padding:2px 4px;text-align:right;}'
						+'</style>');

		$gvgs.each(function(idx){
			var $gvg = $(this),
				$repos = $gvg.data('repos');
			if($repos.length>7)
			{
				var repo = $repos.split(','),
					repo_count = repo.length;
				if(repo_count>1)
				{
					var gvgaj =[];

					for(i=0; i<repo_count; i++)
					{
						if(repo[i].length>3)
						{
							gvgaj[i] = $.getJSON('https://api.github.com/repos/'+ repo[i] +'?callback=?');
						}
					}

					$.when.apply(this,gvgaj).done(function(){
						var gvgtbl = '<table class="'+ gvg_table_class +'" id="'+ gvg_table_class +'-'+ idx +'" border="0" cellspacing="1" cellpadding="2">'
									+'<thead><tr><th>Repos</th><th>Created</th><th>Updated</th><th>Watchers</th><th>Forks</th><th>Open Issues</th></tr></thead>'
									+'<tfoot><tr><th colspan="6">'+ footer +'</th></tr></tfoot><tbody>';

						var gvga,gvgd;
						for(i=0; i<arguments.length; i++)
						{
							gvga = arguments[i][0];
							if(gvga && (gvga.meta.status===200 || gvga.meta.status===304))
							{
								gvgd = gvga.data;

								gvgtbl += '<tr><td title="'+ gvgd.description +'"><a href="'+ gvgd.html_url +'" target="_blank">'+ gvgd.full_name +'</a></td><td>'+ new Date(gvgd.created_at).toDateString().replace(/[a-z]+ (.*?)/i,'') +'</td><td>'+ new Date(gvgd.updated_at).toDateString().replace(/[a-z]+ (.*?)/i,'') +'</td><td align="right">'+ gvgd.watchers_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') +'</td><td align="right">'+ gvgd.forks_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') +'</td><td align="right">'+ gvgd.open_issues_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') +'</td></tr>';
							}
							else if(gvga && gvga.meta.status===403)
							{
								gvgtbl += '<tr><td colspan="6" align="center">'+ gvga.data.message +'</td></tr>';
								break;
							}
						}

						$gvg.html(gvgtbl +'</tbody></table>');
					});
				}
			}
		});
	}
}(jQuery));