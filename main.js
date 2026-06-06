document.addEventListener('DOMContentLoaded', () => {
    // ----- DOM elements -----
    const steps = document.querySelectorAll('.step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitFinalBtn = document.getElementById('submitFinalBtn');
    const progressFill = document.getElementById('progressFill');
    const currentStepDisplay = document.getElementById('currentStepDisplay');
    const totalStepsSpan = document.getElementById('totalSteps');
    const modal = document.getElementById('thankyouModal');
    const closeModalSpan = document.querySelector('.close-modal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalMessagePara = document.getElementById('modalMessage');
    
    let currentStep = 1;
    const totalSteps = 5;
    totalStepsSpan.innerText = totalSteps;
    
    // Store answers
    const answers = {
        feeling: null,
        support: null,
        intensity: null,
        openMessage: '',
        promise: false
    };
    
    // ----- helper: update progress bar and step display -----
    function updateProgress() {
        const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = percent + '%';
        currentStepDisplay.innerText = currentStep;
    }
    
    // ----- show step with animation -----
    function showStep(stepNum) {
        steps.forEach((step, idx) => {
            if (idx + 1 === stepNum) {
                step.classList.add('step-active');
            } else {
                step.classList.remove('step-active');
            }
        });
        
        // update button visibility
        if (stepNum === totalSteps) {
            nextBtn.style.display = 'none';
            submitFinalBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitFinalBtn.style.display = 'none';
        }
        
        // enable/disable prev button
        prevBtn.disabled = (stepNum === 1);
        
        updateProgress();
    }
    
    // ----- record answer for current step before moving -----
    function captureCurrentStepAnswer() {
        switch(currentStep) {
            case 1:
                const selectedFeeling = document.querySelector('#q1_options .option-btn.selected');
                if (selectedFeeling) {
                    answers.feeling = selectedFeeling.getAttribute('data-value');
                    document.getElementById('q1_feedback').innerHTML = `✓ you picked: ${answers.feeling} 💜`;
                } else {
                    document.getElementById('q1_feedback').innerHTML = `💭 tap an option to continue →`;
                }
                return !!answers.feeling;
                
            case 2:
                const selectedSupport = document.querySelector('#q2_options .option-btn.selected');
                if (selectedSupport) {
                    answers.support = selectedSupport.getAttribute('data-value');
                    document.getElementById('q2_feedback').innerHTML = `✓ noted: ${answers.support} 🫂`;
                } else {
                    document.getElementById('q2_feedback').innerHTML = `💭 what would feel best right now? tap one →`;
                }
                return !!answers.support;
                
            case 3:
                const selectedIntensity = document.querySelector('#q3_options .heart-btn.selected');
                if (selectedIntensity) {
                    answers.intensity = selectedIntensity.getAttribute('data-value');
                    const heartCount = '💗'.repeat(parseInt(answers.intensity));
                    document.getElementById('q3_feedback').innerHTML = `✓ ${heartCount} — i hear you.`;
                } else {
                    document.getElementById('q3_feedback').innerHTML = `💭 tap a heart that matches how you feel 🌙`;
                }
                return !!answers.intensity;
                
            case 4:
                const msg = document.getElementById('openEnded').value;
                answers.openMessage = msg;
                if (msg.trim() !== "") {
                    document.getElementById('q4_feedback').innerHTML = `✓ thank you for sharing 💜`;
                } else {
                    document.getElementById('q4_feedback').innerHTML = `✨ it's okay to leave it empty — i'm still here`;
                }
                return true;
                
            case 5:
                const promiseChecked = document.getElementById('promiseCheck').checked;
                answers.promise = promiseChecked;
                if (promiseChecked) {
                    document.getElementById('q5_feedback').innerHTML = `🌟 that means so much. thank you.`;
                } else {
                    document.getElementById('q5_feedback').innerHTML = `💕 no worries — i'll listen anyway.`;
                }
                return true;
                
            default:
                return true;
        }
    }
    
    // ----- move to next step -----
    function goToNextStep() {
        const canProceed = captureCurrentStepAnswer();
        
        let required = true;
        if (currentStep === 4 || currentStep === 5) required = false;
        
        if (required && !canProceed) {
            const feedbackDiv = document.getElementById(`q${currentStep}_feedback`);
            if (feedbackDiv) {
                feedbackDiv.style.animation = 'none';
                setTimeout(() => { feedbackDiv.style.animation = ''; }, 10);
                feedbackDiv.style.color = '#BF40FA';
                setTimeout(() => { feedbackDiv.style.color = '#BF40FA'; }, 800);
            }
            return;
        }
        
        if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    }
    
    function goToPrevStep() {
        if (currentStep > 1) {
            captureCurrentStepAnswer();
            currentStep--;
            showStep(currentStep);
            restoreSelectedVisuals();
        }
    }
    
    function restoreSelectedVisuals() {
        if (answers.feeling) {
            document.querySelectorAll('#q1_options .option-btn').forEach(btn => {
                if (btn.getAttribute('data-value') === answers.feeling) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
            document.getElementById('q1_feedback').innerHTML = `✓ you picked: ${answers.feeling} 💜`;
        }
        if (answers.support) {
            document.querySelectorAll('#q2_options .option-btn').forEach(btn => {
                if (btn.getAttribute('data-value') === answers.support) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
            document.getElementById('q2_feedback').innerHTML = `✓ noted: ${answers.support} 🫂`;
        }
        if (answers.intensity) {
            document.querySelectorAll('#q3_options .heart-btn').forEach(btn => {
                if (btn.getAttribute('data-value') === answers.intensity) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
            const heartCount = '💗'.repeat(parseInt(answers.intensity));
            document.getElementById('q3_feedback').innerHTML = `✓ ${heartCount} — i hear you.`;
        }
        if (answers.openMessage) {
            document.getElementById('openEnded').value = answers.openMessage;
            if (answers.openMessage.trim()) {
                document.getElementById('q4_feedback').innerHTML = `✓ thank you for sharing 💜`;
            }
        }
        if (answers.promise) {
            document.getElementById('promiseCheck').checked = true;
            document.getElementById('q5_feedback').innerHTML = `🌟 that means so much. thank you.`;
        }
    }
    
    // ----- final submission -----
    function submitSurvey() {
        captureCurrentStepAnswer();
        
        if (!answers.feeling || !answers.support || !answers.intensity) {
            const warning = document.createElement('div');
            warning.innerText = "💭 sweetheart — could you go back and answer the first three questions? it helps me understand you better 🫶";
            warning.style.position = 'fixed';
            warning.style.bottom = '20px';
            warning.style.left = '50%';
            warning.style.transform = 'translateX(-50%)';
            warning.style.backgroundColor = '#0F1115';
            warning.style.color = '#E3D9FC';
            warning.style.padding = '10px 20px';
            warning.style.borderRadius = '80px';
            warning.style.fontWeight = 'bold';
            warning.style.zIndex = '999';
            warning.style.border = '1px solid #BF40FA';
            document.body.appendChild(warning);
            setTimeout(() => warning.remove(), 3000);
            return;
        }
        
        let intensityNum = parseInt(answers.intensity);
        let intensityNote = "";
        if (intensityNum >= 4) intensityNote = " i can see this really matters, and i hear your pain. ";
        else if (intensityNum >= 2) intensityNote = " i understand something's heavy. ";
        else intensityNote = " even if it's small, your feelings are totally valid. ";
        
        let customMsg = `thank you for sharing that you're feeling ${answers.feeling}. ${intensityNote} `;
        customMsg += `you mentioned that ${answers.support} might help you feel heard. `;
        if (answers.openMessage && answers.openMessage.trim() !== "") {
            customMsg += ` you wrote: “${answers.openMessage.substring(0, 120)}” — i read it carefully. `;
        } else {
            customMsg += ` and even if words are hard right now, i appreciate you being here. `;
        }
        customMsg += ` i'm here. let's talk when you're ready, my love. 💜`;
        
        if (modalMessagePara) modalMessagePara.innerText = customMsg;
        if (modal) modal.style.display = 'flex';
        
        localStorage.setItem('lastLoveSurvey', JSON.stringify(answers));
    }
    
    // ----- event listeners -----
    function bindOptionListeners() {
        document.querySelectorAll('#q1_options .option-btn').forEach(btn => {
            btn.removeEventListener('click', btn._listener);
            const handler = () => {
                document.querySelectorAll('#q1_options .option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                answers.feeling = btn.getAttribute('data-value');
                document.getElementById('q1_feedback').innerHTML = `✓ you picked: ${answers.feeling} 💜`;
            };
            btn.addEventListener('click', handler);
            btn._listener = handler;
        });
        
        document.querySelectorAll('#q2_options .option-btn').forEach(btn => {
            btn.removeEventListener('click', btn._listener2);
            const handler = () => {
                document.querySelectorAll('#q2_options .option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                answers.support = btn.getAttribute('data-value');
                document.getElementById('q2_feedback').innerHTML = `✓ noted: ${answers.support} 🫂`;
            };
            btn.addEventListener('click', handler);
            btn._listener2 = handler;
        });
        
        document.querySelectorAll('#q3_options .heart-btn').forEach(btn => {
            btn.removeEventListener('click', btn._listener3);
            const handler = () => {
                document.querySelectorAll('#q3_options .heart-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                answers.intensity = btn.getAttribute('data-value');
                const heartCount = '💗'.repeat(parseInt(answers.intensity));
                document.getElementById('q3_feedback').innerHTML = `✓ ${heartCount} — i hear you.`;
            };
            btn.addEventListener('click', handler);
            btn._listener3 = handler;
        });
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }
    
    if (closeModalSpan) closeModalSpan.addEventListener('click', closeModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) closeModal();
    });
    
    nextBtn.addEventListener('click', goToNextStep);
    prevBtn.addEventListener('click', goToPrevStep);
    submitFinalBtn.addEventListener('click', submitSurvey);
    
    bindOptionListeners();
    showStep(1);
    
    document.getElementById('openEnded').addEventListener('input', (e) => {
        answers.openMessage = e.target.value;
        if (answers.openMessage.trim()) {
            document.getElementById('q4_feedback').innerHTML = `✓ thank you for sharing 💜`;
        } else {
            document.getElementById('q4_feedback').innerHTML = `✨ it's okay to leave it empty — i'm still here`;
        }
    });
    
    document.getElementById('promiseCheck').addEventListener('change', (e) => {
        answers.promise = e.target.checked;
        if (answers.promise) {
            document.getElementById('q5_feedback').innerHTML = `🌟 that means so much. thank you.`;
        } else {
            document.getElementById('q5_feedback').innerHTML = `💕 no worries — i'll listen anyway.`;
        }
    });
    // ----- final submission with EmailJS -----
function submitSurvey() {
    captureCurrentStepAnswer();
    
    if (!answers.feeling || !answers.support || !answers.intensity) {
        const warning = document.createElement('div');
        warning.innerText = "💭 sweetheart — could you go back and answer the first three questions? it helps me understand you better 🫶";
        warning.style.position = 'fixed';
        warning.style.bottom = '20px';
        warning.style.left = '50%';
        warning.style.transform = 'translateX(-50%)';
        warning.style.backgroundColor = '#0F1115';
        warning.style.color = '#E3D9FC';
        warning.style.padding = '10px 20px';
        warning.style.borderRadius = '80px';
        warning.style.fontWeight = 'bold';
        warning.style.zIndex = '999';
        warning.style.border = '1px solid #BF40FA';
        document.body.appendChild(warning);
        setTimeout(() => warning.remove(), 3000);
        return;
    }
    
    // Prepare email data
    const emailParams = {
        to_email: "mithilarahman1303@gmail.com",  // 👈 CHANGE THIS
        feeling: answers.feeling,
        support: answers.support,
        intensity: answers.intensity,
        open_message: answers.openMessage || "(nothing written)",
        promise: answers.promise ? "Yes, they promised to listen" : "No promise checked",
        timestamp: new Date().toLocaleString()
    };
    
    // Send via EmailJS
    emailjs.send(
        'service_4ad9ai9',      // 👈 REPLACE with your Service ID
        'template_998tfw7',     // 👈 REPLACE with your Template ID
        emailParams,
        '5qSMS1aTj-qSCCa7v'       // 👈 REPLACE with your Public Key
    ).then(() => {
        // Success! Show thank you modal
        let intensityNum = parseInt(answers.intensity);
        let intensityNote = "";
        if (intensityNum >= 4) intensityNote = " i can see this really matters, and i hear your pain. ";
        else if (intensityNum >= 2) intensityNote = " i understand something's heavy. ";
        else intensityNote = " even if it's small, your feelings are totally valid. ";
        
        let customMsg = `thank you for sharing that you're feeling ${answers.feeling}. ${intensityNote} `;
        customMsg += `you mentioned that ${answers.support} might help you feel heard. `;
        if (answers.openMessage && answers.openMessage.trim() !== "") {
            customMsg += ` you wrote: “${answers.openMessage.substring(0, 120)}” — i read it carefully. `;
        } else {
            customMsg += ` and even if words are hard right now, i appreciate you being here. `;
        }
        customMsg += ` i'm here. let's talk when you're ready, my love. 💜`;
        
        if (modalMessagePara) modalMessagePara.innerText = customMsg;
        if (modal) modal.style.display = 'flex';
        
        localStorage.setItem('lastLoveSurvey', JSON.stringify(answers));
        
    }).catch((error) => {
        console.error("EmailJS error:", error);
        // Still show modal but let them know email failed
        let customMsg = `thank you for sharing 💜 i got your answers, but there was a tiny hiccup sending to my email. don't worry — i'll check with you directly.`;
        if (modalMessagePara) modalMessagePara.innerText = customMsg;
        if (modal) modal.style.display = 'flex';
        localStorage.setItem('lastLoveSurvey', JSON.stringify(answers));
    });
}
});