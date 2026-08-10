import{j as a}from"./jsx-runtime-BHk-Pj2y.js";import"./iframe-Bpk3mz_R.js";import{C as n,a as r,b as c,c as t,d as i,e as l,f as o,g as d}from"./classic-walk-BuBtPXhu.js";function u({mode:s,...e}){if(!s)return null;switch(s.toLowerCase()){case"bicycle":case"bicycle_rent":return a.jsx(d,{...e});case"bus":return a.jsx(r,{...e});case"car":case"car_park":return a.jsx(o,{...e});case"ferry":return a.jsx(l,{...e});case"gondola":return a.jsx(i,{...e});case"micromobility":case"micromobility_rent":case"scooter":return a.jsx(t,{...e});case"rail":case"subway":case"tram":return a.jsx(c,{...e});case"transit":return a.jsx(r,{...e});case"walk":return a.jsx(n,{...e});default:return null}}u.__docgenInfo={description:`Icons for all classic OTP-react-redux modes.
Any hail and rental modes managed by one or multiple companies
are optional (by default, the company logo will be displayed)
but can be overridden here using the pattern
<otp_mode>_<company_id> (e.g. 'car_hail_uber').
Furthermore, any hail or rental modes managed by a single company
are optional (by default, the company logo will be displayed)
but can be overridden here using the pattern
<otp_mode> (e.g. 'bicycle_rent').`,methods:[],displayName:"ClassicModeIcon"};export{u as C};
