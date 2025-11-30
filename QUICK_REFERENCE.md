# 🚀 Quick Reference Card

## ⚡ Most Common Tasks

### Open Admin Panel
```
Right-click: admin/admin.html
→ Open with Live Server
```

### Add Project
1. Admin Panel → "Add New Project"
2. Fill form → "Save Project"
3. Download JSON → Replace `data/projects.json`
4. Refresh portfolio

### Edit Project
1. Admin Panel → Find project → "Edit"
2. Update info → "Save"
3. Download JSON → Replace file
4. Refresh

### Delete Project
1. Admin Panel → Find project → "Delete"
2. Confirm → "Save"
3. Download JSON → Replace file
4. Refresh

---

## 📂 File Locations

| What | Where |
|------|-------|
| Admin Panel | `admin/admin.html` |
| Portfolio | `index.html` |
| Projects Data | `data/projects.json` |
| Main CSS | `css/modern.css` |
| Main JS | `js/main.js` |
| Images | `image/project-name/` |

---

## 🎨 Image Path Format

```
✅ CORRECT:
   image/my-project/screenshot.jpg

❌ WRONG:
   d:\Omar\My_Portfolio\image\...
   \image\my-project\...
```

Always use forward slashes `/` and relative paths!

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Projects not loading | Check `data/projects.json` exists |
| Images not showing | Verify image path is correct |
| Admin won't save | Use Live Server, not file:// |
| Changes not visible | Hard refresh: `Ctrl + F5` |

---

## 💾 Backup

**Export Projects:**
1. Admin Panel → Settings
2. Click "Export Projects"
3. Save file somewhere safe

**Restore Projects:**
1. Admin Panel → Settings
2. Click "Import Projects"
3. Select backup file

---

## 📱 Project Fields

| Field | Required | Example |
|-------|----------|---------|
| Title | ✅ Yes | "My Awesome App" |
| Category | ✅ Yes | mobile / web / ui |
| Image | ✅ Yes | image/app/photo.jpg |
| Description | ✅ Yes | Brief project description |
| Details Page | ❌ No | project-details.html |
| GitHub Link | ❌ No | https://github.com/... |
| Technologies | ❌ No | Flutter, Firebase |
| Featured | ❌ No | ☑ Check if featured |

---

## 🌐 Deploy Commands

**GitHub Pages:**
```powershell
git add .
git commit -m "Update portfolio"
git push origin main
```

**Netlify:**
Drag & drop `My_Portfolio` folder → [netlify.com](https://netlify.com)

---

## 📞 Important URLs

| Service | URL |
|---------|-----|
| Live Server | `http://localhost:5500` |
| Admin Panel | `http://localhost:5500/admin/admin.html` |
| Portfolio | `http://localhost:5500/index.html` |

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Hard Refresh | `Ctrl + F5` |
| Open DevTools | `F12` |
| Clear Cache | `Ctrl + Shift + Delete` |
| Save File | `Ctrl + S` |

---

## 📚 Documentation Quick Links

- 📘 [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup
- 📖 [admin/README.md](admin/README.md) - Admin guide
- 📊 [ARCHITECTURE.md](ARCHITECTURE.md) - System overview
- 🎉 [MODERNIZATION_SUMMARY.md](MODERNIZATION_SUMMARY.md) - What changed

---

## ✅ Pre-Deploy Checklist

- [ ] All projects have images
- [ ] All links work
- [ ] Contact form configured
- [ ] Resume updated
- [ ] About section current
- [ ] Social links correct
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Images optimized
- [ ] Data backed up

---

## 🎯 Remember

1. **Always** use admin panel to update projects
2. **Never** edit `projects.json` manually
3. **Always** replace file after saving
4. **Always** test before deploying
5. **Backup** regularly!

---

## 📞 Emergency Commands

**Validate JSON:**
```powershell
Get-Content data/projects.json | ConvertFrom-Json
```

**Count Projects:**
```powershell
(Get-Content data/projects.json | ConvertFrom-Json).projects.Count
```

**List Projects:**
```powershell
(Get-Content data/projects.json | ConvertFrom-Json).projects.title
```

---

**Keep this card handy! 📌**

*Last updated: November 30, 2025*
