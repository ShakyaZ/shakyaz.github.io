/**
 * Boot loader script for portfolio
 * Animates the boot screen sequence
 */

const ENABLED = true; // Set to false to disable boot screen

if (ENABLED) {
  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', () => {
    const boot = document.getElementById('boot');
    if (!boot) return;

    const lines = document.querySelectorAll('.bl');
    const barWrap = document.getElementById('bootBar');
    const fill = document.getElementById('bootFill');
    const pct = document.getElementById('bootPct');
    const ready = document.getElementById('bootReady');

    let progress = 0;
    let progressInterval;

    // Function to show a boot line
    function showLine(index) {
      if (lines[index]) {
        lines[index].classList.add('show');
      }
    }

    // Show boot lines with faster staggered delays
    const lineDelays = [0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000];
    lines.forEach((line, i) => {
      setTimeout(() => showLine(i), lineDelays[i]);
    });

    // Show progress bar after lines start
    setTimeout(() => {
      if (barWrap) barWrap.classList.add('show');
    }, 1600);

    // Animate progress bar
    setTimeout(() => {
      progressInterval = setInterval(() => {
        progress += 20;
        if (fill) fill.style.width = progress + '%';
        if (pct) pct.textContent = progress + '%';

        if (progress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            if (ready) ready.classList.add('show');
            document.addEventListener('click', skipBoot, { once: true });
            document.addEventListener('keydown', skipBoot, { once: true });
          }, 200);
        }
      }, 80);
    }, 1700);

    // Function to hide boot
    function skipBoot() {
      if (progressInterval) clearInterval(progressInterval);
      boot.classList.add('out');
      setTimeout(() => {
        boot.style.display = 'none';
      }, 850); // Match transition duration
    }
  });
}