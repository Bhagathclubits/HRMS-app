import{R as d,j as s,l as t,b as i,B as r,L as c}from"./index-e20a6fbb.js";const n=d.createContext(null),g=()=>{const e=d.useContext(n);if(!e)throw new Error("");return e},m="modal fade",u=e=>`${m} ${e.className}`,l=e=>{const a={...e};return delete a.labelId,s(n.Provider,{value:e,children:s(t,{as:"div",...a,className:u(e),tabIndex:-1,"aria-labelledby":e.labelId,"aria-hidden":"true",children:s(t,{as:"div",className:"modal-dialog",children:s(t,{as:"div",className:"modal-content",children:e.children})})})})},b="modal-header",h=e=>`${b} ${e.className}`,C=e=>{const{labelId:a}=g(),o={...e};return delete o.action,delete o.title,i(t,{as:"div",...o,className:h(e),children:[s(t,{as:"h1",className:"modal-title fs-5",id:a,children:e.title}),e.action?e.action:s(t,{as:"button",type:"button",className:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"}),e.children?e.children:null]})},D="modal-body",N=e=>`${D} ${e.className}`,B=e=>{const a={...e};return s(t,{as:"div",...a,className:N(e)})},x="modal-footer",$=e=>`${x} ${e.className}`,v=e=>{const a={...e};return s(t,{as:"div",...a,className:$(e)})},y=e=>{const a={...e};return delete a.id,delete a.labelId,s(r,{"data-bs-toggle":"modal","data-bs-target":`#${e.id}`,...a})},P=e=>{const a={...e};return delete a.id,delete a.labelId,s(c,{"data-bs-toggle":"modal","data-bs-target":`#${e.id}`,...a})};l.Header=C;l.Body=B;l.Footer=v;l.Trigger=y;l.TriggerLink=P;export{l as D,C as a};
