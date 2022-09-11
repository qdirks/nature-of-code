# I'm following along the Nature of Code exercises and examples by Daniel Shiffman at https://natureofcode.com/book/

# All of the code here was developed on Windows using the Microsoft VSCode editor.

# Symlinks are used in this project in order to avoid duplication of shared files and folders.

# Navigate to the `shared` folder and run `npm install` to install required packages.

# Symlinks are used in this project.
- Creating/copying symlinks requires admin privileges.
- The `newsketch.bat` command copies symlinks in the template folder, first checking for admin privileges and exiting if it does not have the privilege to copy the symlinks properly.
- You can right-click the `codehere.bat` file to run it as administrator, which should open Microsoft VSCode as administrator. This allows you to run the `newsketch` command from within the integrated terminal.

# A bundler is used in this project to bundle all of your javascript files into one file which then gets included by a script tag in the html file.

# The `newsketch` command will also run the `gulp` command, which starts a server for the sketch directory and opens a browser tab for you to see your work in.

# The use of browser-sync allows the sketch in your browser tab to be updated automatically when you save changes to a javascript or css file.