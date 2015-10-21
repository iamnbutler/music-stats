function type(t){return t.value=+t.value,t}var height=450,width=9900,barWidth=40,unitWidth=140,barSpace=unitWidth-barWidth,y=d3.scale.linear().range([height,0]);d3.tsv("data/data.tsv",type,function(t,e){var a=d3.select(".app-chart-output").attr("width",function(t){return e.length*barSpace+400}).attr("height",height+100);y.domain([0,d3.max(e,function(t){return t.value})]);var r=a.selectAll("g").data(e).enter().append("g").attr("id",function(t,e){return"b"+e}).attr("class","bar").attr("transform",function(t,e){return"translate("+e*barSpace+",0)"}).attr("title",function(t){return t.title}).attr("artist",function(t){return t.artist}).attr("album",function(t){return t.album}).attr("plays",function(t){return t.value}).attr("dAdded",function(t){return t.dAdded}).attr("rank",function(t){return i});r.append("rect").attr("y",function(t){return y(t.value)}).attr("height",function(t){return height-y(t.value)}).attr("width",barWidth).attr("style",function(t,e){return"fill: url(#g-"+e+")"}),chartLabels=d3.select("#chart-labels"),$("#chart-labels").css("width",function(t){return e.length*barSpace+400}),$("#app-chart-output").on("mouseenter",".bar",function(){var t=$(this);id=t.attr("id"),title=t.attr("title"),pos=t.position(),posLeft=parseInt(pos.left)+100,console.log(posLeft);var e=$('<div class="chart-label" id="label'+id+'" style="left: '+posLeft+'px">'+title+"</div>");e.appendTo(chartLabels)}),$("#app-chart-output").on("mouseleave",".bar",function(){chartLabels.html("")});var n=[];n=e.map(function(t){return t.artist}).sort();for(var n=n.reduce(function(t,e){return t.indexOf(e)<0&&t.push(e),t},[]),o=d3.select(".artistDropdown"),i=0;i<n.length;i++)o.append("option").attr("value",i).text(n[i]);var u=[];u=e.map(function(t){return t.album}).sort();for(var u=u.reduce(function(t,e){return t.indexOf(e)<0&&t.push(e),t},[]),s=d3.select(".albumDropdown"),i=0;i<u.length;i++)s.append("option").attr("value",i).text(u[i]);var l=[];l=e.map(function(t){return t.dAdded}),playsOrdered=e.map(function(t){return t.value});for(var i=0;i<l.length;i++){var c=Date.parse(l[i]);z=(c-14e11)/1e3/14734120*(playsOrdered[i]-8),l[i]=Math.floor(z),a.select("defs").append("linearGradient").attr("id","g-"+i).attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",1).html(function(){var t='<stop class="stop'+i+'-2" offset="0%"/>',e='<stop class="stop'+i+'-1" offset="100%"/>';return t+e}),a.select("defs").append("style").attr("type","text/css").html(function(){var t=".stop"+i+"-1 { stop-color: rgb("+(60+l[i])+",24,225); stop-opacity: 1; }",e=".stop"+i+"-2 { stop-color: rgb("+(120+l[i])+", 42,84); stop-opacity: 1; }";return t+e})}}),$(document).ready(function(){function t(){s.show(),s.removeClass("bounceOutRight").addClass("bounceInRight")}function e(){l.show(),$("#close").show().removeClass("bouncOut").addClass("fadeIn"),l.removeClass("bounceOutRight").addClass("bounceInRight")}function a(){s.removeClass("bounceInRight").addClass("bounceOutRight"),window.setTimeout(function(){s.hide()},800)}function r(t){var e=t.attr("title"),a=t.attr("album"),r=t.attr("artist"),n=t.attr("plays");$("#modal-i-title").html(e),$("#modal-i-artist").html(r),$("#modal-i-album").html(a),$("#modal-i-plays").html(n+" Plays"),$("#footer-search").attr("href","https://www.google.ca/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q="+r+"%20-%20"+a),$("#footer-info").html(r+" - "+a)}function n(t){var e=t.attr("title"),a=t.attr("artist");query=e+" - "+a,o(query)}function o(t){gapi.client.setApiKey("AIzaSyCcoMFVU1juK4tpcn3OhQEb9QUO9rZVVFA"),gapi.client.load("youtube","v3",function(){i(t)})}function i(t){var e=t,a=gapi.client.youtube.search.list({q:e,part:"snippet",maxResults:1});a.execute(function(t){var e=t.result.items[0].id.videoId,a='<iframe width="300" height="169" src="https://www.youtube.com/embed/'+e+'?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';l.html(a)})}$(".app-chart").mousewheel(function(t,e){this.scrollLeft-=30*e,t.preventDefault()});var u=$(".app-overlay"),s=$(".modal-info"),l=$("#modal-video-embed"),c=$("#close"),d;$("#app-chart-output").on("click",".bar",function(){var a=$(this);s.show(),r(a),n(a),t(),e()}),c.click(function(){s.addClass("bounceOutRight"),l.addClass("bounceOutRight"),c.removeClass("fadeIn").addClass("bounceOut"),window.setTimeout(a,800)}),$("#app-chart-output").on("mouseenter",".bar",function(){}),$("#app-chart-output").on("click",".bar",function(){$("#nux").addClass("animated bounceOutUp"),$(".nux-bg").addClass("animated fadeOut")})});