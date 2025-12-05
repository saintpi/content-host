// Parsing the URL to serve the correct file.
function loadContent() {
    const path = window.location.pathname.split("/");
    const file = path[path.length - 1];

    if (file.endsWith(".pdf")) {
        renderPDF(file);
    } else if (file.endsWith(".html")) {
        fetch(`pages/${file}`)
            .then(response => response.text())
            .then(html => document.getElementById("content").innerHTML = html)
            .catch(err => console.error('Failed to load page', err));
    } else {
        document.getElementById("content").innerHTML = '<p>Page not found.</p>';
    }
}

// Using PDF.js to render PDFs.
function renderPDF(file) {
    const url = `pages/${file}`;

    const loadingTask = pdfjsLib.getDocument(url);

    loadingTask.promise.then(pdf => {
        // Get the first page.
        return pdf.getPage(1).then(page => {
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });

            // Prepare canvas using PDF page dimensions
            const canvas = document.createElement('canvas');
            document.getElementById("content").appendChild(canvas);

            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
        });
    }, reason => {
        console.error(reason);
    });
}

loadContent();
window.addEventListener('popstate', loadContent);