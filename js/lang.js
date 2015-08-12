//var langs = ['en', 'nl', 'ru'];
//var langCode = '';
//var langJS = null;


var translate = function (jsdata)
{	
	$("[tkey]").each (function (index)
	{
		var strTr = jsdata [$(this).attr ('tkey')];
	    $(this).html (strTr);
	});
}


var langCode = 'nl';

//langCode = navigator.language.substr (0, 2);

console.log('+++ langCode = ' +langCode);


//if (langCode in langs)
	$.getJSON('i18n/'+langCode+'.json', translate);
//else
//	$.getJSON('i18n/en.json', translate);



