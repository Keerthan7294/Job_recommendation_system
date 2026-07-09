export const getMatchedJobs = (userProfile, jobs) => {
    const { degree, cgpa, projects, internships } = userProfile;
    const userExperienceText = `${projects || ''} ${internships || ''}`.toLowerCase();
    const matchedJobs = jobs.filter(job => {
        const hasMatchingSkill = job.requiredSkills.some(skill =>
            userExperienceText.includes(skill.toLowerCase())
        );
        const hasMatchingProject = job.projectKeywords && job.projectKeywords.some(keyword =>
            userExperienceText.includes(keyword.toLowerCase())
        );
        return hasMatchingSkill || hasMatchingProject;
    });
    return matchedJobs;
};
