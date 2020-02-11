//grab stuff
const uploadForm = document.querySelector('#upload-form');
const mdTextArea = document.querySelector('#markdown-textarea');
const preview = document.querySelector('#preview');
const fileName = document.querySelector('#fileName');
const printButton = document.querySelector('#print-button');

//file reader
const showdown = new window.showdown.Converter();
const mdReader = new FileReader();
mdReader.onload = event => {
  const mdText = event.target.result;
  //TODO: validate markdown
  mdTextArea.value = mdText;
  const html = showdown.makeHtml(mdText);
  const resume = convert(html); //create dom nodes and wrap h2s in sections
  display(resume);
};

mdReader.onerror = () => {
  console.error('File could not be loaded');
};

//upload markdown
uploadForm.addEventListener('submit', event => {
  event.preventDefault();
  const upload = event.target.querySelector('#upload-input').files[0];
  //TODO: validate file type
  mdReader.readAsText(upload);
});

//live preview
mdTextArea.addEventListener('input', event => {
  const mdText = event.target.value;
  //TODO: validate and clean input. #yolo
  const html = showdown.makeHtml(mdText);
  const resume = convert(html); //create dom nodes and wrap h2s in sections
  display(resume);
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

//display resume to preview
function display(resume) {
  fileName.textContent = resume.fileName;
  document.title = resume.fileName;
  preview.innerHTML = '';

  resume.sections.forEach(section => preview.appendChild(section));
}

//change resume style
const resumeStyles = document.querySelectorAll('.alternate');
resumeStyles.forEach(style => (style.disabled = true));
function selectStyle() {
  const newStyle = this.style.value;
  resumeStyles.forEach(style => {
    if (style.title === newStyle) {
      style.disabled = false;
    } else {
      style.disabled = true;
    }
  });
}

const styleForm = document.querySelector('#style-form');
styleForm.addEventListener('change', selectStyle);
console.dir(styleForm);
//print current version
printButton.addEventListener('click', () => {
  window.print();
});
