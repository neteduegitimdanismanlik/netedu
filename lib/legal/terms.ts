import { LEGAL, type Lang, type LegalDocument } from './types'
import { MIN_AGE } from '../consent-shared'
import { PRO_MONTHLY_USD, PRO_ANNUAL_USD } from '../billing-config'

const { controller, email } = LEGAL

const tr: LegalDocument = {
  title: 'Kullanım Koşulları',
  sections: [
    {
      title: '1. Hizmet',
      body: [
        `NetEdu, ${controller} tarafından sunulan; öğrencilere üniversite başvurusu, CAS ve portfolyo planlaması ile IB ödevleri için yapay zekâ destekli rehberlik ve geri bildirim veren bir platformdur. Hesap oluşturarak bu koşulları kabul etmiş ve Aydınlatma Metni'ni okumuş olursun.`,
      ],
    },
    {
      title: '2. Kimler kullanabilir',
      body: [
        `NetEdu'yu ${MIN_AGE} yaşından küçükler kullanamaz. 18 yaşından küçüksen ödev yükleme ve yapay zekâ geri bildirimi için velinin onayı gerekir.`,
        'Kayıtta verdiğin bilgilerin, özellikle doğum tarihinin ve velinin e-posta adresinin doğru olmasından sen sorumlusun. Hesabını başkasıyla paylaşamazsın.',
      ],
    },
    {
      title: '3. Yapay zekâ geri bildiriminin sınırları',
      body: [
        'Geri bildirimler, puan tahminleri, konu önerileri, roadmap ve üniversite eşleşmeleri otomatik üretilir ve hata içerebilir. Bunlar resmî IB puanı değildir; öğretmeninin, IB koordinatörünün ya da sınav görevlisinin değerlendirmesinin yerini tutmaz.',
        'Üniversite şartları resmî kaynaklardan derlenir, ancak üniversiteler şartlarını değiştirebilir. Başvurmadan önce güncel şartları üniversitenin kendi sayfasından doğrula.',
        'NetEdu herhangi bir notu, puanı ya da üniversite kabulünü garanti etmez.',
      ],
    },
    {
      title: '4. Akademik dürüstlük',
      body: [
        'NetEdu senin yerine ödev yazmaz; senin yazdığın metne geri bildirim verir. Teslim ettiğin her çalışmanın sana ait olması ve okulunun ve IB\'nin akademik dürüstlük kurallarına uyması senin sorumluluğundadır.',
        'IB ve pek çok okul, yapay zekâ araçlarından alınan desteğin belirtilmesini ister. Okulunun kurallarını kontrol et ve gerekiyorsa NetEdu\'dan geri bildirim aldığını öğretmenine bildir.',
      ],
    },
    {
      title: '5. Yüklediğin içerik',
      body: [
        'Yüklediğin metinler ve dosyalar sana aittir. Bize yalnızca hizmeti sunmak için gereken sınırlı bir kullanım izni verirsin: içeriğini saklamak, işlemek ve sana geri bildirim üretmek. İçeriğinin hizmet geliştirmede kullanılması yalnızca ayrıca açık rıza vermen halinde mümkündür.',
        'Başkasına ait bir çalışmayı ya da başkalarının kişisel verilerini içeren içeriği, gerekli izinler olmadan yükleyemezsin.',
      ],
    },
    {
      title: '6. CAS işbirliği ve diğer öğrencilerle iletişim',
      body: [
        'CAS proje sohbetlerinde saygılı ol. Taciz, zorbalık, nefret söylemi, cinsel içerik ve reklam yasaktır.',
        'Telefon numarası, e-posta ya da sosyal medya hesabı paylaşmadan önce iki kez düşün: NetEdu dışına taşınan konuşmaları göremez, denetleyemez ve bir sorun çıktığında yardımcı olamayız. Böyle görünen mesajlar gönderilmeden önce uyarı gösterilir ve incelenmek üzere işaretlenir.',
        'Uygunsuz bir mesajı "Bildir" düğmesiyle bize iletebilirsin.',
      ],
    },
    {
      title: '7. Yasak kullanımlar',
      body: [
        'Sistemi otomatik araçlarla zorlamak, kullanım limitlerini aşmaya çalışmak, başkalarının hesaplarına ya da verilerine erişmeye çalışmak, güvenlik önlemlerini aşmak, hizmeti başkalarına ödev yazmak ya da ticari amaçla yeniden satmak için kullanmak yasaktır. Bu durumlarda hesabın askıya alınabilir ya da kapatılabilir.',
      ],
    },
    {
      title: '8. Ücretsiz ve Pro plan',
      body: [
        'Ücretsiz plan, fiyatlandırma sayfasında belirtilen özelliklerle sınırlıdır. Pro plan bazı özelliklerde makul kullanım için günlük limitler içerir.',
        `Pro planın liste fiyatı aylık ${PRO_MONTHLY_USD} ABD doları ya da yıllık ${PRO_ANNUAL_USD} ABD dolarıdır. Türkiye'de çıkarılmış kartlarla ödemeler, mevzuat gereği Türk lirası karşılığı üzerinden alınır.`,
        'Abonelik, iptal edilene kadar her dönem sonunda otomatik yenilenir. İstediğin zaman iptal edebilirsin; iptal, içinde bulunulan dönemin sonunda geçerli olur.',
        'Satın almadan önce fiyat, kapsam, yenileme ve cayma hakkına ilişkin bilgiler, mesafeli sözleşmeler mevzuatı uyarınca ayrıca gösterilir. Hizmetin, onayınla cayma süresi içinde ifasına başlanması halinde cayma hakkı, mevzuatın öngördüğü ölçüde sona erebilir.',
      ],
    },
    {
      title: '9. Hesabın kapatılması',
      body: [
        `Hesabını istediğin zaman ${email} adresine yazarak kapattırabilirsin. Hesap kapatıldığında içeriklerin Aydınlatma Metni'nde belirtilen süre içinde silinir.`,
        'Bu koşulları ağır şekilde ihlal eden hesapları kapatabiliriz.',
      ],
    },
    {
      title: '10. Sorumluluk',
      body: [
        'Hizmeti kesintisiz ve hatasız sunmak için makul çabayı gösteririz, ancak bunu garanti edemeyiz. Kanunen izin verilen ölçüde, geri bildirimlere dayanarak verdiğin kararlardan doğan dolaylı zararlardan sorumlu değiliz. Kasıt ve ağır kusurdan doğan sorumluluğumuz ile tüketici mevzuatından doğan hakların saklıdır.',
      ],
    },
    {
      title: '11. Marka bildirimi',
      body: [
        "International Baccalaureate®, IB® ve ilgili adlar International Baccalaureate Organization'ın tescilli markalarıdır. NetEdu, IB ile bağlantılı değildir; IB tarafından onaylanmamış ya da desteklenmemiştir.",
      ],
    },
    {
      title: '12. Değişiklikler, uygulanacak hukuk',
      body: [
        'Bu koşullarda önemli bir değişiklik yaptığımızda seni bilgilendirir ve bir sonraki girişinde yeni metni onayına sunarız.',
        'Bu koşullara Türk hukuku uygulanır. Tüketici işlemlerinden doğan uyuşmazlıklarda, parasal sınırlar dahilinde Tüketici Hakem Heyetleri, bunun üzerinde Tüketici Mahkemeleri yetkilidir. Türkçe ve İngilizce metinler arasında farklılık olması halinde Türkçe metin esas alınır.',
        `Sorularını ${email} adresine iletebilirsin.`,
      ],
    },
  ],
}

const en: LegalDocument = {
  title: 'Terms of Use',
  sections: [
    {
      title: '1. The service',
      body: [
        `NetEdu is provided by ${controller}. It gives students AI-assisted guidance and feedback for university applications, CAS and portfolio planning, and IB coursework. By creating an account you accept these terms and confirm you have read the Privacy Notice.`,
      ],
    },
    {
      title: '2. Who can use NetEdu',
      body: [
        `You must be at least ${MIN_AGE}. If you are under 18, a parent must approve before you can upload work and receive AI feedback.`,
        "You are responsible for the details you give at sign-up being accurate, especially your date of birth and your parent's e-mail. You may not share your account.",
      ],
    },
    {
      title: '3. Limits of AI feedback',
      body: [
        'Feedback, score estimates, topic suggestions, roadmaps and university matches are generated automatically and can be wrong. They are not official IB marks and do not replace your teacher, IB coordinator or examiner.',
        "University requirements are compiled from official sources, but universities change them. Check the current requirements on the university's own site before applying.",
        'NetEdu does not guarantee any mark, score or university offer.',
      ],
    },
    {
      title: '4. Academic integrity',
      body: [
        "NetEdu does not write work for you; it gives feedback on what you wrote. Everything you submit must be your own and must follow your school's and the IB's academic integrity rules. That is your responsibility.",
        "The IB and many schools expect students to acknowledge help from AI tools. Check your school's rules and tell your teacher you used NetEdu for feedback where required.",
      ],
    },
    {
      title: '5. Your content',
      body: [
        'What you upload stays yours. You give us only the limited permission we need to run the service: storing and processing your content and generating feedback for you. Using it to improve the service requires your separate consent.',
        "Do not upload someone else's work, or content containing other people's personal data, without the permissions needed.",
      ],
    },
    {
      title: '6. CAS collaboration and contact with other students',
      body: [
        'Be respectful in CAS project chats. Harassment, bullying, hate speech, sexual content and advertising are not allowed.',
        "Think twice before sharing a phone number, e-mail or social handle: once a conversation leaves NetEdu we cannot see it, moderate it or help if something goes wrong. Messages that look like this trigger a warning before sending and are flagged for review.",
        'Use the Report button to tell us about an inappropriate message.',
      ],
    },
    {
      title: '7. Prohibited use',
      body: [
        "Don't hammer the service with automated tools, try to get around usage limits, try to access other people's accounts or data, bypass security measures, or use NetEdu to write work for others or resell it. We may suspend or close accounts that do.",
      ],
    },
    {
      title: '8. Free and Pro plans',
      body: [
        'The Free plan includes the features listed on the pricing page. Pro includes daily limits on some features to keep use fair.',
        `Pro is listed at USD ${PRO_MONTHLY_USD} per month or USD ${PRO_ANNUAL_USD} per year. Cards issued in Turkey are charged the Turkish lira equivalent, as Turkish law requires.`,
        'Subscriptions renew automatically at the end of each period until cancelled. You can cancel at any time; cancellation takes effect at the end of the current period.',
        'Before you buy, we show you the price, what is included, renewal terms and your right of withdrawal as distance-selling law requires. If you ask us to start the service within the withdrawal period, the right of withdrawal may end to the extent the law allows.',
      ],
    },
    {
      title: '9. Closing your account',
      body: [
        `You can have your account closed at any time by writing to ${email}. Your content is then deleted within the period stated in the Privacy Notice.`,
        'We may close accounts that seriously breach these terms.',
      ],
    },
    {
      title: '10. Liability',
      body: [
        'We make reasonable efforts to keep NetEdu running and accurate but cannot guarantee it. To the extent the law allows, we are not liable for indirect loss arising from decisions you make based on the feedback. This does not limit liability for intent or gross negligence, or your rights under consumer law.',
      ],
    },
    {
      title: '11. Trademarks',
      body: [
        'International Baccalaureate®, IB® and related names are registered trademarks of the International Baccalaureate Organization. NetEdu is not affiliated with, endorsed or approved by the IB.',
      ],
    },
    {
      title: '12. Changes and governing law',
      body: [
        'When we make a material change to these terms we will tell you and ask you to accept the new version the next time you sign in.',
        'These terms are governed by Turkish law. Consumer disputes go to the Consumer Arbitration Committees within their monetary limits and to the Consumer Courts above them. If the Turkish and English versions differ, the Turkish version prevails.',
        `Questions: ${email}.`,
      ],
    },
  ],
}

export const termsOfUse: Record<Lang, LegalDocument> = { tr, en }
