const steps = Array.from(document.querySelectorAll(".process-step"));
const stepCurrent = document.getElementById("stepCurrent");
const timelineDot = document.getElementById("timelineDot");

let activeIndex = 0;

function updateTimeline(index) {
  activeIndex = index;
  const activeStep = steps[index];
  stepCurrent.textContent = activeStep.dataset.step;

  steps.forEach((step, i) => {
    step.classList.toggle("is-active", i === index);
    step.classList.toggle("is-passed", i < index);
  });

  const firstTop = steps[0].offsetTop;
  const activeTop = activeStep.offsetTop;
  const relativeY = activeTop - firstTop + 10;
  timelineDot.style.transform = `translate(-50%, ${relativeY}px)`;

  timelineDot.classList.remove("is-pulse");
  window.requestAnimationFrame(() => {
    timelineDot.classList.add("is-pulse");
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visible.length) {
      return;
    }

    const newIndex = steps.indexOf(visible[0].target);
    if (newIndex !== activeIndex && newIndex !== -1) {
      updateTimeline(newIndex);
    }
  },
  {
    threshold: [0.35, 0.6, 0.9],
    rootMargin: "-20% 0px -35% 0px",
  }
);

steps.forEach((step) => observer.observe(step));
updateTimeline(0);
