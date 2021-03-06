var qclean = qclean || {};

console.log("Load qclean.js");

qclean.removeADsLink = function(){

    var adsLink = document.getElementsByClassName("adsCategoryTitleLink");
    var combo = 0;
    while(adsLink.length>0){
        for(var i=0;i<adsLink.length;i++){
            var target = adsLink[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            target.parentNode.removeChild(target);
            console.log('Remove ads');
        }
        adsLinkk = document.getElementsByClassName("adsCategoryTitleLink");
        combo++;
        if(combo>3){
            //TODO - need notify
            console.log("Found but can not remove Q____Q");
        }
    }
};

if(qclean.storyClassNames==undefined){
    qclean.storyClassNames = [
        "_6ns _8ru _59hp",
        "_6ns _5jmm _5jmm",
        "_5jmm _5pat _5srp",
        "_5jmm _5pat _5uch",
        "_5uch _5jmm _5pat",
        "_4-u2 mbm _5jmm _5pat _5v3q _5sq8 _5x16"
        ];
}

qclean.removeSponsored = function(){

    var sp = document.getElementsByClassName("uiStreamAdditionalLogging");
    var combo = 0;
    while(sp.length>0){
        for(var i = 0;i<sp.length;i++){
            var n = sp[i];
            var found = false;
            while(n!=null && n!=undefined){
                if(n.nodeName=="LI"){   //for old facebook ui
                    if(n.classList.contains("uiStreamStory")){
                        found = true;
                        break;
                    } 
                }else if(n.nodeName=="DIV"){    //for newer facebook ui
                    if(n.dataset.ft && JSON.parse(n.dataset.ft).mf_story_key){
                        found = true;
                        break;
                    } 
                }
                n = n.parentElement;
            }
            if(found){
                n.parentElement.removeChild(n);
                console.log('Remove sponsored post');
            }else{
                //TODO FIXME
                //There are ads but this add-on cannot remove it.
            }
        }
        sp = document.getElementsByClassName("uiStreamAdditionalLogging");
        combo++;
        if(combo>3){
            //TODO - notify there is some thing new/unknow
            console.log("Found but can not remove Q____Q");
            break;
        }
    }
};

qclean.removeSponsored();
qclean.removeADsLink();

//Override xhr
if(XMLHttpRequest.prototype.overrideByQCLean===undefined){

    var originXHRopen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        /*
            arguments[0] - method
            arguments[1] - url, but some ajax request is not a string 
                           (facebook graph api?), so need to check this 
                           argument's type.
        */
        if(arguments.length>2&&typeof arguments[1] == "string"
            &&arguments[1].match("/ajax/pagelet/generic.php/WebEgoPane")){
        
            console.log('Block ads ajax request'); 
        }else{
            originXHRopen.apply(this,arguments);
        }
    }
    XMLHttpRequest.prototype.overrideByQCLean = true;

}

//Override DIV appendChild
if(HTMLDivElement.prototype.overrideByQCLean===undefined){

    var originDivAppend = HTMLDivElement.prototype.appendChild;
    HTMLDivElement.prototype.appendChild = function(){
        originDivAppend.apply(this,arguments); 
        qclean.removeADsLink();
    
        //For new fb newsfeed
        qclean.removeSponsored();
    }
    HTMLDivElement.prototype.overrideByQCLean = true;

}

//Override UL appendChild
if(HTMLUListElement.prototype.overrideByQCLean===undefined){

    var originUlAppend = HTMLUListElement.prototype.appendChild;
    HTMLUListElement.prototype.appendChild = function(){ 
        originUlAppend.apply(this,arguments); 
        qclean.removeSponsored();
    }
    HTMLUListElement.prototype.overrideByQCLean = true;

}

