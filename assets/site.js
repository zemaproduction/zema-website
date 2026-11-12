/* Zema Production website — shared behaviour */
(function(){
'use strict';
document.documentElement.classList.add('js');
var SB='https://emhunzaxnzmqgueryczl.supabase.co',KEY='sb_publishable__ZhIkUFvXPt6oZ0jnoNtfw_Iw2mYNes';
var PLANNER='https://planner.zemaproduction.com/';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function rpc(fn,body){return fetch(SB+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'},body:JSON.stringify(body||{})})}
var safeImg=function(u){u=String(u||'').trim();return /^https:\/\//i.test(u)?u:''};

/* header: transparent over the hero, solid once scrolled */
var hd=$('.hd'),overHero=!!$('.hero');
function onScroll(){if(hd)hd.classList.toggle('solid',!overHero||scrollY>60)}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* mobile menu */
var bg=$('.burger'),mn=$('.mnav');
if(bg&&mn){bg.addEventListener('click',function(){var o=!mn.classList.contains('open');mn.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':'';if(o)hd.classList.add('solid');else onScroll()});
  mn.addEventListener('click',function(e){if(e.target.closest('a'))bg.click()})}

/* hero slideshow */
var slides=$$('.slide'),cur=0,timer=null,cnt=$('.ctrl .n');
function show(i){if(!slides.length)return;slides[cur].classList.remove('on');cur=(i+slides.length)%slides.length;slides[cur].classList.add('on');if(cnt)cnt.textContent=(cur+1)+' / '+slides.length;var v=slides[cur].querySelector('video');if(v){try{v.currentTime=0;var p=v.play();if(p&&p.catch)p.catch(function(){})}catch(_){}}}
function auto(){clearInterval(timer);if(slides.length>1&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(function(){show(cur+1)},6500)}
if(slides.length){show(0);auto();var pv=$('.ctrl .prev'),nx=$('.ctrl .next');if(pv)pv.addEventListener('click',function(){show(cur-1);auto()});if(nx)nx.addEventListener('click',function(){show(cur+1);auto()})}

/* reveal on scroll; never leave anything hidden */
var rs=$$('.rise');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}})},{rootMargin:'0px 0px -6% 0px'});rs.forEach(function(e){io.observe(e)})}
setTimeout(function(){rs.forEach(function(e){e.classList.add('on')})},2200);

/* gallery lightbox */
var gal=$$('.masonry img');
if(gal.length){var lb=document.createElement('div');lb.className='lb';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Photo viewer');
  lb.innerHTML='<img alt=""><button class="x" aria-label="Close">×</button><button class="lp" aria-label="Previous photo">‹</button><button class="ln" aria-label="Next photo">›</button>';document.body.appendChild(lb);var li=0;
  var open=function(i){li=(i+gal.length)%gal.length;var s=gal[li];lb.querySelector('img').src=s.dataset.full||s.currentSrc||s.src;lb.querySelector('img').alt=s.alt;lb.hidden=false;document.body.style.overflow='hidden'};
  var close=function(){lb.hidden=true;document.body.style.overflow=''};
  gal.forEach(function(g,i){g.parentNode.addEventListener('click',function(){open(i)})});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('x'))close();else if(e.target.classList.contains('lp'))open(li-1);else if(e.target.classList.contains('ln'))open(li+1)});
  addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')open(li-1);if(e.key==='ArrowRight')open(li+1)})}

/* services: live packages from the planner */
var wedEl=$('#wed');
if(wedEl){rpc('packages_get').then(function(r){return r.ok?r.json():null}).then(function(d){if(!d)return;
  var hide=!!d.hide;/* package prices stay in the planner's builder; the public cards don't show them */
  var BUILD=PLANNER+'?p=wedding&np=1',wed=Array.isArray(d.wed)?d.wed:[];
  /* features every package shares, shown once below the cards */
  var common=wed.length>1?wed[0].f.filter(function(x){return wed.every(function(k){return (k.f||[]).indexOf(x)>-1})}):[];
  if(wed.length){wedEl.innerHTML=wed.map(function(k){var img=safeImg(k.img),f=(k.f||[]).filter(function(x){return common.indexOf(x)<0}),top=f.slice(0,5),rest=f.slice(5);
    return '<article class="pkg'+(k.star?' star':'')+'">'+(img?'<img class="cover" src="'+esc(img)+'" alt="" loading="lazy" decoding="async">':'')+'<div class="body">'+(k.tag?'<div class="tag">'+esc(String(k.tag).replace(/collection/g,'package').replace(/Collection/g,'Package'))+'</div>':'')+'<h3>'+esc(k.n)+'</h3><p>'+esc(k.d||'')+'</p>'
      +(top.length?'<ul>'+top.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'')
      +(rest.length?'<details class="more"><summary>Explore package</summary><ul>'+rest.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></details>':'')
      +'<div class="acts"><a class="pill'+(k.star?' solid':'')+'" href="../contact/?type=Wedding&amp;package='+encodeURIComponent(k.n)+'">Enquire about this package</a><a class="tl" href="'+BUILD+'" target="_blank" rel="noopener">Build your '+esc(k.n)+' package</a></div></div></article>'}).join('')}
  if(common.length&&$('#common')){$('#commonList').innerHTML=common.map(function(x){return '<li>'+esc(x)+'</li>'}).join('');$('#common').hidden=false}
  if(d.wedNote)$('#wedNote').textContent=d.wedNote;
  var ev=$('#ev');if(ev&&Array.isArray(d.ev)){var rows=d.ev.map(function(k){return '<div class="row"><b>'+esc(k.n)+'</b><span>'+esc(k.d||'')+'</span><a class="tl" href="../contact/?package='+encodeURIComponent(k.n)+'">Enquire</a></div>'});
    if(d.hr&&d.hr.p){rows.push('<div class="row"><b>By the hour</b><span>'+esc(d.hr.d||'')+((d.hr.pp||d.hr.pv)?' Photography only or video only also available.':'')+'</span><a class="tl" href="../contact/?package='+encodeURIComponent('By the hour')+'">Enquire</a></div>')}ev.innerHTML=rows.join('')}
  if(d.evNote)$('#evNote').textContent=d.evNote;
  /* extras, marking the ones a package already includes */
  var ex=$('#extras');if(ex&&Array.isArray(d.addons)&&d.addons.length){if(d.adIntro)$('#adIntro').textContent=d.adIntro;
    ex.innerHTML=d.addons.map(function(a){var img=safeImg(a.img),lines=String(a.d||'').split('\n').map(function(x){return x.trim()}).filter(Boolean);
      var incl=wed.filter(function(k){return (k.inc||[]).indexOf(a.id)>-1||(a.id==='prewedding'&&k.pre)}).map(function(k){return k.n});
      var body=lines.length>1?'<p>'+esc(lines[0].replace(/^[^:]{0,40}:\s*/,''))+'</p><ul>'+lines.slice(1).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'<p>'+esc(lines[0]||'')+'</p>';
      return '<div class="extra">'+(img?'<img src="'+esc(img)+'" alt="" loading="lazy" decoding="async">':'')+'<div class="xrow"><h4>'+esc(a.n)+'</h4>'+'</div>'+(incl.length?'<div class="incl">Included with '+esc(incl.join(' & '))+'</div>':'')+body+'</div>'}).join('')}
  var tm=$('#terms');if(tm&&Array.isArray(d.terms)&&d.terms.length)tm.innerHTML=d.terms.map(function(t){return '<li>'+esc(t)+'</li>'}).join('');
}).catch(function(){})}

/* testimonials: genuine reviews only — from reviews.json (added by hand) and approved planner reviews */
var qEl=$('#quotes');
if(qEl){var base=($('link[rel=icon]').getAttribute('href')||'').replace(/img\/favicon\.png$/,'');
  var fromFile=fetch(base+'reviews.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():[]}).catch(function(){return []});
  var fromPlanner=rpc('reviews_public').then(function(r){return r.ok?r.json():[]}).catch(function(){return []});
  Promise.all([fromFile,fromPlanner]).then(function(res){
    var list=[].concat(Array.isArray(res[0])?res[0]:[],Array.isArray(res[1])?res[1]:[]).filter(function(x){return x&&(x.body||x.quote)});
    if(!list.length)return;
    var photo=function(x){var u=String(x.photo||'').trim();return /^(https:\/\/|img\/)/.test(u)?(u.indexOf('img/')===0?base+u:u):''};
    var stars=function(x){var n=Math.max(0,Math.min(5,+x.rating||0));return n?'<div class="stars" aria-label="'+n+' out of 5">'+'★'.repeat(n)+'</div>':''};
    var who=function(x){return '<cite>'+esc(x.name||'')+(x.event?'<span>'+esc(x.event)+'</span>':'')+'</cite>'};
    var fi=list.findIndex(function(x){return x.featured&&photo(x)});if(fi<0)fi=list.findIndex(function(x){return photo(x)});
    if(fi>-1){var f=list.splice(fi,1)[0];$('#qFeat').innerHTML='<figure class="qfeat rise on"><img src="'+esc(photo(f))+'" alt="'+esc(f.name||'')+'" loading="lazy"><div>'+stars(f)+(f.quote?'<p class="qq">“'+esc(f.quote)+'”</p>':'')+'<blockquote>'+esc(f.body||'')+'</blockquote>'+who(f)+'</div></figure>'}
    $('#qEmpty').hidden=true;qEl.hidden=!list.length;
    qEl.innerHTML=list.map(function(x){var ph=photo(x);return '<figure class="q">'+(ph?'<img src="'+esc(ph)+'" alt="'+esc(x.name||'')+'" loading="lazy">':'')+stars(x)+(x.quote?'<p class="qq">“'+esc(x.quote)+'”</p>':'')+'<blockquote>'+(x.quote?'':'“')+esc(x.body||'')+(x.quote?'':'”')+'</blockquote>'+who(x)+'</figure>'}).join('')}).catch(function(){})}

/* contact form: goes straight into the planner's Enquiries */
var fm=$('#enq');
if(fm){var d=$('#q-date');if(d)d.min=new Date().toISOString().slice(0,10);
  var qs=new URLSearchParams(location.search),pre=qs.get('type'),pkg=(qs.get('package')||'').slice(0,60);if(pre&&$('#q-type'))$('#q-type').value=pre;
  if(pkg&&$('#q-pre')){$('#q-pre').textContent='You’re enquiring about the '+pkg+' package.';$('#q-pre').hidden=false}
  fm.addEventListener('submit',function(e){e.preventDefault();var v=function(id){return ($('#'+id).value||'').trim()},msg=$('#q-msg-out');
    $$('.err',fm).forEach(function(x){x.classList.remove('err')});msg.className='msg';
    var bad=function(id,t){$('#'+id).classList.add('err');$('#'+id).focus();msg.textContent=t;msg.className='msg bad'};
    if(!v('q-name'))return bad('q-name','Please add your name.');
    if(v('q-phone').replace(/\D/g,'').length<7)return bad('q-phone','Please add a phone or WhatsApp number we can reach you on.');
    if($('#q-web').value)return;
    var heard=v('q-heard'),p={name:v('q-name'),phone:v('q-phone'),event_type:v('q-type'),event_date:v('q-date'),message:['Sent from the website (zemaproduction.com)',heard?'Heard about us: '+heard:'',v('q-email')?'Email: '+v('q-email'):'',v('q-venue')?'Venue / location: '+v('q-venue'):'',pkg?'Package: '+pkg:'',v('q-text')].filter(Boolean).join('\n\n')};
    var wa='https://wa.me/447449727801?text='+encodeURIComponent(['Enquiry for Zema Production','Name: '+p.name,'Phone: '+p.phone,p.event_type&&('Event: '+p.event_type),p.event_date&&('Date: '+p.event_date),pkg&&('Package: '+pkg),v('q-text')].filter(Boolean).join('\n'));
    var btn=fm.querySelector('button[type=submit]');btn.disabled=true;msg.textContent='Sending…';
    rpc('enquiry_submit',{p:p}).then(function(r){if(!r.ok)throw 0;
      $('#enqWrap').innerHTML='<div class="sent"><div class="eyebrow">Thank you</div><h2 class="display">Your enquiry is with us</h2><p class="lead">We’ll get back to you about your date as soon as we can. If you’d like a faster reply, send the same details on WhatsApp.</p><a class="pill" href="'+esc(wa)+'" target="_blank" rel="noopener">Send on WhatsApp</a></div>';
    }).catch(function(){btn.disabled=false;msg.className='msg bad';msg.innerHTML='We couldn’t send the form just now. Please <a href="'+esc(wa)+'" target="_blank" rel="noopener" style="text-decoration:underline">send your enquiry on WhatsApp</a> instead.'})})}

var y=$('#yr');if(y)y.textContent=new Date().getFullYear();
})();
