import{j as h}from"./jsx-runtime-BHk-Pj2y.js";import{F as k}from"./iframe-Bpk3mz_R.js";import"./preload-helper-D9Z9MdNV.js";function l(e){return Math.round(e*10)/10}function S(e){const r=e*3.28084;return r<528?{unit:"foot",value:Math.round(r)}:{unit:"mile",value:l(r/5280)}}function x(e){const r=e/1e3;return r>1?{unit:"kilometer",value:r>100?Math.round(r):l(r)}:{unit:"meter",value:Math.round(e)}}const y=e=>e==="imperial",p=({long:e,meters:r,units:d="metric"})=>{const{unit:g,value:f}=y(d)?S(r):x(r);return h.jsx(k,{style:"unit",unit:g,unitDisplay:e?"long":"short",value:f})};try{p.displayName="distance",p.__docgenInfo={description:`Renders a distance expressed in imperial or metric unit.
The unit can be shown in long or short form.
English examples:
- 2.4 kilometers
- 807 ft`,displayName:"distance",filePath:"/Users/miles/git/otp-ui/packages/humanize-distance/src/distance.tsx",methods:[],props:{long:{defaultValue:{value:"false"},declarations:[{fileName:"otp-ui/packages/humanize-distance/src/distance.tsx",name:"DistanceProps"}],description:'Whether to display long units (e.g. "kilometers" vs. "km").',name:"long",parent:{fileName:"otp-ui/packages/humanize-distance/src/distance.tsx",name:"DistanceProps"},required:!1,tags:{default:"false"},type:{name:"boolean"}},meters:{defaultValue:null,declarations:[{fileName:"otp-ui/packages/humanize-distance/src/distance.tsx",name:"DistanceProps"}],description:"The original distance, in meters, to render.",name:"meters",parent:{fileName:"otp-ui/packages/humanize-distance/src/distance.tsx",name:"DistanceProps"},required:!0,tags:{},type:{name:"number"}},units:{defaultValue:{value:"metric"},declarations:[{fileName:"otp-ui/packages/humanize-distance/src/distance.tsx",name:"DistanceProps"}],description:"Whether to display the specified distance in imperial or metric units.",name:"units",parent:{fileName:"otp-ui/packages/humanize-distance/src/distance.tsx",name:"DistanceProps"},required:!1,tags:{default:'"metric"'},type:{name:"enum",raw:"UnitSystem",value:[{value:'"metric"'},{value:'"imperial"'}]}}},tags:{}}}catch{}const N={component:p,render:p,title:"Distance"},s={args:{meters:124.5}},a={args:{long:!0,meters:124.5}},t={args:{meters:124.5,units:"imperial"}},n={args:{long:!0,meters:124.5,units:"imperial"}},i={args:{meters:12450}},o={args:{long:!0,meters:12450}},c={args:{meters:12450,units:"imperial"}},m={args:{long:!0,meters:12450,units:"imperial"}},u={args:{meters:1245,units:"imperial"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    meters: 124.5
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    long: true,
    meters: 124.5
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    meters: 124.5,
    units: "imperial"
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    long: true,
    meters: 124.5,
    units: "imperial"
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    meters: 12450
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    long: true,
    meters: 12450
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    meters: 12450,
    units: "imperial"
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    long: true,
    meters: 12450,
    units: "imperial"
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    meters: 1245,
    units: "imperial"
  }
}`,...u.parameters?.docs?.source}}};export{N as default,n as feetLong,t as feetShort,o as kilometersLong,i as kilometersShort,a as metersLong,s as metersShort,u as milesFraction,m as milesLong,c as milesShort};
