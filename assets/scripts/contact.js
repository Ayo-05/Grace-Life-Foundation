// ==========================================================================
// Grace Life Foundation — contact / volunteer form
// Submits to Web3Forms (https://web3forms.com) — no backend of our own needed.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('volunteer-form');
  if(!form) return;

  const phoneInput = document.getElementById('phone');
  const phoneHint = document.getElementById('phone-hint');
  const status = document.getElementById('form-status');
  const genderOptions = form.querySelectorAll('.gender-option');
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnDefaultText = submitBtn.textContent;

  // Fallback for browsers without :has() support — toggles a visible "checked" style.
  genderOptions.forEach(option => {
    const radio = option.querySelector('input[type="radio"]');
    if(!radio) return;
    radio.addEventListener('change', () => {
      genderOptions.forEach(o => o.classList.remove('is-checked'));
      if(radio.checked) option.classList.add('is-checked');
    });
  });

  // Matches Nigerian mobile numbers in local (0801...) or international (+234 801...) format.
  const NG_PHONE_PATTERN = /^(?:\+234|0)[789][01]\d{8}$/;

  function normalizePhone(value){
    return value.replace(/[\s-]/g, '');
  }

  function validatePhone(){
    const value = normalizePhone(phoneInput.value.trim());
    const isValid = NG_PHONE_PATTERN.test(value);
    phoneInput.setAttribute('aria-invalid', String(!isValid && value.length > 0));
    if(value.length > 0 && !isValid){
      phoneHint.textContent = 'Enter a valid Nigerian number, e.g. 0801 234 5678 or +234 801 234 5678.';
      phoneHint.classList.add('error');
    } else {
      phoneHint.textContent = 'Format: 0801 234 5678 or +234 801 234 5678';
      phoneHint.classList.remove('error');
    }
    return isValid;
  }

  phoneInput.addEventListener('input', validatePhone);
  phoneInput.addEventListener('blur', validatePhone);

  function resetFormVisuals(){
    form.reset();
    genderOptions.forEach(o => o.classList.remove('is-checked'));
    phoneHint.textContent = 'Format: 0801 234 5678 or +234 801 234 5678';
    phoneHint.classList.remove('error');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const phoneValid = validatePhone();
    if(!form.checkValidity() || !phoneValid){
      form.reportValidity();
      status.textContent = 'Please fix the fields highlighted in gold and try again.';
      status.className = 'form-status error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const formData = new FormData(form);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });

      const result = await response.json();

      if(response.ok && result.success){
        status.textContent = "Thank you fro volunteering, we've received your application and will be in touch within a few days.";
        status.className = 'form-status success';
        resetFormVisuals();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch(err){
      console.error('Volunteer form submission error:', err);
      status.textContent = "Something went wrong sending your application. Please try again, or email us directly at info@gracelifefoundation.org.";
      status.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtnDefaultText;
    }
  });
});