document.addEventListener('DOMContentLoaded', () => {
  const blogEditor = document.querySelector('#blog_article_body');
  
  if (blogEditor) {
    const tocButton = document.createElement('button');
    tocButton.textContent = 'Generate TOC';
    tocButton.className = 'btn btn-primary';
    tocButton.style.margin = '10px 0';
    
    tocButton.addEventListener('click', async () => {
      const content = blogEditor.value;
      const response = await fetch('/generate-toc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      
      const { tocHtml, modifiedContent } = await response.json();
      blogEditor.value = `${tocHtml}\n${modifiedContent}`;
    });
    
    blogEditor.parentNode.insertBefore(tocButton, blogEditor);
  }
});