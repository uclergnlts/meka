# MEKA — hosting'e kurulum

Bu klasör, sitenin ve yönetim panelinin tamamını tek bir Node.js uygulaması olarak
çalıştırır. Paylaşımlı hosting'de (cPanel veya DirectAdmin, CloudLinux "Setup Node.js
App") kurulum için hazırlanmıştır.

## Başlamadan önce

Hosting'de şunlar olmalı:

- Node.js **20.19 veya üstü** (tercihen 22). Daha eski sürümde uygulama açılmaz.
- MySQL 8 veya MariaDB 10.6 ve üstü.

Yanınızda şunlar olmalı (kendi bilgisayarınızda `npm run db:backup` ile üretilir,
`backend/backups/<tarih>/` klasöründe durur):

- `meka.sql` — kayıtlar
- `uploads.tar.gz` — ürün fotoğrafları

## 1. Veritabanı

1. Panelde yeni bir MySQL veritabanı ve kullanıcı oluşturun; kullanıcıya veritabanında
   tüm yetkileri verin. Veritabanı adını, kullanıcı adını ve parolayı not edin.
2. phpMyAdmin'de bu veritabanını seçip **İçe Aktar** ile `meka.sql` dosyasını yükleyin.

## 2. Dosyalar

1. `meka-hosting.zip` dosyasını Dosya Yöneticisi ile ev dizininize yükleyip çıkarın.
   `meka` adında bir klasör oluşur. Bu klasör `public_html` **dışında** kalmalıdır.
2. `meka` içinde `uploads` adında bir klasör oluşturun ve `uploads.tar.gz` içindeki
   fotoğrafları buraya yükleyin (dosyalar doğrudan `meka/uploads/` altında olmalı).

## 3. Node.js uygulaması

Panelde **Setup Node.js App → Create Application**:

| Alan | Değer |
| --- | --- |
| Node.js version | 22 (yoksa 20.19 veya üstü) |
| Application mode | Production |
| Application root | `meka` |
| Application URL | alan adınız (kök dizin, sonuna bir şey eklemeyin) |
| Application startup file | `app.cjs` |

**Environment variables** bölümüne şunları ekleyin:

| Ad | Değer |
| --- | --- |
| `DATABASE_URL` | `mysql://KULLANICI:PAROLA@localhost:3306/VERITABANI` |
| `TRUST_PROXY` | `1` |

(`TRUST_PROXY` ve `NODE_ENV=production` verilmezse uygulama bu değerleri kendisi varsayar.)

Parolada `@`, `#`, `/`, `:` gibi karakterler varsa URL biçiminde yazılmalıdır
(ör. `@` yerine `%40`). İsterseniz bu değerleri panel yerine `meka/.env` dosyasına da
yazabilirsiniz; örneği `.env.example` içindedir.

Kaydettikten sonra **Run NPM Install** düğmesine basın, bitince **Restart** edin.

## 4. Yönetim paneli adresi

Yönetim paneli yalnızca `admin.` ile başlayan adreste açılır.

1. Panelde `admin.alanadiniz.com` alt alan adını oluşturun.
2. Alt alan adının kök dizini, ana alan adınınkiyle **aynı klasör** olmalı
   (cPanel'de alan adı eklerken "Share document root" seçeneği; DirectAdmin'de alt alan
   adının "document root" ayarı). Böylece iki adres de aynı uygulamaya gider.

## 5. SSL

Panelin ücretsiz SSL (Let's Encrypt / AutoSSL) özelliğini hem ana alan adı hem de
`admin.` alt alan adı için açın. Yönetici girişi yalnızca HTTPS üzerinden çalışır.

## 6. Kontrol

- `https://alanadiniz.com/health` → `{"status":"ok", ...}` yazmalı.
- `https://alanadiniz.com/` → site açılmalı, ürünler görünmeli.
- `https://admin.alanadiniz.com/` → giriş ekranı açılmalı; kendi bilgisayarınızda
  kullandığınız kullanıcı adı ve parola burada da geçerlidir.

Site açılmıyorsa panelde uygulamanın günlük (log) dosyasına bakın; hata orada yazar.

## Parola unutulursa

Panelde uygulamanın **Run JS script** düğmesinden `admin:reset-password` komutunu
çalıştırın. Yeni parola `meka/.admin-login.txt` dosyasına yazılır; Dosya Yöneticisi ile
okuyup güvenli bir yere aldıktan sonra dosyayı silin. Bu işlem açık oturumları kapatır.

## Güncelleme

Yeni `meka-hosting.zip` dosyasını aynı yere yükleyip `meka` klasörünün üzerine çıkarın
ve uygulamayı **Restart** edin. `uploads` klasörü ve `.env` dosyası pakette yer
almadığı için yerinde kalır; `meka` klasörünü silmeyin. Güncelleme notunda "bağımlılık
değişti" yazıyorsa önce **Run NPM Install** yapın.

## Yedek

Hosting'in haftalık yedeğine ek olarak, yönetim panelindeki **Yedekleme → Kayıtları
indir** ile kayıtların bir kopyasını ara sıra bilgisayarınıza alın. Fotoğraflar
`meka/uploads` klasöründedir.
