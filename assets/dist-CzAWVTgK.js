import{t as e}from"./index-C_R4R27u.js";function t(){let e=new AudioContext,t=e.createGain();t.connect(e.destination);let n=e.createGain();return n.connect(e.destination),{audioCtx:e,gainNode:t,drumGainNode:n}}var n=`0000 Acoustic Grand Piano
0010 Bright Acoustic Piano
0020 Electric Grand Piano
0030 Honky-tonk Piano
0040 Electric Piano 1
0050 Electric Piano 2
0060 Harpsichord
0070 Clavinet
0080 Celesta
0090 Glockenspiel
0100 Music Box
0110 Vibraphone
0120 Marimba
0130 Xylophone
0140 Tubular Bells
0150 Dulcimer
0160 Drawbar Organ
0170 Percussive Organ
0180 Rock Organ
0190 Church Organ
0200 Reed Organ
0210 Accordion
0220 Harmonica
0230 Tango Accordion
0240 Acoustic Guitar (nylon)
0250 Acoustic Guitar (steel)
0260 Electric Guitar (jazz)
0270 Electric Guitar (clean)
0280 Electric Guitar (muted)
0290 Overdriven Guitar
0300 Distortion Guitar
0310 Guitar Harmonics
0320 Acoustic Bass
0330 Electric Bass (finger)
0340 Electric Bass (pick)
0350 Fretless Bass
0360 Slap Bass 1
0370 Slap Bass 2
0380 Synth Bass 1
0390 Synth Bass 2
0400 Violin
0410 Viola
0420 Cello
0430 Contrabass
0440 Tremolo Strings
0450 Pizzicato Strings
0460 Orchestral Harp
0470 Timpani
0480 String Ensemble 1
0490 String Ensemble 2
0500 Synth Strings 1
0510 Synth Strings 2
0520 Choir Aahs
0530 Voice Oohs
0540 Synth Choir
0550 Orchestra Hit
0560 Trumpet
0570 Trombone
0580 Tuba
0590 Muted Trumpet
0600 French Horn
0610 Brass Section
0620 Synth Brass 1
0630 Synth Brass 2
0640 Soprano Sax
0650 Alto Sax
0660 Tenor Sax
0670 Baritone Sax
0680 Oboe
0690 English Horn
0700 Bassoon
0710 Clarinet
0720 Piccolo
0730 Flute
0740 Recorder
0750 Pan Flute
0760 Blown bottle
0770 Shakuhachi
0780 Whistle
0790 Ocarina
0800 Lead 1 (square)
0810 Lead 2 (sawtooth)
0820 Lead 3 (calliope)
0830 Lead 4 (chiff)
0840 Lead 5 (charang)
0850 Lead 6 (voice)
0860 Lead 7 (fifths)
0870 Lead 8 (bass + lead)
0880 Pad 1 (new age)
0890 Pad 2 (warm)
0900 Pad 3 (polysynth)
0910 Pad 4 (choir)
0920 Pad 5 (bowed)
0930 Pad 6 (metallic)
0940 Pad 7 (halo)
0950 Pad 8 (sweep)
0960 FX 1 (rain)
0970 FX 2 (soundtrack)
0980 FX 3 (crystal)
0990 FX 4 (atmosphere)
1000 FX 5 (brightness)
1010 FX 6 (goblins)
1020 FX 7 (echoes)
1030 FX 8 (sci-fi)
1040 Sitar
1050 Banjo
1060 Shamisen
1070 Koto
1080 Kalimba
1090 Bagpipe
1100 Fiddle
1110 Shanai
1120 Tinkle Bell
1130 Agogo
1140 Steel Drums
1150 Woodblock
1160 Taiko Drum
1170 Melodic Tom
1180 Synth Drum
1190 Reverse Cymbal
1200 Guitar Fret Noise
1210 Breath Noise
1220 Seashore
1230 Bird Tweet
1240 Telephone Ring
1250 Helicopter
1260 Applause
1270 Gunshot`;async function r(){let e={};for(let t of n.trim().split(`
`)){let n=t.indexOf(` `);if(n===-1)continue;let r=t.slice(0,n),i=t.slice(n+1);e[i]=r}return e}var i=n.trim().split(`
`).map(e=>e.slice(e.indexOf(` `)+1)),a=e=>{if(!e)return null;let t=e.replace(/\s+/g,``).toLowerCase(),n=i.findIndex(e=>e.replace(/\s+/g,``).toLowerCase()===t);return n>=0?n:null},o=e=>e.rangeStartSec+e.offsetSec+e.fromStep*e.secondsPerStep,s=e=>e.fromStep<=0?Math.max(0,e.offsetSec):0,c=e=>e.rolled&&e.rolled.measured!==!1?Math.max(0,e.rolled.atTime+(e.mediaAtSongStart-e.rolled.mediaSec)-(e.now+e.startDelaySec)):e.fallbackPreRollSec,l=e=>{let t=e.trim();if(t===``)return 0;if(!/^-?(\d+:)?(\d+:)?\d*(\.\d+)?$/.test(t))return null;let n=t.startsWith(`-`),r=(n?t.slice(1):t).split(`:`),i=0;for(let e of r){let t=Number.parseFloat(e===``?`0`:e);if(!Number.isFinite(t))return null;i=i*60+t}return n?-i:i},u=e=>{let t=e<0?`-`:``,n=Math.abs(e),r=Math.floor(n/3600),i=Math.floor(n%3600/60),a=(n%60).toFixed(3).padStart(6,`0`);return r>0?`${t}${r}:${String(i).padStart(2,`0`)}:${a}`:`${t}${i}:${a}`},d=e=>{let t;try{t=new URL(e)}catch{return null}let n=t.hostname.replace(/^www\./,``),r=/^[\w-]{11}$/;if(n===`youtu.be`){let e=t.pathname.slice(1).split(`/`)[0];return r.test(e)?e:null}if(n!==`youtube.com`&&n!==`m.youtube.com`)return null;let i=t.searchParams.get(`v`);if(i&&r.test(i))return i;let a=t.pathname.match(/^\/(?:embed|shorts|v|live)\/([\w-]{11})/);return a?a[1]:null},f=e=>d(e)!==null,p=[`maxresdefault`,`hqdefault`],m=e=>/^[\w-]{11}$/.test(e)?new Promise(t=>{let n=r=>{let i=p[r];if(!i){t(null);return}let a=`https://i.ytimg.com/vi/${e}/${i}.jpg`,o=new Image;o.onload=()=>{o.naturalWidth>120?t(a):n(r+1)},o.onerror=()=>n(r+1),o.src=a};n(0)}):Promise.resolve(null),h=`https://www.youtube.com/iframe_api`,g=null,_=()=>{let e=globalThis;return e.YT?.Player?Promise.resolve(e.YT):(g??=new Promise((t,n)=>{let r=e.onYouTubeIframeAPIReady;if(e.onYouTubeIframeAPIReady=()=>{r?.();let e=globalThis.YT;e?.Player?t(e):n(Error(`YouTube IFrame API の初期化に失敗しました`))},document.querySelector(`script[src="${h}"]`))return;let i=document.createElement(`script`);i.src=h,i.async=!0,i.onerror=()=>n(Error(`YouTube IFrame API を読み込めませんでした`)),document.head.appendChild(i)}),g)},v=250,y=40,b=120,x=1500,S=3,C=.3,w=.02,T=.05,E=1.5,D=.06,O=.07,k=.6,A=.6,j=.15,M=(e,t)=>{let n=null,r=null,i=null,a=!1,o={atTime:t.atTime,mediaSec:t.mediaSec},s=O,c=null,l=n=>{e.seek(n+s),c=t.now()},u=e=>o.mediaSec+(e-o.atTime),d=()=>{a=!0,n!==null&&clearTimeout(n),r!==null&&clearTimeout(r),i!==null&&clearInterval(i),n=null,r=null,i=null,e.setRate(1),e.pause()},f=Math.max(0,t.rangeStartSec??0),p=()=>{if(a)return;let n=Math.max(f,u(t.now()));e.seek(n),e.play(),m(n),h()},m=(n,i=1)=>{let o=0,s=()=>{if(r=null,a)return;let c=e.currentTime()>n+.01;if(o+=b,!c&&o<x){r=setTimeout(s,b);return}let l=u(t.now())-e.currentTime();l<=(i===1?.015:j)||(e.seek(u(t.now())+l),i<S&&m(-1/0,i+1))};r!==null&&clearTimeout(r),r=setTimeout(s,b)},h=()=>{a||i!==null||(i=setInterval(()=>{let n=t.now(),r=u(n);if(t.endSec&&r>=t.endSec){d();return}let i=e.currentTime()-r,a=Math.abs(i);if(c!==null&&n-c>=A&&(c=null,s=Math.max(0,Math.min(k,s-i))),!e.canNudgeRate){c===null&&a>D&&l(r);return}if(a>C){e.setRate(1),l(r);return}if(a<=w){e.setRate(1);return}let o=Math.max(-T,Math.min(T,-i*E));e.setRate(1+o)},v))};if(t.alreadyRolling)h();else{let e=Math.max(0,t.atTime-t.now(),t.atTime+(f-t.mediaSec)-t.now())*1e3;e<1?p():n=setTimeout(p,e)}return{stop:d,rebase:(e,t)=>{o={...e},t?.snap&&m(-1/0)}}},N=e=>{let{audioContext:t,destination:n}=e,r=t.createGain();r.gain.value=.8,r.connect(n);let i=80,a=!1,o=null,s=null,c=null,l=null,u=null,f=null,p=null,m=null,h=()=>a?0:i/100,g=()=>{r.gain.setTargetAtTime(h(),t.currentTime,.02),l&&(l.volume=h()),u?.setVolume(Math.round(h()*100))},v=()=>{if(c){try{c.stop()}catch{}c.disconnect(),c=null}m?.stop(),m=null},b=()=>{if(v(),s=null,l&&=(l.pause(),l.removeAttribute(`src`),l.load(),null),u){try{u.destroy()}catch{}u=null,f=null}p&&=(URL.revokeObjectURL(p),null),o=null},x=async(e,t)=>{let n=new Audio;return n.preload=`auto`,n.src=e,n.volume=h(),await new Promise((e,t)=>{let r=()=>{a(),e()},i=()=>{a(),t(Error(`音源を再生できませんでした（URLを確認してください）`))},a=()=>{n.removeEventListener(`loadedmetadata`,r),n.removeEventListener(`error`,i)};n.addEventListener(`loadedmetadata`,r),n.addEventListener(`error`,i),n.load()}),l=n,{mode:`element`,durationSec:Number.isFinite(n.duration)?n.duration:0,routed:!1,label:t}},S=async t=>{let n=e.getYoutubeContainer?.();if(!n)throw Error(`YouTubeプレイヤーの表示枠がありません`);let r=await _();n.innerHTML=``;let i=document.createElement(`div`);return n.appendChild(i),await new Promise((e,n)=>{u=new r.Player(i,{videoId:t,playerVars:{controls:1,disablekb:1,modestbranding:1,playsinline:1,rel:0},events:{onReady:()=>e(),onError:e=>n(Error(`YouTube\u306E\u52D5\u753B\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\uFF08code ${e.data}\uFF09`))}})}),f=Promise.resolve(),u?.setVolume(Math.round(h()*100)),{mode:`youtube`,durationSec:u?.getDuration()??0,routed:!1,label:t}},C=async n=>{b();try{if(typeof n!=`string`){let e=await n.arrayBuffer();return s=await t.decodeAudioData(e),o={mode:`buffer`,durationSec:s.duration,routed:!0,label:n.name},o}let e=d(n);if(e)return o=await S(e),o;let r=decodeURIComponent(n.split(`/`).pop()??n).slice(0,80);try{let e=await fetch(n,{mode:`cors`});if(!e.ok)throw Error(`HTTP ${e.status}`);return s=await t.decodeAudioData(await e.arrayBuffer()),o={mode:`buffer`,durationSec:s.duration,routed:!0,label:r},o}catch{return o=await x(n,r),o}}catch(t){b();let n=t instanceof Error?t.message:String(t);throw e.onError?.(n),t}},w=async e=>{if(o?.mode===`youtube`&&u){await f,u.seekTo(Math.max(0,e),!0),u.pauseVideo();return}o?.mode===`element`&&l&&(l.currentTime=Math.max(0,e))},T=()=>{if(o?.mode===`element`&&l){let t=l;return{seek:e=>{t.currentTime=e},play:()=>{t.play().catch(t=>{e.onError?.(`\u97F3\u6E90\u3092\u518D\u751F\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F: ${t instanceof Error?t.message:String(t)}`)})},pause:()=>t.pause(),currentTime:()=>t.currentTime,canNudgeRate:!0,setRate:e=>{t.playbackRate=e}}}if(o?.mode===`youtube`&&u){let e=u;return{seek:t=>e.seekTo(t,!0),play:()=>e.playVideo(),pause:()=>e.pauseVideo(),currentTime:()=>e.getCurrentTime(),canNudgeRate:!1,setRate:()=>{}}}return null},E=async(e,n,r)=>{e.seek(n),e.play();let i=t.currentTime+r,a=e.currentTime();for(;t.currentTime<i;){if(await new Promise(e=>setTimeout(e,y)),!o)return null;let r=e.currentTime();if(r!==a&&r>n+.001)return{atTime:t.currentTime,mediaSec:r};a=r}return null};return g(),{load:C,clear:b,arm:w,start:e=>{if(!o)return;v();let n=()=>t.currentTime,i=Math.max(0,e.rangeStartSec??0);if(o.mode===`buffer`&&s){if(e.mediaSec>=s.duration)return;let n=t.createBufferSource();n.buffer=s,n.connect(r);let a=Math.max(i,e.mediaSec),o=e.atTime+Math.max(0,i-e.mediaSec),l=e.endSec&&e.endSec>a?e.endSec:s.duration;n.start(o,a,Math.max(0,l-a)),c=n;return}let a=T();a&&(l&&(l.volume=h()),m=M(a,{...e,now:n}))},startRolling:async e=>{if(!o||o.mode!==`youtube`)return null;let n=T();if(!n)return null;v();let r=Math.max(0,e.rangeStartSec??0,e.mediaSec),i=await E(n,r,e.timeoutSec??5);if(!o)return null;let a=i??{atTime:t.currentTime,mediaSec:r};return m=M(n,{...a,rangeStartSec:e.rangeStartSec,endSec:e.endSec,now:()=>t.currentTime,alreadyRolling:!0}),{...a,measured:i!==null}},rebase:(e,t)=>m?.rebase(e,t),stop:()=>{v()},setVolume:e=>{i=Math.max(0,Math.min(100,e)),g()},setMuted:e=>{a=e,g()},isLoaded:()=>o!==null,getLoaded:()=>o,destroy:()=>{b(),r.disconnect()}}},ee=[`C`,`C#`,`D`,`D#`,`E`,`F`,`F#`,`G`,`G#`,`A`,`A#`,`B`],P=[`C`,`Db`,`D`,`Eb`,`E`,`F`,`Gb`,`G`,`Ab`,`A`,`Bb`,`B`],F=e=>(e%12+12)%12,te=(e,t=!1)=>(t?P:ee)[F(e)],ne=[0,2,4,-1,1,3,5],re=[0,2,4,-1,1,3,5],I=e=>re[(e-1)%7],ie=7,ae=class extends Error{constructor(e,t){super(`SyntaxError: ${t}
input.idx: ${e.idx}
input.str: ${e.str}`),this.name=`ChordSyntaxError`}},oe=(e,t)=>{throw new ae(e,t)},L=class e{static nums=new Set(`0123456789`);str;nest;idx;constructor(e,t=0){this.str=e,this.nest=t,this.idx=0}get isEOF(){return this.str.length<=this.idx}get char(){return this.str[this.idx]}get num(){let t=``;for(;!this.isEOF;){let n=this.char;if(!e.nums.has(n))break;t+=n,this.idx++}return t.length?Number(t):null}slice(e){return this.str.slice(this.idx,this.idx+e)}},se=class{pitch=null;rootFifth=0;relFifths=new Map;chord=null;isChord=!1;pending=null;nest=-1;get value(){let{pitch:e,chord:t}=this;return new Set([...t].map(t=>t+e))}set value(e){let t=this.pitch;this.chord=new Set([...e].map(e=>e-t))}},ce=class{map=new Map;lengths=[];_set(e,t){this.map.set(e,t),this.lengths.includes(e.length)||(this.lengths.push(e.length),this.lengths.sort((e,t)=>t-e))}set(e,t){if(Array.isArray(e))for(let n of e)this._set(n,t);else this._set(e,t)}parse(e){for(let t of this.lengths){let n=e.slice(t);if(this.map.has(n))return e.idx+=n.length,this.map.get(n)}return null}},le=0,ue=1,de=2,R=3,z=new ce;z.set(`(`,le),z.set(`)`,ue),z.set(`,`,de),z.set([`/`,`on`],R);var fe=(e,t=new se,n=0)=>{let r=e.idx,i=i=>{let a=e.str.slice(r,i);a.length&&pe(new L(a,n),t)};for(;;){let{idx:a}=e;if(e.isEOF)return n&&oe(e,`Unclosed ${n} brackets`),i(a),t;let o=z.parse(e);if(o===null){e.idx++;continue}let{pending:s}=t;switch(i(a),o){case le:fe(e,t,n+1);break;case ue:return n-1<0&&oe(e,`Unable to close brackets`),t;case de:t.pending=s;break;case R:{let r=fe(e,new se,n),i=[...t.value],a=(e,n)=>xe(t,e-t.pitch,n-t.rootFifth);if(r.isChord){for(let[e,t]of r.relFifths)a(r.pitch+e,r.rootFifth+t);t.value=[...r.value].concat(i)}else{a(r.pitch,r.rootFifth);let e=i.sort((e,t)=>e-t),n=(r.pitch+3)%12-3;if(e[0]<n)for(;e[0]<n;)e.push(e.shift()+12);else for(;;){let t=e[e.length-1]-12;if(t<n)break;e.pop(),e.unshift(t)}e.push(n),t.value=e}break}}r=e.idx}},pe=(e,t)=>e.isEOF?t:t.pitch===null?be(e,t):t.pending===null?Ne(e,t):Pe(e,t),me=new ce,he=new ce;for(let e of[me,he])e.set([`#`,`♯`],1),e.set([`b`,`♭`],-1);me.set(`+`,1),me.set(`-`,-1);var ge=(e,t=!1)=>(t?he:me).parse(e),_e=[0,2,4,5,7,9,11];for(let e of[..._e.keys()])_e.push(_e[e]+12);var ve=e=>_e[e-1],ye=new ce;for(let[e,t]of[...`CDEFGAB`].entries())ye.set(t,_e[e]);var be=(e,t)=>{let n=ye.parse(e);n===null&&oe(e,`Not found pitch`),t.pitch=n,t.rootFifth=ne[_e.slice(0,7).indexOf(n)];for(let n=0;n<2;n++){let n=ge(e,!0);if(n===null)break;t.pitch+=n,t.rootFifth+=n*ie}return Oe(e,t)},xe=(e,t,n)=>{e.relFifths.set((t%12+12)%12,n)},Se=[0,4,7],Ce=[0,3,6],we=new Map,Te=[0,3,7],Ee=[0,4,8],De=[0,3,6,10];we.set(Se,[0,4,1]),we.set(Te,[0,-3,1]),we.set(Ce,[0,-3,-6]),we.set(Ee,[0,4,8]),we.set(De,[0,-3,-6,-2]);var B=new ce;B.set([`m`,`min`,`Min`,`minor`,`Minor`,`-`],Te),B.set([`dim`,`〇`],Ce),B.set(`+`,Ee),B.set([`Φ`,`φ`,`ø`],De);var Oe=(e,t)=>{let n=/^maj/i.test(e.str.slice(e.idx))?null:B.parse(e);n!==null&&(t.isChord=!0);let r=n||Se;t.chord=new Set(r);let i=we.get(r);if(i)for(let[e,n]of r.entries())xe(t,n,i[e]);if(n===Ce){let{num:n}=e,r=t.chord;n!==null&&(r.add(ve(n)-2),xe(t,ve(n)-2,I(n)-2*ie))}return t.nest=e.nest,pe(e,t)},V=(e,t,n,r=0)=>{e.add(ve(n)+r),xe(t,ve(n)+r,I(n)+r*ie)},ke=(e,t,n,r)=>{V(e,r,t,n)},H=(e,t)=>{e.delete(ve(5)),V(e,t,5,1)},Ae=(e,t,n,r,i=!1)=>{t===5?e.delete(ve(3)):t===6?V(e,r,6):t===69?(V(e,r,6),V(e,r,9)):(t>=7&&V(e,r,7,i?-1:0),t>=9&&V(e,r,9),t>=11&&V(e,r,11),t>=13&&V(e,r,13))},je=(e,t,n,r)=>{e.delete(ve(t)),V(e,r,t,n)},Me=new ce;Me.set(`add`,ke),Me.set([`omit`,`no`],(e,t,n)=>{e.delete(ve(t)+n)}),Me.set(`sus`,(e,t,n,r)=>{e.delete(ve(3)),V(e,r,t,n)}),Me.set([`M`,`maj`,`Maj`,`major`,`Major`,`△`,`Δ`],Ae),Me.set(`aug`,H);var Ne=(e,t)=>{t.isChord||=!0;let n=Me.parse(e),r=t.chord;if(n===null){let n=e.char===`+`,i=ge(e),{num:a}=e;a===null&&(n?H(r,t):oe(e,`Not found number`)),i===null?e.nest===t.nest?Ae(r,a,0,t,!0):ke(r,a,0,t):je(r,a,i,t)}else n===H?H(r,t):t.pending=n;return pe(e,t)},Pe=(e,t)=>{let n=ge(e),{num:r}=e,{pending:i,chord:a}=t;return r===null&&oe(e,`Not found number`),i(a,r,n===null?0:n,t),t.pending=null,pe(e,t)},U=e=>{let t=fe(new L(e)),n=[...t.value].sort((e,t)=>e-t),r=[...t.chord].sort((e,t)=>e-t),i=[...new Set(n.map(F))].sort((e,t)=>e-t),a=t.pitch,o=t.rootFifth,s=n.map(e=>{let n=((e-a)%12+12)%12,r=t.relFifths.get(n);if(r!==void 0)return o+r;let i=0;for(let e=-6;e<=6;e++)if((e*7%12+12)%12===n){i=e;break}return o+i});return{symbol:e,root:F(a),notes:n,pitchClasses:i,intervals:r,rootFifth:o,noteFifths:s}},Fe=[``,`m`,`7`,`M7`,`m7`,`dim`,`m7b5`,`aug`,`6`,`m6`,`sus4`,`sus2`,`mM7`,`dim7`,`7sus4`,`7#5`,`add9`,`madd9`,`9`,`M9`,`m9`,`69`,`m69`,`5`].map((e,t)=>({quality:e,pitchClasses:U(`C${e}`).pitchClasses,priority:t}));(()=>{let e=new Map;for(let t of Fe){let n=t.pitchClasses.join(`,`);e.has(n)||e.set(n,t)}return e})();var Ie=[6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88],Le=[6.33,2.68,3.52,5.38,2.6,3.53,2.54,4.75,3.98,2.69,3.34,3.17],Re=e=>e.reduce((e,t)=>e+t,0)/e.length,ze=(e,t)=>{let n=Re(e),r=Re(t),i=0,a=0,o=0;for(let s=0;s<e.length;s++){let c=e[s]-n,l=t[s]-r;i+=c*l,a+=c*c,o+=l*l}let s=Math.sqrt(a*o);return s===0?0:i/s},Be=(e,t,n)=>`${te(e,n)} ${t}`,Ve=e=>({tonic:e.tonic,mode:e.mode,name:e.name}),He=(e,t)=>e.tonic===t.tonic&&e.mode===t.mode,Ue=e=>{let t=Array(12).fill(0);for(let n of e)typeof n==`number`?t[F(n)]+=1:t[F(n.pitch)]+=n.duration??1;return t},We=(e,t,n)=>{let r=Array(12).fill(0);for(let i of e){if(i.duration<=0){i.when>=t&&i.when<n&&(r[F(i.pitch)]+=1);continue}let e=Math.max(i.when,t),a=Math.min(i.when+i.duration,n)-e;a>0&&(r[F(i.pitch)]+=a)}return r},Ge=(e,t)=>{let n=[];for(let r=0;r<12;r++)for(let i of[`major`,`minor`]){let a=i===`major`?Ie:Le,o=e.map((e,t)=>a[F(t-r)]);n.push({tonic:r,mode:i,name:Be(r,i,t),score:ze(e,o)})}return n.sort((e,t)=>t.score-e.score),n},Ke=(e,t={})=>{if(!e.length)return[];let{flat:n=!1}=t,r=Ue(e);return r.every(e=>e===0)?[]:Ge(r,n)},qe=e=>{let t=[];for(let n of e){let e=t[t.length-1];e&&He(e.key,n.key)?e.duration=n.when+n.duration-e.when:t.push({...n})}return t},Je=(e,t)=>{if(t<=0)return e;let n=e.map(e=>({...e})),r=0;for(;r<n.length&&n.length>1;){if(n[r].duration>=t){r++;continue}r>0?(n[r-1].duration+=n[r].duration,n.splice(r,1)):(n[r+1].when=n[r].when,n[r+1].duration+=n[r].duration,n.splice(r,1))}return qe(n)},Ye=(e,t={})=>{if(!e.length)return[];let{flat:n=!1}=t,r=e.reduce((e,t)=>Math.min(e,t.when),1/0),i=e.reduce((e,t)=>Math.max(e,t.when+Math.max(t.duration,0)),-1/0),a=i-r;if(a<=0){let t=Ke(e.map(e=>({pitch:e.pitch,duration:Math.max(e.duration,1)})),{flat:n})[0];return t?[{key:Ve(t),when:r,duration:0}]:[]}let o=t.windowSize??a/4,s=t.hopSize??o/2,c=t.minSegmentDuration??0,l=t.switchMargin??.08,u=[];for(let t=r;t<i-1e-9;t+=s){let a=Math.min(t+s,i),c=Math.min(t+o,i),d=We(e,Math.max(r,c-o),c),f=u[u.length-1];if(d.every(e=>e===0)){f&&(f.duration=a-f.when);continue}let p=Ge(d,n),m=p[0];if(f){let e=p.find(e=>He(e,f.key));e&&m.score-e.score<=l&&(m=e)}f&&He(f.key,m)?f.duration=a-f.when:u.push({key:Ve(m),when:t,duration:a-t})}return Je(qe(u),c)},Xe=e=>e===0?1.3:e===3||e===4?1.2:e===10||e===11?.95:e===6||e===7||e===8?.7:.85,W=(()=>{let e=[];for(let t=0;t<12;t++)for(let n of Fe){let r=new Set,i=Array(12).fill(0),a=new Set;for(let e of n.pitchClasses){a.add(e);let n=F(e+t);r.add(n),i[n]=Xe(e)}e.push({root:t,quality:n.quality,priority:n.priority,pcs:r,weights:i,rel:a})}return e})(),Ze=[0,2,4,5,7,9,11],Qe=[0,2,3,5,7,8,10],$e=e=>(e.mode===`major`?Ze:Qe).map(t=>F(t+e.tonic)),et=(e,t)=>{let n=$e(t),r=new Set(n),i=r.has(e.root),a=!0;for(let t of e.pcs)if(!r.has(t)){a=!1;break}let o=0;a?o+=.25:i&&(o+=.1);let s=F(e.root-t.tonic);return(s===0||s===5||s===7)&&(o+=.05),o},tt=(e,t,n)=>{let r=Array(12).fill(0),i=0,a=1/0,o=-1;for(let s of e){let e=Math.max(s.when,t),c=Math.min(s.when+Math.max(s.duration,0),n),l=s.duration<=0?+(s.when>=t&&s.when<n):Math.max(c-e,0);l<=0||(r[F(s.pitch)]+=l,i+=l,s.pitch<a&&(a=s.pitch,o=F(s.pitch)))}let s=i>0?r.map(e=>e/i):r;return{when:t,duration:n-t,profile:s,bass:o,empty:i===0}},nt=(e,t,n,r)=>{let i=0,a=0;for(let n=0;n<12;n++){let r=e.profile[n];r!==0&&(t.pcs.has(n)?i+=r*t.weights[n]:a+=r)}let o=i-r*a;return e.profile[t.root]===0&&(o-=.3),e.bass!==-1&&t.root===e.bass&&(o+=.3),n&&(o+=et(t,n)),o-=t.priority*.002,o},rt=[`I`,`II`,`III`,`IV`,`V`,`VI`,`VII`],it=(e,t)=>{let n=e.mode===`major`?Ze:Qe,r=F(t.root-e.tonic),i=n.indexOf(r),a=``;if(i===-1){let e=n.indexOf(F(r-1)),t=n.indexOf(F(r+1));e===-1?t===-1?(i=0,a=`?`):(i=t,a=`b`):(i=e,a=`#`)}let o=t.rel.has(4),s=t.rel.has(3),c=t.rel.has(6),l=t.rel.has(8),u=t.rel.has(10),d=rt[i],f=``;return s&&c?(d=d.toLowerCase(),f=u?`ø7`:`°`,t.rel.has(9)&&(f=`°7`)):o&&l?f=`+`:s&&(d=d.toLowerCase()),f||(t.rel.has(11)?f=`M7`:u?f=`7`:t.rel.has(9)&&!t.rel.has(10)&&(f=`6`)),a+d+f},at=(e,t)=>{let n=e.length,r=W.length;if(n===0)return[];let i=Array.from({length:n},()=>Array(r).fill(-1)),a=e[0].slice();for(let o=1;o<n;o++){let n=-1/0,s=0;for(let e=0;e<r;e++)a[e]>n&&(n=a[e],s=e);let c=Array(r).fill(0),l=e[o],u=n-t;for(let e=0;e<r;e++)a[e]>=u?(c[e]=l[e]+a[e],i[o][e]=e):(c[e]=l[e]+u,i[o][e]=s);a=c}let o=0;for(let e=1;e<r;e++)a[e]>a[o]&&(o=e);let s=Array(n).fill(0);s[n-1]=o;for(let e=n-1;e>0;e--)s[e-1]=i[e][s[e]];return s},ot=(e,t)=>{for(let n of e)if(t>=n.when&&t<n.when+n.duration)return n.key;return e.length?e[e.length-1].key:null},st=(e,t,n)=>{let r=te(e.root,n)+e.quality,i=t!==-1&&t!==e.root&&e.pcs.has(t);return{symbol:i?`${r}/${te(t,n)}`:r,rootSymbol:r,inversion:i,bass:t===-1?e.root:t}},ct=(e,t={})=>{if(!e.length)return{keys:[],chords:[]};let{flat:n=!1,bpm:r,frameSize:i=.5,changePenalty:a=.4,nonChordTonePenalty:o=.55,useKey:s=!0}=t,c=Ye(e,t),l=e.reduce((e,t)=>Math.min(e,t.when),1/0),u=e.reduce((e,t)=>Math.max(e,t.when+Math.max(t.duration,0)),-1/0);if(u<=l)return{keys:c,chords:[]};let d=r?60/r:Math.max(i,.001),f=[];for(let t=l;t<u-1e-9;t+=d)f.push(tt(e,t,Math.min(t+d,u)));let p=at(f.map(e=>{if(e.empty)return Array(W.length).fill(0);let t=s?ot(c,e.when+e.duration/2):null;return W.map(n=>nt(e,n,t,o))}),a),m=[];for(let e=0;e<f.length;e++){let t=f[e],r=W[p[e]],i=m[m.length-1];if(i&&i.root===r.root&&i.quality===r.quality){i.duration=t.when+t.duration-i.when;continue}let a=ot(c,t.when+t.duration/2),{symbol:o,rootSymbol:s,inversion:l,bass:u}=st(r,t.bass,n);m.push({symbol:o,rootSymbol:s,root:r.root,quality:r.quality,bass:u,inversion:l,when:t.when,duration:t.duration,key:a,degree:a?it(a,r):null})}return{keys:c,chords:m}},lt=e=>e.replace(/[！-～]/g,e=>String.fromCharCode(e.charCodeAt(0)-65248)).replace(/　/g,` `),ut=(e,t=120)=>{let n=[],r=60/t*4,i=new Set(`ABCDEFG_=%N`),a=0,o=null;for(let t of lt(e).split(`
`).map(e=>e.trim()))if(t.length&&!/^#/.test(t))for(let e of t.split(/[|lｌ→]/)){if(!e.length)continue;let t=a++*r,s=[];for(let t=0;t<e.length;t++){let n=e[t],r=e[t-1],a=e.slice(t-2,t);i.has(n)&&r!==`/`&&a!==`on`&&(a!==`N.`||n!==`C`)&&s.push(t)}if(!s.length)continue;let c=2**Math.ceil(Math.log2(s.length)),l=r/c;for(let[r,i]of s.entries()){let a=e.slice(i,r===s.length-1?e.length:s[r+1]).replace(/\s+/g,``),c=a[0];if(c===`_`||c===`N`){o=null;continue}if(c===`=`){o&&(o.duration+=l);continue}let u=t+r*l;if(c===`%`){if(o===null)continue;o={...o,when:u,duration:l}}else{let e=a.slice(0,a[1]===`#`?2:1);o={key:e,chord:a.slice(e.length).replace(/[\s・]/g,``),when:u,duration:l}}n.push(o)}o!==null&&c>s.length&&(o.duration+=l*(c-s.length))}return n},dt=`
<div class="dtm-modal-body-content">
  <h4>1. 基本的な書き方と小節の区切り</h4>
  <p>小節を <code>|</code> (縦棒) または <code>→</code> で区切り、その中にコードネームを入力します。</p>
  <pre>例: | C | G | Am | Em |</pre>
  <p style="margin-top:4px; margin-bottom:12px;"><small>コード進行を自分で考えるのが難しいときは、コード進行の共有サイト（例: <a href="https://rechord.cc/scores" target="_blank" rel="noopener" style="color: var(--dtm-primary, #29adff); text-decoration: underline;">rechord.cc</a>）から好きな進行を探してコピペするのも手です。区切り文字（<code>|</code>）を合わせれば、そのまま使用できます。</small></p>

  <h4>2. 便利な制御文字</h4>
  <ul>
    <li><code>=</code> (継続): 直前のコードをそのまま次の拍まで伸ばします（タイ）。<br><small>例: <code>| C = | F G |</code> (Cを2拍伸ばし、前半1拍ずつF, G)</small></li>
    <li><code>%</code> (繰り返し): 直前のコードをもう一度繰り返します。<br><small>例: <code>| C % |</code> (1小節内でCを2回鳴らす)</small></li>
    <li><code>_</code> (休符): 伴奏を一時的に止めます（休符）。</li>
    <li><code>N</code> または <code>N.C.</code> (ノーコード): 伴奏を止めます。</li>
  </ul>

  <h4>3. 1小節に複数のコードを置く</h4>
  <p>コードネームのアルファベット(A〜G)の開始位置で自動的に分割されます。空白などで区切って並べて入力します。</p>
  <pre>例: | C G | Am Em | (1小節に2拍ずつコードを置く例)</pre>

  <h4>4. 代表的なコードネームの書き方</h4>
  <p>一般的な英語表記がそのまま使えます。シャープは <code>#</code>、フラットは <code>b</code> で入力します。</p>
  <ul>
    <li><b>三和音</b>: <code>C</code> (メジャー), <code>Cm</code> (マイナー), <code>Cdim</code> (ディミニッシュ), <code>Caug</code> または <code>C+</code> (オーグメント)</li>
    <li><b>四和音 (7th等)</b>: <code>CM7</code> または <code>Cmaj7</code>, <code>C7</code>, <code>Cm7</code>, <code>CmM7</code>, <code>Cdim7</code>, <code>Cm7b5</code> (ハーフディミニッシュ)</li>
    <li><b>テンション・その他</b>: <code>Cadd9</code>, <code>C9</code>, <code>Csus4</code>, <code>Csus2</code>, <code>C6</code>, <code>C69</code></li>
    <li><b>分数コード (ベース音指定)</b>: <code>C/E</code> (ベース音がEのCメジャー), <code>Dm7/G</code></li>
  </ul>

  <h4>5. セクション（見出し）を作る</h4>
  <p>行頭に <code>#</code> と見出しを入力すると、セクションが作成されて見た目の色が変わります。スクロール時の目印に便利です。</p>
  <pre>例:
# Intro
| C | G | Am | Em |
# Verse
| F | C | F | G |</pre>

  <h4>6. メタ情報（音色・メトロノーム）</h4>
  <p>行頭に以下の記述を置くことで、初期設定をカスタマイズできます。</p>
  <ul>
    <li><code># tone=guitar</code> : 初期音色をギターに設定 (他に <code>piano</code>, <code>strings</code> も対応)</li>
    <li><code># metronome</code> : メトロノームを初期状態でONにする</li>
  </ul>

  <h4 style="margin-top: 18px; border-top: 1px solid var(--dtm-border2); padding-top: 8px;">サンプル曲（試聴・コピー）</h4>

  <!-- サンプル1: 夜に駆ける -->
  <div class="dtm-modal-sample-box">
    <div class="dtm-modal-sample-header">
      <span class="dtm-modal-sample-tag">1. YOASOBI - 夜に駆ける (サビ風)</span>
      <button class="dtm-btn dtm-btn--ghost dtm-btn--xs dtm-modal-sample-copy-btn" data-chords="# YOASOBI - 夜に駆ける\\n# tone=piano\\n| AbM7 | Bb | Gm7 | Cm7 |\\n| AbM7 | Bb | Gm7 | C |">📋 コピー</button>
    </div>
    <pre style="margin: 0; padding: 6px;"># YOASOBI - 夜に駆ける
# tone=piano
| AbM7 | Bb | Gm7 | Cm7 |
| AbM7 | Bb | Gm7 | C |</pre>
    <div class="dtm-modal-sample-desc">
      疾走感のあるピアノフレーズが特徴的な、同主調メジャーを絡めた人気の進行です。
    </div>
    <div style="margin-top: 8px;">
      <button class="dtm-btn dtm-btn--primary dtm-btn--xs dtm-modal-sample-play-btn" data-chords="# YOASOBI - 夜に駆ける\\n# tone=piano\\n| AbM7 | Bb | Gm7 | Cm7 |\\n| AbM7 | Bb | Gm7 | C |">▶ 試聴</button>
    </div>
    <div class="dtm-modal-sample-player-container"></div>
  </div>

  <!-- サンプル2: ただ君に晴れ -->
  <div class="dtm-modal-sample-box">
    <div class="dtm-modal-sample-header">
      <span class="dtm-modal-sample-tag">2. ヨルシカ - ただ君に晴れ (サビ風)</span>
      <button class="dtm-btn dtm-btn--ghost dtm-btn--xs dtm-modal-sample-copy-btn" data-chords="# ヨルシカ - ただ君に晴れ\\n# tone=guitar\\n| D | E | C#m7 | F#m |\\n| D | E | C#m7 | F#m |">📋 コピー</button>
    </div>
    <pre style="margin: 0; padding: 6px;"># ヨルシカ - ただ君に晴れ
# tone=guitar
| D | E | C#m7 | F#m |
| D | E | C#m7 | F#m |</pre>
    <div class="dtm-modal-sample-desc">
      爽やかなアコースティックギターが映える、切なさのある王道進行ベースの展開です。
    </div>
    <div style="margin-top: 8px;">
      <button class="dtm-btn dtm-btn--primary dtm-btn--xs dtm-modal-sample-play-btn" data-chords="# ヨルシカ - ただ君に晴れ\\n# tone=guitar\\n| D | E | C#m7 | F#m |\\n| D | E | C#m7 | F#m |">▶ 試聴</button>
    </div>
    <div class="dtm-modal-sample-player-container"></div>
  </div>

  <!-- サンプル3: シャルル -->
  <div class="dtm-modal-sample-box">
    <div class="dtm-modal-sample-header">
      <span class="dtm-modal-sample-tag">3. バルーン - シャルル (サビ風)</span>
      <button class="dtm-btn dtm-btn--ghost dtm-btn--xs dtm-modal-sample-copy-btn" data-chords="# バルーン - シャルル\\n# tone=strings\\n| DM7 | E7 | C#m7 | F#m7 |\\n| DM7 | E7 | C#m7 | F# |">📋 コピー</button>
    </div>
    <pre style="margin: 0; padding: 6px;"># バルーン - シャルル
# tone=strings
| DM7 | E7 | C#m7 | F#m7 |
| DM7 | E7 | C#m7 | F# |</pre>
    <div class="dtm-modal-sample-desc">
      ボカロ曲で絶大な人気を誇る、浮遊感がありエモーショナルなコード進行です。
    </div>
    <div style="margin-top: 8px;">
      <button class="dtm-btn dtm-btn--primary dtm-btn--xs dtm-modal-sample-play-btn" data-chords="# バルーン - シャルル\\n# tone=strings\\n| DM7 | E7 | C#m7 | F#m7 |\\n| DM7 | E7 | C#m7 | F# |">▶ 試聴</button>
    </div>
    <div class="dtm-modal-sample-player-container"></div>
  </div>
</div>
`,ft=`FluidR3_GM_sf2_file`,G={bassDrum1:36,acousticSnare:38,handClap:39,sideStick:37,closedHihat:42,pedalHihat:44,openHihat:46,lowTom:45,lowMidTom:47,highTom:50,crashCymbal1:49,rideCymbal1:51,splashCymbal:55,tambourine:54},pt=e=>{let t={};for(let[n,r]of Object.entries(e))t[n]=Array.isArray(r)||r&&Array.isArray(r.pattern)===!1&&Array.isArray(r)?{label:n,pattern:r}:r;return t},mt=(e,t,n)=>{let r=t[e];if(!r)return null;let i=r.pattern;if(Array.isArray(i)&&i.length>0&&`ranges`in i[0]){let e=i.filter(e=>e.ranges.some(([e,t])=>n>=e&&n<=t));if(e.length>0)return e.flatMap(e=>{let t=Math.max(...e.pattern.map(e=>e.step),0),r=e.patternBars??Math.max(1,Math.ceil((t+1)/192)),i=e.ranges.find(([e,t])=>n>=e&&n<=t),a=(n-(i?i[0]:1))%r*192;return e.pattern.filter(e=>e.step>=a&&e.step<a+192).map(e=>({...e,step:e.step-a}))})}return i??null},ht={"4beat":{label:`4つ打ち`,pattern:[{step:0,pitch:G.bassDrum1,velocity:1},{step:48,pitch:G.bassDrum1,velocity:.9},{step:96,pitch:G.bassDrum1,velocity:1},{step:144,pitch:G.bassDrum1,velocity:.9}]},"8beat":{label:`8ビート`,pattern:[{step:0,pitch:G.bassDrum1,velocity:1},{step:0,pitch:G.closedHihat,velocity:.8},{step:24,pitch:G.closedHihat,velocity:.5},{step:48,pitch:G.acousticSnare,velocity:1},{step:48,pitch:G.handClap,velocity:.6},{step:48,pitch:G.closedHihat,velocity:.8},{step:72,pitch:G.closedHihat,velocity:.5},{step:96,pitch:G.bassDrum1,velocity:.9},{step:96,pitch:G.closedHihat,velocity:.8},{step:120,pitch:G.closedHihat,velocity:.5},{step:144,pitch:G.acousticSnare,velocity:1},{step:144,pitch:G.closedHihat,velocity:.8},{step:168,pitch:G.closedHihat,velocity:.5}]},"16beat":{label:`16ビート`,pattern:[{step:0,pitch:G.bassDrum1,velocity:1},{step:0,pitch:G.closedHihat,velocity:.8},{step:12,pitch:G.closedHihat,velocity:.4},{step:24,pitch:G.closedHihat,velocity:.6},{step:36,pitch:G.closedHihat,velocity:.4},{step:48,pitch:G.acousticSnare,velocity:1},{step:48,pitch:G.closedHihat,velocity:.8},{step:60,pitch:G.closedHihat,velocity:.4},{step:72,pitch:G.closedHihat,velocity:.6},{step:84,pitch:G.closedHihat,velocity:.4},{step:96,pitch:G.bassDrum1,velocity:.9},{step:96,pitch:G.closedHihat,velocity:.8},{step:108,pitch:G.bassDrum1,velocity:.7},{step:108,pitch:G.closedHihat,velocity:.4},{step:120,pitch:G.closedHihat,velocity:.6},{step:132,pitch:G.closedHihat,velocity:.4},{step:144,pitch:G.acousticSnare,velocity:1},{step:144,pitch:G.closedHihat,velocity:.8},{step:156,pitch:G.closedHihat,velocity:.4},{step:168,pitch:G.closedHihat,velocity:.6},{step:180,pitch:G.closedHihat,velocity:.4}]},shuffle:{label:`シャッフル`,pattern:[{step:0,pitch:G.bassDrum1,velocity:1},{step:0,pitch:G.closedHihat,velocity:.8},{step:32,pitch:G.closedHihat,velocity:.5},{step:48,pitch:G.acousticSnare,velocity:1},{step:48,pitch:G.closedHihat,velocity:.8},{step:80,pitch:G.closedHihat,velocity:.5},{step:96,pitch:G.bassDrum1,velocity:.9},{step:96,pitch:G.closedHihat,velocity:.8},{step:128,pitch:G.closedHihat,velocity:.5},{step:144,pitch:G.acousticSnare,velocity:1},{step:144,pitch:G.closedHihat,velocity:.8},{step:176,pitch:G.closedHihat,velocity:.5}]},dance:{label:`ダンス/EDM`,pattern:[{step:0,pitch:G.bassDrum1,velocity:1},{step:24,pitch:G.openHihat,velocity:.7},{step:48,pitch:G.bassDrum1,velocity:1},{step:48,pitch:G.handClap,velocity:1},{step:72,pitch:G.openHihat,velocity:.7},{step:96,pitch:G.bassDrum1,velocity:1},{step:120,pitch:G.openHihat,velocity:.7},{step:144,pitch:G.bassDrum1,velocity:1},{step:144,pitch:G.handClap,velocity:1},{step:168,pitch:G.openHihat,velocity:.7}]},bossa:{label:`ボサノバ/チル`,pattern:[{step:0,pitch:G.bassDrum1,velocity:.9},{step:0,pitch:G.closedHihat,velocity:.6},{step:24,pitch:G.closedHihat,velocity:.4},{step:48,pitch:G.sideStick,velocity:.8},{step:48,pitch:G.closedHihat,velocity:.6},{step:72,pitch:G.bassDrum1,velocity:.7},{step:72,pitch:G.closedHihat,velocity:.4},{step:96,pitch:G.bassDrum1,velocity:.9},{step:96,pitch:G.closedHihat,velocity:.6},{step:120,pitch:G.closedHihat,velocity:.4},{step:144,pitch:G.sideStick,velocity:.8},{step:144,pitch:G.closedHihat,velocity:.6},{step:168,pitch:G.closedHihat,velocity:.4}]},disco:{label:`ファンク/ディスコ`,pattern:[{step:0,pitch:G.bassDrum1,velocity:1},{step:0,pitch:G.closedHihat,velocity:.7},{step:24,pitch:G.tambourine,velocity:.8},{step:48,pitch:G.acousticSnare,velocity:1},{step:48,pitch:G.closedHihat,velocity:.7},{step:72,pitch:G.tambourine,velocity:.8},{step:96,pitch:G.bassDrum1,velocity:1},{step:96,pitch:G.closedHihat,velocity:.7},{step:120,pitch:G.tambourine,velocity:.8},{step:144,pitch:G.acousticSnare,velocity:1},{step:144,pitch:G.closedHihat,velocity:.7},{step:168,pitch:G.tambourine,velocity:.8}]}},gt=(e,t)=>{let n=pt(t)[e];if(!n)return[];let r=n.pattern,i=new Set;if(Array.isArray(r)&&r.length>0&&`ranges`in r[0]){let e=r;for(let t of e)for(let e of t.pattern)i.add(e.pitch)}else if(Array.isArray(r))for(let e of r)i.add(e.pitch);return Array.from(i)},_t=1024,vt={env:`sustain`,vibrato:!1,brightness:`default`},K=e=>{let t={env:`pluck`,vibrato:!1,brightness:`default`},n={env:`bass`,vibrato:!1,brightness:`bass`},r={env:`organ`,vibrato:!1,brightness:`default`},i={env:`sustain`,vibrato:!0,brightness:`wind`},a={env:`sustain`,vibrato:!0,brightness:`default`};return e<=15?t:e<=20?r:e<=23?a:e<=31?t:e<=39?n:e<=44?a:e<=47||e===55?t:e<=54?a:e<=79?i:e<=87?a:e<=103?{env:`pad`,vibrato:!1,brightness:`default`}:e<=108?t:e<=111?i:e<=119?t:vt},yt=e=>e>=32&&e<=39?`bass`:e===29||e===30?`guitar-drive`:e===26||e===27||e===28||e===31?`guitar-clean`:e===24||e===25||e===46||e>=104&&e<=108?`acoustic`:`none`,bt=e=>{let t=new Float32Array(_t),n=Math.max(.01,e),r=Math.tanh(n);for(let e=0;e<_t;e++){let i=e/(_t-1)*2-1;t[e]=Math.tanh(n*i)/r}return t},xt=`none`,St=.03,Ct=[[95,.18,.01],[180,.15,.008],[420,.16,.007],[1100,.16,.005],[2200,.22,.004],[3600,.12,.002]],wt=.6,Tt=e=>{let t=e.sampleRate,n=Math.max(2,Math.floor(t*St)),r=e.createBuffer(1,n,t),i=r.getChannelData(0);for(let e=1;e<n;e++){let n=e/t,r=0;for(let[e,t,i]of Ct)r+=t*Math.exp(-n/i)*Math.sin(2*Math.PI*e*n);i[e]=r}let a=0;for(let e=1;e<n;e++)a+=i[e];a/=n-1;let o=0;for(let e=1;e<n;e++)i[e]-=a,o+=Math.abs(i[e]);if(o>0){let e=wt/o;for(let t=1;t<n;t++)i[t]*=e}return i[0]=1,r},Et=110,q=2200,Dt=.4,Ot=.8,kt=2.5,At=e=>{let t=e.createGain(),n=e.createGain(),r=e.createGain();r.gain.value=Ot,t.connect(r).connect(n);let i=e.createBiquadFilter();i.type=`highpass`,i.frequency.value=Et;let a=e.createBiquadFilter();a.type=`lowpass`,a.frequency.value=q;let o=e.createWaveShaper();o.curve=bt(kt),o.oversample=xt;let s=e.createBiquadFilter();s.type=`lowpass`,s.frequency.value=3500;let c=e.createBiquadFilter();c.type=`highpass`,c.frequency.value=30;let l=e.createGain();return l.gain.value=Dt,t.connect(i).connect(a).connect(o).connect(s).connect(c).connect(l).connect(n),{input:t,output:n,dispose:()=>{for(let e of[t,r,i,a,o,s,c,l,n])e.disconnect()}}},jt=90,Mt=5e3,Nt=2200,Pt=3,Ft=1.5,It=.8,Lt=(e,t)=>{let n=e.createGain(),r=e.createGain(),i=[n,r],a=n;if(t){let t=e.createWaveShaper();t.curve=bt(Ft),t.oversample=xt;let r=e.createGain();r.gain.value=Math.tanh(Ft)/Ft,n.connect(t).connect(r),i.push(t,r),a=r}let o=e.createBiquadFilter();o.type=`highpass`,o.frequency.value=jt;let s=e.createConvolver();s.normalize=!1,s.buffer=Tt(e);let c=e.createBiquadFilter();c.type=`lowpass`,c.frequency.value=Mt;let l=e.createBiquadFilter();l.type=`peaking`,l.frequency.value=Nt,l.Q.value=1,l.gain.value=Pt;let u=e.createGain();return u.gain.value=It,a.connect(o).connect(s).connect(c).connect(l).connect(u).connect(r),i.push(o,s,c,l,u),{input:n,output:r,dispose:()=>{for(let e of i)e.disconnect()}}},Rt=3200,zt=2.5,Bt=7e3,Vt=2,Ht=60,Ut=e=>{let t=e.createGain(),n=e.createGain(),r=e.createBiquadFilter();r.type=`highpass`,r.frequency.value=Ht;let i=e.createBiquadFilter();i.type=`peaking`,i.frequency.value=Rt,i.Q.value=.9,i.gain.value=zt;let a=e.createBiquadFilter();return a.type=`highshelf`,a.frequency.value=Bt,a.gain.value=Vt,t.connect(r).connect(i).connect(a).connect(n),{input:t,output:n,dispose:()=>{for(let e of[t,r,i,a,n])e.disconnect()}}},Wt=(e,t)=>{switch(t){case`bass`:return At(e);case`guitar-clean`:return Lt(e,!1);case`guitar-drive`:return Lt(e,!0);case`acoustic`:return Ut(e);default:return null}},Gt=(e,t,n)=>Math.max(t,Math.min(n,e)),Kt=e=>{let t=Gt(e,0,100)/100;return{threshold:0+-24*t,ratio:1+11*t,knee:0+6*t,attack:.02+-.017*t,release:.25+-.1*t}},qt=200,Jt=1e3,Yt=5e3,Xt=1,Zt=12,Qt=(e,t,n={})=>{let r=e.createGain(),i=e.createGain(),a=e.createGain();r.connect(i),i.connect(a);let o=null,s=`none`,c=t=>{t!==s&&(s=t,i.disconnect(),o?.dispose(),o=Wt(e,t),o?(i.connect(o.input),o.output.connect(a)):i.connect(a))},l=e.createBiquadFilter();l.type=`lowshelf`,l.frequency.value=qt,l.gain.value=Gt(n.eqLow??0,-Zt,Zt);let u=e.createBiquadFilter();u.type=`peaking`,u.frequency.value=Jt,u.Q.value=Xt,u.gain.value=Gt(n.eqMid??0,-Zt,Zt);let d=e.createBiquadFilter();d.type=`highshelf`,d.frequency.value=Yt,d.gain.value=Gt(n.eqHigh??0,-Zt,Zt),a.connect(l),l.connect(u),u.connect(d);let f=e.createDynamicsCompressor(),p=t=>{let n=Kt(t),r=e.currentTime;f.threshold.setValueAtTime(n.threshold,r),f.ratio.setValueAtTime(n.ratio,r),f.knee.setValueAtTime(n.knee,r),f.attack.setValueAtTime(n.attack,r),f.release.setValueAtTime(n.release,r)};p(n.compression??0);let m=e.createChannelSplitter(2),h=e.createGain();h.gain.value=.5,m.connect(h,0),m.connect(h,1);let g=e.createGain();g.gain.value=1;let _=e.createGain();_.gain.value=.5;let v=e.createGain();v.gain.value=-.5,m.connect(_,0),m.connect(v,1),_.connect(g),v.connect(g);let y=e.createGain();g.connect(y);let b=e.createGain();b.gain.value=-1,y.connect(b);let x=e.createGain();h.connect(x),y.connect(x);let S=e.createGain();h.connect(S),b.connect(S);let C=e.createChannelMerger(2);x.connect(C,0,0),S.connect(C,0,1);let w=t=>{y.gain.setTargetAtTime(Gt(t,0,200)/100,e.currentTime,.02)};w(n.width??100);let T=typeof e.createStereoPanner==`function`?e.createStereoPanner():null;T&&(T.pan.value=Gt(n.pan??0,-1,1));let E=T??C,D=e.createGain();D.gain.value=1;let O=.008,k=0,A=(t,n=.3,r=.18)=>{let i=Math.max(t,e.currentTime),a=Gt(1-n,0,1),o=D.gain;i>=k?o.setValueAtTime(1,i):typeof o.cancelAndHoldAtTime==`function`&&o.cancelAndHoldAtTime(i),o.linearRampToValueAtTime(a,i+O),o.linearRampToValueAtTime(1,i+O+r),k=i+O+r};d.connect(f),f.connect(D),D.connect(m),T&&C.connect(T),E.connect(t);let j=e.createGain();j.gain.value=Gt(n.reverbSend??0,0,100)/100,E.connect(j),n.reverbBus&&j.connect(n.reverbBus);let M=e.createGain();return M.gain.value=Gt(n.delaySend??0,0,100)/100,E.connect(M),n.delayBus&&M.connect(n.delayBus),{input:r,setEqLow:t=>{l.gain.setTargetAtTime(Gt(t,-Zt,Zt),e.currentTime,.02)},setEqMid:t=>{u.gain.setTargetAtTime(Gt(t,-Zt,Zt),e.currentTime,.02)},setEqHigh:t=>{d.gain.setTargetAtTime(Gt(t,-Zt,Zt),e.currentTime,.02)},setCompression:p,setWidth:w,setReverbSend:t=>{j.gain.setTargetAtTime(Gt(t,0,100)/100,e.currentTime,.02)},setDelaySend:t=>{M.gain.setTargetAtTime(Gt(t,0,100)/100,e.currentTime,.02)},setPan:t=>{T&&T.pan.setTargetAtTime(Gt(t,-1,1),e.currentTime,.02)},setInstrumentTone:c,duck:A,dispose:()=>{r.disconnect(),i.disconnect(),o?.dispose(),a.disconnect(),D.disconnect(),l.disconnect(),u.disconnect(),d.disconnect(),f.disconnect(),m.disconnect(),h.disconnect(),g.disconnect(),_.disconnect(),v.disconnect(),y.disconnect(),b.disconnect(),x.disconnect(),S.disconnect(),C.disconnect(),T?.disconnect(),j.disconnect(),M.disconnect()}}},$t=e=>e,en=e=>e,tn=(e,t)=>e+t,nn=372,rn=31,an=12,on=1200/372,sn=2139,cn=440,ln=12,un=e=>372/e,dn=e=>e*31,fn=e=>e/31,pn=e=>440*2**((e-sn)/372),mn=e=>{let t=Math.round(e/31);return{midi:t,detuneCents:(e-t*31)*on}},hn={12:{c:0,d:2,e:4,f:5,g:7,a:9,b:11},31:{c:0,d:5,e:10,f:13,g:18,a:23,b:28}},gn=e=>e===31?2:1,_n=1,vn=e=>Object.hasOwn(hn[12],e),yn=(e,t)=>hn[t][e]??null,bn=(e,t,n,r,i)=>{let a=yn(e,i);if(a===null)return null;let o=un(i),s=a+n*gn(i)+r*1;return(t+1)*372+s*o},xn={12:7,31:18},Sn=(e,t)=>(e*xn[t]%t+t)%t,Cn=(e,t)=>Sn(e,t)*un(t),wn=2,Tn=e=>e*31,J=e=>Math.round(e/31),En=48,Dn=[0,3,5,8,10,13,16,18,21,23,26,28],On=(e,t)=>{let n=(e%12+12)%12,r=Math.round((e-n)/12),i=t===31?Dn[n]:n;return r*372+372/t*i},kn=(e,t)=>En/12*372+On(e,t),An=(e,t,n,r)=>{let i=Sn(t,r)*(372/r),a=e/12*372;return $t(n+Math.round((a-i)/372)*372+i)},jn=(e,t,n)=>An(e,t,0,n),Mn=e=>{let t=1;for(;t<e.length;)t*=2;return Array.from({length:t},(t,n)=>({relSemitone:e[n%e.length],octave:Math.floor(n/e.length)}))},Nn=(e,t,n)=>{let r=Math.max(1,Math.round(e/8)),i=Math.max(1,Math.round(e/16)),a=t>=n*r?r:i;return Math.max(1,Math.min(a,t))},Pn=e=>{let{chordStr:t,patternType:n,rootShift:r,bpm:i,stepsPerBar:a,edo:o=12}=e,s=[];if(!t.trim())return s;let c=kn(r,o===31?31:12),l=a,u=[];try{u=ut(t,i)}catch{u=[]}if(u.length>0){let e=60/i*4/a,t={};for(let n of u){let r=Math.floor(n.when/e),i=Math.floor(n.duration/e);t[r]||(t[r]=[]),t[r].push({key:n.key,chord:n.chord,whenStep:r,durationSteps:i})}for(let e of Object.values(t))for(let t of e){let e,r;try{let n=U(`${t.key}${t.chord}`);e=[...n.notes];let i=new Map(n.notes.map((e,t)=>[e,n.noteFifths[t]]));r=e=>An(e,i.get(e)??n.rootFifth,c,o===31?31:12)}catch{continue}let i=t.durationSteps;if(n===`block`)for(let n of e)s.push({startStep:t.whenStep,pitchUnits:r(n),durationSteps:i,velocity:100});else if(n===`arpeggio`){let n=Mn(e),o=Nn(a,i,n.length),c=Math.max(1,Math.floor(i/o));for(let e=0;e<c;e++){let a=n[e%n.length],c=t.whenStep+e*o;s.push({startStep:c,pitchUnits:$t(r(a.relSemitone)+a.octave*372),durationSteps:Math.max(1,Math.min(o,t.whenStep+i-c)),velocity:100})}}else if(n===`arpeggio-fast`)e.forEach((e,n)=>{s.push({startStep:t.whenStep+n*6,pitchUnits:r(e),durationSteps:Math.max(12,i-n*6),velocity:100})});else if(n===`offbeat`){let n=Math.floor(a/4),o=Math.floor(n/2);for(let a=0;a<4;a++){let c=t.whenStep+a*n+o;if(c<t.whenStep+i)for(let t of e)s.push({startStep:c,pitchUnits:r(t),durationSteps:Math.min(o,12),velocity:100})}}else if(n===`yatsume`){let n=Math.floor(a/4),o=e=>Math.max(1,Math.round(e*n/480)),c=[0,360,960,1320],l=o(360);for(let n of c){let a=t.whenStep+o(n);if(a<t.whenStep+i)for(let t of e)s.push({startStep:a,pitchUnits:r(t),durationSteps:l,velocity:100})}}else if(n===`alternating`){let n=Math.floor(a/4);e.forEach((a,o)=>{let c=o*n,l=o===e.length-1?Math.max(12,i-c):Math.max(12,n);s.push({startStep:t.whenStep+c,pitchUnits:r(a),durationSteps:l,velocity:100})})}}}else t.split(/[\s,]+/).filter(e=>e).forEach((e,t)=>{let n,r;try{let t=U(e);n=[...t.notes];let i=new Map(t.notes.map((e,n)=>[e,t.noteFifths[n]]));r=e=>An(e,i.get(e)??t.rootFifth,c,o===31?31:12)}catch{return}if(n.length===0)return;let i=t*l;n.forEach((e,t)=>{let n=t*3;s.push({startStep:i+n,pitchUnits:r(e),durationSteps:l-n,velocity:100})})});return s},Fn=.02,In=2,Ln=(e,t)=>{let n=e.createGain();n.gain.value=1,n.connect(t);let r=(e,t)=>{n.gain.setValueAtTime(e,t),n.gain.linearRampToValueAtTime(1,t+Fn)};return{node:n,schedule:t=>{let i=e.currentTime,a=n.gain.value;if(n.gain.cancelScheduledValues(i),!t){r(a,i);return}let{fadeInStartAt:o,fadeInEndAt:s,fadeOutStartAt:c,fadeOutEndAt:l}=t;o!==void 0&&s!==void 0?(n.gain.setValueAtTime(0,o),n.gain.linearRampToValueAtTime(1,s)):r(a,i),c!==void 0&&l!==void 0&&(n.gain.setValueAtTime(1,c),n.gain.linearRampToValueAtTime(0,l),n.gain.setValueAtTime(0,l+In),n.gain.linearRampToValueAtTime(1,l+In+Fn))},restoreIfMuted:()=>{let t=n.gain.value;if(t>=1)return;let i=e.currentTime;n.gain.cancelScheduledValues(i),r(t,i)}}},Rn=e=>{let t={};if(e.fadeInSec>0&&e.atSongStart&&(t.fadeInStartAt=e.anchor,t.fadeInEndAt=e.anchor+e.fadeInSec),e.fadeOutSec>0&&e.durationSec>.1){let n=e.anchor+e.durationSec,r=t.fadeInEndAt??e.anchor,i=Math.max(n-e.fadeOutSec,r);i<n&&(t.fadeOutStartAt=i,t.fadeOutEndAt=n)}return t},zn=Uint8Array,Bn=Uint16Array,Vn=Int32Array,Hn=new zn([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Un=new zn([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]);new zn([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);var Wn=function(e,t){for(var n=new Bn(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var i=new Vn(n[30]),r=1;r<30;++r)for(var a=n[r];a<n[r+1];++a)i[a]=a-n[r]<<5|r;return{b:n,r:i}},Gn=Wn(Hn,2),Kn=Gn.b,qn=Gn.r;Kn[28]=258,qn[258]=28;var Jn=Wn(Un,0);Jn.b,Jn.r;var Yn=new Bn(32768);for(Zn=0;Zn<32768;++Zn)Xn=(Zn&43690)>>1|(Zn&21845)<<1,Xn=(Xn&52428)>>2|(Xn&13107)<<2,Xn=(Xn&61680)>>4|(Xn&3855)<<4,Yn[Zn]=((Xn&65280)>>8|(Xn&255)<<8)>>1;var Xn,Zn,Qn=new zn(288);for(Zn=0;Zn<144;++Zn)Qn[Zn]=8;for(var Zn=144;Zn<256;++Zn)Qn[Zn]=9;for(var Zn=256;Zn<280;++Zn)Qn[Zn]=7;for(var Zn=280;Zn<288;++Zn)Qn[Zn]=8;var Zn,$n=new zn(32);for(Zn=0;Zn<32;++Zn)$n[Zn]=5;var Zn,er=new zn(0),tr=typeof TextDecoder<`u`&&new TextDecoder;try{tr.decode(er,{stream:!0})}catch{}var nr=1263486208;function rr(e){let t=new DataView(e);if(t.byteLength<8||t.getUint32(0,!1)!==nr)throw Error(`Not a .koe file (bad magic)`);return{jsonLength:t.getUint32(4,!0)}}var ir=e=>8+e,ar=5242880,or=52428800,sr=class{constructor(e,t){this.blob=e,this.base=t}blob;base;readBytes(e,t){let n=this.base+e;return this.blob.slice(n,n+t).arrayBuffer()}},cr=class{constructor(e,t){this.url=e,this.base=t}url;base;async readBytes(e,t){let n=this.base+e;return lr(this.url,n,t)}};async function lr(e,t,n){let r=await fetch(e,{headers:{Range:`bytes=${t}-${t+n-1}`},credentials:`omit`});if(r.status!==206)throw Error(`.koe fetch failed: expected 206 Partial Content, got ${r.status}`);return ur(r,n)}async function ur(e,t){let n=e.body?.getReader();if(!n){let n=await e.arrayBuffer();if(n.byteLength>t)throw Error(`.koe fetch failed: response exceeds requested ${t} bytes`);return n}let r=new Uint8Array(t),i=0;for(;;){let{done:e,value:a}=await n.read();if(e)break;if(i+a.byteLength>t)throw await n.cancel(),Error(`.koe fetch failed: response exceeds requested ${t} bytes`);r.set(a,i),i+=a.byteLength}return i===t?r.buffer:r.buffer.slice(0,i)}function dr(e){if(!Number.isInteger(e)||e<0||e>or)throw Error(`manifest JSON length out of bounds: ${e}`)}function fr(e){let t=JSON.parse(new TextDecoder().decode(e));if(!t||typeof t!=`object`||typeof t.phonemes!=`object`||t.phonemes===null)throw Error(`invalid manifest: missing phonemes table`);return t}var pr=class e{constructor(e,t){this.manifest=e,this.source=t}manifest;source;static async load(t){try{if(typeof t==`string`){if(/^blob:/i.test(t)){let n=await fetch(t);if(!n.ok)throw Error(`blob: URL fetch failed: ${n.status}`);return await e.fromBlob(await n.blob())}if(!/^https?:/i.test(t))throw Error(`unsupported URL protocol: ${t}`);let{jsonLength:n}=rr(await lr(t,0,8));dr(n);let r=fr(await lr(t,8,n));return new e(r,new cr(t,ir(n)))}return await e.fromBlob(t)}catch(e){throw Error(`Failed to load .koe voice bank: ${e instanceof Error?e.message:String(e)}`)}}static async fromBlob(t){let{jsonLength:n}=rr(await t.slice(0,8).arrayBuffer());dr(n);let r=fr(await t.slice(8,8+n).arrayBuffer());return new e(r,new sr(t,ir(n)))}has(e){return Object.hasOwn(this.manifest.phonemes,e)}async readPcmBytes(e){if(!Object.hasOwn(this.manifest.phonemes,e))return null;let t=this.manifest.phonemes[e];if(!Number.isInteger(t.offset)||!Number.isInteger(t.length)||t.offset<0||t.length<0||t.length>ar)throw Error(`manifest entry out of bounds for phoneme: ${e}`);return this.source.readBytes(t.offset,t.length*2)}async getPcm(e){let t=await this.readPcmBytes(e);if(!t)return null;let n=new Int16Array(t,0,Math.floor(t.byteLength/2)),r=new Float64Array(n.length);for(let e=0;e<n.length;e++)r[e]=n[e]/32768;return r}},mr=48e3,hr=4096,gr=120,_r=10,vr=(e,t,n)=>typeof t==`function`?t(e,n):t,yr=e=>e/mr*1e3;function br(e){return{preMs:yr(e.pre||0),consonantMs:yr(e.consonant||0)}}var xr=new Map;function Sr(e){return new Promise((t,n)=>{if(document.querySelector(`script[data-koe-worldline="${e}"]`)){t();return}let r=document.createElement(`script`);r.src=e,r.dataset.koeWorldline=e,r.onload=()=>t(),r.onerror=()=>n(Error(`worldline: failed to load ${e}`)),document.head.appendChild(r)})}function Cr(e){let t=xr.get(e);if(t)return t;let n=e.slice(0,e.lastIndexOf(`/`)+1),r=()=>{let e=globalThis.WorldlineModule;if(!e)throw Error(`worldline: WorldlineModule global was not defined by the script`);return e({locateFile:e=>n+e})},i;if(typeof document<`u`)i=Sr(e).then(r);else if(typeof globalThis.importScripts==`function`)i=Promise.resolve().then(()=>(globalThis.importScripts(e),r()));else return Promise.reject(Error(`Worldline.load requires a DOM or a classic Web Worker (importScripts) to load worldline.js`));return xr.set(e,i),i}var wr=class e{constructor(e){this.wasm=e}wasm;sampleRate=mr;static async load(t){return new e(await Cr(t.scriptUrl))}renderPhrase(e){let{units:t,pitch:n,gender:r=.5,tension:i=.5,breathiness:a=.5,voicing:o=1,tempo:s=120}=e;if(t.length===0)return null;let c=this.wasm,l=mr,u=0;for(let e of t){let t=e.posMs+e.lengthMs;t>u&&(u=t)}let d=c._PhraseSynthNew();if(!d)return null;let f=[];for(let e of t){if(!e.pcm||e.pcm.length<hr)continue;let t=c._malloc(gr);if(!t)continue;f.push(t);let n=c._malloc(e.pcm.length*8);if(!n)continue;f.push(n),c.HEAPF64.set(e.pcm,n>>3);let r=(e,n,r)=>c.setValue(t+e,n,r);r(0,l,`i32`),r(4,e.pcm.length,`i32`),r(8,n,`*`),r(12,0,`i32`),r(16,0,`*`),r(20,e.tone??69,`i32`),r(24,100,`double`),r(32,0,`double`),r(40,e.requiredLengthMs??e.lengthMs,`double`),r(48,e.consonantMs,`double`),r(56,e.cutMs??_r*2,`double`),r(64,e.volume??100,`double`),r(72,0,`double`),r(80,s,`double`),r(88,0,`i32`),r(92,0,`*`),r(96,0,`i32`),r(100,0,`i32`),r(104,100,`i32`),r(108,0,`i32`),r(112,0,`i32`),r(116,100,`i32`),c._PhraseSynthAddRequest(d,t,e.posMs,e.skipMs,e.lengthMs,e.fadeInMs,e.fadeOutMs,0)}u+=_r*2;let p=Math.ceil(u/_r)+4,m=new Float64Array(p),h=new Float64Array(p),g=new Float64Array(p),_=new Float64Array(p),v=new Float64Array(p);for(let e=0;e<p;e++){let t=e*_r;m[e]=vr(t,n,u),h[e]=vr(t,r,u),g[e]=vr(t,i,u),_[e]=vr(t,a,u),v[e]=vr(t,o,u)}let y=c._malloc(p*8),b=c._malloc(p*8),x=c._malloc(p*8),S=c._malloc(p*8),C=c._malloc(p*8);y&&b&&x&&S&&C&&(c.HEAPF64.set(m,y>>3),c.HEAPF64.set(h,b>>3),c.HEAPF64.set(g,x>>3),c.HEAPF64.set(_,S>>3),c.HEAPF64.set(v,C>>3),c._PhraseSynthSetCurves(d,y,b,x,S,C,p,_r)),y&&c._free(y),b&&c._free(b),x&&c._free(x),S&&c._free(S),C&&c._free(C);let w=c._malloc(4),T=null;if(w){let e=c._PhraseSynthSynth(d,w,0),t=c.getValue(w,`*`);e>0&&t&&(T=new Float32Array(c.HEAPF32.buffer,t,e).slice(),c._free(t)),c._free(w)}for(let e of f)c._free(e);return c._PhraseSynthDelete(d),T}renderNote(e){let{pcm:t,pitch:n,durationMs:r,preMs:i,consonantMs:a,tempo:o=120,gender:s=.5,tension:c=.5,breathiness:l=.5,voicing:u=1}=e;if(!t||t.length<hr)return null;let d=this.wasm,f=mr,p=vr(i+r/2,n,i+r),m=Math.round(69+12*Math.log2(p/440)),h=i+r,g=_r*2,_=d._PhraseSynthNew();if(!_)return null;let v=d._malloc(gr);if(!v)return d._PhraseSynthDelete(_),null;let y=d._malloc(t.length*8);if(!y)return d._free(v),d._PhraseSynthDelete(_),null;d.HEAPF64.set(t,y>>3);let b=(e,t,n)=>d.setValue(v+e,t,n);b(0,f,`i32`),b(4,t.length,`i32`),b(8,y,`*`),b(12,0,`i32`),b(16,0,`*`),b(20,m,`i32`),b(24,100,`double`),b(32,0,`double`),b(40,h,`double`),b(48,a,`double`),b(56,g,`double`),b(64,100,`double`),b(72,0,`double`),b(80,o,`double`),b(88,0,`i32`),b(92,0,`*`),b(96,0,`i32`),b(100,0,`i32`),b(104,100,`i32`),b(108,0,`i32`),b(112,0,`i32`),b(116,100,`i32`),d._PhraseSynthAddRequest(_,v,0,0,h,0,0,0),d._free(y),d._free(v);let x=0+h+_r*2,S=Math.ceil(x/_r)+4,C=new Float64Array(S),w=new Float64Array(S),T=new Float64Array(S),E=new Float64Array(S),D=new Float64Array(S);for(let e=0;e<S;e++){let t=e*_r;C[e]=vr(t,n,x),w[e]=vr(t,s,x),T[e]=vr(t,c,x),E[e]=vr(t,l,x),D[e]=vr(t,u,x)}let O=d._malloc(S*8),k=d._malloc(S*8),A=d._malloc(S*8),j=d._malloc(S*8),M=d._malloc(S*8);if(!O||!k||!A||!j||!M)return O&&d._free(O),k&&d._free(k),A&&d._free(A),j&&d._free(j),M&&d._free(M),d._PhraseSynthDelete(_),null;d.HEAPF64.set(C,O>>3),d.HEAPF64.set(w,k>>3),d.HEAPF64.set(T,A>>3),d.HEAPF64.set(E,j>>3),d.HEAPF64.set(D,M>>3),d._PhraseSynthSetCurves(_,O,k,A,j,M,S,_r),d._free(O),d._free(k),d._free(A),d._free(j),d._free(M);let N=d._malloc(4);if(!N)return d._PhraseSynthDelete(_),null;let ee=d._PhraseSynthSynth(_,N,0),P=d.getValue(N,`*`),F=ee>0&&P?new Float32Array(d.HEAPF32.buffer,P,ee).slice():null;return P&&d._free(P),d._free(N),d._PhraseSynthDelete(_),F}},Tr=16e3;Tr*2/1e3;var Er=512;Er/2,Tr/2,Er/2/Tr*1e3;var Dr=`koe-tts-assets-v1`;async function Or(e){if(e===null)return null;try{return typeof caches>`u`?null:await caches.open(e??Dr)}catch{return null}}async function kr(e,t,n){let r;try{r=await fetch(e,{method:`HEAD`,signal:n,cache:`no-cache`})}catch{return!0}if(!r.ok)return!0;for(let e of[`etag`,`last-modified`,`content-length`]){let n=r.headers.get(e),i=t.headers.get(e);if(n&&i)return n===i}return!0}async function Ar(e,t={}){let{onProgress:n,signal:r,revalidate:i=!0}=t,a=await Or(t.cacheName);if(a)try{let t=await a.match(e);if(t&&(!i||await kr(e,t,r))){let r=Number(t.headers.get(`content-length`))||0;return n?.({url:e,loaded:r,total:r,fromCache:!0}),t}}catch{}let o=await fetch(e,{signal:r});if(!o.ok)throw Error(`fetch ${e}: HTTP ${o.status}`);let s=Number(o.headers.get(`content-length`))||0,c;if(o.body&&n){let t=o.body.getReader(),r=[],i=0;for(n({url:e,loaded:i,total:s,fromCache:!1});;){let{done:a,value:o}=await t.read();if(a)break;r.push(o),i+=o.byteLength,n({url:e,loaded:i,total:s,fromCache:!1})}c=new Uint8Array(new ArrayBuffer(i));let a=0;for(let e of r)c.set(e,a),a+=e.byteLength}else c=new Uint8Array(await o.arrayBuffer()),n?.({url:e,loaded:c.byteLength,total:s||c.byteLength,fromCache:!1});let l=new Headers;for(let e of[`content-type`,`etag`,`last-modified`]){let t=o.headers.get(e);t&&l.set(e,t)}l.set(`content-length`,String(c.byteLength));let u=new Response(c,{status:200,headers:l});if(a)try{await a.put(e,u.clone())}catch{}return u}async function jr(e,t){return new Uint8Array(await(await Ar(e,t)).arrayBuffer())}async function Mr(e,t){return(await Ar(e,t)).text()}var Nr=[`metadata.json`,`char_def.bin`,`matrix.mtx`,`dict.da`,`dict.vals`,`unk.bin`,`dict.wordsidx`,`dict.words`];async function Pr(e){if(typeof DecompressionStream>`u`)throw Error(`DecompressionStream is not available; serve the dictionary uncompressed`);let t=new Blob([e]).stream().pipeThrough(new DecompressionStream(`gzip`));return new Uint8Array(await new Response(t).arrayBuffer())}async function Fr(e,t={}){let{compressed:n=!0,...r}=t,i=e.endsWith(`/`)?e:`${e}/`,a=await Promise.all(Nr.map(async e=>{let t=await jr(`${i}${e}${n?`.gz`:``}`,r);return[e,n?await Pr(t):t]}));return Object.fromEntries(a)}function Ir(e,t){e.init_dictionary(t[`metadata.json`],t[`char_def.bin`],t[`matrix.mtx`],t[`dict.da`],t[`dict.vals`],t[`unk.bin`],t[`dict.wordsidx`],t[`dict.words`])}var Lr=new Set([`a`,`i`,`u`,`e`,`o`,`A`,`I`,`U`,`E`,`O`,`N`,`cl`]);function Rr(e,t,n){let r=Math.abs(e),i=r<=t?r:t+(r-t)*.5;return Math.sign(e)*Math.min(n,i)}var zr=new Set([`A`,`I`,`U`,`E`,`O`]),Br=new Set([`k`,`ky`,`s`,`sh`,`t`,`ty`,`ch`,`ts`,`h`,`hy`,`f`,`p`,`py`]);function Vr(e){let t=[],n=null,r=``;for(let i=0;i<e.length;i++){let{phone:a,start_ms:o,duration_ms:s}=e[i];if(a===`sil`||a===`pau`){if(n!==null&&(t.push({pause:!1,startMs:n,nucleusMs:n,endMs:o,devoiced:!1,onset:r}),n=null),i===0)continue;t.push({pause:!0,startMs:o,nucleusMs:o,endMs:o+s,devoiced:!1,onset:``});continue}n===null&&(n=o,r=Lr.has(a)?``:a),Lr.has(a)&&(t.push({pause:!1,startMs:n,nucleusMs:o,endMs:o+s,devoiced:zr.has(a),onset:r}),n=null)}if(n!==null){let i=e[e.length-1];t.push({pause:!1,startMs:n,nucleusMs:n,endMs:i.start_ms+i.duration_ms,onset:r,devoiced:!1})}return t}function Hr(e){return e.pause?e.startMs:e.nucleusMs}function Ur(e,t,n={}){let{intonationStrength:r=1,frameMs:i=10,fallbackPauseMs:a=150,kneeCents:o=400,maxCents:s=700,unvoicedBridgeMs:c=120}=n,l=Vr(e.phonemes),u=Array(t.length).fill(null),d=Array(t.length).fill(!1),f=Array(t.length).fill(0),p=Array(t.length).fill(!1),m=0;for(let e=0;e<t.length;e++){let n=t[e];for(;m<l.length&&l[m].pause&&!n.pause;)m++;let r=l[m];if(n.pause){r?.pause&&(u[e]=m++);continue}if(!r)return null;u[e]=m++,d[e]=r.devoiced,f[e]=Math.max(0,r.nucleusMs-r.startMs),p[e]=Br.has(r.onset)}if(l.slice(m).some(e=>!e.pause))return null;let h=Array(t.length).fill(0),g=Array(t.length).fill(null);for(let e=0;e<t.length;e++){let n=u[e];if(n===null){h[e]=a;continue}let r=Hr(l[n]),i=e+1;for(;i<t.length&&u[i]===null;)i++;let o=l[n].endMs;if(i<t.length){let e=u[i];o=Hr(l[e]);for(let t=n+1;t<e;t++)l[t].pause&&(o-=l[t].endMs-l[t].startMs)}h[e]=Math.max(0,o-r),g[e]=r}let _=e.f0_hz.slice();for(let t of e.phonemes){if(!Br.has(t.phone)&&t.phone!==`cl`)continue;let n=Math.max(0,Math.round(t.start_ms/e.frame_ms)),r=Math.min(_.length,Math.round((t.start_ms+t.duration_ms)/e.frame_ms));for(let e=n;e<r;e++)_[e]=0}let v=new Float64Array(_.length),y=[];for(let e=0;e<_.length;e++)_[e]>0&&y.push(e);if(y.length===0)return null;let b=y.map(e=>_[e]).sort((e,t)=>e-t),x=b[Math.floor(b.length/2)];for(let t=0,n=0;t<_.length;t++){if(_[t]>0){v[t]=Math.log2(_[t]);continue}for(;n<y.length&&y[n]<t;)n++;let r=y[n],i=n>0?y[n-1]:void 0;if(i===void 0)v[t]=Math.log2(_[r]);else if(r===void 0)v[t]=Math.log2(_[i]);else{if((r-i)*e.frame_ms>c){v[t]=Math.log2(t-i<=(r-i)/2?_[i]:_[r]);continue}let n=Math.max(i,r-Math.ceil(20/e.frame_ms));if(t<=n){v[t]=Math.log2(_[i]);continue}let a=(t-n)/(r-n);v[t]=Math.log2(_[i])*(1-a)+Math.log2(_[r])*a}}let S=Math.log2(x),C=t=>{let n=Math.max(0,t)/e.frame_ms,r=Math.min(v.length-1,Math.floor(n)),i=Math.min(v.length-1,r+1),a=n-Math.floor(n);return(v[r]*(1-a)+v[i]*a-S)*1200},w=[],T=0;for(let e=0;e<t.length;e++)w.push(T),T+=h[e];let E=T,D=Math.max(2,Math.ceil(E/i)+2),O=Array(D),k=0;for(let n=0;n<D;n++){let a=n*i;for(;k+1<t.length&&a>=w[k+1];)k++;let c=g[k],l;l=c===null?g.slice(k+1).find(e=>e!==null)??e.phonemes.at(-1)?.start_ms??0:c+(a-w[k]),O[n]=Rr(C(l)*r,o,s)}return{moraDurationsMs:h,pitchCurve:{frame_ms:i,cents:O},medianHz:x,durationMs:E,devoiced:d,consonantMs:f,unvoicedOnset:p}}var Wr=new Set([`、`,`。`,`？`,`！`,`,`,`.`,`?`,`!`]),Gr=new Set([`ぁ`,`ぃ`,`ぅ`,`ぇ`,`ぉ`,`ゃ`,`ゅ`,`ょ`,`ゎ`,`ゕ`,`ゖ`]);function Kr(e){let t=e.charCodeAt(0);return 12449<=t&&t<=12534?String.fromCharCode(t-96):e}function qr(e){let t=[],n=e.normalize(`NFC`).replace(/'/g,``).replace(/’/g,``);for(let e of n){if(/\s/.test(e)||Wr.has(e)){t.length>0&&!t[t.length-1].pause&&t.push({mora:``,pause:!0});continue}let n=Kr(e);Gr.has(n)&&t.length>0&&!t[t.length-1].pause?t[t.length-1].mora+=n:t.push({mora:n,pause:!1})}return t}function Jr(e,t){return t===1?e===1:t>1?2<=e&&e<=t:e>=2}var Yr=/[。．！？!?.]/u,Xr=/[、，,]/u;function Zr(e){return e===void 0?`clause`:Yr.test(e)?`sentence`:Xr.test(e)?`clause`:`space`}function Qr(e){if(e===void 0)return 0;switch(Zr(e)){case`sentence`:return 3;case`clause`:return 2;default:return 1}}function $r(e){let t=[],n=[],r=0;for(;r<e.length;){let i=e[r];if((i.pron||``).replace(/'/g,``).replace(/’/g,``),i.mora_size===0||Wr.has(i.string)){t.push(i.string||`、`);let e=n[n.length-1];n.length>0&&!e.pause?n.push({mora:``,pause:!0,punctuation:i.string||`、`}):e?.pause&&Qr(i.string)>Qr(e.punctuation)&&(e.punctuation=i.string),r++;continue}let a=[];for(;r<e.length;){let n=e[r];if(n.mora_size===0||Wr.has(n.string)||a.length>0&&n.chain_flag!==1)break;let i=(n.pron||``).replace(/'/g,``).replace(/’/g,``),o=qr(i).filter(e=>!e.pause);a.push({current:n,morae:o}),t.push(i),r++}let o=a.reduce((e,t)=>e+t.morae.length,0),s=a[0].current.acc||0,c=0;for(let{current:e,morae:t}of a)for(let r=1;r<=t.length;r++)c++,n.push({mora:t[r-1].mora,pause:!1,accent_phrase_position:c,accent_phrase_length:o,accent_nucleus:s,accent_high:Jr(c,s),accent_phrase_start:c===1,accent_phrase_end:c===o,word_start:r===1,word_end:r===t.length,pos:e.pos||`*`,pos_group1:e.pos_group1||`*`})}return{reading:t.join(``),features:n}}function ei(e){if(e.pause||e.accent_phrase_position===void 0||e.accent_phrase_length===void 0||e.accent_nucleus===void 0)return{};let t=Math.max(1,e.accent_phrase_length),n=e.accent_phrase_position,r=e.accent_nucleus,i={accent_position:n/t,accent_from_end:(t-n)/t,accent_nucleus_position:r/t,accent_high:+!!e.accent_high,accent_phrase_start:+!!e.accent_phrase_start,accent_phrase_end:+!!e.accent_phrase_end,word_start:+!!e.word_start,word_end:+!!e.word_end};return i[`pos=${e.pos||`*`}`]=1,i[`pos_group1=${e.pos_group1||`*`}`]=1,r===0?i[`accent_type=heiban`]=1:n<r?i[`accent_type=before`]=1:n===r?i[`accent_type=nucleus`]=1:i[`accent_type=after`]=1,i}var ti=/[\s」』）)〕】＞>"'”’]+$/u;function ni(e){return/[？?]$/u.test(e.replace(ti,``))}function ri(e){let t=Math.min(1,Math.max(0,e));return t*t*(3-2*t)}var ii={sentence:650,clause:380,space:500};function ai(e,t,n={}){let{pauseMs:r=ii,durationContrast:i=1.3,minMoraMs:a=60,minShrink:o=.85}=n,s=Math.min(t.length,e.length),c=0,l=0;for(let n=0;n<s;n++)t[n].pause||(c+=e[n],l++);let u=l>0?c/l:0,d=e.slice(),f=!1;for(let n=0;n<s;n++){let c=t[n],l=e[n];if(c.pause){if(r&&n<s-1){let e=Zr(c.punctuation);l=Math.max(l,r[e]??ii[e])}}else i!==1&&l>0&&(l=Math.max(Math.min(l,a),l*o,u+(l-u)*i));l!==e[n]&&(d[n]=l,f=!0)}return f?d:e}function oi(e,t,n,r){let i=Math.min(n.length,r.length),a=[],o=[],s=0,c=0;for(let e=0;e<i;e++)a.push(s),o.push(c),s+=n[e],c+=r[e];let l=Math.max(2,Math.ceil(c/t)+2),u=Array(l),d=e.length-1;if(d<0)return u.fill(0);let f=0;for(let s=0;s<l;s++){let c=s*t;for(;f+1<i&&c>=o[f+1];)f++;let l=r[f]>0?(c-o[f])/r[f]:0,p=(a[f]+l*n[f])/t,m=Math.min(d,Math.max(0,Math.floor(p))),h=Math.min(d,m+1),g=Math.min(1,Math.max(0,p-Math.floor(p)));u[s]=e[m]*(1-g)+e[h]*g}return u}function si(e,t,n={}){let{question:r=!1,questionRiseCents:i=350,energyDbPerSemitone:a=0,devoicedGain:o=1,minGain:s=.35,maxGain:c=1.8,pitchShiftCents:l=0}=n,{frame_ms:u}=e.pitchCurve,d=ai(e.moraDurationsMs,t,n),f=d===e.moraDurationsMs?e.pitchCurve.cents.slice():oi(e.pitchCurve.cents,u,e.moraDurationsMs,d),p=Math.min(t.length,d.length),m=[],h=[],g=0;for(let e=0;e<p;e++)m.push(g/u),g+=d[e],h.push(g/u);for(let e=p;e<d.length;e++)g+=d[e];let _=g;if(l!==0)for(let e=0;e<f.length;e++)f[e]+=l;let v=e=>[Math.max(0,Math.min(f.length,Math.round(m[e]))),Math.max(0,Math.min(f.length,Math.round(h[e])))];if(r&&i>0){let e=-1;for(let n=p-1;n>=0;n--)if(!t[n].pause){e=n;break}if(e>=0){let[t,n]=v(e);if(n>t){let e=i-(f[n-1]-f[t]);if(e>0)for(let r=t;r<f.length;r++){let i=(r-t)/(n-t);f[r]+=e*ri((i-.25)/.75)}}}}let y=Array(t.length).fill(1);for(let n=0;n<p;n++){if(t[n].pause)continue;let r=0;if(a!==0){let[e,t]=v(n);if(t>e){let n=0;for(let r=e;r<t;r++)n+=f[r];r+=n/(t-e)/100*a}}let i=10**(r/20);e.devoiced[n]&&(i*=o),y[n]=Math.min(c,Math.max(s,i))}return{...e,moraDurationsMs:d,durationMs:_,pitchCurve:{frame_ms:u,cents:f},moraGains:y}}var ci={neutral:{speed:1,intonation:1,pitchShiftCents:0,pauseScale:1,durationContrast:1.3,energyDbPerSemitone:.8},calm:{speed:.9,intonation:.9,pitchShiftCents:-100,pauseScale:1.4,durationContrast:1.2,energyDbPerSemitone:.6},lively:{speed:1.08,intonation:1.3,pitchShiftCents:100,pauseScale:.85,durationContrast:1.4,energyDbPerSemitone:1}},li={sentence:650,clause:380,space:500};function ui(e=`neutral`){if(typeof e==`string`)return{...ci[e]};let{preset:t=`neutral`,...n}=e;return{...ci[t],...n}}function di(e){return{intonationStrength:e.intonation}}function fi(e){return{pauseMs:{sentence:li.sentence*e.pauseScale,clause:li.clause*e.pauseScale,space:li.space*e.pauseScale},durationContrast:e.durationContrast,pitchShiftCents:e.pitchShiftCents}}function pi(e){return{energyDbPerSemitone:e.energyDbPerSemitone}}function mi(e){return e.map(e=>e.pause?`、`:e.mora).join(``)}var hi=mr,gi=e=>Math.round(e/1e3*hi);function _i(e,t,n){let r=Math.max(0,t),i=Math.min(e.length,n);if(i<=r)return NaN;let a=0;for(let t=r;t<i;t++)a+=e[t]*e[t];return 10*Math.log10(a/(i-r)+1e-12)}function vi(e,t,n){let r=t.length-1;if(!(r<0))for(let i=0;i<e.length;i++){let a=i/n-.5,o=Math.min(r,Math.max(0,Math.floor(a))),s=Math.min(r,o+1),c=Math.min(1,Math.max(0,a-o));e[i]*=10**((t[o]*(1-c)+t[s]*c)/20)}}function yi(e,t){let n=1-t;if(!(n<=0))for(let r=0;r<e.length;r++){let i=e[r],a=Math.abs(i);if(a<=t)continue;let o=t+n*Math.tanh((a-t)/n);e[r]=i<0?-o:o}}function bi(e,t){let n=e.f0_curve;if(n.length===0)return e.reference_hz||220;let r=Math.max(0,t)/e.frame_ms,i=Math.floor(r);if(i>=n.length-1)return n[n.length-1];let a=r-i;return n[i]*(1-a)+n[i+1]*a}function xi(e,t){let n=e.morae??[],r=e.mora_timings??[],i=n.length===t.length,a=e=>{if(i)return e.position;let n=-1;for(let i=0;i<r.length&&i<t.length&&r[i].StartMS<=e.note_start_ms+1e-6;i++)n=i;return n};for(let n of e.timeline.units){let e=a(n),r=t[e];e<0||r===void 0||!Number.isFinite(r)||(n.volume*=r)}}function Si(e,t){let{consonantMs:n,unvoicedOnset:r}=t;if(!n||!r||n.length!==(e.morae?.length??-1))return;let i=e.timeline.leading_ms,a=e.timeline.units;for(let e=0;e+1<a.length;e++){let t=a[e],o=a[e+1];if(o.position!==t.position+1||!r[o.position])continue;let s=n[o.position];if(!(s>0))continue;let c=o.note_start_ms+i-s;if(c>=t.position_ms+t.length_ms)continue;let l=Math.max(40,t.fade_in_ms+t.fade_out_ms+10,t.note_start_ms+i-t.position_ms+30);t.length_ms=Math.max(l,c-t.position_ms)}}function Ci(e,t,n){let r=[];if(e.length===0)return r;let i=0,a=e[0].position_ms+e[0].length_ms,o=!1;for(let s=1;s<=e.length;s++){let c=r.length===0?t:n,l=s===e.length,u=!l&&e[s].position_ms>=a-1e-6,d=!l&&s-i>=c;if(l||u||d){let t=!l&&!u;r.push({start:i,end:s,headSeam:o,tailSeam:t}),i=s,o=t,l||(a=e[s].position_ms+e[s].length_ms);continue}a=Math.max(a,e[s].position_ms+e[s].length_ms)}return r}function wi(e,t){let n=e.position_ms+e.fade_in_ms+t/2,r=e.position_ms+e.length_ms-t/2;return Math.min(n,Math.max(e.position_ms+t/2,r))}function Ti(e,t,n,r){let i=Math.max(1,Math.min(n,e.length-t));for(let n=0;n<i;n++){let a=(n+.5)/i,o=r?Math.sin(Math.PI/2*a):Math.cos(Math.PI/2*a);e[t+n]*=o}}function Ei(e){let t=e.slice().sort((e,t)=>e-t);return t[Math.floor(t.length/2)]}function Di(e,t,n,r,i){let a=n.frame_ms>0?n.frame_ms:10,o=Math.max(1,gi(a)),s=Math.ceil(e.length/o)+1,c=new Float64Array(s);if(i.equalize){let o=[],l=[];for(let i of t){if(!(i.volume>0)||i.duration_ms<30)continue;let t=i.note_start_ms+n.leading_ms-r,o=i.position_ms-r+i.length_ms-i.fade_out_ms,s=gi(t+i.duration_ms*.35),c=gi(Math.min(t+i.duration_ms*.9,o));if(c-s<gi(20))continue;let u=_i(e,s,c);!Number.isFinite(u)||u<-70||l.push({frame:(t+i.duration_ms*.6)/a,intrinsicDb:u-20*Math.log10(i.volume/100)})}if(l.length>0){let e=i.targetDb;for(let t of l)o.push({frame:t.frame,db:Math.max(-i.maxDb,Math.min(i.maxDb,e-t.intrinsicDb))});let t=0;for(let e=0;e<s;e++){for(;t+1<o.length&&e>=o[t+1].frame;)t++;let n=o[t],r=o[Math.min(o.length-1,t+1)];if(e<=n.frame||r===n)c[e]=n.db;else if(e>=r.frame)c[e]=r.db;else{let t=(e-n.frame)/(r.frame-n.frame);c[e]=n.db*(1-t)+r.db*t}}}}if(i.energyDbPerSemitone!==0&&i.referenceHz>0)for(let e=0;e<s;e++){let t=bi(n,r+e*a);if(!(t>0))continue;let o=12*Math.log2(t/i.referenceHz);c[e]+=Math.max(-i.energyMaxDb,Math.min(i.energyMaxDb,o*i.energyDbPerSemitone))}if(i.devoicedDb<0){let e=Math.max(1,Math.round(20/a));for(let o=0;o<t.length;o++){let l=t[o];if(!l.devoiced)continue;let u=l.note_start_ms+n.leading_ms-r,d=u+l.duration_ms,f=t[o+1];f&&(d=Math.min(d,f.position_ms-r));let p=u/a,m=d/a;for(let t=Math.max(0,Math.floor(p));t<s&&t<m+e;t++){let n=Math.min(1,Math.max(0,(t-p)/e)),r=Math.min(1,Math.max(0,(m+e-t)/e));c[t]+=i.devoicedDb*Math.min(n,r)}}}vi(e,c,o)}var Oi=class e{constructor(e){this.worldline=e}worldline;static modelId=null;bankAliases=new WeakMap;currentBank=null;pcmCache=new Map;static async initializeWasm(e=`utautts.wasm`,t={}){if(typeof utautts_plan==`function`)return;if(typeof Go>`u`)throw Error(`wasm_exec.js must be loaded before calling initializeWasm.`);let n=new Go,r=(t.fetch??fetch)(e),i;try{i=(await WebAssembly.instantiateStreaming(r,n.importObject)).instance}catch{let r=await(await(t.fetch??fetch)(e)).arrayBuffer();i=(await WebAssembly.instantiate(r,n.importObject)).instance}n.run(i);for(let e=0;e<100&&typeof utautts_plan!=`function`;e++)await new Promise(e=>setTimeout(e,10));if(typeof utautts_plan!=`function`)throw Error(`utautts_plan failed to initialize in global scope.`)}static get ready(){return typeof utautts_plan==`function`}static setModel(t){e.assertReady();let n=utautts_set_model(t);if(!n.success)throw Error(`UtauTTS model error: ${n.error}`);return e.modelId=n.id??null,e.modelId}static get currentModelId(){return e.modelId}static assertReady(){if(typeof utautts_plan!=`function`)throw Error(`UtauTTS wasm is not initialized; call UtauTTSAdapter.initializeWasm() first.`)}setBank(t){if(e.assertReady(),this.currentBank===t&&this.bankAliases.has(t))return;let n={},r={};for(let[e,i]of Object.entries(t.manifest.phonemes))n[e]=[{Filename:`koe:${e}`,Alias:e,Offset:0,Fixed:i.consonant/48,Blank:0,Preutterance:i.pre/48,Overlap:i.overlap/48,SourceGroup:`koe`}],i.pitch>0&&(r[e]=i.pitch);let i=utautts_set_bank(JSON.stringify({name:`koe`,oto_entries:n,source_pitch_hz:r}));if(!i.success)throw Error(`UtauTTS bank error: ${i.error}`);this.bankAliases.set(t,i.aliases??0),this.currentBank=t,this.pcmCache.clear()}plan(e,t,n,r={}){this.setBank(e);let i={text:t,reading:mi(n),frames:n.map(e=>ei(e)),tone:r.tone??`C4`,mora_duration_ms:r.moraDurationMs??0,pause_duration_ms:r.pauseDurationMs??0,release_ms:r.releaseMs??20,leading_preutterance_ms:r.leadingPreutteranceMs??0,apply_pitch:r.applyPitch??!0,intonation_strength:r.intonationStrength??1,speech_timing:r.speechTiming??!1,word_boundary_envelope:r.wordBoundaryEnvelope??!1,mora_durations_ms:r.prosody?.moraDurationsMs,pitch_curve:r.prosody?.pitchCurve},a=utautts_plan(JSON.stringify(i));if(!a.success||!a.plan)throw Error(`UtauTTS error: ${a.error??`no plan`}`);let o=JSON.parse(a.plan),s=r.prosody?.moraGains;s&&xi(o,s);let c=r.prosody?.devoiced;if(c&&c.length===(o.morae?.length??-1))for(let e of o.timeline.units)c[e.position]&&(e.devoiced=!0);return r.prosody&&Si(o,r.prosody),o}getPcm(e,t){let n=this.pcmCache.get(t);return n||(n=e.getPcm(t),this.pcmCache.set(t,n)),n}async*renderChunks(e,t,n={}){let{firstChunkUnits:r=3,chunkUnits:i=6,seamCrossfadeMs:a=20,normalizeUnitLoudness:o=!0,unitLoudnessDb:s=-16,unitLoudnessMaxDb:c=6,energyDbPerSemitone:l=.8,energyMaxDb:u=6,devoicedDb:d=-9,outputLimit:f=.8,signal:p}=n,m=t.timeline,h=m.units.filter(e=>e.length_ms>0),g=m.f0_curve.filter(e=>e>0),_=g.length>0?Ei(g):0,v=Ci(h,Math.max(1,r),Math.max(1,i)),y=Math.max(2,gi(a));for(let t=0;t<v.length;t++){if(p?.aborted)return;let r=v[t],i=r.headSeam?r.start-1:r.start,g=r.tailSeam?r.end+1:r.end,b=h.slice(i,g),x=Math.min(...b.map(e=>e.position_ms)),S=[];for(let t of b){let n=await this.getPcm(e,t.alias);if(!n||n.length<hr){console.warn(`[utautts] no usable PCM for alias "${t.alias}"; skipped`);continue}S.push({pcm:n,posMs:t.position_ms-x,skipMs:t.skip_ms,lengthMs:t.length_ms,fadeInMs:t.fade_in_ms,fadeOutMs:t.fade_out_ms,consonantMs:t.consonant_ms,requiredLengthMs:t.required_length_ms,volume:t.volume,tone:t.tone})}if(p?.aborted)return;if(S.length===0)continue;let C=this.worldline.renderPhrase({units:S,pitch:e=>bi(m,x+e),gender:n.gender,tension:n.tension,breathiness:n.breathiness,voicing:n.voicing});if(!C||C.length===0)continue;(o||l!==0||d<0)&&Di(C,b,m,x,{equalize:o,targetDb:s,maxDb:c,energyDbPerSemitone:l,energyMaxDb:u,devoicedDb:d,referenceHz:_});let w=0,T=C.length,E=x;if(r.headSeam){let e=wi(h[r.start],a);w=Math.max(0,gi(e-x)-y/2),E=x+w/hi*1e3}if(r.tailSeam){let e=wi(h[r.end],a);T=Math.min(C.length,gi(e-x)+y/2)}if(T<=w)continue;let D=C.slice(w,T);f>0&&yi(D,f),r.headSeam&&Ti(D,0,y,!0),r.tailSeam&&Ti(D,Math.max(0,D.length-y),y,!1),yield{pcm:D,startMs:E,index:t,units:h.slice(r.start,r.end)},await new Promise(e=>setTimeout(e,0))}}async synthesizeText(e,t,n,r={}){let i=this.plan(e,t,n,r),a=gi(i.timeline.duration_ms)+gi(200),o=new Float32Array(a),s=!1;for await(let t of this.renderChunks(e,i,r)){s=!0;let e=gi(t.startMs),n=Math.min(t.pcm.length,o.length-e);for(let r=0;r<n;r++)o[e+r]+=t.pcm[r]}let c=r.outputLimit??.8;return s&&c>0&&yi(o,c),s?o:null}},ki=.35,Ai=5.5,ji=35,Mi=150,Ni=e=>e<=0?1:2**(ji*Math.min(1,e/Mi)*Math.sin(2*Math.PI*Ai*e/1e3)/1200),Pi=.35,Fi=.8,Ii=120,Li=400,Ri=4,zi=.9,Bi=e=>440*2**((e-2139)/372),Vi=e=>e*e*(3-2*e),Hi=(e,t)=>e.map((n,r)=>{let i=n.atSec*1e3,a=r===0?0:e[r-1].atSec*1e3,o=r+1<e.length?e[r+1].atSec*1e3:t??i+(i-a),s=Math.max(0,Math.min(i-a,o-i)),c=n.portamento?Fi:Pi,l=n.portamento?Li:Ii;return Math.min(Math.max(Ri,Math.min(s*c,l)),s*zi)}),Ui=(e,t)=>{let n=Hi(e,t);return e.map((e,t)=>({hz:Bi(e.pitch),startMs:Math.max(0,e.atSec*1e3-n[t]/2),glideMs:n[t]}))},Wi=(e,t,n,r,i)=>{let a=t?.length?Ui(t,i):null;return!a&&!r?e:t=>{let i=t-n,o=e;if(a&&i>0)for(let e of a){if(i>=e.startMs+e.glideMs){o=e.hz;continue}if(i<=e.startMs)break;let t=Vi((i-e.startMs)/e.glideMs);o*=(e.hz/o)**t;break}return r?o*Ni(i):o}},Gi=(e,t)=>!e?.length||t===0?e:e.map(e=>({...e,pitch:e.pitch+t})),Ki=e=>e?.length?`|s${e.map(e=>`${e.pitch}@${Math.round(e.atSec*100)}${e.portamento?`~`:``}`).join(`,`)}`:``,qi=[`neutral`,`happy`,`sad`,`angry`],Ji=e=>`hts/tohoku-f01-${e}.htsvoice`,Yi=new Set([`a`,`i`,`u`,`e`,`o`,`n`]),Xi=e=>{let t=oa(e),n=[];for(let r of e.timeline.units){if(r.length_ms<=0)continue;let i=e.morae[r.position]?.Vowel??``;if(!Yi.has(i))continue;let a=Math.max(0,r.position_ms/1e3-t),o=Math.max(a,(r.position_ms+r.length_ms)/1e3-t);n.push({startSec:a,endSec:o,mora:r.mora||e.morae[r.position]?.Text||``,vowel:i})}return n},Zi=e=>pi(ui(e)),Qi=`https://onjmin.github.io/koe/demo/utautts/`,$i=(e,t)=>`${e.endsWith(`/`)?e:`${e}/`}${t}`,ea=e=>new Promise((t,n)=>{if(globalThis.Go!==void 0){t();return}if(typeof document>`u`){n(Error(`wasm_exec.js needs a document to load into`));return}let r=document.createElement(`script`);r.src=e,r.async=!0,r.onload=()=>t(),r.onerror=()=>n(Error(`failed to load ${e}`)),document.head.appendChild(r)}),ta=t=>e(()=>import(t),[]),na=null,ra=(e={})=>{let t=e.baseUrl??`https://onjmin.github.io/koe/demo/utautts/`;if(na)return na.baseUrl!==t&&console.warn(`[dtm] TTS assets are already loaded from ${na.baseUrl}; ignoring ${t}`),e.onProgress&&na.planner.onProgress(e.onProgress),na.planner;let n=ia({...e,baseUrl:t});return na={baseUrl:t,planner:n},n},ia=(e={})=>{let t=e.baseUrl??`https://onjmin.github.io/koe/demo/utautts/`,n=null,r=null,i=null,a=!1,o=new Map,s=new Map,c=null,l=new Set;e.onProgress&&l.add(e.onProgress);let u=new Map,d=()=>{let e=0,t=0;for(let n of u.values())e+=n.loaded,t+=n.total;return[e,t]},f=e=>{if(l.add(e),i&&!a){let[t,n]=d();n>0&&e(t,n)}return()=>{l.delete(e)}},p=async()=>{u.clear();let e=e=>{if(l.size===0)return;u.set(e.url,e);let[t,n]=d();for(let e of l)e(t,n)},i=t=>Ar(t,{onProgress:e}),s=(async()=>{let n=await ta($i(t,`jpreprocess_wasm/jpreprocess_wasm.js`));return await n.default({module_or_path:i($i(t,`jpreprocess_wasm/jpreprocess_wasm_bg.wasm`))}),n.is_ready()||Ir(n,await Fr($i(t,`jpreprocess_wasm/naist-jdic`),{onProgress:e})),n})(),f=(async()=>{await ea($i(t,`wasm_exec.js`)),await Oi.initializeWasm($i(t,`utautts.wasm`),{fetch:i}),Oi.setModel(await Mr($i(t,`frame-intonation-v8.json`),{onProgress:e}))})(),p=jr($i(t,Ji(`neutral`)),{onProgress:e}),[m,,h]=await Promise.all([s,f,p]);o.set(`neutral`,h),m.is_voice_ready()||(m.init_voice(h),c=`neutral`),n=m,r=new Oi(null),a=!0},m=()=>(i||=p().catch(e=>{throw i=null,e}),i),h=async e=>{if(await m(),o.has(e))return;let n=s.get(e);n||(n=jr($i(t,Ji(e)),{onProgress:e=>{if(l.size===0)return;u.set(e.url,e);let[t,n]=d();for(let e of l)e(t,n)}}).then(t=>{o.set(e,t)}).finally(()=>s.delete(e)),s.set(e,n)),await n},g=e=>{if(!n||c===e)return;let t=o.get(e);if(!t){console.warn(`[dtm] HTS voice "${e}" is not prepared; keeping "${c??`neutral`}"`);return}n.init_voice(t),c=e};return{ready:m,isReady:()=>a,onProgress:f,prepareEmotion:h,plan:(e,t,i={})=>{if(!n||!r)throw Error(`speech planner is not ready; await ready() first`);let a=ui(i.style),o=i.intonationStrength??a.intonation,{features:s}=$r(JSON.parse(n.analyze_text(t)));if(s.length===0)throw Error(`no readable morae in "${t}"`);let c=null;return n.is_voice_ready()&&(g(i.emotion??`neutral`),c=Ur(JSON.parse(n.analyze_prosody(t,a.speed)),s,{...di(a),intonationStrength:o}),c&&=si(c,s,{...fi(a),question:ni(t)})),r.plan(e,t,s,{tone:i.tone??`C4`,intonationStrength:o,prosody:c??void 0})}}},aa=(e,t,n=e=>e)=>{let r=e.timeline;return{...e,timeline:{...r,f0_curve:r.f0_curve.map(e=>e*t),units:r.units.map(e=>({...e,alias:n(e.alias),target_f0_hz:e.target_f0_hz*t}))}}},oa=e=>Math.max(0,e.timeline.leading_ms||0)/1e3,sa=e=>{let t=e.timeline,n=0;for(let e of t.units)n=Math.max(n,e.position_ms+e.length_ms);return n<=0&&(n=t.duration_ms),Math.max(0,n/1e3-oa(e))},ca=(e,t,n=6)=>{let r=[...new Set(e.timeline.units.filter(e=>e.length_ms>0).map(e=>e.alias))],i=0,a=async()=>{for(;i<r.length;){let e=r[i++];try{await t(e)}catch{}}};for(let e=0;e<Math.min(n,r.length);e++)a()},la=(e,t)=>new Proxy(e,{get:(e,n,r)=>n===`getPcm`?t:Reflect.get(e,n,r)}),ua=e=>{let t=Object.values(e).map(e=>e.pitch).filter(e=>e>0).sort((e,t)=>e-t);if(t.length===0)return;let n=t.length>>1;return t.length%2?t[n]:(t[n-1]+t[n])/2},da=200,fa=120,pa=100,ma=64,ha=100,ga=127,_a=192,va=`#end;`,ya=0,ba=3937,xa=e=>372/e,Sa=e=>Math.floor((ba-0)/xa(e))+1,Ca=Sa(12),wa=`\0`,Ta=(e,t)=>`${wa}${e}${wa}${t}`,Ea=e=>{if(!e.startsWith(wa))return null;let t=e.slice(wa.length).split(wa);return t.length===2?[t[0],t[1]]:null},Da={あ:[``,`a`],い:[``,`i`],う:[``,`u`],え:[``,`e`],お:[``,`o`],か:[`k`,`a`],き:[`k`,`i`],く:[`k`,`u`],け:[`k`,`e`],こ:[`k`,`o`],さ:[`s`,`a`],し:[`sh`,`i`],す:[`s`,`u`],せ:[`s`,`e`],そ:[`s`,`o`],た:[`t`,`a`],ち:[`ch`,`i`],つ:[`ts`,`u`],て:[`t`,`e`],と:[`t`,`o`],な:[`n`,`a`],に:[`n`,`i`],ぬ:[`n`,`u`],ね:[`n`,`e`],の:[`n`,`o`],は:[`h`,`a`],ひ:[`h`,`i`],ふ:[`f`,`u`],へ:[`h`,`e`],ほ:[`h`,`o`],ま:[`m`,`a`],み:[`m`,`i`],む:[`m`,`u`],め:[`m`,`e`],も:[`m`,`o`],や:[`y`,`a`],ゆ:[`y`,`u`],よ:[`y`,`o`],ら:[`r`,`a`],り:[`r`,`i`],る:[`r`,`u`],れ:[`r`,`e`],ろ:[`r`,`o`],わ:[`w`,`a`],を:[`w`,`o`],が:[`g`,`a`],ぎ:[`g`,`i`],ぐ:[`g`,`u`],げ:[`g`,`e`],ご:[`g`,`o`],ざ:[`z`,`a`],じ:[`j`,`i`],ず:[`z`,`u`],ぜ:[`z`,`e`],ぞ:[`z`,`o`],だ:[`d`,`a`],ぢ:[`j`,`i`],づ:[`z`,`u`],で:[`d`,`e`],ど:[`d`,`o`],ば:[`b`,`a`],び:[`b`,`i`],ぶ:[`b`,`u`],べ:[`b`,`e`],ぼ:[`b`,`o`],ぱ:[`p`,`a`],ぴ:[`p`,`i`],ぷ:[`p`,`u`],ぺ:[`p`,`e`],ぽ:[`p`,`o`],ゔ:[`v`,`u`],ん:[`N`,`N`]},Oa={ぢ:`じ`,づ:`ず`,ぢゃ:`じゃ`,ぢゅ:`じゅ`,ぢょ:`じょ`},ka={a:`ば`,i:`び`,u:`ぶ`,e:`べ`,o:`ぼ`},Aa=e=>e.replace(/[ぁ-ゖ]/g,e=>String.fromCharCode(e.charCodeAt(0)+96)),ja=`ぁぃぅぇぉゃゅょ`,Ma=`゜`,Na={a:`あ`,i:`い`,u:`う`,e:`え`,o:`お`},Pa=`ー`,Fa=`〜`,Ia=`っ`,La=`_`,Ra=`、`,za=`↓`,Ba=`↑`,Va=`「`,Ha=`」`,Ua=e=>{let t=[],n=``,r=0;for(;r<e.length;){let i=e[r];if(i===`「`||i===`｢`){let i=-1;for(let t=r+1;t<e.length;t++)if(e[t]===`」`||e[t]===`｣`){i=t;break}n&&t.push({sung:n}),n=``;let a=i<0?e.slice(r+1):e.slice(r+1,i);t.push({speak:a}),r=i<0?e.length:i+1;continue}n+=i,r++}return n&&t.push({sung:n}),t},Wa=e=>e.replace(/[\r\n;]+/g,` `).replace(/\s+/g,` `).trim(),Ga=e=>e.normalize(`NFKC`).replace(/\u309a/g,Ma).replace(/[ガギグゲゴ]/g,e=>String.fromCharCode(e.charCodeAt(0)-96)+Ma).replace(/[ァ-ヶ]/g,e=>String.fromCharCode(e.charCodeAt(0)-96)).replace(/~/g,`〜`).replace(/,/g,`、`).replace(/[↡⇩⬇🡇]/gu,`↓`).replace(/[↟⇧⬆🡅]/gu,`↑`).replace(/[^ぁ-ゖー〜_、↓↑゜]/g,``),Ka=e=>{let t=[];for(let n of e){let e=t[t.length-1],r=e!==void 0&&!`ー〜_、↓↑`.includes(e[e.length-1]);r&&ja.includes(n)?t[t.length-1]+=n:n===Ma?r&&!e.includes(Ma)&&(t[t.length-1]+=n):t.push(n)}return t},qa=e=>/[ぁゃ]/.test(e)?`a`:/[ぃ]/.test(e)?`i`:/[ぅゅ]/.test(e)?`u`:/[ぇ]/.test(e)?`e`:/[ぉょ]/.test(e)?`o`:/[あかさたなはまやらわがざだばぱ]/.test(e)?`a`:/[いきしちにひみりぎじぢびぴ]/.test(e)?`i`:/[うくすつぬふむゆるぐずづぶぷ]/.test(e)?`u`:/[えけせてねへめれげぜでべぺ]/.test(e)?`e`:/[おこそとのほもよろごぞどぼぽ]/.test(e)?`o`:``,Ja=e=>{if(e===`ー`)return{kana:e,consonant:`-`,vowel:`-`,kind:`tie`};if(e===`〜`)return{kana:e,consonant:`-`,vowel:`-`,kind:`tie`,portamento:!0};if(e===`っ`)return{kana:e,consonant:`Q`,vowel:``,kind:`stop`};if(e===`_`)return{kana:e,consonant:``,vowel:``,kind:`rest`};let t=e.includes(Ma);t&&(e=e.replace(Ma,``));let n=e[0],r=Da[n],i=r?r[0]:``,a=r?r[1]:qa(n);if(e.length===2){let t=qa(e[1]);t&&(a=t)}return t?{kana:e,consonant:i,vowel:a,nasal:!0}:{kana:e,consonant:i,vowel:a}},Ya=e=>{let t=[],n=``;for(let r of Ua(e)){if(`speak`in r){let e=Wa(r.speak);t.push(e?{kana:e,consonant:``,vowel:``,kind:`speak`,text:e}:{kana:`_`,consonant:``,vowel:``,kind:`rest`}),n=``;continue}for(let e of Ka(Ga(r.sung))){if(e===`、`){let e=t[t.length-1];e&&(e.breathAfter=!0),n=``;continue}if(e===`↓`){let e=t[t.length-1];e&&(e.fadeOut=!0);continue}if(e===`↑`){let e=t[t.length-1];e&&(e.fadeIn=!0);continue}let r=Ja(e);if(r.kind===`tie`){if(!n)continue;t.push({...r,kana:n===`N`?`ん`:Na[n]??r.kana,consonant:``,vowel:n});continue}r.kind===`rest`?n=``:r.vowel&&(n=r.vowel),t.push(r)}}return t},Xa=e=>{let t=e.kind===`tie`?e.portamento?`〜`:`ー`:e.kind===`rest`?`_`:e.kind===`speak`?`「${e.text??e.kana}」`:e.nasal?Aa(e.kana):e.kana,n=e.breathAfter?t+`、`:t;return e.fadeIn&&(n+=`↑`),e.fadeOut&&(n+=`↓`),n},Za=e=>e.map(Xa).join(``),Qa=e=>{let t=[],n=[];for(let r of e){let e=Ya(r);e.length!==0&&(t.length>0&&n.push(t.length),t.push(...e))}return{syllables:t,lineBreaks:n}},$a=/^@@(\d+)\s*(.*)$/,eo=e=>!/^[@#]/.test(e),to=e=>e.split(/[;\n\r]+/).map(e=>e.trim()).filter(e=>e.length>0),no=(e,t,n)=>Math.min(n,Math.max(t,e)),ro=400,io=.08,ao=e=>e<=0?0:e<=100?e/100:10**((e-100)*io/20),oo=e=>{let t=new Map,n=to(e);for(let e=0;e<n.length;e++){let r=n[e].match($a);if(!r)continue;let i=Number.parseInt(r[1],10),a=r[2].trim(),o=200,s=100,c=64,l=0,u=!1,d=0,f=0,p=50,m=50,h=50,g=`none`,_=a.match(/^([a-z_][a-z0-9_]*?)(?=(?:[vqpobrghewt]-?\d)|[^a-z0-9_]|$)(?::(\d+))?/i),v=``,y=[];for(_&&(v=_[1].toLowerCase(),_[2]&&(o=no(Number.parseInt(_[2],10),0,400)),y.push(_[0]),a=a.substring(_[0].length).trim());;){let e=a.match(/^v(\d+)/i);if(e){o=no(Number.parseInt(e[1],10),0,400),y.push(e[0]),a=a.substring(e[0].length).trim();continue}let t=a.match(/^q(\d+)/i);if(t){s=no(Number.parseInt(t[1],10),0,100),y.push(t[0]),a=a.substring(t[0].length).trim();continue}let n=a.match(/^p(\d+)/i);if(n){c=no(Number.parseInt(n[1],10),0,127),y.push(n[0]),a=a.substring(n[0].length).trim();continue}let r=a.match(/^o(-?\d+)/i);if(r){l=no(Number.parseInt(r[1],10),-2,2),y.push(r[0]),a=a.substring(r[0].length).trim();continue}let i=a.match(/^b([01])/i);if(i){u=i[1]===`1`,y.push(i[0]),a=a.substring(i[0].length).trim();continue}let _=a.match(/^r(\d+)/i);if(_){d=no(Number.parseInt(_[1],10),0,100),y.push(_[0]),a=a.substring(_[0].length).trim();continue}let v=a.match(/^g(\d+)/i);if(v){p=no(Number.parseInt(v[1],10),0,100),y.push(v[0]),a=a.substring(v[0].length).trim();continue}let b=a.match(/^h(\d+)/i);if(b){m=no(Number.parseInt(b[1],10),0,100),y.push(b[0]),a=a.substring(b[0].length).trim();continue}let x=a.match(/^t(\d+)/i);if(x){h=no(Number.parseInt(x[1],10),0,100),y.push(x[0]),a=a.substring(x[0].length).trim();continue}let S=a.match(/^e(\d+)/i);if(S){f=no(Number.parseInt(S[1],10),0,100),y.push(S[0]),a=a.substring(S[0].length).trim();continue}let C=a.match(/^w([0-3])/i);if(C){g=[`none`,`down`,`up`,`both`][Number.parseInt(C[1],10)],y.push(C[0]),a=a.substring(C[0].length).trim();continue}break}let b=[a];for(;e+1<n.length&&eo(n[e+1]);)b.push(n[++e]);let{syllables:x,lineBreaks:S}=Qa(b);t.set(i,{trackId:i,model:v,volume:o,gate:s,pan:c,octave:l,vibrato:u,reverb:d,delay:f,gender:p,breathiness:m,tension:h,octaveUnison:g,syllables:x,metaText:y.join(` `),...S.length>0?{lineBreaks:S}:{}})}return t},so=e=>{let t=to(e),n=[];for(let e=0;e<t.length;e++){if($a.test(t[e])){for(;e+1<t.length&&eo(t[e+1]);)e++;continue}n.push(t[e])}return n.join(`
`)},co=/^@@([a-zA-Z_][a-zA-Z0-9_]*)\s+(\S+)\s+(\S+)\s*$/,lo=2048,uo=e=>{if(e.length>lo)return!1;try{let t=new URL(e);return t.protocol===`http:`||t.protocol===`https:`}catch{return!1}},fo=e=>{let t=new Map;for(let n of to(e)){let e=n.match(co);if(!e)continue;let r=e[1].toLowerCase(),i=e[2],a=e[3];if(!uo(a)){console.warn(`[dtm] \u30AB\u30B9\u30BF\u30E0\u30DC\u30FC\u30AB\u30EB "${r}": koe URL \u304C\u4E0D\u6B63\u307E\u305F\u306F\u9577\u3059\u304E\u308B\u305F\u3081\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059`,a.slice(0,80));continue}let o=uo(i)?i:``;t.set(r,{key:r,iconUrl:o,url:a})}return[...t.values()]},po=e=>e.split(/[\n\r]+/).map(e=>e.split(`;`).filter(e=>!co.test(e.trim())).join(`;`)).join(`
`),mo=e=>Math.max(-1,Math.min(1,(e-64)/64)),ho=e=>{let t=new Map;return{consume:n=>{let r=e.get(n);if(!r||r.syllables.length===0)return null;let i=t.get(n)??0,a=r.syllables[i];return a?(t.set(n,i+1),{model:r.model,syllable:a,volume:ao(r.volume??200),gate:(r.gate??100)/100,pan:mo(r.pan??64)}):null},reset:()=>t.clear()}},go=.02,_o=(e,t)=>{let{startAt:n,attackEnd:r,sustainEnd:i,peak:a,fadeIn:o,fadeOut:s,curve:c}=t,l=Math.max(1e-4,a*go);if(e.setValueAtTime(1e-4,n),e.exponentialRampToValueAtTime(o?l:a,r),c?.length&&!(o&&s)){let t=Math.max(0,i-r),n=r,s=o?l:a;for(let o of c){let c=Math.min(1,Math.max(0,o.at)),u=Math.min(i,Math.max(n,r+t*c));s=Math.max(l,a*Math.min(1,Math.max(0,o.level))),e.exponentialRampToValueAtTime(s,u),n=u}n<i&&e.setValueAtTime(s,i)}else if(o&&s){let t=r+(i-r)/2;e.exponentialRampToValueAtTime(a,t),e.exponentialRampToValueAtTime(l,i)}else o?e.exponentialRampToValueAtTime(a,i):s?e.exponentialRampToValueAtTime(l,i):e.setValueAtTime(a,i)},vo={a:[800,1200],i:[300,2300],u:[350,800],e:[500,1900],o:[500,900],N:[250,1e3]},yo=e=>440*2**((e-2139)/372),bo=e=>e/31,xo=(e,t,n,r)=>{let i=new Set,a=(a,o)=>{let s=e.currentTime+o.when,c=Math.max(1e-4,o.volume);if(a.vowel===``||a.consonant===`Q`)return;let[l,u]=vo[a.vowel]??vo.a,d=a.kind===`tie`?.06:.02,f=.06,p=s+Math.max(d+.02,o.duration),m=o.destination??t,h=null,g=m;typeof e.createStereoPanner==`function`&&(h=e.createStereoPanner(),h.pan.value=Math.max(-1,Math.min(1,o.pan??0)),h.connect(m),g=h);let _=null;n&&o.reverbSend&&o.reverbSend>0&&h&&(_=e.createGain(),_.gain.value=Math.max(0,Math.min(1,o.reverbSend)),h.connect(_).connect(n));let v=null;r&&o.delaySend&&o.delaySend>0&&h&&(v=e.createGain(),v.gain.value=Math.max(0,Math.min(1,o.delaySend)),h.connect(v).connect(r));let y=e.createOscillator();y.type=`sawtooth`;let b=yo(o.pitchUnits);y.frequency.setValueAtTime(b,s);let x=o.pitchSegments??[],S=Hi(x,o.duration*1e3);x.forEach((e,t)=>{let n=Math.max(1,yo(e.pitch)),r=S[t]/1e3,i=Math.max(s,s+Math.max(0,e.atSec)-r/2);y.frequency.setValueAtTime(b,i),y.frequency.exponentialRampToValueAtTime(n,i+r),b=n});let C=(t,n,r)=>{let i=e.createBiquadFilter();i.type=`bandpass`,i.frequency.value=t,i.Q.value=n;let a=e.createGain();return a.gain.value=r,y.connect(i).connect(a),a},w=e.createGain();if(_o(w.gain,{startAt:s,attackEnd:s+d,sustainEnd:p,peak:c,fadeIn:a.fadeIn,fadeOut:a.fadeOut,curve:o.fadeCurve}),w.gain.exponentialRampToValueAtTime(1e-4,p+f),C(l,6,4).connect(w),C(u,9,2.8).connect(w),w.connect(g),new Set([`s`,`sh`,`ch`,`ts`,`h`,`f`]).has(a.consonant)){let t=.05,n=Math.max(1,Math.floor(e.sampleRate*t)),r=e.createBuffer(1,n,e.sampleRate),o=r.getChannelData(0);for(let e=0;e<n;e++)o[e]=Math.random()*2-1;let l=e.createBufferSource();l.buffer=r;let u=e.createBiquadFilter();u.type=`highpass`,u.frequency.value=a.consonant===`sh`?3e3:4500;let d=e.createGain();d.gain.setValueAtTime(c*.5,s),d.gain.exponentialRampToValueAtTime(1e-4,s+t),l.connect(u).connect(d).connect(g),l.start(s),l.stop(s+t),i.add(l),l.onended=()=>{i.delete(l),l.disconnect(),u.disconnect(),d.disconnect()}}y.start(s),y.stop(p+f+.02),i.add(y),y.onended=()=>{i.delete(y),y.disconnect(),h?.disconnect(),_?.disconnect(),v?.disconnect()}};return a.stopAll=()=>{for(let e of i){try{e.stop()}catch{}e.disconnect()}i.clear()},a},So=`https://pub-12482a6b5cbc4c9e906b2e1904cabae5.r2.dev`,Co={tsukuyomi:`つくよみちゃん.koe`,rino:`春音リノver0.3.koe`,rino121:`春音リノver.1.1(226).koe`,roze:`束音ロゼver0.５1(多音階).koe`,ruko_male:`欲音ルコ♂連続音Ver.1.03.koe`,ruko_female:`欲音ルコ♀歌連続音普1.00.koe`,teto:`TETO-tandoku-100619.koe`,shiyo:`革命シヨ.koe`,rei:`足立レイver3.5.0.koe`,mgroid:`MGRoid_原音設定済み.koe`,motroid:`MOTRoid完全版V2.koe`,nynroid:`NYNRoidver1.4.koe`,uc:`蓄音キリコ （beta1.1）.koe`,hibika_aru:`響化アル.koe`},wo={tsukuyomi:`つくよみちゃん`,rino:`春音リノ`,rino121:`春音リノ (1.1)`,roze:`束音ロゼ`,ruko_male:`欲音ルコ♂`,ruko_female:`欲音ルコ♀`,teto:`重音テト`,shiyo:`革命シヨ`,rei:`足立レイ`,mgroid:`MGRoid`,motroid:`MOTRoid`,nynroid:`NYNRoid`,uc:`蓄音キリコ`,hibika_aru:`響化アル`},To={tsukuyomi:`つくよみちゃん`,rino:`春音リノ`,rino121:`春音リノv1.2.1`,roze:`束音ロゼ`,ruko_male:`欲音ルコ♂`,ruko_female:`欲音ルコ♀`,teto:`重音テト`,shiyo:`革命シヨ`,rei:`足立レイ`,mgroid:`MGRoid`,motroid:`MOTRoid`,nynroid:`NYNRoid`,uc:`蓄音キリコ`,hibika_aru:`響化アル`},Eo=[{label:`kusaプリセット`,models:[`klatt`,`tsukuyomi`]},{label:`おんJ`,models:[`roze`,`shiyo`,`rino`,`rino121`,`uc`,`hibika_aru`]},{label:`一般`,models:[`teto`,`rei`,`ruko_male`,`ruko_female`]},{label:`クッキー☆`,models:[`mgroid`,`motroid`,`nynroid`]}],Do=e=>{let t=new Set(Object.keys(e)),n=[];for(let r of Eo){let i=r.models.filter(e=>t.delete(e)).map(t=>({value:t,label:e[t]??t}));i.length>0&&n.push({label:r.label,models:i})}return t.size>0&&n.push({label:`その他`,models:[...t].map(t=>({value:t,label:e[t]??t}))}),n},Oo={klatt:`puyuyu`,tsukuyomi:`tsukuyomi`,rino:`rino`,rino121:`rino`,roze:`roze`,ruko_male:`ruko`,ruko_female:`ruko`,teto:`teto`,shiyo:`shiyo`,rei:`rei`,mgroid:`MGRoid`,motroid:`MOTRoid`,nynroid:`NYNRoid`,uc:`uc`,hibika_aru:`hibika_aru`},ko={tsukuyomi:`https://tyc.rei-yumesaki.net/material/utau/terms/`,rino:`https://hatenakun1.github.io/halunelino/`,rino121:`https://harunerino.vercel.app/`,roze:`https://tabaneroze.ninja-web.net/terms-of-use.html`,ruko_male:`https://long-sleeper.net/index.php?id=22`,ruko_female:`https://long-sleeper.net/index.php?id=22`,teto:`https://kasaneteto.jp/guidelines/voice.html`,shiyo:`https://kakumeisiyo.my.canva.site/dagkuyjwycs`,rei:`https://mechanicalgirl.jp/guidelines/`,mgroid:`https://x.com/nisusansu/status/1048825378188353536`,motroid:`https://www.nicovideo.jp/watch/sm40031282`,nynroid:`https://www.bilibili.com/video/BV1V24y1a7qs`,uc:`https://chi9nekiriko.wixsite.com/home/%E5%88%A9%E7%94%A8%E8%A6%8F%E7%B4%84`},Ao=(e,t=So)=>`${t}/${encodeURIComponent(e)}`,jo=`https://onjmin.github.io/koe/demo/world/worldline.js`,Mo=48e3,No=e=>e.includes(` `)?[e,e.replace(/ /g,`　`),e.replace(/ /g,``)]:[e],Po=/_([A-G][#b]?-?\d+)$/,Fo={c:0,d:2,e:4,f:5,g:7,a:9,b:11},Io=e=>{let t=/^([A-Ga-g])([#b]?)(-?\d+)$/.exec(e);if(!t)return null;let n=Fo[t[1].toLowerCase()];return t[2]===`#`?n++:t[2]===`b`&&n--,(Number.parseInt(t[3],10)+1)*12+n},Lo=e=>{let t=new Map;for(let n of e){let e=Po.exec(n);if(!e||t.has(e[1]))continue;let r=Io(e[1]);r!=null&&t.set(e[1],r)}return[...t].map(([e,t])=>({token:e,midi:t}))},Ro=(e,t)=>{let n=null;for(let r of e)(!n||Math.abs(r.midi-t)<Math.abs(n.midi-t))&&(n=r);return n},zo=(e,t)=>{if(!t)return{view:{manifest:{phonemes:e}},toReal:e=>e,referenceHz:ua(e)};let n=`_${t}`,r={},i=new Map;for(let[t,a]of Object.entries(e))if(t.endsWith(n)){let e=t.slice(0,-n.length);r[e]=a,i.set(e,t)}else!Po.test(t)&&!(t in r)&&(r[t]=a);return{view:{manifest:{phonemes:r}},toReal:e=>i.get(e)??e,referenceHz:ua(r)}},Bo=(e,t)=>{let n=e.kana,r=e.consonant===`N`?`n`:e.consonant,i=e.vowel===`N`?``:e.vowel,a=`${r}${i}`||i,o=t||`-`,s=[],c=(...e)=>{for(let t of e)t&&!s.includes(t)&&s.push(t)};if(e.nasal){let e=Aa(n);c(`${o} ${e}`,e)}if(r===`v`){let e=n.slice(1),t=e?[`\u30F4${e}`,Aa(`\u3094${e}`)]:[`ヴ`];for(let e of t)c(`${o} ${e}`,e)}let l=Oa[n];if(e.kind===`tie`?c(`${e.vowel===`N`?`n`:e.vowel} ${n}`,`${o} ${n}`,`* ${n}`,n):(c(`${o} ${n}`),l&&c(`${o} ${l}`),c(`${o} ${a}`),o!==`-`&&c(`* ${n}`),c(n),l&&c(l),c(a)),r===`v`&&i){let e=ka[i];c(`${o} ${e}`,e,`b${i}`)}let u=Na[e.vowel];return u&&c(`${o} ${u}`,u,e.vowel),e.vowel===`N`&&c(`ん`,`n`,`N`,`${o} \u3093`),s},Vo=(e,t,n,r)=>{let i=new Set,a=t=>{for(let n of No(t))if(!i.has(n)&&(i.add(n),e(n)))return n;return null};if(t.length){let e=t.slice().sort((e,t)=>Math.abs(e.midi-r)-Math.abs(t.midi-r));for(let{token:t}of e)for(let e of n){let n=a(`${e}_${t}`);if(n)return n}}for(let e of n){let t=a(e);if(t)return t}return null},Ho=(e,t,n,r,i)=>{let a=Vo(e,t,Bo(n,r),i);if(a)return a;let o=n.consonant===`N`?`n`:n.consonant,s=n.vowel===`N`?``:n.vowel,c=r||`-`;if(o&&s){let t=Vo(e,[],[s,`${c} ${s}`],i),n=t?Vo(e,[],[o],i):null;if(t&&n)return Ta(n,t)}return null},Uo=.005,Wo=(e,t,n)=>{if(e.length===0||t.length===0)return null;let r=Math.min(Math.floor(n*Uo),e.length,t.length),i=new Float64Array(e.length+t.length-r);i.set(e,0);for(let n=0;n<r;n++){let a=(n+1)/(r+1),o=e.length-r+n;i[o]=e[o]*(1-a)+t[n]*a}i.set(t.subarray(r),e.length);let a=(e.length-r/2)/n*1e3;return{pcm:i,preMs:a,consonantMs:a}},Ko=async e=>{let t=await pr.load(e.koe),n=e.lightweight?null:await wr.load({scriptUrl:e.worldlineScriptUrl??jo}).catch(()=>null),r=new Map,i=e=>{let n=r.get(e);return n||(n=t.getPcm(e),r.set(e,n)),n},a=async(e,t,r,a,o,s,c)=>{if(!n)return null;let[l,u]=await Promise.all([i(e),i(t)]);if(!l||!u)return null;let d=Wo(l,u,Mo);if(!d)return null;let f=yo(r),p=n.renderNote({pcm:d.pcm,pitch:Wi(f,c,d.preMs,!!o,a),durationMs:a,preMs:d.preMs,consonantMs:d.consonantMs,gender:s?.gender,breathiness:s?.breathiness,tension:s?.tension});return p?{pcm:p,preSec:d.preMs/1e3,rate:1}:null},o=async(e,r,o,s,c,l)=>{let u=Ea(e);if(u)return a(u[0],u[1],r,o,s,c,l);let d=await i(e);if(!d||d.length===0)return null;let f=t.manifest.phonemes[e],p=br(f),m=yo(r);if(n){let e=n.renderNote({pcm:d,pitch:Wi(m,l,p.preMs,!!s,o),durationMs:o,...p,gender:c?.gender,breathiness:c?.breathiness,tension:c?.tension});if(e)return{pcm:e,preSec:p.preMs/1e3,rate:1}}let h=f.pitch>0?m/f.pitch:1;return{pcm:new Float32Array(d),preSec:f.pre/Mo/h,rate:h}},s=null;return{hasAlias:e=>t.has(e),pitchTokens:Lo(Object.keys(t.manifest.phonemes)),renderAlias:o,phonemes:t.manifest.phonemes,getPcm:e=>i(e).then(e=>e?Float32Array.from(e):null),renderSpeech:async(e,r,a,o,c)=>{if(n){s??=new Oi(n);try{ca(e,i);let n=la(t,i);for await(let t of s.renderChunks(n,e,{...c,signal:o,gender:r?.gender,breathiness:r?.breathiness,tension:r?.tension}))a({pcm:t.pcm,startMs:t.startMs,index:t.index})}catch(e){console.warn(`[dtm] speech synthesis failed`,e)}}},dispose:()=>{}}},qo=async e=>{if(new URL(e,location.href).origin===location.origin)return new Worker(e);let t=await fetch(e).then(e=>e.text());return new Worker(URL.createObjectURL(new Blob([t],{type:`text/javascript`})))},Jo=async(e,t)=>{let n=await qo(e),r=new Set,i={},a=new Map,o=new Map,s=new Map,c=0,l=null,u=null;return n.onmessage=e=>{let t=e.data;if(t.type===`ready`){for(let e of t.aliases)r.add(e);i=t.phonemes??{},l?.()}else if(t.type===`error`)u?.(Error(t.message));else if(t.type===`rendered`){let e=a.get(t.id);e&&(a.delete(t.id),e(t))}else if(t.type===`pcm`){let e=o.get(t.id);e&&(o.delete(t.id),e(t))}else if(t.type===`speech-chunk`)s.get(t.id)?.onChunk({pcm:t.pcm,startMs:t.startMs,index:t.index});else if(t.type===`speech-end`){let e=s.get(t.id);e&&(s.delete(t.id),t.error&&console.warn(`[dtm] speech synthesis failed`,t.error),e.done())}},n.onerror=e=>{let t=e;u?.(Error(t.message||t.error||`Event: ${t.type}`))},await new Promise((e,r)=>{l=e,u=r,n.postMessage({type:`init`,koe:t.koe,worldlineScriptUrl:t.worldlineScriptUrl??jo,lightweight:!!t.lightweight})}),l=null,u=null,{hasAlias:e=>r.has(e),pitchTokens:Lo(r),renderAlias:(e,t,r,i,o,s)=>new Promise(l=>{let u=++c;a.set(u,e=>l(e.pcm?{pcm:e.pcm,preSec:e.preSec??0,rate:e.rate??1}:null)),n.postMessage({type:`render`,id:u,alias:e,pitch:t,durationMs:r,vibrato:i,gender:o?.gender,breathiness:o?.breathiness,tension:o?.tension,pitchSegments:s})}),get phonemes(){return i},getPcm:e=>new Promise(t=>{let r=++c;o.set(r,e=>t(e.pcm)),n.postMessage({type:`pcm`,id:r,alias:e})}),renderSpeech:(e,t,r,i,a)=>new Promise(o=>{let l=++c;s.set(l,{onChunk:r,done:o}),i?.addEventListener(`abort`,()=>{n.postMessage({type:`speak-abort`,id:l})}),n.postMessage({type:`speak`,id:l,plan:e,gender:t?.gender,breathiness:t?.breathiness,tension:t?.tension,energyDbPerSemitone:a?.energyDbPerSemitone})}),dispose:()=>n.terminate()}},Yo=async(e,t,n)=>{let r;if(n.voiceWorkerUrl)try{r=await Jo(n.voiceWorkerUrl,n)}catch(e){console.warn(`[dtm] Failed to spawn voice worker. Falling back to local backend.`,e),r=await Ko(n)}else r=await Ko(n);let i=new Map,a=new Map,o=new Set,s=``,c=(e,t,n,r,i,a)=>`${e}|${t}|${Math.round(n/10)*10}${Ki(a)}${r?`|vib`:``}${i?.gender===void 0?``:`|g${Math.round(i.gender*100)}`}${i?.breathiness===void 0?``:`|h${Math.round(i.breathiness*100)}`}${i?.tension===void 0?``:`|t${Math.round(i.tension*100)}`}`,l=(t,n,o,s,l,u)=>{let d=c(t,n,o,s,l,u),f=i.get(d);if(f!==void 0)return Promise.resolve(f);let p=a.get(d);if(p)return p;let m=(async()=>{let c=await r.renderAlias(t,n,o,s,l,u),f=null;if(c){let t=e.createBuffer(1,c.pcm.length,Mo);t.copyToChannel(c.pcm,0),f={audio:t,preSec:c.preSec,rate:c.rate}}return i.set(d,f),a.delete(d),f})();return a.set(d,m),m},u=.03,d=(r,i,a,s,c=0,l=0,d,f=!1,p=!1,m=!1,h,g)=>{let _=d??t,v=_,y=null;typeof e.createStereoPanner==`function`&&(y=e.createStereoPanner(),y.pan.value=Math.max(-1,Math.min(1,s)),y.connect(_),v=y);let b=null;n.reverbBus&&c>0&&y&&(b=e.createGain(),b.gain.value=Math.max(0,Math.min(1,c)),y.connect(b).connect(n.reverbBus));let x=null;n.delayBus&&l>0&&y&&(x=e.createGain(),x.gain.value=Math.max(0,Math.min(1,l)),y.connect(x).connect(n.delayBus));let S=e.createBufferSource();S.buffer=r.audio,S.playbackRate.value=r.rate;let C=f?u:Math.min(r.preSec,.09),w=f?r.preSec:r.preSec-C,T=Math.max(e.currentTime+.001,i-C),E=Math.max(.01,r.audio.duration/r.rate-w),D=g===void 0?T+E:Math.min(T+E,i+Math.max(.02,g)),O=f?u:.01,k=Math.min(.04,Math.max(.005,(D-i)/2)),A=e.createGain(),j=Math.max(T+O,D-k);_o(A.gain,{startAt:T,attackEnd:T+O,sustainEnd:j,peak:a,fadeIn:m,fadeOut:p,curve:h}),A.gain.exponentialRampToValueAtTime(1e-4,D),S.connect(A).connect(v),S.start(T,w),S.stop(D+.02),o.add(S),S.onended=()=>{o.delete(S),S.disconnect(),A.disconnect(),y?.disconnect(),b?.disconnect(),x?.disconnect()}},f=(t,n)=>{if(t.consonant===`Q`||t.vowel===``)return;let i=Ho(r.hasAlias,r.pitchTokens,t,s,bo(n.pitchUnits));if(t.vowel&&t.vowel!==`N`&&(s=t.vowel),!i)return;let a=e.currentTime+n.when,o=Math.max(1e-4,n.volume),c=n.pan??0,u=Math.max(60,n.duration*1e3);l(i,n.pitchUnits,u,void 0,void 0,n.pitchSegments).then(e=>{e&&d(e,a,o,c,n.reverbSend,n.delaySend,n.destination,t.kind===`tie`,!1,!1,void 0,n.duration)})};f.renderToCache=async(e,t,n,i,a,o,s)=>{if(e.consonant===`Q`||e.vowel===``)return null;let u=Ho(r.hasAlias,r.pitchTokens,e,t,bo(n));if(!u)return null;let d=Math.max(60,i),f=!!a&&d/1e3>=.35;return await l(u,n,d,f,o,s)?c(u,n,d,f,o,s):null},f.scheduleCached=(e,t,n,r,a,o,s,c,l,u,f,p)=>{let m=i.get(e);m&&d(m,t,n,r,a,o,s,c,l,u,f,p)};let p=ra({baseUrl:n.ttsBaseUrl}),m=new Map,h=e=>{let t=e??``,n=m.get(t);return n||(n=zo(r.phonemes,e),m.set(t,n)),n},g=e=>Ro(r.pitchTokens,bo(e))?.token??null,_=new Map,v=(e,t,n,r)=>{let i=`${t??``}|${b(n)}|${r??``}|${e}`,a=_.get(i);return a||(a=(async()=>{try{return await p.ready(),r&&r!==`neutral`&&await p.prepareEmotion(r),p.plan(h(t).view,e,{tone:t??`C4`,style:n,emotion:r})}catch(t){return console.warn(`[dtm] speech plan failed for "${e}"`,t),null}})(),_.set(i,a)),a},y=new Map,b=e=>e===void 0?``:typeof e==`string`?e:JSON.stringify(e),x=(e,t,n,r,i)=>`speak|${e}|${Math.round(t)}${n?.gender===void 0?``:`|g${Math.round(n.gender*100)}`}${n?.breathiness===void 0?``:`|h${Math.round(n.breathiness*100)}`}${n?.tension===void 0?``:`|t${Math.round(n.tension*100)}`}${r===void 0?``:`|s${b(r)}`}${i?`|e${i}`:``}`,S=(t,n,i,a,o)=>{let s=x(t,n,i,a,o),c=y.get(s);if(c)return c;let l=new AbortController,u,d=new Promise(e=>{u=e}),f,p=new Promise(e=>{f=e}),m={planned:d,rendered:Promise.resolve(),firstChunk:p,durationSec:0,morae:[],chunks:[],done:!1,listeners:new Set,abort:l};return m.rendered=(async()=>{let s=g(n),c=await v(t,s,a,o);if(!c){m.done=!0,u(null),f();return}let d=h(s),p=c.timeline.reference_hz||d.referenceHz||0,_=aa(c,p>0?Math.min(4,Math.max(1/4,yo(n)/p)):1,d.toReal);m.durationSec=sa(_),m.morae=Xi(_);let y=oa(_);u(m.durationSec),await r.renderSpeech(_,i,t=>{let n=e.createBuffer(1,t.pcm.length,Mo);n.copyToChannel(t.pcm,0);let r={audio:n,startSec:t.startMs/1e3-y};m.chunks.push(r),f();for(let e of m.listeners)e(r)},l.signal,Zi(a)),m.done=!0,m.listeners.clear(),f()})(),c=m,y.set(s,c),c},C=(r,i,a,s,c=0,l=0,u,d)=>{let f=u??t,p=i+r.startSec,m=0,h=e.currentTime+.01;if(p<h&&(m=h-p,p=h),m>=r.audio.duration-.005)return;let g=f,_=null;typeof e.createStereoPanner==`function`&&(_=e.createStereoPanner(),_.pan.value=Math.max(-1,Math.min(1,s)),_.connect(f),g=_);let v=null;n.reverbBus&&c>0&&_&&(v=e.createGain(),v.gain.value=Math.max(0,Math.min(1,c)),_.connect(v).connect(n.reverbBus));let y=null;n.delayBus&&l>0&&_&&(y=e.createGain(),y.gain.value=Math.max(0,Math.min(1,l)),_.connect(y).connect(n.delayBus));let b=e.createGain();m>0?(b.gain.setValueAtTime(1e-4,p),b.gain.exponentialRampToValueAtTime(a,p+.005)):b.gain.setValueAtTime(a,p);let x=e.createBufferSource();x.buffer=r.audio,x.connect(b).connect(g),x.start(p,m),o.add(x),d?.add(x),x.onended=()=>{o.delete(x),d?.delete(x),x.disconnect(),b.disconnect(),_?.disconnect(),v?.disconnect(),y?.disconnect()}},w=new Set;f.speakToCache=async(e,t,n,r)=>{let i=S(e,t,n);return await i.planned===null?null:(r===`first-chunk`?await i.firstChunk:r&&await i.rendered,x(e,t,n))},f.scheduleSpeech=(e,t,n,r,i,a,o)=>{let s=y.get(e);if(!s)return;let c=e=>C(e,t,n,r,i,a,o);for(let e of s.chunks)c(e);if(!s.done){s.listeners.add(c);let e={entry:s,listener:c};w.add(e),s.rendered.then(()=>w.delete(e))}},f.speechDurationSec=e=>{let t=y.get(e);return t&&t.durationSec>0?t.durationSec:void 0},f.speak=async(t,n,r={})=>{let i=S(t,n,r.expr,r.style,r.emotion),a=await i.planned;if(a===null||r.signal?.aborted||(r.awaitRender&&await i.rendered,r.signal?.aborted))return null;let s=Math.max(e.currentTime+.05,r.at??0),c=new Set,l=e=>C(e,s,Math.max(0,r.volume??1),r.pan??0,0,0,r.destination,c);for(let e of i.chunks)l(e);let u={entry:i,listener:l};i.done||(i.listeners.add(l),w.add(u),i.rendered.then(()=>w.delete(u)));let d=!1,f,p=new Promise(e=>{f=e}),m=()=>{if(!d){d=!0,clearTimeout(h),r.signal?.removeEventListener(`abort`,m),i.listeners.delete(l),w.delete(u);for(let e of c){try{e.stop()}catch{}e.disconnect(),o.delete(e)}c.clear(),f()}},h=setTimeout(m,Math.max(0,s+a-e.currentTime)*1e3+150);return r.signal?.addEventListener(`abort`,m,{once:!0}),{durationSec:a,startTime:s,morae:i.morae,stop:m,ended:p}};let T=new Map,E=new Map;f.planSpeechDetail=async(e,t={})=>{let n=`${b(t.style)}|${t.emotion??``}|${e}`,i=E.get(n);if(i)return i;let a=r.pitchTokens.length>0?Ro(r.pitchTokens,bo(f.speechReferenceUnits?.()??0))?.token??null:null,o=await v(e,a,t.style,t.emotion);if(!o)return null;let s={durationSec:sa(o),morae:Xi(o)};return E.set(n,s),!t.style&&!t.emotion&&T.set(e,s.durationSec),s},f.planSpeech=async(e,t)=>{if(!t?.style&&!t?.emotion){let t=T.get(e);if(t!==void 0)return t}let n=await f.planSpeechDetail?.(e,t);return n?n.durationSec:null},f.peekSpeechDurationSec=e=>T.get(e),f.speechReferenceUnits=()=>{let e=r.pitchTokens,t;if(e.length>0){let n=e.slice().sort((e,t)=>e.midi-t.midi);t=h(n[n.length>>1].token).referenceHz}else t=h(null).referenceHz;if(!(!t||t<=0))return Math.round(2139+372*Math.log2(t/440))},f.stopAll=()=>{for(let e of o){try{e.stop()}catch{}e.disconnect()}o.clear();for(let{entry:e,listener:t}of w)e.listeners.delete(t);w.clear()},f.reset=()=>{s=``},f.renderEndingToCache=async(e,t,n)=>{if(!e)return null;let i=e===`N`?[`n R`,`N R`]:[`${e} R`],a=Vo(r.hasAlias,r.pitchTokens,i,bo(t));if(!a)return null;let o=r.phonemes[a],s=o?Math.max(0,(o.consonant-o.pre)/Mo*1e3):0,u=Math.min(xs,Math.max(bs,s+Ss));return await l(a,t,u,!1,n)?c(a,t,u,!1,n):null};let D=null,O=()=>(D??=(async()=>{let t=new Set,n=[];for(let[e,i]of Object.entries(r.phonemes)){if(!Xo(e))continue;let r=`${i.length}:${i.pre}:${i.consonant}:${i.pitch}`;if(!t.has(r)&&(t.add(r),n.push(e),n.length>=ts))break}let i=[];return await Promise.all(n.map(async t=>{let n=await r.getPcm(t).catch(()=>null);if(!n||n.length===0)return;let a=0;for(let e=0;e<n.length;e++){let t=Math.abs(n[e]);t>a&&(a=t)}if(a<=0)return;let o=e.createBuffer(1,n.length,Mo),s=o.getChannelData(0),c=1/a;for(let e=0;e<n.length;e++)s[e]=n[e]*c;i.push({alias:t,buffer:o,sec:n.length/Mo,peakAt:$o(n,Mo)})})),i})(),D);return f.breathSample=async e=>ns(await O(),e)?.buffer??null,f},Xo=e=>{let t=e.trim();return/吐/.test(t)?!1:/^_?息/.test(t)?!0:/^_?(br|breath)\d*$/i.test(t)||/^b\d$/i.test(t)},Zo=(e,t)=>Qo(Object.entries(e).filter(([e])=>Xo(e)).map(([e,t])=>({alias:e,sec:t.length/Mo})),t)?.alias??null,Qo=(e,t)=>{let n=Math.max(.05,t),r=null,i=null,a=null;for(let t of e)t.sec>=n&&t.sec<=gs&&(!r||t.sec<r.sec)&&(r=t),t.sec>=n&&(!i||t.sec<i.sec)&&(i=t),(!a||t.sec>a.sec)&&(a=t);return r??i??a},$o=(e,t)=>{let n=Math.max(1,Math.floor(t*.01)),r=[];for(let t=0;t+n<=e.length;t+=n){let i=0;for(let r=t;r<t+n;r++)i+=e[r]*e[r];r.push(Math.sqrt(i/n))}if(r.length<2)return .5;let i=0,a=0;for(let e=0;e<r.length;e++)r[e]>i&&(i=r[e],a=e);if(i<=0)return .5;let o=i*10**(-30/20),s=0;for(;s<r.length&&r[s]<o;)s++;let c=r.length-1;for(;c>s&&r[c]<o;)c--;return c>s?(a-s)/(c-s):.5},es=.35,ts=6,ns=(e,t)=>{let n=e.filter(e=>e.peakAt>=es);return Qo(n.length?n:e,t)},rs=4,is=.24,as=.05,os=.14,ss=.18,cs=[-13,-13,-24.6,-24.6,-24.6,-16.3,-16.3,-16.3,-9,-9,-5,-3,-3,-4.6,-10.8,-11.6,-12,-11.2,-7,-6.1,-6.5,-13.9,-14.8,-8.8,-15.6,-12.4,-2.9,0,-5.1,-10.5,-9.5,-4.2,-10.2,-13,-12.6,-4,-4.9,-8.6,-15,-15.4,-19.8,-24.5,-27.3,-34.2,-33,-35.3,-38.5,-44.2],ls=100,us=12e3,ds=256,fs=1024,ps=[.19,.26,.32,.35,.52,.58,.79,.94,.87,.82,.9,.86,1,1,.87,.71,.47,.43,.63,.66,.65,.53,.35,.18],ms=e=>{let t=fs,n=ds,r=cs.length,i=new Float64Array(t/2+1);for(let n=0;n<=t/2;n++){let a=n*e/t,o;if(a<=ls)o=cs[0]-(ls-a)/ls*24;else if(a>=us)o=cs[r-1]-(a-us)/us*24;else{let e=Math.log(a/ls)/Math.log(us/ls)*(r-1),t=Math.min(r-2,Math.floor(e));o=cs[t]+(cs[t+1]-cs[t])*(e-t)}i[n]=10**(o/20)}let a=new Float32Array(2*n+1),o=0;for(let e=-n;e<=n;e++){let r=i[0];for(let n=1;n<t/2;n++)r+=2*i[n]*Math.cos(2*Math.PI*n*e/t);r+=i[t/2]*Math.cos(Math.PI*e);let s=.5+.5*Math.cos(Math.PI*e/(n+1));a[e+n]=r/t*s,o+=a[e+n]*a[e+n]}let s=.3/Math.sqrt(o);for(let e=0;e<a.length;e++)a[e]*=s;return a},hs=.3,gs=.9,_s=.06,vs=.4,ys=.15,bs=150,xs=500,Ss=80,Cs=(e,t,n,r)=>{let i=e.length,a=0;return e.map((e,o)=>{let s=o+1,c=t[e+1]??n,l=s===i||n<=0?1:Math.min(1,Math.max(a,c/n));return a=l,{at:l,level:r?s/i:(i-s)/i}})},ws=(e,t,n)=>{let{fromStep:r,secondsPerStep:i,gate:a,octaveShiftUnits:o}=n,s=Math.min(t.length,e.length),c=[],l=e=>e.durationSteps*i*a,u=e=>(e.startStep-r)*i,d=e=>$t(e.pitchUnits+o),f=(e,t)=>(t.startStep-(e.startStep+e.durationSteps))*i,p=0;for(;p<s;){let n=p,a=t[p],o=e[p];if(p++,a.startStep<r)continue;let m=n>0&&f(t[n-1],a)>=.15,h=o.kind===`tie`,g=o.kind!==`stop`&&o.kind!==`rest`,_=[],v=a,y=!!o.breathAfter,b=[0],x=o.fadeOut?[0]:[],S=o.fadeIn?[0]:[];for(;g&&p<s&&e[p].kind===`tie`&&!y&&t[p].startStep<=v.startStep+v.durationSteps&&(t[p].startStep+t[p].durationSteps-a.startStep)*i<=4;){let n=t[p],r=(n.startStep-a.startStep)*i;_.push({pitch:d(n),atSec:r,portamento:!!e[p].portamento}),b.push(r),e[p].fadeOut&&x.push(b.length-1),e[p].fadeIn&&S.push(b.length-1),v=n,y=!!e[p].breathAfter,p++}let C=x.length>0,w=S.length>0,T=p<s?e[p]:null,E=g&&o.vowel!==``&&!C&&(y||T===null||T.kind===`rest`||T.kind===`speak`||T.kind!==`stop`&&f(v,t[p])>=.15),D=(v.startStep-a.startStep)*i+l(v),O=0;if(y){let e=Math.max(D*(1-vs),D-is);O=D-e,D=e}let k=C&&w?void 0:x.length>1?Cs(x,b,D,!1):S.length>1?Cs(S,b,D,!0):void 0;c.push({syllable:o,pitch:d(a),startSec:u(a),durationSec:D,..._.length?{pitchSegments:_}:{},...h?{continuation:!0}:{},...y?{breath:!0,breathGapSec:O}:{},...m?{phraseStart:!0}:{},...E?{phraseEnd:!0}:{},...C?{fadeOut:!0}:{},...w?{fadeIn:!0}:{},...k?{fadeCurve:k}:{}})}return c},Ts=3,Es=1.5,Ds=100,Os=.6,ks=e=>{switch(e){case`down`:return[-372];case`up`:return[372];case`both`:return[-372,372];default:return[]}},As=`klatt`,js=(e,t,n={})=>{let r={};for(let[e,t]of Object.entries(Co))r[e]=Ao(t);for(let[e,t]of Object.entries(n.voicebanks??{}))r[e.toLowerCase()]=t;let i=0,a=e.createGain();a.connect(t);let o=1,s=new Set,c=(t,n,r,i,o,c)=>{let l=n+Math.max(os,r)+as,u=l-n,d=t.duration,f=Math.max(0,d-u),p=l-(d-f),m=e.currentTime+.001;if(p<m&&(f+=m-p,p=m),l-p<.03)return;let h=Math.max(1e-4,i*hs),g=Math.min(_s,(l-p)/2),_=Math.min(as,(l-p)/2),v=e.createBufferSource();v.buffer=t;let y=e.createGain();y.gain.setValueAtTime(1e-4,p),y.gain.exponentialRampToValueAtTime(h,p+g),y.gain.setValueAtTime(h,l-_),y.gain.exponentialRampToValueAtTime(1e-4,l);let b=c??a,x=null;typeof e.createStereoPanner==`function`&&(x=e.createStereoPanner(),x.pan.value=Math.max(-1,Math.min(1,o)),x.connect(b),b=x),v.connect(y).connect(b),v.start(p,f),v.stop(l+.02),s.add(v),v.onended=()=>{s.delete(v),v.disconnect(),y.disconnect(),x?.disconnect()}},l=null,u=(t,n,r,i,o)=>{let c=Math.max(os,n)+as,u=Math.max(e.currentTime+.001,t),d=Math.max(1,Math.floor(e.sampleRate*c)),f=e.createBuffer(1,d,e.sampleRate),p=f.getChannelData(0),m=1,h=0;for(let t=0;t<d;t++)t>=h&&(m=.7+Math.random()*.6,h=t+Math.floor(e.sampleRate/(20+Math.random()*25))),p[t]=(Math.random()*2-1)*m;if(!l){let t=ms(e.sampleRate);l=e.createBuffer(1,t.length,e.sampleRate),l.copyToChannel(t,0)}let g=e.createBufferSource();g.buffer=f;let _=e.createConvolver();_.normalize=!1,_.buffer=l;let v=e.createGain(),y=new Float32Array(96),b=Math.max(1e-4,r*ss),x=ps.length-1;for(let e=0;e<96;e++){let t=e/95,n=t*x,r=Math.min(x-1,Math.floor(n)),i=ps[r]+(ps[r+1]-ps[r])*(n-r);y[e]=b*i*Math.min(1,t/.06,(1-t)/.08)}v.gain.setValueAtTime(0,u),v.gain.setValueCurveAtTime(y,u,c);let S=o??a,C=null;typeof e.createStereoPanner==`function`&&(C=e.createStereoPanner(),C.pan.value=Math.max(-1,Math.min(1,i)),C.connect(S),S=C),g.connect(_).connect(v).connect(S),g.start(u),g.stop(u+c+.02),s.add(g),g.onended=()=>{s.delete(g),g.disconnect(),_.disconnect(),v.disconnect(),C?.disconnect()}},d=new Map([[As,xo(e,a,n.reverbBus,n.delayBus)]]),f=new Map,p=t=>{let i=t.toLowerCase(),o=d.get(i);if(o)return Promise.resolve(o);let s=f.get(i);if(s)return s;let c=r[i];if(!c)return Promise.resolve(null);let l=(async()=>Yo(e,a,{koe:c,worldlineScriptUrl:n.worldlineScriptUrl,lightweight:n.lightweight,voiceWorkerUrl:n.voiceWorkerUrl,reverbBus:n.reverbBus,delayBus:n.delayBus,ttsBaseUrl:n.ttsBaseUrl}))().then(e=>(d.set(i,e),e)).catch(e=>(console.warn(`[dtm] koe\u97F3\u6E90 "${i}" \u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F`,e),null));return f.set(i,l),l},m=async e=>{let t=new Set;for(let n of e)n&&t.add(n.toLowerCase());await Promise.all([...t].map(e=>p(e)))},h=e=>{for(let[t,n]of Object.entries(e)){let e=t.toLowerCase();e!==As&&r[e]!==n&&(r[e]=n,d.delete(e),f.delete(e))}},g=(e,t)=>{let n=``;for(let r of e.notes){let e=r.syllable;if(r.phraseStart&&(n=``),e.kind===`rest`){n=``;continue}if(e.kind===`speak`){t(r,``),n=``;continue}e.consonant!==`Q`&&e.vowel!==``&&(t(r,n),e.vowel&&e.vowel!==`N`&&(n=e.vowel),r.breath&&(n=``))}},_=async(e,t=3,n)=>{let r=[];for(let n of e){let e=d.get(n.model.toLowerCase());if(!e?.renderToCache)continue;e.breathSample&&n.notes.some(e=>e.breath)&&e.breathSample(is).catch(()=>null);let i=0,a={gender:n.gender,breathiness:n.breathiness,tension:n.tension};g(n,(o,s)=>{if(!(i>=t&&o.startSec>=Es)){if(i++,o.syllable.kind===`speak`){r.push({model:e,note:o,prevVowel:``,pitch:o.pitch,expr:a,speak:o.syllable.text??``});return}r.push({model:e,note:o,prevVowel:s,pitch:o.pitch,vibrato:n.vibrato,expr:a,pitchSegments:o.pitchSegments});for(let t of ks(n.octaveUnison))r.push({model:e,note:o,prevVowel:s,pitch:o.pitch+t,vibrato:n.vibrato,expr:a,pitchSegments:Gi(o.pitchSegments,t)})}})}let i=r.length;if(i===0){n?.(0,0);return}let a=0;n?.(a,i);let o=r.map(async e=>{e.speak===void 0?await(e.model.renderToCache?.(e.note.syllable,e.prevVowel,e.pitch,e.note.durationSec*1e3,e.vibrato,e.expr,e.pitchSegments)??Promise.resolve(null)):await(e.model.speakToCache?.(e.speak,e.pitch,e.expr,`first-chunk`)??Promise.resolve(null)),a++,n?.(a,i)});await Promise.all(o)},v=(t,r,a)=>{let s=++i,l=async t=>{let l=d.get(t.model.toLowerCase());if(!l)return;let f=[];if(g(t,(e,t)=>{f.push({note:e,prevVowel:t})}),f.length===0)return;let p=Math.max(1e-4,t.volume),m=a?.loopStartSec??0,h=0,_=0;do{for(let{note:d,prevVowel:g}of f){if(s!==i)return;if(_>0&&d.startSec<m-1e-4||a?.loopLengthSec&&a.loopLengthSec>0&&d.startSec>=m+a.loopLengthSec-1e-4)continue;let f=d.startSec+h,v=Es+Math.min(4,d.durationSec)*.4;for(;f-(e.currentTime-r)>v;)if(await new Promise(e=>setTimeout(e,Ds)),s!==i)return;if(a?.isAudible&&!a.isAudible(t))continue;let y=r+f;if(d.syllable.kind===`speak`){let r=d.syllable.text??``;if(r&&l.speakToCache&&l.scheduleSpeech){let c=l.speakToCache,u=l.scheduleSpeech,m=n.getTrackDestination?.(t.id??``),h=m?p*o:p;(async()=>{let n=await c(r,d.pitch,{gender:t.gender,breathiness:t.breathiness,tension:t.tension});if(s!==i||!n)return;let o=e.currentTime-y;o<1?(u(n,y,h,t.pan,t.reverbSend,t.delaySend,m),a?.onScheduled?.(t,{...d,durationSec:l.speechDurationSec?.(n)??d.durationSec},y)):(console.warn(`[dtm] Speech late skip: \u300C${r}\u300D at ${f}s (delayed by ${o.toFixed(3)}s)`),a?.onLateSkip?.(d,o))})()}continue}let b=(r,c)=>{let u=$t(d.pitch+r),m=Gi(d.pitchSegments,r);if(l.renderToCache&&l.scheduleCached){let r=l.renderToCache,h=l.scheduleCached;(async()=>{let l=await r(d.syllable,g,u,d.durationSec*1e3,t.vibrato,{gender:t.gender,breathiness:t.breathiness,tension:t.tension},m);if(s===i&&l){let r=e.currentTime-y;if(r<.05){let e=n.getTrackDestination?.(t.id??``),r=(e?p*o:p)*c;h(l,y,r,t.pan,t.reverbSend,t.delaySend,e,d.continuation,d.fadeOut,d.fadeIn,d.fadeCurve,d.durationSec),a?.onScheduled?.(t,d,y)}else console.warn(`[dtm] Synthesizer late skip: ${d.syllable.kana} at ${f}s (delayed by ${r.toFixed(3)}s)`),a?.onLateSkip?.(d,r)}})()}else{let r=y-e.currentTime,i=n.getTrackDestination?.(t.id??``),s=(i?p*o:p)*c,f=d.fadeOut||d.fadeIn?{...d.syllable,...d.fadeOut?{fadeOut:!0}:{},...d.fadeIn?{fadeIn:!0}:{}}:d.syllable;l(f,{trackId:t.id??``,pitchUnits:u,velocity:100,volume:s,when:r,duration:d.durationSec,pan:t.pan,reverbSend:t.reverbSend,delaySend:t.delaySend,destination:i,pitchSegments:m,fadeCurve:d.fadeCurve}),a?.onScheduled?.(t,d,y)}};b(0,1);for(let e of ks(t.octaveUnison))b(e,Os);if(d.phraseEnd&&l.renderEndingToCache&&l.scheduleCached){let r=l.renderEndingToCache,a=l.scheduleCached,c=d.pitchSegments?.length?$t(d.pitchSegments[d.pitchSegments.length-1].pitch):d.pitch,u=y+d.durationSec;(async()=>{let l=await r(d.syllable.vowel,c,{gender:t.gender,breathiness:t.breathiness,tension:t.tension});if(s!==i||!l||e.currentTime>u-.05)return;let f=n.getTrackDestination?.(t.id??``);a(l,u,f?p*o:p,t.pan,t.reverbSend,t.delaySend,f)})()}if(d.breath){let r=n.getTrackDestination?.(t.id??``),a=y+d.durationSec,f=d.breathGapSec??is,m=r?p*o:p,h=()=>u(a,f,m,t.pan,r),g=l.breathSample?.(f);g?g.then(n=>{s===i&&(n&&e.currentTime<a-.01?c(n,a,f,m,t.pan,r):h())}).catch(h):h()}l.renderToCache&&l.scheduleCached||await new Promise(e=>setTimeout(e,0))}if(a?.loopLengthSec&&a.loopLengthSec>0)h+=a.loopLengthSec,_++;else break}while(s===i)};for(let e of t)l(e)},y=()=>{i++;for(let e of d.values())e.stopAll?.();for(let e of s){try{e.stop()}catch{}e.disconnect()}s.clear()};return{loadModels:m,registerVoicebanks:h,warm:_,startStream:v,stopStream:y,reset:()=>{y();for(let e of d.values())e.reset?.()},setVolume:e=>{let t=Math.max(0,e);a.gain.value=t,o=t},planSpeech:async(e,t,n)=>{let r=await p(e);return r?.planSpeech?r.planSpeech(t,n):null},planSpeechDetail:async(e,t,n)=>{let r=await p(e);return r?.planSpeechDetail?r.planSpeechDetail(t,n):null},peekSpeechDurationSec:(e,t)=>d.get(e.toLowerCase())?.peekSpeechDurationSec?.(t),getSpeechReferenceUnits:e=>d.get(e.toLowerCase())?.speechReferenceUnits?.(),prepareSpeech:async(e,t={})=>{let r=ra({baseUrl:n.ttsBaseUrl,onProgress:t.onProgress}),i=new Set(t.emotions??[]);i.delete(`neutral`),await Promise.all([r.ready(),m(e),...[...i].map(e=>r.prepareEmotion(e))])},speak:async(e,t,n={})=>{let r=await p(e);if(!r?.speak||n.signal?.aborted)return null;let i=r.speechReferenceUnits?.()??1767,a=Math.max(-24,Math.min(24,n.pitchOffset??0)),{pitchOffset:o,...s}=n;return r.speak(t,i+a*31,s)}}},Ms=(e={},t=`klatt`)=>({sing:(n,r,i)=>{(e[n]??e[t])?.(r,i)},register:(t,n)=>{e[t.toLowerCase()]=n}}),Ns={12:{c:0,d:2,e:4,f:5,g:7,a:9,b:11},31:{c:0,d:5,e:10,f:13,g:18,a:23,b:28}},Ps=e=>Object.hasOwn(Ns[12],e),Fs=(e,t,n)=>Math.min(n,Math.max(t,e)),Is=/#(ver|seed|compose|inst|drum|drumfont|volume|drumvolume|reverb|reverbdecay|reverbpredelay|delay|delaydiv|mastercomp|fadein|fadeout|mode|edo|loop)=([\w:.-]+)/gi,Ls=/#audio=([^\s#;\r\n]+)/gi,Rs=/#audio(start|end|offset|at|vol)=(-?\d+(?:\.\d+)?)/gi,zs=/#t(\d+)inst=([^#;\r\n]+)/gi,Bs=/#t(\d+)comp=(\d+)/gi,Vs=/#t(\d+)width=(\d+)/gi,Hs=/#t(\d+)rev=(\d+)/gi,Us=/#t(\d+)eqlo=(-?\d+)/gi,Ws=/#t(\d+)eqmid=(-?\d+)/gi,Gs=/#t(\d+)eqhi=(-?\d+)/gi,Ks=/#t(\d+)pan=(\d+)/gi,qs=/#t(\d+)dly=(\d+)/gi,Js=e=>{let t={};for(let n of e.matchAll(Is)){let e=n[1].toLowerCase();if(e===`ver`)t.version=n[2];else if(e===`seed`){let e=Number.parseInt(n[2],10);Number.isFinite(e)&&e>=0&&(t.seed=e)}else if(e===`compose`)t.compose=n[2];else if(e===`inst`)t.instrument=n[2];else if(e===`drum`)t.drum=n[2];else if(e===`drumfont`)t.drumFont=n[2];else if(e===`volume`){let e=Number.parseInt(n[2],10);Number.isNaN(e)||(t.volume=e)}else if(e===`drumvolume`){let e=Number.parseInt(n[2],10);Number.isNaN(e)||(t.drumVolume=e)}else if(e===`reverb`){let e=Number.parseInt(n[2],10);Number.isNaN(e)||(t.reverb=Fs(e,0,100))}else if(e===`reverbdecay`){let e=Number.parseInt(n[2],10);Number.isNaN(e)||(t.reverbDecay=Fs(e,3,40))}else if(e===`reverbpredelay`){let e=Number.parseInt(n[2],10);Number.isNaN(e)||(t.reverbPreDelay=Fs(e,0,150))}else if(e===`delay`){let e=Number.parseInt(n[2],10);Number.isNaN(e)||(t.delay=Fs(e,0,100))}else if(e===`delaydiv`)[`4`,`8`,`8d`,`16`].includes(n[2])&&(t.delayDivision=n[2]);else if(e===`mastercomp`){let e=Number.parseInt(n[2],10);Number.isNaN(e)||(t.masterCompression=Fs(e,0,100))}else if(e===`fadein`){let e=Number.parseInt(n[2],10);Number.isNaN(e)||(t.fadeIn=Fs(e,0,100))}else if(e===`fadeout`){let e=Number.parseInt(n[2],10);Number.isNaN(e)||(t.fadeOut=Fs(e,0,100))}else if(e===`mode`)(n[2]===`simple`||n[2]===`advanced`)&&(t.mode=n[2]);else if(e===`edo`){let e=Number.parseInt(n[2],10);(e===12||e===31)&&(t.edo=e)}else if(e===`loop`){let e=n[2].toLowerCase();t.loop=e===`on`||e===`1`||e===`true`}}for(let n of e.matchAll(Ls)){let e=n[1];if(!(e.length>2048))try{let n=new URL(e);(n.protocol===`http:`||n.protocol===`https:`)&&(t.audio=e)}catch{}}for(let n of e.matchAll(Rs)){let e=Number.parseFloat(n[2]);if(!Number.isFinite(e))continue;let r=n[1].toLowerCase();r===`start`?t.audioStart=Math.max(0,e):r===`end`?t.audioEnd=Math.max(0,e):r===`offset`?t.audioOffset=e:r===`at`?t.audioAt=Math.max(0,Math.round(e)):r===`vol`&&(t.audioVolume=Fs(Math.round(e),0,100))}for(let n of e.matchAll(zs)){let e=Number.parseInt(n[1],10),r=n[2].trim();!Number.isNaN(e)&&r&&(t.trackInstruments??={},t.trackInstruments[e]=r)}for(let n of e.matchAll(Bs)){let e=Number.parseInt(n[1],10),r=Fs(Number.parseInt(n[2],10),0,100);!Number.isNaN(e)&&!Number.isNaN(r)&&(t.trackCompression??={},t.trackCompression[e]=r)}for(let n of e.matchAll(Vs)){let e=Number.parseInt(n[1],10),r=Fs(Number.parseInt(n[2],10),0,200);!Number.isNaN(e)&&!Number.isNaN(r)&&(t.trackWidth??={},t.trackWidth[e]=r)}for(let n of e.matchAll(Hs)){let e=Number.parseInt(n[1],10),r=Fs(Number.parseInt(n[2],10),0,100);!Number.isNaN(e)&&!Number.isNaN(r)&&(t.trackReverbSend??={},t.trackReverbSend[e]=r)}for(let n of e.matchAll(Us)){let e=Number.parseInt(n[1],10),r=Fs(Number.parseInt(n[2],10),-12,12);!Number.isNaN(e)&&!Number.isNaN(r)&&(t.trackEqLow??={},t.trackEqLow[e]=r)}for(let n of e.matchAll(Ws)){let e=Number.parseInt(n[1],10),r=Fs(Number.parseInt(n[2],10),-12,12);!Number.isNaN(e)&&!Number.isNaN(r)&&(t.trackEqMid??={},t.trackEqMid[e]=r)}for(let n of e.matchAll(Gs)){let e=Number.parseInt(n[1],10),r=Fs(Number.parseInt(n[2],10),-12,12);!Number.isNaN(e)&&!Number.isNaN(r)&&(t.trackEqHigh??={},t.trackEqHigh[e]=r)}for(let n of e.matchAll(Ks)){let e=Number.parseInt(n[1],10),r=Fs(Number.parseInt(n[2],10),0,127);!Number.isNaN(e)&&!Number.isNaN(r)&&(t.trackPan??={},t.trackPan[e]=r)}for(let n of e.matchAll(qs)){let e=Number.parseInt(n[1],10),r=Fs(Number.parseInt(n[2],10),0,100);!Number.isNaN(e)&&!Number.isNaN(r)&&(t.trackDelaySend??={},t.trackDelaySend[e]=r)}return t},Ys=e=>e.replace(Is,``).replace(Ls,``).replace(Rs,``).replace(zs,``).replace(Bs,``).replace(Vs,``).replace(Hs,``).replace(Us,``).replace(Ws,``).replace(Gs,``).replace(Ks,``).replace(qs,``),Xs=e=>String(Math.round(e*1e3)/1e3),Zs=(e,t=``)=>{let n=[];if(e.version&&n.push(`#ver=${e.version}`),e.instrument&&n.push(`#inst=${e.instrument}`),e.drum&&n.push(`#drum=${e.drum}`),e.drumFont&&n.push(`#drumfont=${e.drumFont}`),e.volume!==void 0&&n.push(`#volume=${e.volume}`),e.drumVolume!==void 0&&n.push(`#drumvolume=${e.drumVolume}`),e.reverb!==void 0&&e.reverb!==0&&n.push(`#reverb=${e.reverb}`),e.reverbDecay!==void 0&&e.reverbDecay!==22&&n.push(`#reverbdecay=${e.reverbDecay}`),e.reverbPreDelay!==void 0&&e.reverbPreDelay!==0&&n.push(`#reverbpredelay=${e.reverbPreDelay}`),e.delay!==void 0&&e.delay!==0&&n.push(`#delay=${e.delay}`),e.delayDivision&&e.delayDivision!==`8`&&n.push(`#delaydiv=${e.delayDivision}`),e.masterCompression!==void 0&&e.masterCompression!==0&&n.push(`#mastercomp=${e.masterCompression}`),e.fadeIn!==void 0&&e.fadeIn!==0&&n.push(`#fadein=${e.fadeIn}`),e.fadeOut!==void 0&&e.fadeOut!==0&&n.push(`#fadeout=${e.fadeOut}`),e.mode&&n.push(`#mode=${e.mode}`),e.edo!==void 0&&e.edo!==12&&n.push(`#edo=${e.edo}`),e.loop&&n.push(`#loop=on`),e.seed!==void 0&&n.push(`#seed=${e.seed}`),e.compose&&n.push(`#compose=${e.compose}`),e.audio&&(n.push(`#audio=${e.audio}`),e.audioStart&&n.push(`#audiostart=${Xs(e.audioStart)}`),e.audioEnd&&n.push(`#audioend=${Xs(e.audioEnd)}`),e.audioOffset&&n.push(`#audiooffset=${Xs(e.audioOffset)}`),e.audioVolume!==void 0&&e.audioVolume!==80&&n.push(`#audiovol=${e.audioVolume}`)),e.trackInstruments)for(let[t,r]of Object.entries(e.trackInstruments))r&&n.push(`#t${t}inst=${r}`);if(e.trackCompression)for(let[t,r]of Object.entries(e.trackCompression))r!==0&&n.push(`#t${t}comp=${r}`);if(e.trackWidth)for(let[t,r]of Object.entries(e.trackWidth))r!==100&&n.push(`#t${t}width=${r}`);if(e.trackReverbSend)for(let[t,r]of Object.entries(e.trackReverbSend))r!==0&&n.push(`#t${t}rev=${r}`);if(e.trackEqLow)for(let[t,r]of Object.entries(e.trackEqLow))r!==0&&n.push(`#t${t}eqlo=${r}`);if(e.trackEqMid)for(let[t,r]of Object.entries(e.trackEqMid))r!==0&&n.push(`#t${t}eqmid=${r}`);if(e.trackEqHigh)for(let[t,r]of Object.entries(e.trackEqHigh))r!==0&&n.push(`#t${t}eqhi=${r}`);if(e.trackPan)for(let[t,r]of Object.entries(e.trackPan))r!==64&&n.push(`#t${t}pan=${r}`);if(e.trackDelaySend)for(let[t,r]of Object.entries(e.trackDelaySend))r!==0&&n.push(`#t${t}dly=${r}`);return n.join(t)},Qs=(e,t={})=>{let n=t.stepsPerBar??192,r=t.collectTokens??!1,i=t.collectLyrics??!1,a=t.clampTrackCount,o=[],s=new Map,c=null;if(!e)return{placements:o,bpm:c,tokenTracks:r?s:void 0,lyrics:i?new Map:void 0,mergedTrackCount:0,trackVelocity:new Map,meta:{}};let l=po(e),u=Js(l).audio,d=l.replace(Ls,``).replace(/\/\*[\s\S]*?\*\//g,``).replace(/\/\/.*$/gm,``),f=Js(d);u&&(f.audio=u);let p=Ys(d),m=i?oo(p):void 0,h=va.replace(/;+$/,``),g=RegExp(`(?<![cdafgCDAFG])${h}\\b;?`,`gi`),_=so(p).replace(g,``).replace(/[\n\r]+/g,` `).trim(),v=f.edo===31?31:12,y=Ns[v],b=372/v,x=v===31?2:1,S=_.split(/(@\d+)/).filter(e=>e.trim().length>0),C=0,w=0,T=4,E=0,D=16,O=100,k=new Map,A=new Map,j=()=>{let e=k.get(C);e||(e=new Set,k.set(C,e)),e.add(w)};for(let e of S){let t=e.trim();if(t.startsWith(`@`)){let e=Number.parseInt(t.substring(1),10);w=e,a!==void 0&&e>=a&&(e=a-1),C=e,T=4,E=0,D=16,O=100;continue}let i=t.replace(/\s+/g,``).toLowerCase(),l=0,u=(e,t,n,a,o)=>{if(!r)return;let c=s.get(C);c||(c=[],s.set(C,c)),c.push({text:i.slice(a,o??l),startStep:t,durationSteps:n,type:e})},d=()=>{let e=0;for(;l<i.length;){let t=i[l];if(t===`#`)e+=x;else if(t===`-`)e-=x;else if(t===`+`)e+=v===31?1:x;else if(t===`_`)e-=v===31?1:x;else break;l++}return e},f=()=>{let e=``;for(;l<i.length&&/\d/.test(i[l]);)e+=i[l],l++;let t=e?Fs(Number.parseInt(e,10),1,64):D,r=Math.round(n/t);for(;l<i.length&&i[l]===`.`;)r=Math.round(r*1.5),l++;return r};for(;l<i.length;){let e=i[l],t=l;if(e===`o`){l++;let e=``;for(;l<i.length&&/\d/.test(i[l]);)e+=i[l],l++;T=e?Fs(Number.parseInt(e,10),0,8):4,u(`octave`,E,0,t)}else if(e===`>`)T=Math.min(8,T+1),l++,u(`shift`,E,0,t);else if(e===`<`)T=Math.max(0,T-1),l++,u(`shift`,E,0,t);else if(e===`l`){l++;let e=``;for(;l<i.length&&/\d/.test(i[l]);)e+=i[l],l++;D=Fs(Number.parseInt(e,10)||16,1,64),u(`length`,E,0,t)}else if(e===`r`){l++;let e=E,n=f();u(`rest`,e,n,t),E+=n}else if(e===`t`||e===`v`||e===`q`||e===`p`){l++;let n=``;for(;l<i.length&&/\d/.test(i[l]);)n+=i[l],l++;e===`t`&&n?c===null&&(c=Fs(Number.parseInt(n,10),1,255)):e===`v`&&n&&(O=Fs(Number.parseInt(n,10),0,127),A.set(C,O)),u(`ctrl`,E,0,t)}else if(e===`[`||(e===`'`||e===`"`)&&i.indexOf(e,l+1)!==-1){let n=e===`[`?`]`:e;l++;let r=[],a=T;for(;l<i.length&&i[l]!==n;){let e=i[l];if(Ps(e)){let t=y[e];l++,t+=d(),r.push($t((T+1)*372+t*b))}else if(e===`>`)T=Math.min(8,T+1),l++;else if(e===`<`)T=Math.max(0,T-1),l++;else if(e===`o`){l++;let e=``;for(;l<i.length&&/\d/.test(i[l]);)e+=i[l],l++;T=e?Fs(Number.parseInt(e,10),0,8):4}else l++}l<i.length&&i[l]===n&&l++;let s=f();r.length>0&&j();for(let e of r)o.push({trackIndex:C,startStep:E,pitchUnits:e,durationSteps:Math.max(1,s),velocity:O});u(`chord`,E,Math.max(1,s),t),E+=s,T=a}else if(e===`{`&&i.indexOf(`}`,l+1)!==-1){l++;let e=[];for(;l<i.length&&i[l]!==`}`;){let t=i[l],n=l;if(Ps(t)){let r=y[t];l++,r+=d();let i=$t((T+1)*372+r*b);e.push({pitch:i,weight:f(),from:n,to:l})}else if(t===`r`)l++,e.push({pitch:null,weight:f(),from:n,to:l});else if(t===`>`)T=Math.min(8,T+1),l++;else if(t===`<`)T=Math.max(0,T-1),l++;else if(t===`o`){l++;let e=``;for(;l<i.length&&/\d/.test(i[l]);)e+=i[l],l++;T=e?Fs(Number.parseInt(e,10),0,8):4}else l++}l<i.length&&i[l]===`}`&&l++;let t=f(),n=e.reduce((e,t)=>e+t.weight,0),r=0,a=0;for(let i of e){a+=i.weight;let e=n>0?Math.round(t*a/n):0,s=Math.max(1,e-r);i.pitch!==null&&(j(),o.push({trackIndex:C,startStep:E+r,pitchUnits:i.pitch,durationSteps:s,velocity:O})),u(i.pitch===null?`rest`:`note`,E+r,s,i.from,i.to),r=e}E+=t}else if(Ps(e)){let n=y[e];l++,n+=d();let r=$t((T+1)*372+n*b),i=f();j(),o.push({trackIndex:C,startStep:E,pitchUnits:r,durationSteps:Math.max(1,i),velocity:O}),u(`note`,E,Math.max(1,i),t),E+=i}else l++}}let M=0;for(let e of k.values())e.size>=2&&M++;return{placements:o,bpm:c,tokenTracks:r?s:void 0,lyrics:m,mergedTrackCount:M,trackVelocity:A,meta:f}},$s=2.2,ec=.3,tc=4,nc=2.5,rc=0,ic=0,ac=150,oc=(e,t=$s)=>{let n=e.sampleRate,r=Math.max(1,Math.floor(n*Math.max(ec,Math.min(tc,t)))),i=e.createBuffer(2,r,n);for(let e=0;e<i.numberOfChannels;e++){let t=i.getChannelData(e);for(let e=0;e<r;e++){let n=(1-e/r)**nc;t[e]=(Math.random()*2-1)*n}}return i},sc=e=>Math.max(0,Math.min(100,e))/100,cc=-1,lc=0,uc=20,dc=.001,fc=.1,pc=2048,mc=.85,hc=.98,gc=4,_c=`none`,vc=()=>{let e=new Float32Array(pc),t=hc-mc;for(let n=0;n<pc;n++){let r=(n/(pc-1)*2-1)*gc,i=Math.abs(r);e[n]=Math.sign(r)*(i<=mc?i:mc+t*Math.tanh((i-mc)/t))}return e},yc=(e,t)=>{let n=e.createDynamicsCompressor();n.threshold.value=cc,n.knee.value=lc,n.ratio.value=uc,n.attack.value=dc,n.release.value=fc;let r=e.createGain();r.gain.value=1/gc;let i=e.createWaveShaper();return i.curve=vc(),i.oversample=_c,n.connect(r),r.connect(i),i.connect(t),n},bc=48,xc=.5,Sc=20,Cc=.1,wc=1e-4,Tc=(e,t,n,r)=>`step`in e?e.step:`bar`in e?Math.max(0,e.bar-1)*n:`seconds`in e?e.seconds/r:0,Ec=e=>{let t=[],n=0,r=0,i=null,a=null,o=!1,s=0,c=new Map,l=-1,u=-1,d=!1,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=-1/0,x=0,S=0,C=()=>60/e.getBpm()/bc,w=()=>Math.max(S,e.getMinEndSec?.()??0),T=(e,t)=>{if(!d||g<=0||e<h)return s+e/t;let n=(e-h)%g;return f+n/t},E=n=>{t=[],c=new Map;let r=C(),i=e.getBpm(),a=e.stepsPerBar,o=e.getLoop?.()??!1;if(d=!!o,typeof o==`object`){f=o.start?Tc(o.start,i,a,r):0;let e=o.end?Tc(o.end,i,a,r):null;p=e===null?-1:e}else f=0,p=-1;let s=d?Math.min(n,f):n,l=0;S=0;for(let i of e.getTracks()){c.set(i.id,i.volume);for(let e of i.notes){if(e.startStep<s)continue;let a=(e.startStep-n)*r,o=e.durationSteps*r;l=Math.max(l,e.startStep+e.durationSteps),S=Math.max(S,a+o),t.push({trackId:i.id,pitch:e.pitchUnits,volume:i.volume/100,velocity:e.velocity??127,when:a,duration:o})}}for(t.sort((e,t)=>e.when-t.when),p===-1&&(p=l),m=(f-n)*r,h=(p-n)*r,g=h-m,_=0;_<t.length&&!(n+t[_].when/r>=f-1e-4);)_++},D=()=>{let i=C(),a=e.getAudioTime()-n,o=e.getSoloTrackId(),m=performance.now()/1e3;if(l>0&&u>=0){let t=m-l,n=a-u;if(t>.5||n>.5){console.warn(`[sequencer] Interruption detected (realDelta: ${t.toFixed(3)}s, audioDelta: ${n.toFixed(3)}s). Stopping playback.`),k(),e.onEnd(!0);return}}l=m,u=a;for(let t of e.getTracks())c.set(t.id,t.volume);for(;;){let n=t[r];if(r>=t.length||d&&n&&n.when>=h){if(!d||g<=0)break;r=_,v+=g,n=t[r]}if(!n)break;let i=n.when+v-a;if(i>xc)break;if(r++,o&&n.trackId!==o)continue;let s=n.velocity/127,l=(c.get(n.trackId)??n.volume*100)/100;e.onPlayNote({trackId:n.trackId,pitchUnits:n.pitch,velocity:n.velocity,volume:l*s,when:Math.max(0,i),duration:n.duration})}let{stepsPerBar:S}=e,E=T(a,i);d&&g>0&&E+wc<b&&(y=f-wc),b=E;let D=E+xc/i;if(D=d&&g>0?Math.min(D,p-wc):Math.min(D,s+w()/i),D>y){let t=Math.floor(Math.max(0,y)/S),n=Math.floor(Math.max(0,D)/S);for(let r=t;r<=n;r++){let t=e.getDrumPattern(r+1);if(t&&t.length!==0)for(let n of t){let t=r*S+n.step;t<=y||t>D||e.onPlayDrum({pitch:n.pitch,velocity:n.velocity??1,when:Math.max(0,(t-E)*i),duration:.1})}}y=D}if(a>=0){let t=T(a,i);if(e.cues&&e.cues.length>0&&e.onCue){let n=e.getBpm(),r=e.stepsPerBar,a=(e,t,n)=>n>=t?e>t&&e<=n:e>t&&e<=p||e>=f&&e<=n;for(let o of e.cues)a(Tc(o.time,n,r,i),x,t)&&e.onCue(o.id)}x=t}if(!d){let n=w();r>=t.length&&a>n+.1&&(k(),e.onEnd(!1))}},O=()=>{if(!o)return;let t=C(),r=e.getAudioTime()-n;try{e.onTick(Math.max(s,T(r,t)))}catch(e){console.error(`[sequencer] error in onTick callback:`,e)}a=requestAnimationFrame(O)},k=()=>{i!==null&&(clearInterval(i),i=null),a!==null&&(cancelAnimationFrame(a),a=null),o=!1},A=Cc;return{getEndSec:()=>o&&!d?w():0,start:(c,d=0)=>{if(k(),s=c??e.getPlayStartStep(),E(s),t.length===0&&!e.getDrumPattern(1)?.length&&(e.getMinEndSec?.()??0)<=0)return;o=!0,n=e.getAudioTime()+A+Math.max(0,d);let f=C();for(r=0;r<t.length&&!(s+t[r].when/f>=s-1e-4);)r++;v=0,y=s-wc,b=-1/0,x=s-1e-4,l=-1,u=-1,i=setInterval(D,Sc),a=requestAnimationFrame(O)},stop:k,isActive:()=>o,getStartTime:()=>n}},Dc={mimizuki:{label:`海鬼月`,font:`Chaos_sf2_file:0`,pattern:[{ranges:[[1,31],[33,52],[57,71],[73,104]],pattern:[{step:72,pitch:G.openHihat,velocity:.8},{step:88,pitch:G.closedHihat,velocity:.8}]},{ranges:[[1,52]],pattern:[{step:24,pitch:G.openHihat,velocity:.8},{step:40,pitch:G.closedHihat,velocity:.8},{step:48,pitch:G.acousticSnare,velocity:.8},{step:120,pitch:G.openHihat,velocity:.8},{step:136,pitch:G.closedHihat,velocity:.8},{step:144,pitch:G.acousticSnare,velocity:.8}]},{ranges:[[1,7],[9,52]],pattern:[{step:168,pitch:G.openHihat,velocity:.8},{step:184,pitch:G.closedHihat,velocity:.8}]},{ranges:[[56,104]],pattern:[{step:120,pitch:G.openHihat,velocity:.8},{step:136,pitch:G.closedHihat,velocity:.8},{step:144,pitch:G.acousticSnare,velocity:.8},{step:168,pitch:G.openHihat,velocity:.8},{step:184,pitch:G.closedHihat,velocity:.8}]},{ranges:[[57,104]],pattern:[{step:24,pitch:G.openHihat,velocity:.8},{step:40,pitch:G.closedHihat,velocity:.8},{step:48,pitch:G.acousticSnare,velocity:.8}]},{ranges:[[1,1],[5,5],[9,9],[13,13],[17,17],[21,21],[25,25],[29,29],[32,33],[37,37],[41,41],[45,45],[49,49],[53,53],[57,57],[61,61],[65,65],[69,69],[72,73],[77,77],[81,81],[85,85],[89,89],[93,93],[97,97],[101,101]],pattern:[{step:0,pitch:G.crashCymbal1,velocity:.8}]},{ranges:[[32,32],[72,72]],pattern:[{step:72,pitch:G.lowTom,velocity:.8},{step:84,pitch:43,velocity:.8},{step:96,pitch:41,velocity:.8},{step:112,pitch:G.sideStick,velocity:.3},{step:112,pitch:G.highTom,velocity:.3},{step:116,pitch:G.sideStick,velocity:.3},{step:116,pitch:G.highTom,velocity:.3},{step:120,pitch:G.sideStick,velocity:.8},{step:120,pitch:G.highTom,velocity:.8},{step:136,pitch:G.sideStick,velocity:.5},{step:136,pitch:G.highTom,velocity:.5},{step:144,pitch:G.sideStick,velocity:.8},{step:144,pitch:48,velocity:.8},{step:152,pitch:G.crashCymbal1,velocity:.1},{step:160,pitch:G.sideStick,velocity:.3},{step:160,pitch:48,velocity:.3},{step:160,pitch:G.crashCymbal1,velocity:.3},{step:168,pitch:G.sideStick,velocity:.6},{step:168,pitch:G.lowMidTom,velocity:.8},{step:168,pitch:G.crashCymbal1,velocity:.4},{step:176,pitch:G.sideStick,velocity:.3},{step:176,pitch:G.crashCymbal1,velocity:.5},{step:184,pitch:G.sideStick,velocity:.5},{step:184,pitch:G.lowMidTom,velocity:.3},{step:184,pitch:G.crashCymbal1,velocity:.7}]},{ranges:[[56,56],[64,64],[80,80],[88,88]],pattern:[{step:112,pitch:G.sideStick,velocity:.3},{step:112,pitch:G.highTom,velocity:.3},{step:116,pitch:G.sideStick,velocity:.3},{step:116,pitch:G.highTom,velocity:.3},{step:120,pitch:G.sideStick,velocity:.8},{step:120,pitch:G.highTom,velocity:.8},{step:136,pitch:G.sideStick,velocity:.5},{step:136,pitch:G.highTom,velocity:.5},{step:144,pitch:G.sideStick,velocity:.8},{step:144,pitch:48,velocity:.8},{step:152,pitch:G.crashCymbal1,velocity:.1},{step:160,pitch:G.sideStick,velocity:.3},{step:160,pitch:48,velocity:.3},{step:160,pitch:G.crashCymbal1,velocity:.3},{step:168,pitch:G.sideStick,velocity:.6},{step:168,pitch:G.lowMidTom,velocity:.8},{step:168,pitch:G.crashCymbal1,velocity:.4},{step:176,pitch:G.sideStick,velocity:.3},{step:176,pitch:G.crashCymbal1,velocity:.5},{step:184,pitch:G.sideStick,velocity:.5},{step:184,pitch:G.lowMidTom,velocity:.3},{step:184,pitch:G.crashCymbal1,velocity:.7}]}]},budou_ga_kage_kara_nozoiterunda:{label:`ブドウがかげからのぞいてるんだ`,font:`FluidR3_GM_sf2_file:0`,pattern:[{ranges:[[1,91]],pattern:[{step:144,pitch:G.bassDrum1,velocity:.8}]},{ranges:[[5,47],[49,88]],pattern:[{step:24,pitch:G.pedalHihat,velocity:.8}]},{ranges:[[13,47],[57,88]],pattern:[{step:72,pitch:G.pedalHihat,velocity:.8},{step:120,pitch:G.pedalHihat,velocity:.8},{step:168,pitch:G.pedalHihat,velocity:.8}]},{ranges:[[37,92]],pattern:[{step:0,pitch:G.bassDrum1,velocity:.8},{step:96,pitch:G.bassDrum1,velocity:.8}]},{ranges:[[37,91]],pattern:[{step:144,pitch:G.acousticSnare,velocity:.8}]},{ranges:[[45,92]],pattern:[{step:0,pitch:53,velocity:.8},{step:36,pitch:67,velocity:.5},{step:72,pitch:67,velocity:.5}]},{ranges:[[45,91]],pattern:[{step:144,pitch:68,velocity:.5},{step:168,pitch:60,velocity:.8},{step:168,pitch:68,velocity:.5},{step:180,pitch:68,velocity:.5}]},{ranges:[[57,92]],pattern:[{step:24,pitch:67,velocity:.5},{step:48,pitch:G.bassDrum1,velocity:.8},{step:48,pitch:G.acousticSnare,velocity:.8},{step:48,pitch:53,velocity:.8},{step:60,pitch:68,velocity:.5},{step:96,pitch:60,velocity:.8}]},{ranges:[[57,91]],pattern:[{step:120,pitch:67,velocity:.5},{step:132,pitch:60,velocity:.8}]},{ranges:[[1,29]],pattern:[{step:0,pitch:G.bassDrum1,velocity:.8}]},{ranges:[[1,28]],pattern:[{step:96,pitch:G.bassDrum1,velocity:.8}]},{ranges:[[4,28]],pattern:[{step:0,pitch:53,velocity:.8},{step:36,pitch:67,velocity:.5},{step:72,pitch:67,velocity:.5},{step:144,pitch:G.acousticSnare,velocity:.8},{step:144,pitch:68,velocity:.5},{step:168,pitch:60,velocity:.8},{step:168,pitch:68,velocity:.5},{step:180,pitch:68,velocity:.5}]},{ranges:[[13,28]],pattern:[{step:24,pitch:67,velocity:.5},{step:48,pitch:G.bassDrum1,velocity:.8},{step:48,pitch:G.acousticSnare,velocity:.8},{step:48,pitch:53,velocity:.8},{step:60,pitch:68,velocity:.5},{step:96,pitch:60,velocity:.8},{step:120,pitch:67,velocity:.5},{step:132,pitch:60,velocity:.8}]},{ranges:[[5,11],[49,55]],pattern:[{step:24,pitch:67,velocity:.5},{step:48,pitch:G.bassDrum1,velocity:.8},{step:48,pitch:G.acousticSnare,velocity:.8},{step:48,pitch:53,velocity:.8},{step:60,pitch:68,velocity:.5},{step:72,pitch:G.pedalHihat,velocity:.8},{step:96,pitch:60,velocity:.8},{step:120,pitch:G.pedalHihat,velocity:.8},{step:120,pitch:67,velocity:.5},{step:132,pitch:60,velocity:.8},{step:168,pitch:G.pedalHihat,velocity:.8}]},{ranges:[[37,47]],pattern:[{step:48,pitch:G.bassDrum1,velocity:.8},{step:48,pitch:G.acousticSnare,velocity:.8}]},{ranges:[[29,36]],pattern:[{step:48,pitch:G.pedalHihat,velocity:.8},{step:72,pitch:G.bassDrum1,velocity:.8},{step:96,pitch:G.handClap,velocity:.8},{step:144,pitch:G.pedalHihat,velocity:.8},{step:168,pitch:G.bassDrum1,velocity:.8}]},{ranges:[[1,3]],pattern:[{step:48,pitch:G.bassDrum1,velocity:.8}]},{ranges:[[45,47]],pattern:[{step:24,pitch:67,velocity:.5},{step:48,pitch:53,velocity:.8},{step:60,pitch:68,velocity:.5},{step:96,pitch:60,velocity:.8},{step:120,pitch:67,velocity:.5},{step:132,pitch:60,velocity:.8}]},{ranges:[[4,4],[48,48]],pattern:[{step:0,pitch:67,velocity:.5},{step:36,pitch:G.bassDrum1,velocity:.8},{step:36,pitch:53,velocity:.8},{step:72,pitch:G.bassDrum1,velocity:.8},{step:72,pitch:53,velocity:.8},{step:120,pitch:G.acousticSnare,velocity:.8},{step:120,pitch:60,velocity:.8},{step:120,pitch:68,velocity:.5},{step:144,pitch:60,velocity:.8},{step:168,pitch:G.acousticSnare,velocity:.8},{step:180,pitch:G.acousticSnare,velocity:.8}]},{ranges:[[12,12],[56,56]],pattern:[{step:0,pitch:67,velocity:.5},{step:0,pitch:G.pedalHihat,velocity:.8},{step:0,pitch:G.acousticSnare,velocity:.8},{step:24,pitch:G.bassDrum1,velocity:.8},{step:36,pitch:53,velocity:.8},{step:36,pitch:G.acousticSnare,velocity:.8},{step:60,pitch:G.bassDrum1,velocity:.8},{step:60,pitch:G.pedalHihat,velocity:.8},{step:72,pitch:53,velocity:.8},{step:72,pitch:G.acousticSnare,velocity:.8},{step:96,pitch:G.pedalHihat,velocity:.8},{step:120,pitch:60,velocity:.8},{step:120,pitch:68,velocity:.5},{step:144,pitch:60,velocity:.8}]},{ranges:[[13,13],[21,21],[57,57],[65,65],[73,73],[81,81]],pattern:[{step:0,pitch:G.crashCymbal1,velocity:.8}]},{ranges:[[29,29]],pattern:[{step:0,pitch:G.crashCymbal1,velocity:.8},{step:32,pitch:G.pedalHihat,velocity:.8},{step:40,pitch:G.pedalHihat,velocity:.8},{step:128,pitch:G.pedalHihat,velocity:.8},{step:136,pitch:G.pedalHihat,velocity:.8}]},{ranges:[[30,30],[32,32],[34,34]],pattern:[{step:0,pitch:G.pedalHihat,velocity:.8},{step:8,pitch:G.pedalHihat,velocity:.8},{step:16,pitch:G.pedalHihat,velocity:.8},{step:24,pitch:G.bassDrum1,velocity:.8},{step:84,pitch:G.pedalHihat,velocity:.8},{step:96,pitch:G.pedalHihat,velocity:.8},{step:120,pitch:G.bassDrum1,velocity:.8},{step:132,pitch:G.pedalHihat,velocity:.8},{step:156,pitch:G.pedalHihat,velocity:.8},{step:180,pitch:G.pedalHihat,velocity:.8}]},{ranges:[[31,31],[33,33],[35,35]],pattern:[{step:0,pitch:G.bassDrum1,velocity:.8},{step:32,pitch:G.pedalHihat,velocity:.8},{step:40,pitch:G.pedalHihat,velocity:.8},{step:128,pitch:G.pedalHihat,velocity:.8},{step:136,pitch:G.pedalHihat,velocity:.8}]},{ranges:[[36,36]],pattern:[{step:0,pitch:G.pedalHihat,velocity:.8},{step:8,pitch:G.pedalHihat,velocity:.8},{step:16,pitch:G.pedalHihat,velocity:.8},{step:24,pitch:G.bassDrum1,velocity:.8},{step:84,pitch:G.pedalHihat,velocity:.8},{step:96,pitch:G.pedalHihat,velocity:.8},{step:102,pitch:G.handClap,velocity:.8},{step:108,pitch:G.handClap,velocity:.8},{step:114,pitch:G.handClap,velocity:.8},{step:120,pitch:G.bassDrum1,velocity:.8},{step:126,pitch:G.handClap,velocity:.8},{step:132,pitch:G.pedalHihat,velocity:.8},{step:144,pitch:G.handClap,velocity:.8},{step:156,pitch:G.pedalHihat,velocity:.8},{step:168,pitch:G.handClap,velocity:.8},{step:172,pitch:G.handClap,velocity:.8},{step:176,pitch:G.handClap,velocity:.8},{step:180,pitch:G.pedalHihat,velocity:.8},{step:180,pitch:G.handClap,velocity:.8},{step:184,pitch:G.handClap,velocity:.8},{step:188,pitch:G.handClap,velocity:.8}]}]},hamari_au_karada_wa:{label:`嵌り合う体は`,font:`FluidR3_GM_sf2_file:0`,pattern:[{ranges:[[7,51],[53,99]],pattern:[{step:144,pitch:G.acousticSnare,velocity:.8}]},{ranges:[[35,67]],pattern:[{step:0,pitch:35,velocity:.8},{step:48,pitch:35,velocity:.8},{step:96,pitch:35,velocity:.8}]},{ranges:[[69,100]],pattern:[{step:0,pitch:35,velocity:.8},{step:24,pitch:G.splashCymbal,velocity:.8},{step:48,pitch:G.acousticSnare,velocity:.8},{step:48,pitch:35,velocity:.8},{step:72,pitch:G.splashCymbal,velocity:.8},{step:96,pitch:35,velocity:.8},{step:96,pitch:67,velocity:.8}]},{ranges:[[35,51],[53,67]],pattern:[{step:24,pitch:G.splashCymbal,velocity:.8},{step:48,pitch:G.acousticSnare,velocity:.8},{step:72,pitch:G.splashCymbal,velocity:.8},{step:120,pitch:G.splashCymbal,velocity:.8},{step:144,pitch:35,velocity:.8},{step:168,pitch:G.splashCymbal,velocity:.8}]},{ranges:[[69,99]],pattern:[{step:120,pitch:G.splashCymbal,velocity:.8},{step:144,pitch:35,velocity:.8},{step:144,pitch:67,velocity:.8},{step:168,pitch:G.splashCymbal,velocity:.8}]},{ranges:[[6,33]],pattern:[{step:120,pitch:G.splashCymbal,velocity:.8},{step:168,pitch:G.splashCymbal,velocity:.8}]},{ranges:[[7,33]],pattern:[{step:0,pitch:35,velocity:.8},{step:24,pitch:G.splashCymbal,velocity:.8},{step:48,pitch:G.acousticSnare,velocity:.8},{step:48,pitch:35,velocity:.8},{step:72,pitch:G.splashCymbal,velocity:.8},{step:96,pitch:35,velocity:.8},{step:144,pitch:35,velocity:.8}]},{ranges:[[11,18],[35,50]],pattern:[{step:96,pitch:67,velocity:.8},{step:144,pitch:67,velocity:.8}]},{ranges:[[23,26],[57,60]],pattern:[{step:0,pitch:68,velocity:.8},{step:48,pitch:67,velocity:.8},{step:120,pitch:68,velocity:.8},{step:144,pitch:67,velocity:.8}]},{ranges:[[3,7],[19,19],[23,23],[27,27],[31,31],[53,53],[57,57],[61,61],[65,65]],pattern:[{step:0,pitch:57,velocity:.8}]},{ranges:[[31,33],[65,67]],pattern:[{step:24,pitch:77,velocity:.8},{step:60,pitch:77,velocity:.8},{step:96,pitch:77,velocity:.8},{step:132,pitch:77,velocity:.8}]},{ranges:[[3,5]],pattern:[{step:96,pitch:57,velocity:.8}]},{ranges:[[31,32],[65,66]],pattern:[{step:168,pitch:77,velocity:.8}]},{ranges:[[1,2]],pattern:[{step:0,pitch:62,velocity:.8},{step:48,pitch:62,velocity:.8},{step:96,pitch:62,velocity:.8}]},{ranges:[[1,1]],pattern:[{step:144,pitch:62,velocity:.8}]},{ranges:[[2,2]],pattern:[{step:36,pitch:62,velocity:.8},{step:72,pitch:62,velocity:.8}]},{ranges:[[6,6]],pattern:[{step:48,pitch:G.splashCymbal,velocity:.8},{step:108,pitch:G.acousticSnare,velocity:.8},{step:120,pitch:G.acousticSnare,velocity:.8},{step:132,pitch:G.acousticSnare,velocity:.8},{step:168,pitch:G.acousticSnare,velocity:.8},{step:180,pitch:G.acousticSnare,velocity:.8}]},{ranges:[[11,11],[35,35],[43,43],[69,69],[77,77],[85,85],[93,93]],pattern:[{step:0,pitch:57,velocity:.8},{step:24,pitch:77,velocity:.8},{step:48,pitch:77,velocity:.8},{step:96,pitch:77,velocity:.8},{step:96,pitch:53,velocity:.8},{step:132,pitch:77,velocity:.8},{step:168,pitch:77,velocity:.8}]},{ranges:[[12,12],[14,14],[16,16],[18,18],[36,36],[38,38],[40,40],[42,42],[44,44],[46,46],[48,48],[50,50],[70,70],[72,72],[74,74],[76,76],[78,78],[80,80],[82,82],[84,84],[86,86],[88,88],[90,90],[92,92],[94,94],[96,96],[98,98]],pattern:[{step:12,pitch:77,velocity:.8},{step:36,pitch:77,velocity:.8},{step:72,pitch:77,velocity:.8},{step:120,pitch:77,velocity:.8},{step:156,pitch:77,velocity:.8}]},{ranges:[[13,13],[17,17],[37,37],[41,41],[45,45],[49,49],[71,71],[75,75],[79,79],[83,83],[87,87],[91,91],[95,95],[99,99]],pattern:[{step:24,pitch:77,velocity:.8},{step:48,pitch:77,velocity:.8},{step:96,pitch:77,velocity:.8},{step:132,pitch:77,velocity:.8},{step:168,pitch:77,velocity:.8}]},{ranges:[[15,15],[39,39],[47,47],[73,73],[81,81],[89,89],[97,97]],pattern:[{step:0,pitch:57,velocity:.8},{step:24,pitch:77,velocity:.8},{step:48,pitch:77,velocity:.8},{step:96,pitch:77,velocity:.8},{step:132,pitch:77,velocity:.8},{step:168,pitch:77,velocity:.8}]},{ranges:[[22,22],[56,56]],pattern:[{step:72,pitch:77,velocity:.8},{step:96,pitch:77,velocity:.8},{step:144,pitch:77,velocity:.8}]},{ranges:[[26,26],[60,60]],pattern:[{step:96,pitch:77,velocity:.8},{step:132,pitch:77,velocity:.8},{step:168,pitch:77,velocity:.8}]},{ranges:[[33,33],[67,67]],pattern:[{step:144,pitch:110,velocity:1}]},{ranges:[[34,34],[68,68]],pattern:[{step:0,pitch:83,velocity:.8},{step:48,pitch:83,velocity:.8},{step:96,pitch:83,velocity:.8}]},{ranges:[[100,100]],pattern:[{step:12,pitch:77,velocity:.8},{step:36,pitch:77,velocity:.8},{step:72,pitch:77,velocity:.8}]}]},vecolite:{label:`vecolite`,font:`Chaos_sf2_file:0`,pattern:[{ranges:[[1,49],[51,53],[55,56],[58,75]],pattern:[{step:48,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[8,31],[60,75]],pattern:[{step:144,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[9,24],[33,43]],pattern:[{step:48,pitch:G.closedHihat,velocity:.9}]},{ranges:[[9,12],[18,32],[42,48]],pattern:[{step:0,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[9,31]],pattern:[{step:96,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[10,16],[18,25],[34,40]],pattern:[{step:24,pitch:G.openHihat,velocity:.9}]},{ranges:[[33,47]],pattern:[{step:96,pitch:G.bassDrum1,velocity:.9},{step:144,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[9,15],[33,39]],pattern:[{step:72,pitch:G.openHihat,velocity:.9},{step:88,pitch:G.acousticSnare,velocity:.9},{step:96,pitch:G.handClap,velocity:.9},{step:96,pitch:G.closedHihat,velocity:.9},{step:120,pitch:G.openHihat,velocity:.9},{step:120,pitch:48,velocity:.9}]},{ranges:[[61,67],[69,75]],pattern:[{step:0,pitch:G.bassDrum1,velocity:.9},{step:0,pitch:G.closedHihat,velocity:.9},{step:24,pitch:G.openHihat,velocity:.9},{step:40,pitch:G.sideStick,velocity:.9}]},{ranges:[[24,31],[72,75]],pattern:[{step:136,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[61,66],[69,74]],pattern:[{step:24,pitch:G.handClap,velocity:.9}]},{ranges:[[61,63],[65,67],[69,71],[73,75]],pattern:[{step:16,pitch:40,velocity:.5},{step:40,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[1,8]],pattern:[{step:120,pitch:G.bassDrum1,velocity:.9},{step:144,pitch:G.handClap,velocity:.9}]},{ranges:[[2,9]],pattern:[{step:24,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[10,12],[18,20],[22,25]],pattern:[{step:0,pitch:G.handClap,velocity:.9},{step:0,pitch:G.closedHihat,velocity:.9}]},{ranges:[[17,24]],pattern:[{step:96,pitch:G.closedHihat,velocity:.9},{step:144,pitch:G.closedHihat,velocity:.9}]},{ranges:[[25,32]],pattern:[{step:40,pitch:G.sideStick,velocity:.9}]},{ranges:[[26,33]],pattern:[{step:0,pitch:41,velocity:.9}]},{ranges:[[68,75]],pattern:[{step:48,pitch:G.closedHihat,velocity:.9},{step:72,pitch:G.openHihat,velocity:.9},{step:96,pitch:G.bassDrum1,velocity:.9},{step:96,pitch:G.closedHihat,velocity:.9},{step:120,pitch:G.openHihat,velocity:.9},{step:120,pitch:G.handClap,velocity:.9},{step:144,pitch:G.closedHihat,velocity:.9}]},{ranges:[[14,16],[34,36],[38,40]],pattern:[{step:0,pitch:G.bassDrum1,velocity:.9},{step:0,pitch:G.handClap,velocity:.9},{step:0,pitch:G.closedHihat,velocity:.9}]},{ranges:[[25,31]],pattern:[{step:48,pitch:41,velocity:.9},{step:64,pitch:G.sideStick,velocity:.9},{step:72,pitch:40,velocity:.9},{step:72,pitch:G.rideCymbal1,velocity:.9},{step:88,pitch:G.sideStick,velocity:.9},{step:88,pitch:G.rideCymbal1,velocity:.9},{step:96,pitch:41,velocity:.9},{step:96,pitch:G.rideCymbal1,velocity:.9},{step:112,pitch:G.sideStick,velocity:.9},{step:120,pitch:40,velocity:.9},{step:120,pitch:G.rideCymbal1,velocity:.9},{step:136,pitch:G.sideStick,velocity:.9},{step:136,pitch:G.rideCymbal1,velocity:.9},{step:144,pitch:41,velocity:.9},{step:144,pitch:G.rideCymbal1,velocity:.9},{step:160,pitch:G.sideStick,velocity:.9},{step:168,pitch:40,velocity:.9},{step:168,pitch:G.rideCymbal1,velocity:.9},{step:184,pitch:G.sideStick,velocity:.9},{step:184,pitch:G.rideCymbal1,velocity:.9}]},{ranges:[[26,32]],pattern:[{step:0,pitch:G.rideCymbal1,velocity:.9},{step:16,pitch:G.sideStick,velocity:.9},{step:24,pitch:G.rideCymbal1,velocity:.9},{step:40,pitch:G.bassDrum1,velocity:.9},{step:40,pitch:G.rideCymbal1,velocity:.9}]},{ranges:[[60,66]],pattern:[{step:48,pitch:G.closedHihat,velocity:.9},{step:64,pitch:40,velocity:.5},{step:72,pitch:G.openHihat,velocity:.9},{step:88,pitch:G.handClap,velocity:.9},{step:88,pitch:G.sideStick,velocity:.9},{step:96,pitch:G.bassDrum1,velocity:.9},{step:96,pitch:G.closedHihat,velocity:.9},{step:120,pitch:G.openHihat,velocity:.9},{step:120,pitch:G.handClap,velocity:.9},{step:136,pitch:G.bassDrum1,velocity:.9},{step:136,pitch:G.sideStick,velocity:.9},{step:144,pitch:G.closedHihat,velocity:.9},{step:168,pitch:G.openHihat,velocity:.9}]},{ranges:[[68,74]],pattern:[{step:168,pitch:G.openHihat,velocity:.9}]},{ranges:[[17,19],[21,24]],pattern:[{step:72,pitch:G.openHihat,velocity:.9},{step:96,pitch:G.handClap,velocity:.9},{step:120,pitch:G.openHihat,velocity:.9},{step:120,pitch:48,velocity:.9},{step:168,pitch:G.openHihat,velocity:.9}]},{ranges:[[9,11],[33,35]],pattern:[{step:144,pitch:G.closedHihat,velocity:.9},{step:168,pitch:G.acousticSnare,velocity:.9},{step:168,pitch:G.openHihat,velocity:.9},{step:184,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[13,15],[37,39]],pattern:[{step:144,pitch:G.closedHihat,velocity:.9},{step:168,pitch:G.acousticSnare,velocity:.9},{step:168,pitch:G.openHihat,velocity:.9}]},{ranges:[[26,28],[30,32]],pattern:[{step:24,pitch:40,velocity:.9}]},{ranges:[[42,44],[46,48]],pattern:[{step:0,pitch:G.handClap,velocity:.9},{step:0,pitch:G.closedHihat,velocity:.9},{step:24,pitch:G.openHihat,velocity:.9}]},{ranges:[[60,62],[64,66]],pattern:[{step:184,pitch:G.sideStick,velocity:.9},{step:184,pitch:G.handClap,velocity:.9}]},{ranges:[[17,17],[21,21],[41,41],[45,45],[49,49],[58,60],[67,68]],pattern:[{step:48,pitch:G.crashCymbal1,velocity:.9}]},{ranges:[[41,43]],pattern:[{step:72,pitch:G.openHihat,velocity:.9},{step:96,pitch:G.handClap,velocity:.9},{step:96,pitch:G.closedHihat,velocity:.9},{step:120,pitch:G.openHihat,velocity:.9},{step:120,pitch:48,velocity:.9},{step:144,pitch:G.closedHihat,velocity:.9},{step:168,pitch:G.openHihat,velocity:.9}]},{ranges:[[45,47]],pattern:[{step:48,pitch:G.closedHihat,velocity:.9},{step:72,pitch:G.openHihat,velocity:.9},{step:96,pitch:G.handClap,velocity:.9},{step:96,pitch:G.closedHihat,velocity:.9},{step:120,pitch:G.openHihat,velocity:.9},{step:120,pitch:48,velocity:.9},{step:144,pitch:G.closedHihat,velocity:.9},{step:168,pitch:G.openHihat,velocity:.9}]},{ranges:[[56,58]],pattern:[{step:24,pitch:G.openHihat,velocity:.9},{step:160,pitch:G.closedHihat,velocity:.9}]},{ranges:[[57,59]],pattern:[{step:16,pitch:G.closedHihat,velocity:.9}]},{ranges:[[68,70]],pattern:[{step:64,pitch:40,velocity:.5},{step:88,pitch:G.handClap,velocity:.9},{step:88,pitch:G.sideStick,velocity:.9},{step:136,pitch:G.bassDrum1,velocity:.9},{step:136,pitch:G.sideStick,velocity:.9},{step:184,pitch:G.sideStick,velocity:.9},{step:184,pitch:G.handClap,velocity:.9}]},{ranges:[[72,74]],pattern:[{step:64,pitch:40,velocity:.5},{step:88,pitch:G.handClap,velocity:.9},{step:88,pitch:G.sideStick,velocity:.9},{step:136,pitch:G.sideStick,velocity:.9},{step:184,pitch:G.sideStick,velocity:.9},{step:184,pitch:G.handClap,velocity:.9}]},{ranges:[[56,57]],pattern:[{step:144,pitch:G.bassDrum1,velocity:.9},{step:168,pitch:G.openHihat,velocity:.9}]},{ranges:[[58,59]],pattern:[{step:0,pitch:G.closedHihat,velocity:.9},{step:48,pitch:G.openHihat,velocity:.9},{step:48,pitch:G.handClap,velocity:.9}]},{ranges:[[1,1]],pattern:[{step:48,pitch:G.splashCymbal,velocity:.9}]},{ranges:[[4,4]],pattern:[{step:84,pitch:G.bassDrum1,velocity:.9},{step:144,pitch:G.highTom,velocity:.9},{step:160,pitch:48,velocity:.9},{step:184,pitch:G.lowMidTom,velocity:.9}]},{ranges:[[5,5]],pattern:[{step:16,pitch:G.lowTom,velocity:.9},{step:24,pitch:43,velocity:.9},{step:40,pitch:43,velocity:.9},{step:48,pitch:G.crashCymbal1,velocity:.9}]},{ranges:[[8,8]],pattern:[{step:84,pitch:G.bassDrum1,velocity:.9},{step:180,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[9,9]],pattern:[{step:0,pitch:40,velocity:.9},{step:8,pitch:40,velocity:.9},{step:16,pitch:40,velocity:.9},{step:24,pitch:G.handClap,velocity:.9},{step:48,pitch:G.splashCymbal,velocity:.9}]},{ranges:[[10,10],[14,14],[18,18],[22,22],[34,34],[38,38],[42,42],[44,44],[46,46]],pattern:[{step:24,pitch:G.lowMidTom,velocity:.9}]},{ranges:[[11,11],[15,15],[35,35],[39,39]],pattern:[{step:16,pitch:G.lowMidTom,velocity:.9},{step:40,pitch:G.handClap,velocity:.9}]},{ranges:[[12,12],[36,36]],pattern:[{step:24,pitch:G.lowMidTom,velocity:.9},{step:144,pitch:G.openHihat,velocity:.9}]},{ranges:[[13,13],[37,37]],pattern:[{step:16,pitch:G.lowMidTom,velocity:.9},{step:24,pitch:G.handClap,velocity:.9},{step:48,pitch:G.crashCymbal1,velocity:.9}]},{ranges:[[16,16],[40,40]],pattern:[{step:24,pitch:G.lowMidTom,velocity:.9},{step:48,pitch:G.acousticSnare,velocity:.9},{step:72,pitch:G.handClap,velocity:.9},{step:88,pitch:G.handClap,velocity:.9},{step:96,pitch:40,velocity:.9},{step:120,pitch:G.handClap,velocity:.9},{step:136,pitch:G.handClap,velocity:.9},{step:144,pitch:52,velocity:.9}]},{ranges:[[19,19],[43,43]],pattern:[{step:16,pitch:G.lowMidTom,velocity:.9},{step:40,pitch:G.handClap,velocity:.9},{step:48,pitch:G.crashCymbal1,velocity:.9}]},{ranges:[[20,20]],pattern:[{step:24,pitch:G.lowMidTom,velocity:.9},{step:24,pitch:G.closedHihat,velocity:.9},{step:32,pitch:G.closedHihat,velocity:.9},{step:40,pitch:G.closedHihat,velocity:.9},{step:72,pitch:G.closedHihat,velocity:.9},{step:120,pitch:G.closedHihat,velocity:.9}]},{ranges:[[23,23],[47,47]],pattern:[{step:16,pitch:G.lowMidTom,velocity:.9}]},{ranges:[[24,24]],pattern:[{step:24,pitch:G.lowMidTom,velocity:.9},{step:72,pitch:G.handClap,velocity:.9},{step:72,pitch:G.bassDrum1,velocity:.9},{step:88,pitch:G.bassDrum1,velocity:.9},{step:88,pitch:40,velocity:.9},{step:112,pitch:G.bassDrum1,velocity:.9},{step:120,pitch:G.acousticSnare,velocity:.9},{step:136,pitch:G.acousticSnare,velocity:.9},{step:152,pitch:G.sideStick,velocity:.9},{step:160,pitch:G.acousticSnare,velocity:.9},{step:168,pitch:G.bassDrum1,velocity:.9},{step:176,pitch:G.sideStick,velocity:.9},{step:176,pitch:40,velocity:.9},{step:184,pitch:G.acousticSnare,velocity:.9}]},{ranges:[[25,25]],pattern:[{step:8,pitch:G.handClap,velocity:.9},{step:16,pitch:G.lowMidTom,velocity:.9},{step:16,pitch:G.bassDrum1,velocity:.9},{step:16,pitch:G.handClap,velocity:.9},{step:24,pitch:G.bassDrum1,velocity:.9},{step:24,pitch:G.crashCymbal1,velocity:.9},{step:48,pitch:52,velocity:.9}]},{ranges:[[26,26],[30,30]],pattern:[{step:48,pitch:G.rideCymbal1,velocity:.9}]},{ranges:[[27,27],[31,31]],pattern:[{step:48,pitch:52,velocity:.9}]},{ranges:[[28,28]],pattern:[{step:48,pitch:G.rideCymbal1,velocity:.9},{step:136,pitch:G.acousticSnare,velocity:.9},{step:160,pitch:G.handClap,velocity:.9}]},{ranges:[[29,29]],pattern:[{step:0,pitch:G.acousticSnare,velocity:.9},{step:16,pitch:G.handClap,velocity:.9},{step:24,pitch:G.openHihat,velocity:.9},{step:40,pitch:G.acousticSnare,velocity:.9},{step:48,pitch:52,velocity:.9}]},{ranges:[[32,32]],pattern:[{step:48,pitch:G.crashCymbal1,velocity:.9},{step:48,pitch:G.openHihat,velocity:.9},{step:144,pitch:G.highTom,velocity:.9},{step:160,pitch:48,velocity:.9},{step:168,pitch:G.lowMidTom,velocity:.9},{step:176,pitch:G.lowTom,velocity:.9},{step:184,pitch:43,velocity:.9}]},{ranges:[[33,33]],pattern:[{step:16,pitch:G.lowMidTom,velocity:.9},{step:16,pitch:G.acousticSnare,velocity:.9},{step:24,pitch:G.handClap,velocity:.9},{step:24,pitch:G.lowTom,velocity:.9},{step:32,pitch:43,velocity:.9},{step:40,pitch:41,velocity:.9},{step:48,pitch:G.splashCymbal,velocity:.9}]},{ranges:[[48,48]],pattern:[{step:24,pitch:G.lowMidTom,velocity:.9},{step:48,pitch:G.splashCymbal,velocity:.9},{step:48,pitch:48,velocity:.9}]},{ranges:[[51,51]],pattern:[{step:24,pitch:G.bassDrum1,velocity:.9},{step:48,pitch:G.openHihat,velocity:.9}]},{ranges:[[52,52]],pattern:[{step:72,pitch:G.closedHihat,velocity:.9},{step:96,pitch:G.bassDrum1,velocity:.9},{step:120,pitch:G.closedHihat,velocity:.9},{step:144,pitch:G.bassDrum1,velocity:.9},{step:168,pitch:G.closedHihat,velocity:.9}]},{ranges:[[53,53]],pattern:[{step:0,pitch:G.bassDrum1,velocity:.9},{step:24,pitch:G.closedHihat,velocity:.9},{step:48,pitch:G.crashCymbal1,velocity:.9}]},{ranges:[[55,55]],pattern:[{step:48,pitch:G.openHihat,velocity:.9}]},{ranges:[[56,56]],pattern:[{step:48,pitch:41,velocity:.9},{step:64,pitch:G.closedHihat,velocity:.9},{step:72,pitch:G.openHihat,velocity:.9},{step:112,pitch:G.closedHihat,velocity:.9},{step:120,pitch:G.openHihat,velocity:.9},{step:144,pitch:41,velocity:.9}]},{ranges:[[57,57]],pattern:[{step:24,pitch:40,velocity:.9},{step:32,pitch:40,velocity:.9},{step:40,pitch:40,velocity:.9},{step:48,pitch:G.acousticSnare,velocity:.9},{step:72,pitch:G.handClap,velocity:.9},{step:72,pitch:G.bassDrum1,velocity:.9},{step:72,pitch:G.crashCymbal1,velocity:.9},{step:112,pitch:G.bassDrum1,velocity:.9},{step:112,pitch:G.handClap,velocity:.9},{step:112,pitch:G.crashCymbal1,velocity:.9},{step:144,pitch:G.handClap,velocity:.9},{step:144,pitch:G.crashCymbal1,velocity:.9}]},{ranges:[[58,58]],pattern:[{step:8,pitch:G.closedHihat,velocity:.9},{step:40,pitch:G.acousticSnare,velocity:.9},{step:88,pitch:G.bassDrum1,velocity:.9},{step:88,pitch:G.openHihat,velocity:.9},{step:88,pitch:G.crashCymbal1,velocity:.9},{step:120,pitch:G.bassDrum1,velocity:.9},{step:120,pitch:G.openHihat,velocity:.9},{step:120,pitch:G.crashCymbal1,velocity:.9},{step:144,pitch:G.closedHihat,velocity:.9},{step:152,pitch:G.closedHihat,velocity:.9},{step:168,pitch:G.closedHihat,velocity:.9},{step:176,pitch:G.closedHihat,velocity:.9},{step:184,pitch:G.closedHihat,velocity:.9}]},{ranges:[[59,59]],pattern:[{step:24,pitch:G.bassDrum1,velocity:.9},{step:24,pitch:G.handClap,velocity:.9},{step:24,pitch:G.crashCymbal1,velocity:.9},{step:24,pitch:G.pedalHihat,velocity:.9},{step:40,pitch:G.handClap,velocity:.9},{step:40,pitch:G.bassDrum1,velocity:.9},{step:40,pitch:G.pedalHihat,velocity:.9},{step:40,pitch:G.crashCymbal1,velocity:.9},{step:96,pitch:G.openHihat,velocity:.9},{step:144,pitch:G.openHihat,velocity:.9}]},{ranges:[[60,60]],pattern:[{step:0,pitch:G.acousticSnare,velocity:.9},{step:0,pitch:G.openHihat,velocity:.9},{step:16,pitch:G.handClap,velocity:.9},{step:24,pitch:52,velocity:.9}]},{ranges:[[61,61],[65,65],[69,69],[73,73]],pattern:[{step:160,pitch:G.handClap,velocity:.9}]},{ranges:[[63,63]],pattern:[{step:160,pitch:G.acousticSnare,velocity:.9},{step:168,pitch:G.handClap,velocity:.9},{step:184,pitch:G.bassDrum1,velocity:.9},{step:184,pitch:40,velocity:.9}]},{ranges:[[64,64]],pattern:[{step:0,pitch:G.acousticSnare,velocity:.9},{step:8,pitch:G.handClap,velocity:.9},{step:16,pitch:G.acousticSnare,velocity:1},{step:48,pitch:G.crashCymbal1,velocity:.9}]},{ranges:[[67,67]],pattern:[{step:24,pitch:G.acousticSnare,velocity:.9},{step:32,pitch:40,velocity:.9},{step:40,pitch:G.pedalHihat,velocity:.9},{step:48,pitch:G.openHihat,velocity:.9},{step:48,pitch:G.handClap,velocity:.9},{step:72,pitch:G.closedHihat,velocity:.9},{step:88,pitch:G.bassDrum1,velocity:.9},{step:112,pitch:G.bassDrum1,velocity:.9},{step:120,pitch:G.bassDrum1,velocity:.9},{step:120,pitch:G.closedHihat,velocity:.9},{step:168,pitch:G.closedHihat,velocity:.9},{step:184,pitch:G.bassDrum1,velocity:.9}]},{ranges:[[68,68]],pattern:[{step:16,pitch:G.bassDrum1,velocity:.9},{step:16,pitch:G.closedHihat,velocity:.9},{step:24,pitch:G.bassDrum1,velocity:.9},{step:24,pitch:52,velocity:.9}]},{ranges:[[71,71]],pattern:[{step:72,pitch:G.handClap,velocity:.9},{step:168,pitch:G.handClap,velocity:.9}]},{ranges:[[72,72]],pattern:[{step:16,pitch:40,velocity:.9},{step:24,pitch:52,velocity:.9},{step:48,pitch:G.crashCymbal1,velocity:.9}]},{ranges:[[75,75]],pattern:[{step:24,pitch:G.acousticSnare,velocity:.9},{step:32,pitch:40,velocity:.9},{step:40,pitch:G.pedalHihat,velocity:.9},{step:48,pitch:G.crashCymbal1,velocity:.9},{step:48,pitch:G.handClap,velocity:.9},{step:48,pitch:G.highTom,velocity:.9},{step:64,pitch:G.sideStick,velocity:.9},{step:64,pitch:48,velocity:.9},{step:72,pitch:G.handClap,velocity:.9},{step:72,pitch:G.lowMidTom,velocity:.9},{step:88,pitch:G.pedalHihat,velocity:.9},{step:88,pitch:G.lowTom,velocity:.9},{step:96,pitch:G.handClap,velocity:.9},{step:96,pitch:48,velocity:.9},{step:112,pitch:G.sideStick,velocity:.9},{step:112,pitch:G.lowMidTom,velocity:.9},{step:120,pitch:G.lowTom,velocity:.9},{step:120,pitch:G.splashCymbal,velocity:.9},{step:128,pitch:G.handClap,velocity:.9},{step:136,pitch:G.handClap,velocity:.9},{step:136,pitch:43,velocity:.9},{step:136,pitch:G.pedalHihat,velocity:.9},{step:144,pitch:G.handClap,velocity:.9},{step:144,pitch:52,velocity:.9},{step:144,pitch:41,velocity:.9},{step:144,pitch:G.crashCymbal1,velocity:.9}]}]},tsuchi_he_to_shizumu_kagerou:{label:`つちへとしずむカゲロウ`,font:`FluidR3_GM_sf2_file:11`,pattern:[{ranges:[[8,85]],pattern:[{step:72,pitch:G.closedHihat,velocity:.8}]},{ranges:[[2,9],[15,52],[54,85]],pattern:[{step:0,pitch:35,velocity:.8}]},{ranges:[[8,46],[50,85]],pattern:[{step:96,pitch:35,velocity:.8}]},{ranges:[[24,37],[63,76],[102,115],[117,130]],pattern:[{step:120,pitch:G.closedHihat,velocity:.8},{step:120,pitch:60,velocity:.8},{step:144,pitch:35,velocity:.8},{step:144,pitch:G.handClap,velocity:.8},{step:168,pitch:G.closedHihat,velocity:.8},{step:168,pitch:60,velocity:.8}]},{ranges:[[94,131]],pattern:[{step:0,pitch:35,velocity:.8},{step:96,pitch:35,velocity:.8}]},{ranges:[[102,131]],pattern:[{step:24,pitch:G.closedHihat,velocity:.8},{step:48,pitch:35,velocity:.8},{step:48,pitch:G.handClap,velocity:.8},{step:48,pitch:60,velocity:.8},{step:72,pitch:G.closedHihat,velocity:.8}]},{ranges:[[24,49]],pattern:[{step:24,pitch:G.closedHihat,velocity:.8},{step:48,pitch:G.handClap,velocity:.8}]},{ranges:[[24,46]],pattern:[{step:48,pitch:35,velocity:.8},{step:48,pitch:60,velocity:.8}]},{ranges:[[63,85]],pattern:[{step:24,pitch:G.closedHihat,velocity:.8},{step:48,pitch:35,velocity:.8}]},{ranges:[[8,22],[78,85]],pattern:[{step:120,pitch:G.closedHihat,velocity:.8},{step:144,pitch:35,velocity:.8},{step:168,pitch:G.closedHihat,velocity:.8}]},{ranges:[[39,60]],pattern:[{step:144,pitch:G.handClap,velocity:.8}]},{ranges:[[63,84]],pattern:[{step:48,pitch:G.handClap,velocity:.8},{step:48,pitch:60,velocity:.8}]},{ranges:[[2,22]],pattern:[{step:48,pitch:35,velocity:.8}]},{ranges:[[8,9],[15,22],[51,52],[54,61]],pattern:[{step:24,pitch:G.closedHihat,velocity:.8}]},{ranges:[[8,21],[98,100]],pattern:[{step:48,pitch:G.handClap,velocity:.8},{step:144,pitch:G.handClap,velocity:.8}]},{ranges:[[16,22],[55,61]],pattern:[{step:0,pitch:77,velocity:.8},{step:24,pitch:76,velocity:.8},{step:48,pitch:77,velocity:.8},{step:72,pitch:76,velocity:.8},{step:168,pitch:76,velocity:.8}]},{ranges:[[50,61],[95,95]],pattern:[{step:144,pitch:35,velocity:.8}]},{ranges:[[8,15],[51,54]],pattern:[{step:48,pitch:60,velocity:.8},{step:120,pitch:60,velocity:.8},{step:168,pitch:60,velocity:.8}]},{ranges:[[39,49]],pattern:[{step:120,pitch:G.closedHihat,velocity:.8},{step:168,pitch:G.closedHihat,velocity:.8}]},{ranges:[[51,61]],pattern:[{step:48,pitch:35,velocity:.8},{step:120,pitch:G.closedHihat,velocity:.8},{step:168,pitch:G.closedHihat,velocity:.8}]},{ranges:[[51,60]],pattern:[{step:48,pitch:G.handClap,velocity:.8}]},{ranges:[[39,46]],pattern:[{step:120,pitch:60,velocity:.8},{step:144,pitch:35,velocity:.8},{step:168,pitch:60,velocity:.8}]},{ranges:[[78,84]],pattern:[{step:120,pitch:60,velocity:.8},{step:144,pitch:G.handClap,velocity:.8},{step:168,pitch:60,velocity:.8}]},{ranges:[[86,92]],pattern:[{step:96,pitch:G.handClap,velocity:.8}]},{ranges:[[2,7]],pattern:[{step:24,pitch:G.closedHihat,velocity:.6},{step:72,pitch:G.closedHihat,velocity:.6}]},{ranges:[[2,6]],pattern:[{step:96,pitch:35,velocity:.8},{step:120,pitch:G.closedHihat,velocity:.6},{step:144,pitch:35,velocity:.8},{step:168,pitch:G.closedHihat,velocity:.6}]},{ranges:[[97,100]],pattern:[{step:48,pitch:35,velocity:.8},{step:144,pitch:35,velocity:.8}]},{ranges:[[11,13]],pattern:[{step:0,pitch:35,velocity:.8},{step:24,pitch:G.closedHihat,velocity:.8}]},{ranges:[[47,49]],pattern:[{step:120,pitch:35,velocity:.8}]},{ranges:[[100,101]],pattern:[{step:0,pitch:G.handClap,velocity:.8}]},{ranges:[[1,1]],pattern:[{step:0,pitch:62,velocity:.8},{step:48,pitch:62,velocity:.8},{step:96,pitch:62,velocity:.8},{step:144,pitch:62,velocity:.8}]},{ranges:[[8,8],[47,47],[86,86]],pattern:[{step:0,pitch:G.crashCymbal1,velocity:.8}]},{ranges:[[15,15],[54,54]],pattern:[{step:96,pitch:60,velocity:.8},{step:144,pitch:60,velocity:.8}]},{ranges:[[16,16],[55,55]],pattern:[{step:0,pitch:G.crashCymbal1,velocity:.8},{step:96,pitch:77,velocity:.8},{step:120,pitch:77,velocity:.8},{step:144,pitch:76,velocity:.8}]},{ranges:[[17,17],[19,19],[21,21],[56,56],[58,58],[60,60]],pattern:[{step:84,pitch:77,velocity:.8},{step:108,pitch:77,velocity:.8},{step:120,pitch:76,velocity:.8},{step:144,pitch:77,velocity:.8}]},{ranges:[[18,18],[20,20],[22,22],[57,57],[59,59],[61,61]],pattern:[{step:96,pitch:77,velocity:.8},{step:120,pitch:77,velocity:.8},{step:144,pitch:76,velocity:.8}]},{ranges:[[23,23],[62,62]],pattern:[{step:0,pitch:G.closedHihat,velocity:.8},{step:0,pitch:G.handClap,velocity:.8},{step:36,pitch:G.closedHihat,velocity:.8},{step:36,pitch:35,velocity:.8},{step:36,pitch:G.handClap,velocity:.8},{step:72,pitch:35,velocity:.8},{step:72,pitch:G.handClap,velocity:.8},{step:96,pitch:G.closedHihat,velocity:.8},{step:96,pitch:G.handClap,velocity:.8}]},{ranges:[[24,24],[39,39],[63,63],[78,78],[117,117]],pattern:[{step:0,pitch:G.openHihat,velocity:.8}]},{ranges:[[50,50]],pattern:[{step:0,pitch:G.closedHihat,velocity:.8},{step:0,pitch:G.handClap,velocity:.8},{step:36,pitch:G.closedHihat,velocity:.8},{step:36,pitch:35,velocity:.8},{step:36,pitch:G.handClap,velocity:.8},{step:72,pitch:35,velocity:.8},{step:72,pitch:G.handClap,velocity:.8},{step:96,pitch:G.closedHihat,velocity:.8},{step:120,pitch:G.handClap,velocity:.8},{step:144,pitch:G.closedHihat,velocity:.8},{step:168,pitch:35,velocity:.8}]},{ranges:[[100,100]],pattern:[{step:96,pitch:G.handClap,velocity:.8},{step:120,pitch:35,velocity:.8},{step:120,pitch:G.handClap,velocity:.8},{step:168,pitch:35,velocity:.8},{step:168,pitch:G.handClap,velocity:.8}]},{ranges:[[101,101]],pattern:[{step:36,pitch:35,velocity:.8},{step:36,pitch:G.handClap,velocity:.8},{step:72,pitch:35,velocity:.8},{step:72,pitch:G.handClap,velocity:.8},{step:96,pitch:60,velocity:0},{step:108,pitch:60,velocity:.1},{step:120,pitch:60,velocity:.3},{step:132,pitch:60,velocity:.3},{step:144,pitch:60,velocity:.5},{step:156,pitch:60,velocity:.6},{step:168,pitch:60,velocity:.7},{step:180,pitch:60,velocity:.8}]},{ranges:[[102,102]],pattern:[{step:0,pitch:G.crashCymbal1,velocity:.8},{step:0,pitch:G.openHihat,velocity:.8}]}]},asayake:{label:`あさやけもゆうやけもないんだ`,font:`FluidR3_GM_sf2_file:11`,pattern:[{ranges:[[1,101]],pattern:[{step:48,pitch:56,velocity:.8}]},{ranges:[[2,101]],pattern:[{step:0,pitch:G.bassDrum1,velocity:.8},{step:24,pitch:G.closedHihat,velocity:.8},{step:36,pitch:56,velocity:.8},{step:48,pitch:G.bassDrum1,velocity:.8},{step:48,pitch:40,velocity:.8},{step:72,pitch:G.closedHihat,velocity:.8},{step:72,pitch:56,velocity:.8},{step:96,pitch:G.bassDrum1,velocity:.8},{step:120,pitch:G.closedHihat,velocity:.8},{step:144,pitch:G.bassDrum1,velocity:.8},{step:144,pitch:40,velocity:.8},{step:168,pitch:G.closedHihat,velocity:.8}]},{ranges:[[1,6],[17,18],[21,46],[57,58],[61,101]],pattern:[{step:0,pitch:G.tambourine,velocity:.8}]},{ranges:[[1,5],[19,45],[59,101]],pattern:[{step:96,pitch:G.tambourine,velocity:.8}]},{ranges:[[1,4],[14,20],[22,28],[30,36],[38,44],[54,60],[62,68],[70,76],[78,84],[86,92],[94,100]],pattern:[{step:132,pitch:56,velocity:.8},{step:144,pitch:56,velocity:.8},{step:168,pitch:56,velocity:.8}]},{ranges:[[5,14],[45,54]],pattern:[{step:168,pitch:G.tambourine,velocity:.8}]},{ranges:[[7,13],[15,16],[47,53],[55,56]],pattern:[{step:48,pitch:G.tambourine,velocity:.8}]},{ranges:[[6,12],[46,52]],pattern:[{step:120,pitch:G.tambourine,velocity:.8},{step:132,pitch:56,velocity:.8},{step:144,pitch:56,velocity:.8},{step:168,pitch:56,velocity:.8}]},{ranges:[[3,3],[19,21],[23,23],[27,27],[31,31],[35,35],[39,39],[43,43],[59,61],[63,63],[67,67],[71,71],[75,75],[79,79],[83,83],[87,87],[91,91],[95,95],[99,99]],pattern:[{step:48,pitch:G.tambourine,velocity:.8},{step:144,pitch:G.tambourine,velocity:.8}]},{ranges:[[15,17],[55,57]],pattern:[{step:96,pitch:G.tambourine,velocity:.8},{step:144,pitch:G.tambourine,velocity:.8}]},{ranges:[[1,1]],pattern:[{step:0,pitch:56,velocity:.8},{step:48,pitch:G.tambourine,velocity:.8},{step:96,pitch:56,velocity:.8},{step:132,pitch:G.tambourine,velocity:.8},{step:144,pitch:G.tambourine,velocity:.8},{step:168,pitch:G.tambourine,velocity:.8}]},{ranges:[[2,2],[6,6],[22,22],[26,26],[30,30],[34,34],[38,38],[42,42],[46,46],[62,62],[66,66],[70,70],[74,74],[78,78],[82,82],[86,86],[90,90],[94,94],[98,98]],pattern:[{step:0,pitch:G.splashCymbal,velocity:.8}]},{ranges:[[5,5],[45,45]],pattern:[{step:48,pitch:G.tambourine,velocity:.8},{step:84,pitch:56,velocity:.8},{step:132,pitch:G.tambourine,velocity:.8},{step:144,pitch:G.tambourine,velocity:.8}]},{ranges:[[10,10],[50,50]],pattern:[{step:0,pitch:G.tambourine,velocity:.8},{step:0,pitch:G.splashCymbal,velocity:.8}]},{ranges:[[13,13],[53,53]],pattern:[{step:0,pitch:G.tambourine,velocity:.8},{step:84,pitch:56,velocity:.8},{step:96,pitch:G.tambourine,velocity:.8},{step:132,pitch:G.tambourine,velocity:.8},{step:144,pitch:G.tambourine,velocity:.8}]},{ranges:[[14,14],[54,54]],pattern:[{step:0,pitch:G.splashCymbal,velocity:.8},{step:120,pitch:G.tambourine,velocity:.8}]},{ranges:[[18,18],[58,58]],pattern:[{step:0,pitch:G.splashCymbal,velocity:.8},{step:120,pitch:G.tambourine,velocity:.8},{step:168,pitch:G.tambourine,velocity:.8}]},{ranges:[[21,21],[61,61]],pattern:[{step:84,pitch:56,velocity:.8},{step:132,pitch:G.tambourine,velocity:.8},{step:168,pitch:G.tambourine,velocity:.8}]},{ranges:[[25,25],[33,33],[41,41],[65,65],[73,73],[81,81],[89,89],[97,97]],pattern:[{step:48,pitch:G.tambourine,velocity:.8},{step:132,pitch:G.tambourine,velocity:.8},{step:144,pitch:G.tambourine,velocity:.8},{step:168,pitch:G.tambourine,velocity:.8}]},{ranges:[[29,29],[37,37],[69,69],[77,77],[85,85],[93,93],[101,101]],pattern:[{step:48,pitch:G.tambourine,velocity:.8},{step:84,pitch:56,velocity:.8},{step:132,pitch:G.tambourine,velocity:.8},{step:144,pitch:G.tambourine,velocity:.8},{step:168,pitch:G.tambourine,velocity:.8}]}]}},Oc=.0015,kc=.004,Ac=.001,jc=[2,3,4.16,5.43,6.79,8.21],Mc=new WeakMap,Nc=e=>{let t=Mc.get(e);if(!t){let n=e.sampleRate*2;t=e.createBuffer(1,n,e.sampleRate);let r=t.getChannelData(0);for(let e=0;e<n;e++)r[e]=Math.random()*2-1;Mc.set(e,t)}return t},Pc={41:{from:110,to:70,decay:.45},43:{from:130,to:85,decay:.42},45:{from:155,to:100,decay:.4},47:{from:180,to:120,decay:.36},48:{from:210,to:140,decay:.33},50:{from:245,to:165,decay:.3},60:{from:480,to:420,decay:.12},61:{from:360,to:310,decay:.15},62:{from:330,to:300,decay:.08},63:{from:300,to:270,decay:.22},64:{from:210,to:190,decay:.26},65:{from:420,to:380,decay:.2},66:{from:320,to:290,decay:.24}},Fc=(e,t)=>{let n=[],r=(e,t,n,r,i=Oc)=>{let a=t+i+r;return e.gain.setValueAtTime(0,t),e.gain.linearRampToValueAtTime(n,t+i),e.gain.exponentialRampToValueAtTime(n*Ac,a),e.gain.linearRampToValueAtTime(0,a+kc),a+kc},i=(e,t)=>{e.onended=()=>{e.disconnect();for(let e of t)e.disconnect()}},a=(n,a,o,s,c,l,u,d=t)=>{let f=e.createOscillator(),p=e.createGain();f.type=a,f.frequency.setValueAtTime(o,n),s!==o&&f.frequency.exponentialRampToValueAtTime(s,n+c);let m=r(p,n,l,u);return f.connect(p).connect(d),f.start(n),f.stop(m),i(f,[p]),f},o=(n,a,o,s,c,l,u=Oc)=>{let d=e.createBufferSource();d.buffer=Nc(e);let f=e.createBiquadFilter();f.type=a,f.frequency.value=o,f.Q.value=s;let p=e.createGain(),m=r(p,n,c,l,u);return d.connect(f).connect(p).connect(t),d.start(n,Math.random()*1.5),d.stop(m),i(d,[f,p]),p},s=(n,a,o,s,c,l)=>{let u=e.createBiquadFilter();u.type=`bandpass`,u.frequency.value=o,u.Q.value=.8;let d=e.createBiquadFilter();d.type=`highpass`,d.frequency.value=s;let f=e.createGain(),p=r(f,n,c,l);u.connect(d).connect(f).connect(t);let m=jc.map(t=>{let r=e.createOscillator();return r.type=`square`,r.frequency.value=a*t,r.connect(u),r.start(n),r.stop(p),r});return i(m[0],[...m.slice(1),u,d,f]),f},c=e=>{n=n.filter(t=>t.end>e);for(let t of n){if(t.t0>=e)continue;let n=t.g.gain;typeof n.cancelAndHoldAtTime==`function`?n.cancelAndHoldAtTime(e):n.cancelScheduledValues(e),n.linearRampToValueAtTime(0,e+.012)}n=n.filter(t=>t.t0>=e)};return{playDrum:r=>{let i=e.currentTime+Math.max(0,r.when),l=Math.max(1e-4,Math.min(1,r.velocity)),u=r.pitch;switch(u){case 35:case 36:a(i,`sine`,170,48,.07,l*.34,.38),a(i,`triangle`,900,120,.012,l*.12,.012),o(i,`highpass`,3500,.7,l*.05,.008);return;case 38:case 40:{let e=u===40?1.15:1;a(i,`triangle`,240*e,180*e,.03,l*.26,.09),a(i,`sine`,400*e,330*e,.03,l*.1,.05),o(i,`highpass`,1800,.7,l*.26,.16),o(i,`bandpass`,5e3,.9,l*.12,.1);return}case 37:a(i,`triangle`,1650,1500,.01,l*.16,.035),a(i,`sine`,480,440,.01,l*.1,.04),o(i,`bandpass`,3e3,2,l*.08,.02);return;case 39:for(let[e,t]of[[0,.4],[.011,.36],[.023,.32]])o(i+e,`bandpass`,1300,1.4,l*t,.012);o(i+.031,`bandpass`,1300,1.2,l*.32,.16);return;case 42:c(i),s(i,40,1e4,7e3,l*.3,.045),o(i,`highpass`,8e3,.7,l*.05,.035);return;case 44:c(i),s(i,40,9e3,6500,l*.22,.07);return;case 46:{let e=s(i,40,1e4,7e3,l*.26,.42);o(i,`highpass`,8e3,.7,l*.04,.3),n.push({g:e,t0:i,end:i+.45});return}case 49:case 57:s(i,u===57?44:38,8e3,4500,l*.14,1.6),o(i,`highpass`,5500,.7,l*.07,1.3);return;case 52:s(i,34,6e3,3e3,l*.16,1.2),o(i,`bandpass`,4500,.6,l*.07,.9);return;case 55:s(i,48,9e3,6e3,l*.2,.6),o(i,`highpass`,7e3,.7,l*.08,.45);return;case 51:case 59:s(i,u===59?52:48,7e3,5e3,l*.14,.9),a(i,`sine`,3100,3100,0,l*.03,.5);return;case 53:s(i,52,6500,3500,l*.12,.8),a(i,`sine`,1480,1480,0,l*.1,.9),a(i,`sine`,2210,2210,0,l*.06,.6);return;case 56:{let n=e.createBiquadFilter();n.type=`bandpass`,n.frequency.value=900,n.Q.value=1.5,n.connect(t),a(i,`square`,562,562,0,l*.14,.26,n),a(i,`square`,845,845,0,l*.14,.26,n).addEventListener(`ended`,()=>n.disconnect());return}case 54:o(i,`highpass`,7e3,.7,l*.12,.06,.004),s(i,70,9e3,7e3,l*.08,.12);return;case 69:case 70:case 82:o(i,`highpass`,6e3,.7,l*.12,.05,.006);return;case 67:case 68:{let e=u===67?920:690;a(i,`triangle`,e,e,0,l*.14,.18),a(i,`sine`,e*2.66,e*2.66,0,l*.05,.12);return}case 75:a(i,`sine`,2500,2500,0,l*.2,.04);return;case 76:case 77:{let e=u===76?900:700;a(i,`sine`,e,e,0,l*.2,.05),a(i,`triangle`,e*2.3,e*2.3,0,l*.05,.02);return}case 81:a(i,`sine`,5200,5200,0,l*.06,.9),a(i,`sine`,7650,7650,0,l*.03,.6);return;case 80:a(i,`sine`,5200,5200,0,l*.06,.12),a(i,`sine`,7650,7650,0,l*.03,.08);return}let d=Pc[u];if(d){a(i,`sine`,d.from,d.to,d.decay*.6,l*.34,d.decay),o(i,`bandpass`,d.from*8,1,l*.04,.02);return}o(i,`bandpass`,2500,1,l*.1,.05)}}},Ic=e=>pn(e),Lc=(e,t=e.destination,n={})=>{let r=n.wave??`square`,i=n.attack??0,a=n.gain??1,o=e.createDynamicsCompressor();o.threshold.value=-12,o.knee.value=6,o.ratio.value=8,o.attack.value=.003,o.release.value=.15,o.connect(t);let s=t=>{let s=e.createOscillator(),c=e.createGain();s.type=r,s.frequency.value=Ic(t.pitchUnits);let l=e.currentTime+t.when,u=Math.max(1e-4,.06*t.volume*1.5*a),d=u*Ac,f=l+t.duration+kc;if(n.decay)c.gain.setValueAtTime(1e-4,l),c.gain.linearRampToValueAtTime(u,l+Math.max(.003,i)),c.gain.exponentialRampToValueAtTime(d,l+t.duration);else{let e=Math.min(.02,t.duration*.1),n=t.duration-e,r=Math.min(Math.max(i,Oc),n);c.gain.setValueAtTime(1e-4,l),c.gain.linearRampToValueAtTime(u,l+r),c.gain.setValueAtTime(u,l+n),c.gain.exponentialRampToValueAtTime(d,l+t.duration)}c.gain.linearRampToValueAtTime(0,f),s.connect(c);let p=null;typeof e.createStereoPanner==`function`&&t.pan?(p=e.createStereoPanner(),p.pan.value=Math.max(-1,Math.min(1,t.pan)),c.connect(p),p.connect(o)):c.connect(o),s.start(l),s.stop(f),s.onended=()=>{s.disconnect(),c.disconnect(),p&&p.disconnect()}},{playDrum:c}=Fc(e,o);return{playNote:s,playDrum:c}},Rc=192,zc=[`melody`,`submelody`,`bass`,`chord`],Bc=(e,t)=>{let n=t.bpm,r={...ht,...Dc,...pt(t.drumPatterns??{})},i=t.metaDrum??`none`,a=t.metaVolume??t.volume??100,o=t.metaDrumVolume??80,s=[...new Set(e.map(e=>e.trackIndex))].sort((e,t)=>e-t),c=s.map(t=>{let n=0,r=e.filter(e=>e.trackIndex===t).map(e=>({id:n++,startStep:e.startStep,durationSteps:e.durationSteps,pitchUnits:e.pitchUnits,velocity:e.velocity}));return{id:zc[t]??`t${t}`,volume:a,notes:r}}),l=!t.audioContext,u=t.audioContext??new AudioContext,d=t.destination??u.destination,f=t.synth??!t.onPlayNote,p=u.createGain(),m=u.createGain();m.connect(p);let h=u.createDelay(ac/1e3);h.delayTime.value=(t.metaReverbPreDelay??rc)/1e3;let g=u.createConvolver();g.buffer=oc(u,(t.metaReverbDecay??22)/10||$s),g.normalize=!0;let _=u.createGain();_.gain.value=sc(t.metaReverb??0),h.connect(g),g.connect(_),_.connect(p);let v=Ln(u,d),y=(t.metaFadeIn??0)/10,b=(t.metaFadeOut??0)/10;p.connect(yc(u,v.node));let x=new Map,S=e=>{let n=x.get(e);return n||(n=Qt(u,m,{compression:t.trackCompression?.[e]??0,width:t.trackWidth?.[e]??100,eqLow:t.trackEqLow?.[e]??0,eqMid:t.trackEqMid?.[e]??0,eqHigh:t.trackEqHigh?.[e]??0,reverbSend:t.trackReverbSend?.[e]??0,reverbBus:h}),x.set(e,n)),n},C=new Map,w=e=>{let t=C.get(e);return t||(t=Lc(u,S(e).input),C.set(e,t)),t},T=f?Lc(u,m):null,E=new Map;s.forEach(e=>{E.set(zc[e]??`t${e}`,e)});let D=t.pauseWhenHidden??l,O=!1,k=Ec({getTracks:()=>c,getBpm:()=>n,getPlayStartStep:()=>t.startStep??0,getDrumPattern:e=>mt(i,r,e),getSoloTrackId:()=>null,getLoop:()=>t.loop??!1,cues:t.cues,onCue:t.onCue,getAudioTime:()=>u.currentTime,onPlayNote:e=>{if(t.onPlayNote?.(e),!f)return;let n=E.get(e.trackId);(n===void 0?T:w(n))?.playNote(e)},onPlayDrum:e=>{let n=e.velocity*(o/100)*(a/100);t.onPlayDrum?.({...e,velocity:n}),T?.playDrum({...e,velocity:n})},onTick:e=>{t.onTick?.(e)},onEnd:e=>{e&&v.schedule(null),A()},stepsPerBar:Rc}),A=()=>{O&&(O=!1,t.onStop?.())},j=()=>{O&&(document.hidden?u.suspend():u.state===`suspended`&&u.resume())};return D&&typeof document<`u`&&document.addEventListener(`visibilitychange`,j),O=!0,(async()=>{let e=[],n=t.onResumeAudio?.();if(n&&e.push(n),u.state===`suspended`&&e.push(u.resume()),e.length>0&&await Promise.all(e),!O)return;let r=t.startStep??0;k.start(r),v.schedule(Rn({anchor:k.getStartTime(),fadeInSec:y,fadeOutSec:b,atSongStart:r===0,durationSec:k.getEndSec()}))})(),{stop:()=>{O&&(k.stop(),v.schedule(null),A())},isPlaying:()=>O,setVolume:e=>{a=e;for(let t of c)t.volume=e},suspend:()=>u.suspend(),resume:()=>u.resume(),destroy:()=>{k.stop(),O=!1,D&&typeof document<`u`&&document.removeEventListener(`visibilitychange`,j);for(let e of x.values())e.dispose();l&&u.close()}}},Vc=(e,t={})=>{let{placements:n,bpm:r,meta:i}=Qs(e),a=r??t.defaultBpm??120;return Bc(n,{...t,bpm:a,metaVolume:i.volume,metaDrum:i.drum,metaDrumVolume:i.drumVolume,metaReverb:i.reverb,metaReverbDecay:i.reverbDecay,metaReverbPreDelay:i.reverbPreDelay,metaFadeIn:i.fadeIn,metaFadeOut:i.fadeOut,trackCompression:i.trackCompression,trackWidth:i.trackWidth,trackReverbSend:i.trackReverbSend,trackEqLow:i.trackEqLow,trackEqMid:i.trackEqMid,trackEqHigh:i.trackEqHigh})},Hc=e=>{let t=e.audioContext??new AudioContext,n=Lc(t,e.destination??t.destination),r=e.volume??80,i=e.duration??1;n.playNote({trackId:`melody`,pitchUnits:e.pitchUnits,velocity:100,volume:r/100,when:0,duration:i})},Uc=(e,t={})=>{let n=t.bpm??t.defaultBpm??120;return Bc(Pn({chordStr:e,patternType:t.patternType??`block`,rootShift:t.rootShift??0,bpm:n,stepsPerBar:Rc}).map(e=>({trackIndex:3,startStep:e.startStep,durationSteps:e.durationSteps,pitchUnits:e.pitchUnits,velocity:e.velocity})),{...t,bpm:n,metaVolume:t.volume??100})},Wc={play:{d:`M8 5v14l11-7z`},pause:{d:`M6 5h4v14H6zm8 0h4v14h-4z`},stop:{d:`M6 6h12v12H6z`},record:{d:`M12 6a6 6 0 100 12 6 6 0 000-12z`},undo:{d:`M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6`,stroke:!0},redo:{d:`M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6`,stroke:!0},chevronUp:{d:`M5 15l7-7 7 7`,stroke:!0},chevronDown:{d:`M19 9l-7 7-7-7`,stroke:!0},chevronLeft:{d:`M15 19l-7-7 7-7`,stroke:!0},chevronRight:{d:`M9 5l7 7-7 7`,stroke:!0},first:{d:`M18 18l-6-6 6-6M11 18l-6-6 6-6`,stroke:!0},copy:{d:`M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z`,stroke:!0},pen:{d:`M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75 1.84-1.83zM3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z`},eraser:{d:`M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 01-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0zM4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53-4.95-4.95-4.95 4.95z`},select:{d:`M4 7V5a1 1 0 011-1h2M4 17v2a1 1 0 001 1h2M20 7V5a1 1 0 00-1-1h-2M20 17v2a1 1 0 01-1 1h-2M4 11v2M20 11v2M11 4h2M11 20h2`,stroke:!0},settings:{d:`M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z`,stroke:!0},info:{d:`M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z`},help:{d:`M12 2a10 10 0 100 20 10 10 0 000-20zm.07 15.5a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zM13 13.4v.6h-2v-1.2c0-.6.3-1 .8-1.4l.9-.7c.4-.3.6-.6.6-1 0-.7-.5-1.2-1.3-1.2s-1.3.5-1.3 1.3H8.7c0-1.8 1.4-3.1 3.3-3.1s3.3 1.2 3.3 2.9c0 .9-.4 1.5-1.2 2.1l-.7.5c-.3.3-.4.5-.4.8z`},more:{d:`M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z`},loop:{d:`M17 2l4 4-4 4M3 11V9a4 4 0 014-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 01-4 4H3`,stroke:!0}},Y=(e,t=20)=>{let n=Wc[e];return n?`<svg viewBox="0 0 24 24" width="${t}" height="${t}" ${n.stroke?`fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`:`fill="currentColor"`} aria-hidden="true"><path d="${n.d}"/></svg>`:``},Gc=`
<div class="dtm-modal-body-content">
  <h4>1. 音符と休符</h4>
  <p><code>c</code>(ド) <code>d</code>(レ) <code>e</code>(ミ) <code>f</code>(ファ) <code>g</code>(ソ) <code>a</code>(ラ) <code>b</code>(シ) のアルファベットで表します。</p>
  <ul>
    <li>半音上げる: <code>c#</code> または <code>c+</code></li>
    <li>半音下げる: <code>d-</code></li>
    <li>休符: <code>r</code></li>
  </ul>

  <h4>2. 音の長さ</h4>
  <p>音名や休符の後に数値で指定します（例: <code>4</code> = 4分音符, <code>8</code> = 8分音符, <code>16</code> = 16分音符）。</p>
  <ul>
    <li><code>c4</code> : 4分音符のド</li>
    <li><code>r8</code> : 8分休符</li>
    <li><code>c4.</code> : 付点4分音符のド（長さを1.5倍に）</li>
    <li>数値を省略すると、<code>l</code> コマンドで設定されたデフォルト長（通常16分）になります。</li>
  </ul>

  <h4>3. オクターブ（音の高さ）</h4>
  <ul>
    <li><code>o4</code>, <code>o5</code> : 高さを直接指定（ふつうは o4 か o5）</li>
    <li><code>&gt;</code> : 1オクターブ上げる</li>
    <li><code>&lt;</code> : 1オクターブ下げる</li>
  </ul>

  <h4>4. テンポ</h4>
  <ul>
    <li><code>t120</code> : 曲の速さをBPM120に指定。※メロディ（@0）のテンポ指定が曲全体に反映されます。</li>
  </ul>

  <h4>5. 和音</h4>
  <p>音符を <code>'</code> で囲むと同時に発音します（書き出しもこの形です）。</p>
  <pre>例: 'ceg'4 （ド・ミ・ソを4分音符で同時に発音）</pre>
  <p>他のMML環境からの貼り付け用に、<code>[ceg]4</code>（FlMMLの大カッコ）と <code>"ceg"4</code> も同じ和音として読みます。</p>
  <p>囲みの中でオクターブを変えると、離れた高さの音を重ねられます。</p>
  <pre>例: 'o4b o5e a o6c'4 （シ・ミ・ラ・ドを別オクターブで同時に発音）</pre>
  <p style="margin-top:4px;"><small>（囲みの中の <code>o5</code> は次の音にも引き継がれ、囲みを抜けると元のオクターブに戻ります）</small></p>

  <h4>5.5 連符（3連符・5連符）</h4>
  <p>音符を <code>{</code> と <code>}</code> で囲み、後ろに音長を書くと、その長さを中の音符で分け合います（和音と違い、音は順に鳴ります）。</p>
  <pre>例: {ceg}4 （4分音符の長さをド・ミ・ソで3等分＝3連符）
例: {cdefg}4 （4分音符を5等分＝5連符）</pre>
  <p style="margin-top:4px;"><small>（中の音符に音長を書くとその比で分けます。<code>{g2e4e4}2</code> は 2:1:1）</small></p>

  <h4>6. トラックの区切り</h4>
  <p><code>;</code> または <code>@0</code>〜<code>@3</code> でトラックを切り替えます。</p>
  <ul>
    <li><code>@0</code>: メロディ</li>
    <li><code>@1</code>: サブメロ</li>
    <li><code>@2</code>: ベース</li>
    <li><code>@3</code>: 伴奏</li>
  </ul>

  <h4>7. 歌声・歌詞入力</h4>
  <p><code>@@&lt;トラック番号&gt; &lt;音源名&gt; &lt;歌詞&gt;</code> の形式で、音符と同期する歌詞を入力できます。</p>
  <pre>例: @@0 tsukuyomi どんぐりころころどんぐりこ</pre>
  <p style="margin-top:4px;"><small>（音源名は <code>tsukuyomi</code> や <code>klatt</code>, <code>roze</code> などの音声モデルを指定できます）</small></p>
  <p>歌詞は<strong>1文字（拗音は2文字）が音符1つ</strong>に対応します。次の記号だけは特別な意味を持ちます。</p>
  <ul>
    <li><code>ー</code> 伸ばす（言い直さずに音を保ち、音程だけ切り替える）</li>
    <li><code>〜</code> しゃくり（<code>ー</code> と同じだが音程を滑らかに繋ぐ）</li>
    <li><code>っ</code> 詰まる（音符を1つ消費して無音にする）</li>
    <li><code>_</code> 歌わない（音符を1つ消費するが何も鳴らない）</li>
    <li><code>、</code> ブレス（音符は消費せず、直前の音を短くして息継ぎを入れる）</li>
  </ul>
  <pre>あああああ  ← 「あ」を5回言い直す
あーーーー  ← 伸ばしたまま音程だけ動く</pre>
  <p style="margin-top:4px; margin-bottom:16px;"><small>（ひらがな・カタカナと上の記号以外は無視されます）</small></p>

  <h4 style="margin-top: 18px; border-top: 1px solid var(--dtm-border2); padding-top: 8px;">サンプル曲（試聴・コピー）</h4>

  <!-- サンプル1 -->
  <div class="dtm-modal-sample-box">
    <div class="dtm-modal-sample-header">
      <span class="dtm-modal-sample-tag">1. 基本のメロディ</span>
      <button class="dtm-btn dtm-btn--ghost dtm-btn--xs dtm-modal-sample-copy-btn" data-mml="@0 t120 l8 o5 c d e f g a b > c">📋 コピー</button>
    </div>
    <pre style="margin: 0; padding: 6px;">@0 t120 l8 o5 c d e f g a b &gt; c</pre>
    <div class="dtm-modal-sample-desc">
      基本的なメロディの書き方（音名・長さ・オクターブとテンポ）。
    </div>
    <div style="margin-top: 8px;">
      <button class="dtm-btn dtm-btn--primary dtm-btn--xs dtm-modal-sample-play-btn" data-mml="@0 t120 l8 o5 c d e f g a b > c">▶ 試聴</button>
    </div>
    <div class="dtm-modal-sample-player-container"></div>
  </div>

  <!-- サンプル2 -->
  <div class="dtm-modal-sample-box">
    <div class="dtm-modal-sample-header">
      <span class="dtm-modal-sample-tag">2. 複数トラックと和音</span>
      <button class="dtm-btn dtm-btn--ghost dtm-btn--xs dtm-modal-sample-copy-btn" data-mml="@0 t120 o5 c e g2 ; @3 o4 'ceg'2 'ceg'2">📋 コピー</button>
    </div>
    <pre style="margin: 0; padding: 6px;">@0 t120 o5 c e g2 ;
@3 o4 'ceg'2 'ceg'2</pre>
    <div class="dtm-modal-sample-desc">
      ; でトラック（上＝メロディ／下＝伴奏）を分け、'ceg' で和音を鳴らします。
    </div>
    <div style="margin-top: 8px;">
      <button class="dtm-btn dtm-btn--primary dtm-btn--xs dtm-modal-sample-play-btn" data-mml="@0 t120 o5 c e g2 ; @3 o4 'ceg'2 'ceg'2">▶ 試聴</button>
    </div>
    <div class="dtm-modal-sample-player-container"></div>
  </div>

  <!-- サンプル3 -->
  <div class="dtm-modal-sample-box">
    <div class="dtm-modal-sample-header">
      <span class="dtm-modal-sample-tag">3. 歌唱付き (どんぐりころころ)</span>
      <button class="dtm-btn dtm-btn--ghost dtm-btn--xs dtm-modal-sample-copy-btn" data-mml="@0 t120 v100 o4g8 g8 e8 e8 f8 e8 d8 c8 g8 g8 e8 e8 d4.; @@0 tsukuyomi どんぐりころころどんぐりこ;">📋 コピー</button>
    </div>
    <pre style="margin: 0; padding: 6px;">@0 t120 v100 o4g8 g8 e8 e8 f8 e8 d8 c8 g8 g8 e8 e8 d4.;
@@0 tsukuyomi どんぐりころころどんぐりこ;</pre>
    <div class="dtm-modal-sample-desc">
      @@0 tsukuyomi 歌詞... でメロディトラックに歌詞を同期させて歌わせます。※独自拡張
    </div>
    <div style="margin-top: 8px;">
      <button class="dtm-btn dtm-btn--primary dtm-btn--xs dtm-modal-sample-play-btn" data-mml="@0 t120 v100 o4g8 g8 e8 e8 f8 e8 d8 c8 g8 g8 e8 e8 d4.; @@0 tsukuyomi どんぐりころころどんぐりこ;">▶ 試聴</button>
    </div>
    <div class="dtm-modal-sample-player-container"></div>
  </div>
</div>
`,Kc=`dtm-daw-styles`,qc=`
@font-face {
  font-family: 'k8x12';
  src: url('https://db.onlinewebfonts.com/t/777630d46640dc5a928ea833c2fcb875.woff2') format('woff2'),
       url('https://db.onlinewebfonts.com/t/777630d46640dc5a928ea833c2fcb875.woff') format('woff'),
       url('https://db.onlinewebfonts.com/t/777630d46640dc5a928ea833c2fcb875.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* ====================================================
   PIXEL MUSIC STUDIO — ドット絵UIシステム
   PICO-8カラーパレット・美咲フォント・ゲームウィンドウ枠
   ==================================================== */

/* デザイントークンは編集UI本体（.dtm-daw）に加え、その外側に差し込まれる
   コントロールバー（.dtm-controlbar）にも供給する。mountPresetSelect /
   mountModeSwitch のUIは .dtm-daw の兄弟として置かれるため、ここで配らないと
   var(--dtm-*) が解決できず無装飾（白地・既定フォント）になってしまう。
   再生専用ビューのモーダル／利用規約カバー、歌声モデル名の吹き出し(.dtm-player-balloon)
   ガイドツアーの暗幕(.dtm-tour)は document.body 直下へ重ねるため、.dtm-daw の外に出る。
   これらも同様にトークンを供給しないと無装飾（枠線なし・文字色不明の白い箱）になる。 */
.dtm-daw,
.dtm-controlbar,
.dtm-modal-overlay,
.dtm-consent-overlay,
.dtm-chord-player,
.dtm-player-balloon,
.dtm-tour {
  /* PICO-8 16色パレットより */
  --c-black:   #000000;
  --c-navy:    #1d2b53;
  --c-purple:  #7e2553;
  --c-dkgreen: #008751;
  --c-brown:   #ab5236;
  --c-dkgray:  #5f574f;
  --c-gray:    #c2c3c7;
  --c-white:   #fff1e8;
  --c-red:     #ff004d;
  --c-orange:  #ffa300;
  --c-yellow:  #ffec27;
  --c-green:   #00e436;
  --c-cyan:    #29adff;
  --c-lavend:  #83769c;
  --c-pink:    #ff77a8;
  --c-peach:   #ffccaa;

  /* セマンティックトークン */
  --dtm-bg:       var(--c-black);
  --dtm-surface:  var(--c-navy);
  --dtm-deep:     #0a0f1f;
  --dtm-border:   var(--c-cyan);
  --dtm-border2:  var(--c-dkgray);
  --dtm-text:     var(--c-white);
  --dtm-muted:    var(--c-lavend);
  --dtm-primary:  var(--c-cyan);
  --dtm-pfg:      var(--c-black);
  --dtm-danger:   var(--c-red);
  --dtm-success:  var(--c-green);
  --dtm-accent:   var(--c-pink);
  --dtm-gold:     var(--c-yellow);
  --dtm-warn:     var(--c-orange);
  --dtm-tap:      40px;
  --dtm-gap:      6px;
  --dtm-font:     'k8x12',ui-monospace,monospace;
}

.dtm-daw {
  box-sizing: border-box;
  font-family: var(--dtm-font);
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: .06em;
  color: var(--dtm-text);
  background: var(--dtm-bg);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--dtm-gap);
  padding: 0;
  image-rendering: pixelated;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  font-smooth: never;
  -webkit-tap-highlight-color: transparent;
}
.dtm-daw *,
.dtm-daw *::before,
.dtm-daw *::after { box-sizing: border-box; }

/* ─── レイアウト（編集ヘッドの貼り付け） ───────────────────────────
   パネルは縦に積むしかないので、開くほどピアノロールが画面外へ流れていく。
   ヘッド（トランスポート・ツール・ロール）を sticky で画面上部に留めれば、
   何枚開いてもロールとの距離は0のままになる。

   ただし1カラムのあいだ、貼ったヘッドはその高さぶん画面を占有し続ける。
   ヘッドの高さは「固定部およそ194px ＋ ロール32vh」なので、画面が低いほど
   占有率が上がる（844pxで55%、667pxで64%）。占有率が6割を切る縦760px以上で
   だけ貼り、それ未満は従来どおりトランスポートだけを貼る。
   （横に割って縦の取り合いを無くす2カラム案は、デモの #app が max-w-4xl の
   ため今のままだとロールが細くなるので見送っている。） */
.dtm-daw-panels {
  display: flex;
  flex-direction: column;
  gap: var(--dtm-gap);
  min-width: 0;
}
/* 貼らない画面では箱ごと畳む。display:contents なら中身が .dtm-daw の直接の
   子に戻るので、余白もトランスポートの sticky 基準も従来のまま変わらない。 */
.dtm-daw-head { display: contents; }
.dtm-topbar {
  position: sticky;
  top: 0;
  z-index: 20;
}
@media (min-height: 760px) {
  .dtm-daw-head {
    display: flex;
    flex-direction: column;
    gap: var(--dtm-gap);
    min-width: 0;
    position: sticky;
    top: 0;
    z-index: 20;
    /* 下をくぐるパネルを透かさないための不透明な下敷き。
       .dtm-daw の gap ぶんを padding で埋め、隙間から中身を見せない。 */
    background: var(--dtm-bg);
    padding-bottom: var(--dtm-gap);
  }
}

/* エディタ自身が十分に広いときは、ヘッドとパネルを左右に並べて、縦の
   積み上がりを横へ逃がす。こうなるとヘッドはパネルから縦を奪わないので、
   画面の高さに関係なく貼れるし、ロールも広く使える
   （.dtm-daw--wide は daw.ts の ResizeObserver が付ける）。 */
.dtm-daw--wide {
  flex-direction: row;
  align-items: flex-start;
}
.dtm-daw--wide .dtm-daw-head {
  display: flex;
  flex-direction: column;
  gap: var(--dtm-gap);
  min-width: 0;
  flex: 1 1 auto;
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--dtm-bg);
  padding-bottom: 0;
}
.dtm-daw--wide .dtm-daw-panels {
  flex: 0 0 360px;
}
/* 768px 時点の height:420px は max-height:32vh に頭打ちにされていた。
   2カラムでは縦を取り合わないので、その意図どおりの高さを解禁する
   （低い画面では 45vh で頭打ちにして画面を食い潰さないようにする）。 */
.dtm-daw--wide .dtm-roll {
  height: min(420px, 45vh);
  max-height: none;
}

/* ─── ゲームウィンドウ共通枠 ─── */
/* 外枠(黒2px) → 色付き2px border → 内枠(黒inset2px) の3重構造 */
.dtm-win {
  border: 2px solid var(--c-black);
  box-shadow:
    inset 0 0 0 2px var(--c-black),
    0 0 0 2px var(--dtm-primary),
    4px 4px 0 var(--c-black);
  background: var(--dtm-surface);
}

/* ─── 共通ボタン ─── */
.dtm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: var(--dtm-tap);
  min-width: var(--dtm-tap);
  padding: 0 10px;
  border: 2px solid var(--dtm-border2);
  background: var(--dtm-surface);
  color: var(--dtm-text);
  font-family: var(--dtm-font);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: .12em;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  box-shadow: 3px 3px 0 var(--c-black);
  transition: none;
}
.dtm-btn:active  { transform: translate(3px,3px); box-shadow: none; }
.dtm-btn:disabled { opacity: .3; cursor: default; box-shadow: none; }
.dtm-btn--ghost   { background: transparent; border-color: var(--dtm-border2); }
.dtm-btn--primary { border-color: var(--dtm-primary); background: var(--dtm-primary); color: var(--dtm-pfg); }
.dtm-btn--success { border-color: var(--dtm-success); background: var(--dtm-success); color: var(--c-black); }
.dtm-btn--danger  { border-color: var(--dtm-danger);  background: var(--dtm-danger);  color: var(--c-white); }
.dtm-btn--accent  { border-color: var(--dtm-accent);  background: var(--dtm-accent);  color: var(--c-black); }
.dtm-btn--icon    { padding: 0; }

/* ─── アイコンボタン ─── */
.dtm-iconbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--dtm-tap);
  height: var(--dtm-tap);
  flex: 0 0 auto;
  border: 2px solid var(--dtm-border2);
  background: var(--dtm-surface);
  color: var(--dtm-text);
  font-size: 16px;
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--c-black);
}
.dtm-iconbtn:active  { transform: translate(3px,3px); box-shadow: none; }
.dtm-iconbtn:disabled { opacity: .3; cursor: default; box-shadow: none; }

/* ─── トランスポートバー（HUDスタイル） ─── */
.dtm-topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--dtm-gap);
  padding: 6px;
  background: var(--dtm-deep);
  border: 2px solid var(--c-black);
  box-shadow:
    inset 0 0 0 2px var(--c-black),
    0 0 0 2px var(--dtm-success),
    4px 4px 0 var(--c-black);
}
.dtm-topbar-row1 {
  display: flex;
  align-items: center;
  gap: var(--dtm-gap);
  flex-basis: 100%;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.dtm-topbar-row1::-webkit-scrollbar { display: none; }
.dtm-topbar-row1 > * { flex-shrink: 0; }
.dtm-topbar-row1 > .dtm-grow { flex-shrink: 1; }

/* PLAYボタン — ゲームの「決定ボタン」的存在感 */
.dtm-play {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--dtm-tap);
  height: var(--dtm-tap);
  flex: 0 0 auto;
  border: 2px solid var(--c-black);
  background: var(--dtm-success);
  color: var(--c-black);
  cursor: pointer;
  box-shadow: 0 0 0 2px var(--dtm-success), 4px 4px 0 var(--c-black);
}
.dtm-play:active  { transform: translate(4px,4px); box-shadow: none; }
.dtm-play:disabled { opacity: .35; cursor: default; box-shadow: none; }
.dtm-play--stop {
  background: var(--dtm-danger);
  box-shadow: 0 0 0 2px var(--dtm-danger), 4px 4px 0 var(--c-black);
}
.dtm-rec { color: var(--dtm-danger); }

/* BPM — デジタルカウンター風 */
.dtm-label {
  font-family: var(--dtm-font);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .14em;
  color: var(--dtm-muted);
  white-space: nowrap;
}
.dtm-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--dtm-font);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--dtm-muted);
  cursor: pointer;
  user-select: none;
  margin-top: 4px;
}
.dtm-checkbox-label:hover { color: var(--dtm-text); }

/* ─── 作曲するセクションの選択（イントロ・Aメロ…のチェック） ─── */
.dtm-checks {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  align-items: center;
}
.dtm-check {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--dtm-font);
  font-size: 11px;
  color: var(--dtm-muted);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
.dtm-check:hover { color: var(--dtm-text); }
.dtm-check input {
  width: 13px;
  height: 13px;
  accent-color: var(--dtm-success);
  cursor: pointer;
  flex-shrink: 0;
}
.dtm-info-table {
  border-collapse: collapse;
  margin: 6px 0;
  font-size: 11px;
  width: 100%;
}
.dtm-info-table th,
.dtm-info-table td {
  border: 1px solid var(--dtm-border);
  padding: 3px 6px;
  text-align: left;
  white-space: nowrap;
}
.dtm-info-table th { color: var(--dtm-muted); font-weight: normal; }
.dtm-hint {
  font-family: var(--dtm-font);
  font-size: 10px;
  color: var(--dtm-muted);
  white-space: nowrap;
}
.dtm-checkbox-label--sub { margin-left: 20px; font-size: 10px; }
.dtm-checkbox {
  width: 14px;
  height: 14px;
  accent-color: var(--dtm-success);
  cursor: pointer;
  flex-shrink: 0;
}

.dtm-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--dtm-font);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--dtm-muted);
  cursor: pointer;
}
.dtm-toggle input { width: 16px; height: 16px; accent-color: var(--dtm-accent); }

/* ─── ツールドック（装備スロット風） ─── */
.dtm-tooldock {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--dtm-gap);
  padding: 6px;
  background: var(--dtm-deep);
  border: 2px solid var(--c-black);
  box-shadow:
    inset 0 0 0 2px var(--c-black),
    0 0 0 2px var(--dtm-border2),
    4px 4px 0 var(--c-black);
}
.dtm-sep {
  width: 2px; align-self: stretch;
  background: var(--dtm-border2); margin: 2px;
}
.dtm-row .dtm-label[data-dtm] { min-width: 48px; text-align: center; }

/* ─── セグメント（アイテムスロット） ─── */
.dtm-seg {
  display: inline-flex;
  border: 2px solid var(--dtm-border2);
  background: var(--dtm-deep);
  box-shadow: 3px 3px 0 var(--c-black);
}
.dtm-segbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--dtm-tap);
  height: var(--dtm-tap);
  border: none;
  border-right: 2px solid var(--dtm-border2);
  background: transparent;
  color: var(--dtm-muted);
  cursor: pointer;
}
.dtm-segbtn:last-child { border-right: none; }
.dtm-segbtn--active {
  background: var(--dtm-gold);
  color: var(--c-black);
}
.dtm-segbtn:not(.dtm-segbtn--active):active { background: var(--dtm-border2); }

/* ─── フォーム要素 ─── */
.dtm-select, .dtm-input, .dtm-textarea {
  min-height: var(--dtm-tap);
  padding: 4px 8px;
  border: 2px solid var(--dtm-border2);
  background: var(--dtm-deep);
  color: var(--dtm-text);
  font-family: var(--dtm-font);
  font-size: 13px;
  letter-spacing: .06em;
  box-shadow: inset 2px 2px 0 var(--c-black);
}
.dtm-select:focus, .dtm-input:focus, .dtm-textarea:focus {
  outline: none;
  border-color: var(--dtm-primary);
}
.dtm-input--num { width: 64px; text-align: center; font-size: 16px; }
/* 他のコントロールと同じ行に置くプルダウン（楽器・歌唱モデル） */
.dtm-select--half { flex: 1 1 120px; min-width: 0; max-width: 200px; }
.dtm-textarea { width: 100%; min-height: 56px; resize: vertical; line-height: 1.7; }
.dtm-textarea.dtm-grow { width: 0; }
.dtm-range { height: var(--dtm-tap); accent-color: var(--dtm-primary); }
.dtm-range:disabled { opacity: .35; cursor: default; }

/* ─── コントロールバー（楽器プリセット / モード切替などの差し込みUI） ─── */
.dtm-controlbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--dtm-gap);
  padding: 6px 8px;
  background: var(--dtm-deep);
  border: 2px solid var(--c-black);
  box-shadow:
    inset 0 0 0 2px var(--c-black),
    0 0 0 2px var(--dtm-border2),
    4px 4px 0 var(--c-black);
  margin-bottom: var(--dtm-gap);
}
.dtm-controlbar-label {
  font-family: var(--dtm-font);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .14em;
  color: var(--dtm-accent);
  white-space: nowrap;
  flex-shrink: 0;
}
.dtm-controlbar .dtm-select { flex: 1 1 160px; }

/* モード切替（テキスト版セグメント） */
.dtm-modeseg {
  display: inline-flex;
  border: 2px solid var(--dtm-border2);
  box-shadow: 3px 3px 0 var(--c-black);
}
.dtm-modebtn {
  min-height: var(--dtm-tap);
  padding: 0 14px;
  border: none;
  border-right: 2px solid var(--dtm-border2);
  background: var(--dtm-deep);
  color: var(--dtm-muted);
  font-family: var(--dtm-font);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .12em;
  cursor: pointer;
}
.dtm-modebtn:last-child { border-right: none; }
.dtm-modebtn--active { background: var(--dtm-primary); color: var(--dtm-pfg); }
.dtm-modebtn:not(.dtm-modebtn--active):active { background: var(--dtm-border2); }

/* ─── トラックピル（番号ボタン、トランスポートバー2行目） ─── */
.dtm-tracks {
  flex-basis: 100%;
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: flex-end;
}
.dtm-pill {
  --dtm-pill-color: var(--dtm-primary);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  height: 24px;
  padding: 0;
  border: 2px solid var(--c-black);
  background: color-mix(in srgb, var(--dtm-pill-color) 22%, #0e121e);
  color: color-mix(in srgb, var(--c-white) 60%, transparent);
  font-family: var(--dtm-font);
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 1px 1px 0 var(--c-black);
  opacity: 0.55;
  transition: opacity 120ms ease, background 120ms ease, transform 120ms ease;
}
.dtm-pill:hover:not(.dtm-pill--active) {
  opacity: 0.85;
  background: color-mix(in srgb, var(--dtm-pill-color) 45%, #0e121e);
  color: var(--c-white);
}
/* アクティブ選択 = 鮮明なトラック色 + ゴールド枠 + グロー + 上昇立体タブ表現 */
.dtm-pill--active {
  opacity: 1;
  height: 28px;
  background: var(--dtm-pill-color);
  color: #ffffff;
  text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
  border-color: var(--dtm-gold);
  box-shadow:
    0 0 0 1.5px var(--dtm-gold),
    0 0 10px color-mix(in srgb, var(--dtm-pill-color) 70%, transparent),
    2px 2px 0 var(--c-black);
  z-index: 1;
  transform: translateY(-2px);
}
.dtm-pill--active::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 2px;
  right: 2px;
  height: 2px;
  background: #ffffff;
  border-radius: 1px;
  opacity: 0.85;
}
.dtm-pill:not(.dtm-pill--active):active { transform: translate(1px,1px); box-shadow: none; }
/* ボーカルが選択されているトラックのタブに、うっすら声のアイコンを重ねる（背景色・サイズは変えない） */
.dtm-pill--vocal::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--dtm-pill-icon);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
  opacity: 0.4;
  pointer-events: none;
}
.dtm-pill__label {
  position: relative;
  z-index: 1;
}
/* 再生中、実際に発音した瞬間だけ点灯（どのタブが今鳴っているか視覚的に分かるように） */
.dtm-pill--sounding {
  filter: brightness(1.6);
  transition: filter 30ms linear;
}

/* ─── ピアノロール（トラッカー風） ─── */
.dtm-roll-wrap { display: flex; gap: var(--dtm-gap); }
.dtm-roll {
  position: relative;
  flex: 1 1 auto;
  height: 32vh;
  max-height: 32vh;
  background: var(--dtm-deep);
  border: 2px solid var(--c-black);
  box-shadow:
    inset 0 0 0 2px var(--c-black),
    0 0 0 2px var(--dtm-border2),
    4px 4px 0 var(--c-black);
  overflow: hidden;
}
/* カスタム背景画像レイヤー（画像自体を半透明化し、キャンバス側の塗りは維持） */
.dtm-roll::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--dtm-roll-bg-image, none);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: var(--dtm-roll-bg-opacity, 0.4);
  pointer-events: none;
}
.dtm-vscroll {
  position: relative;
  width: 20px;
  background: var(--dtm-deep);
  border: 2px solid var(--dtm-border2);
  cursor: pointer;
  flex: 0 0 auto;
  touch-action: none;
}
.dtm-vscroll-thumb, .dtm-hscroll-thumb {
  position: absolute;
  background: var(--dtm-primary);
  min-width: 20px;
  min-height: 20px;
}
.dtm-vscroll-thumb { left: 0; width: 100%; }
.dtm-hscroll {
  position: relative;
  width: 100%; height: 20px;
  background: var(--dtm-deep);
  border: 2px solid var(--dtm-border2);
  cursor: pointer;
  touch-action: none;
}
.dtm-hscroll-thumb { top: 0; height: 100%; }

/* ─── パネル（RPGダイアログウィンドウ） ─── */
.dtm-panel {
  background: var(--dtm-surface);
  border: 2px solid var(--c-black);
  box-shadow:
    inset 0 0 0 2px var(--c-black),
    0 0 0 2px var(--dtm-primary),
    4px 4px 0 var(--c-black);
  overflow: hidden;
}
.dtm-panel > summary {
  list-style: none;
  cursor: pointer;
  padding: 0 12px;
  font-family: var(--dtm-font);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .14em;
  display: flex;
  align-items: center;
  min-height: var(--dtm-tap);
  background: var(--dtm-deep);
  border-bottom: 2px solid var(--dtm-border2);
  color: var(--dtm-primary);
  gap: 8px;
}
.dtm-panel:not([open]) > summary { border-bottom: none; }
.dtm-panel > summary::-webkit-details-marker { display: none; }
/* 左端ライン（ゲームUIのセクション色分け） */
.dtm-panel > summary::before {
  content: '';
  display: block;
  width: 4px;
  height: 20px;
  background: var(--dtm-accent);
  flex: 0 0 auto;
}
.dtm-panel[open] > summary::before { background: var(--dtm-primary); }
/* 折りたたみ矢印 */
.dtm-panel > summary::after {
  content: "▶";
  margin-left: auto;
  color: var(--dtm-muted);
  font-size: 10px;
}
.dtm-panel[open] > summary::after { content: "▼"; }
.dtm-panel-body { padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 10px; }
.dtm-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.dtm-track-body { display: flex; flex-direction: column; gap: 10px; }

/* ─── 自動作曲パネル（看板機能なので枠と見出しを success 色で差別化する） ─── */
.dtm-panel--compose {
  box-shadow:
    inset 0 0 0 2px var(--c-black),
    0 0 0 2px var(--dtm-success),
    4px 4px 0 var(--c-black);
}
.dtm-panel--compose > summary { color: var(--dtm-success); }
.dtm-panel--compose > summary::before,
.dtm-panel--compose[open] > summary::before {
  background: var(--dtm-success);
}

/* ─── アクティブトラック色（個別トラック設定パネルの左端ライン） ─── */
.dtm-panel--track > summary::before,
.dtm-panel--track[open] > summary::before {
  background: var(--dtm-track-color, var(--dtm-primary));
}

/* ─── MML出力（CRTターミナル） ─── */
.dtm-output {
  background: var(--c-black);
  color: var(--dtm-success);
  border: 2px solid var(--dtm-success);
  padding: 10px;
  box-shadow: 0 0 0 2px var(--c-black), 4px 4px 0 var(--c-black);
}
.dtm-output::before {
  content: "C:\\> MML OUTPUT";
  display: block;
  font-size: 11px;
  color: var(--dtm-muted);
  letter-spacing: .14em;
  margin-bottom: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--dtm-border2);
}
.dtm-output pre {
  margin: 0;
  background: transparent;
  padding: 0;
  overflow-x: auto;
  font-family: var(--dtm-font);
  font-size: 12px;
  line-height: 1.8;
  color: var(--dtm-success);
}
.dtm-output-label {
  font-size: 11px;
  color: var(--dtm-muted);
  font-family: var(--dtm-font);
  margin-top: 10px;
}
.dtm-output-label:first-of-type {
  margin-top: 0;
}
.dtm-output-row { display: flex; gap: 8px; align-items: flex-start; margin-top: 6px; }
.dtm-output-row pre { flex: 1; }
.dtm-output-scroll { max-height: 240px; overflow-y: auto; }

/* ─── ローディングオーバーレイ ─── */
.dtm-overlay {
  position: absolute; inset: 0; z-index: 10;
  background: rgba(0,0,0,.92);
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 14px;
  pointer-events: auto;
  cursor: wait;
}
.dtm-overlay[hidden] { display: none; }
.dtm-overlay::before {
  content: 'ロード中';
  font-family: var(--dtm-font);
  font-size: 13px;
  color: var(--dtm-primary);
  text-transform: uppercase;
  letter-spacing: .25em;
  animation: dtm-blink 1s steps(1) infinite;
}
/* 8ブロック刻みで埋まるピクセルバー */
.dtm-spinner {
  width: 96px; height: 12px;
  position: relative;
  background: var(--c-navy);
  border: 2px solid var(--dtm-primary);
  box-shadow: 0 0 0 2px var(--c-black), 4px 4px 0 var(--c-black);
}
.dtm-spinner::after {
  content: '';
  position: absolute;
  left: 0; top: 0; height: 100%;
  background: var(--dtm-primary);
  animation: dtm-load 1.6s steps(8) infinite;
}
@keyframes dtm-load { 0%{width:0} 100%{width:100%} }
/* 進捗が確定したら無限ループ演出を止め、実測値で塗りつぶす */
.dtm-spinner--determinate::after { display: none; }
.dtm-spinner-fill {
  position: absolute;
  left: 0; top: 0; height: 100%;
  width: 0;
  background: var(--dtm-primary);
  transition: width .12s steps(8);
}
.dtm-loading-label {
  font-family: var(--dtm-font);
  font-size: 11px;
  color: var(--dtm-primary);
  letter-spacing: .15em;
  min-height: 1em;
}
.dtm-overlay-skip-btn {
  margin-top: 12px;
  min-height: 32px;
  font-size: 11px;
  font-family: var(--dtm-font);
  padding: 0 12px;
  background: var(--dtm-surface);
  border: 2px solid var(--dtm-border2);
  color: var(--dtm-muted);
  box-shadow: 2px 2px 0 var(--c-black);
  cursor: pointer;
  pointer-events: auto;
}
.dtm-overlay-skip-btn:hover {
  color: var(--dtm-text);
  border-color: var(--dtm-primary);
}
.dtm-overlay-skip-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
.dtm-overlay-skip-btn:disabled {
  opacity: .3;
  cursor: default;
  box-shadow: none;
  transform: none;
}
.dtm-topbar-loading {
  display: none;
  font-family: var(--dtm-font);
  font-size: 11px;
  color: var(--dtm-primary);
  margin-left: 12px;
  letter-spacing: .15em;
  align-self: center;
}
.dtm-topbar.is-loading .dtm-topbar-loading {
  display: inline-block;
}
.dtm-topbar.is-loading {
  pointer-events: none;
  opacity: 0.7;
}

@keyframes dtm-blink { 0%,100%{opacity:1} 50%{opacity:0} }
.dtm-blink { animation: dtm-blink 1s steps(1) infinite; }

/* ─── 音割れ検知バッジ ─── クリップ発生中だけ表示される警告ボタン。クリックで消せる。 */
.dtm-clip-badge {
  flex: 0 0 auto;
  min-height: 24px;
  padding: 0 8px;
  border: 2px solid var(--c-black);
  background: var(--dtm-danger);
  color: var(--c-white);
  font-family: var(--dtm-font);
  font-size: 10px;
  letter-spacing: .1em;
  cursor: pointer;
  box-shadow: 0 0 0 2px var(--dtm-danger), 2px 2px 0 var(--c-black);
  animation: dtm-blink .5s steps(1) infinite;
}
.dtm-clip-badge:active { transform: translate(2px,2px); box-shadow: none; }

/* ─── インフォボタン ─── */
.dtm-infobtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  border: 2px solid var(--dtm-border2);
  background: var(--dtm-surface);
  color: var(--dtm-muted);
  cursor: pointer;
  box-shadow: 1px 1px 0 var(--c-black);
  padding: 0;
  margin: 0;
}
.dtm-infobtn:hover {
  color: var(--dtm-primary);
  border-color: var(--dtm-primary);
}
.dtm-infobtn:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}

/* ─── 解説モーダル ─── */
.dtm-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  backdrop-filter: blur(2px);
  /* body直下に重ねた場合（再生専用ビュー）でも文字色・フォントが
     .dtm-daw から継承できないため、ここで明示する。 */
  color: var(--dtm-text);
  font-family: var(--dtm-font);
}
.dtm-modal-overlay[hidden] {
  display: none !important;
}

/* ─── 利用規約同意カバー ─── */
.dtm-consent-overlay {
  position: fixed;
  inset: 0;
  z-index: 10100;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  backdrop-filter: blur(2px);
  /* body直下に重ねるため .dtm-daw から継承できない文字色・フォントを明示。 */
  color: var(--dtm-text);
  font-family: var(--dtm-font);
}
.dtm-consent-overlay[hidden] {
  display: none !important;
}
.dtm-consent-modal {
  max-width: 450px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: var(--dtm-surface);
  border: 2px solid var(--c-black);
  box-shadow:
    inset 0 0 0 2px var(--c-black),
    0 0 0 2px var(--dtm-primary),
    4px 4px 0 var(--c-black);
  overflow-y: auto;
}
.dtm-consent-header {
  background: var(--dtm-deep);
  color: var(--dtm-text);
  padding: 8px 12px;
  border-bottom: 2px solid var(--c-black);
  font-weight: bold;
  text-align: center;
  font-size: 14px;
}
.dtm-consent-body {
  padding: 12px 16px;
  font-size: 13px;
  line-height: 1.6;
}
.dtm-consent-body a {
  color: var(--dtm-primary);
  text-decoration: underline;
}
.dtm-consent-body a:hover {
  color: var(--dtm-accent);
}
.dtm-consent-footer {
  padding: 8px;
  border-top: 2px solid var(--c-black);
  background: var(--dtm-deep);
  display: flex;
  justify-content: center;
}

.dtm-confirm-footer {
  padding: 8px 12px;
  border-top: 2px solid var(--c-black);
  background: var(--dtm-deep);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.dtm-modal {
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: var(--dtm-surface);
  border: 2px solid var(--c-black);
  box-shadow:
    inset 0 0 0 2px var(--c-black),
    0 0 0 2px var(--dtm-primary),
    4px 4px 0 var(--c-black);
  overflow: hidden;
}
.dtm-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--dtm-deep);
  padding: 8px 12px;
  border-bottom: 2px solid var(--c-black);
}
.dtm-modal-title {
  font-family: var(--dtm-font);
  font-size: 14px;
  color: var(--dtm-gold);
  font-weight: bold;
}
.dtm-modal-close {
  background: transparent;
  border: none;
  color: var(--dtm-text);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.dtm-modal-close:hover {
  color: var(--dtm-danger);
}
.dtm-modal-body {
  padding: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 13px;
  line-height: 1.6;
}
.dtm-modal-body * {
  max-width: 100%;
  box-sizing: border-box;
}
.dtm-modal-body a {
  color: var(--dtm-primary);
  text-decoration: underline;
}
.dtm-modal-body a:hover {
  color: var(--dtm-accent);
}
.dtm-modal-body h4 {
  margin: 12px 0 6px 0;
  color: var(--dtm-primary);
  font-size: 13px;
}
.dtm-modal-body h4:first-child {
  margin-top: 0;
}
.dtm-modal-body p {
  margin: 0 0 8px 0;
}
.dtm-modal-body ul {
  margin: 0 0 8px 0;
  padding-left: 16px;
}
.dtm-modal-body li {
  margin-bottom: 4px;
}
.dtm-modal-body code {
  background: var(--dtm-deep);
  color: var(--dtm-accent);
  padding: 1px 4px;
  font-family: var(--dtm-font);
  font-size: 12px;
}
.dtm-modal-body pre {
  background: var(--dtm-deep);
  color: var(--dtm-success);
  padding: 8px;
  border: 1px solid var(--dtm-border2);
  margin: 6px 0;
  overflow-x: auto;
  font-family: var(--dtm-font);
  font-size: 12px;
}

.dtm-modal-sample-box {
  background: var(--dtm-deep);
  border: 1px solid var(--dtm-border2);
  border-radius: 4px;
  padding: 8px 10px;
  margin-bottom: 12px;
}
.dtm-modal-sample-box:last-child {
  margin-bottom: 0;
}
.dtm-modal-sample-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.dtm-modal-sample-tag {
  font-family: var(--dtm-font);
  font-size: 11px;
  font-weight: bold;
  color: var(--dtm-accent);
}
.dtm-modal-sample-desc {
  margin: 6px 0 0 0;
  font-size: 11px;
  color: var(--dtm-muted);
}
.dtm-modal-sample-player-container {
  margin-top: 8px;
}
.dtm-modal-sample-player-container:empty {
  margin-top: 0;
}
.dtm-modal-sample-player-container .dtm-player {
  border: 1px solid var(--dtm-border2);
  box-shadow: none;
  background: rgba(0, 0, 0, 0.3);
}
.dtm-modal-sample-player-container .dtm-player-body {
  max-height: 100px;
  overflow-y: auto;
}

/* ─── ガイドツアー（スポットライト型ウォークスルー） ─── */
/* 暗幕は .dtm-tour-spot の巨大な box-shadow で描く。box-shadow は当たり判定を
   持たないので、素通りを防ぐ遮蔽は .dtm-tour（全画面）側が担当する。 */
.dtm-tour {
  position: fixed;
  inset: 0;
  z-index: 10050;
  color: var(--dtm-text);
  font-family: var(--dtm-font);
  font-size: 13px;
  line-height: 1.6;
  letter-spacing: .04em;
  -webkit-font-smoothing: none;
  font-smooth: never;
  -webkit-tap-highlight-color: transparent;
}
.dtm-tour * { box-sizing: border-box; max-width: 100%; }
.dtm-tour-spot {
  position: fixed;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  border: 2px solid var(--dtm-gold);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.74);
  transition: left .18s ease, top .18s ease, width .18s ease, height .18s ease;
}
.dtm-tour-bubble {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  background: var(--dtm-surface);
  border: 2px solid var(--c-black);
  box-shadow:
    inset 0 0 0 2px var(--c-black),
    0 0 0 2px var(--dtm-primary),
    4px 4px 0 var(--c-black);
  transition: left .18s ease, top .18s ease;
}
.dtm-tour-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--dtm-deep);
  padding: 4px 8px;
  border-bottom: 2px solid var(--c-black);
}
.dtm-tour-progress {
  font-size: 11px;
  color: var(--dtm-muted);
}
.dtm-tour-close {
  background: transparent;
  border: none;
  color: var(--dtm-text);
  font-size: 18px;
  line-height: 1;
  padding: 0 2px;
  cursor: pointer;
}
.dtm-tour-close:hover { color: var(--dtm-danger); }
.dtm-tour-title {
  padding: 8px 10px 0;
  color: var(--dtm-gold);
  font-size: 14px;
  font-weight: bold;
}
.dtm-tour-body {
  padding: 6px 10px 8px;
  max-height: 40vh;
  overflow-y: auto;
}
.dtm-tour-body p { margin: 0 0 6px; }
.dtm-tour-body p:last-child { margin-bottom: 0; }
.dtm-tour-body ul { margin: 0 0 6px; padding-left: 16px; }
.dtm-tour-body li { margin-bottom: 3px; }
.dtm-tour-body b { color: var(--dtm-primary); }
.dtm-tour-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-top: 2px solid var(--c-black);
  background: var(--dtm-deep);
}
.dtm-tour-spacer { flex: 1; }
.dtm-tour-btn {
  min-height: 32px;
  padding: 0 10px;
  border: 2px solid var(--dtm-border2);
  background: var(--dtm-surface);
  color: var(--dtm-text);
  font-family: var(--dtm-font);
  font-size: 12px;
  letter-spacing: .04em;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--c-black);
}
.dtm-tour-btn:active { transform: translate(2px, 2px); box-shadow: none; }
.dtm-tour-btn--ghost { background: transparent; }
.dtm-tour-btn--primary {
  border-color: var(--dtm-primary);
  background: var(--dtm-primary);
  color: var(--dtm-pfg);
}

/* 目的別の分岐（ツアー冒頭の「何をしてみたい？」）。 */
.dtm-tour-branches {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}
.dtm-tour-branch {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  min-height: var(--dtm-tap);
  padding: 6px 10px;
  border: 2px solid var(--dtm-primary);
  background: var(--dtm-surface);
  color: var(--dtm-text);
  font-family: var(--dtm-font);
  font-size: 13px;
  letter-spacing: .04em;
  text-align: left;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--c-black);
}
.dtm-tour-branch:active { transform: translate(2px, 2px); box-shadow: none; }
.dtm-tour-branch-label { color: var(--dtm-primary); }
.dtm-tour-branch-hint { font-size: 11px; color: var(--dtm-muted); }

/* ─── ヘルプのハブ（「?」ボタンのモーダル） ─── */
.dtm-help-goals {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 6px 0 4px;
}
/* 目的ボタンは見出しと補足の2段組みにする。.dtm-btn は1行前提の
   inline-flex なので、ここだけ縦並び・左寄せ・高さ自動に上書きする。 */
.dtm-help-goals .dtm-btn {
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  width: 100%;
  height: auto;
  padding: 6px 10px;
  text-align: left;
  white-space: normal;
}
.dtm-help-goals .dtm-btn small {
  font-size: 11px;
  opacity: .8;
  font-weight: normal;
}
.dtm-help-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}
.dtm-help-topics .dtm-btn {
  min-height: 32px;
  padding: 0 8px;
  font-size: 12px;
}

.dtm-hidden { display: none !important; }
/* 読込時の警告お知らせ（例: シンプルモードでのトラック合算）。 */
.dtm-load-note {
  margin: 6px 0 0;
  padding: 0 2px;
  font-family: var(--dtm-font);
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: .04em;
  color: var(--dtm-warn); /* 警告色（オレンジ） */
  font-weight: bold;
  opacity: 1.0;
}
.dtm-load-note::before { content: "⚠ "; }
/* 伴奏音源（mp3/wav/YouTube）の状態表示。読み込み結果の報告なので警告色にはしない。 */
.dtm-audio-note {
  margin: 6px 0 0;
  padding: 0 2px;
  font-family: var(--dtm-font);
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: .04em;
  color: var(--dtm-muted);
}
.dtm-audio-note--warn { color: var(--dtm-warn); font-weight: bold; }
/* YouTubeプレイヤーの枠。APIが中の要素を iframe へ差し替えるので、枠側で寸法を決める。 */
.dtm-audio-yt { width: 100%; max-width: 320px; aspect-ratio: 16 / 9; }
.dtm-audio-yt iframe { display: block; width: 100%; height: 100%; border: 0; }
.dtm-grow { flex: 1 1 auto; }
.dtm-lyric-icon {
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  image-rendering: pixelated;
}
/* 歌詞トラックの「詳細設定」— 常用しないパラメータ（オクターブ/定位/リバーブ送り/
   ジェンダー/ブレシネス/ビブラート）を畳んでおく軽量な details。dtm-panel ほど
   仰々しくせず、小さい▶マーカーだけ付ける（仕切り線は高さを食うので置かない）。 */
.dtm-advanced {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dtm-advanced > summary {
  list-style: none;
  cursor: pointer;
  font-size: 11px;
  letter-spacing: .08em;
  color: var(--dtm-text);
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 0 8px;
  border: 2px solid var(--dtm-border2);
  background: var(--dtm-deep);
  box-shadow: 2px 2px 0 var(--c-black);
  width: fit-content;
}
.dtm-advanced > summary:active { transform: translate(2px,2px); box-shadow: none; }
.dtm-advanced > summary::-webkit-details-marker { display: none; }
.dtm-advanced > summary::before { content: "▶"; font-size: 9px; color: var(--dtm-accent); }
.dtm-advanced[open] > summary::before { content: "▼"; }
.dtm-advanced[open] > summary { border-color: var(--dtm-primary); color: var(--dtm-primary); }

/* ─── 広幅拡張 ─── */
@media (min-width: 768px) {
  .dtm-daw { gap: 8px; padding: 10px; }
  .dtm-roll { height: 420px; }
}

/* ====================================================
   MML PLAYER — 再生専用ビュー（mountMmlPlayer）
   ==================================================== */
.dtm-player {
  display: flex;
  flex-direction: column;
  gap: var(--dtm-gap);
  padding: var(--dtm-gap);
  background: var(--dtm-deep);
  border: 2px solid var(--dtm-border2);
  box-shadow: 4px 4px 0 var(--c-black);
}
.dtm-player-message {
  padding: 4px 8px;
  background: var(--c-purple);
  color: var(--c-yellow);
  font-size: 11px;
  border: 2px solid var(--c-black);
  box-shadow: inset 0 -2px 0 rgba(0,0,0,0.2);
  font-family: var(--dtm-font);
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}
.dtm-player-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.dtm-player-play {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dtm-primary);
  color: var(--dtm-pfg);
  border: 2px solid var(--c-black);
  box-shadow: 2px 2px 0 var(--c-black);
  cursor: pointer;
  padding: 0;
}
.dtm-player-play:active { transform: translate(2px, 2px); box-shadow: none; }
.dtm-player-play--stop { background: var(--dtm-danger); }
.dtm-player-play:disabled { opacity: 0.4; cursor: default; }
.dtm-player-loop {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 2px solid var(--dtm-border2);
  background: var(--dtm-bg);
  color: var(--dtm-muted);
  cursor: pointer;
  flex: 0 0 auto;
}
.dtm-player-loop:active { transform: translate(1px, 1px); }
.dtm-player-loop--on {
  border-color: var(--c-black);
  background: var(--dtm-gold);
  color: var(--c-black);
  box-shadow: 2px 2px 0 var(--c-black);
}
.dtm-player-loop:disabled { opacity: 0.4; cursor: default; }
.dtm-player-beat-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.dtm-player-beat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dtm-border2);
  transition: background 0.06s;
}
.dtm-player-beat-dot--on { background: var(--dtm-primary); }
.dtm-player-bar {
  font-family: 'k8x12', monospace;
  font-size: 11px;
  color: var(--dtm-text);
  min-width: 2em;
  margin-left: 4px;
}
.dtm-player-chord {
  font-family: 'k8x12', monospace;
  font-size: 11px;
  color: var(--dtm-accent);
  min-width: 4em;
  margin-left: 8px;
  font-weight: bold;
}
.dtm-player-seek-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dtm-player-seek {
  --fill: 0%;
  flex: 1 1 auto;
  min-width: 0;
  height: 12px;
  margin: 0;
  background: transparent;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}
.dtm-player-seek:disabled { cursor: default; opacity: 0.4; }
/* 再生済み区間をYouTube風に色塗りする（--fill は再生位置に応じてJSから設定） */
.dtm-player-seek::-webkit-slider-runnable-track {
  height: 6px;
  background: linear-gradient(
    to right,
    var(--dtm-primary) var(--fill),
    var(--dtm-border2) var(--fill)
  );
  border: 2px solid var(--c-black);
}
.dtm-player-seek::-moz-range-track {
  height: 6px;
  background: var(--dtm-border2);
  border: 2px solid var(--c-black);
}
.dtm-player-seek::-moz-range-progress {
  height: 6px;
  background: var(--dtm-primary);
  border: 2px solid var(--c-black);
  border-right: none;
}
.dtm-player-seek::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 16px;
  margin-top: -7px;
  background: var(--dtm-primary);
  border: 2px solid var(--c-black);
  box-shadow: 2px 2px 0 var(--c-black);
  cursor: pointer;
}
.dtm-player-seek::-moz-range-thumb {
  width: 12px;
  height: 16px;
  background: var(--dtm-primary);
  border: 2px solid var(--c-black);
  box-shadow: 2px 2px 0 var(--c-black);
  cursor: pointer;
  border-radius: 0;
}
.dtm-player-time {
  flex: 0 0 auto;
  font-family: 'k8x12', monospace;
  font-size: 11px;
  color: var(--dtm-text);
  white-space: nowrap;
}
.dtm-player-dots {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
}
.dtm-player-dot { width: 8px; height: 8px; display: inline-block; }
.dtm-player-mml-header {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}
.dtm-player-mml-link {
  font-family: 'k8x12', monospace;
  font-size: 10px;
  color: var(--dtm-muted);
  text-decoration: none;
  white-space: nowrap;
}
.dtm-player-mml-link:hover { color: var(--dtm-primary); }
.dtm-player-more-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.dtm-player-more-btn {
  background: transparent;
  border: none;
  color: var(--dtm-muted);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  transition: color 0.15s, background-color 0.15s;
}
.dtm-player-more-btn:hover,
.dtm-player-more-btn.is-active {
  color: var(--dtm-text);
  background: var(--dtm-border2);
}
.dtm-player-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--dtm-deep);
  border: 2px solid var(--dtm-border2);
  box-shadow: 4px 4px 0 var(--c-black);
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding: 4px 0;
  min-width: 130px;
  font-family: var(--dtm-font);
}
.dtm-player-menu-item {
  background: transparent;
  border: none;
  color: var(--dtm-text);
  padding: 6px 12px;
  text-align: left;
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.1s, color 0.1s;
}
.dtm-player-menu-item:hover {
  background: var(--dtm-primary);
  color: var(--dtm-pfg);
}
.dtm-player-emoji {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 18px;
  line-height: 1;
  user-select: none;
}
.dtm-player-balloon {
  /* body 直下に生成され、JS(positionBalloon)が毎回 left/top をアンカーの画面座標で
     設定する。overflow:hidden な祖先（投稿カード等）にクリップされないよう fixed で浮かせる。
     top はアンカー上端-6px、transform で自身の左下角をその点に合わせる。 */
  position: fixed;
  left: 0;
  top: 0;
  transform: translate(-50%, -100%);
  z-index: 1000;
  display: none;
  pointer-events: none;
  font-family: var(--dtm-font);
  font-size: 9px;
  color: var(--c-black);
  background: var(--c-white);
  border: 2px solid var(--c-black);
  padding: 2px 4px;
  white-space: nowrap;
  box-shadow: 2px 2px 0 var(--c-black);
}
.dtm-player-balloon::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: var(--c-white);
  border-right: 2px solid var(--c-black);
  border-bottom: 2px solid var(--c-black);
}
/* アイコンが画面上端に近く上に出す余白が無い場合は下に反転表示する（positionBalloon が付与） */
.dtm-player-balloon--below {
  transform: translate(-50%, 0);
}
.dtm-player-balloon--below::after {
  bottom: auto;
  top: -6px;
  border-right: none;
  border-bottom: none;
  border-left: 2px solid var(--c-black);
  border-top: 2px solid var(--c-black);
}
.dtm-player-balloon--visible {
  display: block;
  animation: dtm-balloon-fade-in 0.1s steps(2);
}
.dtm-player-balloon--below.dtm-player-balloon--visible {
  animation-name: dtm-balloon-fade-in-below;
}
@keyframes dtm-balloon-fade-in {
  from { opacity: 0; transform: translate(-50%, -100%) translateY(4px); }
  to { opacity: 1; transform: translate(-50%, -100%) translateY(0); }
}
@keyframes dtm-balloon-fade-in-below {
  from { opacity: 0; transform: translate(-50%, 0) translateY(-4px); }
  to { opacity: 1; transform: translate(-50%, 0) translateY(0); }
}
@keyframes dtm-emoji-jump {
  0%   { transform: translateY(0); }
  35%  { transform: translateY(-5px); }
  65%  { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}
.dtm-player-emoji--jump {
  animation: dtm-emoji-jump 0.18s ease-out forwards;
}
.dtm-player-chip {
  font-family: 'k8x12', monospace;
  font-size: 9px;
  color: var(--dtm-text);
  background: var(--dtm-border2);
  padding: 2px 6px;
  white-space: nowrap;
}
.dtm-player-body {
  position: relative; /* ローディングオーバーレイの基準。レーン群だけを覆う */
  display: flex;
  flex-direction: column;
  gap: var(--dtm-gap);
}
.dtm-player-lane-row {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 6px;
}
.dtm-player-lane-label {
  position: relative;
  flex: 0 0 auto;
  width: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.dtm-player-lane-label--btn {
  cursor: pointer;
  user-select: none;
}
.dtm-player-lane-label--btn:hover { opacity: 0.7; }
.dtm-player-lane-label--muted { opacity: 0.3; }

/* ─── ミュート表示（排他同期） ─── */
.dtm-player-emoji.is-muted,
.dtm-player-lane-label.is-muted {
  position: relative;
}

/* ミュート時の「×」マーク重ね描き */
.dtm-player-emoji.is-muted::before,
.dtm-player-lane-label.is-muted::before {
  content: "×";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dtm-danger);
  font-family: var(--dtm-font);
  font-size: 16px;
  font-weight: bold;
  z-index: 10;
  pointer-events: none;
  text-shadow: 1px 1px 0 var(--c-black);
}

.dtm-player-lane-label.is-muted::before {
  font-size: 14px;
}

/* ミュート時のアイコンや要素の薄暗化（吹き出しは除外） */
.dtm-player-emoji.is-muted > img,
.dtm-player-emoji.is-muted > span:not(.dtm-player-balloon) {
  opacity: 0.25;
  filter: grayscale(80%);
}

.dtm-player-lane-label.is-muted {
  opacity: 0.25;
}

/* ミュート時のトラックレーン（スクロール部）の薄暗化とデカ×マーク（色弱対応） */
.dtm-player-lane-row.is-muted::after {
  content: "×";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 22px; /* label width (16px) + gap (6px) */
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dtm-danger);
  font-family: var(--dtm-font);
  font-size: 24px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.45);
  z-index: 10;
  pointer-events: none;
  text-shadow: 1px 1px 0 var(--c-black);
}
.dtm-player-lane-no {
  font-family: 'k8x12', monospace;
  font-size: 9px;
  color: var(--dtm-muted);
}
.dtm-player-lane {
  position: relative; /* トークンの offsetParent をレーンに固定し、中央寄せ計算を正す */
  flex: 1 1 auto;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  background: var(--c-black);
  border: none;
  padding: 0 6px;
  scrollbar-width: none;
  display: flex;
  align-items: center;
}
.dtm-player-lane::-webkit-scrollbar { display: none; }
.dtm-tk {
  font-family: 'k8x12', monospace;
  font-size: 12px;
  color: var(--dtm-text);
  flex: 0 0 auto;
}
.dtm-tk--rest { color: var(--dtm-muted); }
.dtm-tk--octave,
.dtm-tk--shift,
.dtm-tk--length,
.dtm-tk--ctrl { color: var(--dtm-border2); }
.dtm-tk--lyric { color: var(--dtm-text); letter-spacing: 1px; }
/* 継続（ー / 〜）は「言い直さない」音。かなより淡くして音節の切れ目を目で追えるようにする */
.dtm-tk--lyric-tie { color: var(--dtm-muted); }
/* 促音（っ）・休符（_）は歌わないノート。さらに落として無音であることを示す */
.dtm-tk--lyric-stop,
.dtm-tk--lyric-rest { color: var(--dtm-border2); }
/* 語り（「…」）は歌わずに読み上げる 1 ノート。歌詞と区別できるよう強調色にする */
.dtm-tk--lyric-speak { color: var(--dtm-primary); letter-spacing: 0; }
.dtm-tk--break { color: var(--dtm-muted); opacity: 0.7; margin: 0 2px; }
.dtm-tk--meta { color: var(--dtm-border2); margin-right: 4px; }
.dtm-tk.is-active {
  background: var(--tk, var(--dtm-primary));
  color: var(--c-black);
  font-weight: bold;
}

/* ─── コード進行プレイヤー ─── */
/* MML再生専用プレイヤー（.dtm-player）と枠デザインを揃える */
.dtm-chord-player {
  display: flex;
  flex-direction: column;
  gap: var(--dtm-gap);
  padding: var(--dtm-gap);
  font-family: var(--dtm-font);
  font-size: 13px;
  letter-spacing: .06em;
  color: var(--dtm-text);
  background: var(--dtm-deep);
  border: 2px solid var(--dtm-border2);
  box-shadow: 4px 4px 0 var(--c-black);
  image-rendering: pixelated;
  -webkit-font-smoothing: none;
}
.dtm-chord-player *,
.dtm-chord-player *::before,
.dtm-chord-player *::after { box-sizing: border-box; }

/* コントロールバー — MML再生専用プレイヤーの .dtm-player-head と揃える */
.dtm-cp-ctrl {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.dtm-cp-ctrl .dtm-player-more-container {
  margin-left: auto;
}

/* ループ切替ボタン */
.dtm-cp-loop {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 2px solid var(--dtm-border2);
  background: var(--dtm-bg);
  color: var(--dtm-muted);
  cursor: pointer;
  flex: 0 0 auto;
}
.dtm-cp-loop:active { transform: translate(1px,1px); }
.dtm-cp-loop--on {
  border-color: var(--c-black);
  background: var(--dtm-gold);
  color: var(--c-black);
  box-shadow: 2px 2px 0 var(--c-black);
}

/* メタ情報 (BPM) */
.dtm-cp-meta {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--dtm-muted);
}

/* スクロールエリア */
.dtm-cp-scroll {
  position: relative;
  max-height: 180px;
  overflow-y: auto;
  padding: 8px 10px 10px;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.dtm-cp-scroll::-webkit-scrollbar { display: none; }

/* セクション見出し — セクション色の帯とピクセルマーカー */
.dtm-cp-section {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .14em;
  margin-top: 8px;
  padding: 1px 8px 1px 5px;
  color: var(--cp-fg, var(--dtm-text));
  border-left: 4px solid var(--cp-fg, var(--dtm-text));
  background: linear-gradient(90deg, var(--cp-bg, transparent), transparent);
  align-self: flex-start;
}
.dtm-cp-section::before {
  content: "■";
  margin-right: 5px;
}

/* 小節行 */
.dtm-cp-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 2px;
}

/* 小節区切りパイプ */
.dtm-cp-pipe {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  font-family: var(--dtm-font);
  font-weight: bold;
  margin: 0 4px;
  user-select: none;
}

/* コードセル — ゲームのボタン風チップ（タップでそこから再生） */
.dtm-cp-chord {
  display: inline-block;
  font-family: var(--dtm-font);
  font-size: 12px;
  padding: 2px 5px;
  border: 2px solid transparent;
  color: var(--cp-fg, var(--dtm-text));
  background: var(--cp-bg, transparent);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}
.dtm-cp-chord:not(.dtm-cp-chord--dead):hover {
  border-color: var(--cp-fg, var(--dtm-text));
}
.dtm-cp-chord:not(.dtm-cp-chord--dead):active {
  transform: translate(1px,1px);
}
.dtm-cp-chord:focus-visible {
  outline: 2px solid var(--c-white);
  outline-offset: 0;
}
.dtm-cp-chord--dead { cursor: default; }
.dtm-cp-chord--played { opacity: .45; }
.dtm-cp-chord--active {
  border-color: var(--c-black);
  color: var(--c-black);
  background: var(--cp-fg, var(--dtm-primary));
  box-shadow: 2px 2px 0 var(--c-black);
  opacity: 1;
}
`,Jc=(e=document)=>{if(e.getElementById(Kc))return;let t=e.createElement(`style`);t.id=Kc,t.textContent=qc,e.head.appendChild(t)},Yc=(e,t)=>{let n=e.style.position;window.getComputedStyle(e).position===`static`&&(e.style.position=`relative`);let r=e.ownerDocument??document,i=r.createElement(`div`);i.className=`dtm-overlay`;let a=r.createElement(`div`);a.className=`dtm-spinner`;let o=r.createElement(`i`);o.className=`dtm-spinner-fill`,a.appendChild(o),i.appendChild(a);let s=r.createElement(`div`);if(s.className=`dtm-loading-label`,i.appendChild(s),t?.onSkip){let e=r.createElement(`button`);e.type=`button`,e.className=`dtm-overlay-skip-btn`,e.textContent=t.skipLabel??`音声合成をスキップ`,e.addEventListener(`click`,n=>{n.stopPropagation(),e.disabled=!0,t.onSkip?.()}),i.appendChild(e)}return e.appendChild(i),{remove:()=>{i.parentNode&&(i.remove(),e.style.position=n)},setProgress:(e,t,n)=>{if(t>0){let r=Math.max(0,Math.min(100,Math.round(e/t*100)));a.classList.add(`dtm-spinner--determinate`),o.style.width=`${r}%`,n==null?s.textContent=`${e} / ${t} (${r}%)`:s.textContent=`${e} / ${t} (${r}%) - \u3042\u3068\u7D04 ${n} \u79D2`}else a.classList.remove(`dtm-spinner--determinate`),o.style.width=`0`,s.textContent=``}}},Xc=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAcElEQVR42u2WOw7AIAxD7Yr7X9kdqi5IIXQKBWckKHrOTyEAodAuFJsBDGAAA7TIIT0LkuTQ/1r0L4u3XgZ6ZbNKsvf9mlBSqu5fU9DXMFP3teujeOtPQbYPZnplFK88A4xuwmM2IX0VG8AABjge4AZHeT8uyZjZYAAAAABJRU5ErkJggg==`,Zc={puyuyu:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB60lEQVR42tWXPUxTURiGn9vWMCgtEQoDcWhAFgdtB0dMGjfcIAwMjcYoKIObq3F1EwKixNR0cCC46YQ4ODqIi4kRjUPj0Jaa1roYi9fh9Kuck3tvb7v08C73J+/5Tt7nnPvlHoeQend3yKULXXxQc8L4IvRZsU6JM9NJAKLZOQCazox6jiU0/2Gzrgq6r5RvetsFeP+2EkjEPgJ+yd3olDL81RObEp+My7Ct6oLrRcIeAmbyyKULngOikf2uJpA6GT54kug7gfZ6HO6cdwF+pYYBGBxT12vzrwF49mKpq8JXZzcAyG9dBqBRqgJw8lNRob+ybwkBc+2vrx1oBknQq4Sg6OnyCEf7g319YGU1rSM6taWujtou9S/ZwILxid1gf2sP2NsJZZdGZz57DkhMvlG9/uVZvT906bePwO9GDYCBwSFtDUWLN1UfePxkw/tzCumXeawh0O4D59InNAL54gIAN27d1wZsPrqnvu8zz/V+EdIvBD7u/bGUgEhI/BjLae9PlwqBBf385trbQ0Buvj2ccAFGR396kuhVZvJyOQ5A6s5Xx64+UPlebd2p/wAhYSYQ3S40tef1XCxwIkn+fx4s2wPmv2FyXCdhJjcT+703k1v3V+x0OhkJiV7ll9x+Ap1Px25giWNzOv4HHKK9IIEhxAYAAAAASUVORK5CYII=`,rino:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABvklEQVR42mNkIACC8yv/MzAwMKSF+jOQAmat3ojCXzuxnRGbOiaGAQaM1PY5oRBBD4kBDwEWdIGdR078p6YFesryeOUHTwjAfI7u4kt3HzLgEyfWp4M/BHD5zE1BhoGBgYFh+vZdDAwMDAzKauoo4jAAk8cFkHLTf+TcMPhC4O6tm6gCaD6Fy6OJZ7o5Q0Ji194hmgbQfZ6VFA+h0TRMm7cQtSiVkcFrwc4jJ4ZYLoD5/P9/SIEobGCNNa5hPsel7t3FY1hz06xBHwLoccxj5IhV4/8nT/CqWz61D4V/bNu2wZkGGNHrAlhu2HvxBgMDAwPDmtJssgze9eAJStyHdE8d5O0BdxsLRuSWEHrcWXl5EWUgzKdwQKBFNfjbhEXailjlTf79Q+GfYYL4pe/qfQYGBgaGU9dQW8WPd18bnK1ieBqQddVCiXtOyU8MDAwMDBGrJzAwMDAw2Duj5vNMIX2UtDF9STtUH1TBNVSL0M0fvCUhIYDu81ioz3EBWMhJv0KtFZdd/j5IQwDm4oN792PVAEsTDDAaTR86iNO6xMDAwMCwiMECa0gMnTSAK0RwySNC5BJKSCTv/T64QgAAipubBW9f1GUAAAAASUVORK5CYII=`,roze:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB0klEQVR42s2XPUsDQRCGnxVbC4OVFkELlRR+lBY2dkmlpSLYWVmIpA7BOkL+gQghjYVWiaRVsBFNgiZGQbGIlR+FP2AtzEh23TsTEW6nudu529l53/nYXUVHZqbmNEC9VVWEiPwXJEHzg+wPELEMime12yvRaQCllHjunPjYfjDG42MTxnxAuZDbDEbOwHc8Rss5DfCcTBvIQ5Aa3229MDp2skfHrjM3os8BeQlCLsgWZhadBkRfLB84megSbVWFZ1VQb1UN5GvJDePH8/ppX4Znp+cB+LBySJDLev7kgC2/Ia4dFb+Qrqz9aWF/cuC/DIVkv7Nq/OkD4pFk5Y+OZsVaxiqRCI1tr7kVPQNB2S6MCFLdaJhtTWuj13/LdsEYPmUzAMTSafzeC+wO1bVLumc2mwC04ymzA1LoywF/+4Ad4/dSCYDhVKqvBeLZ3dDq8JeB970v5Ne2vsOESK+MvOTXARixqsQ/BiTrY0mzbt9yuVDk0i/sE9XQYcZ5b5BziD+nYvFIYmWfFYNkdWnLqb9pnxl9RZi1T8f+3Qts5BL7/XwegIvJZQAu7917yKZ+BWCnUjGqpmsvUH5XwW/IbaS2nrtjZ+fUnadKJIy7Y+QMfAL8JMMLhDWQAQAAAABJRU5ErkJggg==`,ruko:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACC0lEQVR42s2XsUsbURzHP08kinNvkWAXiy0F6dBJM0S7Bf+AUK2CkKCzS6GDZJBObkJBcNFS7NRFApaCEbRdHERQTJwKGYS4dJE2FM/h7id9P1/SKx3ufZfk3r17d9/P+/1+9ztDQgVBEPIParVaJsm8HlKWyedyTme1gwPzp/OnIyOJFjyt17sS0fdLn4D8kSfTDpI6T0pE1hPCqRPo7RQD/6tm38PYsZuExFb6BDqdkL16VSwC8DiTAeC83bbmbW1vW/NEbz99s0hA3c860CtPLk60ZHwv/n2jnK7Mzkbjm5vWeFbFgkiTSr8ObKytWVnwulKRyuW8IGw2AZiInQgZk8065w+/mAbgx8lnZ2z5kwWy1+I8DCMwS4NDzgv3VMyIU9HFl/cRGWPs87++e5YFeiCfy1nHxavLRAs9eDLeNQY6ZZe//YBod2YGgMzUVKIF2zs7ABz1RN7mPu5HdUHtvb8xIO9pIdO3sOCsA39znlT+vg1119RoNEKAr9UqAM9vbizHweQkAGf70Z6XSiUTZ0HoIutvTyhPKjpcXw8BgnwegEcDA86FLq6v7S64VgNgvFw2qs6EXvWE975etGOtwmLFOq6+W3Z/B8QEtDQRfwiI87uuNSZQnp+3Oh/R0slvAFZH7UTSnZG8NSV7NAn/6sBYoeCcKM5+PnvpJNF//KHrjfS6Qjx1ArcCiMI3kOeT7AAAAABJRU5ErkJggg==`,shiyo:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACJklEQVR42s2Xv09TURTHP5eAJJrI3ISBhIFJiaBp08GFAYKTA6FxejVBGgeTtzjxF7gwaWoNtCPEoSwSli4aa+uPSHFiaGLiQFwkDDWBBK7De6fpvd4+YOKe5eW8e+557/u959dV9BcdP1Xvy0ajoXv1dDoNQLPZBCCTyaik/bYMcMWiEpBjITcQiwhyBxOG3cbqJAC5sKW8YmDwPAOttYHMRn7n+nMATn7Iygtjn1LKZkL3MuFvDBzv3Qfg+98I0c9PywA8nBm51AeGb793xoK/MSB/eG18NUJeenwh5NXakdNOd75FVN+YNtbF3h8GJDoXn6wnbhBmRDZjhhYX3kX62we4/AizEhMSY/7WgU3r7LtnTGjogtyWk3Zo6MJILpz2PAtEcmHL+d7O425BGR1N/NDxXuhnNxw87+w+z84a+r2FNaej/+x2dpy9wK6Q/sbAbtztfm9tJZ71bq0GwOHU1KVixt+JSCriyM1nAKTGxoz1yYkJQ2/t7zsdd9ptAH51XiZml38xIJNKEHzQAEunp6aBxYDNSH17+0J1RbqkfzFgz/3FYhGApWzWsLt7dmboXwciLG/qdQAqlYpy+ZNp2V8GgiDQAIVCARcTIq+tuX85vjeI2Pu7N6lbQ55ngZx1Oq54+ZUVAMrlcqTn81H+V6sAvEqljP1iZ98jxB+Hcc/588gzBj6WShogOz/vZMRG+GVuDoCnBwdG9+ubPX3mhStn4B+i9swYdEa2xAAAAABJRU5ErkJggg==`,teto:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB00lEQVR42tVXPUsDQRB9q8GvQiyjWKS0CApBCEENafwoYiMWIoJX+gMiKFoqFskPsFQQsbLxisQqRCQIEgiksEzhRyspREU9i705suNecqmyviozszfsezs7OxEIDqfZyMTSAIBcxebrRAc50YMuQ/gx5CDGhFR/HwCg+PGp+DWKtFTICAUcHUMOYhzp1e+5/v2jVYSjSSFhhgKZWNrRMTx5ew/EvJ0S1tCA1p+r2GYoEKIffMeEcHxSKlK6BwCsJaeV+AXzhyng+nl+4/pAiFc5BzHMHslbsr1rK0r5+f1uEVfC/BoghmJxS7bLp6pkvLwn49GEW9UyDp9+8v9qgDpWFnpG2atDvZ8pZs2uml0D3ltgJ1YAAOnypfa9dwrH8gv3zP+gVlaY8+95fnPeAs08IJptv8nHKRy4jPfRZlISPvnNm4gUJebXdwAA15sRAMDCaR0A8PL8CABYarwCAPLDIwCA0bFxZT3VQrsZ0Zw+wJl723eZkJ+YWl9yXqi6Nl8fTW3Iy1E8c1opYZQCCryzPIdy9qQATUwEincKc28BgdcEx9RDTbGrE1HFr+kH5teA0rk4Q46bwYZizwVkbnQNBPp3TIjPJBX77rbUUe6uK/ALBWuzghq8Lc4AAAAASUVORK5CYII=`,tsukuyomi:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB3UlEQVR42tWXPUsDQRCGnwuijYIoFqKmEDSCxIgIgqnsogbsrC3ERiwN4g8Ikk6sFH+BnYofvcTKxoigBCzEYGGjWIiCOYvNBHe5TdQUt051czc3e++zO7tzHnUst7vn04BlFue9Ws8jhGxN9ZTPzU43NkIlj41E6AQ8m/JYfByAoWgXAPtHJzRCRN43SbizBkzlv1X2VzLuVoHYzf0TAMnys+aLCTGThMTJGnKfQOpyWF1cvgHQsh4FYPDzRd3vmQHgoPShJbi9uqhJyPk1UK3Jwsq1/115rLst8AX/4UFP0NsbGHf7+Kr579l7zR/ZGvbcrAJR7vvqEOwcTdZMYIuTPCYJUS7Ewydgzn2Bay2gdWzqR4nMuMPlhcC5l/HcWQOnCaU4lVU3xI9tnwFQnOgDoDmdDs5QKmlxYhdGmBA2ibhTBfKFHCkCm00dAKymJn+USAidHx8DkI+0q7PBUC7j5BJ7jlSB7RyXziVT8fM7Oz7AeLmsz3VEaWi7UvtAcmvJC+qmq4T/XT8gdTsw2692to07AF7jeU35wFq/7COqzhdVnVOnu3aHgNm1VpVXlImJX9zQffO5kDg1dlb3CNj6dZsVK2vAVP7Xf8bwCfxWuc23Eanmt/xlh07gC6oBviFE8rZHAAAAAElFTkSuQmCC`,rei:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACXElEQVR42s2XQWhTQRCGv1c8CFa9SSPEKkQPtfIOBQUlBgThEVIjEgRvEuuhCDkVL7Ug2N4ilqB4aCveFOnBanm+gxRUKlgJUmgraEA0YEpPRT3opeth30p2eXk0XrJzecxkZnbm39mZicM26dXAGUEblKkuOFHyvn09AmBtY90B6KLD5LSKUNH9ZB8Aw/W1/zpA2StSfuxDQGWeyWX1u5/3Nf7t8RORjk4uvYs9aOVqt8a/CQ5gBQI7WlZ9mLkZOaxGZ+jqesGpCgCe50nB2JFIO3sQ+FftRuaNbFkzSPgjGv9j+SgAe9zV2INMvbT3zRIEtkZT4buXEa3QrVUpQUWLuBX9GXwgv+O35d1Tkj94nwBYbvyUflxba0Bl7CZ2A3B6fhKA17krsQ72Tk3qSLQZQOc7oTnlMtWFVtMwRGZGGiYOxTreGk1F94XFkmU10DS3BYAQEhBx47CMcKIWadhKT2Vu8iOXixIBo7Pa8wo2c/lYRXX32yXR+CK/d8/GdkR79oHNXF4AbBzrBSCZL0Qa7OxNtodEiED/1C9t5tgzC0zB+ZknADwNeYXE0rWbkbWgOqUpf/HhIwC7wg5bfhhO0bGyZZ2wqXOJ5rsyqfpMIuPPPdLkF0rXAfhcuaPJU12+NmPS71/KjhgEWke0rwbUJqQif+weBKA+NwtANn9J0//9ta7xtbTcAVOLvmafNqfgRM2xCwEzY8LNZbBQUAoADJy7qNWE+XrKIQLckpsQQ0Oa3vNZieRwsSjsegUqIkX3pqf1qg33+/6e/dH/C9a/R+or3iSFRMcR+AtdbNaYOcb0dwAAAABJRU5ErkJggg==`,MGRoid:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABy0lEQVR42tWXv0tCURTHPy9dwog0AssiVLChNmnQaHaJIoj+gQgkoj+jsSEiGmpodosWA9ck6g1BDg0qQYNLDpG1GK/h3RvvxfU+nbyd6f4473C/33ve95xr0b853kk2m2UQs21bDi3v+ghDtnCQQzEWcwDO2u2+kC83mwDcTEwEMWkZx4Cjc7xMJAA4DkCeGx11GRDrjUZDefdG5YA+uwUyaQetlstEPK5ELi0ajfZ1gKEzYEkG/iK/23l0B7MDRnwV1O51fYx6dABj/wI9coHsdz1g3j0NCyZsLRPmK+HL4jMAixdlAD4KB0pmxsquQtSOCgDMs6Bkwkgd0FoqlQIgs7oFQGhjRemX+ZwW/lMAfNfo9RdZxumAshZ0r8K+Ow6lT9zBUk4d6anqIq/v+5CH17tm1wIrqAOSTHiQuJvlMzdAoYiKuSDkRjPgiE4IgPtkUlv3q19fWj/ZSRndDyhNIsyJ+n+dzyvna7e3ALwJvZisVFD1F7ZtO/9DB+SJHw53lVneqytW1PteVdDwd4HU/u3zivKDzbkZbc2QViqVtMiNZMDy5oJE8Pcu3zsdAMYjEWVAzzvg/yrhQK/ker3u20yn0wPFHjoDP1pgkXMfnLDSAAAAAElFTkSuQmCC`,MOTRoid:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAByElEQVR42s2WTyiEURTFfyMbS1ZSlIUxScpCNrNAkpLdhClFlJRJdpQ/5V+xE7PQFJHFyJKUJKLZaBZqkhjKQslCLG3UWIw7ec/7xidq3lnNve++23fOO2/u86ChPbyd+hp3tDbzH9g5OFLivVCXByCPHMPjlrkw+KsiuhI5VyBfT/z3mev9JJZ1ezywdfeccnNmbhVyuy/3Coj7nVwv2KwpAaAn8ZiVkezT652UsO8WCK5jJ0pcH9OYOrha9un1GVivwMzEOADJ6CoApQtx48bdQNnnr3cAugMNAMRWpoz1/usbALzBQQB8/kZLFZAv0/EwVpdVESfGMV+lsb94xz4FMu4f6lTybpkLdObf+lurwNTcvOLWh6XpXzX0n54Z89JP+ts/CwRtj1cAFHq9Sj4+uWisr5sdVeLXZBKA/ZIqy6fhT3O7YmNJPdOWFmNd8vBQiW97R7JOTXtfxYKjyAwAzQPp//jxp8v0tAuFjA3Pw2EA5ourjfvt84DTQkFNVQrgrb9Dyb/UNhlvhe76ootjtd9a+gXxlrjy2P0eEOZOyDDTGLpFRtlPJezzgNPZC6LBPgDKlyPG9fvhAQCC0XWzAms7dt2CDzsGp242tsuqAAAAAElFTkSuQmCC`,NYNRoid:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABo0lEQVR42tWXoU8DMRTGf7csCAQBOcz4A6aOIOZAETKLBsQGCCwhiIWQCUKCRDAyAWgcWQgoPOHU/gBmOAkJggRTRPeSa7m7lSHWPdNc23u97+v3vvYCrCiVSir5HMdxwAjhmqfAmCPI+uIURKnPcRxjIc1d0GZi7AwU7Y63qyMA5reODaR268qEnc9fDdhaaDabAERRZLRhGDollnmtVsvvKihmqb3b7QJQq9WcGOh0OgDU63Xj/SyN+KeBMAxV2h4K8peTbQAWDy9HGpeIoiiYDA3Y6l9Z29NI788NpII8WN0FYLmgU0ZDfMJ/BiSU0tI4m57RHZWqRn5XzZ33ZDmn/wwk1KmSKg4C3a0eLvIzPbYB2P/61H7wW0ue3wdSvFxZ9Wvu+YARUb/tH1l1PzkMiBYkxOMldpZuAWg/r6eeCa5r+s+A3AuknjcrNwDMvZ4C8L5wAMB1b8Ood7kHpGjFfwZU0tkajYaxt6Ly3tSsNsbvj/QqGbwvPpLFtscMWHtnnxGuMezPyv8q+AdylzX8ZsDJIfv9vjFYLpf/lHvsDPwA5Wy6PgZtokAAAAAASUVORK5CYII=`,uc:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB/ElEQVR42s2WPUhbURTHfxHniEEIVdvFmDaTiIJjBpcuGQrFr2JDaoeCkxRdAg6WVPAD20FwqEoUQUs7hdAuDaSbYNpGF6VxiaLooCCdREyHlxs4z/deEhG8Zwn/m8d57/+759x7XEAB53BxuyhU8lAN9xyusLfe8UvTrT4ALhr3q0ocSjsDiJ+c60Gg9q6dq1jYbATgTdeR3jVQW63z5t6nABxufBd6syMLQFemDYDA0jEA829nAPg8O6ApAVWNYW99RU7tQjkvkcDQw9kpAILa14B579203iqhmURqv1gDDIj+Vyesfl1Qbq/NNRFJ7gDwsblBPthh/AxuvQDgzORc33PgImv0r7vtgeV6icTkFQDvCBgL26ZEr04r+oD7J6D6P21DoqR3s0LnIntC+5YfC900ViT5xOiKkPeP6oKC3l1A6p+QblqE/tV/aZnoBpG09QsVcUVCHwLBvznxRyJotGsu+FCsj0zkLRPNjT8qOj9wrB39ZsJEIiGGt/Bq2HqPy5CwI2CeDZ9/WjHWQyFNCJjn9+TUN3GGr3auAXAdME6+TCYjEtTlv8rqf/Ze6C+vXwrnJTLaEfD0eBxvRXUL+vN+x4TRaFTon2sfAJhe/6H5bThU0w7A4vXvqmZBO+fmGO3rViQ0vwvsSMQH4wDEYrGKnKu9134e+A/zObZWSEHtdQAAAABJRU5ErkJggg==`,hibika_aru:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB/ElEQVR42s2WPUhbURTHfxHniEEIVdvFmDaTiIJjBpcuGQrFr2JDaoeCkxRdAg6WVPAD20FwqEoUQUs7hdAuDaSbYNpGF6VxiaLooCCdREyHlxs4z/deEhG8Zwn/m8d57/+759x7XEAB53BxuyhU8lAN9xyusLfe8UvTrT4ALhr3q0ocSjsDiJ+c60Gg9q6dq1jYbATgTdeR3jVQW63z5t6nABxufBd6syMLQFemDYDA0jEA829nAPg8O6ApAVWNYW99RU7tQjkvkcDQw9kpAILa14B579203iqhmURqv1gDDIj+Vyesfl1Qbq/NNRFJ7gDwsblBPthh/AxuvQDgzORc33PgImv0r7vtgeV6icTkFQDvCBgL26ZEr04r+oD7J6D6P21DoqR3s0LnIntC+5YfC900ViT5xOiKkPeP6oKC3l1A6p+QblqE/tV/aZnoBpG09QsVcUVCHwLBvznxRyJotGsu+FCsj0zkLRPNjT8qOj9wrB39ZsJEIiGGt/Bq2HqPy5CwI2CeDZ9/WjHWQyFNCJjn9+TUN3GGr3auAXAdME6+TCYjEtTlv8rqf/Ze6C+vXwrnJTLaEfD0eBxvRXUL+vN+x4TRaFTon2sfAJhe/6H5bThU0w7A4vXvqmZBO+fmGO3rViQ0vwvsSMQH4wDEYrGKnKu9134e+A/zObZWSEHtdQAAAABJRU5ErkJggg==`},Qc=Xc,$c=48,el=192,tl=[`#00e436`,`#29adff`,`#ff77a8`,`#ffec27`],nl=e=>{let t=e.match(/^#\s*loop\s*=\s*(on|off|1|0|true|false)\s*$/im);if(!t)return null;let n=t[1].toLowerCase();return n===`on`||n===`1`||n===`true`},rl=null,il=new Set,al={klatt:`軽量ロボ声`,...To},ol=null,sl=null,cl=new WeakMap,ll=e=>{let t=cl.get(e);if(!t)return;let n=e.ownerDocument?.defaultView??window,r=t.getBoundingClientRect(),i=r.left+r.width/2,a=e.getBoundingClientRect(),o=r.top-a.height-6<0;e.classList.toggle(`dtm-player-balloon--below`,o),e.style.top=o?`${r.bottom+6}px`:`${r.top-6}px`;let s=a.width/2||40,c=s+4,l=n.innerWidth-s-4;e.style.left=`${Math.min(Math.max(i,c),l)}px`},ul=!1,dl=()=>{if(ul||typeof window>`u`)return;ul=!0;let e=()=>{ol&&ll(ol)};window.addEventListener(`scroll`,e,{capture:!0,passive:!0}),window.addEventListener(`resize`,e,{passive:!0})},fl=()=>{ol&&=(ol.classList.remove(`dtm-player-balloon--visible`),null),sl&&=(clearTimeout(sl),null)},pl=e=>{e.classList.add(`dtm-player-balloon--visible`),ll(e),ol===e?sl&&clearTimeout(sl):(fl(),ol=e),sl=setTimeout(()=>{fl()},3e3)},ml=async(e,t)=>{try{return await navigator.clipboard.writeText(t),!0}catch{try{let n=e.createElement(`textarea`);n.value=t,n.style.position=`fixed`,n.style.opacity=`0`,e.body.appendChild(n),n.select();let r=e.execCommand(`copy`);return e.body.removeChild(n),r}catch{return!1}}},hl=e=>{let t=``;for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)},gl=12353,_l=12447,vl=12449,yl=12543,bl=12540,xl=255,Sl=223,Cl=e=>{let t=[];for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);r!==32&&(r<=127?t.push(r):r===bl?t.push(Sl):r>=gl&&r<=_l?t.push(128+(r-gl)):r>=vl&&r<=yl&&(t.push(xl),t.push(128+(r-96-gl))))}return new Uint8Array(t)},wl=async e=>{try{if(typeof CompressionStream<`u`){let t=new CompressionStream(`gzip`),n=t.writable.getWriter();n.write(Cl(e)),n.close();let r=await new Response(t.readable).arrayBuffer();return`z.${hl(new Uint8Array(r))}`}}catch(e){console.warn(`[dtm] CompressionStream failed, fallback to encodeURIComponent`,e)}return`u.${encodeURIComponent(e)}`},Tl=e=>{let t=e.replace(/-/g,`+`).replace(/_/g,`/`);for(;t.length%4!=0;)t+=`=`;let n=atob(t),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);return r},El=e=>{let t=``,n=0;for(;n<e.length;){let r=e[n];if(r<=127)t+=String.fromCharCode(r),n++;else if(r===Sl)t+=String.fromCharCode(bl),n++;else if(r>=128&&r<=222)t+=String.fromCharCode(gl+(r-128)),n++;else if(r===xl){if(n+1<e.length){let r=e[n+1];r>=128&&r<=222&&(t+=String.fromCharCode(gl+96+(r-128))),n+=2}else n++}else n++}return t},Dl=async e=>{let t=new DecompressionStream(`gzip`),n=t.writable.getWriter();n.write(e),n.close();let r=await new Response(t.readable).arrayBuffer();return El(new Uint8Array(r))},Ol=async e=>{let t=new DecompressionStream(`gzip`),n=t.writable.getWriter();n.write(e),n.close();let r=await new Response(t.readable).arrayBuffer();return new TextDecoder().decode(r)},kl=async e=>{if(!e)return``;try{return e.startsWith(`z.`)?await Dl(Tl(e.slice(2))):e.startsWith(`g.`)?await Ol(Tl(e.slice(2))):e.startsWith(`u.`)?decodeURIComponent(e.slice(2)):decodeURIComponent(e)}catch(e){return console.error(`[dtm] failed to decode MML payload`,e),``}},Al=(e,t,n={})=>{Jc(e.ownerDocument??document);let{placements:r,bpm:i,tokenTracks:a,lyrics:l,meta:u}=Qs(t,{collectTokens:!0,collectLyrics:!0}),d=l??new Map,f=new Map(fo(t).map(e=>[e.key,e])),p=i??n.defaultBpm??120,m={...ht,...Dc,...pt(n.drumPatterns??{})},h=u.drum??`none`,g=n.volume??100,_=u.volume??n.masterVolume??50,v=u.drumVolume??80,y=(u.fadeIn??0)/10,b=(u.fadeOut??0)/10,x=n.trackColors??tl,S=n.synth??!n.onPlayNote,C=u.audio?n.backingAudio??null:null,w=0,T=u.audioStart??0,E=u.audioEnd??0,D=60/p/$c,O=u.audioOffset??(u.audioAt?-u.audioAt*D:0),k=e=>o({fromStep:e,offsetSec:O,rangeStartSec:T,secondsPerStep:D}),A=n.loop??nl(t)??!1,j=[...new Set(r.map(e=>e.trackIndex))].sort((e,t)=>e-t),M=r.reduce((e,t)=>Math.max(e,t.startStep+t.durationSteps),0),N=r.map(e=>({pitch:J(e.pitchUnits),when:e.startStep*D,duration:e.durationSteps*D})),ee=[];if(N.length>0){let e=[];try{e=ct(N,{bpm:p}).chords}catch{e=[]}for(let t of e){let e=Math.max(0,Math.round(t.when/D)),n=Math.round((t.when+t.duration)/D);for(let r=e;r<n&&r<=M;r++)ee[r]=t.symbol}let t=``;for(let e=0;e<=M;e++)ee[e]?t=ee[e]:ee[e]=t}let P=j.map(e=>{let t=0,n=r.filter(t=>t.trackIndex===e),i=n[0]?.velocity??100,a=n.map(e=>({id:t++,startStep:e.startStep,durationSteps:e.durationSteps,pitchUnits:e.pitchUnits,velocity:100}));return{id:String(e),volume:g*i/100,notes:a}}),F=e=>x[e%x.length]??tl[0],te=null,ne=()=>(te||=new AudioContext,te),re=null,I=null,ie=()=>{let e=ne();return re||=(I=Ln(e,e.destination),yc(e,I.node)),re},ae=null,oe=()=>(ae||=Lc(ne(),ie()),ae),L=null,se=()=>n.singingVoices?n.singingVoices:(L||(L=js(ne(),ie()),L.setVolume(g/100*(_/100))),L),ce=S||!!n.singingVoices,le=()=>n.singingVoices??L,ue=()=>S?ne().currentTime:n.getAudioTime?.()??performance.now()/1e3,de=e=>{n.onScheduleFade?.(e),e&&S&&ie(),I?.schedule(e)},R=(e,t=0)=>{K.start(e,t),de(Rn({anchor:K.getStartTime(),fadeInSec:y,fadeOutSec:b,atSongStart:e===0,durationSec:K.getEndSec()}))},z=e.ownerDocument??document,fe=z.createElement(`div`);fe.className=`dtm-daw dtm-player`;let pe=[],me=z.createElement(`div`);me.className=`dtm-player-head`;let he=z.createElement(`button`);he.type=`button`,he.className=`dtm-player-play`,he.innerHTML=Y(`play`,12),he.disabled=j.length===0;let ge=z.createElement(`button`);ge.type=`button`,ge.className=`dtm-player-loop`,ge.innerHTML=Y(`loop`,12),ge.title=A?`LOOP ON`:`LOOP OFF`,ge.classList.toggle(`dtm-player-loop--on`,A),ge.disabled=j.length===0;let _e=new Set,ve=new Map,ye=new Map,be=new Map,xe=e=>{_e.has(e)?_e.delete(e):_e.add(e),Se(e)},Se=e=>{let t=_e.has(e),n=be.get(e);n&&n.classList.toggle(`is-muted`,t);let r=ve.get(e);r&&r.classList.toggle(`is-muted`,t);let i=ye.get(e);i&&i.classList.toggle(`is-muted`,t)},Ce=z.createElement(`div`);Ce.className=`dtm-player-mml-header`;let we=[];for(let e of j){let t=z.createElement(`span`);t.className=`dtm-player-emoji`,t.style.backgroundColor=F(e);let n=z.createElement(`span`);n.textContent=`🥺`,t.appendChild(n),Ce.appendChild(t),we.push(t),ye.set(e,t)}let Te=z.createElement(`div`);Te.className=`dtm-player-more-container`;let Ee=z.createElement(`button`);Ee.type=`button`,Ee.className=`dtm-player-more-btn`,Ee.innerHTML=Y(`more`,14),Ee.title=`メニュー`,Te.appendChild(Ee);let De=z.createElement(`div`);De.className=`dtm-player-menu`,De.style.display=`none`;let B=e=>{let t=z.createElement(`button`);return t.type=`button`,t.className=`dtm-player-menu-item`,t.textContent=e,t},Oe=B(`MMLを表示`),V=B(`MML書式とは`),ke=B(`埋め込む`),H=B(`MMLコピー`);n._skipInfoModals||(De.appendChild(Oe),De.appendChild(V),De.appendChild(ke)),De.appendChild(H),Te.appendChild(De),Ce.appendChild(Te);let Ae=e=>{let t=e===void 0?De.style.display===`none`:e;De.style.display=t?`flex`:`none`,t?(Ee.classList.add(`is-active`),z.addEventListener(`click`,je)):(Ee.classList.remove(`is-active`),z.removeEventListener(`click`,je))},je=e=>{Te.contains(e.target)||Ae(!1)};Ee.addEventListener(`click`,e=>{e.stopPropagation(),Ae()});let Me=null,Ne=null,Pe=()=>{Ne&&=(Ne.stop(),Ne.destroy(),null),Me?.remove(),Me=null},U=e=>{Pe();let t=z.createElement(`div`);t.className=`dtm-modal-overlay`;let n=z.createElement(`div`);n.className=`dtm-win dtm-modal`;let r=z.createElement(`div`);r.className=`dtm-modal-header`;let i=z.createElement(`span`);i.className=`dtm-modal-title`,i.textContent=e;let a=z.createElement(`button`);a.type=`button`,a.className=`dtm-modal-close`,a.innerHTML=`&times;`,a.title=`閉じる`,r.append(i,a);let o=z.createElement(`div`);return o.className=`dtm-modal-body`,n.append(r,o),t.appendChild(n),a.addEventListener(`click`,e=>{e.stopPropagation(),Pe()}),t.addEventListener(`click`,e=>{e.target===t&&Pe()}),z.body.appendChild(t),Me=t,o},Fe=(e,t)=>{let n=z.createElement(`div`);n.style.marginTop=`8px`;let r=z.createElement(`button`);r.type=`button`,r.className=`dtm-btn dtm-btn--primary dtm-btn--xs`,r.textContent=`📋 コピー`,r.addEventListener(`click`,async e=>{e.stopPropagation();let n=await ml(z,t);r.textContent=n?`✓ コピー完了`:`コピー失敗`,n&&r.classList.add(`dtm-btn--success`),setTimeout(()=>{r.textContent=`📋 コピー`,r.classList.remove(`dtm-btn--success`)},1200)}),n.appendChild(r),e.appendChild(n)},Ie=e=>{let t=e.querySelectorAll(`.dtm-modal-sample-copy-btn`);for(let e of t){let t=e;t.addEventListener(`click`,async e=>{e.stopPropagation();let n=t.getAttribute(`data-mml`)??``,r=t.textContent,i=await ml(z,n);t.textContent=i?`✓ コピー完了`:`コピー失敗`,i&&t.classList.add(`dtm-btn--success`),setTimeout(()=>{t.textContent=r,t.classList.remove(`dtm-btn--success`)},1200)})}let r=null,i=e=>{e&&(e.textContent=`▶ 試聴`,e.classList.remove(`dtm-btn--danger`),e.classList.add(`dtm-btn--primary`))},a=e=>{e.textContent=`■ 停止`,e.classList.remove(`dtm-btn--primary`),e.classList.add(`dtm-btn--danger`)},o=e.querySelectorAll(`.dtm-modal-sample-play-btn`);for(let e of o){let t=e;t.addEventListener(`click`,e=>{e.stopPropagation();let o=t.getAttribute(`data-mml`)??``;if(r===t&&Ne){Ne.isPlaying()?Ne.stop():(Ne.play(),a(t));return}Ne&&=(Ne.stop(),Ne.destroy(),null),i(r),r=t;let s=t.closest(`.dtm-modal-sample-box`)?.querySelector(`.dtm-modal-sample-player-container`);s&&(s.innerHTML=``,Ne=Al(s,o,{onPlayNote:n.onPlayNote,onPlayDrum:n.onPlayDrum,onResumeAudio:n.onResumeAudio,getAudioTime:n.getAudioTime,singingVoices:n.singingVoices,drumPatterns:n.drumPatterns,volume:g,masterVolume:_,_skipInfoModals:!0,onStop:()=>{r===t&&i(t)}}),a(t),Ne.play())})}};n._skipInfoModals||(Oe.addEventListener(`click`,e=>{e.stopPropagation(),Ae(!1);let r=U(`MMLを表示`),i=z.createElement(`p`);i.textContent=`このMMLをコピーして、他のプレイヤーや共有URLに貼り付けて使用できます。`,i.style.marginBottom=`8px`,r.appendChild(i);let a=n.getMml?.()??t,o=a.split(`;`).map(e=>e.trim()).filter(e=>e.length>0).join(`;
`),s=z.createElement(`pre`);s.textContent=o,s.style.whiteSpace=`pre-wrap`,s.style.wordBreak=`break-all`,s.style.cursor=`text`,s.addEventListener(`click`,()=>{let e=z.createRange();e.selectNodeContents(s);let t=z.defaultView?.getSelection();t?.removeAllRanges(),t?.addRange(e)}),r.appendChild(s),Fe(r,a)}),V.addEventListener(`click`,e=>{e.stopPropagation(),Ae(!1);let t=U(`MMLの書き方解説`);t.innerHTML=Gc,Ie(t)}),ke.addEventListener(`click`,async e=>{e.stopPropagation(),Ae(!1);let r=U(`埋め込み`),i=z.createElement(`p`);i.textContent=`生成中...`,r.appendChild(i);try{let e=`<iframe src="${`${n.embedUrl??`https://onjmin.github.io/dtm/demo/embed.html`}#${await wl(t)}`}" width="100%" height="260" frameborder="0" loading="lazy" title="@onjmin/dtm player"></iframe>`;if(!r.isConnected)return;i.remove();let a=z.createElement(`p`);a.textContent=`このHTMLをブログやサイトに貼り付けると、プレイヤーをそのまま埋め込めます。`;let o=z.createElement(`pre`);o.textContent=e,o.style.whiteSpace=`pre-wrap`,o.style.wordBreak=`break-all`,r.append(a,o),Fe(r,e)}catch(e){console.error(`[dtm] failed to generate embed snippet`,e),r.isConnected&&(i.textContent=`生成に失敗しました`)}})),H.addEventListener(`click`,async e=>{e.stopPropagation(),await ml(z,n.getMml?.()??t)?H.textContent=`コピーしました！`:H.textContent=`コピー失敗`,setTimeout(()=>{H.textContent=`MMLコピー`},2e3)});let Le=new Set;for(let[e,t]of d){let n=ye.get(e);if(!n)continue;let r=f.get(t.model.toLowerCase()),i=Oo[t.model.toLowerCase()],a=r?r.iconUrl||Qc:i?Zc[i]:void 0;if(!a)continue;let o=z.createElement(`img`);o.src=a,r&&(o.onerror=()=>{o.onerror=null,o.src=Qc}),o.width=20,o.height=20,o.style.borderRadius=`50%`,o.style.objectFit=`cover`,o.style.imageRendering=`pixelated`,o.draggable=!1,Le.add(n),n.textContent=``,n.appendChild(o);let s=z.createElement(`div`);s.className=`dtm-player-balloon`,s.textContent=al[t.model.toLowerCase()]??t.model,cl.set(s,n),z.body.appendChild(s),pe.push(s),dl(),n.addEventListener(`mouseenter`,()=>{pl(s)}),n.addEventListener(`mouseleave`,()=>{ol===s&&fl()}),n.addEventListener(`click`,e=>{e.stopPropagation(),pl(s)})}let Re=new WeakMap,ze=e=>{let t=performance.now(),n=Re.get(e);n!==void 0&&t-n<50||(Re.set(e,t),e.classList.remove(`dtm-player-emoji--jump`),e.offsetWidth,e.classList.add(`dtm-player-emoji--jump`))},Be=[],Ve=(e,t)=>{if(t<=0){ze(e);return}Be.push(setTimeout(()=>ze(e),t*1e3))},He=()=>{for(let e of Be)clearTimeout(e);Be.length=0},Ue=[],We=e=>{let t=2e3+Math.random()*5e3,n=setTimeout(()=>{if(Le.has(e))return;let t=e.querySelector(`span`);t?t.textContent=`😌`:e.textContent=`😌`;let n=setTimeout(()=>{if(Le.has(e))return;let t=e.querySelector(`span`);t?t.textContent=`🥺`:e.textContent=`🥺`,We(e)},100+Math.random()*50);Ue.push(n)},t);Ue.push(n)};for(let e of we)We(e);let Ge=z.createElement(`div`);Ge.className=`dtm-player-dots`,Ge.style.display=`none`;for(let e of j){let t=z.createElement(`span`);t.className=`dtm-player-dot`,t.style.backgroundColor=F(e),Ge.appendChild(t)}let Ke=z.createElement(`div`);Ke.className=`dtm-player-beat-row`;let qe=[];for(let e=0;e<4;e++){let e=z.createElement(`span`);e.className=`dtm-player-beat-dot`,Ke.appendChild(e),qe.push(e)}let Je=z.createElement(`span`);Je.className=`dtm-player-bar`,Je.textContent=`-`,Ke.appendChild(Je);let Ye=z.createElement(`span`);Ye.className=`dtm-player-chord`,Ye.textContent=``,Ke.appendChild(Ye),me.append(he,ge,Ke,Ge,Ce),fe.appendChild(me);let Xe=z.createElement(`div`);Xe.className=`dtm-player-seek-row`;let W=z.createElement(`input`);W.type=`range`,W.className=`dtm-player-seek`,W.min=`0`,W.max=String(Math.max(1,M)),W.step=`1`,W.value=`0`,W.disabled=j.length===0;let Ze=z.createElement(`span`);Ze.className=`dtm-player-time`,Ze.textContent=`0:00 / 0:00`,Xe.append(W,Ze),fe.appendChild(Xe);let Qe=()=>{let e=Number(W.max)||1,t=Number(W.value)/e*100;W.style.setProperty(`--fill`,`${t}%`)};Qe();let $e=e=>{let t=Math.max(0,e*D),n=Math.floor(t/60),r=Math.floor(t%60);return`${n}:${String(r).padStart(2,`0`)}`},et=e=>{Ze.textContent=`${$e(e)} / ${$e(M)}`};et(0);let tt=z.createElement(`div`);tt.className=`dtm-player-message`,tt.style.display=`none`,fe.appendChild(tt);let nt=null,rt=0,it=e=>{let t=performance.now();t-rt<1500||(rt=t,tt.textContent=e,tt.style.display=``,nt&&clearTimeout(nt),nt=setTimeout(()=>{tt.style.display=`none`,tt.textContent=``,nt=null},3e3))},at=z.createElement(`div`);at.className=`dtm-player-body`,fe.appendChild(at);let ot=z.createElement(`div`);ot.className=`dtm-audio-yt dtm-hidden`,ot.dataset.dtm=`audio-youtube`;let st=null,lt=()=>!C||!u.audio?Promise.resolve():(st??=C.load(u.audio).then(e=>{C.setVolume(u.audioVolume??80),e.mode===`youtube`&&ot.classList.remove(`dtm-hidden`)}).catch(e=>{console.warn(`[dtm] 伴奏音源を読み込めませんでした`,e)}),st),ut=[];for(let e of j){let t=d.get(e),n=!!t&&t.syllables.length>0,i=z.createElement(`div`);i.className=`dtm-player-lane-row`,be.set(e,i);let o=z.createElement(`div`);o.className=`dtm-player-lane-label dtm-player-lane-label--btn`;let s=z.createElement(`span`);s.className=`dtm-player-dot`,s.style.backgroundColor=F(e);let c=z.createElement(`span`);c.className=`dtm-player-lane-no`,c.textContent=`@${e}`,o.append(s,c),ve.set(e,o),o.addEventListener(`click`,()=>{xe(e)});let l=z.createElement(`div`);l.className=`dtm-player-lane`,l.style.setProperty(`--tk`,F(e));let u=[];if(n){let n=r.filter(t=>t.trackIndex===e).sort((e,t)=>e.startStep-t.startStep),i=(t.gate??100)/100,a=new Set(t.lineBreaks??[]);if(t.metaText){let e=z.createElement(`span`);e.className=`dtm-tk dtm-tk--meta`,e.textContent=t.metaText,l.appendChild(e)}let o=Math.min(n.length,t.syllables.length);for(let e=0;e<o;e++){let r=n[e];if(a.has(e)){let e=z.createElement(`span`);e.className=`dtm-tk dtm-tk--break`,e.textContent=`\\n`,l.appendChild(e)}let o=t.syllables[e],s=z.createElement(`span`);s.className=`dtm-tk dtm-tk--lyric${o.kind?` dtm-tk--lyric-${o.kind}`:``}`,s.textContent=Xa(o),l.appendChild(s),u.push({el:s,startStep:r.startStep,durationSteps:Math.max(1,Math.round(r.durationSteps*i))})}}else{let t=a?.get(e)??[];for(let e of t){let t=z.createElement(`span`);t.className=`dtm-tk dtm-tk--${e.type}`,t.textContent=e.text,l.appendChild(t),e.durationSteps>0&&u.push({el:t,startStep:e.startStep,durationSteps:e.durationSteps})}}i.append(o,l),at.appendChild(i),ut.push({lane:l,tokens:u})}let dt=[...new Set([...d.values()].map(e=>e.model))].filter(e=>ko[e]);if(dt.length>0){let e=z.createElement(`div`);e.className=`dtm-player-terms`,e.style.fontSize=`10px`,e.style.color=`var(--dtm-warn)`,e.style.display=`flex`,e.style.alignItems=`center`,e.style.gap=`4px`,e.style.flexWrap=`wrap`,e.style.marginTop=`4px`,e.style.padding=`0 4px`;let t=z.createElement(`span`);t.textContent=`この曲には`,e.appendChild(t),dt.forEach((t,n)=>{if(n>0){let t=z.createElement(`span`);t.textContent=`・`,e.appendChild(t)}let r=To[t]??t,i=z.createElement(`a`);i.textContent=r,i.href=ko[t],i.target=`_blank`,i.rel=`noopener`,i.title=`${r}\u306E\u5229\u7528\u898F\u7D04`,i.style.color=`var(--dtm-primary)`,i.style.textDecoration=`underline`,e.appendChild(i)});let n=z.createElement(`span`);n.textContent=`の音源を使用しています（音源名から利用規約へ）`,e.appendChild(n),fe.appendChild(e)}fe.appendChild(ot),e.appendChild(fe);let ft=null,G=e=>{try{if(!n.requireConsent)return!1;let t=dt.filter(e=>{if(il.has(e))return!1;try{return typeof localStorage>`u`||!localStorage||localStorage.getItem(`dtm_agreed_terms_${e}`)!==`true`}catch(e){return console.warn(`[dtm-player] localStorage access denied in consent check`,e),!0}});if(t.length===0)return!1;let r=z.createElement(`div`);r.className=`dtm-consent-overlay`;let i=z.createElement(`div`);i.className=`dtm-win dtm-consent-modal`;let a=z.createElement(`div`);a.className=`dtm-consent-header`,a.textContent=`利用規約の確認`;let o=z.createElement(`div`);o.className=`dtm-consent-body`;let s=`<p style="margin: 0 0 8px 0; line-height: 1.4; font-weight: bold; color: var(--dtm-danger);">本データには UTAU 歌声音源が含まれています。<br>ご利用にあたっては、以下の音源利用規約への同意が必要です。</p>`;for(let e of t){let t=To[e]||e,n=ko[e];s+=`
					<div style="margin-bottom: 8px; padding: 6px 10px; background: var(--dtm-deep); border: 2px solid var(--c-black); box-shadow: 2px 2px 0 var(--c-black);">
						<div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap; font-size: 11px; font-weight: bold; color: var(--dtm-gold);">
							<span>\u4F7F\u7528\u6642\u306B\u306F</span>
							<a href="${n}" target="_blank" rel="noopener noreferrer" style="color: var(--dtm-primary); text-decoration: underline;">${t}UTAU\u97F3\u6E90</a>
							<span>\u306E\u5229\u7528\u898F\u7D04\u306B\u5F93\u3063\u3066\u304F\u3060\u3055\u3044</span>
						</div>
					</div>
				`}o.innerHTML=s;let c=z.createElement(`div`);c.className=`dtm-consent-footer`;let l=z.createElement(`button`);return l.type=`button`,l.className=`dtm-btn dtm-btn--success`,l.textContent=`同意して利用する`,l.onclick=()=>{for(let e of t){try{typeof localStorage<`u`&&localStorage&&localStorage.setItem(`dtm_agreed_terms_${e}`,`true`)}catch{}il.add(e)}r.remove(),ft=null,e&&e()},c.appendChild(l),i.append(a,o,c),r.appendChild(i),z.body.appendChild(r),ft=r,!0}catch(e){return console.error(`[dtm-player] Error in checkConsentAndShow:`,e),!1}},gt=(e,t)=>{if(t.offsetWidth===0||e.clientWidth===0)return;let n=t.offsetLeft+t.offsetWidth/2,r=Math.max(0,e.scrollWidth-e.clientWidth),i=n-e.clientWidth/2;e.scrollLeft=Math.max(0,Math.min(i,r))},_t=e=>{let t=Math.floor(e);xt=t;let n=Math.floor(e/$c)%4;for(let e=0;e<4;e++)qe[e].classList.toggle(`dtm-player-beat-dot--on`,e===n);Je.textContent=String(Math.floor(e/el)+1),kt||(W.value=String(Math.min(M,Math.max(0,t))),et(t),Qe());let r=ee[t]??``;Ye.textContent!==r&&(Ye.textContent=r,r&&console.log(`[dtm-player-chord] Active Chord: ${r} (step: ${t})`));for(let t of ut){let n=null;for(let r of t.tokens){let t=e>=r.startStep&&e<r.startStep+r.durationSteps;r.el.classList.toggle(`is-active`,t),t&&!n&&(n=r)}n&&gt(t.lane,n.el)}},vt=()=>{xt=0;for(let e of qe)e.classList.remove(`dtm-player-beat-dot--on`);Je.textContent=`-`,Ye.textContent=``,W.value=`0`,et(0),Qe();for(let e of ut){for(let t of e.tokens)t.el.classList.remove(`is-active`);e.lane.scrollLeft=0}},K=Ec({getTracks:()=>P,getBpm:()=>p,getPlayStartStep:()=>0,getDrumPattern:e=>mt(h,m,e),getSoloTrackId:()=>null,getLoop:()=>A,getAudioTime:ue,getMinEndSec:()=>{let e=C?.getLoaded();if(!e)return 0;let t=k(w),n=E>0?Math.min(E,e.durationSec||E):e.durationSec;return Math.max(0,n-t)},onPlayNote:e=>{let t=Number(e.trackId);if(_e.has(t))return;let r=ye.get(t);if(r&&Ve(r,e.when),d.has(t)&&!bt)return;let i=e.volume*(_/100);n.onPlayNote?.({...e,volume:i}),S&&oe().playNote({...e,volume:i})},onPlayDrum:e=>{let t=e.velocity*(v/100)*(g/100)*(_/100);n.onPlayDrum?.({...e,velocity:t}),S&&oe().playDrum({...e,velocity:t})},onTick:e=>{_t(e)},onEnd:e=>{e&&de(null),Ct()},stepsPerBar:el}),yt=!1,bt=!1,xt=0,St=e=>{yt=e,he.innerHTML=Y(e?`pause`:`play`,12),he.classList.toggle(`dtm-player-play--stop`,e)},Ct=()=>{C?.stop(),St(!1),He(),vt(),rl===Nt&&(rl=null),n.onStop?.()},wt=e=>{_=e,le()?.setVolume(g/100*(_/100))},Tt=e=>[...d.entries()].map(([t,n])=>{let r=[...P.find(e=>Number(e.id)===t)?.notes??[]].sort((e,t)=>e.startStep-t.startStep),i=ws(n.syllables,r,{fromStep:e,secondsPerStep:D,gate:(n.gate??100)/100,octaveShiftUnits:(n.octave??0)*372});return{id:String(t),model:n.model,volume:ao(n.volume??200),pan:mo(n.pan??64),vibrato:n.vibrato,reverbSend:(n.reverb??0)/100,delaySend:(n.delay??0)/100,gender:(n.gender??50)/100,breathiness:(n.breathiness??50)/100,tension:(n.tension??50)/100,octaveUnison:n.octaveUnison,notes:i}}),Et=async e=>{let t=ce&&d.size>0,n=t?Tt(e):[];if(t){let t=se(),r=Yc(at,{skipLabel:`音声合成をスキップ（元のメロディで再生）`,onSkip:()=>{yt&&rl===Nt&&(bt=!0,r.remove(),R(e))}});try{if(f.size>0&&t.registerVoicebanks?.(Object.fromEntries([...f].map(([e,t])=>[e,t.url]))),await t.loadModels(n.map(e=>e.model)),bt)return;let e=performance.now();await t.warm(n,3,(t,n)=>{if(!bt){if(t===0)r.setProgress(t,n);else{let i=(performance.now()-e)/1e3/t,a=n-t,o=Math.ceil(a*i);r.setProgress(t,n,o)}}})}catch(e){console.warn(`[dtm] voice preload failed`,e)}finally{r.remove()}if(!yt||rl!==Nt||bt)return}w=e;let r=C?.isLoaded()?s({fromStep:e,offsetSec:O}):0,i=k(e),a=null;if(C?.isLoaded()&&i>=T&&(a=await C.startRolling({mediaSec:i-r,rangeStartSec:T,endSec:E||void 0}),!yt||rl!==Nt))return;let o=c({rolled:a,mediaAtSongStart:i,now:ue(),startDelaySec:Cc,fallbackPreRollSec:r});if(R(e,o),C?.isLoaded()&&(a?C.rebase({atTime:K.getStartTime(),mediaSec:i},{snap:!0}):C.start({atTime:K.getStartTime()-r,mediaSec:i-r,rangeStartSec:T,endSec:E||void 0})),t&&!bt){let e=se();e.setVolume(g/100*(_/100));let t,r;A&&(r=0,t=M*D),e.startStream(n,K.getStartTime(),{isAudible:e=>!_e.has(Number(e.id)),loopLengthSec:t,loopStartSec:r,onLateSkip:()=>{it(`音声合成が間に合わないため、一部の発音をスキップしました`)}})}},q=(e=0)=>{yt||j.length===0||G(()=>q(e))||(rl&&rl!==Nt&&rl.stop(),rl=Nt,bt=!1,St(!0),(async()=>{let t=[],r=n.onResumeAudio?.();if(r&&t.push(r),S){let e=ne();e.state===`suspended`&&t.push(e.resume())}C&&t.push(lt()),t.length>0&&await Promise.all(t),yt&&rl===Nt&&(C?.isLoaded()&&(await C.arm(k(e)-s({fromStep:e,offsetSec:O})),!yt||rl!==Nt)||(ce&&d.size>0&&se().reset(),await Et(e)))})())},Dt=()=>{yt&&(K.stop(),de(null),C?.stop(),le()?.stopStream(),Ct())},Ot=()=>{yt&&(K.stop(),de(null),C?.stop(),le()?.stopStream(),He(),St(!1),rl===Nt&&(rl=null),n.onStop?.())},kt=!1,At=null,jt=e=>{let t=Math.min(M,Math.max(0,Math.round(e)));_t(t),yt&&(K.stop(),de(null),le()?.stopStream(),He(),St(!1),q(t))},Mt=()=>{kt=!1;let e=Number(W.value);At!==e&&(At=e,jt(e))};W.addEventListener(`pointerdown`,e=>{kt=!0,At=null;try{W.setPointerCapture(e.pointerId)}catch{}}),W.addEventListener(`input`,()=>{_t(Number(W.value)),Qe()}),W.addEventListener(`change`,()=>{Mt()}),W.addEventListener(`pointerup`,e=>{try{W.releasePointerCapture(e.pointerId)}catch{}Mt()}),W.addEventListener(`pointercancel`,e=>{try{W.releasePointerCapture(e.pointerId)}catch{}kt=!1}),he.addEventListener(`click`,()=>{yt?Ot():q(Number(W.value))}),ge.addEventListener(`click`,()=>{A=!A,ge.classList.toggle(`dtm-player-loop--on`,A),ge.title=A?`LOOP ON`:`LOOP OFF`,yt&&jt(xt)});let Nt={play:q,stop:Dt,isPlaying:()=>yt,setVolume:wt,destroy:()=>{z.removeEventListener(`click`,je),K.stop(),de(null),C?.destroy(),le()?.stopStream(),rl===Nt&&(rl=null),te&&=(te.close(),null);for(let e of Ue)clearTimeout(e);He(),ol&&pe.includes(ol)&&fl();for(let e of pe)e.remove();fe.remove(),ft?.remove(),Pe()}};return Nt},jl=e=>new Promise((t,n)=>{let r=document.createElement(`script`);r.onload=()=>{t(r),r.remove()},r.onerror=n,r.src=e,document.head.append(r)}),Ml=class e{constructor(e,t,n,r=`none`,i=vt){this.zones=e,this.ch=t,this.isDrum=n,this.tone=r,this.style=i}zones;ch;isDrum;tone;style;static fonts=new Map;static ch=-1;static attackSec=.005;static minReleaseSec=.004;static envelopes={bass:{decaySec:.06,sustain:.9,releaseSec:.12},pluck:{decaySec:.1,sustain:.95,releaseSec:.18},organ:{decaySec:.02,sustain:1,releaseSec:.05},sustain:{decaySec:.15,sustain:.9,releaseSec:.3},pad:{decaySec:.2,sustain:.95,releaseSec:.8}};static humanizeDetuneCents=4;static humanizeGainRatio=.06;static drumRoundRobinOffsetSec=.0025;static drumHumanizeGainRatio=.09;static drumHumanizeDetuneCents=10;static drumTiltHz=3e3;static drumTiltMaxDb=1.5;static brightnessMinHz=2400;static brightnessMaxHz=2e4;static brightnessQ=Math.SQRT1_2;static brightnessBypassAbove=.98;static brightnessJitterRatio=.1;static bassBrightnessMinHz=500;static bassBrightnessMaxHz=14e3;static windBrightnessMinHz=900;static windBrightnessMaxHz=16e3;static longToneThresholdSec=.35;static vibratoRateHz=5.5;static vibratoDepthCents=12;static vibratoFadeSec=.2;static toURL(e){return`https://surikov.github.io/webaudiofontdata/sound/${e}.js`}static async load({ctx:t,fontName:n,url:r,isDrum:i=!1,pitchs:a}){if(n in window||await jl(r),!(n in window))throw Error(`SoundFont is not found.`);let{fonts:o}=e;if(!o.has(n)){let r=new Map,s=-1,c=window;for(let[e,i]of await Nl(t,n,c[n].zones,a)){if(!i.buffer)continue;let{numberOfChannels:t}=i.buffer;s<t&&(s=t),r.set(Number(e),i)}e.ch<s&&(e.ch=s),o.set(n,new e(r,s,i,Fl(n),Il(n)))}let s=o.get(n);if(!s)throw Error(`SoundFont load failed.`);return s}play({ctx:t,destination:n,pitch:r=60,volume:i=1,velocity:a,detuneCents:o=0,when:s=0,duration:c=1}={}){t??=new AudioContext,n??=t.destination;let{zones:l,isDrum:u}=this;if(!l.has(r))return;let d=l.get(r);if(!d)return;let f=t.createBufferSource(),p=t.createGain(),m=s+t.currentTime,{buffer:h,_param:g}=d;if(!h||!g)return;f.buffer=h,f.playbackRate.setValueAtTime(g.playbackRate,0),Object.assign(f,g.src);let _=(Math.random()*2-1)*(u?e.drumHumanizeDetuneCents:e.humanizeDetuneCents),v=1+(Math.random()*2-1)*(u?e.drumHumanizeGainRatio:e.humanizeGainRatio);f.detune.setValueAtTime(_+o,0);let y=i*v,b=u?Math.random()*e.drumRoundRobinOffsetSec:0,x=a===void 0?1:Math.max(0,Math.min(1,a/127)),S=!u&&x<e.brightnessBypassAbove||u?t.createBiquadFilter():void 0;if(S&&u)S.type=`peaking`,S.frequency.setValueAtTime(e.drumTiltHz,0),S.Q.setValueAtTime(1,0),S.gain.setValueAtTime((Math.random()*2-1)*e.drumTiltMaxDb,0);else if(S){let t=this.style.brightness,n=t===`bass`?e.bassBrightnessMinHz:t===`wind`?e.windBrightnessMinHz:e.brightnessMinHz,r=t===`bass`?e.bassBrightnessMaxHz:t===`wind`?e.windBrightnessMaxHz:e.brightnessMaxHz,i=t==="default"?n+(r-n)*x:n*(r/n)**x,a=1+(Math.random()*2-1)*e.brightnessJitterRatio;S.type=`lowpass`,S.frequency.setValueAtTime(i*a,0),S.Q.setValueAtTime(e.brightnessQ,0)}p.gain.setValueAtTime(0,t.currentTime);let C=Math.max(t.currentTime,m);p.gain.setValueAtTime(0,C);let w=e.envelopes[this.style.env]??e.envelopes.sustain,T=g.playbackRate*2**((_+o)/1200),E=m+(h.duration-b)/T,D=f.loop?1/0:E,O=Math.min(C+e.attackSec,D),k=Math.min(Math.max(O,O+w.decaySec),D),A=Math.min(e.minReleaseSec,Math.max(0,D-k)),j=Math.min(Math.max(k,m+c),D-A),M=u?E:Math.max(Math.min(j+w.releaseSec,D),j+A);if(u){p.gain.linearRampToValueAtTime(y,O);let t=Math.max(O,M-e.minReleaseSec);t>O&&p.gain.setValueAtTime(y,t),p.gain.linearRampToValueAtTime(0,M)}else{let e=y*w.sustain;p.gain.linearRampToValueAtTime(y,O),p.gain.linearRampToValueAtTime(e,k),p.gain.setValueAtTime(e,j),p.gain.linearRampToValueAtTime(0,M)}S?f.connect(S).connect(p):f.connect(p),p.connect(n);let N,ee;!u&&this.style.vibrato&&c>=e.longToneThresholdSec&&(N=t.createOscillator(),N.type=`sine`,N.frequency.setValueAtTime(e.vibratoRateHz,0),ee=t.createGain(),ee.gain.setValueAtTime(0,C),ee.gain.linearRampToValueAtTime(e.vibratoDepthCents,C+e.vibratoFadeSec),N.connect(ee).connect(f.detune),N.start(m),N.stop(M)),f.start(m,b),f.stop(M),f.onended=()=>{f.disconnect(),S?.disconnect(),p.disconnect(),N?.disconnect(),ee?.disconnect()}}},Nl=(e,t,n,r=[])=>{if(!r.length)for(let e of n){let t=e.keyRangeLow|0,n=e.keyRangeHigh|0;if(!(t>n))for(let e=t;e<=n;e++)r.push(e)}let i=new Set(r),a=new Map(r.map(e=>[e,n[0]]));for(let e=n.length-1;e>=0;e--)for(let t of i){let r=n[e];t<r.keyRangeLow||t>r.keyRangeHigh||(i.delete(t),a.set(t,{...r}))}return Promise.all([...a].map(async([n,r])=>(await Rl(e,t,r),await zl(r,n),[n,r])))},Pl=e=>{let t=e.match(/_tone_(\d+)_/);return t?Math.floor(Number(t[1])/10):null},Fl=e=>{let t=Pl(e);return t===null?`none`:yt(t)},Il=e=>{let t=Pl(e);return t===null?vt:K(t)},Ll=e=>{let t=Il(e).env;return t===`pluck`||t===`bass`},Rl=async(e,t,n)=>{if(!n.buffer){if(n.delay=0,n.sample){let t=atob(n.sample);n.buffer=e.createBuffer(1,t.length/2,n.sampleRate);let r=n.buffer.getChannelData(0);for(let e=0;e<t.length/2;e++){let n=t.charCodeAt(e*2),i=t.charCodeAt(e*2+1);n<0&&(n=256+n),i<0&&(i=256+i);let a=i*256+n;a>=32768&&(a-=65536),r[e]=a/65536}}else if(n.file){let t=Uint8Array.from(atob(n.file),e=>e.charCodeAt(0)).buffer;if(e.state===`interrupted`)try{await e.resume()}catch{}try{n.buffer=await e.decodeAudioData(t)}catch(e){throw console.error(`[zone.file format] keyRange: ${n.keyRangeLow}-${n.keyRangeHigh} - Decode failed:`,e),e}}if(n.buffer&&n.loopStart>=1&&n.loopStart<n.loopEnd&&(n.loopEnd-n.loopStart)/n.sampleRate<.03){let r=n.buffer,i=r.sampleRate,a=i/n.sampleRate,o=Math.round(n.loopStart*a),s=Math.round(n.loopEnd*a),c=s-o;if(c>0){let l=Math.round(.2*i),u=Math.ceil(l/c),d=Math.min(o,r.length),f=Math.max(0,r.length-s),p=d+c*u+f,m=0,h=0;for(let e=0;e<r.numberOfChannels;e++){let t=r.getChannelData(e);for(let e=0;e<t.length;e++){let n=Math.abs(t[e]);n>m&&(m=n),e>=o&&e<s&&n>h&&(h=n)}}let g=Ll(t),_=g?.4:.75,v=g?6:20,y=1;h>0&&m>0&&h<m*.8&&(y=m*_/h,y>v&&(y=v));try{let t=e.createBuffer(r.numberOfChannels,p,i);for(let e=0;e<r.numberOfChannels;e++){let n=r.getChannelData(e),i=t.getChannelData(e);for(let e=0;e<d;e++){let t=d>1?e/(d-1):0,r=1+(y-1)*t;i[e]=n[e]*r}let a=d,l=n.subarray(o,s),p=new Float32Array(c);for(let e=0;e<c;e++)p[e]=l[e]*y;for(let e=0;e<u;e++)i.set(p,a),a+=c;if(f>0&&s<r.length){let e=n.subarray(s);if(y!==1){let t=new Float32Array(f);for(let n=0;n<f;n++)t[n]=e[n]*y;i.set(t,a)}else i.set(e,a)}}n.buffer=t,n.loopEnd=n.loopStart+c/a*u}catch(e){console.warn(`[SoundFont.loopExtension] Failed to extend loop buffer:`,e)}}}for(let[e,t]of[[`loopStart`,0],[`loopEnd`,0],[`coarseTune`,0],[`fineTune`,0],[`originalPitch`,6e3],[`sampleRate`,44100],[`sustain`,0]])Number.isNaN(Number(n[e]))&&(n[e]=t)}},zl=(e,t)=>{let{originalPitch:n,loopStart:r,loopEnd:i,coarseTune:a,fineTune:o,sampleRate:s,delay:c}=e,l=n-100*a-o,u=2**((100*t-l)/1200),d={loop:r>=1&&r<i};d.loop&&([d.loopStart,d.loopEnd]=[r,i].map(e=>e/s+c)),e._param={playbackRate:u,src:d}},Bl=[{fg:`#29adff`,bg:`#0a1833`,border:`#29adff`},{fg:`#ff77a8`,bg:`#1a0512`,border:`#ff77a8`},{fg:`#ffec27`,bg:`#1a1500`,border:`#ffec27`},{fg:`#00e436`,bg:`#001a08`,border:`#00e436`},{fg:`#83769c`,bg:`#0e0c14`,border:`#83769c`},{fg:`#ffa300`,bg:`#1a0d00`,border:`#ffa300`}],Vl=`FluidR3_GM_sf2_file`,Hl={square:{label:`SQUARE`,gmName:null},piano:{label:`PIANO`,gmName:`Acoustic Grand Piano`},epiano:{label:`E.PIANO`,gmName:`Electric Piano 1`},guitar:{label:`GUITAR`,gmName:`Acoustic Guitar (nylon)`},strings:{label:`STRINGS`,gmName:`String Ensemble 1`},organ:{label:`ORGAN`,gmName:`Church Organ`},bell:{label:`BELL`,gmName:`Tubular Bells`},pad:{label:`PAD`,gmName:`Pad 2 (warm)`},vibraphone:{label:`VIBRA`,gmName:`Vibraphone`},choir:{label:`CHOIR`,gmName:`Choir Aahs`},harp:{label:`HARP`,gmName:`Orchestral Harp`},flute:{label:`FLUTE`,gmName:`Flute`}},Ul=e=>{let t=e.match(/^#\s*(?:tone|instrument)\s*=\s*([a-zA-Z]+)\s*$/im);return t?t[1].toLowerCase():null},Wl=e=>!/^#\s*metronome\s*=\s*off\s*$/im.test(e),Gl=e=>{let t=e.match(/^#\s*bpm\s*=\s*(\d+)\s*$/im);if(!t)return null;let n=Number.parseInt(t[1],10);return Number.isNaN(n)?null:Math.max(40,Math.min(240,n))},Kl=e=>{let t=e.match(/^#\s*loop\s*=\s*(on|off|1|0|true|false)\s*$/im);if(!t)return null;let n=t[1].toLowerCase();return n===`on`||n===`1`||n===`true`},ql=null,Jl=async()=>(ql||=await r(),ql),Yl=new Map,Xl=new Map,Zl=(e,t)=>{if(Yl.has(t))return Promise.resolve(Yl.get(t));if(Xl.has(t))return Xl.get(t);let n=(async()=>{try{let n=(await Jl())[t];if(!n)throw Error(`GM name not found: ${t}`);let r=`${n}_${Vl}`,i=await Ml.load({ctx:e,fontName:`_tone_${r}`,url:Ml.toURL(r)});return Yl.set(t,i),i}catch(e){return console.warn(`[chord-player] WAF load failed for "${t}", fallback to synth`,e),null}finally{Xl.delete(t)}})();return Xl.set(t,n),n},Ql=new Map,$l=new Map,eu=(e,t)=>{if(Ql.has(t))return Promise.resolve(Ql.get(t));if($l.has(t))return $l.get(t);let n=(async()=>{try{let n=`_drum_${t}_0_${Vl}`,r=`https://surikov.github.io/webaudiofontdata/sound/128${t}_0_${Vl}.js`,i=await Ml.load({ctx:e,fontName:n,url:r,isDrum:!0,pitchs:[t]});return Ql.set(t,i),i}catch(e){return console.warn(`[chord-player] Drum WAF load failed for pitch ${t}`,e),null}finally{$l.delete(t)}})();return $l.set(t,n),n},tu=/[|lｌ→]/,nu=e=>e.replace(/[！-～]/g,e=>String.fromCharCode(e.charCodeAt(0)-65248)).replace(/　/g,` `),ru=/^[=_]$|^N\.C\.$|^N$/i,iu=(e,t)=>{let n=nu(e).split(`
`).map(e=>e.trim()).filter(e=>e),r=[],i=0,a=0;for(let e of n){if(/^#/.test(e)){let t=e.replace(/^#\s*/,``).trim();if(/^t\d+$/i.test(t)||/^tone\s*=/i.test(t)||/^instrument\s*=/i.test(t)||/^metronome/i.test(t))continue;(r.length>0||i>0)&&a++,r.push({type:`section`,section:t,colorIdx:a});continue}let n=e.split(tu);if(n.length===0)continue;let o=n.length>1,s=[];for(let e=0;e<n.length;e++){o&&e>0&&s.push({text:`|`,isChord:!1,eventIdx:-1});let r=n[e].trim();if(!r)continue;let a=[];for(let e=0;e<r.length;e++){let t=r[e];if(t===`=`||t===`%`||t===`_`){a.push(e),a.push(e+1);continue}let n=r.slice(e);if(/^N\.C\.(?:\b|\s|$)/i.test(n)){a.push(e),a.push(e+4),e+=3;continue}if(/^N(?:\b|\s|$)/i.test(n)){a.push(e),a.push(e+1);continue}if(/^[A-G]$/.test(t)){let t=r[e-1],n=r.slice(Math.max(0,e-2),e);if(t===`/`||n.toLowerCase()===`on`)continue;a.push(e)}}let c=Array.from(new Set(a)).filter(e=>e>=0&&e<r.length).sort((e,t)=>e-t);if(c.length===0){let e=!ru.test(r);s.push({text:r,isChord:!0,eventIdx:e&&i<t?i:-1}),e&&i++;continue}for(let e=0;e<c.length;e++){e>0&&s.push({text:``,isChord:!1,eventIdx:-1});let n=c[e],a=e<c.length-1?c[e+1]:r.length,o=r.slice(n,a).trim();if(o){let e=!ru.test(o);s.push({text:o,isChord:!0,eventIdx:e&&i<t?i:-1}),e&&i++}}}s.length>0&&r.push({type:`bar`,colorIdx:a,parts:s})}return r},au=(e,t,n={})=>{let r=e.ownerDocument;Jc(r);let i=n.bpm??Gl(t)??120,a=-1,o=!1,s=null,c=!1,l=n.volume??80,u=!1,d=0,f=n.loop??Kl(t)??!1,p=Wl(t),m=0,h=0,g=null,_=null,v=null,y=0,b=0,x=0,S=Ul(t),C=(S&&(S===`piano`||S===`guitar`||S===`strings`)?Hl[S]:void 0)??Hl.piano,w=S===`guitar`?`guitar`:S===`strings`?`strings`:`piano`,T=C.gmName,E=()=>{if(!_)return;let{gain:e,ctx:t}=_;_=null;let n=t.currentTime;e.gain.cancelScheduledValues(n),e.gain.setValueAtTime(e.gain.value,n),e.gain.linearRampToValueAtTime(0,n+.03),setTimeout(()=>e.disconnect(),80)},D=()=>{v!==null&&(clearTimeout(v),v=null)},O=[];try{O=ut(t,i)}catch{O=[]}let k=iu(t,O.length),A=60/i*4,j=A/192,M=60/i,N=O.length>0?O[O.length-1].when+O[O.length-1].duration:0,ee=r.createElement(`div`);ee.className=`dtm-chord-player`;let P=r.createElement(`div`);P.className=`dtm-cp-ctrl`;let F=r.createElement(`button`);F.type=`button`,F.className=`dtm-player-play`;let te=e=>{e?(F.classList.add(`dtm-player-play--stop`),F.innerHTML=Y(`pause`,12),F.title=`PAUSE`):(F.classList.remove(`dtm-player-play--stop`),F.innerHTML=Y(`play`,12),F.title=`PLAY`)};te(!1);let ne=e=>{u=e,F.disabled=e,e?(F.classList.remove(`dtm-player-play--stop`),F.innerHTML=`<span class="dtm-cp-spinner"></span>`,F.title=`Loading...`):te(c)},re=r.createElement(`button`);re.type=`button`,re.className=`dtm-cp-loop`,re.innerHTML=Y(`loop`,12),re.title=f?`LOOP ON`:`LOOP OFF`,re.classList.toggle(`dtm-cp-loop--on`,f),re.addEventListener(`click`,()=>{f=!f,re.classList.toggle(`dtm-cp-loop--on`,f),re.title=f?`LOOP ON`:`LOOP OFF`,c&&Ue(Math.max(0,a))});let I=r.createElement(`button`);I.type=`button`,I.className=`dtm-cp-metro`,I.innerHTML=`♩`,I.title=p?`METRONOME ON`:`METRONOME OFF`,I.classList.toggle(`dtm-cp-metro--on`,p),I.addEventListener(`click`,()=>{Ye()});let ie=r.createElement(`div`);ie.className=`dtm-cp-bpm-group`;let ae=r.createElement(`button`);ae.type=`button`,ae.className=`dtm-cp-bpm-btn`,ae.textContent=`−`,ae.title=`BPM -5`;let oe=r.createElement(`input`);oe.type=`number`,oe.className=`dtm-cp-bpm-input`,oe.min=`40`,oe.max=`240`,oe.value=String(i),oe.title=`BPM (クリックで直接入力)`,oe.addEventListener(`change`,()=>{let e=Number.parseInt(oe.value,10);Number.isNaN(e)?oe.value=String(i):H(e)}),oe.addEventListener(`keydown`,e=>{e.key===`Enter`&&oe.blur()});let L=r.createElement(`button`);L.type=`button`,L.className=`dtm-cp-bpm-btn`,L.textContent=`+`,L.title=`BPM +5`,ie.append(ae,oe,L);let se=[{key:`piano`,label:`Piano`,emoji:`🎹`},{key:`guitar`,label:`Guitar`,emoji:`🎸`},{key:`strings`,label:`Strings`,emoji:`🎻`}],ce=r.createElement(`select`);ce.className=`dtm-cp-instr-select`,ce.title=`楽器`;let le=e=>{if(w!==e&&(w=e,T=Hl[e].gmName,ue(),T&&!Yl.has(T))){let e=g??n.audioContext;e&&Zl(e,T)}},ue=()=>{ce.value=w};for(let{key:e,label:t}of se){let n=r.createElement(`option`);n.value=e,n.textContent=t,ce.appendChild(n)}ce.addEventListener(`change`,()=>{let e=ce.value;le(e)}),ue(),P.appendChild(F),P.appendChild(re),P.appendChild(I),P.appendChild(ie),P.appendChild(ce);let de=r.createElement(`div`);de.className=`dtm-player-seek-row`;let R=r.createElement(`input`);R.type=`range`,R.className=`dtm-player-seek`,R.min=`0`,R.max=String(Math.max(.01,N)),R.step=`0.01`,R.value=`0`,R.disabled=O.length===0;let z=r.createElement(`span`);z.className=`dtm-player-time`,z.textContent=`0:00 / 0:00`,de.append(R,z);let fe=e=>{let t=Math.floor(e/60),n=Math.floor(e%60);return`${String(t).padStart(2,`0`)}:${String(n).padStart(2,`0`)}`},pe=e=>{z.textContent=`${fe(e)} / ${fe(N)}`};pe(0);let me=()=>{let e=Number(R.max)||1,t=Number(R.value)/e*100;R.style.setProperty(`--fill`,`${t}%`)};me();let he=e=>{pe(e),o||(R.value=String(Math.max(0,Math.min(N,e))),me())},ge=r.createElement(`div`);ge.className=`dtm-player-more-container`;let _e=r.createElement(`button`);_e.type=`button`,_e.className=`dtm-player-more-btn`,_e.innerHTML=Y(`more`,14),_e.title=`メニュー`,ge.appendChild(_e);let ve=r.createElement(`div`);ve.className=`dtm-player-menu`,ve.style.display=`none`;let ye=e=>{let t=r.createElement(`button`);return t.type=`button`,t.className=`dtm-player-menu-item`,t.textContent=e,t},be=ye(`コード進行を表示`),xe=ye(`コード進行とは`),Se=ye(`埋め込む`),Ce=ye(`コード進行コピー`);n._skipInfoModals||(ve.appendChild(be),ve.appendChild(xe),ve.appendChild(Se)),ve.appendChild(Ce),ge.appendChild(ve),P.appendChild(ge),ee.appendChild(P),ee.appendChild(de);let we=e=>{let t=e===void 0?ve.style.display===`none`:e;ve.style.display=t?`flex`:`none`,t?(_e.classList.add(`is-active`),r.addEventListener(`click`,Te)):(_e.classList.remove(`is-active`),r.removeEventListener(`click`,Te))},Te=e=>{ge.contains(e.target)||we(!1)};_e.addEventListener(`click`,e=>{e.stopPropagation(),we()});let Ee=null,De=null,B=()=>{De&&=(De.stop(),De.destroy(),null),Ee?.remove(),Ee=null},Oe=e=>{B();let t=r.createElement(`div`);t.className=`dtm-modal-overlay`;let n=r.createElement(`div`);n.className=`dtm-win dtm-modal`;let i=r.createElement(`div`);i.className=`dtm-modal-header`;let a=r.createElement(`span`);a.className=`dtm-modal-title`,a.textContent=e;let o=r.createElement(`button`);o.type=`button`,o.className=`dtm-modal-close`,o.innerHTML=`&times;`,o.title=`閉じる`,i.append(a,o);let s=r.createElement(`div`);return s.className=`dtm-modal-body`,n.append(i,s),t.appendChild(n),o.addEventListener(`click`,e=>{e.stopPropagation(),B()}),t.addEventListener(`click`,e=>{e.target===t&&B()}),r.body.appendChild(t),Ee=t,s},V=(e,t)=>{let n=r.createElement(`div`);n.style.marginTop=`8px`;let i=r.createElement(`button`);i.type=`button`,i.className=`dtm-btn dtm-btn--primary dtm-btn--xs`,i.textContent=`📋 コピー`,i.addEventListener(`click`,async e=>{e.stopPropagation();let n=await ml(r,t);i.textContent=n?`✓ コピー完了`:`コピー失敗`,n&&i.classList.add(`dtm-btn--success`),setTimeout(()=>{i.textContent=`📋 コピー`,i.classList.remove(`dtm-btn--success`)},1200)}),n.appendChild(i),e.appendChild(n)},ke=e=>{let t=e.querySelectorAll(`.dtm-modal-sample-copy-btn`);for(let e of t){let t=e;t.addEventListener(`click`,async e=>{e.stopPropagation();let n=t.getAttribute(`data-chords`)??``,i=t.textContent,a=await ml(r,n.replace(/\\n/g,`
`));t.textContent=a?`✓ コピー完了`:`コピー失敗`,a&&t.classList.add(`dtm-btn--success`),setTimeout(()=>{t.textContent=i,t.classList.remove(`dtm-btn--success`)},1200)})}let i=null,a=e=>{e&&(e.textContent=`▶ 試聴`,e.classList.remove(`dtm-btn--danger`),e.classList.add(`dtm-btn--primary`))},o=e=>{e.textContent=`■ 停止`,e.classList.remove(`dtm-btn--primary`),e.classList.add(`dtm-btn--danger`)},s=e.querySelectorAll(`.dtm-modal-sample-play-btn`);for(let e of s){let t=e;t.addEventListener(`click`,e=>{e.stopPropagation();let r=(t.getAttribute(`data-chords`)??``).replace(/\\n/g,`
`);if(i===t&&De){De.isPlaying()?De.stop():(De.play(),o(t));return}De&&=(De.stop(),De.destroy(),null),a(i),i=t;let s=t.closest(`.dtm-modal-sample-box`)?.querySelector(`.dtm-modal-sample-player-container`);s&&(s.innerHTML=``,De=au(s,r,{audioContext:n.audioContext??g??void 0,volume:l,bpm:n.bpm??120,studio:n.studio,_skipInfoModals:!0,onStop:()=>{i===t&&a(t)}}),o(t),De.play())})}};n._skipInfoModals||(be.addEventListener(`click`,e=>{e.stopPropagation(),we(!1);let i=Oe(`コード進行を表示`),a=r.createElement(`p`);a.textContent=`このコード進行をコピーして、他のプレイヤーや共有URLに貼り付けて使用できます。`,a.style.marginBottom=`8px`,i.appendChild(a);let o=n.getChords?.()??t,s=r.createElement(`pre`);s.textContent=o,s.style.whiteSpace=`pre-wrap`,s.style.wordBreak=`break-all`,s.style.cursor=`text`,s.addEventListener(`click`,()=>{let e=r.createRange();e.selectNodeContents(s);let t=r.defaultView?.getSelection();t?.removeAllRanges(),t?.addRange(e)}),i.appendChild(s),V(i,o)}),xe.addEventListener(`click`,e=>{e.stopPropagation(),we(!1);let t=Oe(`コード進行の書き方解説`);t.innerHTML=dt,ke(t)}),Se.addEventListener(`click`,async e=>{e.stopPropagation(),we(!1);let i=Oe(`埋め込む`),a=r.createElement(`p`);a.textContent=`生成中...`,i.appendChild(a);try{let e=`<iframe src="${`${n.embedUrl??`https://onjmin.github.io/dtm/demo/embed-chord.html`}#${await wl(n.getChords?.()??t)}`}" width="100%" height="260" frameborder="0" loading="lazy" title="@onjmin/dtm chord progression player"></iframe>`;if(!i.isConnected)return;a.remove();let o=r.createElement(`p`);o.textContent=`このHTMLをブログやサイトに貼り付けると、プレイヤーをそのまま埋め込めます。`;let s=r.createElement(`pre`);s.textContent=e,s.style.whiteSpace=`pre-wrap`,s.style.wordBreak=`break-all`,i.append(o,s),V(i,e)}catch(e){console.error(`[dtm] failed to generate embed snippet`,e),i.isConnected&&(a.textContent=`生成に失敗しました`)}})),Ce.addEventListener(`click`,async e=>{e.stopPropagation(),await ml(r,n.getChords?.()??t)?Ce.textContent=`コピーしました！`:Ce.textContent=`コピー失敗`,setTimeout(()=>{Ce.textContent=`コード進行コピー`},2e3)});let H=e=>{i=Math.max(40,Math.min(240,e));try{O=ut(t,i)}catch{O=[]}A=60/i*4,j=A/192,M=60/i,N=O.length>0?O[O.length-1].when+O[O.length-1].duration:0,oe.value=String(i),R.max=String(Math.max(.01,N)),R.disabled=O.length===0,he(c?m:0),c&&Ue(Math.max(0,a))},Ae=e=>{let t=Math.max(40,Math.min(240,i+e));t!==i&&H(t)},je=(e,t)=>{let n=null,r=()=>{n!==null&&(clearInterval(n),n=null)},i=()=>{Ae(t),n=setTimeout(()=>{n=setInterval(()=>Ae(t),80)},400)};e.addEventListener(`mousedown`,i),e.addEventListener(`touchstart`,e=>{e.preventDefault(),i()},{passive:!1}),e.addEventListener(`mouseup`,r),e.addEventListener(`mouseleave`,r),e.addEventListener(`touchend`,r)};je(ae,-5),je(L,5);let Me=()=>{let e=g??n.audioContext;if(e)for(let t of[`piano`,`guitar`,`strings`]){let n=Hl[t].gmName;n&&Zl(e,n)}},Ne=r.createElement(`div`);Ne.className=`dtm-cp-scroll`;let Pe=[];k.forEach(e=>{let t=Bl[e.colorIdx%Bl.length];if(e.type===`section`){let n=r.createElement(`div`);n.className=`dtm-cp-section`,n.style.setProperty(`--cp-fg`,t.fg),n.style.setProperty(`--cp-bg`,t.bg),n.textContent=e.section??``,Ne.appendChild(n);return}let n=r.createElement(`div`);n.className=`dtm-cp-bar`,e.parts?.forEach(e=>{if(!e.isChord){let t=r.createElement(`span`);t.className=`dtm-cp-pipe`,t.textContent=e.text,n.appendChild(t);return}let i=r.createElement(`span`);i.className=`dtm-cp-chord`,i.style.setProperty(`--cp-fg`,t.fg),i.style.setProperty(`--cp-bg`,t.bg),i.textContent=e.text,i.setAttribute(`data-eidx`,String(e.eventIdx)),e.eventIdx>=0?(i.setAttribute(`role`,`button`),i.setAttribute(`tabindex`,`0`),i.title=`ここから再生`,i.addEventListener(`click`,()=>Ue(e.eventIdx)),i.addEventListener(`keydown`,t=>{(t.key===`Enter`||t.key===` `)&&(t.preventDefault(),Ue(e.eventIdx))})):i.classList.add(`dtm-cp-chord--dead`),n.appendChild(i),Pe.push(i)}),Ne.appendChild(n)}),ee.appendChild(Ne),e.appendChild(ee);let Fe=e=>O.findIndex(t=>e>=t.when&&e<t.when+t.duration),Ie=e=>{if(e!==a){a=e;for(let t of Pe){let n=Number(t.getAttribute(`data-eidx`));n<0||(t.classList.toggle(`dtm-cp-chord--active`,n===e),t.classList.toggle(`dtm-cp-chord--played`,e>=0&&n<e))}if(e>=0){let t=Pe.find(t=>t.getAttribute(`data-eidx`)===String(e));if(t){let e=t.offsetLeft+t.offsetWidth/2,n=Ne.clientWidth/2,r=Ne.scrollWidth-Ne.clientWidth;Ne.scrollLeft=Math.max(0,Math.min(e-n,Math.max(0,r)));let i=t.offsetTop,a=t.offsetHeight,o=Ne.clientHeight,s=Ne.scrollTop;o>0&&(i<s+4?Ne.scrollTop=Math.max(0,i-4):i+a>s+o-4&&(Ne.scrollTop=i+a-o+4))}}}},Le=.12,Re=(e,t)=>{if(!p||!c)return;let n=e.currentTime,r=n-y+b,i=Math.floor(r/M),a=Math.max(x,i);for(;;){let r=y+(a*M-b);if(r>n+Le)break;if(r>=n-.01){let n=a%4==0,i=n?G.bassDrum1:G.closedHihat,o=l/100*(n?.7:.45),s=Ql.get(i);s?s.play({ctx:e,destination:t,pitch:i,volume:o,when:Math.max(0,r-e.currentTime)}):Lc(e,t).playDrum({pitch:i,velocity:o,when:Math.max(0,r-e.currentTime),duration:.3})}a++}x=a,v=setTimeout(()=>Re(e,t),Le/2*1e3)},ze=(e,t,n=!1)=>{if(D(),p){n?(y=e.currentTime,b=h,x=Math.ceil(h/M)):(y=e.currentTime+.1,b=m,x=Math.ceil(m/M));for(let t of[G.bassDrum1,G.closedHihat])Ql.has(t)||eu(e,t);Re(e,t)}},Be=({pitchUnits:e,velocity:t,volume:n,when:r,duration:i,ctx:a,destination:o})=>{let s=T?Yl.get(T):null;if(s){let{midi:c,detuneCents:l}=mn(e);s.play({ctx:a,destination:o,pitch:c,detuneCents:l,volume:n*.85,velocity:t,when:r,duration:i})}else Lc(a,o).playNote({trackId:`chord`,pitchUnits:e,velocity:100,volume:n,when:r,duration:i})},Ve=(e,t,r)=>{let a=l,o=[];for(let e of O){if(e.when<m)continue;let t=Math.floor((e.when-m)/j),n=Math.floor(e.duration/j),r;try{r=[...U(`${e.key}${e.chord}`).notes]}catch{continue}for(let e of r)o.push({trackIndex:3,startStep:t,durationSteps:n,pitchUnits:Tn(48+e),velocity:100})}s=Bc(o,{bpm:i,volume:a,loop:f,audioContext:t,synth:!1,onPlayNote:e=>{Be({pitchUnits:e.pitchUnits,velocity:e.velocity,volume:e.volume,when:e.when,duration:e.duration,ctx:t,destination:r})},pauseWhenHidden:!n.audioContext,onTick:e=>{let t=N-m,n=e*j;t>0&&n>t&&f&&(n%=t);let r=m+n;h=r,Ie(Fe(r)),he(Math.min(r,N))},onStop:()=>{qe()}}),ze(t,r)},He=(e=0)=>{if(c||u||O.length===0)return;let t=Math.max(0,Math.min(e,O.length-1));m=O[t].when,h=m,g??=n.audioContext?null:new AudioContext;let r=n.audioContext??g,i=r.state===`suspended`?r.resume():Promise.resolve(),a=r.createGain();a.connect(r.destination),_={gain:a,ctx:r};let o=()=>{c=!0,te(!0),Ie(t),he(m),Ve(t,r,a)},s=++d;ne(!0);let l=T&&!Yl.has(T)?Zl(r,T):Promise.resolve(null);Promise.all([i,l]).then(()=>{d===s&&(ne(!1),o(),Me())})},Ue=e=>{u&&(++d,ne(!1)),c&&=(s?.destroy(),s=null,D(),E(),!1),He(e)},We=null,Ge=()=>{if(o=!1,N<=0)return;let e=Number(R.value);if(We!==e){We=e;let t=Fe(e);Ue(t>=0?t:Math.max(0,O.length-1))}};R.addEventListener(`pointerdown`,e=>{o=!0,We=null;try{R.setPointerCapture(e.pointerId)}catch{}}),R.addEventListener(`input`,()=>{pe(Number(R.value)),me()}),R.addEventListener(`change`,()=>{Ge()}),R.addEventListener(`pointerup`,e=>{try{R.releasePointerCapture(e.pointerId)}catch{}Ge()}),R.addEventListener(`pointercancel`,e=>{try{R.releasePointerCapture(e.pointerId)}catch{}o=!1});let Ke=()=>{if(u){++d,ne(!1),E();return}c&&(s?.destroy(),s=null,D(),E(),qe())},qe=()=>{c=!1,te(!1),Ie(-1),he(0),n.onStop?.()},Je=()=>{if(u){++d,ne(!1),E();return}c&&(s?.destroy(),s=null,D(),E(),c=!1,te(!1),n.onStop?.())};F.addEventListener(`click`,()=>{c?Je():He(Math.max(0,a))});let Ye=()=>{p=!p,I.classList.toggle(`dtm-cp-metro--on`,p),I.title=p?`METRONOME ON`:`METRONOME OFF`,c&&(p?_&&ze(_.ctx,_.gain,!0):(D(),Ue(Math.max(0,a))))},Xe=e=>{l=Math.max(0,Math.min(100,e)),s?.setVolume(l)},W=()=>{Ke(),B(),we(!1),ee.remove()},Ze=r.createElement(`style`);return Ze.textContent=`
		.dtm-cp-metro {
			background: none;
			border: 1px solid var(--c-black, #000);
			color: var(--dtm-fg, #fff);
			font-size: 13px;
			padding: 2px 6px;
			cursor: pointer;
			border-radius: 2px;
			opacity: 0.45;
			transition: opacity 0.15s, background 0.15s;
		}
		.dtm-cp-metro:hover { opacity: 0.75; }
		.dtm-cp-metro--on {
			opacity: 1;
			background: var(--dtm-primary, #29adff);
			color: #000;
			border-color: var(--dtm-primary, #29adff);
		}
		@keyframes dtm-cp-spin {
			from { transform: rotate(0deg); }
			to   { transform: rotate(360deg); }
		}
		.dtm-cp-spinner {
			display: inline-block;
			width: 10px;
			height: 10px;
			border: 2px solid rgba(255,255,255,0.3);
			border-top-color: #fff;
			border-radius: 50%;
			animation: dtm-cp-spin 0.7s linear infinite;
			vertical-align: middle;
		}

		/* 楽器選択プルダウン（省スペースでスマホでも隠れない） */
		.dtm-cp-instr-select {
			background: rgba(255,255,255,0.06);
			border: 1px solid rgba(255,255,255,0.15);
			border-radius: 4px;
			color: rgba(255,255,255,0.85);
			font-size: 11px;
			font-family: inherit;
			padding: 2px 4px;
			cursor: pointer;
			max-width: 62px;
			flex-shrink: 1;
			min-width: 0;
		}
		.dtm-cp-instr-select:hover {
			background: rgba(255,255,255,0.14);
		}
		.dtm-cp-instr-select option {
			background: #1a1a2e;
			color: #fff;
		}
		/* BPM widget styles */
		.dtm-cp-bpm-group {
			display: flex;
			align-items: center;
			gap: 0;
			border: 1px solid rgba(255,255,255,0.15);
			border-radius: 4px;
			overflow: hidden;
		}
		.dtm-cp-bpm-btn {
			background: rgba(255,255,255,0.06);
			border: none;
			color: rgba(255,255,255,0.7);
			font-size: 14px;
			padding: 1px 7px 2px;
			cursor: pointer;
			line-height: 1;
			user-select: none;
			-webkit-user-select: none;
			transition: background 0.1s;
		}
		.dtm-cp-bpm-btn:hover {
			background: rgba(255,255,255,0.18);
			color: #fff;
		}
		.dtm-cp-bpm-btn:active {
			background: var(--dtm-primary, #29adff);
			color: #000;
		}
		.dtm-cp-bpm-input {
			font-size: 11px;
			color: rgba(255,255,255,0.7);
			background: none;
			border: none;
			padding: 0;
			white-space: nowrap;
			width: 48px;
			text-align: center;
			font-family: inherit;
		}
		.dtm-cp-bpm-input::-webkit-outer-spin-button,
		.dtm-cp-bpm-input::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		.dtm-cp-bpm-input[type=number] {
			-moz-appearance: textfield;
		}
		.dtm-cp-bpm-input:focus {
			outline: none;
			background: rgba(255,255,255,0.15);
			color: #fff;
		}
	`,r.getElementById(`dtm-cp-metro-style`)||(Ze.id=`dtm-cp-metro-style`,r.head.appendChild(Ze)),{element:ee,play:He,stop:Ke,setVolume:Xe,destroy:W,toggleMetronome:Ye,isPlaying:()=>c}},ou=91,su={entropy:[.25,.711,1.208,1.692],valueKinds:[2,3,6,7],restRatio:[.016,.089,.222,.464],leapRatio:[.202,.279,.428,.726],stepRatio:[.174,.415,.617,.693],chromaticRatio:[0,.018,.121,.242],maxLeap:[5,9,12.5,19.5],melodyRange:[8,17,23,31],notesPerBar:[2.743,4.815,6.5,11.995],shortNoteRatio:[.055,.756,.91,1],barDensityCv:[.125,.212,.336,.515],densityCliff:[0,0,.043,.125],sim1:[.345,.468,.611,.803],sim2:[.397,.504,.647,.845],sim4:[.437,.548,.723,.882],sim8:[.386,.565,.772,.972],phraseBreath:[0,.102,.341,.884],turnRatio:[.4,.478,.573,.794],climaxPosition:[.014,.136,.675,.92],climaxPeaks:[1,3,13,26],complementarity:[0,.029,.162,.405]},cu=[`entropy`,`valueKinds`,`restRatio`,`leapRatio`,`stepRatio`,`chromaticRatio`,`maxLeap`,`melodyRange`,`notesPerBar`,`shortNoteRatio`,`barDensityCv`,`densityCliff`,`sim1`,`sim2`,`sim4`,`sim8`,`phraseBreath`,`turnRatio`,`climaxPosition`,`climaxPeaks`,`complementarity`],lu=4,uu={"0,2,4,6,8,10,12,14":620,"0,2,4,6,8,12,14":513,"0,4,6,8,10,12,14":248,"0,8":187,"0,4,8,10,12,14":158,"0,6,8,10,12,14":153,"2,5,10,13":128,"0,12,14":125,"0,4,6,8,12,14":120,"0,4,8,12":110,0:106,"0,2,4,6,8,12":103,"0,4,8,12,14":101,"0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15":89,"0,2,4,6,8":75,"0,6,8,12,14":58,"0,4,6,8,12":49,"0,6,8,14":48,"0,4,8,14":44,"0,2,4,5,6,8,9,10,12,13,14,15":44,"4,12":42,"2,6,10,14":42,"0,8,12":40,"0,2,4,6,8,10,12":39,4:39,"0,3,9,10,11,12,13,14,15":36,"0,3,6,8,11,14":32,"0,2,4,6,7,9,10,12,14":32,"0,2,4,6,10,12,14":31,"0,10,12,14":27,"0,2,4,6,8,14":27,"12,14":25,"0,6,8,12":25,"0,4,6,8,10,12":24,"0,1,2,4,5,6,7,8,9,10,11,12,13,14,15":24,"2,4,6,8,10,12,14":22,"0,1,3,6,7,10,11,12,14":22,"0,6,8":19,"0,12":18,"8,12":17,"0,2,4,8,12,14":16,"0,3,5,6,7,8,11,13,14,15":16,"0,3,4,5,6,7,8,10,12,14":16,"0,14":15,"0,4,8":15,"0,4,6,8,14":14,"0,4,6,8,10,11,12,14":14,"2,4,6,8":13,"0,4,6,10,12,14":13,"0,4,6,8":13,"4,8,12":13,"0,4,12":13,"0,1,2,3,4,6,8,10,12,14":12,"0,4,8,10,11,12,14":12,"0,2,4,6,8,9,12,14":12,"0,3,4,6,8,12,14":12,"0,2,4,6,8,11,14":12,"0,2,4,5,6,7,8,9,10,11,12,14":12,"0,1,3,6,7,10,12,13,14":11,"0,3,4,7,8,11,12,13,14":11,"0,1,3,6,7,10,12,13,14,15":11,"0,3,4,7,8,10,12,13,14":11,"0,1,3,6,7,10,11,12,14,15":11,"0,3,4,7,8,11,13,14":11,"2,4,6,8,12,14":11,"0,2,4,8,10,12":11,"0,1,2,3,4,5,6,7,8,9,10,11,12":11,"0,2,4,6,8,10,11,12,14":10,"0,4,6,7,8,14,15":10,"0,8,10,12,14":10,"0,3,4,6,8,10,12,14":9,"0,2,3,4,6,8,12,14":9,"0,2,4,5,6,8,12,14":9,"0,3,4,6,8,9,10,11,12":9,"0,3,4,6,8,9,10,11,12,14,15":9,"0,3,4,6,7,8,10,12,14,15":9,"0,2,4,5,6,7,8,9,10,12,13,14,15":9,"0,2,4,8,10,12,14":8,"0,2,4,6,8,10,12,14,15":8,"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15":8,"0,3,6,8,12,14":7,"0,1,2,3,4,5,6,7,8":7,"0,4,8,10,12":7,"0,2,3,4,5,6,7,8":7,"0,2,4,14,15":6,"0,1,2,4,6,8,10,12,14,15":6,"0,1,2,4,6,8,10,12,14":6,"0,1,2,3,4,6,8,9,10,12,14":6,"0,1,2,3,4,6,8,9,10,11,12,13,14,15":6,"0,1,2,3,4,6,7,8,10,11,12,14,15":6,"0,2,3,4,6,7,8,10,11,12,14,15":6,"0,3,4,6,8,12":6,"0,2,4,6,10,14":6,"0,6,8,10,14":6,"0,2,3,4,5,6,7,8,9,10,11,12":6,"0,1,2,3,4,6,7,8,10,12,14,15":6,"0,3,6,8,12":6,"2,4,6,8,10,11,12,14":6,"6,8,10,12,14":5,"2,6,8,10,12,14":5,"0,8,12,14":5,"0,3,4,6,8":5,"0,1,2,3,4,6,7,8,9,10,12,14":5,"0,1,2,3,4,6,7,8,9,10,11,12":5,"0,3,4,6,8,10,11,12,14":5,"0,3,6,8":5,"0,1,4,8,9,12,13":5,"10,12,14":5,"0,4,6,8,10,11,12,13,14":5,"12,13,14,15":5,"0,2,4,7,8,14,15":5,"0,4,8,9,10,11,12,13,14,15":5,"0,4,7,8,14,15":5,"0,4,8,9,10,11,12":5,"0,2,6,8,10,12,14":5,"2,4,6,12,14":4,"0,2,4,6,7,8,10,12,14":4,"0,1,3,5,6,7,10,12,13,14,15":4,"4,5,7,8,10,12,13,14":4,"0,2,3,4,5,8,9,12,13":4,"2,3,4,6,8,12,13,14":4,"0,1,2,3,4,5,6,7,8,9,10,11,12,13,14":4,"0,2,4,8,12":4,"4,6,8,10,12":4,"0,2,4,5,6,8,12,13,14,15":4,"0,2,3,4,6,8":4,"0,4,6,8,10,12,13,14":4,"0,6,8,12,14,15":4,"0,4,8,9,10,12,14":4,"0,3,4,7,8,9,10,11,12":4,"0,1,2,3,4,5,7,8,9,10,11,12":4,"2,4,8,12":4,"0,2,4,6,10,12":4,"0,3,4,6,7,8,9,10,12,14":4,"0,3,6,9,11,12":4,"0,1,4,6,8,12,14":4,"2,4,6,14":3,"0,3,4,8":3,"0,2,4,12,14":3,14:3,"0,4,6,12,14":3,"0,6,10,12,14":3,"4,6,8,10,12,14":3,"0,1,2,3,4,8,12,14,15":3,"0,2,4,5,6,7,8,9,10,11,12,13,14,15":3,"0,1,2,3,4,5,6,8,9,10,11,12,14,15":3,"0,1,2,3,4,6,7,8,9,10,11,12,14":3,"0,1,2,4,6,8,9,10,11,12,13,14,15":3,"0,2,3,4,6,8,9,10,11,12,13,14":3,"0,2,4,8,12,13,14,15":3,"0,1,2,3,4,5,6,7,8,9,10,11,12,14,15":3,"0,2,3,4":3,"6,9,12":3,"2,3,4,7,10":3,"2,3,4":3,"4,6,7,8,9,10,11,12,14":3,"0,2,3,4,6,8,10,11,12,14,15":3,"0,1,2,3,4,6,8,10,11,12,13,14":3,"0,2,3,4,6,7,8,9,10,11,12,13,14,15":3,"0,1,2,4,6,7,8,10,11,12,14,15":3,"0,1,2,3,4,6,8,10,11,12,13,14,15":3,"0,1,2,3,4,5,6,8,9,10,11,12,13,14,15":3,"0,2,3,4,8,11,12,13,14,15":3,"0,1,2,3,4,6,8,10,11,12,14,15":3,"0,2,3,4,6,8,9,10,11,12,14,15":3,"0,2,4,6,7,8,10,11,12,14,15":3,"0,1,2,4,6,8,9,10,12,14,15":3,"0,1,2,4,5,6,7,8,9,10,11,12,14,15":3,"0,1,2,3,4,6,7,8,10,11,12,13,14,15":3,"0,3,6,8,10,12,14":3,"0,3,4,6,8,11,12,14":3,"0,1,4,5,8,9,12,13":3,"0,2,4,5,8,9":3,"2,3,4,6,8,9,12,14":3,"0,2,4,8":3,"0,2,3,4,5,6,8,9":3,"2,3,4,6,8,10,12,13":3,"12,14,15":3,"0,2,3,4,6,7,8,10,12":3,"0,2,3,4,5,6,7,8,9,10,12":3,"0,1,2,3,4,5,6,7,8,9,10,11,12,14":3,"0,2,3,4,6,7,8,9,10,11,12":3,"0,4,6,12":3,"0,2,3,6,8,11,14":3,"0,2,6,8,12,14":3,"2,4,6,8,14,15":3,"0,2,4,6,12,14":2,"2,4,6,10,12,14":2,"4,6,10,12,14":2,"0,8,14":2,"2,4,8,10,12,14":2,8:2,"0,2,4,6,8,9,10,11,12,14":2,"0,2,4,6,8,12,13,14":2,"0,1,3,6,7,13,14":2,"0,1,3,6,7,10":2,"0,1,3,6,7,10,13,14":2,"0,1,3,5,6,9,11":2,"0,1,3,5,6,7,9,11,12,13,14":2,"0,1,3,5,6,7,10,13,14":2,"0,6,8,11,12,14":2,"0,1,2,3,4,5,6,7,8,9,11,12,13,14,15":2,"0,1,3,4,5,6,7,8,9,10,11,12,13,14,15":2,"0,6,7,8,10,12":2,"0,3,6,7,8,10,12":2,"1,2,3,4,6,8,10,12,13":2,"0,2,8,10,12,14":2,"0,2,7,8,9,10":2,"4,8,9,10,12,13":2,"0,2,4,7,8,9,10":2,"2,4,7,8,12,15":2,"0,4,7,8,10":2,"0,4,8,9,12,13":2,"0,2,4,5,6,8,9":2,"0,1,4":2,"0,4":2,"0,3,6,10,12,14":2,"0,2,6,10,12,14":2,"0,2,3,4,6,8,14,15":2,"2,4,6,8,12,14,15":2,"0,2,4,6,8,9,10,12":2,"0,3,6,8,10,12":2,"0,3,4,6,8,10,14":2,"0,4,8,11,12,14":2,"0,2,4,6,8,9,10,11,12,13,14":2,"0,2,4,5,6,7,8,9,10,12":2,"0,1,2,4,5,6,8,9,10,11,12,13,14":2,"0,1,2,3,4,6,7,8,9,10,11,12,13,14":2,"0,1,2,3,4,6,7,8,9,10,11,12,13,14,15":2,"0,1,2,4,6,8,9,10,11,12,13,14":2,"0,1,2,3,4,5,6,8,9,10,11,12,13,14":2,"0,1,2,3,4,6,7,8,9,10,12,13,14,15":2,"0,2,4,6,8,9,10,11,12,13,14,15":2,"0,2,3,4,5,6,8,10,12":2,"0,2,3,4,5,6,7,8,10,11,12":2,"0,2,3,4,6,7,8,9,10,12":2,"0,4,5,8,12,13":2,"0,3,4,5,8,11,12,13":2,"0,2,4,7,8,9":2,"0,4,6,7,8,12":2,"0,2,3,4,6,7,8,10,11,12,14":2,"0,2,3,4,5,6,7,8,10,11,12,13":2,12:2,"0,2,4,6,8,13":2,"2,4,6,8,11,14":2,"0,5,8,13":2,"0,2,4,6,8,10,11,12,13,14":2,"0,4,6,8,10,11,12,13,14,15":2,"0,5,8,12":2,"2,4,6,8,14":1,"0,6,7,8,14":1,"0,6,8,14,15":1,"0,6,7,8,10,11,12,13":1,"0,6,7,8,9,10,11,12,14":1,"0,1,2,4,6,7,8,10,11,12,13,14,15":1,"0,4,8,10,11,12":1,"0,6,7,8,11,14":1,"0,2,5,8,11,14":1,"0,2,4,6,8,10,11,12":1,"0,2,3,4,6,8,12":1,"0,4,6,8,11,12,14":1,"0,1,12,14":1,"0,9,12":1,"0,3":1,"0,1":1,"4,6,8,14":1,"2,12,14":1,"2,8,12":1,"0,3,6,8,11":1,"10,12,14,15":1,"0,2,3,6,8,9,11,14":1,"0,2,4,8,10,11":1,"0,2,4,6,7,8,10,12,13":1,"2,3,4,5,8,10,12,13,15":1,"0,2,3,4,5,6,8,10,11,12":1,"4,6,8,10,11,12":1,"0,1,2,3,4,6,8,9,10,13,15":1,"0,1,2,3,4,10,11,12":1,"0,3,6,7,8,9,11":1,"0,2,4,5,8,10,11,15":1,"0,2,4,6,7,8,9,12,13":1,"0,1,2,4,5,8,10,12,13":1,"0,2,3,4,5,6,8,10,11,12,13":1,"4,6,8,10,11,12,13":1,"0,3,8,12,14":1,"0,3,4,5,7,8,9,10,12,14,15":1,"0,2,4,6,8,9,11":1,"10,14":1,"0,2,4,6,9,10,12,14":1,"0,2,4,6,7,9,10,12":1,"0,2,3,5,8,10,12,13,14":1,"0,1,2,3,5,6,7,8,9,10,12,13,14":1,"2,3,4,6,7,8,12,13,14":1,"0,1,2,3,6,7,8,10,12,13,14":1,"2,3,4,5,6,8,9,10,11,12,13,14":1,"0,2,3,4,5,6,7,8,9,10,11,12,13,14":1,"2,3,4,6,8,9,10,11,12,13,14,15":1,"0,3,4,7,8,11,12":1,"0,4,10,12,14":1,"0,3,4,7,8,11,12,15":1,"0,4,12,14":1,"0,4,7,8,10,11,12,14":1,"2,6,8,12":1,"0,2,4,5,6,8":1,"2,6,8,10,12":1,"0,2,4,6,8,12,13,14,15":1,"0,4,6,8,10,11,12":1,"0,4,8,10,11,12,13,14":1,"0,2,3,4,6,7,8,9,10,12,13,14,15":1,"0,2,4,5,6,8,9,10,11,12,13,14":1,"0,3,4,7,8,9,10,12,13":1,"0,1,2,4,6,7,8,9,10,12,13,14,15":1,"0,2,3,4,5,6,8,9,10,11,12,13,14":1,"0,4,6,7,8,10,12,14,15":1,"0,2,4,6,7,8,10,12,14,15":1,"0,1,2,3,4,5,7,8,10,11,12":1,"0,2,4,6,7,8,9,10,11,12,14":1,"0,1,2,4,5,6,7,8,10,12,14,15":1,"0,2,3,4,5,7,8,9,10,11,12":1,"0,2,3,4,6,7,8,10,11,12":1,"0,8,9,10,11,12,13,14,15":1,"14,15":1,"2,4,6,8,12":1,"2,4,8,10,12":1,"0,2,4,8,9,12,14":1,"0,4,5,8,9,12":1,"0,4,8,10,14":1,"0,6,7,12":1,"0,4,5,8,11,12,13":1,"0,2,4,8,9":1,"2,4,7,8,11,12":1,"0,4,7,8,11":1,"0,4,8,12,14,15":1,"0,1,2,4,5,6,7,8,9,10,12":1,"0,1,2,3,4,5,6,7,8,9,10,12":1,"0,2,3,4,5,6,7,8,9,10,12,13,14,15":1,"0,3,4,7,8,9,11,12":1,"0,1,2,3,4,5,6,7,8,10,11,12,13":1,"0,6,8,10,12":1,"0,2,3,4,6,8,10,11,12,14":1,"0,2,4,6,8,10,13":1,"2,6,8":1,"0,2,3,4,6,7,8,12,14":1,"2,4,6,8,10,14":1,"0,2,4":1,"0,2,4,5,6,7,8,9,10":1,"0,2,4,5,6,7,8,9,10,12,13,14":1,"0,3,6,10,14":1,"0,14,15":1,"0,6,7,12,14":1,"0,6,8,10,11,12,14":1},du={key_C:{id:`key_C`,name:`C`,label:`ハ長調 (C)`,mode:`major`,rootShift:0,moodId:`mood_happy`,description:`無垢に喜ばしい、純粋、素朴、出発`},key_Db:{id:`key_Db`,name:`D♭`,label:`変ニ長調 (D♭)`,mode:`major`,rootShift:1,moodId:`mood_melancholy`,description:`悲しみ、憂鬱な、甘美な感傷（嬰ハ長調と同音）`},key_D:{id:`key_D`,name:`D`,label:`ニ長調 (D)`,mode:`major`,rootShift:2,moodId:`mood_triumphant`,description:`意気揚々とした、勝利の、喊声、華やか`},key_Eb:{id:`key_Eb`,name:`E♭`,label:`変ホ長調 (E♭)`,mode:`major`,rootShift:3,moodId:`mood_dark`,description:`厳しい、きつい、それでいて愛に満ちた、荘重`},key_E:{id:`key_E`,name:`E`,label:`ホ長調 (E)`,mode:`major`,rootShift:4,moodId:`mood_fierce`,description:`けんかっ早い、荒々しい、輝かしい情熱`},key_F:{id:`key_F`,name:`F`,label:`ヘ長調 (F)`,mode:`major`,rootShift:5,moodId:`mood_fierce`,description:`怒り狂った、気性の荒い、一時的な悲嘆、激動`},key_Gb:{id:`key_Gb`,name:`G♭`,label:`変ト長調 (G♭)`,mode:`major`,rootShift:6,moodId:`mood_triumphant`,description:`困難の打破、安堵のため息、凱旋（嬰ヘ長調と同音）`},key_G:{id:`key_G`,name:`G`,label:`ト長調 (G)`,mode:`major`,rootShift:-5,moodId:`mood_solemn`,description:`厳粛な、崇高な、幻想、誠実、広がり`},key_Ab:{id:`key_Ab`,name:`A♭`,label:`変イ長調 (A♭)`,mode:`major`,rootShift:-4,moodId:`mood_dark`,description:`死、永遠、裁き、深遠な瞑想`},key_A:{id:`key_A`,name:`A`,label:`イ長調 (A)`,mode:`major`,rootShift:-3,moodId:`mood_happy`,description:`うれしい、牧歌的な、愛の告白、きらびやか`},key_Bb:{id:`key_Bb`,name:`B♭`,label:`変ロ長調 (B♭)`,mode:`major`,rootShift:-2,moodId:`mood_happy`,description:`喜ばしい、風変わりな、陽気な、軽快`},key_B:{id:`key_B`,name:`B`,label:`ロ長調 (B)`,mode:`major`,rootShift:-1,moodId:`mood_fierce`,description:`どぎつい、強烈な、荒っぽい、猛烈`},key_Am:{id:`key_Am`,name:`Am`,label:`イ短調 (Am)`,mode:`minor`,rootShift:0,moodId:`mood_solemn`,description:`柔らかな、物悲しい、敬虔な、素朴な哀愁`},key_Bbm:{id:`key_Bbm`,name:`B♭m`,label:`変ロ短調 (B♭m)`,mode:`minor`,rootShift:1,moodId:`mood_dark`,description:`恐ろしい、暗闇、嘲るような、不気味（嬰イ短調と同音）`},key_Bm:{id:`key_Bm`,name:`Bm`,label:`ロ短調 (Bm)`,mode:`minor`,rootShift:2,moodId:`mood_melancholy`,description:`孤独な、憂鬱な、忍耐、静かな諦念`},key_Cm:{id:`key_Cm`,name:`Cm`,label:`ハ短調 (Cm)`,mode:`minor`,rootShift:3,moodId:`mood_plaintive`,description:`純粋に悲しげな、恋わずらいの、悲劇的`},key_Csm:{id:`key_Csm`,name:`C♯m`,label:`嬰ハ短調 (C♯m)`,mode:`minor`,rootShift:4,moodId:`mood_melancholy`,description:`落胆、泣き叫んだ、悲涙の、深い嘆き`},key_Dm:{id:`key_Dm`,name:`Dm`,label:`ニ短調 (Dm)`,mode:`minor`,rootShift:5,moodId:`mood_solemn`,description:`厳粛な、敬虔な、思索的な、重厚な祈り`},key_Ebm:{id:`key_Ebm`,name:`E♭m`,label:`変ホ短調 (E♭m)`,mode:`minor`,rootShift:6,moodId:`mood_anxious`,description:`深い苦悩、実存的な不安、戦慄（嬰ニ短調と同音）`},key_Em:{id:`key_Em`,name:`Em`,label:`ホ短調 (Em)`,mode:`minor`,rootShift:-5,moodId:`mood_plaintive`,description:`弱々しい、なまめかしい、落ち着きのない、繊細`},key_Fm:{id:`key_Fm`,name:`Fm`,label:`ヘ短調 (Fm)`,mode:`minor`,rootShift:-4,moodId:`mood_plaintive`,description:`ぼんやりした、物悲しい、しめやかな、葬送`},key_Fsm:{id:`key_Fsm`,name:`F♯m`,label:`嬰ヘ短調 (F♯m)`,mode:`minor`,rootShift:-3,moodId:`mood_anxious`,description:`陰気な、激しい憤り、暗い情念`},key_Gm:{id:`key_Gm`,name:`Gm`,label:`ト短調 (Gm)`,mode:`minor`,rootShift:-2,moodId:`mood_anxious`,description:`不満、不安、やるせなさ、悲痛な叫び`},key_Abm:{id:`key_Abm`,name:`A♭m`,label:`変イ短調 (A♭m)`,mode:`minor`,rootShift:-1,moodId:`mood_anxious`,description:`不服な、嘆きの、泣き叫んだ（嬰ト短調と同音）`}},fu=[{id:`mood_happy`,label:`喜ばしい・陽気な曲`,description:`無垢に喜ばしい、牧歌的、愛の告白、風変わりで陽気`,keyIds:[`key_C`,`key_A`,`key_Bb`]},{id:`mood_triumphant`,label:`勝利・力強い曲`,description:`意気揚々、勝利の喊声、困難の打破、安堵のため息`,keyIds:[`key_D`,`key_Gb`]},{id:`mood_fierce`,label:`激しい・荒々しい曲`,description:`けんかっ早い、怒り狂った気性の荒さ、どぎつく猛烈`,keyIds:[`key_E`,`key_F`,`key_B`]},{id:`mood_solemn`,label:`厳粛・幻想的な曲`,description:`厳粛、崇高、幻想、敬虔、思索的、柔らかな物悲しさ`,keyIds:[`key_G`,`key_Dm`,`key_Am`]},{id:`mood_plaintive`,label:`物悲しい・哀愁の曲`,description:`純粋に悲しげ、恋わずらい、落ち着きのない、しめやかな悲哀`,keyIds:[`key_Cm`,`key_Em`,`key_Fm`]},{id:`mood_melancholy`,label:`憂鬱・孤独な曲`,description:`悲しみ、憂鬱、孤独、忍耐、落胆、悲涙の嘆き`,keyIds:[`key_Db`,`key_Bm`,`key_Csm`]},{id:`mood_anxious`,label:`不安・苦悩な曲`,description:`不満、不安、深い苦悩、実存的不安、陰気な憤り、嘆き`,keyIds:[`key_Gm`,`key_Ebm`,`key_Fsm`,`key_Abm`]},{id:`mood_dark`,label:`暗闇・重厚な曲`,description:`厳しい愛、死、永遠、裁き、恐ろしい暗闇、嘲り`,keyIds:[`key_Eb`,`key_Ab`,`key_Bbm`]}],pu=Object.values(du).filter(e=>e.mode===`major`).map(e=>e.id),mu=Object.values(du).filter(e=>e.mode===`minor`).map(e=>e.id),hu=(e,t)=>e[Math.floor(t()*e.length)],gu=(e,t=Math.random)=>{let n=(e??``).trim()||`any`;if(du[n]){let e=du[n],t=fu.find(t=>t.id===e.moodId);return{mode:e.mode,rootShift:e.rootShift,keyName:e.name,keyLabel:e.label,moodLabel:t?.label,description:e.description}}let r=fu.find(e=>e.id===n);if(r){let e=du[hu(r.keyIds,t)];return{mode:e.mode,rootShift:e.rootShift,keyName:e.name,keyLabel:e.label,moodLabel:r.label,description:e.description}}if(n===`major`){let e=du[hu(pu,t)],n=fu.find(t=>t.id===e.moodId);return{mode:`major`,rootShift:e.rootShift,keyName:e.name,keyLabel:e.label,moodLabel:n?.label,description:e.description}}if(n===`minor`){let e=du[hu(mu,t)],n=fu.find(t=>t.id===e.moodId);return{mode:`minor`,rootShift:e.rootShift,keyName:e.name,keyLabel:e.label,moodLabel:n?.label,description:e.description}}let i=du[hu(Object.keys(du),t)],a=fu.find(e=>e.id===i.moodId);return{mode:i.mode,rootShift:i.rootShift,keyName:i.name,keyLabel:i.label,moodLabel:a?.label,description:i.description}},_u=e=>{if(!e||e===`any`)return`全24調からランダムに決定します`;if(e===`major`)return`12の長調の中からランダムに抽選します`;if(e===`minor`)return`12の短調の中からランダムに抽選します`;let t=fu.find(t=>t.id===e);if(t)return`${t.label}\uFF1A${t.description}`;let n=du[e];return n?`${n.label}\uFF1A${n.description}`:``},vu=(e,t)=>{let{stepsPerBar:n,bars:r}=t,i=Math.max(1,n/16),a=[];for(let t=0;t<r;t++){let r=t*n,o=e.filter(e=>e.startStep>=r&&e.startStep<r+n).sort((e,t)=>e.startStep-t.startStep);if(o.length===0){a.push(null);continue}let s=new Set(o.map(e=>Math.round((e.startStep-r)/i))),c=[];for(let e=1;e<o.length;e++)c.push(Math.sign(o[e].pitchSemi-o[e-1].pitchSemi));a.push({onsets:s,contour:c})}return a},yu=(e,t)=>{let n=0;for(let r of e)t.has(r)&&n++;let r=e.size+t.size-n;return r===0?1:n/r},bu=(e,t)=>{let n=Math.max(e.length,t.length);if(n===0)return 1;let r=0;for(let n=0;n<Math.min(e.length,t.length);n++)e[n]===t[n]&&r++;return r/n},xu=(e,t)=>.6*yu(e.onsets,t.onsets)+.4*bu(e.contour,t.contour),Su=(e,t)=>{let n=0,r=0;for(let i=t;i<e.length;i++){let a=e[i],o=e[i-t];a&&o&&(n+=xu(a,o),r++)}return r===0?0:n/r},Cu=(e,t)=>{let{stepsPerBar:n,bars:r}=t,i=n/4,a=0,o=0;for(let t=1;t<r;t+=2){let r=t*n,s=r+n,c=e.filter(e=>e.startStep>=r&&e.startStep<s).sort((e,t)=>e.startStep-t.startStep);if(o++,c.length===0){a++;continue}let l=c[c.length-1],u=s-(l.startStep+l.durationSteps);(l.durationSteps>=i*2||u>=i/2)&&a++}return o===0?0:a/o},wu=(e,t)=>{if(e.length===0)return{climaxPosition:0,climaxPeaks:0};let n=t.bars*t.stepsPerBar,r=[...e].sort((e,t)=>e.startStep-t.startStep),i=Math.max(...r.map(e=>e.pitchSemi)),a=r.find(e=>e.pitchSemi===i),o=0,s=-1/0;for(let e of r)e.pitchSemi<i-2||e.startStep-s<t.stepsPerBar||(o++,s=e.startStep);return{climaxPosition:a?a.startStep/n:0,climaxPeaks:o}},Tu=(e,t)=>{let n=new Uint8Array(t);for(let r of e){let e=Math.min(t,r.startStep+r.durationSteps);for(let t=Math.max(0,r.startStep);t<e;t++)n[t]=1}return n},Eu=(e,t,n)=>{let r=n.bars*n.stepsPerBar;if(t.length===0)return 0;let i=Tu(e,r),a=0;for(let e of t){let t=e.startStep;t<0||t>=r||i[t]||a++}return a/t.length},Du=e=>{let t=[...e].sort((e,t)=>e.startStep-t.startStep),n=0,r=0,i=0;for(let e=1;e<t.length;e++){let a=Math.sign(t[e].pitchSemi-t[e-1].pitchSemi);a!==0&&(r++,i!==0&&a!==i&&n++,i=a)}return r===0?0:n/r},Ou=(e,t,n)=>{let r=vu(e,n);return{turnRatio:Du(e),sim1:Su(r,1),sim2:Su(r,2),sim4:Su(r,4),sim8:Su(r,8),phraseBreath:Cu(e,n),...wu(e,n),complementarity:Eu(e,t,n)}},ku=(e,t)=>{let n=Array(Math.max(1,t.bars)).fill(0);for(let r of e){let e=Math.floor(r.startStep/t.stepsPerBar);e>=0&&e<n.length&&n[e]++}return n},Au=(e,t)=>{if(e.length===0)return{notesPerBar:0,shortNoteRatio:0,barDensityCv:0,densityCliff:0};let n=t.stepsPerBar/8,r=e.filter(e=>e.durationSteps<=n).length,i=ku(e,t),a=i.filter(e=>e>0),o=a.reduce((e,t)=>e+t,0)/Math.max(1,a.length),s=a.reduce((e,t)=>e+(t-o)**2,0)/Math.max(1,a.length),c=0,l=0;for(let e=1;e<i.length;e++)i[e-1]<3||i[e]===0||(l++,i[e]<=i[e-1]*.3&&c++);return{notesPerBar:e.length/Math.max(1,t.bars),shortNoteRatio:r/e.length,barDensityCv:o===0?0:Math.sqrt(s)/o,densityCliff:l===0?0:c/l}},ju=(e,t)=>{if(e.length<8)return{rise:0,resolve:0};let n=e=>e.reduce((e,t)=>e+t,0)/Math.max(1,e.length),r,i;if(t?.verseBars&&t?.chorusBars&&t.verseBars.length>0&&t.chorusBars.length>0)r=n(t.verseBars.map(t=>e[t]??0)),i=n(t.chorusBars.map(t=>e[t]??0));else if(e.length>=16&&e.length<=24)r=n(e.slice(0,4)),i=n(e.slice(8,12));else{let t=Math.floor(e.length*.15),a=Math.max(t+2,Math.floor(e.length*.35)),o=Math.floor(e.length*.55),s=Math.max(o+2,Math.floor(e.length*.75));r=n(e.slice(t,a)),i=n(e.slice(o,s))}let a=n(e),o=e[e.length-1];return{rise:Math.max(0,Math.min(1,(i-r)/.5)),resolve:Math.max(0,Math.min(1,(a-o)/.4+.5))}},Mu=(e,t,n,r,i)=>e>=n&&e<=r?1:e<=t||e>=i?0:e<n?n===t?0:(e-t)/(n-t):i===r?0:(i-e)/(i-r),Nu=(e,t)=>{let n=t[3]-t[0],r=n>0?n*.5:1;return Mu(e,t[0]-r,t[0],t[3],t[3]+r)},Pu=e=>[e.entropy/3,e.restRatio*8,e.leapRatio*2,e.melodyRange/24,e.density.notesPerBar/12,e.density.shortNoteRatio,e.structure.sim1,e.structure.sim2,e.structure.sim4,e.structure.sim8,e.structure.phraseBreath,e.structure.climaxPosition,e.structure.complementarity],Fu=(e,t)=>{let n=0;for(let r=0;r<Math.min(e.length,t.length);r++)n+=(e[r]-t[r])**2;return Math.sqrt(n)},Iu=[{rhythm:[-24,36,36,-24,36,36,-24,36,36,-24,36,36],degrees:[0,0,-1,-1,0,0,0,0],weight:64},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,48,24,24],degrees:[0,-2,3,2,1,2,1,0,4,-1,3,-2,0,-2],weight:30},{rhythm:[24,24,24,24,24,24,24,24,48,48,24,24,24,24],degrees:[0,-1,2,4,3,2,6,5,4,6,7,6,4,3],weight:30},{rhythm:[48,48,24,-24,24,24,48,48,24,24,24,24],degrees:[0,4,3,2,3,4,7,6,4,3,2],weight:16},{rhythm:[48,48,24,-24,24,24,48,48,24,24,24,24],degrees:[0,4,3,2,3,4,9,8,6,4,3],weight:16},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,2,4,2,-1,3,1,-1,2,-1,1,-2,-2,-2,2,1],weight:15},{rhythm:[48,48,72,24,96,-48,24,24],degrees:[0,2,1,0,0,0,-1],weight:15},{rhythm:[24,24,24,24,24,24,24,24,48,48,24,24,24,24],degrees:[0,2,3,4,3,2,6,5,4,6,7,6,5,3],weight:15},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-3,-1,-4,-4,-4,0,-1,-2,0,2,0,-3,1,-1,-3],weight:14},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-3,-3,-3,-4,-5,-7,-8,-7,-8,-7,-1,-3,-4,-5],weight:12},{rhythm:[-24,24,-24,24,-24,24,-24,24,-24,24,-24,24,-24,24,-24,24],degrees:[0,0,0,2,3,3,3,3],weight:12},{rhythm:[24,24,24,24,48,24,24,48,24,24,48,48],degrees:[0,-1,-2,-1,-2,-4,-3,-2,3,2,2,5],weight:11},{rhythm:[24,24,24,24,24,24,24,24,120,-24,24,24],degrees:[0,-2,-1,0,1,2,0,-1,0,-4,-3],weight:11},{rhythm:[48,48,72,24,96,-96],degrees:[0,2,1,0,0],weight:11},{rhythm:[12,12,-12,12,-24,12,24,-12,12,12,12,-12,24,36,12,36,12,36,12,-12,12,24],degrees:[0,-7,-7,-7,0,-7,0,0,-3,-1,-5,2,2,2,-3,-5,2],weight:10},{rhythm:[48,24,24,24,24,24,24,72,24,48,-48],degrees:[0,-1,0,-1,-2,-3,-5,-6,-5,-5],weight:10},{rhythm:[48,24,24,48,24,24,96,-48,24,24],degrees:[0,-1,0,-1,-2,-1,-2,-1,0],weight:10},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,-1,-2,-3,-6,-5,-3,-5,-6,-5,-2,-1],weight:10},{rhythm:[48,24,24,24,24,24,24,72,24,48,-24,24],degrees:[0,-1,0,-1,0,1,0,1,2,2,-1],weight:10},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,-1,0,-1,-2,-3,-5,-5,-5,-3,-5,-5,-2,-1],weight:10},{rhythm:[96,96,96,96],degrees:[0,-1,-1,-2],weight:9},{rhythm:[24,-12,12,-60,12,12,12,12,12,12,12,24,-12,12,-60,12,12,12,12,12,12,12],degrees:[0,-7,-7,-3,-1,0,-3,-5,-7,-1,-8,-8,-4,-2,-1,-4,-7,-8],weight:9},{rhythm:[24,-12,12,-60,12,12,12,12,12,12,12,24,-12,12,-60,12,12,12,12,12,12,12],degrees:[0,-7,-7,-3,-1,0,-3,-5,-7,0,-7,-7,-2,0,0,-2,-4,-7],weight:9},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-2,-1,0,1,0,1,2,1,2,4,1,-4,-3],weight:9},{rhythm:[24,24,24,24,24,24,24,24,24,-24,48,24,24,24,24],degrees:[0,-1,0,1,2,1,4,3,2,4,5,4,3,1],weight:9},{rhythm:[36,36,24,36,36,24,36,36,24,36,36,24],degrees:[0,0,-2,0,0,-2,0,0,-2,0,0,-2],weight:8},{rhythm:[96,96,96,96],degrees:[0,-1,2,-1],weight:8},{rhythm:[48,48,96,96,96],degrees:[0,0,2,0,4],weight:8},{rhythm:[96,96,96,96],degrees:[0,-1,-3,-3],weight:8},{rhythm:[48,48,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,5,4,2,-2,-1,0,-1,2,0,0,2],weight:8},{rhythm:[48,48,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,-3,-4,-5,-4,2,1,-1,-3,2,1],weight:8},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,48,-24,24],degrees:[0,0,0,0,1,0,1,2,1,2,3,4,4],weight:8},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,0,3,2,4,2,4,2,4,2,4,2,5,2,5],weight:8},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,0,3,0,4,2,0,3,0,2,-1,1,-2,0],weight:8},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,0,3,2,4,2,2,4,2,4,2,5,2,5],weight:8},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,2,0,0,-3,0,-1,0,2,0,4,0],weight:8},{rhythm:[24,24,24,24,24,-24,48,24,24,24,24,24,24,24,24],degrees:[0,-3,0,2,0,-1,0,2,3,4,0,0,0,-3],weight:8},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,0,2,0,0,2,4,3,2,3,4,3,2,1,-3],weight:8},{rhythm:[48,24,24,48,24,24,48,24,24,48,24,24],degrees:[0,3,2,2,0,1,0,-1,-2,-2,-1,-1],weight:7},{rhythm:[24,24,24,24,24,24,24,24,36,-12,24,24,48,24,24],degrees:[0,-1,-2,-3,-2,-4,-4,-3,-2,-4,-5,-7,-8,-9],weight:7},{rhythm:[36,36,24,36,36,24,36,36,24,36,36,24],degrees:[0,0,-2,0,0,-2,-1,-1,-3,-1,-1,-3],weight:7},{rhythm:[24,-24,24,-24,24,24,24,24,24,24,24,24,72,-24],degrees:[0,1,0,-1,-3,-4,-3,-4,-3,3,1],weight:7},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-2,-1,0,1,1,0,1,2,1,2,4,1,-4,-3],weight:7},{rhythm:[48,48,24,24,24,24,24,24,24,24,24,24,24,12,12],degrees:[0,2,1,1,1,3,4,3,4,6,2,0,2,2,3],weight:6},{rhythm:[72,24,48,24,24,24,24,24,24,24,-24,48],degrees:[0,1,0,-3,-4,-3,-4,-3,1,0,-7],weight:6},{rhythm:[96,-48,24,24,48,24,24,24,24,24,24],degrees:[0,0,-1,-2,-2,-2,-3,-2,-3,-5],weight:6},{rhythm:[96,-48,24,24,48,-24,24,24,24,24,24],degrees:[0,7,6,5,5,6,5,6,7],weight:6},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,12,24,12,24,24,24],degrees:[0,0,-3,-1,3,2,0,-1,0,0,-3,-1,0,0,0,3,2],weight:6},{rhythm:[24,24,24,12,24,12,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,-3,-1,0,0,0,3,2,0,0,-3,-1,3,2,0,-1],weight:6},{rhythm:[96,96,96,96],degrees:[0,-1,-3,-1],weight:6},{rhythm:[24,24,24,24,24,24,24,24,24,-24,48,48,48],degrees:[0,1,0,1,0,-1,-2,-1,-1,-1,-2,-4],weight:6},{rhythm:[24,-24,24,-24,24,-24,48,24,24,24,24,48,24,24],degrees:[0,-1,0,0,0,2,3,4,0,2,-3],weight:6},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,0,3,-1,2,-1,2,2,5,2,5,2,5,2,5],weight:6},{rhythm:[48,24,24,24,24,48,24,24,24,24,48,-48],degrees:[0,-1,0,2,0,2,5,4,3,2,0],weight:6},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,-1,0,1,0,-1,0,1,2,3,-1,-2],weight:6},{rhythm:[-24,24,-24,24,-24,24,-24,24,-24,24,-24,24,-24,24,-24,24],degrees:[0,0,0,0,-2,-2,-2,-2],weight:6},{rhythm:[24,24,24,24,24,12,12,24,24,24,24,24,24,24,-24,24,24],degrees:[0,4,3,4,0,4,4,3,4,0,4,3,4,0,0,1],weight:5},{rhythm:[-144,12,12,12,12,12,-12,12,-12,24,-12,12,48,-24,12,12],degrees:[0,1,2,3,4,4,6,5,4,0,4],weight:5},{rhythm:[48,48,12,12,12,12,12,12,12,12,48,36,12,48,-24,12,12],degrees:[0,-1,0,-2,1,3,-2,-1,0,1,2,4,3,2,-2,2],weight:5},{rhythm:[48,48,48,24,24,48,-48,24,24,24,24],degrees:[0,4,3,1,-2,-1,3,5,4,3],weight:5},{rhythm:[48,48,48,48,24,24,24,24,24,-24,48],degrees:[0,4,3,6,7,6,4,3,2,3],weight:5},{rhythm:[24,24,24,24,48,24,-24,24,24,24,24,48,24,-24],degrees:[0,-1,0,1,0,-1,-1,-2,-1,0,-1,-2],weight:5},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,48,-48],degrees:[0,-1,-2,-3,-4,2,1,-4,-3,-2,-1,0,1],weight:5},{rhythm:[24,24,24,24,48,24,-24,24,24,24,24,48,24,-24],degrees:[0,-1,0,0,0,-1,-1,-3,-1,0,-1,-2],weight:5},{rhythm:[24,24,24,24,24,24,24,24,120,-24,24,24],degrees:[0,-1,-2,-1,0,2,1,0,1,-5,-4],weight:5},{rhythm:[48,24,24,24,24,48,24,24,24,24,48,24,24],degrees:[0,-1,0,2,0,2,5,4,5,6,7,5,6],weight:5},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,48,24,24],degrees:[0,-1,0,2,0,2,4,5,4,5,6,7,5,6],weight:5},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,-2,-4,0,0,2,2,1,-2,1,3,1,2,1],weight:4},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-2,0,-2,0,1,2,1,2,4,5,-2,0],weight:4},{rhythm:[72,24,24,24,24,24,72,-72,24,24],degrees:[0,2,-1,1,2,3,4,0,2],weight:4},{rhythm:[48,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-4,1,0,-1,0,-1,-2,-3,-4,-3,-3,-1],weight:4},{rhythm:[48,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,2,3,1,4,6,7,6,4,6,4,4,6],weight:4},{rhythm:[24,-24,48,24,24,24,24,24,24,24,24,24,-24,48],degrees:[0,2,1,-1,-3,-1,0,-3,-3,-8,-7,-8],weight:4},{rhythm:[48,24,24,48,24,24,24,24,24,24,48,24,24],degrees:[0,-3,0,2,2,3,4,3,4,7,6,4,3],weight:4},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,48,24,24],degrees:[0,-2,0,4,2,1,0,1,2,0,-2,-5,-5,-3],weight:4},{rhythm:[48,24,24,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,-3,0,2,3,4,2,4,5,5,6,9,8,4],weight:4},{rhythm:[24,24,24,24,24,24,24,24,48,24,24,24,24,24,24],degrees:[0,-2,2,-2,1,-1,-4,-1,2,-1,1,2,5,4,2],weight:4},{rhythm:[24,24,24,24,24,24,24,24,48,24,24,24,24,24,24],degrees:[0,2,3,5,4,1,4,1,4,1,3,4,1,6,4],weight:4},{rhythm:[24,24,24,24,24,24,24,24,48,24,24,24,24,24,24],degrees:[0,2,4,2,3,1,-2,3,4,1,3,4,1,6,4],weight:4},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-3,-1,0,-3,2,0,-2,-4,0,-4,-1,-3,-6,-3],weight:4},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-3,-1,0,3,2,0,-4,-2,-1,1,0,-3,0,-3],weight:4},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-3,-1,0,-3,2,0,-4,-2,0,-2,-1,-3,-6,-1],weight:4},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-3,-1,0,-3,2,0,-1,1,3,-1,3,-3,4,-1],weight:4},{rhythm:[48,24,24,24,24,24,24,48,24,24,24,24,24,24],degrees:[0,7,7,6,3,6,3,-1,6,3,-2,5,2,-2],weight:4},{rhythm:[24,-24,24,-24,24,24,24,24,24,24,24,24,48,24,-24],degrees:[0,1,0,-1,-3,-4,-3,-4,-3,-1,-3,-4],weight:4},{rhythm:[96,96,96,96],degrees:[0,0,-1,-1],weight:4},{rhythm:[24,24,24,-24,24,-24,24,24,24,24,24,-24,24,-24,24,24],degrees:[0,0,0,1,1,1,2,2,2,1,1,1],weight:4},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,-72],degrees:[0,0,0,0,-1,-1,-1,-1,-2,-3,-4,-5],weight:4},{rhythm:[48,24,24,48,24,24,24,-12,24,-12,24,-12,24,12,24,-24],degrees:[0,3,2,0,2,-3,-2,3,0,0,0,0],weight:4},{rhythm:[24,-12,12,12,-12,12,-12,24,-24,12,-12,12,-12,24,-12,12,12,-12,12,-12,24,-24,24,-24],degrees:[0,0,2,3,4,6,4,3,3,4,3,0,-1],weight:4},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-2,-3,-4,-2,-6,-5,-4,-6,-4,-2,-3,-4,-3,0],weight:4},{rhythm:[24,24,24,24,24,24,24,24,48,-24,24,24,24,24,24],degrees:[0,1,3,4,-1,-4,-3,-1,0,-1,0,-1,0,1],weight:4},{rhythm:[24,24,24,24,24,24,24,24,48,-24,24,24,24,24,24],degrees:[0,2,-1,0,-3,-8,-7,-5,-4,-5,-4,-5,-4,-5],weight:4},{rhythm:[24,24,24,24,24,24,24,24,48,-24,24,24,24,24,24],degrees:[0,1,3,4,-1,3,1,4,3,4,3,1,3,5],weight:4},{rhythm:[96,96,96,48,48],degrees:[0,-1,2,0,0],weight:4},{rhythm:[96,96,96,48,48],degrees:[0,-1,0,2,3],weight:4},{rhythm:[48,24,24,24,24,48,24,24,24,24,96],degrees:[0,-1,0,2,0,2,5,4,3,2,0],weight:4},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-24,24,12,-12],degrees:[0,-1,0,-1,0,1,0,-1,0,1,2,3,-1,-2],weight:4},{rhythm:[96,-24,24,24,24,36,12,48,48,-48],degrees:[0,2,3,5,4,4,5,6],weight:3},{rhythm:[48,24,36,-12,24,24,24,48,-48,48,48],degrees:[0,-5,-3,-3,-2,-2,-3,1,0],weight:3},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,0,0,0,0,-1,-3,-1,-3,-3,-4,-3,-3,-1],weight:3},{rhythm:[48,48,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,3,-1,-4,-3,-3,-3,-6,-8,-7,-7,-6],weight:3},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,48,24,24],degrees:[0,0,2,1,0,-1,-2,-3,-4,-3,-2,-3,-3,-1],weight:3},{rhythm:[48,24,24,48,24,24,48,24,72,24,24],degrees:[0,0,0,-1,-3,-4,-4,-3,-5,-7,-6],weight:3},{rhythm:[-72,24,-12,24,-12,48,-24,12,12,36,24,-12,72],degrees:[0,0,0,3,4,7,7,7],weight:3},{rhythm:[48,-48,48,48,48,-24,24,48,24,24],degrees:[0,0,1,2,4,5,0,5],weight:3},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,2,2,1,-2,-1,-6,-5,-3,-2,2,1,0,-1,-2],weight:3},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,1,2,3,1,0,-1,-1,-3,0,-1,-3,-2],weight:3},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,2,2,1,-2,-1,-6,-5,-3,-2,2,1,0,-1,-2],weight:3},{rhythm:[12,36,12,36,12,36,12,36,12,-12,12,-12,12,12,-24,12,36,-48],degrees:[0,1,1,2,3,4,2,1,1,2,1,0,1,2],weight:3},{rhythm:[-24,12,12,24,12,-12,12,36,12,-12,12,-12,24,24,48,48,-48],degrees:[0,0,0,1,1,2,0,-1,1,-3,-3,-1],weight:3},{rhythm:[12,36,48,12,36,12,36,12,-12,12,12,12,12,12,-12,12,36,-48],degrees:[0,0,1,2,3,1,0,0,1,1,0,0,-1,0,1],weight:3},{rhythm:[24,24,24,48,24,24,24,24,24,24,24,-24,24,24,24],degrees:[0,-1,-1,0,-3,0,2,3,4,-1,0,0,-1,0],weight:3},{rhythm:[72,24,24,24,24,24,72,-72,24,24],degrees:[0,1,2,1,1,-1,-2,-2,1],weight:3},{rhythm:[24,24,24,24,24,24,24,24,96,-24,24,24,24],degrees:[0,0,0,-1,1,2,1,0,-1,-1,0,4],weight:3},{rhythm:[96,96,96,96],degrees:[0,0,0,1],weight:3},{rhythm:[48,24,24,24,24,24,24,48,24,24,36,-12,24,24],degrees:[0,-1,0,1,2,1,-1,-3,-4,-1,-3,-3,-1],weight:3},{rhythm:[72,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,1,1,2,3,6,4,6,7,4,4,3],weight:3},{rhythm:[24,24,24,24,24,24,24,24,96,-24,24,24,24],degrees:[0,-1,0,2,3,3,3,2,0,-1,6,4],weight:3},{rhythm:[72,24,48,24,24,24,24,24,24,48,24,24],degrees:[0,-1,0,-1,0,1,1,-1,0,-1,-6,-4],weight:3},{rhythm:[72,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,1,1,2,3,6,4,6,7,4,4,3],weight:3},{rhythm:[24,24,24,24,24,24,24,24,96,-96],degrees:[0,-1,0,2,3,3,3,2,0],weight:3},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,2,3,4,6,4,6,7,9,7,6,7,4,6,4],weight:3},{rhythm:[24,-24,24,24,24,24,24,24,24,24,24,24,48,-48],degrees:[0,0,1,3,1,0,1,0,1,0,-1,-3],weight:3},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,48,24,24],degrees:[0,-1,2,1,-1,-3,-1,-1,1,3,1,0,0,2],weight:3},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,1,3,1,3,4,6,4,3,4,1,3,1],weight:3},{rhythm:[24,-24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,1,3,1,0,1,0,1,0,-1,-3,-6,-4],weight:3},{rhythm:[24,-24,24,24,24,24,24,24,48,-144],degrees:[0,2,0,4,1,0,-1,0],weight:3},{rhythm:[24,24,24,24,24,24,24,24,48,24,24,24,-24,48],degrees:[0,-1,0,1,0,-1,-3,-1,0,3,4,0,2],weight:3},{rhythm:[48,24,48,24,24,24,24,24,24,24,24,-72],degrees:[0,-2,-3,-2,-3,-4,-3,-2,-3,-4,-6],weight:3},{rhythm:[24,24,24,24,24,24,24,24,24,-24,24,24,24,-24,24,24],degrees:[0,-1,0,1,0,-1,-3,-1,0,3,4,0,0,2],weight:3},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,1,3,1,0,-3,0,1,0,-1,-3,4,1],weight:3},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,3,3,1,0,1,0,-2,-3,-4,-1],weight:3},{rhythm:[48,-24,24,24,24,-24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,3,1,0,1,0,-1,1,1,3],weight:3},{rhythm:[48,48,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,-3,-4,-3,-4,-5,-4,-3,-1,-3,-4,-8],weight:3},{rhythm:[24,-24,24,24,24,24,24,24,96,-48,24,24],degrees:[0,4,3,2,4,3,2,1,-1,0],weight:3},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-2,1,4,4,2,1,2,1,-1,-2,-3,0],weight:3},{rhythm:[24,-24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-3,-1,0,3,3,1,0,1,0,-1,1,1,3],weight:3},{rhythm:[24,-24,24,24,24,24,24,24,24,24,24,24,12,12,-24,24,24],degrees:[0,-1,0,-1,-3,-4,-3,-3,-1,-3,-4,-5,-5,-7,-8],weight:3},{rhythm:[-192,48,24,24,48,24,24],degrees:[0,-1,2,1,-3,-1],weight:3},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,-2,-2,-3,-2,-2,0,1,3,4,5,7,5,7,8],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-2,-3,-2,-5,-3,-5,-6,-7,-6,-5,-3,-5,-6,-5],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,24,-24,24,24,24,24,24,24],degrees:[0,1,0,-1,-3,-6,-4,-3,-1,-3,1,-2,-3,-4],weight:3},{rhythm:[96,96,96,96],degrees:[0,0,-4,-4],weight:3},{rhythm:[24,-12,24,-12,24,24,-24,24,24,48,-24,24,24,24,24,24],degrees:[0,0,0,-2,5,2,1,0,1,4,4,2],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,48,-24,24,24,24,-24,24],degrees:[0,1,0,-2,-3,-4,-1,0,-1,0,3,1],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,48,48,48,24,24],degrees:[0,1,0,-1,1,1,3,4,3,1,0,1],weight:3},{rhythm:[24,24,24,24,24,24,24,24,24,-24,24,24,24,24,24,24],degrees:[0,-1,0,1,3,1,0,-4,-3,1,0,-1,1,0,-1],weight:3},{rhythm:[96,-48,24,24,48,-24,24,24,24,24,24],degrees:[0,-2,-1,1,-1,2,5,5,3],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,24,-24,24,24,24,24,24,24],degrees:[0,1,0,-2,-3,-4,-1,0,-3,-1,0,3,3,1],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,24,-24,24,24,24,24,24,24],degrees:[0,1,0,-1,1,1,3,4,3,4,3,1,0,1],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,24,-24,24,24,24,-24,48],degrees:[0,-1,0,1,0,-3,-1,-1,2,1,-1,-1],weight:3},{rhythm:[48,24,48,24,24,24,24,24,24,24,48,-48],degrees:[0,-2,0,0,4,2,4,4,4,3,1],weight:3},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,48],degrees:[0,-1,0,1,0,-1,-3,-1,0,0,3,4,0,2],weight:3},{rhythm:[48,24,24,-24,24,24,24,48,-48,48,-48],degrees:[0,-2,-3,-4,-3,-2,0,1],weight:3},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,96],degrees:[0,-1,2,1,-1,-3,-1,-1,1,3,1,0],weight:3},{rhythm:[24,-24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,-1,-3,-4,-3,-3,-1,-3,-4,-5,-7,-8],weight:3},{rhythm:[48,24,24,24,24,24,24,72,-72,24,24],degrees:[0,3,4,6,4,6,7,7,9,6],weight:3},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,3,3,2,0,2,0,-1,-2,-4,-1],weight:3},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,3,3,2,0,2,0,-1,2,2,3],weight:3},{rhythm:[48,48,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,-2,-3,-5,-3,-5,-6,-5,-3,-2,-3,-5,-9],weight:3},{rhythm:[24,-24,24,24,24,24,24,24,96,-48,24,24],degrees:[0,4,2,1,4,2,1,1,-2,0],weight:3},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,1,4,4,3,1,3,1,0,-1,-3,0],weight:3},{rhythm:[24,-24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-2,-1,0,3,3,2,0,2,0,-1,2,2,3],weight:3},{rhythm:[24,-24,24,24,24,24,24,24,24,24,24,24,12,12,-24,24,24],degrees:[0,-2,0,-2,-3,-5,-3,-3,-2,-3,-5,-5,-5,-7,-9],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,48,-24,24,24,24,24,24],degrees:[0,-3,4,2,1,-3,-2,2,1,2,5,5,4],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,48,-24,24,24,24,24,24],degrees:[0,2,0,-1,-2,-4,-1,0,-1,0,3,3,2],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,48,48,48,24,24],degrees:[0,2,0,-1,2,2,3,5,3,2,0,2],weight:3},{rhythm:[24,24,24,24,24,24,24,24,24,-24,24,24,24,24,24,24],degrees:[0,-1,0,2,3,2,0,-4,-2,2,0,-1,2,0,-1],weight:3},{rhythm:[96,-48,24,24,48,-24,24,24,24,24,24],degrees:[0,-3,-1,0,-1,1,4,4,3],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,24,-24,24,24,24,24,24,24],degrees:[0,2,0,-1,-2,-4,-1,0,-2,-1,0,3,3,5],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,-3,-4,-1,-1,0,2,2,0,2,0,-3,-1],weight:3},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,1,0,-2,-2,-4,-6,-4,-7,0,-2,-3,-3,-7,-6],weight:3},{rhythm:[96,-48,24,24,48,-24,24,24,24,24,24],degrees:[0,0,-1,-3,-3,0,-1,0,1],weight:3},{rhythm:[24,24,48,24,-24,24,24,-24,24,24,24,24,-24,24,24],degrees:[0,0,-2,0,-2,-2,-2,-2,-3,-2,-5,-3],weight:3},{rhythm:[96,96,96,96],degrees:[0,0,-1,1],weight:3},{rhythm:[48,48,48,24,24,96,-48,48],degrees:[0,-3,-4,-3,-2,-3,-4],weight:3},{rhythm:[48,48,48,48,96,-24,24,24,24],degrees:[0,-4,2,-3,-2,-2,-1,2],weight:3},{rhythm:[48,48,48,-24,24,48,48,48,-24,24],degrees:[0,3,2,2,0,-1,-2,-1],weight:3},{rhythm:[48,48,48,48,24,24,24,24,24,-24,48],degrees:[0,4,3,6,3,4,2,3,4,-3],weight:3},{rhythm:[48,48,24,24,24,24,48,-48,48,48],degrees:[0,-1,-2,-1,-2,-3,-2,-2,-1],weight:3},{rhythm:[24,24,24,24,24,24,24,24,120,-72],degrees:[0,-2,-1,0,1,2,0,-1,0],weight:3},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,0,3,-1,2,0,4,2,5,2,5,2,5,2,5],weight:3},{rhythm:[24,24,24,24,24,24,24,24,12,-24,12,-24,12,-12,12,-84],degrees:[0,3,0,3,-1,2,0,4,5,5,5,5],weight:3},{rhythm:[48,48,72,24,96,-48,24,24],degrees:[0,2,1,0,0,2,1],weight:3},{rhythm:[48,-24,24,24,24,24,24,48,-24,24,24,24,24,24],degrees:[0,0,-1,-2,-1,-2,0,-5,2,0,-1,-2],weight:2},{rhythm:[-24,24,24,24,24,24,24,24,24,24,24,48,-24,24,24],degrees:[0,0,-1,0,-1,0,1,-2,-1,-2,-4,-6,-4],weight:2},{rhythm:[48,24,24,48,24,24,48,24,24,48,-24,24],degrees:[0,1,2,1,2,3,6,4,3,2,1],weight:2},{rhythm:[48,-24,24,24,24,24,24,48,-24,24,48,-24,24],degrees:[0,0,1,0,1,3,2,1,2,2],weight:2},{rhythm:[48,24,24,48,24,24,48,24,24,48,24,24],degrees:[0,2,1,1,-1,0,1,3,2,2,1,2],weight:2},{rhythm:[120,-72,48,24,24,48,48],degrees:[0,-4,0,-1,-1,2],weight:2},{rhythm:[48,24,24,48,24,24,48,24,24,24,24,24,24],degrees:[0,2,1,1,-1,0,1,3,2,1,0,1,2],weight:2},{rhythm:[96,-48,24,24,48,48,48,24,24],degrees:[0,0,1,2,4,1,0,1],weight:2},{rhythm:[24,24,24,24,48,24,24,48,24,24,48,24,24],degrees:[0,1,0,-1,-2,-2,-3,-4,-2,-3,-3,-1,-2],weight:2},{rhythm:[24,24,48,-48,24,24,48,48,48,24,24],degrees:[0,1,1,1,2,3,4,2,0,2],weight:2},{rhythm:[24,24,24,24,48,24,24,48,24,24,24,24,24,24],degrees:[0,0,0,-1,-2,-2,-3,-4,-4,-6,-4,-3,-4,-3],weight:2},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,48,48],degrees:[0,1,0,1,0,-4,-3,-2,3,2,2,5],weight:2},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,0,0,1,0,-1,-2,-1,-2,-3,-4,-3,-2,-1],weight:2},{rhythm:[48,48,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,3,-1,-4,-3,-2,-3,-5,-8,-7,-7,-5],weight:2},{rhythm:[48,24,24,48,24,24,24,24,24,24,48,24,-24],degrees:[0,0,0,-1,-3,-1,0,4,2,3,2,1],weight:2},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,-3,-5,-6,-7,-6,-6,-5,-4,-2,-3,-5,-7,-8],weight:2},{rhythm:[12,12,-12,12,-24,12,12,-60,12,24,12,12,-12,12,-24,12,12,-24,24,-48],degrees:[0,-7,-7,-7,-7,-7,-6,-4,3,3,3,3,-4],weight:2},{rhythm:[24,24,24,24,12,24,-12,24,24,72,24,48,24,24],degrees:[0,-1,-2,-4,-3,-3,-6,-5,-4,-2,-3,0,-1],weight:2},{rhythm:[24,24,24,24,48,24,24,72,24,24,24,24,24],degrees:[0,2,0,-2,1,-3,0,-1,1,0,0,-3,-3],weight:2},{rhythm:[24,24,24,24,24,-24,24,24,72,24,24,-24,24,24],degrees:[0,-1,-2,-4,-3,-6,-5,-4,-2,-3,0,-1],weight:2},{rhythm:[24,24,24,24,48,24,24,48,24,24,24,24,24,24],degrees:[0,2,0,-2,1,-3,0,-1,-1,1,0,0,-3,-3],weight:2},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,-1,0,1,0,-4,-2,0,-1,-6,-5],weight:2},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,1,2,3,4,5,4,1,3,4,3,3,5],weight:2},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-4,-3,0,-1,-1,-3,-4,-5,-4,-2,-3,-3,-2],weight:2},{rhythm:[24,24,24,24,24,24,24,24,48,-96,24,24],degrees:[0,-2,-1,0,-1,2,0,4,3,0,2],weight:2},{rhythm:[48,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,1,2,3,1,0,-1,-1,-3,0,-1,-3,-2],weight:2},{rhythm:[-144,24,24,48,48,48,48],degrees:[0,1,2,3,4,5],weight:2},{rhythm:[72,24,48,48,96,48,48],degrees:[0,-1,0,2,0,-1,-2],weight:2},{rhythm:[36,12,24,24,36,12,24,24,96,-48,48],degrees:[0,2,0,-1,0,2,0,-1,0,3],weight:2},{rhythm:[72,24,36,12,24,24,36,12,24,24,24,-24,24,24],degrees:[0,-1,-2,-1,-2,-4,-5,-4,-4,-5,-7,-7,-8],weight:2},{rhythm:[48,48,24,24,24,24,36,12,24,24,24,-24,48],degrees:[0,2,3,2,5,4,3,5,3,2,3,6],weight:2},{rhythm:[72,24,48,48,72,24,48,-48],degrees:[0,-1,0,2,3,2,0],weight:2},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,-3,-4,-5,-4,-3,0,-1,-3,-4,-3,-7,-6],weight:2},{rhythm:[12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,24,-168],degrees:[0,2,4,2,0,2,4,2,-2,0,2,0,-2,0,2,0,3],weight:2},{rhythm:[36,-36,12,12,12,-12,24,36,-12,36,12,-24,12,12,12,-12,12,-12,36,-12],degrees:[0,0,-1,0,0,0,0,-1,0,-1,0,0,0],weight:2},{rhythm:[24,24,-48,24,24,24,24,24,60,12,12,12,12,-60],degrees:[0,-3,-2,-3,-2,-1,-1,-3,-4,-3,-4,-6],weight:2},{rhythm:[-24,12,-12,36,12,24,-24,36,12,24,-24,36,12,24,24,-48],degrees:[0,3,3,3,3,3,3,3,3,3,2],weight:2},{rhythm:[12,36,48,12,36,12,36,12,-12,12,12,12,12,-24,12,36,12,12,-24],degrees:[0,0,1,2,3,1,0,0,1,1,0,0,0,1,-3,-3],weight:2},{rhythm:[-24,12,12,24,12,-12,24,-24,12,12,24,48,24,24,48,-48],degrees:[0,0,0,1,2,0,0,-1,1,-3,-3,-1],weight:2},{rhythm:[48,48,12,36,12,36,12,-12,12,12,12,12,-24,12,36,12,12,-24],degrees:[0,1,2,3,1,0,0,1,1,0,0,0,1,-3,-3],weight:2},{rhythm:[-24,12,12,24,12,-12,24,-24,12,12,24,24,24,12,12,12,-12,12,36,-48],degrees:[0,0,0,1,2,0,0,-1,1,0,0,0,0,-1,-1],weight:2},{rhythm:[-24,12,12,24,24,24,24,12,36,24,24,12,-36,24,24,24,24],degrees:[0,0,0,1,2,1,0,-1,1,0,0,1,0,0,-1],weight:2},{rhythm:[72,-96,24,48,-24,24,24,-24,48],degrees:[0,0,1,2,3,7],weight:2},{rhythm:[24,24,24,48,24,24,24,24,24,24,24,-24,24,24,24],degrees:[0,-1,2,0,-3,-1,2,1,0,1,-3,-1,-3,-1],weight:2},{rhythm:[48,48,24,24,24,24,24,24,24,24,-24,24,24,24],degrees:[0,-3,-4,-1,-3,1,2,1,0,-3,0,0,-1],weight:2},{rhythm:[-24,24,24,24,24,24,24,24,-120,24,24,24],degrees:[0,5,7,6,5,3,3,7,6,5],weight:2},{rhythm:[72,24,72,24,24,24,24,24,-24,24,24,24],degrees:[0,-5,-3,-3,-2,0,-1,-2,-3,-5,-6],weight:2},{rhythm:[72,24,24,24,24,24,24,24,24,12,12,24,24,24,24],degrees:[0,-1,0,0,0,3,5,7,6,7,6,5,7,6,5],weight:2},{rhythm:[24,24,24,24,-24,24,24,24,24,24,24,24,-24,24,24,24],degrees:[0,-3,-2,0,2,5,4,2,1,0,-2,-3,-2,1],weight:2},{rhythm:[-24,24,24,24,24,24,24,24,48,-96,24,24],degrees:[0,1,4,3,2,1,0,1,0,4],weight:2},{rhythm:[72,24,24,24,24,24,24,24,24,24,48,24,24],degrees:[0,-1,0,0,1,3,1,0,-1,3,0,-3,-2],weight:2},{rhythm:[72,24,48,24,24,24,24,24,24,48,24,24],degrees:[0,-1,0,1,3,1,0,-1,3,0,-3,-2],weight:2},{rhythm:[72,24,24,24,24,24,72,-72,24,24],degrees:[0,2,0,2,2,3,5,0,2],weight:2},{rhythm:[72,24,48,24,24,72,24,24,-24,24,24],degrees:[0,-1,1,1,3,0,-1,-1,-1,2],weight:2},{rhythm:[72,24,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,1,-1,-3,-4,-3,-1,-2,-4,-6,-4,-3,-1],weight:2},{rhythm:[72,24,24,-24,24,24,48,-24,24,24,-24,24,24],degrees:[0,-2,-3,0,-2,-3,-2,-7,-7,-6],weight:2},{rhythm:[24,-24,24,24,24,24,24,24,48,-24,24,24,24,24,24],degrees:[0,2,0,2,3,5,3,2,3,2,2,3,7],weight:2},{rhythm:[72,24,72,24,48,24,24,48,48],degrees:[0,1,-2,-3,-2,-3,-2,0,-2],weight:2},{rhythm:[72,24,72,24,48,24,24,24,24,48],degrees:[0,1,-2,-3,-2,0,-2,0,1,0],weight:2},{rhythm:[72,24,72,24,48,24,24,48,48],degrees:[0,1,-2,0,-1,-2,-3,-2,-3],weight:2},{rhythm:[72,24,72,24,48,72,-72],degrees:[0,1,-1,-2,-1,-2],weight:2},{rhythm:[72,24,48,24,24,48,24,24,48,24,24],degrees:[0,7,4,3,4,3,2,3,2,-3,-1],weight:2},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,36,-12,24,24],degrees:[0,-1,0,1,2,1,-1,-3,-3,-4,-1,-3,-3,-1],weight:2},{rhythm:[96,96,96,96],degrees:[0,1,2,5],weight:2},{rhythm:[96,96,96,96],degrees:[0,1,-1,0],weight:2},{rhythm:[96,96,96,48,48],degrees:[0,3,4,3,1],weight:2},{rhythm:[24,24,24,24,24,24,24,24,192],degrees:[0,-3,4,3,1,1,-3,-1,0],weight:2},{rhythm:[24,24,24,24,12,12,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,2,0,-1,-2,-2,-4,-5,-4,-7,0,-1,-3,-3,-7,-5],weight:2},{rhythm:[48,24,24,24,24,24,24,24,24,48,48,48],degrees:[0,-3,0,1,2,3,2,3,4,2,0,-1],weight:2},{rhythm:[48,24,24,24,24,24,24,24,24,48,24,24,48],degrees:[0,-2,0,1,1,2,0,1,2,2,1,0,0],weight:2},{rhythm:[96,48,48,24,24,48,24,24,24,24],degrees:[0,1,2,1,1,0,4,2,1,0],weight:2},{rhythm:[24,24,24,24,24,24,48,24,24,24,24,24,24,48],degrees:[0,2,5,4,2,3,2,0,-1,-2,0,2,0,-1],weight:2},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,48,-48],degrees:[0,1,0,0,4,2,1,0,1,0,-2,-3],weight:2},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,24,48],degrees:[0,-1,0,1,-3,-1,-1,0,-1,0,1,-1,-1,1],weight:2},{rhythm:[24,24,24,24,24,24,24,24,96,-48,24,24],degrees:[0,-1,0,1,3,4,3,2,1,-6,-4],weight:2},{rhythm:[48,24,24,24,24,24,24,96,-48,24,24],degrees:[0,1,2,1,0,1,2,0,-5,-3],weight:2},{rhythm:[48,24,24,24,24,24,24,96,-96],degrees:[0,1,2,1,0,1,2,0],weight:2},{rhythm:[24,24,-24,24,-24,24,24,24,36,12,24,24,48,-48],degrees:[0,-2,1,0,1,2,1,1,0,1,-2],weight:2},{rhythm:[48,24,24,24,24,24,-24,24,24,24,24,24,-24,24,24],degrees:[0,3,5,7,5,3,0,2,3,5,3,6,5],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,2,2,3,2,4,1,0,0,2,2,3,3,4,4],weight:2},{rhythm:[24,24,24,24,24,24,24,24,48,24,24,24,24,24,24],degrees:[0,2,4,0,4,-2,5,0,1,-2,0,1,-2,3,1],weight:2},{rhythm:[24,24,24,24,24,24,24,24,48,24,24,24,24,24,24],degrees:[0,2,4,0,4,-2,5,0,-1,6,6,5,2,5,2],weight:2},{rhythm:[48,24,24,24,24,24,24,48,24,24,24,24,24,24],degrees:[0,7,4,-1,6,3,-1,1,8,8,7,4,7,9],weight:2},{rhythm:[48,48,48,24,-24,48,24,24,24,24,24,24],degrees:[0,7,3,2,-2,5,5,4,1,4,1],weight:2},{rhythm:[48,24,24,24,24,24,24,72,24,48,24,12,12],degrees:[0,7,4,-1,6,3,-1,1,1,8,8,6,5],weight:2},{rhythm:[24,-24,24,-24,12,12,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,-2,-2,-2,0,-2,-3,-1,1,-1,-4,0,-2,-4],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,2,4,2,-1,3,1,-1,4,-1,1,-3,2,1,2,3],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,2,2,3,3,4,4,0,0,2,2,3,2,4,1],weight:2},{rhythm:[48,24,24,24,24,24,24,48,48,48,24,-24],degrees:[0,7,7,6,3,6,8,2,9,5,4],weight:2},{rhythm:[72,24,48,24,12,12,24,-24,24,-24,12,12,24,24,24],degrees:[0,0,7,7,5,4,3,3,1,1,1,3,1],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,-24],degrees:[0,2,4,2,-1,3,1,-1,4,-1,1,-3,2,1,2],weight:2},{rhythm:[12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12],degrees:[0,0,2,2,-1,2,3,2,0,0,2,2,-1,-1,2,2],weight:2},{rhythm:[12,-12,12,-12,12,-12,12,-12,12,12,12,12,12,12,12,12,144,-48],degrees:[0,0,1,1,2,2,1,0,-2,-2,-3,-3,-2],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,-24],degrees:[0,0,1,-5,-2,-2,0,0,1,1,2,-1,1,1,2],weight:2},{rhythm:[12,12,12,12,12,12,12,12,12,-84,36,12,12,-12,12,-12,12,12,12,12,12,-36],degrees:[0,0,0,4,0,0,0,0,0,4,4,4,2,3,3,2,2,0],weight:2},{rhythm:[24,24,24,24,24,24,24,-24,24,24,24,24,-24,24,48],degrees:[0,-2,-2,-2,-3,-5,0,1,-2,1,2,-1,-3],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,-24],degrees:[0,-2,-2,-2,-3,-5,0,1,1,2,0,1,-1,0,-2],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,48,-48],degrees:[0,-2,-2,-2,-3,-5,0,1,1,2,-1,1,-2],weight:2},{rhythm:[48,24,24,-48,24,-24,24,-168],degrees:[0,0,2,-3,-1],weight:2},{rhythm:[24,-24,24,-24,24,-24,24,-24,24,-24,24,-24,24,-24,24,-24],degrees:[0,0,2,0,-1,0,2,4],weight:2},{rhythm:[36,12,12,12,-24,36,12,12,12,-24,24,24,36,12,12,12,-72],degrees:[0,0,4,4,6,6,4,4,6,4,9,9,7,7],weight:2},{rhythm:[24,-24,24,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-4,-2,0,-4,0,-1,0,-1,-2,-1,-1,-1,-2],weight:2},{rhythm:[72,-96,24,48,48,24,24,24,24],degrees:[0,0,0,-1,0,-1,0,2],weight:2},{rhythm:[72,-96,24,48,48,24,24,24,24],degrees:[0,-1,0,-1,-2,-1,-4,-5],weight:2},{rhythm:[72,-72,24,24,48,48,24,24,24,24],degrees:[0,-3,-1,0,-1,0,-1,2,1],weight:2},{rhythm:[72,24,48,48,48,48,48,48],degrees:[0,1,0,4,5,7,6,4],weight:2},{rhythm:[48,-24,24,48,48,24,24,24,24,48,-48],degrees:[0,1,2,3,0,-1,0,1,-1],weight:2},{rhythm:[72,24,48,48,24,24,24,24,48,-24,24],degrees:[0,1,0,4,5,4,2,1,2,2],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,-168],degrees:[0,1,0,1,0,-1,-2,-1,-1],weight:2},{rhythm:[36,36,24,48,48,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,2,3,2,0,-1,0,-1,-3,-1],weight:2},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-48,24],degrees:[0,-1,0,-1,-2,-3,-2,-3,-2,-3,-5,-7,-7],weight:2},{rhythm:[48,24,24,48,24,24,24,24,24,24,48,48],degrees:[0,-2,-3,-4,-5,-4,-3,-4,-3,0,-2,-3],weight:2},{rhythm:[-24,24,24,24,36,36,24,24,24,24,24,48,48],degrees:[0,-1,0,1,2,3,4,4,4,3,2,4],weight:2},{rhythm:[-24,24,24,24,24,24,24,24,24,24,24,24,36,36,24],degrees:[0,0,-1,0,0,0,-1,0,-1,0,3,1,1,3],weight:2},{rhythm:[36,36,24,48,48,24,12,36,24,36,36,24],degrees:[0,-1,0,1,2,1,-1,-1,0,-1,-3,-5],weight:2},{rhythm:[-24,24,24,24,24,24,24,24,24,24,24,24,48,-48],degrees:[0,1,2,1,0,-1,0,-1,0,-1,-3,-2],weight:2},{rhythm:[60,36,60,36,36,36,24,48,48],degrees:[0,-1,1,0,2,1,2,2,4],weight:2},{rhythm:[-24,24,24,24,24,24,24,24,24,-24,48,48,48],degrees:[0,0,-1,-3,-4,-3,2,1,-1,0,1],weight:2},{rhythm:[48,24,24,48,48,120,-72],degrees:[0,2,0,0,-3,-1],weight:2},{rhythm:[48,24,24,48,24,24,48,48,48,-48],degrees:[0,3,2,0,2,-3,3,3,3],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,0,3,-1,2,-1,2,-2,1,-2,1,2,5,2,5],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,48],degrees:[0,3,0,3,1,4,1,4,-2,1,-2,1,1,1],weight:2},{rhythm:[24,24,24,24,24,12,12,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,-2,0,1,2,1,0,-2,-1,0,-1,-3,-4,-4,-6,-8],weight:2},{rhythm:[24,24,24,24,24,12,12,12,12,24,24,24,24,24,24,24,24,24],degrees:[0,-2,-4,0,5,4,4,3,1,0,3,4,5,7,8,7,5,4],weight:2},{rhythm:[48,12,-12,12,-12,24,-24,48,48,12,-12,12,-12,48,12,-12,12,-12],degrees:[0,4,0,0,-1,0,4,0,0,4,0],weight:2},{rhythm:[-96,48,48,72,24,24,24,24,24],degrees:[0,4,3,4,3,2,1,2],weight:2},{rhythm:[24,24,24,24,24,-24,24,24,24,-24,24,24,24,24,24,24],degrees:[0,1,0,-2,-1,-1,1,0,0,1,0,-2,-1,-5],weight:2},{rhythm:[24,-72,48,48,72,24,24,24,24,24],degrees:[0,0,-1,-2,0,1,0,1,2],weight:2},{rhythm:[24,24,24,24,24,-24,24,24,24,-24,24,-24,24,24,24,24],degrees:[0,2,-1,0,-2,-2,-5,-4,-2,-3,-2,-3,-5],weight:2},{rhythm:[24,-24,24,-24,24,-24,48,24,24,24,24,48,24,24],degrees:[0,0,0,2,2,4,5,6,2,4,-1],weight:2},{rhythm:[72,24,24,24,24,24,24,24,24,24,24,-24,24,-24],degrees:[0,0,0,-1,-2,-3,-4,-5,-4,-3,-2,-5],weight:2},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-24,24,-24],degrees:[0,0,0,2,2,0,2,3,5,3,2,3,2],weight:2},{rhythm:[24,24,24,24,24,24,24,-24,24,24,24,24,24,-24,24,24],degrees:[0,0,0,2,3,2,3,5,3,5,6,2,0,0],weight:2},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,0,2,2,3,2,5,6,5,6,2,3,5],weight:2},{rhythm:[24,24,24,-24,24,24,24,-24,24,24,24,24,24,-24,24,-24],degrees:[0,-2,-3,0,-2,-3,-4,-5,-4,-3,-2,-5],weight:2},{rhythm:[24,24,24,-24,24,24,24,-24,24,24,24,24,24,-24,24,-24],degrees:[0,-1,0,2,1,2,5,4,2,1,2,1],weight:2},{rhythm:[24,24,24,-24,24,24,24,-24,24,24,24,24,24,-24,48],degrees:[0,-1,0,3,2,0,5,4,2,3,2,0],weight:2},{rhythm:[24,24,24,-24,24,24,24,-24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,4,3,1,0,-1,0,3,1,-1,-2],weight:2},{rhythm:[48,48,48,48,24,24,24,24,24,-24,24,-24],degrees:[0,4,3,6,3,4,2,3,4,-3],weight:2},{rhythm:[48,48,24,24,24,24,60,12,-24,48,48],degrees:[0,-1,-2,-1,-2,-3,-2,-2,-2,-1],weight:2},{rhythm:[24,24,24,24,24,24,24,24,96,-96],degrees:[0,-2,-1,0,1,2,0,-1,0],weight:2},{rhythm:[-48,48,48,48,48,24,24,48,-24,24],degrees:[0,1,3,4,3,1,0,1],weight:2},{rhythm:[48,48,48,48,48,24,24,48,-24,24],degrees:[0,2,3,5,6,5,3,2,3],weight:2},{rhythm:[48,48,48,48,72,24,24,24,24,24],degrees:[0,2,3,5,6,5,6,5,6,5],weight:2},{rhythm:[24,24,24,24,24,24,24,24,48,-24,24,24,24,24,24],degrees:[0,1,-1,-4,-3,-4,-3,-1,0,-1,0,-1,0,1],weight:2},{rhythm:[48,48,24,24,24,24,48,-24,24,24,24,24,24],degrees:[0,1,2,-3,-2,0,1,0,1,0,1,0],weight:2},{rhythm:[24,24,24,24,24,24,24,24,48,-24,24,24,24,24,24],degrees:[0,1,-1,-4,-3,-4,-3,-1,0,-1,0,1,3,1],weight:2},{rhythm:[24,-24,48,48,48,48,-24,24,24,24,24,24],degrees:[0,-1,0,2,3,2,3,2,3,2],weight:2},{rhythm:[120,-24,48,96,96],degrees:[0,-3,-2,0],weight:2},{rhythm:[96,48,48,48,48,48,48],degrees:[0,-1,0,1,6,3,4],weight:2},{rhythm:[24,24,24,24,24,-24,24,24,48,48,24,24,24,24],degrees:[0,0,-1,-2,-4,-4,-2,-1,0,0,0,2,0],weight:2},{rhythm:[72,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,1,0,-3,-5,-3,-2,0,4,1,2,4],weight:2},{rhythm:[24,24,-24,24,24,24,24,24,72,24,24,-24,24,24],degrees:[0,-1,0,-1,-1,0,3,1,0,-1,-3,-2],weight:2},{rhythm:[24,24,24,24,24,-24,24,24,24,12,12,24,24,24,-24,24,24],degrees:[0,0,0,1,2,-2,-3,4,5,4,2,1,2,2,1],weight:2},{rhythm:[24,-72,24,24,24,24,24,-48,24,24,24,24,24],degrees:[0,0,1,2,3,4,0,4,4,3,4],weight:2},{rhythm:[24,-24,48,24,-24,24,24,24,-48,24,24,24,24,24],degrees:[0,2,-1,-1,-3,-2,-2,-2,0,3,4],weight:2},{rhythm:[96,96,48,48,48,48],degrees:[0,3,4,3,4,6],weight:2},{rhythm:[96,96,48,48,48,48],degrees:[0,-1,0,-1,-3,-4],weight:2},{rhythm:[96,96,48,48,48,48],degrees:[0,-1,0,2,3,5],weight:2},{rhythm:[96,96,48,48,48,48],degrees:[0,-1,0,1,2,3],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,0,3,-1,2,-1,2,2,5,2,5,2,5,1,4],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,0,3,0,3,0,3,-1,2,-1,2,-1,2,-1,2],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,0,3,1,4,1,4,2,5,2,5,1,4,1,4],weight:2},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,0,3,0,3,0,3,1,4,1,4,1,4,1,4],weight:2},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,24,24,24,24],degrees:[0,-1,0,1,1,0,-1,-3,-4,-3,-2,-1,-2,-4],weight:2},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,36,-12,24,24],degrees:[0,-1,0,1,1,0,-1,-3,1,1,0,1,0,1],weight:2},{rhythm:[48,48,72,24,96,-48,24,12,-12],degrees:[0,2,1,0,0,2,1],weight:2},{rhythm:[-144,24,24,48,24,24,48,48],degrees:[0,1,2,7,6,6,9],weight:1},{rhythm:[-192,48,24,24,48,48],degrees:[0,4,3,3,6],weight:1},{rhythm:[24,24,24,24,48,24,24,48,24,24,48,48],degrees:[0,-1,-2,-1,-2,-4,-3,-2,0,-1,-1,3],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,-24,24,24,24,24,24,-24],degrees:[0,0,-2,0,1,1,0,1,1,1,2,1,1,-2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,-24,24,24,24,-24,24,24],degrees:[0,0,-3,-3,-3,-3,-5,-3,-3,-6,-6,-7,-7,-6],weight:1},{rhythm:[24,24,24,48,24,24,24,-24,24,24,24,-72,24],degrees:[0,1,3,1,0,0,0,0,-2,-1,3],weight:1},{rhythm:[24,-48,12,12,24,-48,24,24,-48,24,24,-48,12,12],degrees:[0,0,0,-2,-2,-3,-3,-3,-3,-3],weight:1},{rhythm:[24,-48,24,24,24,24,24,48,-24,24,24,24,24,24],degrees:[0,0,1,0,0,0,0,0,0,-2,-3,-3],weight:1},{rhythm:[-144,24,24,48,48,48,48],degrees:[0,1,2,4,1,3],weight:1},{rhythm:[48,24,24,96,-192],degrees:[0,-1,-3,-5],weight:1},{rhythm:[-192,48,48,48,48],degrees:[0,2,1,0],weight:1},{rhythm:[48,24,24,96,-192],degrees:[0,-1,-2,-1],weight:1},{rhythm:[-96,48,48,48,24,24,48,24,24],degrees:[0,1,2,3,2,1,0,1],weight:1},{rhythm:[24,24,24,24,48,48,24,24,24,24,24,24,24,24],degrees:[0,-1,-2,-3,-5,-1,0,-1,-2,-1,0,-1,2,1],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,48,12,-12,24],degrees:[0,-1,0,1,0,-2,-1,0,-2,-1,0,2,1],weight:1},{rhythm:[48,24,24,48,-24,24,24,24,24,12,12,24,24,24,24],degrees:[0,-1,-2,-3,-5,-4,-5,-4,-3,-2,-1,0,-3,-5],weight:1},{rhythm:[96,-96,72,12,12,12,-12,12,12,12,36],degrees:[0,-2,0,0,-1,0,1,2,1],weight:1},{rhythm:[-168,24,24,24,24,24,12,12,12,12,24,12,-12],degrees:[0,3,2,3,5,4,3,2,0,2,2],weight:1},{rhythm:[24,24,24,24,48,24,-24,72,24,24,24,24,24],degrees:[0,-1,0,4,3,4,3,2,3,4,2,1],weight:1},{rhythm:[96,-96,48,-24,24,48,-24,24],degrees:[0,3,4,1,2],weight:1},{rhythm:[24,24,24,24,48,-24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,-2,-1,1,4,4,3,3,2,2,1,0,2],weight:1},{rhythm:[96,-96,48,-24,24,48,-24,24],degrees:[0,-1,0,-3,-2],weight:1},{rhythm:[24,24,24,24,48,-48,24,24,24,24,24,12,12,24,24],degrees:[0,1,0,-1,-2,-5,-4,-3,-3,-3,-1,-1,-2,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,48,48,48],degrees:[0,-1,0,3,2,-2,-1,0,2,-1,1],weight:1},{rhythm:[48,24,24,48,-48,48,48,48,24,24],degrees:[0,-1,-3,-5,-4,-2,-3,-2,-1],weight:1},{rhythm:[48,24,24,48,-48,48,48,24,12,12,48],degrees:[0,1,0,-2,0,2,1,2,3,4],weight:1},{rhythm:[96,48,48,24,24,24,24,24,24,24,24],degrees:[0,-2,-3,-2,-3,-2,0,-1,0,-1,-2],weight:1},{rhythm:[72,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,3,0,-2,-2,-1,-2,-4,-2,-3,-3,-2],weight:1},{rhythm:[48,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-2,-1,0,-2,-1,0,1,0,3,2,2,1],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,48,-48],degrees:[0,0,0,1,-1,-1,-2,-1,0,1,0,-2,-4],weight:1},{rhythm:[48,24,24,48,24,24,48,24,24,24,-24,24,24],degrees:[0,-2,-1,0,1,0,-1,-2,-3,-2,0,1],weight:1},{rhythm:[72,24,24,24,24,24,120,-24,24,24],degrees:[0,-1,0,2,1,0,0,-2,-1],weight:1},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,48,24,24],degrees:[0,0,1,2,2,5,5,4,2,0,-1,-2,0,2],weight:1},{rhythm:[48,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,1,0,1,2,3,1,-1,0,2,1],weight:1},{rhythm:[48,24,24,24,24,24,24,96,-96],degrees:[0,-2,2,3,2,1,-1,0],weight:1},{rhythm:[48,24,24,48,24,24,24,24,24,24,24,-24,24,-24],degrees:[0,0,0,-1,-3,-1,0,4,2,3,2,1],weight:1},{rhythm:[48,-24,24,48,-24,24,24,24,24,24,48,-24,24],degrees:[0,4,3,2,1,2,1,0,-1,-3],weight:1},{rhythm:[48,-24,24,24,24,24,24,48,-24,24,48,-48],degrees:[0,4,3,4,3,1,-1,0,-1],weight:1},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,48,24,24],degrees:[0,-1,0,1,0,1,2,3,4,6,7,8,8,9],weight:1},{rhythm:[24,24,24,24,24,12,-12,24,24,72,-120],degrees:[0,0,-1,-2,-3,-2,-4,-5,-4],weight:1},{rhythm:[24,24,24,24,24,24,24,24,36,12,-24,24,48,24,24],degrees:[0,-1,0,1,2,1,0,-1,-2,-2,-2,0,-1,-2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,72,24,24,-24,24,24],degrees:[0,0,-1,0,3,3,1,-2,-1,0,-1,4,3],weight:1},{rhythm:[48,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,3,2,0,1,2,3,2,3,4,5,5,6],weight:1},{rhythm:[24,-24,24,24,24,-24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,-2,-3,-4,-3,-2,-3,-2,-1,-2,-6,-5],weight:1},{rhythm:[48,48,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,5,4,4,0,1,2,4,1,2,0,0,-1],weight:1},{rhythm:[48,24,24,24,12,12,24,24,120,-24,24,24],degrees:[0,1,2,3,4,3,2,3,4,7,8],weight:1},{rhythm:[48,24,24,24,12,12,24,24,120,-24,24,24],degrees:[0,1,2,3,4,3,2,1,0,0,1],weight:1},{rhythm:[48,48,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,5,4,2,0,1,2,4,1,2,0,0,-1],weight:1},{rhythm:[24,24,24,24,24,12,12,24,24,120,-24,24,24],degrees:[0,0,1,2,3,4,3,2,3,4,7,8],weight:1},{rhythm:[48,24,24,24,12,12,24,24,72,24,24,-72],degrees:[0,1,2,3,4,3,2,1,0,-1,0],weight:1},{rhythm:[72,24,48,24,24,72,24,24,24,24,24],degrees:[0,-2,-3,-4,-3,-2,0,-2,-3,0,-2],weight:1},{rhythm:[72,24,48,48,48,48,48,48],degrees:[0,-1,0,4,3,1,0,-1],weight:1},{rhythm:[96,48,24,24,48,24,24,48,24,24],degrees:[0,-1,-3,-4,-3,-1,-3,0,-1,-3],weight:1},{rhythm:[72,24,72,24,96,48,48],degrees:[0,1,0,-1,-1,6,6],weight:1},{rhythm:[72,24,48,24,24,72,24,24,24,24,24],degrees:[0,-3,-4,-5,-4,-3,-1,-3,-4,-1,-3],weight:1},{rhythm:[72,24,48,48,48,48,48,24,24],degrees:[0,-1,0,3,1,4,3,1,0],weight:1},{rhythm:[96,48,24,24,48,24,24,48,24,24],degrees:[0,-1,4,3,2,-3,-4,3,-1,-3],weight:1},{rhythm:[72,24,72,24,96,-24,24,24,24],degrees:[0,-3,-4,-5,2,-4,-3,-1],weight:1},{rhythm:[96,48,24,24,36,12,24,24,96],degrees:[0,-4,-3,-1,-3,-1,-3,-5,-7],weight:1},{rhythm:[96,48,24,24,24,-24,24,-24,24,-24,24,24],degrees:[0,-1,0,1,2,2,2,2,4],weight:1},{rhythm:[36,12,24,24,24,24,24,24,24,24,24,24,48,24,24],degrees:[0,-1,0,1,0,-1,-4,-1,-3,-4,-3,-1,-3,-4,-6],weight:1},{rhythm:[72,24,-24,24,24,24,120,-72],degrees:[0,1,0,-2,-4,-3],weight:1},{rhythm:[24,-24,24,24,24,24,24,24,24,12,12,24,24,24,-24,24,24],degrees:[0,1,2,3,6,4,6,7,6,7,4,3,4,0,1],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,0,1,2,1,0,1,2,1,2,3,4,2,4],weight:1},{rhythm:[24,24,24,-24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,1,1,0,-2,-3,-4,-3,-4,-3,-2,-7,-9,-7],weight:1},{rhythm:[24,-24,48,24,12,12,24,24,24,24,24,24,24,24,24,24],degrees:[0,4,3,4,3,2,1,2,1,2,3,4,2,4,6],weight:1},{rhythm:[24,24,24,-24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,1,1,0,-2,2,3,5,4,3,0,1,0,-2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,12,12,24],degrees:[0,0,0,-1,0,-1,-2,-1,0,-4,0,2,3,3,4,5],weight:1},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,0,-1,-3,-5,-4,-3,3,2,1,0,-3,-5],weight:1},{rhythm:[48,-24,12,12,36,36,24,24,24,24,24,24,-24,12,12,24],degrees:[0,0,2,1,4,3,4,3,4,5,6,0,0,1],weight:1},{rhythm:[24,24,24,24,24,24,24,24,12,-24,12,-24,12,-12,12,-12,24,24,24],degrees:[0,-2,-3,-4,-2,-3,-4,-7,-6,-6,-7,-6,-5,-4,-2],weight:1},{rhythm:[12,12,-12,12,-24,12,24,-12,12,12,12,-12,24,36,12,36,12,36,12,-12,12,24],degrees:[0,-7,-7,-7,0,-7,0,0,-3,-1,2,2,-5,2,-3,-5,2],weight:1},{rhythm:[-96,48,48,72,24,72,24],degrees:[0,1,2,1,2,4],weight:1},{rhythm:[48,48,48,24,24,72,24,72,24],degrees:[0,-2,-1,-3,-1,-2,-1,-2,-4],weight:1},{rhythm:[96,-48,24,24,36,12,24,24,36,12,24,24],degrees:[0,1,3,4,3,3,6,7,6,6,7],weight:1},{rhythm:[36,12,24,24,24,24,24,24,96,48,48],degrees:[0,-1,0,-1,-2,-3,-2,-1,0,1,-1],weight:1},{rhythm:[72,-24,48,48,48,-24,24,48,24,24],degrees:[0,-2,-1,0,2,3,-2,3],weight:1},{rhythm:[48,-24,24,72,24,24,12,12,24,24,24,-24,48],degrees:[0,-1,0,1,1,1,2,1,0,-1,-2],weight:1},{rhythm:[24,24,24,24,24,-24,24,-24,24,24,24,24,48,-24,24],degrees:[0,1,2,7,6,6,5,4,5,6,7,5],weight:1},{rhythm:[24,24,24,24,24,24,24,24,48,48,48,-24,24],degrees:[0,1,-3,-1,0,-1,-2,-3,-4,-2,-3,-2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,48,-24,24,24,-24,24,24],degrees:[0,-1,0,1,2,-3,-2,0,-1,-1,0,-2,-1],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-4,-2,0,-2,-4,-3,-4,-6,-6,-6,-4,-3,-3,-4],weight:1},{rhythm:[24,24,24,24,24,24,24,24,72,24,24,-24,24,24],degrees:[0,3,3,3,4,2,2,4,5,5,6,4,6],weight:1},{rhythm:[24,24,24,24,36,-12,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,-2,-3,-4,-5,-4,-3,-3,-3,-2,-3,-4,-3],weight:1},{rhythm:[36,-12,24,24,24,24,24,24,24,24,24,24,48,-48],degrees:[0,-2,0,-1,0,1,-1,0,1,-1,1,0],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-2,-4,-2,-1,-2,-3,-4,-5,-6,-5,-2,-2,-2,-2],weight:1},{rhythm:[48,24,24,36,12,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-2,-1,0,-2,-1,0,1,0,1,2,1,-3,-2],weight:1},{rhythm:[72,24,24,24,24,24,24,12,12,12,-12,24,24,-24,24,24],degrees:[0,2,1,0,4,3,2,0,1,2,3,0,0,2],weight:1},{rhythm:[36,12,24,24,24,12,12,24,24,12,84,-48,24,24],degrees:[0,-3,0,-3,-4,-3,-3,-2,-3,-2,-1,-3,-2],weight:1},{rhythm:[36,12,12,-12,24,12,-12,12,-12,12,-12,12,-12,36,12,12,-12,24,24,-24,24,24],degrees:[0,0,-1,0,1,0,2,1,0,-1,0,1,-2,-2,0],weight:1},{rhythm:[36,12,24,24,24,24,24,24,96,-96],degrees:[0,0,-1,0,-1,-5,-4,-2,-3],weight:1},{rhythm:[72,24,72,24,24,24,24,24,24,-24,24,24],degrees:[0,0,1,0,-1,1,0,1,2,2,3],weight:1},{rhythm:[72,24,72,24,24,24,24,24,24,-24,24,24],degrees:[0,0,-1,0,-1,-4,-2,-1,-2,-2,-1],weight:1},{rhythm:[24,-24,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-2,0,-1,-5,-3,-1,-3,-4,-3,-2,-2,-1],weight:1},{rhythm:[72,24,72,24,96,-96],degrees:[0,0,1,-3,-1],weight:1},{rhythm:[72,48,24,24,24,-24,24,24,24,48,24,24],degrees:[0,1,0,1,-3,-3,1,0,3,1,1],weight:1},{rhythm:[72,24,24,-24,24,24,48,48,48,48],degrees:[0,0,0,-2,-5,-3,-2,0,-2],weight:1},{rhythm:[96,48,48,24,-24,48,48,48],degrees:[0,-2,0,2,-2,0,2],weight:1},{rhythm:[48,48,72,24,72,24,24,24,24,24],degrees:[0,-3,-2,1,-1,-1,-1,-3,-3,-1],weight:1},{rhythm:[48,48,72,24,48,-24,24,24,24,24,24],degrees:[0,1,0,-2,-1,-1,-1,-2,-1,1],weight:1},{rhythm:[48,48,48,48,24,24,24,24,24,-24,48],degrees:[0,2,1,-3,-5,-3,0,-5,-4,-5],weight:1},{rhythm:[48,48,48,24,24,96,-96],degrees:[0,3,0,0,3,4],weight:1},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,48],degrees:[0,-2,0,-2,0,1,2,1,2,4,5,-2],weight:1},{rhythm:[96,-48,48,48,48,48,48],degrees:[0,-3,0,-1,-2,0],weight:1},{rhythm:[96,-48,24,24,96,-48,48],degrees:[0,-4,-2,0,-5],weight:1},{rhythm:[96,-48,48,48,48,48,48],degrees:[0,-1,-2,-3,-4,2],weight:1},{rhythm:[96,-48,24,24,96,-48,48],degrees:[0,-1,-5,-2,-4],weight:1},{rhythm:[96,-48,48,48,48,48,48],degrees:[0,-1,-2,0,-1,-4],weight:1},{rhythm:[96,-48,24,24,96,48,48],degrees:[0,-3,-1,-1,0,-3],weight:1},{rhythm:[96,-48,48,48,48,48,48],degrees:[0,-1,0,1,1,3],weight:1},{rhythm:[48,-48,48,-48,48,-48,48,-48],degrees:[0,-3,1,-4],weight:1},{rhythm:[48,-60,24,-12,48,24,-12,24,-12,24,24,-72],degrees:[0,1,1,2,2,1,2],weight:1},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-2,0,-2,0,1,2,1,2,4,3,2,1,-2],weight:1},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,1,0,1,2,1,0,-1,-1,-3,0,-1,-3,-2],weight:1},{rhythm:[48,-24,24,24,24,24,24,48,-24,24,24,24,24,24],degrees:[0,0,-1,-2,-3,-6,-4,-4,-5,-4,-3,-6],weight:1},{rhythm:[48,-24,24,24,-24,48,36,24,-132],degrees:[0,-1,0,2,3,3],weight:1},{rhythm:[-144,24,24,24,24,24,24,24,24,24,24],degrees:[0,1,2,2,2,7,6,6,5,4],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,24,24,24,24],degrees:[0,-1,0,2,-1,-4,-2,-1,-1,0,2,0,-1,-2],weight:1},{rhythm:[-144,24,24,72,24,48,48],degrees:[0,1,2,4,1,0],weight:1},{rhythm:[48,24,24,48,-24,24,24,24,24,24,48,24,24],degrees:[0,-1,-2,-4,-4,-3,-2,-1,0,1,1,3],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,48,24,24],degrees:[0,-3,-4,-5,-3,-3,-1,0,0,2,1,-1,-3],weight:1},{rhythm:[24,24,24,24,48,-24,24,72,24,24,24,24,24],degrees:[0,-1,0,3,1,-3,-1,-1,-2,-1,-2,-4],weight:1},{rhythm:[48,48,48,48,48,-24,24,24,24,24,24],degrees:[0,1,2,5,5,5,5,5,2,0],weight:1},{rhythm:[48,24,24,48,-24,24,48,-24,24,24,24,24,24],degrees:[0,-1,0,1,1,3,4,4,4,4,1],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,24,48,24,24,48],degrees:[0,-3,-4,-6,-3,-5,-3,-2,0,1,-2,1,2],weight:1},{rhythm:[24,24,24,24,24,24,48,-24,48,24,24,24,24,24],degrees:[0,1,2,4,1,0,1,-3,-2,-1,0,-1,0],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,-24,24,24,48,24,24],degrees:[0,-2,-3,-4,-3,-4,-3,0,-2,-6,-4,-3,-3,-2],weight:1},{rhythm:[24,24,24,24,12,36,24,24,24,-24,24,24,24,24,24,24],degrees:[0,-2,-3,-4,-4,-3,-3,-4,-2,-4,-3,-2,-2,-2,3],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,-24,24,24,48,24,24],degrees:[0,0,-1,-2,-4,-5,-4,-2,-5,-8,-6,-5,-5,-4],weight:1},{rhythm:[24,24,24,24,96,-192],degrees:[0,-2,-3,-4,-6],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,-1,0,1,1,0,1,2,1,2,3,4,3,2],weight:1},{rhythm:[48,24,24,24,24,24,24,48,24,24,24,24,24,24],degrees:[0,-1,0,2,3,2,0,-1,-3,-1,0,-1,-3,-1],weight:1},{rhythm:[24,24,24,24,48,-24,24,48,24,-24,24,24,24,24],degrees:[0,0,2,3,0,2,0,-1,0,-1,0,2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,-120,24,24],degrees:[0,-1,0,-3,1,2,1,-1,0,2,1],weight:1},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,1,2,3,2,3,4,3,4,6,4,-3,-1],weight:1},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,24,24,12,12],degrees:[0,-1,0,1,2,0,1,3,2,3,4,3,3,2,3,4],weight:1},{rhythm:[48,24,24,24,24,24,24,96,-48,24,24],degrees:[0,-1,0,1,0,1,4,2,0,-1],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,1,2,3,3,2,3,4,3,4,6,4,-3,-1],weight:1},{rhythm:[48,24,24,24,12,12,24,24,24,24,24,24,24,24,24,12,12],degrees:[0,-1,0,1,2,2,0,1,3,2,3,4,3,3,2,3,4],weight:1},{rhythm:[24,24,24,24,24,24,24,24,96,-48,48],degrees:[0,0,-1,0,1,0,1,4,2,1],weight:1},{rhythm:[-48,48,-48,48,-48,48,-48,48],degrees:[0,-1,0,-1],weight:1},{rhythm:[-48,48,-48,48,24,-12,24,-12,24,24,-72],degrees:[0,-1,0,0,-1,0],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,48],degrees:[0,2,0,2,-1,1,0,1,-2,1,-1,1,2,1],weight:1},{rhythm:[36,36,24,36,36,24,36,36,24,36,24,-36],degrees:[0,0,-2,0,0,-2,-1,-1,-3,-1,-1],weight:1},{rhythm:[24,12,12,-24,12,-12,12,24,36,24,24,24,48,24,12,60],degrees:[0,0,0,0,0,0,0,-1,0,0,0,2,2,-1],weight:1},{rhythm:[36,-60,48,24,24,12,-12,24,36,12,12,12,24,-48],degrees:[0,-2,-1,-1,-1,-2,-2,-4,-2,-4,-5],weight:1},{rhythm:[48,48,48,24,-24,12,12,12,12,24,24,12,12,36,24,12],degrees:[0,-1,-4,-5,-3,-4,-3,-4,-3,-4,-3,-4,-5,-7,-7],weight:1},{rhythm:[12,36,48,-96,12,12,12,12,72,12,12,48],degrees:[0,1,-1,-1,-2,-4,-2,-5,-4,-5,-6],weight:1},{rhythm:[36,12,-24,12,12,12,24,36,-24,24,24,12,36,24,12,48,12],degrees:[0,0,0,-1,0,0,0,0,0,0,0,2,2,-1,-1],weight:1},{rhythm:[12,-12,12,-12,12,-12,12,12,12,36,12,24,-12,12,12,12,-12,12,24,-12,12,-12,12,-12,12,24,-12],degrees:[0,-1,-4,-4,-4,0,-1,-2,-1,-1,-1,-1,-3,-4,-1,-1,-2,-1],weight:1},{rhythm:[36,12,-48,48,24,24,12,-12,24,36,12,12,12,24,-48],degrees:[0,-2,-2,-1,-1,-1,-2,-2,-4,-2,-4,-5],weight:1},{rhythm:[48,24,-24,48,48,36,12,12,24,12,12,12,24,24,12,12],degrees:[0,-1,-4,-5,-4,-4,-4,-3,-4,-4,-4,-5,-7,-8,-8],weight:1},{rhythm:[-24,12,12,24,24,24,24,12,36,24,24,24,24,12,24,12,-48],degrees:[0,0,0,1,2,1,0,-1,1,0,0,-1,-1,-1,-3],weight:1},{rhythm:[-96,48,48,24,24,24,24,48,-24,24],degrees:[0,1,1,3,4,1,3,1],weight:1},{rhythm:[24,24,24,24,48,-24,24,24,24,24,24,24,24,24,24],degrees:[0,-2,-4,-5,-4,-4,-4,-2,-1,-4,-2,-1,0,-5],weight:1},{rhythm:[48,-120,24,24,24,24,24,48,-24,24],degrees:[0,4,4,6,7,4,6,4],weight:1},{rhythm:[24,24,24,24,24,-24,48,24,24,24,24,24,24,24,24],degrees:[0,5,3,2,3,0,-1,0,0,-1,0,0,2,0],weight:1},{rhythm:[72,-96,24,48,-24,24,48,-24,24],degrees:[0,-4,-3,1,0,-2],weight:1},{rhythm:[24,24,24,24,48,-24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,0,-1,1,1,2,1,2,4,3,1,0,-1],weight:1},{rhythm:[24,24,24,24,48,-24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,-2,-4,-6,-6,-7,-6,-5,-1,0,-1,-2,-1],weight:1},{rhythm:[72,-72,24,24,48,-24,24,24,24,24,24],degrees:[0,-3,-2,-1,-1,0,-1,0,-1],weight:1},{rhythm:[72,-72,24,24,24,-24,48,24,24,24,24],degrees:[0,-7,-5,-4,0,-1,-2,-3,-8],weight:1},{rhythm:[24,24,24,24,48,-24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,-2,-6,-3,-4,-3,-2,-1,1,0,-4,-3,-2],weight:1},{rhythm:[72,-72,24,24,48,-24,24,24,24,24,24],degrees:[0,-2,-1,0,0,1,0,1,3],weight:1},{rhythm:[72,-72,24,24,24,-24,48,24,24,24,24],degrees:[0,-7,-5,-6,0,-1,-2,-3,-8],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,-2,-6,-3,-6,-4,-3,-2,-1,1,0,-4,-3,-2],weight:1},{rhythm:[24,24,24,48,24,24,24,24,24,24,24,-24,24,24,24],degrees:[0,-1,2,0,-3,0,2,1,0,1,-3,-1,-3,-1],weight:1},{rhythm:[48,48,24,24,24,24,24,24,24,24,-24,48,24],degrees:[0,-3,-4,-1,-3,1,2,1,0,-3,0,-1],weight:1},{rhythm:[72,24,24,24,24,24,72,-120],degrees:[0,1,2,1,1,-1,-2],weight:1},{rhythm:[72,24,24,24,24,24,24,24,24,24,48,24,24],degrees:[0,-1,0,0,2,3,2,0,-1,3,0,-3,-1],weight:1},{rhythm:[72,24,24,24,24,24,72,-72,24,24],degrees:[0,1,3,2,1,0,-2,-2,1],weight:1},{rhythm:[72,24,48,24,24,24,24,24,24,48,24,24],degrees:[0,-1,0,2,3,2,0,-1,3,0,-3,-1],weight:1},{rhythm:[72,24,24,24,24,24,72,-120],degrees:[0,1,3,2,1,0,-2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,96,-48,48],degrees:[0,0,0,-1,1,2,1,0,-1,-1],weight:1},{rhythm:[96,96,96,96],degrees:[0,0,1,5],weight:1},{rhythm:[-48,48,-48,48,-48,48,-48,48],degrees:[0,-1,-1,-2],weight:1},{rhythm:[-48,48,-48,48,24,-12,24,-12,24,24,-24,24,24],degrees:[0,1,0,0,0,-1,1,3],weight:1},{rhythm:[24,24,24,24,36,36,24,24,24,24,36,12,24,24,24],degrees:[0,3,2,3,0,3,0,5,6,5,5,5,8,5,1],weight:1},{rhythm:[24,24,24,24,36,36,24,24,24,24,12,24,12,24,48],degrees:[0,3,2,3,0,3,0,5,6,5,5,5,5,7,4],weight:1},{rhythm:[72,24,48,24,24,24,24,24,24,48,24,24],degrees:[0,7,4,3,4,3,3,2,3,2,-3,-1],weight:1},{rhythm:[24,-24,24,24,24,24,24,24,24,24,24,24,36,-12,24,24],degrees:[0,-1,0,1,2,1,-1,-3,-3,-4,-1,-3,-3,-1],weight:1},{rhythm:[24,24,24,24,36,36,24,24,24,24,12,24,12,24,24,24],degrees:[0,3,2,3,0,3,0,5,6,5,5,5,5,8,5,1],weight:1},{rhythm:[24,24,24,24,36,36,24,24,24,24,12,24,12,24,24,24],degrees:[0,3,2,3,0,3,0,5,6,5,5,5,5,7,5,4],weight:1},{rhythm:[24,24,24,24,24,24,24,24,192],degrees:[0,-3,4,3,2,1,-3,-1,0],weight:1},{rhythm:[24,24,24,24,12,12,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,2,0,-1,-2,-2,-4,-5,-4,-7,0,-1,-2,-3,-7,-5],weight:1},{rhythm:[96,48,48,96,96],degrees:[0,-1,-3,-3,-4],weight:1},{rhythm:[96,96,96,96],degrees:[0,1,1,-1],weight:1},{rhythm:[96,96,96,96],degrees:[0,2,1,2],weight:1},{rhythm:[96,48,48,96,96],degrees:[0,-1,-3,-3,-3],weight:1},{rhythm:[96,96,96,96],degrees:[0,-1,0,-2],weight:1},{rhythm:[96,96,96,96],degrees:[0,-1,-1,0],weight:1},{rhythm:[96,96,96,96],degrees:[0,-2,-3,-1],weight:1},{rhythm:[96,96,96,96],degrees:[0,0,-1,-2],weight:1},{rhythm:[-192,48,-24,24,48,24,24],degrees:[0,2,1,0,-1],weight:1},{rhythm:[24,-24,24,24,24,24,24,24,24,-24,24,24,24,24,24,24],degrees:[0,-3,0,3,4,1,-1,0,-3,-1,-1,-3,-4,-3],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,-24,24,24,24,24,24],degrees:[0,-1,0,3,1,1,3,4,4,5,7,8,10],weight:1},{rhythm:[24,-24,24,24,24,24,24,24,24,-24,24,24,24,24,24,24],degrees:[0,0,2,5,4,0,-1,-2,-4,-2,-1,0,-1,-2],weight:1},{rhythm:[96,-48,48,36,36,24,-24,24,24,24],degrees:[0,-3,-2,-2,-2,-3,-2,0],weight:1},{rhythm:[36,36,24,-24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,0,-2,-1,0,1,0,-1,0,1,4,3,0],weight:1},{rhythm:[72,-72,48,72,24,24,24,24,24],degrees:[0,-1,-2,-4,-3,-2,-1,2],weight:1},{rhythm:[24,-48,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,-2,-4,-2,-1,-4,-2,-1,-1,2,0,-1],weight:1},{rhythm:[72,-72,24,24,24,-48,24,24,24,24,24],degrees:[0,3,0,-1,0,-1,0,2,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,-3,-4,-3,-6,0,0,-1,0,1,0,3,1,3],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,24,-24,24,24],degrees:[0,-3,-4,-5,-3,-3,-1,0,-1,0,-3,-1,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-2,-4,-2,-1,-8,-4,-5,-6,-5,-4,-2,-4,-5,-6],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,-192],degrees:[0,-1,-3,-1,0,7,4],weight:1},{rhythm:[48,24,24,-24,24,24,24,36,12,24,24,48,-48],degrees:[0,-1,-1,2,3,2,1,0,-2,-3,-2],weight:1},{rhythm:[36,12,36,12,36,12,24,-24,48,-96,24,24],degrees:[0,0,-1,-1,-3,-3,-4,0,3,2],weight:1},{rhythm:[48,48,-24,24,24,24,36,12,24,24,48,-48],degrees:[0,-1,2,3,2,1,0,-2,-3,-2],weight:1},{rhythm:[36,12,36,12,36,12,36,12,24,-72,24,-24,24,-24],degrees:[0,0,-1,-1,-3,-3,-4,-4,3,5,3],weight:1},{rhythm:[-192,24,24,24,24,24,-24,24,24],degrees:[0,-3,-6,-3,0,-4,-7],weight:1},{rhythm:[48,24,24,48,24,24,48,-72,24,24,24],degrees:[0,-1,-2,-4,-5,-4,-7,-4,-5,-6],weight:1},{rhythm:[48,48,-48,24,24,48,24,24,24,-24,24,24],degrees:[0,1,1,3,5,4,3,2,4,3],weight:1},{rhythm:[48,48,48,24,24,48,-72,24,24,24],degrees:[0,-1,-3,-4,-3,-1,-3,-4,-7],weight:1},{rhythm:[12,-24,12,12,-12,24,48,24,24,48,-72,24,24,24],degrees:[0,0,-1,-2,-4,-5,-4,-7,-4,-5,-6],weight:1},{rhythm:[48,48,-48,48,48,24,24,24,-24,24,24],degrees:[0,1,4,5,7,5,7,3,3],weight:1},{rhythm:[48,36,12,24,12,12,24,24,48,-144],degrees:[0,-1,-1,-3,-3,-3,-4,-4,-3],weight:1},{rhythm:[-144,24,24,48,-24,24,24,24,24,24],degrees:[0,-1,-3,-3,0,-1,0,1],weight:1},{rhythm:[-144,12,-12,12,12,48,-24,24,24,24,24,24],degrees:[0,-1,-1,-3,-3,0,-1,0,1],weight:1},{rhythm:[96,-48,24,24,48,-24,24,24,24,24,24],degrees:[0,1,0,-2,-2,1,0,1,2],weight:1},{rhythm:[24,24,24,24,24,24,48,24,-24,24,24,48,24,-24],degrees:[0,0,0,1,0,0,-1,-5,-5,-3,-5,-3],weight:1},{rhythm:[24,-24,24,-24,24,12,12,12,-12,12,-12,24,-24,24,24,24,-24,24,24],degrees:[0,0,0,1,2,3,2,1,0,1,3,1,3],weight:1},{rhythm:[96,-48,24,24,24,-24,24,24,24,-24,24,24],degrees:[0,0,-1,-2,-3,-2,0,-2,0],weight:1},{rhythm:[-192,24,24,24,24,24,24,24,24],degrees:[0,0,2,2,3,3,4,4],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,2,2,3,2,0,-1,0,0,2,2,3,3,4,4],weight:1},{rhythm:[24,24,24,24,12,12,12,-12,24,-24,24,24,24,12,24,12,24,24,24],degrees:[0,0,2,2,3,2,0,0,0,0,-3,-1,0,0,0,3,2],weight:1},{rhythm:[48,48,48,48,48,24,24,24,24,24,24],degrees:[0,-3,-1,2,0,-3,-1,0,-3,2,0],weight:1},{rhythm:[24,24,24,24,24,24,24,-24,24,24,24,12,24,12,24,24,24],degrees:[0,-5,-3,-7,-2,-3,-2,-2,-2,-5,-3,-2,-2,-2,1,0],weight:1},{rhythm:[48,48,24,24,24,-24,48,24,24,24,24,24,24],degrees:[0,-3,3,2,0,0,-3,-1,0,-3,2,0],weight:1},{rhythm:[24,24,24,24,24,24,24,-24,36,12,24,24,24,24,24,24],degrees:[0,-5,-3,-7,-2,-3,-2,-5,-5,0,-5,-6,-1,-3,-6],weight:1},{rhythm:[36,36,24,24,24,24,-24,36,12,24,24,12,-12,48,24],degrees:[0,4,7,0,7,0,-2,5,-2,5,3,3,5],weight:1},{rhythm:[24,12,12,24,12,12,24,24,48,48,48,48,48],degrees:[0,-7,-7,0,-7,-7,0,-7,-2,-1,1,-2,2],weight:1},{rhythm:[48,48,48,48,48,48,36,12,24,24],degrees:[0,5,-1,4,-1,1,-2,-2,0,5],weight:1},{rhythm:[24,-24,24,-24,24,24,24,-24,24,24,24,24,24,24,24,24],degrees:[0,0,2,0,4,1,3,5,3,0,4,2,0],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,-24],degrees:[0,2,4,2,-1,3,1,6,2,6,1,5,2,1,2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,2,2,3,3,4,4,0,0,2,2,3,2,0,-1],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,12,12,12,-12,24,-24],degrees:[0,0,2,2,3,3,4,4,0,0,2,2,3,2,0,0],weight:1},{rhythm:[24,24,24,12,24,12,24,24,24,48,48,48,48],degrees:[0,0,-3,-1,0,0,0,3,2,0,-3,-1,2],weight:1},{rhythm:[24,24,24,12,24,12,24,24,24,48,48,24,24,24,-24],degrees:[0,0,-3,-1,0,0,0,3,2,0,-3,3,2,0],weight:1},{rhythm:[36,12,24,24,12,-12,48,24,24,12,12,24,12,12,24,24,48],degrees:[0,7,0,7,5,5,7,8,1,1,8,1,1,8,1,6],weight:1},{rhythm:[48,48,48,48,48,48,48,48],degrees:[0,2,-1,3,1,6,0,5],weight:1},{rhythm:[96,96,96,96],degrees:[0,1,-1,-2],weight:1},{rhythm:[192,24,-24,24,-24,24,24,24,-24],degrees:[0,-1,-1,1,-1,3],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-5,-3,-7,-2,-3,-2,-1,-4,-2,0,-2,-5,-1,-3,-5],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-3,-1,-4,-4,-4,0,-1,-2,0,2,0,-3,1,-1,4],weight:1},{rhythm:[-192,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12],degrees:[0,0,2,2,-1,-1,2,2],weight:1},{rhythm:[12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12],degrees:[0,0,2,2,-1,2,0,-1,0,0,2,2,-1,-1,2,2],weight:1},{rhythm:[12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-36,12,-12,12,-12,12,-12,12,12,-12,12,12,-12,12,-12,24],degrees:[0,0,2,2,3,0,0,0,2,3,4,0,0,2,3,4],weight:1},{rhythm:[12,-12,12,-12,12,12,12,12,12,12,12,12,12,-12,24,-192],degrees:[0,2,3,4,2,4,3,4,6,4,3,2],weight:1},{rhythm:[-192,12,-12,12,-12,12,-12,12,12,-12,12,12,-12,12,-12,24],degrees:[0,2,3,4,0,0,2,3,4],weight:1},{rhythm:[12,-12,12,-12,12,-12,12,-12,12,12,12,12,24,24,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12,12,-12],degrees:[0,2,3,3,3,3,5,5,3,5,6,5,4,3,6,5,4,3],weight:1},{rhythm:[36,12,24,12,12,12,-12,12,-12,24,12,12,12,-12,12,12,12,12,12,12,12,-84],degrees:[0,2,3,3,4,3,2,0,0,-1,0,0,4,0,0,0,0,0],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,-24],degrees:[0,0,1,2,4,2,1,0,-1,2,-1,-2,-3,-1,-5],weight:1},{rhythm:[12,-84,12,12,12,12,12,12,12,12,36,12,12,-12,12,-12,12,12,12,12,12,-36],degrees:[0,7,6,4,6,3,2,1,0,4,4,4,2,3,3,2,2,0],weight:1},{rhythm:[12,-12,12,12,12,12,12,12,12,-84,36,12,12,-12,12,-12,12,12,12,12,12,-36],degrees:[0,0,4,0,0,0,0,0,4,4,4,2,3,3,2,2,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,-24,24,24,24,48,48],degrees:[0,-4,-4,-4,-4,-5,-4,-4,-2,-2,-4,-2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,48,48,48],degrees:[0,0,0,-1,0,1,0,-1,-2,-2,1,-4,-2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,48,48,48,-48],degrees:[0,0,0,-1,0,1,0,-1,-3,1,-3],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,-24,48,48],degrees:[0,0,0,-1,0,1,0,-1,-2,-2,1,-4,-2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,48,12,12,-24,24,24],degrees:[0,0,0,-1,0,1,0,-1,-3,-3,1,-3,-3,-3,-1],weight:1},{rhythm:[24,-48,24,48,48,24,-24,24,-24,24,-24,24,-24],degrees:[0,0,0,-1,-3,-1,-4,-5],weight:1},{rhythm:[24,-24,48,48,24,-24,48,-48,24,24,24,24],degrees:[0,0,3,0,1,-3,-2,-1,1],weight:1},{rhythm:[72,24,24,-24,48,24,-24,24,-24,48,48],degrees:[0,0,0,-1,-3,-1,-4,-5],weight:1},{rhythm:[24,-24,48,48,48,24,-24,12,36,12,36,48],degrees:[0,0,3,0,1,1,1,6,6,7],weight:1},{rhythm:[48,48,24,24,24,24,24,24,24,24,48,48],degrees:[0,4,0,0,0,2,3,4,3,2,0,-1],weight:1},{rhythm:[48,48,24,48,24,24,24,24,24,24,-24,48],degrees:[0,4,0,0,2,3,4,6,4,3,2],weight:1},{rhythm:[48,48,24,24,24,24,24,24,24,24,24,24,48],degrees:[0,4,0,0,0,2,3,4,3,2,0,0,-1],weight:1},{rhythm:[24,24,48,24,-24,24,24,-24,24,24,24,24,-24,24,24],degrees:[0,0,-2,0,-2,-2,-2,-2,-3,-2,-2,2],weight:1},{rhythm:[48,48,24,24,24,24,24,-24,48,48,-48],degrees:[0,1,3,1,0,-1,-3,-1,-3],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,48,24,24,-24],degrees:[0,-2,-2,-2,-3,-5,0,-2,1,-2,1,2,-1,-3],weight:1},{rhythm:[24,-24,24,-24,24,-24,24,-24,48,-24,12,12,-48,24,-24],degrees:[0,0,2,0,-1,-2,-2,2],weight:1},{rhythm:[48,12,12,-24,48,12,12,-24,24,-24,24,-24,24,-24,24,-24],degrees:[0,0,0,-1,-1,-1,-1,-2,-4,-5],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24,-24],degrees:[0,-2,-2,-2,-3,-5,0,-2,1,-2,1,2,-1,-3],weight:1},{rhythm:[24,-24,24,-24,24,-24,24,-24,48,24,48,-24,24,-24],degrees:[0,0,2,0,-1,-2,-2,2],weight:1},{rhythm:[48,24,-24,48,24,-24,24,-24,24,-24,24,-24,24,-24],degrees:[0,0,-1,-1,-1,-2,-4,-5],weight:1},{rhythm:[48,12,12,-24,36,12,12,12,-24,24,24,48,12,12,-72],degrees:[0,4,4,6,6,4,4,6,4,9,7,7],weight:1},{rhythm:[24,-24,24,-24,24,-24,24,-24,24,-24,24,-24,24,-24,24,-24],degrees:[0,0,-1,-1,-1,-2,-4,-5],weight:1},{rhythm:[24,-24,24,-24,24,24,24,24,24,24,24,24,48,24,-24],degrees:[0,1,0,-1,-3,-4,-3,-4,-3,3,1,1],weight:1},{rhythm:[24,-24,24,-24,48,24,-24,48,24,-24,48,48],degrees:[0,1,3,1,4,6,5,3],weight:1},{rhythm:[48,12,12,-24,48,12,12,-24,48,36,12,36,12,-48],degrees:[0,4,4,6,4,4,6,6,6,7,7],weight:1},{rhythm:[48,48,48,48,48,24,12,12,48,48],degrees:[0,2,3,6,4,3,4,3,2,-1],weight:1},{rhythm:[48,48,48,48,48,24,24,24,24,48],degrees:[0,2,3,6,4,4,6,7,6,4],weight:1},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,24,48],degrees:[0,0,2,3,2,-1,-2,-3,-1,2,1,0,-1,0],weight:1},{rhythm:[24,24,24,24,24,24,48,24,24,24,24,24,24,24,-24],degrees:[0,2,-1,0,-2,-1,-5,-4,-2,-3,-5,-4,-5,-4],weight:1},{rhythm:[48,48,48,48,48,24,12,12,48,48],degrees:[0,2,4,7,6,4,6,4,4,6],weight:1},{rhythm:[48,48,48,24,12,12,48,48,48,48],degrees:[0,2,5,3,5,3,3,2,-1,-4],weight:1},{rhythm:[24,-24,24,24,24,-24,48,24,-24,24,24,24,-24,24,-24],degrees:[0,4,2,3,0,-2,2,0,1,3],weight:1},{rhythm:[48,48,48,48,24,12,12,12,-12,12,12,24,12,12,12,-12,24],degrees:[0,-2,-3,-6,-2,-3,-2,-4,-5,-4,-5,-6,-5,-6,-9],weight:1},{rhythm:[48,-48,48,48,48,48,24,24,48],degrees:[0,2,3,4,6,7,6,4],weight:1},{rhythm:[72,24,48,48,144,-48],degrees:[0,2,-3,0,1],weight:1},{rhythm:[48,-24,24,48,48,24,24,24,24,24,-24,24,24],degrees:[0,2,2,3,7,6,4,3,4,4,6],weight:1},{rhythm:[72,24,48,48,24,-24,24,-24,48,-48],degrees:[0,0,-2,-5,-6,-4,-3],weight:1},{rhythm:[48,24,24,24,24,48,48,24,24,24,24,48],degrees:[0,0,-1,1,-3,-3,-4,-4,-3,-1,-2,-3],weight:1},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,24,24,-24],degrees:[0,0,-1,1,-3,-3,-3,-4,-3,-1,-2,-3,-4,-3],weight:1},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,24,24,-24],degrees:[0,0,-1,1,-3,-3,-3,0,1,6,5,4,3,4],weight:1},{rhythm:[24,24,24,24,24,24,24,24,12,-12,12,-12,12,-12,12,-12,24,-24,24,24],degrees:[0,2,3,4,3,2,3,4,5,5,5,5,4,4,6],weight:1},{rhythm:[48,-48,96,96,96],degrees:[0,1,-1,-1],weight:1},{rhythm:[96,96,96,96],degrees:[0,0,-1,2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,-24,24,-24,24,24],degrees:[0,0,0,0,-1,-3,-4,-5,-4,-4,-1,-3,-7,-5],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,0,0,-1,-3,1,-1,-4,-4,-1,-1,-3,-7,-5],weight:1},{rhythm:[24,-24,24,24,24,-24,24,24,24,24,24,24,48,48],degrees:[0,-4,-2,0,-4,0,-1,0,-1,-2,-1,2],weight:1},{rhythm:[24,24,48,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,0,-1,-3,-4,-5,-4,-4,-1,-1,-3,-7,-5],weight:1},{rhythm:[48,48,24,24,24,24,48,24,24,48,48],degrees:[0,0,-1,-3,1,-1,0,-1,-1,-1,-2],weight:1},{rhythm:[48,-24,24,24,24,48,24,24,24,24,48,-48],degrees:[0,-2,-3,-3,2,0,0,-1,-2,-4],weight:1},{rhythm:[24,24,-24,24,24,24,24,24,12,-12,12,12,24,24,24,-24,24,24],degrees:[0,7,6,4,3,2,0,3,3,4,3,2,0,-1,0],weight:1},{rhythm:[24,-24,24,24,12,-12,12,12,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,1,2,2,4,2,1,2,4,4,6,2,2,4],weight:1},{rhythm:[24,-48,24,24,24,24,24,-24,24,24,24,24,-24,24,24],degrees:[0,-1,0,-1,0,4,0,0,-1,0,0,2],weight:1},{rhythm:[12,-12,12,12,24,24,12,-12,12,12,12,-12,24,24,24,24,24,24,-72],degrees:[0,0,1,0,-1,0,-1,0,-1,-4,-3,-1,-6,-4,-3],weight:1},{rhythm:[-96,48,48,48,48,24,24,24,24],degrees:[0,1,2,1,2,1,2,4],weight:1},{rhythm:[24,24,24,24,24,-24,48,48,24,24,24,24,24,24],degrees:[0,-1,-3,-4,-3,-4,-3,-3,-4,-3,-4,-3,-1],weight:1},{rhythm:[24,24,24,24,24,-24,48,72,24,24,24,24,24],degrees:[0,-1,0,2,0,-1,0,-1,-3,-1,-3,-4],weight:1},{rhythm:[24,24,24,24,24,-24,48,48,24,24,24,24,24,24],degrees:[0,-1,0,2,0,-1,0,0,-1,0,-1,0,2],weight:1},{rhythm:[48,48,24,24,24,24,48,48,24,24,24,24],degrees:[0,-1,0,-1,0,2,0,-1,0,-1,0,2],weight:1},{rhythm:[48,48,24,24,24,24,48,24,24,48,24,24],degrees:[0,-1,-3,-4,-3,-1,-3,-4,-1,-3,-4,-1],weight:1},{rhythm:[72,24,24,-24,48,48,48,24,24,24,24],degrees:[0,-1,0,2,3,2,3,2,3,6],weight:1},{rhythm:[24,24,24,24,24,-24,48,48,48,24,24,24,24],degrees:[0,-1,-2,-1,-4,-5,-4,-5,-4,-5,-7,-5],weight:1},{rhythm:[120,-48,24,48,48,24,24,24,24],degrees:[0,2,0,-1,0,-1,0,3],weight:1},{rhythm:[72,-96,24,48,48,24,24,24,24],degrees:[0,2,0,-1,0,-1,0,3],weight:1},{rhythm:[36,36,24,24,24,24,24,24,24,24,24,24,-24,48],degrees:[0,0,2,1,2,3,0,1,2,3,6,3,3],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,1,4,6,7,6,4,6,7,6,7,8,8,4,5],weight:1},{rhythm:[36,36,24,36,36,24,24,24,24,24,24,-36,36],degrees:[0,0,1,2,2,4,5,4,2,4,2,5],weight:1},{rhythm:[36,36,24,24,24,24,24,24,24,24,24,24,-24,24,-24],degrees:[0,0,2,1,2,1,-1,1,2,3,6,3,3],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,24,36,36],degrees:[0,1,4,6,7,6,4,6,7,6,7,10,8,4,5],weight:1},{rhythm:[24,12,36,24,36,36,24,24,24,24,24,24,-36,36],degrees:[0,0,0,1,2,2,4,5,4,2,4,2,5],weight:1},{rhythm:[48,24,24,48,48,96,24,24,24,24],degrees:[0,2,0,0,-3,-1,0,0,1,3],weight:1},{rhythm:[-144,24,24,48,48,48,48],degrees:[0,2,3,2,0,-1],weight:1},{rhythm:[48,24,24,24,-24,24,24,48,24,24,48,48],degrees:[0,3,1,1,0,0,0,3,1,1,3],weight:1},{rhythm:[-144,24,24,48,48,24,24,24,24],degrees:[0,2,3,2,0,1,0,-1],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,48,24,24],degrees:[0,-2,0,4,2,2,1,0,-2,0,1,0,1],weight:1},{rhythm:[24,24,24,24,48,-48,24,24,24,24,24,24,24,24],degrees:[0,3,4,3,4,4,4,3,3,1,2,1,0],weight:1},{rhythm:[24,24,24,24,48,-24,24,48,24,24,48,-24,24],degrees:[0,-2,0,4,2,2,0,-2,0,1,1],weight:1},{rhythm:[-24,48,24,48,-48,24,24,24,24,24,24,24,24],degrees:[0,1,2,5,5,4,4,2,3,2,1],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,48,24,24],degrees:[0,-2,0,4,2,2,1,0,-2,0,1,1,3],weight:1},{rhythm:[24,24,24,24,48,-48,24,24,24,24,24,24,24,24],degrees:[0,3,4,3,4,4,4,3,-1,1,2,1,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,48,24,24],degrees:[0,-2,0,4,2,2,1,0,1,1,1,1,3],weight:1},{rhythm:[24,-24,24,24,48,-24,24,72,-48,24,24,24],degrees:[0,-2,0,1,-2,2,2,1,0],weight:1},{rhythm:[24,24,24,48,48,24,24,24,24,24,-24,24,24,24],degrees:[0,0,0,-3,-5,-5,-4,-3,-2,0,0,-2,-3],weight:1},{rhythm:[48,24,24,48,-48,120,24,24,24],degrees:[0,3,2,2,7,6,5,5],weight:1},{rhythm:[48,48,48,-24,24,24,-24,24,24,24,-24,48],degrees:[0,7,7,5,3,7,5,5,7],weight:1},{rhythm:[48,48,48,48,24,24,24,24,24,24,24,24],degrees:[0,-1,-3,-4,-5,-4,-3,-1,0,-1,-3,-4],weight:1},{rhythm:[48,48,24,24,24,24,-24,24,24,24,24,12,12,12,-12,24],degrees:[0,2,0,-1,-2,-3,-4,-5,-4,-3,3,2,0,-1],weight:1},{rhythm:[24,24,24,24,48,-48,24,24,24,24,24,24,24,24],degrees:[0,0,0,-2,-4,-2,-1,0,2,3,2,0,-1],weight:1},{rhythm:[24,24,24,24,24,24,48,-24,24,24,24,24,-24,24,24],degrees:[0,-1,-4,-2,0,5,5,3,2,0,-1,0,1],weight:1},{rhythm:[24,-24,24,-24,24,-24,24,-24,192],degrees:[0,0,0,-1,0],weight:1},{rhythm:[72,24,48,24,24,48,24,24,24,24,24,24],degrees:[0,2,1,0,-1,-3,-4,-3,0,-1,-3,-1],weight:1},{rhythm:[24,24,24,24,96,-72,24,24,24,24,24],degrees:[0,0,2,1,0,-1,0,-1,-3,-1],weight:1},{rhythm:[36,12,24,24,24,24,24,24,-24,24,24,24,24,24,24,24],degrees:[0,1,2,3,7,6,4,4,3,2,1,0,1,2,3],weight:1},{rhythm:[48,24,24,24,-24,24,24,24,-12,24,-12,24,24,-24,24,24],degrees:[0,1,2,3,4,5,6,5,3,4,4,5],weight:1},{rhythm:[144,24,24,24,-12,24,-12,24,48,24,24],degrees:[0,1,2,3,2,0,-2,-3,-2],weight:1},{rhythm:[168,24,120,24,24,24],degrees:[0,-2,-2,-3,-2,-5],weight:1},{rhythm:[24,12,12,12,-12,12,12,24,-24,24,24,24,24,24,24,48,-48],degrees:[0,0,0,0,0,-2,1,1,0,2,3,2,-3,-2],weight:1},{rhythm:[-144,24,24,72,24,96],degrees:[0,0,0,-2,-3],weight:1},{rhythm:[-144,24,24,72,24,96],degrees:[0,0,0,1,-4],weight:1},{rhythm:[-168,24,24,-48,24,24,-48,24],degrees:[0,5,0,4,0],weight:1},{rhythm:[24,-48,24,24,24,24,24,168,24],degrees:[0,-3,0,7,6,4,5,4],weight:1},{rhythm:[144,24,24,72,24,96],degrees:[0,2,2,2,0,-1],weight:1},{rhythm:[-144,24,24,96,96],degrees:[0,0,0,-1],weight:1},{rhythm:[48,48,48,48,72,24,96],degrees:[0,0,1,2,3,0,-2],weight:1},{rhythm:[24,-24,24,-24,24,-24,48,-192],degrees:[0,-1,0,0],weight:1},{rhythm:[96,-24,24,24,24,192],degrees:[0,-1,-3,-4,-5],weight:1},{rhythm:[-48,48,48,48,48,48,48,48],degrees:[0,1,2,3,6,5,3],weight:1},{rhythm:[96,48,48,192],degrees:[0,2,0,-1],weight:1},{rhythm:[-48,48,48,48,48,48,48,48],degrees:[0,2,3,4,7,6,4],weight:1},{rhythm:[48,48,48,48,-192],degrees:[0,3,2,0],weight:1},{rhythm:[-192,72,24,48,24,24],degrees:[0,4,3,1,1],weight:1},{rhythm:[24,24,24,24,48,-48,72,24,48,24,24],degrees:[0,-2,0,1,1,-3,1,0,-2,-2],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,24,24,24,24],degrees:[0,0,-1,-2,-4,-4,-2,-1,0,0,0,0,0,-2],weight:1},{rhythm:[48,-144,48,-24,24,72,24],degrees:[0,0,4,3,1],weight:1},{rhythm:[24,24,24,24,48,-48,72,24,72,24],degrees:[0,-2,0,1,1,-3,1,0,-2],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,48,24,24,24,24],degrees:[0,0,-1,-2,-4,-4,-2,-1,0,0,0,5,0],weight:1},{rhythm:[48,-48,24,24,24,24,48,24,24,48,24,24],degrees:[0,0,-1,0,1,1,1,1,3,1,3],weight:1},{rhythm:[96,-48,24,24,24,24,24,24,48,24,24],degrees:[0,3,4,4,4,2,-1,2,0,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,24,24,24,24],degrees:[0,0,0,-1,-3,-3,-3,-4,-4,-5,-4,-5,-4,-3],weight:1},{rhythm:[12,-12,12,-12,12,-12,12,-12,48,-48,72,24,72,24],degrees:[0,2,5,3,3,0,1,2,3],weight:1},{rhythm:[96,-72,24,24,24,24,24,24,24,24,24],degrees:[0,2,3,2,0,-1,0,0,-1,-2],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,1,0,-1,-3,-3,-4,-3,1,1,-3,-4,1,1,-4],weight:1},{rhythm:[24,24,24,24,48,-48,72,24,72,24],degrees:[0,2,6,5,4,0,1,2,3],weight:1},{rhythm:[96,-72,24,24,24,24,24,24,-24,24,24],degrees:[0,2,3,2,0,-1,0,-1,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,24,24,24,24,24],degrees:[0,1,0,-2,-4,-5,-6,-8,-4,-4,-8,-9,-4,-4,-9],weight:1},{rhythm:[48,24,24,48,-24,24,48,24,24,24,24,24,-24],degrees:[0,0,-1,2,-1,0,-1,0,-3,-1,-3],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,-24,48,48,48],degrees:[0,0,0,-1,0,0,0,-1,-3,-1,-3,-4],weight:1},{rhythm:[24,-24,24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,3,4,5,4,3,2,3,2,3,2,3,2,3,4],weight:1},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-2,-2,-2,-1,0,2,1,0,-1,-2,0,0],weight:1},{rhythm:[48,24,24,48,24,24,48,48,24,-24,48],degrees:[0,-1,-2,-3,-4,-3,-2,-5,-7,0],weight:1},{rhythm:[48,24,24,48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-1,-2,-3,-4,-3,-2,-3,-4,-5,-4,-6,-5],weight:1},{rhythm:[48,48,24,12,12,24,24,48,48,48,48],degrees:[0,2,1,2,1,0,-1,-2,-3,0,-1],weight:1},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,0,1,2,3,4,3,4,5,4,0,1],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,24,72,-24,24,24],degrees:[0,4,2,1,2,1,2,0,-1,0,-2,-1],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,24,72,-72],degrees:[0,4,2,1,2,1,2,0,-1,0],weight:1},{rhythm:[-168,24,24,-24,24,-24,24,24,24,24],degrees:[0,4,4,4,4,3,4],weight:1},{rhythm:[24,-48,24,24,24,24,24,48,48,24,-24,24,24],degrees:[0,0,0,1,2,3,4,6,3,3,1],weight:1},{rhythm:[24,-144,24,24,-24,24,-24,24,24,24,24],degrees:[0,-4,0,0,0,0,-1,0],weight:1},{rhythm:[24,-48,24,24,24,24,24,48,48,24,24,24,24],degrees:[0,0,0,1,2,3,4,6,3,1,3,1],weight:1},{rhythm:[96,-48,24,24,24,-24,48,24,-48,24],degrees:[0,-2,-1,0,3,2,-1],weight:1},{rhythm:[48,48,24,24,24,-24,48,24,24,24,-48,24],degrees:[0,3,4,3,2,3,-2,-2,2,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,-24,48,24,-48,24],degrees:[0,0,-1,0,1,-1,0,1,4,3,0],weight:1},{rhythm:[48,48,24,24,24,-24,48,24,24,24,-24,24,24],degrees:[0,3,4,3,2,3,-2,-2,2,0,0],weight:1},{rhythm:[24,24,24,24,96,-192],degrees:[0,1,-1,-2,-3],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,-12,24,-12,24,-24,24,-24,24],degrees:[0,3,0,3,0,3,0,3,2,2,2,2,2],weight:1},{rhythm:[-192,48,48,24,24,24,24],degrees:[0,4,3,4,3,2],weight:1},{rhythm:[12,-12,12,-12,12,-12,12,-12,48,-48,36,-12,36,-12,24,24,24,24],degrees:[0,1,0,-2,-4,-3,1,2,1,0,2],weight:1},{rhythm:[24,24,12,-12,24,48,-48,48,48,24,24,24,24],degrees:[0,-1,0,2,0,-4,0,-1,0,-1,-2],weight:1},{rhythm:[24,24,24,24,48,-24,24,48,48,12,-12,12,-12,12,-12,12,-12],degrees:[0,1,0,-2,-4,-4,-3,1,0,1,0,-2],weight:1},{rhythm:[96,-96,12,-12,12,-12,24,24,24,24,24,24],degrees:[0,2,0,2,3,4,7,6,4],weight:1},{rhythm:[48,48,48,-48,24,24,24,24,24,24,24,24],degrees:[0,-3,-1,-1,-3,-1,0,1,6,5,3],weight:1},{rhythm:[96,-96,12,-12,12,-12,12,-12,12,-12,24,24,24,24],degrees:[0,-2,-4,-2,-1,0,3,2,0],weight:1},{rhythm:[48,48,48,-24,24,24,24,24,24,24,24,12,-12,12,-12],degrees:[0,-3,-1,-3,-1,-3,-1,0,1,6,5,3],weight:1},{rhythm:[72,-96,12,12,24,48,24,48,24,24],degrees:[0,-3,-1,0,-1,-3,-4,-3,-8],weight:1},{rhythm:[-24,24,24,24,48,-24,12,12,24,48,24,48,24,24],degrees:[0,1,6,4,4,6,7,6,7,8,9,10],weight:1},{rhythm:[-24,24,24,24,48,-24,12,12,24,24,-24,24,48,24,24],degrees:[0,-1,-3,-2,-5,-3,-2,-3,-5,-6,-5,-10],weight:1},{rhythm:[-24,24,24,24,48,-24,12,12,48,24,24,24,24,24,24],degrees:[0,1,6,4,4,6,7,6,4,3,9,8,6],weight:1},{rhythm:[-192,72,24,24,-24,24,24],degrees:[0,-1,0,0,2],weight:1},{rhythm:[72,24,24,-24,24,24,24,24,24,-24,24,24,24,24],degrees:[0,-1,0,0,2,3,5,9,7,8,7,6],weight:1},{rhythm:[24,24,24,24,24,24,24,24,72,-48,24,24,24],degrees:[0,-1,-1,1,0,-1,-2,-3,-2,-3,-2,0],weight:1},{rhythm:[24,24,24,24,36,-12,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,0,1,1,-6,-4,-3,1,1,-3,-4,1,1,-4],weight:1},{rhythm:[24,24,24,24,24,24,24,24,-192],degrees:[0,1,2,3,4,3,2,0],weight:1},{rhythm:[-144,24,24,48,-24,24,24,24,24,24],degrees:[0,-1,-2,-3,-2,0,-2,0],weight:1},{rhythm:[96,-48,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-3,-1,0,-1,0,0,2,0,2],weight:1},{rhythm:[24,24,24,24,12,-12,12,-12,12,-12,24,-24,24,24,24,24,24,24,24],degrees:[0,-1,0,3,-1,-2,-3,-6,-3,-4,-3,-1,-1,-3,-2],weight:1},{rhythm:[12,-12,12,-12,12,-12,12,-12,24,-24,24,24,72,24,24,24,24,24],degrees:[0,-1,0,1,2,0,-1,-2,-3,-2,-3,-2,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,72,24,24,24,24,24],degrees:[0,-1,0,4,0,2,2,3,0,-1,-1,0,5],weight:1},{rhythm:[120,-24,24,24,72,24,24,24,24,24],degrees:[0,0,-1,-2,-4,-2,-2,-2,-4],weight:1},{rhythm:[24,24,24,24,48,-24,24,24,24,24,48,24,24,24],degrees:[0,1,2,4,0,-5,-2,-3,-2,0,-1,-2,-3],weight:1},{rhythm:[-192,72,24,72,24],degrees:[0,-1,0,2],weight:1},{rhythm:[24,24,24,24,48,-48,72,24,72,24],degrees:[0,-1,-2,-4,-6,-3,-4,-3,-1],weight:1},{rhythm:[24,24,24,24,48,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,0,3,1,0,-1,-3,-6,-4,-3,-2,-1,-2,-4],weight:1},{rhythm:[72,24,48,-48,72,24,72,24],degrees:[0,0,1,-1,-2,-1,1],weight:1},{rhythm:[24,24,24,24,48,-48,72,24,48,48],degrees:[0,-1,-2,-4,-6,-2,-1,3,2],weight:1},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,24,24,24],degrees:[0,-1,0,2,0,-1,-4,-7,-5,-4,-3,-2,-3,-5],weight:1},{rhythm:[72,24,48,24,24,72,24,72,24],degrees:[0,1,-1,-4,-2,-1,-2,-1,1],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,48,48,48],degrees:[0,-1,-3,-4,-3,-5,-7,-7,-3,-4,-1],weight:1},{rhythm:[48,-96,24,24,96,48,48],degrees:[0,0,-1,0,0,-1],weight:1},{rhythm:[96,48,48,72,24,72,24],degrees:[0,2,2,0,-1,0,2],weight:1},{rhythm:[24,24,24,24,24,-72,24,24,24,24,24,24,24,24],degrees:[0,-2,0,1,3,-3,-3,-3,-3,-2,-2,-2,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,72,24,48,48],degrees:[0,-1,0,2,3,0,2,3,3,2,2],weight:1},{rhythm:[24,24,24,24,24,24,24,24,24,24,24,24,72,24],degrees:[0,-1,0,2,3,2,0,-1,-1,3,2,3,0,0],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,48,24,24,24,24,24,24],degrees:[0,-2,-1,0,0,0,0,-1,-1,-2,-1,0,2,3],weight:1},{rhythm:[-192,48,-24,24,48,-24,24],degrees:[0,0,1,1],weight:1},{rhythm:[24,24,24,24,24,-24,48,48,24,24,24,24,24,24],degrees:[0,-1,-2,-3,-5,-6,-5,-3,-2,-3,-5,-5,-3],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,-24,24,24,24,-48,24],degrees:[0,-1,0,2,0,0,-1,-4,0,-1,-3,-1],weight:1},{rhythm:[24,24,24,24,24,-24,24,24,24,24,24,12,12,24,24,24,24],degrees:[0,2,3,4,5,4,2,3,3,7,6,7,5,4,3,2],weight:1},{rhythm:[24,-48,24,24,-48,24,24,-48,24,24,24,24,24],degrees:[0,-4,-3,-1,-3,0,0,0,-1,-3],weight:1},{rhythm:[24,-48,24,24,24,24,24,48,-24,12,60,24,24],degrees:[0,-1,0,2,3,4,5,6,7,9,7],weight:1},{rhythm:[48,24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,-4,-4,0,-1,-2,-1,-2,-3,-4,-5,-7,-7,-5],weight:1},{rhythm:[48,24,24,24,24,24,24,12,-12,12,-12,12,-12,12,-12,24,-24,24,24],degrees:[0,0,2,3,3,2,1,0,1,2,3,4,-3,-1],weight:1},{rhythm:[48,-24,24,48,-24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,1,1,2,1,0,-1,-3,-3,-1],weight:1},{rhythm:[48,-24,24,24,24,24,24,24,24,24,24,24,-24,24,24],degrees:[0,0,1,1,2,1,3,2,1,0,-1,2,3],weight:1},{rhythm:[48,-24,24,24,12,12,24,24,24,24,24,24,24,24,24,24],degrees:[0,0,2,0,2,0,-1,0,0,-1,-2,-3,-3,-5,-7],weight:1},{rhythm:[24,-24,24,24,24,24,24,24,36,-156],degrees:[0,0,0,3,2,3,5,3],weight:1}],Lu=[{semi:0,fifth:0},{semi:2,fifth:2},{semi:4,fifth:4},{semi:5,fifth:-1},{semi:7,fifth:1},{semi:9,fifth:3},{semi:11,fifth:5}],Ru=[{semi:0,fifth:0},{semi:2,fifth:2},{semi:4,fifth:4},{semi:5,fifth:-1},{semi:8,fifth:8},{semi:9,fifth:3},{semi:11,fifth:5}],zu=[{semi:0,fifth:0},{semi:3,fifth:9},{semi:4,fifth:4},{semi:5,fifth:-1},{semi:8,fifth:8},{semi:9,fifth:3},{semi:11,fifth:5}],Bu=[{semi:0,fifth:0},{semi:3,fifth:-3},{semi:5,fifth:-1},{semi:6,fifth:-6},{semi:7,fifth:1},{semi:10,fifth:-2}],Vu={yo:{id:`yo`,label:`陽音階（長調ペンタトニック）`,tonic:0,core:[0,1,2,4,5],strict:!1,description:`J-POPの標準。明るく素直で歌いやすい。従来の長調と同じ`},minyo:{id:`minyo`,label:`民謡音階（短調ペンタトニック）`,tonic:5,core:[5,0,1,2,4],strict:!1,description:`わらべ歌・民謡の音階。翳りがあるが暗すぎない。従来の短調と同じ`},ritsu:{id:`ritsu`,label:`律音階`,tonic:1,core:[1,2,4,5,6],strict:!0,center:{tonic:`Dsus4`,half:`G`,deceptive:`Em`,tonicPattern:/^Dsus/,a:[[`Dsus4`,`G`,`Dsus4`,`Dsus4`],[`Dsus4`,`Em`,`G`,`Dsus4`],[`G`,`Dsus4`,`Em`,`Dsus4`],[`Dsus4`,`G`,`Em`,`G`],[`Em`,`G`,`Dsus4`,`Dsus4`],[`Dsus4`,`Em7`,`G`,`Dsus4`],[`G`,`Em`,`Dsus4`,`G`],[`Dsus4`,`Am`,`G`,`Dsus4`]],b:[[`G`,`Em`,`Dsus4`,`Dsus4`],[`Em`,`G`,`Em`,`Dsus4`],[`G`,`Am`,`Em`,`Dsus4`],[`Em7`,`G`,`Dsus4`,`Dsus4`],[`Am`,`G`,`Em`,`Dsus4`],[`Dsus4`,`Em`,`G`,`Em`]],c:[[`Em`,`Dsus4`,`G`,`Em`],[`G`,`Em7`,`Am`,`G`],[`Am`,`G`,`Em`,`Dsus4`]]},description:`雅楽・声明の音階。半音を含まず、平らで荘重に流れる`},miyakobushi:{id:`miyakobushi`,label:`都節音階（陰音階）`,tonic:2,core:[2,3,5,6,0],strict:!0,center:{tonic:`Em`,half:`Am`,deceptive:`F`,tonicPattern:/^E(?:m|sus)/,a:[[`Em`,`F`,`Em`,`Em`],[`Esus4`,`F`,`Esus4`,`Em`],[`Em`,`Am`,`F`,`Em`],[`Am`,`Em`,`F`,`Em`],[`Em`,`F`,`Am`,`Em`],[`Em`,`Em`,`F`,`F`],[`Am`,`F`,`Em`,`Em`],[`Em`,`FM7`,`Am`,`Em`]],b:[[`F`,`Am`,`Em`,`Em`],[`Am`,`F`,`Em`,`Em`],[`F`,`Em`,`Am`,`Em`],[`FM7`,`Am`,`F`,`Em`],[`Am`,`Em`,`F`,`Am`],[`F`,`Am`,`F`,`Em`]],c:[[`Am`,`Em`,`F`,`Am`],[`F`,`Am`,`Esus4`,`Em`],[`Am`,`F`,`Em`,`Em`]]},description:`『さくらさくら』の音階。主音のすぐ上が半音で、翳りが濃い`},ryukyu:{id:`ryukyu`,label:`琉球音階`,tonic:0,core:[0,2,3,4,6],strict:!0,center:{tonic:`C`,half:`G`,deceptive:`Em`,tonicPattern:/^C(?![#b]|m)/,a:[[`C`,`F`,`G`,`C`],[`C`,`C`,`F`,`G`],[`F`,`G`,`C`,`C`],[`C`,`G`,`F`,`G`],[`CM7`,`F`,`G`,`C`],[`C`,`F`,`C`,`G`],[`C`,`Em`,`F`,`G`],[`F`,`C`,`G`,`C`]],b:[[`F`,`G`,`Em`,`C`],[`F`,`G`,`C`,`G`],[`G`,`F`,`C`,`C`],[`FM7`,`G`,`Em`,`F`],[`C`,`G`,`F`,`C`],[`F`,`Em`,`F`,`G`]],c:[[`Em`,`F`,`G`,`C`],[`F`,`C`,`G`,`Em`],[`C`,`Em`,`F`,`G`]]},description:`沖縄音階。レとラを抜き、ファとシを柱にする。明るく跳ねる`},dorian:{id:`dorian`,label:`ドリアン`,tonic:1,core:[1,3,4,5,0],strict:!1,description:`短調だが6度が明るい。ケルト・ロック・シティポップ`},phrygian:{id:`phrygian`,label:`フリジアン`,tonic:2,core:[2,3,5,6,1],strict:!1,description:`主音の上が半音。スパニッシュ／メタルの緊迫した響き`},lydian:{id:`lydian`,label:`リディアン`,tonic:3,core:[3,4,6,0,2],strict:!1,description:`4度が高く、浮遊して広がる。映画音楽・ゲームの空の色`},mixolydian:{id:`mixolydian`,label:`ミクソリディアン`,tonic:4,core:[4,5,0,1,3],strict:!1,description:`長調だが7度が低い。ブルースロック・民族音楽の土くささ`},harmonic_minor:{id:`harmonic_minor`,label:`和声的短音階`,tonic:5,parent:Ru,core:[5,0,1,2,4],strict:!1,center:{tonic:`Am`,half:`E7`,deceptive:`F`,tonicPattern:/^Am/,a:[[`Am`,`Dm`,`E7`,`Am`],[`Am`,`F`,`E7`,`Am`],[`Am`,`E7`,`Am`,`Am`],[`Dm`,`E7`,`Am`,`Am`],[`Am`,`AmM7`,`Dm`,`E7`],[`Am`,`F`,`Dm`,`E7`],[`F`,`E7`,`Am`,`Am`],[`Am`,`Bm7-5`,`E7`,`Am`]],b:[[`Dm`,`E7`,`Am`,`Am`],[`F`,`E7`,`Am`,`E7`],[`Dm7`,`G#dim`,`Am`,`E7`],[`F`,`Dm`,`E7`,`Am`],[`Am`,`Dm`,`Bm7-5`,`E7`],[`FM7`,`E7`,`Am`,`Am`]],c:[[`Dm`,`Am`,`Bm7-5`,`E7`],[`F`,`C+`,`Dm`,`E7`],[`Am`,`F`,`Dm`,`E7`]]},description:`導音ソ♯を持つ短調。増2度が泣きを作る。クラシック・V系・劇伴`},hijaz:{id:`hijaz`,label:`ヒジャーズ（フリジアン・ドミナント）`,tonic:2,parent:Ru,core:[2,3,4,5,6],strict:!1,center:{tonic:`E`,half:`F`,deceptive:`Am`,tonicPattern:/^E(?![#b]|m)/,a:[[`E`,`F`,`E`,`E`],[`E7`,`F`,`E`,`E`],[`Am`,`F`,`E`,`E`],[`E`,`F`,`Dm`,`E`],[`F`,`E`,`F`,`E`],[`Dm`,`E`,`F`,`E`],[`E7`,`Am`,`F`,`E`],[`E`,`Dm`,`F`,`E`]],b:[[`F`,`E`,`Am`,`E`],[`Dm`,`C+`,`F`,`E`],[`Am`,`Dm`,`F`,`E`],[`F`,`Dm`,`E`,`E`],[`E7`,`F`,`Dm`,`E`],[`Bm7-5`,`E7`,`Am`,`E`]],c:[[`Am`,`Dm`,`F`,`E`],[`Dm`,`Am`,`F`,`E7`],[`F`,`C+`,`Dm`,`E`]]},description:`主音の上が半音、主和音は長三和音。中東・スパニッシュ・メタル`},hungarian:{id:`hungarian`,label:`ハンガリアン・マイナー（ジプシー）`,tonic:5,parent:zu,core:[5,0,1,2,4],strict:!1,center:{tonic:`Am`,half:`E`,deceptive:`F`,tonicPattern:/^Am/,a:[[`Am`,`E`,`Am`,`Am`],[`Am`,`F`,`E`,`Am`],[`Am`,`AmM7`,`F`,`E`],[`F`,`E`,`Am`,`Am`],[`Am`,`Fm`,`E`,`Am`],[`Am`,`E`,`F`,`E`],[`FM7`,`E`,`Am`,`Am`],[`Am`,`C+`,`F`,`E`]],b:[[`F`,`E`,`Am`,`E`],[`Fm`,`E`,`Am`,`Am`],[`Am`,`F`,`C+`,`E`],[`FM7`,`Am`,`F`,`E`],[`E`,`F`,`E`,`Am`],[`Am`,`AmM7`,`Fm`,`E`]],c:[[`F`,`Am`,`Fm`,`E`],[`C+`,`F`,`Am`,`E`],[`Am`,`Fm`,`F`,`E`]]},description:`増2度が2か所。音階の中でいちばん跳ねた、異国めいた響き`},blues:{id:`blues`,label:`ブルース音階`,tonic:0,parent:Bu,core:[0,1,2,4,5],strict:!0,center:{tonic:`C7`,half:`G7`,deceptive:`F7`,tonicPattern:/^C7/,a:[[`C7`,`C7`,`C7`,`C7`],[`C7`,`F7`,`C7`,`C7`],[`C7`,`C7`,`F7`,`F7`],[`F7`,`F7`,`C7`,`C7`],[`C7`,`F7`,`C7`,`G7`],[`C7`,`C7`,`G7`,`F7`],[`C7`,`F7`,`G7`,`C7`],[`F7`,`C7`,`G7`,`C7`]],b:[[`F7`,`F7`,`C7`,`C7`],[`G7`,`F7`,`C7`,`C7`],[`F7`,`G7`,`C7`,`C7`],[`C7`,`F7`,`G7`,`C7`],[`F7`,`C7`,`G7`,`F7`],[`G7`,`G7`,`F7`,`C7`]],c:[[`G7`,`F7`,`C7`,`G7`],[`F7`,`F7`,`G7`,`G7`],[`C7`,`C7`,`F7`,`G7`]]},description:`ブルーノート入りの6音音階。短3度で歌い、伴奏は長3度で鳴る`}},Hu=Object.keys(Vu),Uu={1:{tonic:`Dm`,half:`G`,deceptive:`F`,tonicPattern:/^Dm/,a:[[`Dm`,`G`,`Dm`,`Dm`],[`Dm`,`Am`,`G`,`Dm`],[`Dm`,`C`,`G`,`Dm`],[`Dm7`,`G`,`Dm7`,`C`],[`Dm`,`F`,`C`,`G`],[`Dm`,`Em`,`F`,`G`],[`Dm`,`G`,`F`,`C`],[`Dm7`,`Em7`,`FM7`,`G`]],b:[[`F`,`G`,`Am`,`Dm`],[`C`,`G`,`Dm`,`Dm`],[`G`,`F`,`C`,`Dm`],[`Am`,`G`,`F`,`Dm`],[`FM7`,`G`,`Em7`,`Dm7`],[`Dm`,`G`,`C`,`Am`]],c:[[`Am`,`Dm`,`G`,`C`],[`F`,`Em`,`Dm`,`G`],[`Dm`,`Am`,`Em`,`G`]]},2:{tonic:`Em`,half:`Am`,deceptive:`C`,tonicPattern:/^Em/,a:[[`Em`,`F`,`Em`,`Em`],[`Em`,`Am`,`F`,`Em`],[`Am`,`Em`,`F`,`Em`],[`Em`,`F`,`G`,`Em`],[`Em`,`Em`,`F`,`F`],[`Em`,`C`,`F`,`Em`],[`Am`,`F`,`Em`,`Em`],[`Em7`,`FM7`,`Em7`,`Am7`]],b:[[`F`,`G`,`Am`,`Em`],[`Am`,`G`,`F`,`Em`],[`F`,`Em`,`Am`,`Em`],[`C`,`F`,`Em`,`Em`],[`FM7`,`G`,`Em7`,`Am`],[`Am`,`Em`,`F`,`G`]],c:[[`Am`,`Em`,`F`,`C`],[`C`,`G`,`Am`,`Em`],[`F`,`C`,`Am`,`Em`]]},3:{tonic:`FM7`,half:`C`,deceptive:`Dm`,tonicPattern:/^F(?![#b]|m)/,a:[[`FM7`,`G`,`FM7`,`FM7`],[`FM7`,`G`,`Em`,`Am`],[`F`,`G`,`C`,`F`],[`FM7`,`G`,`Am`,`F`],[`F`,`C`,`G`,`F`],[`FM7`,`Em7`,`Dm7`,`G`],[`F`,`G`,`F`,`C`],[`FM7`,`G`,`Dm7`,`F`]],b:[[`G`,`F`,`C`,`F`],[`Am`,`G`,`FM7`,`FM7`],[`C`,`G`,`Am`,`F`],[`G`,`Em`,`Am`,`F`],[`Dm7`,`G`,`FM7`,`FM7`],[`FM7`,`G`,`Em7`,`F`]],c:[[`Dm`,`Am`,`F`,`G`],[`Am`,`Em`,`F`,`G`],[`C`,`Am`,`Dm`,`F`]]},4:{tonic:`G`,half:`Dm`,deceptive:`Em`,tonicPattern:/^G(?![#b]|m)/,a:[[`G`,`F`,`C`,`G`],[`G`,`C`,`F`,`G`],[`G`,`F`,`G`,`G`],[`C`,`G`,`F`,`G`],[`G`,`Dm`,`F`,`G`],[`G`,`Am`,`F`,`G`],[`G`,`F`,`Dm`,`C`],[`G`,`C`,`G`,`F`]],b:[[`F`,`C`,`G`,`G`],[`Am`,`F`,`C`,`G`],[`C`,`Dm`,`F`,`G`],[`Em`,`F`,`C`,`G`],[`F`,`G`,`Am`,`G`],[`Dm7`,`F`,`C`,`G`]],c:[[`Am`,`Em`,`F`,`G`],[`C`,`Am`,`Dm`,`G`],[`Em`,`Am`,`F`,`C`]]}},Wu=e=>e.parent??Lu,Gu=e=>Wu(e).length,Ku=(e,t)=>{let n=Wu(e),r=n.length,i=(t%r+r)%r,a=Math.floor(t/r),o=n[i];return{semi:o.semi+a*12,fifth:o.fifth}},qu=(e,t)=>{let n=Wu(e),r=Math.floor(t/12),i=t-r*12,a=0,o=1/0;for(let e=0;e<n.length;e++){let t=Math.abs(n[e].semi-i);t<o&&(o=t,a=e)}return r*n.length+a},Ju=(e,t,n)=>Ku(e,qu(e,t)+n).semi,Yu=(e,t)=>Ku(e,qu(e,t)).fifth,Xu=new Map,Zu=e=>{let t=Xu.get(e.id);if(t)return t;let n=new Set(Wu(e).map(e=>(e.semi%12+12)%12));return Xu.set(e.id,n),n},Qu=new Map,$u=e=>{let t=Qu.get(e.id);if(t)return t;let n=[...e.core].sort((e,t)=>e-t);return Qu.set(e.id,n),n},ed=new Map,td=e=>{let t=ed.get(e.id);if(t)return t;let n=Wu(e),r=new Set(e.core.map(e=>(n[e].semi%12+12)%12));return ed.set(e.id,r),r},nd=(e,t)=>{let n=Gu(e);return $u(e).includes((t%n+n)%n)},rd=(e,t)=>{let n=$u(e),r=n.length,i=(t%r+r)%r,a=Math.floor(t/r);return n[i]+a*Gu(e)},id=(e,t)=>{let n=$u(e),r=Gu(e),i=(t%r+r)%r,a=Math.floor(t/r),o=0,s=1/0;for(let e=0;e<n.length;e++){let t=Math.abs(n[e]-i);t<s&&(s=t,o=e)}return a*n.length+o},ad=(e,t)=>e.strict?!td(e).has((t%12+12)%12):!nd(e,qu(e,t)),od=(e,t,n=Math.random)=>{let r=(e??``).trim()||`auto`;return Vu[r]||(r===`any`?Vu[Hu[Math.floor(n()*Hu.length)]??`yo`]:Vu[t?`minyo`:`yo`])},sd=e=>{let t=Vu[e];return t?t.description:e===`any`?`${Hu.length}\u3064\u306E\u97F3\u968E\u304B\u3089\u30E9\u30F3\u30C0\u30E0\u306B\u62BD\u9078\u3057\u307E\u3059`:`ベース調の長短に合わせて、陽音階（長調）か民謡音階（短調）を使います`},cd=e=>e.center??Uu[e.tonic]??null,ld={intro:`イントロ`,verse:`Aメロ`,prechorus:`Bメロ`,chorus:`サビ`,bridge:`Cメロ`,drop_chorus:`落ちサビ`,interlude:`間奏`,outro:`アウトロ`},ud=[`intro`,`verse`,`prechorus`,`chorus`,`bridge`,`drop_chorus`,`interlude`,`outro`],dd=[`intro`,`verse`,`prechorus`,`chorus`],fd={intro:{bars:4,barChoices:[2,4,4,6,6,8,8],seconds:{min:4,max:8},melody:!1,registerShift:0,density:.6,landing:null,progression:`b`},verse:{bars:8,barChoices:[8,8,8,16],melody:!0,registerShift:-3,density:.85,landing:4,progression:`a`},prechorus:{bars:4,barChoices:[4,4,4,8],melody:!0,registerShift:0,density:1.1,landing:1,progression:`a`},chorus:{bars:8,barChoices:[8,8,8,16],melody:!0,registerShift:4,density:1.2,landing:0,progression:`b`},bridge:{bars:4,barChoices:[4,4,8,8],melody:!0,registerShift:2,density:.9,landing:1,progression:`c`},drop_chorus:{bars:4,barChoices:[4,4,8],melody:!0,registerShift:4,density:.6,landing:0,progression:`b`},interlude:{bars:4,barChoices:[4,4,8],melody:!1,registerShift:0,density:.8,landing:null,progression:`b`},outro:{bars:4,barChoices:[4,4,8],melody:!0,registerShift:-3,density:.6,landing:0,progression:`a`}},pd=[{name:`1chorus`,label:`1コーラス`,plan:[`intro`,`verse`,`prechorus`,`chorus`]},{name:`jpop_standard`,label:`JPOP王道`,plan:[`intro`,`verse`,`verse`,`prechorus`,`chorus`,`verse`,`prechorus`,`chorus`,`bridge`,`interlude`,`chorus`,`outro`]},{name:`jpop_drop`,label:`落ちサビ入り`,plan:[`intro`,`verse`,`verse`,`prechorus`,`chorus`,`verse`,`prechorus`,`chorus`,`bridge`,`drop_chorus`,`chorus`,`outro`]},{name:`vocaloid`,label:`ボカロ王道`,plan:[`intro`,`verse`,`prechorus`,`chorus`,`verse`,`prechorus`,`chorus`,`bridge`,`chorus`,`outro`]},{name:`verse_chorus`,label:`Verse-Chorus`,plan:[`intro`,`verse`,`chorus`,`verse`,`chorus`,`bridge`,`chorus`,`outro`]}],md=(e,t)=>{if(t){let e=pd.find(e=>e.name===t);return e?e.plan:dd}let n=e.length>0?e:dd;return ud.filter(e=>n.includes(e))},hd=(e,t,n,r)=>{let i=md(e,t),a=new Map;for(let e of i){if(a.has(e))continue;let t=fd[e],i=t.barChoices??[];if(!n||i.length===0){a.set(e,t.bars);continue}let o=i,s=t.seconds;if(r&&s){let e=e=>e*4*60/r,t=i.filter(t=>e(t)>=s.min&&e(t)<=s.max);o=t.length>0?t:[Math.min(...i)]}a.set(e,o[Math.min(o.length-1,Math.floor(n()*o.length))])}let o=[],s=0,c=new Map;for(let e of i){let t=fd[e],n=a.get(e)??t.bars,r=c.get(e)??0;o.push({kind:e,startBar:s,bars:n,spec:t,keyShift:0,restatement:r>0}),c.set(e,r+1),s+=n}return o},gd=(e,t)=>{let n=md(e,t),r=0,i=0,a=0;for(let e of n){let t=fd[e],n=t.barChoices?.length?t.barChoices:[t.bars];r+=Math.min(...n),i+=Math.max(...n),a+=t.bars}return{min:r,max:i,typical:a}},_d=(e,t)=>{for(let n of e)if(t>=n.startBar&&t<n.startBar+n.bars)return n;return e[e.length-1]},vd=2,yd=10,bd=[5,6,7,7,8,9,10,10,12,14,16],xd=9,Sd=2,Cd=.4,wd=10,Td={minMelodyRange:3,minSubmelodyRange:2,maxLeapSemitones:14,maxRestRatio:.8},Ed={entropy:.6,valueKinds:.4,restRatio:.6,leapRatio:.6,maxLeap:.4,melodyRange:.6,notesPerBar:.8,shortNoteRatio:.6,barDensityCv:.6,densityCliff:1,stepRatio:.8,chromaticRatio:.6,sim1:.8,sim2:.8,sim4:1.4,sim8:1.4,phraseBreath:1,turnRatio:.8,climaxPosition:1,climaxPeaks:1,complementarity:1,subDensity:.6,subDensityCliff:.5,tensionRise:1,tensionResolve:.8,novelty:1.2},Dd=lu,Od=new Set(cu),kd={subDensity:[.5,1.8,4.5,8],complementarity:[.05,.25,.7,.95],climaxPeaks:[0,1,2,5]},Ad=12,jd=.05,Md=192,Nd=192,Pd=144,Fd=96,Id=72,X=48,Ld=36,Z=24,Q=12,Rd={C:0,"B#":0,"C#":1,Db:1,D:2,"D#":3,Eb:3,E:4,Fb:4,F:5,"E#":5,"F#":6,Gb:6,G:7,"G#":8,Ab:8,A:9,"A#":10,Bb:10,B:11,Cb:11},zd=[`C`,`C#`,`D`,`D#`,`E`,`F`,`F#`,`G`,`G#`,`A`,`A#`,`B`],Bd=[`C`,`Db`,`D`,`Eb`,`E`,`F`,`Gb`,`G`,`Ab`,`A`,`Bb`,`B`],Vd=e=>{let t=(e*7%12+12)%12;return Math.min(t,12-t)},Hd=[0,7,2,-3,4,-1,6,1,-4,3,-2,5],Ud=(e,t)=>{if(t===0||!e.trim())return e;let n=(t%12+12)%12;if(n===0)return e;let r=e.includes(`b`)||!e.includes(`#`)&&(n===3||n===5||n===10)?Bd:zd;return e.replace(/([A-G][#b]?)/g,e=>{let t=Rd[e];return t===void 0?e:r[((t+n)%12+12)%12]})},Wd=[112,120,124,126,128,130,132,132,134,136,138,142,150,155,160,168,172,175,180,185],Gd=[[`C`,`G`,`Am`,`Em7`],[`C`,`Am`,`Dm7`,`G7`],[`F`,`G`,`Em7`,`Am`],[`C`,`E7`,`Am`,`Am7`],[`Am`,`F`,`C`,`G`],[`Am`,`Dm7`,`G7`,`CM7`],[`C`,`CM7`,`F`,`G`],[`C`,`G`,`Am`,`F`],[`Am`,`Em`,`F`,`G`],[`C`,`Em7`,`F`,`G7`],[`F`,`Em7`,`Dm7`,`C`],[`Am`,`G`,`F`,`E7`],[`C`,`A7`,`Dm7`,`G7`],[`Am`,`C`,`F`,`G`],[`FM7`,`G7`,`CM7`,`Am7`],[`Dm7`,`G7`,`Em7`,`Am7`],[`Am`,`AmM7`,`Am7`,`Am6`],[`C`,`CM7`,`C7`,`F`],[`Am`,`AmM7`,`Am7`,`D7`],[`F`,`Fm`,`CM7`,`Am7`],[`C`,`Am/C`,`F/C`,`G/C`],[`Am`,`Em/A`,`F/A`,`G/A`],[`F`,`Fm`,`C`,`G7`],[`C`,`Bb`,`F`,`C`],[`Am`,`Dm7`,`Bb`,`E7`]],Kd=[[`Am`,`Em`,`F`,`C`],[`Dm7`,`Em7`,`FM7`,`G7`],[`Am7`,`Dm7`,`G7`,`CM7`],[`F`,`G`,`Am`,`G`],[`Dm7`,`G7`,`Em7`,`Am`],[`FM7`,`Em7`,`Am7`,`Dm7`],[`Am`,`G`,`FM7`,`E7`],[`C`,`Am`,`FM7`,`G7`]],qd=[[`F`,`G`,`Em7`,`Am`],[`Dm7`,`G7`,`CM7`,`A7`],[`F`,`Bm7-5`,`E7`,`Am`],[`FM7`,`G`,`Am`,`D7`],[`Dm7`,`E7`,`Am`,`A7`],[`F`,`G`,`C`,`Am`],[`FM7`,`Em7`,`Dm7`,`G7`],[`Bm7-5`,`E7`,`Am`,`A7`],[`F`,`C`,`Dm7`,`E7`],[`Dm7`,`A7`,`Dm7`,`G7`],[`FM7`,`E7`,`Am`,`G7`],[`Am7`,`D7`,`Dm7`,`G7`],[`FM7`,`Fm7`,`Em7`,`Am`],[`F`,`G`,`Ab`,`Bb`],[`Dm7`,`Db7`,`CM7`,`A7`],[`Am`,`C7`,`F`,`Fm`]],Jd=[e=>[e[0],e[1],e[2],`G7`],e=>[e[0],e[1],`Dm7`,`G7`],e=>[e[0],e[1],e[2],`G`],e=>[e[0],`F`,`Dm7`,`G7`],e=>[e[0],e[2],`Am7`,`G7`]],Yd=[(e,t)=>[e[0],e[1],`G7`,t],(e,t)=>[e[0],`Dm7`,`G7`,t],(e,t)=>[e[0],e[1],`Em7`,t],(e,t)=>[e[0],`G7`,`F`,t],(e,t)=>[e[0],`Dm7`,`FM7`,t],(e,t)=>[e[0],`G7`,`Fm`,t],(e,t)=>[e[0],`F`,`Fm`,t]],Xd=[(e,t)=>[e[0],e[1],`G7`,t===`Am`?`F`:`Am`],(e,t)=>[e[0],`Dm7`,`G7`,t===`Am`?`FM7`:`Am7`],(e,t)=>[e[0],`F`,`G7`,t===`Am`?`F`:`Am7`]],Zd=[(e,t)=>[e[0],e[1],t.half,t.tonic],(e,t)=>[e[0],t.half,e[2],t.tonic],(e,t)=>[e[0],e[1],e[2],t.tonic],(e,t)=>[t.tonic,t.half,e[2],t.tonic]],Qd=[(e,t)=>[e[0],e[1],e[2],t.half],(e,t)=>[e[0],e[1],t.tonic,t.half],(e,t)=>[e[0],t.tonic,e[2],t.half]],$d=[(e,t)=>[e[0],e[1],t.half,t.deceptive],(e,t)=>[e[0],t.half,e[2],t.deceptive],(e,t)=>[e[0],e[1],e[2],t.deceptive]],ef={F:`Fm`,FM7:`Fm7`,Am:`Ab`,Am7:`Ab`,G:`Bb`,G7:`Bb`,Em7:`Eb`,Dm7:`Dm7-5`},tf=[`block`,`arpeggio`,`offbeat`,`yatsume`,`alternating`],nf=e=>e<=130?[...tf,`arpeggio-fast`]:tf,rf={0:3,7:3,3:2,4:2,10:2,11:2,6:1,8:1},af=e=>{try{let t=U(e),n=t.notes[0]??0;return t.notes.map((e,r)=>({semi:e,fifth:t.noteFifths[r],weight:rf[((e-n)%12+12)%12]??1}))}catch{return[]}},of=e=>(e%12+12)%12,sf=(e,t)=>{let n=of(e);for(let e of t)if(of(e.semi)===n)return e.weight;let r=(n+1)%12;for(let e of t)if(of(e.semi)===r)return 0;return 1},cf=[{value:[Nd],density:`sparse`},{value:[Pd,X],density:`sparse`},{value:[Fd,Fd],density:`sparse`},{value:[Fd,X,-X],density:`sparse`},{value:[Pd,-X],density:`sparse`},{value:[X,Pd],density:`sparse`},{value:[-X,Pd],density:`sparse`},{value:[Fd,-X,X],density:`sparse`},{value:[Id,Z,-Fd],density:`sparse`},{value:[X,X,-Fd],density:`sparse`},{value:[Fd,-Fd],density:`sparse`},{value:[-X,Fd,-X],density:`sparse`},{value:[-Pd,X],density:`sparse`},{value:[X,-Pd],density:`sparse`},{value:[-Fd,X,-X],density:`sparse`},{value:[X,Z,Z,X,-X],density:`medium`},{value:[Z,Z,X,X,-X],density:`medium`},{value:[X,X,Fd],density:`medium`},{value:[Fd,X,X],density:`medium`},{value:[Id,Z,Fd],density:`medium`},{value:[X,Z,Z,Fd],density:`medium`},{value:[X,X,Z,Z,X],density:`medium`},{value:[Z,Z,X,Id,Z],density:`medium`},{value:[Id,Z,X,-X],density:`medium`},{value:[X,-Z,Z,X,X],density:`medium`},{value:[Z,X,Z,Fd],density:`medium`},{value:[Id,Id,X],density:`medium`},{value:[X,Id,Z,X],density:`medium`},{value:[Z,Z,Z,Z,Fd],density:`medium`},{value:[Fd,Z,Z,X],density:`medium`},{value:[-Z,Z,X,X,X],density:`medium`},{value:[Z,X,X,X,Z],density:`medium`},{value:[Z,Z,Id,Id],density:`medium`},{value:[Id,Id,Z,Z],density:`medium`},{value:[-Z,Z,Id,Id],density:`medium`},{value:[X,Z,Id,X],density:`medium`},{value:[Q,Z,Q,X,X,X],density:`medium`},{value:[X,Z,Q,Q,Fd],density:`medium`},{value:[Z,Q,Q,X,X,X],density:`medium`},{value:[Q,Q,Z,X,Id,Z],density:`medium`},{value:[X,X,Z,Q,Q,X],density:`medium`},{value:[Id,Q,Q,X,X],density:`medium`},{value:[Z,Z,Q,Q,Z,X,-X],density:`medium`},{value:[Q,Q,Q,Q,X,Fd],density:`dense`},{value:[Z,Q,Q,Z,Z,X,X],density:`dense`},{value:[Q,Q,Q,Q,Q,Q,Q,Q,Fd],density:`dense`},{value:[X,Q,Q,Q,Q,Fd],density:`dense`},{value:[Fd,Q,Q,Q,Q,X],density:`dense`},{value:[Z,Z,Q,Q,Q,Q,X,X],density:`dense`},{value:[Q,Q,Z,Q,Q,Z,X,X],density:`dense`}],lf=[{value:[Fd,X,-X],density:`sparse`},{value:[Id,Z,Fd],density:`sparse`},{value:[X,Id,Z,-X],density:`sparse`},{value:[X,X,-Fd],density:`sparse`},{value:[Id,Z,-Fd],density:`sparse`},{value:[Fd,-X,X],density:`sparse`},{value:[Z,Z,X,-Fd],density:`sparse`},{value:[X,Z,Z,-Fd],density:`sparse`},{value:[X,X,X,-X],density:`sparse`},{value:[Fd,Z,Z,-X],density:`sparse`},{value:[Z,Z,Z,Z,-Fd],density:`sparse`},{value:[X,Z,Z,X,-X],density:`sparse`},{value:[Z,Z,X,X,-X],density:`sparse`}],uf=[{value:[X,Z,Z,X,-X],density:`medium`},{value:[Z,Z,X,X,-X],density:`medium`},{value:[Id,Z,X,X],density:`medium`},{value:[X,X,Z,Z,-X],density:`medium`},{value:[Z,Z,Z,Z,Fd],density:`medium`},{value:[X,Z,Z,Id,Z],density:`medium`}],df=Md/16,ff=e=>{let t=[],n=0;for(let r of e)r>0&&t.push(Math.round(n/df)),n+=Math.abs(r);return t.join(`,`)},pf=.5,mf=new Map,hf=new Map,gf=e=>{let t=hf.get(e.value);if(t!==void 0)return t;let n=ff(e.value),r=(uu[n]??pf)/Math.max(1,mf.get(n)??1);return hf.set(e.value,r),r},_f=[[Z,Z,Z,Z],[Z,Z,Z,Z],[X,Z,Z],[X,Z,Z],[Z,Z,X],[Id,Z],[Id,Z],[Z,X,Z],[X,X],[X,X],[Fd],[Fd],[-X,X],[X,-X],[-Id,Z],[-X,Z,Z],[X,-Z,Z],[Ld,Ld,Z],[Ld,Ld,Z],[-Z,X,Z],[Ld,Q,Z,Z],[Z,Z,Ld,Q],[Ld,Q,Ld,Q],[-Z,Z,Z,Z],[Z,Z,Z,-Z],[Z,-Z,Z,Z],[Q,Q,Z,Z,Z],[Q,Q,Z,Z,Z],[Z,Q,Q,Z,Z],[Z,Z,Q,Q,Z],[Z,Z,Z,Q,Q],[Z,Q,Q,X],[Q,Q,Q,Q,Z,Z],[Z,Z,Q,Q,Q,Q],[Q,Q,Z,Q,Q,Z],[Q,Q,Q,Q,Q,Q,Q,Q],[Z,Q,Q,Z,-Z],[-Z,Q,Q,Z,Z]],vf=()=>{let e=_f.filter((e,t)=>_f.findIndex(t=>t.join(`,`)===e.join(`,`))===t),t=[];for(let n of _f)for(let r of e)t.push({value:[...n,...r],density:`medium`});return t},yf=[{value:[Z,Z,Z,Z,Z,Z,Z,Z],density:`medium`},{value:[Z,Z,Z,Z,Z,Z,X],density:`medium`},{value:[X,Z,Z,Z,Z,Z,Z],density:`medium`},{value:[Z,Z,Z,Z,X,X],density:`medium`},{value:[X,X,Z,Z,Z,Z],density:`medium`},{value:[X,Z,Z,X,X],density:`medium`},{value:[Z,Z,Id,Z,X],density:`medium`},{value:[X,X,Z,Z,X],density:`medium`},{value:[Id,Z,X,Z,Z],density:`medium`},{value:[Z,Z,X,X,-Z,Z],density:`medium`},{value:[Id,Id,Z,Z],density:`medium`},{value:[Z,X,Z,X,X],density:`medium`},{value:[X,Z,Z,Fd],density:`medium`},{value:[-Z,Z,X,Z,Z,X],density:`medium`},{value:[Fd,Z,Z,X],density:`medium`},{value:[Z,X,X,X,Z],density:`medium`},{value:[Z,Z,Id,Id],density:`medium`},{value:[Id,Id,Z,Z],density:`medium`},{value:[-Z,Z,Id,Id],density:`medium`},{value:[Z,Id,Z,Id],density:`medium`},{value:[Z,Q,Q,X,X,X],density:`medium`},{value:[Q,Q,Z,Z,Z,Fd],density:`medium`},{value:[X,Q,Q,Z,Fd],density:`medium`},{value:[Z,Z,Q,Q,Z,X,X],density:`medium`},{value:[Q,Q,Z,Q,Q,Z,Z,Z,X],density:`medium`},{value:[Q,Q,Q,Q,Q,Q,Z,X,X],density:`medium`},{value:[Q,Q,Q,Q,Q,Q,Q,Q,Fd],density:`medium`},{value:[Z,Q,Q,Q,Q,Q,Q,X,X],density:`medium`}],bf=[...vf(),...yf];for(let e of[...bf,...cf]){let t=ff(e.value);mf.set(t,(mf.get(t)??0)+1)}var xf=(e,t)=>{let n=(e??``).trim()||`auto`;if(n===`motif`||n===`ostinato`||n===`through`)return n;let r=t();return r<.25?`ostinato`:r<.4?`through`:`motif`},Sf=(e,t,n)=>{let r=e=>e.value.some(e=>Math.abs(e)<=Q);if(t===`eighth`){let t=e.filter(e=>!r(e)),i=e.filter(r);if(i.length===0)return t;let a=[...t],o=Math.max(1,Math.round(t.length*.1));for(let e=0;e<o;e++)a.push($(i,n));return a}let i=e.filter(r);return i.length>0&&n()<.75?i:e},Cf=[[Z,Z,X],[X,Z],[Z,Id],[Q,Q,Z,X],[Z,X,Z],[Id,Z],[X,X],[Z,Z,Z,Id],[Fd],[X]],wf=[`quarter`,`quarter`,`alternate`,`alternate`,`half`,`eighth`,`eighth`,`syncopated`,`syncopated`,`walking`,`octave`,`fifth-first`,`fifth-first`,`third-first`,`offbeat`,`offbeat`,`driving`,`sustain`,`breath`,`breath`],Tf=[`bar`,`bar`,`bar`,`half`,`half`,`slow`],Ef=[`per-bar`,`per-bar`,`two-bar`,`two-bar`,`approach`,`approach`,`pedal`],$=(e,t)=>e[Math.floor(t()*e.length)],Df=e=>{let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}},Of=e=>{if(e.length===0)return 0;let t=new Map;for(let n of e)t.set(n,(t.get(n)??0)+1);let n=0;for(let r of t.values()){let t=r/e.length;n-=t*Math.log2(t)}return n},kf=(e,t,n,r=!1)=>{let i=t.filter(e=>e.weight>=n),a=r?t.filter(e=>e.weight===2):[],o=a.length>0?a:i.length>0?i:t,s=o[0],c=1/0;for(let t of o){let n=of(t.semi);for(let r=0;r<=10;r++){let i=n+r*12,a=Math.abs(i-e);a<c&&(c=a,s={semi:i,fifth:t.fifth})}}return s},Af=59,jf=83,Mf=(e,t)=>{let n=t/2,r=Math.round(e-n),i=Math.round(e+n);return r<Af&&(i+=Af-r,r=Af),i>jf&&(r-=i-jf,i=jf),r=Math.max(Af,r),i=Math.min(jf,i),{low:r,high:i,center:(r+i)/2}},Nf=(e,t)=>t===0?e:Mf(e.center+t,e.high-e.low),Pf=[`sine`,`terrace`,`terrace`,`peak`,`peak`,`descend`,`flat`],Ff=(e,t,n,r,i)=>{switch(e){case`sine`:return Math.sin((t+i)/r*Math.PI*2);case`terrace`:{let e=[-1,.5,0,1,-.5,.75];return e[Math.floor((t+i)/r)%e.length]}case`peak`:{let e=n<=1?0:t/(n-1),r=.66;return e<=r?-1+e/r*2:1-(e-r)/.33999999999999997*1.4}case`descend`:return 1-(t+i)%r/r*2;case`flat`:return Math.sin((t+i)/Math.max(8,r*2)*Math.PI*2)*.2}},If=(e,t,n,r,i,a,o)=>{let s=Math.max(-12,Math.min(i,0)-7),c=Math.min(12,Math.max(i,0)+7),l=null,u=1/0;for(let d of n){let n=of(d.semi);for(let f=0;f<=10;f++){let p=n+f*12,m=p-t;if(m>c||m<s)continue;let h=r===null?0:Math.abs(p-r),g=a?h*.06:h<=2?h*.04:.1+(h-2)*.9,_=0;if(o!==null){let e=Math.abs(p-o)%12;_=e===3||e===4||e===8||e===9||e===7?0:e===0?.5:1.2}let v=e.strict&&ad(e,p)?1.5:0,y=g+_+v+Math.abs(m-i)*(a?1.4:.7)+(3-d.weight)*.4;y<u&&(u=y,l={semi:p,fifth:d.fifth})}}return l??kf(t+i,n,2)},Lf=55,Rf=74,zf=33,Bf=45,Vf=112,Hf=98,Uf=86,Wf=44,Gf=(e,t,n)=>{let r=e;for(;r<t;)r+=12;for(;r>n;)r-=12;return r},Kf=(e,t,n,r,i=yd)=>{let a=[];for(let n of t){let t=of(n.semi);for(let n=0;n<=10;n++){let o=t+n*12;if(o<r.low||o>r.high)continue;let s=Math.abs(o-e);s>=3&&s<=i&&a.push(o)}}if(a.length===0)return null;let o=a.filter(t=>Math.abs(t-e)===12),s=a.filter(t=>Math.abs(t-e)<12).sort((t,n)=>Math.abs(t-e)-Math.abs(n-e)),c=[...o,...o,...o,...s.slice(0,Math.max(2,Math.ceil(s.length/2)))];return $(c.length>0?c:a,n)},qf=(e,t,n)=>{if(t.length===0)return;let r=Gu(e),i=t[t.length-1],a=n-(i%r+r)%r;a>r/2&&(a-=r),a<-r/2&&(a+=r),t[t.length-1]=i+a},Jf=(e,t,n,r)=>{if(t.length===0)return;let i=Gu(e),a=t[t.length-1],o=qu(e,a),s=n-(o%i+i)%i;s>i/2&&(s-=i),s<-i/2&&(s+=i),t[t.length-1]=Gf(Ku(e,o+s).semi,r.low,r.high)},Yf=(e,t,n,r,i,a,o,s,c,l,u,d,f,p)=>{let m=t.length,h=[];if(e===`motif`||e===`sequence`||e===`climax`||e===`answer`){let t=(e===`sequence`?$([-2,-1,1,2],p):e===`climax`?5:0)+c;if(r.pentatonicMotif){let e=id(i,o);for(let n=0;n<m;n++)h.push(rd(i,e+t+a[(s+n)%a.length]))}else for(let e=0;e<m;e++)h.push(o+t+a[(s+e)%a.length]);return h}if(e===`run`){let e=p()<.5?1:-1;if(r.runShape===`scale`)for(let t=0;t<m;t++)h.push(o+e*t);else if(r.runShape===`turn`){let t=Math.ceil(m/2);for(let n=0;n<m;n++)h.push(o+e*(n<t?n:t*2-n-1))}else if(r.runShape===`broken`){let t=n.map(e=>qu(i,Gf(e.semi,60,71))).sort((e,t)=>e-t);for(let n=0;n<m;n++){let r=Math.floor(n/t.length)*Gu(i),a=e>0?n%t.length:t.length-1-n%t.length;h.push(t[a]+e*r)}}else{let t=0;for(let n=0;n<m;n++)h.push(o+e*t),t+=n%3==2?-1:1}return h}if(e===`hold`){for(let e=0;e<m;e++)r.holdShape===`long`?h.push(o):r.holdShape===`third`?h.push(o-(e===0?0:2)):h.push(o+ +(e%3==1));return h}if(e===`cadence`){let e=qu(i,Gf(72,f.low,f.high));for(let t=0;t<m;t++)if(r.cadenceShape===`descend`)h.push(e+m-1-t);else if(r.cadenceShape===`five-three-one`){let n=[4,2,0];h.push(e+n[Math.min(t,n.length-1)])}else r.cadenceShape===`leap-up`?h.push(t===m-1?e:e-Gu(i)+Math.min(t,4)):h.push(t===0&&m>1?e+1:e);return h}let g=$([2,3,4],p),_=r.stepShape===`descend`?-1:r.stepShape===`ascend`||p()<.5?1:-1;for(let e=0;e<m;e++){let t=m===1?0:e/(m-1),n;switch(r.stepShape){case`arch`:n=Math.round(Math.sin(t*Math.PI)*g);break;case`valley`:n=-Math.round(Math.sin(t*Math.PI)*g);break;case`ascend`:case`descend`:n=Math.round(t*g)*_;break;case`wave`:n=Math.round(Math.sin(t*Math.PI*2)*g)*_;break;default:n=[0,1,0,-1,0,2][e%6]}h.push(o+n)}for(let e=0;e<h.length;e++)t[e].isStrong&&(h[e]=qu(i,kf(Ku(i,h[e]).semi,n,l,u).semi));for(let e=1;e<h.length-1;e++)if(!t[e].isStrong){if(t[e].value>=d){if(p()<r.leapAffinity){let t=Ku(i,h[e-1]).semi,a=Kf(t,n,p,f,r.maxLeap);a!==null&&(h[e]=qu(i,a))}continue}p()<.22?h[e]=h[e-1]:Math.abs(h[e]-h[e-1])>2&&(h[e]=h[e-1]+Math.sign(h[e]-h[e-1]))}return h},Xf=(e,t,n,r,i,a,o,s,c,l,u,d=3)=>{let f=e,p=0,m=-1/0,h=-1/0,g=null;for(let _=-d;_<=d;_++){let d=e.map(e=>o?rd(a,id(a,e)+_):e+_),v=0;for(let e=0;e<d.length;e++){let r=sf(Gf(Ku(a,d[e]).semi,c.low,c.high),l&&t[e].at>=u?l:n),o=t[e].isStrong||t[e].value>=i;v+=o?r*3:r}let y=Gf(Ku(a,d[0]).semi,c.low,c.high);v-=Math.max(0,Math.abs(y-r)-wd),_===s&&(h=v,g=d),v>m&&(m=v,p=_,f=d)}return g!==null&&h>=m-3?{degrees:g,shift:s}:{degrees:f,shift:p}},Zf=(e,t,n,r,i)=>{let a=[],o=r;if(i.preserveContour){let t=e.map(e=>Ku(i.scale,e).semi),n=Math.min(...t),r=Math.max(...t),o=0;for(;n+o<i.register.low;)o+=12;for(;r+o>i.register.high;)o-=12;for(let e of t)a.push(e+o>=i.register.low&&e+o<=i.register.high?e+o:Gf(e+o,i.register.low,i.register.high));return a}for(let r=0;r<e.length;r++){let s=i.tonesLate&&t[r].at>=(i.lateAt??1/0)?i.tonesLate:n,c=Gf(Ku(i.scale,e[r]).semi,i.register.low,i.register.high),l=r===0?Math.min(wd,i.maxLeap+2):i.maxLeap,u=i.allowLeap?Math.max(l,i.maxLeap+4):l;if(Math.abs(c-o)>u&&(c=Gf(Ju(i.scale,o,Math.sign(c-o)*3),i.register.low,i.register.high)),!i.allowArpeggio&&r>=2&&Math.abs(a[r-1]-a[r-2])>vd){let e=-Math.sign(a[r-1]-a[r-2]);c=Gf(Ju(i.scale,a[r-1],e),i.register.low,i.register.high)}if(sf(c,s)===0&&(t[r].isStrong||t[r].value>=i.quarterSteps)){let e=c+1;if(e<=i.register.high&&!Zu(i.scale).has(of(e))&&sf(e,s)>=2&&e!==o&&i.rnd()<i.chromaticAffinity)c=e;else{let e=Gf(Ju(i.scale,c,1),i.register.low,i.register.high),t=Gf(Ju(i.scale,c,-1),i.register.low,i.register.high),n=e=>sf(e,s)*2+(r>0&&e===o?-3:0);c=n(t)>=n(e)?t:e}}a.push(c),o=c}return $f(a,t,n,r,i.quarterSteps/2,i.scale,i.register),Qf(a,t,i.octaveAffinity,i.register,i.rnd),a},Qf=(e,t,n,r,i)=>{for(let a=1;a<e.length-1;a++){if(t[a].isStrong||i()>=n)continue;let o=e[a-1],s=o+12,c=o-12,l=s<=r.high,u=c>=r.low;(l||u)&&(e[a]=l&&(!u||i()<.5)?s:c)}},$f=(e,t,n,r,i,a,o)=>{for(let s=0;s<e.length;s++){let c=e[s];if(!ad(a,c)||!a.strict&&n.some(e=>of(e.semi)===of(c)))continue;let l=s===0?r:e[s-1],u=s+1<e.length?e[s+1]:null,d=Math.abs(c-l)<=vd,f=u!==null&&Math.abs(u-c)<=vd;if((a.strict?d&&f:d||f)||!a.strict&&!t[s].isStrong&&t[s].value<=i)continue;let p=Gf(Ju(a,c,1),o.low,o.high),m=Gf(Ju(a,c,-1),o.low,o.high),h=e=>(ad(a,e)?-4:0)+sf(e,n)+(e===l?-3:0)+(u===null?0:-Math.abs(u-e)/12);e[s]=h(m)>=h(p)?m:p}},ep=[0,7,2,9,4,-1,6,1,8,3,10,5],tp=[0,-5,2,-3,4,-1,-6,1,-4,3,-2,5],np=(e,t)=>{let n=of(t),r=n,i=1/0;for(let t=0;t<=10;t++){let a=n+t*12,o=Math.abs(a-e);o<i&&(i=o,r=a)}return r},rp=(e,t,n,r,i,a,o)=>{if(a<=0||e.length<2||!n[0].isStrong||o()>=a||sf(e[1],r)<2)return;let s=qu(i,e[0]);for(let n of o()<.7?[1,-1]:[-1,1]){let a=Ku(i,s+n);if(a.semi!==e[0]&&sf(a.semi,r)===1&&!(Math.abs(a.semi-e[1])>vd)){e[0]=a.semi,t[0]=a.fifth;return}}},ip=(e,t,n,r,i,a)=>{let o=t.length-1,s=e=>a.tonesLate&&r[e].at>=(a.lateAt??1/0)?a.tonesLate:i;for(let e=0;e<t.length;e++){let r=s(e).find(n=>of(n.semi)===of(t[e]));r&&(n[e]=r.fifth)}let c=Zu(e);for(let e=0;e<t.length;e++){if(a.keepLast&&e===o||!r[e].isStrong&&r[e].value<a.quarterSteps)continue;let i=s(e).filter(e=>!c.has(of(e.semi)));for(let r of i){let i=np(t[e],r.semi),o=Math.abs(i-t[e]);if(!(o===0||o>2)&&!(o===2&&a.rnd()>a.affinity)&&!(e>0&&i===t[e-1])){t[e]=i,n[e]=r.fifth;break}}}if(a.affinity<=0)return;let l=-2;for(let e=1;e<o;e++){if(r[e].isStrong||r[e].value>a.shortSteps||e-l<=1||a.rnd()>a.affinity)continue;let i=t[e-1],o=t[e+1],s=Math.sign(o-i);if(s===0)continue;let u=Math.abs(o-i),d=u===2?i+s:u===3?o-s:null;d!==null&&(c.has(of(d))||d!==i&&d!==o&&(d<a.register.low||d>a.register.high||(t[e]=d,n[e]=(s>0?ep:tp)[of(d)],l=e)))}},ap=(e,t,n,r)=>{let i=cd(n),a=e.stepsPerBar,o=e.edo===31?31:12,s=e=>Math.max(1,Math.round(Math.abs(e)*a/Md))*Math.sign(e),c=e=>{let t=e.map(s),n=t.reduce((e,t)=>e+Math.abs(t),0),r=a-n;if(r!==0)for(let e=t.length-1;e>=0&&r!==0;e--){let n=Math.sign(t[e]),i=Math.abs(t[e])+r;i<1||(t[e]=i*n,r=0)}return t},l=s(X),u=Math.max(1,Math.round(a/2)),d=$(Wd,r),f=hd(e.sections??dd,e.template,r,d),p=f.reduce((e,t)=>e+t.bars,0),m=new Set,h=0;if(r()<.25&&!i){for(let e of $([[`prechorus`],[`bridge`],[`prechorus`,`bridge`]],r))m.add(e);r()<.33&&(h=t.mode===`minor`?-3:3)}let g=r()<.12;if(m.size>0&&h!==0)for(let e of f)m.has(e.kind)&&(e.keyShift=h);if(m.size===0&&!g&&r()<.32){let e=$([`chorus_up`,`chorus_up`,`color`,`dominant`,`subdominant`],r);if(e===`chorus_up`){let e=$([1,1,2],r),t=-1;for(let e=0;e<f.length;e++)f[e].kind===`chorus`&&(t=e);if(t>=0)for(let n=t;n<f.length;n++)f[n].keyShift=e}else{let t=e===`dominant`?7:e===`subdominant`?5:$([-2,3],r),n=$([[`prechorus`],[`bridge`],[`prechorus`,`bridge`]],r);for(let e of f)n.includes(e.kind)&&(e.keyShift=t)}}let _=$([`chorus`,`chorus`,`prechorus`],r),v=r()<.45,y=.7+r()*.3,b=r()<.3,x=!b&&r()<.25,S=.3+r()*.3,C=$(b?[-5,-3,0,0,3]:v?[3,4,5,9,7,0,-5]:[3,4,5,0,-5,-4,-7],r),w=null,T=null,E=C+$([9,9,9,8,7],r),D=_===`prechorus`?[`prechorus`,`chorus`,`bridge`]:[`chorus`],O=$([`none`,`none`,`none`,`none`,`none`,`section`,`phrase`,`chorus`,`verse`],r),k=Array(p).fill(!1);if(O!==`none`){let e=0;for(let t of f){if(!t.spec.melody)continue;let n=t.kind===`chorus`||t.kind===`drop_chorus`,r=t.kind===`verse`,i=e%2==1;e++;let a=O===`phrase`?!n:O===`chorus`?n:O===`verse`&&r;if(a||O===`section`&&i&&!n)for(let e=t.startBar;e<t.startBar+t.bars;e++)a?Math.floor((e-t.startBar)/2)%2==1&&(k[e]=!0):k[e]=!0}}let A=[];{let e=-1;for(let t=0;t<=p;t++){let n=t<p&&k[t];if(n&&e<0&&(e=t),!n&&e>=0){let n=e===0?0:s($([0,0,Z,Z,X,Id],r));A.push([e*a-n,t*a]),e=-1}}}let j=Array(p).fill(0);for(let e of f)for(let t=e.startBar;t<e.startBar+e.bars&&t<p;t++)j[t]=e.keyShift;let M=i?i.a:t.mode===`major`?Gd.filter(e=>!e[0].startsWith(`Am`)):t.mode===`minor`?Gd.filter(e=>e[0].startsWith(`Am`)):Gd,N=(e,t)=>{let n=e=>i?i.tonicPattern.test(e):t===`Am`?/^Am/.test(e):/^C(?![#b]|m)/.test(e),r=e.filter(e=>!e.some(n));return r.length>0?r:e},ee=i?i.tonic:t.mode===`minor`?`Am`:`C`,P=$(g?N(M,ee):M,r),F=i?i.b:qd,te=F.filter(e=>e[0]!==P[0]),ne=(te.length>0?te:F).filter(e=>e.join(`|`)!==P.join(`|`)),re=$(g?N(ne,ee):ne,r),I=i?i.a:Gd.filter(e=>t.mode===`minor`?!e[0].startsWith(`Am`):e[0].startsWith(`Am`)),ie=$(g?N(I,ee):I,r),ae=(i?i.c:Kd).filter(e=>e.join(`|`)!==P.join(`|`)&&e.join(`|`)!==re.join(`|`)),oe=$(g?N(ae,ee):ae,r),L=i?i.tonic:P[0].startsWith(`Am`)?`Am`:`C`,se=i?$(Qd,r)(P,i):$(Jd,r)(P),ce=i?$(Zd,r)(P,i):$(Yd,r)(P,L),le=i?$($d,r)(P,i):$(Xd,r)(P,L),ue=-1;for(let e of f)(e.kind===`chorus`||e.kind===`outro`)&&(ue=e.startBar);let de=[];for(let e of f){let t=m.has(e.kind)?ie:e.spec.progression===`c`?oe:e.spec.progression===`b`?re:P;for(let n=0;n<e.bars;n+=4){let r=n+4>=e.bars,i=Math.min(4,e.bars-n),a=e=>{de.push(...e.slice(0,i))};if(!r){a(t);continue}if(m.has(e.kind))a(t);else if(e.kind===`prechorus`)a(se);else if(e.kind===`chorus`||e.kind===`outro`){let n=g?se:e.startBar===ue?ce:le;a(e.kind===`chorus`?[...t.slice(0,2),...n.slice(2)]:n)}else a(t)}}de.length=p;let R={7:[`C`,`Em7`,`G`,`Am`],5:[`C`,`Dm7`,`F`,`Am`]};for(let e=1;e<p;e++){let t=j[e],n=j[e-1];if(t===n)continue;let i=Vd(t-n);if(i>=4)continue;let a=_d(f,e-1);if(a.kind===`prechorus`||a.kind===`chorus`||a.kind===`outro`||r()<.35)continue;let o=R[((t-n)%12+12)%12];i<=1&&o&&r()<.6?de[e-1]=$(o,r):de[e-1]=Ud(`G7`,t-n)}if(r()<.3&&!i){let e=L===`Am`?[`Am`,`Am7`]:[`C`,`CM7`],t=[];for(let n=0;n+1<p;n++)j[n]===j[n+1]&&ef[de[n]]&&e.includes(de[n+1])&&t.push(n);if(t.length>0){let e=$(t,r);de[e]=ef[de[e]]}}let z=$(i?Tf.filter(e=>e!==`slow`):Tf,r),fe=de.map(e=>[e]);if(z!==`bar`){for(let e of f)for(let t=0;t<e.bars;t+=4){let n=e.startBar+t;if(Math.min(4,e.bars-t,p-n)<4)continue;let r=[0,1,2,3].map(e=>de[n+e]);if(z===`half`){let e=[[r[0],r[1]],[r[2],r[3]]];for(let t=0;t<4;t++)fe[n+t]=e[t%2]}else{let i=t+4>=e.bars?r[3]:r[2];for(let e=0;e<4;e++)fe[n+e]=[e<2?r[0]:i]}}for(let e=0;e<p;e++)de[e]=fe[e][0]}let pe=fe.map((e,t)=>e.map(e=>Ud(e,j[t])).join(` `)).join(`|`),me=t.rootShift,he=$(nf(d),r),ge=e=>e===`chorus`||e===`interlude`||e===`drop_chorus`?`b`:e===`prechorus`?`a2`:e===`bridge`?`c`:`a`,_e=e=>{if(e.spec.landing===null)return null;let t=m.has(e.kind)?n.tonic===5?0:5:n.tonic,i=Gu(n),a=(e.spec.landing+t)%i;return g&&a===t&&(a=(a+$([2,4],r))%i),a},ve=xf(e.form,r),ye=[];for(let e of f){let t=Math.max(1,Math.round(e.bars/2)),n=ge(e.kind);for(let r=0;r<t;r++){if(!e.spec.melody){let t=e.kind===`interlude`;ye.push({role:t?r%2==0?`run`:`climax`:`hold`,source:t?`solo`:`silent`,landing:null,section:e});continue}let i=r===t-1;if(r%2==0)ye.push({role:ve===`ostinato`?`motif`:ve===`through`?r%3==2?`run`:r%3==1?`climax`:`step`:e.kind===`bridge`?`step`:e.kind===`chorus`?`climax`:n===`a2`||r>0?`sequence`:`motif`,source:ve===`ostinato`?`a`:n,landing:null,section:e});else{let t=_e(e),n=ve===`ostinato`&&!(i&&t===0);ye.push({role:i&&t===0?`cadence`:n?`motif`:ve===`through`?`step`:`answer`,source:n?`a`:`answer`,landing:i?t:null,section:e})}}}let be=ye.flatMap(e=>[e.role,e.role]);for(let e of f){if(e.kind!==`prechorus`)continue;let t=e.startBar+e.bars-1;t<be.length&&(be[t]=`run`)}let xe=e=>e%2,Se=e=>Math.floor(e/2),Ce=.25+r()*.45,we=new Map,Te=e=>{let t=_d(f,e);if(!t.spec.melody||ve===`through`)return null;if(t.restatement){let n=f.find(e=>e.kind===t.kind&&!e.restatement);if(n){let r=e-t.startBar;if(r<n.bars)return n.startBar+r}}let n=Se(e);if(ye[n].source===`silent`)return null;let i=we.get(n),a=i??r()<Ce;if(i===void 0&&we.set(n,a),!a)return null;for(let t=0;t<n;t++)if(ye[t].source===ye[n].source&&ye[t].role===ye[n].role)return ye[n].source===`answer`&&xe(e)===1?null:t*2+xe(e);return null},Ee=ve===`ostinato`?r()**2*.5:.25+r()*.75,De=15+Math.round(Ee*6),B=jf-Af-De,Oe=Af+De/2+Math.round(r()*Math.max(0,B)),V={groove:$([`eighth`,`sixteenth`],r),register:Mf(Oe,De),contour:ve===`ostinato`?`flat`:$(Pf,r),headTension:r()<.35?0:.12+r()*.3,arcPeriod:$([4,8,8,16],r),arcPhase:$([0,1,2],r),arcAmp:5*Ee,octaveAffinity:r()<.35?0:.18*Ee,maxLeap:$(bd,r),pentatonicMotif:n.strict,runShape:$([`scale`,`turn`,`broken`,`zigzag`],r),stepShape:$([`arch`,`valley`,`ascend`,`descend`,`wave`,`pivot`],r),holdShape:$([`long`,`third`,`neighbor`],r),cadenceShape:$([`descend`,`five-three-one`,`leap-up`,`hold-tonic`],r),leapAffinity:.05+r()*.2,chromaticAffinity:(r()<.2?0:.12+r()*.33)*(n.strict?.4:1),barHeadWeight:r()<.5?3:2,bassStyle:$(wf,r),bassSkeleton:$(Ef,r),bassStyleAlt:$(wf,r),bassStaccato:r()<.45,bassGhost:r()*.5,subStyle:$([`harmony`,`harmony`,`counter`],r),subInterval:$([3,4,8,9],r)},ke=Array(p).fill(V.register);for(let e of f){let t=Nf(V.register,e.spec.registerShift);for(let n=e.startBar;n<e.startBar+e.bars&&n<p;n++)ke[n]=t}let H=Sf(bf,V.groove,r),Ae=.02+r()**2*.42,je=Math.max(2.8,Math.min(12.5,7.4-6*Ae+(r()*7-2.5))),Me=e=>e.value.filter(e=>e>0).length,Ne=e=>{let t=0,n=0;for(let r of e.value)n+=Math.abs(r),r<0&&(t+=-r);return n===0?0:t/n},Pe=(e,t=1)=>Math.abs(Me(e)-je*t)+Math.abs(Ne(e)-Ae/Math.max(.5,t))*8,U=e=>{let t=0;for(let n of e)t+=gf(n);let n=r()*t;for(let t of e)if(n-=gf(t),n<=0)return t;return e[e.length-1]},Fe=(e,t=1)=>{let n=Ae/Math.max(.5,t),r=Math.max(.08,n*.6),i=e.filter(e=>Math.abs(Ne(e)-n)<=r),a=i.length>0?i:e,o=U(a);for(let e=0;e<2;e++){let e=U(a);Pe(e,t)<Pe(o,t)&&(o=e)}return o},Ie=.5+r()*1.3,Le=e=>1+e*Ie,Re=Le(-.15),ze=Le(.2),Be=Le(.1),Ve=Le(-.1),He=(e,t,n)=>{let i=je*e*2,a=Iu.filter(e=>!t.includes(e)&&(n===void 0||e.rhythm.join(`,`)!==n)),o=0,s=a.map(e=>{let t=e.rhythm.filter(e=>e>0).length,n=e.weight/(1+(t-i)**2*.25);return o+=n,n}),c=r()*o;for(let e=0;e<a.length;e++)if(c-=s[e],c<=0)return a[e];return a[a.length-1]},Ue=e=>{let t=[],n=[],r=0;for(let i of e.rhythm)(r<Md?t:n).push(i),r+=Math.abs(i);return[{value:t,density:`medium`},{value:n.length>0?n:t,density:`medium`}]},We=[],Ge=(e,t)=>{let n=He(e,We,t);return We.push(n),n},Ke=Ge(ze),qe=Ke.rhythm.join(`,`),Je=Ge(Re,qe),Ye=Ge(Be,qe),Xe=Ge(Ve,qe),W=Ge(Re,qe),Ze=Ge(ze),Qe=Ge(Re,qe),$e=Ge(ze),et=r(),[tt,nt]=Ue(Qe),[rt,it]=Ue($e),[at,ot]=Ue(W),[st,ct]=Ue(Ze),[lt,ut]=Ue(Je),[dt,ft]=Ue(Ye),[G,pt]=Ue(Ke),[mt,ht]=Ue(Xe),gt=new Map,_t=e=>{let t=Se(e),n=ye[t].source;return n===`answer`?K(t)?ye[t-1]?.source===`b`?`ansB`:`ansA`:ye[t-1]?.source===`b`?`b`:`a`:yt(t)&&K(t)?n===`b`||n===`solo`?`b2nd`:`a2nd`:n},vt=new Map,K=e=>{let t=vt.get(e);if(t!==void 0)return t;let n=r()<et;return vt.set(e,n),n},yt=e=>{let t=ye[e].section,n=ye[e].source;for(let r=0;r<e;r++)if(ye[r].section===t&&ye[r].source===n)return!0;return!1},bt=e=>{let t=gt.get(e);if(t)return t;let n=e===`a2nd`?Qe.degrees:e===`b2nd`?$e.degrees:e===`ansB`?Ze.degrees:e===`ansA`?W.degrees:e===`b`||e===`solo`?Ke.degrees:e===`a2`?Ye.degrees:e===`c`?Xe.degrees:Je.degrees;return gt.set(e,n),n},xt=Fe(H.filter(e=>e!==lt&&e!==ut)),St=Fe(H.filter(e=>e!==G&&e!==pt)),Ct=$([{value:[Z,Z,Z,Z,X,-X],density:`medium`},{value:[Z,Z,Z,Z,Z,Z,-X],density:`medium`},{value:[X,X,X,X],density:`medium`},{value:[Z,Z,Z,Z,Z,Z,X],density:`medium`}],r),wt=$(Sf(cf.filter(e=>e.density===`medium`),V.groove,r),r).value,Tt=new Map;{let e=null;for(let t of f){if(!t.spec.melody)continue;let n=lf.filter(t=>t!==e),i=$(n.length>0?n:lf,r);Tt.set(t.startBar,i),e=i}}let Et=$(uf,r),q=new Set,Dt=new Set;for(let e of f)e.spec.melody&&Dt.add(e.startBar+e.bars-1);let Ot=new Set;for(let e of f){if(e.kind!==`chorus`)continue;let t=Se(e.startBar);Ot.add(t),e.bars>=8&&Ot.add(t+2)}let kt=new Set;for(let e of Ot)kt.add(e*2),kt.add(e*2+1);{let e=null;for(let t of f)t.kind===`chorus`&&t.bars>=8&&(e=t);if(e){let t=Se(e.startBar)+2,n=ke[t*2],r={low:Math.max(n.low,n.high-12),high:n.high,center:n.high-6};ke[t*2]=r,ke[t*2+1]=r}}let At=[],jt=[],Mt=new Map;for(let e=0;e<p;e++){let t=Se(e),n=xe(e),i=Te(e),a=i!==null&&(!Ot.has(t)||kt.has(i))?i:null;if(jt.push(a),a!==null){At.push(At[a]),q.has(a)&&q.add(e);continue}if(Ot.has(t)){At.push(c((n===0?G:pt).value));continue}let o=ye[t].source===`b`||ye[t].source===`solo`,s=ye[t].source===`a2`,l=ye[t].source===`c`;if(ye[t].section.kind===`prechorus`&&e===ye[t].section.startBar+ye[t].section.bars-1){At.push(c(Ct.value));continue}let u=()=>{if(ve===`through`){let e=Mt.get(t);if(e)return e;let n=o?ze:s?Be:l?Ve:Re,i=Fe(H,n),a=[i,r()<.45?i:Fe(H.filter(e=>e!==i),n)];return Mt.set(t,a),a}return yt(t)&&K(t)?o?[rt,it]:[tt,nt]:o?[G,pt]:s?[dt,ft]:l?[mt,ht]:[lt,ut]},d;if(ye[t].source===`answer`){let i=ye[t].landing!==null,a=ye[t-1]?.source,[o,s]=K(t)?a===`b`?[st,ct]:[at,ot]:a===`b`?[G,pt]:[lt,ut],c=a===`b`?St:xt;n===0?d=r()<Cd?c:o:i?(d=Tt.get(ye[t].section.startBar)??s,q.add(e)):d=r()<.28?Et:r()<.12?c:s}else{let[e,t]=u();d=n===0?e:t}At.push(c(d.value))}let Nt=Array(p).fill(null),Pt=new Map,Ft=new Map,It=[],Lt=[],Rt=[],zt=[],Bt=[],Vt=[],Ht=[],Ut=[],Wt=Array(p).fill(0),Gt=0,Kt=0,qt=0,Jt=0,Yt=0,Xt=0,Zt=0,Qt=$([60,64,65,67,69,72,74,76],r),$t=null,en=Sd,tn=(e,t)=>{let n=Cf.filter(n=>n.reduce((e,n)=>e+t(Math.abs(n)),0)<=e);return n.length===0?null:$(n,r)},nn=e=>{let t=[],n=0;for(let r of e)r.at>n&&t.push([n,r.at-n]),n=r.at+r.value;return n<a&&t.push([n,a-n]),t};for(let e=0;e<p;e++){let t=be[e],i=e*a,c=af(de[e]),d=fe[e][1]??null,m=d?af(d):null,h=Math.floor(a/2);if(c.length===0)continue;let g=At[e],_=[],x=0;for(let e of g)e>0&&_.push({isStrong:x%u===0,value:e,at:x}),x+=Math.abs(e);if(_.length===0)continue;let S=_d(f,e).kind,O=S===`prechorus`||S===`chorus`||S===`drop_chorus`||S===`bridge`,k=O?2:V.barHeadWeight,A=Ff(V.contour,e,p,V.arcPeriod,V.arcPhase),M=ke[e],N=M.center+A*V.arcAmp,ee=xe(e),P;ee===1&&e>0?(P=kf(Qt,c,k,O).semi,Math.abs(P-Qt)>4&&(P=kf(Qt,c,1,O).semi)):P=kf(Qt+(N-Qt)*.5,c,k,O).semi;let F=xe(e)===0?0:At[e-1].filter(e=>e>0).length,te=e>0?be[e-1]:null,ne=t===`motif`&&(te===`motif`||te===`sequence`||te===`climax`)?$([-2,-1,1,2],r):0,re=Yf(t,_,c,V,n,bt(_t(e)),qu(n,P),F,ne,k,O,l,M,r),I=jt[e];I!==null&&Nt[I]&&re.splice(0,re.length,...Nt[I]);let ie=ye[Se(e)].landing;ie!==null&&xe(e)===1&&qf(n,re,ie),Nt[e]=[...re];let ae=I!==null||t===`motif`||t===`sequence`||t===`climax`||t===`answer`,oe=re;if(ae){let t=re.join(`,`),r=Se(e),i=xe(e)===1?Ft.get(r)??Pt.get(t)??null:Pt.get(t)??null,a=Xf(re,_,c,Qt,l,n,V.pentatonicMotif,i,M,m,h,ve===`ostinato`?0:3);oe=a.degrees,Pt.set(t,a.shift),xe(e)===0&&Ft.set(r,a.shift)}let L=Zf(oe,_,c,Qt,{scale:n,register:M,maxLeap:V.maxLeap,allowLeap:t===`climax`,allowArpeggio:t===`climax`||t===`run`&&V.runShape===`broken`||t===`cadence`&&V.cadenceShape!==`descend`,quarterSteps:l,octaveAffinity:t===`motif`||t===`sequence`||t===`climax`?0:V.octaveAffinity,chromaticAffinity:V.chromaticAffinity,tonesLate:m,lateAt:h,rnd:r,preserveContour:ae&&!m});ie!==null&&xe(e)===1&&Jf(n,L,ie,M);let se=ye[Se(e)].source,ce=se===`solo`,le=se===`silent`||ce;if(!le&&$t!==null){let e=$t;for(let t=0;t<L.length;t++){let n=L[t]-e;if(Math.abs(n)>xd){let r=-Math.sign(n)*12,i=e=>e+r>=Af&&e+r<=jf,a=t===0&&L.every(i);if(en<=0&&Math.abs(L[t]+r-e)<Math.abs(n)&&(a||i(L[t]))){if(a)for(let e=0;e<L.length;e++)L[e]+=r;else L[t]+=r}else en=Math.max(0,en-1)}e=L[t]}}let ue=L.map(e=>Yu(n,e));!ae&&(ie===null||xe(e)!==1)&&rp(L,ue,_,c,n,V.headTension,r),ip(n,L,ue,_,c,{register:M,tonesLate:m,lateAt:h,affinity:V.chromaticAffinity,quarterSteps:l,shortSteps:s(Z),keepLast:ie!==null&&xe(e)===1,rnd:r});let R=L[0],z=0,pe=0;for(let r=0;r<_.length;r++){let a=L[r];if(z+=(3-sf(a,c))/3*_[r].value,pe+=_[r].value,!le&&t!==`climax`){let e=Math.abs(a-Qt);Kt=Math.max(Kt,e),Yt++,e>vd?qt++:e>0&&Jt++}let l=_[r];if(le){if(ce){let t=j[e],n=t===0?0:Hd[(t%12+12)%12];Ht.push({startStep:i+l.at,pitchUnits:jn(a+t,ue[r]+n,o),durationSteps:l.value,velocity:l.at===0?116:l.value<=s(Q)?96:106})}Qt=a;continue}Zu(n).has(of(a))||Xt++;let u=j[e],d=u===0?0:Hd[(u%12+12)%12];It.push({startStep:i+l.at,pitchUnits:jn(a+u,ue[r]+d,o),durationSteps:l.value,velocity:l.at===0?112:l.value<=s(Q)?88:100}),Ut.push(l.value),Qt=a,$t=a}if(Wt[e]=pe===0?0:z/pe,!le){for(let e of g)e<0&&(Gt+=-e);Zt++}let me=Qt>=R?-1:1,he=nn(_).reduce((e,[,t])=>e+t,0),ge=t===`cadence`?`pad`:he>=s(Z)*2&&V.subStyle!==`harmony`?`answer`:V.subStyle,_e=(t,n,r)=>{if(n<=0||t+n>a)return r;let s=kf(r,c,2),l=Gf(s.semi,Lf,Rf),u=j[e],d=u===0?0:Hd[(u%12+12)%12];return Lt.push({startStep:i+t,pitchUnits:jn(l+u,s.fifth+d,o),durationSteps:n,velocity:t===0?90:84}),l},Ce=Gf(R-V.subInterval,Lf,Rf);if(ge===`answer`){let e=0;for(let[t,r]of nn(_)){let i=tn(r,s);if(!i)continue;let a=t;for(let t=0;t<i.length;t++){let r=i[t],o=s(Math.abs(r));r>0&&(Ce=_e(a,o,t===0?Ce:Ju(n,Ce,me)),e++),a+=o}}e===0&&(Ce=_e(0,a,Ce))}else if(ge===`harmony`)for(let e=0;e<_.length;e++)Ce=_e(_[e].at,_[e].value,L[e]-V.subInterval);else if(ge===`counter`){let e=0,t=0;for(let r of wt){let i=s(Math.abs(r));r>0&&e>0&&(Ce=_e(e,i,t===0?Ce:Ju(n,Ce,me*(t%2==0?1:-1))),t++),e+=i}}else ge===`pedal`?_e(0,a,Ce):ge===`long-short`?(Ce=_e(0,s(Pd),Ce),_e(s(Pd),s(X),Ju(n,Ce,me))):t===`cadence`?_e(0,a,Ce):_e(s(X),s(Pd),Ce);let we=_d(f,e);if(!le&&D.includes(we.kind)){let t=j[e],a=t===0?0:Hd[(t%12+12)%12],s=(e,s,u,d)=>{let f=s,p=[];for(let s=0;s<_.length;s++){let m=If(n,L[s],c,f,u,v,d?.[s]??null),h=Gf(m.semi,Af-12,jf+7);for(;h-L[s]>12;)h-=12;for(;h-L[s]<-12;)h+=12;f=h,p.push(h),(_[s].isStrong||_[s].value>=l||r()<y)&&e.push({startStep:i+_[s].at,pitchUnits:jn(h+t,m.fifth+a,o),durationSteps:_[s].value,velocity:_[s].at===0?82:76})}return p},u=s(zt,w,C,null);if(w=u[u.length-1]??w,b){let e=s(Bt,T,E,u);T=e[e.length-1]??T}}if(we.kind===`prechorus`||we.kind===`chorus`||we.kind===`bridge`||we.kind===`drop_chorus`){let t=kf(jf+2,c,2),n=Gf(t.semi,jf-4,jf+8),r=j[e],s=r===0?0:Hd[(r%12+12)%12];Vt.push({startStep:i,pitchUnits:jn(n+r,t.fifth+s,o),durationSteps:a,velocity:we.kind===`drop_chorus`?50:62})}let Te=c[0],Ee=c.find(e=>e.weight===3&&e!==Te),De=c.find(e=>e.weight===2),B=Gf(Te.semi,zf,Bf),Oe=Ee?Gf(Ee.semi,zf,Bf):B,H=De?Gf(De.semi,zf,Bf):B,Ae=Gf(B+12,zf,Bf),je=af(de[(e+1)%p]),Me=Gf(Ju(n,je[0]?Gf(je[0].semi,zf,Bf):B,-1),zf,Bf),Ne={quarter:[[B,X],[B,X],[Oe,X],[B,X]],alternate:[[B,X],[Oe,X],[B,X],[Oe,X]],half:[[B,Fd],[Oe,Fd]],eighth:[[B,Z],[B,Z],[B,Z],[B,Z],[Oe,Z],[Oe,Z],[B,X]],syncopated:[[B,Id],[B,Z],[Oe,X],[B,X]],walking:[[B,X],[H,X],[Oe,X],[Me,X]],octave:[[B,X],[Ae,X],[Oe,X],[Ae,X]],"fifth-first":[[Oe,X],[B,X],[B,Z],[Oe,Z],[B,X]],offbeat:[[B,-Z],[B,Id],[Oe,Z],[B,Id]],driving:[[B,Q],[B,Q],[B,Z],[B,Q],[B,Q],[B,Z],[Oe,Z],[B,Z],[B,X]],sustain:[[B,Nd]],"third-first":[[H,Id],[B,Z],[Oe,X],[B,X]],breath:[[B,X],[B,-X],[Oe,X],[B,X]]},Pe=e%2==1,U=V.bassSkeleton===`two-bar`&&Pe?V.bassStyleAlt:V.bassStyle,Fe=t===`hold`||t===`cadence`?[[B,Nd]]:t===`run`?Ne[U===`half`||U===`quarter`||U===`sustain`?`eighth`:U]:Ne[U],Ie=V.bassSkeleton===`pedal`?Gf((af(de[e-e%4])[0]??Te).semi,zf,Bf):null,Le=Ie===null?Fe:Fe.map(([e,t])=>[e===Oe?Gf(Ie+7,zf,Bf):Ie,t]);if(V.bassSkeleton===`approach`&&Le.length>=2&&t!==`hold`&&t!==`cadence`&&de[(e+1)%p]!==de[e]){let e=Le.length-1;Le=Le.map((t,n)=>n===e?[Me,t[1]]:t)}let Re=[],ze=0;for(let[t,r]of Le){let c=a-ze;if(c<=0)break;if(r<0){ze+=Math.min(s(-r),c);continue}let u=Math.min(s(r),c),d=t,f=t===B||t===Ae?Te.fifth:t===Oe?Ee?.fifth??Te.fifth:t===H?De?.fifth??Te.fifth:Yu(n,t);if(m&&ze>=h&&Ie===null){let e=kf(d,m,1);d=Gf(e.semi,zf,Bf),f=e.fifth}let p=j[e],g=p===0?0:Hd[(p%12+12)%12];Re.push({startStep:i+ze,pitchUnits:jn(d+p,f+g,o),durationSteps:u,velocity:ze%(l*2)==0?Vf:ze%l===0?Hf:Uf}),ze+=u}if(V.bassStaccato&&t!==`hold`&&t!==`cadence`&&(U===`eighth`||U===`octave`||U===`alternate`||U===`driving`||U===`offbeat`))for(let e of Re)e.durationSteps>=2&&e.durationSteps<l*2&&(e.durationSteps=Math.max(1,Math.round(e.durationSteps/2)));if(t!==`hold`&&t!==`cadence`&&r()<V.bassGhost){let e=s(Q),t=s(Z),n=Re.findIndex((e,n)=>n>0&&(Re[n-1].durationSteps===l||Re[n-1].durationSteps===t)&&e.startStep%l===0);if(n>0&&e>=1){let t=Re[n-1];t.durationSteps-=e,Re.splice(n,0,{startStep:Re[n].startStep-e,pitchUnits:Re[n].pitchUnits,durationSteps:e,velocity:Wf})}}for(let e of Re)Rt.push(e)}let rn=s(Z),an=new Map;for(let e=0;e<It.length-1;e++){let t=It[e],i=It[e+1],o=t.startStep+t.durationSteps;if(o%a!==0||i.startStep!==o||t.durationSteps>rn)continue;let s=Math.floor(o/a);if(s>=p||e+1>=It.length-1)continue;let c=_d(f,s-1),l=_d(f,s);if(!l.spec.melody||c!==l||q.has(s)||kt.has(s)||kt.has(s-1))continue;let u=Math.round(t.pitchUnits/31),d=Math.round(i.pitchUnits/31);if(Math.abs(d-u)>3)continue;let m=It[e+2];if(m&&Math.floor(m.startStep/a)===s){let e=Math.round(m.pitchUnits/31)-(j[s]??0);if(!Zu(n).has(of(e)))continue}let h=be[s],g=.3;h===`motif`?g=.1:h===`sequence`?g=.35:h===`climax`?g=.45:h===`cadence`&&(g=.1);let _=`${At[s].join(`,`)}|${xe(s)}`,v=an.get(_);if(v===void 0&&(v=r()<g,an.set(_,v)),v){t.durationSteps+=i.durationSteps,It.splice(e+1,1),e<Ut.length-1&&(Ut[e]+=Ut[e+1],Ut.splice(e+1,1));for(let e of[zt,Bt]){let n=e.findIndex(e=>e.startStep===i.startStep);if(n<0)continue;let r=e.findIndex(e=>e.startStep===t.startStep);r>=0&&(e[r].durationSteps+=e[n].durationSteps),e.splice(n,1)}e--}}let on=new Map,sn=-1,cn=0;for(let e=0;e<It.length;e++){let t=Math.floor(It[e].startStep/a);if(t===sn?cn++:(sn=t,cn=0),t>=p||Dt.has(t)||kt.has(t))continue;let n=be[t],i=.08;n===`motif`||n===`sequence`?i=0:n===`climax`?i=.3:n===`cadence`&&(i=0);let o=!1;if(It[e].durationSteps===l){let e=`${At[t].join(`,`)}|${xe(t)}|${n}|${cn}`,a=on.get(e);a===void 0?(o=r()<i,on.set(e,o)):o=a}if(o){let t=s(Z),n={...It[e],startStep:It[e].startStep+t,durationSteps:t};It[e].durationSteps=t,It.splice(e+1,0,n),e<Ut.length&&(Ut[e]=t,Ut.splice(e+1,0,t)),e++,cn++}}let ln=e=>{if(e.length===0)return 0;let t=e.map(e=>e.pitchUnits);return(Math.max(...t)-Math.min(...t))/31},un=On(me,o);if(un!==0)for(let e of[It,Lt,Rt,zt,Bt,Vt,Ht])for(let t of e)t.pitchUnits+=un;if(Rt.length>0){let e=On(12,o),t=()=>Rt.reduce((e,t)=>e+t.pitchUnits,0)/Rt.length/31;for(;t()>=48;)for(let t of Rt)t.pitchUnits-=e}let dn=x?It.filter(e=>e.durationSteps>=l||r()<S).map(e=>({...e,velocity:Math.max(40,e.velocity-26)})):[];return{form:ve,chordProgression:pe,chordPattern:he,rootShift:me,keyName:t.keyName,keyLabel:t.keyLabel,scaleId:n.id,scaleLabel:n.label,moodLabel:t.moodLabel,bpm:d,sections:f,bars:p,vocal:{duetSpans:A,duetStyle:O,harmonyKinds:D,harmony2:b,octaveLayer:x},tonal:{relativeKinds:[...m],relativeShift:h,floating:g},melody:It,submelody:Lt,bass:Rt,harmony:zt,harmony2:Bt,octave:dn,pad:Vt,solo:Ht,melodyDurations:Ut,restSteps:Gt,totalSteps:Math.max(1,Zt)*a,maxLeap:Kt,leapRatio:Yt===0?0:qt/Yt,stepRatio:Yt===0?0:Jt/Yt,chromaticRatio:It.length===0?0:Xt/It.length,melodyRange:ln(It),submelodyRange:ln(Lt),barTension:Wt,stepsPerBar:a}},op=e=>e.map(e=>({startStep:e.startStep,pitchSemi:e.pitchUnits/31,durationSteps:e.durationSteps})).sort((e,t)=>e.startStep-t.startStep),sp=(e,t)=>{let n=Of(e.melodyDurations),r=new Set(e.melodyDurations).size,i=e.restSteps/e.totalSteps,a=op(e.melody),o=a.length===0?0:Math.floor(a[0].startStep/e.stepsPerBar)*e.stepsPerBar,s=e=>o===0?e:e.map(e=>({...e,startStep:e.startStep-o})),c={stepsPerBar:e.stepsPerBar,bars:Math.max(1,e.bars-o/e.stepsPerBar)},l=s(a),u=Ou(l,s(op(e.submelody)),c),d=[],f=[];for(let t of e.sections)for(let e=t.startBar;e<t.startBar+t.bars;e++)t.kind===`verse`?d.push(e):(t.kind===`chorus`||t.kind===`drop_chorus`)&&f.push(e);let p=ju(e.barTension,{verseBars:d,chorusBars:f}),m=Au(l,c),h=Pu({entropy:n,restRatio:i,leapRatio:e.leapRatio,melodyRange:e.melodyRange,density:m,structure:u}),g=t.length===0?1:Math.min(1,Math.min(...t.map(e=>Fu(h,e)))/1),_=(e,t)=>Mu(t,e[0],e[1],e[2],e[3]),v=(e,t)=>Nu(t,su[e]),y=e.bars>24?[0,1,Math.round(e.bars/16),Math.round(e.bars/8)+2]:kd.climaxPeaks,b={entropy:v(`entropy`,n),valueKinds:v(`valueKinds`,r),restRatio:v(`restRatio`,i),leapRatio:v(`leapRatio`,e.leapRatio),maxLeap:v(`maxLeap`,e.maxLeap),melodyRange:v(`melodyRange`,e.melodyRange),notesPerBar:v(`notesPerBar`,m.notesPerBar),shortNoteRatio:v(`shortNoteRatio`,m.shortNoteRatio),barDensityCv:v(`barDensityCv`,m.barDensityCv),densityCliff:v(`densityCliff`,m.densityCliff),stepRatio:v(`stepRatio`,e.stepRatio),chromaticRatio:v(`chromaticRatio`,e.chromaticRatio),sim1:v(`sim1`,u.sim1),sim2:v(`sim2`,u.sim2),sim4:v(`sim4`,u.sim4),sim8:v(`sim8`,u.sim8),phraseBreath:v(`phraseBreath`,u.phraseBreath),turnRatio:v(`turnRatio`,u.turnRatio),climaxPosition:v(`climaxPosition`,u.climaxPosition),climaxPeaks:_(y,u.climaxPeaks),complementarity:_(kd.complementarity,u.complementarity),subDensity:_(kd.subDensity,e.submelody.length/e.bars),subDensityCliff:v(`densityCliff`,Au(s(op(e.submelody)),c).densityCliff),tensionRise:p.rise,tensionResolve:e.tonal.floating?1:p.resolve,novelty:g},x=new Set(Object.entries(Ed).filter(([e])=>Od.has(e)).map(([e,t])=>({key:e,deficit:t*(1-(b[e]??0))})).sort((e,t)=>t.deficit-e.deficit).slice(0,Dd).filter(e=>e.deficit>0).map(e=>e.key)),S=0,C=0;for(let[e,t]of Object.entries(Ed))x.has(e)||(S+=(b[e]??0)*t,C+=t);let w=C===0?0:S/C,T=e.melody.length>0&&e.melodyRange>=Td.minMelodyRange&&e.submelodyRange>=Td.minSubmelodyRange&&e.maxLeap<=Td.maxLeapSemitones&&i<=Td.maxRestRatio;return{stats:{valueKinds:r,entropy:n,restRatio:i,maxLeapSemitones:e.maxLeap,leapRatio:e.leapRatio,stepRatio:e.stepRatio,chromaticRatio:e.chromaticRatio,density:m,melodyRange:e.melodyRange,submelodyRange:e.submelodyRange,structure:u,tension:p,score:w,scoreBreakdown:b,fingerprint:h},ok:T}},cp=e=>{let t=e.random??Math.random,n=e.recent??[],r=Math.max(1,e.drawCount??Ad),i=gu(e.baseKey,t),a=od(e.scale,i.mode===`minor`,t),o=[],s=[],c=0;for(let l=1;l<=r;l++){let r=ap(e,i,a,t),{stats:l,ok:u}=sp(r,n);u?o.push({d:r,stats:l}):(c++,s.push({d:r,stats:l}))}let l=o.length>0?o:s,u=Math.max(...l.map(e=>e.stats.score)),d=l.map(e=>Math.exp((e.stats.score-u)/jd)),f=d.reduce((e,t)=>e+t,0),p=t()*f,m=l[l.length-1];for(let e=0;e<l.length;e++)if(p-=d[e],p<=0){m=l[e];break}let h=m.d,g={drum:``,instrument:``,arrange:up,chordProgression:h.chordProgression,chordPattern:h.chordPattern,rootShift:h.rootShift,keyName:h.keyName,keyLabel:h.keyLabel,scaleId:a.id,scaleLabel:a.label,form:h.form,moodLabel:h.moodLabel,bpm:h.bpm,sections:h.sections,bars:h.bars,vocal:h.vocal,tonal:h.tonal,melody:h.melody,submelody:h.submelody,bass:h.bass,harmony:h.harmony,harmony2:h.harmony2,octave:h.octave,pad:h.pad,solo:h.solo,stats:{...m.stats,attempts:r,rejected:c}};return g.stats.attempts=r,g.stats.rejected=c,g.drum=lp(g,t),g.instrument=hp(g,t),g.arrange=mp(g,t),g},lp=(e,t)=>{let n=Md/8,r=e.melody.filter(e=>e.durationSteps<=n).length/Math.max(1,e.melody.length);return $(e.melody.filter(e=>e.durationSteps===Math.round(Md*3/16)).length/Math.max(1,e.melody.length)>=.08?[`shuffle`,`8beat`,`16beat`]:e.bpm>=150?[`4beat`,`dance`,`16beat`,`disco`]:r>=.85?[`16beat`,`dance`,`disco`]:e.bpm<=115?[`bossa`,`8beat`,`shuffle`,`4beat`]:[`8beat`,`4beat`,`16beat`,`dance`],t)},up={backing:[],sparkle:null,padSections:[],lead:null,bassLayer:null},dp=[`prechorus`,`chorus`,`bridge`],fp=[`intro`,`verse`,`interlude`,`drop_chorus`,`outro`],pp=[`chorus`,`drop_chorus`],mp=(e,t)=>{let n=new Set(e.sections.map(e=>e.kind)),r=e=>{let t=e.filter(e=>n.has(e));return t.length===0?null:t},i={pattern:e.chordPattern,sections:null,octave:0},a=nf(e.bpm).filter(e=>e!==i.pattern),o=[i],s=$([dp,pp,dp,fp],t),c=$(a,t);if(o.push({pattern:c,sections:r(s),octave:0}),t()<.55){let e=a.filter(e=>e!==c);o.push({pattern:$(e.length>0?e:a,t),sections:r(s===fp?dp:fp),octave:0})}let l=nf(e.bpm).filter(e=>e!==`block`&&!o.some(t=>t.pattern===e));return{backing:o,sparkle:l.length>0&&t()<.7?{pattern:$(l,t),sections:r($([dp,pp],t))??pp,octave:1}:null,padSections:r($([[`prechorus`,`chorus`,`bridge`,`drop_chorus`],[`chorus`,`drop_chorus`],[`prechorus`,`chorus`,`bridge`,`drop_chorus`],[`bridge`,`chorus`]],t))??[],lead:t()<.75?{sections:r($([pp,dp],t))??pp,octave:t()<.5?0:1}:null,bassLayer:t()<.25?{sections:r(pp)??pp,octave:1}:null}},hp=(e,t)=>{if(t()<.06)return $([`japanese_wa`,`arabic_exotic`],t);let n;return n=e.drum===`dance`||e.drum===`disco`?e.bpm>=150?[`cyber_punk`,`synth_pop`,`retro_game`]:[`synth_pop`,`retro_game`,`rock`,`piano`]:e.drum===`bossa`?[`jazz_night`,`acoustic`,`piano`]:e.bpm<=115?[`ambient_cloud`,`acoustic`,`orchestra`,`piano`,`fantasy_rpg`]:e.bpm>=145?[`rock`,`synth_pop`,`cyber_punk`,`retro_game`,`piano`]:e.stats.leapRatio>=.45?[`fantasy_rpg`,`orchestra`,`acoustic`,`piano`]:[`piano`,`acoustic`,`synth_pop`,`rock`,`jazz_night`,`fantasy_rpg`],$(n,t)},gp=`あさ.ひかり.そら.かぜ.ゆめ.こえ.みち.とおく.きみ.ぼく.ここ.いま.また.ずっと.そっと.きっと.あした.よる.ほし.うみ.はな.なみだ.わらう.あるく.さがす.とどく.うたう.めぐる.かさなる.つづく.ひとり.ふたり.しずか.まぶしい.せかい.きせつ`.split(`.`),_p=(e,t,n,r)=>{let i=[...e].sort((e,t)=>e.startStep-t.startStep),a=[...t].filter(e=>e!==`、`),o=new Map;for(let e=0;e<i.length&&e<a.length;e++)o.set(i[e].startStep,a[e]);let{stepsPerBar:s}=r,c=[...n].sort((e,t)=>e.startStep-t.startStep),l=[];for(let e=0;e<c.length;e++){l.push(o.get(c[e].startStep)??`ー`);let t=c[e+1];t&&Math.floor(c[e].startStep/(s*4))!==Math.floor(t.startStep/(s*4))&&l.push(`、`)}return l.join(``)},vp=(e,t)=>{let n=t.random??Math.random,{stepsPerBar:r}=t,i=[...e].sort((e,t)=>e.startStep-t.startStep);if(i.length===0)return``;let a=r/4,o=[],s=()=>(o.length===0&&(o=[...$(gp,n)]),o.shift()),c=[];for(let e=0;e<i.length;e++){let t=i[e],l=i[e-1],u=e>0&&l!==void 0&&t.pitchUnits===l.pitchUnits&&t.durationSteps<a&&o.length===0&&n()<.5;c.push(u?`ー`:s());let d=i[e+1];d&&Math.floor(t.startStep/(r*4))!==Math.floor(d.startStep/(r*4))&&(c.push(`、`),o=[])}return c.join(``)},yp={piano:{displayName:`グランドピアノ`,description:`最も破綻しにくい構成。楽曲制作のスケッチにも最適。`,melody:`Acoustic Grand Piano`,submelody:`Vibraphone`,bass:`Electric Bass (finger)`,chord:`Pad 2 (warm)`,solo:`Electric Guitar (clean)`,chorusLead:`Celesta`,chordAlt:`Electric Piano 1`,sparkle:`Music Box`,bassAlt:`Acoustic Bass`,harmonyAlt:`Choir Aahs`},acoustic:{displayName:`アコースティック`,description:`生楽器の温かみを重視。フォークやポップスに。`,melody:`Acoustic Guitar (steel)`,submelody:`Harmonica`,bass:`Acoustic Bass`,chord:`Acoustic Guitar (nylon)`,solo:`Overdriven Guitar`,chorusLead:`String Ensemble 1`,chordAlt:`Acoustic Grand Piano`,sparkle:`Celesta`,bassAlt:`Electric Bass (finger)`,harmonyAlt:`Choir Aahs`},jazz_night:{displayName:`ジャズ・ナイト`,description:`Rhodes風のEPとウッドベースによる、大人びたアンサンブル。`,melody:`Electric Piano 1`,submelody:`Flute`,bass:`Acoustic Bass`,chord:`Electric Guitar (jazz)`,solo:`Tenor Sax`,chorusLead:`Muted Trumpet`,chordAlt:`Vibraphone`,sparkle:`Celesta`,bassAlt:`Electric Bass (finger)`,harmonyAlt:`Choir Aahs`},synth_pop:{displayName:`シンセポップ`,description:`80s〜現代まで。抜けるリードと太いベースの王道。`,melody:`Lead 2 (sawtooth)`,submelody:`Lead 4 (chiff)`,bass:`Synth Bass 2`,chord:`Pad 3 (polysynth)`,solo:`Distortion Guitar`,chorusLead:`Synth Brass 1`,chordAlt:`Electric Piano 2`,sparkle:`FX 3 (crystal)`,bassAlt:`Synth Bass 1`,harmonyAlt:`Synth Choir`},cyber_punk:{displayName:`サイバーパンク`,description:`デジタルな冷たさと歪みが混ざり合う、未来的な響き。`,melody:`Lead 8 (bass + lead)`,submelody:`Lead 5 (charang)`,bass:`Synth Bass 2`,chord:`Pad 8 (sweep)`,solo:`Distortion Guitar`,chorusLead:`Lead 7 (fifths)`,chordAlt:`Pad 4 (choir)`,sparkle:`FX 3 (crystal)`,bassAlt:`Synth Bass 1`,harmonyAlt:`Synth Choir`},rock:{displayName:`ハードロック`,description:`歪みギターと重厚なベースで、パワーを前面に。`,melody:`Distortion Guitar`,submelody:`Rock Organ`,bass:`Electric Bass (pick)`,chord:`Overdriven Guitar`,solo:`Distortion Guitar`,chorusLead:`Brass Section`,chordAlt:`Electric Guitar (clean)`,sparkle:`Electric Guitar (muted)`,bassAlt:`Electric Bass (finger)`,harmonyAlt:`Choir Aahs`},orchestra:{displayName:`オーケストラ`,description:`壮大な物語を予感させる、管弦楽器の重厚な響き。`,melody:`French Horn`,submelody:`Pizzicato Strings`,bass:`Cello`,chord:`Tremolo Strings`,solo:`Violin`,chorusLead:`Trumpet`,chordAlt:`String Ensemble 1`,sparkle:`Orchestral Harp`,bassAlt:`Contrabass`,harmonyAlt:`Choir Aahs`},japanese_wa:{displayName:`和風・雅`,description:`琴と三味線の繊細な調べに、尺八の情緒を添えて。`,melody:`Koto`,submelody:`Shamisen`,bass:`Taiko Drum`,chord:`Shakuhachi`,solo:`Shakuhachi`,chorusLead:`Celesta`,chordAlt:`Kalimba`,sparkle:`Music Box`,bassAlt:`Acoustic Bass`,harmonyAlt:`Choir Aahs`},arabic_exotic:{displayName:`エキゾチック`,description:`シタールやバグパイプによる、異国情緒溢れるサウンド。`,melody:`Sitar`,submelody:`Bagpipe`,bass:`Fretless Bass`,chord:`Kalimba`,solo:`Shanai`,chorusLead:`Steel Drums`,chordAlt:`Orchestral Harp`,sparkle:`Tinkle Bell`,bassAlt:`Acoustic Bass`,harmonyAlt:`Choir Aahs`},fantasy_rpg:{displayName:`ファンタジーRPG`,description:`オカリナとハープが紡ぐ、冒険と魔法の世界観。`,melody:`Ocarina`,submelody:`Celesta`,bass:`Timpani`,chord:`Orchestral Harp`,solo:`Pan Flute`,chorusLead:`Choir Aahs`,chordAlt:`String Ensemble 2`,sparkle:`Tinkle Bell`,bassAlt:`Contrabass`,harmonyAlt:`Choir Aahs`},ambient_cloud:{displayName:`アンビエント`,description:`輪郭をぼかした音色で、深い没入感と余韻を演出。`,melody:`Lead 6 (voice)`,submelody:`Music Box`,bass:`Synth Bass 1`,chord:`Pad 7 (halo)`,solo:`Lead 3 (calliope)`,chorusLead:`Synth Choir`,chordAlt:`Pad 5 (bowed)`,sparkle:`FX 3 (crystal)`,bassAlt:`Synth Bass 2`,harmonyAlt:`Synth Choir`},retro_game:{displayName:`8-bit レトロ`,description:`矩形波を想起させる、初期ゲーム機のような懐かしい響き。`,melody:`Lead 1 (square)`,submelody:`Lead 2 (sawtooth)`,bass:`Synth Bass 1`,chord:`Clavinet`,solo:`Lead 8 (bass + lead)`,chorusLead:`Lead 4 (chiff)`,chordAlt:`Lead 5 (charang)`,sparkle:`Xylophone`,bassAlt:`Synth Bass 2`,harmonyAlt:`Lead 6 (voice)`}},bp={"Acoustic Grand Piano":[21,108],"Electric Piano 1":[28,103],Clavinet:[36,96],Celesta:[60,108],Glockenspiel:[79,108],"Music Box":[72,108],Vibraphone:[53,89],Kalimba:[60,84],"Orchestral Harp":[23,104],"Acoustic Guitar (steel)":[40,83],"Acoustic Guitar (nylon)":[40,83],"Electric Guitar (clean)":[40,86],"Electric Guitar (jazz)":[40,86],"Overdriven Guitar":[40,88],"Distortion Guitar":[40,88],Violin:[55,103],Cello:[36,76],"String Ensemble 1":[28,100],"Tremolo Strings":[28,100],"Pizzicato Strings":[28,96],Sitar:[48,79],Shamisen:[48,84],Koto:[41,77],"Acoustic Bass":[28,60],"Electric Bass (finger)":[28,67],"Electric Bass (pick)":[28,67],"Fretless Bass":[28,67],"Synth Bass 1":[24,72],"Synth Bass 2":[24,72],Flute:[60,96],"Pan Flute":[60,91],Shakuhachi:[62,86],Ocarina:[60,84],Harmonica:[60,96],Bagpipe:[62,86],Shanai:[60,86],"Tenor Sax":[44,75],Trumpet:[55,82],"Muted Trumpet":[55,82],"French Horn":[41,77],"Brass Section":[41,84],"Choir Aahs":[43,84],"Synth Choir":[43,84],"Steel Drums":[55,86],"Taiko Drum":[30,60],Timpani:[36,57],"Rock Organ":[36,96],"Synth Brass 1":[36,96],"Lead 1 (square)":[36,96],"Lead 2 (sawtooth)":[36,96],"Lead 3 (calliope)":[48,96],"Lead 4 (chiff)":[48,96],"Lead 5 (charang)":[40,96],"Lead 6 (voice)":[43,91],"Lead 7 (fifths)":[36,84],"Lead 8 (bass + lead)":[28,91],"Pad 2 (warm)":[24,96],"Pad 3 (polysynth)":[24,96],"Pad 7 (halo)":[24,96],"Pad 8 (sweep)":[24,96]},xp={Glockenspiel:72,"Tinkle Bell":72,"Music Box":79,Celesta:84,Kalimba:79,"Steel Drums":84,"FX 3 (crystal)":79},Sp=3,Cp=(e,t,n)=>{let r=bp[t];if(!r||!e)return n;let i=Math.min(r[1],xp[t]??r[1]),a=n;for(;a>n-2&&!(e[1]+a*12<=i+Sp);)a--;return a},wp=(e,t)=>{let{edo:n,stepsPerBar:r,preset:i}=t,a=e=>{if(e.length===0)return null;let t=1/0,n=-1/0;for(let r of e){let e=r.pitchUnits/31;e<t&&(t=e),e>n&&(n=e)}return[Math.round(t),Math.round(n)]},o=(e,t,n)=>Cp(a(e),i[t],n),s=t=>e.sections.find(e=>t>=e.startBar&&t<e.startBar+e.bars)?.kind??null,c=(e,t)=>{if(!t)return e;let n=new Set(t);return e.filter(e=>{let t=s(Math.floor(e.startStep/r));return t!==null&&n.has(t)})},l=(t,i=0)=>Pn({edo:n,chordStr:e.chordProgression,patternType:t,rootShift:e.rootShift,bpm:e.bpm,stepsPerBar:r}).map(e=>({startStep:e.startStep,pitchUnits:e.pitchUnits,durationSteps:e.durationSteps,velocity:Math.max(30,e.velocity+i)})),u=e.arrange,d=[...new Set(e.sections.map(e=>e.kind))],f=[`chorus`,`drop_chorus`],p=d.filter(e=>f.includes(e)),m=d.filter(e=>!f.includes(e)),h=p.length>0&&m.length>0,g=u.lead?c(e.melody,u.lead.sections):[],_=o(g,`chorusLead`,u.lead?.octave??0),v={index:1,notes:g,octave:_,volume:_===0?54:62,slot:`chorusLead`},y=u.bassLayer?c(e.bass,u.bassLayer.sections):[],b=o(y,`bass`,u.bassLayer?.octave??0),x=u.bassLayer!==null&&b!==0,S=x?{index:5,notes:y,octave:b,volume:58,slot:`bass`}:{index:5,notes:h?c(e.bass,p):[],octave:0,volume:92,slot:`bassAlt`},C=c(e.pad,u.padSections),w=[{index:0,notes:e.melody,octave:0,volume:104,slot:`melody`},v,{index:2,notes:e.harmony,octave:0,volume:82},{index:3,notes:e.solo.length===0&&h?c(e.submelody,m):e.submelody,octave:0,volume:86,slot:`submelody`},{index:4,notes:!x&&h?c(e.bass,m):e.bass,octave:0,volume:92,slot:`bass`},S,{index:6,notes:C,octave:o(C,`chord`,0),volume:64,slot:`chord`}],T=[62,54,50];for(let e=0;e<3;e++){let t=u.backing[e];w.push({index:7+e,notes:t?c(l(t.pattern),t.sections):[],octave:t?.octave??0,volume:T[e],slot:e%2==0?`chordAlt`:`chord`})}let E=u.sparkle?c(l(u.sparkle.pattern,-14),u.sparkle.sections):[];return w.push({index:10,notes:E,octave:o(E,`sparkle`,u.sparkle?.octave??0),volume:56,slot:`sparkle`},{index:11,notes:[],octave:0,volume:104,slot:`melody`},e.harmony2.length>0?{index:12,notes:e.harmony2,octave:0,volume:74}:(()=>{let t=u.padSections?d.filter(e=>!u.padSections?.includes(e)):[],n=t.length>0?c(e.pad,t):[];return{index:12,notes:n,octave:o(n,`harmonyAlt`,0),volume:60,slot:`harmonyAlt`}})(),e.octave.length>0?{index:13,notes:e.octave,octave:-1,volume:56,slot:`melody`}:(()=>{let t=new Set(u.lead?.sections??[]),n=e.sections.filter(e=>e.spec.melody&&!t.has(e.kind)).map(e=>e.kind),r=n.length>0?c(e.melody,n):[],a=[`solo`,`chorusLead`,`submelody`,`chordAlt`].find(e=>i[e]!==i.melody&&i[e]!==i.chord)??`submelody`;return{index:13,notes:r,octave:o(r,a,0),volume:58,slot:a}})(),e.solo.length>0?{index:14,notes:e.solo,octave:o(e.solo,`solo`,0),volume:100,slot:`solo`}:(()=>{let t=h?c(e.submelody,p):[];return{index:14,notes:t,octave:o(t,`solo`,0),volume:86,slot:`solo`}})()),w},Tp=[{value:`4`,label:`4分`,beats:1},{value:`8`,label:`8分`,beats:.5},{value:`8d`,label:`付点8分`,beats:.75},{value:`16`,label:`16分`,beats:.25}],Ep=(e,t,n)=>Math.max(t,Math.min(n,e)),Dp=(e,t)=>{let n=Tp.find(t=>t.value===e)?.beats??.5;return 60/(t>0?t:120)*n},Op=.45,kp=e=>Ep(e,0,100)/100*Op,Ap=.3,jp=2,Mp=(e,t,n={})=>{let r=e.createGain(),i=e.createDelay(jp),a=e.createGain();a.gain.value=Ap;let o=e.createGain();o.gain.value=kp(n.amount??0),r.connect(i),i.connect(a),a.connect(i),i.connect(o),o.connect(t);let s=n.bpm??120,c=n.division??`8`,l=()=>{i.delayTime.setTargetAtTime(Dp(c,s),e.currentTime,.05)};return l(),{input:r,setAmount:t=>{o.gain.setTargetAtTime(kp(t),e.currentTime,.02)},setDivision:e=>{c=e,l()},setBpm:e=>{s=e,l()},dispose:()=>{r.disconnect(),i.disconnect(),a.disconnect(),o.disconnect()}}},Np=`dtm-panel-open:`,Pp=e=>{try{if(typeof localStorage>`u`||!localStorage)return null;let t=localStorage.getItem(Np+e);if(t===`1`)return!0;if(t===`0`)return!1}catch{}return null},Fp=(e,t)=>{try{if(typeof localStorage>`u`||!localStorage)return;localStorage.setItem(Np+e,t?`1`:`0`)}catch{}},Ip=e=>{let t=e.querySelectorAll(`details[data-dtm-acc]`);for(let e of t){let t=e.dataset.dtmAcc;if(!t)continue;let n=Pp(t);n!==null&&(e.open=n),e.addEventListener(`toggle`,()=>{Fp(t,e.open)})}},Lp=(e,t)=>e.querySelector(t),Rp=(e,t)=>{let{drumPatterns:n,defaultDrumPattern:r,defaultBpm:i,showMidi:a,showMidiSearch:o,showCompose:s,showAudio:c,showHelp:l}=t,u=[`<option value="none">なし</option>`].concat(n.map(e=>`<option value="${e.value}" ${e.value===r?`selected`:``}>${e.label}</option>`)).join(``);e.innerHTML=`
<div class="dtm-daw" data-dtm="root">
  <!-- \u7DE8\u96C6\u30D8\u30C3\u30C9\u3002\u30C8\u30E9\u30F3\u30B9\u30DD\u30FC\u30C8\u30FB\u30C4\u30FC\u30EB\u30FB\u30D4\u30A2\u30CE\u30ED\u30FC\u30EB\u3092\u3072\u3068\u307E\u3068\u3081\u306B\u3057\u3066
       \u753B\u9762\u4E0A\u90E8\u3078\u8CBC\u308A\u4ED8\u3051\u308B\uFF08.dtm-daw-head \u304C position:sticky\uFF09\u3002\u30D1\u30CD\u30EB\u3092
       \u3044\u304F\u3064\u958B\u3044\u3066\u3082\u30ED\u30FC\u30EB\u304C\u8996\u754C\u304B\u3089\u6D88\u3048\u306A\u3044\u3088\u3046\u306B\u3059\u308B\u305F\u3081\u306E\u7BB1\u3002 -->
  <div class="dtm-daw-head">
  <div class="dtm-topbar" data-dtm="transport">
    <div class="dtm-topbar-row1">
      <button class="dtm-iconbtn" data-dtm="prev-bar" title="1\u5C0F\u7BC0\u524D">${Y(`chevronLeft`)}</button>
      <button class="dtm-play" data-dtm="play" disabled>${Y(`play`)}</button>
      <button class="dtm-iconbtn" data-dtm="next-bar" title="1\u5C0F\u7BC0\u5F8C">${Y(`chevronRight`)}</button>
      <label class="dtm-toggle"><input type="checkbox" data-dtm="solo"><span>\u30BD\u30ED</span></label>
      <span class="dtm-topbar-loading dtm-blink" data-dtm="topbar-loading">... LOADING ...</span>
      <button class="dtm-clip-badge dtm-hidden" data-dtm="clip-badge" title="\u97F3\u5272\u308C\u691C\u77E5\uFF08\u30AF\u30EA\u30C3\u30AF\u3067\u6D88\u3059\uFF09">CLIP</button>
      <span class="dtm-grow"></span>
      <button class="dtm-iconbtn${l?``:` dtm-hidden`}" data-dtm="help" title="\u4F7F\u3044\u65B9\u30FB\u30AC\u30A4\u30C9\u30C4\u30A2\u30FC" aria-label="\u4F7F\u3044\u65B9\u30FB\u30AC\u30A4\u30C9\u30C4\u30A2\u30FC">${Y(`help`)}</button>
      <span class="dtm-label">BPM</span>
      <input type="number" class="dtm-input dtm-input--num" data-dtm="bpm" value="${i}" min="20" max="300">
    </div>
    <div class="dtm-tracks" data-dtm="track-tabs"></div>
  </div>

  <div class="dtm-tooldock">
    <div class="dtm-seg">
      <button class="dtm-segbtn dtm-segbtn--active" data-dtm="tool-pen" title="\u30DA\u30F3">${Y(`pen`)}</button>
      <button class="dtm-segbtn" data-dtm="tool-select" title="\u9078\u629E">${Y(`select`)}</button>
      <button class="dtm-segbtn" data-dtm="tool-eraser" title="\u6D88\u3057\u30B4\u30E0">${Y(`eraser`)}</button>
    </div>
    <button class="dtm-iconbtn" data-dtm="undo" title="\u5143\u306B\u623B\u3059" disabled>${Y(`undo`)}</button>
    <button class="dtm-iconbtn" data-dtm="redo" title="\u3084\u308A\u76F4\u3057" disabled>${Y(`redo`)}</button>
    <select class="dtm-select dtm-grow" data-dtm="note-length" title="\u97F3\u7B26\u306E\u9577\u3055">
      <option value="48">4\u5206</option>
      <option value="32">3\u90234</option>
      <option value="24">8\u5206</option>
      <option value="16">3\u90238</option>
      <option value="12" selected>16\u5206</option>
      <option value="8">3\u902316</option>
      <option value="6">32\u5206</option>
      <option value="4">3\u902332</option>
    </select>
  </div>

  <div class="dtm-roll-wrap">
    <div class="dtm-roll" data-dtm="roll">
      <div data-dtm="wrapper" style="position:absolute;inset:0;"></div>
      <div class="dtm-overlay" data-dtm="overlay" hidden><div class="dtm-spinner"></div></div>
    </div>
    <div class="dtm-vscroll" data-dtm="vscroll"><div class="dtm-vscroll-thumb" data-dtm="vscroll-thumb"></div></div>
  </div>
  <div class="dtm-hscroll" data-dtm="hscroll"><div class="dtm-hscroll-thumb" data-dtm="hscroll-thumb"></div></div>
  </div>

  <!-- \u8A2D\u5B9A\u30D1\u30CD\u30EB\u7FA4\u3002\u5E83\u3044\u753B\u9762\u3067\u306F\u30D8\u30C3\u30C9\u306E\u53F3\u96A3\u306B\u7ACB\u3064\u72EC\u7ACB\u3057\u305F\u5217\u306B\u306A\u308B\u3002 -->
  <div class="dtm-daw-panels">

  <details class="dtm-panel" data-dtm-acc="track" open>
    <summary>\u500B\u5225\u30C8\u30E9\u30C3\u30AF\u8A2D\u5B9A</summary>
    <div class="dtm-panel-body">
      <div class="dtm-track-body" data-dtm="track-body"></div>
    </div>
  </details>

  <details class="dtm-panel" data-dtm-acc="view">
    <summary>\u8868\u793A</summary>
    <div class="dtm-panel-body">
      <div class="dtm-row">
        <span class="dtm-label">\u6A2A\u30BA\u30FC\u30E0</span>
        <button class="dtm-iconbtn" data-dtm="zoomx-out" title="\u7E2E\u5C0F">\u2212</button>
        <span class="dtm-label" data-dtm="zoomx-label">100%</span>
        <button class="dtm-iconbtn" data-dtm="zoomx-in" title="\u62E1\u5927">\uFF0B</button>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u7E26\u30BA\u30FC\u30E0</span>
        <button class="dtm-iconbtn" data-dtm="zoomy-out" title="\u7E2E\u5C0F">\u2212</button>
        <span class="dtm-label" data-dtm="zoomy-label">100%</span>
        <button class="dtm-iconbtn" data-dtm="zoomy-in" title="\u62E1\u5927">\uFF0B</button>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u80CC\u666F\u753B\u50CF</span>
        <input type="file" accept="image/*" data-dtm="bg-file-input" class="dtm-hidden">
        <button class="dtm-btn dtm-btn--primary" data-dtm="bg-upload">\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9</button>
        <button class="dtm-btn dtm-btn--danger dtm-hidden" data-dtm="bg-remove">\u524A\u9664</button>
      </div>
      <div class="dtm-row">
        <label class="dtm-checkbox-label" title="YouTube\u306E\u97F3\u6E90\u3092\u8AAD\u307F\u8FBC\u3093\u3060\u3068\u304D\u3001\u305D\u306E\u52D5\u753B\u306E\u30B5\u30E0\u30CD\u30A4\u30EB\u3092\u80CC\u666F\u306B\u4F7F\u3044\u307E\u3059\uFF08\u81EA\u5206\u3067\u8A2D\u5B9A\u3057\u305F\u80CC\u666F\u753B\u50CF\u304C\u3042\u308C\u3070\u305D\u3061\u3089\u304C\u512A\u5148\uFF09">
          <input type="checkbox" class="dtm-checkbox" data-dtm="bg-youtube-thumb"> YouTube\u306E\u30B5\u30E0\u30CD\u3092\u80CC\u666F\u306B\u3059\u308B
        </label>
      </div>
      <div class="dtm-row dtm-hidden" data-dtm="bg-opacity-row">
        <span class="dtm-label">\u80CC\u666F\u4E0D\u900F\u660E\u5EA6</span>
        <input type="range" min="0" max="100" value="40" data-dtm="bg-opacity" class="dtm-slider">
      </div>
    </div>
  </details>

  <details class="dtm-panel" data-dtm-acc="global" open>
    <summary>\u5168\u4F53\u30C8\u30E9\u30C3\u30AF\u8A2D\u5B9A</summary>
    <div class="dtm-panel-body">
      <div data-dtm="preset-select-slot"></div>
      <div class="dtm-row">
        <span class="dtm-label">\u97F3\u5F8B</span>
        <select class="dtm-select dtm-grow" data-dtm="edo-select">
          <option value="12">12\u5E73\u5747\u5F8B\uFF08\u901A\u5E38\uFF09</option>
          <option value="31">31\u5E73\u5747\u5F8B\uFF08\u5FAE\u5206\u97F3\uFF09</option>
        </select>
        <button class="dtm-infobtn" data-dtm="edo-info" title="\u97F3\u5F8B\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u30EB\u30FC\u30D7\u518D\u751F</span>
        <label class="dtm-toggle">
          <input type="checkbox" data-dtm="loop-toggle">
          <span data-dtm="loop-toggle-label">OFF</span>
        </label>
        <span class="dtm-grow"></span>
        <button class="dtm-infobtn" data-dtm="loop-info" title="\u30EB\u30FC\u30D7\u518D\u751F\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u5168\u4F53\u97F3\u91CF</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="master-volume" value="50" min="0" max="100">
        <span class="dtm-label" data-dtm="master-volume-label">50%</span>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u30B0\u30EB\u30FC\u30B3\u30F3\u30D7</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="master-comp" value="0" min="0" max="100" aria-label="\u30DE\u30B9\u30BF\u30D0\u30B9\u306E\u30B0\u30EB\u30FC\u30B3\u30F3\u30D7\u30EC\u30C3\u30B5\u30FC\uFF08\u5168\u30C8\u30E9\u30C3\u30AF\u3092\u307E\u3068\u3081\u3066\u8EFD\u304F\u5727\u7E2E\u3057\u3001\u4E00\u4F53\u611F\u3092\u51FA\u3059\uFF09">
        <span class="dtm-label" data-dtm="master-comp-label">0%</span>
        <button class="dtm-infobtn" data-dtm="master-comp-info" title="\u30B0\u30EB\u30FC\u30B3\u30F3\u30D7\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
      </div>
      <div class="dtm-row">
        <button class="dtm-btn dtm-btn--ghost dtm-btn--xs" data-dtm="auto-master" title="\u97F3\u5727\u30FB\u30B9\u30C6\u30EC\u30AA\u5E45\u30FB\u30EA\u30D0\u30FC\u30D6\u306B\u52A0\u3048\u3001\u5404\u30C8\u30E9\u30C3\u30AF\u306E\u697D\u5668\u30FB\u97F3\u91CF\u3082\u81EA\u52D5\u63A8\u5B9A\u3057\u3066\u4E00\u62EC\u8A2D\u5B9A\u3057\u307E\u3059">\u304A\u307E\u304B\u305B\u30DE\u30B9\u30BF\u30EA\u30F3\u30B0</button>
        <button class="dtm-infobtn" data-dtm="auto-master-info" title="\u304A\u307E\u304B\u305B\u30DE\u30B9\u30BF\u30EA\u30F3\u30B0\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
        <span class="dtm-grow"></span>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u30EA\u30D0\u30FC\u30D6</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="reverb-amount" value="0" min="0" max="100" aria-label="\u30DE\u30B9\u30BF\u30EA\u30D0\u30FC\u30D6\uFF08\u5168\u30C8\u30E9\u30C3\u30AF\u3078\u4E00\u5F8B\u306B\u639B\u304B\u308B\u6B8B\u97FF\uFF09">
        <span class="dtm-label" data-dtm="reverb-amount-label">0%</span>
        <button class="dtm-infobtn" data-dtm="reverb-amount-info" title="\u30DE\u30B9\u30BF\u30EA\u30D0\u30FC\u30D6\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">Decay</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="reverb-decay" value="22" min="3" max="40" step="1" aria-label="\u30EA\u30D0\u30FC\u30D6\u306EDecay\uFF08\u6B8B\u97FF\u306E\u9577\u3055\u3001\u79D2\uFF09">
        <span class="dtm-label" data-dtm="reverb-decay-label">2.2s</span>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">Pre Delay</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="reverb-predelay" value="0" min="0" max="150" step="5" aria-label="\u30EA\u30D0\u30FC\u30D6\u306EPre Delay\uFF08\u539F\u97F3\u304B\u3089\u6B8B\u97FF\u304C\u7ACB\u3061\u4E0A\u304C\u308B\u307E\u3067\u306E\u9045\u5EF6\u3001ms\uFF09">
        <span class="dtm-label" data-dtm="reverb-predelay-label">0ms</span>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u30C7\u30A3\u30EC\u30A4</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="delay-amount" value="0" min="0" max="100" aria-label="\u30DE\u30B9\u30BF\u30C7\u30A3\u30EC\u30A4\uFF08\u30C6\u30F3\u30DD\u540C\u671F\u3057\u305F\u30A8\u30B3\u30FC\uFF09">
        <span class="dtm-label" data-dtm="delay-amount-label">0%</span>
        <select class="dtm-select" data-dtm="delay-division" aria-label="\u30C7\u30A3\u30EC\u30A4\u306E\u97F3\u4FA1\uFF08\u30C6\u30F3\u30DD\u306B\u540C\u671F\uFF09">
          ${Tp.map(e=>`<option value="${e.value}">${e.label}</option>`).join(``)}
        </select>
        <button class="dtm-infobtn" data-dtm="delay-amount-info" title="\u30DE\u30B9\u30BF\u30C7\u30A3\u30EC\u30A4\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u30D5\u30A7\u30FC\u30C9\u30A4\u30F3</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="fade-in" value="0" min="0" max="10" step="0.5" aria-label="\u66F2\u982D\u306E\u30D5\u30A7\u30FC\u30C9\u30A4\u30F3\u9577\uFF08\u79D2\uFF09">
        <span class="dtm-label" data-dtm="fade-in-label">0.0s</span>
        <button class="dtm-infobtn" data-dtm="fade-info" title="\u30D5\u30A7\u30FC\u30C9\u30A4\u30F3/\u30A2\u30A6\u30C8\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u30D5\u30A7\u30FC\u30C9\u30A2\u30A6\u30C8</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="fade-out" value="0" min="0" max="10" step="0.5" aria-label="\u66F2\u5C3E\u306E\u30D5\u30A7\u30FC\u30C9\u30A2\u30A6\u30C8\u9577\uFF08\u79D2\uFF09">
        <span class="dtm-label" data-dtm="fade-out-label">0.0s</span>
      </div>
    </div>
  </details>

  <details class="dtm-panel" data-dtm-acc="drum">
    <summary>\u30C9\u30E9\u30E0\u8A2D\u5B9A</summary>
    <div class="dtm-panel-body">
      <div class="dtm-row">
        <span class="dtm-label">\u30EA\u30BA\u30E0</span>
        <select class="dtm-select" data-dtm="drum-select">${u}</select>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u97F3\u6E90</span>
        <select class="dtm-select" data-dtm="drum-font-select">
          ${[`Chaos_sf2_file`,`FluidR3_GM_sf2_file`,`JCLive_sf2_file`,`SBLive_sf2`].flatMap(e=>[0,11,1,2,3,4,5,6,7,8,9,10].map(t=>`<option value="${e}:${t}">${e} (${t})</option>`)).join(``)}
        </select>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u97F3\u91CF</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="drum-volume" value="80" min="0" max="100">
        <span class="dtm-label" data-dtm="drum-volume-label">80%</span>
      </div>
    </div>
  </details>

  <details class="dtm-panel ${c?``:`dtm-hidden`}" data-dtm="audio-panel" data-dtm-acc="audio">
    <summary>\u30AA\u30FC\u30C7\u30A3\u30AA\u540C\u6642\u518D\u751F</summary>
    <div class="dtm-panel-body">
      <div class="dtm-row" style="flex-wrap:nowrap">
        <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 4px; justify-content: center; flex-shrink:0;">
          <span class="dtm-label" style="line-height: 1;">\u97F3\u6E90</span>
          <button class="dtm-infobtn" data-dtm="audio-info" title="\u30AA\u30FC\u30C7\u30A3\u30AA\u540C\u6642\u518D\u751F\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
        <input type="file" class="dtm-input dtm-grow" accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac" data-dtm="audio-file" style="min-width:0">
      </div>
      <div class="dtm-row" style="flex-wrap:nowrap">
        <span class="dtm-label" style="flex-shrink:0">URL</span>
        <input type="url" class="dtm-input dtm-grow" data-dtm="audio-url" placeholder="mp3 / wav / YouTube \u306EURL" style="min-width:0">
        <button class="dtm-btn dtm-btn--success" data-dtm="audio-url-load" style="flex-shrink:0">\u8AAD\u8FBC</button>
      </div>
      <p class="dtm-audio-note dtm-hidden" data-dtm="audio-status"></p>
      <div class="dtm-row dtm-hidden" data-dtm="audio-youtube-row">
        <div class="dtm-audio-yt" data-dtm="audio-youtube"></div>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u97F3\u91CF</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="audio-volume" value="80" min="0" max="100">
        <span class="dtm-label" data-dtm="audio-volume-label">80%</span>
        <label class="dtm-checkbox-label" title="\u6253\u3061\u8FBC\u307F\u3060\u3051\u3092\u8074\u304D\u305F\u3044\u3068\u304D\u306B\u5916\u3059">
          <input type="checkbox" class="dtm-checkbox" data-dtm="audio-mute"> \u30DF\u30E5\u30FC\u30C8
        </label>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u97F3\u6E90\u306E\u7BC4\u56F2</span>
        <input type="text" class="dtm-input" data-dtm="audio-start" value="0:00.000" placeholder="0:00.000" style="width:88px" title="\u97F3\u6E90\u306E\u3069\u3053\u304B\u3089\u9CF4\u3089\u3059\u304B\uFF08\u5206:\u79D2.\u30DF\u30EA\u79D2\uFF09\u3002\u3044\u3089\u306A\u3044\u90E8\u5206\u3092\u98DB\u3070\u305B\u307E\u3059">
        <span class="dtm-label">\u301C</span>
        <input type="text" class="dtm-input" data-dtm="audio-end" placeholder="\u6700\u5F8C\u307E\u3067" style="width:88px" title="\u97F3\u6E90\u306E\u3069\u3053\u3067\u6B62\u3081\u308B\u304B\uFF08\u5206:\u79D2.\u30DF\u30EA\u79D2\uFF09\u3002\u7A7A\u6B04\u306A\u3089\u6700\u5F8C\u307E\u3067">
      </div>
      <div class="dtm-row" style="flex-wrap:wrap">
        <span class="dtm-label">\u958B\u59CB\u306E\u305A\u308C</span>
        <select class="dtm-select" data-dtm="audio-lead" title="\u97F3\u6E90\u3068\u6253\u3061\u8FBC\u307F\u306E\u3069\u3061\u3089\u3092\u5148\u306B\u59CB\u3081\u308B\u304B">
          <option value="audio">\u97F3\u6E90</option>
          <option value="song">\u6253\u3061\u8FBC\u307F</option>
        </select>
        <span class="dtm-label">\u304C\u5148\u3001</span>
        <input type="text" class="dtm-input" data-dtm="audio-offset" value="0:00.000" placeholder="0:00.000" style="width:88px" title="\u3082\u3046\u4E00\u65B9\u304C\u59CB\u307E\u308B\u307E\u3067\u306E\u6642\u9593\uFF08\u5206:\u79D2.\u30DF\u30EA\u79D2\uFF09\u30020\u306A\u3089\u540C\u6642\u306B\u59CB\u307E\u308A\u307E\u3059">
        <span class="dtm-label" data-dtm="audio-offset-tail">\u5F8C\u306B\u6253\u3061\u8FBC\u307F\u958B\u59CB</span>
      </div>
      <div class="dtm-row">
        <span class="dtm-grow"></span>
        <button class="dtm-btn dtm-btn--danger" data-dtm="audio-clear">\u5916\u3059</button>
      </div>
    </div>
  </details>

  <details class="dtm-panel ${a?``:`dtm-hidden`}" data-dtm="midi-panel" data-dtm-acc="io-in">
    <summary>MIDI / MusicXML / UST / MML \u5165\u529B</summary>
    <div class="dtm-panel-body">
      <div class="dtm-row" style="flex-wrap:nowrap">
        <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 4px; justify-content: center; flex-shrink:0;">
          <span class="dtm-label" style="line-height: 1;">MIDI</span>
          <button class="dtm-infobtn" data-dtm="midi-info" title="MIDI\u306E\u8AAD\u307F\u8FBC\u307F\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
        <input type="file" class="dtm-input dtm-grow" accept=".mid,.midi" data-dtm="midi-input" style="min-width:0">
        <button class="dtm-btn dtm-btn--success" data-dtm="midi-load" style="flex-shrink:0">\u8AAD\u8FBC</button>
      </div>
      <div class="dtm-row dtm-hidden" data-dtm="midi-track-selection"></div>
      <div class="dtm-row" style="flex-wrap:nowrap">
        <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 4px; justify-content: center; flex-shrink:0;">
          <span class="dtm-label" style="line-height: 1;">MusicXML</span>
          <button class="dtm-infobtn" data-dtm="musicxml-info" title="MusicXML\u306E\u8AAD\u307F\u8FBC\u307F\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
        <input type="file" class="dtm-input dtm-grow" accept=".musicxml,.xml" data-dtm="musicxml-input" style="min-width:0">
        <button class="dtm-btn dtm-btn--success" data-dtm="musicxml-load" style="flex-shrink:0">\u8AAD\u8FBC</button>
      </div>
      <div class="dtm-row dtm-hidden" data-dtm="musicxml-part-selection"></div>
      <p class="dtm-load-note dtm-hidden" data-dtm="musicxml-load-note"></p>
      <div class="dtm-row" style="flex-wrap:nowrap">
        <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 4px; justify-content: center; flex-shrink:0;">
          <span class="dtm-label" style="line-height: 1;">UST</span>
          <button class="dtm-infobtn" data-dtm="ust-info" title="UST\u306E\u8AAD\u307F\u8FBC\u307F\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
        <input type="file" class="dtm-input dtm-grow" accept=".ust" multiple data-dtm="ust-input" style="min-width:0">
        <button class="dtm-btn dtm-btn--success" data-dtm="ust-load" style="flex-shrink:0">\u8AAD\u8FBC</button>
      </div>
      <p class="dtm-load-note dtm-hidden" data-dtm="ust-load-note"></p>
      <div class="dtm-row" style="flex-wrap:nowrap">
        <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 4px; justify-content: center; flex-shrink:0;">
          <span class="dtm-label" style="line-height: 1;">MML</span>
          <button class="dtm-infobtn" data-dtm="mml-info" title="MML\u306E\u66F8\u304D\u65B9\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
        <textarea class="dtm-textarea dtm-grow" data-dtm="mml-input" placeholder="MML\u3092\u5165\u529B"></textarea>
        <button class="dtm-btn dtm-btn--primary" data-dtm="mml-load" style="flex-shrink:0">\u8AAD\u8FBC</button>
      </div>
      <div class="dtm-row" data-dtm="midi-search-row" style="justify-content:flex-end;${o?``:`display:none`}">
        <button class="dtm-btn dtm-btn--primary" data-dtm="midi-search-open">MML\u691C\u7D22</button>
      </div>
      <p class="dtm-load-note dtm-hidden" data-dtm="mml-load-note"></p>
      <div class="dtm-row" style="margin-top:8px;">
        <label class="dtm-checkbox-label" title="\u6709\u52B9\u306B\u3059\u308B\u3068\u3001\u73FE\u5728\u9078\u629E\u4E2D\u306E\u30C8\u30E9\u30C3\u30AF\u306E\u307F\u5909\u66F4\u3057\u307E\u3059">
          <input type="checkbox" class="dtm-checkbox" data-dtm="apply-active-only"> \u73FE\u5728\u306E\u30C8\u30E9\u30C3\u30AF\u306E\u307F\u5BFE\u8C61\u3068\u3059\u308B
        </label>
      </div>
    </div>
  </details>

  <details class="dtm-panel dtm-panel--compose ${s?``:`dtm-hidden`}" data-dtm-acc="compose">
    <summary>\u81EA\u52D5\u4F5C\u66F2</summary>
    <div class="dtm-panel-body">
      <div class="dtm-row" data-dtm="compose-row">
        <button class="dtm-btn dtm-btn--success" data-dtm="macro-compose" title="\u30B3\u30FC\u30C9\u9032\u884C\u30FB\u30E1\u30ED\u30C7\u30A3\u30FB\u30B5\u30D6\u30E1\u30ED\u30FB\u30D9\u30FC\u30B9\u30FB\u4F34\u594F\u30FB\u30C9\u30E9\u30E0\u3092\u81EA\u52D5\u3067\u4F5C\u308A\u307E\u3059">\u4F5C\u66F2</button>
        <button class="dtm-btn dtm-btn--success" data-dtm="macro-compose-vocal" title="\u4F5C\u66F2\u3057\u305F\u3046\u3048\u3067\u3001\u30E1\u30ED\u30C7\u30A3\u306B\u6B4C\u8A5E\u3092\u4ED8\u3051\u3066\u6B4C\u308F\u305B\u307E\u3059">\u6B4C\u5165\u308A\u4F5C\u66F2</button>
        <button class="dtm-infobtn" data-dtm="macro-compose-info" title="\u4F5C\u66F2\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
        <!--
          **\u30AD\u30FC\u30D7\u67A0\u306F1\u3064\u3060\u3051\u3002** \u81EA\u52D5\u4F5C\u66F2\u306F\u6C17\u306B\u5165\u308B\u307E\u3067\u5F15\u304D\u76F4\u3059\u4F7F\u3044\u65B9\u306B\u306A\u308B\u304C\u3001
          \u300C\u5F15\u304D\u76F4\u3059\u3068\u4ECA\u306E\u304C\u6D88\u3048\u308B\u300D\u3068\u601D\u3046\u3068\u5F15\u304D\u76F4\u305B\u306A\u304F\u306A\u308B\u3002\u53D6\u3063\u3066\u304A\u3051\u308B\u5834\u6240\u304C
          1\u3064\u3042\u308C\u3070\u30012\u3064\u3092\u6BD4\u3079\u3066\u9078\u3076\u3053\u3068\u306F\u6210\u7ACB\u3059\u308B\u3002\u5019\u88DC\u3092\u4E26\u3079\u308BUI\u306F\u30B9\u30DE\u30DB\u3067\u306F
          \u6210\u7ACB\u3057\u306A\u3044\uFF08\u8A66\u8074\u6642\u9593\u30FB\u753B\u9762\u30FB\u751F\u6210\u30B3\u30B9\u30C8\u306E\u3069\u308C\u3082\u8DB3\u308A\u306A\u3044\uFF09\u3002
          \u300C\u5165\u308C\u66FF\u3048\u300D\u306F\u4ECA\u306E\u66F2\u3068\u30AD\u30FC\u30D7\u3092\u4EA4\u63DB\u3059\u308B\u3002\u547C\u3073\u51FA\u3059\u3060\u3051\u3060\u3068\u4ECA\u306E\u66F2\u304C\u6D88\u3048\u3066
          2\u66F2\u3092\u884C\u304D\u6765\u3067\u304D\u306A\u3044\u305F\u3081\u3002\u67A0\u306F\u30EA\u30ED\u30FC\u30C9\u3092\u307E\u305F\u3044\u3067\u6B8B\u308B\uFF08localStorage\uFF09\u3002
        -->
        <button class="dtm-btn" data-dtm="compose-keep" title="\u4ECA\u306E\u66F2\u30921\u3064\u3060\u3051\u53D6\u3063\u3066\u304A\u304D\u307E\u3059\u3002\u4F5C\u66F2\u3092\u62BC\u3057\u76F4\u3057\u3066\u3082\u3001\u30DA\u30FC\u30B8\u3092\u958B\u304D\u76F4\u3057\u3066\u3082\u6D88\u3048\u307E\u305B\u3093">\u30AD\u30FC\u30D7</button>
        <button class="dtm-btn" data-dtm="compose-recall" title="\u30AD\u30FC\u30D7\u3057\u305F\u66F2\u3068\u4ECA\u306E\u66F2\u3092\u5165\u308C\u66FF\u3048\u3066\u3001\u30AD\u30FC\u30D7\u3057\u3066\u3044\u305F\u66F2\u3092\u9CF4\u3089\u3057\u307E\u3059\u3002\u3082\u3046\u4E00\u5EA6\u62BC\u3059\u3068\u623B\u308A\u307E\u3059" disabled>\u5165\u308C\u66FF\u3048</button>
        <span class="dtm-grow"></span>
      </div>
      <div class="dtm-row" data-dtm="compose-template-row">
        <span class="dtm-label">\u69CB\u6210</span>
        <select class="dtm-select" data-dtm="compose-template" title="J-POP\u738B\u9053\u306A\u3069\u306E\u30D7\u30EA\u30BB\u30C3\u30C8\u69CB\u6210\u3092\u9078\u3073\u307E\u3059">
          <option value="custom">\u81EA\u7531\u9078\u629E\uFF08\u4E0B\u8A18\u30C1\u30A7\u30C3\u30AF\uFF09</option>
          <option value="1chorus">1\u30B3\u30FC\u30E9\u30B9\uFF08\u77ED\u3081\u30FB\u521D\u5FC3\u8005\u5411\u3051\uFF09</option>
          <option value="jpop_standard">JPOP\u738B\u9053\uFF08\u30DE\u30EA\u30FC\u30B4\u30FC\u30EB\u30C9\u578B 2\u756A/C\u30E1\u30ED/\u30E9\u30B9\u30B5\u30D3\uFF09</option>
          <option value="jpop_drop">\u843D\u3061\u30B5\u30D3\u5165\u308A\uFF08JPOP\u738B\u9053 + \u30E9\u30B9\u30B5\u30D3\u524D\u843D\u3061\u30B5\u30D3\uFF09</option>
          <option value="vocaloid">\u30DC\u30AB\u30ED\u738B\u9053\uFF08\u75BE\u8D70\u30FB2\u756A/C\u30E1\u30ED/\u30E9\u30B9\u30B5\u30D3\uFF09</option>
          <option value="verse_chorus">Verse-Chorus\uFF08B\u30E1\u30ED\u306A\u3057\u30FB\u6D0B\u697D\u98A8\uFF09</option>
        </select>
      </div>
      <div class="dtm-row" data-dtm="compose-sections-row">
        <span class="dtm-label">\u4F5C\u308B\u90E8\u5206</span>
        <div class="dtm-checks" data-dtm="compose-sections">
          <label class="dtm-check"><input type="checkbox" value="intro" checked>\u30A4\u30F3\u30C8\u30ED</label>
          <label class="dtm-check"><input type="checkbox" value="verse" checked>A\u30E1\u30ED</label>
          <label class="dtm-check"><input type="checkbox" value="prechorus" checked>B\u30E1\u30ED</label>
          <label class="dtm-check"><input type="checkbox" value="chorus" checked>\u30B5\u30D3</label>
          <label class="dtm-check"><input type="checkbox" value="bridge">C\u30E1\u30ED</label>
          <label class="dtm-check"><input type="checkbox" value="drop_chorus">\u843D\u3061\u30B5\u30D3</label>
          <label class="dtm-check"><input type="checkbox" value="interlude">\u9593\u594F</label>
          <label class="dtm-check"><input type="checkbox" value="outro">\u30A2\u30A6\u30C8\u30ED</label>
        </div>
        <span class="dtm-grow"></span>
        <span class="dtm-hint" data-dtm="compose-sections-len"></span>
      </div>
      <div class="dtm-row" data-dtm="compose-key-row">
        <span class="dtm-label">\u30D9\u30FC\u30B9\u8ABF</span>
        <select class="dtm-select" data-dtm="compose-key" title="\u81EA\u52D5\u4F5C\u66F2\u306E\u30D9\u30FC\u30B9\u3068\u306A\u308B\u8ABF\u3084\u96F0\u56F2\u6C17\u3092\u9078\u3073\u307E\u3059">
          <option value="any" title="\u516824\u8ABF\u304B\u3089\u30E9\u30F3\u30C0\u30E0\u306B\u6C7A\u5B9A\u3057\u307E\u3059">\u5E0C\u671B\u306A\u3057</option>
          <optgroup label="\u57FA\u672C">
            <option value="major" title="12\u306E\u9577\u8ABF\u306E\u4E2D\u304B\u3089\u30E9\u30F3\u30C0\u30E0\u306B\u62BD\u9078\u3057\u307E\u3059">\u9577\u8ABF</option>
            <option value="minor" title="12\u306E\u77ED\u8ABF\u306E\u4E2D\u304B\u3089\u30E9\u30F3\u30C0\u30E0\u306B\u62BD\u9078\u3057\u307E\u3059">\u77ED\u8ABF</option>
          </optgroup>
          <optgroup label="\u96F0\u56F2\u6C17\u304B\u3089\u9078\u3076\uFF08\u62BD\u9078\uFF09">
            <option value="mood_happy" title="\u30CF\u9577\u8ABF\u30FB\u30A4\u9577\u8ABF\u30FB\u5909\u30ED\u9577\u8ABF\u304B\u3089\u62BD\u9078\uFF08\u7121\u57A2\u306B\u559C\u3070\u3057\u3044\u3001\u7267\u6B4C\u7684\u3001\u967D\u6C17\uFF09">\u559C\u3070\u3057\u3044\u30FB\u967D\u6C17\u306A\u66F2</option>
            <option value="mood_triumphant" title="\u30CB\u9577\u8ABF\u30FB\u5909\u30C8\u9577\u8ABF\u304B\u3089\u62BD\u9078\uFF08\u610F\u6C17\u63DA\u3005\u3001\u52DD\u5229\u306E\u558A\u58F0\u3001\u56F0\u96E3\u6253\u7834\u3001\u5B89\u5835\uFF09">\u52DD\u5229\u30FB\u529B\u5F37\u3044\u66F2</option>
            <option value="mood_fierce" title="\u30DB\u9577\u8ABF\u30FB\u30D8\u9577\u8ABF\u30FB\u30ED\u9577\u8ABF\u304B\u3089\u62BD\u9078\uFF08\u3051\u3093\u304B\u3063\u65E9\u3044\u3001\u6012\u308A\u72C2\u3063\u305F\u8352\u3005\u3057\u3055\u3001\u3069\u304E\u3064\u304F\u731B\u70C8\uFF09">\u6FC0\u3057\u3044\u30FB\u8352\u3005\u3057\u3044\u66F2</option>
            <option value="mood_solemn" title="\u30C8\u9577\u8ABF\u30FB\u30CB\u77ED\u8ABF\u30FB\u30A4\u77ED\u8ABF\u304B\u3089\u62BD\u9078\uFF08\u53B3\u7C9B\u3001\u5D07\u9AD8\u3001\u5E7B\u60F3\u3001\u656C\u8654\u3001\u601D\u7D22\u7684\uFF09">\u53B3\u7C9B\u30FB\u5E7B\u60F3\u7684\u306A\u66F2</option>
            <option value="mood_plaintive" title="\u30CF\u77ED\u8ABF\u30FB\u30DB\u77ED\u8ABF\u30FB\u30D8\u77ED\u8ABF\u304B\u3089\u62BD\u9078\uFF08\u7D14\u7C8B\u306B\u60B2\u3057\u3052\u3001\u604B\u308F\u305A\u3089\u3044\u3001\u843D\u3061\u7740\u304D\u306E\u306A\u3044\u3001\u7269\u60B2\u3057\u3044\u54C0\u6101\uFF09">\u7269\u60B2\u3057\u3044\u30FB\u54C0\u6101\u306E\u66F2</option>
            <option value="mood_melancholy" title="\u5909\u30CB\u9577\u8ABF\u30FB\u30ED\u77ED\u8ABF\u30FB\u5B30\u30CF\u77ED\u8ABF\u304B\u3089\u62BD\u9078\uFF08\u60B2\u3057\u307F\u3001\u6182\u9B31\u3001\u5B64\u72EC\u3001\u5FCD\u8010\u3001\u843D\u80C6\u3001\u60B2\u6D99\uFF09">\u6182\u9B31\u30FB\u5B64\u72EC\u306A\u66F2</option>
            <option value="mood_anxious" title="\u30C8\u77ED\u8ABF\u30FB\u5909\u30DB\u77ED\u8ABF\u30FB\u5B30\u30D8\u77ED\u8ABF\u30FB\u5909\u30A4\u77ED\u8ABF\u304B\u3089\u62BD\u9078\uFF08\u4E0D\u6E80\u3001\u4E0D\u5B89\u3001\u6DF1\u3044\u82E6\u60A9\u3001\u9670\u6C17\u306A\u61A4\u308A\uFF09">\u4E0D\u5B89\u30FB\u82E6\u60A9\u306A\u66F2</option>
            <option value="mood_dark" title="\u5909\u30DB\u9577\u8ABF\u30FB\u5909\u30A4\u9577\u8ABF\u30FB\u5909\u30ED\u77ED\u8ABF\u304B\u3089\u62BD\u9078\uFF08\u53B3\u3057\u3044\u611B\u3001\u6B7B\u3001\u6C38\u9060\u3001\u88C1\u304D\u3001\u6697\u95C7\u3001\u6050\u308D\u3057\u3044\u5632\u308A\uFF09">\u6697\u95C7\u30FB\u91CD\u539A\u306A\u66F2</option>
          </optgroup>
          <optgroup label="\u9577\u8ABF\uFF08\u500B\u5225\u6307\u5B9A\uFF09">
            <option value="key_C" title="\u7121\u57A2\u306B\u559C\u3070\u3057\u3044\u3001\u7D14\u7C8B\u3001\u7D20\u6734\u3001\u51FA\u767A">\u30CF\u9577\u8ABF (C)</option>
            <option value="key_Db" title="\u60B2\u3057\u307F\u3001\u6182\u9B31\u306A\u3001\u7518\u7F8E\u306A\u611F\u50B7">\u5909\u30CB\u9577\u8ABF (D\u266D)</option>
            <option value="key_D" title="\u610F\u6C17\u63DA\u3005\u3068\u3057\u305F\u3001\u52DD\u5229\u306E\u3001\u558A\u58F0">\u30CB\u9577\u8ABF (D)</option>
            <option value="key_Eb" title="\u53B3\u3057\u3044\u3001\u304D\u3064\u3044\u3001\u305D\u308C\u3067\u3044\u3066\u611B\u306B\u6E80\u3061\u305F">\u5909\u30DB\u9577\u8ABF (E\u266D)</option>
            <option value="key_E" title="\u3051\u3093\u304B\u3063\u65E9\u3044\u3001\u8352\u3005\u3057\u3044\u3001\u8F1D\u304B\u3057\u3044\u60C5\u71B1">\u30DB\u9577\u8ABF (E)</option>
            <option value="key_F" title="\u6012\u308A\u72C2\u3063\u305F\u3001\u6C17\u6027\u306E\u8352\u3044\u3001\u4E00\u6642\u7684\u306A\u60B2\u5606">\u30D8\u9577\u8ABF (F)</option>
            <option value="key_Gb" title="\u56F0\u96E3\u306E\u6253\u7834\u3001\u5B89\u5835\u306E\u305F\u3081\u606F\u3001\u51F1\u65CB">\u5909\u30C8\u9577\u8ABF (G\u266D)</option>
            <option value="key_G" title="\u53B3\u7C9B\u306A\u3001\u5D07\u9AD8\u306A\u3001\u5E7B\u60F3\u3001\u8AA0\u5B9F">\u30C8\u9577\u8ABF (G)</option>
            <option value="key_Ab" title="\u6B7B\u3001\u6C38\u9060\u3001\u88C1\u304D\u3001\u6DF1\u9060\u306A\u7791\u60F3">\u5909\u30A4\u9577\u8ABF (A\u266D)</option>
            <option value="key_A" title="\u3046\u308C\u3057\u3044\u3001\u7267\u6B4C\u7684\u306A\u3001\u611B\u306E\u544A\u767D">\u30A4\u9577\u8ABF (A)</option>
            <option value="key_Bb" title="\u559C\u3070\u3057\u3044\u3001\u98A8\u5909\u308F\u308A\u306A\u3001\u967D\u6C17\u306A\u3001\u8EFD\u5FEB">\u5909\u30ED\u9577\u8ABF (B\u266D)</option>
            <option value="key_B" title="\u3069\u304E\u3064\u3044\u3001\u5F37\u70C8\u306A\u3001\u8352\u3063\u307D\u3044\u3001\u731B\u70C8">\u30ED\u9577\u8ABF (B)</option>
          </optgroup>
          <optgroup label="\u77ED\u8ABF\uFF08\u500B\u5225\u6307\u5B9A\uFF09">
            <option value="key_Am" title="\u67D4\u3089\u304B\u306A\u3001\u7269\u60B2\u3057\u3044\u3001\u656C\u8654\u306A\u3001\u7D20\u6734\u306A\u54C0\u6101">\u30A4\u77ED\u8ABF (Am)</option>
            <option value="key_Bbm" title="\u6050\u308D\u3057\u3044\u3001\u6697\u95C7\u3001\u5632\u308B\u3088\u3046\u306A\u3001\u4E0D\u6C17\u5473">\u5909\u30ED\u77ED\u8ABF (B\u266Dm)</option>
            <option value="key_Bm" title="\u5B64\u72EC\u306A\u3001\u6182\u9B31\u306A\u3001\u5FCD\u8010\u3001\u9759\u304B\u306A\u8AE6\u5FF5">\u30ED\u77ED\u8ABF (Bm)</option>
            <option value="key_Cm" title="\u7D14\u7C8B\u306B\u60B2\u3057\u3052\u306A\u3001\u604B\u308F\u305A\u3089\u3044\u306E\u3001\u60B2\u5287\u7684">\u30CF\u77ED\u8ABF (Cm)</option>
            <option value="key_Csm" title="\u843D\u80C6\u3001\u6CE3\u304D\u53EB\u3093\u3060\u3001\u60B2\u6D99\u306E\u3001\u6DF1\u3044\u5606\u304D">\u5B30\u30CF\u77ED\u8ABF (C\u266Fm)</option>
            <option value="key_Dm" title="\u53B3\u7C9B\u306A\u3001\u656C\u8654\u306A\u3001\u601D\u7D22\u7684\u306A\u3001\u91CD\u539A\u306A\u7948\u308A">\u30CB\u77ED\u8ABF (Dm)</option>
            <option value="key_Ebm" title="\u6DF1\u3044\u82E6\u60A9\u3001\u5B9F\u5B58\u7684\u306A\u4E0D\u5B89\u3001\u6226\u6144">\u5909\u30DB\u77ED\u8ABF (E\u266Dm)</option>
            <option value="key_Em" title="\u5F31\u3005\u3057\u3044\u3001\u306A\u307E\u3081\u304B\u3057\u3044\u3001\u843D\u3061\u7740\u304D\u306E\u306A\u3044">\u30DB\u77ED\u8ABF (Em)</option>
            <option value="key_Fm" title="\u307C\u3093\u3084\u308A\u3057\u305F\u3001\u7269\u60B2\u3057\u3044\u3001\u3057\u3081\u3084\u304B\u306A\u3001\u846C\u9001">\u30D8\u77ED\u8ABF (Fm)</option>
            <option value="key_Fsm" title="\u9670\u6C17\u306A\u3001\u6FC0\u3057\u3044\u61A4\u308A\u3001\u6697\u3044\u60C5\u5FF5">\u5B30\u30D8\u77ED\u8ABF (F\u266Fm)</option>
            <option value="key_Gm" title="\u4E0D\u6E80\u3001\u4E0D\u5B89\u3001\u3084\u308B\u305B\u306A\u3055\u3001\u60B2\u75DB\u306A\u53EB\u3073">\u30C8\u77ED\u8ABF (Gm)</option>
            <option value="key_Abm" title="\u4E0D\u670D\u306A\u3001\u5606\u304D\u306E\u3001\u6CE3\u304D\u53EB\u3093\u3060">\u5909\u30A4\u77ED\u8ABF (A\u266Dm)</option>
          </optgroup>
        </select>
        <span class="dtm-grow"></span>
        <span class="dtm-hint" data-dtm="compose-key-hint"></span>
      </div>
      <div class="dtm-row" data-dtm="compose-scale-row">
        <span class="dtm-label">\u97F3\u968E</span>
        <select class="dtm-select" data-dtm="compose-scale" title="\u65CB\u5F8B\u304C\u4F7F\u3046\u97F3\u968E\u3092\u9078\u3073\u307E\u3059\u3002\u30D9\u30FC\u30B9\u8ABF\uFF08\u4E3B\u97F3\u306E\u9AD8\u3055\uFF09\u3068\u306F\u72EC\u7ACB\u3057\u305F\u8A2D\u5B9A\u3067\u3059">
          <option value="auto" title="\u30D9\u30FC\u30B9\u8ABF\u306E\u9577\u77ED\u306B\u5408\u308F\u305B\u3066\u3001\u967D\u97F3\u968E\uFF08\u9577\u8ABF\uFF09\u304B\u6C11\u8B21\u97F3\u968E\uFF08\u77ED\u8ABF\uFF09\u3092\u4F7F\u3044\u307E\u3059">\u304A\u307E\u304B\u305B\uFF08\u5F93\u6765\u3069\u304A\u308A\uFF09</option>
          <option value="any" title="9\u3064\u306E\u97F3\u968E\u304B\u3089\u30E9\u30F3\u30C0\u30E0\u306B\u62BD\u9078\u3057\u307E\u3059">\u5E0C\u671B\u306A\u3057\uFF08\u5168\u97F3\u968E\u304B\u3089\u62BD\u9078\uFF09</option>
          <optgroup label="\u30DA\u30F3\u30BF\u30C8\u30CB\u30C3\u30AF\uFF085\u97F3\u97F3\u968E\uFF09">
            <option value="yo" title="J-POP\u306E\u6A19\u6E96\u3002\u660E\u308B\u304F\u7D20\u76F4\u3067\u6B4C\u3044\u3084\u3059\u3044\u3002\u5F93\u6765\u306E\u9577\u8ABF\u3068\u540C\u3058">\u967D\u97F3\u968E\uFF08\u9577\u8ABF\u30DA\u30F3\u30BF\uFF09</option>
            <option value="minyo" title="\u308F\u3089\u3079\u6B4C\u30FB\u6C11\u8B21\u306E\u97F3\u968E\u3002\u7FF3\u308A\u304C\u3042\u308B\u304C\u6697\u3059\u304E\u306A\u3044\u3002\u5F93\u6765\u306E\u77ED\u8ABF\u3068\u540C\u3058">\u6C11\u8B21\u97F3\u968E\uFF08\u77ED\u8ABF\u30DA\u30F3\u30BF\uFF09</option>
            <option value="ryukyu" title="\u6C96\u7E04\u97F3\u968E\u3002\u30EC\u3068\u30E9\u3092\u629C\u304D\u3001\u30D5\u30A1\u3068\u30B7\u3092\u67F1\u306B\u3059\u308B\u3002\u660E\u308B\u304F\u8DF3\u306D\u308B">\u7409\u7403\u97F3\u968E\uFF08\u6C96\u7E04\uFF09</option>
            <option value="miyakobushi" title="\u300E\u3055\u304F\u3089\u3055\u304F\u3089\u300F\u306E\u97F3\u968E\u3002\u4E3B\u97F3\u306E\u3059\u3050\u4E0A\u304C\u534A\u97F3\u3067\u3001\u7FF3\u308A\u304C\u6FC3\u3044">\u90FD\u7BC0\u97F3\u968E\uFF08\u9670\u97F3\u968E\uFF09</option>
            <option value="ritsu" title="\u96C5\u697D\u30FB\u58F0\u660E\u306E\u97F3\u968E\u3002\u534A\u97F3\u3092\u542B\u307E\u305A\u3001\u5E73\u3089\u3067\u8358\u91CD\u306B\u6D41\u308C\u308B">\u5F8B\u97F3\u968E\uFF08\u96C5\u697D\uFF09</option>
          </optgroup>
          <optgroup label="\u30C1\u30E3\u30FC\u30C1\u30E2\u30FC\u30C9\uFF087\u97F3\u97F3\u968E\uFF09">
            <option value="dorian" title="\u77ED\u8ABF\u3060\u304C6\u5EA6\u304C\u660E\u308B\u3044\u3002\u30B1\u30EB\u30C8\u30FB\u30ED\u30C3\u30AF\u30FB\u30B7\u30C6\u30A3\u30DD\u30C3\u30D7">\u30C9\u30EA\u30A2\u30F3</option>
            <option value="phrygian" title="\u4E3B\u97F3\u306E\u4E0A\u304C\u534A\u97F3\u3002\u30B9\u30D1\u30CB\u30C3\u30B7\u30E5\uFF0F\u30E1\u30BF\u30EB\u306E\u7DCA\u8FEB\u3057\u305F\u97FF\u304D">\u30D5\u30EA\u30B8\u30A2\u30F3</option>
            <option value="lydian" title="4\u5EA6\u304C\u9AD8\u304F\u3001\u6D6E\u904A\u3057\u3066\u5E83\u304C\u308B\u3002\u6620\u753B\u97F3\u697D\u30FB\u30B2\u30FC\u30E0\u306E\u7A7A\u306E\u8272">\u30EA\u30C7\u30A3\u30A2\u30F3</option>
            <option value="mixolydian" title="\u9577\u8ABF\u3060\u304C7\u5EA6\u304C\u4F4E\u3044\u3002\u30D6\u30EB\u30FC\u30B9\u30ED\u30C3\u30AF\u30FB\u6C11\u65CF\u97F3\u697D\u306E\u571F\u304F\u3055\u3055">\u30DF\u30AF\u30BD\u30EA\u30C7\u30A3\u30A2\u30F3</option>
          </optgroup>
          <optgroup label="\u7279\u6B8A\u97F3\u968E\uFF08\u97F3\u7A0B\u96C6\u5408\u3054\u3068\u5165\u308C\u66FF\u308F\u308B\uFF09">
            <option value="harmonic_minor" title="\u5C0E\u97F3\u30BD\u266F\u3092\u6301\u3064\u77ED\u8ABF\u3002\u58972\u5EA6\u304C\u6CE3\u304D\u3092\u4F5C\u308B\u3002\u30AF\u30E9\u30B7\u30C3\u30AF\u30FBV\u7CFB\u30FB\u5287\u4F34">\u548C\u58F0\u7684\u77ED\u97F3\u968E</option>
            <option value="hijaz" title="\u4E3B\u97F3\u306E\u4E0A\u304C\u534A\u97F3\u3001\u4E3B\u548C\u97F3\u306F\u9577\u4E09\u548C\u97F3\u3002\u4E2D\u6771\u30FB\u30B9\u30D1\u30CB\u30C3\u30B7\u30E5\u30FB\u30E1\u30BF\u30EB">\u30D2\u30B8\u30E3\u30FC\u30BA\uFF08\u30D5\u30EA\u30B8\u30A2\u30F3\u30FB\u30C9\u30DF\u30CA\u30F3\u30C8\uFF09</option>
            <option value="hungarian" title="\u58972\u5EA6\u304C2\u304B\u6240\u3002\u97F3\u968E\u306E\u4E2D\u3067\u3044\u3061\u3070\u3093\u8DF3\u306D\u305F\u3001\u7570\u56FD\u3081\u3044\u305F\u97FF\u304D">\u30CF\u30F3\u30AC\u30EA\u30A2\u30F3\u30FB\u30DE\u30A4\u30CA\u30FC\uFF08\u30B8\u30D7\u30B7\u30FC\uFF09</option>
            <option value="blues" title="\u30D6\u30EB\u30FC\u30CE\u30FC\u30C8\u5165\u308A\u306E6\u97F3\u97F3\u968E\u3002\u77ED3\u5EA6\u3067\u6B4C\u3044\u3001\u4F34\u594F\u306F\u95773\u5EA6\u3067\u9CF4\u308B">\u30D6\u30EB\u30FC\u30B9\u97F3\u968E</option>
          </optgroup>
        </select>
        <span class="dtm-grow"></span>
        <span class="dtm-hint" data-dtm="compose-scale-hint"></span>
      </div>
    </div>
  </details>

  <details class="dtm-panel" data-dtm-acc="macro">
    <summary>\u4E00\u62EC\u7DE8\u96C6</summary>
    <div class="dtm-panel-body">
      <div class="dtm-row">
        <span class="dtm-label">\u5168\u4F53\u30B7\u30D5\u30C8</span>
        <select class="dtm-select" data-dtm="shift-select">
          <option value="-1536">-8\u5C0F\u7BC0</option>
          <option value="-192">-1\u5C0F\u7BC0</option>
          <option value="-96">-2\u5206</option>
          <option value="-48">-4\u5206</option>
          <option value="-24">-8\u5206</option>
          <option value="-12">-16\u5206</option>
          <option value="12">+16\u5206</option>
          <option value="24">+8\u5206</option>
          <option value="48">+4\u5206</option>
          <option value="96">+2\u5206</option>
          <option value="192">+1\u5C0F\u7BC0</option>
          <option value="1536">+8\u5C0F\u7BC0</option>
        </select>
        <button class="dtm-btn dtm-btn--primary" data-dtm="shift-apply">\u9069\u7528</button>
        <label class="dtm-checkbox-label" title="\u6709\u52B9\u306B\u3059\u308B\u3068\u3001\u3044\u307E\u958B\u3044\u3066\u3044\u308B\u30C8\u30E9\u30C3\u30AF\u3060\u3051\u3092\u30B7\u30D5\u30C8\u3057\u307E\u3059">
          <input type="checkbox" class="dtm-checkbox" data-dtm="shift-active-only"> \u3053\u306E\u30C8\u30E9\u30C3\u30AF\u306E\u307F
        </label>
      </div>
      <div class="dtm-row">
        <span class="dtm-label">\u79FB\u8ABF</span>
        <select class="dtm-select" data-dtm="transpose-select" aria-label="\u79FB\u8ABF\u3059\u308B\u534A\u97F3\u6570">
          <option value="-12">-1oct</option>
          <option value="-7">-5th</option>
          <option value="-5">-4th</option>
          <option value="-3">-3\u534A\u97F3</option>
          <option value="-2">-2\u534A\u97F3</option>
          <option value="-1">-1\u534A\u97F3</option>
          <option value="1">+1\u534A\u97F3</option>
          <option value="2">+2\u534A\u97F3</option>
          <option value="3">+3\u534A\u97F3</option>
          <option value="5">+4th</option>
          <option value="7">+5th</option>
          <option value="12">+1oct</option>
        </select>
        <button class="dtm-btn dtm-btn--primary" data-dtm="transpose-apply">\u9069\u7528</button>
        <button class="dtm-infobtn" data-dtm="transpose-info" title="\u79FB\u8ABF\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
      </div>
      <div class="dtm-row">
        <button class="dtm-btn dtm-btn--danger" data-dtm="macro-clear">\u5168\u6D88\u53BB</button>
        <button class="dtm-btn dtm-btn--accent" data-dtm="macro-random">\u30E9\u30F3\u30C0\u30E0\u914D\u7F6E</button>
        <button class="dtm-btn dtm-btn--primary" data-dtm="macro-harmonic">\u4F34\u594F\u30D5\u30A3\u30EB\u30BF</button>
        <button class="dtm-btn dtm-btn--primary" data-dtm="macro-mono">\u5358\u97F3\u5316</button>
      </div>
    </div>
  </details>

  <details class="dtm-panel" data-dtm-acc="io-out">
    <summary>MIDI / MusicXML / UST / MML \u51FA\u529B</summary>
    <div class="dtm-panel-body">
      <div class="dtm-row">
        <button class="dtm-btn dtm-btn--accent" data-dtm="export-midi">MIDI\u51FA\u529B</button>
        <button class="dtm-btn dtm-btn--accent" data-dtm="export-musicxml" title="\u5168\u30C8\u30E9\u30C3\u30AF\u3092MusicXML\uFF08\u697D\u8B5C\uFF09\u5F62\u5F0F\u3067\u66F8\u304D\u51FA\u3057\u307E\u3059">MusicXML\u51FA\u529B</button>
        <button class="dtm-btn dtm-btn--accent" data-dtm="export-ust" title="\u73FE\u5728\u9078\u629E\u4E2D\u306E\u30C8\u30E9\u30C3\u30AF\u3060\u3051\u3092UST\u3067\u66F8\u304D\u51FA\u3057\u307E\u3059">UST\u51FA\u529B</button>
        <button class="dtm-btn dtm-btn--success" data-dtm="generate-mml">MML\u751F\u6210</button>
        <button class="dtm-btn dtm-btn--primary dtm-hidden" data-dtm="export-wav">WAV\u66F8\u304D\u51FA\u3057</button>
      </div>
      <div class="dtm-row">
        <button class="dtm-btn dtm-btn--primary" data-dtm="drum-json-export" title="\u8AAD\u307F\u8FBC\u3093\u3060MIDI\u306E\u30C9\u30E9\u30E0\u5B9A\u7FA9\u3092JSON\u51FA\u529B">\u30C9\u30E9\u30E0JSON\u51FA\u529B</button>
      </div>
      <label class="dtm-checkbox-label">
        <input type="checkbox" class="dtm-checkbox" data-dtm="decompose-chord">
        <span>\u548C\u97F3\u5206\u89E3\u30E2\u30FC\u30C9\uFF08\u5358\u97F3\u30C8\u30E9\u30C3\u30AF\u306B\u6700\u9069\u5206\u5272\uFF09</span>
      </label>
      <label class="dtm-checkbox-label dtm-checkbox-label--sub">
        <input type="checkbox" class="dtm-checkbox" data-dtm="ignore-chord-heavy">
        <span>\u548C\u97F3\u4F34\u594F\u30C8\u30E9\u30C3\u30AF\u3092\u7121\u8996\uFF08\u5206\u89E3\u5BFE\u8C61\u304B\u3089\u9664\u5916\uFF09</span>
      </label>
      <div class="dtm-row" style="margin-top:6px;align-items:center;gap:8px;">
        <span class="dtm-label">\u751F\u6210\u4E0A\u9650</span>
        <select class="dtm-select" data-dtm="bar-limit">
          <option value="0">\u5236\u9650\u306A\u3057</option>
          <option value="8">8\u5C0F\u7BC0</option>
          <option value="16">16\u5C0F\u7BC0</option>
          <option value="24">24\u5C0F\u7BC0</option>
          <option value="32">32\u5C0F\u7BC0</option>
          <option value="64">64\u5C0F\u7BC0</option>
          <option value="128">128\u5C0F\u7BC0</option>
        </select>
      </div>
      <div class="dtm-output dtm-hidden" data-dtm="drum-json-output">
        <p class="dtm-label" data-dtm="drum-json-status"></p>
        <div class="dtm-output-row">
          <pre class="dtm-output-scroll"><code data-dtm="drum-json-text"></code></pre>
          <button class="dtm-btn dtm-btn--primary dtm-btn--icon" data-dtm="drum-json-copy" title="\u30B3\u30D4\u30FC">${Y(`copy`)}</button>
        </div>
      </div>
      <div class="dtm-output dtm-hidden" data-dtm="output-container">
        <p class="dtm-label" data-dtm="output-status"></p>
        <div class="dtm-output-label">\u6539\u884C\u3042\u308A\u7248</div>
        <div class="dtm-output-row">
          <pre><code data-dtm="output-full"></code></pre>
          <button class="dtm-btn dtm-btn--primary dtm-btn--icon" data-dtm="copy-full" title="\u30B3\u30D4\u30FC">${Y(`copy`)}</button>
        </div>
        <div class="dtm-output-label">\uFF11\u884C\u7248</div>
        <div class="dtm-output-row">
          <pre><code data-dtm="output-mini"></code></pre>
          <button class="dtm-btn dtm-btn--primary dtm-btn--icon" data-dtm="copy-mini" title="\u30B3\u30D4\u30FC">${Y(`copy`)}</button>
        </div>
      </div>
    </div>
  </details>
  </div>

  <!-- \u2550\u2550\u2550\u2550 \u89E3\u8AAC\u30E2\u30FC\u30C0\u30EB \u2550\u2550\u2550\u2550 -->
  <div class="dtm-modal-overlay" data-dtm="modal-overlay" hidden>
    <div class="dtm-win dtm-modal">
      <div class="dtm-modal-header">
        <span class="dtm-modal-title" data-dtm="modal-title"></span>
        <button class="dtm-modal-close" data-dtm="modal-close">&times;</button>
      </div>
      <div class="dtm-modal-body" data-dtm="modal-body"></div>
    </div>
  </div>

</div>`;let d=Lp(e,`[data-dtm="root"]`);Ip(d);let f=e=>Lp(d,`[data-dtm="${e}"]`);return{root:d,topbar:f(`transport`),topbarLoading:f(`topbar-loading`),playBtn:f(`play`),prevBarBtn:f(`prev-bar`),nextBarBtn:f(`next-bar`),soloCheckbox:f(`solo`),clipBadge:f(`clip-badge`),helpBtn:f(`help`),toolPen:f(`tool-pen`),toolSelect:f(`tool-select`),toolEraser:f(`tool-eraser`),undoBtn:f(`undo`),redoBtn:f(`redo`),noteLengthSelect:f(`note-length`),bpmInput:f(`bpm`),zoomXLabel:f(`zoomx-label`),zoomYLabel:f(`zoomy-label`),zoomXIn:f(`zoomx-in`),zoomXOut:f(`zoomx-out`),zoomYIn:f(`zoomy-in`),zoomYOut:f(`zoomy-out`),bgFileInput:f(`bg-file-input`),bgUploadBtn:f(`bg-upload`),bgRemoveBtn:f(`bg-remove`),bgOpacityInput:f(`bg-opacity`),bgOpacityRow:f(`bg-opacity-row`),bgYoutubeThumb:f(`bg-youtube-thumb`),rollContainer:f(`roll`),wrapper:f(`wrapper`),vScroll:f(`vscroll`),vScrollThumb:f(`vscroll-thumb`),hScroll:f(`hscroll`),hScrollThumb:f(`hscroll-thumb`),loopToggle:f(`loop-toggle`),loopToggleLabel:f(`loop-toggle-label`),loopInfoBtn:f(`loop-info`),masterVolume:f(`master-volume`),masterVolumeLabel:f(`master-volume-label`),masterComp:f(`master-comp`),masterCompLabel:f(`master-comp-label`),masterCompInfoBtn:f(`master-comp-info`),reverbAmount:f(`reverb-amount`),reverbAmountLabel:f(`reverb-amount-label`),reverbAmountInfoBtn:f(`reverb-amount-info`),reverbDecay:f(`reverb-decay`),reverbDecayLabel:f(`reverb-decay-label`),reverbPreDelay:f(`reverb-predelay`),reverbPreDelayLabel:f(`reverb-predelay-label`),delayAmount:f(`delay-amount`),delayAmountLabel:f(`delay-amount-label`),delayAmountInfoBtn:f(`delay-amount-info`),delayDivision:f(`delay-division`),fadeIn:f(`fade-in`),fadeInLabel:f(`fade-in-label`),fadeOut:f(`fade-out`),fadeOutLabel:f(`fade-out-label`),fadeInfoBtn:f(`fade-info`),autoMasterBtn:f(`auto-master`),autoMasterInfoBtn:f(`auto-master-info`),trackTabs:f(`track-tabs`),trackBody:f(`track-body`),drumSelect:f(`drum-select`),drumFontSelect:f(`drum-font-select`),drumVolume:f(`drum-volume`),drumVolumeLabel:f(`drum-volume-label`),audioPanel:f(`audio-panel`),audioFileInput:f(`audio-file`),audioUrlInput:f(`audio-url`),audioUrlLoadBtn:f(`audio-url-load`),audioClearBtn:f(`audio-clear`),audioInfoBtn:f(`audio-info`),audioStatus:f(`audio-status`),audioYoutubeRow:f(`audio-youtube-row`),audioYoutube:f(`audio-youtube`),audioVolume:f(`audio-volume`),audioVolumeLabel:f(`audio-volume-label`),audioMute:f(`audio-mute`),audioStartInput:f(`audio-start`),audioEndInput:f(`audio-end`),audioLeadSelect:f(`audio-lead`),audioOffsetInput:f(`audio-offset`),audioOffsetTail:f(`audio-offset-tail`),midiInput:f(`midi-input`),midiLoadBtn:f(`midi-load`),midiInfoBtn:f(`midi-info`),midiTrackSelection:f(`midi-track-selection`),midiPanel:f(`midi-panel`),midiSearchOpenBtn:f(`midi-search-open`),musicXmlInput:f(`musicxml-input`),musicXmlLoadBtn:f(`musicxml-load`),musicXmlInfoBtn:f(`musicxml-info`),musicXmlPartSelection:f(`musicxml-part-selection`),musicXmlLoadNote:f(`musicxml-load-note`),ustInput:f(`ust-input`),ustLoadBtn:f(`ust-load`),ustInfoBtn:f(`ust-info`),ustLoadNote:f(`ust-load-note`),mmlInput:f(`mml-input`),mmlLoadBtn:f(`mml-load`),mmlLoadNote:f(`mml-load-note`),applyActiveOnly:f(`apply-active-only`),shiftSelect:f(`shift-select`),shiftApplyBtn:f(`shift-apply`),shiftActiveOnly:f(`shift-active-only`),transposeSelect:f(`transpose-select`),transposeApplyBtn:f(`transpose-apply`),transposeInfoBtn:f(`transpose-info`),macroCompose:f(`macro-compose`),composeKeep:f(`compose-keep`),composeRecall:f(`compose-recall`),composeTemplate:f(`compose-template`),composeSections:f(`compose-sections`),composeSectionsLen:f(`compose-sections-len`),composeKey:f(`compose-key`),composeKeyHint:f(`compose-key-hint`),composeScale:f(`compose-scale`),composeScaleHint:f(`compose-scale-hint`),macroComposeVocal:f(`macro-compose-vocal`),macroComposeInfo:f(`macro-compose-info`),macroClear:f(`macro-clear`),macroRandom:f(`macro-random`),macroHarmonic:f(`macro-harmonic`),macroMono:f(`macro-mono`),exportMidiBtn:f(`export-midi`),exportMusicXmlBtn:f(`export-musicxml`),exportUstBtn:f(`export-ust`),exportWavBtn:f(`export-wav`),drumJsonExportBtn:f(`drum-json-export`),drumJsonOutput:f(`drum-json-output`),drumJsonStatus:f(`drum-json-status`),drumJsonText:f(`drum-json-text`),drumJsonCopyBtn:f(`drum-json-copy`),generateMmlBtn:f(`generate-mml`),decomposeChordToggle:f(`decompose-chord`),ignoreChordHeavyToggle:f(`ignore-chord-heavy`),barLimitSelect:f(`bar-limit`),outputContainer:f(`output-container`),outputStatus:f(`output-status`),outputFull:f(`output-full`),outputMini:f(`output-mini`),copyFullBtn:f(`copy-full`),copyMiniBtn:f(`copy-mini`),overlay:f(`overlay`),mmlInfoBtn:f(`mml-info`),edoSelect:f(`edo-select`),edoInfoBtn:f(`edo-info`),modalOverlay:f(`modal-overlay`),modalTitle:f(`modal-title`),modalBody:f(`modal-body`),modalClose:f(`modal-close`)}},zp={template:`dtm-macro:template`,sections:`dtm-macro:sections`,key:`dtm-macro:key`,scale:`dtm-macro:scale`,shift:`dtm-macro:shift`,shiftActiveOnly:`dtm-macro:shift-active-only`,transpose:`dtm-macro:transpose`},Bp=e=>{try{return typeof localStorage>`u`||!localStorage?null:localStorage.getItem(zp[e])}catch{return null}},Vp=(e,t)=>{try{if(typeof localStorage>`u`||!localStorage)return;localStorage.setItem(zp[e],t)}catch{}},Hp=()=>{let e=Bp(`sections`);if(!e)return null;try{let t=JSON.parse(e);if(Array.isArray(t)&&t.every(e=>typeof e==`string`))return t}catch{}return null},Up=e=>{Vp(`sections`,JSON.stringify(e))},Wp=`dtm-macro:kept`,Gp=()=>{try{if(typeof localStorage>`u`||!localStorage)return null;let e=localStorage.getItem(Wp);if(!e)return null;let t=JSON.parse(e);if(t&&typeof t==`object`&&typeof t.mml==`string`&&t.mml.length>0){let e=typeof t.startStep==`number`&&Number.isFinite(t.startStep)&&t.startStep>=0?Math.floor(t.startStep):0;return{mml:t.mml,startStep:e}}}catch{}return null},Kp=e=>{try{if(typeof localStorage>`u`||!localStorage)return;if(e===null){localStorage.removeItem(Wp);return}localStorage.setItem(Wp,JSON.stringify(e))}catch{}},qp=[[0,2,4,5,7,9,11],[0,2,3,5,7,8,10],[0,2,4,7,9]],Jp=[0,3,5,8,10,13,16,18,21,23,26,28],Yp=(e,t)=>{let{stepsPerBar:n,startStep:r,pitchRangeStart:i,edo:a=12}=t,o=e=>a===31?Jp[e]:e,s=372/a,c=i+1860,l=qp[Math.floor(Math.random()*qp.length)],u=Math.floor(Math.random()*12),d=[];for(let e=0;e<12;e++){let t=(e-u+12)%12;l.includes(t)&&d.push($t(c+o(e)*s))}e.beginBatch();for(let t=0;t<8;t++){let i=r+t*n,a=Math.floor(Math.random()*4)+2,o=new Set;for(let t=0;t<a;t++){let t=i+Math.floor(n/24*Math.random())*24;if(o.has(t))continue;o.add(t);let r=d[Math.floor(Math.random()*d.length)];e.addNote(t,r,{noteLengthSteps:24})}}e.endBatch(),e.saveHistory()},Xp=(e,t,n)=>{let r=n.stepsPerBar/2,i=e.getNotes().concat(t.getNotes());if(i.length===0)return;let a=Math.max(...i.map(e=>e.startStep+e.durationSteps)),o=Math.ceil(a/r),s=new Set;e.beginBatch();for(let n=0;n<o;n++){let i=n*r,a=i+r,o=n%2==0,c=t.getNotes().filter(e=>e.startStep>=i&&e.startStep<a);if(c.length>0?s=new Set(c.map(e=>e.pitchUnits%372)):o&&(s=new Set),s.size===0)continue;let l=e.getNotes().filter(e=>e.startStep>=i&&e.startStep<a);for(let t of l)s.has(t.pitchUnits%372)||e.deleteNoteById(t.id)}e.endBatch(),e.saveHistory()},Zp=(e,t,n)=>{let r=n.stepsPerBar/2,i=e.getNotes().concat(t.getNotes());if(i.length===0)return;let a=Math.max(...i.map(e=>e.startStep+e.durationSteps)),o=Math.ceil(a/r),s=new Set;e.beginBatch();for(let n=0;n<o;n++){let i=n*r,a=i+r,o=n%2==0,c=t.getNotes().filter(e=>e.startStep>=i&&e.startStep<a);if(c.length>0?s=new Set(c.map(e=>e.pitchUnits%372)):o&&(s=new Set),s.size===0)continue;let l=e.getNotes().filter(e=>e.startStep>=i&&e.startStep<a),u=l.filter(e=>s.has(e.pitchUnits%372)),d=new Set(u.map(e=>e.id));for(let t of l)d.has(t.id)||e.deleteNoteById(t.id);let f=new Map;for(let e of u)f.has(e.startStep)||f.set(e.startStep,[]),f.get(e.startStep)?.push(e);for(let t of f.values())if(t.length>1){t.sort((e,t)=>t.pitchUnits-e.pitchUnits);let[,...n]=t;for(let t of n)e.deleteNoteById(t.id)}}e.endBatch(),e.saveHistory()},Qp=(e,t)=>{if(t!==0)for(let n of e)n.shiftAllNotes(t)},$p=(e,t)=>{if(t!==0)for(let n of e){let e=[...n.getNotes()];for(let r of e){let e=$t(Math.max(0,Math.min(ba,r.pitchUnits+t)));e!==r.pitchUnits&&n.moveNote(r.id,r.startStep,e)}n.saveHistory()}},em=`2.1.23`,tm=48,nm=e=>{let{tracks:t}=e,n=[];for(let e=0;e<t.length;e++){let r=[],i=0;for(let n of t[e])if(i+=n.delta,n.noteOn&&n.noteOn.velocity>0)r.push({pitch:n.noteOn.noteNumber,channel:n.channel??0});else if(n.noteOff||n.noteOn&&n.noteOn.velocity===0){let e=n.noteOff||n.noteOn;if(e){for(let t=r.length-1;t>=0;t--)if(r[t].pitch===e.noteNumber&&r[t].end===void 0){r[t].end=i;break}}}let a=r.filter(e=>e.end!==void 0),o=a.filter(e=>e.channel!==9);a.length>0&&o.length===0||n.push({index:e,name:`Ch${e+1}`,noteCount:o.length,selected:o.length>0})}return n},rm=e=>{let{tracks:t}=e;for(let e of t)for(let t of e)if(t.setTempo&&typeof t.setTempo.microsecondsPerQuarter==`number`)return 6e7/t.setTempo.microsecondsPerQuarter;return 120},im=(e,t)=>{let{tracks:n,division:r}=e,i=r,a=rm(e),o={};for(let e of t){let t=n[e];if(!t)continue;let r=0;for(let e of t)if(r+=e.delta,e.channel!==9){if(e.noteOn&&e.noteOn.velocity>0){let t=e.noteOn.noteNumber,n=e.noteOn.velocity,i=e.channel??0;o[i]||(o[i]=[]),o[i].push({pitch:t,velocity:n,start:r,end:null})}else if(e.noteOff||e.noteOn&&e.noteOn.velocity===0){let t=e.noteOff||e.noteOn;if(t){let n=t.noteNumber,i=e.channel??0;if(o[i])for(let e=o[i].length-1;e>=0;e--){let t=o[i][e];if(t.pitch===n&&t.end===null){t.end=r;break}}}}}}let s=i*4,c=s*8,l={};for(let[e,t]of Object.entries(o)){let n=Number.parseInt(e,10),r=t.filter(e=>e.end!==null);if(r.length===0){l[n]={avgPitch:60,maxSimultaneous:0,hasSubmelodyPattern:!1};continue}let i=r.reduce((e,t)=>e+t.pitch,0)/r.length,a=0,o=[...r].sort((e,t)=>e.start-t.start);for(let e=0;e<o.length;e++){let t=1;for(let n=e+1;n<o.length;n++)o[n].start<o[e].end&&t++;a=Math.max(a,t)}l[n]={avgPitch:i,maxSimultaneous:a,hasSubmelodyPattern:(()=>{if(o.length===0)return!1;let e=[],t=o[0].start,n=o[0].end;for(let r=1;r<o.length;r++)o[r].start-o[r-1].end>=s?(e.push({start:t,end:n}),t=o[r].start,n=o[r].end):n=o[r].end;return e.push({start:t,end:n}),e.every(e=>e.end-e.start<c)})()}}let u=Object.keys(o).map(Number).sort((e,t)=>e-t),d=[...u].sort((e,t)=>l[e].avgPitch-l[t].avgPitch),f=l[d[Math.floor(d.length/4)]]?.avgPitch??60,p=u.filter(e=>l[e].avgPitch<=f&&l[e].maxSimultaneous<=2),m=u.filter(e=>l[e].maxSimultaneous<=1&&!p.includes(e)),h=m.filter(e=>l[e].hasSubmelodyPattern),g=m.filter(e=>!l[e].hasSubmelodyPattern),_={melody:g,submelody:h,bass:p,chord:u.filter(e=>!p.includes(e)&&!g.includes(e)&&!h.includes(e))},v=[],y=i/tm;for(let[e,t]of Object.entries(o)){let n=Number.parseInt(e,10),r=null;for(let[e,t]of Object.entries(_))if(t.includes(n)){r=e;break}if(r)for(let e of t){if(e.end===null)continue;let t=Math.round(e.start/y),n=Math.max(1,Math.round((e.end-e.start)/y));v.push({trackId:r,startStep:t,pitch:e.pitch,durationSteps:n,velocity:e.velocity})}}if(v.length>0){let e=Math.min(...v.map(e=>e.startStep)),t=tm*4,n=Math.floor(e/t);if(n>0){let e=n*t;for(let t of v)t.startStep-=e}}return{placements:v,bpm:a}},am=(e,t)=>{let{placements:n}=im(e,t);if(n.length<4)return!1;let r=n.filter(e=>e.durationSteps<=1).length/n.length,i=new Map;for(let e of n)i.set(e.startStep,(i.get(e.startStep)??0)+1);let a=[...i.values()].filter(e=>e>=6).length/i.size;return r<.6&&a<.35},om=(e,t,n)=>{let{tracks:r,division:i}=e,a=i,o=rm(e),s=a/tm,c=[];if(t.forEach((e,t)=>{if(t>=n.length)return;let i=r[e];if(!i)return;let a=n[t],o=[],l=0;for(let e of i)if(l+=e.delta,e.channel!==9){if(e.noteOn&&e.noteOn.velocity>0){let t=e.noteOn.noteNumber,n=e.noteOn.velocity;o.push({pitch:t,velocity:n,start:l,end:null})}else if(e.noteOff||e.noteOn&&e.noteOn.velocity===0){let t=e.noteOff||e.noteOn;if(t){let e=t.noteNumber;for(let t=o.length-1;t>=0;t--)if(o[t].pitch===e&&o[t].end===null){o[t].end=l;break}}}}for(let e of o){if(e.end===null)continue;let t=Math.round(e.start/s),n=Math.max(1,Math.round((e.end-e.start)/s));c.push({trackId:a,startStep:t,pitch:e.pitch,durationSteps:n,velocity:e.velocity})}}),c.length>0){let e=Math.min(...c.map(e=>e.startStep)),t=tm*4,n=Math.floor(e/t);if(n>0){let e=n*t;for(let t of c)t.startStep-=e}}return{placements:c,bpm:o}},sm=e=>[(e&65280)>>8,e&255],cm=e=>[(e&16711680)>>16,...sm(e)],lm=e=>[(e&4278190080)>>24,...cm(e)],um=e=>{let t=[e&127],n=e>>7;for(;n>0;)t.push(n&127|128),n>>=7;return t.reverse()},dm=(e,t,n)=>{e.push(77,84,104,100),e.push(...lm(6)),e.push(...sm(1)),e.push(...sm(t)),e.push(...sm(n))},fm=(e,t)=>{e.push(77,84,114,107);let n=[];t(n),n.push(...um(0)),n.push(255,47,0),e.push(...lm(n.length)),e.push(...n)},pm=e=>{let{tracks:t,getDrumPattern:n,drumVolume:r=80,bpm:i,stepsPerBar:a}=e,o=480/tm,s=[],c=e=>Math.round(e*100),l=t.some(e=>e.notes.some(e=>{let{detuneCents:t}=mn(e.pitchUnits);return c(t)!==0})),u=[];if(l){let e=[0,1,2,3,4,5,6,7,8,10,11,12,13,14,15],n=new Map;for(let e of t)for(let t of e.notes){let{detuneCents:e}=mn(t.pitchUnits),r=c(e);n.set(r,(n.get(r)??0)+1)}let r=new Map,i=[...n.entries()].sort((e,t)=>t[1]-e[1]);for(let[t]of i){if(r.size>=e.length)break;r.set(t,e[r.size])}t.forEach(e=>{if(e.notes.length===0)return;let t=[];for(let n of e.notes){let{midi:i,detuneCents:a}=mn(n.pitchUnits),s=c(a),l=r.get(s)??r.get(0)??0,u=Math.max(0,Math.min(127,i)),d=Math.round(n.startStep*o),f=Math.round((n.startStep+(n.durationSteps||1))*o),p=Math.round((n.velocity??100)*(e.volume??100)/100);t.push({t:d,m:[144|l,u,p]}),t.push({t:f,m:[144|l,u,0]})}t.sort((e,t)=>e.t-t.t),s.push(t)});for(let[e,t]of r){let n=e/100;u.push({t:0,m:[176|t,101,0]}),u.push({t:0,m:[176|t,100,0]}),u.push({t:0,m:[176|t,6,2]}),u.push({t:0,m:[176|t,38,0]}),u.push({t:0,m:[176|t,101,127]}),u.push({t:0,m:[176|t,100,127]});let r=8192+Math.round(n/200*8192),i=Math.max(0,Math.min(16383,r));u.push({t:0,m:[224|t,i&127,i>>7&127]})}}else t.forEach((e,t)=>{if(e.notes.length===0)return;let n=t<9?t:t+1&15,r=[];e.program!==void 0&&e.program>=0&&e.program<=127&&r.push({t:0,m:[192|n,e.program]});for(let t of e.notes){let{midi:i}=mn(t.pitchUnits),a=Math.max(0,Math.min(127,i)),s=Math.round(t.startStep*o),c=Math.round((t.startStep+(t.durationSteps||1))*o),l=Math.round((t.velocity??100)*(e.volume??100)/100);r.push({t:s,m:[144|n,a,l]}),r.push({t:c,m:[144|n,a,0]})}r.sort((e,t)=>{if(e.t!==t.t)return e.t-t.t;let n=e.m[0]&240,r=t.m[0]&240;return n===192&&r!==192?-1:+(r===192&&n!==192)}),s.push(r)});let d=Math.max(...t.filter(e=>e.notes.length>0).map(e=>Math.max(...e.notes.map(e=>e.startStep+e.durationSteps))),a),f=[],p=Math.ceil(d/a);for(let e=0;e<p;e++){let t=e+1,i=n?n(t):null;if(i&&i.length>0){let t=e*a;for(let e of i){let n=t+e.step;if(n>=d)continue;let i=Math.round((e.velocity??1)*(r/100)*127);f.push({t:Math.round(n*o),m:[153,e.pitch,i]}),f.push({t:Math.round((n+1)*o),m:[153,e.pitch,0]})}}}f.sort((e,t)=>e.t-t.t),f.length>0&&s.push(f);let m=[];dm(m,s.length+1,480),fm(m,e=>{e.push(0,255,81,3,...cm(Math.round(6e7/i)));let t=Array.from(new TextEncoder().encode(`dtm ${em}`));e.push(0,255,1,...um(t.length),...t);for(let t of u)e.push(0,...t.m)});for(let e of s)fm(m,t=>{let n=0;for(let r of e)t.push(...um(r.t-n),...r.m),n=r.t});return new Blob([new Uint8Array(m).buffer],{type:`audio/midi`})},mm=(e,t=`FluidR3_GM_sf2_file:0`)=>{if(e.length===0)return{json:`[]`,patternDef:{label:`抽出ドラム`,pattern:[]}};e.sort((e,t)=>e.step-t.step);let n=tm*4;if(e.length>0){let t=Math.floor(e[0].step/n);if(t>0){let r=t*n;for(let t of e)t.step-=r}}let r={};for(let t of e){let e=Math.floor(t.step/n)+1,i=`${t.step%n}_${t.pitch}_${t.velocity}`;r[i]||(r[i]=[]),r[i][r[i].length-1]!==e&&r[i].push(e)}let i={};for(let e in r){let t=r[e],n=t[0],a=t[0],o=e.split(`_`),s={step:+o[0],pitch:+o[1],velocity:+o[2]};for(let e=1;e<=t.length;e++)if(e===t.length||t[e]!==a+1){let r=`${n}-${a}`;i[r]||(i[r]=[]),i[r].push(s),e<t.length&&(n=t[e],a=t[e])}else a=t[e]}let a={};for(let e in i){let[t,n]=e.split(`-`),r=i[e].sort((e,t)=>e.step-t.step),o=JSON.stringify(r);a[o]||(a[o]=[]),a[o].push([+t,+n])}let o=[];for(let e in a){let t=a[e];t.sort((e,t)=>e[0]-t[0]),o.push({ranges:t,pattern:JSON.parse(e)})}return o.sort((e,t)=>{let n=e.ranges.reduce((e,t)=>e+(t[1]-t[0]),0),r=t.ranges.reduce((e,t)=>e+(t[1]-t[0]),0);return n===r?e.ranges[0][0]-t.ranges[0][0]:r-n}),{json:hm(o,t),patternDef:{label:`抽出ドラム`,pattern:o}}},hm=(e,t)=>{let n=Object.entries(G).reduce((e,[t,n])=>(e[n]=`DRUM_KEYS.${t}`,e),{});return`	extracted_song: {
		label: "\u62BD\u51FA\u30C9\u30E9\u30E0",
		font: "${t}",
		pattern: ${`[
${e.map(e=>`			{
				ranges: ${`[${e.ranges.map(e=>`[${e[0]}, ${e[1]}]`).join(`, `)}]`},
				pattern: [
${e.pattern.map(e=>{let t=n[e.pitch]??e.pitch;return`					{ step: ${e.step}, pitch: ${t}, velocity: ${e.velocity} },`}).join(`
`)}
				],
			}`).join(`,
`)}
		]`}
	},`},gm=(e,t=`FluidR3_GM_sf2_file:0`)=>{let{tracks:n,division:r}=e,i=r,a=[];for(let e of n){let t=0;for(let n of e)if(t+=n.delta,n.channel===9&&n.noteOn&&n.noteOn.velocity>0){let e=Math.round(t*tm/i);a.push({step:e,pitch:n.noteOn.noteNumber,velocity:Math.round(n.noteOn.velocity/127*10)/10})}}return mm(a,t)},_m=class{config;constructor(e={}){this.config=e}get enabled(){return!!this.config.apiKey}get baseUrl(){return this.config.baseUrl??`https://rpgen-search.pages.dev/api`}headers(){let e={};return this.config.apiKey&&(e.Authorization=`Bearer ${this.config.apiKey}`),e}async searchSongs(e){if(!this.enabled)return[];let t=new URLSearchParams;e.title&&t.set(`title`,e.title),e.user&&t.set(`user`,e.user),e.twitter_id&&t.set(`twitter_id`,e.twitter_id);let n=`${this.baseUrl}/picotune/songs${t.toString()?`?${t.toString()}`:``}`,r=await fetch(n,{headers:this.headers()});if(!r.ok)throw Error(`picotune search failed: ${r.status}`);let i=await r.json();return i.data??i.songs??i}async fetchMidi(e){let t=`${this.baseUrl}/picotune/songs/${encodeURIComponent(e)}`,n=await fetch(t,{headers:this.headers()});if(!n.ok)throw Error(`picotune fetch failed: ${n.status}`);return n.arrayBuffer()}async searchRechord(e){if(!this.enabled)return[];let t=new URLSearchParams;t.set(`word`,e),t.set(`guest`,`true`);let n=`${this.baseUrl}/rechord/scores?${t.toString()}`,r=await fetch(n,{headers:this.headers()});if(!r.ok)throw Error(`rechord search failed: ${r.status}`);let i=await r.json(),a=i.result??i.data??i;return Array.isArray(a)?a:[]}},vm=class{#e;constructor(){let e={value:null,prev:null,next:null};this.#e=e}add(e){let t={value:e,prev:this.#e,next:null};this.#e.next=t,this.#e=t}undo(){let{prev:e}=this.#e;return e===null||e.value===null?null:(this.#e=e,this.#e.value)}redo(){let{next:e}=this.#e;return e===null||e.value===null?null:(this.#e=e,this.#e.value)}canUndo(){let{prev:e}=this.#e;return e!==null&&e.value!==null}canRedo(){let{next:e}=this.#e;return e!==null&&e.value!==null}},ym=`'`,bm=`'`,xm=[`c`,`c+`,`d`,`d+`,`e`,`f`,`f+`,`g`,`g+`,`a`,`a+`,`b`],Sm=`c.c+.c#.d-.d_.d.d+.d#.e-.e_.e.f-.e#.f.f+.f#.g-.g_.g.g+.g#.a-.a_.a.a+.a#.b-.b_.b.b+.b#`.split(`.`),Cm=class e{notes=[];nextNoteId=0;handlers;volume=80;tempo=120;history=new vm;isUndoRedo=!1;isBatchOperation=!1;lastHistorySnapshot=`[]`;lastUndoTime=0;static UNDO_DEBOUNCE_MS=100;toolMode=`pen`;getConfig;constructor(e,t=80,n){this.handlers=e,this.volume=t,this.getConfig=n,this.lastHistorySnapshot=JSON.stringify(this.notes),this.history.add([]),this.generateAndNotify()}beginBatch(){this.isBatchOperation=!0}endBatch(){this.isBatchOperation=!1,this.saveHistory()}saveHistory(){if(this.isUndoRedo||this.isBatchOperation)return;let e=JSON.stringify(this.notes);e!==this.lastHistorySnapshot&&(this.lastHistorySnapshot=e,this.history.add(JSON.parse(e)))}restoreHistory(e){return e!==null&&(this.isUndoRedo=!0,this.notes=JSON.parse(JSON.stringify(e)),this.nextNoteId=this.notes.length>0?Math.max(...this.notes.map(e=>e.id))+1:0,this.lastHistorySnapshot=JSON.stringify(this.notes),this.generateAndNotify(),this.isUndoRedo=!1,!0)}undo(){let t=Date.now();return t-this.lastUndoTime<e.UNDO_DEBOUNCE_MS?!1:(this.lastUndoTime=t,this.restoreHistory(this.history.undo()))}redo(){let t=Date.now();return t-this.lastUndoTime<e.UNDO_DEBOUNCE_MS?!1:(this.lastUndoTime=t,this.restoreHistory(this.history.redo()))}canUndo(){return this.history.canUndo()}canRedo(){return this.history.canRedo()}setToolMode(e){this.toolMode=e}getToolMode(){return this.toolMode}resetHistory(){this.history=new vm,this.history.add([]),this.lastHistorySnapshot=JSON.stringify(this.notes)}addHistoryOnce(){this.lastHistorySnapshot=`[]`,this.saveHistory()}clearNotesWithoutHistory(){this.notes=[],this.nextNoteId=0,this.lastHistorySnapshot=`[]`}setLoadMode(e){this.isUndoRedo=e}addNote(e,t,n){if(this.notes.findIndex(n=>n.startStep===e&&n.pitchUnits===t)===-1){let r={id:this.nextNoteId++,startStep:e,durationSteps:n.noteLengthSteps,pitchUnits:t,velocity:n.velocity??100};this.notes.push(r)}this.notes.sort((e,t)=>e.startStep-t.startStep),this.saveHistory(),this.generateAndNotify()}deleteNoteById(e){let t=this.notes.findIndex(t=>t.id===e);t!==-1&&(this.notes.splice(t,1),this.saveHistory(),this.generateAndNotify())}getMaxStep(){if(this.notes.length===0)return 0;let e=Math.max(...this.notes.map(e=>e.startStep+e.durationSteps));return Math.ceil(e/12)*12}moveNote(e,t,n){let r=this.notes.find(t=>t.id===e);if(!r)return;let i=this.getMaxStep()+this.getConfig().stepsPerBar,a=this.getConfig(),o=a.unitsPerRow??31,s=a.pitchRangeStart,c=s+(a.keyCount-1)*o,l=$t(Math.min(Math.max(n,s),c));r.startStep=Math.min(Math.max(t,0),i-r.durationSteps),r.pitchUnits=l,this.notes.sort((e,t)=>e.startStep-t.startStep),this.generateAndNotify()}moveNoteEnd(e){this.saveHistory()}resizeNote(e,t){let n=this.notes.find(t=>t.id===e);n&&(n.durationSteps=Math.max(1,t),this.notes.sort((e,t)=>e.startStep-t.startStep),this.generateAndNotify())}resizeNoteEnd(e){this.saveHistory()}shiftAllNotes(e){if(e===0)return;let t=[];for(let n of this.notes){let r=n.startStep+e;r<0||(n.startStep=r,t.push(n))}this.notes=t,this.notes.sort((e,t)=>e.startStep-t.startStep),this.saveHistory(),this.generateAndNotify()}getNotes(){return this.notes}getMML(e){return this.generateMML(e)}setVolume(e){this.volume=e,this.generateAndNotify()}setTempo(e){this.tempo=e,this.generateAndNotify()}generateAndNotify(){this.handlers.onNotesChanged([...this.notes]);let e=this.generateMML();this.handlers.onMMLGenerated(e)}stepsToMMLDuration(e,t){let n=this.getConfig().stepsPerBar,r=[{dur:`1.`,s:n*1.5},{dur:`1`,s:n/1},{dur:`2.`,s:n/2*1.5},{dur:`2`,s:n/2},{dur:`4.`,s:n/4*1.5},{dur:`4`,s:n/4},{dur:`8.`,s:n/8*1.5},{dur:`8`,s:n/8},{dur:`12`,s:n/12},{dur:`16.`,s:n/16*1.5},{dur:`16`,s:n/16},{dur:`24`,s:n/24},{dur:`32`,s:n/32},{dur:`64`,s:n/64}],i=`64`,a=1/0;for(let n of r){if(n.s>t)continue;let r=Math.abs(e-n.s);r<a&&(a=r,i=n.dur)}return i}findBestFitDuration(e){let t=this.getConfig();for(let n of[1,2,4,8,12,16,24,32,48,64]){let r=t.stepsPerBar/n;if(e>=r)return{dur:n,steps:r}}return{dur:64,steps:t.stepsPerBar/64}}spell(e){let t=this.getConfig().edo??12,n=t===31?Sm:xm,r=Math.floor(e/372)-1,i=(e%372+372)%372;return{octave:r,name:n[Math.round(i/(372/t))%t]}}getNoteWithOctave(e,t){let{octave:n,name:r}=this.spell(e);return t===-1||Math.abs(n-t)>=2?{text:`o${n}${r}`,currentOctave:n}:n===t?{text:r,currentOctave:n}:n===t+1?{text:`>${r}`,currentOctave:n}:n===t-1?{text:`<${r}`,currentOctave:n}:{text:`o${n}${r}`,currentOctave:n}}generateMML=e=>{let t=this.getConfig(),n=e??this.volume,r=`t${this.tempo} v${n}`,i=[],a=-1,o=0;if(this.notes.length===0)return r;let s=Math.max(...this.notes.map(e=>e.startStep+e.durationSteps)),c=new Map;for(let e of this.notes){let t=c.get(e.startStep)??[];t.push(e),c.set(e.startStep,t)}let l=Array.from(c.keys()).sort((e,t)=>e-t),u=t.stepsPerBar/64,d=e=>{for(;e-o>=u;){let t=e-o,{dur:n,steps:r}=this.findBestFitDuration(t);i.push(`r${n}`),o+=r}};for(let e=0;e<l.length;e++){let t=l[e],n=c.get(t);if(!n)continue;d(t);let r=(l[e+1]??s)-o;if(r<u)continue;let f=n[0].durationSteps,p=this.stepsToMMLDuration(f,r),m=this.getStepFromDottedMML(p);if(n.length>1){let e=n.map(e=>{let{octave:t,name:n}=this.spell(e.pitchUnits);return`o${t}${n}`});i.push(`${ym}${e.join(``)}${bm}${p}`)}else{let{text:e,currentOctave:t}=this.getNoteWithOctave(n[0].pitchUnits,a);i.push(`${e}${p}`),a=t}o+=m}return d(s),`${r} ${i.join(` `)}`};getMMLFromNotes(e,t,n){let r=this.notes,i=this.tempo,a=this.volume;this.notes=[...e].sort((e,t)=>e.startStep-t.startStep),t!==void 0&&(this.tempo=t),n!==void 0&&(this.volume=n);let o=this.generateMML();return this.notes=r,this.tempo=i,this.volume=a,o}getStepFromDottedMML(e){let t=this.getConfig().stepsPerBar,n=e.endsWith(`.`),r=t/parseInt(n?e.slice(0,-1):e,10);return n?r*1.5:r}},wm=e=>{let t=[...e].sort((e,t)=>e.startStep-t.startStep||e.pitchUnits-t.pitchUnits),n=[],r=[];for(let e of t){let t=-1,i=1/0;for(let a=0;a<n.length;a++)r[a]<=e.startStep&&r[a]<i&&(i=r[a],t=a);t===-1?(n.push([e]),r.push(e.startStep+e.durationSteps)):(n[t].push(e),r[t]=e.startStep+e.durationSteps)}return n},Tm=(e,t=.6)=>{if(e.length<3)return!1;let n=new Map;for(let t of e)n.set(t.startStep,(n.get(t.startStep)??0)+1);return e.filter(e=>(n.get(e.startStep)??0)>=3).length/e.length>=t},Em=48,Dm=`ー`,Om=`〜`,km=`、`,Am=`↑`,jm=`↓`,Mm=(e,t,n)=>{let r=(t,n)=>Array.from(e.getElementsByTagName(t)).some(e=>!n||e.getAttribute(`type`)===n);return{breath:r(`breath-mark`),fadeIn:t,fadeOut:n,slideStop:r(`slide`,`stop`)||r(`glissando`,`stop`)}},Nm=(e,t)=>{let n=(t.breath?km:``)+(t.fadeIn?Am:``)+(t.fadeOut?jm:``);return(e||(t.slideStop?Om:n?Dm:``))+n},Pm=(e,t)=>{let n=e;for(let[e,r]of[[t.breath,km],[t.fadeIn,Am],[t.fadeOut,jm]])e&&!n.includes(r)&&(n+=r);return n},Fm=e=>{let t=e,n={breath:!1,fadeIn:!1,fadeOut:!1};for(;t.length>1;){let e=t[t.length-1];if(e===km)n.breath=!0;else if(e===Am)n.fadeIn=!0;else if(e===jm)n.fadeOut=!0;else break;t=t.slice(0,-1)}return{text:t,tie:t===Dm,portamento:t===Om,...n}},Im={C:0,D:2,E:4,F:5,G:7,A:9,B:11},Lm=(e,t)=>e?.getElementsByTagName(t)[0]?.textContent?.trim()??``,Rm=(e,t,n=0)=>{let r=Lm(e,t);if(!r)return n;let i=Number.parseFloat(r);return Number.isFinite(i)?i:n},zm=e=>{let t=e.getElementsByTagName(`pitch`)[0];if(!t)return null;let n=Im[Lm(t,`step`).toUpperCase()];if(n===void 0)return null;let r=Rm(t,`octave`,4),i=Math.round(Rm(t,`alter`,0));return(r+1)*12+n+i},Bm=e=>{let t=new DOMParser().parseFromString(e,`application/xml`);if(t.getElementsByTagName(`parserror`).length>0)throw Error(`MusicXML として読めません`);let n=new Map;for(let e of Array.from(t.getElementsByTagName(`score-part`))){let t=e.getAttribute(`id`);t&&n.set(t,Lm(e,`part-name`)||t)}let r=[],i=[],a=0;return Array.from(t.getElementsByTagName(`part`)).forEach((e,t)=>{let o=e.getAttribute(`id`)??``,s=1,c=0,l=0,u=0,d=0,f=new Map,p=0,m=0,h=!1,g=!1,_=!1;for(let n of Array.from(e.getElementsByTagName(`measure`))){l+=c,c=0;for(let e of Array.from(n.children)){let n=e.tagName.toLowerCase();if(n===`attributes`){let t=Rm(e,`divisions`,0);t>0&&(s=t);continue}if(n===`direction`){let t=e.getElementsByTagName(`sound`)[0],n=Number.parseFloat(t?.getAttribute(`tempo`)??``);!a&&Number.isFinite(n)&&n>0&&(a=n);for(let t of Array.from(e.getElementsByTagName(`wedge`))){let e=t.getAttribute(`type`);e===`crescendo`?g=!0:e===`diminuendo`&&(_=!0)}continue}if(n===`backup`||n===`forward`){let t=Rm(e,`duration`,0)/s*Em;c+=n===`backup`?-t:t;continue}if(n!==`note`)continue;let i=Math.round(Rm(e,`duration`,0)/s*Em),o=e.getElementsByTagName(`chord`).length>0,v=e.getElementsByTagName(`rest`).length>0,y=o?u:l+c;if(!v){let n=zm(e);if(n!==null){let a=e.getElementsByTagName(`lyric`)[0],o=a?Array.from(a.getElementsByTagName(`text`)).map(e=>e.textContent?.trim()??``).join(``):``;o&&(h=!0);let s=Mm(e,g,_);g=!1,_=!1;let c=Array.from(e.getElementsByTagName(`tie`)),l=c.some(e=>e.getAttribute(`type`)===`stop`),u=c.some(e=>e.getAttribute(`type`)===`start`),d=f.get(n);if(l&&d)d.durationSteps+=i,d.lyric=Pm(d.lyric,s),u||f.delete(n);else{let e={partIndex:t,startStep:Math.max(0,Math.round(y)),pitch:n,durationSteps:Math.max(1,i),lyric:Nm(o,s)};r.push(e),p++,m+=n,u&&f.set(n,e)}}}o?d=Math.max(d,i):(u=y,d=i,c+=i)}}i.push({index:t,name:n.get(o)||`Part ${t+1}`,noteCount:p,hasLyrics:h,avgPitch:p>0?m/p:0})}),{parts:i,placements:r,bpm:a>0?Math.round(a):120}},Vm=[[`C`,0],[`C`,1],[`D`,0],[`D`,1],[`E`,0],[`F`,0],[`F`,1],[`G`,0],[`G`,1],[`A`,0],[`A`,1],[`B`,0]],Hm=[[Em*4,`whole`],[Em*2,`half`],[Em,`quarter`],[Em/2,`eighth`],[Em/4,`16th`],[Em/8,`32nd`]],Um=e=>{for(let[t,n]of Hm)if(e>=t)return{type:n,dots:+(e>=t*1.5&&e<t*2)};return{type:`32nd`,dots:0}},Wm=e=>e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`),Gm=e=>{let{parts:t,bpm:n,stepsPerBar:r,title:i}=e,a=Math.max(1,Math.round(r/Em)),o=t.map((e,t)=>`    <score-part id="P${t+1}">
      <part-name>${Wm(e.name)}</part-name>
    </score-part>`).join(`
`),s=t.map((e,t)=>{let i=[...e.notes].sort((e,t)=>e.startStep-t.startStep),o=i.reduce((e,t)=>Math.max(e,t.startStep+t.durationSteps),0),s=Math.max(1,Math.ceil(o/r)),c=[`  <part id="P${t+1}">`],l=(e.lyrics??[]).map(Fm),u=[],d=e=>{let t=e;for(;l[t+1]?.tie||l[t+1]?.portamento;)t++;return t},f=0;for(let e=0;e<s;e++){let o=e*r,s=o+r;c.push(`    <measure number="${e+1}">`),e===0&&(c.push(`      <attributes>
        <divisions>${Em}</divisions>`,`        <key><fifths>0</fifths></key>`,`        <time><beats>${a}</beats><beat-type>4</beat-type></time>`,`        <clef><sign>G</sign><line>2</line></clef>
      </attributes>`),t===0&&c.push(`      <direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${Math.round(n)}</per-minute></metronome></direction-type><sound tempo="${Math.round(n)}"/></direction>`));let p=o,m=i.filter(e=>e.startStep>=o&&e.startStep<s),h=new Map;for(let e of m){let t=h.get(e.startStep);t?t.push(e):h.set(e.startStep,[e])}let g=[...h.keys()].sort((e,t)=>e-t);for(let e=0;e<g.length;e++){let t=g[e],n=h.get(t);if(t>p){let{type:e,dots:n}=Um(t-p);c.push(`      <note><rest/><duration>${t-p}</duration><type>${e}</type>${`<dot/>`.repeat(n)}</note>`),p=t}let r=e+1<g.length?g[e+1]:s,i=Math.min(s,r)-t,a=Math.max(1,Math.min(Math.max(...n.map(e=>e.durationSteps)),i)),o=l[f],m=l[f+1];o?.fadeIn&&(u.push({endLi:d(f),number:1}),c.push(`      <direction placement="below"><direction-type><wedge type="crescendo" number="1"/></direction-type></direction>`)),o?.fadeOut&&(u.push({endLi:d(f),number:2}),c.push(`      <direction placement="below"><direction-type><wedge type="diminuendo" number="2"/></direction-type></direction>`));let _=[];o?.portamento&&_.push(`<slide type="stop" number="1"/>`),m?.portamento&&_.push(`<slide type="start" number="1"/>`),o?.breath&&_.push(`<articulations><breath-mark/></articulations>`);let v=_.length?`<notations>${_.join(``)}</notations>`:``,y=o&&!o.tie&&!o.portamento&&o.text?`<lyric><syllabic>single</syllabic><text>${Wm(o.text)}</text>${m?.tie||m?.portamento?`<extend/>`:``}</lyric>`:``;n.forEach((e,t)=>{let n=Math.round(e.pitchUnits/31),[r,i]=Vm[(n%12+12)%12],o=Math.floor(n/12)-1,{type:s,dots:l}=Um(a);c.push(`      <note>${t>0?`<chord/>`:``}<pitch><step>${r}</step>${i?`<alter>${i}</alter>`:``}<octave>${o}</octave></pitch><duration>${a}</duration><type>${s}</type>${`<dot/>`.repeat(l)}`+(t===0?v+y:``)+`</note>`)});for(let e=u.length-1;e>=0;e--)u[e].endLi===f&&(c.push(`      <direction placement="below"><direction-type><wedge type="stop" number="${u[e].number}"/></direction-type></direction>`),u.splice(e,1));f++,p=t+a}if(p<s){let{type:e,dots:t}=Um(s-p);c.push(`      <note><rest/><duration>${s-p}</duration><type>${e}</type>${`<dot/>`.repeat(t)}</note>`)}c.push(`    </measure>`)}return c.push(`  </part>`),c.join(`
`)}).join(`
`);return[`<?xml version="1.0" encoding="UTF-8"?>`,`<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">`,`<score-partwise version="4.0">`,`  <work><work-title>${Wm(i??`Untitled`)}</work-title></work>`,`  <identification><encoding><software>dtm ${em}</software></encoding></identification>`,`  <part-list>`,o,`  </part-list>`,s,`</score-partwise>`,``].join(`
`)},Km=(e,t)=>e.filter(e=>e.partIndex===t).map(e=>({startStep:e.startStep,durationSteps:e.durationSteps,pitchUnits:e.pitch*31,velocity:100})),qm=60,Jm=20,Ym={12:[0,2,4,5,7,9,11],31:[0,5,10,13,18,23,28]},Xm=(e,t)=>{let n=Ym[t]??Ym[12],r=t;for(let i of n){let n=Math.abs(e-i);r=Math.min(r,n,t-n)}return r===0?0:r>=(t===31?2:1)?2:1},Zm=[`C`,`C#`,`D`,`D#`,`E`,`F`,`F#`,`G`,`G#`,`A`,`A#`,`B`],Qm=(e,t=800,n=450,r)=>{let i,a,o,s,c,l,u=r,d=()=>u,f=0,p=0,m=!1,h=e=>{m=e},g=()=>({x:f,y:p}),_=()=>o,v=()=>l,y=()=>i,b=()=>{u=r;let d=document.createElement(`canvas`);i=d,d.width=t-qm,d.height=Jm,d.style.position=`absolute`,d.style.left=`${qm}px`,d.style.top=`0px`;let f=d.getContext(`2d`);if(!f)throw Error(`Failed to get 2D rendering context for header.`);s=f;let p=document.createElement(`canvas`);a=p,p.width=qm,p.height=n-Jm,p.style.position=`absolute`,p.style.left=`0px`,p.style.top=`${Jm}px`;let m=p.getContext(`2d`);if(!m)throw Error(`Failed to get 2D rendering context for keyboard.`);c=m;let h=document.createElement(`canvas`);o=h,h.width=t-qm,h.height=n-Jm,h.style.position=`absolute`,h.style.left=`${qm}px`,h.style.top=`${Jm}px`,h.style.touchAction=`none`,h.style.userSelect=`none`;let g=h.getContext(`2d`,{willReadFrequently:!0});if(!g)throw Error(`Failed to get 2D rendering context for grid.`);l=g,e.innerHTML=``,e.style.position=`relative`,e.style.width=`${t+qm}px`,e.style.height=`${n}px`,e.append(d,p,h),x()},x=()=>{let e=a.parentElement;if(!e)return;let t=e.querySelector(`#header-corner`);t||(t=document.createElement(`div`),t.id=`header-corner`,t.style.position=`absolute`,t.style.left=`0px`,t.style.top=`0px`,t.style.width=`${qm}px`,t.style.height=`${Jm}px`,t.style.backgroundColor=`#0a0f1f`,t.style.borderRight=`2px solid #29adff`,t.style.borderBottom=`2px solid #29adff`,e.insertBefore(t,i))},S=()=>{c.clearRect(0,0,a.width,a.height);let{keyHeight:e,keyCount:t,pitchRangeStart:n,unitsPerRow:r=31,edo:i=12}=u,o=Math.floor(p/e)*e,s=p+a.height,l=`#ccc8b4`;for(let a=o;a<s;a+=e){let o=n+(t-1-a/e)*r,s=Math.round((o%372+372)%372/r%i),u=Xm(s,i),d=Math.floor(o/372)-1,f=d===4,m=a-p,h=Math.floor(qm*(u===1?.45:.62));u===0?(c.fillStyle=f?`#dedad0`:l,c.fillRect(0,m,qm,e),i===12&&(s===5||s===0)&&(c.strokeStyle=`#807a6a`,c.lineWidth=1,c.beginPath(),c.moveTo(0,m+e-.5),c.lineTo(qm,m+e-.5),c.stroke())):(c.fillStyle=f?`#d8d4be`:l,c.fillRect(0,m,qm,e),c.fillStyle=u===1?`#4a4a4a`:f?`#1a1408`:`#111111`,c.fillRect(0,m,h,e),c.strokeStyle=`#383838`,c.lineWidth=1,c.beginPath(),c.moveTo(h,m),c.lineTo(h,m+e),c.stroke()),s===0&&(c.fillStyle=`#555040`,c.font=`10px 'k8x12',monospace`,c.textAlign=`right`,c.textBaseline=`bottom`,c.fillText(`${Zm[0]}${d}`,qm-4,m+e-2))}c.beginPath(),c.strokeStyle=`#29adff`,c.lineWidth=2,c.moveTo(qm,0),c.lineTo(qm,a.height),c.stroke()},C=()=>{s.clearRect(0,0,i.width,i.height);let{stepWidth:e,stepsPerBar:t}=u;s.save(),s.translate(-f,0),s.fillStyle=m?`rgba(10,15,31,0.55)`:`#0a0f1f`,s.fillRect(f,0,i.width,Jm),s.strokeStyle=`#3d405b`,s.lineWidth=1,s.font=`11px 'k8x12',monospace`,s.fillStyle=`#83769c`;let n=Math.floor(f/(t*e)),r=Math.ceil((f+i.width)/(t*e));for(let i=n;i<=r+1;i++){let n=i*t*e;s.beginPath(),s.moveTo(n,0),s.lineTo(n,Jm),s.stroke(),i>=0&&(s.textAlign=`left`,s.textBaseline=`middle`,s.fillText(`${i+1}`,n+5,Jm/2))}s.restore()},w=(e=1)=>{S(),C(),l.clearRect(0,0,o.width,o.height);let{keyHeight:t,keyCount:n,stepWidth:r,stepsPerBar:i,pitchRangeStart:a,unitsPerRow:s=31,edo:c=12}=u,d=Math.floor(p/t)*t,h=p+o.height;for(let e=d;e<h;e+=t){let r=a+(n-1-e/t)*s,i=Math.round((r%372+372)%372/s%c),u=Xm(i,c),d=i===0,f=Math.floor(r/372)-1==4,h=e-p;l.fillStyle=m?u===2?`rgba(8,11,22,0.55)`:u===1?`rgba(12,16,30,0.5)`:`rgba(17,22,40,0.45)`:u===2?`#080b16`:u===1?`#0c101d`:`#111628`,l.fillRect(0,h,o.width,t),f&&(l.fillStyle=`rgba(41,173,255,0.05)`,l.fillRect(0,h,o.width,t)),l.beginPath(),l.strokeStyle=d?`#3d405b`:`#1a1d30`,l.lineWidth=1;let g=h+t;l.moveTo(0,g),l.lineTo(o.width,g),l.stroke()}let g=e||48,_=Math.floor(f/(r*g))*r*g,v=f+o.width,y=r*g;for(let e=_;e<=v;e+=y){let t=e/r,n=t%i===0,a=t%g===0,s=e-f;l.beginPath(),l.strokeStyle=n?`#3d405b`:a?`#242840`:`#1a1d30`,l.lineWidth=n?2:1,l.moveTo(s,0),l.lineTo(s,o.height),l.stroke()}},T=(e,t=[59,130,246,1],n=!0)=>{let{keyHeight:r,stepWidth:i,keyCount:a,pitchRangeStart:s,unitsPerRow:c=31}=u,d=o.width,m=o.height,[h,g,_,v]=t;for(let t of e){let e=t.startStep*i,o=(a-1-(t.pitchUnits-s)/c)*r,u=t.durationSteps*i,y=r,b=e-f,x=o-p;if(!(b+u<0||b>d)&&!(x+y<0||x>m)){if(n){let e=v*(t.velocity===void 0?1:.6+t.velocity/127*.4);l.fillStyle=`rgba(${h},${g},${_},${e})`,l.fillRect(b+1,x+1,u-2,y-2),u>=4&&y>=4&&(l.fillStyle=`rgba(255,255,255,0.4)`,l.fillRect(b+1,x+1,u-2,1),l.fillRect(b+1,x+1,1,y-2),l.fillStyle=`rgba(0,0,0,0.45)`,l.fillRect(b+1,x+y-2,u-2,1),l.fillRect(b+u-2,x+1,1,y-2))}else{let e=t.velocity===void 0?1:.7+t.velocity/127*.3,n=Math.min(.25,v*.22)*e,r=.299*h+.587*g+.114*_,i=Math.round(h*.6+r*.4),a=Math.round(g*.6+r*.4),o=Math.round(_*.6+r*.4);l.fillStyle=`rgba(${i},${a},${o},${n})`,l.fillRect(b+1,x+1,u-2,y-2)}}}},E=(e,t=[255,241,232])=>{if(e.length===0)return;let{keyHeight:n,stepWidth:r,keyCount:i,pitchRangeStart:a,unitsPerRow:s=31}=u,[c,d,m]=t;l.save();for(let{note:t,durationSteps:u}of e){if(u<=0)continue;let e=t.startStep*r-f,h=(i-1-(t.pitchUnits-a)/s)*n-p,g=u*r;if(e+g<0||e>o.width||h+n<0||h>o.height)continue;let _=Math.max(2,Math.floor(n*.35)),v=h+n-_-1;l.fillStyle=`rgba(${c},${d},${m},0.28)`,l.fillRect(e+1,v,g-2,_),l.strokeStyle=`rgba(${c},${d},${m},0.75)`,l.lineWidth=1,l.setLineDash([3,2]),l.strokeRect(e+1.5,v+.5,g-3,_-1),l.setLineDash([]),l.beginPath(),l.moveTo(e+g-1.5,h+1),l.lineTo(e+g-1.5,h+n-1),l.stroke()}l.restore()},D=(e,t)=>{let{keyHeight:n,keyCount:r,pitchRangeStart:i,unitsPerRow:a=31}=u,s=Math.round((e-i)/a);if(s<0||s>=r)return;let c=(r-1-s)*n-p;if(!(c+n<0||c>o.height)){if(l.save(),l.fillStyle=`rgba(255,236,39,0.10)`,l.fillRect(0,c,o.width,n),l.strokeStyle=`rgba(255,236,39,0.55)`,l.lineWidth=1,l.setLineDash([6,4]),l.beginPath(),l.moveTo(0,c+n/2+.5),l.lineTo(o.width,c+n/2+.5),l.stroke(),n>=7){let e=Math.min(11,Math.floor(n*.85));l.setLineDash([]),l.font=`${e}px 'k8x12',sans-serif`,l.textAlign=`left`,l.textBaseline=`middle`,l.lineWidth=3,l.lineJoin=`round`,l.strokeStyle=`rgba(0,0,0,0.85)`,l.strokeText(t,4,c+n/2),l.fillStyle=`#ffec27`,l.fillText(t,4,c+n/2)}l.restore()}},O=(e,t)=>{if(t.length===0)return;let{keyHeight:n,stepWidth:r,keyCount:i,pitchRangeStart:a,unitsPerRow:s=31}=u;if(n<7)return;let c=Math.min(12,Math.floor(n*.85)),d=[...e].sort((e,t)=>e.startStep-t.startStep),m=Math.min(d.length,t.length);l.save(),l.font=`${c}px 'k8x12',sans-serif`,l.textAlign=`left`,l.textBaseline=`middle`,l.lineWidth=3,l.lineJoin=`round`;for(let e=0;e<m;e++){let c=t[e];if(!c)continue;let u=d[e],m=u.startStep*r-f,h=(i-1-(u.pitchUnits-a)/s)*n-p,g=u.durationSteps*r;if(g<6||m+g<0||m>o.width||h+n<0||h>o.height)continue;let _=m+2,v=h+n/2;l.save(),l.beginPath(),l.rect(m+1,h+1,g-2,n-2),l.clip(),l.strokeStyle=`rgba(0,0,0,0.85)`,l.strokeText(c,_,v),l.fillStyle=`#fff1e8`,l.fillText(c,_,v),l.restore()}l.restore()},k=e=>{e&&(l.save(),l.strokeStyle=`#ffec27`,l.lineWidth=2,l.setLineDash([4,4]),l.strokeRect(e.x,e.y,e.width,e.height),l.fillStyle=`rgba(255,236,39,0.08)`,l.fillRect(e.x,e.y,e.width,e.height),l.restore())},A=(e,t,n=[59,130,246,1])=>{let{keyHeight:r,stepWidth:i,keyCount:a,pitchRangeStart:o,unitsPerRow:s=31}=u;for(let c of e){if(!t.has(c.id))continue;let e=c.startStep*i,u=(a-1-(c.pitchUnits-o)/s)*r,d=c.durationSteps*i,m=r,h=e-f,g=u-p,_=c.velocity===void 0?1:.5+c.velocity/127*.5,[v,y,b,x]=n,S=1.3,C=Math.min(255,v*S),w=Math.min(255,y*S),T=Math.min(255,b*S),E=x*_;l.fillStyle=`rgba(${C},${w},${T},${E})`,l.fillRect(h+1,g+1,d-2,m-2)}},j=e=>{let{clientX:t,clientY:n}=e,r=o.getBoundingClientRect(),i=r.width>0?o.width/r.width:1,a=r.height>0?o.height/r.height:1;return[Math.floor((t-r.left)*i),Math.floor((n-r.top)*a),e.buttons]};return b(),{getRenderConfig:d,setBackgroundActive:h,getDrawOffset:g,getGridCanvas:_,getGridContext:v,getHeaderCanvas:y,drawKeyboard:S,drawHeader:C,drawGrid:w,drawNotes:T,drawNoteLyrics:O,drawSpeechSpans:E,drawPitchGuide:D,drawSelectionRect:k,drawSelectedNotes:A,getXY:j,getGridPosition:e=>{let[t,n]=j(e),{keyCount:r,pitchRangeStart:i,keyHeight:a,stepWidth:o,unitsPerRow:s=31}=u,c=Math.floor((t+f)/o),l=n+p,d=Math.floor(l/a);return{step:c,pitch:$t(i+(r-1-d)*s),x:t,y:n}},onClick:e=>{o.addEventListener(`click`,t=>{let[n,r]=j(t),{keyCount:i,pitchRangeStart:a,keyHeight:o,stepWidth:s,unitsPerRow:c=31}=u,l=Math.floor((n+f)/s),d=r+p,m=Math.floor(d/o),h=$t(a+(i-1-m)*c);h>=a&&h<a+i*c&&requestAnimationFrame(()=>e(l,h))},{passive:!0}),o.addEventListener(`contextmenu`,e=>e.preventDefault())},setDrawOffset:(e,t)=>{f=e,p=t,S(),C()},destroy:()=>{e.innerHTML=``}}},$m=(e,t)=>{let n=e.querySelector(t);return!!n&&ch(n)},eh=`dtm-tour-seen`,th=(e=eh)=>{try{return localStorage.getItem(e)===`1`}catch{return!0}},nh=(e=eh)=>{try{localStorage.setItem(e,`1`)}catch{}},rh=(e=eh)=>{try{localStorage.removeItem(e)}catch{}},ih={next:`次へ ▶`,prev:`◀ 戻る`,skip:`スキップ`,done:`はじめる ▶`,progress:(e,t)=>`${e} / ${t}`},ah=320,oh=8,sh=6,ch=e=>{let t=e.getBoundingClientRect();return e.getClientRects().length>0&&t.width>0&&t.height>0},lh=e=>{let t=[],n=e.parentElement;for(;n;)n instanceof HTMLDetailsElement&&!n.open&&(n.open=!0,t.push(n)),n=n.parentElement;return t},uh=e=>{let t=e.steps??[],n=e.root??document,r=e.storageKey===void 0?eh:e.storageKey,i={...ih,...e.labels};if(t.length===0)return{next:()=>{},prev:()=>{},stop:()=>{},isActive:()=>!1};for(let e of document.querySelectorAll(`.dtm-tour`))e.remove();let a=document.createElement(`div`);a.className=`dtm-tour`,a.setAttribute(`role`,`dialog`),a.setAttribute(`aria-modal`,`true`),a.innerHTML=`
<div class="dtm-tour-spot" data-tour="spot"></div>
<div class="dtm-tour-bubble" data-tour="bubble">
  <div class="dtm-tour-head">
    <span class="dtm-tour-progress" data-tour="progress"></span>
    <button type="button" class="dtm-tour-close" data-tour="close" aria-label="閉じる">&times;</button>
  </div>
  <div class="dtm-tour-title" data-tour="title"></div>
  <div class="dtm-tour-body" data-tour="body"></div>
  <div class="dtm-tour-foot">
    <button type="button" class="dtm-tour-btn dtm-tour-btn--ghost" data-tour="skip"></button>
    <span class="dtm-tour-spacer"></span>
    <button type="button" class="dtm-tour-btn dtm-tour-btn--ghost" data-tour="prev"></button>
    <button type="button" class="dtm-tour-btn dtm-tour-btn--primary" data-tour="next"></button>
  </div>
</div>`;let o=e=>a.querySelector(`[data-tour="${e}"]`),s=o(`spot`),c=o(`bubble`),l=o(`progress`),u=o(`title`),d=o(`body`),f=o(`skip`),p=o(`prev`),m=o(`next`),h=o(`close`);f.textContent=i.skip,p.textContent=i.prev;let g=0,_=!0,v=null,y=new Set,b=e=>e.target?typeof e.target==`function`?e.target()??null:n.querySelector(e.target):null,x=()=>{if(!_)return;let e=window.innerWidth,n=window.innerHeight;if(!v){s.style.opacity=`0`,s.style.width=`0px`,s.style.height=`0px`,s.style.left=`${e/2}px`,s.style.top=`${n/2}px`;let t=Math.min(ah,e-oh*2);c.style.width=`${t}px`,c.style.left=`${Math.round((e-t)/2)}px`,c.style.top=`${Math.round(Math.max(oh,(n-c.offsetHeight)/2))}px`;return}let r=v.getBoundingClientRect(),i=Math.max(0,r.left-sh),a=Math.max(0,r.top-sh),o=Math.min(e,r.right+sh),l=Math.min(n,r.bottom+sh);s.style.opacity=`1`,s.style.left=`${Math.round(i)}px`,s.style.top=`${Math.round(a)}px`,s.style.width=`${Math.round(Math.max(0,o-i))}px`,s.style.height=`${Math.round(Math.max(0,l-a))}px`;let u=Math.min(ah,e-oh*2);c.style.width=`${u}px`;let d=c.offsetHeight,f=n-l-oh,p=a-oh,m=t[g]?.placement??`auto`,h;h=m===`top`?!1:m===`bottom`||f>=d||f>=p;let y;y=h&&f>=d?l+oh:!h&&p>=d?a-oh-d:f>=p?n-d-oh:oh,c.style.top=`${Math.round(Math.min(Math.max(oh,y),Math.max(oh,n-d-oh)))}px`;let b=r.left+r.width/2-u/2;c.style.left=`${Math.round(Math.min(Math.max(oh,b),Math.max(oh,e-u-oh)))}px`},S=()=>x(),C=t=>{if(_){_=!1,window.removeEventListener(`resize`,S),window.removeEventListener(`scroll`,S,!0),document.removeEventListener(`keydown`,D,!0);for(let e of y)e.open=!1;y.clear(),a.remove(),r&&nh(r),e.onEnd?.(t)}},w=e=>{for(;g>=0&&g<t.length;){let r=t[g],a=b(r);if(a)for(let e of lh(a))y.add(e);if(r.before?.(a)===!1){g+=e;continue}if(r.target&&!a&&(a=b(r)),r.target&&(!a||!ch(a))){g+=e;continue}v=a,u.textContent=r.title,d.innerHTML=r.body,p.style.visibility=g===0?`hidden`:``;let o=r.branches?.filter(e=>e.when?.(n)!==!1);if(o?.length){l.textContent=``,m.style.display=`none`;let e=document.createElement(`div`);e.className=`dtm-tour-branches`;for(let n of o){let r=document.createElement(`button`);r.type=`button`,r.className=`dtm-tour-branch`;let i=document.createElement(`span`);if(i.className=`dtm-tour-branch-label`,i.textContent=n.label,r.appendChild(i),n.hint){let e=document.createElement(`span`);e.className=`dtm-tour-branch-hint`,e.textContent=n.hint,r.appendChild(e)}r.addEventListener(`click`,()=>{t=[...t.slice(0,g+1),...n.steps],T()}),e.appendChild(r)}d.appendChild(e)}else l.textContent=i.progress(g+1,t.length),m.style.display=``,m.textContent=g===t.length-1?i.done:i.next;a&&a.scrollIntoView({block:`center`,inline:`nearest`}),requestAnimationFrame(()=>{x(),requestAnimationFrame(x)});return}e===1?C(!0):(g=0,w(1))},T=()=>{if(_){if(g>=t.length-1){C(!0);return}g+=1,w(1)}},E=()=>{_&&g!==0&&(--g,w(-1))};function D(e){_&&(e.key===`Escape`?(e.preventDefault(),C(!1)):e.key===`ArrowRight`?(e.preventDefault(),T()):e.key===`ArrowLeft`&&(e.preventDefault(),E()))}return m.addEventListener(`click`,T),p.addEventListener(`click`,E),f.addEventListener(`click`,()=>C(!1)),h.addEventListener(`click`,()=>C(!1)),window.addEventListener(`resize`,S),window.addEventListener(`scroll`,S,!0),document.addEventListener(`keydown`,D,!0),document.body.appendChild(a),w(1),m.focus({preventScroll:!0}),{next:T,prev:E,stop:()=>C(!1),isActive:()=>_}},dh={target:`[data-dtm="help"]`,title:`困ったらここ`,body:`<p>この <b>「?」ボタン</b> から、このツアーをいつでもやり直せます。
別の目的のツアーも選び直せます。</p>
<p>画面のあちこちにある <b>ⓘ</b> は、その項目だけの詳しい解説です。</p>
<p>それでは、良い音楽を！</p>`},fh={target:`[data-dtm="play"]`,title:`聴いてみる`,body:`<p>再生ボタンです。右の <b>BPM</b> で曲の速さを変えられます。</p>
<p><b>ソロ</b>にチェックを入れると、いま選んでいるトラックだけが鳴ります。
「このパートだけ確認したい」ときに使います。</p>`},ph={target:`[data-dtm-acc="io-out"] > summary`,title:`書き出す・共有する`,body:`<p>作った曲は <b>MIDI</b> や <b>MML</b>（テキストの楽譜）として書き出せます。</p>
<p>MMLは短いテキストなので、そのままコピーして人に渡せます。</p>`},mh=[{target:`[data-dtm="audio-panel"] > summary`,title:`① ここに音源を読み込む`,body:`<p><b>オーディオ同時再生</b>パネルです。原曲やカラオケ音源を、
打ち込みと<b>一緒に鳴らしながら</b>作業できます。</p>
<p>手持ちのファイルのほか、<b>mp3 / wav のURL</b> や <b>YouTubeのURL</b> もそのまま貼れます。</p>`},{target:`[data-dtm="audio-offset"]`,title:`② 頭を合わせる`,body:`<p>音源と打ち込みの<b>始まりのズレ</b>を指定します。</p>
<ul>
<li>前奏が長い音源なら「<b>音源</b>が先、<b>6.2秒</b>後に打ち込み開始」</li>
<li>曲の途中から重ねたいなら「<b>打ち込み</b>が先」に切り替え</li>
</ul>
<p>音符は動きません。ズレるのは再生の開始時刻だけなので、<b>いつでも直せます</b>。</p>`},{target:`[data-dtm="audio-start"]`,title:`③ 必要な部分だけ切り出す`,body:`<p>サビだけコピーしたいときは、音源の<b>使う範囲</b>を決めます。</p>
<p><code>0:12.500</code> のように分:秒.ミリ秒でも、<code>12.5</code> と秒だけでも書けます。
終了を空欄にすると最後まで鳴ります。</p>`},{target:`[data-dtm="audio-mute"]`,title:`④ 聴き比べる`,body:`<p><b>ミュート</b>を入れると音源が止まり、<b>打ち込みだけ</b>を聴けます。</p>
<p>「原曲と重ねて確認 → ミュートして自分の音だけ確認」を往復するのが、
耳コピが一番はかどる使い方です。音量スライダーでバランスも取れます。</p>`},{target:`[data-dtm="roll"]`,title:`⑤ 重ねて打ち込む`,body:`<p>あとは音源を鳴らしながら、この格子（<b>ピアノロール</b>）をタップして音符を置くだけ。</p>
<p><b>横</b>が時間、<b>縦</b>が音の高さ（上ほど高い）。もう一度押すと消え、
音符の端をドラッグすると長さが変わります。</p>`},fh,ph,dh],hh=[{target:`[data-dtm="macro-compose"]`,title:`① まず押してみる`,body:`<p><b>作曲</b>ボタンです。コード進行・メロディ・サブメロ・ベース・伴奏・ドラムまで、
<b>丸ごと自動で作ります</b>。</p>
<p>隣の <b>歌入り作曲</b> なら、メロディに歌詞を付けて<b>歌わせる</b>ところまでやります。</p>`},{target:`[data-dtm="compose-template"]`,title:`② 曲の構成を選ぶ`,body:`<p>イントロ〜サビの並びをプリセットから選べます。</p>
<ul>
<li>まずは <b>1コーラス</b>（短め）が分かりやすいです</li>
<li><b>JPOP王道</b> / <b>ボカロ王道</b> はフルサイズの構成になります</li>
</ul>
<p>下のチェックボックスで、作る部分を自分で選ぶこともできます。</p>`},{target:`[data-dtm="compose-key"]`,title:`③ 曲の雰囲気を指定する`,body:`<p>調（キー）を「<b>喜ばしい・陽気な曲</b>」「<b>物悲しい・哀愁の曲</b>」のような
<b>雰囲気</b>から選べます。</p>
<p>こだわりが無ければ <b>希望なし</b> のままでOK。押すたびに違う曲ができます。</p>`},fh,{target:`[data-dtm="auto-master"]`,title:`⑤ 仕上げも自動で`,body:`<p><b>おまかせマスタリング</b>を押すと、各トラックの楽器・音量バランス・
音圧・ステレオ幅・残響までまとめて自動で整えます。</p>
<p>「作曲 → 再生 → おまかせマスタリング」だけで、ひととおり形になります。</p>`},{target:`[data-dtm="roll"]`,title:`⑥ 気に入らないところは直せる`,body:`<p>自動で作った曲も、<b>ただの音符</b>としてここに置かれています。</p>
<p>タップすれば足せるし消せるので、<b>たたき台</b>として使って、
気になるところだけ手で直すのがおすすめです。</p>`},ph,dh],gh=[{target:`[data-dtm="roll"]`,title:`① ここに音符を置く`,body:`<p>この格子が<b>ピアノロール</b>です。</p>
<ul>
<li><b>横</b>が時間の流れ、<b>縦</b>が音の高さ（上ほど高い）</li>
<li>タップ／クリックで音符を置く、もう一度押すと消える</li>
<li>音符の端をドラッグすると長さを変えられる</li>
</ul>`},{target:`.dtm-tooldock`,title:`② 道具と音符の長さ`,body:`<p>左から<b>ペン</b>（置く）・<b>選択</b>（まとめて動かす）・<b>消しゴム</b>。</p>
<p>右端のメニューで<b>置く音符の長さ</b>（4分・8分・16分…）を選びます。
間違えても<b>元に戻す</b>で何度でもやり直せます。</p>`},{target:`[data-dtm="track-tabs"]`,title:`③ パートを切り替える`,body:`<p>メロディ・ベース・伴奏などの<b>トラック切り替えタブ</b>です。</p>
<p>選んだパートだけを編集でき、他のパートは背景にうっすら出ます。
重ね方を見ながら書けます。</p>`},fh,{target:`[data-dtm-acc="global"] > summary`,title:`⑤ 楽器・音量・響き`,body:`<p>ここを開くと<b>楽器の選択</b>、音量、リバーブ（残響）、ループ再生などを調整できます。</p>
<p>音のバランスに迷ったら <b>おまかせマスタリング</b> が自動で整えてくれます。</p>`},{target:`[data-dtm="macro-compose"]`,title:`⑥ 手が止まったら`,body:`<p>白紙がつらいときは <b>作曲</b> で丸ごと自動生成して、
たたき台から直していく手もあります。</p>
<p><b>MIDI / UST / MML 入力</b>パネルから、既存のMIDIファイルを読み込んで
続きを書くこともできます。</p>`},ph,dh],_h=[{title:`ようこそ！ 何をしてみたいですか？`,body:`<p>ブラウザだけで曲が作れる、ピアノロール式のDAWです。
目的に合わせて<b>30秒</b>で案内します。</p>`,branches:[{label:`🎧 カバー曲を作りたい`,hint:`原曲・カラオケ音源を鳴らしながら重ねる`,steps:mh,when:e=>$m(e,`[data-dtm="audio-panel"]`)},{label:`🎲 とりあえず曲を自動で作りたい`,hint:`ボタン1つでフル構成の曲を生成する`,steps:hh},{label:`🎹 自分で打ち込みたい`,hint:`ピアノロールの使い方をひととおり`,steps:gh}]}],vh={cover:{label:`カバー曲を作る`,steps:mh},compose:{label:`自動で曲を作る`,steps:hh},sequence:{label:`自分で打ち込む`,steps:gh}},yh=`dtm-track1:settings`,bh=()=>{try{if(typeof localStorage>`u`||!localStorage)return null;let e=localStorage.getItem(yh);if(!e)return null;let t=JSON.parse(e);return!t||typeof t!=`object`?null:t}catch{return null}},xh=e=>{try{if(typeof localStorage>`u`||!localStorage)return;localStorage.setItem(yh,JSON.stringify(e))}catch{}},Sh=[`a`,`i`,`u`,`e`,`o`,`ü`],Ch=[[``,`あ/い/う/え/お/ゆ`],[`b`,`ば/び/ぶ/べ/ぼ/*`],[`p`,`ぱ/ぴ/ぷ/ぺ/ぽ/*`],[`m`,`ま/み/む/め/も/*`],[`f`,`ふぁ/*/ふ/ふぇ/ふぉ/*`],[`d`,`だ/でぃ/どぅ/で/ど/*`],[`t`,`た/てぃ/とぅ/て/と/*`],[`n`,`な/に/ぬ/ね/の/にゅ`],[`l`,`ら/り/る/れ/ろ/りゅ`],[`g`,`が/*/ぐ/げ/ご/*`],[`k`,`か/*/く/け/こ/*`],[`h`,`は/*/ふ/へ/ほ/*`],[`j`,`*/じ/*/*/*/じゅ`],[`q`,`*/ち/*/*/*/ちゅ`],[`x`,`*/し/*/*/*/しゅ`],[`zh`,`じゃ/じ/じゅ/じぇ/じょ/*`],[`ch`,`ちゃ/ち/ちゅ/ちぇ/ちょ/*`],[`sh`,`しゃ/し/しゅ/しぇ/しょ/*`],[`r`,`ら/り/る/れ/ろ/*`],[`z`,`ざ/ず/ず/ぜ/ぞ/*`],[`c`,`つぁ/つ/つ/つぇ/つぉ/*`],[`s`,`さ/す/す/せ/そ/*`]],wh=(()=>{let e={};for(let[t,n]of Ch){let r=n.split(`/`),i={};Sh.forEach((e,t)=>{r[t]!==`*`&&(i[e]=r[t])}),e[t]=i}return e})(),Th={a:[``,`a`,``],o:[``,`o`,``],e:[``,`a`,``],er:[``,`a`,`r`],ai:[``,`a`,`i`],ei:[``,`e`,`i`],ao:[``,`a`,`o`],ou:[``,`o`,`o`],an:[``,`a`,`n`],en:[``,`e`,`n`],ang:[``,`a`,`n`],eng:[``,`e`,`n`],ong:[``,`o`,`n`],i:[``,`i`,``],ia:[`i`,`a`,``],ie:[`i`,`e`,``],iao:[`i`,`a`,`o`],iou:[`i`,`o`,`o`],ian:[`i`,`e`,`n`],in:[``,`i`,`n`],iang:[`i`,`a`,`n`],ing:[``,`i`,`n`],iong:[`i`,`o`,`n`],u:[``,`u`,``],ua:[`u`,`a`,``],uo:[`u`,`o`,``],uai:[`u`,`a`,`i`],uei:[`u`,`e`,`i`],uan:[`u`,`a`,`n`],uen:[`u`,`e`,`n`],uang:[`u`,`a`,`n`],ueng:[`u`,`e`,`n`],ü:[``,`ü`,``],üe:[`ü`,`e`,``],üan:[`ü`,`e`,`n`],ün:[``,`ü`,`n`]},Eh={iu:`iou`,ui:`uei`,un:`uen`},Dh={"":``,i:`い`,o:`お`,n:`ん`,r:`る`},Oh={a:`あ`,i:`い`,u:`う`,e:`え`,o:`お`,ü:`ゆ`},kh={a:`ゃ`,u:`ゅ`,e:`ぇ`,o:`ょ`},Ah={a:`や`,e:`いぇ`,u:`ゆ`,o:`よ`},jh=[`zh`,`ch`,`sh`,`b`,`p`,`m`,`f`,`d`,`t`,`n`,`l`,`g`,`k`,`h`,`j`,`q`,`x`,`r`,`z`,`c`,`s`],Mh=e=>{if(e.startsWith(`y`)){let t=e.slice(1);return t.startsWith(`u`)?[``,`\xFC${t.slice(1)}`]:[``,t.startsWith(`i`)?t:`i${t}`]}if(e.startsWith(`w`)){let t=e.slice(1);return[``,t.startsWith(`u`)?t:`u${t}`]}let t=jh.find(t=>e.startsWith(t))??``,n=e.slice(t.length);return[t,`jqx`.includes(t)&&t!==``&&n.startsWith(`u`)?`\xFC${n.slice(1)}`:n]},Nh=e=>{let t=e.trim().toLowerCase().replace(/[0-5]$/,``).replace(/u:/g,`ü`).replace(/v/g,`ü`);if(!/^[a-zü]+$/.test(t))return null;let[n,r]=Mh(t),i=Th[Eh[r]??r],a=wh[n];if(!i||!a)return null;let[o,s,c]=i,l=[];if(o===``){let e=a[s];if(!e)return null;l.push(e)}else if(o===`u`){let e=a.u;if(!e)return null;l.push(e,Oh[s])}else{let e=n===``&&o===`i`,t=e?Ah[s]:a[o];if(!t)return null;let r=kh[s];e?l.push(t):t.length===1&&r?l.push(t+r):l.push(t,Oh[s])}return c!==``&&l.push(Dh[c]),l},Ph=48,Fh=480,Ih=Ph/480,Lh=480/Ph,Rh=12,zh=[`+`,`+~`,`+-`,`+*`,`*`,`ー`,`-`],Bh=`ー`,Vh=`〜`,Hh=`_`,Uh=`、`,Wh=`↓`,Gh=`↑`,Kh=/[息吸]/,qh=/^@?br(?:eath)?\d*$/i,Jh=/^r(?:est)?$/i,Yh=/^R(?![aiueo])\S*$/,Xh=e=>Jh.test(e)||Yh.test(e),Zh=(()=>{let e={},t=[`a`,`i`,`u`,`e`,`o`];for(let[n,r]of[[``,`あいうえお`],[`k`,`かきくけこ`],[`s`,`さしすせそ`],[`t`,`たちつてと`],[`n`,`なにぬねの`],[`h`,`はひふへほ`],[`m`,`まみむめも`],[`y`,`や*ゆ*よ`],[`r`,`らりるれろ`],[`w`,`わ***を`],[`g`,`がぎぐげご`],[`z`,`ざじずぜぞ`],[`d`,`だぢづでど`],[`b`,`ばびぶべぼ`],[`p`,`ぱぴぷぺぽ`]])[...r].forEach((r,i)=>{r!==`*`&&(e[`${n}${t[i]}`]=r)});let n=[[`a`,`ゃ`],[`u`,`ゅ`],[`o`,`ょ`]];for(let[t,r]of[[`ky`,`き`],[`sy`,`し`],[`sh`,`し`],[`ty`,`ち`],[`ch`,`ち`],[`ny`,`に`],[`hy`,`ひ`],[`my`,`み`],[`ry`,`り`],[`gy`,`ぎ`],[`zy`,`じ`],[`jy`,`じ`],[`j`,`じ`],[`dy`,`ぢ`],[`by`,`び`],[`py`,`ぴ`]])for(let[i,a]of n)e[`${t}${i}`]=`${r}${a}`;return Object.assign(e,{shi:`し`,chi:`ち`,tsu:`つ`,fu:`ふ`,ji:`じ`,di:`ぢ`,du:`づ`,n:`ん`,nn:`ん`,cl:`っ`,q:`っ`}),e})(),Qh=/^[ぁ-ゖァ-ヶー〜]+/,$h=`ぁぃぅぇぉゃゅょ`,eg=e=>{let t=[];for(let n of e){let e=t.length-1;e>=0&&$h.includes(n)?t[e]+=n:t.push(n)}return t},tg=e=>e.replace(/[ァ-ヶ]/g,e=>String.fromCharCode(e.charCodeAt(0)-96)),ng=e=>e.split(/\s+/).pop()??``,rg=(e,t=!1)=>{let n=e.trim(),r={moras:[],rest:!1,breath:!1,unknown:!1};if(n===``)return{...r,rest:!0};if(zh.includes(n))return{...r,moras:[Bh]};if(Kh.test(n))return{...r,breath:!0};let i=ng(n);if(qh.test(i))return{...r,breath:!0};if(Xh(i))return{...r,rest:!0};let a=i.match(Qh)?.[0];if(a)return{...r,moras:eg(tg(a))};let o=i.match(/^[A-Za-z]+/)?.[0]??``;if(t){let e=Nh(i);if(e)return{...r,moras:e}}let s=Zh[o]??Zh[o.toLowerCase()];return s?{...r,moras:[s]}:{...r,moras:[Bh],unknown:!0}},ig=e=>{let t=0,n=0;for(let r of e){let e=r.trim();if(e===``||zh.includes(e)||Kh.test(e))continue;let i=ng(e);qh.test(i)||Xh(i)||!/^[A-Za-z]+[0-5]?$/.test(i)||(t++,!Zh[i.toLowerCase().replace(/[0-5]$/,``)]&&Nh(i)&&n++)}return n>=3&&n*2>=t},ag=e=>{let t=(()=>{try{return new TextDecoder(`utf-8`,{fatal:!0}).decode(e)}catch{return null}})();if(t!==null)return t.replace(/^﻿/,``);for(let t of[`shift_jis`,`windows-31j`,`cp932`])try{return new TextDecoder(t).decode(e)}catch{}return new TextDecoder(`utf-8`).decode(e)},og=e=>{let t=null,n=[],r=null;for(let i of e.split(/\r\n|\r|\n/)){let e=i.trim();if(e===``)continue;if(e.startsWith(`[`)){r&&n.push(r),r=/^\[#\d+\]$/.test(e)?{}:null;continue}let a=e.indexOf(`=`);if(a<0)continue;let o=e.slice(0,a).trim().toLowerCase(),s=e.slice(a+1);if(o===`tempo`&&t===null){let e=Number.parseFloat(s.replace(`,`,`.`));Number.isFinite(e)&&e>0&&(t=e)}r&&(o===`length`?r.length=s:o===`lyric`?r.lyric=s:o===`notenum`?r.noteNum=s:o===`intensity`?r.intensity=s:o===`pbs`?r.pbs=s:o===`pbw`?r.pbw=s:o===`pby`&&(r.pby=s))}return r&&n.push(r),{bpm:t,sections:n}},sg=(e,t,n)=>{let r=Math.max(1,t-e),i=Math.max(1,Math.min(n,r)),a=i>1?Math.max(1,Math.min(Rh,Math.floor(r/(i*2)))):0,o=[],s=e;for(let e=0;e<i;e++){let t=e===0?r-a*(i-1):a;o.push({startStep:s,durationSteps:t}),s+=t}return o},cg=e=>(e??``).split(`,`).map(e=>Number.parseFloat(e)).map(e=>Number.isFinite(e)?e:0),lg=e=>{if(e.pbw===void 0&&e.pbs===void 0)return[];let[t,n]=(e.pbs??`0`).split(/[;,]/),r=Number.parseFloat(t);Number.isFinite(r)||(r=0);let i=Number.parseFloat(n??``),a=[{ms:r,cents:(Number.isFinite(i)?i:0)*10}],o=cg(e.pbw),s=cg(e.pby);return o.forEach((e,t)=>{r+=e,a.push({ms:r,cents:(s[t]??0)*10})}),a},ug=(e,t)=>{if(t<=e[0].ms)return e[0].cents;for(let n=1;n<e.length;n++){let r=e[n-1],i=e[n];if(t>i.ms)continue;let a=i.ms-r.ms;return a<=0?i.cents:r.cents+(i.cents-r.cents)*(t-r.ms)/a}return e[e.length-1].cents},dg=100,fg=60,pg=8,mg=8,hg=[6,8,12,16,18,24,36,48,72,96,144,192],gg=e=>hg.find(t=>t>=e)??hg[hg.length-1],_g=e=>Math.abs(e)<dg?0:Math.round(e/100),vg=(e,t,n,r)=>{if(e.length<2)return[];let i=n-t,a=gg(Math.round(fg/r));if(i<a*2)return[];let o=e.find(e=>_g(e.cents)===0)?.ms;if(o===void 0)return[];let s=Math.max(a,Math.ceil(i/pg)),c=Math.max(a,Math.ceil(o/r)),l=[],u=0,d=0;for(let n=c;n<=i-a;n+=s){let o=_g(ug(e,n*r));if(o===d)continue;let s=u+gg(n-u);if(s>i-a||(l.push({startStep:t+s,durationSteps:0,semitones:o}),u=s,d=o,l.length>=mg))break}return l.forEach((e,t)=>{e.durationSteps=(l[t+1]?.startStep??n)-e.startStep}),l},yg=(e,t=``)=>{let{bpm:n,sections:r}=og(typeof e==`string`?e:ag(e)),i=ig(r.map(e=>e.lyric??``)),a=0,o=[],s=[],c=0,l=!1,u=6e4/(n??120)/Ph;for(let e of r){let t=Number.parseFloat(e.length??``);if(!Number.isFinite(t)||t<=0)continue;let n=a;a+=t;let r=Number.parseInt(e.noteNum??``,10);if(!Number.isFinite(r))continue;let{moras:d,rest:f,breath:p,unknown:m}=rg(e.lyric??``,i);if(p){let e=s.length-1;e>=0&&s[e]!==Hh&&!s[e].endsWith(Uh)&&(s[e]+=Uh),l=!1;continue}if(f)continue;m&&c++;let h=Number.parseFloat(e.intensity??``),g=Number.isFinite(h)?Math.max(1,Math.min(127,Math.round(h/100*100))):100,_=sg(Math.round(n*Ih),Math.round(a*Ih),d.length);_.forEach((e,t)=>{o.push({...e,pitch:r,velocity:g});let n=d[t]===Bh&&!l?Hh:d[t];n!==Hh&&(l=!0),s.push(n)});let v=_[_.length-1];if(!l||!v)continue;let y=vg(lg(e),v.startStep,v.startStep+v.durationSteps,u);if(y.length!==0){v.durationSteps=y[0].startStep-v.startStep,o[o.length-1].durationSteps=v.durationSteps;for(let e of y)o.push({startStep:e.startStep,durationSteps:e.durationSteps,pitch:r+e.semitones,velocity:g}),s.push(Vh)}}return{name:t,bpm:n,notes:o,lyrics:s.join(``),unknownLyricCount:c,pinyin:i}},bg=`あ`,xg=(e,t)=>[`[#${String(e).padStart(4,`0`)}]`,`Length=${t.lengthTicks}`,`Lyric=${t.lyric}`,`NoteNum=${t.midi}`,`PreUtterance=`,...t.intensity===void 0?[]:[`Intensity=${t.intensity}`],...t.envelope===void 0?[]:[`Envelope=${t.envelope}`]],Sg=e=>{let t=e??``,n=!1,r=!1,i=!1;for(;t.length>1;){let e=t[t.length-1];if(e===Uh)n=!0;else if(e===Gh)r=!0;else if(e===Wh)i=!0;else break;t=t.slice(0,-1)}return{kana:t,breath:n,fadeIn:r,fadeOut:i}},Cg=e=>e===``?`あ`:e===Bh||e===`〜`?`+`:e===Hh||e.startsWith(`「`)?`R`:e,wg=5,Tg=35,Eg=.02,Dg=(e,t,n,r)=>{if(n&&r)return[{at:.5,level:1},{at:1,level:Eg}];let i=0,a=e.map(e=>(i+=e.lengthTicks,i/t)),o=[];e.forEach((e,t)=>{(n?e.fadeIn:e.fadeOut)&&o.push(t)});let s=o.length,c=0;return o.map((e,t)=>{let r=t+1,i=r===s?1:Math.min(1,Math.max(c,a[e]));return c=i,{at:i,level:Math.max(Eg,n?r/s:(s-r)/s)}})},Og=(e,t,n)=>{let r=0,i=t;for(let t of n){if(e<=t.at){let n=t.at-r;if(n<=0)return t.level;let a=Math.min(1,Math.max(0,(e-r)/n));return i*(t.level/i)**a}r=t.at,i=t.level}return i},kg=(e,t)=>{let n=e=>Math.max(0,Math.min(200,Math.round(e*100)));return[0,wg,Tg,0,n(e),n(t),0].join(`,`)},Ag=e=>{for(let t=0;t<e.length;t++){if(e[t].lyric===`R`)continue;let n=t;for(;n+1<e.length&&e[n+1].tie&&!e[n].breathAfter;)n++;let r=e.slice(t,n+1);t=n;let i=r.some(e=>e.fadeIn),a=r.some(e=>e.fadeOut);if(!i&&!a)continue;let o=r.reduce((e,t)=>e+t.lengthTicks,0);if(o<=0)continue;let s=Dg(r,o,i,a),c=i?Eg:1,l=0;for(let e of r){let t=l/o;l+=e.lengthTicks;let n=l/o;e.envelope=kg(Og(t,c,s),Og(n,c,s))}}},jg=e=>{let{notes:t,syllables:n=[],bpm:r,projectName:i=`dtm`}=e,a=t.map((e,t)=>({note:e,syllable:n[t]})).sort((e,t)=>e.note.startStep-t.note.startStep),o=[`[#VERSION]`,`UST Version1.2`,`[#SETTING]`,`Tempo=${r.toFixed(2)}`,`Tracks=1`,`ProjectName=${i}`,`VoiceDir=%VOICE%uta`,`OutFile=${i}.wav`,`CacheDir=${i}.cache`,`Tool1=wavtool.exe`,`Tool2=resampler.exe`,`Mode2=True`,`Charset=UTF-8`],s=[],c=0;for(let{note:e,syllable:t}of a){let n=Math.round(e.startStep*Lh),r=Math.round((e.startStep+e.durationSteps)*Lh);if(n<c)continue;n>c&&s.push({lengthTicks:n-c,lyric:`R`,midi:60,tie:!1,breathAfter:!1,fadeIn:!1,fadeOut:!1});let i=Math.max(1,r-n),{midi:a}=mn(e.pitchUnits),o=e.velocity??100,l=Sg(t);s.push({lengthTicks:i,lyric:Cg(l.kana),midi:a,intensity:Math.max(0,Math.min(200,Math.round(o/100*100))),tie:l.kana===Bh||l.kana===`〜`,breathAfter:l.breath,fadeIn:l.fadeIn,fadeOut:l.fadeOut}),c=n+i}Ag(s);for(let[e,t]of s.entries())o.push(...xg(e,t));return o.push(`[#TRACKEND]`),`${o.join(`\r
`)}\r
`},Mg=`
<div class="dtm-modal-body-content">
  <h4>1. 基本の書き方</h4>
  <p>コード名（和音記号）を縦線 <code>|</code>、スペース、またはカンマで区切って入力します。縦線で区切ると1小節ごとの配置になります。</p>
  <pre>例: C | G | Am | F</pre>
  <p style="margin-top:4px;"><small>コード進行を自分で考えるのが難しいときは、コード進行の共有サイト（例: <a href="https://rechord.cc/scores" target="_blank" rel="noopener">rechord.cc</a>）から好きな進行を探してコピペするのも手です。区切り文字（<code>|</code> / スペース / カンマ）だけ上の形式に合わせれば、そのまま使えます。</small></p>

  <h4>2. 1小節に複数コードを入れる</h4>
  <p>小節の区切り（縦線 <code>|</code>）の中に、スペース区切りでコードを並べます。等間隔に配置されます。</p>
  <pre>例: C G | Am F</pre>
  <p style="margin-top:4px;"><small>（1小節目：前半C・後半G、2小節目：前半Am・後半F）</small></p>

  <h4>3. 対応コード名</h4>
  <ul>
    <li>メジャー / マイナー: <code>C</code>, <code>Dm</code>, <code>Am</code> など</li>
    <li>セブンス: <code>C7</code>, <code>Am7</code>, <code>FM7</code> など</li>
    <li>その他: <code>Csus4</code>, <code>Cdim</code>, <code>Caug</code>, <code>Cadd9</code> など</li>
  </ul>

  <h4>4. 演奏パターン</h4>
  <ul>
    <li><strong>ブロック</strong>: 和音の構成音をすべて同時に伸ばして演奏します。</li>
    <li><strong>アルペジオ</strong>: 和音の構成音を低い順に分散して演奏します。</li>
    <li><strong>アルペジオ（ジャラーン）</strong>: 素早くアルペジオを鳴らします。</li>
    <li><strong>裏打ち</strong>: 各拍の裏（8分裏）のタイミングでコードを刻みます。</li>
    <li><strong>ヤツメ穴</strong>: リズミカルなピコピコゲーム風の伴奏パターンです。</li>
    <li><strong>交互奏</strong>: ルート音（低音）とコード構成音（高音）を交互に刻みます。</li>
  </ul>
</div>
`,Ng=`
<div class="dtm-modal-body-content">
  <h4>基本</h4>
  <p>ひらがな・カタカナで書きます。<strong>1文字（拗音は2文字）が音符1つ</strong>に対応し、音符の並び順（左から）に割り当てられます。音符より歌詞が多いぶんは歌いません。</p>
  <pre>ど れ み ふぁ そ   ← 5音節
c  d  e  f   g    ← 音符5つ</pre>
  <p><small>右上の「◯音節」は、この歌詞が消費する音符の数です。音符の数と合っているか確認できます。</small></p>

  <h4>特殊な文字</h4>
  <ul>
    <li><code>ー</code> <strong>伸ばす</strong>（長音記号）… 直前の音を言い直さずに保ち、音程だけを次の音へ<strong>素早く</strong>移します。音符を1つ消費します。</li>
    <li><code>〜</code> <strong>しゃくり</strong>（波ダッシュ）… <code>ー</code> と同じですが、<strong>時間を掛けて</strong>滑らせます（ポルタメント／スラー）。</li>
    <li><code>っ</code> <strong>詰まる</strong>（小さい「つ」）… 音符を1つ消費して無音にします（促音）。</li>
    <li><code>_</code> <strong>歌わない</strong>（アンダースコア）… 音符を1つ消費しますが何も鳴りません（歌だけ休む）。</li>
    <li><code>、</code> <strong>ブレス</strong>（読点）… <strong>音符は消費せず</strong>、直前の音を少し短くして息継ぎを入れます。音源が息継ぎの素片（<code>息</code> <code>息短</code> <code>b1</code> など）を持っていればその声で、無ければ吸う息の形をしたノイズで鳴ります。</li>
    <li><code>↓</code> <strong>だんだん小さく</strong>（下向き矢印）… <strong>音符は消費せず</strong>、その音を歌ったまま声量を落とします。複数書くと減り方を刻めます。</li>
    <li><code>↑</code> <strong>だんだん大きく</strong>（上向き矢印）… <code>↓</code> の対。小さく入って声量を上げていきます。</li>
    <li><code>「…」</code> <strong>語り</strong>（かぎ括弧）… 囲んだ部分を歌わずに<strong>読み上げ</strong>ます。括弧ひとかたまりで音符を1つ消費し、その音符の位置から話し始めます。</li>
    <li><code>ガ</code> <strong>鼻濁音</strong>（カタカナのガ行、または <code>が゜</code>）… 音源が鼻濁音の素片を持っていればそれで歌います（重音テト・欲音ルコ♀）。無ければふつうのガ行です。</li>
    <li><code>ヴァ</code> <strong>ヴ</strong>… 音源にヴの素片があればそれで、無ければバ行で歌います。</li>
    <li>旋律の<strong>休符のあと</strong>は語頭として歌い直し、フレーズの終わり（休符・ブレス・行末の前）は音源に語尾の素片（<code>a R</code>）があればそれで抜きます。</li>
  </ul>
  <p><small>全角チルダ <code>～</code> は <code>〜</code>、半角カンマ <code>,</code> は <code>、</code>、<code>⇩</code> <code>⬇</code> は <code>↓</code>、<code>⇧</code> <code>⬆</code> は <code>↑</code> として扱われます。これら以外の記号（英数字・スペース・句読点など）は無視されます（<code>「…」</code> の中だけは例外で、そのまま読み上げに渡されます）。</small></p>

  <h4>歌の中で語る（<code>「…」</code>）</h4>
  <p>歌詞の途中に <code>「…」</code> を書くと、その部分だけを<strong>話し声で読み上げ</strong>ます（UTAU音源のみ。klatt では鳴りません）。中身は漢字・数字・句読点を含んでかまいません——読みとアクセントは辞書が決めます。<code>？</code> で終わると語尾が上がります。</p>
  <pre>ふつうにうたう「かたるばしょ」ふつうにうたう
どんぐりころころ「みなさん、こんにちは！」どんぐりこ
「セリフだけのトラックも作れます。」</pre>
  <ul>
    <li><strong>音符の位置</strong>が話し始めです。<strong>長さは読み上げが決める</strong>ので、音符の長さは使いません。ピアノロールには実際に喋る長さが破線の帯で出るので、次の歌い出しと重ならないか確かめられます。</li>
    <li><strong>音符の高さ</strong>は話す声の高さです。黄色い「語りの基準」の行に置くと音源の素の声、上に置くほど高い声になります（目安は±7半音まで）。</li>
    <li>空の <code>「」</code> は <code>_</code> と同じ（音符を1つ消費して無音）。閉じ括弧が無ければ行末までが語りになります。</li>
    <li>中身に <code>;</code> と改行は書けません（MMLの区切り文字のため）。</li>
    <li>初めて語りを鳴らすときは辞書と音声モデル（約45MB）を取得するので、再生開始まで少し待ちます。2回目以降は保存済みのものを使います。</li>
  </ul>

  <h4>強弱をつける（<code>↓</code> <code>↑</code>）</h4>
  <p>伸ばした音に付けると、<strong>言い直さずに伸ばしたまま</strong>声量だけが動きます。曲の終わりの余韻や、サビへの盛り上げに使います。</p>
  <pre>あーーーーー↓   ← 伸ばしながら消えていく（デクレッシェンド）
あーーーーー↑   ← 小さく入ってふくらんでいく（クレッシェンド）
あーーーーー↑↓  ← ふくらんでから消える（スウェル）
あ↓            ← その1音だけがすっと消える</pre>
  <p><code>ー</code> で繋がった一続きの音に付けると、<strong>付けた位置に関係なくその一続き全体</strong>が対象になります（<code>あー↓ーー</code> も <code>あーーー↓</code> も同じ）。<code>↑</code> と <code>↓</code> を両方書くとスウェルになり、書く順番（<code>↑↓</code> / <code>↓↑</code>）は問いません。どちらも音符を消費しないので、音節数はズレません。</p>

  <h4>減り方を刻む（<code>↓</code> を複数）</h4>
  <p>一続きの音に <code>↓</code> を<strong>複数</strong>書くと、書いた位置が「ここでこの声量」という<strong>中継点</strong>になります。k個書けば k等分——<strong>付けた文字の終わりで</strong>順に落ちていきます。</p>
  <pre>ぎ↓ー↓        ← 「ぎ」の終わりで50%、音の終わりで0%
ぎ↓ー↓ー↓      ← 66% → 33% → 0% の3段階
ぎーーー↓ー↓    ← 前半は50%までゆっくり、最後の1音で一気に0%</pre>
  <p>最後の <code>↓</code> は書いた位置に関わらず<strong>音の終わり</strong>で0%になります（消えたあとに無音がぶら下がらないように）。<code>↑</code> も同じで、<code>ぎ↑ー↑</code> なら「ぎ」の終わりで50%、音の終わりで最大です。<code>↑</code> と <code>↓</code> を混ぜたときはスウェル優先で、中継点は付きません。</p>

  <h4><code>ー</code> と <code>〜</code> の違いは「滑る速さ」</h4>
  <p>どちらも音程は<strong>連続して</strong>移ります。伸ばしている途中で音程だけが瞬間移動すると、声は繋がっているのに「言い直した」ように聞こえてしまうためです。掛ける時間は音符の長さに比例します（長い音符では上限で頭打ち）。</p>
  <ul>
    <li><code>ー</code> … 音価の35%（最大0.12秒）で移る。切り替わったと分かる速さ。</li>
    <li><code>〜</code> … 音価の80%（最大0.4秒）を掛けて滑る。しゃくり・スラーの聞こえ方。</li>
  </ul>

  <h4>「あああああ」と「あーーーー」の違い</h4>
  <p>いちばん使う書き分けです。同じ音を音程違いで続けるとき、<strong>1音ずつ区切って言い直すか、伸ばしたまま音程だけ動かすか</strong>を選べます。</p>
  <pre>あああああ   ← 「あ・あ・あ・あ・あ」と5回言い直す
あーーーー   ← 「あ〜」と伸ばしたまま音程だけ動く</pre>

  <h4>伸ばすと何の音になるか</h4>
  <ul>
    <li>直前の音節の母音を引き継ぎます。<code>きょー</code> は「きょ」＋「お」。</li>
    <li><code>んー</code> は「ん」を伸ばしたハミングになります。</li>
    <li><code>_</code> や <code>、</code> の直後は引き継ぐ母音が無いので、<code>ー</code> を書いても無視されます。</li>
  </ul>

  <h4>きれいに伸ばすコツ</h4>
  <p>伸ばす区間の音符が<strong>隙間なく並んでいる</strong>と、1つの長い音としてまとめて合成されるため、継ぎ目のない自然なロングトーンになります。音符の間が空いているときや、伸ばしが長すぎるとき（約4秒超）は自動で分割されます（その場合も言い直しには聞こえないよう繋ぎます）。</p>
</div>
`,Pg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>ONにすると、一定の長さ（約0.35秒）以上の音符（ロングトーン）にだけ、自動でピッチが小刻みに揺れる歌唱表現（ビブラート）が掛かります。</p>
  <h4>短い音符に掛からない理由</h4>
  <p>1周期も揺れきらないうちに次の音へ移ってしまい、ビブラートというより単なる音程のブレとして不自然に聞こえるためです。</p>
  <h4>他の設定との兼ね合い</h4>
  <p>ピッチを揺らす効果なので、声質そのものを変えるジェンダー/ブレシネスとは独立して組み合わせられます。速さ・深さは調整できません（歌として破綻しにくい控えめな量に固定）。曲や箇所ごとに掛けたい/掛けたくないがある場合は、トラックを分けて歌詞を書いてください。</p>
</div>
`,Fg={none:``,down:`w1`,up:`w2`,both:`w3`},Ig=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>このトラックの各音節に、もう1声を1オクターブ上/下/両方（控えめな音量）で同時に重ねて発音します。声に厚み・パワーを足す「オクターブユニゾン（ダブリング）」という定番のボーカル加工です。</p>
  <h4>下・上・両方の違い</h4>
  <p>「下」は声に重み・パワーを足す定番の使い方（ロック/EDMのバッキング等）。「上」は太さではなく煌びやかさ・可憐さを足す使い方（アニソン/ハモリ等）。「両方」は上下同時に重ねる特殊な効果で、キャラクター性を強く出したいときに。</p>
  <h4>使いどころ</h4>
  <p>サビの決めのフレーズ、ロボット的/ダークな質感の演出、ユニゾンハーモニーなどでよく使われます。曲全体に掛けっぱなしにすると常にくどい印象になりやすいので、トラックを分けて使いたい箇所だけに絞るのがおすすめです。</p>
  <h4>他の設定との兼ね合い</h4>
  <p>重ねる声にも同じビブラート/ジェンダー/ブレシネス/リバーブ送り/ディレイ送りの設定がそのまま適用されます。音量比・音程差（1オクターブ固定）は調整できません。「両方」は合成が3倍走るため、音数の多いトラックではやや重くなります。</p>
</div>
`,Lg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>ピッチ（音の高さ）はそのままに、声の太さ/細さ（フォルマント＝声道の共鳴、年齢・性別感の印象）だけを動かします。50が無変化、50未満で低め/太め（大人びる）、50超で高め/細め（若く/明るく）に寄ります。</p>
  <h4>オクターブシフトとの違い</h4>
  <p>オクターブは音程そのものを上下させますが、ジェンダーは音程を変えずに声色だけを動かします。「高い声のまま大人びさせる」「低い声のまま若々しくする」といった、音程と声質を別々に調整したいときに使います。</p>
  <h4>他の設定との兼ね合い</h4>
  <p>ブレシネスと組み合わせて声のキャラクターを作ります（例: 低め+息多めで渋い/大人っぽい印象、高め+息少なめで元気/若々しい印象）。koe音源（UTAU由来の.koe音源）限定の効果で、klatt（内蔵の簡易合成）では変化しません。</p>
</div>
`,Rg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>息成分の量です。50が無変化、大きいほど息っぽく（ささやき寄り）、小さいほど芯のある声になります。</p>
  <h4>上げすぎるとどうなるか</h4>
  <p>ロングトーンで音程感が薄れて聞こえます（息の音がピッチ感を隠すため）。囁くようなバラード表現には効果的ですが、上げすぎるとメロディが伝わりにくくなります。</p>
  <h4>他の設定との兼ね合い</h4>
  <p>自動ビブラートと組み合わせると、揺れながら息っぽい、よりエモーショナルな表現になりやすいです。koe音源（UTAU由来の.koe音源）限定の効果で、klatt（内蔵の簡易合成）では変化しません。</p>
</div>
`,zg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>声の張り／押し出しの強さです。50が無変化、大きいほど張った・押した声（「こぶし」寄り、力強く歌わせる）になり、小さいほど脱力したリラックスした声になります。</p>
  <h4>ブレシネスとの違い</h4>
  <p>ブレシネスは息成分の量（芯のある声⇔息っぽい声）を動かしますが、テンションは声帯の締まり・押しの強さ（脱力⇔張った声）を動かします。テンションを上げるとサビの力強さ、下げると穏やかな囁きに寄せた歌わせ方になります。</p>
  <h4>他の設定との兼ね合い</h4>
  <p>ブレシネスを下げつつテンションを上げると、より芯があり力強い歌声になります。逆にブレシネスを上げつつテンションを下げると、より脱力した息っぽい歌声になります。koe音源（UTAU由来の.koe音源）限定の効果で、klatt（内蔵の簡易合成）では変化しません。</p>
</div>
`,Bg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>このボーカルトラックから、曲全体に掛かる「マスタリバーブ」へどれだけ音を送るかを決めます（0で送らない＝ドライ、100で目一杯送る）。</p>
  <h4>マスタの「リバーブ」つまみとの関係（重要）</h4>
  <p>トラック設定パネルにあるマスタの「リバーブ」つまみが0%だと、ここをいくら上げても無音のままです。「送り量（このトラックがどれだけ提供するか）」と「マスタの残響設定（実際にどんな響きが掛かるか）」の二段構えになっているためです。両方を確認してください。</p>
  <h4>掛けすぎるとどうなるか</h4>
  <p>残響で音が滲み、歌詞が聞き取りにくくなります。ドライなボーカルは「近い」「前に出る」印象、リバーブたっぷりのボーカルは「奥行きがある」「幻想的」な印象になります。表現したい距離感に合わせて調整してください。</p>
</div>
`,Vg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>このボーカルトラックから、曲全体に掛かる「マスタディレイ」へどれだけ音を送るかを決めます（0で送らない、100で目一杯送る）。</p>
  <h4>マスタの「ディレイ」つまみとの関係（重要）</h4>
  <p>マスタの「ディレイ」つまみが0%だと、ここをいくら上げても無音のままです。リバーブ送りと同じ二段構えです。</p>
  <h4>使いどころ</h4>
  <p>曲全体にうっすら掛けるリバーブと違い、ディレイはハッキリ聞こえる繰り返しなので、Aメロは0%・サビの語尾だけ送り量を上げる、といったメリハリのある使い方が効果的です。バッキング全体に強く掛けるとリズムが濁ります。</p>
</div>
`,Hg=`
<div class="dtm-modal-body-content">
  <h4>リバーブ（Mix）</h4>
  <p>曲全体に一律で掛かる残響（部屋鳴り・空間の響き）の量です。0%で完全にドライ（響きなし）、上げるほど広い空間で鳴っているような奥行きが出ます。掛けすぎるとミックス全体の輪郭がぼやけ、遠く・こもった印象になります。10〜30%程度が出発点の目安です。</p>
  <h4>Decay（残響の長さ）</h4>
  <p>リバーブが鳴り続ける長さです。長いほど広いホールのような空間の印象になり、短いと狭い部屋のような密着感になります。目安として、速い曲では0.6〜1.4秒、遅い曲・バラードでは1.8〜4.0秒程度がよく使われます。</p>
  <h4>Pre Delay（原音とリバーブの間隔）</h4>
  <p>原音が鳴ってから残響が立ち上がるまでの遅延です。0msだと原音と残響が同時に始まり音像がぼやけがちですが、少し（数十ms程度）入れると原音の輪郭・アタック感を保ったまま奥行きを足せます。特にボーカルで効果的です。</p>
  <h4>各トラックの「リバーブ送り」との関係（重要）</h4>
  <p>歌詞トラックにはそれぞれ「リバーブ送り」という個別のつまみがあり、そちらが0%のトラックはこのマスタの値をいくら上げても無音のままです。逆にこのマスタのMixが0%なら、どのトラックの送り量を上げても効果が出ません。「マスタ＝残響の質・量・タイミングそのもの」「トラック送り＝そのトラックをどれだけ混ぜるか」という二段構えです。楽器トラックには現状センド機能が無いため、常に一律で掛かります。</p>
</div>
`,Ug=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>離散したエコー（音の繰り返し）を付加します。曲のBPMに自動同期する音価（8分・付点8分など）を選んで使うのが基本で、無関係な秒数で鳴らすとリズムが崩れて聞こえます。</p>
  <h4>リバーブとの違い</h4>
  <p>リバーブは拡散した残響で空間全体に薄く掛けるのが基本ですが、ディレイはハッキリ聞こえる繰り返しなので「ここぞ」という場面（リードボーカルの語尾、ギターソロ、シンセのフレーズ等）にワンポイントで使うのが定番です。バッキング全体に強く掛けるとリズムが濁ります。</p>
  <h4>各トラックの「ディレイ送り」との関係</h4>
  <p>リバーブと同じ二段構えです。歌詞トラック個別の「ディレイ送り」が0%ならこのマスタの値を上げても無音、逆にこのマスタが0%ならどのトラックの送り量を上げても効果が出ません。</p>
</div>
`,Wg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>曲の頭で音量0%から徐々に上げる「フェードイン」、曲の終わりで音量を0%まで徐々に下げる「フェードアウト」を設定します。0秒でフェードなしです。</p>
  <h4>いつ効くか</h4>
  <p>フェードインは曲の先頭（0小節目）から再生したときだけ掛かります。途中の小節から再生・シークした場合は掛かりません。フェードアウトは、今ノートが置かれている範囲の終端に向けて自動的に掛かります（ノートを足せば終端も伸びます）。</p>
  <h4>使いどころ</h4>
  <p>編集中はほとんど意識しませんが、書き出して人に聴かせる・配信する段になると、曲の出入りが唐突だと素人っぽく聞こえがちです。数秒のフェードを入れるだけで仕上がりの印象が変わります。</p>
</div>
`,Gg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>全トラックのノートを選んだ半音数だけ一括で移調します。歌詞トラックの歌声もノートのピッチに追従するため、ボーカルも一緒に移調されます。</p>
  <h4>使いどころ</h4>
  <p>「歌ってみたら音域が高すぎた/低すぎた」というときの調整定番です。ボーカルの声域に合わせて曲全体のキーを上げ下げできます。</p>
  <h4>注意</h4>
  <p>ノートデータを直接書き換える操作です（元に戻すには「元に戻す」ボタンを使ってください）。MIDIノート範囲（0-127）を超える音は範囲内にクランプされます。</p>
</div>
`,Kg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>このトラックの周波数帯域ごとの音量を調整します。低域・中域・高域の3バンド、それぞれ-12dB（削る）〜+12dB（持ち上げる）、0dBが無変化です。</p>
  <h4>使いどころ（帯域の棲み分け）</h4>
  <p>複数の音が同じ帯域で鳴っていると濁って聞こえます。例えば、ボーカルとリード楽器が中域でぶつかるなら片方の中域を軽く削る、ベースとバスドラムの低域がぶつかるなら片方だけ低域を削る、といった「帯域の交通整理」がEQの主な仕事です。</p>
  <h4>他の設定との兼ね合い（順序が重要）</h4>
  <p>このチャンネルストリップでは EQ → 音圧強化（コンプレッサー） → ステレオ幅 の順で処理されます。これは一般的なミックスの定石と同じです。不要な帯域（低域のこもり、耳障りな高域等）を先にEQで削ってからコンプレッサーを掛けると、コンプが本当に必要な音だけに反応するようになり、音圧強化の効きが良くなります。順序を変えることはできません。</p>
</div>
`,qg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>このトラックにコンプレッサーを掛け、音量の大小差を縮めて「前に出る」「聞こえやすい」音にします。市販曲のマスタリングやミックスで定番の処理です。0で無圧縮、100に近づくほど強く圧縮されます。</p>
  <h4>掛けすぎるとどうなるか</h4>
  <p>強弱の表情（ダイナミクス）が失われて単調に聞こえます。ボーカルやリード楽器は控えめ（20〜40程度）、ドラムやベースはやや強め、が一般的な目安です。</p>
  <h4>他の設定との兼ね合い</h4>
  <p>マスタの「安全リミッター」（常時ON、[reverb]パネルの外側で自動的に働く保険）とは別物です。あちらは音割れを物理的に防ぐための最終防衛ラインで、常に控えめに動いています。こちらのコンプレッサーは音作り（表現）のための処理で、トラックごとに好きなだけ強く/弱く掛けられます。「おまかせマスタリング」は全トラック一律35%を当てるだけなので、ボーカルなど目立たせたいパートは後で個別に下げると輪郭が出やすくなります。</p>
</div>
`,Jg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>左右の広がりを調整します。100が原音のまま、0で完全モノラル（左右が同じ音）、100を超えると左右の違いが誇張されて広く聞こえます。</p>
  <h4>「定位（パン）」との違い</h4>
  <p>定位は「音をどこに置くか」（左寄り/中央/右寄り）、ステレオ幅は「その音自体がどれだけ広がって聞こえるか」で、役割が異なります。両方を強く使うと定位がぼやけて曖昧になりがちです。</p>
  <h4>広げすぎるとどうなるか</h4>
  <p>スマホのスピーカー1個など、モノラルに近い環境で再生すると音が薄く/位相が乱れて聞こえることがあります（左右の差分を誇張しているため、足し合わせると打ち消し合う成分が増える）。主旋律やボーカルは中央付近で狭め、パッドやシンセの装飾パートは広げる、というのがミックスの定石です。</p>
</div>
`,Yg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>このトラックを左右のどこに置くかを決めます。64が中央、0で左いっぱい、127で右いっぱいです。歌詞トラックの場合、ここは楽器としてのトラック全体の定位で、歌唱そのものの定位（下の「定位」欄・vocalPan）とは別に働き、両方が重なって最終的な位置になります。</p>
  <h4>「ステレオ幅」との違い</h4>
  <p>定位は「音をどこに置くか」（左寄り/中央/右寄り）、ステレオ幅は「その音自体がどれだけ広がって聞こえるか」で、役割が異なります。両方を強く使うと定位がぼやけて曖昧になりがちです。</p>
  <h4>ミックスの定石</h4>
  <p>主旋律・ボーカル・ベースなど曲の軸になるパートは中央付近に置き、ハモリ・カウンターメロディ・伴奏（コード/パッド）など彩りのパートを左右へ振り分けると、各パートの居場所が分かれて聞き取りやすくなります（特に低域は中央に集めるのが定石です — 左右に振ると位相干渉でモノラル再生時に低音が痩せることがあります）。</p>
</div>
`,Xg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>このトラックの音を、マスタリバーブ（[reverb]パネルのDecay/Pre Delay/Mix）へどれだけ送るかを 0-100% で決めます。0なら送らない＝このトラックにはリバーブが掛かりません。</p>
  <h4>「声だけリバーブ」を作るには</h4>
  <p>リバーブは全トラックへ一律で掛かるわけではなく、この送り量で個別に決まります。ボーカルのトラックだけ送り量を上げ、他の楽器トラックは0のままにすれば、声だけにリバーブを掛けられます。低域の楽器（ベース・キック等）は送らない、ボーカルやパッドは多めに送る、というのがミックスの定石です。</p>
  <h4>[reverb]パネルのMixとの関係</h4>
  <p>Mixは「送られてきた音をどれだけ返すか」という全体の返り量です。各トラックの送り量が0なら、Mixを上げても何も返ってきません。まずこのトラックの送り量を決めてから、Mixで全体の掛かり具合を微調整してください。</p>
</div>
`,Zg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>このトラックの音を、マスタディレイ（[delay]パネル）へどれだけ送るかを 0-100% で決めます。0なら送らない＝このトラックにはディレイが掛かりません。</p>
  <h4>「低域には掛けない」が定石</h4>
  <p>ディレイ（やまびこのような繰り返し）を低域に掛けると、繰り返しが重なってリズムが濁りやすいため、ベースなど低音パートは送らない（0のまま）のが定石です。リード楽器・ボーカルの語尾など、聞かせたいワンポイントだけに送るのが効果的です。</p>
  <h4>[delay]パネルのMixとの関係</h4>
  <p>[delay]パネルの掛かり具合が0%だと、ここをいくら上げても無音のままです。「送り量（このトラックがどれだけ提供するか）」と「マスタのディレイ設定（実際にどんな繰り返しが掛かるか）」の二段構えになっているためです。両方を確認してください。</p>
</div>
`,Qg=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>ループ再生を有効にします。ONにすると、再生が曲末で停止せず、先頭からシームレスに繰り返されます。</p>
  <h4>MML出力への反映</h4>
  <p>ループ再生がONの場合、MML生成時に <code>#loop=on</code> メタ行が出力されます。埋め込みプレイヤーや再生専用プレイヤー（mountPlayer / mountChordPlayer）でもこのMMLを読み込むことで自動的にループ再生されます。</p>
  <h4>BGMやゲーム音楽向け</h4>
  <p>WebサイトのBGMやゲームのステージ曲など、途切れずにループさせたい曲の制作に最適です。</p>
</div>
`,$g=`
<div class="dtm-modal-body-content">
  <h4>何をする設定か</h4>
  <p>全トラックが合流した後（マスタリバーブ・マスタディレイの戻りも含む）にまとめて軽く掛ける、マスタバスの「グルー（接着剤）コンプレッサー」です。0%で無効、上げるほど各トラックの音量差が均され、バラバラに鳴っていたパートがひとまとまりの「バンド感」「一体感」を持って聞こえるようになります。</p>
  <h4>常時ONの「安全リミッター」との違い</h4>
  <p>音割れ検知バッジと連動する安全リミッターは、常にONで音割れを防ぐための保険です。こちらのグルーコンプは既定0（オフ）で、音を良くするための表現目的の処理です。掛かる順序はグルーコンプ→安全リミッターで、グルーコンプ通過後の信号を安全リミッター・音割れ検知メーターが監視します。</p>
  <h4>トラック単位の「音圧強化」との違い</h4>
  <p>各トラックの「音圧強化」（チャンネルストリップのコンプレッサー）は、そのトラック単体の粒立ちを揃えるためのものです。グルーコンプはそれとは別に、全トラックが混ざった後の「合奏」全体に対して掛かります。両方を強く掛けすぎるとダイナミクス（強弱の表情）が失われて単調になりやすいため、グルーコンプは控えめ（20〜40%程度）が出発点の目安です。</p>
</div>
`,e_=`
<div class="dtm-modal-body-content">
  <h4>作曲とは</h4>
  <p>コード進行・メロディ・サブメロ・ベース・伴奏・ドラムをまとめて自動で作るボタンです。押すたびに違う曲ができます。できあがった曲はそのまま編集できるので、気に入らないところだけ後から直すこともできますし、もう一度押して作り直すこともできます。</p>
  <h4>作る部分を選べます</h4>
  <p>ボタンの下のチェックで、<strong>イントロ・Aメロ・Bメロ・サビ・間奏・アウトロ</strong>のどれを作るかを選べます。選んだぶんだけ曲が長くなり、右に何小節になるかが出ます（既定はイントロ＋Aメロ＋Bメロ＋サビの24小節）。「サビだけ作り直したい」「間奏を足したい」といった使い方ができます。</p>
  <p>セクションごとに作り分けている中身は次のとおりです。</p>
  <table class="dtm-info-table">
    <tr><th>　</th><th>メロディ</th><th>音域</th><th>ドラム</th><th>終わり方</th></tr>
    <tr><td>イントロ</td><td>無し</td><td>—</td><td>抑えめ</td><td>—</td></tr>
    <tr><td>Aメロ</td><td>有り</td><td>低め</td><td>抑えめ</td><td>5度で止める（まだ続く）</td></tr>
    <tr><td>Bメロ</td><td>有り</td><td>中</td><td>標準</td><td>ドミナントで宙吊り</td></tr>
    <tr><td>サビ</td><td>有り</td><td>高い</td><td>最大</td><td>主音へ着地</td></tr>
    <tr><td>間奏</td><td>無し</td><td>—</td><td>標準</td><td>—</td></tr>
    <tr><td>アウトロ</td><td>有り</td><td>低め</td><td>薄い</td><td>主音へ着地</td></tr>
  </table>
  <p>イントロと間奏はメロディを書きません（伴奏・ベース・ドラム・サブメロだけが鳴ります）。ここに歌メロを置くと、どのセクションも同じ顔になって「ずっと歌っている曲」になってしまうためです。セクションの頭ではドラムがクラッシュを叩き、終わりの1つ手前でフィルが入ります。</p>
  <p>ノートの配置に加えて、テンポ・ドラム・楽器・<strong>おまかせマスタリング</strong>（各トラックの音量バランス・定位・EQ・コンプレッサー・リバーブ・マスタ設定）も自動で一括設定されます。できた後に微調整したいときは、各トラックの設定や「全体トラック設定」から自由に変更できます。</p>
  <h4>曲の組み立て方</h4>
  <p>単純にランダムな音を並べているわけではありません。次の順番で組み立てています。</p>
  <ol>
    <li><strong>コード進行を決める</strong> — 王道進行・小室進行・カノン進行などから引き、7thやセカンダリドミナントを混ぜます。Aメロ系とサビ系で別の進行を割り当て、イントロと間奏はサビの進行を使います（曲の顔を先に見せる定石）。</li>
    <li><strong>先に各小節のリズムを決める</strong> — 音より先にリズムを設計し、隣り合う小節で必ず形を変えます。全音符・2分・4分・8分・16分を混ぜ、休符も少し入れます。</li>
    <li><strong>その上に音を乗せる</strong> — <strong>2小節のモチーフ</strong>（ボーカルが一息で歌いきる長さ）を1つ作り、「そのまま繰り返す」「音程を上げて発展させる」「1オクターブ上げてサビの頂点にする」の3通りに変形して曲全体へ展開します。</li>
    <li><strong>フレーズとして組み立てる</strong> — 2小節のモチーフ（<strong>問い</strong>）に、同じリズムで着地音だけを変えた2小節（<strong>答え</strong>）を続けて4小節のまとまりにし、それをセクションの中に1〜2個ずつ置きます。答えは、途中では主音を避けて「まだ続く」感じを残し（半終止）、最後だけ主音へ落として終わります（全終止）。8小節ごとの切れ目は白玉で受けて息継ぎを空けます。</li>
  </ol>
  <p>音を先に決めてから音価を機械的に均等割りすると、どうしても「同じ長さの音が延々と続く、機械的な曲」になります。リズムを先に設計するのはそれを避けるためです。</p>
  <h4>メロディの作り方の決まりごと</h4>
  <ul>
    <li><strong>順次進行を土台にしつつ、跳躍を1〜3割混ぜます</strong>。隣り合う音へ順に動くだけのメロディは歌いやすい代わりに印象に残りません。跳んだ直後は必ず反対方向へ順に戻して（gap fill）、歌える形に着地させます。</li>
    <li><strong>ペンタトニック（ド・レ・ミ・ソ・ラ）を土台にします</strong>。ファとシはクセが強いので、その和音の構成音であるか、前後のどちらかを順次進行で通り抜けるときだけ使います。</li>
    <li><strong>跳躍は和音の構成音の間だけ</strong>（ドソ、ドミ）。無作為に跳ぶと調子外れに聞こえます。オクターブの跳ね上げ・落としは、大きな上下のうねりを作る主役として積極的に使います。</li>
    <li><strong>いちばん大きく跳ぶのはサビの頭</strong>。ここだけ1オクターブ跳ね上げて聞かせどころを作ります。</li>
    <li><strong>小節の頭と3拍目では、和音の重要な構成音に着地させます</strong>。和音の上を意味もなく上下しているだけ、という印象を避けるためです。</li>
    <li><strong>和音を濁す音（アボイドノート）は強拍や長い音では鳴らしません</strong>。同じ「ファ」でも、Cの上では濁り、Fの上では和音の芯になります。その瞬間の和音ごとに音の重要度を測り直しています。</li>
    <li><strong>緩急をつけます</strong>。16分音符が続く「急」な小節と、ロングトーンや休符の「緩」な小節を意図的に対比させます。</li>
    <li><strong>フレーズは小節線をまたぎます</strong>。リズムを1小節ずつ区切って並べると、息継ぎが必ず小節の頭でリセットされて機械的に聞こえます。フレーズの歌い出しを小節線の手前から始めたり（弱起）、前の小節の音を次の小節へ伸ばしたり（タイ）して、2〜4小節ひとまとまりの息にします。</li>
    <li><strong>16分の格子から出ます</strong>。曲によって三連符を使ったり、拍のウラを後ろへずらして跳ねさせたり（スウィング）します。格子の上に全部の音が乗っている限り、グルーヴは原理的に作れません。跳ねる曲にはシャッフルのドラムが当たります。</li>
  </ul>
  <h4>押すたびに違う曲にするために</h4>
  <p>品質の基準を満たしていても、毎回同じ設計図で作っていれば「音名だけが違う似た曲」しかできません。そこで曲ごとに次を引き直しています。</p>
  <ul>
    <li><strong>フレーズの骨格</strong>（どの楽句をモチーフの原形・セクエンツ・答えにするか）</li>
    <li><strong>メロディの書法</strong>——走句の形（音階／折り返し／分散和音／ジグザグ）、つなぎの形（山なり／谷／上行／下行／うねり／軸音まわり）、終止の形（順次下降／ソミド／跳ね上がり／ロングトーン）、モチーフの原型、跳躍の混ぜ具合、開始音、基準の刻み（8分／16分／三連）、スウィング量</li>
    <li><strong>ベースの奏法</strong>（4分打ち／オルタネイト／2分／8分ドライブ／シンコペ／ウォーキング／オクターブ）</li>
    <li><strong>サブメロの書き方</strong>——合いの手（メロディが休んだ隙間にだけ入る）、ハモリ（メロディのリズムをなぞって3度・6度下を歌う）、対旋律（8分でメロディと反行する）、保続音（同じ音を伸ばし続ける）、パッド。小節ごとに、メロディが息継ぎしている場所では自動で合いの手に切り替わります。</li>
    <li><strong>編曲プラン</strong>（上級者モードのみ）——伴奏を何層にするか、それぞれどの奏法でどのセクションを鳴らすか、サビの重ねを出すか・ユニゾンかオクターブ上か、装飾をどこに置くか。400曲引くと392通りの型が出ます。</li>
  </ul>
  <p>さらに、直前に作った5曲と特徴が似ている候補には減点しています。続けて押したときに似た曲が並ばないようにするためです。</p>
  <h4>できあがりの選び方</h4>
  <p>1回押すごとに<strong>40曲ぶんの候補を作って、その中でいちばん点数の高いものを画面に出しています</strong>。点数は次の観点で付けています。</p>
  <ul>
    <li><strong>曲の形</strong>——4小節・8小節で同じ形が戻ってくるか、隣り合う小節はちゃんと違う形か、フレーズの切れ目で息継ぎがあるか、いちばん高い音（聞かせどころ）が曲の後半に1回だけ来ているか。</li>
    <li><strong>緊張と解放</strong>——サビで和音の色が濃くなり、終わりでちゃんと解決しているか。</li>
    <li><strong>メロディとサブメロの掛け合い</strong>——サブメロがメロディの息継ぎで喋っているか。</li>
    <li><strong>音の分布</strong>——音価のばらつき・休符の割合・跳躍の大きさと比率・使っている音域。</li>
  </ul>
  <p>各項目の合格ラインは勘で決めたものではなく、<strong>人間が書いたMIDIを実際に測って、その分布の真ん中あたりを満点にしています</strong>。たとえば主旋律の休符は、人が書いた曲では全体の15〜43%を占めていました。</p>
  <h4>歌入り作曲のボーカル</h4>
  <p>主旋律に歌詞を付けて歌わせます。歌詞に意味はありません（メロディに正しく乗る、発音できる音の並びだけを作っています）。<strong>上級者モード（15トラック）では、さらにボーカルアレンジまで展開します。</strong>どこで何をするかは曲ごとに自動で決まるので、設定項目はありません。</p>
  <ul>
    <li><strong>ハモリ</strong> — サビから、曲によってはBメロから入ります。<strong>主旋律と同じ声・同じ歌詞で違う高さを重ねる</strong>ので、そのパートから声が厚くなって豪華に聞こえます。3度か6度が基本で、浮いて聞こえる完全5度は避けます。主旋律がテンション音（9th・11th など）に乗っているところだけ4度で当てます——そこでは3度も6度も和音の構成音へ届かないためです。落ちサビは声だけを聞かせる場所なので外します。</li>
    <li><strong>掛け合い（デュエット）</strong> — 4割ほどの曲が2人歌いになります。セクションごと／Aメロで2小節ごと／掛け合いサビ／Aメロだけ、の4通り。<strong>受け渡しは小節線ぴったりではなく、次の人が手前から食い気味に入ります。</strong>一緒に歌うサビでは相方がハモリへ回ります（同じ音をなぞるユニゾンにはしません）。</li>
  </ul>
  <p>シンプルモード（4トラック）は独唱です。4本が埋まっていてハモリの置き場所が無いためです。</p>
  <h4>セクションで楽器・伴奏が変わる（上級者モードのみ）</h4>
  <p>1本のトラックは、曲の最初から最後まで1つの楽器で鳴ります。つまり<strong>「サビだけ別の楽器にする」は、1本のトラックの中では作れません</strong>。作れるのは、鳴らしたい区間を別のトラックへ書き分けたときだけです。上級者モード（15トラック）が15本あるのはそのためで、「作曲」は場所ごとにトラックを分けます。</p>
  <ul>
    <li><strong>伴奏の手触りがセクションで変わる</strong> — 同じコード進行を、ブロック・アルペジオ・裏拍・八分食い・分散の中から<strong>別々の奏法</strong>で1〜3層に重ねます。どの奏法をどのセクションで鳴らすかは曲ごとに引くので、Aメロとサビで伴奏の刻み方そのものが変わります。曲全体を通る「地」の層が1つあり、残りは足す場所を絞ります。</li>
    <li><strong>サビの重ね</strong> — 主旋律をもう1本の別楽器（プリセットによってブラス・ストリングス・グロッケンなど）で重ねます。<strong>オクターブ上とユニゾンの両方を引きます</strong>——同じ高さを別の楽器で重ねると2つの音色が溶けて別の音色になるので、オクターブ上げるより情報量が多いことがあります。重ねない曲もあります。</li>
    <li><strong>間奏のソロ</strong> — 間奏は歌が休む場所であって、音楽が休む場所ではありません。歌メロの代わりに器楽のソロを書き、専用のトラックで鳴らします。プリセットによって歪みギター・サックス・尺八などに変わります。素材はサビと同じなので、間奏がサビの主題を弾く形になります。</li>
    <li><strong>ウワモノ</strong> — きらびやかな装飾を、盛り上がるセクションにだけオクターブ上で足します。<strong>地の伴奏と同じ奏法は使いません</strong>——同じものをオクターブ上げただけの層は装飾ではなく写しだからです。ブロックも外します（和音を丸ごとオクターブ上で鳴らすのは装飾ではなく壁になります）。</li>
  </ul>
  <p><strong>楽器の音域に合わせてオクターブを下げます。</strong>1トラック1楽器で、しかも層ごとにオクターブを変えるので、決めたオクターブがその楽器の出せない高さになることがあります。実測すると、サビの重ねを1オクターブ上げる指定はミュートトランペットやトランペットで14半音ぶん、コードパッド（実音77〜93）はナイロンギターで10半音・カリンバで9半音ぶん音域を突き抜けていました。サンプルが引き伸ばされて<strong>金切り音</strong>になり、聴き手には「耳が痛い」としか感じられません。そこで、鳴らす音域がその楽器の実用上限に収まるところまで<strong>オクターブを下げてから</strong>置きます（トラックのオクターブ設定は、まさにこういう「得意な音域が偏った音源」を使えるようにするために在るものです）。<strong>下げる方向にしか動かしません</strong>——上げる側が痛みを作る側なので。</p>
  <p>実物の音域に収まっていても痛くなる音色があります。グロッケンは実物の音域がG5〜C8なので、旋律の音域（〜C6）は「余裕で範囲内」ですが、金属体の倍音は人の耳がいちばん敏感な2〜4kHzに集まるため、その高さで鳴らし続けると刺さります。こういう音色には音域とは別に<strong>明るさの上限</strong>を持たせてあり、グロッケンならC5より上で鳴らないところまで下げます。<strong>候補から外すのではなく置き場所を変えます</strong>——外すと音色の幅がそのぶん減るだけで、低く鳴らしたグロッケンはポップスで普通に使われる柔らかい音です。</p>
  <p><strong>オクターブの重ねを主役にしていません。</strong>「既にあるトラックを1オクターブ動かして別トラックへ写す」層は、音楽的な価値が高くありません。人の耳はオクターブ違いを<strong>同じ音</strong>として聞くので（オクターブ等価）、写した層は新しい声部にならず、音量と音色がわずかに変わるだけです。強調としての意味はあるので使いはしますが、常設にはしません。ベースのオクターブ下の重ねは特に、30Hz前後まで落ちて輪郭が濁るので既定では出しません（出すときも上のオクターブへ、盛り上がる場所だけに置きます）。</p>
  <p>「作曲」が決めたこれらの楽器は、おまかせマスタリングの役割推定より優先されます（演奏内容だけを見ると、間奏のソロもサビの重ねも「音の少ない単旋律」で、主旋律と区別が付かないためです）。楽器を手で選び直したトラックは、以後どちらにも上書きされません。</p>
  <h4>そのほか</h4>
  <ul>
    <li><strong>曲の途中で転調します</strong>（およそ半分の曲）。五度圏で近い属調・下属調へは共通する和音（ピボットコード）か新しい調のドミナントで橋渡しし、ラスサビの半音上げは準備なしの直接転調にします。調号を変えずに明暗だけ入れ替える<strong>平行調</strong>（ハ長調↔イ短調）と、主音を保ったまま暗くする<strong>同主調</strong>（ハ長調→ハ短調）も引きます。1割強の曲は主和音を避けて「明るいのか暗いのか分からない」浮遊感で通します。</li>
    <li>調はハ長調（またはイ短調）で固定です。別の調にしたいときは、この下の「移調」で動かしてください。</li>
    <li>31平均律の曲でも使えます。和音・メロディとも31平均律の格子に乗せて生成します。</li>
    <li><strong>ドラムも曲に合わせて組み立てます</strong>。テンポとメロディの刻みから8ビート／16ビート／4つ打ち／シャッフル／バラード／ロックのどれかを選び、A・A'・サビ・A'' で刻みの強さを変え、4小節ごとにフィル、セクションの頭にクラッシュを置きます。気に入らなければ「ドラム設定」から他のリズムへ切り替えられます。</li>
    <li>実行後は「元に戻す」で作曲前の状態へ戻せます。元に戻すはトラックごとに効くので、4トラックすべてを戻したいときはトラックを切り替えながら1回ずつ押してください。</li>
  </ul>
</div>
`,t_=`
<div class="dtm-modal-body-content">
  <h4>おまかせマスタリングとは</h4>
  <p>市販曲でよく使われる値を目安に、以下をまとめて設定するボタンです。曲のBPMを見て一部の値を自動調整します。</p>
  <h4>ゲインステージング（実測ベースの音量調整）</h4>
  <p>再生している間、裏でマスタのピークレベル（音割れ検知バッジと同じ実測値）を継続的に収集しています。合計2秒以上の再生実績が溜まっていれば、「おまかせ」実行時にその実測ピークを目標ヘッドルーム（-6dBFS付近）に収まるよう逆算して、マスタ音量を自動調整します。</p>
  <p style="margin-top:4px;"><small>ノートのベロシティなど静的な情報だけでは、複数トラックが重なって実際にどれだけ音圧が積み上がるか（トラック単位の圧縮・EQ後の値も含む）は分かりません。実際に鳴らした音を測るのが最も確実なため、このボタンを押すたびに使うのではなく、ある程度編集して一度でも再生した後に押すと効果を発揮します。一度も再生していない・再生時間が短すぎる場合は判断材料が無いため、この項目はスキップされ他の値だけが適用されます。</small></p>
  <ul>
    <li>マスタバス グルーコンプレッサー: 25%（各トラックの頭を軽く均して一体感を出す、控えめな量）</li>
    <li>マスタリバーブ Mix: <strong>アレンジの密度（音の入っているトラック数）に応じて自動計算</strong>（2トラック以下で28%、8トラック以上で12%、その間は線形補間）</li>
    <li>マスタリバーブ Decay: <strong>現在のBPMに応じて自動計算</strong>（速い曲ほど短く0.9秒寄り、遅い曲ほど長く3.0秒寄り）</li>
    <li>マスタリバーブ Pre Delay: 20ms（原音の輪郭を保ったまま奥行きを足す定番値）</li>
    <li>フェードアウト: 未設定（0秒）のときだけ1.5秒を補う（曲の終わりをぶつ切りにしない）。既に0秒以外の値が設定済みなら上書きしない</li>
  </ul>
  <p style="margin-top:4px;"><small>マスタリバーブMixを密度で決めるのは、「音数の多い厚いアレンジに残響を重ねすぎると濁る、音数の少ない隙間の多い編成には残響で空間を埋めると心地よい」というミキシングの定石に基づきます。</small></p>
  <h4>楽器・音量・役割ごとのミックスの自動割り当て</h4>
  <p>歌詞のないトラックは、置かれているノートの音高・タイミング・和音の厚みから役割（メロディ/サブメロ/ベース/伴奏）を推定し、楽器・音量に加えて音圧強化・ステレオ幅・定位・リバーブ送り・ディレイ送り・EQをまとめて役割相応の値へ設定します。</p>
  <ul>
    <li><strong>低音域（C3未満）が中心</strong> → ベース。基準音量85（低いほど底上げ、最大+12）、音圧強化40%（粒立ちを揃える）、ステレオ幅100%（広げない）、定位は中央固定、リバーブ送り5%（濁り防止）、ディレイ送り0%（低域には掛けない）、EQ低域+2dB／高域-3dB。</li>
    <li><strong>和音（同時発音）が多く音価も長い</strong> → 伴奏（コード/パッド）。基準音量72（重なりの厚みぶんさらに下げる）、音圧強化25%（自然な強弱を残す）、ステレオ幅118%（空間を埋める）、定位は左右へ広めに振り分け、リバーブ送り22%、ディレイ送り0%、EQ低域-4dB（ベースの帯域を空ける）。</li>
    <li><strong>単音で音数が少なく音価が長い</strong> → サブメロ（オブリガート寄り）。基準音量92、音圧強化32%、定位は左右へやや振り分け、リバーブ送り15%（メロディの一歩後ろへ）、ディレイ送り8%、EQ低域-3dB／高域+1dB。</li>
    <li><strong>それ以外（単音で動きが多い）</strong> → メロディ。基準音量100、音圧強化35%、定位は中央固定、リバーブ送り12%（前に出す）、ディレイ送り15%（聞かせどころに薄く）、EQ低域-2dB／高域+2dB（抜け・プレゼンス）。</li>
  </ul>
  <p style="margin-top:4px;"><small>いずれも一般的なミキシングの経験則です。低域はモノラルに寄せる（ベースのステレオ幅・定位を中央固定にする）ことで位相干渉によるモノラル再生時の痩せを防ぎ、他パートはEQで低域を軽く削って周波数帯域をベースと住み分けます（frequency slotting）。曲の軸になるメロディ・ベースは中央、彩りのサブメロ・伴奏は左右へ散らして各パートの居場所を分けます（同じ役割のトラックが複数あるときは左右を交互に振り分けます）。ディレイは低域に掛けると繰り返しが重なりリズムが濁るため、ベース・伴奏には送りません（[delay]パネルの掛かり具合が既定0%＝オフなので、有効化するまでは無音）。楽器名は現在選択中の楽器プリセット（未選択ならグランドピアノ）から役割に対応するものを引きます。音の無いトラックは判定できないため対象外です。あくまで自動推定なので、意図と違う場合は各トラックの設定欄から個別に選び直してください。</small></p>
  <h4>メインボーカルの自動判定</h4>
  <p>歌詞のあるトラックが複数ある場合（ハモリ・コーラス・掛け声等）、発音時間が最も長いトラックを「メインボーカル」とみなし、他とは違う扱いにします。</p>
  <ul>
    <li>メインボーカル: 自動ビブラートON・声量を既定の1.1倍（前に出す）・音圧強化30%・ステレオ幅100%（狭め・中央寄りでクリアに）・EQ低域-3dB（ランブル/こもり除去）・EQ高域+2dB（抜け・プレゼンス）・ディレイ送り15%（語尾に軽いスラップ）・リバーブ送り25%・定位は中央固定</li>
    <li>それ以外のボーカル（ハモリ・コーラス等）: 自動ビブラートOFF・声量を既定の0.85倍を基準に、副ボーカルの本数が多いほどさらに絞る（重なって音圧が積み上がる分を等パワー則で相殺）・音圧強化25%・ステレオ幅120%（広げて「壁」のような厚みを出す）・EQ低域-3dB・EQ高域は無変化（明るくしすぎると前に出てしまうため）・ディレイ送り0%（掛けると輪郭がぼやけて団子になるため）・リバーブ送り45%（奥へ馴染ませる）・定位は左右へ交互に振ってダブリング感を出す</li>
  </ul>
  <p style="margin-top:4px;"><small>「前に出したい音は声量大きめ・狭め・リバーブ少なめ、奥に置きたい音は声量控えめ・広め・リバーブ多め」という定石に基づいています。EQの低域カットはボーカルでほぼ普遍的な定石（実質的なハイパスフィルタの代用）です。ビブラートをハモリ・コーラスへ掛けないのは、複数の声が同時に揺れると声ごとの位相・速さのズレで和音が「うねる」「濁る」ためで、合唱やストリングスのセクション奏法と同じく、ハモリ/コーラスはストレートトーンにして音程の軸を安定させる方が馴染みます。オクターブユニゾン（1オクターブ上/下を重ねて厚みを出す加工）はここでは自動適用しません — 声質を大きく変える演出目的の加工であり、曲によって合う/合わないが分かれる創作上の選択（バラードでは不自然になりやすい等）で、ミックスの是正とは性質が違うためです。使いたい場合は各ボーカルトラックの設定欄から個別に選んでください。「いい感じの初期値」を一括で当てるだけで、曲や好みに応じた微調整までは行いません。既存の設定は上書きされるので、気に入らなければ各スライダーから個別に戻してください。</small></p>
</div>
`,n_=`
<div class="dtm-modal-body-content">
  <h4>1. MIDIファイルとは</h4>
  <p>「どの音を・いつ・どのくらいの長さで鳴らすか」を記録した、演奏データのファイル（拡張子 <code>.mid</code> / <code>.midi</code>）です。音そのものではなく楽譜に近いデータなので、読み込んでそのまま編集できます。</p>

  <h4>2. 読み込みのしかた</h4>
  <ul>
    <li>「ファイルを選択」から <code>.mid</code> ファイルを選びます。</li>
    <li>ファイル内のトラック一覧が出るので、取り込みたいトラックを選びます。</li>
    <li>「読込」を押すと反映されます。</li>
  </ul>

  <h4>3. モードによる取り込み方の違い</h4>
  <ul>
    <li><strong>初心者モード</strong>: 各トラックの特徴から、メロディー・サブメロ・ベース・伴奏の4つの役割に自動で振り分けられます。</li>
    <li><strong>上級者モード</strong>: MIDIのトラック構成がそのまま反映されます（1対1）。</li>
  </ul>

  <h4>4. MIDIファイルを手に入れる</h4>
  <p>手元にMIDIが無いときは、「<code>曲名 midi</code>」などで検索すれば、無料で配布しているサイトが見つかります。</p>
  <p style="margin-top:4px;"><small>みんながMIDIを投稿できる投稿型プラットフォーム: <a href="http://picotune.me/" target="_blank" rel="noopener">picotune.me</a>（いろんなジャンルのMIDIを無料ダウンロードできます。サイト上ではチップチューン風に再生されます）</small></p>
  <p style="margin-top:4px;"><small>※検索で見つかる配布サイトは、個人運営のものから権利的にグレーなものまで様々です。そのため、それらへの直接リンクは載せていません。利用の際は配布元や権利関係をご自身でご確認ください。</small></p>

  <h4>5. UST（UTAU）から読み込む</h4>
  <p>UTAUのUSTファイルは、音符と歌詞をまとめて直接読み込めます（MIDIへ書き出す必要はありません）。下の「UST」欄をお使いください。</p>
</div>
`,r_=`
<div class="dtm-modal-body-content">
  <h4>1. MusicXMLとは</h4>
  <p>MuseScore、Finale、Sibeliusなどの楽譜作成ソフトで広く使われている楽譜フォーマットです。MIDIと違って<strong>パート構成や音符に紐づいた歌詞</strong>を保持できるため、主旋律の特定や歌声合成への受け渡しが確実に行えます。</p>

  <h4>2. 読み込みのしかた</h4>
  <ul>
    <li>「ファイルを選択」から <code>.musicxml</code> または <code>.xml</code> ファイルを選びます。</li>
    <li>ファイル内に含まれるパート一覧が表示されるので、読み込みたいパートを選択して「読込」を押します。</li>
    <li>歌詞が含まれているパートは自動的に歌声合成（UTAU）トラックとして設定され、歌詞も流し込まれます。</li>
    <li>テンポ（BPM）情報がある場合は自動的に反映されます。</li>
    <li>「現在のトラックのみ対象とする」が有効なときは、選択した最初のパートだけが現在アクティブなトラックに読み込まれます。</li>
  </ul>

  <h4>3. 書き出し</h4>
  <ul>
    <li>「MIDI / MusicXML / UST / MML 出力」の「MusicXML出力」で、全トラックを <code>score-partwise</code> 形式の MusicXML ファイルとして書き出せます。</li>
    <li>音符やトラック名に加えて、設定された歌詞もそのまま楽譜の歌詞として出力されます。</li>
  </ul>

  <h4>4. 歌詞の記号と楽譜の記号</h4>
  <p>歌詞の制御記号は楽譜ソフトが同じ意味で読み書きする要素へ写します（読み込みも同じ対応で戻します）。</p>
  <ul>
    <li><code>ー</code> <strong>伸ばす</strong> … 歌詞の無い音符 + メリスマ線（<code>extend</code>）</li>
    <li><code>〜</code> <strong>しゃくり</strong> … スライド記号（<code>slide</code>。<code>glissando</code> も読めます）</li>
    <li><code>、</code> <strong>ブレス</strong> … ブレス記号（<code>breath-mark</code>、コンマ形）</li>
    <li><code>↓</code> <code>↑</code> <strong>強弱</strong> … 松葉（<code>wedge</code> の diminuendo / crescendo）</li>
    <li><code>っ</code> <code>_</code> <code>「…」</code> 鼻濁音の <code>ガ</code> … 楽譜側に対応物が無いので歌詞の文字のまま</li>
  </ul>
</div>
`,i_=`
<div class="dtm-modal-body-content">
  <h4>1. USTファイルとは</h4>
  <p>UTAU（歌声合成ソフト）の曲データ（拡張子 <code>.ust</code>）です。音符に加えて<strong>歌詞（かな）も入っている</strong>ので、読み込めばそのまま歌わせられます。</p>

  <h4>2. 読み込みのしかた</h4>
  <ul>
    <li>「ファイルを選択」から <code>.ust</code> ファイルを選び、「読込」を押します。</li>
    <li>歌う音源（UTAU欄）が「なし」のトラックには、音源が自動で選ばれます。あとから変更できます。</li>
    <li>BPMはUSTに書かれたテンポに合わせます。</li>
  </ul>

  <h4>3. ハモリなど複数パートを一度に読み込む</h4>
  <p>USTは1ファイル＝1パートです。<strong>複数ファイルをまとめて選べます</strong>（ファイル選択のダイアログで Ctrl / Shift を押しながら選ぶ、またはフォルダの中身を全選択）。</p>
  <ul>
    <li><strong>選択中のトラック</strong>から順に、隣・その隣…へ1ファイルずつ入ります。</li>
    <li>並び順はファイル名順です。<code>01_main.ust</code> <code>02_harmony.ust</code> のように番号を付けておくと狙った順に入ります。</li>
    <li>トラックが足りないぶんは読み込まれません（上級者モードなら15トラックまで入ります）。</li>
    <li>下の「現在のトラックのみ対象とする」が有効なときは、隣へこぼさず先頭の1ファイルだけを読み込みます。</li>
  </ul>

  <h4>4. 歌詞の解釈</h4>
  <ul>
    <li>連続音（<code>a か</code>）・ローマ字（<code>ka</code>）の原音名も、かなへ寄せて取り込みます。</li>
    <li><code>R</code>（休符）は音符の無い隙間になります。</li>
    <li><code>+</code>（前の歌詞を続ける）は継続記号 <code>ー</code> になります。</li>
    <li>読み取れなかった歌詞は継続記号になります。歌詞欄で直せます。</li>
  </ul>

  <h4>5. 書き出し</h4>
  <p>「MIDI / UST / MML 出力」の「UST出力」で、<strong>選択中のトラック1本だけ</strong>をUSTに書き出せます（USTは単旋律1パートのフォーマットなので、和音は上から1本に潰れます）。</p>
</div>
`,a_=80,o_=48,s_=`
<div class="dtm-modal-body-content">
  <h4>1. できること</h4>
  <p>mp3 / wav などの音声ファイルや、音声・YouTubeのURLを、打ち込みと<strong>一緒に鳴らせます</strong>。カラオケ音源に合わせてメロディを打ち込む、既存曲に重ねてハモリを作る、といった使い方ができます。</p>

  <h4>2. 読み込み</h4>
  <ul>
    <li><strong>ファイル</strong>: 手元の音声ファイルを選びます。正確に同期し、WAV書き出し・録音にも入ります。</li>
    <li><strong>URL</strong>: mp3 / wav などの直リンク、またはYouTubeのURLを入れて「読込」。</li>
  </ul>

  <h4>3. 音源の範囲（いらないパートを飛ばす）</h4>
  <ul>
    <li><strong>開始</strong>: 音源のどこから鳴らすか。<code>0:12.500</code> のように<strong>分:秒.ミリ秒</strong>で書きます（<code>12.5</code> のように秒だけでも可）。</li>
    <li><strong>〜（終了）</strong>: 音源のどこで止めるか。空欄なら最後まで。</li>
  </ul>

  <h4>4. 開始のずれ（どちらが何秒先に始まるか）</h4>
  <p>「<strong>［音源／打ち込み］が先、［n秒］後に もう一方が始まる</strong>」の形で指定します。この2つで次の4通りすべてを表せます。</p>
  <ul>
    <li><strong>音源が先・0秒</strong> … 同時に始まる（既定）。</li>
    <li><strong>音源が先・n秒</strong> … 音源を先に鳴らし、n秒後に打ち込みが入る（前奏の長い音源に合わせるとき）。</li>
    <li><strong>打ち込みが先・0秒</strong> … 同時に始まる（上と同じ）。</li>
    <li><strong>打ち込みが先・n秒</strong> … 打ち込みが先に鳴り、n秒後に音源が入る（曲の途中から音源を重ねるとき）。</li>
  </ul>
  <p style="margin-top:4px;"><small><strong>音符は動きません</strong>。ずれるのは再生の開始時刻だけなので、いつでも変えられます。再生中に変えるとその場で合わせ直します。曲の途中から再生したときは待ち時間を挟まず、その位置の音源がすぐ鳴ります。</small></p>

  <h4>5. MML出力での扱い</h4>
  <ul>
    <li><strong>URLで読み込んだ音源は <code>#audio=</code> としてMMLに残ります</strong>（開始位置・音量も一緒に）。</li>
    <li><strong>アップロードしたファイルはMMLに含まれません</strong>。受け取った人の環境にそのファイルが無いためです。ファイルで作った設定を共有したいときは、音源をどこかに置いてURLで読み込み直してください。</li>
  </ul>

  <h4>6. 注意</h4>
  <ul>
    <li>CORSを許可していない配布URLは直接再生に切り替わります。鳴りますが、WAV書き出し・録音には入りません（YouTubeも同じです）。</li>
    <li>YouTubeは外部プレイヤーを操作する都合で、同期の精度が音声ファイルより落ちます。</li>
    <li>ループ再生をONにしても、伴奏音源はループせずそのまま流れます。</li>
    <li>音源の権利にご注意ください。人の曲を公開する形で使う場合は、配布元・権利者の条件に従ってください。</li>
  </ul>
</div>
`,c_=`
<div class="dtm-modal-section">
  <p><strong>音律</strong>は1オクターブを何等分するかの設定です。曲全体に効きます（トラックごと・小節ごとには変えられません）。</p>
  <p><strong>12平均律</strong>が通常のピアノと同じ調律です。<strong>31平均律</strong>は1オクターブを31等分し、ピアノには無い音（微分音）が使えます。</p>
  <p style="margin-top:8px;"><strong>31平均律の特徴</strong></p>
  <ul>
    <li>長3度が純正にごく近く（誤差0.8セント）、<strong>和音が12平均律より綺麗に響きます</strong>。</li>
    <li>ピアノに無い音が使えます。中立3度（長短どちらでもない3度）、自然7度（バーバーショップの響き）など。</li>
    <li>C♯ と D♭ が<strong>別の音</strong>になります（12平均律では同じ音）。</li>
  </ul>
  <p style="margin-top:8px;"><strong>MMLでの書き方</strong></p>
  <p><code>#edo=31</code> を宣言します。臨時記号は4つ使い分けます。</p>
  <ul>
    <li><code>#</code> … 半音上げ（2度）　<code>-</code> … 半音下げ（2度）</li>
    <li><code>+</code> … 微分音1つ上げ（1度）　<code>_</code> … 微分音1つ下げ（1度）</li>
  </ul>
  <p>例: <code>#edo=31 @0 o4 c c+ c# d- d_ d;</code></p>
  <p style="margin-top:8px;"><small>12平均律では4記号とも従来通りの意味（シャープ2つ・フラット2つ）になるので、既存の曲の解釈は変わりません。</small></p>
  <p style="margin-top:8px;"><small>切り替えると、既存の音符は新しい音律の格子へ丸められます。12→31 は最大19セントの移動で元に戻せますが、<strong>31→12 は最大48セント動き、12平均律に無い音は失われます</strong>。</small></p>
</div>
`,l_=`
<div class="dtm-modal-body-content">
  <h4>1. UTAU音源を .koe に変換する</h4>
  <p>UTAU用の音源（zip）をそのまま使うことはできません。下記の変換サイトで <code>.koe</code> 形式に変換してください。</p>
  <p style="margin-top:4px;"><small>変換サイト: <a href="https://onjmin.github.io/koe/demo/" target="_blank" rel="noopener">koe変換デモ（onjmin.github.io/koe/demo）</a></small></p>

  <h4>2. 変換した .koe をアップロードする</h4>
  <p>変換後の <code>.koe</code> ファイルは、誰でも直接ダウンロードできる形でネット上に置く必要があります（ローカルのファイルパスは使えません）。</p>
  <ul>
    <li><strong>Googleドライブ</strong>: アップロード後、共有設定を「リンクを知っている全員」に変更 → 共有リンクの<code>/d/</code>と<code>/view</code>の間のID（ファイルID）を controlled URL に組み込んで直接リンク化します（例: <code>https://drive.google.com/uc?export=download&id=ファイルID</code>）。</li>
    <li>その他、直接ダウンロードURLを発行できるホスティング（GitHub Pages、Cloudflare R2 など）でも構いません。</li>
  </ul>

  <h4>3. DTMで使う</h4>
  <ul>
    <li>歌唱モデルのプルダウンから「カスタム音声を追加…」を選びます。</li>
    <li>「音声URL」に手順2の直接リンクを貼り付けます。</li>
    <li>アイコン画像URLは任意です（省略可）。識別子はファイル名から自動生成されます。</li>
    <li>「追加」を押すとプルダウンに登録され、以降そのトラックで使えます。</li>
  </ul>
  <p style="margin-top:4px;color:var(--dtm-warn);"><small>※UTAU音源を <code>.koe</code> に変換してネット上に置く行為は、音源データの再加工・再配布にあたります。これが配布元の利用規約に反していないかは必ずご自身で確認し、その責任を負ってください。</small></p>
</div>
`,u_=`
<div class="dtm-modal-body-content">
  <h4>はじめての方へ（各30秒）</h4>
  <p>やりたいことを選ぶと、その操作だけを順番に案内します。</p>
  <div class="dtm-help-goals">
    <button class="dtm-btn dtm-btn--primary" data-dtm-tour="cover">🎧 カバー曲を作りたい<small>原曲・カラオケ音源に重ねて打ち込む</small></button>
    <button class="dtm-btn dtm-btn--primary" data-dtm-tour="compose">🎲 曲を自動で作りたい<small>ボタン1つでフル構成の曲を生成</small></button>
    <button class="dtm-btn dtm-btn--primary" data-dtm-tour="sequence">🎹 自分で打ち込みたい<small>ピアノロールの使い方をひととおり</small></button>
  </div>

  <h4>もっと詳しく</h4>
  <p>知りたい項目を選んでください。同じ解説は、画面の各項目にある <strong>ⓘ</strong> ボタンからも開けます。</p>
  <div class="dtm-help-topics">
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="audio">オーディオ同時再生</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="compose">自動作曲</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="autoMaster">おまかせマスタリング</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="lyric">歌詞の書き方</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="koe">カスタム音声(.koe)</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="chord">コード進行</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="midi">MIDIの読み込み</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="musicxml">MusicXML</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="ust">UST(UTAU)</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="mml">MMLの書き方</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="loop">ループ再生</button>
    <button class="dtm-btn dtm-btn--ghost" data-dtm-help="edo">音律(31平均律)</button>
  </div>
</div>
`,d_={audio:{title:`オーディオ同時再生の解説`,html:s_},compose:{title:`作曲の解説`,html:e_},autoMaster:{title:`おまかせマスタリング解説`,html:t_},lyric:{title:`歌詞の書き方`,html:Ng},koe:{title:`カスタム音声(.koe)の使い方`,html:l_},chord:{title:`コード進行の自動入力解説`,html:Mg},midi:{title:`MIDIの読み込み解説`,html:n_},musicxml:{title:`MusicXMLの入出力解説`,html:r_},ust:{title:`USTの読み込み解説`,html:i_},mml:{title:`MMLの書き方解説`,html:Gc},loop:{title:`ループ再生の解説`,html:Qg},edo:{title:`音律の解説`,html:c_}},f_=.5,p_=15,m_=[{id:`melody`,name:`メロディー`,color:[41,173,255],instrument:0,volume:100},{id:`submelody`,name:`サブメロ`,color:[255,119,168],instrument:1,volume:95},{id:`bass`,name:`ベース`,color:[0,228,54],instrument:2,volume:88},{id:`chord`,name:`伴奏`,color:[255,163,0],instrument:3,volume:76}],h_=[{id:`t0`,name:`トラック1`,color:[41,173,255],instrument:0,volume:100},{id:`t1`,name:`トラック2`,color:[0,228,54],instrument:1,volume:100},{id:`t2`,name:`トラック3`,color:[255,119,168],instrument:2,volume:100},{id:`t3`,name:`トラック4`,color:[255,163,0],instrument:3,volume:100},{id:`t4`,name:`トラック5`,color:[255,236,39],instrument:4,volume:100},{id:`t5`,name:`トラック6`,color:[131,118,156],instrument:5,volume:100},{id:`t6`,name:`トラック7`,color:[255,0,77],instrument:6,volume:100},{id:`t7`,name:`トラック8`,color:[255,204,170],instrument:7,volume:100},{id:`t8`,name:`トラック9`,color:[194,195,199],instrument:8,volume:100},{id:`t9`,name:`トラック10`,color:[0,135,81],instrument:9,volume:100},{id:`t10`,name:`トラック11`,color:[171,82,54],instrument:10,volume:100},{id:`t11`,name:`トラック12`,color:[126,37,83],instrument:11,volume:100},{id:`t12`,name:`トラック13`,color:[255,241,232],instrument:12,volume:100},{id:`t13`,name:`トラック14`,color:[120,200,255],instrument:13,volume:100},{id:`t14`,name:`トラック15`,color:[100,255,160],instrument:14,volume:100}],g_=m_,__=[`klatt`,...Object.keys(Co)],v_=__,y_=e=>{let t=v_.filter(t=>t!==e),n=t.length>0?t:v_;return n[Math.floor(Math.random()*n.length)]??`klatt`},b_={klatt:`軽量ロボ声`,...To},x_=(e,t)=>b_[e]??t.get(e)?.label??e,S_=`+custom`,C_=/^[a-zA-Z_][a-zA-Z0-9_]*$/,w_=e=>{let t;try{let n=new URL(e).pathname;t=decodeURIComponent(n.slice(n.lastIndexOf(`/`)+1))}catch{return``}return t=t.replace(/\.[^.]*$/,``).normalize(`NFKC`).toLowerCase().replace(/[^a-z0-9]+/g,`_`).replace(/^_+|_+$/g,``),t&&/^[0-9]/.test(t)&&(t=`_${t}`),C_.test(t)?t:``},T_=(e,t,n)=>Math.min(Math.max(e,t),n),E_=e=>{if(!e)return``;let t=e.replace(/\s+/g,``).toLowerCase();return i.find(e=>e.replace(/\s+/g,``).toLowerCase()===t)??e},D_=48,O_={melody:100,submelody:92,bass:85,chord:72},k_=e=>{let t=e.reduce((e,t)=>e+t.pitchUnits,0)/e.length,n=e.reduce((e,t)=>e+t.durationSteps,0)/e.length,r=new Map;for(let t of e)r.set(t.startStep,(r.get(t.startStep)??0)+1);let i=0;for(let e of r.values())e>i&&(i=e);return{avgPitch:t,avgDur:n,avgPoly:e.length/r.size,maxPoly:i}},A_=1488,j_=(e,t)=>e.avgPitch<A_?`bass`:e.maxPoly>=2&&e.avgDur>=D_?`chord`:t?`melody`:`submelody`,M_={melody:`melody`,submelody:`submelody`,bass:`bass`,chord:`chord`},N_=(e,t)=>{let n=O_[e];if(e===`chord`&&t.avgPoly>1)n/=Math.sqrt(t.avgPoly);else if(e===`bass`){let e=Math.max(0,(A_-t.avgPitch)/31);n+=Math.min(12,e*.5)}return T_(Math.round(n),1,127)},P_={melody:{compression:35,width:115,reverbSend:12,delaySend:15,eqLow:-2,eqHigh:2},submelody:{compression:32,width:115,reverbSend:15,delaySend:8,eqLow:-3,eqHigh:1},chord:{compression:25,width:118,reverbSend:22,delaySend:0,eqLow:-4,eqHigh:0},bass:{compression:40,width:100,reverbSend:5,delaySend:0,eqLow:2,eqHigh:-3}},F_=(e,t={})=>{Jc();let n=t.getAudioTime??(()=>performance.now()/1e3),r=t.tracks??g_,p=t.mode??(r.length>m_.length?`advanced`:`simple`),h=p===`advanced`,g=pt(t.drumPatterns??{}),_={...ht,...Dc,...g},v=!!t.parseMidi,y=!h,b=t.backingAudio??null,x=!!b,S=t.midiSearch?new _m(t.midiSearch):void 0,C=!!S?.enabled,w=Rp(e,{tracks:r,drumPatterns:Object.entries(_).map(([e,t])=>({value:e,label:t.label})),defaultDrumPattern:_.dance?`dance`:Object.keys(_)[0]??`none`,defaultBpm:t.defaultBpm??120,showMidi:v,showChord:y,showAudio:x,showMidiSearch:C,showCompose:!0,showHelp:t.showHelp!==!1}),T=t.tour??{},E=T.storageKey===void 0?eh:T.storageKey,D=e=>{w.modalOverlay.setAttribute(`hidden`,``);let t=e?vh[e].steps:T.steps??_h;uh({root:w.root,steps:[...t,...T.extraSteps??[]],storageKey:E,labels:T.labels})};w.masterVolume.value=String(t.masterVolume??50),w.masterVolumeLabel.textContent=`${t.masterVolume??50}%`,w.masterComp.value=String(t.masterCompression??0),w.masterCompLabel.textContent=`${t.masterCompression??0}%`,w.reverbAmount.value=String(t.reverbAmount??0),w.reverbAmountLabel.textContent=`${t.reverbAmount??0}%`;{let e=t.reverbDecay??$s,n=t.reverbPreDelay??rc;w.reverbDecay.value=String(Math.round(e*10)),w.reverbDecayLabel.textContent=`${e.toFixed(1)}s`,w.reverbPreDelay.value=String(n),w.reverbPreDelayLabel.textContent=`${n}ms`}w.delayAmount.value=String(t.delayAmount??0),w.delayAmountLabel.textContent=`${t.delayAmount??0}%`,w.delayDivision.value=t.delayDivision??`8`,w.fadeIn.value=String(t.fadeInSec??0),w.fadeInLabel.textContent=`${(t.fadeInSec??0).toFixed(1)}s`,w.fadeOut.value=String(t.fadeOutSec??0),w.fadeOutLabel.textContent=`${(t.fadeOutSec??0).toFixed(1)}s`,w.drumVolume.value=String(t.drumVolume??80),w.drumVolumeLabel.textContent=`${t.drumVolume??80}%`;let O={stepsPerBar:192,keyCount:Ca,pitchRangeStart:0,unitsPerRow:xa(12),edo:12,keyHeight:p_,stepWidth:f_*2},k,A=100,j=100,M=t.defaultBpm??120,N=t.masterVolume??50,ee=e=>{N=T_(Math.round(e),0,100),w.masterVolume.value=String(N),w.masterVolumeLabel.textContent=`${N}%`,t.singingVoices?.setVolume(N/100)};ee(N);let P=t.initialLoop??!1,F=e=>{P=e,w.loopToggle&&(w.loopToggle.checked=e),w.loopToggleLabel&&(w.loopToggleLabel.textContent=e?`ON`:`OFF`),t.onLoopChange?.(e)};F(P);let te=e=>{let t=O.unitsPerRow??31;return $t(Math.round(e/t)*t)},ne=(e,t)=>{let n=e===31?31:12;if(O.edo===n)return;let r=xa(n);if(O.edo=n,O.unitsPerRow=r,O.keyCount=Sa(n),t?.snap)for(let e of W){e.core.beginBatch();for(let t of[...e.core.getNotes()]){let n=$t(Math.round(t.pitchUnits/r)*r);n!==t.pitchUnits&&e.core.moveNote(t.id,t.startStep,n)}e.core.endBatch()}},re=t.reverbAmount??0,I=t.reverbDecay??$s,ie=t.reverbPreDelay??rc,ae=t.delayAmount??0,oe=t.delayDivision??`8`,L=t.masterCompression??0,se=t.fadeInSec??0,ce=t.fadeOutSec??0,le,ue=0,de=0,R=null,z=0,fe=e=>{z&&(de+=e-z),z=e;let n=t.clipMeter?.getPeakLevel()??0;n>ue&&(ue=n),R=requestAnimationFrame(fe)},pe=()=>{R===null&&t.clipMeter&&(z=0,R=requestAnimationFrame(fe))},me=()=>{R!==null&&cancelAnimationFrame(R),R=null,z=0};t.onReverbChange?.(re),t.onReverbDecayChange?.(I),t.onReverbPreDelayChange?.(ie),t.onDelayChange?.(ae),t.onDelayDivisionChange?.(oe),t.onMasterCompressionChange?.(L);let he=t.drumVolume??80,ge=w.drumSelect.value,_e=[],ve=null,ye=new Map,be=t.drumFont??`FluidR3_GM_sf2_file:0`;w.drumFontSelect.value=be;let xe=e=>{let n=_[e]?.font;n&&(be=n,w.drumFontSelect.value=n,t.onDrumFontChange?.(n))},Se=``,Ce=null,we=null,Te=null,Ee=t.initialActiveTrack??r[0].id,De=Pp(`track-fx-advanced`)??!1,B=Pp(`lyric-advanced`)??!1,Oe=`pen`,V=48,ke=12,H=0,Ae=Tn(t.initialScrollPitch??48),je=(O.keyCount-1-(Ae-O.pitchRangeStart)/(O.unitsPerRow??31))*O.keyHeight-215,Me=0,Ne=!1,Pe=new Set,U=`stopped`,Fe=0,Ie=0,Le=new Map,Re=[],ze=()=>{for(let e of Re)clearTimeout(e);Re=[];for(let e of Le.values())e.classList.remove(`dtm-pill--sounding`)},Be=(e,t,n)=>{let r=Le.get(e);if(!r)return;let i=Math.min(Math.max(n*1e3,60),400);Re.push(setTimeout(()=>r.classList.add(`dtm-pill--sounding`),Math.max(0,t*1e3))),Re.push(setTimeout(()=>r.classList.remove(`dtm-pill--sounding`),Math.max(0,t*1e3)+i))},Ve=!1,He=!1,Ue=new Map,We=e=>{let t=e.key.toLowerCase();__.includes(t)||Ue.set(t,{...e,key:t})},Ge=()=>{Ue.clear();for(let e of t.customVocals??[])We(e)};Ge();let Ke=()=>{let e=1;for(;Ue.has(`custom${e}`);)e++;return`custom${e}`},qe=e=>{if(!e)return;let t=Ue.get(e);if(t!==void 0)return t.iconUrl||Qc;let n=Oo[e.toLowerCase()];return n?Zc[n]:void 0},Je=[],Ye=null,Xe=[],W=[],Ze=!1,Qe=null,$e=e=>{W.indexOf(e)===0&&xh({volume:e.volume,trackInstrument:e.trackInstrument,trackOctave:e.trackOctave,trackOctaveUnison:e.trackOctaveUnison,trackCompression:e.trackCompression,trackWidth:e.trackWidth,trackReverbSend:e.trackReverbSend,trackEqLow:e.trackEqLow,trackEqMid:e.trackEqMid,trackEqHigh:e.trackEqHigh,trackPan:e.trackPan,trackDelaySend:e.trackDelaySend,lyricModel:e.lyricModel,vocalVolume:e.vocalVolume,vocalGate:e.vocalGate,vocalPan:e.vocalPan,vocalOctave:e.vocalOctave,vocalVibrato:e.vocalVibrato,vocalReverb:e.vocalReverb,vocalDelay:e.vocalDelay,vocalGender:e.vocalGender,vocalBreathiness:e.vocalBreathiness,vocalTension:e.vocalTension,vocalOctaveUnison:e.vocalOctaveUnison})},et=e=>{if($e(e),!t.onLyricsChange)return;let n=e.config.id,r={lyrics:e.lyrics,model:e.lyricModel,vocalVolume:e.vocalVolume,vocalGate:e.vocalGate,vocalPan:e.vocalPan,vocalOctave:e.vocalOctave,vocalVibrato:e.vocalVibrato,vocalReverb:e.vocalReverb,vocalDelay:e.vocalDelay,vocalGender:e.vocalGender,vocalBreathiness:e.vocalBreathiness,vocalTension:e.vocalTension,vocalOctaveUnison:e.vocalOctaveUnison};Qe&&clearTimeout(Qe),Qe=setTimeout(()=>{t.onLyricsChange?.(n,r),Qe=null},300)},tt=new Set,nt=new Set,rt=bh(),it=()=>{W=r.map((e,n)=>{let r=[],i=n===0?rt:null;return{config:e,core:new Cm({onMMLGenerated:()=>{},onNotesChanged:n=>{if(Ve){if(!Ze&&t.onNotesPatch){let i=new Map(r.map(e=>[`${e.startStep}_${e.pitchUnits}`,e])),a=new Map(n.map(e=>[`${e.startStep}_${e.pitchUnits}`,e])),o=n.filter(e=>{let t=i.get(`${e.startStep}_${e.pitchUnits}`);return!t||t.durationSteps!==e.durationSteps||t.velocity!==e.velocity}).map(e=>({startStep:e.startStep,pitchUnits:e.pitchUnits,durationSteps:e.durationSteps,velocity:e.velocity})),s=r.filter(e=>!a.has(`${e.startStep}_${e.pitchUnits}`)).map(e=>({startStep:e.startStep,pitchUnits:e.pitchUnits}));(o.length>0||s.length>0)&&t.onNotesPatch(e.id,o,s)}r=n.map(e=>({...e})),q(),Jn()}}},e.volume,()=>O),volume:i?.volume??e.volume,savedChordInput:``,savedChordPattern:`block`,savedChordRoot:0,lyrics:``,lyricModel:i?.lyricModel??``,vocalVolume:i?.vocalVolume??200,vocalGate:i?.vocalGate??100,vocalPan:i?.vocalPan??64,trackOctave:i?.trackOctave??0,trackOctaveUnison:i?.trackOctaveUnison??`none`,vocalOctave:i?.vocalOctave??0,vocalVibrato:i?.vocalVibrato??!1,vocalReverb:i?.vocalReverb??0,vocalDelay:i?.vocalDelay??0,vocalGender:i?.vocalGender??50,vocalBreathiness:i?.vocalBreathiness??50,vocalTension:i?.vocalTension??50,vocalOctaveUnison:i?.vocalOctaveUnison??`none`,trackInstrument:i?.trackInstrument??``,composeSlot:null,trackCompression:i?.trackCompression??0,trackWidth:i?.trackWidth??100,trackReverbSend:i?.trackReverbSend??0,trackEqLow:i?.trackEqLow??0,trackEqMid:i?.trackEqMid??0,trackEqHigh:i?.trackEqHigh??0,trackPan:i?.trackPan??64,trackDelaySend:i?.trackDelaySend??0}})},at=()=>{let e=new Map;return W.forEach((t,n)=>{let r=t.lyricModel.trim(),i=t.lyrics.trim();if(!r||!i)return;let a=Ya(i);a.length!==0&&e.set(n,{trackId:n,model:r.toLowerCase(),volume:t.vocalVolume,gate:t.vocalGate,pan:t.vocalPan,octave:t.vocalOctave,vibrato:t.vocalVibrato,reverb:t.vocalReverb,delay:t.vocalDelay,gender:t.vocalGender,breathiness:t.vocalBreathiness,tension:t.vocalTension,octaveUnison:t.vocalOctaveUnison,syllables:a})}),e},ot=()=>W.find(e=>e.config.id===Ee)??W[0],st=``,ct=[],lt=[],ut=()=>{let e=ot();if(!e?.lyricModel.trim())return[];let t=e.lyrics.trim();return t?(t!==st&&(st=t,lt=Ya(t),ct=lt.map(Xa)),lt):[]},dt=()=>(ut(),ct),ft=new Set,G=(e,n)=>{let r=t.singingVoices;if(!r?.planSpeech)return;let i=`${e}|${n}`;ft.has(i)||(ft.add(i),r.planSpeech(e,n).then(e=>{e!==null&&q()}).catch(()=>{}))},_t=e=>{let n=t.singingVoices;if(!n)return;let r=ut();if(!r.some(e=>e.kind===`speak`))return;let i=ot().lyricModel.trim().toLowerCase(),a=[...e].sort((e,t)=>e.startStep-t.startStep),o=Math.min(a.length,r.length),s=60/M/48,c=[];for(let e=0;e<o;e++){let t=r[e];if(t.kind!==`speak`||!t.text)continue;let o=n.peekSpeechDurationSec?.(i,t.text);if(o===void 0){G(i,t.text);continue}c.push({note:a[e],durationSteps:o/s})}k.drawSpeechSpans(c,ot().config.color)},vt=()=>{let e=t.singingVoices;if(!e?.getSpeechReferenceUnits||!ut().some(e=>e.kind===`speak`))return;let n=e.getSpeechReferenceUnits(ot().lyricModel.trim().toLowerCase());n!==void 0&&k.drawPitchGuide(n,`語りの基準`)},K,yt,bt=e=>{let t=e.core.getNotes(),n=e.trackOctave*372,r=n?t.map(e=>({...e,pitchUnits:$t(e.pitchUnits+n)})):t,i=e.trackOctaveUnison;if(i===`none`)return r;let a=e=>r.map(t=>({...t,pitchUnits:$t(t.pitchUnits+e*372),velocity:Math.max(1,Math.round((t.velocity??100)*.7))})),o=[];return(i===`down`||i===`both`)&&o.push(...a(-1)),(i===`up`||i===`both`)&&o.push(...a(1)),[...r,...o]},xt=()=>{let e=0;for(let t of W)for(let n of t.core.getNotes()){let t=n.startStep+n.durationSteps;t>e&&(e=t)}return e},St=()=>{let e=xt();return e===0?O.stepsPerBar*4:(Math.floor((e-1)/O.stepsPerBar)+2)*O.stepsPerBar},Ct=()=>{let e=k.getGridCanvas(),t=St()*O.stepWidth;return Math.max(0,t-e.width)},wt=()=>{let e=O.keyCount*O.keyHeight;return Math.max(0,e-k.getGridCanvas().height)},Tt=()=>{let e=k.getGridContext(),t=k.getGridCanvas();if(!e)return;let n=Me*O.stepWidth-H;n<-10||n>t.width+10||(e.save(),e.strokeStyle=`#ffec27`,e.lineWidth=2,e.setLineDash([4,4]),e.beginPath(),e.moveTo(n,0),e.lineTo(n,t.height),e.stroke(),e.restore())},Et=()=>{let e=k.getGridContext(),t=k.getGridCanvas();if(!e)return;let n=Ie*O.stepWidth-H;n<0||n>t.width||(e.save(),e.strokeStyle=`#ff004d`,e.lineWidth=2,e.beginPath(),e.moveTo(n,0),e.lineTo(n,t.height),e.stroke(),e.restore())},q=()=>{k.drawGrid(48),vt();let e=null,t=null;for(let e of W){if(tt.has(e.config.id)||Ne&&e.config.id!==Ee)continue;if(e.config.id===Ee){t=e;continue}let[n,r,i]=e.config.color,a=e.core.getNotes();k.drawNotes(a,[n,r,i,1],!1)}if(t){let[n,r,i]=t.config.color,a=t.core.getNotes();k.drawNotes(a,[n,r,i,1],!0),e=a}if(Oe===`select`&&Ye){let e=k.getGridContext();e.save(),e.strokeStyle=`#ffec27`,e.lineWidth=2,e.setLineDash([4,4]),e.strokeRect(Ye.x,Ye.y,Ye.width,Ye.height),e.fillStyle=`rgba(255,236,39,0.08)`,e.fillRect(Ye.x,Ye.y,Ye.width,Ye.height),e.restore()}if(Oe===`select`&&Je.length>0){let e=new Set(Je.map(e=>e.id)),t=ot();k.drawSelectedNotes(t.core.getNotes(),e,[...t.config.color,1])}e&&(_t(e),k.drawNoteLyrics(e,dt())),Tt(),U===`playing`&&Et(),Dt()},Dt=()=>{let e=k.getGridCanvas(),t=Ct(),n=w.hScroll.clientWidth;if(t<=0)w.hScrollThumb.style.width=`100%`,w.hScrollThumb.style.left=`0`;else{let r=St()*O.stepWidth,i=Math.max(40,e.width/r*n),a=H/t;w.hScrollThumb.style.width=`${i}px`,w.hScrollThumb.style.left=`${T_(a*(n-i),0,n-i)}px`}let r=O.keyCount*O.keyHeight,i=w.vScroll.clientHeight;if(r<=e.height)w.vScrollThumb.style.height=`100%`,w.vScrollThumb.style.top=`0`;else{let t=Math.max(40,e.height/r*i),n=wt(),a=je/n;w.vScrollThumb.style.height=`${t}px`,w.vScrollThumb.style.top=`${a*(i-t)}px`}},Ot=()=>{let e=!1,t=!1,n=!1,r=()=>{if(e&&(e=!1,n)){n=!1;let e=Math.max(0,Math.floor(H/O.stepWidth/ke)*ke);Fe=e,Ie=e,Hn()}};w.hScroll.addEventListener(`pointerdown`,t=>{e=!0,n=U===`playing`,n&&Un(),t.preventDefault(),w.hScroll.setPointerCapture(t.pointerId),i(t.clientX)}),w.vScroll.addEventListener(`pointerdown`,e=>{t=!0,e.preventDefault(),w.vScroll.setPointerCapture(e.pointerId),a(e.clientY)}),w.hScroll.addEventListener(`pointermove`,t=>{e&&i(t.clientX)}),w.vScroll.addEventListener(`pointermove`,e=>{t&&a(e.clientY)}),w.hScroll.addEventListener(`pointerup`,r),w.vScroll.addEventListener(`pointerup`,()=>{t=!1}),document.addEventListener(`pointermove`,n=>{e&&i(n.clientX),t&&a(n.clientY)}),document.addEventListener(`pointerup`,()=>{r(),t=!1});let i=e=>{let t=Ct();if(t<=0)return;let n=w.hScroll.getBoundingClientRect(),r=Number.parseFloat(w.hScrollThumb.style.width)||40;H=T_(T_(e-n.left-r/2,0,n.width-r)/(n.width-r)*t,0,t),k.setDrawOffset(H,je),q()},a=e=>{let t=wt();if(t<=0)return;let n=w.vScroll.getBoundingClientRect(),r=Number.parseFloat(w.vScrollThumb.style.height)||40;je=T_(T_(e-n.top-r/2,0,n.height-r)/(n.height-r)*t,0,t),k.setDrawOffset(H,je),q()}},kt=!1,At=!1,jt=null,Mt=!1,Nt=`rect`,Pt=null,Ft=[],It=null,Lt=null,Rt=null,zt=(e,t)=>{if(e<30){let t=(30-e)/30;return-Math.ceil(t*22)}if(e>t-30){let n=(e-(t-30))/30;return Math.ceil(n*22)}return 0},Bt=()=>{Lt!==null&&(cancelAnimationFrame(Lt),Lt=null),Rt=null},Vt=()=>{if(Lt=null,!Mt||!Rt)return;let e=k.getGridCanvas(),{x:t,y:n}=k.getGridPosition(Rt),r=zt(t,e.width),i=zt(n,e.height);if(r!==0||i!==0){let e=Ct(),t=wt();H=T_(H+r,0,e),je=T_(je+i,0,t),k.setDrawOffset(H,je),Yt(Rt)}Mt&&(Lt=requestAnimationFrame(Vt))},Ht=e=>{Rt=e,Lt===null&&(Lt=requestAnimationFrame(Vt))},Ut=e=>{if(He)return;t.onResumeAudio?.();let n=ot();Cn(n.config.id,e,n.volume,100,0,.5)},Wt=(e,t,n=0)=>{let r=ot(),{stepWidth:i,keyHeight:a,keyCount:o,pitchRangeStart:s,unitsPerRow:c=31}=O,l=k.getDrawOffset(),u=r.core.getNotes();for(let r=u.length-1;r>=0;r--){let d=u[r],f=d.startStep*i,p=(o-1-(d.pitchUnits-s)/c)*a,m=d.durationSteps*i,h=f-l.x,g=p-l.y;if(e>=h-n&&e<=h+m+n&&t>=g-n&&t<=g+a+n)return d}return null},Gt=(e,t,n)=>ot().core.getNotes().some(r=>r.id!==n&&r.pitchUnits===t&&e>=r.startStep&&e<r.startStep+r.durationSteps),Kt=e=>Math.max(Math.round(e/ke)*ke,ke),qt=()=>t.lockedTracks?.includes(ot().config.id)??!1,Jt=e=>{e.preventDefault(),t.onResumeAudio?.();let{x:n,y:r,step:i,pitch:a}=k.getGridPosition(e),o=ot();if(Oe===`eraser`){if(qt())return;let e=Wt(n,r);e&&o.core.deleteNoteById(e.id);return}if(Oe===`select`){if(Je.length>0){let e=Wt(n,r);if(e&&Je.some(t=>t.id===e.id)){Ft=Je.map(e=>({id:e.id,startStep:e.startStep,pitch:e.pitchUnits})),Mt=!0,Nt=`move`,Pt={x:n,y:r,step:i,pitch:a},At=!1,It=null;return}Je=[],Ye=null}let e=Wt(n,r);e?(Je=[e],Ft=[{id:e.id,startStep:e.startStep,pitch:e.pitchUnits}],Mt=!0,Nt=`move`):(Je=[],Ye=null,Mt=!0,Nt=`rect`),Pt={x:n,y:r,step:i,pitch:a},At=!1;return}At=!1;let s=e.pointerType===`mouse`?0:Math.min(6,Math.max(0,Math.floor(O.keyHeight*.25))),c=Wt(n,r,s);if(c){Ut(c.pitchUnits);let{stepWidth:e}=O,t=k.getDrawOffset(),r=c.startStep*e-t.x,a=c.durationSteps*e;jt=n>=r+a-10&&n<=r+a+s?{noteId:c.id,mode:`resize`,dragOffsetStep:0,dragOffsetPitch:0,startStep:c.startStep,durationSteps:c.durationSteps,lastPreviewPitch:c.pitchUnits}:{noteId:c.id,mode:`move`,dragOffsetStep:i-c.startStep,dragOffsetPitch:0,startStep:c.startStep,durationSteps:c.durationSteps,lastPreviewPitch:c.pitchUnits},kt=!0;return}if(qt())return;let l=Math.floor(i/V)*V,u=l,d=u+V;if(!o.core.getNotes().some(e=>e.pitchUnits===a&&u<e.startStep+e.durationSteps&&d>e.startStep)){o.core.addNote(l,a,{noteLengthSteps:V}),Ut(a);let e=o.core.getNotes().find(e=>e.startStep===l&&e.pitchUnits===a);e&&(jt={noteId:e.id,mode:`move`,dragOffsetStep:0,dragOffsetPitch:0,startStep:e.startStep,durationSteps:e.durationSteps,lastPreviewPitch:e.pitchUnits},At=!0),kt=!0}},Yt=e=>{let t=ot();if(Oe===`pen`){if(!jt)return;let{step:n,pitch:r}=k.getGridPosition(e);if(At=!0,jt.mode===`move`){let e=n-jt.dragOffsetStep,i=Math.round(e/ke)*ke,a=$t(r-jt.dragOffsetPitch);if(Gt(i,a,jt.noteId))return;t.core.moveNote(jt.noteId,i,a),a!==jt.lastPreviewPitch&&(jt.lastPreviewPitch=a,Ut(a));return}let i=n-jt.startStep+1,a=Kt(i);t.core.resizeNote(jt.noteId,a),jt.durationSteps=a,V=a,q();return}if(Oe===`select`&&Mt&&Pt){Ht(e);let{x:n,y:r,step:i,pitch:a}=k.getGridPosition(e);if(Nt===`rect`){let e={x:Math.min(n,Pt.x),y:Math.min(r,Pt.y),width:Math.abs(n-Pt.x),height:Math.abs(r-Pt.y)};Ye=e;let{stepWidth:i,keyHeight:a,keyCount:o,pitchRangeStart:s,unitsPerRow:c=31}=O,l=k.getDrawOffset();Je=t.core.getNotes().filter(t=>{let n=t.startStep*i,r=(o-1-(t.pitchUnits-s)/c)*a,u=n-l.x,d=r-l.y,f=t.durationSteps*i;return u>=e.x&&u+f<=e.x+e.width&&d>=e.y&&d+a<=e.y+e.height}),q()}else{let e=i-Pt.step,n=Math.round(e/ke)*ke,r=a-Pt.pitch;if(n!==0||r!==0){At=!0,t.core.isBatchOperation||t.core.beginBatch();for(let e of Je){let i=Ft.find(t=>t.id===e.id);if(!i)continue;let a=$t(i.pitch+r);a>=0&&a<=3937&&t.core.moveNote(e.id,i.startStep+n,a)}if(Je.length>0){let e=Je[0],t=Ft.find(t=>t.id===e.id);if(t){let e=$t(t.pitch+r);e!==It&&e>=0&&e<=3937&&(It=e,Ut(e))}}}q()}}},Xt=()=>{if(Oe===`pen`&&jt){if(At){let e=ot();jt.mode===`move`?e.core.moveNoteEnd(jt.noteId):e.core.resizeNoteEnd(jt.noteId),kt=!0}jt=null,At=!1}Oe===`select`&&Mt&&(At&&Nt===`move`&&Je.length>0&&ot().core.endBatch(),Mt=!1,Pt=null,At=!1,It=null,(Nt!==`rect`||Je.length===0)&&(Ye=null),Ft=[],Bt(),q())},Zt=`settings`,Qt=`piano-roll-bg`,en=`dtm-piano-roll-bg-opacity`,tn=`dtm-piano-roll-bg-youtube-thumb`,nn=new Set([`image/jpeg`,`image/png`,`image/webp`,`image/bmp`]),rn=()=>new Promise((e,t)=>{let n=indexedDB.open(`dtm-daw-db`,1);n.onupgradeneeded=()=>n.result.createObjectStore(Zt),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)}),an=async e=>{let t=await rn();try{await new Promise((n,r)=>{let i=t.transaction(Zt,`readwrite`);i.objectStore(Zt).put(e,Qt),i.oncomplete=()=>n(),i.onerror=()=>r(i.error)})}finally{t.close()}},on=async()=>{let e=await rn();try{return await new Promise((t,n)=>{let r=e.transaction(Zt,`readonly`).objectStore(Zt).get(Qt);r.onsuccess=()=>t(r.result??null),r.onerror=()=>n(r.error)})}finally{e.close()}},sn=async()=>{let e=await rn();try{await new Promise((t,n)=>{let r=e.transaction(Zt,`readwrite`);r.objectStore(Zt).delete(Qt),r.oncomplete=()=>t(),r.onerror=()=>n(r.error)})}finally{e.close()}},cn=(e,t,n)=>{let r=Math.min(1,t/e.width,n/e.height),i=Math.max(1,Math.round(e.width*r)),a=Math.max(1,Math.round(e.height*r)),o=document.createElement(`canvas`);o.width=i,o.height=a;let s=o.getContext(`2d`);return s&&s.drawImage(e,0,0,i,a),new Promise((e,t)=>{o.toBlob(n=>n?e(n):t(Error(`toBlob failed`)),`image/jpeg`,.7)})},ln=null,un=null,dn=!1,fn=null,pn=e=>{w.rollContainer.style.setProperty(`--dtm-roll-bg-opacity`,String(e/100)),w.bgOpacityInput.value=String(e)},mn=()=>!!ln||dn&&!!un,hn=()=>{fn&&=(URL.revokeObjectURL(fn),null);let e=null;ln?(fn=URL.createObjectURL(ln),e=fn):dn&&(e=un),w.rollContainer.style.setProperty(`--dtm-roll-bg-image`,e?`url(${e})`:`none`),w.bgOpacityRow.classList.toggle(`dtm-hidden`,!e),w.bgRemoveBtn.classList.toggle(`dtm-hidden`,!ln),k.setBackgroundActive(mn()),q()},gn=e=>{ln=e,hn()},_n=e=>{un=null,hn(),e&&dn&&m(e).then(t=>{d(J.url)===e&&(un=t,hn())})},vn=()=>{let e=w.rollContainer.clientWidth||800,t=w.rollContainer.clientHeight||450;k?.destroy(),k=Qm(w.wrapper,e,t,O),k.setBackgroundActive(mn());let n=k.getGridCanvas();n.addEventListener(`pointerdown`,Jt),n.addEventListener(`dblclick`,e=>{if(e.preventDefault(),qt())return;let{x:t,y:n}=k.getGridPosition(e),r=ot(),i=Wt(t,n);i&&r.core.deleteNoteById(i.id)}),n.addEventListener(`wheel`,e=>{e.preventDefault(),je=T_(je+e.deltaY,0,wt()),H=T_(H+e.deltaX,0,Ct()),k.setDrawOffset(H,je),q()},{passive:!1}),n.addEventListener(`click`,()=>{kt&&=!1});let r=k.getHeaderCanvas();r.addEventListener(`click`,e=>{if(U===`playing`)return;let t=r.getBoundingClientRect(),n=e.clientX-t.left,i=Math.floor((n+H)/O.stepWidth);Me=Math.max(0,Math.floor(i/ke)*ke),U===`paused`&&(U=`stopped`,qn()),q()}),k.setDrawOffset(H,je),q()},yn=()=>{let e=k.getGridCanvas(),t=(H+e.width/2)/O.stepWidth;O.stepWidth=A*2*f_/100,w.zoomXLabel.textContent=`${A}%`,H=T_(t*O.stepWidth-e.width/2,0,Ct()),k.setDrawOffset(H,je),q()},bn=()=>{let e=k.getGridCanvas(),t=(je+e.height/2)/O.keyHeight;O.keyHeight=p_*j/100,w.zoomYLabel.textContent=`${j}%`,je=T_(t*O.keyHeight-e.height/2,0,wt()),k.setDrawOffset(H,je),q()},xn=()=>({zoomX:A,zoomY:j,decomposeChord:w.decomposeChordToggle.checked,ignoreChordHeavy:w.ignoreChordHeavyToggle.checked}),Sn=()=>t.onViewStateChange?.(xn()),Cn=(e,n,r,i,a,o)=>{let s=r/100*(i/127)*(N/100);t.onPlayNote?.({trackId:e,pitchUnits:n,velocity:i,volume:s,when:a,duration:o})},wn=Ec({getTracks:()=>W.map(e=>({id:e.config.id,volume:e.volume,notes:bt(e)})),getBpm:()=>M,getPlayStartStep:()=>Me,getDrumPattern:e=>mt(ge,_,e),getSoloTrackId:()=>Ne?Ee:null,getLoop:()=>P,getAudioTime:n,onPlayNote:e=>{if(nt.has(e.trackId))return;let n=W.findIndex(t=>t.config.id===e.trackId);n>=0&&Pe.has(n)&&t.singingVoices||(Be(e.trackId,e.when,e.duration),t.onPlayNote?.({...e,volume:e.volume*(N/100)}))},onPlayDrum:e=>{let n=e.velocity*(he/100)*(N/100);t.onPlayDrum?.({...e,velocity:n})},onTick:e=>{Ie=e;let t=k.getGridCanvas().width/O.stepWidth,n=H/O.stepWidth+t-4;if(Ie>n){let e=Math.max(1,Math.round(t/O.stepsPerBar)),n=H+e*O.stepsPerBar*O.stepWidth,r=Math.floor(Ie)*O.stepWidth;n>r&&(n=r),H=T_(n,0,Ct()),k.setDrawOffset(H,je)}else if(Ie<H/O.stepWidth){let e=Math.max(1,Math.round(t/O.stepsPerBar));H=T_(Math.floor(Ie/(e*O.stepsPerBar))*e*O.stepsPerBar*O.stepWidth,0,Ct()),k.setDrawOffset(H,je)}q()},getMinEndSec:()=>Nn(),onEnd:e=>{b?.stop(),e?(t.onScheduleFade?.(null),U=`paused`,Fe=Ie):(U=`stopped`,Ie=0),qn(),q()},stepsPerBar:O.stepsPerBar}),J={url:``,rangeStartSec:0,endSec:0,offsetSec:0,volume:a_,muted:!1},En=(e,t=!1)=>{w.audioStatus.textContent=e,w.audioStatus.classList.toggle(`dtm-hidden`,e===``),w.audioStatus.classList.toggle(`dtm-audio-note--warn`,t)},Dn=(e,t)=>{let n=e.durationSec>0?`\uFF08${u(e.durationSec)}\uFF09`:``,r=e.mode===`buffer`?`打ち込みと同じ時計で鳴らします`:e.mode===`youtube`?`YouTubeは同期が粗く、WAV書き出し・録音には入りません`:`直接再生のため、WAV書き出し・録音には入りません`,i=t?`／MML出力には含まれません`:``;return`${e.label}${n} \u2014 ${r}${i}`},On=()=>{w.audioOffsetTail.textContent=w.audioLeadSelect.value===`song`?`後に音源開始`:`後に打ち込み開始`},kn=()=>{w.audioStartInput.value=u(J.rangeStartSec),w.audioEndInput.value=J.endSec?u(J.endSec):``,w.audioLeadSelect.value=J.offsetSec<0?`song`:`audio`,w.audioOffsetInput.value=u(Math.abs(J.offsetSec)),On(),w.audioVolume.value=String(J.volume),w.audioVolumeLabel.textContent=`${J.volume}%`,w.audioMute.checked=J.muted},An=()=>{let e=l(w.audioStartInput.value);e!==null&&e>=0&&(J.rangeStartSec=e);let t=w.audioEndInput.value.trim();if(t===``)J.endSec=0;else{let e=l(t);e!==null&&e>0&&(J.endSec=e)}let n=l(w.audioOffsetInput.value);if(n!==null){let e=w.audioLeadSelect.value===`song`?-1:1;J.offsetSec=Math.abs(n)*e}},jn=0,Mn=e=>o({fromStep:e,offsetSec:J.offsetSec,rangeStartSec:J.rangeStartSec,secondsPerStep:60/M/o_}),Nn=()=>{let e=b?.getLoaded();if(!e)return 0;let t=Mn(jn),n=J.endSec>0?Math.min(J.endSec,e.durationSec||J.endSec):e.durationSec;return Math.max(0,n-t)},Fn=(e,t,n=0)=>{jn=e,b?.isLoaded()&&b.start({atTime:t-n,mediaSec:Mn(e)-n,rangeStartSec:J.rangeStartSec,endSec:J.endSec||void 0})},In=()=>{if(U!==`playing`||!b?.isLoaded())return;let e=s({fromStep:Ie,offsetSec:J.offsetSec});Fn(Ie,n()+.05+e,e)},Ln=async e=>{if(!b)return;Gn();let t=typeof e!=`string`,n=!t&&f(e);w.audioYoutubeRow.classList.toggle(`dtm-hidden`,!n),En(`読み込み中…`);try{let n=await b.load(e);J.url=t?``:e,b.setVolume(J.volume),b.setMuted(J.muted),w.audioYoutubeRow.classList.toggle(`dtm-hidden`,n.mode!==`youtube`),_n(n.mode===`youtube`?d(J.url):null),En(Dn(n,t))}catch(e){J.url=``,_n(null),w.audioYoutubeRow.classList.add(`dtm-hidden`),En(`\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F: ${e instanceof Error?e.message:String(e)}`,!0)}},zn=()=>{b?.clear(),J.url=``,_n(null),w.audioFileInput.value=``,w.audioUrlInput.value=``,w.audioYoutube.innerHTML=``,w.audioYoutubeRow.classList.add(`dtm-hidden`),En(``)},Bn=()=>{w.audioInfoBtn.addEventListener(`click`,()=>{K(`オーディオ同時再生の解説`,s_)}),w.audioFileInput.addEventListener(`change`,()=>{let e=w.audioFileInput.files?.[0];e&&(w.audioUrlInput.value=``,Ln(e))}),w.audioUrlLoadBtn.addEventListener(`click`,()=>{let e=w.audioUrlInput.value.trim();if(e){if(!uo(e)){En(`http / https のURLを入力してください`,!0);return}w.audioFileInput.value=``,Ln(e)}}),w.audioClearBtn.addEventListener(`click`,zn),w.audioVolume.addEventListener(`input`,()=>{let e=Number.parseInt(w.audioVolume.value,10);J.volume=Number.isFinite(e)?T_(e,0,100):a_,w.audioVolumeLabel.textContent=`${J.volume}%`,b?.setVolume(J.volume)}),w.audioMute.addEventListener(`change`,()=>{J.muted=w.audioMute.checked,b?.setMuted(J.muted)});for(let e of[w.audioStartInput,w.audioEndInput,w.audioOffsetInput])e.addEventListener(`change`,()=>{An(),kn(),In()});w.audioLeadSelect.addEventListener(`change`,()=>{On(),An(),kn(),In()})},Vn=0,Hn=async()=>{if(U===`playing`)return;let e=++Vn;await t.onResumeAudio?.();let r=U===`paused`?Fe:Me;jn=r,t.singingVoices?.reset();let i=at();Pe=new Set(i.keys());let a=60/M/48,o=t.singingVoices?[...i.values()].map(e=>{let t=W[e.trackId],n=[...t?.core.getNotes()??[]].sort((e,t)=>e.startStep-t.startStep),i=ws(e.syllables,n,{fromStep:r,secondsPerStep:a,gate:(e.gate??100)/100,octaveShiftUnits:(e.octave??0)*372});return{id:t?.config.id,model:e.model,volume:ao(e.volume??200),pan:mo(e.pan??64),vibrato:e.vibrato,reverbSend:(e.reverb??0)/100,delaySend:(e.delay??0)/100,gender:(e.gender??50)/100,breathiness:(e.breathiness??50)/100,tension:(e.tension??50)/100,octaveUnison:e.octaveUnison,notes:i}}):[],l=t.singingVoices,u=!!l&&o.some(e=>e.notes.length>0);if(u&&l){let e=Yc(w.rollContainer);$r(!0);try{Ue.size>0&&l.registerVoicebanks?.(Object.fromEntries([...Ue].map(([e,t])=>[e,t.url]))),await l.loadModels(o.map(e=>e.model)),await l.warm(o)}catch(e){console.warn(`[dtm] voice preload failed`,e)}finally{e.remove(),$r(!1)}}let d=b?.isLoaded()?s({fromStep:r,offsetSec:J.offsetSec}):0,f=Mn(r),p=!!b?.isLoaded()&&f>=J.rangeStartSec,m=null;if(p&&b){let t=b.getLoaded()?.mode===`youtube`;if(t&&(En(`音源が鳴り始めるのを待っています…`),$r(!0)),m=await b.startRolling({mediaSec:f-d,rangeStartSec:J.rangeStartSec,endSec:J.endSec||void 0}),t&&($r(!1),En(m?.measured?``:`音源が鳴り始めませんでした（ズレる場合は再生し直してください）`,!m?.measured)),Vn!==e)return}else if(b?.isLoaded()&&(await b.arm(f-d),Vn!==e))return;let h=c({rolled:m,mediaAtSongStart:f,now:n(),startDelaySec:Cc,fallbackPreRollSec:d});if(U!==`paused`){let e=k.getGridCanvas();H=T_(Me*O.stepWidth-e.width*.5,0,Ct()),k.setDrawOffset(H,je)}if(U=`playing`,wn.start(r,h),pe(),b?.isLoaded()){let e=wn.isActive()?wn.getStartTime():n()+Cc+h;jn=r,m?b.rebase({atTime:e,mediaSec:f},{snap:!0}):Fn(r,e,d)}if(t.onScheduleFade?.(Rn({anchor:wn.getStartTime(),fadeInSec:se,fadeOutSec:ce,atSongStart:r===0,durationSec:wn.getEndSec()})),u&&l){let e,t;if(P){let n=xt(),r=60/M/48;t=0,e=n*r}l.startStream(o,wn.getStartTime(),{isAudible:e=>!Ne||e.id===Ee,loopLengthSec:e,loopStartSec:t,onScheduled:(e,t,r)=>{e.id&&Be(e.id,r-n(),t.durationSec)}})}qn()},Un=()=>{U===`playing`&&(Vn++,Fe=Ie,wn.stop(),b?.stop(),t.singingVoices?.stopStream(),ze(),t.onScheduleFade?.(null),U=`paused`,me(),qn())},Wn=e=>{t.singingVoices&&e&&U===`playing`&&(Un(),Hn())},Gn=()=>{Vn++,wn.stop(),b?.stop(),t.singingVoices?.stopStream(),ze(),t.onScheduleFade?.(null),U=`stopped`,Ie=0,me(),qn(),q()},Kn=()=>{U===`playing`?Gn():Hn()},qn=()=>{let e=U===`playing`;w.playBtn.innerHTML=Y(e?`pause`:`play`),w.playBtn.classList.toggle(`dtm-play--stop`,e)},Jn=()=>{let e=ot().core;w.undoBtn.disabled=!e.canUndo(),w.redoBtn.disabled=!e.canRedo()},Yn=()=>{w.trackTabs.innerHTML=``,Le.clear();for(let[e,t]of W.entries()){let[n,r,i]=t.config.color,a=t.config.id===Ee,o=document.createElement(`button`),s=qe(t.lyricModel);o.className=`dtm-pill ${a?`dtm-pill--active`:``} ${s?`dtm-pill--vocal`:``}`,o.style.setProperty(`--dtm-pill-color`,`rgb(${n},${r},${i})`),s&&o.style.setProperty(`--dtm-pill-icon`,`url(${JSON.stringify(s)})`),o.title=`Track ${e+1}: ${t.config.name}`,o.setAttribute(`aria-label`,`Track ${e+1}: ${t.config.name}${a?` (選択中)`:``}${s?`（ボーカル選択中）`:``}`);let c=document.createElement(`span`);c.className=`dtm-pill__label`,c.textContent=String(e+1),o.appendChild(c),o.addEventListener(`click`,()=>Zn(t.config.id)),w.trackTabs.appendChild(o),Le.set(t.config.id,o)}},Xn=()=>{Yn();let e=ot(),n=W.findIndex(e=>e.config.id===Ee),[r,a,o]=e.config.color,s=w.trackBody.closest(`.dtm-panel`);if(s){s.classList.add(`dtm-panel--track`),s.style.setProperty(`--dtm-track-color`,`rgb(${r},${a},${o})`);let t=s.querySelector(`summary`);t&&(t.textContent=`\u500B\u5225\u30C8\u30E9\u30C3\u30AF\u8A2D\u5B9A\uFF08Track ${n+1}: ${e.config.name}\uFF09`)}w.trackBody.innerHTML=`
      <div class="dtm-row" data-dtm="track-vol-row">
        <span class="dtm-label">\u30D9\u30ED\u30B7\u30C6\u30A3</span>
        <input type="range" class="dtm-range dtm-grow" data-dtm="track-vol" min="0" max="127" value="${e.volume}">
        <span class="dtm-label" data-dtm="track-vol-label">${e.volume}</span>
      </div>
      <div class="dtm-row" data-dtm="track-octave-row">
        <span class="dtm-label">\u30AA\u30AF\u30BF\u30FC\u30D6</span>
        <select class="dtm-select" data-dtm="track-octave" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u306E\u767A\u97F3\u30AA\u30AF\u30BF\u30FC\u30D6\uFF08\u97F3\u6E90\u306E\u5F97\u610F\u97F3\u57DF\u306B\u5408\u308F\u305B\u308B\uFF09" title="\u30AA\u30AF\u30BF\u30FC\u30D6">
          <option value="2">+2 oct</option>
          <option value="1">+1 oct</option>
          <option value="0">\xB10 oct</option>
          <option value="-1">-1 oct</option>
          <option value="-2">-2 oct</option>
        </select>
        <span class="dtm-label">\u30E6\u30CB\u30BE\u30F3</span>
        <select class="dtm-select dtm-grow" data-dtm="track-octave-unison" aria-label="\u30AA\u30AF\u30BF\u30FC\u30D6\u30E6\u30CB\u30BE\u30F3\uFF08\u540C\u3058\u97F3\u3092\u4E0A/\u4E0B\u306B\u91CD\u306D\u308B\uFF09">
          <option value="none">\u306A\u3057</option>
          <option value="down">\u4E0B (-1oct)</option>
          <option value="up">\u4E0A (+1oct)</option>
          <option value="both">\u4E0A\u4E0B\u4E21\u65B9</option>
        </select>
      </div>
      <details class="dtm-advanced" data-dtm="track-fx-advanced" ${De?`open`:``}>
        <summary>\u8A73\u7D30\u8A2D\u5B9A\uFF08EQ\u30FB\u97F3\u5727\u30FB\u30B9\u30C6\u30EC\u30AA\u5E45\uFF09</summary>
        <div class="dtm-row">
          <span class="dtm-label">EQ\u4F4E\u57DF</span>
          <input type="range" class="dtm-range dtm-grow" data-dtm="track-eq-low" min="-12" max="12" step="1" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u306EEQ\u4F4E\u57DF\u30B2\u30A4\u30F3\uFF08dB\uFF09">
          <span class="dtm-label" data-dtm="track-eq-low-label"></span>
          <button class="dtm-infobtn" data-dtm="track-eq-info" title="EQ\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
        <div class="dtm-row">
          <span class="dtm-label">EQ\u4E2D\u57DF</span>
          <input type="range" class="dtm-range dtm-grow" data-dtm="track-eq-mid" min="-12" max="12" step="1" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u306EEQ\u4E2D\u57DF\u30B2\u30A4\u30F3\uFF08dB\uFF09">
          <span class="dtm-label" data-dtm="track-eq-mid-label"></span>
        </div>
        <div class="dtm-row">
          <span class="dtm-label">EQ\u9AD8\u57DF</span>
          <input type="range" class="dtm-range dtm-grow" data-dtm="track-eq-high" min="-12" max="12" step="1" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u306EEQ\u9AD8\u57DF\u30B2\u30A4\u30F3\uFF08dB\uFF09">
          <span class="dtm-label" data-dtm="track-eq-high-label"></span>
        </div>
        <div class="dtm-row">
          <span class="dtm-label">\u97F3\u5727\u5F37\u5316</span>
          <input type="range" class="dtm-range dtm-grow" data-dtm="track-comp" min="0" max="100" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u306E\u30B3\u30F3\u30D7\u30EC\u30C3\u30B5\u30FC\u91CF\uFF08\u97F3\u5727\u5F37\u5316\uFF09">
          <span class="dtm-label" data-dtm="track-comp-label"></span>
          <button class="dtm-infobtn" data-dtm="track-comp-info" title="\u97F3\u5727\u5F37\u5316\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
        <div class="dtm-row">
          <span class="dtm-label">\u30B9\u30C6\u30EC\u30AA\u5E45</span>
          <input type="range" class="dtm-range dtm-grow" data-dtm="track-width" min="0" max="200" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u306E\u30B9\u30C6\u30EC\u30AA\u5E45\uFF08100=\u539F\u97F3\u30010=\u30E2\u30CE\u30E9\u30EB\uFF09">
          <span class="dtm-label" data-dtm="track-width-label"></span>
          <button class="dtm-infobtn" data-dtm="track-width-info" title="\u30B9\u30C6\u30EC\u30AA\u5E45\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
        <div class="dtm-row">
          <span class="dtm-label">\u5B9A\u4F4D</span>
          <input type="range" class="dtm-range dtm-grow" data-dtm="track-pan" min="0" max="127" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u306E\u5DE6\u53F3\u306E\u5B9A\u4F4D\uFF0864=\u4E2D\u592E\u30010=\u5DE6\u3044\u3063\u3071\u3044\u3001127=\u53F3\u3044\u3063\u3071\u3044\uFF09">
          <span class="dtm-label" data-dtm="track-pan-label"></span>
          <button class="dtm-infobtn" data-dtm="track-pan-info" title="\u5B9A\u4F4D\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
        <div class="dtm-row">
          <span class="dtm-label">\u30EA\u30D0\u30FC\u30D6\u9001\u308A</span>
          <input type="range" class="dtm-range dtm-grow" data-dtm="track-reverb-send" min="0" max="100" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u306E\u30DE\u30B9\u30BF\u30EA\u30D0\u30FC\u30D6\u3078\u306E\u9001\u308A\u91CF\uFF080=\u639B\u304B\u3089\u306A\u3044\uFF09">
          <span class="dtm-label" data-dtm="track-reverb-send-label"></span>
          <button class="dtm-infobtn" data-dtm="track-reverb-send-info" title="\u30EA\u30D0\u30FC\u30D6\u9001\u308A\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
        <div class="dtm-row">
          <span class="dtm-label">\u30C7\u30A3\u30EC\u30A4\u9001\u308A</span>
          <input type="range" class="dtm-range dtm-grow" data-dtm="track-delay-send" min="0" max="100" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u306E\u30DE\u30B9\u30BF\u30C7\u30A3\u30EC\u30A4\u3078\u306E\u9001\u308A\u91CF\uFF080=\u639B\u304B\u3089\u306A\u3044\uFF09">
          <span class="dtm-label" data-dtm="track-delay-send-label"></span>
          <button class="dtm-infobtn" data-dtm="track-delay-send-info" title="\u30C7\u30A3\u30EC\u30A4\u9001\u308A\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
        </div>
      </details>`,w.trackBody.querySelector(`[data-dtm="track-fx-advanced"]`).addEventListener(`toggle`,e=>{De=e.target.open,Fp(`track-fx-advanced`,De)});let c=w.trackBody.querySelector(`[data-dtm="track-vol"]`),l=w.trackBody.querySelector(`[data-dtm="track-vol-label"]`);c.addEventListener(`input`,()=>{e.volume=Number.parseInt(c.value,10),e.core.setVolume(e.volume),l.textContent=String(e.volume),$e(e)});let u=()=>{c.disabled=!!e.lyricModel,c.title=e.lyricModel?`歌詞モードのときはベロシティが再生に反映されません（声量で調整してください）`:``};u();let d=w.trackBody.querySelector(`[data-dtm="track-eq-low"]`),f=w.trackBody.querySelector(`[data-dtm="track-eq-low-label"]`),p=w.trackBody.querySelector(`[data-dtm="track-eq-mid"]`),m=w.trackBody.querySelector(`[data-dtm="track-eq-mid-label"]`),g=w.trackBody.querySelector(`[data-dtm="track-eq-high"]`),_=w.trackBody.querySelector(`[data-dtm="track-eq-high-label"]`),v=w.trackBody.querySelector(`[data-dtm="track-eq-info"]`),b=e=>e>0?`+${e}dB`:`${e}dB`;d.value=String(e.trackEqLow),f.textContent=b(e.trackEqLow),p.value=String(e.trackEqMid),m.textContent=b(e.trackEqMid),g.value=String(e.trackEqHigh),_.textContent=b(e.trackEqHigh),d.addEventListener(`input`,()=>{e.trackEqLow=Number.parseInt(d.value,10),f.textContent=b(e.trackEqLow),t.onTrackEqLowChange?.(e.config.id,e.trackEqLow),$e(e)}),p.addEventListener(`input`,()=>{e.trackEqMid=Number.parseInt(p.value,10),m.textContent=b(e.trackEqMid),t.onTrackEqMidChange?.(e.config.id,e.trackEqMid),$e(e)}),g.addEventListener(`input`,()=>{e.trackEqHigh=Number.parseInt(g.value,10),_.textContent=b(e.trackEqHigh),t.onTrackEqHighChange?.(e.config.id,e.trackEqHigh),$e(e)}),v.addEventListener(`click`,()=>{K(`EQ（イコライザー）の解説`,Kg)});let x=w.trackBody.querySelector(`[data-dtm="track-comp"]`),S=w.trackBody.querySelector(`[data-dtm="track-comp-label"]`),T=w.trackBody.querySelector(`[data-dtm="track-width"]`),E=w.trackBody.querySelector(`[data-dtm="track-width-label"]`),D=w.trackBody.querySelector(`[data-dtm="track-comp-info"]`),O=w.trackBody.querySelector(`[data-dtm="track-width-info"]`);x.value=String(e.trackCompression),S.textContent=`${e.trackCompression}%`,T.value=String(e.trackWidth),E.textContent=`${e.trackWidth}%`,x.addEventListener(`input`,()=>{e.trackCompression=Number.parseInt(x.value,10),S.textContent=`${e.trackCompression}%`,t.onTrackCompressionChange?.(e.config.id,e.trackCompression),$e(e)}),T.addEventListener(`input`,()=>{e.trackWidth=Number.parseInt(T.value,10),E.textContent=`${e.trackWidth}%`,t.onTrackWidthChange?.(e.config.id,e.trackWidth),$e(e)}),D.addEventListener(`click`,()=>{K(`音圧強化の解説`,qg)}),O.addEventListener(`click`,()=>{K(`ステレオ幅の解説`,Jg)});let k=w.trackBody.querySelector(`[data-dtm="track-pan"]`),A=w.trackBody.querySelector(`[data-dtm="track-pan-label"]`),j=w.trackBody.querySelector(`[data-dtm="track-pan-info"]`),M=e=>e===64?`C`:e<64?`L${64-e}`:`R${e-64}`;k.value=String(e.trackPan),A.textContent=M(e.trackPan),k.addEventListener(`input`,()=>{e.trackPan=Number.parseInt(k.value,10),A.textContent=M(e.trackPan),t.onTrackPanChange?.(e.config.id,e.trackPan),$e(e)}),j.addEventListener(`click`,()=>{K(`定位の解説`,Yg)});let N=w.trackBody.querySelector(`[data-dtm="track-reverb-send"]`),ee=w.trackBody.querySelector(`[data-dtm="track-reverb-send-label"]`),P=w.trackBody.querySelector(`[data-dtm="track-reverb-send-info"]`);N.value=String(e.trackReverbSend),ee.textContent=`${e.trackReverbSend}%`,N.addEventListener(`input`,()=>{e.trackReverbSend=Number.parseInt(N.value,10),ee.textContent=`${e.trackReverbSend}%`,t.onTrackReverbSendChange?.(e.config.id,e.trackReverbSend),$e(e)}),P.addEventListener(`click`,()=>{K(`リバーブ送りの解説`,Xg)});let F=w.trackBody.querySelector(`[data-dtm="track-delay-send"]`),te=w.trackBody.querySelector(`[data-dtm="track-delay-send-label"]`),ne=w.trackBody.querySelector(`[data-dtm="track-delay-send-info"]`);F.value=String(e.trackDelaySend),te.textContent=`${e.trackDelaySend}%`,F.addEventListener(`input`,()=>{e.trackDelaySend=Number.parseInt(F.value,10),te.textContent=`${e.trackDelaySend}%`,t.onTrackDelaySendChange?.(e.config.id,e.trackDelaySend),$e(e)}),ne.addEventListener(`click`,()=>{K(`ディレイ送りの解説`,Zg)});let re=document.createElement(`span`);re.className=`dtm-label`,re.textContent=`楽器`;let I=document.createElement(`select`);I.className=`dtm-select dtm-grow dtm-select--half`;let ie=document.createElement(`option`);ie.value=``,ie.textContent=`デフォルト（プリセット）`,I.appendChild(ie),[`ピアノ`,`クロマティックパーカッション`,`オルガン`,`ギター`,`ベース`,`ストリングス`,`アンサンブル`,`ブラス`,`リード（木管）`,`パイプ`,`シンセリード`,`シンセパッド`,`シンセエフェクト`,`エスニック`,`パーカッシブ`,`サウンドエフェクト`].forEach((e,t)=>{let n=document.createElement(`optgroup`);n.label=e;for(let e=0;e<8;e++){let r=i[t*8+e];if(!r)break;let a=document.createElement(`option`);a.value=r,a.textContent=r,n.appendChild(a)}I.appendChild(n)}),I.value=E_(e.trackInstrument);let ae=()=>{I.disabled=!!e.lyricModel,I.title=e.lyricModel?`歌詞モードのときは楽器を個別指定できません`:``};ae(),I.addEventListener(`change`,()=>{e.trackInstrument=I.value,e.composeSlot=null;let n=W.indexOf(e);t.onTrackInstrumentChange?.(n,e.trackInstrument),$e(e)}),w.trackBody.querySelector(`[data-dtm="track-vol-row"]`).prepend(re,I);let oe=w.trackBody.querySelector(`[data-dtm="track-octave-row"]`),L=w.trackBody.querySelector(`[data-dtm="track-octave"]`);L.value=String(e.trackOctave);let se=()=>{oe.classList.toggle(`dtm-hidden`,!!e.lyricModel.trim())};se(),L.addEventListener(`change`,()=>{e.trackOctave=Number.parseInt(L.value,10)||0,$e(e)});let ce=w.trackBody.querySelector(`[data-dtm="track-octave-unison"]`);if(ce.value=e.trackOctaveUnison,ce.addEventListener(`change`,()=>{e.trackOctaveUnison=ce.value,$e(e)}),h||e.config.id!==`chord`){let t=document.createElement(`div`);t.className=`dtm-row`,t.style.flexDirection=`column`,t.style.alignItems=`stretch`,t.innerHTML=`
      <div class="dtm-row" data-dtm="lyric-head">
        <span class="dtm-label">\u266A UTAU</span>
        <select class="dtm-select dtm-select--half" data-dtm="lyric-model" aria-label="\u6B4C\u5531\u30E2\u30C7\u30EB"></select>
        <img class="dtm-lyric-icon dtm-hidden" data-dtm="lyric-icon" width="20" height="20" alt="" draggable="false">
        <span class="dtm-label" data-dtm="lyric-count"></span>
        <div class="dtm-row dtm-grow" data-dtm="lyric-vol-group">
          <span class="dtm-label">\u58F0\u91CF</span>
          <input type="range" class="dtm-range dtm-grow" data-dtm="lyric-vol" min="0" max="400" aria-label="\u6B4C\u5531\u306E\u58F0\u91CF\uFF08100=\u7B49\u500D\u3001100\u8D85\u3067\u30D6\u30FC\u30B9\u30C8\u3001\u65E2\u5B9A200\uFF09">
          <span class="dtm-label" data-dtm="lyric-vol-label"></span>
        </div>
      </div>
      <div class="dtm-row dtm-hidden" data-dtm="lyric-terms" style="font-size:10px;gap:4px;color:var(--dtm-warn)">
        <span>\u4F7F\u7528\u6642\u306B\u306F</span>
        <a data-dtm="lyric-terms-link" target="_blank" rel="noopener" style="color:var(--dtm-primary);text-decoration:underline"></a>
        <span>\u306E\u5229\u7528\u898F\u7D04\u306B\u5F93\u3063\u3066\u304F\u3060\u3055\u3044</span>
      </div>
      <div class="dtm-row dtm-hidden" data-dtm="lyric-custom" style="flex-direction:column;align-items:stretch;gap:4px">
        <div class="dtm-row" style="justify-content: space-between; align-items: center;">
          <a data-dtm="lyric-custom-conv-link" href="https://onjmin.github.io/koe/demo/" target="_blank" rel="noopener" style="font-size:11px;color:var(--dtm-primary);text-decoration:underline">UTAU\u97F3\u6E90(zip)\u3092.koe\u306B\u5909\u63DB</a>
          <button class="dtm-btn dtm-btn--ghost dtm-btn--xs" data-dtm="lyric-custom-guide">\u4F7F\u3044\u65B9\u30AC\u30A4\u30C9</button>
        </div>
        <input type="url" class="dtm-input" data-dtm="lyric-custom-src" placeholder="\u97F3\u58F0URL\uFF08https://\u301C.koe\uFF09" aria-label="\u30AB\u30B9\u30BF\u30E0\u97F3\u58F0\uFF08.koe\uFF09\u306EURL">
        <input type="url" class="dtm-input" data-dtm="lyric-custom-icon" placeholder="\u30A2\u30A4\u30B3\u30F3\u753B\u50CFURL\uFF08\u4EFB\u610F\uFF09" aria-label="\u30AB\u30B9\u30BF\u30E0\u97F3\u58F0\u306E\u30A2\u30A4\u30B3\u30F3\u753B\u50CFURL">
        <div class="dtm-row">
          <span class="dtm-label dtm-grow" data-dtm="lyric-custom-note" style="color:var(--dtm-warn)"></span>
          <button class="dtm-btn dtm-btn--primary" data-dtm="lyric-custom-apply">\u8FFD\u52A0</button>
        </div>
      </div>
      <div class="dtm-row" data-dtm="lyric-body" style="flex-direction:column;align-items:stretch">
        <details class="dtm-advanced" data-dtm="lyric-advanced" ${B?`open`:``}>
          <summary>\u8A73\u7D30\u8A2D\u5B9A</summary>
          <div class="dtm-row">
            <span class="dtm-label">\u30AA\u30AF\u30BF\u30FC\u30D6</span>
            <select class="dtm-select" data-dtm="lyric-octave" aria-label="\u30AA\u30AF\u30BF\u30FC\u30D6\uFF08\u97F3\u6E90\u306E\u5F97\u610F\u97F3\u57DF\u306B\u5408\u308F\u305B\u308B\uFF09" title="\u30AA\u30AF\u30BF\u30FC\u30D6">
              <option value="2">+2 oct</option>
              <option value="1">+1 oct</option>
              <option value="0">\xB10 oct</option>
              <option value="-1">-1 oct</option>
              <option value="-2">-2 oct</option>
            </select>
          </div>
          <div class="dtm-row">
            <span class="dtm-label">\u5B9A\u4F4D</span>
            <input type="range" class="dtm-range dtm-grow" data-dtm="lyric-pan" min="0" max="127" aria-label="\u6B4C\u5531\u306E\u30B9\u30C6\u30EC\u30AA\u5B9A\u4F4D\uFF08\u5DE6\u53F3\uFF09">
            <span class="dtm-label" data-dtm="lyric-pan-label"></span>
          </div>
          <div class="dtm-row">
            <span class="dtm-label">\u30EA\u30D0\u30FC\u30D6\u9001\u308A</span>
            <input type="range" class="dtm-range dtm-grow" data-dtm="lyric-reverb" min="0" max="100" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u304B\u3089\u30DE\u30B9\u30BF\u30EA\u30D0\u30FC\u30D6\u3078\u9001\u308B\u91CF\uFF08\u30DE\u30B9\u30BF\u306E\u30EA\u30D0\u30FC\u30D6\u3064\u307E\u307F\u304C0%\u3060\u3068\u7121\u97F3\uFF09">
            <span class="dtm-label" data-dtm="lyric-reverb-label"></span>
            <button class="dtm-infobtn" data-dtm="lyric-reverb-info" title="\u30EA\u30D0\u30FC\u30D6\u9001\u308A\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
          </div>
          <div class="dtm-row">
            <span class="dtm-label">\u30C7\u30A3\u30EC\u30A4\u9001\u308A</span>
            <input type="range" class="dtm-range dtm-grow" data-dtm="lyric-delay" min="0" max="100" aria-label="\u3053\u306E\u30C8\u30E9\u30C3\u30AF\u304B\u3089\u30DE\u30B9\u30BF\u30C7\u30A3\u30EC\u30A4\u3078\u9001\u308B\u91CF\uFF08\u30DE\u30B9\u30BF\u306E\u30C7\u30A3\u30EC\u30A4\u3064\u307E\u307F\u304C0%\u3060\u3068\u7121\u97F3\uFF09">
            <span class="dtm-label" data-dtm="lyric-delay-label"></span>
            <button class="dtm-infobtn" data-dtm="lyric-delay-info" title="\u30C7\u30A3\u30EC\u30A4\u9001\u308A\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
          </div>
          <div class="dtm-row">
            <span class="dtm-label">\u30B8\u30A7\u30F3\u30C0\u30FC</span>
            <input type="range" class="dtm-range dtm-grow" data-dtm="lyric-gender" min="0" max="100" aria-label="\u30D5\u30A9\u30EB\u30DE\u30F3\u30C8/\u30B8\u30A7\u30F3\u30C0\u30FC\u30D5\u30A1\u30AF\u30BF\u30FC\uFF08koe\u97F3\u6E90\u9650\u5B9A\uFF09">
            <span class="dtm-label" data-dtm="lyric-gender-label"></span>
            <button class="dtm-infobtn" data-dtm="lyric-gender-info" title="\u30B8\u30A7\u30F3\u30C0\u30FC\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
          </div>
          <div class="dtm-row">
            <span class="dtm-label">\u30D6\u30EC\u30B7\u30CD\u30B9</span>
            <input type="range" class="dtm-range dtm-grow" data-dtm="lyric-breathiness" min="0" max="100" aria-label="\u30D6\u30EC\u30B7\u30CD\u30B9\uFF08\u606F\u6210\u5206\u3001koe\u97F3\u6E90\u9650\u5B9A\uFF09">
            <span class="dtm-label" data-dtm="lyric-breathiness-label"></span>
            <button class="dtm-infobtn" data-dtm="lyric-breathiness-info" title="\u30D6\u30EC\u30B7\u30CD\u30B9\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
          </div>
          <div class="dtm-row">
            <span class="dtm-label">\u30C6\u30F3\u30B7\u30E7\u30F3</span>
            <input type="range" class="dtm-range dtm-grow" data-dtm="lyric-tension" min="0" max="100" aria-label="\u30C6\u30F3\u30B7\u30E7\u30F3\uFF08\u5F35\u308A/\u529B\u5F37\u3055\u3001koe\u97F3\u6E90\u9650\u5B9A\uFF09">
            <span class="dtm-label" data-dtm="lyric-tension-label"></span>
            <button class="dtm-infobtn" data-dtm="lyric-tension-info" title="\u30C6\u30F3\u30B7\u30E7\u30F3\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
          </div>
          <div class="dtm-row">
            <span class="dtm-label" style="display:inline-flex;align-items:center;gap:2px">
              <input type="checkbox" data-dtm="lyric-vibrato" aria-label="\u81EA\u52D5\u30D3\u30D6\u30E9\u30FC\u30C8">\u30D3\u30D6\u30E9\u30FC\u30C8
            </span>
            <button class="dtm-infobtn" data-dtm="lyric-vibrato-info" title="\u81EA\u52D5\u30D3\u30D6\u30E9\u30FC\u30C8\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
          </div>
          <div class="dtm-row">
            <span class="dtm-label">\u30AA\u30AF\u30BF\u30FC\u30D6\u30E6\u30CB\u30BE\u30F3</span>
            <select class="dtm-select dtm-grow" data-dtm="lyric-octave-unison" aria-label="\u30AA\u30AF\u30BF\u30FC\u30D6\u30E6\u30CB\u30BE\u30F3\uFF08\u3082\u30461\u58F0\u3092\u4E0A/\u4E0B\u306B\u91CD\u306D\u308B\uFF09">
              <option value="none">\u306A\u3057</option>
              <option value="down">\u4E0B (-1oct)</option>
              <option value="up">\u4E0A (+1oct)</option>
              <option value="both">\u4E0A\u4E0B\u4E21\u65B9</option>
            </select>
            <button class="dtm-infobtn" data-dtm="lyric-octave-unison-info" title="\u30AA\u30AF\u30BF\u30FC\u30D6\u30E6\u30CB\u30BE\u30F3\u306E\u89E3\u8AAC">${Y(`info`,12)}</button>
          </div>
        </details>
        <div class="dtm-row">
          <span class="dtm-label dtm-grow">\u6B4C\u8A5E</span>
          <button class="dtm-infobtn" data-dtm="lyric-input-info" title="\u6B4C\u8A5E\u306E\u66F8\u304D\u65B9\uFF08\u30FC\u30FB\u301C\u30FB\u3063\u30FB_\u30FB\u3001\u30FB\u300C\u300D\u306E\u610F\u5473\uFF09">${Y(`info`,12)}</button>
        </div>
        <textarea class="dtm-textarea" data-dtm="lyric-input" rows="2" placeholder="\u3072\u3089\u304C\u306A\u30FB\u30AB\u30BF\u30AB\u30CA\u3067\u6B4C\u8A5E\uFF08\u4F8B: \u3069\u308C\u307F\u3075\u3041\u305D\u3089\u3057\u3069\uFF09&#10;\u30FC=\u4F38\u3070\u3059 \u301C=\u3057\u3083\u304F\u308A \u3063=\u8A70\u307E\u308B _=\u6B4C\u308F\u306A\u3044 \u3001=\u30D6\u30EC\u30B9 \u300C\u2026\u300D=\u8A9E\u308A\uFF08\u8AAD\u307F\u4E0A\u3052\uFF09"></textarea>
      </div>`,w.trackBody.appendChild(t),t.querySelector(`[data-dtm="lyric-advanced"]`).addEventListener(`toggle`,e=>{B=e.target.open,Fp(`lyric-advanced`,B)});let n=t.querySelector(`[data-dtm="lyric-model"]`),r=t.querySelector(`[data-dtm="lyric-octave"]`),i=t.querySelector(`[data-dtm="lyric-icon"]`),a=t.querySelector(`[data-dtm="lyric-body"]`),o=t.querySelector(`[data-dtm="lyric-vol-group"]`),s=t.querySelector(`[data-dtm="lyric-input"]`);t.querySelector(`[data-dtm="lyric-input-info"]`).addEventListener(`click`,()=>{K(`歌詞の書き方`,Ng)});let c=t.querySelector(`[data-dtm="lyric-count"]`),l=t.querySelector(`[data-dtm="lyric-vol"]`),d=t.querySelector(`[data-dtm="lyric-vol-label"]`),f=t.querySelector(`[data-dtm="lyric-pan"]`),p=t.querySelector(`[data-dtm="lyric-pan-label"]`),m=t.querySelector(`[data-dtm="lyric-reverb"]`),h=t.querySelector(`[data-dtm="lyric-reverb-label"]`);t.querySelector(`[data-dtm="lyric-reverb-info"]`).addEventListener(`click`,()=>{K(`リバーブ送りの解説`,Bg)});let g=t.querySelector(`[data-dtm="lyric-delay"]`),_=t.querySelector(`[data-dtm="lyric-delay-label"]`);t.querySelector(`[data-dtm="lyric-delay-info"]`).addEventListener(`click`,()=>{K(`ディレイ送りの解説`,Vg)});let v=t.querySelector(`[data-dtm="lyric-gender"]`),y=t.querySelector(`[data-dtm="lyric-gender-label"]`);t.querySelector(`[data-dtm="lyric-gender-info"]`).addEventListener(`click`,()=>{K(`ジェンダーの解説`,Lg)});let b=t.querySelector(`[data-dtm="lyric-breathiness"]`),x=t.querySelector(`[data-dtm="lyric-breathiness-label"]`);t.querySelector(`[data-dtm="lyric-breathiness-info"]`).addEventListener(`click`,()=>{K(`ブレシネスの解説`,Rg)});let S=t.querySelector(`[data-dtm="lyric-tension"]`),C=t.querySelector(`[data-dtm="lyric-tension-label"]`);t.querySelector(`[data-dtm="lyric-tension-info"]`).addEventListener(`click`,()=>{K(`テンションの解説`,zg)});let T=t.querySelector(`[data-dtm="lyric-vibrato"]`);t.querySelector(`[data-dtm="lyric-vibrato-info"]`).addEventListener(`click`,()=>{K(`自動ビブラート解説`,Pg)});let E=t.querySelector(`[data-dtm="lyric-octave-unison"]`);t.querySelector(`[data-dtm="lyric-octave-unison-info"]`).addEventListener(`click`,()=>{K(`オクターブユニゾン解説`,Ig)});let D=t.querySelector(`[data-dtm="lyric-terms"]`),O=t.querySelector(`[data-dtm="lyric-terms-link"]`),k=t.querySelector(`[data-dtm="lyric-custom"]`),A=t.querySelector(`[data-dtm="lyric-custom-src"]`),j=t.querySelector(`[data-dtm="lyric-custom-icon"]`),M=t.querySelector(`[data-dtm="lyric-custom-guide"]`),N=t.querySelector(`[data-dtm="lyric-custom-note"]`),ee=t.querySelector(`[data-dtm="lyric-custom-apply"]`),P=e=>e===64?`C`:e<64?`L${64-e}`:`R${e-64}`,F=(e,t,n)=>{let r=document.createElement(`option`);r.value=t,r.textContent=n,e.appendChild(r)};F(n,``,`ボーカルなし`);for(let e of Do(b_)){let t=document.createElement(`optgroup`);t.label=e.label;for(let n of e.models)F(t,n.value,x_(n.value,Ue));n.appendChild(t)}let te=document.createElement(`optgroup`);te.label=`カスタム音声`;for(let[e,t]of Ue)F(te,e,t.label??e);F(te,S_,`カスタム音声を追加…`),e.lyricModel&&!__.includes(e.lyricModel)&&!Ue.has(e.lyricModel)&&F(te,e.lyricModel,x_(e.lyricModel,Ue)),n.appendChild(te),n.value=e.lyricModel,r.value=String(e.vocalOctave),s.value=e.lyrics,l.value=String(e.vocalVolume),d.textContent=String(e.vocalVolume),f.value=String(e.vocalPan),p.textContent=P(e.vocalPan),m.value=String(e.vocalReverb),h.textContent=`${e.vocalReverb}%`,g.value=String(e.vocalDelay),_.textContent=`${e.vocalDelay}%`,v.value=String(e.vocalGender),y.textContent=`${e.vocalGender}`,b.value=String(e.vocalBreathiness),x.textContent=`${e.vocalBreathiness}`,S.value=String(e.vocalTension),C.textContent=`${e.vocalTension}`,T.checked=e.vocalVibrato,E.value=e.vocalOctaveUnison;let ne=()=>{let t=Ya(s.value),n=t.length,r=t.filter(e=>e.kind===`speak`).length;c.textContent=e.lyricModel&&n>0?`${n}\u97F3\u7BC0${r>0?`\uFF08\u8A9E\u308A${r}\uFF09`:``}`:``},re=()=>{if(Ue.has(e.lyricModel)){D.classList.add(`dtm-hidden`);return}let t=e.lyricModel?ko[e.lyricModel]:void 0;if(t){let n=x_(e.lyricModel,Ue);O.textContent=`${n}UTAU\u97F3\u6E90`,O.href=t,D.classList.remove(`dtm-hidden`)}else D.classList.add(`dtm-hidden`)},I=()=>{if(!e.lyricModel){i.removeAttribute(`src`),i.classList.add(`dtm-hidden`);return}let t=Ue.get(e.lyricModel);if(t!==void 0){let e=t.iconUrl||Qc;i.src=e,i.classList.remove(`dtm-hidden`),i.onerror=()=>{i.onerror=null,i.src=Qc};return}i.onerror=null;let n=Oo[e.lyricModel.toLowerCase()],r=n?Zc[n]:void 0;r?(i.src=r,i.classList.remove(`dtm-hidden`)):(i.removeAttribute(`src`),i.classList.add(`dtm-hidden`))},ie=()=>{a.style.display=e.lyricModel?``:`none`,o.style.display=e.lyricModel?``:`none`,ne(),re(),I()};ie(),n.addEventListener(`change`,()=>{if(n.value===S_){N.textContent=``,k.classList.remove(`dtm-hidden`),i.removeAttribute(`src`),i.classList.add(`dtm-hidden`),D.classList.add(`dtm-hidden`);return}k.classList.add(`dtm-hidden`),e.lyricModel=n.value,ie(),ae(),se(),u(),q(),et(e),Wn(e.lyricModel),Yn()}),M.addEventListener(`click`,()=>{K(`カスタム音声(.koe)の使い方`,l_)}),ee.addEventListener(`click`,()=>{let t=A.value.trim();if(!uo(t)){N.textContent=`音声URLが不正です（http/httpsのみ・2048文字まで）`;return}let n=j.value.trim(),r=uo(n)?n:``,i=[...Ue.values()].find(e=>e.url===t),a;if(i)a=i.key;else{let e=w_(t);if(e&&!__.includes(e)){if(!Ue.has(e))a=e;else{let t=2;for(;Ue.has(`${e}${t}`);)t++;a=`${e}${t}`}}else a=Ke()}We({key:a,iconUrl:r||(i?.iconUrl??``),url:t,label:i?.label}),e.lyricModel=a,q(),et(e),Xn(),Wn(a)}),r.addEventListener(`change`,()=>{e.vocalOctave=Number.parseInt(r.value,10),et(e)}),T.addEventListener(`change`,()=>{e.vocalVibrato=T.checked,et(e)}),E.addEventListener(`change`,()=>{e.vocalOctaveUnison=E.value,et(e)}),s.addEventListener(`input`,()=>{e.lyrics=s.value,ne(),q(),et(e)}),l.addEventListener(`input`,()=>{e.vocalVolume=Number.parseInt(l.value,10),d.textContent=l.value,et(e)}),f.addEventListener(`input`,()=>{e.vocalPan=Number.parseInt(f.value,10),p.textContent=P(e.vocalPan),et(e)}),p.style.cursor=`pointer`,p.title=`タップで中央(C)へ`,p.addEventListener(`click`,()=>{e.vocalPan=64,f.value=`64`,p.textContent=P(64),et(e)}),m.addEventListener(`input`,()=>{e.vocalReverb=Number.parseInt(m.value,10),h.textContent=`${e.vocalReverb}%`,et(e)}),g.addEventListener(`input`,()=>{e.vocalDelay=Number.parseInt(g.value,10),_.textContent=`${e.vocalDelay}%`,et(e)}),v.addEventListener(`input`,()=>{e.vocalGender=Number.parseInt(v.value,10),y.textContent=`${e.vocalGender}`,et(e)}),b.addEventListener(`input`,()=>{e.vocalBreathiness=Number.parseInt(b.value,10),x.textContent=`${e.vocalBreathiness}`,et(e)}),S.addEventListener(`input`,()=>{e.vocalTension=Number.parseInt(S.value,10),C.textContent=`${e.vocalTension}`,et(e)})}if(e.config.id===`chord`&&y){let t=document.createElement(`div`);t.className=`dtm-row`,t.style.flexDirection=`column`,t.style.alignItems=`stretch`,t.innerHTML=`
        <div class="dtm-row" style="justify-content: space-between; align-items: center;">
          <div style="display: inline-flex; align-items: center; gap: 6px;">
            <span class="dtm-label">\u548C\u97F3</span>
            <button class="dtm-infobtn" data-dtm="chord-info" title="\u30B3\u30FC\u30C9\u9032\u884C\u306E\u66F8\u304D\u65B9\u89E3\u8AAC">${Y(`info`,12)}</button>
            ${C?`<button class="dtm-btn dtm-btn--ghost" data-dtm="chord-search" title="コード進行検索" style="min-height: 24px; min-width: auto; height: 24px; padding: 0 6px; font-size: 11px; display: inline-flex; align-items: center;">コード検索</button>`:``}
          </div>
          <select class="dtm-select" data-dtm="chord-pattern">
            <option value="block">\u30D6\u30ED\u30C3\u30AF</option>
            <option value="arpeggio">\u30A2\u30EB\u30DA\u30B8\u30AA</option>
            <option value="arpeggio-fast">\u30A2\u30EB\u30DA\u30B8\u30AA\uFF08\u30B8\u30E3\u30E9\u30FC\u30F3\uFF09</option>
            <option value="offbeat">\u88CF\u6253\u3061</option>
            <option value="yatsume">\u30E4\u30C4\u30E1\u7A74</option>
            <option value="alternating">\u4EA4\u4E92\u594F</option>
          </select>
        </div>
        <div class="dtm-row">
          <textarea class="dtm-textarea dtm-grow" data-dtm="chord-input" placeholder="\u4F8B: C|G|Am|Em|F|C|F|G">${e.savedChordInput}</textarea>
          <button class="dtm-btn dtm-btn--primary" data-dtm="chord-apply">\u9069\u7528</button>
        </div>`,w.trackBody.appendChild(t);let n=t.querySelector(`[data-dtm="chord-pattern"]`),r=t.querySelector(`[data-dtm="chord-input"]`);n.value=e.savedChordPattern;let i=()=>{e.savedChordInput=r.value,e.savedChordPattern=n.value};n.addEventListener(`change`,i),r.addEventListener(`input`,i),t.querySelector(`[data-dtm="chord-info"]`).addEventListener(`click`,()=>{K(`コード進行の自動入力解説`,Mg)}),t.querySelector(`[data-dtm="chord-apply"]`).addEventListener(`click`,()=>{i(),ar()});let a=t.querySelector(`[data-dtm="chord-search"]`);a&&a.addEventListener(`click`,()=>{Kr(r)})}},Zn=e=>{Ee=e,Xn(),Jn(),q()},Qn=e=>{Oe=e;for(let[t,n]of[[w.toolPen,`pen`],[w.toolSelect,`select`],[w.toolEraser,`eraser`]])t.classList.toggle(`dtm-segbtn--active`,n===e);e!==`select`&&(Ye=null,Je=[]),q()},$n=e=>{let t=e?.ignoreBarLimit?0:Number(w.barLimitSelect.value),n=t>0?t*O.stepsPerBar:1/0,r=e=>n===1/0?e:e.filter(e=>e.startStep<n),i={},a={},o={},s={},c={},l={},u={},d={},f={};W.forEach((e,t)=>{e.trackInstrument&&(i[t]=e.trackInstrument),e.trackCompression!==0&&(a[t]=e.trackCompression),e.trackWidth!==100&&(o[t]=e.trackWidth),e.trackReverbSend!==0&&(s[t]=e.trackReverbSend),e.trackEqLow!==0&&(c[t]=e.trackEqLow),e.trackEqMid!==0&&(l[t]=e.trackEqMid),e.trackEqHigh!==0&&(u[t]=e.trackEqHigh),e.trackPan!==64&&(d[t]=e.trackPan),e.trackDelaySend!==0&&(f[t]=e.trackDelaySend)});let m=Object.keys(i).length>0?i:void 0,h=Object.keys(a).length>0?a:void 0,g=Object.keys(o).length>0?o:void 0,_=Object.keys(s).length>0?s:void 0,v=Object.keys(c).length>0?c:void 0,y=Object.keys(l).length>0?l:void 0,b=Object.keys(u).length>0?u:void 0,x=Object.keys(d).length>0?d:void 0,S=Object.keys(f).length>0?f:void 0,C=Zs({version:em,instrument:Se||void 0,drum:ge===`none`?void 0:ge,drumFont:be,volume:N,drumVolume:he,reverb:re,reverbDecay:Math.round(I*10),reverbPreDelay:ie,delay:ae,delayDivision:oe,masterCompression:L,fadeIn:Math.round(se*10),fadeOut:Math.round(ce*10),mode:p,edo:O.edo,loop:P?!0:void 0,seed:we??void 0,compose:Te??void 0,audio:J.url||void 0,audioStart:J.rangeStartSec||void 0,audioEnd:J.endSec||void 0,audioOffset:J.offsetSec||void 0,audioVolume:J.volume,trackInstruments:m,trackCompression:h,trackWidth:g,trackReverbSend:_,trackEqLow:v,trackEqMid:y,trackEqHigh:b,trackPan:x,trackDelaySend:S},` `),T=Zs({version:em,instrument:Se||void 0,drum:ge===`none`?void 0:ge,drumFont:be,volume:N,drumVolume:he,reverb:re,reverbDecay:Math.round(I*10),reverbPreDelay:ie,delay:ae,delayDivision:oe,masterCompression:L,fadeIn:Math.round(se*10),fadeOut:Math.round(ce*10),mode:p,edo:O.edo,loop:P?!0:void 0,seed:we??void 0,compose:Te??void 0,audio:J.url||void 0,audioStart:J.rangeStartSec||void 0,audioEnd:J.endSec||void 0,audioOffset:J.offsetSec||void 0,audioVolume:J.volume,trackInstruments:m,trackCompression:h,trackWidth:g,trackReverbSend:_,trackEqLow:v,trackEqMid:y,trackEqHigh:b,trackPan:x,trackDelaySend:S},``);if(w.decomposeChordToggle.checked){let e=w.ignoreChordHeavyToggle.checked?W.filter(e=>!Tm(e.core.getNotes())):W,n=W.length-e.length,i=wm(r(e.flatMap(e=>e.core.getNotes()))),a=W[0].core,o=i.map((e,t)=>`@${t} ${a.getMMLFromNotes(e,M,100).trim()}`),s=i.map((e,t)=>`@${t}${a.getMMLFromNotes(e,M,100).trim().replace(/\s+/g,``)}`);return{full:[C,...o,va].filter(e=>e.length>0).join(`;
`),minified:[T,...s,va].filter(e=>e.length>0).join(`;`),ignoredCount:n,trackCount:i.length,barLimit:t}}let E=[],D=[];W.forEach((e,t)=>{let n=r(bt(e));if(n.length>0){let r=e.core.getMMLFromNotes(n,M,e.volume).trim();E.push(`@${t} ${r}`),D.push(`@${t}${r.replace(/\s+/g,``)}`)}});let k=W.map((e,t)=>({i:t,notes:r(e.core.getNotes()),text:e.lyrics.replace(/[\r\n]+/g,` `).replace(/;/g,`；`).trim(),model:e.lyricModel.trim(),vol:e.vocalVolume,gate:e.vocalGate,pan:e.vocalPan,oct:e.vocalOctave,vib:e.vocalVibrato,rev:e.vocalReverb,del:e.vocalDelay,gen:e.vocalGender,bre:e.vocalBreathiness,ten:e.vocalTension,uni:e.vocalOctaveUnison})).filter(e=>e.model.length>0&&e.text.length>0&&e.notes.length>0).map(e=>{let t=[e.vol===200?``:`v${e.vol}`,e.gate===100?``:`q${e.gate}`,e.pan===64?``:`p${e.pan}`,e.oct===0?``:`o${e.oct}`,e.vib?`b1`:``,e.rev===0?``:`r${e.rev}`,e.del===0?``:`e${e.del}`,e.gen===50?``:`g${e.gen}`,e.bre===50?``:`h${e.bre}`,e.ten===50?``:`t${e.ten}`,Fg[e.uni]].filter(e=>e.length>0).join(` `),n=t?`${e.model} ${t}`:e.model;return`@@${e.i} ${n} ${e.text}`}),A=[];for(let[e,t]of Ue){if(!W.some(t=>t.lyricModel.trim().toLowerCase()===e&&t.lyrics.trim().length>0&&r(t.core.getNotes()).length>0))continue;let n=t.iconUrl||`-`;A.push(`@@${e} ${n} ${t.url}`)}return{full:[C,...A,...E,...k,va].filter(e=>e.length>0).join(`;
`),minified:[T,...A,...D,...k,va].filter(e=>e.length>0).join(`;`),ignoredCount:0,trackCount:E.length,barLimit:t}},er=()=>{let{full:e,minified:t,ignoredCount:n,trackCount:r,barLimit:i}=$n();w.outputFull.textContent=e,w.outputMini.textContent=t;let a=w.decomposeChordToggle.checked?`和音分解`:`通常`,o=n>0?` / \u4F34\u594F${n}\u30C8\u30E9\u30C3\u30AF\u9664\u5916`:``,s=i>0?` / \u301C${i}\u5C0F\u7BC0`:``;w.outputStatus.textContent=`[${a}] (${r}\u30C8\u30E9\u30C3\u30AF${o}${s}) \u901A\u5E38: ${e.length}\u6587\u5B57 / minify: ${t.length}\u6587\u5B57`,w.outputContainer.classList.remove(`dtm-hidden`),Jn()},tr=()=>{let e=2**53-1,t=[];for(let n of W)for(let r of n.core.getNotes())r.startStep<e?(e=r.startStep,t=[r]):r.startStep===e&&t.push(r);if(t.length===0)return null;let n=t.reduce((e,t)=>e+t.pitchUnits,0);return $t(Math.round(n/t.length))},nr=e=>{let t=k.getGridCanvas();je=T_((O.keyCount-1-(e-O.pitchRangeStart)/(O.unitsPerRow??31))*O.keyHeight-(t.height-O.keyHeight)/2,0,wt()),k.setDrawOffset(H,je)},rr=()=>{for(let e of W)e.core.resetHistory(),e.core.clearNotesWithoutHistory();q()},ir=e=>{if(!e)return;Gn();let n=w.applyActiveOnly?.checked??!1,r=W.findIndex(e=>e.config.id===Ee);if(n){let e=ot();e.core.clearNotesWithoutHistory(),e.core.setLoadMode(!0)}else{rr();for(let e of W)e.core.setLoadMode(!0)}if(!n){Ge();for(let t of fo(e))We(t)}let{placements:i,bpm:a,lyrics:o,meta:s,mergedTrackCount:c,trackVelocity:l}=Qs(e,{stepsPerBar:O.stepsPerBar,collectLyrics:!0,clampTrackCount:W.length});if(n||(we=s.seed??null,Te=s.compose??null,s.instrument&&yp[s.instrument]&&(Se=s.instrument,t.onInstrumentChange?.(s.instrument)),s.drumFont&&(be=s.drumFont,w.drumFontSelect.value=s.drumFont,t.onDrumFontChange?.(s.drumFont)),s.drum&&_[s.drum]&&(ge=s.drum,w.drumSelect.value=s.drum,t.onDrumChange?.(s.drum),s.drumFont||xe(s.drum)),s.volume!==void 0&&ee(s.volume),ne(s.edo??12),w.edoSelect.value=String(O.edo??12),F(s.loop??!1),s.drumVolume!==void 0&&(he=s.drumVolume,w.drumVolume.value=String(s.drumVolume),w.drumVolumeLabel.textContent=`${he}%`),s.reverb!==void 0&&(re=s.reverb,w.reverbAmount.value=String(s.reverb),w.reverbAmountLabel.textContent=`${s.reverb}%`,t.onReverbChange?.(s.reverb)),s.reverbDecay!==void 0&&(I=s.reverbDecay/10,w.reverbDecay.value=String(s.reverbDecay),w.reverbDecayLabel.textContent=`${I.toFixed(1)}s`,t.onReverbDecayChange?.(I)),s.reverbPreDelay!==void 0&&(ie=s.reverbPreDelay,w.reverbPreDelay.value=String(s.reverbPreDelay),w.reverbPreDelayLabel.textContent=`${s.reverbPreDelay}ms`,t.onReverbPreDelayChange?.(ie)),s.delay!==void 0&&(ae=s.delay,w.delayAmount.value=String(s.delay),w.delayAmountLabel.textContent=`${s.delay}%`,t.onDelayChange?.(s.delay)),s.delayDivision&&[`4`,`8`,`8d`,`16`].includes(s.delayDivision)&&(oe=s.delayDivision,w.delayDivision.value=oe,t.onDelayDivisionChange?.(oe)),s.masterCompression!==void 0&&(L=s.masterCompression,w.masterComp.value=String(s.masterCompression),w.masterCompLabel.textContent=`${s.masterCompression}%`,t.onMasterCompressionChange?.(s.masterCompression)),s.fadeIn!==void 0&&(se=s.fadeIn/10,w.fadeIn.value=String(se),w.fadeInLabel.textContent=`${se.toFixed(1)}s`),s.fadeOut!==void 0&&(ce=s.fadeOut/10,w.fadeOut.value=String(ce),w.fadeOutLabel.textContent=`${ce.toFixed(1)}s`),b&&(s.audio?(J.rangeStartSec=s.audioStart??0,J.endSec=s.audioEnd??0,J.volume=s.audioVolume??a_,J.offsetSec=s.audioOffset??(s.audioAt?-s.audioAt*(60/M/o_):0),kn(),s.audio!==J.url&&(w.audioUrlInput.value=s.audio,Ln(s.audio))):b.isLoaded()&&zn())),W.forEach((e,i)=>{if(n&&i!==r)return;e.composeSlot=null;let a=E_(s.trackInstruments?.[i]??``);e.trackInstrument!==a&&(e.trackInstrument=a,t.onTrackInstrumentChange?.(i,a))}),W.forEach((e,i)=>{if(n&&i!==r)return;let a=s.trackCompression?.[i]??0;e.trackCompression!==a&&(e.trackCompression=a,t.onTrackCompressionChange?.(e.config.id,a));let o=s.trackWidth?.[i]??100;e.trackWidth!==o&&(e.trackWidth=o,t.onTrackWidthChange?.(e.config.id,o));let c=s.trackReverbSend?.[i]??0;e.trackReverbSend!==c&&(e.trackReverbSend=c,t.onTrackReverbSendChange?.(e.config.id,c));let l=s.trackEqLow?.[i]??0;e.trackEqLow!==l&&(e.trackEqLow=l,t.onTrackEqLowChange?.(e.config.id,l));let u=s.trackEqMid?.[i]??0;e.trackEqMid!==u&&(e.trackEqMid=u,t.onTrackEqMidChange?.(e.config.id,u));let d=s.trackEqHigh?.[i]??0;e.trackEqHigh!==d&&(e.trackEqHigh=d,t.onTrackEqHighChange?.(e.config.id,d));let f=s.trackPan?.[i]??64;e.trackPan!==f&&(e.trackPan=f,t.onTrackPanChange?.(e.config.id,f));let p=s.trackDelaySend?.[i]??0;e.trackDelaySend!==p&&(e.trackDelaySend=p,t.onTrackDelaySendChange?.(e.config.id,p))}),W.forEach((e,t)=>{if(n&&t!==r)return;let i=l.get(t);i!==void 0&&i!==e.volume&&(e.volume=i,e.core.setVolume(i))}),n){let e=ot();e.lyrics=``,e.lyricModel=``,e.vocalVolume=200,e.vocalGate=100,e.vocalPan=64,e.vocalOctave=0,e.vocalVibrato=!1,e.vocalReverb=0,e.vocalDelay=0,e.vocalGender=50,e.vocalBreathiness=50,e.vocalTension=50,e.vocalOctaveUnison=`none`}else for(let e of W)e.lyrics=``,e.lyricModel=``,e.vocalVolume=200,e.vocalGate=100,e.vocalPan=64,e.vocalOctave=0,e.vocalVibrato=!1,e.vocalReverb=0,e.vocalDelay=0,e.vocalGender=50,e.vocalBreathiness=50,e.vocalTension=50,e.vocalOctaveUnison=`none`;o?.forEach(e=>{if(n&&e.trackId!==r)return;let t=W[e.trackId];t&&(t.lyrics=Za(e.syllables),t.lyricModel=e.model,t.vocalVolume=e.volume,t.vocalGate=e.gate,t.vocalPan=e.pan,t.vocalOctave=e.octave??0,t.vocalVibrato=e.vibrato??!1,t.vocalReverb=e.reverb??0,t.vocalDelay=e.delay??0,t.vocalGender=e.gender??50,t.vocalBreathiness=e.breathiness??50,t.vocalTension=e.tension??50,t.vocalOctaveUnison=e.octaveUnison??`none`)});for(let e of i){if(n&&e.trackIndex!==r)continue;let t=W[e.trackIndex];t&&t.core.addNote(e.startStep,e.pitchUnits,{noteLengthSteps:e.durationSteps,velocity:100})}!n&&a&&hr(a);let u=n?[ot()]:W;for(let e of u)e.core.setLoadMode(!1),e.core.addHistoryOnce();Me=0,H=0;let d=tr();nr(d===null?Tn(48):d),q(),Xn(),Jn(),!h&&c>0?(w.mmlLoadNote.textContent=`シンプルモードのため、一部のトラックを合算して読み込みました`,w.mmlLoadNote.classList.remove(`dtm-hidden`)):(w.mmlLoadNote.textContent=``,w.mmlLoadNote.classList.add(`dtm-hidden`))},ar=(e=ot())=>{let t=W.find(e=>e.config.id===`chord`);if(!t)return;let n=Pn({edo:O.edo,chordStr:e.savedChordInput,patternType:e.savedChordPattern,rootShift:e.savedChordRoot,bpm:M,stepsPerBar:O.stepsPerBar});t.core.clearNotesWithoutHistory(),t.core.beginBatch();for(let e of n)t.core.addNote(e.startStep,e.pitchUnits,{noteLengthSteps:Math.max(1,e.durationSteps),velocity:e.velocity});t.core.endBatch(),q()},or=async e=>{if(!t.parseMidi)return;let n=await t.parseMidi(e),r=nm(n).filter(e=>e.selected).map(e=>e.index);sr(n,r)},sr=(e,t)=>{Gn();let n=w.applyActiveOnly?.checked??!1;if(n){let e=ot();e.core.clearNotesWithoutHistory(),e.core.setLoadMode(!0),e.lyrics=``,e.lyricModel=``,e.vocalVolume=200,e.vocalGate=100,e.vocalPan=64,e.vocalOctave=0,e.vocalVibrato=!1,e.vocalReverb=0,e.vocalDelay=0,e.vocalGender=50,e.vocalBreathiness=50,e.vocalTension=50,e.vocalOctaveUnison=`none`}else{rr();for(let e of W)e.core.setLoadMode(!0);for(let e of W)e.lyrics=``,e.lyricModel=``,e.vocalVolume=200,e.vocalGate=100,e.vocalPan=64,e.vocalOctave=0,e.vocalVibrato=!1,e.vocalReverb=0,e.vocalDelay=0,e.vocalGender=50,e.vocalBreathiness=50,e.vocalTension=50,e.vocalOctaveUnison=`none`}let{placements:r,bpm:i}=h?om(e,t,W.map(e=>e.config.id)):im(e,t);for(let e of r){if(n&&e.trackId!==Ee)continue;let t=W.find(t=>t.config.id===e.trackId);t&&t.core.addNote(e.startStep,te(Tn(e.pitch)),{noteLengthSteps:e.durationSteps,velocity:e.velocity})}n||hr(Math.round(i));let a=n?[ot()]:W;for(let e of a)e.core.setLoadMode(!1),e.core.addHistoryOnce();Me=0,H=0;let o=tr();nr(o===null?Tn(48):o),q(),Xn(),Jn()},cr=()=>Math.max(0,W.findIndex(e=>e.config.id===Ee)),lr=(e,t)=>Math.max(0,Math.min(e,w.applyActiveOnly?.checked?1:W.length-t)),ur=(e,t)=>{Gn();let n=Math.max(0,t??cr()),r=e.slice(0,lr(e.length,n)),i=W[n]?.lyricModel||y_();r.forEach((e,t)=>{let r=W[n+t];r.core.setLoadMode(!0),r.core.clearNotesWithoutHistory();for(let t of e.notes)r.core.addNote(t.startStep,te(Tn(t.pitch)),{noteLengthSteps:t.durationSteps,velocity:t.velocity});r.core.setLoadMode(!1),r.core.addHistoryOnce(),r.lyrics=e.lyrics,r.vocalVolume=200,r.vocalGate=100,r.vocalPan=64,r.vocalOctave=0,r.vocalVibrato=!1,r.vocalReverb=0,r.vocalDelay=0,r.vocalGender=50,r.vocalBreathiness=50,r.vocalTension=50,r.vocalOctaveUnison=`none`,r.lyricModel||=i,et(r)});let a=r.find(e=>e.bpm!==null)?.bpm;a&&hr(Math.round(a)),Me=0,H=0;let o=tr();return nr(o??Tn(60)),q(),Xn(),Jn(),{applied:r.length,dropped:e.length-r.length}},dr=(e,t,n)=>{Gn();let r=w.applyActiveOnly?.checked??!1,i=Math.max(0,n??(r?cr():t.length>1?0:cr())),a=r?1:W.length-i,o=t.slice(0,Math.max(0,a)),s=W[i]?.lyricModel||y_();o.forEach((t,n)=>{let r=W[i+n];if(!r)return;let a=Km(e.placements,t);r.core.setLoadMode(!0),r.core.clearNotesWithoutHistory();for(let e of a)r.core.addNote(e.startStep,te(e.pitchUnits),{noteLengthSteps:e.durationSteps,velocity:e.velocity});r.core.setLoadMode(!1),r.core.addHistoryOnce();let o=e.placements.filter(e=>e.partIndex===t).sort((e,t)=>e.startStep-t.startStep);if(o.some(e=>!!(e.lyric&&e.lyric.trim()))){let e=[];for(let t of o){let n=t.lyric?.trim();e.push(n||`ー`)}r.lyrics=e.join(``),r.vocalVolume=200,r.vocalGate=100,r.vocalPan=64,r.vocalOctave=0,r.vocalVibrato=!1,r.vocalReverb=0,r.vocalDelay=0,r.vocalGender=50,r.vocalBreathiness=50,r.vocalTension=50,r.vocalOctaveUnison=`none`,r.lyricModel||=s,et(r)}else r.lyrics=``,r.lyricModel=``}),e.bpm>0&&hr(Math.round(e.bpm)),Me=0,H=0;let c=tr();return nr(c??Tn(60)),q(),Xn(),Jn(),{applied:o.length,dropped:t.length-o.length}},fr=()=>{let e=Gm({parts:W.map(e=>{let t=bt(e),n=e.lyrics?Ya(e.lyrics).map(Xa):void 0;return{name:e.config.name,notes:t,lyrics:n}}),bpm:M,stepsPerBar:O.stepsPerBar,title:`DTM Project`});return new Blob([e],{type:`application/vnd.recordare.musicxml+xml;charset=utf-8`})},pr=()=>{let e=ot(),t=Ya(e.lyrics).map(Xa),n=jg({notes:[...e.core.getNotes()].sort((e,t)=>e.startStep-t.startStep),syllables:t,bpm:M,projectName:e.config.name});return new Blob([n],{type:`text/plain;charset=utf-8`})},mr=()=>{let e=yp[Se]??yp.piano;return pm({tracks:W.map(t=>{let n;if(t.trackInstrument){let e=a(t.trackInstrument);e!==null&&(n=e)}else if(!t.lyricModel){let r=t.composeSlot??M_[t.config.id]??`melody`,i=a(e[r]??e.melody);i!==null&&(n=i)}return{notes:bt(t),volume:t.volume,program:n}}),getDrumPattern:e=>mt(ge,_,e),drumVolume:he,bpm:M,stepsPerBar:O.stepsPerBar})},hr=e=>{M=e,w.bpmInput.value=String(e);for(let t of W)t.core.setTempo(e);x&&kn(),t.onBpmChange?.(e)},gr=0,_r=()=>{let e=Date.now();e-gr<100||(gr=e,ot().core.undo(),q(),Jn())},vr=()=>{ot().core.redo(),q(),Jn()},yr=e=>{w.overlay.hidden=!1,$r(!0);let t=document.createElement(`div`);t.className=`dtm-overlay`,t.style.position=`fixed`,t.style.zIndex=`99999`;let n=document.createElement(`div`);n.className=`dtm-spinner`;let r=document.createElement(`i`);r.className=`dtm-spinner-fill`,n.appendChild(r),t.appendChild(n);let i=document.createElement(`div`);i.className=`dtm-loading-label`,i.textContent=`処理中...`,t.appendChild(i),document.body.appendChild(t),setTimeout(()=>{try{e()}finally{w.overlay.hidden=!0,$r(!1),t.remove()}},30)},br=(e,t)=>new Promise(n=>{let r=t?.title??`モードの確認`,i=t?.yes??`はい（上級者モードに切り替える）`,a=t?.no??`いいえ（このまま読み込む）`,o=document.createElement(`div`);o.className=`dtm-modal-overlay`,o.innerHTML=`
				<div class="dtm-modal">
					<div class="dtm-modal-header">
						<span class="dtm-modal-title">${r}</span>
					</div>
					<div class="dtm-modal-body"><p>${e}</p></div>
					<div class="dtm-confirm-footer">
						<button class="dtm-btn dtm-btn--ghost dtm-confirm-no">${a}</button>
						<button class="dtm-btn dtm-btn--primary dtm-confirm-yes">${i}</button>
					</div>
				</div>`;let s=e=>{o.remove(),n(e)};o.querySelector(`.dtm-confirm-yes`).addEventListener(`click`,()=>s(!0)),o.querySelector(`.dtm-confirm-no`).addEventListener(`click`,()=>s(!1)),o.addEventListener(`click`,e=>{e.target===o&&s(!1)}),document.body.appendChild(o)}),xr=()=>{w.playBtn.addEventListener(`click`,Kn),w.playBtn.disabled=!1,w.prevBarBtn.addEventListener(`click`,()=>{let e=Math.max(0,(Math.floor((ei()-1)/O.stepsPerBar)-1)*O.stepsPerBar);ti(e)}),w.nextBarBtn.addEventListener(`click`,()=>{let e=Math.floor(ei()/O.stepsPerBar+1)*O.stepsPerBar;ti(e)}),w.soloCheckbox.addEventListener(`change`,()=>{Ne=w.soloCheckbox.checked,q()}),le=t.clipMeter?.onClipChange(e=>{w.clipBadge.classList.toggle(`dtm-hidden`,!e)}),w.clipBadge.addEventListener(`click`,()=>{t.clipMeter?.reset()}),w.toolPen.addEventListener(`click`,()=>Qn(`pen`)),w.toolSelect.addEventListener(`click`,()=>Qn(`select`)),w.toolEraser.addEventListener(`click`,()=>Qn(`eraser`)),w.undoBtn.addEventListener(`click`,_r),w.redoBtn.addEventListener(`click`,vr),w.noteLengthSelect.addEventListener(`change`,()=>{ke=Number.parseInt(w.noteLengthSelect.value,10),V=ke,q()}),w.bpmInput.addEventListener(`input`,()=>{hr(Number.parseInt(w.bpmInput.value,10)||120)}),w.zoomXIn.addEventListener(`click`,()=>{A=Math.min(200,A+25),yn(),Sn()}),w.zoomXOut.addEventListener(`click`,()=>{A=Math.max(25,A-25),yn(),Sn()}),w.zoomYIn.addEventListener(`click`,()=>{j=Math.min(200,j+25),bn(),Sn()}),w.zoomYOut.addEventListener(`click`,()=>{j=Math.max(50,j-25),bn(),Sn()}),w.bgUploadBtn.addEventListener(`click`,()=>w.bgFileInput.click()),w.bgFileInput.addEventListener(`change`,()=>{let e=w.bgFileInput.files?.[0];if(w.bgFileInput.value=``,!e)return;if(!nn.has(e.type)){an(e).then(()=>gn(e)).catch(()=>{});return}let t=URL.createObjectURL(e),n=new Image;n.onload=()=>{URL.revokeObjectURL(t);let e=w.rollContainer.clientWidth||800,r=w.rollContainer.clientHeight||450;cn(n,e,r).then(e=>an(e).then(()=>gn(e))).catch(()=>{})},n.src=t}),w.bgRemoveBtn.addEventListener(`click`,()=>{sn().catch(()=>{}).finally(()=>gn(null))}),w.bgYoutubeThumb.addEventListener(`change`,()=>{dn=w.bgYoutubeThumb.checked;try{localStorage.setItem(tn,dn?`1`:`0`)}catch{}dn?_n(d(J.url)):hn()}),w.bgOpacityInput.addEventListener(`input`,()=>{let e=Number.parseInt(w.bgOpacityInput.value,10);pn(e);try{localStorage.setItem(en,String(e))}catch{}}),w.decomposeChordToggle.addEventListener(`change`,Sn),w.ignoreChordHeavyToggle.addEventListener(`change`,Sn),w.edoSelect.addEventListener(`change`,async()=>{let e=Number.parseInt(w.edoSelect.value,10)===31?31:12,t=O.edo??12;if(e===t)return;let n=W.some(e=>e.core.getNotes().length>0);if(e===12&&t===31&&n&&!await br(`31平均律から12平均律へ戻すと、音符が最大48セント（半音の約半分）動きます。<br>12平均律に無い音（中立3度など）は近い音に潰れ、<strong>元には戻せません</strong>。<br>切り替えますか？`,{title:`音律の確認`,yes:`切り替える`,no:`やめる`})){w.edoSelect.value=String(t);return}yr(()=>{ne(e,{snap:!0}),e===31&&t===12?j=Math.max(50,Math.round(j/2/25)*25):e===12&&t===31&&(j=Math.min(200,Math.round(j*2/25)*25)),bn();let n=tr();nr(n??Tn(48)),q(),Jn(),Sn()})}),w.edoInfoBtn.addEventListener(`click`,()=>{K(`音律の解説`,c_)}),w.loopToggle.addEventListener(`change`,()=>{F(w.loopToggle.checked)}),w.loopInfoBtn.addEventListener(`click`,()=>{K(`ループ再生の解説`,Qg)}),w.masterVolume.addEventListener(`input`,()=>{ee(Number.parseInt(w.masterVolume.value,10)||0)}),w.masterComp.addEventListener(`input`,()=>{L=Number.parseInt(w.masterComp.value,10)||0,w.masterCompLabel.textContent=`${L}%`,t.onMasterCompressionChange?.(L)}),w.masterCompInfoBtn.addEventListener(`click`,()=>{K(`グルーコンプの解説`,$g)}),w.reverbAmount.addEventListener(`input`,()=>{re=Number.parseInt(w.reverbAmount.value,10)||0,w.reverbAmountLabel.textContent=`${re}%`,t.onReverbChange?.(re)}),w.reverbAmountInfoBtn.addEventListener(`click`,()=>{K(`マスタリバーブの解説`,Hg)}),w.reverbDecay.addEventListener(`input`,()=>{let e=Number.parseInt(w.reverbDecay.value,10)||22;I=Math.max(ec,Math.min(tc,e/10)),w.reverbDecayLabel.textContent=`${I.toFixed(1)}s`,t.onReverbDecayChange?.(I)}),w.reverbPreDelay.addEventListener(`input`,()=>{ie=Number.parseInt(w.reverbPreDelay.value,10)||0,w.reverbPreDelayLabel.textContent=`${ie}ms`,t.onReverbPreDelayChange?.(ie)}),w.delayAmount.addEventListener(`input`,()=>{ae=Number.parseInt(w.delayAmount.value,10)||0,w.delayAmountLabel.textContent=`${ae}%`,t.onDelayChange?.(ae)}),w.delayDivision.addEventListener(`change`,()=>{oe=w.delayDivision.value,t.onDelayDivisionChange?.(oe)}),w.delayAmountInfoBtn.addEventListener(`click`,()=>{K(`マスタディレイの解説`,Ug)}),w.fadeIn.addEventListener(`input`,()=>{se=Number.parseFloat(w.fadeIn.value)||0,w.fadeInLabel.textContent=`${se.toFixed(1)}s`}),w.fadeOut.addEventListener(`input`,()=>{ce=Number.parseFloat(w.fadeOut.value)||0,w.fadeOutLabel.textContent=`${ce.toFixed(1)}s`}),w.fadeInfoBtn.addEventListener(`click`,()=>{K(`フェードイン/アウトの解説`,Wg)}),w.autoMasterInfoBtn.addEventListener(`click`,()=>{K(`おまかせマスタリング解説`,t_)});let e=()=>{if(de>=2e3&&ue>0){let e=.5/ue,t=T_(Math.round(N*e),10,100);t!==N&&ee(t),ue=0,de=0}L=25,w.masterComp.value=`25`,w.masterCompLabel.textContent=`25%`,t.onMasterCompressionChange?.(25);let e=W.filter(e=>e.core.getNotes().length>0).length,n=T_((e-2)/6,0,1);re=Math.round(28-n*16),w.reverbAmount.value=String(re),w.reverbAmountLabel.textContent=`${re}%`,t.onReverbChange?.(re),I=T_(3-T_((M-60)/120,0,1)*2.1,ec,tc),w.reverbDecay.value=String(Math.round(I*10)),w.reverbDecayLabel.textContent=`${I.toFixed(1)}s`,t.onReverbDecayChange?.(I),ie=20,w.reverbPreDelay.value=`20`,w.reverbPreDelayLabel.textContent=`20ms`,t.onReverbPreDelayChange?.(20),ce===0&&(ce=1.5,w.fadeOut.value=`1.5`,w.fadeOutLabel.textContent=`1.5s`);let r=null,i=-1,a=0;for(let e of W){if(!e.lyricModel)continue;let t=e.core.getNotes().reduce((e,t)=>e+t.durationSteps,0);t>i&&(i=t,r=e.config.id)}for(let e of W)e.lyricModel&&e.config.id!==r&&a++;let o=yp[Se]??yp.piano,s=new Map,c=new Map;for(let e of W){if(e.lyricModel)continue;let t=e.core.getNotes();t.length!==0&&c.set(e.config.id,k_(t))}let l=null,u=-1/0;for(let[e,t]of c)t.maxPoly>=2&&t.avgDur>=D_||t.avgPitch<A_||t.avgPitch>u&&(u=t.avgPitch,l=e);for(let e of W){if(e.lyricModel)continue;let n=c.get(e.config.id);if(!n)continue;let r=M_[e.config.id]??j_(n,e.config.id===l);s.set(e.config.id,r);let i=o[e.composeSlot??r]??o[r];e.trackInstrument=i;let a=W.indexOf(e);t.onTrackInstrumentChange?.(a,i);let u=N_(r,n);e.volume=u,e.core.setVolume(u)}let d={melody:[0],bass:[0],submelody:[18,-18,30,-30],chord:[36,-36,48,-48]},f=new Map,p=0;for(let e of W){let n=!!e.lyricModel&&e.config.id===r,i=s.get(e.config.id),o=i?P_[i]:void 0,c=64;if(e.lyricModel)c=n?64:T_(64+(p++%2==0?22:-22),0,127);else if(i){let e=d[i],t=f.get(i)??0;f.set(i,t+1),c=T_(64+e[t%e.length],0,127)}e.trackPan=c,t.onTrackPanChange?.(e.config.id,c);let l=e.lyricModel?n?30:25:o?.compression??35,u=e.lyricModel?n?100:120:o?.width??115;if(e.trackCompression=l,e.trackWidth=u,t.onTrackCompressionChange?.(e.config.id,l),t.onTrackWidthChange?.(e.config.id,u),e.lyricModel)e.trackEqLow=-3,e.trackEqHigh=n?2:0,t.onTrackEqLowChange?.(e.config.id,e.trackEqLow),t.onTrackEqHighChange?.(e.config.id,e.trackEqHigh);else{let n=o?.eqLow??0,r=o?.eqHigh??0;e.trackEqLow=n,e.trackEqHigh=r,t.onTrackEqLowChange?.(e.config.id,n),t.onTrackEqHighChange?.(e.config.id,r)}if(!e.lyricModel){let n=o?.reverbSend??15;e.trackReverbSend=n,t.onTrackReverbSendChange?.(e.config.id,n);let r=o?.delaySend??0;e.trackDelaySend=r,t.onTrackDelaySendChange?.(e.config.id,r)}e.lyricModel&&(e.vocalVibrato=n,e.vocalReverb=n?25:45,e.vocalDelay=n?15:0,e.vocalVolume=n?220:T_(Math.round(170/Math.sqrt(Math.max(1,a))),60,400),et(e))}Xn()};w.autoMasterBtn.addEventListener(`click`,()=>{e()}),w.drumSelect.addEventListener(`change`,()=>{ge=w.drumSelect.value,t.onDrumChange?.(ge),xe(ge)}),w.drumFontSelect.addEventListener(`change`,()=>{be=w.drumFontSelect.value,t.onDrumFontChange?.(be)}),w.drumVolume.addEventListener(`input`,()=>{he=Number.parseInt(w.drumVolume.value,10)||0,w.drumVolumeLabel.textContent=`${he}%`}),w.macroComposeInfo.addEventListener(`click`,()=>{K(`作曲の解説`,e_)});let n=()=>{let e=w.composeTemplate?.value;return e&&e!==`custom`?e:void 0},i=()=>{let e=[...w.composeSections.querySelectorAll(`input[type="checkbox"]`)].filter(e=>e.checked).map(e=>e.value);return e.length>0?e:dd},a=()=>{let e=gd(i(),n());return e.min===e.max?`${e.min}\u5C0F\u7BC0`:`${e.min}\u301C${e.max}\u5C0F\u7BC0`},o=()=>{w.composeSectionsLen.textContent=a()},s=Bp(`template`);s&&w.composeTemplate&&Array.from(w.composeTemplate.options).some(e=>e.value===s)&&(w.composeTemplate.value=s);let c=Hp();if(c&&w.composeSections){let e=w.composeSections.querySelectorAll(`input[type="checkbox"]`),t=new Set(c);for(let n of e)n.checked=t.has(n.value)}else if(s&&s!==`custom`&&w.composeSections){let e=pd.find(e=>e.name===s);if(e){let t=new Set(e.plan),n=w.composeSections.querySelectorAll(`input[type="checkbox"]`);for(let e of n)e.checked=t.has(e.value)}}let l=Bp(`key`);l&&w.composeKey&&Array.from(w.composeKey.options).some(e=>e.value===l)&&(w.composeKey.value=l);let u=Bp(`scale`);u&&w.composeScale&&Array.from(w.composeScale.options).some(e=>e.value===u)&&(w.composeScale.value=u);let f=Bp(`shift`);f&&w.shiftSelect&&Array.from(w.shiftSelect.options).some(e=>e.value===f)&&(w.shiftSelect.value=f);let p=Bp(`shiftActiveOnly`);p&&w.shiftActiveOnly&&(w.shiftActiveOnly.checked=p===`1`);let m=Bp(`transpose`);m&&w.transposeSelect&&Array.from(w.transposeSelect.options).some(e=>e.value===m)&&(w.transposeSelect.value=m),w.composeSections.addEventListener(`change`,()=>{w.composeTemplate&&(w.composeTemplate.value=`custom`,Vp(`template`,`custom`)),Up(i()),o()});let g=w.composeTemplate;g&&g.addEventListener(`change`,()=>{Vp(`template`,g.value);let e=n();if(e){let t=pd.find(t=>t.name===e);if(t){let e=new Set(t.plan),n=w.composeSections.querySelectorAll(`input[type="checkbox"]`);for(let t of n)t.checked=e.has(t.value)}}Up(i()),o()}),o();let _=()=>{if(!w.composeKey||!w.composeKeyHint)return;let e=_u(w.composeKey.value);w.composeKeyHint.textContent=e,w.composeKeyHint.title=e},b=w.composeKey;b&&(b.addEventListener(`change`,()=>{Vp(`key`,b.value),_()}),_());let S=()=>{if(!w.composeScale||!w.composeScaleHint)return;let e=sd(w.composeScale.value);w.composeScaleHint.textContent=e,w.composeScaleHint.title=e},T=w.composeScale;T&&(T.addEventListener(`change`,()=>{Vp(`scale`,T.value),S()}),S()),w.shiftSelect&&w.shiftSelect.addEventListener(`change`,()=>{Vp(`shift`,w.shiftSelect.value)}),w.shiftActiveOnly&&w.shiftActiveOnly.addEventListener(`change`,()=>{Vp(`shiftActiveOnly`,w.shiftActiveOnly.checked?`1`:`0`)}),w.transposeSelect&&w.transposeSelect.addEventListener(`change`,()=>{Vp(`transpose`,w.transposeSelect.value)});let E=()=>W.map(e=>{let t=e.core.getNotes(),n=0,r=0;for(let e of t)n+=e.startStep,r+=e.pitchUnits;return`${t.length}:${n}:${r}`}).join(`|`),k=null,P=r=>{Gn(),yr(()=>{let a=n(),o=i(),s=w.composeKey?.value??`any`,c=w.composeScale?.value??`auto`,l=Math.random()*4294967296>>>0,u=cp({stepsPerBar:O.stepsPerBar,edo:O.edo,sections:o,template:a,baseKey:s,scale:c,random:Df(l),recent:_e});we=l,Te=[a??`custom`,s,c,o.join(`-`)].join(`:`),_e.push(u.stats.fingerprint),_e.length>5&&_e.shift();let d=(e,t)=>{let n=W[e];if(n){n.core.clearNotesWithoutHistory(),n.core.beginBatch();for(let e of t)n.core.addNote(e.startStep,e.pitchUnits,{noteLengthSteps:Math.max(1,e.durationSteps),velocity:e.velocity});n.core.endBatch()}},f=(e,t)=>{let n=W.find(t=>t.config.id===e);if(n){n.core.clearNotesWithoutHistory(),n.core.beginBatch();for(let e of t)n.core.addNote(e.startStep,e.pitchUnits,{noteLengthSteps:Math.max(1,e.durationSteps),velocity:e.velocity});n.core.endBatch()}};if((!Se||Se===`auto`||Se===Ce)&&u.instrument&&(Se=u.instrument,Ce=u.instrument,t.onInstrumentChange?.(u.instrument)),h){let e=wp(u,{edo:O.edo,stepsPerBar:O.stepsPerBar,preset:yp[Se]??yp.piano});for(let n of e){let e=W[n.index];e&&(d(n.index,n.notes),e.trackOctave=n.octave,e.volume=n.volume,e.core.setVolume(n.volume),e.composeSlot=n.notes.length>0?n.slot??null:null,n.notes.length===0&&e.trackInstrument&&(e.trackInstrument=``,t.onTrackInstrumentChange?.(n.index,``)))}for(let t=0;t<W.length;t++){if(e.some(e=>e.index===t))continue;d(t,[]);let n=W[t];n&&(n.composeSlot=null)}}else{for(let e of W)e.composeSlot=null;f(`melody`,u.melody),f(`submelody`,u.submelody),f(`bass`,u.bass);let e=W.find(e=>e.config.id===`chord`);e&&(e.savedChordInput=u.chordProgression,e.savedChordPattern=u.chordPattern,e.savedChordRoot=u.rootShift,ar(e))}if(hr(u.bpm),ge=u.drum,w.drumSelect.value=u.drum,t.onDrumChange?.(u.drum),xe(u.drum),r){ye.clear();let e=h?W[0]:W.find(e=>e.config.id===`melody`);if(e){let t=e.lyricModel.trim();(!t||t===ve)&&(!t&&e.vocalOctave===0&&(e.vocalOctave=-1),e.lyricModel=y_(ve),ve=e.lyricModel,ye.set(e,e.lyricModel)),e.lyrics=vp(u.melody,{stepsPerBar:O.stepsPerBar}),et(e)}if(h&&e){let t=O.stepsPerBar,n=u.vocal.duetSpans,r=e=>n.some(([t,n])=>e.startStep>=t&&e.startStep<n),i=(e,t,n)=>{e&&(e.lyricModel=n,ye.set(e,n),e.vocalOctave===0&&(e.vocalOctave=-1),e.lyrics=t,et(e))},a=y_(e.lyricModel),o=n.length>0;if(o){let n=u.melody.filter(e=>!r(e)),o=u.melody.filter(e=>r(e));d(0,n),d(11,o);let s=e.lyrics;i(e,_p(u.melody,s,n,{stepsPerBar:t}),e.lyricModel),i(W[11],_p(u.melody,s,o,{stepsPerBar:t}),a)}let s=W[2];if(u.harmony.length>0&&s&&i(s,_p(u.melody,e.lyrics,u.harmony,{stepsPerBar:t}),o?a:e.lyricModel),!o){u.harmony2.length>0&&i(W[12],_p(u.melody,e.lyrics,u.harmony2,{stepsPerBar:t}),e.lyricModel);let n=W[13];u.octave.length>0&&n&&(i(n,_p(u.melody,e.lyrics,u.octave,{stepsPerBar:t}),e.lyricModel),n.vocalOctave=-2)}}}else{for(let[e,t]of ye)e.lyricModel===t&&(e.lyrics=``,e.lyricModel=``,et(e));ye.clear()}e(),w.composeKeyHint&&(w.composeKeyHint.textContent=`${u.keyLabel} \u3067\u4F5C\u6210`,w.composeKeyHint.title=`${u.keyLabel}${u.moodLabel?`\uFF08${u.moodLabel}\uFF09`:``}`),Me=(u.sections.find(e=>e.kind===`chorus`)?.startBar??0)*O.stepsPerBar,q(),Xn(),Jn(),k=E(),Hn()})},te=e=>{let t=W.some(e=>e.core.getNotes().length>0),n=k!==null&&k===E();if(t&&!n){yt(e?`歌入り作曲`:`作曲`,`\u4ECA\u3042\u308B\u30CE\u30FC\u30C8\u3092\u3059\u3079\u3066\u6D88\u3057\u3066\u3001${a()}\u306E\u66F2\u3092\u65B0\u3057\u304F\u4F5C\u308A\u307E\u3059\u3002\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F\uFF08\u300C\u5143\u306B\u623B\u3059\u300D\u306F\u30C8\u30E9\u30C3\u30AF\u3054\u3068\u306B\u52B9\u304D\u307E\u3059\uFF09`,()=>P(e),`compose`);return}P(e)};w.macroCompose.addEventListener(`click`,()=>{te(!1)});let R=Gp(),z=()=>{w.composeRecall.disabled=R===null,w.composeKeep.textContent=R===null?`キープ`:`キープ済`},fe=()=>({mml:$n({ignoreBarLimit:!0}).full,startStep:Me});w.composeKeep.addEventListener(`click`,()=>{W.some(e=>e.core.getNotes().length>0)&&(R=fe(),Kp(R),z())});let pe=e=>{let t=w.applyActiveOnly,n=t?.checked??!1;t&&(t.checked=!1);try{ir(e.mml)}finally{t&&(t.checked=n)}Me=Math.min(e.startStep,St()),k=null,Hn()};w.composeRecall.addEventListener(`click`,()=>{if(R===null)return;let e=R;W.some(e=>e.core.getNotes().length>0)&&(R=fe(),Kp(R)),pe(e),z()}),z(),w.macroComposeVocal.addEventListener(`click`,()=>{te(!0)}),w.macroClear.addEventListener(`click`,()=>{yr(()=>{let e=ot();e.core.beginBatch(),e.core.clearNotesWithoutHistory(),e.core.endBatch(),e.core.saveHistory(),q()})}),w.macroRandom.addEventListener(`click`,()=>{yr(()=>{Yp(ot().core,{stepsPerBar:O.stepsPerBar,startStep:Me,pitchRangeStart:O.pitchRangeStart,edo:O.edo}),q()})}),w.macroHarmonic.addEventListener(`click`,()=>{yr(()=>{let e=W.find(e=>e.config.id===`chord`);e&&Ee!==`chord`&&(Xp(ot().core,e.core,{stepsPerBar:O.stepsPerBar}),q())})}),w.macroMono.addEventListener(`click`,()=>{yr(()=>{let e=W.find(e=>e.config.id===`chord`);e&&Ee!==`chord`&&(Zp(ot().core,e.core,{stepsPerBar:O.stepsPerBar}),q())})}),w.generateMmlBtn.addEventListener(`click`,er);let me=(e,t)=>{let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,r.click(),URL.revokeObjectURL(n)};w.exportMidiBtn.addEventListener(`click`,()=>{me(mr(),`dtm.mid`)}),w.exportMusicXmlBtn.addEventListener(`click`,()=>{me(fr(),`dtm.musicxml`)}),w.exportUstBtn.addEventListener(`click`,()=>{let e=ot().config.name.replace(/[/:*?"<>|\s]+/g,`_`);me(pr(),`dtm_${e}.ust`)}),t.onExportWav&&(w.exportWavBtn.classList.remove(`dtm-hidden`),w.exportWavBtn.addEventListener(`click`,()=>{t.onExportWav?.()}));let De=(e,t)=>{navigator.clipboard?.writeText(e),t.classList.add(`dtm-btn--success`),setTimeout(()=>t.classList.remove(`dtm-btn--success`),1200)};w.copyFullBtn.addEventListener(`click`,()=>De(w.outputFull.textContent??``,w.copyFullBtn)),w.copyMiniBtn.addEventListener(`click`,()=>De(w.outputMini.textContent??``,w.copyMiniBtn)),w.mmlLoadBtn.addEventListener(`click`,async()=>{let e=w.mmlInput.value;if(!h&&t.onRequestAdvancedMode){let{mergedTrackCount:n,meta:r}=Qs(e,{stepsPerBar:O.stepsPerBar,clampTrackCount:W.length});if((n>0||r.mode===`advanced`)&&await br(`初心者モードで読み込むと、音が崩れる可能性があります。<br>上級者モードに切り替えますか？`)){t.onRequestAdvancedMode(e);return}}yr(()=>ir(e))});let B=null,Oe=null,H=()=>{if(B&&=(B.stop(),B.destroy(),null),Oe){Oe.textContent=`▶ 試聴`,Oe.classList.remove(`dtm-btn--danger`),Oe.classList.add(`dtm-btn--primary`);let e=Oe.closest(`.dtm-modal-sample-box`)?.querySelector(`.dtm-modal-sample-player-container`);e&&(e.innerHTML=``),Oe=null}};K=(e,n)=>{H(),Hr(),w.modalTitle.textContent=e,w.modalBody.innerHTML=n,w.modalOverlay.removeAttribute(`hidden`);let i=w.modalBody.querySelectorAll(`.dtm-modal-sample-copy-btn`);for(let e of i)e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-mml`)||``;navigator.clipboard.writeText(t).then(()=>{let t=e.textContent;e.textContent=`✓ コピー完了`,e.classList.add(`dtm-btn--success`),setTimeout(()=>{e.textContent=t,e.classList.remove(`dtm-btn--success`)},1200)})});let a=w.modalBody.querySelectorAll(`.dtm-modal-sample-play-btn`);for(let e of a){let n=e;n.addEventListener(`click`,()=>{let e=n.closest(`.dtm-modal-sample-box`)?.querySelector(`.dtm-modal-sample-player-container`),i=n.getAttribute(`data-mml`)||``;if(Oe===n)B?.isPlaying()?B.stop():(Gn(),B&&(B.play(),n.textContent=`■ 停止`,n.classList.remove(`dtm-btn--primary`),n.classList.add(`dtm-btn--danger`)));else if(H(),Gn(),Oe=n,n.textContent=`■ 停止`,n.classList.remove(`dtm-btn--primary`),n.classList.add(`dtm-btn--danger`),e){e.innerHTML=``;let a=Al(e,i,{onPlayNote:e=>{if(t.onPlayNote){let n=Number(e.trackId),i=r[n],a=i?i.id:e.trackId;t.onPlayNote({...e,trackId:a})}},onPlayDrum:t.onPlayDrum,onScheduleFade:t.onScheduleFade,onResumeAudio:t.onResumeAudio,getAudioTime:t.getAudioTime,singingVoices:t.singingVoices,drumPatterns:t.drumPatterns,volume:N,_skipInfoModals:!0,onStop:()=>{Oe===n&&(n.textContent=`▶ 試聴`,n.classList.remove(`dtm-btn--danger`),n.classList.add(`dtm-btn--primary`))}});B=a,a.play()}})}};let Ae=e=>{try{return localStorage.getItem(`dtm-skip-confirm-${e}`)===`1`}catch{return!1}},je=e=>{try{localStorage.setItem(`dtm-skip-confirm-${e}`,`1`)}catch{}};yt=(e,t,n,r)=>{if(r&&Ae(r)){n();return}let i=t.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);K(e,`<div class="dtm-modal-body-content">
  <p>${i}</p>
  ${r?`<label class="dtm-row" style="gap:6px;margin-top:12px;cursor:pointer;">
    <input type="checkbox" data-dtm-confirm="skip" />
    <span>次回から表示しない</span>
  </label>`:``}
  <div class="dtm-row" style="justify-content:flex-end;gap:8px;margin-top:12px;">
    <button class="dtm-btn" data-dtm-confirm="cancel">\u30AD\u30E3\u30F3\u30BB\u30EB</button>
    <button class="dtm-btn dtm-btn--danger" data-dtm-confirm="ok">\u5B9F\u884C\u3059\u308B</button>
  </div>
</div>`);let a=()=>{w.modalOverlay.setAttribute(`hidden`,``)};w.modalBody.querySelector(`[data-dtm-confirm="cancel"]`)?.addEventListener(`click`,a),w.modalBody.querySelector(`[data-dtm-confirm="ok"]`)?.addEventListener(`click`,()=>{let e=w.modalBody.querySelector(`[data-dtm-confirm="skip"]`);r&&e?.checked&&je(r),a(),n()})},w.modalClose.addEventListener(`click`,()=>{H(),Hr(),w.modalOverlay.setAttribute(`hidden`,``)}),w.modalOverlay.addEventListener(`click`,e=>{e.target===w.modalOverlay&&(H(),Hr(),w.modalOverlay.setAttribute(`hidden`,``))}),w.helpBtn.addEventListener(`click`,()=>{K(`使い方・ヘルプ`,u_);let e=e=>w.modalBody.querySelector(`[data-dtm-help="${e}"]`)?.classList.add(`dtm-hidden`);x||e(`audio`),v||(e(`midi`),e(`ust`)),y||e(`chord`)}),w.modalBody.addEventListener(`click`,e=>{let t=e.target?.closest(`[data-dtm-tour],[data-dtm-help]`);if(!t)return;let n=t.dataset.dtmTour;if(n&&n in vh){D(n);return}let r=t.dataset.dtmHelp,i=r?d_[r]:void 0;i&&K(i.title,i.html)}),w.mmlInfoBtn.addEventListener(`click`,()=>{K(`MMLの書き方解説`,Gc)}),w.midiInfoBtn.addEventListener(`click`,()=>{K(`MIDIの読み込み解説`,n_)}),w.shiftApplyBtn.addEventListener(`click`,()=>yr(()=>{Qp((w.shiftActiveOnly?.checked?[ot()]:W).map(e=>e.core),Number.parseInt(w.shiftSelect.value,10)||0),q()})),w.transposeApplyBtn.addEventListener(`click`,()=>yr(()=>{$p(W.map(e=>e.core),Number.parseInt(w.transposeSelect.value,10)||0),q(),Jn()})),w.transposeInfoBtn.addEventListener(`click`,()=>{K(`移調の解説`,Gg)}),v&&(Dr(),Mr(),Lr()),x&&(Bn(),kn()),C&&Gr(),document.addEventListener(`keydown`,qr),w.root.addEventListener(`keydown`,e=>{let t=e.target;if(t.tagName!==`TEXTAREA`&&t.tagName!==`INPUT`)return;let n=e;(n.ctrlKey||n.metaKey)&&[`KeyZ`,`KeyY`,`KeyV`,`KeyC`,`KeyX`].includes(n.code)&&e.stopPropagation()})},Sr=null,Cr=[],wr=null,Tr=(e,n)=>{_[e]=n;let r=w.drumSelect.querySelector(`option[value="${e}"]`);r||(r=document.createElement(`option`),r.value=e,w.drumSelect.appendChild(r)),r.textContent=n.label,ge=e,w.drumSelect.value=e,t.onDrumChange?.(e)},Er=e=>{wr=e.pattern,Tr(`_extracted_midi`,e)},Dr=()=>{w.midiInput.addEventListener(`change`,async()=>{let e=w.midiInput.files?.[0];if(!e||!t.parseMidi)return;w.overlay.hidden=!1,$r(!0);let n=new Uint8Array(await e.arrayBuffer());Sr=await t.parseMidi(n),Cr=nm(Sr);try{let{patternDef:e}=gm(Sr,be);Er(e)}catch(e){console.error(e)}w.midiTrackSelection.innerHTML=`<span class="dtm-label">トラック</span>`,Cr.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`dtm-btn ${e.selected?`dtm-btn--primary`:`dtm-btn--ghost`}`,n.dataset.selected=String(e.selected),n.textContent=`${e.name} (${e.noteCount})`,n.addEventListener(`click`,()=>{let e=n.dataset.selected!==`true`;n.dataset.selected=String(e),n.classList.toggle(`dtm-btn--primary`,e),n.classList.toggle(`dtm-btn--ghost`,!e)}),w.midiTrackSelection.appendChild(n),t===0&&(w.midiTrackSelection.dataset.ready=`1`)}),w.midiTrackSelection.classList.remove(`dtm-hidden`),w.overlay.hidden=!0,$r(!1)}),w.midiLoadBtn.addEventListener(`click`,async()=>{if(!Sr)return;let e=[];if(w.midiTrackSelection.querySelectorAll(`button`).forEach((t,n)=>{t.dataset.selected===`true`&&e.push(Cr[n].index)}),e.length!==0){if(!h&&t.onRequestAdvancedMode&&e.length>W.length&&await br(`初心者モードで読み込むと、音が崩れる可能性があります。<br>上級者モードに切り替えますか？`)){let n=Sr,r=e.slice();t.onRequestAdvancedMode(void 0,e=>{e.applyMidiParsed?.(n,r)});return}yr(()=>sr(Sr,e))}})},Or=null,kr=e=>{w.musicXmlLoadNote.textContent=e,w.musicXmlLoadNote.classList.toggle(`dtm-hidden`,e===``)},Ar=()=>{if(!Or)return[];let e=[];return w.musicXmlPartSelection.querySelectorAll(`button`).forEach((t,n)=>{t.dataset.selected===`true`&&e.push(Or.parts[n].index)}),e},jr=()=>{if(!Or)return;let e=Ar();if(e.length===0){kr(`読み込むパートを選択してください`);return}let t=w.applyActiveOnly?.checked??!1,n=t?cr():e.length>1?0:cr(),r=t?1:W.length-n,i=Math.min(e.length,r),a=e.map(e=>Or.parts.find(t=>t.index===e)).filter(Boolean).slice(0,i).map((e,t)=>`${W[n+t]?.config.name??`\u30C8\u30E9\u30C3\u30AF${n+t+1}`}\u2190${e.name}`).join(` / `),o=e.length-i;kr(o>0?`${a}\uFF08${t?`「現在のトラックのみ」が有効なため`:`トラック不足のため`}${o}\u30D1\u30FC\u30C8\u306F\u8AAD\u307F\u8FBC\u307F\u307E\u305B\u3093\uFF09`:a)},Mr=()=>{w.musicXmlInfoBtn.addEventListener(`click`,()=>{K(`MusicXMLの入出力解説`,r_)}),w.musicXmlInput.addEventListener(`change`,async()=>{let e=w.musicXmlInput.files?.[0];if(Or=null,w.musicXmlPartSelection.innerHTML=``,!e){kr(``),w.musicXmlPartSelection.classList.add(`dtm-hidden`);return}w.overlay.hidden=!1,$r(!0);try{if(Or=Bm(await e.text()),Or.parts.length===0){kr(`パートが見つかりませんでした`),w.musicXmlPartSelection.classList.add(`dtm-hidden`);return}w.musicXmlPartSelection.innerHTML=`<span class="dtm-label">パート</span>`,Or.parts.forEach(e=>{let t=document.createElement(`button`);t.className=`dtm-btn dtm-btn--primary`,t.dataset.selected=`true`;let n=e.hasLyrics?` 🎤`:``;t.textContent=`${e.name} (${e.noteCount}\u97F3${n})`,t.title=`\u5E73\u5747\u97F3\u9AD8: MIDI ${Math.round(e.avgPitch)}${e.hasLyrics?` / 歌詞あり`:``}`,t.addEventListener(`click`,()=>{let e=t.dataset.selected!==`true`;t.dataset.selected=String(e),t.classList.toggle(`dtm-btn--primary`,e),t.classList.toggle(`dtm-btn--ghost`,!e),jr()}),w.musicXmlPartSelection.appendChild(t)}),w.musicXmlPartSelection.classList.remove(`dtm-hidden`),jr()}catch(e){kr(`MusicXMLとして解析できませんでした`),w.musicXmlPartSelection.classList.add(`dtm-hidden`),console.error(e)}finally{w.overlay.hidden=!0,$r(!1)}}),w.musicXmlLoadBtn.addEventListener(`click`,async()=>{if(!Or)return;let e=Ar();if(e.length===0)return;let n=w.applyActiveOnly?.checked??!1,r=n?cr():e.length>1?0:cr(),i=n?1:W.length-r;if(!h&&t.onRequestAdvancedMode&&!n&&e.length>i&&await br(`初心者モードではトラックが足りず、一部のパートを読み込めません。<br>上級者モードに切り替えますか？`)){let n=Or,r=e.slice();t.onRequestAdvancedMode(void 0,e=>{e.applyMusicXmlParsed?.(n,r)});return}yr(()=>{let{applied:t,dropped:n}=dr(Or,e);kr(n>0?`${t}\u30D1\u30FC\u30C8\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\uFF08${n}\u30D1\u30FC\u30C8\u306F\u30C8\u30E9\u30C3\u30AF\u4E0D\u8DB3\u306E\u305F\u3081\u7701\u7565\uFF09`:`${t}\u30D1\u30FC\u30C8\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F`)})})},Nr=[],Pr=e=>{w.ustLoadNote.textContent=e,w.ustLoadNote.classList.toggle(`dtm-hidden`,e===``)},Fr=()=>w.applyActiveOnly?.checked?`「現在のトラックのみ」が有効なため`:`トラック不足のため`,Ir=e=>{let t=cr(),n=lr(e.length,t);if(n<=0)return`読み込めるトラックがありません`;let r=e.slice(0,n).map((e,n)=>`${W[t+n].config.name}\u2190${e.name}`).join(` / `),i=e.length-n;return i>0?`${r}\uFF08${Fr()}${i}\u30D5\u30A1\u30A4\u30EB\u306F\u8AAD\u307F\u8FBC\u307F\u307E\u305B\u3093\uFF09`:r},Lr=()=>{w.ustInfoBtn.addEventListener(`click`,()=>{K(`USTの読み込み解説`,i_)}),w.ustInput.addEventListener(`change`,async()=>{let e=[...w.ustInput.files??[]];if(Nr=[],e.length===0){Pr(``);return}w.overlay.hidden=!1,$r(!0),e.sort((e,t)=>e.name.localeCompare(t.name,`ja`,{numeric:!0}));for(let t of e){let e=new Uint8Array(await t.arrayBuffer());Nr.push(yg(e,t.name))}Pr(Ir(Nr)),w.overlay.hidden=!0,$r(!1)}),w.ustLoadBtn.addEventListener(`click`,async()=>{if(Nr.length===0)return;let e=cr();if(!h&&t.onRequestAdvancedMode&&!w.applyActiveOnly?.checked&&Nr.length>W.length-e&&await br(`初心者モードではトラックが足りず、一部のUSTを読み込めません。<br>上級者モードに切り替えますか？`)){let e=Nr.slice();t.onRequestAdvancedMode(void 0,t=>{t.applyUstParsed?.(e,0)});return}let n=Nr.slice();yr(()=>{let{applied:e,dropped:t}=ur(n),r=n.slice(0,e),i=r.reduce((e,t)=>e+t.unknownLyricCount,0);Pr([`${e}\u30D5\u30A1\u30A4\u30EB\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F`,t>0?`\uFF08${Fr()}${t}\u30D5\u30A1\u30A4\u30EB\u306F\u672A\u8AAD\u8FBC\uFF09`:``,r.some(e=>e.pinyin)?`／中国語（ピンイン）としてかなに直しました`:``,i>0?`\uFF0F\u8AAD\u307F\u53D6\u308C\u306A\u3044\u6B4C\u8A5E${i}\u97F3\u306F\u7D99\u7D9A\u8A18\u53F7\u306B\u3057\u307E\u3057\u305F`:``].join(``))})})},Rr=e=>{let{placements:t,bpm:n}=im(e,nm(e).filter(e=>e.selected).map(e=>e.index)),r=new Map;for(let e of t)r.has(e.trackId)||r.set(e.trackId,[]),r.get(e.trackId)?.push(e);let i=W[0].core,a=Math.round(n)||M,o=[],s=0;for(let e of r.values()){let t=e.map(e=>({id:0,startStep:e.startStep,durationSteps:e.durationSteps,pitchUnits:te(Tn(e.pitch)),velocity:e.velocity})),n=i.getMMLFromNotes(t,a,100).trim();o.push(`@${s} ${n}`),s++}return[...o,va].join(`;
`)},zr=async e=>{if(!t.parseMidi||!S)throw Error(`parseMidi/midiSearchClient not injected`);let n=await S.fetchMidi(e),r=await t.parseMidi(new Uint8Array(n));if(!am(r,nm(r).filter(e=>e.selected).map(e=>e.index)))throw Error(`implausible MIDI transcription`);return r},Br=null,Vr=null,Hr=()=>{if(Br&&=(Br.stop(),Br.destroy(),null),Vr){Vr.textContent=`▶ 試聴`,Vr.classList.remove(`dtm-btn--danger`),Vr.classList.add(`dtm-btn--ghost`);let e=Vr.closest(`.dtm-modal-sample-box`)?.querySelector(`.dtm-modal-sample-player-container`);e&&(e.innerHTML=``),Vr=null}},Ur=null;w.drumJsonExportBtn.addEventListener(`click`,()=>{if(!wr){alert(`MIDIファイルを選択してください。`);return}let e=hm(wr,be);w.drumJsonOutput.classList.remove(`dtm-hidden`),w.drumJsonText.textContent=e,w.drumJsonStatus.textContent=`\u51FA\u529B: ${e.length}\u6587\u5B57`}),w.drumJsonCopyBtn.addEventListener(`click`,()=>{navigator.clipboard?.writeText(w.drumJsonText.textContent??``),w.drumJsonCopyBtn.classList.add(`dtm-btn--success`),setTimeout(()=>w.drumJsonCopyBtn.classList.remove(`dtm-btn--success`),1200)});let Wr=null,Gr=()=>{S&&w.midiSearchOpenBtn.addEventListener(`click`,()=>{K(`MML検索`,`
				<div class="dtm-row" style="flex-wrap:nowrap">
					<input type="text" class="dtm-input dtm-grow" data-dtm="modal-midi-search-input" placeholder="曲名でMML検索" style="min-width:0">
					<button class="dtm-btn dtm-btn--primary" data-dtm="modal-midi-search-btn" style="flex-shrink:0">検索</button>
				</div>
				<div data-dtm="modal-midi-search-status" style="font-size:11px;color:rgba(255,255,255,0.5);min-height:1.4em"></div>
				<div class="dtm-row" data-dtm="modal-midi-search-results" style="flex-direction:column;align-items:stretch;gap:4px"></div>
				`);let e=w.modalBody.querySelector(`[data-dtm="modal-midi-search-input"]`),n=w.modalBody.querySelector(`[data-dtm="modal-midi-search-btn"]`),r=w.modalBody.querySelector(`[data-dtm="modal-midi-search-status"]`),i=w.modalBody.querySelector(`[data-dtm="modal-midi-search-results"]`);Ur&&(e.value=Ur.query,r.textContent=`\u300C${Ur.query}\u300D\u306E\u691C\u7D22\u7D50\u679C\u3000${Ur.count}\u4EF6\u306E\u30D2\u30C3\u30C8`,Ur.renderResults(i));let a=async()=>{let a=e.value.trim();if(a){Hr(),n.disabled=!0,n.textContent=`検索中...`,i.innerHTML=``,r.textContent=``;try{let e=await S.searchSongs({title:a});if(e.length===0){r.textContent=`\u300C${a}\u300D\u306E\u691C\u7D22\u7D50\u679C\u30000\u4EF6\u306E\u30D2\u30C3\u30C8`,i.innerHTML=`<span class="dtm-label" style="color:var(--dtm-warn)">見つかりませんでした</span>`,Ur={query:a,count:0,renderResults:e=>{e.innerHTML=`<span class="dtm-label" style="color:var(--dtm-warn)">見つかりませんでした</span>`}};return}r.textContent=`\u300C${a}\u300D\u306E\u691C\u7D22\u7D50\u679C\u3000${e.length}\u4EF6\u306E\u30D2\u30C3\u30C8`;let n=n=>{n.innerHTML=``;for(let r of e){let e=document.createElement(`div`);e.className=`dtm-modal-sample-box`;let i=document.createElement(`div`);i.className=`dtm-row`,i.style.cssText=`flex-wrap:nowrap;gap:4px;padding:2px 0`;let a=document.createElement(`span`);a.className=`dtm-label`,a.style.cssText=`flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`,a.textContent=`${r.title} - ${r.user}`;let o=document.createElement(`button`);o.className=`dtm-btn dtm-btn--ghost`,o.style.cssText=`flex-shrink:0`,o.textContent=`▶ 試聴`;let s=document.createElement(`button`);s.className=`dtm-btn dtm-btn--primary`,s.style.cssText=`flex-shrink:0`,s.textContent=`読み込み`;let c=document.createElement(`div`);c.className=`dtm-modal-sample-player-container`,o.addEventListener(`click`,async()=>{if(Vr===o){if(Br?.isPlaying())Br.stop();else{Gn(),o.textContent=`読込中...`;try{let e=await zr(r.file),n=Rr(e);c.innerHTML=``;let i=Al(c,n,{onPlayNote:t.onPlayNote,onPlayDrum:t.onPlayDrum,onScheduleFade:t.onScheduleFade,onResumeAudio:t.onResumeAudio,getAudioTime:t.getAudioTime,singingVoices:t.singingVoices,drumPatterns:t.drumPatterns,volume:N,_skipInfoModals:!0,onStop:()=>{Vr===o&&(o.textContent=`▶ 試聴`,o.classList.remove(`dtm-btn--danger`),o.classList.add(`dtm-btn--ghost`))}});Br=i,Vr=o,i.play(),o.textContent=`■ 停止`,o.classList.remove(`dtm-btn--ghost`),o.classList.add(`dtm-btn--danger`)}catch(e){console.error(`[dtm] MIDI preview failed`,e),o.textContent=`失敗`}}}else{Hr(),Gn(),o.textContent=`読込中...`;try{let e=await zr(r.file),n=Rr(e);c.innerHTML=``;let i=Al(c,n,{onPlayNote:t.onPlayNote,onPlayDrum:t.onPlayDrum,onScheduleFade:t.onScheduleFade,onResumeAudio:t.onResumeAudio,getAudioTime:t.getAudioTime,singingVoices:t.singingVoices,drumPatterns:t.drumPatterns,volume:N,_skipInfoModals:!0,onStop:()=>{Vr===o&&(o.textContent=`▶ 試聴`,o.classList.remove(`dtm-btn--danger`),o.classList.add(`dtm-btn--ghost`))}});Br=i,Vr=o,i.play(),o.textContent=`■ 停止`,o.classList.remove(`dtm-btn--ghost`),o.classList.add(`dtm-btn--danger`)}catch(e){console.error(`[dtm] MIDI preview failed`,e),o.textContent=`失敗`}}}),s.addEventListener(`click`,async()=>{s.disabled=!0,s.textContent=`読込中...`;try{let e=await zr(r.file),t=nm(e).filter(e=>e.selected).map(e=>e.index);Hr(),yr(()=>sr(e,t)),w.modalOverlay.setAttribute(`hidden`,``)}catch(e){console.error(`[dtm] MIDI fetch failed`,e),s.textContent=`失敗`}finally{s.disabled=!1}}),i.appendChild(a),i.appendChild(o),i.appendChild(s),e.appendChild(i),e.appendChild(c),n.appendChild(e)}};n(i),Ur={query:a,count:e.length,renderResults:n}}catch(e){console.error(`[dtm] MIDI search failed`,e),i.innerHTML=`<span class="dtm-label" style="color:var(--dtm-warn)">検索に失敗しました</span>`}finally{n.disabled=!1,n.textContent=`検索`}}};n.addEventListener(`click`,()=>void a()),e.addEventListener(`keydown`,e=>{e.key===`Enter`&&a()}),e.focus()})},Kr=e=>{if(!S)return;let t=W.find(e=>e.config.id===Ee);if(!t)return;K(`コード進行検索`,`
			<div class="dtm-row" style="flex-wrap:nowrap">
				<input type="text" class="dtm-input dtm-grow" data-dtm="modal-chord-search-input" placeholder="曲名やコード進行で検索" style="min-width:0">
				<button class="dtm-btn dtm-btn--primary" data-dtm="modal-chord-search-btn" style="flex-shrink:0">検索</button>
			</div>
			<div data-dtm="modal-chord-search-status" style="font-size:11px;color:rgba(255,255,255,0.5);min-height:1.4em"></div>
			<div class="dtm-row" data-dtm="modal-chord-search-results" style="flex-direction:column;align-items:stretch;gap:4px"></div>
			`);let n=w.modalBody.querySelector(`[data-dtm="modal-chord-search-input"]`),r=w.modalBody.querySelector(`[data-dtm="modal-chord-search-btn"]`),i=w.modalBody.querySelector(`[data-dtm="modal-chord-search-status"]`),a=w.modalBody.querySelector(`[data-dtm="modal-chord-search-results"]`);Wr&&(n.value=Wr.query,i.textContent=`\u300C${Wr.query}\u300D\u306E\u691C\u7D22\u7D50\u679C\u3000${Wr.count}\u4EF6\u306E\u30D2\u30C3\u30C8`,Wr.renderResults(a));let o=async()=>{let o=n.value.trim();if(o){Hr(),r.disabled=!0,r.textContent=`検索中...`,a.innerHTML=``,i.textContent=``;try{let n=await S.searchRechord(o);if(n.length===0){i.textContent=`\u300C${o}\u300D\u306E\u691C\u7D22\u7D50\u679C\u30000\u4EF6\u306E\u30D2\u30C3\u30C8`,a.innerHTML=`<span class="dtm-label" style="color:var(--dtm-warn)">見つかりませんでした</span>`,Wr={query:o,count:0,renderResults:e=>{e.innerHTML=`<span class="dtm-label" style="color:var(--dtm-warn)">見つかりませんでした</span>`}};return}i.textContent=`\u300C${o}\u300D\u306E\u691C\u7D22\u7D50\u679C\u3000${n.length}\u4EF6\u306E\u30D2\u30C3\u30C8`;let r=r=>{r.innerHTML=``;for(let i of n){let n=document.createElement(`div`);n.className=`dtm-modal-sample-box`;let a=document.createElement(`div`);a.className=`dtm-row`,a.style.cssText=`flex-wrap:nowrap;gap:4px;padding:2px 0`;let o=document.createElement(`span`);o.className=`dtm-label`,o.style.cssText=`flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`,o.textContent=`${i.title}${i.user?.screen_name?` - ${i.user.screen_name}`:``}`;let s=document.createElement(`button`);s.className=`dtm-btn dtm-btn--ghost`,s.style.cssText=`flex-shrink:0`,s.textContent=`▶ 試聴`;let c=document.createElement(`button`);c.className=`dtm-btn dtm-btn--primary`,c.style.cssText=`flex-shrink:0`,c.textContent=`読み込み`;let l=document.createElement(`div`);l.className=`dtm-modal-sample-player-container`,s.addEventListener(`click`,async()=>{if(Vr===s){if(Br?.isPlaying())Br.stop();else{Gn(),s.textContent=`再生中...`;try{Br?.play(),s.textContent=`■ 停止`,s.classList.remove(`dtm-btn--ghost`),s.classList.add(`dtm-btn--danger`)}catch(e){console.error(`[dtm] Chord preview play failed`,e),s.textContent=`失敗`}}}else{Hr(),Gn(),s.textContent=`読込中...`;try{l.innerHTML=``;let e=au(l,i.content,{volume:N,bpm:i.bpm??M??120,_skipInfoModals:!0,onStop:()=>{Vr===s&&(s.textContent=`▶ 試聴`,s.classList.remove(`dtm-btn--danger`),s.classList.add(`dtm-btn--ghost`))}});Br=e,Vr=s,e.play(),s.textContent=`■ 停止`,s.classList.remove(`dtm-btn--ghost`),s.classList.add(`dtm-btn--danger`)}catch(e){console.error(`[dtm] Chord preview mount failed`,e),s.textContent=`失敗`}}}),c.addEventListener(`click`,()=>{Hr(),e.value=i.content,t.savedChordInput=i.content,i.bpm&&hr(i.bpm),ar(),w.modalOverlay.setAttribute(`hidden`,``)}),a.appendChild(o),a.appendChild(s),a.appendChild(c),n.appendChild(a),n.appendChild(l),r.appendChild(n)}};r(a),Wr={query:o,count:n.length,renderResults:r}}catch(e){console.error(`[dtm] Chord search failed`,e),a.innerHTML=`<span class="dtm-label" style="color:var(--dtm-warn)">検索に失敗しました</span>`}finally{r.disabled=!1,r.textContent=`検索`}}};r.addEventListener(`click`,()=>void o()),n.addEventListener(`keydown`,e=>{e.key===`Enter`&&o()}),n.focus()},qr=e=>{if(e.ctrlKey||e.metaKey){if(e.code===`KeyZ`&&!e.shiftKey)e.preventDefault(),_r();else if(e.code===`KeyZ`&&e.shiftKey||e.code===`KeyY`)e.preventDefault(),vr();else if(e.code===`KeyC`&&Je.length>0)e.preventDefault(),Xe=[...Je];else if(e.code===`KeyX`&&Je.length>0){if(e.preventDefault(),!qt()){Xe=[...Je];let e=ot().core;e.beginBatch();for(let t of Je)e.deleteNoteById(t.id);e.endBatch(),Je=[]}}else if(e.code===`KeyV`&&Xe.length>0){if(e.preventDefault(),qt())return;let t=ot().core,n=t.getNotes(),r=Math.min(...Xe.map(e=>e.startStep));t.beginBatch();for(let e of Xe){let i=Me+(e.startStep-r),a=i+e.durationSteps;n.some(t=>t.pitchUnits===e.pitchUnits&&i<t.startStep+t.durationSteps&&a>t.startStep)||t.addNote(i,e.pitchUnits,{noteLengthSteps:e.durationSteps,velocity:e.velocity})}t.endBatch(),q()}}};vn(),it(),Ve=!0,Ot(),xr(),hr(M),Xn(),qn(),Jn(),q(),t.initialMML&&ir(t.initialMML);let Jr=40;try{let e=localStorage.getItem(en);e!==null&&(Jr=Number.parseInt(e,10),(Number.isNaN(Jr)||Jr<0||Jr>100)&&(Jr=40))}catch{}pn(Jr);try{dn=localStorage.getItem(tn)===`1`}catch{}w.bgYoutubeThumb.checked=dn,on().then(e=>{e&&gn(e)}).catch(()=>{});let Yr=null,Xr=new ResizeObserver(()=>{Yr&&clearTimeout(Yr),Yr=setTimeout(()=>vn(),150)});Xr.observe(w.rollContainer);let Zr=e=>{w.root.classList.toggle(`dtm-daw--wide`,e>=1e3)},Qr=new ResizeObserver(e=>{for(let t of e)Zr(t.contentRect.width)});Qr.observe(w.root),Zr(w.root.getBoundingClientRect().width),document.addEventListener(`pointermove`,Yt),document.addEventListener(`pointerup`,Xt);let $r=e=>{He=e,w.topbar.classList.toggle(`is-loading`,e)},ei=()=>U===`playing`?Ie:U===`paused`?Fe:Me,ti=async e=>{U===`playing`?(wn.stop(),t.singingVoices?.stopStream(),ze(),Me=e,Fe=e,Ie=e,U=`paused`,await Hn()):ni(e)},ni=e=>{Me=e,Fe=e,Ie=e,U=`paused`;let t=k.getGridCanvas();H=T_(e*O.stepWidth-t.width*.5,0,Ct()),k.setDrawOffset(H,je),qn(),q()};return t.tour?.autoStart&&!(E&&th(E))&&requestAnimationFrame(()=>D()),{play:Hn,pause:Un,stop:Gn,getMML:$n,setInstrument:e=>{Se=e},getDrum:()=>ge,getUsedDrumKeys:()=>gt(ge,_),getDrumFont:()=>be,setDrumFont:e=>{be=e,w.drumFontSelect.value=e,t.onDrumFontChange?.(e)},addDrumPattern:(e,t)=>{_[e]=t;let n=w.drumSelect.querySelector(`option[value="${e}"]`);n||(n=document.createElement(`option`),n.value=e,w.drumSelect.appendChild(n)),n.textContent=t.label},setDrum:e=>{(e===`none`||_[e])&&(ge=e,w.drumSelect.value=e,t.onDrumChange?.(e),xe(e))},getViewState:xn,setViewState:e=>{typeof e.zoomX==`number`&&(A=T_(e.zoomX,25,200),yn()),typeof e.zoomY==`number`&&(j=T_(e.zoomY,50,200),bn()),typeof e.decomposeChord==`boolean`&&(w.decomposeChordToggle.checked=e.decomposeChord),typeof e.ignoreChordHeavy==`boolean`&&(w.ignoreChordHeavyToggle.checked=e.ignoreChordHeavy)},loadMML:ir,loadMIDI:or,applyMidiParsed:(e,t)=>{yr(()=>sr(e,t))},applyMusicXmlParsed:(e,t)=>{yr(()=>dr(e,t))},applyUstParsed:(e,t)=>{yr(()=>ur(e,t))},exportMIDI:mr,exportMusicXML:fr,exportUST:pr,setBpm:hr,getLoop:()=>P,setLoop:e=>F(e),getPlaybackState:()=>U,getCurrentPlayStep:ei,forcePauseAt:ni,setLoading:$r,setMasterVolume:e=>{ee(e)},setVolume:e=>{ee(e)},setDrumVolume:e=>{he=T_(e,0,100),w.drumVolume.value=String(he),w.drumVolumeLabel.textContent=`${he}%`},setReverbAmount:e=>{re=T_(e,0,100),w.reverbAmount.value=String(re),w.reverbAmountLabel.textContent=`${re}%`,t.onReverbChange?.(re)},setReverbDecay:e=>{I=Math.max(ec,Math.min(tc,e)),w.reverbDecay.value=String(Math.round(I*10)),w.reverbDecayLabel.textContent=`${I.toFixed(1)}s`,t.onReverbDecayChange?.(I)},setReverbPreDelay:e=>{ie=Math.max(ic,Math.min(ac,e)),w.reverbPreDelay.value=String(ie),w.reverbPreDelayLabel.textContent=`${ie}ms`,t.onReverbPreDelayChange?.(ie)},setDelayAmount:e=>{ae=T_(e,0,100),w.delayAmount.value=String(ae),w.delayAmountLabel.textContent=`${ae}%`,t.onDelayChange?.(ae)},applyPatch:(e,t,n)=>{let r=W.find(t=>t.config.id===e);if(r){Ze=!0,r.core.beginBatch();for(let e of t){let t=r.core.getNotes().find(t=>t.startStep===e.startStep&&t.pitchUnits===e.pitchUnits);t&&r.core.deleteNoteById(t.id),r.core.addNote(e.startStep,e.pitchUnits,{noteLengthSteps:e.durationSteps,velocity:e.velocity})}for(let e of n){let t=r.core.getNotes().find(t=>t.startStep===e.startStep&&t.pitchUnits===e.pitchUnits);t&&r.core.deleteNoteById(t.id)}r.core.endBatch(),Ze=!1,q()}},setTrackVisible:(e,t)=>{t?tt.delete(e):tt.add(e),q()},setTrackAudible:(e,t)=>{t?nt.delete(e):nt.add(e)},applyLyrics:(e,t)=>{let n=W.find(t=>t.config.id===e);n&&(n.lyrics=t.lyrics,n.lyricModel=t.model,n.vocalVolume=t.vocalVolume,n.vocalGate=t.vocalGate,n.vocalPan=t.vocalPan,n.vocalOctave=t.vocalOctave,n.vocalVibrato=t.vocalVibrato??!1,n.vocalReverb=t.vocalReverb??0,n.vocalDelay=t.vocalDelay??0,n.vocalGender=t.vocalGender??50,n.vocalBreathiness=t.vocalBreathiness??50,n.vocalTension=t.vocalTension??50,n.vocalOctaveUnison=t.vocalOctaveUnison??`none`,n.config.id===Ee&&(Xn(),q()))},applyTrackInstrument:(e,t)=>{let n=W[e];n&&(n.trackInstrument=E_(t),n.composeSlot=null,n.config.id===Ee&&Xn())},noteToCanvas:(e,t)=>{let n=k.getGridCanvas(),r=e*O.stepWidth-H,i=(O.keyCount-1-(t-O.pitchRangeStart)/(O.unitsPerRow??31))*O.keyHeight-je,a=r>=0&&r<=n.width&&i>=0&&i<=n.height,o=null;return a||(o=r<0?`left`:r>n.width?`right`:i<0?`top`:`bottom`),{x:r,y:i,onScreen:a,side:o}},startTour:()=>D(),destroy:()=>{wn.stop(),b?.destroy(),t.singingVoices?.stopStream(),le?.(),me(),Xr.disconnect(),Qr.disconnect(),document.removeEventListener(`pointermove`,Yt),document.removeEventListener(`pointerup`,Xt),document.removeEventListener(`keydown`,qr),e.innerHTML=``}}},I_={edo:`dtm-global:edo`,loop:`dtm-global:loop`,masterVolume:`dtm-global:master-volume`,masterComp:`dtm-global:master-comp`,reverbAmount:`dtm-global:reverb-amount`,reverbDecay:`dtm-global:reverb-decay`,reverbPreDelay:`dtm-global:reverb-predelay`,delayAmount:`dtm-global:delay-amount`,delayDivision:`dtm-global:delay-division`,fadeIn:`dtm-global:fade-in`,fadeOut:`dtm-global:fade-out`},L_=e=>{try{return typeof localStorage>`u`||!localStorage?null:localStorage.getItem(I_[e])}catch{return null}},R_=(e,t)=>{try{if(typeof localStorage>`u`||!localStorage)return;localStorage.setItem(I_[e],t)}catch{}},z_=(e,t,n)=>{let r=L_(e);if(r===null)return null;let i=Number.parseFloat(r);return Number.isNaN(i)?null:Math.max(t,Math.min(n,i))},B_=e=>{let t=L_(e);return t===`1`||t===`true`?!0:t===`0`||t===`false`?!1:null},V_=48,H_=192,U_=[`melody`,`submelody`,`bass`,`chord`],W_=async(e,t={})=>{let{placements:n,bpm:r,meta:i,lyrics:a}=Qs(e,{collectLyrics:!0}),o=a??new Map,s=new Map(fo(e).map(e=>[e.key,e])),c=r??t.defaultBpm??120,l=60/c/V_,u={...ht,...Dc,...pt(t.drumPatterns??{})},d=i.drum??`none`,f=i.drumVolume??80,p=i.volume??100,m=t.volume??100,h=()=>p/100*m,g=()=>p/100*(m/100),_=[...new Set(n.map(e=>e.trackIndex))].sort((e,t)=>e-t).map(e=>{let t=0,r=n.filter(t=>t.trackIndex===e).map(e=>({id:t++,startStep:e.startStep,durationSteps:e.durationSteps,pitchUnits:e.pitchUnits,velocity:e.velocity}));return{id:U_[e]??`t${e}`,volume:h(),notes:r}}),v=!t.audioContext,y=t.audioContext??new AudioContext,b=t.destination??y.destination,x=t.synth??!t.onPlayNote,S=yc(y,b),C=x?Lc(y,S):null,w=t.pauseWhenHidden??v,T=!1,E=!1,D=t.singingVoices??null,O=e=>[...o.entries()].map(([t,n])=>{let r=[..._.find(e=>e.id===(U_[t]??`t${t}`))?.notes??[]].sort((e,t)=>e.startStep-t.startStep),i=ws(n.syllables,r,{fromStep:e,secondsPerStep:l,gate:(n.gate??100)/100,octaveShiftUnits:(n.octave??0)*372});return{id:U_[t]??`t${t}`,model:n.model,volume:ao(n.volume??200)*g(),pan:mo(n.pan??64),vibrato:n.vibrato,reverbSend:(n.reverb??0)/100,delaySend:(n.delay??0)/100,gender:(n.gender??50)/100,breathiness:(n.breathiness??50)/100,tension:(n.tension??50)/100,octaveUnison:n.octaveUnison,notes:i}}),k=Ec({getTracks:()=>_,getBpm:()=>c,getPlayStartStep:()=>t.startStep??0,getDrumPattern:e=>mt(d,u,e),getSoloTrackId:()=>null,getLoop:()=>t.loop??!1,cues:t.cues,onCue:t.onCue,getAudioTime:()=>y.currentTime,onPlayNote:e=>{let n=U_.indexOf(e.trackId),r=n>=0?n:Number(e.trackId);Number.isNaN(r)&&e.trackId.startsWith(`t`)&&(r=Number(e.trackId.slice(1))),!o.has(r)&&(t.onPlayNote?.(e),C?.playNote(e))},onPlayDrum:e=>{let n=e.velocity*(f/100)*g();t.onPlayDrum?.({...e,velocity:n}),C?.playDrum({...e,velocity:n})},onTick:e=>{t.onTick?.(e)},onEnd:e=>A(),stepsPerBar:H_}),A=()=>{T&&(T=!1,D?.stopStream(),t.onStop?.())},j=()=>{T&&(document.hidden?y.suspend():y.state===`suspended`&&y.resume())};w&&typeof document<`u`&&document.addEventListener(`visibilitychange`,j);let M=()=>{T&&(k.stop(),A())},N={stop:M,isPlaying:()=>T,setVolume:e=>{m=e;for(let e of _)e.volume=h();D?.setVolume(g())},suspend:()=>y.suspend(),resume:()=>y.resume(),destroy:()=>{k.stop(),T=!1,E=!0,D?.reset(),w&&typeof document<`u`&&document.removeEventListener(`visibilitychange`,j),v&&y.state!==`closed`&&y.close()}};T=!0;try{let e=[],r=t.onResumeAudio?.();if(r&&e.push(Promise.resolve(r)),y.state===`suspended`&&e.push(y.resume()),e.length>0&&await Promise.all(e),!T||E)return N;if(o.size>0){D||=js(y,S,{voiceWorkerUrl:t.voiceWorkerUrl,ttsBaseUrl:t.ttsBaseUrl}),s.size>0&&D.registerVoicebanks&&D.registerVoicebanks(Object.fromEntries([...s].map(([e,t])=>[e,t.url])));let e=O(t.startStep??0);if(await D.loadModels(e.map(e=>e.model)),!T||E||(await D.warm(e,3),!T||E))return N;let r,i,a=t.loop??!1;if(a){let e=0,t=-1;if(typeof a==`object`){e=a.start?Tc(a.start,c,H_,l):0;let n=a.end?Tc(a.end,c,H_,l):null;t=n===null?-1:n}if(t===-1){let e=0;for(let t of n)e=Math.max(e,t.startStep+t.durationSteps);t=e}i=e*l,r=(t-e)*l}k.start(t.startStep??0),D.setVolume(g()),D.startStream(e,k.getStartTime(),{loopLengthSec:r,loopStartSec:i})}else k.start(t.startStep??0)}catch(e){throw M(),e}return N},G_=(e,t)=>{let{mountTarget:n,width:r=800,height:i=450,config:a,noteLengthSteps:o=1}=e,s=Qm(n,r,i,a),c=o,l=null,u=!1,d=null,f=[],p=[],m=new Cm({onMMLGenerated:t.onMMLGenerated,onNotesChanged:e=>{t.onNotesChanged(e)}},80,()=>a),h=()=>({noteLengthSteps:c}),g=!1;s.onClick((e,n)=>{if(g){g=!1;return}let r=m.getToolMode();if(r===`pen`)m.addNote(e,n,h()),t.onNoteClick?.(e,n,!1);else if(r===`eraser`){let r=m.getNotes().find(t=>t.startStep<=e&&e<t.startStep+t.durationSteps&&t.pitchUnits===n);r&&(m.deleteNoteById(r.id),t.onNoteClick?.(e,n,!0))}});let _=s.getGridCanvas(),v=null,y=!1,b=null,x=(e,t)=>{let{stepWidth:n,keyHeight:r,keyCount:i,pitchRangeStart:a,unitsPerRow:o=31}=s.getRenderConfig(),c=s.getDrawOffset();for(let s of m.getNotes()){let l=s.startStep*n,u=(i-1-(s.pitchUnits-a)/o)*r,d=s.durationSteps*n,f=r,p=l-c.x,m=u-c.y;if(e>=p&&e<p+d&&t>=m&&t<m+f)return s}return null},S=t=>{if(m.getToolMode()===`select`&&u&&d){let{x:e,y:n}=s.getGridPosition(t);l={x:Math.min(e,d.x),y:Math.min(n,d.y),width:Math.abs(e-d.x),height:Math.abs(n-d.y)},f=T(l),w();return}if(!v)return;y=!0;let{step:n,pitch:r}=s.getGridPosition(t);if(v.mode===`move`){if(v.selectedNotes&&v.selectedNotes.length>0){let t=v.noteId,i=v.selectedNotes.find(e=>e.id===t);if(!i)return;let a=n-v.dragOffsetStep,o=r-v.dragOffsetPitch,s=a-i.startStep,c=o-i.pitchUnits;for(let e of v.selectedNotes){let t=e.startStep+s,n=$t(e.pitchUnits+c);m.moveNote(e.id,t,n)}e.onPreviewSound&&r!==b&&(b=r,e.onPreviewSound(r,n)),w();return}let t=n-v.dragOffsetStep,i=$t(r-v.dragOffsetPitch);m.moveNote(v.noteId,t,i);return}let i=n-v.startStep+1;m.resizeNote(v.noteId,i)},C=()=>{let e=m.getToolMode()===`select`;e&&(u=!1,d=null),v&&(y&&(v.mode===`move`?m.moveNoteEnd(v.noteId):m.resizeNoteEnd(v.noteId)),v=null,y&&(g=!0)),y=!1,e&&(l=null,w())};_.addEventListener(`pointerdown`,e=>{let{x:t,y:n,step:r,pitch:i}=s.getGridPosition(e);if(m.getToolMode()===`select`){let e=x(t,n);if(l&&e){let t=T(l);if(t.some(t=>t.id===e.id)){v={noteId:e.id,mode:`move`,dragOffsetStep:r-e.startStep,dragOffsetPitch:i-e.pitchUnits,startStep:e.startStep,selectedNotes:t},u=!1,d=null;return}}f=[],l=null,u=!0,d={x:t,y:n,step:r,pitch:i};return}let a=x(t,n);if(!a)return;let{stepWidth:o,keyHeight:c,keyCount:p,pitchRangeStart:h,unitsPerRow:g=31}=s.getRenderConfig(),_=s.getDrawOffset(),y=a.startStep*o,b=(p-1-(a.pitchUnits-h)/g)*c,S=y-_.x,C=b-_.y,w=a.durationSteps*o;if(t>=S+w-6&&t<=S+w&&n>=C&&n<=C+c){v={noteId:a.id,mode:`resize`,dragOffsetStep:0,dragOffsetPitch:0,startStep:a.startStep};return}v={noteId:a.id,mode:`move`,dragOffsetStep:r-a.startStep,dragOffsetPitch:i-a.pitchUnits,startStep:a.startStep}}),_.addEventListener(`pointerleave`,C),document.addEventListener(`pointerup`,C),document.addEventListener(`pointermove`,S),_.addEventListener(`wheel`,e=>{e.preventDefault();let t=s.getRenderConfig(),n=_.height,r=Math.max(0,t.keyCount*t.keyHeight-n),i=s.getDrawOffset(),a=Math.min(Math.max(i.y+e.deltaY,0),r);s.setDrawOffset(i.x,a),s.drawGrid(),s.drawNotes(m.getNotes())},{passive:!1});let w=()=>{if(s.drawGrid(),s.drawNotes(m.getNotes()),m.getToolMode()===`select`&&(s.drawSelectionRect(l),f.length>0)){let e=new Set(f.map(e=>e.id));s.drawSelectedNotes(m.getNotes(),e)}},T=e=>{let{stepWidth:t,keyHeight:n,keyCount:r,pitchRangeStart:i,unitsPerRow:a=31}=s.getRenderConfig(),o=s.getDrawOffset(),c=[];for(let s of m.getNotes()){let l=s.startStep*t,u=(r-1-(s.pitchUnits-i)/a)*n,d={x:l-o.x,y:u-o.y,width:s.durationSteps*t,height:n};e.x<d.x+d.width&&e.x+e.width>d.x&&e.y<d.y+d.height&&e.y+e.height>d.y&&c.push(s)}return c};return w(),{core:m,getNotes:()=>m.getNotes(),getMML:()=>m.getMML(),setVolume:e=>m.setVolume(e),setNoteLengthSteps:e=>{c=e},redraw:w,setToolMode:e=>{m.setToolMode(e),e!==`select`&&(l=null,f=[])},getToolMode:()=>m.getToolMode(),getSelectionRect:()=>l,getNotesInRect:T,clearSelection:()=>{l=null,f=[]},copySelection:()=>(p=[...f],p),pasteNotes:(e,t)=>{if(p.length===0)return;let n=Math.min(...p.map(e=>e.startStep));p.forEach(e=>{let r=t+(e.startStep-n);m.addNote(r,e.pitchUnits,{noteLengthSteps:e.durationSteps,velocity:e.velocity})})}}},K_=e=>(t,n)=>(e.set(t,n),n),q_=2**53-1,J_=536870912,Y_=J_*2,X_=(e,t)=>n=>{let r=t.get(n),i=r===void 0?n.size:r<Y_?r+1:0;if(!n.has(i))return e(n,i);if(n.size<J_){for(;n.has(i);)i=Math.floor(Math.random()*Y_);return e(n,i)}if(n.size>q_)throw Error(`Congratulations, you created a collection of unique numbers which uses all available integers!`);for(;n.has(i);)i=Math.floor(Math.random()*q_);return e(n,i)},Z_=new WeakMap,Q_=X_(K_(Z_),Z_),$_=((e,t,n,r)=>i=>{let a=t(i);return t=>{let i=e(t);t.addEventListener(`message`,(({data:e})=>{let{id:t}=e;if(t!==null&&i.has(t)){let{reject:n,resolve:r}=i.get(t);i.delete(t),e.error===void 0?r(e.result):n(Error(e.error.message))}})),r(t)&&t.start();let o=(e,r=null,a=[])=>new Promise((o,s)=>{let c=n(i);i.set(c,{reject:s,resolve:o}),r===null?t.postMessage({id:c,method:e},a):t.postMessage({id:c,method:e,params:r},a)}),s=(e,n,r=[])=>{t.postMessage({id:null,method:e,params:n},r)},c={};for(let[e,t]of Object.entries(a))c={...c,[e]:t({call:o,notify:s})};return{...c}}})((e=>t=>{if(e.has(t))return e.get(t);let n=new Map;return e.set(t,n),n})(new WeakMap),(e=>t=>({...t,connect:({call:t})=>async()=>{let{port1:n,port2:r}=new MessageChannel,i=await t(`connect`,{port:n},[n]);return e.set(r,i),r},disconnect:({call:t})=>async n=>{let r=e.get(n);if(r===void 0)throw Error(`The given port is not connected.`);await t(`disconnect`,{portId:r})},isSupported:({call:e})=>()=>e(`isSupported`)}))(new WeakMap),Q_,e=>typeof e.start==`function`)({parseArrayBuffer:({call:e})=>async t=>e(`parse`,{arrayBuffer:t},[t])}),ev=e=>$_(new Worker(e)),tv=new Blob([`(()=>{var e={455(e,t){!function(e){"use strict";var t=function(e){return function(t){var n=e(t);return t.add(n),n}},n=function(e){return function(t,n){return e.set(t,n),n}},r=void 0===Number.MAX_SAFE_INTEGER?9007199254740991:Number.MAX_SAFE_INTEGER,o=536870912,s=2*o,i=function(e,t){return function(n){var i=t.get(n),a=void 0===i?n.size:i<s?i+1:0;if(!n.has(a))return e(n,a);if(n.size<o){for(;n.has(a);)a=Math.floor(Math.random()*s);return e(n,a)}if(n.size>r)throw new Error("Congratulations, you created a collection of unique numbers which uses all available integers!");for(;n.has(a);)a=Math.floor(Math.random()*r);return e(n,a)}},a=new WeakMap,f=n(a),c=i(f,a),u=t(c);e.addUniqueNumber=u,e.generateUniqueNumber=c}(t)}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var s=t[r]={exports:{}};return e[r].call(s.exports,s,s.exports,n),s.exports}(()=>{"use strict";const e=-32603,t=-32602,r=-32601,o=(e,t)=>Object.assign(new Error(e),{status:t}),s=t=>o('The handler of the method called "'.concat(t,'" returned an unexpected result.'),e),i=(t,n)=>async({data:{id:i,method:a,params:f}})=>{const c=n[a];try{if(void 0===c)throw(e=>o('The requested method called "'.concat(e,'" is not supported.'),r))(a);const n=void 0===f?c():c(f);if(void 0===n)throw(t=>o('The handler of the method called "'.concat(t,'" returned no required result.'),e))(a);const u=n instanceof Promise?await n:n;if(null===i){if(void 0!==u.result)throw s(a)}else{if(void 0===u.result)throw s(a);const{result:e,transferables:n=[]}=u;t.postMessage({id:i,result:e},n)}}catch(e){const{message:n,status:r=-32603}=e;t.postMessage({error:{code:r,message:n},id:i})}};var a=n(455);const f=new Map,c=(e,n,r)=>({...n,connect:({port:t})=>{t.start();const r=e(t,n),o=(0,a.generateUniqueNumber)(f);return f.set(o,()=>{r(),t.close(),f.delete(o)}),{result:o}},disconnect:({portId:e})=>{const n=f.get(e);if(void 0===n)throw(e=>o('The specified parameter called "portId" with the given value "'.concat(e,'" does not identify a port connected to this worker.'),t))(e);return n(),{result:null}},isSupported:async()=>{if(await new Promise(e=>{const t=new ArrayBuffer(0),{port1:n,port2:r}=new MessageChannel;n.onmessage=({data:t})=>e(null!==t),r.postMessage(t,[t])})){const e=r();return{result:e instanceof Promise?await e:e}}return{result:!1}}}),u=(e,t,n=()=>!0)=>{const r=c(u,t,n),o=i(e,r);return e.addEventListener("message",o),()=>e.removeEventListener("message",o)},l=e=>void 0!==e.channel,d=e=>e.toString(16).toUpperCase().padStart(2,"0"),g=(e,t=0,n=e.byteLength-(t-e.byteOffset))=>{const r=t+e.byteOffset,o=[],s=new Uint8Array(e.buffer,r,n);for(let e=0;e<n;e+=1)o[e]=d(s[e]);return o.join("")},h=(e,t=0,n=e.byteLength-(t-e.byteOffset))=>{const r=t+e.byteOffset,o=new Uint8Array(e.buffer,r,n);return String.fromCharCode.apply(null,o)},m=e=>{const t=new DataView(e),n=v(t);let r=14;const o=[];for(let e=0,s=n.numberOfTracks;e<s;e+=1){let e;({offset:r,track:e}=b(t,r)),o.push(e)}return{division:n.division,format:n.format,tracks:o}},p=(e,t,n)=>{let r;const{offset:o,value:s}=T(e,t),i=e.getUint8(o);return r=240===i?y(e,o+1):255===i?U(e,o+1):w(i,e,o+1,n),{...r,event:{...r.event,delta:s},eventTypeByte:i}},v=e=>{if(e.byteLength<14)throw new Error("Expected at least 14 bytes instead of ".concat(e.byteLength));if("MThd"!==h(e,0,4))throw new Error('Unexpected characters "'.concat(h(e,0,4),'" found instead of "MThd"'));if(6!==e.getUint32(4))throw new Error("The header has an unexpected length of ".concat(e.getUint32(4)," instead of 6"));const t=e.getUint16(8),n=e.getUint16(10);return{division:e.getUint16(12),format:t,numberOfTracks:n}},U=(e,t)=>{let n;const r=e.getUint8(t),{offset:o,value:s}=T(e,t+1);if(1===r)n={text:h(e,o,s)};else if(2===r)n={copyrightNotice:h(e,o,s)};else if(3===r)n={trackName:h(e,o,s)};else if(4===r)n={instrumentName:h(e,o,s)};else if(5===r)n={lyric:h(e,o,s)};else if(6===r)n={marker:h(e,o,s)};else if(7===r)n={cuePoint:h(e,o,s)};else if(8===r)n={programName:h(e,o,s)};else if(9===r)n={deviceName:h(e,o,s)};else if(10===r||11===r||12===r||13===r||14===r||15===r)n={metaTypeByte:d(r),text:h(e,o,s)};else if(32===r)n={channelPrefix:e.getUint8(o)};else if(33===r)n={midiPort:e.getUint8(o)};else if(47===r)n={endOfTrack:!0};else if(81===r)n={setTempo:{microsecondsPerQuarter:(e.getUint8(o)<<16)+(e.getUint8(o+1)<<8)+e.getUint8(o+2)}};else if(84===r){let t;const r=e.getUint8(o);96&r?32==(96&r)?t=25:64==(96&r)?t=29:96&~r||(t=30):t=24,n={smpteOffset:{frame:e.getUint8(o+3),frameRate:t,hour:31&r,minutes:e.getUint8(o+1),seconds:e.getUint8(o+2),subFrame:e.getUint8(o+4)}}}else if(88===r)n={timeSignature:{denominator:Math.pow(2,e.getUint8(o+1)),metronome:e.getUint8(o+2),numerator:e.getUint8(o),thirtyseconds:e.getUint8(o+3)}};else if(89===r)n={keySignature:{key:e.getInt8(o),scale:e.getInt8(o+1)}};else{if(127!==r)throw new Error('Cannot parse a meta event with a type of "'.concat(d(r),'"'));n={sequencerSpecificData:g(e,o,s)}}return{event:n,offset:o+s}},w=(e,t,n,r)=>{const o=128&e?null:r,s=(null===o?e:o)>>4;let i,a=null===o?n:n-1;if(8===s)i={noteOff:{noteNumber:t.getUint8(a),velocity:t.getUint8(a+1)}},a+=2;else if(9===s){const e=t.getUint8(a),n=t.getUint8(a+1);i=0===n?{noteOff:{noteNumber:e,velocity:n}}:{noteOn:{noteNumber:e,velocity:n}},a+=2}else if(10===s)i={keyPressure:{noteNumber:t.getUint8(a),pressure:t.getUint8(a+1)}},a+=2;else if(11===s)i={controlChange:{type:t.getUint8(a),value:t.getUint8(a+1)}},a+=2;else if(12===s)i={programChange:{programNumber:t.getUint8(a)}},a+=1;else if(13===s)i={channelPressure:{pressure:t.getUint8(a)}},a+=1;else{if(14!==s)throw new Error('Cannot parse a midi event with a type of "'.concat(d(s),'"'));i={pitchBend:t.getUint8(a)|t.getUint8(a+1)<<7},a+=2}return i.channel=15&(null===o?e:o),{event:i,offset:a}},y=(e,t)=>{const{offset:n,value:r}=T(e,t);return{event:{sysex:g(e,n,r)},offset:n+r}},b=(e,t)=>{if("MTrk"!==h(e,t,4))throw new Error('Unexpected characters "'.concat(h(e,t,4),'" found instead of "MTrk"'));const n=[],r=e.getUint32(t+4)+t+8;let o=null,s=t+8;for(;s<r;){const t=p(e,s,o),{event:r,eventTypeByte:i}=t;n.push(r),s=t.offset,l(r)&&(128&i)>0&&(o=i)}return{offset:s,track:n}},T=(e,t)=>{let n=t,r=0;for(;;){const t=e.getUint8(n);if(n+=1,!(t>127))return r+=t,{offset:n,value:r};r+=127&t,r<<=7}};u(self,{parse:({arrayBuffer:e})=>({result:m(e)})})})()})();`],{type:`application/javascript; charset=utf-8`}),nv=URL.createObjectURL(tv),rv=ev(nv);rv.connect,rv.disconnect,rv.isSupported;var iv=rv.parseArrayBuffer;URL.revokeObjectURL(nv);var av=(e,t,n={})=>{let r=n.threshold??.98,i=n.holdMs??800,a=e.createAnalyser();a.fftSize=512,t.connect(a);let o=new Float32Array(a.fftSize),s=!1,c=0,l=0,u=new Set,d=null,f=()=>{a.getFloatTimeDomainData(o);let e=0,t=!1;for(let n=0;n<o.length;n++){let i=Math.abs(o[n]);i>e&&(e=i),i>=r&&(t=!0)}l=e;let n=performance.now();t&&(c=n+i);let p=n<c;if(p!==s){s=p;for(let e of u)e(s)}d=requestAnimationFrame(f)};return d=requestAnimationFrame(f),{onClipChange:e=>(u.add(e),()=>u.delete(e)),getPeakLevel:()=>l,reset:()=>{if(c=0,s){s=!1;for(let e of u)e(!1)}},dispose:()=>{d!==null&&cancelAnimationFrame(d),d=null,a.disconnect(),u.clear()}}},ov=(e,t,n)=>{e.has(t)||e.set(t,new n);let r=e.get(t);if(r===void 0)throw Error(`touch: unexpected undefined`);return r},sv=new class{font=null;fonts=new Map;async load({ctx:e,font:t,id:n,keys:r}){let i=ov(ov(this.fonts,t,Map),n,Map),a=r.filter(e=>!i.has(e));if(a.length>0){let r=await Promise.all(a.map(async r=>{let i=`${r}_${n}_${t}`;try{let t=await Ml.load({ctx:e,fontName:`_drum_${i}`,url:`https://surikov.github.io/webaudiofontdata/sound/128${i}.js`,isDrum:!0,pitchs:[r]});return[Number(r),t]}catch(e){return console.warn(`[dtm] \u30C9\u30E9\u30E0\u30AD\u30FC ${r} \u306E\u30ED\u30FC\u30C9\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3057\u305F`,e),null}}));for(let e of r)e&&i.set(e[0],e[1])}this.font=i}play(e){let{font:t}=this;if(!t)return;let n=e?.pitch??60;t.has(n)&&t.get(n)?.play(e)}},cv=(e,t,n)=>{e.has(t)||e.set(t,new n);let r=e.get(t);if(r===void 0)throw Error(`touch: unexpected undefined`);return r},lv=new class{tone=new Map;drum=new Map;callback=new Set;onload(e){this.callback.add(e)}async init(){let e=await(await fetch(`https://surikov.github.io/webaudiofontdata/sf2/list.txt`)).text(),{tone:t,drum:n}=this;for(let r of e.trim().split(`
`))if(r.slice(0,3)===`128`){let e=r.slice(3).split(`_`),[t,i]=e;cv(cv(n,e.slice(2).join(`_`).slice(0,-3),Map),i,Set).add(t)}else{let e=r.split(`_`),[n]=e;cv(t,e.slice(1).join(`_`).slice(0,-3),Set).add(n)}for(let e of this.callback)e();this.callback.clear()}},uv=(e,t,n)=>{for(let r=0;r<n.length;r++,t+=2){let i=Math.max(-1,Math.min(1,n[r]));e.setInt16(t,i<0?i*32768:i*32767,!0)}},dv=(e,t,n)=>{for(let r=0;r<n.length;r++)e.setUint8(t+r,n.charCodeAt(r))},fv=(e,t)=>{let n=e.length,r=e[0]?.length??0,i=n*2,a=r*i,o=new ArrayBuffer(44+a),s=new DataView(o);if(dv(s,0,`RIFF`),s.setUint32(4,36+a,!0),dv(s,8,`WAVE`),dv(s,12,`fmt `),s.setUint32(16,16,!0),s.setUint16(20,1,!0),s.setUint16(22,n,!0),s.setUint32(24,t,!0),s.setUint32(28,t*i,!0),s.setUint16(32,i,!0),s.setUint16(34,16,!0),dv(s,36,`data`),s.setUint32(40,a,!0),n===1)uv(s,44,e[0]);else{let t=44;for(let i=0;i<r;i++)for(let r=0;r<n;r++){let n=Math.max(-1,Math.min(1,e[r][i]));s.setInt16(t,n<0?n*32768:n*32767,!0),t+=2}}return new Blob([o],{type:`audio/wav`})},pv=e=>{let t=e.reduce((e,t)=>e+t.length,0),n=new Float32Array(t),r=0;for(let t of e)n.set(t,r),r+=t.length;return n},mv=`FluidR3_GM_sf2_file`,hv=[`melody`,`submelody`,`bass`,`chord`,`t4`,`t5`,`t6`,`t7`,`t8`,`t9`,`t10`,`t11`,`t12`,`t13`,`t14`],gv=e=>{let t=hv.indexOf(e);if(t>=0)return{trackIdx:t,role:e};if(e.startsWith(`t`)){let t=Number(e.slice(1)),n=Number.isNaN(t)?0:t;return{trackIdx:n,role:hv[n]??`t${n}`}}let n=Number(e),r=Number.isNaN(n)?0:n;return{trackIdx:r,role:hv[r]??`t${r}`}},_v=()=>{try{return new URL(`/rpg/assets/voice-worker-BfO5RyrS.js`,``+import.meta.url).href}catch{return}},vv=`tsukuyomi`,yv=async(e={})=>{let t={midi:!0,chord:!0,presetUI:!0,help:!0,...e.features},n=e=>({...ht,...Dc,...pt(e??{})}),i=e.audioContext??new AudioContext({sampleRate:44100}),a=i.createGain();a.gain.value=(e.masterVolume??100)/100;let o=i.createGain();o.gain.value=(e.drumVolume??100)/100,o.connect(a);let s=e.reverbDecay??$s,c=i.createDelay(ac/1e3);c.delayTime.value=(e.reverbPreDelay??rc)/1e3;let l=i.createConvolver();l.buffer=oc(i,s),l.normalize=!0;let u=i.createGain();u.gain.value=sc(e.reverbAmount??0),c.connect(l),l.connect(u);let d=e=>{u.gain.setTargetAtTime(sc(e),i.currentTime,.02)},f=e=>{s=Math.max(ec,Math.min(tc,e)),l.buffer=oc(i,s)},p=e=>{c.delayTime.setTargetAtTime(Math.max(ic,Math.min(ac,e))/1e3,i.currentTime,.02)},m=i.createGain();a.connect(m),u.connect(m);let h=Mp(i,m,{amount:e.delayAmount??0,division:e.delayDivision??`8`}),g=e=>h.setAmount(e),_=i.createDynamicsCompressor();_.knee.value=6;let v=i.createGain();m.connect(_),_.connect(v);let y=e=>{let t=Math.max(0,Math.min(100,e))/100;return{threshold:0+-18*t,ratio:1+3*t,attack:.03+(.01-.03)*t,release:.3+-.15*t,makeupDb:2.5*t}},b=e=>{let t=y(e),n=i.currentTime;_.threshold.setValueAtTime(t.threshold,n),_.ratio.setValueAtTime(t.ratio,n),_.attack.setValueAtTime(t.attack,n),_.release.setValueAtTime(t.release,n),v.gain.setTargetAtTime(10**(t.makeupDb/20),n,.02)};b(e.masterCompression??0);let x=e=>b(e),S=Ln(i,e.destination??i.destination),C=S.node,w=yc(i,C);v.connect(w);let T=S.restoreIfMuted,E=S.schedule,D=av(i,v),O=new Map,k=e=>{let t=O.get(e);return t||(t=Qt(i,a,{reverbBus:c,delayBus:h.input}),O.set(e,t)),t},A=new Map,j=(e,t)=>{let n=k(e);return A.get(e)!==t&&(A.set(e,t),n.setInstrumentTone(t)),n.input},M=new Set([35,36]),ee=e=>{let t=i.currentTime+e;for(let[e,n]of A)n===`bass`&&O.get(e)?.duck(t,.25,.16)},P=e=>{let t=new Set;return(n,r)=>{if(t.has(n))return;t.add(n);let i=k(n),a=e.trackCompression?.[r];a!==void 0&&i.setCompression(a);let o=e.trackWidth?.[r];o!==void 0&&i.setWidth(o);let s=e.trackEqLow?.[r];s!==void 0&&i.setEqLow(s);let c=e.trackEqMid?.[r];c!==void 0&&i.setEqMid(c);let l=e.trackEqHigh?.[r];l!==void 0&&i.setEqHigh(l);let u=e.trackReverbSend?.[r];u!==void 0&&i.setReverbSend(u);let d=e.trackDelaySend?.[r];d!==void 0&&i.setDelaySend(d);let f=e.trackPan?.[r];f!==void 0&&i.setPan(mo(f))}},F=()=>(T(),i.state===`closed`?Promise.resolve():i.resume()),te=e.engines??{},ne=te.SoundFont??Ml,re=te.SoundFont_drum??sv,I=te.SoundFont_list??lv,ie;t.midi&&(ie=te.parseMidi||(e=>{let t=e.buffer;if(t instanceof ArrayBuffer)return iv(t.slice(e.byteOffset,e.byteOffset+e.byteLength));throw Error(`SharedArrayBuffer is not supported for MIDI parsing`)}));let ae=js(i,a,{voiceWorkerUrl:e.voiceWorkerUrl===null?void 0:e.voiceWorkerUrl??_v(),voicebanks:e.koeBaseUrl?Object.fromEntries(Object.entries(Co).map(([t,n])=>[t,Ao(n,e.koeBaseUrl)])):void 0,worldlineScriptUrl:e.worldlineScriptUrl,ttsBaseUrl:e.ttsBaseUrl,reverbBus:l,delayBus:h.input,getTrackDestination:e=>k(e).input}),oe=new Promise(e=>{I.init(),I.onload(()=>e())}),L=new Map,se=async(e,t=`FluidR3_GM_sf2_file:0`)=>{let[n,r]=t.split(`:`),a=L.get(t);a||(a=new Set,L.set(t,a));let o=e.filter(e=>!a.has(e));try{await re.load({ctx:i,font:n,id:r||`0`,keys:o});for(let e of o)a.add(e)}catch(e){console.error(`[dtm] ドラム音源の読み込みに失敗`,e)}},ce=Promise.resolve(),le={},ue=e=>{if(le[e])return le[e];let t=e.replace(/\s+/g,``).toLowerCase(),n=Object.keys(le).find(e=>e.replace(/\s+/g,``).toLowerCase()===t);return n?le[n]:void 0},de=new Map,R=new Map,z=e=>{if(de.has(e))return Promise.resolve();let t=R.get(e);if(t)return t;let n=`${e}_${mv}`,r=ne.load({ctx:i,fontName:`_tone_${n}`,url:ne.toURL(n)}).then(t=>{de.set(e,t)}).catch(t=>{console.error(`[dtm] \u697D\u5668 "${e}" \u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557`,t)}).finally(()=>{R.delete(e)});return R.set(e,r),r},fe=e.defaultPreset??`retro_game`,pe=(e,t=`simple`)=>t===`simple`?e===0?`melody`:e===1?`submelody`:e===2?`bass`:`chord`:hv[e]??`t${e}`,me=(e,t=`simple`)=>{if(e===`melody`||e===`submelody`||e===`bass`||e===`chord`)return e;if(e.startsWith(`t`)){let n=Number(e.substring(1));if(!Number.isNaN(n))return pe(n,t)}return e},he=(e,t)=>e[t]??e.melody,ge=(e,t,n=`simple`)=>{let r=yp[e];if(!r)return;let i=me(t,n),a=le[he(r,i)];return a?de.get(a):void 0},_e=async(e,t=[...hv],n=`simple`)=>{let r=yp[e];if(!r)return;await oe;let i=new Set;for(let e of t){let t=me(e,n),a=le[he(r,t)];a&&i.add(a)}await Promise.all([...i].map(e=>z(e)))},ve=async(e,t,n,r,i=`simple`)=>{let a=e.getPlaybackState()===`playing`;a&&e.pause();let o=r?Yc(r):null;e.setLoading?.(!0);try{e.setInstrument(t),await _e(t,n,i)}finally{o?.remove(),e.setLoading?.(!1),a&&e.play()}},ye=(e,t)=>{let n=e.ownerDocument,r=n.createElement(`div`);if(r.className=t.className??`dtm-controlbar`,t.label!==null){let e=n.createElement(`span`);e.className=`dtm-controlbar-label`,e.textContent=t.label??`楽器プリセット`,r.appendChild(e)}let i=n.createElement(`select`);i.className=`dtm-select dtm-grow`;for(let[e,t]of Object.entries(yp)){let r=n.createElement(`option`);r.value=e,r.textContent=t.displayName,i.appendChild(r)}i.value=t.value&&yp[t.value]?t.value:fe,r.appendChild(i);let a=!1,o=async()=>{let e=t.getDaw();if(!e||a)return;a=!0;let n=i.value;t.onChange?.(n);let r=t.getTrackIds?.()??[...hv],o=r.includes(`t0`)?`advanced`:`simple`;try{await ve(e,n,r,t.loadingTarget,o)}finally{a=!1}};return i.addEventListener(`change`,o),t.position===`prepend`?e.insertBefore(r,e.firstChild):e.appendChild(r),{element:r,select:i,setValue:e=>{yp[e]&&(i.value=e)},getValue:()=>i.value,destroy:()=>{i.removeEventListener(`change`,o),r.remove()}}};await oe,le=await r(),await Promise.all([ce,_e(fe)]);let be=e=>{re.font&&(e.when===0&&T(),M.has(e.pitch)&&ee(e.when),re.play({ctx:i,destination:o,pitch:e.pitch,volume:e.velocity,when:e.when,duration:e.duration}))},xe=new WeakMap,Se=[],Ce=[],we=[],Te=[],Ee=(n,r={})=>{let{preset:o,presetUI:s,onInstrumentChange:c,onTrackInstrumentChange:l,...u}={midiSearch:e.midiSearch,...r},m=(u.tracks??m_).map(e=>e.id),_=o&&yp[o]?o:fe,v=r.initialMML?Js(r.initialMML):{},y=v.instrument&&yp[v.instrument]?v.instrument:_,b=y,S=u.mode===`advanced`,C=new Map;if(v.trackInstruments)for(let[e,t]of Object.entries(v.trackInstruments)){let n=Number(e),r=ue(t);r&&C.set(n,r)}let w=e=>{e.when===0&&T();let{trackIdx:t,role:n}=gv(e.trackId),r=t>=0?C.get(t):void 0,a;if(a=r?de.get(r):ge(b,n,S?`advanced`:`simple`),!a)return;let{midi:o,detuneCents:s}=mn(e.pitchUnits);a.play({ctx:i,destination:j(e.trackId,a.tone??`none`),pitch:o,detuneCents:s,volume:e.volume,velocity:e.velocity,when:e.when,duration:e.duration})},O,A=null,M=e=>{if(b=e,A&&A.setValue(e),yp[e]){let t=O?.getPlaybackState()===`playing`;t&&O.pause(),O?.setLoading?.(!0),_e(e,m,S?`advanced`:`simple`).finally(()=>{O?.setLoading?.(!1),t&&O?.play()})}c?.(e)},ee=async(e,t)=>{if(!t){C.delete(e);return}await oe;let n=ue(t);n&&(C.set(e,n),await z(n))};O=F_(n,{getAudioTime:()=>i.currentTime,backingAudio:N({audioContext:i,destination:a,getYoutubeContainer:()=>n.querySelector(`[data-dtm="audio-youtube"]`)}),onResumeAudio:async()=>{await F(),O&&await se(O.getUsedDrumKeys(),O.getDrumFont()),await u.onResumeAudio?.()},onPlayNote:w,onPlayDrum:be,onExportWav:async()=>{if(!O)return;O.stop(),await F(),Re(),await O.play(),await new Promise(e=>{let t=setInterval(()=>{O.getPlaybackState()!==`playing`&&(clearInterval(t),e())},200)});let e=await ze(),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`dtm.wav`,n.click(),URL.revokeObjectURL(t)},singingVoices:ae,parseMidi:ie,onInstrumentChange:M,onTrackInstrumentChange:(e,t)=>{ee(e,t),l?.(e,t)},reverbAmount:e.reverbAmount,onReverbChange:d,reverbDecay:e.reverbDecay,onReverbDecayChange:f,reverbPreDelay:e.reverbPreDelay,onReverbPreDelayChange:p,delayAmount:e.delayAmount,onDelayChange:g,delayDivision:e.delayDivision,onDelayDivisionChange:e=>h.setDivision(e),masterCompression:e.masterCompression,onMasterCompressionChange:x,onBpmChange:e=>h.setBpm(e),fadeInSec:e.fadeInSec,fadeOutSec:e.fadeOutSec,onScheduleFade:E,onTrackCompressionChange:(e,t)=>k(e).setCompression(t),onTrackWidthChange:(e,t)=>k(e).setWidth(t),onTrackReverbSendChange:(e,t)=>k(e).setReverbSend(t),onTrackDelaySendChange:(e,t)=>k(e).setDelaySend(t),onTrackEqLowChange:(e,t)=>k(e).setEqLow(t),onTrackEqMidChange:(e,t)=>k(e).setEqMid(t),onTrackEqHighChange:(e,t)=>k(e).setEqHigh(t),onTrackPanChange:(e,t)=>k(e).setPan(mo(t)),clipMeter:D,showHelp:t.help,tour:e.tour,...u,onDrumChange:e=>{O&&se(O.getUsedDrumKeys(),O.getDrumFont()),u.onDrumChange?.(e)},onDrumFontChange:e=>{if(O){let t=O.getPlaybackState()===`playing`;t&&O.pause(),O.setLoading?.(!0),se(O.getUsedDrumKeys(),e).finally(()=>{O.setLoading?.(!1),t&&O.play()})}u.onDrumFontChange?.(e)}}),Se.push(O);let P=s??t.presetUI,te=n.querySelector(`[data-dtm="roll"]`),ne=n.querySelector(`[data-dtm="preset-select-slot"]`);P&&(xe.get(n)?.destroy(),A=ye(ne??n,{getDaw:()=>O,getTrackIds:()=>m,value:y,loadingTarget:te??n,position:ne?`append`:`prepend`,onChange:e=>{M(e)}}),xe.set(n,A)),O.setInstrument(y);let re=te?Yc(te):null;O.setLoading?.(!0),_e(y,m,S?`advanced`:`simple`).finally(()=>{re?.remove(),O.setLoading?.(!1)});let I=()=>{O.destroy(),A?.destroy(),xe.get(n)===A&&xe.delete(n);let e=Se.indexOf(O);e>=0&&Se.splice(e,1)};return{...O,setInstrument:e=>{O.setInstrument(e),b=e,A&&A.setValue(e)},applyTrackInstrument:(e,t)=>{O.applyTrackInstrument(e,t),ee(e,t)},destroy:I}},De=(e,t)=>{let n=e.ownerDocument,r=t.tracksFor??(e=>e===`advanced`?h_:m_),i={simple:t.labels?.simple??`初心者`,advanced:t.labels?.advanced??`上級者`},a=e=>typeof t.editorOptions==`function`?t.editorOptions(e):t.editorOptions??{},o=t.mode??`simple`,s=null,c=n.createElement(`div`);if(c.className=t.className??`dtm-controlbar`,t.label!==null){let e=n.createElement(`span`);e.className=`dtm-controlbar-label`,e.textContent=t.label??`モード`,c.appendChild(e)}let l=n.createElement(`div`);l.className=`dtm-modeseg`;let u=new Map,d=()=>{for(let[e,t]of u)t.classList.toggle(`dtm-modebtn--active`,e===o)};for(let e of[`simple`,`advanced`]){let t=n.createElement(`button`);t.type=`button`,t.className=`dtm-modebtn`,t.textContent=i[e],t.addEventListener(`click`,()=>h(e)),l.appendChild(t),u.set(e,t)}c.appendChild(l);let f=()=>{t.position===`prepend`?e.insertBefore(c,e.firstChild):e.appendChild(c)},p=(e,n)=>{let i=a(e);s=Ee(t.editorTarget,{...i,mode:e,tracks:r(e),initialMML:n??i.initialMML,onRequestAdvancedMode:(e,n)=>{m(),o=`advanced`,d(),t.onChange?.(`advanced`),p(`advanced`,e),n&&s&&n(s)}}),f(),t.onMount?.(s,e)},m=()=>{if(!s)return;let e=s.getMML().full;return t.onUnmount?.(s,o),s.destroy(),s=null,e};function h(e){if(e===o&&s)return;let n=m();o=e,d(),t.onChange?.(e),p(e,n)}d(),p(o,a(o).initialMML);let g={element:c,getDaw:()=>s,getMode:()=>o,setMode:h,destroy:()=>{m(),c.remove();let e=Te.indexOf(g);e>=0&&Te.splice(e,1)}};return Te.push(g),g},B=(t,r,o={})=>{let s=Qs(r,{}),c=s.meta??{},l=c.instrument&&yp[c.instrument]?c.instrument:fe,u=c.mode===`advanced`,d=[...new Set(s.placements.map(e=>e.trackIndex))].map(e=>pe(e,u?`advanced`:`simple`)),f=d.length>0?d:[...hv],p=new Map,m=Promise.all([_e(l,f,u?`advanced`:`simple`),(async()=>{if(c.trackInstruments){await oe;for(let[e,t]of Object.entries(c.trackInstruments)){let n=ue(t);n&&(p.set(Number(e),n),await z(n))}}})()]),h=P(c),g=e=>{let t=Number(e.trackId);h(e.trackId,t);let n=p.get(t),r;if(n)r=de.get(n);else{let e=pe(t,u?`advanced`:`simple`);r=ge(l,e,u?`advanced`:`simple`)}if(!r)return;let{midi:a,detuneCents:o}=mn(e.pitchUnits);r.play({ctx:i,destination:j(e.trackId,r.tone??`none`),pitch:a,detuneCents:o,volume:e.volume,velocity:e.velocity,when:e.when,duration:e.duration})},{onResumeAudio:_,...v}=o,y=Al(t,r,{...v,getAudioTime:()=>i.currentTime,onResumeAudio:async()=>{await F(),await m,c.drum&&await se(gt(c.drum,n(v.drumPatterns??e.drumPatterns)),c.drumFont||`FluidR3_GM_sf2_file:0`),await _?.()},onPlayNote:g,onPlayDrum:be,onScheduleFade:E,singingVoices:ae,backingAudio:c.audio?N({audioContext:i,destination:a,getYoutubeContainer:()=>t.querySelector(`[data-dtm="audio-youtube"]`)}):void 0});Ce.push(y);let b=()=>{y.destroy();let e=Ce.indexOf(y);e>=0&&Ce.splice(e,1)};return{...y,destroy:b}},Oe=(t,r={})=>{let o=Qs(t,{}),s=o.meta??{},c=s.instrument&&yp[s.instrument]?s.instrument:fe,l=s.mode===`advanced`,u=[...new Set(o.placements.map(e=>e.trackIndex))].map(e=>pe(e,l?`advanced`:`simple`)),d=u.length>0?u:[...hv],f=new Map,p=Promise.all([_e(c,d,l?`advanced`:`simple`),(async()=>{if(s.trackInstruments){await oe;for(let[e,t]of Object.entries(s.trackInstruments)){let n=ue(t);n&&(f.set(Number(e),n),await z(n))}}})()]),m=P(s),h=e=>{let{trackIdx:t}=gv(e.trackId);m(e.trackId,t);let n=f.get(t),r;if(n)r=de.get(n);else{let e=pe(t,l?`advanced`:`simple`);r=ge(c,e,l?`advanced`:`simple`)}if(!r)return;let{midi:a,detuneCents:o}=mn(e.pitchUnits);r.play({ctx:i,destination:j(e.trackId,r.tone??`none`),pitch:a,detuneCents:o,volume:e.volume,velocity:e.velocity,when:e.when,duration:e.duration})},{onResumeAudio:g,..._}=r;return Vc(t,{..._,audioContext:i,destination:a,synth:!1,onPlayNote:h,onPlayDrum:be,onResumeAudio:async()=>{await F(),await p,s.drum&&await se(gt(s.drum,n(_.drumPatterns??e.drumPatterns))),await g?.()}})},V=(t,r={})=>{let o=Qs(t,{}),s=o.meta??{},c=s.instrument&&yp[s.instrument]?s.instrument:fe,l=s.mode===`advanced`||o.placements.some(e=>e.trackIndex>=4),u=[...new Set(o.placements.map(e=>e.trackIndex))].map(e=>pe(e,l?`advanced`:`simple`)),d=u.length>0?u:[...hv],f=new Map,p=Promise.all([_e(c,d,l?`advanced`:`simple`),(async()=>{if(s.trackInstruments){await oe;for(let[e,t]of Object.entries(s.trackInstruments)){let n=ue(t);n&&(f.set(Number(e),n),await z(n))}}})()]),m=P(s),h=e=>{let{trackIdx:t}=gv(e.trackId);m(e.trackId,t);let n=f.get(t),r;if(n)r=de.get(n);else{let e=pe(t,l?`advanced`:`simple`);r=ge(c,e,l?`advanced`:`simple`)}if(!r)return;let{midi:a,detuneCents:o}=mn(e.pitchUnits);r.play({ctx:i,destination:j(e.trackId,r.tone??`none`),pitch:a,detuneCents:o,volume:e.volume,velocity:e.velocity,when:e.when,duration:e.duration})},{onResumeAudio:g,..._}=r;return W_(t,{..._,audioContext:i,destination:a,synth:!1,singingVoices:ae,onPlayNote:h,onPlayDrum:be,onResumeAudio:async()=>{await F(),await p,s.drum&&await se(gt(s.drum,n(_.drumPatterns??e.drumPatterns))),await g?.()}})},ke=e=>{let{role:t}=gv(e.trackId),n=ge(fe,t,`simple`);if(n||=(_e(fe,[t],`simple`),ge(fe,t,`simple`)),!n)return;let{midi:r,detuneCents:a}=mn(e.pitchUnits);n.play({ctx:i,destination:j(e.trackId,n.tone??`none`),pitch:r,detuneCents:a,volume:e.volume,velocity:e.velocity,when:e.when,duration:e.duration})},H=e=>{be(e)},Ae=async e=>{await oe;let t=(e.instrument?ue(e.instrument):void 0)??le[yp[fe].melody];if(!t)return;await z(t);let n=de.get(t);if(!n)return;let r=e.volume??80,o=e.duration??1;await F();let{midi:s,detuneCents:c}=mn(e.pitchUnits);n.play({ctx:i,destination:a,pitch:s,detuneCents:c,volume:r/100,when:0,duration:o})},je=(e,t={})=>{let n=t.bpm??t.defaultBpm??120,r=Pn({chordStr:e,patternType:t.patternType??`block`,rootShift:t.rootShift??0,bpm:n,stepsPerBar:192}).map(e=>({trackIndex:3,startStep:e.startStep,durationSteps:e.durationSteps,pitchUnits:e.pitchUnits,velocity:e.velocity})),o=fe,s=_e(o,[`chord`]),c=e=>{let t=ge(o,`chord`);if(!t)return;let{midi:n,detuneCents:r}=mn(e.pitchUnits);t.play({ctx:i,destination:j(`chord`,t.tone??`none`),pitch:n,detuneCents:r,volume:e.volume,velocity:e.velocity,when:e.when,duration:e.duration})},{onResumeAudio:l,...u}=t;return Bc(r,{...u,audioContext:i,destination:a,synth:!1,onPlayNote:c,onPlayDrum:be,onResumeAudio:async()=>{await F(),await s,await l?.()},bpm:n,metaVolume:u.volume??100})},Me=(e,t,n={})=>{let r=au(e,t,{...n,audioContext:i,studio:{playChords:(e,t)=>je(e,t)}});we.push(r);let a=()=>{r.destroy();let e=we.indexOf(r);e>=0&&we.splice(e,1)};return{...r,destroy:a,isPlaying:r.isPlaying}},Ne=()=>{for(let e of[...Te])e.destroy();for(let e of Ce)e.destroy();for(let e of we)e.destroy();for(let e of Se)e.destroy();Te.length=0,Ce.length=0,we.length=0,Se.length=0,D.dispose(),h.dispose();for(let e of O.values())e.dispose();O.clear(),i.close()},Pe=e=>{let t=Math.max(0,Math.min(100,e))/100;a.gain.setTargetAtTime(t,i.currentTime,.02)},U=null,Fe=()=>(U||(U=i.createMediaStreamDestination(),a.connect(U)),U),Ie=()=>Fe().stream.getAudioTracks()[0],Le=null,Re=()=>{if(Le)return;let e=i.createScriptProcessor(4096,2,2),t=[],n=[];e.onaudioprocess=e=>{t.push(new Float32Array(e.inputBuffer.getChannelData(0))),n.push(new Float32Array(e.inputBuffer.getChannelData(+(e.inputBuffer.numberOfChannels>1))))};let r=i.createGain();r.gain.value=0,C.connect(e),e.connect(r),r.connect(i.destination),Le={processor:e,silentSink:r,chunksL:t,chunksR:n}},ze=async()=>{if(!Le)throw Error(`[dtm] startWavRecording が呼ばれていません`);let{processor:e,silentSink:t,chunksL:n,chunksR:r}=Le;return C.disconnect(e),e.disconnect(t),t.disconnect(i.destination),Le=null,fv([pv(n),pv(r)],i.sampleRate)};return{audioContext:i,masterGain:a,createMediaStreamDestination:Fe,getAudioStreamTrack:Ie,startWavRecording:Re,stopWavRecording:ze,singingVoices:ae,speak:(e,t={})=>{let{model:n,...r}=t,i=ae.speak;return i?i(n??`tsukuyomi`,e,r):Promise.resolve(null)},prepareSpeech:(e,t)=>ae.prepareSpeech?.(e??[`tsukuyomi`],t)??Promise.resolve(),planSpeech:(e,t={})=>{let{model:n,...r}=t;return ae.planSpeechDetail?.(n??`tsukuyomi`,e,r)??Promise.resolve(null)},mountEditor:Ee,mountPlayer:B,mountChordPlayer:Me,play:Oe,playSingingMML:V,playNoteEvent:ke,playDrumEvent:H,playNote:Ae,playChords:je,loadPreset:_e,defaultPreset:fe,mountPresetSelect:ye,mountModeSwitch:De,startTour:()=>{Se[Se.length-1]?.startTour()},setMasterVolume:Pe,setVolume:Pe,setReverbAmount:d,setReverbDecay:f,setReverbPreDelay:p,setDelayAmount:g,setMasterCompression:x,dispose:Ne}};export{cn as A4_HZ,sn as A4_UNITS,Bu as BLUES_SCALE,Ra as BREATH_MARK,on as CENTS_PER_UNIT,du as COMPOSE_KEYS,fu as COMPOSE_MOOD_GROUPS,Vu as COMPOSE_SCALES,Hu as COMPOSE_SCALE_IDS,su as CORPUS_BANDS,ou as CORPUS_SIZE,qc as DAW_CSS,vh as DAW_TOUR_BRANCHES,_h as DAW_TOUR_STEPS,fa as DEFAULT_BPM,ln as DEFAULT_EDO,pa as DEFAULT_GATE,ma as DEFAULT_PAN,ga as DEFAULT_PLAYBACK_VELOCITY,dd as DEFAULT_SECTIONS,vv as DEFAULT_SPEECH_MODEL,_a as DEFAULT_STEPS_PER_BAR,Qi as DEFAULT_TTS_BASE_URL,bg as DEFAULT_UST_LYRIC,ha as DEFAULT_VELOCITY,da as DEFAULT_VOCAL_VOLUME,ft as DRUM_FONT,G as DRUM_KEYS,ht as DRUM_PATTERNS,em as DTM_VERSION,Sm as EDO31_NAMES,Ba as FADE_IN_MARK,za as FADE_OUT_MARK,I_ as GLOBAL_STORAGE_KEYS,xp as GM_BRIGHT_CEILING,i as GM_INSTRUMENT_NAMES,bp as GM_INSTRUMENT_RANGE,Ru as HARMONIC_MINOR_SCALE,zu as HUNGARIAN_SCALE,yp as INSTRUMENT_PRESETS,Ca as KEY_COUNT,So as KOE_BASE_URL,Co as KOE_VOICEBANKS,To as KOE_VOICEBANK_LABELS,wo as KOE_VOICEBANK_NAMES,ko as KOE_VOICEBANK_TERMS,vm as LinkedList,zp as MACRO_STORAGE_KEYS,pu as MAJOR_KEY_IDS,Lu as MAJOR_SCALE,ro as MAX_VOCAL_VOLUME,_n as MICRO_STEP,mu as MINOR_KEY_IDS,Cm as MMLCore,va as MML_END_MARKER,_m as MidiSearchClient,ys as PHRASE_GAP_SEC,wn as PITCH_ENCODING_VERSION,xm as PITCH_MAP,ba as PITCH_RANGE_END,ya as PITCH_RANGE_START,Fa as PORTAMENTO_MARK,Ts as PREWARM_NOTES,La as REST_MARK,ld as SECTION_LABELS,ud as SECTION_ORDER,fd as SECTION_SPECS,Cc as SEQUENCER_START_DELAY,Ha as SPEAK_CLOSE,Va as SPEAK_OPEN,qi as SPEECH_EMOTIONS,Ia as STOP_MARK,Pa as TIE_MARK,rs as TIE_MERGE_MAX_SEC,eh as TOUR_STORAGE_KEY,h_ as TRACKS_ADVANCED,m_ as TRACKS_SIMPLE,an as UNITS_PER_EDO31_DEGREE,nn as UNITS_PER_OCTAVE,rn as UNITS_PER_SEMITONE,Fh as UST_TICKS_PER_BEAT,ki as VIBRATO_MIN_SEC,Zc as VOICE_IMAGES,Oo as VOICE_IMAGE_KEY,Eo as VOICE_MODEL_CATEGORIES,tn as addUnits,nm as analyzeMidiTracks,Xp as applyHarmonicFilter,Zp as applyMonophonic,o as backingMediaSec,Mu as band,$o as breathPeakPosition,Pn as buildChordPlacements,hm as buildDrumPatternJson,r as buildNameToKeyMapping,hd as buildSectionPlan,ws as buildStreamVoiceNotes,jg as buildUst,gn as chromaticStep,rh as clearTourSeen,Lo as collectPitchTokens,Eu as complementarity,cp as composeSong,pv as concatFloat32,t as createAudioContext,N as createBackingAudio,yv as createDtmStudio,xo as createKlattVoice,Yo as createKoeVoice,ho as createLyricsConductor,G_ as createPianoRoll,Qm as createRenderer,Ec as createSequencer,js as createSingingVoices,ia as createSpeechPlanner,zo as createSpeechToneView,Lc as createSynth,Ms as createVoiceRegistry,kl as decodeMml,ag as decodeUstText,wm as decomposeToMonophonic,Xa as displayKana,Of as durationEntropy,wl as encodeMml,fv as encodeWavPCM16,pm as exportMIDI,Gm as exportMusicXML,mm as extractDrumPatternFromNotes,gm as extractMidiDrumPattern,im as extractMidiPlacements,om as extractMidiPlacementsByTrack,Fu as featureDistance,Pu as featureVector,Sn as fifthToStep,Cn as fifthToUnits,Cp as fitInstrumentOctave,Zs as formatMmlMeta,u as formatTimeSec,Ic as freqFromPitch,Yp as generateRandomPattern,_u as getComposeKeyDescription,sd as getComposeScaleDescription,gt as getDrumPatternKeys,rm as getMidiBPM,ra as getSpeechPlanner,Do as groupVoiceModels,th as hasSeenTour,Y as icon,Jc as injectStyles,Xo as isBreathAlias,Tm as isChordHeavyTrack,vn as isNaturalLetter,am as isPlausibleMidiTranscription,$m as isTourTargetVisible,uo as isValidHttpUrl,f as isYoutubeUrl,Sa as keyCountFor,Bo as koeAliasCandidates,Ao as koeUrl,ig as looksLikePinyin,rg as lyricToSyllable,nh as markTourSeen,ua as medianRecordedPitchHz,en as midiNote,dn as midiToUnits,au as mountChordPlayer,F_ as mountDAW,Al as mountMmlPlayer,Km as musicXmlToNotes,yn as naturalStep,pt as normalizeDrumPatterns,Ya as normalizeLyrics,mo as panToStereo,fo as parseCustomVocals,oo as parseLyrics,Qs as parseMML,Js as parseMmlMeta,Bm as parseMusicXML,l as parseTimeSec,yg as parseUst,d as parseYoutubeId,Zo as pickBreathAlias,ns as pickBreathSample,Nh as pinyinToMoras,Tn as pitchV1ToUnits,Uc as playChords,Vc as playMML,Hc as playNote,Bc as playPlacements,W_ as playSingingMML,ca as prefetchSpeechPcm,aa as prepareSpeechPlan,a as programOfInstrumentName,B_ as readGlobalBool,z_ as readGlobalNumber,L_ as readGlobalSetting,Gp as readKeptSong,Hp as readMacroSections,Bp as readMacroSetting,cd as resolveCenter,gu as resolveComposeKey,od as resolveComposeScale,mt as resolveDrumPattern,Tc as resolveLoopPoint,m as resolveYoutubeThumbnail,Wu as scaleDegrees,Gu as scaleSize,gd as sectionPlanBarRange,On as semitonesToUnits,Qp as shiftNotes,Yc as showLoadingOverlay,la as speechBankView,sa as speechPlanDurationSec,oa as speechPlanLeadingSec,Xi as speechPlanMorae,Zi as speechRenderOptions,jn as spelledToUnits,bn as spellingToUnits,uh as startTour,po as stripCustomVocals,so as stripLyrics,Ys as stripMmlMeta,Ou as structureFeatures,Za as syllablesToText,ju as tensionFeatures,$p as transposeNotes,$t as units,xa as unitsPerRow,un as unitsPerStep,pn as unitsToHz,fn as unitsToMidi,mn as unitsToMidiDetune,J as unitsToPitchV1,ao as vocalVolumeToGain,R_ as writeGlobalSetting,Kp as writeKeptSong,Up as writeMacroSections,Vp as writeMacroSetting};