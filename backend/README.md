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

Site: http://localhost:3000/ — Panel: http://localhost:3000/#panel
API: http://localhost:4000/health

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

Oturum 8 saat geçerlidir. Çıkış oturumu sunucuda iptal eder. Üretimde
`NODE_ENV=production` ve HTTPS gereklidir. Frontend ile API aynı origin veya aynı
site alt alanlarında bulunmalıdır; farklı siteler SameSite=Strict ile desteklenmez.

## Veri ve dosyalar

- `/api/public/products` yalnızca vitrin alanlarını sunar; `/uploads/*` ürün
  görsellerini sunar. Diğer API'ler yönetici oturumu gerektirir.
- Yazma istekleri `X-Meka-Request: 1` başlığını gerektirir; frontend bunu gönderir.
- Ürün, müşteri, fatura, servis ve stok hareketleri MySQL'dedir. Stok değişikliği
  ile geçmiş aynı transaction içindedir. Negatif stok ve çift geri alma engellenir.
- Ürün fotoğrafları doğrulanıp WebP'ye dönüştürülür; varsayılan konum
  `backend/uploads`, değişken `UPLOAD_DIR`. Fotoğraf başına giriş sınırı 1 MB'dır.
  Ürün silinince veya fotoğrafı değişince, başka ürünün kullanmadığı eski dosya da
  silinir. Bu kontrol yalnızca bağlı veritabanına bakar; aynı klasörü paylaşan ikinci
  bir veritabanıyla (ör. `meka_review`) paneli çalıştıracaksanız ayrı `UPLOAD_DIR` verin.
- Para alanları DECIMAL(12,2), vergi DECIMAL(5,2). JSON'da ondalık değerler metin
  olarak dönebilir. TL gösterimi iki ondalık basamak içerir.
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
`.env` dosyaları Git'e dahil edilmez. Paneldeki yerel yedek düğmesi MySQL yedeğinin
yerine geçmez; eski tarayıcı ayarları içindir.

Geri yükleme yalnızca **yeni ve boş** bir veritabanında yapılmalıdır. SQL'i içe
aktarın, arşivi `UPLOAD_DIR` konumuna açın ve bağlantıyı bu veritabanına yönlendirin.
Çalışan veritabanına doğrudan yedek yüklemeyin. Geçiş öncesi yedek ayrı bir
veritabanına geri yüklenip `node backend/scripts/verify-migration.js` ile
karşılaştırılmıştır; bu komut yerel sabit `meka_before_verify`/`meka` adlarını kullanır.

## Hosting için kalan adımlar

1. Node.js 22.12+ ve MySQL 8+ ile npm/terminal erişimini sağlayıcıdan doğrulayın.
2. Boş MySQL veritabanı ve kullanıcı oluşturun. `DATABASE_URL` değerini
   `mysql://DB_USER:URL_ENCODED_PASSWORD@DB_HOST:3306/DB_NAME` biçiminde tanımlayın.
   Yerel (127.0.0.1/localhost) bağlantıda MySQL 8'in RSA anahtarı otomatik alınır.
   Uzak sunucuda bağlantı TLS'siz ise ve `ER_CANNOT_RETRIEVE_RSA_KEY` hatası çıkarsa
   TLS açın veya URL'ye `?allowPublicKeyRetrieval=true` ekleyin.
3. `NODE_ENV=production`, `FRONTEND_ORIGIN`, `PORT` ve kalıcı `UPLOAD_DIR` ayarlayın.
4. Yerel son SQL yedeğini ve uploads arşivini aktarın; üretim frontend derlemesini
   hazırlayın. `VITE_API_BASE_URL` yalnızca API farklı origin'deyse gerekir.
5. HTTPS, cookie, public ürünler, yönetici girişi ve kayıt işlemlerini doğrulayın.

Hosting bağlantısı, DNS ve yayın yapılmadı. Yerel geçiş için gerekli şema dönüşümü
bu oturumda kullanıcı talimatıyla uygulanmıştır; `prisma/mysql-review-upgrade.sql`
tekrar çalıştırılmamalıdır.
