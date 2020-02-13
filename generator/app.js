//grab stuff
const uploadForm = document.querySelector('#upload-form');
const mdTextArea = document.querySelector('#markdown-textarea');
const previewContainer = document.querySelector('#preview');
const fileName = document.querySelector('#fileName');

//file reader
const showdown = new window.showdown.Converter();
const mdReader = new FileReader();
mdReader.onload = event => {
  const mdText = event.target.result;
  //TODO: validate markdown
  mdTextArea.value = mdText;
  const html = showdown.makeHtml(mdText);
  const resume = convert(html); //create dom nodes and wrap h2s in sections
  preview(resume);
};

mdReader.onerror = () => {
  console.error('File could not be loaded');
};

//upload markdown
uploadForm.addEventListener('submit', event => {
  event.preventDefault();
  const upload = event.target.querySelector('#upload-input').files[0];
  //TODO: validate
  mdReader.readAsText(upload);
});

//live preview
mdTextArea.addEventListener('input', event => {
  const mdText = event.target.value;
  //TODO: validate and clean input. #yolo
  const html = showdown.makeHtml(mdText);
  const resume = convert(html); //create dom nodes and wrap h2s in sections
  preview(resume);
});

//convert text to html and transform
function convert(html) {
  const resume = { sections: [], fileName: '' };

  const temp = document.createElement('template');
  temp.innerHTML = html;
  const elements = [...temp.content.children];

  elements.forEach(element => {
    if (element.tagName === 'H1') {
      //h1 to filename
      resume.fileName = element.textContent.split(' ').join('_');
    } else if (element.tagName === 'H2') {
      //create a new section for h2s
      const newSection = document.createElement('section');
      newSection.id = `section${resume.sections.length + 1}`;
      newSection.appendChild(element);
      resume.sections.push(newSection);
    } else if (resume.sections.length) {
      //for other elements, append to last section
      resume.sections[resume.sections.length - 1].appendChild(element);
    }
  });
  return resume;
}
//preview resume to preview
function preview(resume) {
  fileName.textContent = resume.fileName;
  updateFileName();
  previewContainer.innerHTML = '';
  resume.sections.forEach(section => previewContainer.appendChild(section));
}

//change resume style
const resumeStyles = document.querySelectorAll('.resume-style');
const styleForm = document.querySelector('#style-form');
styleForm.addEventListener('change', selectStyle);

resumeStyles.forEach(style => {
  if (style.title !== styleForm.style.value) {
    style.disabled = true;
  }
});

function selectStyle() {
  const newStyle = this.style.value;
  resumeStyles.forEach(style => {
    if (style.title === newStyle) {
      style.disabled = false;
    } else {
      style.disabled = true;
    }
  });
  updateFileName();
}

function updateFileName() {
  const oldFileName = fileName.textContent;
  const words = oldFileName.split('_');
  //get style names
  const styleNames = [];
  resumeStyles.forEach(style => styleNames.push(style.title));
  if (styleNames.includes(words[words.length - 1])) {
    words.pop();
    words.push(styleForm.style.value);
  } else {
    words.push(styleForm.style.value);
  }
  fileName.textContent = words.join('_');
  document.title = fileName.textContent;
}
//print preview window
const printButton = document.querySelector('#print-button');
printButton.addEventListener('click', () => {
  window.print();
});
