const ScrollLocker = (() => {
    let scrollX = 0;
    let scrollY = 0;

    const preventDefault = (e) => e.preventDefault();

    const freezeScroll = () => window.scrollTo(scrollX, scrollY);

    const preventKeyScroll = (e) => {
        const keysToBlock = [32, 33, 34, 35, 36, 37, 38, 39, 40];
        if (keysToBlock.includes(e.keyCode)) e.preventDefault();
    };

    const lock = () => {
        scrollX = window.scrollX || window.pageXOffset;
        scrollY = window.scrollY || window.pageYOffset;

        window.scrollTo(scrollX, scrollY);
        window.addEventListener('scroll', freezeScroll, { passive: false });
        window.addEventListener('wheel', preventDefault, { passive: false });
        window.addEventListener('touchmove', preventDefault, { passive: false });
        window.addEventListener('keydown', preventKeyScroll, false);
    };

    const unlock = () => {
        window.removeEventListener('scroll', freezeScroll);
        window.removeEventListener('wheel', preventDefault);
        window.removeEventListener('touchmove', preventDefault);
        window.removeEventListener('keydown', preventKeyScroll);
    };

    return { lock, unlock };
})();


document.addEventListener('DOMContentLoaded', () => {
    const $ = (selector) => document.querySelector(selector);

    const loadingScreen = $('#loading-screen');
    const loadingText = $('#loading-text');
    const letters = loadingText.querySelectorAll('#loading-sub-text');

    const scheduleImage = $('#schedule-image');
    const downloadButton = $('#download-button');
    const scheduleContainer = $('#schedule-list');

    const sheetUrl = 'https://script.google.com/macros/s/AKfycbwe1WcacsPWqhaGJKone_w4LIg-KySDTBOT_ySDZw5xK_PvRMuan2zdIi5HHyWywVga/exec';

    window.scrollTo({ top: 0, behavior: 'smooth' });
    ScrollLocker.lock();

    const animateLoadingLetters = () => {
        let index = 0;

        const highlightNext = () => {
            letters.forEach((letter) => letter.classList.remove('highlight'));
            letters[index].classList.add('highlight');
            index = (index + 1) % letters.length;
            setTimeout(highlightNext, 200);
        };

        highlightNext();
    };

    animateLoadingLetters();

    setTimeout(() => {
        document.documentElement.classList.remove('overflow-hidden');
        loadingScreen.classList.add('opacity-0');

        setTimeout(() => {
            loadingScreen.remove();
            ScrollLocker.unlock();
        }, 500);
    }, 3000);

    fetch(sheetUrl)
        .then((res) => res.json())
        .then((data) => {
            const {
                vtuberName,
                vtuberHeight,
                vtuberBirth,
                vtuberDebutDate,
                vtuberHobby,
                vtuberAbout,
                schedule
            } = data;

            $('#vtuber-name').textContent = vtuberName;
            $('#vtuber-height').textContent = vtuberHeight;
            $('#vtuber-birth').textContent = vtuberBirth;
            $('#vtuber-debut').textContent = vtuberDebutDate;
            $('#vtuber-hobby').textContent = vtuberHobby;
            $('#vtuber-about').textContent = vtuberAbout;

            schedule.forEach((item) => {
                const el = document.createElement('div');
                el.setAttribute('data-aos', 'fade-up');
                el.setAttribute('data-aos-delay', '500');
                el.setAttribute('data-aos-duration', '500');
                el.setAttribute('data-aos-easing', 'ease-in-out');
                el.className = 'bg-blue/55 py-1 rounded-lg';

                el.innerHTML = `
          <div class="bg-blue/60 shadow-inner shadow-black/30 w-full sm:w-96 md:w-[30rem] flex justify-between items-center rounded-lg font-cute text-[0.50rem] sm:text-xs md:text-xs text-white uppercase py-2 px-2 text-center">
            <span>${item.hari}</span>
            <span>${item.kegiatan}</span>
            <span>${item.waktu}</span>
          </div>
        `;

                scheduleContainer.appendChild(el);
            });
        });

    downloadButton.addEventListener('dblclick', () => {
        htmlToImage
            .toPng(scheduleImage)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'schedule.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => console.error('Failed to download image:', err));
    });
});
