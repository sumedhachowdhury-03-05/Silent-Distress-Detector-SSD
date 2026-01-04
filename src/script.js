// Demo functionality
let interval; // Declare globally for reset

document.getElementById('startBtn').addEventListener('click', function() {
    console.log('Starting monitoring...'); // Debug log
    let accel = 0, gyro = 0, status = 'Normal';
    const accelEl = document.getElementById('accel');
    const gyroEl = document.getElementById('gyro');
    const statusEl = document.getElementById('status');
    const alertEl = document.getElementById('alert');

    if (!accelEl || !gyroEl || !statusEl || !alertEl) {
        console.error('Elements not found! Check HTML IDs.');
        return;
    }

    alertEl.style.display = 'none'; // Hide alert on start

    interval = setInterval(() => {
        accel = Math.random() * 10;
        gyro = Math.random() * 10;
        accelEl.textContent = accel.toFixed(2);
        gyroEl.textContent = gyro.toFixed(2);
        console.log(`Accel: ${accel.toFixed(2)}, Gyro: ${gyro.toFixed(2)}`); // Debug log
    }, 1000);

    setTimeout(() => {
        clearInterval(interval);
        status = 'Abnormal Inactivity Detected';
        statusEl.textContent = status;
        alertEl.style.display = 'block';
        console.log('Distress detected!'); // Debug log
    }, 10000);
});

// Reset button
document.getElementById('resetBtn').addEventListener('click', function() {
    if (interval) clearInterval(interval);
    document.getElementById('accel').textContent = '0';
    document.getElementById('gyro').textContent = '0';
    document.getElementById('status').textContent = 'Normal';
    document.getElementById('alert').style.display = 'none';
    console.log('Demo reset.'); // Debug log
});

// Contact form functionality (only on pages with the form)
if (document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        document.getElementById('response').innerHTML = `<div class="alert alert-success">Thank you, ${name}! Your message has been sent.</div>`;
        console.log('Form submitted:', { name, email, message }); // Debug log
        // In a real app, send to server here
    });
}
