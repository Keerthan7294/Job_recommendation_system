import mongoose from 'mongoose';
const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: { type: [String], required: true },
    projectKeywords: { type: [String], required: false }
});
export default mongoose.model('Job', JobSchema);
