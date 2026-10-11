import { LEGAL, type Lang, type LegalDocument } from './types'
import { MIN_AGE } from '../consent-shared'

const { controller, address, email, deleteDays } = LEGAL

const tr: LegalDocument = {
  title: 'Kişisel Verilerin Korunması Aydınlatma Metni',
  intro:
    "Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun (KVKK) 10. maddesi uyarınca NetEdu'yu kullanan öğrencileri, velileri ve içerik paylaşan mezunları; hangi kişisel verilerin, hangi amaçla ve hangi hukuki sebeple işlendiği, kimlere aktarıldığı ve hangi haklara sahip oldukları konusunda bilgilendirmek için hazırlanmıştır. Avrupa Birliği'nden kullanan kişiler için Genel Veri Koruma Tüzüğü (GDPR) kapsamındaki haklar da saklıdır.",
  sections: [
    {
      title: '1. Veri sorumlusu',
      body: [
        `${controller}${address ? `, ${address}` : ''}. İletişim: ${email}.`,
      ],
    },
    {
      title: '2. İşlediğimiz kişisel veriler',
      body: [
        '• Kimlik ve iletişim: e-posta adresi, doğum tarihi; profilde paylaşırsan ad ve soyad. Şifren bizde değil, kimlik doğrulama sağlayıcımızda şifrelenmiş (hash) olarak tutulur.',
        '• Eğitim ve profil bilgileri: sınıf, okul, uyruk, diploma programı, not ortalaması, SAT/IELTS gibi sınav sonuçları, hedef üniversite ve bölüm, kulüpler, gönüllülük, araştırma ve ödüller.',
        '• Yüklediğin içerik: IA, Extended Essay ve diğer ödev metinleri ile dosyaları, konu fikirleri, mülakat ve sözlü sınav çalışmalarındaki cevapların, portfolyo kayıtları ve CAS kanıtları; bunlara üretilen geri bildirimler ve puan tahminleri.',
        '• CAS işbirliği: oluşturduğun ya da katıldığın projeler, başvurular, proje sohbetindeki mesajlar ve bildirdiğin mesajlar.',
        '• Veli bilgileri: 18 yaşından küçük kullanıcılarda velinin e-posta adresi, adı soyadı, onay tarihi ve onay verdiği IP adresi; veli paneli kullanılıyorsa veli ile öğrenci arasındaki mesajlar.',
        '• Ödeme bilgileri (yalnızca ücretli plana geçersen): abonelik durumu ve ödeme sağlayıcısındaki müşteri ve abonelik numaraları. Kart bilgilerin bize hiç ulaşmaz, doğrudan ödeme sağlayıcısına girilir. iyzico ile Türk lirası ödeme yaparsan, iyzico mevzuat gereği ad, soyad, T.C. kimlik numarası, telefon ve fatura adresini ister; bu bilgiler iyzico\'ya iletilir, bizim veritabanımızda saklanmaz.',
        '• Kullanım ve güvenlik kayıtları: giriş kayıtları, IP adresi, hangi özelliği ne zaman kullandığın (günlük kullanım limitleri için) ve barındırma sağlayıcısının tuttuğu teknik loglar.',
        '• Mezun katkıları (/contribute): ad soyad, e-posta, mezuniyet yılı, paylaşılan ödevler, puanlar ve sınav görevlisi yorumları, kabul bilgileri.',
      ],
    },
    {
      title: '3. Amaçlar ve hukuki sebepler',
      body: [
        '• Hesabını açmak ve yönetmek; yüklediğin metinlere geri bildirim üretmek; roadmap, üniversite eşleştirme, konu önerisi, mülakat ve sözlü sınav hazırlığı, portfolyo puanı ve CAS işbirliği gibi özellikleri sunmak; veli paneli ve dönemsel raporlar; ücretli plan ve abonelik işlemleri: sözleşmenin kurulması ve ifası (KVKK m.5/2-c).',
        '• Kötüye kullanımı önlemek, CAS sohbetinde iletişim bilgisi paylaşımı gibi riskli mesajları incelemek, güvenlik ve log kayıtları: meşru menfaat ve hukuki yükümlülük (KVKK m.5/2-f ve m.5/2-ç).',
        '• Ödeme ve faturalandırma kayıtlarının saklanması: kanunlarda öngörülmesi ve hukuki yükümlülük (KVKK m.5/2-a ve m.5/2-ç).',
        '• Kampanya ve duyuru e-postaları ile yüklediğin metinlerin kimliğini belirten bilgiler çıkarılarak geri bildirim kalitesini geliştirmek için kullanılması: yalnızca kayıt sırasında ayrıca işaretlediğin açık rızaya dayanarak (KVKK m.5/1). Bu iki rıza isteğe bağlıdır; vermemen ya da sonradan geri çekmen hizmeti kullanmanı etkilemez.',
        '• Mezun katkıları: paylaşım sırasında verilen açık rıza (KVKK m.5/1).',
      ],
    },
    {
      title: '4. 18 yaşından küçük kullanıcılar',
      body: [
        `NetEdu'ya ${MIN_AGE} yaşından küçükler kayıt olamaz. 18 yaşından küçük kullanıcılar kayıt olurken velinin e-posta adresini verir; veliye bir onay bağlantısı gönderilir. Veli onay verene kadar hesap açılır ve profil doldurulabilir, ancak ödev yükleme ve yapay zekâ geri bildirimi kapalıdır.`,
        `Veli onayını istediği zaman ${email} adresine yazarak geri çekebilir; bu durumda hesap ve yüklenen içerikler silinir.`,
        'CAS işbirliği alanında öğrencilerin gerçek isimleri diğer öğrencilere gösterilmez, yalnızca baş harfler görünür.',
      ],
    },
    {
      title: '5. Yapay zekâ ile geri bildirim',
      body: [
        'Yüklediğin metinler ve ilgili profil bilgilerin, geri bildirim ve öneri üretilmesi için yapay zekâ hizmet sağlayıcımız Anthropic\'e (ABD) gönderilir. Anthropic, ticari API koşulları gereği bu verileri kendi modellerini eğitmek için kullanmaz.',
        'Geri bildirimler ve puan tahminleri otomatik üretilir, hata içerebilir; resmî IB puanı değildir ve öğretmen değerlendirmesinin yerini tutmaz. Hakkında hukuki sonuç doğuran bir karar yalnızca bu otomatik değerlendirmeye dayanılarak alınmaz.',
        'NetEdu senin yerine ödev yazmaz. Teslim ettiğin çalışmanın okulunun ve IB\'nin akademik dürüstlük kurallarına uygunluğu senin sorumluluğundadır.',
        'Sesli cevap özelliği tarayıcının kendi konuşma tanıma hizmetini kullanır. Google Chrome gibi bazı tarayıcılar sesi yazıya çevirmek için tarayıcı üreticisinin sunucularına gönderir. NetEdu ses kaydı saklamaz; yalnızca ortaya çıkan metni işler.',
      ],
    },
    {
      title: '6. Verilerine kimler erişebilir',
      body: [
        'Yetkili NetEdu personeli; destek taleplerini yanıtlamak, portfolyo kayıtlarını onaylamak, geri bildirim kalitesini denetlemek ve bildirilen mesajları incelemek için içeriklerine erişebilir.',
        'Veli hesabı bağlanmışsa, öğrencinin profil özeti, portfolyo durumu ve dönemsel raporlar veliyle paylaşılır.',
        'CAS projelerinde, katıldığın projenin üyeleri proje mesajlarını görür; isim yerine baş harflerin gösterilir.',
        'Verilerin satılmaz ve reklam amacıyla üçüncü kişilerle paylaşılmaz.',
      ],
    },
    {
      title: '7. Aktarım ve hizmet sağlayıcılar',
      body: [
        'Verilerin yalnızca hizmeti sunmak için aşağıdaki sağlayıcılarda işlenir:',
        '• Supabase: veritabanı, kimlik doğrulama ve dosya depolama',
        '• Vercel: web sitesinin barındırılması',
        '• Anthropic: yapay zekâ geri bildirimi',
        '• Resend: e-posta gönderimi',
        '• Google (Gmail): destek yazışmaları ve yönetici bildirimleri',
        '• iyzico (Türkiye) ve Paddle (Birleşik Krallık): yalnızca ücretli plana geçersen ödeme işlemleri. Paddle satıcı sıfatıyla (merchant of record) işlem yapar ve ödeme verileri bakımından kendi gizlilik politikasına tabidir.',
        'iyzico dışındaki sağlayıcıların sunucuları yurt dışındadır. Yurt dışına aktarım, KVKK m.9 kapsamında standart sözleşmeler ile yapılır.',
        'Kanunen yetkili kamu kurum ve kuruluşlarının talebi halinde, ilgili mevzuat çerçevesinde paylaşım yapılabilir.',
      ],
    },
    {
      title: '8. Saklama süresi',
      body: [
        `Hesabın açık olduğu sürece. Hesabını silmeni istediğinde profilin, yüklediğin içerikler ve geri bildirimler ${deleteDays} gün içinde silinir.`,
        'Onay kayıtları, ödeme ve fatura kayıtları ile güvenlik logları, ilgili mevzuatın öngördüğü süre boyunca saklanır ve süre sonunda silinir ya da anonim hale getirilir.',
        'CAS projelerindeki mesajların, hesabın silindiğinde silinir ya da seninle ilişkilendirilemeyecek şekilde anonim hale getirilir.',
      ],
    },
    {
      title: '9. Haklarınız',
      body: [
        'KVKK m.11 uyarınca; kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhine bir sonuç çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğraman halinde zararın giderilmesini talep etme haklarına sahipsin.',
        `Başvurunu, kayıtlı e-posta adresinden ${email} adresine gönderebilirsin. Başvurular en geç 30 gün içinde ücretsiz yanıtlanır. Kişisel Verileri Koruma Kurulu'na şikâyet hakkın saklıdır.`,
        'Açık rızaya dayanan işlemler için verdiğin rızayı her zaman geri çekebilirsin; geri çekme, öncesinde yapılan işlemleri etkilemez.',
      ],
    },
    {
      title: '10. Değişiklikler',
      body: [
        'Bu metni güncellediğimizde yeni sürüm bu sayfada yayımlanır ve bir sonraki girişinde onayına sunulur. Türkçe ve İngilizce metinler arasında farklılık olması halinde Türkçe metin esas alınır.',
      ],
    },
  ],
}

const en: LegalDocument = {
  title: 'Privacy Notice',
  intro:
    'This notice explains what personal data NetEdu processes about students, parents and contributing alumni, why, on what legal basis, who receives it and what your rights are. It is issued under Article 10 of the Turkish Personal Data Protection Law No. 6698 (KVKK); users in the European Union also keep their rights under the GDPR. If the Turkish and English versions differ, the Turkish version prevails.',
  sections: [
    {
      title: '1. Data controller',
      body: [`${controller}${address ? `, ${address}` : ''}. Contact: ${email}.`],
    },
    {
      title: '2. Data we process',
      body: [
        '• Identity and contact: e-mail address, date of birth; your name if you add it to your profile. Your password is held only as a hash by our authentication provider.',
        '• Education and profile: grade, school, nationality, diploma programme, GPA, test scores such as SAT/IELTS, target university and course, clubs, volunteering, research and awards.',
        '• What you upload: IA, Extended Essay and other coursework texts and files, topic ideas, your answers in interview and oral practice, portfolio items and CAS evidence, plus the feedback and score estimates generated for them.',
        '• CAS collaboration: projects you create or join, applications, messages in project chats and messages you report.',
        '• Parent data: for users under 18, the parent\'s e-mail address, name, approval date and the IP address the approval came from; messages between parent and student if the parent panel is used.',
        '• Payments (only if you upgrade): subscription status and the customer and subscription references held by the payment provider. Card details never reach us. If you pay in Turkish lira through iyzico, iyzico is legally required to collect your name, Turkish ID number, phone number and billing address; these go to iyzico and are not stored in our database.',
        '• Usage and security records: sign-ins, IP address, which feature you used and when (to apply daily limits) and technical logs kept by our hosting provider.',
        '• Alumni contributions (/contribute): name, e-mail, graduation year, shared coursework, marks, examiner comments and admission details.',
      ],
    },
    {
      title: '3. Purposes and legal bases',
      body: [
        '• Running your account; generating feedback on your writing; providing the roadmap, university matching, topic suggestions, interview and oral practice, portfolio scoring and CAS collaboration; the parent panel and reports; subscriptions: performance of our contract with you (KVKK Art. 5/2-c; GDPR Art. 6(1)(b)).',
        '• Preventing abuse, reviewing risky messages such as contact details shared in CAS chats, security and logs: legitimate interest and legal obligation (KVKK Art. 5/2-f and 5/2-ç; GDPR Art. 6(1)(f) and (c)).',
        '• Keeping payment and invoicing records: legal obligation (KVKK Art. 5/2-a and 5/2-ç).',
        '• Marketing e-mails, and using your texts with identifying details removed to improve feedback quality: only with the separate consent you tick at sign-up (KVKK Art. 5/1; GDPR Art. 6(1)(a)). Both are optional; refusing or withdrawing them does not affect your use of NetEdu.',
        '• Alumni contributions: the consent given when sharing.',
      ],
    },
    {
      title: '4. Users under 18',
      body: [
        `You must be at least ${MIN_AGE} to have an account. Users under 18 give a parent's e-mail address at sign-up and we send that parent an approval link. Until the parent approves, the student can use the account and fill in their profile, but uploading work and AI feedback stay locked.`,
        `A parent can withdraw approval at any time by writing to ${email}; the account and uploaded content are then deleted.`,
        "In CAS collaboration, students' real names are never shown to other students, only their initials.",
      ],
    },
    {
      title: '5. AI feedback',
      body: [
        'Your texts and the relevant parts of your profile are sent to our AI provider, Anthropic (USA), to generate feedback and suggestions. Under Anthropic\'s commercial API terms this data is not used to train their models.',
        'Feedback and score estimates are generated automatically and can be wrong. They are not official IB marks and do not replace your teacher\'s assessment. No decision with legal effect on you is made on the basis of this automated assessment alone.',
        "NetEdu does not write work for you. Making sure what you submit follows your school's and the IB's academic integrity rules is your responsibility.",
        'The voice answer feature uses your browser\'s built-in speech recognition. Some browsers, such as Google Chrome, send the audio to the browser maker\'s servers to transcribe it. NetEdu stores no audio; it only processes the resulting text.',
      ],
    },
    {
      title: '6. Who can see your data',
      body: [
        'Authorised NetEdu staff can access your content to answer support requests, approve portfolio items, check feedback quality and review reported messages.',
        'If a parent account is linked, your profile summary, portfolio status and periodic reports are shared with that parent.',
        'Members of a CAS project you join see that project\'s messages, with your initials instead of your name.',
        'We do not sell your data or share it with third parties for advertising.',
      ],
    },
    {
      title: '7. Service providers and transfers',
      body: [
        'Your data is processed only to run the service, by these providers:',
        '• Supabase: database, authentication and file storage',
        '• Vercel: website hosting',
        '• Anthropic: AI feedback',
        '• Resend: sending e-mail',
        '• Google (Gmail): support correspondence and admin notifications',
        '• iyzico (Turkey) and Paddle (United Kingdom): payments, only if you upgrade. Paddle acts as merchant of record and its own privacy policy applies to payment data.',
        'All providers except iyzico store data outside Turkey. These transfers rely on standard contractual clauses under Article 9 of the KVKK.',
        'We may disclose data to public authorities where the law requires it.',
      ],
    },
    {
      title: '8. How long we keep it',
      body: [
        `As long as your account is open. When you ask us to delete your account, your profile, uploads and feedback are deleted within ${deleteDays} days.`,
        'Consent records, payment and invoicing records and security logs are kept for the period the law requires, then deleted or anonymised.',
        'Your messages in CAS projects are deleted or anonymised so they can no longer be linked to you when your account is deleted.',
      ],
    },
    {
      title: '9. Your rights',
      body: [
        'Under Article 11 of the KVKK (and the GDPR where it applies) you can ask whether we process your data, get information about it, learn its purpose and whether it is used accordingly, know the third parties it is transferred to, have it corrected, have it deleted or destroyed and have third parties told about that, object to an outcome against you that results solely from automated analysis, and claim compensation for damage caused by unlawful processing.',
        `Send your request from your account e-mail to ${email}. We answer within 30 days, free of charge. You may also complain to the Turkish Personal Data Protection Authority, or, in the EU, to your national data protection authority.`,
        'You can withdraw any consent at any time; this does not affect processing that happened before.',
      ],
    },
    {
      title: '10. Changes',
      body: [
        'When we update this notice, the new version is published on this page and shown to you for acceptance the next time you sign in.',
      ],
    },
  ],
}

export const privacyNotice: Record<Lang, LegalDocument> = { tr, en }
