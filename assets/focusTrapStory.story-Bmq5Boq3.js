import{j as e}from"./jsx-runtime-BHk-Pj2y.js";import{r as m}from"./iframe-Bpk3mz_R.js";import{g as a,a as i}from"./dom-query-BFjW9pJ-.js";import"./preload-helper-D9Z9MdNV.js";const n=({children:s,closePopup:l=null,focusElements:d=["button","a","input","select"],id:p})=>{const u=d.map(t=>`#${p}-focus-trap ${t}:not([disabled])`).join(", "),b=m.useCallback(t=>{const c=t.target;switch(t.key){case"Escape":l();break;case"Tab":t.preventDefault(),t.shiftKey?a(u,c)?.focus():i(u,c)?.focus();break}},[l]);return e.jsx("div",{id:`${p}-focus-trap`,onKeyDown:b,role:"presentation",children:s})};try{i.displayName="getNextSibling",i.__docgenInfo={description:`Helper method to find the next focusable sibling element relative to the
specified element.`,displayName:"getNextSibling",filePath:"/Users/miles/git/otp-ui/packages/building-blocks/src/focus-trap-wrapper/index.tsx",methods:[],props:{},tags:{param:`query - Argument that gets passed to document.querySelectorAll
element - Specified element (e.target)`,returns:"- element to be focused"}}}catch{}try{a.displayName="getPreviousSibling",a.__docgenInfo={description:`Helper method to find the previous focusable sibling element relative to the
specified element.`,displayName:"getPreviousSibling",filePath:"/Users/miles/git/otp-ui/packages/building-blocks/src/focus-trap-wrapper/index.tsx",methods:[],props:{},tags:{param:`query - Argument that gets passed to document.querySelectorAll
element - Specified element (e.target)`,returns:"- element to be focused"}}}catch{}try{n.displayName="focustrapwrapper",n.__docgenInfo={description:"",displayName:"focustrapwrapper",filePath:"/Users/miles/git/otp-ui/packages/building-blocks/src/focus-trap-wrapper/index.tsx",methods:[],props:{closePopup:{defaultValue:{value:"null"},declarations:[{fileName:"otp-ui/packages/building-blocks/src/focus-trap-wrapper/index.tsx",name:"TypeLiteral"}],description:"",name:"closePopup",required:!1,tags:{},type:{name:"(arg?: boolean) => void"}},id:{defaultValue:null,declarations:[{fileName:"otp-ui/packages/building-blocks/src/focus-trap-wrapper/index.tsx",name:"TypeLiteral"}],description:"",name:"id",required:!0,tags:{},type:{name:"string"}},focusElements:{defaultValue:{value:'["button", "a", "input", "select"]'},declarations:[{fileName:"otp-ui/packages/building-blocks/src/focus-trap-wrapper/index.tsx",name:"TypeLiteral"}],description:"",name:"focusElements",required:!1,tags:{},type:{name:"string[]"}}},tags:{}}}catch{}const h={component:n,title:"Building-Blocks/FocusTrapWrapper"},r=()=>e.jsxs(n,{id:"button-set-story",children:[e.jsx("button",{type:"button",children:"Button 1"}),e.jsx("button",{type:"button",children:"Button 2"}),e.jsx("button",{type:"button",children:"Button 3"}),e.jsx("button",{type:"button",children:"Button 4"})]}),o=()=>e.jsxs(n,{focusElements:["button","a","div","input","select"],id:"various-els-story",children:[e.jsx("button",{type:"button",children:"Button 1"}),e.jsx("br",{}),e.jsx("a",{href:"/",children:"link"}),e.jsx("br",{}),e.jsx("div",{tabIndex:-1,children:"focusable div"}),e.jsxs("label",{htmlFor:"disabled-input",children:["Input (disabled) ",e.jsx("input",{id:"disabled-input",disabled:!0,type:"text"})," "]}),e.jsx("br",{}),e.jsxs("label",{htmlFor:"input",children:["Input ",e.jsx("input",{id:"input",type:"text"})]}),e.jsx("br",{}),e.jsxs("label",{htmlFor:"select",children:["Select"," ",e.jsxs("select",{id:"select",children:[e.jsx("option",{children:"Option 1"}),e.jsx("option",{children:"Option 2"})]})]})]});r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`(): React.ReactElement => <FocusTrapWrapper id="button-set-story">
    <button type="button">Button 1</button>
    <button type="button">Button 2</button>
    <button type="button">Button 3</button>
    <button type="button">Button 4</button>
  </FocusTrapWrapper>`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`(): React.ReactElement => <FocusTrapWrapper focusElements={["button", "a", "div", "input", "select"]} id="various-els-story">
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
  </FocusTrapWrapper>`,...o.parameters?.docs?.source}}};export{r as FocusTrapAroundButtonSet,o as FocusTrapWithVariousEls,h as default};
