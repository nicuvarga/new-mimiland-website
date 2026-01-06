// Hidden access to admin
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        window.location.href = 'admin.html';
    }
});

// Admin functionality
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        const pageSelect = document.getElementById('page');
        const contentTextarea = document.getElementById('content');
        const form = document.querySelector('form');

        // Add gallery upload section
        const gallerySection = document.createElement('div');
        gallerySection.innerHTML = `
            <h3>Gallery Upload</h3>
            <input type="file" id="galleryFileInput" accept="image/*" multiple>
            <select id="galleryCategory">
                <option value="rides">Rides</option>
                <option value="events">Events</option>
                <option value="ice-rink">Ice Rink</option>
            </select>
            <input type="text" id="galleryCaption" placeholder="Image Caption">
            <button type="button" id="uploadGalleryBtn">Upload to Gallery</button>
        `;
        form.appendChild(gallerySection);

        // Add file input for images
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.id = 'imageInput';
        contentTextarea.parentNode.insertBefore(fileInput, contentTextarea.nextSibling);
        const br = document.createElement('br');
        fileInput.parentNode.insertBefore(br, fileInput.nextSibling);

        // Add season toggle button
        const seasonButton = document.createElement('button');
        seasonButton.type = 'button';
        seasonButton.textContent = 'Toggle Season';
        form.appendChild(seasonButton);

        // Load content on page select change
        pageSelect.addEventListener('change', function () {
            const page = this.value;
            const content = localStorage.getItem(`content_${page}`) || '';
            contentTextarea.value = content;
            // For image, if stored, but since no display, maybe not load
        });

        // Handle file upload
        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const dataURL = e.target.result;
                    const page = pageSelect.value;
                    localStorage.setItem(`image_${page}`, dataURL);
                    alert('Image uploaded and saved.');
                };
                reader.readAsDataURL(file);
            }
        });

        // Save content on form submit
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitButton = form.querySelector('input[type="submit"]') || form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                const originalText = submitButton.value || submitButton.textContent;
                submitButton.textContent = '';
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                submitButton.appendChild(spinner);
            }
            const page = pageSelect.value;
            const content = contentTextarea.value;
            localStorage.setItem(`content_${page}`, content);
            // Simulate loading
            setTimeout(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    submitButton.removeChild(submitButton.querySelector('.spinner'));
                }
                alert('Content saved.');
            }, 500);
        });

        // Gallery upload
        const uploadGalleryBtn = document.getElementById('uploadGalleryBtn');
        const galleryFileInput = document.getElementById('galleryFileInput');
        const galleryCategory = document.getElementById('galleryCategory');
        const galleryCaption = document.getElementById('galleryCaption');

        uploadGalleryBtn.addEventListener('click', function () {
            const files = galleryFileInput.files;
            if (files.length === 0) {
                alert('Please select images to upload.');
                return;
            }
            const category = galleryCategory.value;
            const caption = galleryCaption.value || 'Gallery Image';

            let galleryImages = JSON.parse(localStorage.getItem('gallery_images')) || [];

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    galleryImages.push({
                        src: e.target.result,
                        category: category,
                        caption: caption
                    });
                    localStorage.setItem('gallery_images', JSON.stringify(galleryImages));
                };
                reader.readAsDataURL(file);
            });

            alert('Images uploaded to gallery.');
            galleryFileInput.value = '';
            galleryCaption.value = '';
        });

        // Season toggle
        seasonButton.addEventListener('click', function () {
            const seasons = ['winter', 'spring', 'summer', 'autumn'];
            const current = localStorage.getItem('current_season') || 'winter';
            const nextIndex = (seasons.indexOf(current) + 1) % seasons.length;
            localStorage.setItem('current_season', seasons[nextIndex]);
            location.reload();
        });

        // Load initial content
        pageSelect.dispatchEvent(new Event('change'));
    });
}