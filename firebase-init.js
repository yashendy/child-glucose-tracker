<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ملف الطفل</title>
<link rel="stylesheet" href="styles.css">
<style>
/* لمسات سريعة */
.form grid{display:grid;gap:10px}
.grid.g2{grid-template-columns:repeat(2,minmax(0,1fr))}
@media(max-width:900px){.grid.g2{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="topbar">
  <div>🧒 ملف الطفل</div>
  <div class="row">
    <a id="lnkDash" class="btn gray">لوحة الطفل</a>
    <a id="lnkHome" class="btn gray">رجوع</a>
  </div>
</div>

<main class="container">
  <section class="card">
    <div class="row" style="gap:12px;align-items:center">
      <img id="avatar" class="avatar" style="width:84px;height:84px" src="images/avatar-default.png" alt="">
      <div>
        <div id="kidName" style="font-weight:800">—</div>
        <div id="kidMeta" class="note">—</div>
      </div>
    </div>
  </section>

  <section class="card">
    <h3 style="margin-top:0">البيانات الأساسية</h3>
    <div class="grid g2">
      <div><label>الاسم</label><input id="cName"></div>
      <div><label>النوع</label>
        <select id="cGender"><option>ذكر</option><option>أنثى</option></select>
      </div>
      <div><label>تاريخ الميلاد</label><input id="cBirth" type="date"></div>
      <div><label>الرقم المدني</label><input id="cCivilId"></div>
      <div><label>الوزن (كجم)</label><input id="cWeight" type="number" step="0.1"></div>
      <div><label>الطول (سم)</label><input id="cHeight" type="number" step="0.1"></div>
      <div><label>الوحدة المفضلة</label>
        <select id="cUnit"><option>mmol/L</option><option>mg/dL</option></select>
      </div>
    </div>
  </section>

  <section class="card">
    <h3 style="margin-top:0">إعدادات السكر والجرعات</h3>
    <div class="grid g2">
      <div><label>الهدف (mmol/L)</label><input id="cTarget" type="number" step="0.1"></div>
      <div><label>حد الهبوط (mmol/L)</label><input id="cLow" type="number" step="0.1"></div>
      <div><label>حد الارتفاع (mmol/L)</label><input id="cHigh" type="number" step="0.1"></div>
      <div><label>ICR (جم كارب/و. أنسولين)</label><input id="cICR" type="number" step="0.1"></div>
      <div><label>جرعة الترسيبا</label><input id="cTresiba" type="number" step="0.1"></div>
      <div><label>إجمالي الأنسولين/اليوم</label><input id="cTotalIns" type="number" step="0.1"></div>
      <div><label>معامل التصحيح (mmol/L لكل 1U)</label><input id="cCorr" type="number" step="0.1"></div>
    </div>
  </section>

  <section class="card">
    <div class="row" style="justify-content:flex-end">
      <button id="save" class="btn primary">💾 حفظ</button>
    </div>
  </section>
</main>

<script type="module">
import { auth, db, ensureAuth, requireChildIdFromQuery, loadChildProfile, setChildAvatar } from './firebase-init.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let uid=null, childId=null, child=null;

const $=s=>document.querySelector(s);

(async function boot(){
  ({uid}=await ensureAuth());
  childId=requireChildIdFromQuery();
  $('#lnkDash').href=`child-dashboard.html?child=${encodeURIComponent(childId)}`;
  $('#lnkHome').href=`dashboard.html`;

  child = await loadChildProfile(uid, childId);
  setChildAvatar($('#avatar'), child.name, child.photoURL);
  $('#kidName').textContent = child.name || '—';
  $('#kidMeta').textContent = `${child.gender||'—'} • ${child.weight??'—'} كجم • ${child.height??'—'} سم`;

  // تعبئة
  $('#cName').value   = child.name||'';
  $('#cGender').value = child.gender||'ذكر';
  $('#cBirth').value  = child.birthDate||'';
  $('#cCivilId').value= child.childCivilId||'';
  $('#cWeight').value = child.weight??'';
  $('#cHeight').value = child.height??'';
  $('#cUnit').value   = child.preferredUnit||'mmol/L';
  $('#cTarget').value = child.target??'';
  $('#cLow').value    = child.lowThreshold??'';
  $('#cHigh').value   = child.highThreshold??'';
  $('#cICR').value    = child.icr??'';
  $('#cTresiba').value= child.tresibaDose??'';
  $('#cTotalIns').value= child.totalInsulin??'';
  $('#cCorr').value   = child.correctionFactor??'';

  $('#save').addEventListener('click', save);
})();

async function save(){
  const data = {
    name: $('#cName').value.trim(),
    gender: $('#cGender').value,
    birthDate: $('#cBirth').value || null,
    childCivilId: $('#cCivilId').value.trim() || null,
    weight: $('#cWeight').value? Number($('#cWeight').value): null,
    height: $('#cHeight').value? Number($('#cHeight').value): null,
    preferredUnit: $('#cUnit').value,
    target: $('#cTarget').value? Number($('#cTarget').value): null,
    lowThreshold: $('#cLow').value? Number($('#cLow').value): null,
    highThreshold: $('#cHigh').value? Number($('#cHigh').value): null,
    icr: $('#cICR').value? Number($('#cICR').value): null,
    tresibaDose: $('#cTresiba').value? Number($('#cTresiba').value): null,
    totalInsulin: $('#cTotalIns').value? Number($('#cTotalIns').value): null,
    correctionFactor: $('#cCorr').value? Number($('#cCorr').value): null
  };
  await setDoc(doc(db,'users',uid,'children',childId), data, {merge:true});
  alert('تم الحفظ ✅');
}
</script>
</body>
</html>
