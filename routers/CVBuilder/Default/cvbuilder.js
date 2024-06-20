// routes/cv.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const cvBuilderSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    website: {
        type: String,
    },
    socialAccount1: {
        type: String,
    },
    socialAccount2: {
        type: String,
    },
    socialAccount3: {
        type: String,
    },
    workingexperience: [{
        title: String,
        company: String,
        description: String,
        startDate: Date,
        endDate: Date
    }],
    education: [{
        title: String,
        company: String,
        description: String,
        startDate: Date,
        endDate: Date
    }],
    project: [{
        title: String,
        position: String,
        description: String,
        customer: String,
        startDate: Date,
        endDate: Date
    }],
    certificate: [{
        certificate: String,
        organization: String,
        description: String,
        startDate: Date,
        endDate: Date
    }],
    skills: [{
        name: String,
        description: String,
    }],
    summary: String,
    template: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Template' }],
});


const CVBuilder = mongoose.model('cvBuilder', cvBuilderSchema);
export default CVBuilder;


