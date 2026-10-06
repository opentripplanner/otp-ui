import{j as r}from"./jsx-runtime-I3b0MXVw.js";import{r as m}from"./iframe-CbmH3Sk6.js";import{B as _}from"./index-DpNQ1pDA.js";import{u as U,i as X}from"./styled-C37e9QoI.js";import{L as b,S as J}from"./layer-Dd6tj9bX.js";import{M as Y}from"./index-CiYohtvv.js";import"./preload-helper-D9Z9MdNV.js";import"./typeof-CY0RTpPX.js";import"./toConsumableArray-Bnd270tG.js";import"./Alert-CXnaHs5h.js";import"./styled-components.browser.esm-uCYIMK6T.js";import"./index-BB0vnH6P.js";import"./index-CSniXySC.js";import"./index-r_Hd9OOL.js";import"./index-BuZ-YcdQ.js";import"./index-D4_O9q9i.js";import"./DotCircle.esm-C8I2qLGM.js";import"./index.esm-BNGsg_oW.js";import"./en-US-Bch233oJ.js";import"./message-CLbDtumr.js";import"./index-DmBMjDFs.js";import"./dom-query-BHOLqPPs.js";import"./index-DqO6Z1-O.js";import"./polyline-D_7-M6B9.js";import"./uFuzzy.esm-ByNYuUO6.js";import"./index-bsugPHvp.js";import"./en-US-PAklYiaL.js";const G=e=>["case",["==",["get",e],"SCOOTER"],"#f5a729",["==",["get",e],"BICYCLE"],"#f00","#333"],I=["concat","#",["case",["!=",["index-of",",",["get","routeColors"]],-1],["slice",["get","routeColors"],0,["index-of",",",["get","routeColors"]]],["get","routeColors"]]],q=e=>({rentalStations:{"circle-color":e||G("formFactors"),"circle-opacity":.9,"circle-stroke-color":"#333","circle-stroke-width":3},rentalVehicles:{"circle-color":e||G("formFactor"),"circle-opacity":.9,"circle-stroke-color":"#333","circle-stroke-width":2},stations:{"circle-color":e||"#fff","circle-opacity":.9,"circle-radius":10,"circle-stroke-color":"#333","circle-stroke-width":3},areaStops:{"circle-color":I,"circle-opacity":.9,"circle-stroke-color":"#333","circle-stroke-width":2},stops:{"circle-color":e||"#fff","circle-opacity":.9,"circle-stroke-color":"#333","circle-stroke-width":2},vehicleParking:{"circle-color":e||"black","circle-opacity":.9,"circle-radius":10,"circle-stroke-color":"#333","circle-stroke-width":3}}),W=["areaStops"],F="OTP-UI-stopsAndStations";function B(e){return e==="stops"||e==="stations"}function Q(e,l){const s=e.features?.[0]?.sourceLayer,y=e.features?.[0]?.properties,h=s==="stops"?y?.gtfsId:"",t={...y,closed:h&&l?.has(h),lat:e.lngLat.lat,lon:e.lngLat.lng,sourceLayer:s};return!B(s)&&s!=="areaStops"&&(t.name=t.name??"",t.vehicleType=s==="rentalVehicles"&&"formFactor"in t?{formFactor:t.formFactor}:s==="rentalStations"&&"formFactors"in t?{formFactor:t.formFactors}:void 0,t.rentalNetwork="network"in t?{networkId:t.network}:void 0,s==="rentalStations"&&(t.availableVehicles=void 0,t.availableSpaces=void 0)),t}const $={},K=({closedStops:e,color:l,configCompanies:s,feeds:y,getEntityPrefix:h,id:t,network:k,minZoom:P=14,setLocation:L,setViewedStop:v,sourceId:a,stopsWhitelist:u,type:n})=>{const{current:o}=U(),[c,g]=m.useState(null),S=m.useCallback(i=>{const D=Q(i,e),H=$[a];(!H||B(n)||!B(H.sourceLayer))&&($[a]=D,g(D))},[g,e]),d=m.useCallback(()=>{$[a]=null,g(null)},[g]),T=m.useCallback(()=>{o&&(o.getCanvas().style.cursor="pointer")},[o]),N=m.useCallback(()=>{o&&(o.getCanvas().style.cursor="")},[o]),Z=i=>{o&&o.on("click",i,S)},R=i=>{o&&o.off("click",i,S)},x=i=>{o&&(o.on("mouseenter",i,T),o.on("mouseleave",i,N),Z(i))},j=i=>{o&&(o.off("mouseenter",i,T),o.off("mouseleave",i,N),R(i))};m.useEffect(()=>(x(t),x(`${t}-secondary`),x(`${t}-fill`),Z(`${t}-outline`),()=>{j(t),j(`${t}-secondary`),j(`${t}-fill`),R(`${t}-outline`)}),[e,t,o]);let p=["all"];k&&(p=["all",["==","network",k]]),(n==="stops"||n==="areaStops"||n===F)&&(p=["all",["!",["has","parentStation"]],["!=",["get","routes"],["literal","[]"]]]),u&&(p=["in",["get","gtfsId"],["literal",u]]);const w=u?2:P,M=W.includes(n),A=n===F;return r.jsxs(r.Fragment,{children:[M&&r.jsx(b,{filter:p,id:`${t}-fill`,minzoom:w,paint:{"fill-color":I,"fill-opacity":.2},"source-layer":n,source:a,type:"fill"}),M&&r.jsx(b,{filter:p,id:`${t}-outline`,layout:{"line-join":"round","line-cap":"round"},minzoom:w,paint:{"line-color":I,"line-opacity":.8,"line-width":3},"source-layer":n,source:a,type:"line"}),A&&r.jsx(b,{filter:p,id:t,minzoom:w,paint:q(l).stops,source:a,"source-layer":"stops",type:"circle"},`${t}-stops`),A&&r.jsx(b,{filter:p,id:`${t}-secondary`,minzoom:w,paint:q(l).stops,source:a,"source-layer":"stations",type:"circle"},`${t}-stations`),!M&&!A&&r.jsx(b,{filter:p,id:t,minzoom:w,paint:q(l)[n],source:a,"source-layer":n,type:"circle"},t),c&&r.jsx(X,{latitude:c.lat,longitude:c.lon,maxWidth:"100%",onClose:d,children:r.jsx(Y,{closePopup:d,configCompanies:s,entity:{...c,id:c?.id||c?.gtfsId},feeds:y,getEntityPrefix:h,setLocation:L?i=>{d(),L(i)}:void 0,setViewedStop:v?i=>{d(),v(i)}:void 0})})]})};try{otp2tilelayerwithpopup.displayName="otp2tilelayerwithpopup",otp2tilelayerwithpopup.__docgenInfo={description:"",displayName:"otp2tilelayerwithpopup",props:{closedStops:{defaultValue:null,description:`A set of gtfsIds for stops that are closed. When provided, the map popup for a closed stop will
display a note indicating the cancellation`,name:"closedStops",required:!1,type:{name:"Set<string>"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string"}},configCompanies:{defaultValue:null,description:`Optional configuration item which allows for customizing properties of scooter and
bikeshare companies. If this is provided, scooter/bikeshare company names can be rendered in the
default scooter/bike popup`,name:"configCompanies",required:!1,type:{name:"ConfiguredCompany[]"}},feeds:{defaultValue:null,description:`A list of feeds from the GraphQL query. If specified, the feed publisher name will be used to
display the name of the stop in the popup.`,name:"feeds",required:!1,type:{name:"Feed[]"}},getEntityPrefix:{defaultValue:null,description:"",name:"getEntityPrefix",required:!1,type:{name:"(entity: Stop | VehicleRentalStation | RentalVehicle) => Element"}},id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},name:{defaultValue:null,description:"",name:"name",required:!1,type:{name:"string"}},network:{defaultValue:null,description:"If `network` is specified, the layer will be filtered to only show vehicles from\nthat network",name:"network",required:!1,type:{name:"string"}},minZoom:{defaultValue:{value:"14"},description:"The minimum zoom to show the layer at. Defaults to 14",name:"minZoom",required:!1,type:{name:"number"}},setLocation:{defaultValue:null,description:`A method fired when a stop is selected as from or to in the default popup. If this method
is not passed, the from/to buttons will not be shown.`,name:"setLocation",required:!1,type:{name:"(location: MapLocationActionArg) => void"}},setViewedStop:{defaultValue:null,description:`A method fired when the stop viewer is opened in the default popup. If this method is
not passed, the stop viewer link will not be shown.`,name:"setViewedStop",required:!1,type:{name:"StopEventHandler"}},sourceId:{defaultValue:null,description:"ID of the <Source> element for this layer.",name:"sourceId",required:!0,type:{name:"string"}},stopsWhitelist:{defaultValue:null,description:`A list of GTFS stop ids (with agency prepended). If specified, all stops that
are NOT in this list will be HIDDEN.`,name:"stopsWhitelist",required:!1,type:{name:"string[]"}},type:{defaultValue:null,description:"Determines which layer of the OTP2 tile data to display. Also determines icon color.",name:"type",required:!0,type:{name:"string"}},visible:{defaultValue:null,description:"",name:"visible",required:!1,type:{name:"boolean"}}}}}catch{}const z="otp2-tiles";function ee(e){return{...e,finalType:e.type===F?"stops,stations":e.overrideType||e.type}}const O=(e,l,s,y,h,t,k,P,L)=>{const v=e.map(ee),a=v.map(u=>u.finalType).join(",");return[r.jsx(J,{alwaysShow:!0,id:z,type:"vector",url:`${l}/${a}/tilejson.json`},z),...v.map(u=>{const{color:n,initiallyVisible:o,minZoom:c,name:g,network:S,type:d}=u,T=`${d}${S?`-${S}`:""}`;return r.jsx(K,{closedStops:L,color:n,configCompanies:t,feeds:P,getEntityPrefix:k,id:T,name:g||T,network:S,minZoom:c,setLocation:s,setViewedStop:y,sourceId:z,stopsWhitelist:h,type:d,visible:o},T)})]};try{src.displayName="src",src.__docgenInfo={description:`Generates an array of MapLibreGL Source and Layer components with included popups for
rendering OTP2 tile data.`,displayName:"src",props:{}}}catch{}const _e={parameters:{storyshots:{disable:!0}},title:"OTP2 Tile Layer"},C=()=>{const[e,l]=m.useState("");return r.jsxs(r.Fragment,{children:[r.jsxs("label",{children:["OTP2 Server with stops layers enabled:"," ",r.jsx("input",{onChange:s=>l(s.target.value),placeholder:"http://localhost:8001/otp",value:e})]}),r.jsx(_,{center:[0,0],style:{height:"80vh"},zoom:3,children:O([{type:"stops"},{type:"areaStops"}],`${e}/routers/default/vectorTiles`)})]})},f=e=>r.jsx(_,{center:[39.9526,-75.1652],style:{height:"80vh"},zoom:14,children:O([{color:e.stopsColor,initiallyVisible:!0,type:"stops"},{color:e.stationsColor,initiallyVisible:!0,type:"stations"}],"http://localhost:5555/phl/otp/routers/default/vectorTiles")});f.args={stationsColor:"#66ccff",stopsColor:"#fff"};const V=()=>r.jsx(_,{center:[39.9526,-75.1652],style:{height:"80vh"},zoom:14,children:O([{initiallyVisible:!0,type:"OTP-UI-stopsAndStations"}],"http://localhost:5555/phl/otp/routers/default/vectorTiles")}),E=()=>r.jsx(_,{center:[33.76339,-84.44089],style:{height:"80vh"},zoom:13,children:O([{initiallyVisible:!0,minZoom:12,type:"stops"},{initiallyVisible:!0,minZoom:12,type:"stations"},{initiallyVisible:!0,minZoom:12,type:"areaStops"}],"http://localhost:5555/atl/otp/routers/default/vectorTiles")});C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`(): JSX.Element => {
  const [endpoint, setEndpoint] = useState("");
  return <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        OTP2 Server with stops layers enabled:{" "}
        <input onChange={e => setEndpoint(e.target.value)} placeholder="http://localhost:8001/otp" value={endpoint} />
      </label>
      <BaseMap center={[0, 0]} style={{
      height: "80vh"
    }} zoom={3}>
        {generateOTP2TileLayers([{
        type: "stops"
      }, {
        type: "areaStops"
      }], \`\${endpoint}/routers/default/vectorTiles\`)}
      </BaseMap>
    </>;
}`,...C.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`(args: {
  stationsColor: string;
  stopsColor: string;
}): JSX.Element => <BaseMap center={[39.9526, -75.1652]} style={{
  height: "80vh"
}} zoom={14}>
    {generateOTP2TileLayers([{
    color: args.stopsColor,
    initiallyVisible: true,
    type: "stops"
  }, {
    color: args.stationsColor,
    initiallyVisible: true,
    type: "stations"
  }], "http://localhost:5555/phl/otp/routers/default/vectorTiles")}
  </BaseMap>`,...f.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`(): JSX.Element => <BaseMap center={[39.9526, -75.1652]} style={{
  height: "80vh"
}} zoom={14}>
    {generateOTP2TileLayers([{
    initiallyVisible: true,
    type: "OTP-UI-stopsAndStations"
  }], "http://localhost:5555/phl/otp/routers/default/vectorTiles")}
  </BaseMap>`,...V.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`(): JSX.Element => <BaseMap center={[33.76339, -84.44089]} style={{
  height: "80vh"
}} zoom={13}>
    {generateOTP2TileLayers([{
    initiallyVisible: true,
    minZoom: 12,
    type: "stops"
  }, {
    initiallyVisible: true,
    minZoom: 12,
    type: "stations"
  }, {
    initiallyVisible: true,
    minZoom: 12,
    type: "areaStops"
  }], "http://localhost:5555/atl/otp/routers/default/vectorTiles")}
  </BaseMap>`,...E.parameters?.docs?.source}}};try{f.displayName="MockStopStationTileLayersPHL",f.__docgenInfo={description:"",displayName:"MockStopStationTileLayersPHL",props:{stationsColor:{defaultValue:null,description:"",name:"stationsColor",required:!0,type:{name:"string"}},stopsColor:{defaultValue:null,description:"",name:"stopsColor",required:!0,type:{name:"string"}}}}}catch{}export{E as MockAreaStopTileLayerATL,V as MockStopStationCombinedLayerPHL,f as MockStopStationTileLayersPHL,C as OtpTileLayerFromYourOwnServer,_e as default};
