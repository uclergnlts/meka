# MEKA Backend

## Yerel durum

MySQL geçişi tamamlandı. Ana veritabanı `meka`, bağımsız test veritabanı
`meka_review` ve geçiş öncesi yedeği doğrulamak için `meka_before_verify` bulunur.
Ana veritabanı son şemadadır; 6 ürün, 4 müşteri, 4 fatura, 3 servis ve 4 bakiye
kaydı alan bazında yedekle karşılaştırılmıştır. Yönetici hesabı ana veritabanındadır.

`backend/.env.local` yerel MySQL bağlantısını, 4000 backend portunu ve 3000 frontend
adresini tanımlar. Dosya Git dışındadır. Eski `.env` korunur. Dışarıdan verilen
ortam değişkenleri önceliklidir; üretimde `.env.local` yüklenmez.

```bash
npm run db:up
npm run dev
```

Site: http://localhost:3000/ — Panel: http://admin.localhost:3000/
API: http://localhost:4000/health

Panel yalnızca `admin.` ile başlayan alan adında açılır (yerelde `admin.localhost`,
canlıda `admin.<alan adı>`). Sitede panele giden bağlantı yoktur ve site adresinde
`#panel` yazmak paneli açmaz. `admin.localhost` Chrome ve Firefox'ta ek ayar
gerektirmez; Safari'de `/etc/hosts` dosyasına eklenmesi gerekir.

`db:up`, Docker Desktop çalışırken MySQL'i başlatır ve sağlıklı olmasını bekler.
macOS'ta Docker CLI PATH'te olmasa da standart Docker Desktop konumu kullanılır.
Ana kayıtlar `meka_meka-mysql-data` volume'ündedir; volume silinmemelidir.

## Yönetici hesabı

Mevcut yöneticinin bilgileri `backend/.admin-login.txt` içindedir (0600, Git dışı).
Parolayı güvenli bir yere aldıktan sonra bu dosyayı silebilirsiniz. Parola
veritabanında scrypt hash'iyle, oturum belirteci SHA-256 hash'iyle saklanır.

Yeni boş bir kurulumda:

```bash
npm run db:generate
npm run db:push
npm run admin:create -w backend
```

`admin:create` mevcut kullanıcıyı veya parola dosyasını değiştirmez. Örnek kayıtlar
isteğe bağlı `npm run db:seed` ile eklenir; gerçek kayıtlı veritabanında kullanmayın.

Parola panelde Ayarlar bölümünden değiştirilir (en az 10 karakter); değişiklik diğer
cihazlardaki oturumları kapatır. Parola unutulursa
`npm run admin:reset-password -w backend` yeni bir parola üretir, `.admin-login.txt`
dosyasına yazar ve bütün oturumları kapatır.

Aynı adresten 5 hatalı parola denemesi o adresi 15 dakika engeller; hesap ancak 30
hatalı denemeden sonra kilitlenir. Adres sayacı bellekte tutulur. Uygulama bir ters
vekilin (reverse proxy) arkasındaysa `TRUST_PROXY` vekil sayısına ayarlanmalıdır
(çoğunlukla `1`); aksi halde bütün ziyaretçiler tek adres sayılır.

Oturum 8 saat geçerlidir. Çıkış oturumu sunucuda iptal eder. Üretimde
`NODE_ENV=production` ve HTTPS gereklidir. Frontend ile API aynı origin veya aynı
site alt alanlarında bulunmalıdır; farklı siteler SameSite=Strict ile desteklenmez.

## Veri ve dosyalar

- `/api/public/products` yalnızca vitrin alanlarını, `/api/public/settings` işletme
  bilgilerini ve logo/favicon yolunu sunar; `/uploads/*` görselleri sunar. Diğer
  API'ler yönetici oturumu gerektirir.
- Yazma istekleri `X-Meka-Request: 1` başlığını gerektirir; frontend bunu gönderir.
- Ürün, müşteri, fatura, servis ve stok hareketleri MySQL'dedir. Stok değişikliği
  ile geçmiş aynı transaction içindedir. Negatif stok ve çift geri alma engellenir.
  Ürün kartından stok değiştirmek de aradaki fark kadar bir hareket kaydeder. Ürün
  silinince stok geçmişi de onunla birlikte silinir.
- Paneldeki işletme ayarları ve logo `settings` tablosunda saklanır ve tüm
  ziyaretçilere yansır; tarayıcıdaki kopya yalnızca önbellektir. Logo ve favicon PNG
  olarak `UPLOAD_DIR` içine yazılır. Bu tablo eklenmeden önce kurulmuş bir
  veritabanında bir kez `npm run db:push` çalıştırılmalıdır.
- Özetteki gelir, durumu "Ödendi" olan faturalar ile Gelir/Gider bölümüne elle
  girilen gelir kayıtlarının toplamıdır; gider yalnızca elle girilen kayıtlardır.
- Ürün fotoğrafları doğrulanıp WebP'ye dönüştürülür; varsayılan konum
  `backend/uploads`, değişken `UPLOAD_DIR`. Fotoğraf başına giriş sınırı 1 MB'dır.
  Ürün silinince veya fotoğrafı değişince, başka ürünün kullanmadığı eski dosya da
  silinir. Bu kontrol yalnızca bağlı veritabanına bakar; aynı klasörü paylaşan ikinci
  bir veritabanıyla (ör. `meka_review`) paneli çalıştıracaksanız ayrı `UPLOAD_DIR` verin.
- Para alanları DECIMAL(12,2), vergi DECIMAL(5,2). JSON'da ondalık değerler metin
  olarak dönebilir. TL gösterimi iki ondalık basamak içerir.
- Yeni faturalar yıl içinde sıralı kısa numara alır (2026-001, 2026-002, …); eski
  faturaların numarası değişmez.
- Kalemsiz eski fatura düzenlenirken mevcut toplam vergi dahil tek kaleme alınır,
  tekrar vergi uygulanmaz.
- localhost:3000 tarayıcı depolaması Chrome “Üçler” ve “60” profillerinde
  incelendi. İlgili MEKA anahtarları boştu; kopyalanacak yerel kayıt bulunmadı.
  Bu incelemenin JSON yedekleri `backend/backups` içindedir. Tarayıcı depolaması
  silinmedi. Başka profil/origindeki veriler bu incelemenin kapsamında değildir.

## Yedekleme ve doğrulama

```bash
npm run db:backup
MYSQL_TEST_DATABASE_URL=mysql://meka:meka@127.0.0.1:3306/meka_review npm run test:mysql -w backend
npm run build
```

`db:backup`, `backend/backups/<tarih>/meka.sql` ve `uploads.tar.gz` üretir.
Veritabanı ile fotoğraflar birlikte korunmalıdır. Yedekler, parola dosyası ve
`.env` dosyaları Git'e dahil edilmez. Paneldeki "Kayıtları indir" düğmesi bütün
kayıt tablolarını tek bir JSON dosyası olarak verir (`/api/export`); fotoğrafları ve
yönetici hesabını içermez, geri yükleme için kullanılmaz ve MySQL yedeğinin yerine
geçmez.

`npm run lint` kod denetimini çalıştırır; CI aynı komutu, entegrasyon testini ve
derlemeyi her PR'da çalıştırır.

Geri yükleme yalnızca **yeni ve boş** bir veritabanında yapılmalıdır. SQL'i içe
aktarın, arşivi `UPLOAD_DIR` konumuna açın ve bağlantıyı bu veritabanına yönlendirin.
Çalışan veritabanına doğrudan yedek yüklemeyin. Geçiş öncesi yedek ayrı bir
veritabanına geri yüklenip `node backend/scripts/verify-migration.js` ile
karşılaştırılmıştır; bu komut yerel sabit `meka_before_verify`/`meka` adlarını kullanır.

## Hosting'e kurulum

Canlıda site, panel ve API tek bir Node.js uygulaması olarak çalışır: backend,
`public` klasöründe derlenmiş siteyi bulursa onu da sunar ve `/urunler` gibi sayfa
adreslerinde `index.html` döndürür. Site kendi adresinden geldiği için
`FRONTEND_ORIGIN` ayarı gerekmez.

```bash
npm run db:backup       # kayıtlar ve fotoğraflar: backend/backups/<tarih>/
npm run build:hosting   # yüklenecek paket: dist-hosting/meka-hosting.zip
```

Paket; backend'i, derlenmiş siteyi, hazır üretilmiş veritabanı istemcisini ve kendi
`package.json` dosyasını içerir. Kurulum adımları pakette ve
[hosting/KURULUM.md](../hosting/KURULUM.md) içindedir. Paylaşımlı hosting'de (cPanel
veya DirectAdmin, CloudLinux "Setup Node.js App") çalışacak şekilde hazırlanmıştır.

Gerekenler: Node.js 20.19+ (tercihen 22) ve MySQL 8 ya da MariaDB 10.6+. Paket
Node.js 20.19 ve MariaDB 10.6 ile, MySQL 8.4 yedeği MariaDB'ye aktarılarak denenmiştir.

Uzak bir veritabanı sunucusunda bağlantı TLS'siz ise ve `ER_CANNOT_RETRIEVE_RSA_KEY`
hatası çıkarsa TLS açın veya URL'ye `?allowPublicKeyRetrieval=true` ekleyin.
`VITE_API_BASE_URL` ve `FRONTEND_ORIGIN` yalnızca site ile API ayrı adreslerde
barındırılırsa gerekir.

Hosting bağlantısı, DNS ve yayın yapılmadı. Yerel geçiş için gerekli şema dönüşümü
bu oturumda kullanıcı talimatıyla uygulanmıştır; `prisma/mysql-review-upgrade.sql`
tekrar çalıştırılmamalıdır.
