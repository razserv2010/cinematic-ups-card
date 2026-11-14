const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const registry = new Map();
class Element {
  attachShadow() { this.shadowRoot = { innerHTML: '', getElementById: () => null }; }
}
const context = { HTMLElement: Element, customElements: { get: key => registry.get(key), define: (key, value) => registry.set(key, value) }, window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname, '../dist/cinematic-ups-card.js'), 'utf8'), context);
const Card = registry.get('cinematic-ups-card');
const card = new Card();
card.setConfig({battery_entity: 'sensor.battery', runtime_entity: 'sensor.runtime', status_entity: 'sensor.status', name:'<img onerror=alert(1)>'});
function states(value, status='OL', unit='s', runtime='3791') {
  return {states: {'sensor.battery':{state:value},'sensor.status':{state:status},'sensor.runtime':{state:runtime,attributes:{unit_of_measurement:unit}}}};
}
card.hass = states('87');
assert.match(card.shadowRoot.innerHTML, /--level:87%/);
assert.match(card.shadowRoot.innerHTML, /01:03:11/);
assert.match(card.shadowRoot.innerHTML, /&lt;img onerror/);
assert.doesNotMatch(card.shadowRoot.innerHTML, /<img onerror/);
for(const [value, expected] of [['0','0'],['100','100'],['120','100'],['-3','0'],['unavailable','0']]) {
  card.hass = states(value);
  assert.ok(card.shadowRoot.innerHTML.includes('--level:'+expected+'%'));
}
assert.match(card.shadowRoot.innerHTML, /class="percentage">—/);
card.hass = states('40','OB','min','90');
assert.match(card.shadowRoot.innerHTML, /01:30:00/);
assert.match(card.shadowRoot.innerHTML, /עבודה על סוללה/);
card.hass = states('40','ALARM OL RB');
assert.match(card.shadowRoot.innerHTML, /אזהרה/);
const signature=card._signature;
card.hass = {...states('40','ALARM OL RB'), unrelated:true};
assert.equal(card._signature,signature);
const markup=card.shadowRoot.innerHTML;
const labels=['עומס נוכחי','הספק מדומה','מתח כניסה','הספק אמיתי'];
for(let i=1;i<labels.length;i++) assert.ok(markup.indexOf(labels[i-1])<markup.indexOf(labels[i]));
console.log('PASS: charge clamping/unavailable, runtime units, status, text escaping, stable state signature and metric order');
card.setConfig({battery_entity:'sensor.battery',status_entity:'sensor.ups_status_data',alarms_entity:'sensor.alarms_ups_3d_printers'});
const alarmStates=(alarm,status='OL')=>({states:{'sensor.battery':{state:'87'},'sensor.ups_status_data':{state:status},'sensor.alarms_ups_3d_printers':{state:alarm}}});
card.hass=alarmStates('');
assert.match(card.shadowRoot.innerHTML,/center-status normal">✓ מחובר לחשמל/);
card.hass=alarmStates('Replace battery!');
assert.match(card.shadowRoot.innerHTML,/center-status error">⚠/);
assert.match(card.shadowRoot.innerHTML,/alarm-detail error" role="status">נדרשת החלפת סוללה/);
card.hass=alarmStates('');
assert.match(card.shadowRoot.innerHTML,/center-status normal">✓/);
assert.doesNotMatch(card.shadowRoot.innerHTML,/class="alarm-detail/);
for(const value of ['none','No alarms','0','off']) {card.hass=alarmStates(value);assert.match(card.shadowRoot.innerHTML,/center-status normal">/);}
card.hass=alarmStates('unknown');
assert.match(card.shadowRoot.innerHTML,/חיישן ההתראות אינו זמין/);
assert.doesNotMatch(card.shadowRoot.innerHTML,/class="alarm-detail error/);
card.hass=alarmStates('<img src=x onerror=alert(1)>');
assert.match(card.shadowRoot.innerHTML,/&lt;img src=x/);
card.hass=alarmStates('','OB LB');
assert.match(card.shadowRoot.innerHTML,/עבודה על סוללה · סוללה חלשה/);
assert.match(card.shadowRoot.innerHTML,/center-status error/);
console.log('PASS: Hebrew online/status, active/cleared alarms, unavailable sensor, alarm escaping and status-only faults');
