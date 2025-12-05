document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const storyFile = urlParams.get('file');

    const storyTitle = document.getElementById('story-title');
    const storyContent = document.getElementById('story-content');
    const nextBtn = document.getElementById('next-phase');

    let currentPhase = 0;
    let phases = [];

    fetch(`/assets/stories/${storyFile}`)
        .then(r => r.json())
        .then(data => {
            storyTitle.textContent = data.title;
            phases = data.phases;
            displayPhase(0);

            if (phases.length > 1) {
                nextBtn.style.display = 'block';
            }
        });

    function displayPhase(index) {
        storyContent.textContent = phases[index].content;
        currentPhase = index;

        if (index === phases.length - 1) {
            nextBtn.style.display = 'none';
            nextBtn.textContent = "Đã hết truyện";
        } else {
            nextBtn.textContent = "Xem tiếp";
            nextBtn.disabled = false;
        }
    }

    nextBtn.addEventListener('click', () => {
        nextBtn.disabled = true;
        nextBtn.textContent = "Đang tải quảng cáo...";

        AdsManager.showRewarded((success) => {
            if (success) {
                displayPhase(currentPhase + 1);
            } else {
                nextBtn.disabled = false;
                nextBtn.textContent = "Xem quảng cáo để đọc tiếp";
            }
        });
    });
});