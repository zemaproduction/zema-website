/* Zema Production website — shared behaviour */
(function(){
'use strict';
document.documentElement.classList.add('js');
var SB='https://emhunzaxnzmqgueryczl.supabase.co',KEY='sb_publishable__ZhIkUFvXPt6oZ0jnoNtfw_Iw2mYNes';
var PLANNER='https://zemaproduction.github.io/Zema-planner-/';
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
  var hide=!!d.hide,price=function(p){return hide||!p?'':'<div class="price">'+esc(p)+'</div>'};
  if(Array.isArray(d.wed)&&d.wed.length){wedEl.innerHTML=d.wed.map(function(k){var img=safeImg(k.img);return '<article class="pkg'+(k.star?' star':'')+'">'+(img?'<img class="cover" src="'+esc(img)+'" alt="" loading="lazy" decoding="async">':'')+'<div class="body">'+(k.tag?'<div class="tag">'+esc(k.tag)+'</div>':'')+'<h3>'+esc(k.n)+'</h3>'+price(k.p)+'<p>'+esc(k.d||'')+'</p><ul>'+(k.f||[]).map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul><a class="pill" href="'+PLANNER+'?p=wedding" target="_blank" rel="noopener">Book '+esc(k.n)+'</a></div></article>'}).join('')}
  if(d.wedNote)$('#wedNote').textContent=d.wedNote;
  var ev=$('#ev');if(ev&&Array.isArray(d.ev)){var rows=d.ev.map(function(k){return '<div class="row"><b>'+esc(k.n)+'</b><span>'+esc(k.d||'')+'</span>'+(hide||!k.p?'<i></i>':'<i>'+esc(k.p)+'</i>')+'</div>'});
    if(d.hr&&d.hr.p){rows.push('<div class="row"><b>By the hour</b><span>'+esc(d.hr.d||'')+(d.hr.pp?' Photography only '+esc(d.hr.pp)+'.':'')+(d.hr.pv?' Video only '+esc(d.hr.pv)+'.':'')+'</span>'+(hide?'<i></i>':'<i>'+esc(d.hr.p)+'</i>')+'</div>')}ev.innerHTML=rows.join('')}
  if(d.evIntro)$('#evIntro').textContent=d.evIntro;if(d.evNote)$('#evNote').textContent=d.evNote;
  var ex=$('#extras');if(ex&&Array.isArray(d.addons)&&d.addons.length){if(d.adIntro)$('#adIntro').textContent=d.adIntro;ex.innerHTML=d.addons.map(function(a){var img=safeImg(a.img);var desc=String(a.d||'').split('\n')[0];return '<div class="extra">'+(img?'<img src="'+esc(img)+'" alt="" loading="lazy" decoding="async">':'')+'<h4>'+esc(a.n)+'</h4>'+(hide||!a.p?'':'<div class="price">'+esc(a.p)+'</div>')+'<p>'+esc(desc)+'</p></div>'}).join('')}
  var tm=$('#terms');if(tm&&Array.isArray(d.terms)&&d.terms.length)tm.innerHTML=d.terms.map(function(t){return '<li>'+esc(t)+'</li>'}).join('');
}).catch(function(){})}

/* testimonials: approved reviews from the planner */
var qEl=$('#quotes');
if(qEl){rpc('reviews_public').then(function(r){return r.ok?r.json():null}).then(function(d){var list=Array.isArray(d)?d.filter(function(x){return x&&x.body}):[];if(!list.length)return;
  $('#qEmpty').hidden=true;qEl.hidden=false;qEl.innerHTML=list.map(function(x){var n=Math.max(0,Math.min(5,+x.rating||0));return '<figure class="q">'+(n?'<div class="stars" aria-label="'+n+' out of 5">'+'★'.repeat(n)+'</div>':'')+'<blockquote>“'+esc(x.body)+'”</blockquote><cite>'+esc(x.name||'')+'</cite></figure>'}).join('')}).catch(function(){})}

/* contact form: goes straight into the planner's Enquiries */
var fm=$('#enq');
if(fm){var d=$('#q-date');if(d)d.min=new Date().toISOString().slice(0,10);
  var pre=new URLSearchParams(location.search).get('type');if(pre&&$('#q-type'))$('#q-type').value=pre;
  fm.addEventListener('submit',function(e){e.preventDefault();var v=function(id){return ($('#'+id).value||'').trim()},msg=$('#q-msg-out');
    $$('.err',fm).forEach(function(x){x.classList.remove('err')});msg.className='msg';
    var bad=function(id,t){$('#'+id).classList.add('err');$('#'+id).focus();msg.textContent=t;msg.className='msg bad'};
    if(!v('q-name'))return bad('q-name','Please add your name.');
    if(v('q-phone').replace(/\D/g,'').length<7)return bad('q-phone','Please add a phone or WhatsApp number we can reach you on.');
    if($('#q-web').value)return;
    var heard=v('q-heard'),p={name:v('q-name'),phone:v('q-phone'),event_type:v('q-type'),event_date:v('q-date'),message:['Sent from the website (zemaproduction.com)',heard?'Heard about us: '+heard:'',v('q-email')?'Email: '+v('q-email'):'',v('q-venue')?'Venue / location: '+v('q-venue'):'',v('q-text')].filter(Boolean).join('\n\n')};
    var wa='https://wa.me/447449727801?text='+encodeURIComponent(['Enquiry for Zema Production','Name: '+p.name,'Phone: '+p.phone,p.event_type&&('Event: '+p.event_type),p.event_date&&('Date: '+p.event_date),v('q-text')].filter(Boolean).join('\n'));
    var btn=fm.querySelector('button[type=submit]');btn.disabled=true;msg.textContent='Sending…';
    rpc('enquiry_submit',{p:p}).then(function(r){if(!r.ok)throw 0;
      $('#enqWrap').innerHTML='<div class="sent"><div class="eyebrow">Thank you</div><h2 class="display">Your enquiry is with us</h2><p class="lead">We’ll get back to you about your date as soon as we can. If you’d like a faster reply, send the same details on WhatsApp.</p><a class="pill" href="'+esc(wa)+'" target="_blank" rel="noopener">Send on WhatsApp</a></div>';
    }).catch(function(){btn.disabled=false;msg.className='msg bad';msg.innerHTML='We couldn’t send the form just now. Please <a href="'+esc(wa)+'" target="_blank" rel="noopener" style="text-decoration:underline">send your enquiry on WhatsApp</a> instead.'})})}

var y=$('#yr');if(y)y.textContent=new Date().getFullYear();
})();
