import{j as e}from"./jsx-runtime-BHk-Pj2y.js";import{r as p,R as h}from"./iframe-Bpk3mz_R.js";import{T as i}from"./index-DgRBlum5.js";import{c as d}from"./companies-CGqFxomf.js";import{m as y,c}from"./modes-en-DR6FtjFY.js";import"./preload-helper-D9Z9MdNV.js";import"./index-CSkjABmd.js";import"./typeof-CY0RTpPX.js";import"./index.esm-D4CulEa4.js";import"./styled-components.browser.esm-B47-n1gN.js";import"./toConsumableArray-Bnd270tG.js";import"./polyline-CXOwTUft.js";import"./uFuzzy-Bq0Q_4AX.js";import"./index-bsugPHvp.js";import"./query-params-i18n-C8-B-QnA.js";import"./en-US-qEeFzDIJ.js";import"./ExternalLinkAlt.esm-VlTzDB4r.js";import"./message-DqGH20up.js";import"./leg-icon-gcBPH9NR.js";import"./index-RKay4Hhp.js";const{action:O}=__STORYBOOK_MODULE_ACTIONS__,f=O("onQueryParamChange"),x={mode:"WALK,TRANSIT",routingType:"ITINERARY"};class m extends p.Component{constructor(){super(),this.handleOnQueryParamChange=o=>{const{queryParams:r}=this.state,u={...r,...o};f(o),this.setState({queryParams:u})},this.state={queryParams:x}}render(){const{children:o}=this.props,{queryParams:r}=this.state;return h.cloneElement(o,{onQueryParamChange:this.handleOnQueryParamChange,queryParams:r})}}const B={component:i,title:"TripOptions",args:{featuredItemOverlayBackButton:!0,supportedCompanies:d},parameters:{a11y:{config:{rules:[{id:"color-contrast",enabled:!1},{id:"duplicate-id-aria",enabled:!1},{id:"duplicate-id",enabled:!1}]}}}},l=t=>e.jsx(m,{children:e.jsx(i,{...t})}),s={render:l,args:{supportedModes:c}},a={render:l,args:{supportedModes:y}},n={render:()=>{const[t,o]=p.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",disabled:!t,onClick:()=>{o(!1)},children:"close overlay"}),e.jsx(m,{children:e.jsx(i,{featuredItemOverlayShown:o,featuredItemOverlayEnabled:t,supportedCompanies:d,supportedModes:c,tripOptionIconFillOverride:"white",checkboxIcons:{checked:()=>e.jsx("span",{children:"✅"}),unchecked:()=>e.jsx("span",{children:"❌"})},CompanyIcon:({company:r})=>e.jsx("i",{style:{color:"black"},children:r}),DetailedModeIcon:({mode:r})=>e.jsx("h1",{children:r}),SimpleModeIcon:({mode:r})=>e.jsx("b",{children:r}),QuestionIcon:e.jsx("span",{children:"😕"})})})]})},parameters:{storyshots:{disable:!0}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    supportedModes: commonModes
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: Template,
  args: {
    supportedModes: modesWithCompanyFirstMixedCategory
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: (): ReactElement => {
    const [featuredOverlayShown, setFeaturedOverlayShown] = useState(false);
    return <>
        <button type="button" disabled={!featuredOverlayShown} onClick={() => {
        setFeaturedOverlayShown(false);
      }}>
          close overlay
        </button>
        <PanelWrapper>
          <TripOptions featuredItemOverlayShown={setFeaturedOverlayShown} featuredItemOverlayEnabled={featuredOverlayShown} supportedCompanies={commonCompanies} supportedModes={commonModes} tripOptionIconFillOverride="white" checkboxIcons={{
          // eslint-disable-next-line react/display-name
          checked: () => <span>✅</span>,
          // eslint-disable-next-line react/display-name
          unchecked: () => <span>❌</span>
        }} CompanyIcon={({
          company
        }) => <i style={{
          color: "black"
        }}>{company}</i>} DetailedModeIcon={({
          mode
        }) => <h1>{mode}</h1>} SimpleModeIcon={({
          mode
        }) => <b>{mode}</b>} QuestionIcon={<span>😕</span>} />
        </PanelWrapper>
      </>;
  },
  // Disable storyshot for this story, as it is mostly the same as TripOptions
  // except with a hook that storyshot can't handle
  parameters: {
    storyshots: {
      disable: true
    }
  }
}`,...n.parameters?.docs?.source}}};export{a as CompanyFirstMixedCategory,n as CustomIconsAndCloseButton,s as Default,B as default};
