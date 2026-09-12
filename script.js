/* Navigation button*/
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open')); /*opens and closes the nav men when clicked at*/
}

/* Carousel that loops pictures and nav */
function initCarousel() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.carousel-dots button');
  const currentNum = document.querySelector('.index-num.current');
  const nextNum = document.querySelector('.index-num.next');
  if (slides.length === 0) return;

  const pad = (n) => String(n).padStart(2, '0'); 

/* doing the timing for the carousel */
  let current = 0; /*the index of the current slide */
  const duration = 5000; // ms per slide
  let elapsed = 0;
  const tick = 50;

/*the small navigation dots that show which slide is active */
  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    if (currentNum) currentNum.textContent = pad(index + 1);
    if (nextNum) nextNum.textContent = pad(((index + 1) % slides.length) + 1);
    current = index;
    elapsed = 0;
  }
/*moves the carousel to the next slide */
  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }
/*allows the user to move from one slide to another by clicking on the navigation dots */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });
/*starts the carousel on the first slide*/
  showSlide(0);

  setInterval(() => {
    elapsed += tick;
    if (elapsed >= duration) nextSlide();
  }, tick);
}

/* Enquiry form */

/*read all the values from the form and return them as an object */
function extractFormValues(form) {
  return {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    scamType: form.scamType.value,
    message: form.message.value.trim()
  };
}

/*Checks that no required field is empty, and email are valid*/

function validateForm(values) {
  const errors = {};

  if (values.name === '') errors.name = 'Please enter your name.';

  if (values.email === '') {
    errors.email = 'Please enter your email.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (values.phone === '') {
    errors.phone = 'Please enter a phone number.';
  } else if (!/^[0-9+\s-]{7,15}$/.test(values.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (values.scamType === '') errors.scamType = 'Please select a scam type.';

  if (values.message === '') errors.message = 'Please tell us a bit more.';

  return errors;
}
/*remove the invalid class from the form group to clear the error state */

function clearFieldError(group) {
  group.classList.remove('invalid');
}
/*add the invalid class to the form group to show the error state */
function showFieldError(group) {
  group.classList.add('invalid');
}
/*return a message based on the scam type selected by the user on sucess page */
function getScamTypeMessage(scamType) {
  if (scamType === 'phishing') {
    return 'Phishing is the practice of tricking people into sharing private information, like passwords or bank details, using fake emails or websites';
  } else if (scamType === 'e-commerce') {
    return 'E-commerce scams involve fraudulent online transactions or fake shopping websites.';
  } else if (scamType === 'job') {
    return 'Job scams typically involve fake job offers or requests for personal information under false pretenses.';
  } else {
    return 'Thanks for reaching out! We will review your enquiry and get back to you as soon as possible.';
  }
}
/* Restart the enquiry form and do validation, and redirect to success page */

function initEnquiryForm() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const status = document.querySelector('.form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const values = extractFormValues(form);
    const errors = validateForm(values);
    
    /*Reset all the previous inputs*/
    form.querySelectorAll('.form-group').forEach(clearFieldError);

    const errorKeys = Object.keys(errors);

    if (errorKeys.length > 0) {
      errorKeys.forEach((key) => {
        const group = form.querySelector(`[data-field="${key}"]`);
        if (group) {
          showFieldError(group);
          const msg = group.querySelector('.error-msg');
          if (msg) msg.textContent = errors[key];
        }
      });
      if (status) {
        status.textContent = 'Please fix the highlighted fields before submitting.';
        status.classList.add('show');
      }
      return;
    }

    if (status) status.classList.remove('show');

    /* Store submission for the success page, then redirect to the success page*/
    sessionStorage.setItem('enquiry', JSON.stringify(values));
    window.location.href = 'success.html';
  });
}

/*  Success page  */
function initSuccessPage() {
  const box = document.getElementById('success-content');
  if (!box) return;

  const raw = sessionStorage.getItem('enquiry');

  if (!raw) {
    box.innerHTML = '<p>No recent enquiry found. Please <a href="enquiry.html">submit the form</a> first.</p>';
    return;
  }
  
  const values = JSON.parse(raw);
  const message = getScamTypeMessage(values.scamType);
/*display the values on the success page */
  document.getElementById('success-name').textContent = values.name;
  document.getElementById('success-scamtype').textContent = values.scamType;
  document.getElementById('success-email').textContent = values.email;
  document.getElementById('success-phone').textContent = values.phone;
  document.getElementById('success-message-text').textContent = message;
}
/*runs function when the page is loaded */
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initCarousel();
  initEnquiryForm();
  initSuccessPage();
});
