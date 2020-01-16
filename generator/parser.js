const showdown = window.showdown;
const mdConverter = new showdown.Converter();

const resume = document.querySelector('#resume-container');
const markdownInput = document.querySelector('#markdown-input');
const markdownForm = document.querySelector('#markdown-form');

markdownForm.addEventListener('submit', async event => {
  event.preventDefault();
  const markdownFile = markdownInput.files[0];
  const text = await markdownFile.text();
  const html = mdConverter.makeHtml(text);
  resume.innerHTML = html;
});
