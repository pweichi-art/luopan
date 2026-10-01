'use strict';
// 農民曆：資料由 lunar.js（6tail/lunar-javascript，MIT）推算，宜忌依《協紀辨方書》。
// 程式庫輸出簡體字，用 S2T 對照表轉成繁體（表由 OpenCC 產生，並修正 丑/占/凶 三個字）。

const S2T = {"(丁亥)猪":"(丁亥)豬","(丁酉)鸡":"(丁酉)雞","(丙午)马":"(丙午)馬","(丙辰)龙":"(丙辰)龍","(乙亥)猪":"(乙亥)豬","(乙酉)鸡":"(乙酉)雞","(壬午)马":"(壬午)馬","(壬辰)龙":"(壬辰)龍","(己亥)猪":"(己亥)豬","(己酉)鸡":"(己酉)雞","(庚午)马":"(庚午)馬","(庚辰)龙":"(庚辰)龍","(戊午)马":"(戊午)馬","(戊辰)龙":"(戊辰)龍","(甲午)马":"(甲午)馬","(甲辰)龙":"(甲辰)龍","(癸亥)猪":"(癸亥)豬","(癸酉)鸡":"(癸酉)雞","(辛亥)猪":"(辛亥)豬","(辛酉)鸡":"(辛酉)雞","丁不剃头头必生疮":"丁不剃頭頭必生瘡","七夕节":"七夕節","七鸟":"七鳥","三丧":"三喪","三阴":"三陰","上巳节":"上巳節","上梁":"上樑","下元节":"下元節","不将":"不將","丑不冠带主不还乡":"丑不冠帶主不還鄉","丙不修灶必见灾殃":"丙不修灶必見災殃","东":"東","东北":"東北","东南":"東南","中元节":"中元節","中和节":"中和節","中秋节":"中秋節","临日":"臨日","乙不栽植千株不长":"乙不栽植千株不長","习艺":"習藝","五离":"五離","五虚":"五虛","五谷母节":"五穀母節","仓库厕 外正西":"倉庫廁 外正西","仓库厕 房内东":"倉庫廁 房內東","仓库床 外正东":"倉庫床 外正東","仓库床 外西北":"倉庫床 外西北","仓库栖 外东南":"倉庫棲 外東南","仓库栖 外正北":"倉庫棲 外正北","仓库炉 外西南":"倉庫爐 外西南","仓库炉 房内南":"倉庫爐 房內南","仓库碓 外东北":"倉庫碓 外東北","仓库碓 外西北":"倉庫碓 外西北","仓库门 外正南":"倉庫門 外正南","仓库门 房内北":"倉庫門 房內北","会亲友":"會親友","会龙节":"會龍節","修坟":"修墳","修门":"修門","修饰垣墙":"修飾垣牆","元宵节":"元宵節","入学":"入學","入殓":"入殮","八专":"八專","八风":"八風","八龙":"八龍","六仪":"六儀","出货财":"出貨財","分龙节":"分龍節","剑锋金":"劍鋒金","动土":"動土","勾陈":"勾陳","十成节":"十成節","午不苫盖屋主更张":"午不苫蓋屋主更張","单阴":"單陰","占大门 外东北":"占大門 外東北","占大门 外正西":"占大門 外正西","占房床 外东南":"占房床 外東南","占房床 房内北":"占房床 房內北","占碓磨 房内南":"占碓磨 房內南","占门厕 外正东":"占門廁 外正東","占门厕 外正北":"占門廁 外正北","占门床 外正南":"占門床 外正南","占门床 房内中":"占門床 房內中","占门栖 外西南":"占門棲 外西南","占门栖 房内东":"占門棲 房內東","占门炉 外东北":"占門爐 外東北","占门炉 外西北":"占門爐 外西北","占门碓 外东南":"占門碓 外東南","占门碓 房内北":"占門碓 房內北","厌对":"厭對","厨灶厕 外西南":"廚灶廁 外西南","厨灶厕 房内南":"廚灶廁 房內南","厨灶床 外东北":"廚灶床 外東北","厨灶床 外正西":"廚灶床 外正西","厨灶栖 外正东":"廚灶棲 外正東","厨灶栖 外西北":"廚灶棲 外西北","厨灶炉 外正南":"廚灶爐 外正南","厨灶炉 房内北":"廚灶爐 房內北","厨灶碓 外西南":"廚灶碓 外西南","厨灶碓 房内东":"廚灶碓 房內東","厨灶门 外东南":"廚灶門 外東南","厨灶门 外正北":"廚灶門 外正北","取渔":"取漁","合寿木":"合壽木","合帐":"合帳","启钻":"啟鑽","四击":"四擊","四废":"四廢","四离":"四離","四穷":"四窮","圣心":"聖心","地藏节":"地藏節","坏垣":"壞垣","城头土":"城頭土","塑绘":"塑繪","填仓节":"填倉節","壬不泱水更难提防":"壬不泱水更難提防","处暑":"處暑","复日":"復日","大会":"大會","大时":"大時","大败":"大敗","大驿土":"大驛土","天仓":"天倉","天医":"天醫","天愿":"天願","天穿节":"天穿節","天贶节":"天貺節","天贼":"天賊","天马":"天馬","子不问卜自惹祸殃":"子不問卜自惹禍殃","孤阳":"孤陽","安机械":"安機械","安门":"安門","宝光":"寶光","寅不祭祀神鬼不尝":"寅不祭祀神鬼不嘗","寒衣节":"寒衣節","寒食节":"寒食節","小会":"小會","小时":"小時","小满":"小滿","山头火":"山頭火","岁薄":"歲薄","己不破券二比并亡":"己不破券二比並亡","巳不远行财物伏藏":"巳不遠行財物伏藏","平治道涂":"平治道塗","庚不经络织机虚张":"庚不經絡織機虛張","开":"開","开仓":"開倉","开光":"開光","开厕":"開廁","开市":"開市","开柱眼":"開柱眼","开池":"開池","开渠":"開渠","开生坟":"開生墳","归宁":"歸寧","归岫":"歸岫","归忌":"歸忌","惊蛰":"驚蟄","房床厕 外东北":"房床廁 外東北","房床厕 外西北":"房床廁 外西北","房床栖 外正南":"房床棲 外正南","房床栖 房内中":"房床棲 房內中","房床炉 外正西":"房床爐 外正西","房床炉 房内中":"房床爐 房內中","房床碓 外正东":"房床碓 外正東","房床门 外西南":"房床門 外西南","房床门 房内西":"房床門 房內西","执":"執","扫舍":"掃舍","招摇":"招搖","挂匾":"掛匾","教牛马":"教牛馬","斋醮":"齋醮","断蚁":"斷蟻","无":"無","时德":"時德","时阳":"時陽","时阴":"時陰","春节":"春節","普护":"普護","月厌":"月厭","月虚":"月虛","未不服药毒气入肠":"未不服藥毒氣入腸","杨柳木":"楊柳木","架马":"架馬","栽种":"栽種","正东":"正東","死气":"死氣","母仓":"母倉","求医":"求醫","求财":"求財","涧下水":"澗下水","游祸":"遊禍","满":"滿","灾煞":"災煞","炉中火":"爐中火","牧养":"牧養","猪":"豬","理发":"理髮","生气":"生氣","甲不开仓财物耗散":"甲不開倉財物耗散","畋猎":"畋獵","癸不词讼理弱敌强":"癸不詞訟理弱敵強","白蜡金":"白蠟金","益后":"益後","盖屋":"蓋屋","碓磨厕 外东南":"碓磨廁 外東南","碓磨厕 房内北":"碓磨廁 房內北","碓磨床 房内东":"碓磨床 房內東","碓磨栖 外东北":"碓磨棲 外東北","碓磨栖 外正西":"碓磨棲 外正西","碓磨炉 外东南":"碓磨爐 外東南","碓磨炉 外正北":"碓磨爐 外正北","碓磨门 外正东":"碓磨門 外正東","碓磨门 外西北":"碓磨門 外西北","社日节":"社日節","离":"離","竖柱":"豎柱","端午节":"端午節","筑堤":"築堤","纯阳":"純陽","纯阴":"純陰","纳婿":"納婿","纳畜":"納畜","纳财":"納財","纳采":"納采","经络":"經絡","结网":"結網","绝阳":"絕陽","绝阴":"絕陰","续世":"續世","置产":"置產","腊八节":"臘八節","腊月":"臘月","芒种":"芒種","行丧":"行喪","补垣":"補垣","覆灯火":"覆燈火","见贵":"見貴","观莲节":"觀蓮節","触水龙":"觸水龍","订婚":"訂婚","订盟":"訂盟","词讼":"詞訟","诸事不宜":"諸事不宜","谢土":"謝土","谷日":"穀日","谷雨":"穀雨","财神节":"財神節","辛不合酱主人不尝":"辛不合醬主人不嘗","辰不哭泣必主重丧":"辰不哭泣必主重喪","进人口":"進人口","逐阵":"逐陣","造仓":"造倉","造庙":"造廟","造桥":"造橋","造车器":"造車器","酉不会客醉坐颠狂":"酉不會客醉坐顛狂","重阳节":"重陽節","金匮":"金匱","针灸":"針灸","钗钏金":"釵釧金","长流水":"長流水","闭":"閉","问名":"問名","闰三月":"閏三月","闰二月":"閏二月","闰五月":"閏五月","闰六月":"閏六月","闰冬月":"閏冬月","闰四月":"閏四月","阳德":"陽德","阳破阴冲":"陽破陰衝","阳错":"陽錯","阳错阴冲":"陽錯陰衝","阴位":"陰位","阴德":"陰德","阴神":"陰神","阴道冲阳":"陰道衝陽","阴错":"陰錯","阴阳交破":"陰陽交破","阴阳俱错":"陰陽俱錯","阴阳击冲":"陰陽擊衝","隔开日":"隔開日","雇佣":"僱傭","霹雳火":"霹靂火","青龙":"青龍","顺星节":"順星節","馀事勿取":"餘事勿取","马":"馬","驱傩日":"驅儺日","驿马":"驛馬","鸡":"雞","鸣吠":"鳴吠","鸣吠对":"鳴吠對","黄道":"黃道","龙":"龍","龙头节":"龍頭節"};
const T = s => S2T[s] ?? s;
const TA = a => a.map(T);

// 宜忌名詞白話解釋
const TERM = {
  '平治道塗':'修路、鋪路面', '餘事勿取':'除了列出的事項，其他事最好別做', '諸事不宜':'這天大事都不適合做', '無':'沒有特別適合的事',
  '訂婚':'訂婚、下聘', '嫁娶':'結婚、迎娶', '出行':'出遠門、旅遊', '求財':'求財、談生意', '開市':'開張營業、新年開工',
  '交易':'買賣、簽約成交', '安床':'安裝新床、移動床位', '祈福':'拜拜祈求福氣', '求嗣':'求子', '修造':'房屋修繕、裝潢',
  '安葬':'下葬', '造船':'造船', '乘船':'搭船', '動土':'開工挖土、蓋房子動工（陽宅）', '作灶':'安裝爐灶、改造廚房',
  '祭祀':'祭拜祖先、神明', '齋醮':'設壇做法事', '酬神':'還願謝神', '見貴':'拜訪長官、貴人', '進人口':'收養、招聘、增加家庭成員',
  '移徙':'搬家', '入宅':'搬入新家（入厝）', '開光':'神像、佛像開光點眼', '赴任':'上任、到新職位報到', '蓋屋':'蓋房子、加蓋屋頂',
  '上樑':'安裝屋頂主樑', '入殮':'遺體放入棺木', '塑繪':'雕塑或彩繪神像', '訂盟':'訂婚儀式（文定）', '納采':'提親、送聘禮',
  '出火':'暫時遷移神明、祖先牌位', '拆卸':'拆除房屋、圍牆', '造橋':'建造橋樑', '安機械':'安裝機器設備', '栽種':'種植',
  '納畜':'買入家畜、寵物', '牧養':'飼養牲畜', '除服':'脫下喪服，守喪結束', '成服':'穿上喪服', '移柩':'移動棺木',
  '破土':'為墳墓動土（陰宅，和「動土」不同）', '詞訟':'打官司、提告', '治病':'看病治療', '破屋':'拆除老舊房屋', '壞垣':'拆牆',
  '入學':'入學、拜師', '冠笄':'成年禮', '伐木':'砍樹', '起基':'打地基', '放水':'放水入池、灌溉', '開池':'挖池塘、魚池',
  '安門':'安裝大門', '理髮':'剪頭髮', '造廟':'建廟', '沐浴':'沐浴淨身', '開倉':'開倉出貨、放貸', '出貨財':'出貨、出售貨物',
  '立券':'簽契約、立合同', '納財':'收帳、進貨、存錢', '畋獵':'打獵', '補垣':'修補牆壁', '塞穴':'堵塞洞穴、防蟲鼠',
  '斷蟻':'除蟻、滅白蟻', '解除':'打掃清潔、除災解厄', '行喪':'舉行喪禮', '問名':'合八字、議親', '裁衣':'做新衣、裁製禮服',
  '會親友':'拜訪親友、聚會', '捕捉':'撲滅害蟲、捕捉', '修墳':'修理墳墓', '豎柱':'豎立柱子', '作梁':'製作屋樑',
  '開柱眼':'鑿柱子孔洞', '架馬':'架設木工架', '造畜稠':'建造畜舍', '掘井':'挖井', '謝土':'建築完工後祭謝土地神',
  '啟鑽':'撿骨、開墳取骨', '立碑':'立墓碑', '教牛馬':'訓練牲畜', '求醫':'看醫生', '安香':'安置神位、祖先牌位',
  '掃舍':'大掃除', '掛匾':'掛招牌、匾額', '開生墳':'生前預先造墳', '合壽木':'預先做棺木', '探病':'探望病人',
  '習藝':'學習技藝', '經絡':'織布、紡紗', '結網':'編織漁網', '安碓磑':'安裝石臼、石磨', '造倉':'建造倉庫',
  '合帳':'做蚊帳、帳幕', '修飾垣牆':'粉刷、修飾牆面', '納婿':'招贅', '造車器':'製造車輛器具', '合脊':'屋頂合脊（蓋屋頂最後一步）',
  '置產':'買房、購置產業', '取漁':'捕魚', '針灸':'針灸治療', '開渠':'挖水溝', '分居':'分家', '定磉':'安放柱子底下的石墩',
  '雕刻':'雕刻', '開廁':'建造廁所', '整手足甲':'修剪手腳指甲', '築堤':'築堤防', '普渡':'普渡、超渡', '歸岫':'歸家安置',
  '僱傭':'僱人、應徵', '割蜜':'採蜂蜜', '歸寧':'回娘家', '修門':'修理門戶',
};

// 擇日可選的活動：[程式庫用詞, 白話]
const PICK = [
  ['入宅','搬入新家'], ['移徙','搬家'], ['安床','安床'], ['動土','動土'], ['修造','裝潢修繕'], ['安門','安裝大門'],
  ['嫁娶','結婚'], ['訂盟','訂婚'], ['納采','提親'], ['開市','開業開工'], ['交易','簽約買賣'], ['立券','簽合約'],
  ['納財','收帳進財'], ['置產','買房置產'], ['出行','出遠門'], ['祭祀','祭拜'], ['祈福','祈福'], ['安香','安神位'],
  ['求醫','看醫生'], ['理髮','剪頭髮'], ['入學','入學拜師'], ['掃舍','大掃除'],
];

const ZODIAC = ['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'];
const MONTH = ['','正','二','三','四','五','六','七','八','九','十','十一','十二'];
const WEEK = '日一二三四五六';
const HOUR_RANGE = ['23–01','01–03','03–05','05–07','07–09','09–11','11–13','13–15','15–17','17–19','19–21','21–23'];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));

// ---------- 日期工具 ----------
const today0 = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const sameDay = (a, b) => ymd(a) === ymd(b);
const lunarOf = d => Solar.fromYmd(d.getFullYear(), d.getMonth() + 1, d.getDate()).getLunar();
function lunarDateText(l) {
  const m = l.getMonth();
  return `${m < 0 ? '閏' : ''}${MONTH[Math.abs(m)]}月${T(l.getDayInChinese())}`;
}
function chongText(desc, sha) {                   // "(壬寅)虎" → 沖虎（壬寅）煞南
  const m = /\((..)\)(.)/.exec(desc);
  return m ? `沖${m[2]}（${m[1]}）煞${sha}` : `沖${desc} 煞${sha}`;
}
const guaDeg = code => { const i = GUA.findIndex(g => g.n === T(code)); return i < 0 ? null : i * 45; };

// ---------- 每日 ----------
let almDate = today0();
const SHEN_COLOR = { '財神': 'var(--gold)', '喜神': 'var(--accent)', '福神': 'var(--good)' };

function renderDay() {
  const d = almDate, l = lunarOf(d), box = $('almDay');
  const isToday = sameDay(d, today0());

  // 節氣、節日
  const tags = [];
  const tsType = T(l.getDayTianShenType());
  tags.push(`<span class="pill ${tsType === '黃道' ? 'good' : 'bad'}">${T(l.getDayTianShen())}・${tsType}</span>`);
  tags.push(`<span class="pill">${T(l.getZhiXing())}日</span>`);
  const jq = l.getJieQi();
  if (jq) tags.push(`<span class="pill warn">${T(jq)}</span>`);
  TA(l.getFestivals()).forEach(f => tags.push(`<span class="pill lock">${esc(f)}</span>`));

  const prev = l.getPrevJieQi(true), next = l.getNextJieQi(true);
  const nextSolar = next.getSolar();
  const jqLine = jq ? `今天${T(jq)}` :
    `${T(prev.getName())}後｜下個節氣：${T(next.getName())} ${nextSolar.getMonth()}/${nextSolar.getDay()}`;

  // 吉神方位
  const shens = [
    ['財神', l.getDayPositionCai(), l.getDayPositionCaiDesc()],
    ['喜神', l.getDayPositionXi(), l.getDayPositionXiDesc()],
    ['福神', l.getDayPositionFu(), l.getDayPositionFuDesc()],
  ].map(([n, code, desc]) => ({ n, deg: guaDeg(code), desc: T(desc) }));

  const yi = TA(l.getDayYi()), ji = TA(l.getDayJi());
  const termBtns = arr => arr.map(t => `<button class="term" data-term="${esc(t)}">${esc(t)}</button>`).join('');

  // 時辰（取前 12 個：子時算 23–01）
  const times = l.getTimes().slice(0, 12);
  const nowIdx = isToday ? Math.floor((new Date().getHours() + 1) / 2) % 12 : -1;
  const hours = times.map((t, i) => {
    const luck = T(t.getTianShenLuck());
    return `<button class="hour ${luck === '吉' ? 'good' : 'bad'} ${i === nowIdx ? 'now' : ''}" data-h="${i}">
      <b>${T(t.getZhi())}・${luck}</b><div>${HOUR_RANGE[i]}</div></button>`;
  }).join('');

  box.innerHTML = `
    <div class="datebar">
      <button class="nav" id="dPrev" aria-label="前一天">‹</button>
      <input type="date" id="dPick" value="${ymd(d)}">
      <button class="nav" id="dNext" aria-label="後一天">›</button>
      ${isToday ? '' : '<button class="chip" id="dToday">今天</button>'}
    </div>
    <div class="card" id="dayCard">
      <div class="dayhead">
        <div class="big">${d.getDate()}<small>${d.getMonth() + 1}月・星期${WEEK[d.getDay()]}</small></div>
        <div class="lun">
          <b>農曆${lunarDateText(l)}</b>
          <div>${l.getYearInGanZhi()}年 ${l.getMonthInGanZhiExact()}月 ${l.getDayInGanZhi()}日・屬${T(l.getYearShengXiao())}</div>
          <div>${jqLine}</div>
        </div>
      </div>
      <div class="tags">${tags.join('')}</div>
      <div class="yj"><div class="k yi">宜</div><div class="terms">${termBtns(yi)}</div></div>
      <div class="yj"><div class="k ji">忌</div><div class="terms">${termBtns(ji)}</div></div>
      <p class="muted" style="margin-top:10px">點詞彙可以看白話解釋。左右滑動可切換日期。</p>
    </div>

    <h2>吉神方位</h2>
    <div class="card">
      <div class="shen3">${shens.map(s => `
        <div ${s.deg == null ? '' : `data-live-deg="${s.deg}"`}>
          <svg viewBox="-24 -24 48 48"><circle r="22" fill="none" stroke="var(--line)"/>
            <g class="arr"><path d="M0 -19 L6 -4 L1.5 -6 L1.5 14 L-1.5 14 L-1.5 -6 L-6 -4 Z" fill="${SHEN_COLOR[s.n]}"/></g></svg>
          <b style="color:${SHEN_COLOR[s.n]}">${s.n}</b>${esc(s.desc)}
          <div class="livetxt">${isToday ? '' : '（箭頭依目前手機方向）'}</div>
        </div>`).join('')}
      </div>
      <div class="row"><button class="btn" id="shenOnDial">在羅盤上顯示</button></div>
      <p class="muted">財神求財、喜神求喜事、福神求平安。方位以「人」為中心，出門或擺放物品時朝這個方向。</p>
    </div>

    <h2>今日沖煞與禁忌</h2>
    <div class="card">
      <dl class="kv">
        <dt>沖煞</dt><dd>${chongText(T(l.getDayChongDesc()), T(l.getDaySha()))}<div class="muted">屬${T(l.getDayChongShengXiao())}的人今天避免做大事；「煞」方位不宜動土</div></dd>
        <dt>彭祖百忌</dt><dd>${T(l.getPengZuGan())}<br>${T(l.getPengZuZhi())}</dd>
        <dt>胎神</dt><dd>${T(l.getDayPositionTai())}<div class="muted">家有孕婦，這個位置不宜敲打、搬動</div></dd>
        <dt>五行</dt><dd>${T(l.getDayNaYin())}</dd>
        <dt>吉神宜趨</dt><dd>${TA(l.getDayJiShen()).join(' ')}</dd>
        <dt>凶神宜忌</dt><dd>${TA(l.getDayXiongSha()).join(' ')}</dd>
      </dl>
    </div>

    <h2>時辰吉凶</h2>
    <div class="card">
      <div class="hours">${hours}</div>
      <p class="muted" style="margin-top:8px">點時辰看宜忌與沖煞${isToday ? '，紅框是現在的時辰' : ''}。</p>
    </div>
    <p class="muted">宜忌依《協紀辨方書》推算，各家農民曆可能略有出入，參考就好。</p>`;

  // 羅盤上的吉神標記跟著目前選的日期
  setShen(shens.filter(s => s.deg != null).map(s => ({ t: s.n[0], deg: s.deg, color: SHEN_COLOR[s.n] })));

  $('dPrev').onclick = () => setDate(addDays(almDate, -1));
  $('dNext').onclick = () => setDate(addDays(almDate, 1));
  $('dPick').onchange = e => { const v = e.target.value; if (v) { const [y, m, dd] = v.split('-').map(Number); setDate(new Date(y, m - 1, dd)); } };
  if ($('dToday')) $('dToday').onclick = () => setDate(today0());
  $('shenOnDial').onclick = () => { showShen(true); go('compass'); };
  box.querySelectorAll('.term').forEach(b => b.onclick = () => {
    const t = b.dataset.term;
    showInfo(t, `<p>${esc(TERM[t] || '傳統農民曆用語')}</p>`);
  });
  box.querySelectorAll('.hour').forEach(b => b.onclick = () => {
    const t = times[+b.dataset.h];
    const y = TA(t.getYi()), j = TA(t.getJi());
    showInfo(`${T(t.getZhi())}時（${HOUR_RANGE[+b.dataset.h]}）・${t.getGanZhi()}`, `
      <dl class="kv">
        <dt>吉凶</dt><dd>${T(t.getTianShen())}・${T(t.getTianShenLuck())}</dd>
        <dt>沖煞</dt><dd>${chongText(T(t.getChongDesc()), T(t.getSha()))}</dd>
        <dt>宜</dt><dd>${y.join(' ')}</dd>
        <dt>忌</dt><dd>${j.join(' ')}</dd>
      </dl>`);
  });

  // 左右滑動換日
  const card = $('dayCard');
  let sx = null, sy = null;
  card.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  card.addEventListener('touchend', e => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) setDate(addDays(almDate, dx < 0 ? 1 : -1));
  });
}
function setDate(d) { almDate = d; renderDay(); }

// ---------- 擇日 ----------
function renderPickForm() {
  const box = $('almPick');
  box.innerHTML = `
    <div class="card">
      <p class="muted" style="margin-top:0">想做什麼事？</p>
      <div class="terms" id="pkAct">${PICK.map(([k, v], i) =>
        `<button class="chip ${i === 0 ? 'on' : ''}" data-k="${k}">${v === k ? k : `${v}`}</button>`).join('')}</div>
      <div class="formrow">
        <label for="pkRange">範圍</label>
        <select id="pkRange"><option value="30">未來 30 天</option><option value="60" selected>未來 60 天</option><option value="90">未來 90 天</option><option value="180">未來 180 天</option></select>
      </div>
      <div class="formrow">
        <label for="pkZod">避開沖到這個生肖</label>
        <select id="pkZod"><option value="">不限</option>${ZODIAC.map(z => `<option>${z}</option>`).join('')}</select>
      </div>
      <div class="formrow">
        <label><input type="checkbox" id="pkHd"> 只看黃道吉日</label>
        <label><input type="checkbox" id="pkWk"> 只看週末</label>
      </div>
      <div class="row"><button class="btn primary" id="pkGo">找好日子</button></div>
    </div>
    <h2 id="pkTitle" style="display:none"></h2>
    <div class="card" id="pkRes" style="display:none"></div>
    <p class="muted">條件：當天「宜」有這件事、且「忌」沒有。屬相建議填家中主事者（例如搬家填屋主）的生肖。</p>`;
  box.querySelectorAll('#pkAct .chip').forEach(c => c.onclick = () => {
    box.querySelectorAll('#pkAct .chip').forEach(x => x.classList.toggle('on', x === c));
  });
  $('pkGo').onclick = runPick;
}
function runPick() {
  const act = $('almPick').querySelector('#pkAct .chip.on').dataset.k;
  const label = PICK.find(p => p[0] === act)[1];
  const days = +$('pkRange').value, zod = $('pkZod').value, onlyHd = $('pkHd').checked, onlyWk = $('pkWk').checked;
  const res = [];
  const start = today0();
  for (let i = 0; i < days; i++) {
    const d = addDays(start, i);
    if (onlyWk && d.getDay() !== 0 && d.getDay() !== 6) continue;
    const l = lunarOf(d);
    const yi = TA(l.getDayYi()), ji = TA(l.getDayJi());
    if (!yi.includes(act) || ji.includes(act)) continue;
    const chong = T(l.getDayChongShengXiao());
    if (zod && chong === zod) continue;
    const hd = T(l.getDayTianShenType());
    if (onlyHd && hd !== '黃道') continue;
    res.push({ d, l, chong, hd });
  }
  $('pkTitle').style.display = '';
  $('pkTitle').textContent = `適合「${label}」的日子：${res.length} 天`;
  const box = $('pkRes');
  box.style.display = '';
  if (!res.length) { box.innerHTML = '<p class="muted">這段期間沒有符合的日子，試試放寬範圍或條件。</p>'; return; }
  box.innerHTML = res.map((r, i) => {
    const wk = r.d.getDay() === 0 || r.d.getDay() === 6;
    return `<button class="res ${wk ? 'wk' : ''}" data-i="${i}">
      <div class="d">${r.d.getMonth() + 1}/${r.d.getDate()}<small>星期${WEEK[r.d.getDay()]}</small></div>
      <div class="i"><b>農曆${lunarDateText(r.l)}・${T(r.l.getZhiXing())}日</b><br>${T(r.l.getDayTianShen())}${r.hd}・沖${r.chong}</div>
    </button>`;
  }).join('');
  box.querySelectorAll('.res').forEach(b => b.onclick = () => {
    showSeg('day'); setDate(res[+b.dataset.i].d); scrollTo(0, 0);
  });
}

// ---------- 切換 ----------
function showSeg(v) {
  document.querySelectorAll('#almSeg button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  $('almDay').style.display = v === 'day' ? '' : 'none';
  $('almPick').style.display = v === 'pick' ? '' : 'none';
}
document.querySelectorAll('#almSeg button').forEach(b => b.onclick = () => showSeg(b.dataset.v));

let almInit = false;
window.almanacShow = function () {
  if (!almInit) { almInit = true; renderPickForm(); }
  renderDay();
};
// 開 App 就先算好今天的吉神，羅盤頁的「吉神方位」開關才有東西
try { renderDay(); } catch (e) { console.error(e); }
