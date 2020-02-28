# Resume Builder

This is a tool to help style resumes written in markdown in CSS. Once you set up your styles, its easy to edit the content and quickly print a new version or save a PDF. It also includes a generic flat style to submit to online tracking stystems.

## Basic Usage

1. Clone this repository
2. Open `index.html` in your browser
3. Replace placeholder tips and content with your own in basic markdown styntax
   - Edit in the browser for live updates **-OR-**
   - Save a copy and use your text editor
4. Edit `custom.css` in the templates folder to create a custom style
5. Download or print a copy of the active style using Print to PDF
   - Chrome's print to pdf is best at saving links
   - You may need to adjust page margins if your resume is more than one page

## Under the hood

Markdown is converted to html tags using [showdown.js](http://showdownjs.com/). The content is wrapped in section tags based on first-level (`<h1>`) and second-level (`<h2>`) headings. All other content is appended under the the most recent section.

Using HTML not included in the markdown spec is also viable; it will be perserved, and will also be grouped into the most recent section/heading.

For styling and layout, each section is given a sequential `#id` prefaced with `section-` and a `.classname` with its lowercase text content. Spaces replaced with underscores.

## Todo

This project currently has a very basic form, with lots of room for improvement and new features. If you have any suggestions, I'd love to hear them, or feel free to work it yourself!

Some stuff I have in mind:

- make it prettier
- wrap lower level headings in sub sections for easier styling
- convert files to `.docx` for better tracking system scanability
- create style templates with adjustable color, font, etc.
- allow CSS tweaks and file saving in browser
- make/find a better in-browser text editor
- parse and clean markdown input so that it can be safely hosted **-OR-** convert to an Electron app
