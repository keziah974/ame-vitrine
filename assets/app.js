import './styles/app.css';
import fullpage from 'fullpage.js';
console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');
$(document).ready(function () {


    // new fullpage('#fullpage', {
    //     autoScrolling: true,
    //     navigation: true,
    //     scrollHorizontally: true,
    //     licenseKey: 'null'
    //   });


      
    let glide = new Glide('#glide_event', {
        type: 'carousel',
        startAt: 0,
        perView: 1,
        animationDuration: 800, // durée du slide (en ms)
        animationTimingFunc: 'ease-in-out', // courbe de transition
    })
    function updateDescription(index) {
        const currentSlide = $('.glide__slide').eq(index);
        const description = currentSlide.find('img').data('description');
    
        // Fade synchronisé avec Glide (déclenché légèrement après le début du slide)
        $('#event-description').fadeOut(0, function () {
          $(this).text(description).fadeIn(100);
        });
      }
    
      
    
      glide.on('run.before', () => {
        // Optionnel ²: fade-out un peu avant la transition
        $('#event-description').fadeOut(300);
      });
    
      glide.on('run.after', () => {
        updateDescription(glide.index);
      });
    
      glide.mount();

        /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    particlesJS.load('particles-js', './particles.json', function() {
      console.log('callback - particles-js config loaded');
    });
    new Rellax('.rellax');

    new Swiper('.swiper', {
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });

    const events = [
        // Juin 2025
        { start: '2025-06-02', end: '2025-06-15', title: 'Grand Public : Espace Infini', type: 'exposition' },
        { start: '2025-06-16', end: '2025-06-22', title: 'Grand Public : Océans Profonds', type: 'exposition' },
        { start: '2025-06-23', end: '2025-06-29', title: 'Privé : Toyota Innovation', type: 'entreprise' },
        // Juillet 2025
        { start: '2025-07-01', end: '2025-07-06', title: 'Grand Public : Créateurs Réunionnais', type: 'special' },
        { start: '2025-07-07', end: '2025-07-20', title: 'Grand Public : Art Aborigène', type: 'exposition' },
        { start: '2025-07-21', end: '2025-07-27', title: 'Privé : L’Oréal Luxe', type: 'entreprise' },
        // Août 2025
        { start: '2025-08-04', end: '2025-08-17', title: 'Grand Public : Mythes Créoles', type: 'exposition' },
        { start: '2025-08-18', end: '2025-08-24', title: 'Grand Public : Volcan en Lumière', type: 'exposition' },
        { start: '2025-08-25', end: '2025-08-31', title: 'Privé : Air Austral', type: 'entreprise' },
        // Septembre 2025
        { start: '2025-09-01', end: '2025-09-07', title: 'Grand Public : Maloya Vibrations', type: 'special' },
        { start: '2025-09-08', end: '2025-09-21', title: 'Grand Public : Jungle Tropicale', type: 'exposition' },
        { start: '2025-09-22', end: '2025-09-28', title: 'Privé : Orange Connect', type: 'entreprise' },
    ];

    const monthLabel = document.getElementById('monthLabel');
    const weekDaysDesktop = document.getElementById('weekDaysDesktop');
    const weekDaysMobile = document.getElementById('weekDaysMobile');
    const prevWeek = document.getElementById('prevWeek');
    const nextWeek = document.getElementById('nextWeek');
    const currentWeek = document.getElementById('currentWeek');

    let currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1); // Start on Monday

    function getWeekDates(startDate) {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date);
        }
        return dates;
    }

    function getEventsForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => {
            const start = new Date(event.start);
            const end = new Date(event.end);
            return dateStr >= event.start && dateStr <= event.end;
        });
    }

    function renderCalendar() {
        const weekDates = getWeekDates(currentWeekStart);
        const monthName = currentWeekStart.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
        monthLabel.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

        // Desktop rendering
        weekDaysDesktop.innerHTML = '';
        weekDates.forEach(date => {
            const events = getEventsForDate(date);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800';
            dayDiv.innerHTML = `
                <div class="text-sm font-semibold mb-2">${date.toLocaleDateString('fr-FR', { day: 'numeric', weekday: 'short' })}</div>
                ${events.map(event => `
                    <div class="text-sm p-2 rounded-lg mb-2 ${
                        event.type === 'special' ? 'bg-purple-600' :
                        event.type === 'entreprise' ? 'bg-blue-600' : 'bg-pink-600'
                    }">
                        ${event.title}
                    </div>
                `).join('')}
            `;
            weekDaysDesktop.appendChild(dayDiv);
        });

        // Mobile rendering
        weekDaysMobile.innerHTML = '';
        weekDates.forEach(date => {
            const events = getEventsForDate(date);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-800';
            dayDiv.innerHTML = `
                <div class="text-sm font-semibold mb-2">${date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                ${events.map(event => `
                    <div class="text-sm p-2 rounded-lg mb-2 ${
                        event.type === 'special' ? 'bg-purple-600' :
                        event.type === 'entreprise' ? 'bg-blue-600' : 'bg-pink-600'
                    }">
                        ${event.title}
                    </div>
                `).join('')}
            `;
            weekDaysMobile.appendChild(dayDiv);
        });
    }

    prevWeek.addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        renderCalendar();
    });

    nextWeek.addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        renderCalendar();
    });

    currentWeek.addEventListener('click', () => {
        currentWeekStart = new Date();
        currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1); // Reset to current week's Monday
        renderCalendar();
    });

    renderCalendar();
  });