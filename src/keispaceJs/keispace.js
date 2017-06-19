(function (window){
    var keispace = {};


//pointing function(method reference)
keispace.Delegate = {};
keispace.Delegate.Create = function(delegateInstance, pointingMethod){
    return function(){
        return pointingMethod.apply(delegateInstance, arguments);
    }
}

keispace.PageLifeCycle = {};
//pageOnLoad eventhandler
keispace.PageLifeCycle.OnLoadHandler = function(){
    if(window.Page_Load)window.Page_Load();
    var headID = document.getElementsByTagName("head")[0];
    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    cssNode.href = './src/keispaceJs/css/keispace.css';
    headID.appendChild(cssNode);
}
//pageOnUnLoad eventhandler
keispace.PageLifeCycle.OnUnLoadHandler = function(){

    if(window.Page_UnLoad)window.Page_UnLoad();
}

keispace.DTOFactory = {};
//work only  property type is not function
keispace.DTOFactory.Create = function(){
    return {
        Add : function(PropertyName){
            if(typeof(this[PropertyName]) != "function")
                this[PropertyName] = null;
        },
        Del : function(PropertyName){
            if(typeof(this[PropertyName]) != "function")
                delete this[PropertyName];
        },
        Clear : function(){
            for(var PropertyName in this)
                if( typeof(this[PropertyName]) != "function" )
                    delete this[PropertyName];
            },
            Count : function(){
                var count = 0;
                for (var PropertyName in this)  
                    if(typeof(this[PropertyName])!="function")
                        count++;
                    return count;
                }
            }
        }

        keispace.DOM = {};
        keispace.DOM.$ = function(elementId){
            return document.getElementById(elementId);
        }
        keispace.DOM.$s = function(elementName){
            return document.getElementsByName(elementName);
        }


//Delegate 설정
OnLoadCallBack = keispace.Delegate.Create(this, keispace.PageLifeCycle.OnLoadHandler);
OnUnLoadCallBack = keispace.Delegate.Create(this, keispace.PageLifeCycle.OnUnLoadHandler);

//$ = keispace.Delegate.Create(this, keispace.DOM.$);
$ =  function(elementId){
            return document.getElementById(elementId);
        }

$s = keispace.Delegate.Create(this, keispace.DOM.$s);


//togle pending 기능 
//div.pending 으로 처리함. 
keispace.Pending={};
//3가지 방법.
keispace.Pending.pendingInterval = false;
keispace.Pending.setPending = function(){
    if (!keispace.Pending.pendingInterval){
        keispace.Pending.pendingInterval = setInterval(keispace.Pending.startPending, 500);
    }else{
        clearInterval(keispace.Pending.pendingInterval);
        keispace.Pending.pendingInterval=false;
    }
}
keispace.Pending.startPending = function (){
    var div = $("pending");
    if (div.innerHTML.length > 12) { div.innerHTML = "Pending"; } div.innerHTML += ".";
}




keispace.Pending.setPending3 = function () { 
    var pendingInterval = false, div = $("pending3"); // #1 
    function startPending() { // #2 
        if (div.innerHTML.length > 13) { 
         div.innerHTML = "Pending3"; 
         } 
     div.innerHTML += "."; 
    }; 
    setPending3 = function () { // #3 
        if (!pendingInterval) { 
            pendingInterval = setInterval(startPending, 500); 
        } else { 
            clearInterval(pendingInterval); 
            pendingInterval = false;
            } 
         }; 
         setPending3(); 
     };









(function(){
    window.onload= OnLoadCallBack;
    window.onunload = OnUnLoadCallBack;
})();

window.keispace = keispace;



})(window);

