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
    const skip = document.getElementById('bootSkip');

    let progress = 0;
    let progressInterval;

    // Function to show a boot line
    function showLine(index) {
      if (lines[index]) {
        lines[index].classList.add('show');
      }
    }

    // Show boot lines with staggered delays
    const lineDelays = [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000];
    lines.forEach((line, i) => {
      setTimeout(() => showLine(i), lineDelays[i]);
    });

    // Show progress bar after lines start
    setTimeout(() => {
      if (barWrap) barWrap.classList.add('show');
    }, 3200);

    // Animate progress bar
    setTimeout(() => {
      progressInterval = setInterval(() => {
        progress += 5;
        if (fill) fill.style.width = progress + '%';
        if (pct) pct.textContent = progress + '%';

        if (progress >= 100) {
          clearInterval(progressInterval);
          // Show ready prompt and skip hint
          setTimeout(() => {
            if (ready) ready.classList.add('show');
            if (skip) skip.classList.add('show');
          }, 500);
        }
      }, 150);
    }, 3500);

    // Function to skip/hide boot
    function skipBoot() {
      if (progressInterval) clearInterval(progressInterval);
      boot.classList.add('out');
      setTimeout(() => {
        boot.style.display = 'none';
      }, 850); // Match transition duration
    }

    // Event listeners for skipping
    document.addEventListener('click', skipBoot, { once: true });
    document.addEventListener('keydown', skipBoot, { once: true });
  });
}