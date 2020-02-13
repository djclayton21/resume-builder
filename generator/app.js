//grab stuff
const showdown = new window.showdown.Converter();
const previewContainer = document.querySelector('#preview');
const fileName = document.querySelector('#fileName');
//setup file reader
const mdReader = new FileReader();
mdReader.onload = event => {
  const mdText = event.target.result;
  //TODO: validate markdown
  saveToLocal(mdText);
  mdInputArea.value = mdText;

  const html = showdown.makeHtml(mdText);
  const resume = convert(html);
  preview(resume);
};
mdReader.onerror = () => {
  console.error('File could not be loaded');
};

//upload and read markdown file
const upload = document.querySelector('#file-upload');
upload.addEventListener('change', event => {
  const file = event.target.files[0];
  mdReader.readAsText(file);
});
//handle changes to text area
const mdInputArea = document.querySelector('#markdown-textarea');
mdInputArea.addEventListener('input', event => {
  const mdText = event.target.value;
  //TODO: validate and clean input. #yolo
  saveToLocal(mdText);
  const html = showdown.makeHtml(mdText);
  const resume = convert(html); //create dom nodes and wrap h2s in sections
  preview(resume);
});

//local storage
function saveToLocal(mdText) {
  localStorage.setItem('mdResume', mdText);
}
function getFromLocal() {
  const mdText = localStorage.getItem('mdResume');
  mdInputArea.value = mdText;
  const html = showdown.makeHtml(mdText);
  const resume = convert(html);
  preview(resume);
}

//convert text to html and transform
function convert(html) {
  const resumeSections = [];

  const temp = document.createElement('template');
  temp.innerHTML = html;
  const elements = [...temp.content.children];

  elements.forEach(element => {
    if (element.tagName === 'H2' || element.tagName === 'H1') {
      //create a new section for h2s
      const newSection = document.createElement('section');
      newSection.id = `section${resumeSections.length + 1}`;
      newSection.appendChild(element);
      resumeSections.push(newSection);
    } else if (resumeSections.length) {
      //for other elements, append to last section
      resumeSections[resumeSections.length - 1].appendChild(element);
    }
  });
  return resumeSections;
}
//preview resume to preview
function preview(sections) {
  previewContainer.innerHTML = '';
  sections.forEach(section => previewContainer.appendChild(section));
  updateFileName();
}
//change resume style
const resumeStylesheets = document.querySelectorAll('.resume-style');
const styleForm = document.querySelector('#style-form');
styleForm.addEventListener('change', selectStyle);

resumeStylesheets.forEach(style => {
  if (style.title !== styleForm.style.value) {
    style.disabled = true;
  }
});
function selectStyle() {
  const newStyle = this.style.value;
  resumeStylesheets.forEach(style => {
    if (style.title === newStyle) {
      style.disabled = false;
    } else {
      style.disabled = true;
    }
  });
  updateFileName();
}
//add current style to the end of filename
function updateFileName() {
  const heading = previewContainer.querySelector('h1').textContent;
  const words = heading.split(' ');
  words.push('resume')
  words.push(styleForm.style.value);//append current style selection

  fileName.textContent = words.join('_');
  document.title = fileName.textContent;
}
//print preview window
const printButton = document.querySelector('#print-button');
printButton.addEventListener('click', () => {
  window.print();
});

getFromLocal();
