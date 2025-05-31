document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // scroll halus
    });

    const loadingScreen = document.querySelector('#loading-screen')
    const loadingText = document.querySelector('#loading-text')
    const letters = loadingText.querySelectorAll('#loading-sub-text');

    const scheduleImage = document.getElementById('schedule-image')
    const downloadScheduleButton = document.getElementById('download-button')
    const scheduleContainer = document.querySelector('#schedule-list')

    function animateLetterHighlight() {
        let index = 0;

        function highlightNextLetter() {
            letters.forEach(letter => letter.classList.remove('highlight'));

            letters[index].classList.add('highlight');

            index = (index + 1) % letters.length;

            setTimeout(highlightNextLetter, 200);
        }

        highlightNextLetter();
    }

    animateLetterHighlight();

    setTimeout(() => {
        document.body.classList.remove('overflow-hidden')
        loadingScreen.classList.add('opacity-0')
        setTimeout(() => {
            loadingScreen.remove()
        }, 500);
    }, 3000);

    const sheetId = 'https://script.google.com/macros/s/AKfycbxDo9cNzKpvNNJLgnwOehf0SvXuxG7MS-zjC-01_BycEEm9HSpbatAGYhg2_Z4qowSk/exec'

    fetch(sheetId)
        .then(r => r.json())
        .then(d => {
            const values = d
            values.map((item, i) => {
                const el = `<div data-aos="fade-up" data-aos-delay="500" data-aos-duration="500"
                    data-aos-easing="ease-in-out" class="bg-blue/55 py-1 rounded-lg">
                    <div id="stream-box"
                        class="bg-blue/60 shadow-inner shadow-black/30 w-[30rem] flex justify-between items-center rounded-lg font-cute text-xs text-white uppercase py-2 px-2">
                        <span class="block" id="day">${item.hari}</span>
                        <span class="block" id="activity">${item.kegiatan}</span>
                        <span class="block" id="time">${item.waktu}</span>
                    </div>
                </div>`

                scheduleContainer.innerHTML += el
            })
        })

    downloadScheduleButton.addEventListener('dblclick', () => {
        htmlToImage.toPng(scheduleImage)
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = 'schedule.png'; // nama file
                link.href = dataUrl;
                link.click(); // trigger download
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    });


});