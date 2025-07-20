document.addEventListener('DOMContentLoaded', () => {
  // loadReminders();

  const form = document.getElementById('reminderForm');
  const list = document.getElementById('reminderList');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const medName = document.getElementById('medicineName').value;
    const medTime = document.getElementById('medicineTime').value;
    const timeOfDay = document.getElementById('timeOfDay').value;

    const reminders = JSON.parse(localStorage.getItem('reminders') || '{}');

    if (!reminders[timeOfDay]) reminders[timeOfDay] = [];
    if (!medName) {
      form.reset();
      return; // Don't add if name is empty
    }

    reminders[timeOfDay].push({ name: medName, time: medTime, taken: false });
    localStorage.setItem('reminders', JSON.stringify(reminders));

    form.reset();
    loadReminders();
  });

  function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '{}');
    list.innerHTML = '';

    Object.entries(reminders).forEach(([timeOfDay, meds]) => {
      if (!Array.isArray(meds) || meds.length === 0) return;

      const section = document.createElement('div');
      section.innerHTML = `<h4>${timeOfDay.toUpperCase()}</h4>`;
      // section.innerHTML = '';
      console.log(meds);
      meds.forEach((med, index) => {
        const medDiv = document.createElement('div');
        let content = `<strong>${med.name}</strong> with ${med.time}`;

        if (med.taken) {
          content += ' ✅ Taken';
        } else {
          content += `
            <button type="button" data-action="take" data-time="${timeOfDay}" data-index="${index}">Mark as Taken</button>
            <button type="button" data-action="snooze" data-time="${timeOfDay}" data-index="${index}">Snooze</button>
          `;
        }

        medDiv.innerHTML = content;
        section.appendChild(medDiv);
      });

      list.appendChild(section);
    });
  }

  list.addEventListener('click', (e) => {
    const action = e.target.getAttribute('data-action');
    const timeOfDay = e.target.getAttribute('data-time');
    const index = e.target.getAttribute('data-index');

    if (!action || index === null) return;

    const reminders = JSON.parse(localStorage.getItem('reminders') || '{}');
    const med = reminders[timeOfDay][index];

    if (action === 'take') {
      med.taken = true;
    } else if (action === 'snooze') {
      const newTime = prompt("Enter new time (HH:MM):", med.time);
      if (newTime) med.time = newTime;
    }

    localStorage.setItem('reminders', JSON.stringify(reminders));
    loadReminders();
  });

  const clearAllBtn = document.getElementById('clearAllBtn');

clearAllBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear all reminders?")) {
    localStorage.removeItem('reminders');
    loadReminders();
  }
});
});

