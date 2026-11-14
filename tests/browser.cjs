const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:650,height:500},deviceScaleFactor:1});
await page.setContent('<body style="margin:20px;background:#20252b"><cinematic-ups-card style="display:block;width:597px"></cinematic-ups-card>');
await page.addScriptTag({path:'dist/cinematic-ups-card.js'});
await page.evaluate(()=>{const c=document.querySelector('cinematic-ups-card'); const states={}; const config={type:'custom:cinematic-ups-card',name:'3D Printers',model:'Eaton 5E 2200'}; for(const [key,state,unit] of [['battery',87,'%'],['runtime',3791,'s'],['status','OL',''],['load',0,'%'],['apparent_power',0,'VA'],['voltage',238,'V'],['power',0,'W'],['beeper_status','disabled','']]){config[key+'_entity']='sensor.'+key;states['sensor.'+key]={state:String(state),attributes:{unit_of_measurement:unit}};} config.beeper_entity='select.beeper';window.demoStates=states;window.demoConfig=config;c.setConfig(config);c.hass={states};});
await page.screenshot({path:'preview.png'});
const results=await page.evaluate(()=>{const c=document.querySelector('cinematic-ups-card'),root=c.shadowRoot;const checks={};checks.level=root.querySelector('.liquid').style.getPropertyValue('--level')==='87%'; checks.runtime=root.querySelector('.runtime strong').textContent==='01:03:11';checks.order=[...root.querySelectorAll('.ml')].map(n=>n.textContent);const liquid=root.querySelector('.liquid');c.hass={states:{...window.demoStates, 'sensor.unrelated':{state:'on'}}};checks.stable=liquid===root.querySelector('.liquid');for(const value of ['0','100','unavailable']) {c.hass={states:{...window.demoStates,'sensor.battery':{state:value,attributes:{}}}}; checks[value]={level:root.querySelector('.liquid').style.getPropertyValue('--level'),label:root.querySelector('.percentage').textContent};}return checks;});console.log(JSON.stringify(results));if(!results.level||!results.runtime||!results.stable)throw Error('Browser rendering checks failed');
for(const width of [320,400,597]){await page.evaluate(w=>{let c=document.querySelector('cinematic-ups-card');c.style.width=w+'px';c.hass={states:window.demoStates};},width);console.log(width,await page.evaluate(()=>{const c=document.querySelector('cinematic-ups-card');const scroll=c.shadowRoot.querySelector('ha-card').scrollWidth;if(scroll>c.clientWidth+1)throw Error('Horizontal overflow');return {width:c.clientWidth,height:c.offsetHeight,scroll}}));if(width===400)await page.screenshot({path:'preview-mobile.png'});}
for(const width of [320,400,597]) {
 const measured=await page.evaluate(w=>{
  const c=document.querySelector('cinematic-ups-card');c.style.width=w+'px';
  c.setConfig({...window.demoConfig,alarms_entity:'sensor.alarms'});
  c.hass={states:{...window.demoStates,'sensor.alarms':{state:''}}};
  const normal={height:c.offsetHeight,metrics:c.shadowRoot.querySelector('.metrics').getBoundingClientRect().top};
  c.hass={states:{...window.demoStates,'sensor.alarms':{state:'Replace battery! Fan failure! Battery voltage too low! Output short circuit!'}}};
  const root=c.shadowRoot,area=root.querySelector('.status-area'),runtime=root.querySelector('.runtime');
  if(c.offsetHeight!==normal.height)throw Error('Alarm changes card height');
  if(Math.abs(root.querySelector('.metrics').getBoundingClientRect().top-normal.metrics)>1)throw Error('Alarm moves metrics');
  if(area.getBoundingClientRect().bottom>runtime.getBoundingClientRect().top+1)throw Error('Alarm overlaps runtime');
  if(area.clientHeight<16)throw Error('Alarm region is not readable');
  if(!root.querySelector('.center-status.error'))throw Error('Missing red alarm status');
  if(getComputedStyle(root.querySelector('.alarm-detail')).color!=='rgb(255, 158, 170)')throw Error('Alarm detail not red');
  return {width:w,height:c.offsetHeight,alarmViewport:area.clientHeight,alarmContent:area.scrollHeight};
 },width);console.log('Alarm layout',measured);
 if(width===597)await page.screenshot({path:'preview-alarms.png'});
}
const editorChecks=await page.evaluate(()=>{
 const Card=customElements.get('cinematic-ups-card');
 if(Card.getConfigElement!==undefined)throw Error('Custom editor still overrides HA native form');
 const form=Card.getConfigForm();
 const fields=[];const visit=schema=>schema.forEach(x=>x.schema?visit(x.schema):fields.push(x));visit(form.schema);
 const expected=['name','model','battery_entity','status_entity','alarms_entity','runtime_entity','load_entity','power_entity','apparent_power_entity','voltage_entity','beeper_status_entity','beeper_entity','image','battery_install_date','accent_color'];
 if(fields.length!==expected.length||new Set(fields.map(x=>x.name)).size!==expected.length||expected.some(key=>!fields.some(x=>x.name===key)))throw Error('Existing fields lost or duplicated');
 for(const section of form.schema.filter(x=>x.type==='expandable'))if(!section.flatten||!section.title)throw Error('Section changes YAML nesting');
 for(const field of fields){if(!field.selector||!form.computeLabel(field))throw Error('Missing native selector/label');}
 if(fields.find(x=>x.name==='accent_color').selector.text.type!=='color')throw Error('Hex color compatibility lost');
 const c=document.querySelector('cinematic-ups-card');
 const original={...window.demoConfig,accent_color:'#12abef',custom_option:'keep',grid_options:{columns:12}};
 c.setConfig(original);c.hass={states:window.demoStates};
 if(c.c.custom_option!=='keep'||c.c.accent_color!=='#12abef')throw Error('Config compatibility failed');
 return {nativeSchema:true,noCustomEditorOverride:true,allFieldsPreserved:true,flatYamlSections:true};
});console.log('Native editor schema',editorChecks);
await browser.close();})();
