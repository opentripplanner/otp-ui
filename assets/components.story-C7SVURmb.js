import{j as e}from"./jsx-runtime-BHk-Pj2y.js";import{a as M,M as w,b as g,B as j,g as B,S as O,A as T,c as f}from"./index-BCJq4FPm.js";import{c as P}from"./modes-en-DR6FtjFY.js";import{t as W}from"./trimet-styled-V5skdU_H.js";import{g as D,C as R,h as U,i as Y,G as N}from"./query-params-i18n-C8-B-QnA.js";import{D as L,a as I}from"./AdvancedModeSubsettingsContainer-C5_stcek.js";import{M as n,a as _,b as E}from"./index-DndRIDhE.js";import"./polyline-CXOwTUft.js";import"./index-CSkjABmd.js";import"./index-bsugPHvp.js";import"./iframe-Bpk3mz_R.js";import"./index-DgRBlum5.js";import"./leg-icon-gcBPH9NR.js";import"./styled-components.browser.esm-B47-n1gN.js";import"./typeof-CY0RTpPX.js";import"./index.esm-D4CulEa4.js";import"./index-RKay4Hhp.js";import"./preload-helper-D9Z9MdNV.js";import"./Streetcar-q6QiXUJl.js";import"./index-Ci216hQ9.js";import"./Alert-C50YQQZZ.js";import"./index-BczKOczA.js";import"./en-US-qEeFzDIJ.js";import"./toConsumableArray-Bnd270tG.js";import"./dom-query-BHOLqPPs.js";import"./trimet-mode-icon-COxmz3UM.js";import"./suspense-BoRydbYA.js";import"./uFuzzy-Bq0Q_4AX.js";import"./ExternalLinkAlt.esm-VlTzDB4r.js";import"./message-DqGH20up.js";const F={primary:{id:"PRIMARY",title:"Primary Choice",text:e.jsxs("span",{children:[e.jsx(g,{}),e.jsx(j,{})," Primary Choice"]})},secondary:[{id:"SECONDARY1",title:"Secondary 1",text:e.jsxs("span",{children:[e.jsx(M,{})," Sec. #1"]})},{id:"SECONDARY2",title:"Secondary 2",selected:!0,showTitle:!1,text:e.jsxs("span",{children:["Sec. #2 ",e.jsx(w,{})]})}],tertiary:[{id:"OTHER",title:"Other Mode",text:e.jsx("span",{children:"Tertiary Mode"})}]},G=B("uber"),K=[{id:"BUS",title:"Use the bus",text:e.jsxs("span",{children:[e.jsx(j,{})," Bus"]})},{id:"TRAM",selected:!0,title:"Use the streetcar",text:e.jsxs("span",{children:[e.jsx(O,{})," Streetcar"]})},{id:"UBER",selected:!0,title:"Uber",text:e.jsxs("span",{children:[e.jsx(G,{})," Uber"]})}],{action:h}=__STORYBOOK_MODULE_ACTIONS__,s=h("onChange"),i=h("onClick"),C=h("onQueryParamChange"),H=t=>e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Plain"}),e.jsx("div",{children:e.jsx(t,{})}),e.jsx("p",{children:"Styled"}),e.jsx("div",{children:W(e.jsx(t,{}))})]});function r(t,v){const k=t.bind({});return k.args=v,k}const b=t=>e.jsx(N,{onQueryParamChange:C,query:{mode:t.mode,otp2:t.otp2,routingType:"ITINERARY"},queryParamMessages:t.queryParamMessages,supportedModes:P}),Me={argTypes:{timeZone:{control:"select",options:["America/New_York","America/Los_Angeles"]}},component:D,decorators:[H],parameters:{controls:{hideNoControlsWarning:!0,include:["timeZone","departArriveDropdown"]}},title:"Trip Form Components"},Q={maxWalkDistance:{label:"Max Walk Distance In Meters (custom)",options:[{text:"200 m (custom)",value:200},{text:"500 m (custom)",value:500}]},optimize:{label:"Walk settings (custom)",options:[{text:"Quickest trip (custom)",value:"QUICK"},{text:"Prefer fewer transfers (custom)",value:"TRANSFERS"}]}},l=r(R,{label:"Check me.",name:"MyParam",onChange:s,style:{display:"inline-block",width:"250px"}}),o=r(U,{label:"Drag me.",labelHigh:"high",labelLow:"low",max:20,min:.5,name:"MyParam",onChange:s,step:.5,style:{display:"inline-block",width:"250px"},value:3});o.parameters={a11y:{config:{rules:[{id:"duplicate-id-active",reviewOnFail:!0}]}}};const c=r(L,{date:"2020-02-15",dateFormatLegacy:"YY-M-d",departArrive:"NOW",departArriveDropdown:!0,forceLegacy:!1,onQueryParamChange:C,time:"14:17",timeFormatLegacy:"HH:mm",timeZone:"America/New_York"}),m=r(I,{departArrive:"NOW",timeZone:"America/New_York",onQueryParamChange:C}),d=r(Y,{label:"Pick an option:",name:"MyParam",onChange:s,options:[{text:"Option 1",value:"Value1"},{text:"Option 2",value:"Value2"}],style:{display:"inline-block",width:"250px"},value:"Value2"}),p=r(b,{mode:"WALK,BUS,TRAM,SUBWAY"}),a=r(b,{mode:"WALK,BUS,TRAM,SUBWAY",otp2:!0});a.parameters={a11y:{config:{rules:[{id:"duplicate-id-active",reviewOnFail:!0},{id:"duplicate-id-aria",reviewOnFail:!0}]}}};const u=r(b,{mode:"WALK,BUS,TRAM,SUBWAY",queryParamMessages:Q}),A=()=>e.jsx("span",{style:{display:"inline-block",width:"1em"}}),S=()=>e.jsxs("div",{children:[e.jsxs("div",{children:[e.jsxs(n,{onClick:i,title:"Normal",children:[e.jsx(g,{}),"+",e.jsx(M,{}),"Go by train",e.jsx("span",{style:{fontSize:"150%",color:"#b03030"},children:" or "})," bike"]}),e.jsx(A,{}),e.jsxs(n,{selected:!0,onClick:i,title:"Active",children:[e.jsx(g,{}),"Train"]}),e.jsx(A,{}),e.jsxs(n,{enabled:!1,label:"Can't Select!",onClick:i,title:"Disabled",children:[e.jsx(T,{}),"Can't select!",e.jsx(f,{})]})]}),e.jsx("div",{children:e.jsxs(n,{onClick:i,showTitle:!1,title:"Walk Only",children:[e.jsx(g,{}),"Walk Only"]})})]}),x=()=>e.jsx(_,{modes:F,onChange:s}),y=r(E,{inline:!1,label:"Submodes:",modes:K,onChange:s});l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`makeStory(Core.CheckboxSelector, {
  label: "Check me.",
  name: "MyParam",
  onChange,
  style: {
    display: "inline-block",
    width: "250px"
  }
})`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`makeStory(Core.SliderSelector, {
  label: "Drag me.",
  labelHigh: "high",
  labelLow: "low",
  max: 20,
  min: 0.5,
  name: "MyParam",
  onChange,
  step: 0.5,
  style: {
    display: "inline-block",
    width: "250px"
  },
  value: 3
})`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`makeStory(Core.DateTimeSelector, {
  date: "2020-02-15",
  dateFormatLegacy: "YY-M-d",
  departArrive: "NOW",
  departArriveDropdown: true,
  forceLegacy: false,
  onQueryParamChange,
  time: "14:17",
  timeFormatLegacy: "HH:mm",
  timeZone: "America/New_York"
})`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`makeStory(Core.DepartArriveDropdown, {
  departArrive: "NOW",
  timeZone: "America/New_York",
  onQueryParamChange
})`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`makeStory(Core.DropdownSelector, {
  label: "Pick an option:",
  name: "MyParam",
  onChange,
  options: [{
    text: "Option 1",
    value: "Value1"
  }, {
    text: "Option 2",
    value: "Value2"
  }],
  style: {
    display: "inline-block",
    width: "250px"
  },
  value: "Value2"
})`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`makeStory(GeneralSettingsTemplate, {
  mode: "WALK,BUS,TRAM,SUBWAY"
})`,...p.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`makeStory(GeneralSettingsTemplate, {
  mode: "WALK,BUS,TRAM,SUBWAY",
  otp2: true
})`,...a.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`makeStory(GeneralSettingsTemplate, {
  mode: "WALK,BUS,TRAM,SUBWAY",
  queryParamMessages
})`,...u.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`(): ReactElement => <div>
    <div>
      <Core.ModeButton onClick={onClick} title="Normal">
        <Icons.Max />
        +
        <Icons.Bike />
        Go by train
        <span style={{
        fontSize: "150%",
        color: "#b03030"
      }}> or </span> bike
      </Core.ModeButton>
      <Space />
      <Core.ModeButton selected onClick={onClick} title="Active">
        <Icons.Max />
        Train
      </Core.ModeButton>
      <Space />
      <Core.ModeButton enabled={false} label="Can't Select!" onClick={onClick} title="Disabled">
        <Icons.AlertSolid />
        Can&apos;t select!
        <Icons.Alert />
      </Core.ModeButton>
    </div>
    <div>
      <Core.ModeButton onClick={onClick} showTitle={false} title="Walk Only">
        <Icons.Max />
        Walk Only
      </Core.ModeButton>
    </div>
  </div>`,...S.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:"(): ReactElement => <Core.ModeSelector modes={modeOptions} onChange={onChange} />",...x.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`makeStory(Core.SubmodeSelector, {
  inline: false,
  label: "Submodes:",
  modes: submodeOptions,
  onChange
})`,...y.parameters?.docs?.source}}};export{l as checkboxSelector,c as dateTimeSelector,Me as default,m as departArriveDropdown,d as dropdownSelector,p as generalSettingsPanel,u as generalSettingsPanelWithCustomMessages,a as generalSettingsPanelWithOtp2,S as modeButtons,x as modeSelector,o as sliderSelector,y as submodeSelector};
