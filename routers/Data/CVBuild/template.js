import mongoose from "mongoose";

const Schema = mongoose.Schema;
const templateSchema = new Schema({
    typeId: {
        type: String
    },
    NameofCV: {
        type: String,
        required: true
    },
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
    experience: [{
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
    cert: [{
        title: String,
        organization: String,
        description: String,
        startDate: Date,
        endDate: Date
    }],
    skills: [{
        nameofSkills: String,
        description: String,
    }],
    summary: String,
});
const Template = mongoose.model('Template', templateSchema)
export default Template;