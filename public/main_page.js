const allSlots = [
    "09:00", "09:10", "09:20", "09:30", "09:40", "09:50",
    "10:00", "10:10", "10:20", "10:30", "10:40", "10:50",
    "11:00", "11:10", "11:20", "11:30", "11:40", "11:50",
    "12:00", "12:10", "12:20", "12:30", "12:40", "12:50",
    "13:00", "13:10", "13:20", "13:30", "13:40", "13:50",
    "14:00", "14:10", "14:20", "14:30", "14:40", "14:50",
    "15:00", "15:10", "15:20", "15:30", "15:40", "15:50",
    "16:00", "16:10", "16:20", "16:30", "16:40", "16:50",
    "17:00", "17:10", "17:20", "17:30", "17:40", "17:50",
    "18:00", "18:10", "18:20", "18:30", "18:40", "18:50"
];

async function searchBusySlots() {
    const barberId = document.getElementById('barber').value;
    const dateValue = document.getElementById('date').value;
    const serviceSelect = document.getElementById('service');
    const timeSelect = document.getElementById('time');

    if (!barberId || !dateValue || !serviceSelect) return;

    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const serviceDuration = selectedOption?.dataset.duration ? parseInt(selectedOption.dataset.duration) : 30;
    const closingTimeInMinutes = 19 * 60;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    try {
        const response = await fetch(`/auth/busy-slots?barberId=${barberId}&date=${dateValue}`);
        const busyData = await response.json();

        const toMin = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        let html = '<option value="" hidden>Select Time</option>';

        allSlots.forEach(slot => {
            const slotMin = toMin(slot);
            const slotEndMin = slotMin + serviceDuration;

            const isPast = (dateValue === todayStr && slotMin <= currentMinutes);

            const isStartBusy = busyData.some(busy => {
                const startMin = toMin(busy.start);
                const duration = parseInt(busy.duration || 30);
                return slotMin >= startMin && slotMin < (startMin + duration);
            });

            const overlapsNext = busyData.some(busy => {
                const nextStart = toMin(busy.start);
                return slotEndMin > nextStart && slotMin < nextStart;
            });
            const exceedsClosing = slotEndMin > closingTimeInMinutes;

            if (isPast) {
                html += `<option value="${slot}" disabled style="color: #ccc; background: #f9f9f9;">${slot} (Expired)</option>`;
            } else if (isStartBusy) {
                html += `<option value="${slot}" disabled style="color: #999; background: #eee;">${slot} (Booked)</option>`;
            } else if (overlapsNext || exceedsClosing) {
                html += `<option value="${slot}" disabled style="color: #d9534f; background: #fee;">${slot} (Too long)</option>`;
            } else {
                html += `<option value="${slot}">${slot}</option>`;
            }
        });

        timeSelect.innerHTML = html;
    } catch (err) {
        console.error("Hiba:", err);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('barber');
    const d = document.getElementById('date');
    const s = document.getElementById('service');

    if (b) b.addEventListener('change', searchBusySlots);
    if (d) d.addEventListener('change', searchBusySlots);
    if (s) s.addEventListener('change', searchBusySlots); 

    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});