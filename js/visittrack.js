var _SESSION_TIME_OUT = 1000 * 60*30;
var _USER_EXPIRE = 1000 * 60*60*24*730; 
	var VisitTrack = {
	visittrack_log : function (_pk_site, _pk_pkurl) {
		var bklist={
				"ZTS_ZT_ZH_CN_2014022800145": {
					"tkhrq.com": "N",
					"www.tkhrq.com": "N",
					"drjnkj.com": "Y",
					"www.drjnkj.com": "Y"
				}
			};
		if(_pk_site&&bklist[_pk_site]){
			var dm = document.domain;
			if(bklist[_pk_site][dm]=="N") return;
		}
			if(_pk_site == '25') _pk_site = 'SCHEMA_25';// just for caixun. pls DELETE before release version.
	        if (_pk_cookie == 0)return;
	        
	        //alert("绗竴娆�:"+VisitTrack.getSessionValue());
	        //鍒ゆ柇鏉ユ簮鏄惁涓虹┖,濡傛灉涓嶄负绌�.鍒ゆ柇鏄惁闇€瑕佸垱寤烘柊鐨剆ession
	        if(_pk_rtu==null||_pk_rtu==""){
	        	
	        }else{
	        	var _pk_domain = getRootDomain(document.domain);
	        	var _pk_refferDomain = getRootDomain(_pk_rtu);
	        	if(_pk_domain != _pk_refferDomain){
	        		VisitTrack.setSessionCookie("BROWSEID", VisitTrack.generateUuid());
	        		//alert("ID鍙樹负:"+VisitTrack.getSessionValue());
	        	} 	 
	        }
	        	        
	        var _pk_src = VisitTrack._pk_getUrlLog( _pk_site, _pk_pkurl);
	        var i = new Image();
	        i.src = _pk_src;
	        //document.write(_pk_src);
	        VisitTrack._pk_init_tracker(_pk_site, _pk_pkurl);
	    },
	     _pk_getUrlLog : function ( _pk_site, _pk_pkurl) {
	  
	        var _pk_url = document.location.href;
	        var tmpPos = _pk_url.indexOf('?bdclkid=')
	        if (tmpPos>-1){
	        	_pk_url = _pk_url.substring(0,tmpPos);
	        }
	        var _pk_src = _pk_pkurl
	                + '?url==' + document.location.href
	                + '&&sid==' + _pk_site+ '&&in==1'
	                + '&&res==' + screen.width + 'x' + screen.height + '&&col==' + screen.colorDepth
	                + '&&fla==' + _pk_fla + '&&dir==' + _pk_dir + '&&qt==' + _pk_qt + '&&realp==' + _pk_rea + '&&pdf==' + _pk_pdf
	                + '&&wma==' + _pk_wma + '&&java==' + _pk_jav + '&&cookie==' + _pk_cookie
	                + '&&title==' + _pk_title
	                + '&&urlref==' + _pk_rtu;
	        _pk_src += '&&flver==' + VisitTrack.getFlash() + VisitTrack.getProductInfo();
	        if (VisitTrack.isReturn()) {
	            _pk_src += '&&vid==' + VisitTrack.getCookieValue() + '&&isnewv==0';
	        } else {
	            _pk_src += '&&vid==' + VisitTrack.getCookieValue() + '&&isnewv==1';
	        }
	        if (VisitTrack.isNewSession()) {
	            _pk_src += '&&bid==' + VisitTrack.getSessionValue() + '&&isnewb==1';
	        } else {
	            _pk_src += '&&bid==' + VisitTrack.getSessionValue() + '&&isnewb==0';
	        }
	        _pk_src += '&&tid==' + _PAGE_TRACK_ID;
	        _pk_src += '&&pvc==' + VisitTrack.getCookie('pvc');
	        _pk_src += '&&vct==' + VisitTrack.getCookie('vct');
	        _pk_src += '&&rd==' + VisitTrack.getCookie('rd');
	        var cusName = VisitTrack.getCookie('c_memberaccount');
	        if(cusName==null || typeof(cusName)=='undefined')cusName='';
	        _pk_src += '&&ca==' + cusName;
	        return _pk_src;
	    },
	     _pk_getExitUrlLog : function () {
	     	var  pageClose = new Date();
	            var _pk_src = _pk_tracker_url
	                    + '?url=' + VisitTrack._pk_escape(document.location.href)
	                    + '&bid=' +_BID
	                    + '&sid=' + _pk_tracker_site 
	                    + '&vid=' + _VID
	                    + '&tid=' + _PAGE_TRACK_ID
	                    + '&pvc=' + VisitTrack.getCookie('pvc')
	                    + '&in=0';
	       	 return _pk_src;
	    },
	    
	    _pk_init_tracker : function (_pk_site, _pk_pkurl){
	        if (typeof(visittrack_install_tracker) != "undefined")
	            _pk_install_traCker = visittrack_install_tracker;
	        if (typeof(visittrack_tracker_pause) != "undefined")
	            _pk_tracker_pause = visittrack_tracker_pause;
	        if (typeof(visittrack_download_extensions) != "undefined")
	            _pk_download_extensions = visittrack_download_extensions;
	        _pk_hosts_alias = ( typeof(visittrack_hosts_alias) != "undefined" ? visittrack_hosts_alias : new Array());
	        _pk_hosts_alias.push(window.location.hostname);
	        if (!_pk_install_tracker)
	            return;
	        _pk_tracker_site = _pk_site;
	        _pk_tracker_url = _pk_pkurl;
	    },

	    isReturn : function () {
	        var vid = VisitTrack.getCookieValue();
	        if (vid == "noCookie"){
	            var GUID = VisitTrack.generateUuid();
	            _VID = GUID;
	            VisitTrack.setCookie("GUID", GUID);
	            return false;
	        }else{
	             _VID = vid;
	             VisitTrack.setCookie("GUID", _VID);
	            return true;
	        }
	    },
	  
	    isNewSession : function () {
	       var sessionValue = VisitTrack.getSessionValue();
	       
	        if (sessionValue == "noSession"||!VisitTrack.getSessionFlag()) {
	            var BROWSEID = VisitTrack.generateUuid();
	            _BID = BROWSEID;
	            VisitTrack.setSessionCookie("BROWSEID", BROWSEID);
	             VisitTrack.setSessionFlag("existFlag");
	             VisitTrack.setSessionCookie("pvc", '1');
	             VisitTrack.setSessionCookie("rd", _pk_rtu);
	             VisitTrack.vctPlus();
	            return true;
	        } else {
	         VisitTrack.pvcPlus();
	          _BID = sessionValue;
	           VisitTrack.setSessionCookie("BROWSEID", _BID);//寤舵椂BROWSEID澶辨晥鏃堕棿
	           var tmpRd = VisitTrack.getCookie('rd');
	           if(tmpRd=='undefine')
	           tmpRd = _pk_rtu;
	           VisitTrack.setSessionCookie("rd",tmpRd);
	            return false;
	        }
	       
	    },
	    setSessionCookie : function (name, value) {
	        var expdate = new Date();
	        var times = expdate.getTime() + _SESSION_TIME_OUT; //璁剧疆璁垮杩囨湡鏃堕棿
	        expdate.setTime(times);
	        document.cookie = name + "=" + escape(value)+ ";domain="+getRootDomain(document.domain)+";path=/;expires="+ expdate.toGMTString();
	    },
	    getSessionValue : function () {
	        var browseid = VisitTrack.getCookie("BROWSEID");
	        if (browseid != null){
	            return browseid;
	        }else{
	            return "noSession";
	        }
	    },
	    //create session exist flag
	    setSessionFlag : function (name) {
	    	document.cookie = name + "=1;domain="+getRootDomain(document.domain)+";path=/";
	    },
	    getSessionFlag : function () {
	    	var flag = VisitTrack.getCookie("existFlag");
	    	if (flag != null){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    },
	    setCookie : function (name, value) {
	        var expdate = new Date();
 	        var times = expdate.getTime() + _USER_EXPIRE; 
	        expdate.setTime(times);
	        document.cookie = name + "=" + escape(value)+ ";domain="+getRootDomain(document.domain)+";path=/;expires="+ expdate.toGMTString();
	    },
	    delCookie : function (name) {
	        var exp = new Date();
	        exp.setTime(exp.getTime() - 1);
	        var cval = getCookie(name);
	        document.cookie = name + "=" + cval + ";domain="+getRootDomain(document.domain)+";path=/;expires=" + exp.toGMTString();
	    },
	    getCookie : function (fname) {
	        var name,value;
	        var cookies = new Object();
	        var beginning,middle,end;
	        beginning = 0;
	        while (beginning < document.cookie.length) {
	            middle = document.cookie.indexOf("=", beginning);
	            end = document.cookie.indexOf(";", beginning);
	            if (end == -1) {
	                end = document.cookie.length;
	            }
	            if ((middle > end) || (middle == -1)) {
	                name = document.cookie.substring(beginning, end);
	                value = "";
	            }
	            else {
	                name = document.cookie.substring(beginning, middle);
	                value = document.cookie.substring(middle + 1, end);
	            }
	            if (name == fname) {
	                return unescape(value);
	            }
	            beginning = end + 2;
	        }
	    },
	    getCookieValue : function () {
	        var guid = VisitTrack.getCookie("GUID");
	        if (guid != null) {
	            return guid;
	        } else {
	            return "noCookie";
	        }
	    },
	   pvcPlus:function(){
	        	var pvc = VisitTrack.getCookie('pvc');
	        	if(pvc!=null){
	        	      pvc++;
	        	}else{
	        	      pvc=1;	
	        	}
	        	VisitTrack.setSessionCookie('pvc', pvc);
	        },
	        vctPlus:function(){
	        	var vct = VisitTrack.getCookie('vct');
	        	if(vct!=null){
	        	      vct++;
	        	}else{
	        	      vct=1;	
	        	}
	        	VisitTrack.setCookie('vct', vct);
	        },
	    generateUuid:function () {
	      var chars = '0123456789abcdef'.split('');
	      var uuid = [], rnd = Math.random, r;
	      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	      uuid[14] = '4'; // version 4
	      for (var i = 0; i < 36; i++){
	        if (!uuid[i]){
	          r = 0 | rnd()*16;
	         uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
	         }
	      }
	     return uuid.join('');
	    },
	    getFlash : function () {
	        var f = "-1",n = navigator;
	        if (n.plugins && n.plugins.length) {
	            for (var ii = 0; ii < n.plugins.length; ii++) {
	                if (n.plugins[ii].name.indexOf('Shockwave Flash') != -1) {
	                    f = n.plugins[ii].description.split('Shockwave Flash ')[1];
	                    break;
	                }
	            }
	        } else if (window.ActiveXObject) {
	            for (var ii = 10; ii >= 2; ii--) {
	                try {
	                    var fl = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + ii + "');");
	                    if (fl) {
	                        f = ii + '.0';
	                        break;
	                    }
	                }
	                catch(e) {
	                }
	            }
	        }
	        if (f == "-1")
	            return f;
	        else
	            return f.substring(0, f.indexOf(".") + 2);
	    },
	    _pk_plug_normal : function (_pk_pl) {
	        if (_pk_tm.indexOf(_pk_pl) != -1 && (navigator.mimeTypes[_pk_pl].enabledPlugin != null))
	            return '1';
	        return '0';
	    },
	    _pk_plug_ie : function (_pk_pl) {
	        pk_found = false;
	        document.write('<SCR' + 'IPT LANGUAGE=VBScript>\n on error resume next \n pk_found = IsObject(CreateObject("' + _pk_pl + '")) </SCR' + 'IPT>\n');
	        if (pk_found) return '1';
	        return '0';
	    },
	    _pk_escape : function (_pk_str) {
	        if (typeof(encodeURIComponent) == 'function') {
	            return encodeURIComponent(_pk_str);
	        } else {
	            return escape(_pk_str);
	        }
	    },
	    _pk_add_event : function (elm, evType, fn, useCapture) {
	        if (elm.addEventListener) {
	            elm.addEventListener(evType, fn, useCapture);
	            return true;
	        } else if (elm.attachEvent) {
	            var r = elm.attachEvent('on' + evType, fn);
	            return r;
	        } else {
	            elm['on' + evType] = fn;
	        }
	    },
	    
	    _pk_dummy : function () {
	        return true;
	    },
	    _pk_pause : function (_pk_time_msec) {
	        var _pk_now = new Date();
	        var _pk_expire = _pk_now.getTime() + _pk_time_msec;
	        while (_pk_now.getTime() < _pk_expire)
	            _pk_now = new Date();
	    },
	    visittrack_track : function (url, _pk_site, _pk_url, _pk_type) {
	        var _pk_image = new Image();
	        _pk_image.onLoad = function() {
	            _pk_dummy();
	        };
	        _pk_image.src = _pk_url + '?idsite=' + _pk_site + '&' + _pk_type + '=' + escape(url) + '&rand=' + Math.random() + '&redirect=0';
	        _pk_pause(_pk_tracker_pause);
	    },
	
	    _pk_is_site_hostname : function (_pk_hostname) {
	        for (i = 0; i < _pk_hosts_alias.length; i++)
	            if (_pk_hostname == _pk_hosts_alias[i])
	                return true;
	        return false;
	    },
	
	    getRegUserCookie : function () {
	        return;
	    },
	    getProductInfo: function(){
	    	var _v_id  = '';
	    	if(document.getElementsByName('v_id')[0])
	    		_v_id = document.getElementsByName('v_id')[0].value;
	    	var _v_nm  = '';
	    	if(document.getElementsByName('v_nm')[0])
	    		_v_nm = document.getElementsByName('v_nm')[0].value;
	    	var _v_tp  = '';
	    	if(document.getElementsByName('v_tp')[0])
	    		_v_tp = document.getElementsByName('v_tp')[0].value;
	    	var _v_ct = '';
	    	var els = document.getElementsByName('v_ct');
	    	if(els && els.length>0){
	    		for(var i=0;i<els.length ;i++){
	    			_v_ct += els[i].value+'~:';
	    		}
	    	}
	    	var _v_br = '';
	    	if(document.getElementsByName('v_br')[0])
	    		_v_br = document.getElementsByName('v_br')[0].value;
	    	var result ='';
	    	if(_v_id!='') {
	    		result +='&&_v_id=='+_v_id;
	    	}else{
	    		return '';
	    	}
	    	if(_v_nm!='') result +='&&_v_nm=='+_v_nm;
	    	if(_v_tp!='') result +='&&_v_tp=='+_v_tp;
	    	if(_v_ct!='') result +='&&_v_ct=='+_v_ct;
	    	if(_v_br!='') result +='&&_v_br=='+_v_br;
	    	return encodeURI(result);
	    }
	    
	};
	
	var _PAGE_TRACK_ID =  VisitTrack.generateUuid();
	var _pk_use_title_as_name = 0;
	var _pk_install_tracker = 1;
	var _pk_tracker_pause = 500;
	var _pk_download_extensions = "7z|aac|avi|csv|doc|exe|flv|gif|gz|jpe?g|js|mp(3|4|e?g)|mov|pdf|phps|png|ppt|rar|sit|tar|torrent|txt|wma|wmv|xls|xml|zip";
	var _pk_jav = '0';
	if (navigator.javaEnabled()) _pk_jav = '1';
	var _pk_agent = navigator.userAgent.toLowerCase();
	var _pk_moz = (navigator.appName.indexOf("Netscape") != -1);
	var _pk_ie = (_pk_agent.indexOf("msie") != -1);
	var _pk_win = ((_pk_agent.indexOf("win") != -1) || (_pk_agent.indexOf("32bit") != -1));
	var _pk_cookie = (navigator.cookieEnabled) ? '1' : '0';
	if ((typeof (navigator.cookieEnabled) == "undefined") && (_pk_cookie == '0')) {
	    document.cookie = "_pk_testcookie";
	    _pk_cookie = (document.cookie.indexOf("_pk_testcookie") != -1) ? '1' : '0';
	}
	var _pk_dir = '0',_pk_fla = '0',_pk_pdf = '0',_pk_qt = '0',_pk_rea = '0',_pk_wma = '0';
	if (_pk_win && _pk_ie) {
	    _pk_dir = VisitTrack._pk_plug_ie("SWCtl.SWCtl.1");
	    _pk_fla = VisitTrack._pk_plug_ie("ShockwaveFlash.ShockwaveFlash.1");
	    if (VisitTrack._pk_plug_ie("PDF.PdfCtrl.1") == '1' || VisitTrack._pk_plug_ie('PDF.PdfCtrl.5') == '1' || VisitTrack._pk_plug_ie('PDF.PdfCtrl.6') == '1') _pk_pdf = '1';
	    _pk_qt = VisitTrack._pk_plug_ie("Quicktime.Quicktime");
	    _pk_rea = VisitTrack._pk_plug_ie("rmocx.RealPlayer G2 Control.1");
	    _pk_wma = VisitTrack._pk_plug_ie("wmplayer.ocx");
	} else {
	    var _pk_tm = '';
	    for (var i = 0; i < navigator.mimeTypes.length; i++)
	        _pk_tm += navigator.mimeTypes[i].type.toLowerCase();
	
	    _pk_dir = VisitTrack._pk_plug_normal("application/x-director");
	    _pk_fla = VisitTrack._pk_plug_normal("application/x-shockwave-flash");
	    _pk_pdf = VisitTrack._pk_plug_normal("application/pdf");
	    _pk_qt = VisitTrack._pk_plug_normal("video/quicktime");
	    _pk_rea = VisitTrack._pk_plug_normal("audio/x-pn-realaudio-plugin");
	    _pk_wma = VisitTrack._pk_plug_normal("application/x-mplayer2");
	}
	var _pk_rtu = '';
	if (_pk_rtu == '') {
	    _pk_rtu = document.referrer;
	}
	var _pk_title = '';
	if (document.title && document.title != "") _pk_title = VisitTrack._pk_escape(document.title);
	var _pk_tracker_site, _pk_tracker_url;
	var _BID,_VID;
	
	//鑾峰彇鍩熷悕(鍖呮嫭IP)
	function getRootDomain(domainUrl) {
		var nations ="ad,ae,af,ag,ai,al,am,ao,ar,at,au,az,bb,bd,be,bf,bg,bh,bi,bj,bl,bm,bn,bo,br,bs,bw,by,bz,ca,cf,cg,ch,ck,cl,cm,cn,co,cr,cs,cu,cy,cz,de,dj,dk,do,dz,ec,ee,eg,es,et,fi,fj,fr,ga,gb,gd,ge,gf,gh,gi,gm,gn,gr,gt,gu,gy,hk,hn,ht,hu,id,ie,il,in,iq,ir,is,it,jm,jo,jp,ke,kg,kh,kp,kr,kt,kw,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,mg,ml,mm,mn,mo,ms,mt,mu,mv,mw,mx,my,mz,na,ne,ng,ni,nl,no,np,nr,nz,om,pa,pe,pf,pg,ph,pk,pl,pr,pt,py,qa,ro,ru,sa,sb,sc,sd,se,sg,si,sk,sl,sm,sn,so,sr,st,sv,sy,sz,td,tg,th,tj,tm,tn,to,tr,tt,tw,tz,ua,ug,us,uy,uz,vc,ve,vn,ye,yu,za,zm,zr,zw";   
		var kinds="ac,ah,biz,bj,cc,com,cq,edu,fj,gd,gov,gs,gx,gz,ha,hb,he,hi,hk,hl,hn,info,io,jl,js,jx,ln,mo,mobi,net,nm,nx,org,qh,sc,sd,sh,sn,sx,tj,tm,travel,tv,tw,ws,xj,xz,yn,zj";
		var doint = 0;
		var domain = "";
		if(doint = domainUrl.indexOf('://')>-1){
			domainUrl = domainUrl.substring(doint+6);
			
			if(domainUrl.indexOf(':') != -1){
				domainUrl = domainUrl.substring(0,domainUrl.indexOf(':'));
			}else
				domainUrl = domainUrl.substring(0,domainUrl.indexOf('/'));
		}
		domain = domainUrl;
		if(domain.match(/((\d+)\.){3}(\d+)/g))
			return domain;
		var arr = domain.split('\.');
		var len = arr.length;
		if(nations.indexOf(arr[len-1])>=0&&kinds.indexOf(arr[len-2])>=0){
			return arr[len-3]+"\."+arr[len-2]+"\."+arr[len-1];
		}
		return arr[len-2]+"\."+arr[len-1];
	}
	