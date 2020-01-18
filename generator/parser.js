const resume = document.querySelector('#resume-container');
const markdownInput = document.querySelector('#markdown-input');
const markdownForm = document.querySelector('#markdown-form');

const showdown = new window.showdown.Converter();
const reader = new FileReader();
reader.onload = event => {
  const mdText = event.target.result;
  const mdHtml = showdown.makeHtml(mdText);
  //do we need to clean?
  resume.innerHTML = mdHtml;
};
reader.onerror = () => {
  console.error('File could not be loaded');
};

markdownForm.addEventListener('submit', event => {
  event.preventDefault();
  const file = markdownInput.files[0];
  reader.readAsText(file);
});
//read file function
//convert file function
//transform file function
