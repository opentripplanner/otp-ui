import{j as h}from"./jsx-runtime-I3b0MXVw.js";import{F as S}from"./iframe-CbmH3Sk6.js";import"./preload-helper-D9Z9MdNV.js";function p(e){return Math.round(e*10)/10}function v(e){const r=e*3.28084;return r<528?{unit:"foot",value:Math.round(r)}:{unit:"mile",value:p(r/5280)}}function y(e){const r=e/1e3;return r>1?{unit:"kilometer",value:r>100?Math.round(r):p(r)}:{unit:"meter",value:Math.round(e)}}const _=e=>e==="imperial",l=({long:e,meters:r,units:d="metric"})=>{const{unit:g,value:f}=_(d)?v(r):y(r);return h.jsx(S,{style:"unit",unit:g,unitDisplay:e?"long":"short",value:f})};try{distance.displayName="distance",distance.__docgenInfo={description:`Renders a distance expressed in imperial or metric unit.
The unit can be shown in long or short form.
English examples:
- 2.4 kilometers
- 807 ft`,displayName:"distance",props:{long:{defaultValue:{value:"false"},description:'Whether to display long units (e.g. "kilometers" vs. "km").',name:"long",required:!1,type:{name:"boolean"}},meters:{defaultValue:null,description:"The original distance, in meters, to render.",name:"meters",required:!0,type:{name:"number"}},units:{defaultValue:{value:"metric"},description:"Whether to display the specified distance in imperial or metric units.",name:"units",required:!1,type:{name:"enum",value:[{value:'"metric"'},{value:'"imperial"'}]}}}}}catch{}const b={component:l,render:l,title:"Distance"},s={args:{meters:124.5}},t={args:{long:!0,meters:124.5}},a={args:{meters:124.5,units:"imperial"}},n={args:{long:!0,meters:124.5,units:"imperial"}},o={args:{meters:12450}},i={args:{long:!0,meters:12450}},m={args:{meters:12450,units:"imperial"}},c={args:{long:!0,meters:12450,units:"imperial"}},u={args:{meters:1245,units:"imperial"}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    meters: 124.5
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    long: true,
    meters: 124.5
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    meters: 124.5,
    units: "imperial"
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    long: true,
    meters: 124.5,
    units: "imperial"
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    meters: 12450
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    long: true,
    meters: 12450
  }
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    meters: 12450,
    units: "imperial"
  }
}`,...m.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    long: true,
    meters: 12450,
    units: "imperial"
  }
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    meters: 1245,
    units: "imperial"
  }
}`,...u.parameters?.docs?.source}}};export{b as default,n as feetLong,a as feetShort,i as kilometersLong,o as kilometersShort,t as metersLong,s as metersShort,u as milesFraction,c as milesLong,m as milesShort};
