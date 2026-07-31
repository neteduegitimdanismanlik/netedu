// app/rubrics/topic-rules.ts
//
// Topic Finder'ın kural verisi. KOD DEĞİL VERİ.
// Yeni bir çerçeve (A-Level, AP) eklemek = buraya yeni bir TopicRuleSet girdisi.
//
// Kaynak: IB Mathematics AA teacher support material (TSM) — "Choosing a topic",
// "Frequently asked questions about the IA", kriter açıklamaları.
// KURAL: IB'nin cümleleri kopyalanmaz. Aşağıdaki metinler kaynaktan çıkarılan
// olgu ve kısıtların kendi ifademizle yazılmış halidir.
//
// ÜRÜNE KONMAYAN: TSM appendix'indeki ~200 örnek IA başlığı. Sadece kategori
// adları alındı. (Not: o başlıklar "çeşitli notlar almış" işlerden derlenmiş,
// yani kalite sinyali taşımıyor — telif dışında da koymaya değmezdi.)

export type TopicVerdict = 'strong' | 'workable' | 'risky' | 'unworkable';

export type RuleSeverity = 'fatal' | 'major' | 'minor';

export interface TopicRule {
  /** Modelin döndürdüğü id. UI bu id ile etiketi buluyor. */
  id: string;
  label: string;
  /** Modele giden açıklama. Kuralın ne zaman tetiklendiği. */
  detail: string;
  severity: RuleSeverity;
  /** Hangi kriteri vurduğu — rapor "neden" diyebilsin diye. */
  hits?: string[];
}

export interface TopicContext {
  id: string;
  label: string;
  /** Öğrenciye gösterilen kısa açıklama. */
  hint: string;
}

export interface TopicRuleSet {
  rubricId: string;
  label: string;
  /** Öğrenciye "hangi alandan" diye sorulacak bağlam listesi. */
  contexts: TopicContext[];
  rules: TopicRule[];
  /** SL/HL farkı. Anahtar `level` değeriyle eşleşiyor. */
  levelNotes?: Record<string, string>;
  titleGuidance: string[];
  dataGuidance: string[];
  /** Aracın sınırı — prompt'a ve UI'a giriyor. */
  scopeNote: string;
}

/* ------------------------------------------------------------------ */
/* IB Mathematics IA (AA / AI, SL + HL)                                */
/* ------------------------------------------------------------------ */

/**
 * TSM appendix'inin kategori başlıkları. ONU (10) — geçen sürümde 7 vardı,
 * People / Sport and leisure / Travel and transport eksikti.
 */
const IB_MATHS_CONTEXTS: TopicContext[] = [
  {
    id: 'aesthetics',
    label: 'Estetik ve tasarım',
    hint: 'Oran, simetri, mimari biçim, renk, görsel algı',
  },
  {
    id: 'business-finance',
    label: 'İş ve finans',
    hint: 'Fiyatlama, faiz, risk, optimizasyon, kaynak dağıtımı',
  },
  {
    id: 'food-drink',
    label: 'Yiyecek ve içecek',
    hint: 'Tarif ölçekleme, ısı transferi, paketleme hacmi, tüketim',
  },
  {
    id: 'health-fitness',
    label: 'Sağlık ve form',
    hint: 'Antrenman yükü, büyüme eğrileri, doz, epidemiyoloji',
  },
  {
    id: 'geometry-trigonometry',
    label: 'Geometri ve trigonometri',
    hint: 'Eğri uydurma, döşeme, izdüşüm, üç boyutlu biçim',
  },
  {
    id: 'nature-resources',
    label: 'Doğa ve doğal kaynaklar',
    hint: 'Popülasyon, iklim serisi, su, enerji, biyolojik desen',
  },
  {
    id: 'number',
    label: 'Sayı',
    hint: 'Diziler, asallar, modüler aritmetik, sayı desenleri',
  },
  {
    id: 'people',
    label: 'İnsan ve toplum',
    hint: 'Nüfus, seçim sistemleri, dil, davranış, anket verisi',
  },
  {
    id: 'sport-leisure',
    label: 'Spor ve boş zaman',
    hint: 'Performans istatistiği, oyun teorisi, hareket, şans oyunları',
  },
  {
    id: 'travel-transport',
    label: 'Seyahat ve ulaşım',
    hint: 'Rota, trafik akışı, zaman çizelgesi, yakıt, navigasyon',
  },
];

const IB_MATHS_RULES: TopicRule[] = [
  {
    id: 'prior-learning-only',
    label: 'Matematik ders seviyesinin altında',
    detail:
      'Kullanılacak matematik tamamen DP öncesi seviyede kalıyorsa (ortalama, yüzde, ' +
      'basit oran, sütun grafiği) konu kriter E\'de tavana çarpar. Kullanılan matematiğin ' +
      'ders müfredatıyla aynı seviyede olması bekleniyor. Fikir yalnızca betimleyici ' +
      'istatistik içeriyorsa bu kural tetiklenir.',
    severity: 'fatal',
    hits: ['E'],
  },
  {
    id: 'descriptive-or-historical',
    label: 'Salt betimleyici veya tarihsel',
    detail:
      'Konu bir matematikçinin hayatını, bir teoremin tarihini veya bir alanı anlatmakla ' +
      'yetiniyorsa kriterler uygulanamaz. Öğrencinin kendi yaptığı bir matematiksel iş ' +
      'olmalı; anlatılan bir matematik değil.',
    severity: 'fatal',
    hits: ['C', 'D', 'E'],
  },
  {
    id: 'complexity-for-show',
    label: 'Gösteriş için karmaşıklık',
    detail:
      'Basit matematiğin yeteceği bir yerde ağır makine kullanmak konuyu güçlendirmez; ' +
      'kullanılan matematiğin işi ilerletmesi gerekir. Fikir "zor görünsün" diye seçilmiş ' +
      'bir yöntem içeriyorsa bu kural tetiklenir. Az şeyi iyi yapmak, çok şeyi yarım ' +
      'yapmaktan iyidir.',
    severity: 'major',
    hits: ['E'],
  },
  {
    id: 'scope-too-broad',
    label: 'Kapsam çok geniş',
    detail:
      'Birden fazla bağımsız soruyu aynı anda kovalayan fikirler 12-20 sayfada ' +
      'derinleşemez. Tek bir iyi tanımlanmış amaç gerekir. "X\'i inceleyeceğim" ' +
      'biçimindeki fikirler genelde buraya düşer.',
    severity: 'major',
    hits: ['A', 'E'],
  },
  {
    id: 'data-insufficient',
    label: 'Veri tekniği taşımıyor',
    detail:
      'Veri kullanılacaksa, seçilen tekniğin geçerli olmasına yetecek kadar veri ' +
      'üretilebilmeli. Küçük örneklem üzerine regresyon veya hipotez testi kurmak ' +
      'sonucu geçersiz kılar. Veri kaynağı ve büyüklüğü baştan belli değilse tetiklenir.',
    severity: 'major',
    hits: ['E', 'D'],
  },
  {
    id: 'data-reused',
    label: 'Veri başka DP işinden geliyor',
    detail:
      'EE, fen IA\'sı veya saha çalışmasında toplanmış verinin yeniden kullanımı ' +
      'önerilmiyor. Aynı veri ancak tamamen farklı bir biçimde analiz edilirse ve ' +
      'öğretmen bilgilendirilirse kullanılabilir.',
    severity: 'minor',
  },
  {
    id: 'no-personal-hook',
    label: 'Kişisel bağ yok',
    detail:
      'Konu başkasının kurduğu bir problemin çözümüyse kriter C zayıf kalır. ' +
      'Öğrencinin işi kendine mal ettiğini gösteren bir giriş noktası gerekiyor: ' +
      'kendi sorusu, kendi verisi, kendi bağlamı.',
    severity: 'major',
    hits: ['C'],
  },
  {
    id: 'title-is-stimulus',
    label: 'Başlık sadece tetikleyici kelime',
    detail:
      'Başlık "Sayı desenleri" gibi çıplak bir alan adıysa işin nereye gittiğini ' +
      'göstermiyor. Başlık, tetikleyiciden hareketle varılan asıl soruyu söylemeli.',
    severity: 'minor',
    hits: ['A'],
  },
  {
    id: 'audience-mismatch',
    label: 'Hedef kitle akran değil',
    detail:
      'Metin sınıf arkadaşlarının okuyabileceği bir seviyede olmalı. Fikir ancak ' +
      'uzman bir okurun takip edebileceği bir alandaysa iletişim kriteri zorlanır.',
    severity: 'minor',
    hits: ['B'],
  },
  {
    id: 'outside-syllabus-drift',
    label: 'Müfredat dışına sapma',
    detail:
      'Müfredat dışı matematik tam puan için gerekli değil. Kullanılacaksa seviyesi ' +
      'müfredatla karşılaştırılabilir olmalı ve açıklanıp kaynak gösterilmeli. ' +
      'Fikir yalnızca "ileri konu" olduğu için seçilmişse tetiklenir.',
    severity: 'minor',
    hits: ['E'],
  },
  {
    id: 'technology-substitution',
    label: 'Yazılıma girdi girmek',
    detail:
      'Değerleri bir formüle veya yazılıma girip çıktıyı raporlamak anlayış ' +
      'göstermez. Teknoloji serbest ama sonucun neden o sonuç olduğu gösterilmeli.',
    severity: 'minor',
    hits: ['E'],
  },
  {
    id: 'interpretation-deferred',
    label: 'Yorum sona bırakılmış',
    detail:
      'Sonuçlar üretildikleri yerde yorumlanmalı, sonuç bölümünde toparlanmalı. ' +
      'Plan tüm yorumu en sona yığıyorsa iletişim ve yansıtma zayıflar.',
    severity: 'minor',
    hits: ['B', 'D'],
  },
  {
    id: 'repetition-padding',
    label: 'Tekrarla şişirme',
    detail:
      'Aynı hesabı farklı sayılarla defalarca yapmak uzunluk katar, puan katmaz. ' +
      'Özlülük eksikliği cezalandırılıyor. Fikrin planı "10 farklı örnek için ' +
      'tekrarlayacağım" ise tetiklenir.',
    severity: 'minor',
    hits: ['A'],
  },
  {
    id: 'class-duplicate-risk',
    label: 'Sınıfla çakışma riski',
    detail:
      'Aynı başlık serbest ama iki öğrencinin matematiği aynı olamaz. Çok yaygın ' +
      'bir kalıp seçildiyse (ör. altın oran ölçümü, basketbol atış açısı) ayrışma ' +
      'noktası baştan belirlenmeli.',
    severity: 'minor',
  },
];

const IB_MATHS_LEVEL_NOTES: Record<string, string> = {
  SL:
    'SL\'de en üst seviye için matematiğin müfredat seviyesinde, ilgili ve doğru olması ' +
    've anlayışın gösterilmesi yeterli. Egzotik konu gerekmiyor. Bu yüzden SL için ' +
    'sade ama iyi kurulmuş bir fikir "strong" olabilir.',
  HL:
    'HL\'de en üst seviye ayrıca sofistikasyon ve rigor istiyor: ya HL müfredatı ' +
    'seviyesinde matematik, ya da SL matematiğinin bir SL öğrencisinden beklenmeyecek ' +
    'karmaşıklıkta kullanımı; ayrıca iddiaların gerekçelendirilmesi. Rutin bir SL ' +
    'işlemesi HL\'de tavana çarpar — SL\'de "strong" olan fikir HL\'de "workable" olabilir.',
};

const IB_MATHS_RULESET: TopicRuleSet = {
  rubricId: 'ib-ia-maths',
  label: 'IB Matematik IA (Exploration)',
  contexts: IB_MATHS_CONTEXTS,
  rules: IB_MATHS_RULES,
  levelNotes: IB_MATHS_LEVEL_NOTES,
  titleGuidance: [
    'Başlık alanı değil soruyu söylemeli.',
    'Tetikleyici kelime başlık değildir; başlık o kelimeden nereye gidildiğini gösterir.',
    'Tek cümle, tek amaç.',
  ],
  dataGuidance: [
    'Veri nereden gelecek, kaç gözlem olacak, bu teknik için yeter mi — üçü de baştan belli olmalı.',
    'İkincil veri kullanılıyorsa kaynak ve örnekleme yöntemi belirtilmeli.',
    'Başka bir DP işi için toplanmış veri yeniden kullanılmamalı.',
  ],
  scopeNote:
    'Bu araç IA yazmaz. Konu önerir ve eler. Çıktı, öğrencinin öğretmeniyle ' +
    'konuşmaya götüreceği bir kısa listedir.',
};

/* ------------------------------------------------------------------ */
/* Kayıt                                                               */
/* ------------------------------------------------------------------ */

const TOPIC_RULE_SETS: TopicRuleSet[] = [IB_MATHS_RULESET];

/** Rubriği olan konu kural setleri. UI seçim listesini buradan kuruyor. */
export function listTopicRuleSets(): TopicRuleSet[] {
  return TOPIC_RULE_SETS;
}

export function getTopicRules(rubricId: string): TopicRuleSet | undefined {
  return TOPIC_RULE_SETS.find((s) => s.rubricId === rubricId);
}

export function hasTopicRules(rubricId: string): boolean {
  return TOPIC_RULE_SETS.some((s) => s.rubricId === rubricId);
}

export function getRule(rubricId: string, ruleId: string): TopicRule | undefined {
  return getTopicRules(rubricId)?.rules.find((r) => r.id === ruleId);
}

/** Seviye seçimi gereken kural setleri. */
export function topicRulesNeedLevel(rubricId: string): boolean {
  const set = getTopicRules(rubricId);
  return Boolean(set?.levelNotes && Object.keys(set.levelNotes).length > 0);
}

export const VERDICT_LABELS: Record<TopicVerdict, string> = {
  strong: 'Güçlü',
  workable: 'Çalışılabilir',
  risky: 'Riskli',
  unworkable: 'Yürümez',
};

export const VERDICT_DESCRIPTIONS: Record<TopicVerdict, string> = {
  strong: 'Fikir kurulmuş. Kriterlerin hepsine tutunacak yer var.',
  workable: 'Yürür, ama en az bir yerde daraltma veya güçlendirme gerekiyor.',
  risky: 'Ciddi bir açık var. Düzeltilmezse çalışılan saatler boşa gider.',
  unworkable: 'Bu haliyle kriterler uygulanamaz. Fikir değişmeli.',
};

/** Rapor metnini prompt'a çevirirken kullanılan sıralama. */
export const SEVERITY_ORDER: Record<RuleSeverity, number> = {
  fatal: 0,
  major: 1,
  minor: 2,
};