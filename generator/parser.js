const showdown = new window.showdown.Converter();
const reader = new FileReader();

const uploadForm = document.querySelector('#upload-form');
const mdTextArea = document.querySelector('#markdown-textarea');
const preview = document.querySelector('#preview');

//upload markdown file
reader.onload = event => {
  const mdText = event.target.result;
  //TODO: validate markdown
  mdTextArea.value = mdText;
  const html = showdown.makeHtml(mdText);
  preview.innerHTML = html;
};
reader.onerror = () => {
  console.error('File could not be loaded');
};
uploadForm.addEventListener('submit', event => {
  event.preventDefault();
  const upload = event.target.querySelector('#upload-input').files[0];
  //TODO: validate file type
  reader.readAsText(upload);
});

//convert to html and transform
mdTextArea.addEventListener('input', event => {
  const mdText = event.target.value;
  //TODO: validate and clean input. #yolo
  const html = showdown.makeHtml(mdText);
  preview.innerHTML = html;
});
// function wrapSections(html) {
//   //wrap each h2 in a section tag with a matching id
//   //wrap each section
// }
