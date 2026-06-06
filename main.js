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
    const totalSteps = 9;
    totalStepsSpan.innerText = totalSteps;

    // Store answers
    const answers = {
        q1: null,   // Are you gay?
        q2: null,   // Do you hate me?
        q3: null,   // Did you ever feel anything between us?
        q4: '',     // How do you feel about me now? (text)
        q5: null,   // Do you miss me?
        q6: '',     // Where did it go wrong? (text)
        q7: null,   // Is there a 2nd chance?
        q8: '',     // Something I don't know? (text)
        promise: true  // Always true because the message is there
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

        if (stepNum === totalSteps) {
            nextBtn.style.display = 'none';
            submitFinalBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitFinalBtn.style.display = 'none';
        }

        prevBtn.disabled = (stepNum === 1);
        updateProgress();
    }

    // ----- record answer for current step -----
    function captureCurrentStepAnswer() {
        switch (currentStep) {
            case 1:
                const selectedQ1 = document.querySelector('#q1_options .option-btn.selected');
                if (selectedQ1) {
                    answers.q1 = selectedQ1.getAttribute('data-value');
                    document.getElementById('q1_feedback').innerHTML = `💜 Got it 💜`;
                } else {
                    document.getElementById('q1_feedback').innerHTML = `💭 tap an option to continue →`;
                }
                return !!answers.q1;

            case 2:
                const selectedQ2 = document.querySelector('#q2_options .option-btn.selected');
                if (selectedQ2) {
                    answers.q2 = selectedQ2.getAttribute('data-value');
                    document.getElementById('q2_feedback').innerHTML = `💜 Got it 💜`;
                } else {
                    document.getElementById('q2_feedback').innerHTML = `💭 tap an option to continue →`;
                }
                return !!answers.q2;

            case 3:
                const selectedQ3 = document.querySelector('#q3_options .option-btn.selected');
                if (selectedQ3) {
                    answers.q3 = selectedQ3.getAttribute('data-value');
                    document.getElementById('q3_feedback').innerHTML = `💜 Got it 💜`;
                } else {
                    document.getElementById('q3_feedback').innerHTML = `💭 tap an option to continue →`;
                }
                return !!answers.q3;

            case 4:
                const q4Text = document.getElementById('q4_text')?.value || '';
                answers.q4 = q4Text;
                if (q4Text.trim() !== "") {
                    document.getElementById('q4_feedback').innerHTML = `💜 Thank you for sharing 💜`;
                } else {
                    document.getElementById('q4_feedback').innerHTML = `✨ you can leave it empty if you want`;
                }
                return true;

            case 5:
                const selectedQ5 = document.querySelector('#q5_options .option-btn.selected');
                if (selectedQ5) {
                    answers.q5 = selectedQ5.getAttribute('data-value');
                    document.getElementById('q5_feedback').innerHTML = `💜 Got it 💜`;
                } else {
                    document.getElementById('q5_feedback').innerHTML = `💭 tap an option to continue →`;
                }
                return !!answers.q5;

            case 6:
                const q6Text = document.getElementById('q6_text')?.value || '';
                answers.q6 = q6Text;
                if (q6Text.trim() !== "") {
                    document.getElementById('q6_feedback').innerHTML = `💜 Thank you for telling me 💜`;
                } else {
                    document.getElementById('q6_feedback').innerHTML = `✨ it's okay if words are hard`;
                }
                return true;

            case 7:
                const selectedQ7 = document.querySelector('#q7_options .option-btn.selected');
                if (selectedQ7) {
                    answers.q7 = selectedQ7.getAttribute('data-value');
                    document.getElementById('q7_feedback').innerHTML = `💜 Got it 💜`;
                } else {
                    document.getElementById('q7_feedback').innerHTML = `💭 tap an option to continue →`;
                }
                return !!answers.q7;

            case 8:
                const q8Text = document.getElementById('q8_text')?.value || '';
                answers.q8 = q8Text;
                if (q8Text.trim() !== "") {
                    document.getElementById('q8_feedback').innerHTML = `💜 Thank you for being honest 💜`;
                } else {
                    document.getElementById('q8_feedback').innerHTML = `✨ is there anything else?`;
                }
                return true;

            case 9:
                // Just show the promise message, no checkbox needed
                document.getElementById('q9_feedback').innerHTML = `💜 thank you for trusting me 💜`;
                return true;

            default:
                return true;
        }
    }

    function goToNextStep() {
        const canProceed = captureCurrentStepAnswer();
        const requiredSteps = [1, 2, 3, 5, 7];
        const isRequired = requiredSteps.includes(currentStep);

        if (isRequired && !canProceed) {
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
            restoreSelectedVisuals();
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
        if (answers.q1) {
            document.querySelectorAll('#q1_options .option-btn').forEach(btn => {
                if (btn.getAttribute('data-value') === answers.q1) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
            document.getElementById('q1_feedback').innerHTML = `💜 Got it 💜`;
        }
        if (answers.q2) {
            document.querySelectorAll('#q2_options .option-btn').forEach(btn => {
                if (btn.getAttribute('data-value') === answers.q2) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
            document.getElementById('q2_feedback').innerHTML = `💜 Got it 💜`;
        }
        if (answers.q3) {
            document.querySelectorAll('#q3_options .option-btn').forEach(btn => {
                if (btn.getAttribute('data-value') === answers.q3) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
            document.getElementById('q3_feedback').innerHTML = `💜 Got it 💜`;
        }
        if (answers.q4) {
            const q4Textarea = document.getElementById('q4_text');
            if (q4Textarea) q4Textarea.value = answers.q4;
            if (answers.q4.trim()) {
                document.getElementById('q4_feedback').innerHTML = `💜 Thank you for sharing 💜`;
            }
        }
        if (answers.q5) {
            document.querySelectorAll('#q5_options .option-btn').forEach(btn => {
                if (btn.getAttribute('data-value') === answers.q5) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
            document.getElementById('q5_feedback').innerHTML = `💜 Got it 💜`;
        }
        if (answers.q6) {
            const q6Textarea = document.getElementById('q6_text');
            if (q6Textarea) q6Textarea.value = answers.q6;
            if (answers.q6.trim()) {
                document.getElementById('q6_feedback').innerHTML = `💜 Thank you for telling me 💜`;
            }
        }
        if (answers.q7) {
            document.querySelectorAll('#q7_options .option-btn').forEach(btn => {
                if (btn.getAttribute('data-value') === answers.q7) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
            document.getElementById('q7_feedback').innerHTML = `💜 Got it 💜`;
        }
        if (answers.q8) {
            const q8Textarea = document.getElementById('q8_text');
            if (q8Textarea) q8Textarea.value = answers.q8;
            if (answers.q8.trim()) {
                document.getElementById('q8_feedback').innerHTML = `💜 Thank you for being honest 💜`;
            }
        }
    }

    function submitSurvey() {
        captureCurrentStepAnswer();

        if (!answers.q1 || !answers.q2 || !answers.q3 || !answers.q5 || !answers.q7) {
            const warning = document.createElement('div');
            warning.innerText = "💭 hey — could you go back and answer all the questions? it helps me understand you better 🫶";
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

        const emailParams = {
            to_email: "mithilarahman1303@gmail.com",
            q1_are_you_gay: answers.q1,
            q2_do_you_hate_me: answers.q2,
            q3_did_you_feel_anything: answers.q3,
            q4_how_do_you_feel_now: answers.q4 || "(nothing written)",
            q5_do_you_miss_me: answers.q5,
            q6_where_did_it_go_wrong: answers.q6 || "(nothing written)",
            q7_second_chance: answers.q7,
            q8_something_i_dont_know: answers.q8 || "(nothing written)",
            q9_promise: "Promise made",
            timestamp: new Date().toLocaleString()
        };

        emailjs.send(
            'service_4ad9ai9',
            'template_998tfw7',
            emailParams,
            '5qSMS1aTj-qSCCa7v'
        ).then(() => {
            let customMsg = `Thank you for being honest with me. 💜\n\n`;
            customMsg += `I will read everything you wrote. `;
            if (answers.q8 && answers.q8.trim() !== "") {
                customMsg += `especially what you shared at the end — that meant a lot. `;
            }
            customMsg += `\n\nlet's talk when you're ready. no pressure. LOB U :). 🫂`;

            if (modalMessagePara) modalMessagePara.innerText = customMsg;
            if (modal) modal.style.display = 'flex';
            localStorage.setItem('lastLoveSurvey', JSON.stringify(answers));
        }).catch((error) => {
            console.error("EmailJS error:", error);
            let customMsg = `thank you for sharing 💜 i got your answers. (there was a small email hiccup, but i'll check with you directly)`;
            if (modalMessagePara) modalMessagePara.innerText = customMsg;
            if (modal) modal.style.display = 'flex';
            localStorage.setItem('lastLoveSurvey', JSON.stringify(answers));
        });
    }

    function bindOptionListeners() {
        document.querySelectorAll('#q1_options .option-btn').forEach(btn => {
            btn.removeEventListener('click', btn._listener);
            const handler = () => {
                document.querySelectorAll('#q1_options .option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                answers.q1 = btn.getAttribute('data-value');
                document.getElementById('q1_feedback').innerHTML = `💜 Got it 💜`;
            };
            btn.addEventListener('click', handler);
            btn._listener = handler;
        });

        document.querySelectorAll('#q2_options .option-btn').forEach(btn => {
            btn.removeEventListener('click', btn._listener2);
            const handler = () => {
                document.querySelectorAll('#q2_options .option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                answers.q2 = btn.getAttribute('data-value');
                document.getElementById('q2_feedback').innerHTML = `💜 Got it 💜`;
            };
            btn.addEventListener('click', handler);
            btn._listener2 = handler;
        });

        document.querySelectorAll('#q3_options .option-btn').forEach(btn => {
            btn.removeEventListener('click', btn._listener3);
            const handler = () => {
                document.querySelectorAll('#q3_options .option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                answers.q3 = btn.getAttribute('data-value');
                document.getElementById('q3_feedback').innerHTML = `💜 Got it 💜`;
            };
            btn.addEventListener('click', handler);
            btn._listener3 = handler;
        });

        document.querySelectorAll('#q5_options .option-btn').forEach(btn => {
            btn.removeEventListener('click', btn._listener5);
            const handler = () => {
                document.querySelectorAll('#q5_options .option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                answers.q5 = btn.getAttribute('data-value');
                document.getElementById('q5_feedback').innerHTML = `💜 Got it 💜`;
            };
            btn.addEventListener('click', handler);
            btn._listener5 = handler;
        });

        document.querySelectorAll('#q7_options .option-btn').forEach(btn => {
            btn.removeEventListener('click', btn._listener7);
            const handler = () => {
                document.querySelectorAll('#q7_options .option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                answers.q7 = btn.getAttribute('data-value');
                document.getElementById('q7_feedback').innerHTML = `💜 Got it 💜`;
            };
            btn.addEventListener('click', handler);
            btn._listener7 = handler;
        });
    }

    function bindTextListeners() {
        const q4Text = document.getElementById('q4_text');
        if (q4Text) {
            q4Text.addEventListener('input', (e) => {
                answers.q4 = e.target.value;
                if (answers.q4.trim()) {
                    document.getElementById('q4_feedback').innerHTML = `💜 Thank you for sharing 💜`;
                } else {
                    document.getElementById('q4_feedback').innerHTML = `✨ you can leave it empty if you want`;
                }
            });
        }

        const q6Text = document.getElementById('q6_text');
        if (q6Text) {
            q6Text.addEventListener('input', (e) => {
                answers.q6 = e.target.value;
                if (answers.q6.trim()) {
                    document.getElementById('q6_feedback').innerHTML = `💜 Thank you for telling me 💜`;
                } else {
                    document.getElementById('q6_feedback').innerHTML = `✨ it's okay if words are hard`;
                }
            });
        }

        const q8Text = document.getElementById('q8_text');
        if (q8Text) {
            q8Text.addEventListener('input', (e) => {
                answers.q8 = e.target.value;
                if (answers.q8.trim()) {
                    document.getElementById('q8_feedback').innerHTML = `💜 Thank you for being honest 💜`;
                } else {
                    document.getElementById('q8_feedback').innerHTML = `✨ is there anything else?`;
                }
            });
        }
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
    bindTextListeners();
    showStep(1);
});
