import { useState } from "react";

// ── Theme ──────────────────────────────────────────────────────────────────
const C = {
  navy:"#0B1E3D", navy2:"#112649", navy3:"#162f58",
  gold:"#C9A84C", gold2:"#E2C068", gold3:"#F5DFA0",
  text:"#EEF2FF", muted:"#7B92B4", border:"#1E3560",
  red:"#E05C5C", green:"#4CAF86", blue:"#4C8AE0",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:${C.navy};color:${C.text};}
  input,select,textarea{outline:none;font-family:'DM Sans',sans-serif;}
  button{cursor:pointer;font-family:'DM Sans',sans-serif;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:${C.navy2};}
  ::-webkit-scrollbar-thumb{background:${C.gold};border-radius:3px;}
  @media print {
    body{background:#fff!important;color:#000!important;}
    .no-print{display:none!important;}
    .print-page{background:#fff!important;color:#000!important;padding:0!important;box-shadow:none!important;border:none!important;width:100%!important;max-width:100%!important;}
    .print-page *{color:#000!important;border-color:#ccc!important;}
    .lh-bar{background:#0B1E3D!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .lh-bar *{color:#C9A84C!important;}
    .gold-line{background:#C9A84C!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .stamp-box{border:2px dashed #999!important;}
  }
  @media(max-width:700px){
    .sidebar-full{display:none!important;}
    .mobile-bar{display:flex!important;}
    .main-pad{padding:16px!important;}
  }
  @media(min-width:701px){
    .mobile-bar{display:none!important;}
  }
`;

function injectCSS(id,s){if(!document.getElementById(id)){const el=document.createElement("style");el.id=id;el.textContent=s;document.head.appendChild(el);}}

// ── Seed data ──────────────────────────────────────────────────────────────
const CLINIC = {name:"ClinicOS Medical Centre",address:"Suite 204, Healthcare Tower, Al Reem Island, Abu Dhabi, UAE",phone:"+971 2 123 4567",email:"info@clinicos.ae",license:"DOH-HC-2019-00234"};

const USERS = [
  {id:1,name:"Dr. Sarah Al-Mansouri",role:"doctor",      username:"doctor",      password:"1234",specialty:"General & Family Medicine",license:"DHA-GP-00421"},
  {id:2,name:"Nurse Khalid Hassan",  role:"nurse",       username:"nurse",       password:"1234"},
  {id:3,name:"Lina Youssef",         role:"receptionist",username:"receptionist",password:"1234"},
  {id:4,name:"Admin Omar",           role:"admin",       username:"admin",       password:"1234"},
];

const ROLES={admin:"Admin",doctor:"Doctor",nurse:"Nurse",receptionist:"Receptionist"};

const P0=[
  {id:1,name:"Ahmed Al-Farsi",   dob:"1985-03-12",gender:"Male",  phone:"+971501234567",email:"ahmed@email.com",  bloodType:"A+",allergies:"Penicillin",insurance:"ADNIC",  insuranceNo:"ADN-00123"},
  {id:2,name:"Fatima Al-Rashid", dob:"1992-07-22",gender:"Female",phone:"+971502345678",email:"fatima@email.com", bloodType:"O+",allergies:"None",      insurance:"Daman",  insuranceNo:"DM-00456"},
  {id:3,name:"James Wong",       dob:"1978-11-05",gender:"Male",  phone:"+971503456789",email:"james@email.com",  bloodType:"B-",allergies:"Aspirin",   insurance:"Self-pay",insuranceNo:""},
];

const A0=[
  {id:1,patientId:1,patientName:"Ahmed Al-Farsi",  doctorId:1,doctorName:"Dr. Sarah Al-Mansouri",date:"2026-05-12",time:"09:00",reason:"Annual checkup",  status:"Confirmed",type:"In-clinic"},
  {id:2,patientId:2,patientName:"Fatima Al-Rashid",doctorId:1,doctorName:"Dr. Sarah Al-Mansouri",date:"2026-05-12",time:"10:30",reason:"Follow-up",       status:"Pending",  type:"In-clinic"},
  {id:3,patientId:3,patientName:"James Wong",      doctorId:1,doctorName:"Dr. Sarah Al-Mansouri",date:"2026-05-13",time:"14:00",reason:"Blood pressure",  status:"Confirmed",type:"Online"},
];

const R0=[
  {id:1,patientId:1,date:"2026-04-10",doctorId:1,diagnosis:"Hypertension Stage 1",notes:"Lifestyle changes advised. Monitor BP weekly.",prescription:"Amlodipine 5mg once daily",vitals:{bp:"145/90",hr:"78",temp:"36.8",weight:"82kg"}},
  {id:2,patientId:2,date:"2026-03-22",doctorId:1,diagnosis:"Viral URI",notes:"Rest and hydration.",prescription:"Paracetamol 500mg PRN",vitals:{bp:"118/76",hr:"82",temp:"37.6",weight:"61kg"}},
];

const I0=[
  {id:1,patientId:1,patientName:"Ahmed Al-Farsi",  date:"2026-04-10",items:[{desc:"Consultation",amount:150},{desc:"Blood Panel",amount:200}],insurance:"ADNIC",  insuranceCoverage:80,status:"Paid",   paymentMethod:"Insurance + Card"},
  {id:2,patientId:2,patientName:"Fatima Al-Rashid",date:"2026-03-22",items:[{desc:"Consultation",amount:150}],                               insurance:"Daman",  insuranceCoverage:75,status:"Pending",paymentMethod:"Insurance"},
  {id:3,patientId:3,patientName:"James Wong",      date:"2026-03-15",items:[{desc:"Consultation",amount:150},{desc:"ECG",amount:100}],        insurance:"Self-pay",insuranceCoverage:0, status:"Paid",   paymentMethod:"Cash"},
];

// ── Utilities ──────────────────────────────────────────────────────────────
const today=()=>new Date().toISOString().slice(0,10);
const fmtDate=d=>d?new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"}):"";
const calcAge=dob=>dob?Math.floor((new Date()-new Date(dob))/31557600000):"";
let _ref=200;
const refNo=pre=>`${pre}-${new Date().getFullYear()}-${++_ref}`;

// ── Shared components ──────────────────────────────────────────────────────
function Card({children,style}){return <div style={{background:C.navy2,border:`1px solid ${C.border}`,borderRadius:12,padding:24,...style}}>{children}</div>;}

function Badge({label,color}){
  const m={green:C.green,gold:C.gold,red:C.red,blue:C.blue,muted:C.muted};
  const bg=m[color]||C.muted;
  return <span style={{background:bg+"22",color:bg,border:`1px solid ${bg}55`,borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{label}</span>;
}

function Btn({children,onClick,variant="gold",small,style,disabled}){
  const v={
    gold:{background:`linear-gradient(135deg,${C.gold},${C.gold2})`,color:C.navy,border:"none"},
    outline:{background:"transparent",color:C.gold,border:`1px solid ${C.gold}`},
    ghost:{background:C.navy3,color:C.text,border:`1px solid ${C.border}`},
    danger:{background:C.red+"22",color:C.red,border:`1px solid ${C.red}55`},
    green:{background:C.green+"22",color:C.green,border:`1px solid ${C.green}55`},
  };
  return(
    <button onClick={onClick} disabled={disabled}
      style={{...v[variant],borderRadius:8,padding:small?"6px 14px":"10px 20px",fontWeight:600,fontSize:small?12:14,opacity:disabled?.5:1,transition:"opacity .15s",...style}}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity=".78";}}
      onMouseLeave={e=>{if(!disabled)e.currentTarget.style.opacity="1";}}>
      {children}
    </button>
  );
}

function Inp({label,value,onChange,type="text",options,placeholder,half}){
  const base={width:"100%",background:C.navy,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 13px",color:C.text,fontSize:14};
  return(
    <div style={{marginBottom:14,gridColumn:half?"span 1":"span 2"}}>
      {label&&<div style={{fontSize:11,color:C.muted,marginBottom:5,fontWeight:600,letterSpacing:.5}}>{label.toUpperCase()}</div>}
      {options
        ?<select value={value} onChange={e=>onChange(e.target.value)} style={{...base,appearance:"none"}}>{options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}</select>
        :type==="textarea"
          ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={{...base,resize:"vertical"}}/>
          :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base}/>}
    </div>
  );
}

function Grid({children,cols=2}){return <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:"0 16px"}}>{children}</div>;}

function Modal({title,children,onClose,wide}){
  return(
    <div style={{position:"fixed",inset:0,background:"#000b",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.navy2,border:`1px solid ${C.border}`,borderRadius:16,width:wide?760:500,maxWidth:"100%",maxHeight:"92vh",overflow:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.gold}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:24,lineHeight:1}}>×</button>
        </div>
        <div style={{padding:24}}>{children}</div>
      </div>
    </div>
  );
}

function StatCard({icon,label,value,color}){
  return(
    <Card style={{display:"flex",alignItems:"center",gap:16}}>
      <div style={{width:48,height:48,borderRadius:12,background:(color||C.gold)+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{icon}</div>
      <div>
        <div style={{fontSize:24,fontWeight:700,color:color||C.gold,fontFamily:"'Playfair Display',serif"}}>{value}</div>
        <div style={{fontSize:12,color:C.muted}}>{label}</div>
      </div>
    </Card>
  );
}

// ── LETTERHEAD (for documents) ─────────────────────────────────────────────
function Letterhead({docTitle,refNum,date}){
  return(
    <div>
      <div className="lh-bar" style={{background:C.navy,padding:"18px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"8px 8px 0 0"}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:C.gold}}>⚕️ {CLINIC.name}</div>
          <div style={{fontSize:11,color:C.gold+"99",marginTop:3}}>{CLINIC.address}</div>
        </div>
        <div style={{textAlign:"right",fontSize:11,color:C.gold+"99"}}>
          <div>{CLINIC.phone}</div><div>{CLINIC.email}</div><div>License: {CLINIC.license}</div>
        </div>
      </div>
      <div className="gold-line" style={{height:4,background:`linear-gradient(90deg,${C.gold},${C.gold2},${C.gold})`}}/>
      <div style={{background:"#fff",padding:"12px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:C.navy,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{docTitle}</div>
        <div style={{fontSize:12,color:"#555",textAlign:"right"}}><div><b>Ref:</b> {refNum}</div><div><b>Date:</b> {fmtDate(date)}</div></div>
      </div>
      <div style={{height:1,background:"#ddd"}}/>
    </div>
  );
}

function LetterFooter({doctor}){
  return(
    <div style={{background:"#fff",padding:"24px 32px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:20}}>
        <div style={{flex:1}}>
          <div style={{borderBottom:"1px solid #999",width:200,marginBottom:6}}/>
          <div style={{fontSize:13,color:"#000",fontWeight:600}}>{doctor?.name||"Physician"}</div>
          <div style={{fontSize:11,color:"#555"}}>{doctor?.specialty}</div>
          <div style={{fontSize:11,color:"#555"}}>License: {doctor?.license}</div>
        </div>
        <div className="stamp-box" style={{border:"2px dashed #bbb",width:110,height:75,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:6}}>
          <span style={{fontSize:11,color:"#aaa",textAlign:"center"}}>Official<br/>Stamp</span>
        </div>
      </div>
      <div className="gold-line" style={{height:3,background:`linear-gradient(90deg,${C.gold},${C.gold2},${C.gold})`,marginTop:16,borderRadius:2}}/>
      <div style={{fontSize:10,color:"#888",marginTop:6,textAlign:"center"}}>This document is confidential. {CLINIC.name} · {CLINIC.phone}</div>
    </div>
  );
}

function DocPreviewOverlay({children,onClose,onSave}){
  return(
    <div style={{position:"fixed",inset:0,background:"#000d",zIndex:3000,display:"flex",flexDirection:"column",overflow:"auto"}}>
      <div className="no-print" style={{background:C.navy2,borderBottom:`1px solid ${C.border}`,padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
        <span style={{fontFamily:"'Playfair Display',serif",color:C.gold,fontSize:16}}>📄 Document Preview</span>
        <div style={{display:"flex",gap:10}}>
          <Btn small variant="green" onClick={onSave}>💾 Save to Record</Btn>
          <Btn small variant="gold"  onClick={()=>window.print()}>🖨️ Print / PDF</Btn>
          <Btn small variant="ghost" onClick={onClose}>✕ Close</Btn>
        </div>
      </div>
      <div style={{flex:1,display:"flex",justifyContent:"center",padding:"28px 16px"}}>
        <div className="print-page" style={{background:"#fff",width:720,maxWidth:"100%",borderRadius:8,boxShadow:"0 8px 40px #0009",overflow:"hidden"}}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════════════════════════════════════

// ── LOGIN ──────────────────────────────────────────────────────────────────
function Login({onLogin}){
  const [u,setU]=useState("");const [p,setP]=useState("");const [err,setErr]=useState("");
  const go=()=>{const usr=USERS.find(x=>x.username===u&&x.password===p);usr?onLogin(usr):setErr("Wrong credentials. Try: admin / doctor / nurse / receptionist — password: 1234");};
  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.navy},${C.navy3})`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:380,height:380,borderRadius:"50%",border:`1px solid ${C.gold}20`,top:-100,right:-100}}/>
      <div style={{position:"absolute",width:240,height:240,borderRadius:"50%",border:`1px solid ${C.gold}15`,bottom:60,left:-60}}/>
      <div style={{width:400,position:"relative",zIndex:1,padding:"0 16px"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:48,marginBottom:10}}>⚕️</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:C.gold,letterSpacing:1}}>ClinicOS</h1>
          <p style={{color:C.muted,fontSize:13,marginTop:6}}>General & Family Medicine — Staff Portal</p>
        </div>
        <Card>
          <Inp label="Username" value={u} onChange={setU} placeholder="e.g. admin"/>
          <Inp label="Password" type="password" value={p} onChange={setP} placeholder="••••"/>
          {err&&<div style={{color:C.red,fontSize:12,marginBottom:14,background:C.red+"11",padding:10,borderRadius:8}}>{err}</div>}
          <Btn onClick={go} style={{width:"100%"}}>Sign In →</Btn>
          <div style={{marginTop:14,fontSize:11,color:C.muted,textAlign:"center"}}>Logins: <b>admin · doctor · nurse · receptionist</b> (password: 1234)</div>
        </Card>
      </div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({user,patients,appointments,invoices,records,savedDocs}){
  const td=new Date().toISOString().slice(0,10);
  const todayA=appointments.filter(a=>a.date===td);
  const paid=invoices.filter(i=>i.status==="Paid");
  const revenue=paid.reduce((s,i)=>s+i.items.reduce((x,t)=>x+Number(t.amount),0),0);
  const hr=new Date().getHours();
  const greet=hr<12?"Morning":hr<17?"Afternoon":"Evening";
  return(
    <div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold,marginBottom:6}}>Good {greet}, {user.name.split(" ")[0]} 👋</h2>
      <p style={{color:C.muted,fontSize:13,marginBottom:26}}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:24}}>
        <StatCard icon="👥" label="Total Patients"   value={patients.length}    color={C.blue}/>
        <StatCard icon="📅" label="Today's Appts"    value={todayA.length}      color={C.gold}/>
        <StatCard icon="📋" label="Medical Records"  value={records.length}     color={C.green}/>
        <StatCard icon="📄" label="Documents Saved"  value={savedDocs.length}   color="#9C6FDE"/>
        <StatCard icon="⏳" label="Pending Invoices" value={invoices.filter(i=>i.status==="Pending").length} color={C.red}/>
        <StatCard icon="💰" label="Revenue (Paid)"   value={`AED ${revenue.toLocaleString()}`} color={C.green}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:C.gold,marginBottom:14}}>Today's Appointments</div>
          {todayA.length===0?<div style={{color:C.muted,fontSize:13}}>No appointments today.</div>
            :todayA.map(a=>(
              <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <div><div style={{fontWeight:600,fontSize:14}}>{a.patientName}</div><div style={{fontSize:12,color:C.muted}}>{a.time} · {a.reason}</div></div>
                <Badge label={a.status} color={a.status==="Confirmed"?"green":"gold"}/>
              </div>
            ))}
        </Card>
        <Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:C.gold,marginBottom:14}}>Recent Patients</div>
          {[...patients].reverse().slice(0,4).map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:C.gold+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:C.gold,fontWeight:700,flexShrink:0}}>{p.name[0]}</div>
              <div><div style={{fontSize:14,fontWeight:600}}>{p.name}</div><div style={{fontSize:12,color:C.muted}}>{p.insurance} · {p.bloodType}</div></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── PATIENTS ───────────────────────────────────────────────────────────────
function Patients({patients,setPatients,user}){
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const canEdit=["admin","doctor","nurse"].includes(user.role);
  const filtered=patients.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.phone.includes(search));
  const openAdd=()=>{setForm({name:"",dob:"",gender:"Male",phone:"",email:"",bloodType:"A+",allergies:"",insurance:"Self-pay",insuranceNo:""});setModal("add");};
  const openView=p=>{setForm({...p});setModal(p);};
  const save=()=>{
    if(modal==="add")setPatients(p=>[...p,{...form,id:Date.now()}]);
    else setPatients(p=>p.map(x=>x.id===modal.id?{...form,id:modal.id}:x));
    setModal(null);
  };
  const del=id=>{if(window.confirm("Delete this patient?"))setPatients(p=>p.filter(x=>x.id!==id));};
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold}}>Patients</h2>
        {canEdit&&<Btn onClick={openAdd}>+ Add Patient</Btn>}
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search by name or phone…" style={{background:C.navy2,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 14px",color:C.text,fontSize:14,width:"100%",maxWidth:320,marginBottom:16}}/>
      <Card style={{padding:0,overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:520}}>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
            {["Patient","DOB","Phone","Blood","Insurance","Actions"].map(h=>(
              <th key={h} style={{padding:"12px 14px",textAlign:"left",fontSize:11,color:C.muted,fontWeight:600,letterSpacing:.5}}>{h.toUpperCase()}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((p,i)=>(
              <tr key={p.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":C.navy+"55"}}>
                <td style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:C.gold+"22",display:"flex",alignItems:"center",justifyContent:"center",color:C.gold,fontWeight:700,fontSize:13,flexShrink:0}}>{p.name[0]}</div>
                    <div><div style={{fontWeight:600,fontSize:14}}>{p.name}</div><div style={{fontSize:11,color:C.muted}}>{p.gender}</div></div>
                  </div>
                </td>
                <td style={{padding:"12px 14px",fontSize:13,color:C.muted}}>{p.dob}</td>
                <td style={{padding:"12px 14px",fontSize:13}}>{p.phone}</td>
                <td style={{padding:"12px 14px"}}><Badge label={p.bloodType} color="blue"/></td>
                <td style={{padding:"12px 14px",fontSize:13,color:C.muted}}>{p.insurance}</td>
                <td style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <Btn small variant="ghost" onClick={()=>openView(p)}>View</Btn>
                    {canEdit&&<Btn small variant="danger" onClick={()=>del(p.id)}>Del</Btn>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div style={{padding:24,color:C.muted,textAlign:"center"}}>No patients found.</div>}
      </Card>
      {modal&&(
        <Modal title={modal==="add"?"Add New Patient":`Patient: ${form.name}`} onClose={()=>setModal(null)} wide>
          <Grid><Inp half label="Full Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))}/><Inp half label="Date of Birth" value={form.dob} onChange={v=>setForm(f=>({...f,dob:v}))} type="date"/>
          <Inp half label="Gender" value={form.gender} onChange={v=>setForm(f=>({...f,gender:v}))} options={["Male","Female","Other"]}/><Inp half label="Phone" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))}/>
          <Inp half label="Email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} type="email"/><Inp half label="Blood Type" value={form.bloodType} onChange={v=>setForm(f=>({...f,bloodType:v}))} options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]}/>
          <Inp half label="Allergies" value={form.allergies} onChange={v=>setForm(f=>({...f,allergies:v}))} placeholder="e.g. Penicillin, None"/><Inp half label="Insurance" value={form.insurance} onChange={v=>setForm(f=>({...f,insurance:v}))} options={["Self-pay","ADNIC","Daman","Thiqa","AXA","MetLife","Other"]}/>
          <Inp half label="Insurance No." value={form.insuranceNo} onChange={v=>setForm(f=>({...f,insuranceNo:v}))} placeholder="Policy number"/>
          </Grid>
          {canEdit&&<Btn onClick={save}>{modal==="add"?"Add Patient":"Save Changes"}</Btn>}
        </Modal>
      )}
    </div>
  );
}

// ── APPOINTMENTS ───────────────────────────────────────────────────────────
function Appointments({appointments,setAppointments,patients,user}){
  const [filter,setFilter]=useState("All");
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({});
  const canEdit=["admin","doctor","receptionist"].includes(user.role);
  const statuses=["All","Confirmed","Pending","Cancelled","Completed"];
  const filtered=filter==="All"?appointments:appointments.filter(a=>a.status===filter);
  const openAdd=()=>{setForm({patientId:patients[0]?.id||"",doctorName:"Dr. Sarah Al-Mansouri",date:today(),time:"09:00",reason:"",status:"Pending",type:"In-clinic"});setModal(true);};
  const save=()=>{const pt=patients.find(p=>p.id===Number(form.patientId));setAppointments(p=>[...p,{...form,id:Date.now(),patientName:pt?.name||"",doctorId:1}]);setModal(false);};
  const upd=(id,status)=>setAppointments(p=>p.map(a=>a.id===id?{...a,status}:a));
  const sc=s=>({Confirmed:"green",Pending:"gold",Cancelled:"red",Completed:"blue"}[s]||"muted");
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold}}>Appointments</h2>
        {canEdit&&<Btn onClick={openAdd}>+ New Appointment</Btn>}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {statuses.map(s=><button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${filter===s?C.gold:C.border}`,background:filter===s?C.gold+"22":"transparent",color:filter===s?C.gold:C.muted,fontSize:13,cursor:"pointer"}}>{s}</button>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map(a=>(
          <Card key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <div style={{textAlign:"center",background:C.gold+"15",borderRadius:10,padding:"8px 14px",minWidth:64}}>
                <div style={{fontSize:20,fontWeight:700,color:C.gold,fontFamily:"'Playfair Display',serif"}}>{a.date.slice(8)}</div>
                <div style={{fontSize:10,color:C.muted}}>{new Date(a.date).toLocaleDateString("en-US",{month:"short"})}</div>
              </div>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{a.patientName}</div>
                <div style={{fontSize:12,color:C.muted}}>{a.time} · {a.reason}</div>
                <div style={{fontSize:11,color:C.muted}}>{a.doctorName} · {a.type}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <Badge label={a.status} color={sc(a.status)}/>
              {canEdit&&a.status==="Pending"&&<Btn small variant="ghost" onClick={()=>upd(a.id,"Confirmed")}>✓ Confirm</Btn>}
              {canEdit&&a.status==="Confirmed"&&<Btn small variant="outline" onClick={()=>upd(a.id,"Completed")}>Complete</Btn>}
              {canEdit&&!["Cancelled","Completed"].includes(a.status)&&<Btn small variant="danger" onClick={()=>upd(a.id,"Cancelled")}>Cancel</Btn>}
            </div>
          </Card>
        ))}
        {filtered.length===0&&<div style={{color:C.muted,textAlign:"center",padding:40}}>No appointments found.</div>}
      </div>
      {modal&&(
        <Modal title="New Appointment" onClose={()=>setModal(false)}>
          <Inp label="Patient" value={form.patientId} onChange={v=>setForm(f=>({...f,patientId:v}))} options={patients.map(p=>({value:p.id,label:p.name}))}/>
          <Inp label="Doctor"  value={form.doctorName} onChange={v=>setForm(f=>({...f,doctorName:v}))} options={["Dr. Sarah Al-Mansouri"]}/>
          <Inp label="Date"    value={form.date}   onChange={v=>setForm(f=>({...f,date:v}))}   type="date"/>
          <Inp label="Time"    value={form.time}   onChange={v=>setForm(f=>({...f,time:v}))}   type="time"/>
          <Inp label="Type"    value={form.type}   onChange={v=>setForm(f=>({...f,type:v}))}   options={["In-clinic","Online"]}/>
          <Inp label="Reason"  value={form.reason} onChange={v=>setForm(f=>({...f,reason:v}))} type="textarea" placeholder="Reason for visit…"/>
          <div style={{padding:"10px 14px",borderRadius:8,background:C.blue+"11",border:`1px solid ${C.blue}33`,marginBottom:14,fontSize:13,color:C.blue}}>📧 SMS/Email reminder will be sent automatically on confirmation.</div>
          <Btn onClick={save} style={{width:"100%"}}>Book Appointment</Btn>
        </Modal>
      )}
    </div>
  );
}

// ── RECORDS ────────────────────────────────────────────────────────────────
function Records({records,setRecords,patients,user}){
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const canWrite=["doctor"].includes(user.role);
  const openAdd=()=>{setForm({patientId:patients[0]?.id||"",date:today(),diagnosis:"",notes:"",prescription:"",vitals:{bp:"",hr:"",temp:"",weight:""}});setModal("add");};
  const save=()=>{const p=patients.find(x=>x.id===Number(form.patientId));setRecords(prev=>[...prev,{...form,id:Date.now(),patientName:p?.name,doctorId:user.id}]);setModal(null);};
  const gp=id=>patients.find(p=>p.id===id);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold}}>Medical Records</h2>
        {canWrite&&<Btn onClick={openAdd}>+ New Record</Btn>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {records.map(r=>{const p=gp(r.patientId);return(
          <Card key={r.id}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:12}}>
              <div><div style={{fontWeight:700,fontSize:15}}>{p?.name||"Unknown"}</div><div style={{fontSize:12,color:C.muted}}>{r.date}</div></div>
              <Badge label={r.diagnosis} color="blue"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,background:C.navy,borderRadius:8,padding:12,marginBottom:12}}>
              {[["🩸 BP",r.vitals?.bp],["❤️ HR",r.vitals?.hr+" bpm"],["🌡 Temp",r.vitals?.temp+"°C"],["⚖️ Weight",r.vitals?.weight]].map(([l,v])=>(
                <div key={l} style={{textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>{l}</div><div style={{fontWeight:600,fontSize:13}}>{v}</div></div>
              ))}
            </div>
            <div style={{fontSize:13,color:C.muted,marginBottom:6}}><b style={{color:C.text}}>Notes:</b> {r.notes}</div>
            <div style={{fontSize:13,color:C.muted}}><b style={{color:C.gold}}>Rx:</b> {r.prescription}</div>
          </Card>
        );})}
        {records.length===0&&<div style={{color:C.muted,textAlign:"center",padding:40}}>No records yet.</div>}
      </div>
      {modal==="add"&&(
        <Modal title="New Medical Record" onClose={()=>setModal(null)} wide>
          <Grid>
            <Inp half label="Patient" value={form.patientId} onChange={v=>setForm(f=>({...f,patientId:v}))} options={patients.map(p=>({value:p.id,label:p.name}))}/>
            <Inp half label="Date"    value={form.date}      onChange={v=>setForm(f=>({...f,date:v}))} type="date"/>
            <Inp label="Diagnosis"   value={form.diagnosis}  onChange={v=>setForm(f=>({...f,diagnosis:v}))} placeholder="Primary diagnosis"/>
            <Inp half label="Blood Pressure" value={form.vitals?.bp}     onChange={v=>setForm(f=>({...f,vitals:{...f.vitals,bp:v}}))}     placeholder="120/80"/>
            <Inp half label="Heart Rate"     value={form.vitals?.hr}     onChange={v=>setForm(f=>({...f,vitals:{...f.vitals,hr:v}}))}     placeholder="72"/>
            <Inp half label="Temperature"    value={form.vitals?.temp}   onChange={v=>setForm(f=>({...f,vitals:{...f.vitals,temp:v}}))}   placeholder="36.6"/>
            <Inp half label="Weight"         value={form.vitals?.weight} onChange={v=>setForm(f=>({...f,vitals:{...f.vitals,weight:v}}))} placeholder="70kg"/>
            <Inp label="Notes"         value={form.notes}        onChange={v=>setForm(f=>({...f,notes:v}))}        type="textarea" placeholder="Clinical notes…"/>
            <Inp label="Prescription"  value={form.prescription} onChange={v=>setForm(f=>({...f,prescription:v}))} type="textarea" placeholder="Medications…"/>
          </Grid>
          <Btn onClick={save} style={{width:"100%"}}>Save Record</Btn>
        </Modal>
      )}
    </div>
  );
}

// ── BILLING ────────────────────────────────────────────────────────────────
function Billing({invoices,setInvoices,patients,user}){
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({});
  const [items,setItems]=useState([]);
  const canEdit=["admin","receptionist"].includes(user.role);
  const tot=inv=>inv.items.reduce((s,i)=>s+Number(i.amount),0);
  const share=inv=>Math.round(tot(inv)*(1-inv.insuranceCoverage/100));
  const openAdd=()=>{setForm({patientId:patients[0]?.id||"",date:today(),insurance:"Self-pay",insuranceCoverage:0,paymentMethod:"Cash",status:"Pending"});setItems([{desc:"Consultation",amount:150}]);setModal(true);};
  const save=()=>{const p=patients.find(x=>x.id===Number(form.patientId));setInvoices(prev=>[...prev,{...form,id:Date.now(),patientName:p?.name,items:items.filter(i=>i.desc),insuranceCoverage:Number(form.insuranceCoverage)}]);setModal(false);};
  const markPaid=id=>setInvoices(prev=>prev.map(i=>i.id===id?{...i,status:"Paid"}:i));
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold}}>Billing & Invoices</h2>
        {canEdit&&<Btn onClick={openAdd}>+ New Invoice</Btn>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12,marginBottom:22}}>
        <StatCard icon="✅" label="Paid"    value={invoices.filter(i=>i.status==="Paid").length}    color={C.green}/>
        <StatCard icon="⏳" label="Pending" value={invoices.filter(i=>i.status==="Pending").length} color={C.gold}/>
        <StatCard icon="💰" label="Collected" value={`AED ${invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+tot(i),0).toLocaleString()}`} color={C.blue}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {invoices.map(inv=>(
          <Card key={inv.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>{inv.patientName}</div>
              <div style={{fontSize:12,color:C.muted}}>{inv.date} · {inv.paymentMethod}</div>
              <div style={{fontSize:12,color:C.muted}}>Insurance: {inv.insurance} ({inv.insuranceCoverage}% covered)</div>
              <div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>
                {inv.items.map((it,i)=><span key={i} style={{fontSize:12,background:C.navy,border:`1px solid ${C.border}`,borderRadius:6,padding:"2px 9px",color:C.muted}}>{it.desc}: <b style={{color:C.text}}>AED {it.amount}</b></span>)}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:20,fontWeight:700,color:C.gold,fontFamily:"'Playfair Display',serif"}}>AED {tot(inv)}</div>
              <div style={{fontSize:12,color:C.muted,marginBottom:8}}>Patient pays: AED {share(inv)}</div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end",flexWrap:"wrap"}}>
                <Badge label={inv.status} color={inv.status==="Paid"?"green":"gold"}/>
                {canEdit&&inv.status==="Pending"&&<Btn small onClick={()=>markPaid(inv.id)}>Mark Paid</Btn>}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {modal&&(
        <Modal title="New Invoice" onClose={()=>setModal(false)} wide>
          <Grid>
            <Inp half label="Patient"    value={form.patientId}        onChange={v=>setForm(f=>({...f,patientId:v}))}        options={patients.map(p=>({value:p.id,label:p.name}))}/>
            <Inp half label="Date"       value={form.date}             onChange={v=>setForm(f=>({...f,date:v}))}             type="date"/>
            <Inp half label="Insurance"  value={form.insurance}        onChange={v=>setForm(f=>({...f,insurance:v}))}        options={["Self-pay","ADNIC","Daman","Thiqa","AXA","MetLife","Other"]}/>
            <Inp half label="Coverage %" value={form.insuranceCoverage} onChange={v=>setForm(f=>({...f,insuranceCoverage:v}))} type="number" placeholder="0–100"/>
            <Inp half label="Payment"    value={form.paymentMethod}    onChange={v=>setForm(f=>({...f,paymentMethod:v}))}    options={["Cash","Card","Insurance","Insurance + Card"]}/>
          </Grid>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:8,fontWeight:600}}>INVOICE ITEMS</div>
            {items.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
                <input value={item.desc}   onChange={e=>setItems(p=>p.map((x,j)=>j===i?{...x,desc:e.target.value}:x))}   placeholder="Service" style={{flex:2,background:C.navy,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.text,fontSize:13}}/>
                <input value={item.amount} onChange={e=>setItems(p=>p.map((x,j)=>j===i?{...x,amount:e.target.value}:x))} placeholder="AED"     type="number" style={{flex:1,background:C.navy,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.text,fontSize:13}}/>
                <button onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))} style={{background:C.red+"22",color:C.red,border:"none",borderRadius:8,padding:"0 10px",cursor:"pointer"}}>×</button>
              </div>
            ))}
            <Btn small variant="ghost" onClick={()=>setItems(p=>[...p,{desc:"",amount:""}])}>+ Add Item</Btn>
          </div>
          <div style={{textAlign:"right",fontSize:16,fontWeight:700,color:C.gold,marginBottom:14}}>Total: AED {items.reduce((s,i)=>s+(Number(i.amount)||0),0).toLocaleString()}</div>
          <Btn onClick={save} style={{width:"100%"}}>Create Invoice</Btn>
        </Modal>
      )}
    </div>
  );
}

// ── DOCUMENTS ──────────────────────────────────────────────────────────────
function Documents({patients,user,savedDocs,setSavedDocs}){
  const [tab,setTab]=useState("MC");
  const [preview,setPreview]=useState(null);
  const doctors=USERS.filter(u=>u.role==="doctor");
  const TABS=[{key:"MC",label:"🩺 MC",desc:"Medical Certificate"},{key:"TimeSlip",label:"⏱️ Time Slip",desc:"Excuse Slip"},{key:"Quarantine",label:"🦠 Quarantine",desc:"Isolation Letter"},{key:"Referral",label:"📨 Referral",desc:"Referral Letter"}];

  const handleSave=()=>{setSavedDocs(p=>[...p,preview.meta]);alert("✅ Saved to patient record!");setPreview(null);};
  const typeColor={MC:"green","Time Slip":"blue",Quarantine:"red",Referral:"gold"};

  // ── MC form ──
  const [mc,setMC]=useState({patientId:patients[0]?.id||"",doctorId:doctors[0]?.id||"",date:today(),diagnosis:"",fromDate:today(),toDate:today(),recommendation:"rest at home",notes:"",fit:"unfit"});
  const previewMC=()=>{
    const pt=patients.find(p=>p.id===Number(mc.patientId));
    const dr=doctors.find(d=>d.id===Number(mc.doctorId));
    const ref=refNo("MC");
    const days=Math.round((new Date(mc.toDate)-new Date(mc.fromDate))/86400000)+1;
    setPreview({meta:{type:"MC",ref,patient:pt?.name,date:mc.date,summary:`MC — ${mc.diagnosis} (${fmtDate(mc.fromDate)} to ${fmtDate(mc.toDate)})`},node:(
      <div><Letterhead docTitle="Medical Certificate" refNum={ref} date={mc.date}/>
        <div style={{background:"#fff",padding:"26px 32px",color:"#000"}}>
          <p style={{marginBottom:16,fontSize:14,lineHeight:1.8}}>This certifies that <b>{pt?.name}</b>, {pt?.gender}, aged <b>{calcAge(pt?.dob)}</b>, examined on <b>{fmtDate(mc.date)}</b>, is suffering from:</p>
          <div style={{background:"#f7f5f0",border:"1px solid #ddd",borderRadius:8,padding:"12px 20px",marginBottom:16}}><div style={{fontSize:12,color:"#666",marginBottom:4}}>DIAGNOSIS</div><div style={{fontSize:16,fontWeight:700}}>{mc.diagnosis||"As examined"}</div></div>
          <p style={{marginBottom:12,fontSize:14,lineHeight:1.8}}>The patient is certified <b style={{color:mc.fit==="unfit"?"#c00":"#060"}}>{mc.fit.toUpperCase()} FOR WORK/SCHOOL</b> and advised to <b>{mc.recommendation}</b> for <b>{days} day{days!==1?"s":""}</b>:</p>
          <div style={{display:"flex",gap:16,marginBottom:16}}>
            <div style={{flex:1,background:"#f7f5f0",borderRadius:8,padding:"10px 16px",textAlign:"center"}}><div style={{fontSize:11,color:"#888"}}>FROM</div><div style={{fontWeight:700,fontSize:14}}>{fmtDate(mc.fromDate)}</div></div>
            <div style={{flex:1,background:"#f7f5f0",borderRadius:8,padding:"10px 16px",textAlign:"center"}}><div style={{fontSize:11,color:"#888"}}>TO</div><div style={{fontWeight:700,fontSize:14}}>{fmtDate(mc.toDate)}</div></div>
          </div>
          {mc.notes&&<p style={{fontSize:13,color:"#444",fontStyle:"italic",marginBottom:12}}>Notes: {mc.notes}</p>}
          <p style={{fontSize:12,color:"#888"}}>Issued upon request for official purposes.</p>
        </div><LetterFooter doctor={dr}/>
      </div>
    )});
  };

  // ── Time Slip form ──
  const [ts,setTS]=useState({patientId:patients[0]?.id||"",doctorId:doctors[0]?.id||"",date:today(),arrivalTime:"",departureTime:"",purpose:"medical consultation",notes:""});
  const previewTS=()=>{
    const pt=patients.find(p=>p.id===Number(ts.patientId));
    const dr=doctors.find(d=>d.id===Number(ts.doctorId));
    const ref=refNo("TS");
    setPreview({meta:{type:"Time Slip",ref,patient:pt?.name,date:ts.date,summary:`Time Slip — ${ts.purpose} on ${fmtDate(ts.date)}`},node:(
      <div><Letterhead docTitle="Time Slip / Excuse Slip" refNum={ref} date={ts.date}/>
        <div style={{background:"#fff",padding:"26px 32px",color:"#000"}}>
          <p style={{marginBottom:18,fontSize:14,lineHeight:1.8}}>This confirms that <b>{pt?.name}</b> attended <b>{CLINIC.name}</b> on <b>{fmtDate(ts.date)}</b> for a <b>{ts.purpose}</b>.</p>
          <div style={{display:"flex",gap:20,marginBottom:18}}>
            <div style={{flex:1,background:"#f7f5f0",borderRadius:8,padding:"14px 20px",textAlign:"center"}}><div style={{fontSize:11,color:"#888",marginBottom:4}}>ARRIVAL TIME</div><div style={{fontSize:22,fontWeight:700}}>{ts.arrivalTime||"—"}</div></div>
            <div style={{flex:1,background:"#f7f5f0",borderRadius:8,padding:"14px 20px",textAlign:"center"}}><div style={{fontSize:11,color:"#888",marginBottom:4}}>DEPARTURE TIME</div><div style={{fontSize:22,fontWeight:700}}>{ts.departureTime||"—"}</div></div>
          </div>
          <p style={{fontSize:14,marginBottom:12,lineHeight:1.8}}>This slip excuses the patient's absence/late arrival from work or school for the above period.</p>
          {ts.notes&&<p style={{fontSize:13,color:"#444",fontStyle:"italic",marginBottom:12}}>Notes: {ts.notes}</p>}
          <p style={{fontSize:12,color:"#888"}}>Please present to your employer or educational institution.</p>
        </div><LetterFooter doctor={dr}/>
      </div>
    )});
  };

  // ── Quarantine form ──
  const [qr,setQR]=useState({patientId:patients[0]?.id||"",doctorId:doctors[0]?.id||"",date:today(),fromDate:today(),toDate:today(),condition:"COVID-19 / Respiratory Infection",reason:"infectious",customReason:"",contactPersons:"",instructions:""});
  const previewQR=()=>{
    const pt=patients.find(p=>p.id===Number(qr.patientId));
    const dr=doctors.find(d=>d.id===Number(qr.doctorId));
    const ref=refNo("QR");
    const days=Math.round((new Date(qr.toDate)-new Date(qr.fromDate))/86400000)+1;
    setPreview({meta:{type:"Quarantine",ref,patient:pt?.name,date:qr.date,summary:`Quarantine — ${qr.condition} (${days} days)`},node:(
      <div><Letterhead docTitle="Quarantine / Isolation Letter" refNum={ref} date={qr.date}/>
        <div style={{background:"#fff",padding:"26px 32px",color:"#000"}}>
          <div style={{background:"#fff3f3",border:"1px solid #f5c0c0",borderRadius:8,padding:"10px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>⚠️</span><span style={{fontSize:13,color:"#a00",fontWeight:600}}>QUARANTINE / ISOLATION REQUIRED</span></div>
          <p style={{marginBottom:14,fontSize:14,lineHeight:1.8}}><b>{pt?.name}</b>, aged <b>{calcAge(pt?.dob)}</b>, examined on <b>{fmtDate(qr.date)}</b>, is diagnosed with / suspected of <b>{qr.condition}</b>.</p>
          <p style={{marginBottom:14,fontSize:14,lineHeight:1.8}}>Due to the <b>{qr.reason==="custom"?qr.customReason:qr.reason}</b> nature of this condition, home isolation is required for <b>{days} day{days!==1?"s":""}</b>:</p>
          <div style={{display:"flex",gap:16,marginBottom:16}}>
            <div style={{flex:1,background:"#f7f5f0",borderRadius:8,padding:"10px 16px",textAlign:"center"}}><div style={{fontSize:11,color:"#888"}}>FROM</div><div style={{fontWeight:700,fontSize:14}}>{fmtDate(qr.fromDate)}</div></div>
            <div style={{flex:1,background:"#f7f5f0",borderRadius:8,padding:"10px 16px",textAlign:"center"}}><div style={{fontSize:11,color:"#888"}}>UNTIL</div><div style={{fontWeight:700,fontSize:14}}>{fmtDate(qr.toDate)}</div></div>
          </div>
          <div style={{marginBottom:14}}><b style={{fontSize:13}}>Instructions:</b>
            <ul style={{paddingLeft:20,fontSize:13,lineHeight:2,color:"#333",marginTop:6}}>
              <li>Remain at home, avoid all public spaces</li><li>Wear a mask around household members</li>
              <li>Do not attend work, school, or gatherings</li><li>Monitor symptoms; seek help if worsening</li>
              {qr.instructions&&<li>{qr.instructions}</li>}
            </ul>
          </div>
          {qr.contactPersons&&<p style={{fontSize:13,color:"#444",marginBottom:12}}><b>Close contacts to notify:</b> {qr.contactPersons}</p>}
          <p style={{fontSize:12,color:"#888"}}>Present this letter to relevant authorities (employer, school, building management).</p>
        </div><LetterFooter doctor={dr}/>
      </div>
    )});
  };

  // ── Referral form ──
  const [rf,setRF]=useState({patientId:patients[0]?.id||"",doctorId:doctors[0]?.id||"",date:today(),referralType:"specialist",toName:"",toSpecialty:"Cardiology",toHospital:"",urgency:"routine",reason:"",history:"",investigations:"",requestedAction:""});
  const previewRF=()=>{
    const pt=patients.find(p=>p.id===Number(rf.patientId));
    const dr=doctors.find(d=>d.id===Number(rf.doctorId));
    const ref=refNo("RF");
    const urgColor={routine:"#1a6e3c",urgent:"#b45000",emergency:"#a00"}[rf.urgency];
    setPreview({meta:{type:"Referral",ref,patient:pt?.name,date:rf.date,summary:`Referral to ${rf.toSpecialty} — ${rf.urgency}`},node:(
      <div><Letterhead docTitle={`Referral Letter — ${rf.referralType==="specialist"?"Specialist":"Hospital / Emergency"}`} refNum={ref} date={rf.date}/>
        <div style={{background:"#fff",padding:"26px 32px",color:"#000"}}>
          <div style={{display:"inline-block",background:urgColor+"18",border:`1px solid ${urgColor}44`,color:urgColor,padding:"3px 14px",borderRadius:20,fontSize:12,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>{rf.urgency==="emergency"?"🚨":rf.urgency==="urgent"?"⚡":"📋"} {rf.urgency} referral</div>
          <p style={{marginBottom:14,fontSize:14,lineHeight:1.8}}>Dear <b>{rf.toName?`Dr. ${rf.toName}`:"Colleague"}</b>{rf.toSpecialty?`, ${rf.toSpecialty}`:""}{rf.toHospital?` — ${rf.toHospital}`:""},</p>
          <p style={{marginBottom:14,fontSize:14,lineHeight:1.8}}>I am referring <b>{pt?.name}</b>, {pt?.gender}, aged <b>{calcAge(pt?.dob)}</b>, insured under <b>{pt?.insurance}</b>, for your expert evaluation.</p>
          {[["REASON FOR REFERRAL",rf.reason],["RELEVANT MEDICAL HISTORY",rf.history],["INVESTIGATIONS / RESULTS",rf.investigations],["REQUESTED ACTION",rf.requestedAction]].filter(([,v])=>v).map(([t,v])=>(
            <div key={t} style={{marginBottom:14}}><div style={{fontWeight:700,fontSize:12,borderBottom:"1px solid #eee",paddingBottom:5,marginBottom:8}}>{t}</div><p style={{fontSize:14,lineHeight:1.7}}>{v}</p></div>
          ))}
          <p style={{fontSize:14,marginBottom:6,lineHeight:1.8}}>Your assessment would be greatly appreciated. Please contact us for further information.</p>
          <p style={{fontSize:14}}>Yours sincerely,</p>
        </div><LetterFooter doctor={dr}/>
      </div>
    )});
  };

  const F=(obj,set)=>(k)=>(v)=>set(p=>({...p,[k]:v}));

  return(
    <div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold,marginBottom:20}}>Clinical Documents</h2>
      {/* Tabs */}
      <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap"}}>
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{padding:"10px 18px",borderRadius:10,border:`1px solid ${tab===t.key?C.gold:C.border}`,background:tab===t.key?C.gold+"18":C.navy2,color:tab===t.key?C.gold:C.muted,fontWeight:tab===t.key?700:400,cursor:"pointer",fontSize:13,borderBottom:tab===t.key?`3px solid ${C.gold}`:`3px solid transparent`}}>
            {t.label}<div style={{fontSize:10,color:tab===t.key?C.gold+"aa":C.muted+"88"}}>{t.desc}</div>
          </button>
        ))}
      </div>

      {/* MC */}
      {tab==="MC"&&<Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:C.gold,marginBottom:18}}>🩺 Medical Certificate</div>
        <Grid><Inp half label="Patient" value={mc.patientId} onChange={F(mc,setMC)("patientId")} options={patients.map(p=>({value:p.id,label:p.name}))}/><Inp half label="Doctor" value={mc.doctorId} onChange={F(mc,setMC)("doctorId")} options={doctors.map(d=>({value:d.id,label:d.name}))}/>
        <Inp half label="Issue Date" value={mc.date} onChange={F(mc,setMC)("date")} type="date"/><Inp half label="Status" value={mc.fit} onChange={F(mc,setMC)("fit")} options={[{value:"unfit",label:"Unfit for Work/School"},{value:"fit",label:"Fit for Work/School"}]}/>
        <Inp label="Diagnosis" value={mc.diagnosis} onChange={F(mc,setMC)("diagnosis")} placeholder="e.g. Acute Gastroenteritis"/>
        <Inp half label="Rest From" value={mc.fromDate} onChange={F(mc,setMC)("fromDate")} type="date"/><Inp half label="Rest Until" value={mc.toDate} onChange={F(mc,setMC)("toDate")} type="date"/>
        <Inp label="Recommendation" value={mc.recommendation} onChange={F(mc,setMC)("recommendation")} options={["rest at home","avoid strenuous activity","avoid contact with others","take prescribed medication and rest","follow-up in 3 days"]}/>
        <Inp label="Additional Notes" value={mc.notes} onChange={F(mc,setMC)("notes")} type="textarea" placeholder="Optional extra instructions…"/></Grid>
        <Btn onClick={previewMC}>Preview & Print →</Btn>
      </Card>}

      {/* Time Slip */}
      {tab==="TimeSlip"&&<Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:C.gold,marginBottom:18}}>⏱️ Time Slip / Excuse Slip</div>
        <Grid><Inp half label="Patient" value={ts.patientId} onChange={F(ts,setTS)("patientId")} options={patients.map(p=>({value:p.id,label:p.name}))}/><Inp half label="Doctor" value={ts.doctorId} onChange={F(ts,setTS)("doctorId")} options={doctors.map(d=>({value:d.id,label:d.name}))}/>
        <Inp half label="Visit Date" value={ts.date} onChange={F(ts,setTS)("date")} type="date"/><Inp half label="Purpose" value={ts.purpose} onChange={F(ts,setTS)("purpose")} options={["medical consultation","follow-up appointment","laboratory tests","vaccination","procedure/treatment","emergency visit"]}/>
        <Inp half label="Arrival Time" value={ts.arrivalTime} onChange={F(ts,setTS)("arrivalTime")} type="time"/><Inp half label="Departure Time" value={ts.departureTime} onChange={F(ts,setTS)("departureTime")} type="time"/>
        <Inp label="Notes" value={ts.notes} onChange={F(ts,setTS)("notes")} type="textarea" placeholder="Optional remarks…"/></Grid>
        <Btn onClick={previewTS}>Preview & Print →</Btn>
      </Card>}

      {/* Quarantine */}
      {tab==="Quarantine"&&<Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:C.gold,marginBottom:18}}>🦠 Quarantine / Isolation Letter</div>
        <Grid><Inp half label="Patient" value={qr.patientId} onChange={F(qr,setQR)("patientId")} options={patients.map(p=>({value:p.id,label:p.name}))}/><Inp half label="Doctor" value={qr.doctorId} onChange={F(qr,setQR)("doctorId")} options={doctors.map(d=>({value:d.id,label:d.name}))}/>
        <Inp half label="Issue Date" value={qr.date} onChange={F(qr,setQR)("date")} type="date"/><Inp half label="Condition" value={qr.condition} onChange={F(qr,setQR)("condition")} options={["COVID-19 / Respiratory Infection","Influenza / Flu","Chickenpox","Measles","Tuberculosis (TB)","Gastroenteritis","Other Infectious Disease"]}/>
        <Inp half label="Isolation From" value={qr.fromDate} onChange={F(qr,setQR)("fromDate")} type="date"/><Inp half label="Isolation Until" value={qr.toDate} onChange={F(qr,setQR)("toDate")} type="date"/>
        <Inp half label="Reason" value={qr.reason} onChange={F(qr,setQR)("reason")} options={[{value:"infectious",label:"Infectious nature"},{value:"highly contagious",label:"Highly contagious"},{value:"precautionary",label:"Precautionary"},{value:"custom",label:"Custom reason…"}]}/>
        {qr.reason==="custom"&&<Inp half label="Custom Reason" value={qr.customReason} onChange={F(qr,setQR)("customReason")} placeholder="Describe…"/>}
        <Inp label="Additional Instructions" value={qr.instructions} onChange={F(qr,setQR)("instructions")} placeholder="Optional extra instructions…"/>
        <Inp label="Close Contacts to Notify" value={qr.contactPersons} onChange={F(qr,setQR)("contactPersons")} placeholder="Optional — household members, colleagues…"/></Grid>
        <Btn onClick={previewQR}>Preview & Print →</Btn>
      </Card>}

      {/* Referral */}
      {tab==="Referral"&&<Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:C.gold,marginBottom:18}}>📨 Referral Letter</div>
        <Grid><Inp half label="Patient" value={rf.patientId} onChange={F(rf,setRF)("patientId")} options={patients.map(p=>({value:p.id,label:p.name}))}/><Inp half label="Referring Dr." value={rf.doctorId} onChange={F(rf,setRF)("doctorId")} options={doctors.map(d=>({value:d.id,label:d.name}))}/>
        <Inp half label="Date" value={rf.date} onChange={F(rf,setRF)("date")} type="date"/><Inp half label="Referral Type" value={rf.referralType} onChange={F(rf,setRF)("referralType")} options={[{value:"specialist",label:"Specialist"},{value:"hospital",label:"Hospital / Emergency"}]}/>
        <Inp half label="Urgency" value={rf.urgency} onChange={F(rf,setRF)("urgency")} options={[{value:"routine",label:"Routine"},{value:"urgent",label:"Urgent"},{value:"emergency",label:"Emergency 🚨"}]}/><Inp half label="Specialty" value={rf.toSpecialty} onChange={F(rf,setRF)("toSpecialty")} options={["Cardiology","Dermatology","Endocrinology","Gastroenterology","Neurology","Oncology","Ophthalmology","Orthopedics","Pediatrics","Psychiatry","Pulmonology","Urology","Emergency Medicine","Other"]}/>
        <Inp half label="Referred Dr. (optional)" value={rf.toName} onChange={F(rf,setRF)("toName")} placeholder="Surname"/><Inp half label="Hospital (optional)" value={rf.toHospital} onChange={F(rf,setRF)("toHospital")} placeholder="Facility name"/>
        <Inp label="Reason for Referral"      value={rf.reason}          onChange={F(rf,setRF)("reason")}          type="textarea" placeholder="Clinical reason…"/>
        <Inp label="Medical History"           value={rf.history}         onChange={F(rf,setRF)("history")}         type="textarea" placeholder="Past diagnoses, medications…"/>
        <Inp label="Investigations / Results"  value={rf.investigations}  onChange={F(rf,setRF)("investigations")}  type="textarea" placeholder="Lab results, imaging…"/>
        <Inp label="Requested Action"          value={rf.requestedAction} onChange={F(rf,setRF)("requestedAction")} type="textarea" placeholder="What you're asking the specialist to do…"/></Grid>
        <Btn onClick={previewRF}>Preview & Print →</Btn>
      </Card>}

      {/* Saved log */}
      <Card style={{marginTop:22}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:C.gold,marginBottom:14}}>📁 Saved Documents ({savedDocs.length})</div>
        {savedDocs.length===0?<div style={{color:C.muted,fontSize:13}}>No documents saved yet. Generate and save one above.</div>
          :savedDocs.map((d,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
              <div><div style={{fontWeight:600,fontSize:14}}>{d.patient}</div><div style={{fontSize:12,color:C.muted}}>{d.summary}</div><div style={{fontSize:11,color:C.muted}}>{d.ref} · {fmtDate(d.date)}</div></div>
              <Badge label={d.type} color={typeColor[d.type]||"muted"}/>
            </div>
          ))}
      </Card>

      {/* Preview overlay */}
      {preview&&<DocPreviewOverlay onClose={()=>setPreview(null)} onSave={handleSave}>{preview.node}</DocPreviewOverlay>}
    </div>
  );
}

// ── STAFF ──────────────────────────────────────────────────────────────────
function Staff(){
  const roleColor={admin:"red",doctor:"blue",nurse:"green",receptionist:"gold"};
  return(
    <div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold,marginBottom:20}}>Staff</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
        {USERS.map(s=>(
          <Card key={s.id} style={{textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:C.gold+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 12px",border:`2px solid ${C.gold}44"}`}}>{s.name[0]}</div>
            <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>{s.name}</div>
            <Badge label={ROLES[s.role]} color={roleColor[s.role]}/>
            {s.specialty&&<div style={{fontSize:12,color:C.muted,marginTop:8}}>{s.specialty}</div>}
            <div style={{fontSize:11,color:C.muted,marginTop:4}}>@{s.username}</div>
          </Card>
        ))}
      </div>
      <div style={{marginTop:20,padding:14,background:C.gold+"11",border:`1px solid ${C.gold}33`,borderRadius:10,fontSize:13,color:C.muted}}>
        ☁️ <b style={{color:C.gold}}>Production tip:</b> Connect Supabase to store all data permanently and access from any device anywhere — inside or outside the clinic.
      </div>
    </div>
  );
}

// ── NAV CONFIG ─────────────────────────────────────────────────────────────
const NAV_ITEMS={
  admin:        ["Dashboard","Patients","Appointments","Records","Documents","Billing","Staff"],
  doctor:       ["Dashboard","Patients","Appointments","Records","Documents"],
  nurse:        ["Dashboard","Patients","Appointments","Records"],
  receptionist: ["Dashboard","Patients","Appointments","Billing","Documents"],
};
const ICONS={Dashboard:"◈",Patients:"👤",Appointments:"📅",Records:"📋",Documents:"📄",Billing:"💳",Staff:"👥"};

// ── SIDEBAR ────────────────────────────────────────────────────────────────
function Sidebar({user,active,setActive,onLogout}){
  const items=NAV_ITEMS[user.role]||[];
  return(
    <div className="sidebar-full" style={{width:220,background:C.navy2,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0,minHeight:"100vh"}}>
      <div style={{padding:"24px 18px 18px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.gold}}>⚕️ ClinicOS</div>
        <div style={{fontSize:11,color:C.muted,marginTop:3}}>General & Family Medicine</div>
      </div>
      <div style={{padding:"10px 8px",flex:1}}>
        {items.map(item=>(
          <div key={item} onClick={()=>setActive(item)}
            style={{display:"flex",alignItems:"center",gap:11,padding:"11px 12px",borderRadius:9,marginBottom:3,cursor:"pointer",background:active===item?`${C.gold}18`:"transparent",color:active===item?C.gold:C.muted,fontWeight:active===item?600:400,borderLeft:active===item?`3px solid ${C.gold}`:"3px solid transparent",transition:"all .15s"}}
            onMouseEnter={e=>{if(active!==item)e.currentTarget.style.background=C.navy3;}}
            onMouseLeave={e=>{if(active!==item)e.currentTarget.style.background="transparent";}}>
            <span style={{fontSize:15}}>{ICONS[item]}</span><span style={{fontSize:13}}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{padding:14,borderTop:`1px solid ${C.border}`}}>
        <div style={{fontSize:13,color:C.text,fontWeight:600}}>{user.name}</div>
        <div style={{fontSize:11,color:C.gold,marginBottom:10}}>{ROLES[user.role]}</div>
        <Btn variant="outline" small onClick={onLogout} style={{width:"100%"}}>Sign Out</Btn>
      </div>
    </div>
  );
}

// ── MOBILE BOTTOM BAR ──────────────────────────────────────────────────────
function MobileBar({user,active,setActive}){
  const items=(NAV_ITEMS[user.role]||[]).slice(0,5);
  return(
    <div className="mobile-bar" style={{position:"fixed",bottom:0,left:0,right:0,background:C.navy2,borderTop:`1px solid ${C.border}`,zIndex:500,justifyContent:"space-around",padding:"8px 0 12px"}}>
      {items.map(item=>(
        <button key={item} onClick={()=>setActive(item)} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:active===item?C.gold:C.muted,fontSize:10,fontWeight:active===item?700:400}}>
          <span style={{fontSize:18}}>{ICONS[item]}</span>{item}
        </button>
      ))}
    </div>
  );
}

// ── ROOT APP ───────────────────────────────────────────────────────────────
export default function App(){
  injectCSS("clinic-os",GLOBAL_CSS);
  const [user,setUser]=useState(null);
  const [active,setActive]=useState("Dashboard");
  const [patients,setPatients]=useState(P0);
  const [appointments,setAppointments]=useState(A0);
  const [records,setRecords]=useState(R0);
  const [invoices,setInvoices]=useState(I0);
  const [savedDocs,setSavedDocs]=useState([]);

  if(!user)return <Login onLogin={u=>{setUser(u);setActive("Dashboard");}}/>;

  const pages={
    Dashboard:    <Dashboard    user={user} patients={patients} appointments={appointments} invoices={invoices} records={records} savedDocs={savedDocs}/>,
    Patients:     <Patients     user={user} patients={patients} setPatients={setPatients}/>,
    Appointments: <Appointments user={user} appointments={appointments} setAppointments={setAppointments} patients={patients}/>,
    Records:      <Records      user={user} records={records} setRecords={setRecords} patients={patients}/>,
    Documents:    <Documents    user={user} patients={patients} savedDocs={savedDocs} setSavedDocs={setSavedDocs}/>,
    Billing:      <Billing      user={user} invoices={invoices} setInvoices={setInvoices} patients={patients}/>,
    Staff:        <Staff/>,
  };

  return(
    <div style={{display:"flex",minHeight:"100vh"}}>
      <Sidebar user={user} active={active} setActive={setActive} onLogout={()=>setUser(null)}/>
      <MobileBar user={user} active={active} setActive={setActive}/>
      <div className="main-pad" style={{flex:1,padding:28,overflowY:"auto",maxHeight:"100vh",paddingBottom:80}}>
        {pages[active]||<div style={{color:C.muted}}>Page not found.</div>}
      </div>
    </div>
  );
}
