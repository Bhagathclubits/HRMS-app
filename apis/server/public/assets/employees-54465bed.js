import{R as n,j as e,e as i,b as t,B as m,L as E,u as v,F as p,S as N,T as f,G as d,c as D,h as k,d as T}from"./index-05c0ffa2.js";import{u as R,P as C,D as I}from"./DataGrid-6459767d.js";import"./Checkbox-4ab32b67.js";const w=n.createContext(null),U=()=>{const a=n.useContext(w);if(!a)throw new Error("");return a},H="modal fade",A=a=>`${H} ${a.className}`,r=a=>{const l={...a};return delete l.labelId,e(w.Provider,{value:a,children:e(i,{as:"div",...l,className:A(a),tabIndex:-1,"aria-labelledby":a.labelId,"aria-hidden":"true",children:e(i,{as:"div",className:"modal-dialog",children:e(i,{as:"div",className:"modal-content",children:a.children})})})})},L="modal-header",j=a=>`${L} ${a.className}`,M=a=>{const{labelId:l}=U(),o={...a};return delete o.action,delete o.title,t(i,{as:"div",...o,className:j(a),children:[e(i,{as:"h1",className:"modal-title fs-5",id:l,children:a.title}),a.action?a.action:e(i,{as:"button",type:"button",className:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"}),a.children?a.children:null]})},G="modal-body",q=a=>`${G} ${a.className}`,z=a=>{const l={...a};return e(i,{as:"div",...l,className:q(a)})},J="modal-footer",K=a=>`${J} ${a.className}`,O=a=>{const l={...a};return e(i,{as:"div",...l,className:K(a)})},Q=a=>{const l={...a};return delete l.id,delete l.labelId,e(m,{"data-bs-toggle":"modal","data-bs-target":`#${a.id}`,...l})},V=a=>{const l={...a};return delete l.id,delete l.labelId,e(E,{"data-bs-toggle":"modal","data-bs-target":`#${a.id}`,...l})};r.Header=M;r.Body=z;r.Footer=O;r.Trigger=Q;r.TriggerLink=V;const W=()=>{const a=v(),[l,o]=n.useState("employee"),[h,x]=n.useState(""),[g,F]=n.useState(""),[u,P]=n.useState(""),[b,B]=n.useState(""),[y,$]=n.useState(""),S=async()=>{try{await D.user.set.mutate({name:h,username:g,password:u,role:l,email:b||void 0,mobile:y||void 0})}catch(s){k(s,a)}},c={id:"create-user",labelId:"create-user-label"};return t(p,{children:[e(r.Trigger,{...c,variant:"primary",children:"Create User"}),t(r,{...c,children:[e(r.Header,{title:"Add User"}),e(r.Body,{children:t(N,{gap:"3",children:[t("div",{children:[e(f,{as:"h6",color:"secondary",children:"Role"}),t("div",{className:"btn-group",role:"group","data-toggle":"buttons",children:[e("input",{type:"radio",className:"btn-check",name:"role",id:"employee",autoComplete:"off",checked:l==="employee",onChange:()=>o("employee")}),e("label",{className:"btn btn-outline-primary",htmlFor:"employee",children:"Employee"}),e("input",{type:"radio",className:"btn-check",name:"role",id:"admin",autoComplete:"off",checked:l==="admin",onChange:()=>o("admin")}),e("label",{className:"btn btn-outline-primary",htmlFor:"admin",children:"Admin"})]})]}),t(d.Row,{gutters:"3",children:[e(d.Col,{cols:["12","lg-6"],children:t("div",{className:"form-floating",children:[e("input",{type:"text",className:"form-control",id:"name",placeholder:"John",value:h,onChange:s=>x(s.target.value)}),e("label",{htmlFor:"name",children:"Name"})]})}),e(d.Col,{cols:["12","lg-6"],children:t("div",{className:"form-floating",children:[e("input",{type:"text",className:"form-control",id:"username",placeholder:"Doe",value:g,onChange:s=>F(s.target.value)}),e("label",{htmlFor:"username",children:"Username"})]})}),e(d.Col,{cols:["12","lg-6"],children:t("div",{className:"form-floating",children:[e("input",{type:"password",className:"form-control",id:"password",placeholder:"********",value:u,onChange:s=>P(s.target.value)}),e("label",{htmlFor:"password",children:"Password"})]})}),e(d.Col,{cols:["12","lg-6"],children:t("div",{className:"form-floating",children:[e("input",{type:"email",className:"form-control",id:"email",placeholder:"johndoe@example.com",value:b,onChange:s=>B(s.target.value)}),e("label",{htmlFor:"email",children:"Email Address"})]})})]}),e(d.Row,{gutters:"3",children:e(d.Col,{cols:["12","lg-6"],children:t("div",{className:"form-floating",children:[e("input",{type:"text",className:"form-control",id:"mobile",placeholder:"+919876543210",value:y,onChange:s=>$(s.target.value)}),e("label",{htmlFor:"mobile",children:"Mobile"})]})})})]})}),t(r.Footer,{children:[e(m,{variant:"outline-primary","data-bs-toggle":"modal","data-bs-target":`#${c.id}`,children:"Cancel"}),e(m,{variant:"primary",onClick:S,"data-bs-toggle":"modal","data-bs-target":`#${c.id}`,children:"Submit"})]})]})]})},_=()=>{const a=v(),l=R({load:async()=>{try{const o=await D.user.getMany.query();return{totalCount:o.length,items:o}}catch(o){return k(o,a),{error:new Error("Something went wrong")}}}});return e(p,{children:t(N,{gap:"3",children:[e(C,{title:e(C.Title,{children:"Employees"}),actions:e(W,{})}),e(T,{children:e(I,{...l,columns:[{id:"1",key:"name",label:"Name"},{id:"2",key:"username",label:"Username"},{id:"3",key:"",label:"Role",renderCell:o=>e(f,{as:"span",transform:"capitalize",children:o.role.name})},{id:"4",key:"email",label:"Email"},{id:"5",key:"mobile",label:"Mobile"}]})})]})})};export{_ as EmployeesPage,_ as default};
