if(typeof(undefined) == typeof(FW)) FW={};

//主题替换
FW.Theme = function(){
	var
		theme = this;

	var
		$HEAD = undefined
		,$LINK = undefined;

	theme.init = function(){

	};

	theme.apply = function(tname, tns, tpath){
		prepare();
		clearTheme(tname, tns);
		load(tname, tpath, tns);
	};

	theme.release = function(tname, tns){
		clearTheme(tname, tns);
	};

	function prepare(){
		$HEAD = document.getElementsByTagName('head')[0];
		$LINK = document.getElementsByTagName('link');
	};

	function load(name, path, ns){
		var link = document.createElement('link');

		link.rel = 'stylesheet';
		link.id = ns + '-' + name;
		link.setAttribute('theme-name', name);
		link.setAttribute('theme-namespace', ns);
		link.href = path;

		link.onload = function(){
			loaded(name, ns, true);
		};

		link.onerror = function(){
			loaded(name, ns, false);
		};

		link.onabort = function(){
			loaded(name, ns, false);
		};

		$HEAD.appendChild(link);
	};

	function loaded(name, ns, success){
		var tid = ns + '-' + name;

		for(var i=0; i<$LINK.length; i++){
			var $node = $LINK[i];

			if($node.rel != 'stylesheet'){
				continue;
			}

			if($node.id && tid == $node.id){
				$node.disabled = false;
			}
		}
	};

	function clearTheme(name, ns){
		var tid = ns + '-' + name;
		prepare();

		for(var i=0; i<$LINK.length; i++){
			var $node = $LINK[i];

			if($node.id && tid == $node.id){
				$($node).remove();
			}
		}		
	};

	return theme;
};