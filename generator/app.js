//setup
const showdown = new window.showdown.Converter();
const mdReader = new FileReader();

//grab stuff
const uploadForm = document.querySelector('#upload-form');
const mdTextArea = document.querySelector('#markdown-textarea');
const preview = document.querySelector('#preview');
const fileName = document.querySelector('#fileName');
const printButton = document.querySelector('#print-button');

//file reader
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
      resume.fileName = element.textContent.split(' ').join('_');
    } else if (element.tagName === 'H2') {
      const newSection = document.createElement('section');
      newSection.className = `section ${element.textContent
        .split(' ')
        .join('_')}`;
      newSection.appendChild(element);
      resume.sections.unshift(newSection);
    } else if (resume.sections.length) {
      resume.sections[0].appendChild(element);
    }
  });
  resume.sections.reverse();
  return resume;
}
//display resume to preview
function display(resume) {
  document.title = resume.fileName;
  resume.sections.forEach(section => preview.appendChild(section));
}

//print styled version
printButton.addEventListener('click', () => {
  window.print();
});
