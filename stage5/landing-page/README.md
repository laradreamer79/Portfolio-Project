# Oyster Landing Page

صفحة هبوط مستقلة مبنية بـ React وVite. لا تعدّل تطبيق Oyster الموجود في مجلد `Portfolio-Project`.

## تشغيل محلي

```bash
npm install
npm run dev
```

## النشر على GitHub Pages

1. افتحي Pull Request من فرع `feat/react-landing-page`.
2. من **Settings → Pages** اختاري **GitHub Actions** كمصدر للنشر.
3. عند تشغيل Workflow باسم **Deploy landing page to GitHub Pages** سيظهر رابط الصفحة في نتيجة التشغيل.

ملف النشر موجود في جذر المشروع: `.github/workflows/deploy-landing-page.yml`. صفحة React هي مصدر الواجهة؛ `index.html` مجرد نقطة تشغيل لـ Vite ولا يحتوي أي تصميم.
