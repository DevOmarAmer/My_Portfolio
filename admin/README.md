# 🎨 Portfolio Admin Panel

A simple, user-friendly admin interface to manage your portfolio projects without editing HTML files.

## 🚀 Features

- ✅ **Add/Edit/Delete Projects** - Full CRUD operations
- 👁️ **Live Preview** - See how your project will look while editing
- 📦 **Export/Import** - Backup and restore your projects data
- 🎯 **Category Management** - Organize projects by type (Mobile, Web, UI/UX)
- ⭐ **Featured Projects** - Mark important projects
- 📱 **Responsive Design** - Works on desktop and mobile

## 📂 File Structure

```
admin/
├── admin.html          # Main admin panel interface
├── admin-style.css     # Styling for admin panel
├── admin-script.js     # Admin panel functionality
└── README.md          # This file

data/
└── projects.json      # Your projects data
```

## 🎯 How to Use

### 1. Open Admin Panel

Open `admin/admin.html` in your browser:
```
file:///d:/Omar/My_Portfolio/admin/admin.html
```

Or use VS Code Live Server extension.

### 2. Add a New Project

1. Click **"Add New Project"** button
2. Fill in the form:
   - **Title**: Your project name
   - **Primary Category**: Main category (Mobile/Web/UI)
   - **Additional Categories**: Check all that apply
   - **Image Path**: Relative path from portfolio root (e.g., `image/project-name/photo.jpg`)
   - **Description**: Brief project description
   - **Details Page**: Link to detailed page (e.g., `project-details.html`)
   - **GitHub Link**: Your GitHub repository URL
   - **Technologies**: Comma-separated list (e.g., `Flutter, Firebase, Dart`)
   - **Featured**: Check if this is a featured project
3. Click **"Save Project"**
4. **Important**: Download the generated `projects.json` file
5. Replace `data/projects.json` with the downloaded file

### 3. Edit Existing Project

1. Find the project in the list
2. Click **"Edit"** button
3. Update the information
4. Click **"Save Project"**
5. Download and replace `projects.json` file

### 4. Delete a Project

1. Find the project you want to remove
2. Click **"Delete"** button
3. Confirm the deletion
4. Download and replace `projects.json` file

### 5. Export/Import Data

**Export**:
- Go to Settings tab
- Click "Export Projects"
- Save the JSON file as backup

**Import**:
- Go to Settings tab
- Click "Import Projects"
- Select your backup JSON file

## 📸 Adding Project Images

1. Create a folder in `image/` directory with your project name:
   ```
   image/
   └── my-new-project/
       └── photo.jpg
   ```

2. Reference it in the admin panel:
   ```
   image/my-new-project/photo.jpg
   ```

## ⚙️ Category System

Projects can have multiple categories:

- **Mobile**: Flutter/mobile apps
- **Web**: Web applications
- **UI**: UI/UX design projects

The **Primary Category** determines the badge label shown on the card.

## 🎨 Live Preview

The admin panel shows a real-time preview of how your project card will appear on the portfolio website. This updates as you type!

## 💾 Important Notes

1. **Save Your Work**: After making changes, always click "Save Project" to download the updated `projects.json` file.

2. **Replace the JSON File**: Copy the downloaded `projects.json` to `data/projects.json` in your portfolio folder.

3. **Backup Regularly**: Use the Export feature to keep backups of your projects.

4. **Image Paths**: Always use relative paths from the portfolio root directory.

5. **Required Fields**: Title, Category, Image, and Description are required.

## 🔧 Troubleshooting

**Projects not showing on website?**
- Make sure you replaced `data/projects.json` with the downloaded file
- Check browser console for errors
- Ensure image paths are correct

**Images not loading?**
- Verify the image file exists at the specified path
- Check that the path is relative to portfolio root
- Use forward slashes `/` in paths

**Preview not updating?**
- Make sure you're filling in the required fields
- Try refreshing the page

## 🎓 Tips

1. **Consistent Naming**: Use consistent naming for your image folders
2. **Optimize Images**: Keep image files under 500KB for fast loading
3. **Write Clear Descriptions**: Keep descriptions concise (150-200 characters)
4. **Use Relevant Technologies**: List 3-5 key technologies per project
5. **Regular Backups**: Export your data weekly

## 🌐 Viewing Changes

After updating `projects.json`:

1. Refresh your portfolio website (`index.html`)
2. Projects should load automatically
3. Use the filter buttons to test category filtering

## 📝 Example Project Entry

```json
{
  "id": "my-awesome-app",
  "title": "My Awesome App",
  "category": "mobile",
  "categories": ["mobile", "ui"],
  "image": "image/awesome-app/screenshot.jpg",
  "description": "A fantastic mobile application built with Flutter",
  "detailsPage": "awesome-app-details.html",
  "githubLink": "https://github.com/DevOmarAmer/awesome-app",
  "technologies": ["Flutter", "Firebase", "Provider"],
  "featured": true
}
```

## 🤝 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify all file paths are correct
3. Ensure `data/projects.json` is valid JSON
4. Try clearing browser cache

---

**Made with ❤️ for easy portfolio management**
