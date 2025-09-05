# 🌍 Karbon Ayak İzi Blockchain Projesi

Bu proje, kullanıcıların karbon ayak izlerini takip edebilmeleri ve verilerin **Blockchain mantığıyla güvenli şekilde saklanabilmesi** için geliştirilmiştir.  
Frontend (React) ve Backend (Python API) olmak üzere iki bileşenden oluşmaktadır.

---

## 🚀 Özellikler

- 👤 **Kullanıcı Kayıt & Giriş**: Kullanıcılar sisteme kayıt olabilir ve giriş yapabilir.  
- 📝 **İşlem Ekleme**: Kullanıcılar kendi aktivitelerini (örn: ulaşım, enerji kullanımı) ekleyebilir.  
- 🔒 **Kullanıcı Görünürlüğü**: Her kullanıcı yalnızca **kendi bloklarını** görebilir.  
- 🛠 **Admin Paneli**: Admin tüm zinciri görüntüleyebilir.  
- 🔗 **Blockchain Doğrulama**:  
  - Her bloğun `previous_hash` alanı, bir önceki bloğun `hash` değeri ile eşleşir.  
  - Eğer veritabanında herhangi bir bilgi değiştirilirse, admin **"Zinciri Doğrula"** butonuna bastığında zincirin bozulduğu raporlanır.  

---

## 🖼️ Ekran Görüntüleri

<table>
  <tr>
    <td><img src="/login.png" width="400"/></td>
    <td><img src="/user-dashboard.png" width="400"/></td>
  </tr>
  <tr>
    <td align="center">🔐 Giriş Ekranı</td>
    <td align="center">📝 Kullanıcı Paneli</td>
  </tr>
  <tr>
    <td><img src="/admin-dashboard.png" width="400"/></td>
    <td><img src="/db.png" width="400"/></td>
  </tr>
  <tr>
    <td align="center">🛠 Admin Paneli</td>
    <td align="center">🗄️ Veri Tabanı Görünümü</td>
  </tr>
  <tr>
    <td><img src="/broken-block.png" width="400"/></td>
    <td><img src="/backend-api.png" width="400"/></td>
  </tr>
  <tr>
    <td align="center">⚠️ Zincir Bozuldu Uyarısı</td>
    <td align="center">📑 Backend API</td>
  </tr>
</table>

---

---

## 🛠 Kurulum

### 1. Backend (Python API)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

### 2. Frontend (REACT)
```bash
cd client
npm install
npm start


