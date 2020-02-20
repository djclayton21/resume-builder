//grab stuff
const showdown = new window.showdown.Converter();
const previewContainer = document.querySelector('#preview');
const fileName = document.querySelector('#fileName');
const resumeStylesheets = document.querySelectorAll('.resume-style');
const mdInputArea = document.querySelector('#markdown-textarea');

//setup file reader
const mdReader = new FileReader();
mdReader.onload = event => {
  const mdText = event.target.result;
  handleMarkdownUpdate(mdText);
};
mdReader.onerror = () => {
  console.error('File could not be loaded');
};
//check for saved resume
window.onload = () => {
  localStorage.length ? getFromLocal() : getPlaceholder();
};

// initialize resume style to flat
resumeStylesheets.forEach(style => {
  if (style.title !== 'flat') {
    style.disabled = true;
  }
});

//listen for mardown file upload and read
const upload = document.querySelector('#file-upload');
upload.addEventListener('change', event => {
  const file = event.target.files[0];
  mdReader.readAsText(file);
});

//handle markdown text
function handleMarkdownUpdate(mdText) {
  //TODO: validate/clean
  mdInputArea.value = mdText;
  const html = showdown.makeHtml(mdText);
  const sections = convert(html);
  preview(sections);
  updateFileName();
  saveToLocal(mdText);
}
//listen for edits
mdInputArea.addEventListener('input', event => {
  const mdText = event.target.value;
  handleMarkdownUpdate(mdText);
});

//local storage
function saveToLocal(text) {
  localStorage.setItem('mdResume', text);
}
function getFromLocal() {
  const mdText = localStorage.getItem('mdResume');
  handleMarkdownUpdate(mdText);
}
//new resume
document.querySelector('#new-button').addEventListener('click', handleNew);
function handleNew() {
  const confirm = window.confirm(
    'All unsaved changest will be lost. Are you sure?'
  );
  if (confirm) {
    localStorage.clear();
    getPlaceholder();
  }
}
//save markdown file
document.querySelector('#save-button').addEventListener('click', saveMarkdown);
function saveMarkdown() {
  const name =
    fileName.textContent.slice(0, fileName.textContent.lastIndexOf('_')) +
    '_content';
  const mdFile = new File([mdInputArea.value], `${name}.md`, {
    type: 'text/markdown'
  });
  console.dir(mdFile);
  const url = URL.createObjectURL(mdFile);
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', url);
  downloadLink.setAttribute('download', mdFile.name);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(url);
}

//process html elements into sections
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
      newSection.classList.add(
        `section-${element.textContent
          .split(' ')
          .join('_')
          .toLowerCase()}`
      );
      newSection.appendChild(element);
      resumeSections.push(newSection);
    } else if (resumeSections.length) {
      //for other elements, append to last section
      resumeSections[resumeSections.length - 1].appendChild(element);
    }
  });
  return resumeSections;
}

//display sections to preview
function preview(sections) {
  previewContainer.innerHTML = '';
  sections.forEach(section => previewContainer.appendChild(section));
}

//change resume styles
const styleForm = document.querySelector('#style-form');
styleForm.addEventListener('change', selectStyle);

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

//document filename/title
function updateFileName() {
  const heading = previewContainer.querySelector('h1').textContent;
  const words = heading.split(' ');
  words.push('resume');
  words.push(styleForm.style.value); //append current style selection

  fileName.textContent = words.join('_');
  document.title = fileName.textContent;
}

//print (and save pdf)
const printButton = document.querySelector('#print-button');
printButton.addEventListener('click', () => {
  window.print();
});

//get placeholder resume
function getPlaceholder() {
  fetch('placeholder.md')
    .then(response => response.text())
    .then(text => handleMarkdownUpdate(text));
}
