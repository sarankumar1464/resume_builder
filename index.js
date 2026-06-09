document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name-input');
  const nameEl = document.getElementById('name');
  const emailInput = document.getElementById('email-input');
  const emailEl = document.getElementById('email');
  const phoneInput = document.getElementById('phone-input');
  const phoneEl = document.getElementById('phone');
  const summaryInput = document.getElementById('profile-summary-input');
  const summaryEl = document.getElementById('summary-paragraph');
  const educationDegreeInput = document.getElementById('education-degree-input');
  const educationDurationInput = document.getElementById('education-duration-input');
  const educationInput = document.getElementById('education-input');
  const educationDegreeEl = document.getElementById('education-degree');
  const educationDurationEl = document.getElementById('education-duration');
  const educationEl = document.getElementById('education-paragraph');
  const experienceTitleInput = document.getElementById('experience-title-input');
  const experienceDurationInput = document.getElementById('experience-duration-input');
  const experienceInput = document.getElementById('experience-input');
  const experienceTitleEl = document.getElementById('experience-title');
  const experienceDurationEl = document.getElementById('experience-duration');
  const experienceEl = document.getElementById('experience-paragraph');
  const skillsInputPython = document.getElementById('skills-input-python');
  const skillsInputHtmlCss = document.getElementById('skills-input-html-css');
  const skillsInputReact = document.getElementById('skills-input-react');
  const skillsInputNodejs = document.getElementById('skills-input-nodejs');
  const skillsInputOther = document.getElementById('skills-input-other');
  const skillsInputOtherText = document.getElementById('skills-input-other-text');
  const skillsListEl = document.getElementById('skills-list');
  const otherSkillContainer = document.getElementById('skill-other-container');
  const downloadButton = document.getElementById('download-resume-button');

  if (!nameInput || !emailInput || !phoneInput || !summaryInput || !educationDegreeInput || !educationDurationInput || !educationInput || !educationDegreeEl || !educationDurationEl || !experienceTitleInput || !experienceDurationInput || !experienceInput || !experienceTitleEl || !experienceDurationEl || !skillsListEl || !skillsInputPython || !skillsInputHtmlCss || !skillsInputReact || !skillsInputNodejs || !skillsInputOther || !skillsInputOtherText || !otherSkillContainer || !downloadButton) {
    console.warn('Resume builder script did not find expected DOM elements.');
    return;
  }

  const textFields = [
    { input: nameInput, update: value => { nameEl.textContent = value; } },
    { input: emailInput, update: value => { emailEl.innerHTML = `<i class="fa-solid fa-envelope"></i> : ${value}`; } },
    { input: phoneInput, update: value => { phoneEl.innerHTML = `<i class="fa-solid fa-phone"></i> : ${value}`; } },
    { input: summaryInput, update: value => { summaryEl.textContent = value; } },
    { input: educationDegreeInput, update: value => { educationDegreeEl.textContent = value; } },
    { input: educationDurationInput, update: value => { educationDurationEl.textContent = value; } },
    { input: educationInput, update: value => { educationEl.textContent = value; } },
    { input: experienceTitleInput, update: value => { experienceTitleEl.textContent = value; } },
    { input: experienceDurationInput, update: value => { experienceDurationEl.textContent = value; } },
    { input: experienceInput, update: value => { experienceEl.textContent = value; } },
    { input: skillsInputOtherText, update: () => updateOtherSkill() }
  ];

  function saveInput(input) {
    localStorage.setItem(input.id, input.value);
  }

  function restoreInput(field) {
    const stored = localStorage.getItem(field.input.id);
    if (stored !== null) {
      field.input.value = stored;
      field.update(stored);
    }
  }

  textFields.forEach(field => {
    field.input.addEventListener('input', () => {
      saveInput(field.input);
      field.update(field.input.value);
    });
    restoreInput(field);
  });

  function addSkillListItem(text, type) {
    const existing = skillsListEl.querySelector(`li[data-skill-type="${type}"]`) || [...skillsListEl.children].find(node => node.textContent === text && !type);
    if (existing) return;
    const skillItem = document.createElement('li');
    skillItem.textContent = text;
    if (type) skillItem.dataset.skillType = type;
    skillItem.classList.add('text-gray-700', 'text-md', 'font-sans');
    skillsListEl.appendChild(skillItem);
  }

  function removeSkillListItem(matchText, type) {
    const skillItems = Array.from(skillsListEl.getElementsByTagName('li'));
    skillItems.forEach(item => {
      if ((type && item.dataset.skillType === type) || (!type && item.textContent === matchText)) {
        skillsListEl.removeChild(item);
      }
    });
  }

  function updateOtherSkill() {
    const hasOther = skillsInputOther.checked;
    const customText = skillsInputOtherText.value.trim() || 'Other skill';
    if (hasOther) {
      addSkillListItem(customText, 'other');
      const existing = skillsListEl.querySelector('li[data-skill-type="other"]');
      if (existing) existing.textContent = customText;
    } else {
      removeSkillListItem(null, 'other');
    }
  }

  function syncCheckbox(checkbox, label) {
    const stored = localStorage.getItem(checkbox.id);
    if (stored !== null) {
      checkbox.checked = stored === 'true';
    }
    checkbox.addEventListener('change', () => {
      localStorage.setItem(checkbox.id, checkbox.checked);
      if (checkbox === skillsInputOther) {
        otherSkillContainer.classList.toggle('hidden', !checkbox.checked);
        updateOtherSkill();
      } else {
        if (checkbox.checked) {
          addSkillListItem(label);
        } else {
          removeSkillListItem(label);
        }
      }
    });
    if (checkbox.checked) {
      if (checkbox === skillsInputOther) {
        otherSkillContainer.classList.remove('hidden');
        updateOtherSkill();
      } else {
        addSkillListItem(label);
      }
    }
  }

  syncCheckbox(skillsInputPython, 'Python');
  syncCheckbox(skillsInputHtmlCss, 'HTML/CSS');
  syncCheckbox(skillsInputReact, 'React');
  syncCheckbox(skillsInputNodejs, 'Node.js');
  syncCheckbox(skillsInputOther, 'Other');

  downloadButton.addEventListener('click', () => {
    const preview = document.getElementById('preview-container');
    if (!preview) return;
    const options = {
      margin: 0.3,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, scrollY: -window.scrollY },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(preview).save();
  });
});
