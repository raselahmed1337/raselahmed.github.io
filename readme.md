with open(os.path.join(folder_name, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html_content)
print("✅ Created: index.html")

# 4. Define the content for README.md
readme_content = """# Rasel Ahmed - Personal Portfolio

This repository contains the source code for my personal academic portfolio website, deployed via GitHub Pages.

## 🚀 Deployment Instructions

1. Create a new public repository on GitHub named `raselahmed1337.github.io` (replace `raselahmed1337` with your actual GitHub username).
2. Push the contents of this folder to the `main` branch of that repository.
3. Go to **Settings** > **Pages**.
4. Under **Build and deployment**, select `main` branch and `/ (root)` folder, then click **Save**.
5. Your site will be live at `https://raselahmed1337.github.io` within a few minutes.

## 📁 Folder Structure
- `index.html`: The main website file (contains both HTML structure and CSS styling).
- `README.md`: This file.
- `.gitignore`: Ignores unnecessary system files.
"""

with open(os.path.join(folder_name, "README.md"), "w", encoding="utf-8") as f:
    f.write(readme_content)
print("✅ Created: README.md")

# 5. Define .gitignore
gitignore_content = """.DS_Store
Thumbs.db
*.swp
*.swo
*~
"""

with open(os.path.join(folder_name, ".gitignore"), "w", encoding="utf-8") as f:
    f.write(gitignore_content)
print("✅ Created: .gitignore")

print(f"\n🎉 Success! All files have been created in the '{folder_name}' folder.")
print("You can now open this folder, review the files, and push them to GitHub.")