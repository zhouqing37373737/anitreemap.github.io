
/* ========================================================================
 * anitreemap.js v1.0.0
 * animated tree map display 
 *
 * ========================================================================
 * Author:qingzhou
 *
 * Licensed under MIT
 * ======================================================================== */


function Anitreemap(inputobj,containerid,widtth,heighht,userclickfunction){
	var inputsortable=[];
	for(var key in inputobj)
		inputsortable.push([key,inputobj[key]]);
	inputsortable.sort(function(a,b){
		return -a[1]+b[1];
	});
	this.inputobj=inputsortable;
	this.containerid=containerid;
	this.widtth=widtth;
	this.heighht=heighht;
	this.userclickfunction=userclickfunction||null;
}

Anitreemap.colorset=Array('#F0F8FF','#FAEBD7','#00FFFF','#7FFFD4','#F0FFFF','#00008B','#FFE4C4','#FFEBCD',
	'#FAF0E6','#0000FF','#A52A2A','#DEB887','#5F9EA0','#7FFF00','#D2691E','#FF7F50','#6495ED','#8B008B','#DC143C',
	'#00FFFF','#F5F5DC','#FDF5E6','#B8860B','#A9A9A9','#AFEEEE','#BDB76B','#FFF8DC','#556B2F','#FF8C00','#9932CC',
	'#E0FFFF','#E9967A','#8FBC8F','#483D8B','#00FF00','#00CED1','#F0E68C','#FF1493','#00BFFF','#696969','#1E90FF',
	'#B22222','#FFFAF0','#228B22','#ADFF2F','#DCDCDC','#F8F8FF','#FFD700','#DAA520','#808080','#008000','#FF00FF',
	'#F08080','#8B0000','#FAFAD2','#D3D3D3','#90EE90','#FFA07A','#20B2AA','#87CEFA','#FFFAFA','#B0C4DE',
	'#FFFFE0','#2F4F4F','#32CD32','#8A2BE2','#ADFF5F','#800000','#66CDAA','#0000CD','#BA55D3','#9370DB','#3CB371',
	'#7B68EE','#00FA9A','#48D1CC','#C71585','#191970','#F5FFFA','#000080','#FFE4B5','#FFDEAD','#FFE4E1','#008B8B',
	'#808000','#6B8E23','#FFA500','#FF4500','#DA70D6','#EEE8AA','#98FB98','#006400','#DB7093','#FFEFD5','#FFDAB9',
	'#CD853F','#FFC0CB','#DDA0DD','#B0E0E6','#800080','#FF0000','#BC8F8F','#4169E1','#8B4513','#FA8072','#F4A460',
	'#2E8B57','#A0522D','#FFF5EE','#C0C0C0','#87CEEB','#6A5ACD','#708090','#778899','#00FF7F','#4682B4','#D2B48C',
	'#008080','#D8BFD8','#FF6347','#40E0D0','#EE82EE','#F5DEB3','#F5F5F5','#FFFF00','#9ACD32');

Anitreemap.startColor=Math.floor(Math.random()*Anitreemap.colorset.length);
Anitreemap.currentColor=Anitreemap.startColor;

Anitreemap.prototype.assemble=function(minLimit){
	var elements=[];
	var sumvalue=0;
	var assembleNext;
	var that=this;
	//console.log(minLimit);
	return function(name,value){
		if(value=='dump'){
			var returndump;
			if(assembleNext&&(returndump=assembleNext(null,'dump'))){
				elements.push(returndump);
			}
			if(elements.length==1&& 'sum' in elements[0]){
				elements=[].concat(elements[0].elements);
			}
			return {sum:sumvalue,elements:elements};
		}

		sumvalue+=value;
		if(value>minLimit/4){
			elements.push({name:name,value:value});
		}
		else{
			//console.log(that);
			assembleNext=assembleNext||that.assemble(minLimit/4);
			var eletemp;
			if(eletemp=assembleNext(name,value)){
				elements.push(eletemp);
				assembleNext=null;
			}
		}

		if(sumvalue>minLimit&&!assembleNext){
		
			var elereturn=elements;
			var sumvreturn=sumvalue;
			elements=[];
			sumvalue=0;

			return {sum:sumvreturn,elements:elereturn};
		}

		return null;

	}
}

Anitreemap.prototype.handleMargin=function(that,element,minLimit){

	if(element.sum<minLimit){

		var sumvalue=element.sum;
		var elements=element.elements;
		for(var i=0;i<elements.length;i++){
			if('value' in elements[i]){
				elements[i].value=elements[i].value/sumvalue*minLimit;
			}
			else if('sum' in elements[i]){
				that.handleMargin(that,elements[i],elements[i].sum/sumvalue*minLimit);
			}
		}
		element.sum=minLimit;
		return element.sum-sumvalue;
	}
	else{
		return 0;
	}
}
Anitreemap.prototype.serializeTreemap=function(treemapobj,parentsum,parentwidth,parentheight,parentvertical){
	var html='';
	var sum=treemapobj.sum;
	var vertical=!parentvertical;
	var width=vertical?sum/parentsum*parentwidth:parentwidth;
	var height=vertical?parentheight:(sum/parentsum*parentheight);
	//console.log(height);
	//console.log(sum);
	//console.log(parentsum);
	//var prevcolorIndex=0;
    //var prevcolorIndex=Anitreemap.startColor;
	html+='<div style="width:'+width+'px; height:'+height+'px; line-height:'+height+'px;">';
	for (objkey in treemapobj.elements){
		var obj=treemapobj.elements[objkey];
		if(obj.name){
			if(vertical){
				var elewidth=width;
				var eleheight=obj.value/sum*height;
			}
			else{
				var elewidth=obj.value/sum*width;
				var eleheight=height;
			}
			var colorIndex=Anitreemap.currentColor+3;
			if(colorIndex>Anitreemap.colorset.length){
				colorIndex=colorIndex-Anitreemap.colorset.length;
			}
			Anitreemap.currentColor=colorIndex;
			/*
			var colorIndex;
			do{
				colorIndex=Math.floor(Math.random()*Anitreemap.colorset.length);
			}while(Math.abs(prevcolorIndex-colorIndex)<5);
			prevcolorIndex=colorIndex;
			*/

			html+='<div class="tagdiv" style="background-color:'+Anitreemap.colorset[colorIndex]+';';
			if(colorIndex%2==1){
				html+='color:white ;';
			}
			html+='line-height:'+eleheight+'px; width:'+elewidth+'px; height:'+eleheight+'px;">'+obj.name+'</div>';
			
		}
		else{
			html+=this.serializeTreemap(obj,sum,width,height,vertical);
		}
	}
	html+='</div>';
	return html;
}

Anitreemap.prototype.setdiv=function(){
	var sum=0;
	for(var i=0;i<this.inputobj.length;i++)
		sum+=this.inputobj[i][1];
	var assembler=this.assemble(sum);
	for(var i=0;i<this.inputobj.length;i++)
		assembler(this.inputobj[i][0],this.inputobj[i][1]);

	var outjson=assembler(null,'dump');
	
	//console.log(outjson.sum);

	if('sum' in outjson.elements[outjson.elements.length-1]){
		var inc=this.handleMargin(this,outjson.elements[outjson.elements.length-1],sum/4);
		outjson.sum+=inc;
		sum+=inc;
	}
	//console.log(outjson.sum);

	//console.log(outjson);
	//console.log(this.heighht);

	var outhtml=this.serializeTreemap(outjson,sum,this.widtth,this.heighht,true);
	Anitreemap.currentColor=Anitreemap.startColor;
	$("#"+this.containerid).html('<div id="treemapwrapper">'+outhtml+'</div>');
	$("#treemapwrapper").addClass('clearfix');
	if ((func=this.userclickfunction)!=null){

		$("div.tagdiv").bind('click',func);
	}

}

Anitreemap.prototype.animate=function(){
	var that=this;
	$("#"+this.containerid).prepend('<div id="anitreemapreturn" style="width:'+that.widtth+'px ; height:'+that.heighht/10+'px ; line-height:'+that.heighht/10+'px ;">return</div>');

	$(".tagdiv").hover(function(){
		$(this).css('box-shadow','inset 3px 3px 3px rgba(20%,20%,40%,0.5)');
	},function(){
		$(this).css('box-shadow','');
	});


	$("div.tagdiv").bind('click',function(){
		$(this).addClass('focustag').removeClass('tagdiv');   
       	position=$(this).position();
      	$("#treemapwrapper div").not('.focustag').not($('.focustag').parents()).fadeOut('slow',function(){
            $('.focustag').css({'position':'absolute'});
            $('.focustag').css({'left':position.left+'px'});
            $('.focustag').css({'top':position.top+'px'});
            $('.focustag').animate({'width':that.widtth+'px','height':that.heighht+'px',left:'0px',top:'0px'});
      	});

	})
	$('#anitreemapreturn').click(function(){
		that.setdiv();
		that.animate();
	})
}
