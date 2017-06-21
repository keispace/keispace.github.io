(function (window){
    var keispace = {};

//function에 prototype 안쓰고 걍 method로 우회.
Function.prototype.method = function(name, func){
    if(!this.prototype[name]){
    this.prototype[name] = func;
    return this;
    }
};

Function.method('curry',function(){
    var slice = Array.prototype.slice,
        args = slice.apply(arguments), 
        that = this;
    return function(){
        return that.apply(null,args.concat( slice.apply(arguments)));
    };
});

//string.trim();
String.method('trim',function(){
    return this.replace(/^\s+|\s+$/g,'');
});

//get integer from number
Number.method('integer',function(){
    return Math[this<0?'ceiling' : 'floor'](this);
});

if (typeof Object.create !== 'function'){
    Object.create = function(o){
        var F = function(){};
        F.prototype = o;
        return new F();
    };
}

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

$ = keispace.Delegate.Create(this, keispace.DOM.$);
//$ =  function(elementId){
//            return document.getElementById(elementId);
//        }

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
};
keispace.Pending.startPending = function (){
    let div = $("pending");
    if (div.innerHTML.length > 12) { div.innerHTML = "Pending"; } div.innerHTML += ".";
};


keispace.setTest = function(obj,text){
     console.log(obj);
    if (obj.value){
       console.log("has value");
        obj.value = text ;
    }else{
      obj.innerHTML = text ;
    };
};


(function(){
    window.onload= OnLoadCallBack;
    window.onunload = OnUnLoadCallBack;
})();

window.keispace = keispace;



})(window);

