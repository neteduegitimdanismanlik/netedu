# NETEDU — PROJE DURUMU VE DEVİR NOTU
**Tarih:** 3 Eylül 2026 · **Etiket:** `v0.3.0`

Bu notu yeni bir Claude oturumunun başına yapıştır. Projenin tamamını anlatmaz — yeni bir oturumun **yanlış bir şey yapmasını engelleyecek** kadarını anlatır.

---

## 1. Proje

**NetEdu** — IB Diploma programı öğrencileri için akademik destek ve üniversite başvuru platformu.

- Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, TypeScript strict, Tailwind 4
- Supabase (auth + Postgres + Storage), RLS her tabloda açık
- Anthropic Messages API, `claude-sonnet-4-6`
- Vercel'de barındırılıyor, GitHub entegrasyonu bağlı — **`git push` otomatik deploy eder**, Vercel CLI'a gerek yok
- Proje klasörü: `C:\Users\PC\netedu-proje`
- Repo: `github.com/neteduegitimdanismanlik/netedu`
- Canlı: `netedu.vercel.app`

---

## 2. Değişmez ilkeler

Bunlar tercih değil, projenin omurgası. Yeni bir oturum bunları bozmamalı.

**Veri koddur, kod değildir.** Rubrikler `app/rubrics/` altında dört kayıt defterinde yaşıyor (`extraRubrics`, `MARKING_MODELS`, `TOPIC_RULE_SETS`, `topicExemplars`). Üniversite şartları `app/universities/` altında aynı desende. Yeni bir ders ya da ülke eklemek = dosya eklemek. Mantığa dokunulmaz.

**Doğrulanmamış sayı yazılmaz.** Üniversite tablolarındaki her rakam resmî bir sayfadan okundu ve yanında `source` URL'i, `checkedOn` tarihi var. Bulunamayan alan **yok**, sıfır ya da tahmin değil. Kabul oranı alanı bilerek boş — kaynaksız bir kabul oranı hiç yoktan kötüdür.

**Limit tarayıcıda değil sunucuda zorlanır.** Tarayıcıdaki kontrol dekorasyondur; API'ye doğrudan istek atan onu geçer. Para harcayan her uç nokta kendi kapısını kendi tutar.

**Öğrenci verisi karıştırılmaz.** `checker_reports` (mevcut öğrenciler) ile `alumni_submissions` (mezun bağışı) asla aynı havuzda değil. Bağışlanan veride her zaman `consent = true` filtresi. İsim ve e-posta başka öğrenciye asla gösterilmez.

**Turnitin entegrasyonu yok.** Hiçbir zaman.

---

## 3. Şu an çalışan şeyler

| Özellik | Durum |
|---|---|
| IA Checker | Canlı, 16+ ders, üç geçişli ortalama, resmî IB kriterleriyle |
| Topic Finder | Canlı, rubriklerden besleniyor (hard ceiling'ler prompt'a giriyor) |
| University Match | **Modele hiç sormuyor** — 65 üniversitelik tablodan hesaplıyor |
| Roadmap | Yıl yıl, Free'de ilk 2 dönem |
| CAS projeleri | Oluşturma, başvuru kutusu, kabul/red, proje sohbeti |
| Portfolio + Academic Identity Score | Canlı |
| Parent panel, weekly report | Canlı |
| Plan kilitleri | Canlı, hepsi sunucuda |

**Test edilmiş dersler:** Economics (14/14 güçlü, 5/14 zayıf), Psychology (19/24), Biology (15/24), Philosophy, Digital Society.

---

## 4. Plan sistemi

`profiles.plan` üç değer alır: `free`, `pro`, `unlimited`.

- **`unlimited`** dışarıya `pro` olarak görünür — `plan === 'pro'` diye bakan her kilit değişmeden çalışır. Tek farkı **günlük sayaçların hiç devreye girmemesi**. Test hesapları için.
- Admin paneli **ayrı** bir şey: `public.admins` tablosu. `unlimited` admin yetkisi vermez.

Sayılar tek yerde: **`lib/plan-limits.ts`** (hiçbir şey import etmez, hem sunucu hem tarayıcı okur).

```
FREE_ROADMAP_PERIODS = 2     // Free: 1. yılın ilk 2 dönemi
FREE_UNIVERSITY_MATCHES = 3  // Free: 3 üniversite
DAILY_CHECKS = 3             // Pro: günde 3 checker
DAILY_JOIN_LIMIT = 2         // günde 2 CAS katılma isteği
```

Günlük limitler **hiçbir yerde ilan edilmiyor** — öğrenci sadece limite gelince görüyor.

---

## 5. Önemli dosyalar

```
lib/plan.ts             Plan kontrolü, requirePro(), limitsWaived(), günlük sayaçlar
lib/plan-limits.ts      Sayıların tek kaynağı
lib/api-auth.ts         callerId(req) — token'dan doğrulanmış kullanıcı. Body'deki userId'ye ASLA güvenme
lib/session.ts          authHeaders() — istemci tarafı, her fetch'e eklenir
lib/storage.ts          İmzalı URL'ler; bucket'lar private
lib/cas-privacy.ts      Baş harf üretimi + iletişim bilgisi tespiti
lib/cas-server.ts       CAS üyelik kontrolü, isim→baş harf eşlemesi

app/rubrics/            Rubrik kayıt defterleri (ders başına dosya)
app/universities/       Üniversite şartları — schema.ts + ülke başına dosya + match.ts
app/api/checker/        Değerlendirme (Pro + günde 3)
app/api/topics/         Topic Finder (Pro)
app/api/match/          Üniversite eşleştirme (modele sormaz)
app/api/cas/            applications, messages, report
app/api/plan/           İstemcinin kilit çizmesi için
sql/cas-chat.sql        CAS tabloları + RLS
```

---

## 6. 3 Eylül'de yapılanlar

**CAS işbirliği (yeni).** `cas_project_messages` + `cas_message_reports` tabloları, RLS ile sadece üyeler. Başvuru kutusu (organizatör kabul/red/çıkarma yapar). **İsimler hiçbir zaman tarayıcıya gitmiyor** — sunucu baş harfe çeviriyor. Mesaj gönderme Pro. Telefon/e-posta/Instagram kalıbı yakalanınca engellemiyor, uyarıyor ve `flagged_contact = true` işaretliyor.

**Plan kilitleri (yeni).** Roadmap, üniversite eşleşmeleri, Checker, Topic Finder. Hepsi sunucuda.

**İki güvenlik açığı kapandı.** `/api/match` ve `/api/roadmap`'te **hiç kimlik doğrulaması yoktu** — internetteki herkes Anthropic bakiyesini harcayabilirdi. İkisi de artık giriş şartı arıyor.

**Üniversite tabloları (yeni).** 65 üniversite, 8 ülke, 383 resmî kaynak linki, 267 bölüm kaydı. Hepsi 2-3 Eylül 2026'da resmî sayfalardan okundu.

**Matcher yeniden yazıldı.** `/api/match` artık Anthropic'i **hiç çağırmıyor**. Sonuç tablodan hesaplanıyor: HL ön koşulu önce kontrol ediliyor, eksikse "Reach" değil **"başvuru yapılamaz"** deniyor. Çalışması sıfır maliyet.

---

## 7. Sıradaki işler

**Önce yapılması gerekenler:**

1. **Gizlilik politikası.** Öğrenci metni saklanıyor, admin okuyabiliyor, Anthropic API'ye gidiyor, Vercel/Supabase'de barınıyor. Canlıya gerçek öğrenci almadan önce şart. KVKK/GDPR.
2. **Anthropic'te aylık harcama tavanı.** Beş dakikalık iş, ertelenmemeli.
3. **CAS'i iki hesapla baştan sona test et** — Ask to join → Accept → sohbet → iletişim uyarısı.

**Veri işleri (acele değil, mimari hazır):**

4. **KU Leuven boş** — 65 üniversite içinde bölüm listesi sıfır olan tek kayıt. Sayfaları otomatik okumaya kapalı, elle doldurulmalı.
5. **Sekiz üniversitede fakülte sayfaları okunamadı** — Zürih, Cenevre, Queen Mary, Lancaster, St. Gallen.
6. **Erişilebilir katman zayıf** — İtalya'da Ferrara/Parma/Siena/Bari (IMAT'la İngilizce tıp, Pavia'dan düşük rekabet), Japonya'da Sophia ve APU, Hollanda'da Utrecht ve Leiden.
7. **YÖK tanınırlığı 65 kayıtta da boş.** Alan şemada var, veri yok. Türkiye'ye dönecek öğrenci için filtre.

**Diğer:**

8. Group 6 (Sanat) "coming soon" etiketleri; Görsel Sanatlar/Film/Dans/Müzik/Tiyatro paketlerinin entegrasyonu bekliyor. **Karar: Group 6'ya puanlama yok, sadece destek.**
9. Ödeme sağlayıcı kararı — **Stripe Türkiye'yi desteklemiyor** (doğrulandı). Şu an pricing sayfasındaki Pro düğmesi `mailto:`.
10. Maliyet optimizasyonu: Sonnet 5 + prompt caching (~0.135$ → ~0.075$ / değerlendirme). Kullanıcı "şimdilik geçmeyelim" dedi.

---

## 8. Bizi ısıran şeyler — tekrarlanmasın

**PowerShell ile SQL karıştırma.** `update`, `select`, `insert` → **Supabase SQL Editor**. `git`, `npm`, `npx` → **PowerShell**.

**`.env.local`'de BOM.** PowerShell'le satır eklenince dosyanın başına görünmez karakter giriyor ve ilk değişkenin **adı** bozuluyor. VS Code'da sağ altta "UTF-8 with BOM" görürsen → Save with encoding → UTF-8. Aynı sorun `app/api/roadmap` ve `app/api/match`'te de vardı, temizlendi.

**`SUPABASE_SERVICE_ROLE_KEY` asla `NEXT_PUBLIC_` almaz.** Ve Vercel'de "Shared" değil, projenin kendi Environment Variables'ında olmalı.

**Aynı import'u iki kez eklemek.** Bir kere `Link`'i çift import ettik, build patladı. Düzenlemeden önce dosyanın başına bak.

**Rate limit.** Paralel araştırma ajanları oturum limitini yiyor. Beş üniversitelik bir araştırma ~100-130 bin token. Aynı anda dörtten fazla çalıştırma.

**Bu konuşmanın kendisi pahalılaşır.** Uzun oturumlarda her mesajda tüm geçmiş yeniden işleniyor. Büyük bir iş bitince yeni oturuma geç.

---

## 9. Güvenlik — yürürlükteki kurallar

- service_role ve Anthropic anahtarları sohbete yapıştırılmaz
- `checker-files` ve `cas-proofs` bucket'ları **private**, erişim imzalı URL ile (1 saat)
- Dosya adları tahmin edilemez: `${prefix}/${Date.now()}-${randomUUID}.${ext}`
- Öğrenciler arası iletişim platform içinde kalır; platform dışına yönlendirme yapılmaz, iletişim kalıbında **yumuşak uyarı** gösterilir (engelleme değil)
- Reşit olmayan kullanıcılar var — CAS'te isimler baş harf, rapor mekanizması açık

---

## 10. Maliyet

- Değerlendirme başına ~**0.135$** (3 çağrı × ~7.500 girdi + ~1.500 çıktı, 3$/15$ per MTok)
- Günde 3 değerlendirme yapan bir öğrenci ≈ **14$/ay**
- University Match artık **0$** — modele sormuyor
- Pricing: tek plan, **49 €/ay**, ödeme henüz bağlı değil

---

## Yeni oturuma nasıl başlanır

Bu notu yapıştır, sonra ne yapmak istediğini söyle. Yeni oturumun bilmesi gereken tek ek şey: dosyalar `C:\Users\PC\netedu-proje` altında ve bilgisayar bağlıysa doğrudan düzenlenebilir.
