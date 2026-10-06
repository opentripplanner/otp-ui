import{j as t}from"./jsx-runtime-I3b0MXVw.js";import{r as m}from"./iframe-CbmH3Sk6.js";import{g as s,a as i}from"./dom-query-BFjW9pJ-.js";import"./preload-helper-D9Z9MdNV.js";const a=({children:n,closePopup:p=null,focusElements:d=["button","a","input","select"],id:l})=>{const u=d.map(e=>`#${l}-focus-trap ${e}:not([disabled])`).join(", "),b=m.useCallback(e=>{const c=e.target;switch(e.key){case"Escape":p();break;case"Tab":e.preventDefault(),e.shiftKey?s(u,c)?.focus():i(u,c)?.focus();break}},[p]);return t.jsx("div",{id:`${l}-focus-trap`,onKeyDown:b,role:"presentation",children:n})};try{i.displayName="getNextSibling",i.__docgenInfo={description:`Helper method to find the next focusable sibling element relative to the
specified element.`,displayName:"getNextSibling",props:{}}}catch{}try{s.displayName="getPreviousSibling",s.__docgenInfo={description:`Helper method to find the previous focusable sibling element relative to the
specified element.`,displayName:"getPreviousSibling",props:{}}}catch{}try{focustrapwrapper.displayName="focustrapwrapper",focustrapwrapper.__docgenInfo={description:"",displayName:"focustrapwrapper",props:{closePopup:{defaultValue:{value:"null"},description:"",name:"closePopup",required:!1,type:{name:"(arg?: boolean) => void"}},id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},focusElements:{defaultValue:{value:'["button", "a", "input", "select"]'},description:"",name:"focusElements",required:!1,type:{name:"string[]"}}}}}catch{}const g={component:a,title:"Building-Blocks/FocusTrapWrapper"},o=()=>t.jsxs(a,{id:"button-set-story",children:[t.jsx("button",{type:"button",children:"Button 1"}),t.jsx("button",{type:"button",children:"Button 2"}),t.jsx("button",{type:"button",children:"Button 3"}),t.jsx("button",{type:"button",children:"Button 4"})]}),r=()=>t.jsxs(a,{focusElements:["button","a","div","input","select"],id:"various-els-story",children:[t.jsx("button",{type:"button",children:"Button 1"}),t.jsx("br",{}),t.jsx("a",{href:"/",children:"link"}),t.jsx("br",{}),t.jsx("div",{tabIndex:-1,children:"focusable div"}),t.jsxs("label",{htmlFor:"disabled-input",children:["Input (disabled) ",t.jsx("input",{id:"disabled-input",disabled:!0,type:"text"})," "]}),t.jsx("br",{}),t.jsxs("label",{htmlFor:"input",children:["Input ",t.jsx("input",{id:"input",type:"text"})]}),t.jsx("br",{}),t.jsxs("label",{htmlFor:"select",children:["Select"," ",t.jsxs("select",{id:"select",children:[t.jsx("option",{children:"Option 1"}),t.jsx("option",{children:"Option 2"})]})]})]});o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`(): React.ReactElement => <FocusTrapWrapper id="button-set-story">
    <button type="button">Button 1</button>
    <button type="button">Button 2</button>
    <button type="button">Button 3</button>
    <button type="button">Button 4</button>
  </FocusTrapWrapper>`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(): React.ReactElement => <FocusTrapWrapper focusElements={["button", "a", "div", "input", "select"]} id="various-els-story">
    <button type="button">Button 1</button>
    <br />
    <a href="/">link</a>
    <br />
    <div tabIndex={-1}>focusable div</div>
    <label htmlFor="disabled-input">
      Input (disabled) <input id="disabled-input" disabled type="text" />{" "}
    </label>

    <br />
    <label htmlFor="input">
      Input <input id="input" type="text" />
    </label>

    <br />
    <label htmlFor="select">
      Select{" "}
      <select id="select">
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
    </label>
  </FocusTrapWrapper>`,...r.parameters?.docs?.source}}};export{o as FocusTrapAroundButtonSet,r as FocusTrapWithVariousEls,g as default};
