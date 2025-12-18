document.addEventListener('DOMContentLoaded', () => {
    const storyList = document.getElementById('story-list');
    const sidePanel = document.getElementById('side-panel');
    const toggleBtn = document.getElementById('toggle-panel');
    const searchInput = document.getElementById('search-input');
    let allStories = [];

    // Load danh sách truyện
    fetch('/config/stories.json')
        .then(r => r.json())
        .then(stories => {
            allStories = stories;
            renderStories(stories);
            setupGenreFilter();
        });

    // Render danh sách truyện
    function renderStories(list) {
        storyList.innerHTML = '';
        if (list.length === 0) {
            storyList.innerHTML = '<p class="non-story">Không tìm thấy truyện nào</p>';
            return;
        }

        list.forEach(story => {
            const link = story.page
                ? `${story.page}?file=${story.file}`
                : `story.html?file=${story.file}`;

            const card = document.createElement('div');
            card.className = 'story-card';
            card.innerHTML = `
                <div class="genre-tag">${getGenreName(story.type)}</div>
                <h2>${story.title}</h2>
                <p>${story.description}</p>
                <a href="${link}">Đọc ngay</a>
            `;
            storyList.appendChild(card);
        });
    }

    function getGenreName(type) {
        const map = {
            'ngon-tinh': 'Ngôn Tình',
            'tien-hiep': 'Tiên Hiệp',
            'kinh-di': 'Kinh Dị',
            'hanh-dong': 'Hành Động',
            'khoa-huyen': 'Khoa Học Viễn Tưởng',
            'hai-huoc': 'Hài Hước'
        };
        return map[type] || 'Khác';
    }

    // Lọc theo thể loại
    function setupGenreFilter() {
        document.querySelectorAll('.genre-list li').forEach(item => {
            item.addEventListener('click', () => {
                // Active class
                document.querySelectorAll('.genre-list li').forEach(li => li.classList.remove('active'));
                item.classList.add('active');

                const type = item.getAttribute('data-type');
                renderStories(type === 'all' ? allStories : allStories.filter(s => s.type === type));

                // Mobile: đóng panel sau khi chọn
                if (window.innerWidth <= 768) {
                    sidePanel.classList.add('collapsed');
                    sidePanel.classList.remove('expanded');
                    updateToggleIcon();
                }
            });
        });
    }

    function updateToggleIcon() {
        const icon = toggleBtn.querySelector('i');
        if (sidePanel.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        } else {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        }
    }

    toggleBtn.addEventListener('click', () => {
        const willBeCollapsed = !sidePanel.classList.contains('collapsed');

        sidePanel.classList.toggle('collapsed');

        if (window.innerWidth <= 992) {
            sidePanel.classList.toggle('expanded', !willBeCollapsed);
        }

        const onTransitionEnd = (e) => {
            if (e.propertyName === 'width' || e.propertyName === 'max-height') {
                updateToggleIcon();
                sidePanel.removeEventListener('transitionend', onTransitionEnd);
            }
        };
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();

            // Lấy thể loại đang được chọn
            const activeGenreItem = document.querySelector('.genre-list li.active');
            const activeType = activeGenreItem ? activeGenreItem.getAttribute('data-type') : 'all';

            let filtered = allStories;

            // Nếu không phải "all" → lọc theo thể loại trước
            if (activeType !== 'all') {
                filtered = allStories.filter(story => story.type === activeType);
            }

            // Sau đó lọc theo từ khóa tìm kiếm
            if (query) {
                filtered = filtered.filter(story =>
                    story.title.toLowerCase().includes(query) ||
                    (story.description && story.description.toLowerCase().includes(query))
                );
            }

            renderStories(filtered);
        });
    }
});