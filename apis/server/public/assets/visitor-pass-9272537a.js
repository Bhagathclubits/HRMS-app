import{u as w,R as o,c as p,b as l,F as m,j as e,S as y,G as r,T as n,B as x,h as I,d as G}from"./index-e20a6fbb.js";import{u as U,D as A}from"./DataGrid-4b8db2de.js";import{P as S}from"./PageHeader-0a00bc30.js";import{D as u,a as q}from"./Dialog-28d74173.js";import"./Checkbox-2135657c.js";const L=()=>{const f=w();o.useState("");const[d,a]=o.useState(""),[i,D]=o.useState(""),[h,P]=o.useState(),[c,C]=o.useState(),[b,k]=o.useState(""),[v,R]=o.useState(`${new Date}`),[N,W]=o.useState(`${new Date}`),[F,H]=o.useState(`${new Date}`),[M,O]=o.useState([]),[V,j]=o.useState([]),[T,z]=o.useState(""),[J,E]=o.useState();o.useState(!1);const $=t=>{if(!t.target.files)return;const[s]=t.target.files;s&&E(s)},B=async()=>{try{if(console.log({hrId:h}),h===void 0||(console.log({companyId:c}),c===void 0))return;await p.visitorPass.set.mutate({name:d,fromPlace:i,mobileNumber:b,hrId:h,companyId:c,date:v,inTime:N,outTime:F,reason:T}),window.location.reload()}catch(t){I(t,f)}},g={id:"create-info",labelId:"create-info-label"};return o.useEffect(()=>{(async()=>{const t=await p.company.getMany.query();O(t);const[s]=t;s!==void 0&&C(s.id)})()},[]),o.useEffect(()=>{(async()=>{try{if(c===void 0)return;const t=await p.hr.getMany.mutate({companyId:c});console.log(c),j(t)}catch{}})()},[c]),l(m,{children:[e(u.Trigger,{...g,variant:"primary",children:"Create VisitorPass"}),l(u,{...g,children:[e(q,{title:"VisitorPass"}),e(u.Body,{children:e(y,{gap:"3",children:l(r.Row,{gutters:"3",children:[l(r.Col,{cols:["12","xl-12"],children:[e("label",{htmlFor:"Photo",children:e(n,{fontWeight:"bolder",children:"Photo"})}),e(y,{gap:"5",orientation:"vertical",children:l(r.Col,{cols:["12","lg-1"],children:[e("label",{style:{height:"100px",width:"100px",display:"flex",justifyContent:"space-evenly",alignItems:"center"},className:"form-control",htmlFor:"customFile",children:e("input",{type:"file",className:"form-control",onChange:$})}),e("input",{type:"file",style:{display:"none"},className:"form-control",id:"customFile"})]})})]}),l(r.Col,{cols:["12","lg-6"],children:[l("label",{htmlFor:"First Name",children:[e(n,{fontWeight:"bolder",children:"Visitor Name"})," "]}),e("div",{children:e("input",{type:"text",className:"form-control",id:"name",value:d,onChange:t=>a(t.target.value)})})]}),l(r.Col,{cols:["12","lg-6"],children:[e("label",{htmlFor:"Fromplace",children:e(n,{fontWeight:"bolder",children:"From Place"})}),e("div",{children:e("input",{type:"text",className:"form-control",id:"name",value:i,onChange:t=>D(t.target.value)})})]}),l(r.Col,{cols:["12","lg-6"],children:[e("label",{htmlFor:"username",children:e(n,{fontWeight:"bolder",children:"Company"})}),e("div",{children:l("select",{className:"form-control",value:c,onChange:t=>C(parseInt(t.target.value)),children:[e("option",{value:void 0,children:"Select Company"}),M.map((t,s)=>e("option",{value:t.id,children:t.name}))]})})]}),l(r.Col,{cols:["12","lg-6"],children:[e("label",{htmlFor:"username",children:e(n,{fontWeight:"bolder",children:"Hr"})}),e("div",{children:l("select",{className:"form-control",value:h,onChange:t=>P(parseInt(t.target.value)),children:[e("option",{value:void 0,children:"Select HR"}),V.map((t,s)=>e("option",{value:t.id,children:t.user.name}))]})})]}),l(r.Col,{cols:["12","lg-6"],children:[l("label",{htmlFor:"From date",children:[" ",e(n,{fontWeight:"bolder",children:"From date"})]}),e("div",{children:e("input",{type:"date",className:"form-control",value:v,onChange:t=>R(t.target.value)})})]}),l(r.Col,{cols:["12","lg-6"],children:[l("label",{htmlFor:"Mobilenumber",children:[" ",e(n,{fontWeight:"bolder",children:"Mobile Number"})]}),e("div",{children:e("input",{type:"text",className:"form-control",id:"name",value:b,onChange:t=>k(t.target.value)})})]}),l(r.Col,{cols:["12","lg-6"],children:[l("label",{htmlFor:"InTime",children:[" ",e(n,{fontWeight:"bolder",children:"In-Time"})]}),l("div",{className:"form-floating",children:[e("input",{type:"date-time",className:"form-control",value:N,onChange:t=>W(t.target.value)}),e("label",{htmlFor:"InTime",children:"In-Time"})]})]}),l(r.Col,{cols:["12","lg-6"],children:[e("label",{htmlFor:"OutTime",children:e(n,{fontWeight:"bolder",children:"Out-Time"})}),l("div",{className:"form-floating",children:[e("input",{type:"date-time",className:"form-control",value:F,onChange:t=>H(t.target.value)}),e("label",{htmlFor:"OutTime",children:"Out-Time"})]})]}),l(r.Col,{cols:["12","xl-12"],children:[l("label",{htmlFor:"floatingTextarea2",children:[" ",e(n,{fontWeight:"bolder",children:"Reason"})]}),e("div",{children:e("textarea",{className:"form-control",id:"floatingTextarea2",rows:2,value:T,onChange:t=>z(t.target.value)})})]})]})})}),e(u.Footer,{children:e("div",{style:{width:"100%",display:"flex",justifyContent:"space-evenly",alignItems:"center"},children:e(x,{variant:"primary",className:"center",onClick:B,"data-bs-toggle":"modal","data-bs-target":`#${g.id}`,children:"Confirm"})})})]})]})},_=()=>{const f=w(),d=U({load:async a=>{try{const i=await p.visitorPass.getMany.mutate();return console.log(i),{items:i.items,totalCount:i.totalCount}}catch(i){return I(i,f),{error:Error("Something went wrong")}}}});return e(m,{children:l(y,{gap:"3",children:[l(r.Row,{children:[e(r.Col,{className:"py-2",cols:["12","md-2"],children:e("input",{type:"text",className:"form-control form-control-sm",placeholder:"Visitor Name"})}),e(r.Col,{className:"py-2",cols:["12","md-2"],children:e("input",{type:"text",className:"form-control form-control-sm",placeholder:"Visitor From"})}),e(r.Col,{className:"py-2",cols:["12","md-2"],children:e("input",{type:"text",className:"form-control form-control-sm",placeholder:"From Date"})}),l(r.Row,{children:[e(r.Col,{className:"py-2",cols:["12","md-2"],children:e("input",{type:"text",className:"form-control form-control-sm",placeholder:"In Time"})}),e(r.Col,{className:"py-2",cols:["12","md-2"],children:e("input",{type:"text",className:"form-control form-control-sm",placeholder:"Out Time"})}),e(r.Col,{className:"py-2",cols:["12","md-2"],children:e(x,{variant:"primary",className:"w-100",children:"Search"})})]})]}),e(S,{title:e(S.Title,{}),actions:e(L,{})}),e(G,{children:e(A,{...d,columns:[{id:"2",key:"name",label:"Name",renderCell:a=>e(n,{transform:"capitalize",children:a.name})},{id:"3",key:"fromPlace",label:"From Place",renderCell:a=>e(n,{transform:"capitalize",children:a.fromPlace})},{id:"4",key:"",label:"Company Name",renderCell:a=>e(n,{transform:"capitalize",children:a.companies.name})},{id:"5",key:"",label:"HR Name",renderCell:a=>e(n,{transform:"capitalize",children:a.hr.user.name})},{id:"6",key:"mobileNumber",label:"Mobile Number"},{id:"7",key:"",label:"Date",renderCell:a=>e(m,{children:a.date?new Intl.DateTimeFormat("en-US",{year:"numeric",month:"numeric",day:"numeric"}).format(new Date(a.date)):""})},{id:"8",key:"",label:"InTime",renderCell:a=>e(m,{children:new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"numeric"}).format(new Date(a.inTime))})},{id:"9",key:"",label:"OutTime",renderCell:a=>e(m,{children:a.outTime!==null?new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"numeric"}).format(new Date(a.outTime)):""})},{id:"10",key:"reason",label:"Reason",renderCell:a=>e(n,{transform:"capitalize",children:a.reason})}]})})]})})};export{_ as default};
