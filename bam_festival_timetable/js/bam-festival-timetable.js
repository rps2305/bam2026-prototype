(function ($, Drupal, once) {
  'use strict';

  Drupal.behaviors.bamFestivalTimetable = {
    attach: function (context, settings) {
      // Correct Drupal 11 once() usage
      const elements = once('bam-festival-timetable', '#bam-festival-timetable', context);

      elements.forEach(function (element) {
        console.log('BAM Timetable: Initializing element', element);

        const $container = $(element);
        const festivalDataScript = document.getElementById('bam-festival-data');

        if (!festivalDataScript) {
          console.log('BAM Timetable: No festival data script found');
          return;
        }

        let festivalData;
        try {
          festivalData = JSON.parse(festivalDataScript.textContent);
          console.log('BAM Timetable: Festival data loaded:', festivalData);
        } catch (e) {
          console.error('BAM Timetable: Failed to parse festival data:', e);
          return;
        }

        // Filter out debug data
        if (festivalData && Array.isArray(festivalData)) {
          festivalData = festivalData.filter(day => day && day.day);
        }

        if (!festivalData || festivalData.length === 0) {
          console.log('BAM Timetable: No valid festival data found');
          return;
        }

        console.log('BAM Timetable: Processing festival data:', festivalData);

        let selectedDay = 0;

        // Configuration
        const startHour = 12;
        const endHour = 25;
        const pixelsPerHour = 120;
        const pixelsPerMinute = pixelsPerHour / 60;

        // Event type mapping (Music, DJ, Theatre)
        function getEventType(event) {
          if (event && event.type) {
            const type = event.type.toString().toLowerCase();
            if (['music', 'dj', 'theatre', 'theater'].includes(type)) {
              return type === 'theater' ? 'theatre' : type;
            }
          }

          const genre = (event && event.genre ? event.genre : '').toLowerCase();

          if (genre.includes('theater') || genre.includes('theatre') || genre.includes('cabaret')) {
            return 'theatre';
          }

          if (
            genre.includes('dj') ||
            genre.includes('dance') ||
            genre.includes('techno') ||
            genre.includes('electro') ||
            genre.includes('house') ||
            genre.includes('club')
          ) {
            return 'dj';
          }

          return 'music';
        }

        function getTypeClass(event) {
          const type = getEventType(event);
          if (type === 'dj') {
            return 'type-dj';
          }
          if (type === 'theatre') {
            return 'type-theatre';
          }
          if (type === 'music') {
            return 'type-music';
          }
          return 'type-default';
        }

        function timeToMinutes(timeStr) {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        }

        function getEventPosition(event) {
          const startMinutes = timeToMinutes(event.startTime);
          let endMinutes = timeToMinutes(event.endTime);

          if (endMinutes < startMinutes) {
            endMinutes += 24 * 60;
          }

          const duration = endMinutes - startMinutes;
          const top = (startMinutes - startHour * 60) * pixelsPerMinute;
          const height = duration * pixelsPerMinute;

          return { top, height };
        }

        function formatTimeLabel(hour) {
          // Convert 24+ hours to 00+ format
          if (hour >= 24) {
            return (hour - 24).toString().padStart(2, '0');
          }
          return hour.toString().padStart(2, '0');
        }

        function generateTimeLabels() {
          const labels = [];
          for (let hour = startHour; hour <= endHour; hour++) {
            const displayHour = formatTimeLabel(hour);
            labels.push({
              time: displayHour + ':00',
              position: (hour - startHour) * pixelsPerHour,
              isHour: true
            });

            if (hour < endHour) {
              labels.push({
                time: displayHour + ':30',
                position: (hour - startHour) * pixelsPerHour + pixelsPerHour / 2,
                isHour: false
              });
            }
          }
          return labels;
        }

        function renderTimetable() {
          console.log('BAM Timetable: Rendering timetable for day:', selectedDay);
          const currentDay = festivalData[selectedDay];

          if (!currentDay || !currentDay.events) {
            console.log('BAM Timetable: No events for selected day');
            return;
          }

          const timeLabels = generateTimeLabels();
          const totalHeight = (endHour - startHour) * pixelsPerHour;

          // Update day buttons
          $container.find('.bam-day-btn').removeClass('active');
          $container.find('.bam-day-btn[data-day="' + selectedDay + '"]').addClass('active');

          // Build timetable HTML
          let html = '<div class="bam-stage-headers">';
          html += '<div class="bam-time-column"></div>';

          currentDay.stages.forEach(stage => {
            html += '<div class="bam-stage-header">' + stage + '</div>';
          });
          html += '</div>';

          html += '<div class="bam-timeline-container">';
          html += '<div class="bam-time-labels" style="height: ' + totalHeight + 'px;">';

          timeLabels.forEach(label => {
            const className = label.isHour ? 'bam-time-label hour' : 'bam-time-label half-hour';
            html += '<div class="' + className + '" style="top: ' + (label.position - 10) + 'px;">' + label.time + '</div>';
          });

          html += '</div>';
          html += '<div class="bam-stages-container">';
          html += '<div class="bam-stages-grid" style="height: ' + totalHeight + 'px;">';

          currentDay.stages.forEach((stage, stageIndex) => {
            html += '<div class="bam-stage-column">';

            // Add time grid lines
            timeLabels.forEach(label => {
              const className = label.isHour ? 'bam-time-grid-line hour' : 'bam-time-grid-line half-hour';
              html += '<div class="' + className + '" style="top: ' + label.position + 'px;"></div>';
            });

            // Add events for this stage
            currentDay.events.filter(event => event.stage === stageIndex).forEach(event => {
              const { top, height } = getEventPosition(event);
              const colorClass = getTypeClass(event);
              const eventHeight = Math.max(height, 50);

              html += '<div class="bam-event ' + colorClass + '" ';
              html += 'style="top: ' + top + 'px; height: ' + eventHeight + 'px;" ';
              html += 'data-event-id="' + event.id + '">';
              html += '<a class="bam-event-title" href="#artist:' + event.id + '">' + event.title + '</a>';
              html += '</div>';
            });

            html += '</div>';
          });

          html += '</div></div></div>';

          $container.find('.bam-timetable-wrapper').html(html);
          console.log('BAM Timetable: HTML rendered, adding event handlers');

          // Add event click handlers
          $container.find('.bam-event').on('click', function() {
            const eventId = $(this).data('event-id');
            const event = currentDay.events.find(e => e.id === eventId);
            const stageName = currentDay.stages[event.stage];

            alert(event.title + '\n' +
                  'Genre: ' + event.genre + '\n' +
                  'Type: ' + getEventType(event) + '\n' +
                  'Tijd: ' + event.startTime + ' - ' + event.endTime + '\n' +
                  'Podium: ' + stageName);
          });
        }

        // Initialize day button handlers
        $container.find('.bam-day-btn').on('click', function() {
          selectedDay = parseInt($(this).data('day'));
          console.log('BAM Timetable: Day button clicked, switching to day:', selectedDay);
          renderTimetable();
        });

        // Initial render
        console.log('BAM Timetable: Starting initial render');
        renderTimetable();
        console.log('BAM Timetable: Initialization complete');
      });
    }
  };

})(jQuery, Drupal, once);
