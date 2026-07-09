document.addEventListener('DOMContentLoaded', () => {
    const matchForm = document.getElementById('matchForm');
    const resultsContainer = document.getElementById('results');
    const submitBtn = document.getElementById('findMatchesBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/logout', { method: 'POST' });
                if (response.ok) {
                    window.location.href = '/login.html';
                }
            } catch (error) {
                console.error("Oops! Something went wrong during logout:", error);
            }
        });
    }
    matchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Finding Perfect Matches...';
        submitBtn.disabled = true;
        try {
            const formData = new FormData(matchForm);
            const projects = formData.getAll('projects').join(' ');
            const internships = formData.getAll('internships').join(' ');
            const userProfile = {
                degree: formData.get('degree'),
                cgpa: formData.get('cgpa'),
                projects: projects,
                internships: internships
            };
            const response = await fetch('/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userProfile)
            });
            const data = await response.json();
            if (data.success) {
                renderJobs(data.matchedJobs);
            } else {
                showError("We couldn't fetch your matched jobs right now.");
            }
        } catch (error) {
            console.error("Error fetching matches:", error);
            showError("An error occurred. Please check your connection and try again.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    const renderJobs = (jobs) => {
        resultsContainer.innerHTML = '';
        if (jobs.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No perfect matches found. Try selecting different keywords!</p>
                </div>
            `;
            return;
        }
        jobs.forEach((job, index) => {
            const skillsHtml = job.requiredSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
            const projectsHtml = job.projectKeywords ? job.projectKeywords.map(kw => `<span class="skill-tag" style="background: rgba(139, 92, 246, 0.15); color: #c4b5fd; border-color: rgba(139, 92, 246, 0.3);">${kw}</span>`).join('') : '';
            const card = document.createElement('div');
            card.className = 'job-card';
            card.style.animationDelay = `${index * 0.15}s`;
            card.innerHTML = `
                <h3 class="job-title">${job.title}</h3>
                <p class="job-desc">${job.description}</p>
                <div class="job-skills">
                    <div style="margin-bottom:8px"><strong>Skills:</strong> ${skillsHtml}</div>
                    ${projectsHtml ? `<div><strong>Projects:</strong> ${projectsHtml}</div>` : ''}
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    };
    const showError = (message) => {
        resultsContainer.innerHTML = `
            <div class="empty-state" style="border-color: #ef4444; color: #ef4444;">
                <p>${message}</p>
            </div>
        `;
    };
});
