import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        // required: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "APPLICANT", "RECRUITER", "SUPPER_ADMIN"],
        required: true,
    },
    avturl: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    companyName: {
        type: String,
    },
    position: {
        type: String,
    },
    location: {
        type: String,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Services' }],
    portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' }],
    cv: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CVUser' }],
    coverletter: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CoverLetter' }],
    cvBuilder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cvBuilder' }],
    template: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Template' }],
    introduction: [{
        description: String,
        area: String,
        timemonth: String,
        timeyear: String,
        employees: String,
        address: String,
        website: String,
        specialization: String,
        level: String,
        yearofexperience: String,
        location: String,
        media: String,
    }],
    ourstory: [{
        overview: String,
        media: String,
    }],
    benefits: [{
        overview: String,
        media: String,
    }],
    ourteam: [{
        overview: String,
        media: String,
    }],
    introdect: [{
        file: String,
    }],
    videointroduction: [{
        description: String,
        linkyoutube: String,
        video: String,
    }],
    education: [{
        avteducation: String,
        university: String,
        major: String,
        startingtimemonth: String,
        startingtimeyear: String,
        finishingtimemonth: String,
        finishingtimeyear: String,
        description: String,
        level: String,
    }],
    workingexperience: [{
        avtworking: String,
        company: String,
        position: String,
        startingtimemonth: String,
        startingtimeyear: String,
        finishingtimemonth: String,
        finishingtimeyear: String,
        description: String,
    }],
    skills: [{
        name: String,
        organization: String,
        evaluation: Number,
        description: String,
    }],
    certificate: [{
        certificate: String,
        organization: String,
        startingtimemonth: String,
        startingtimeyear: String,
        finishingtimemonth: String,
        finishingtimeyear: String,
        file: String,
    }],
    extracurricular: [{
        organization: String,
        position: String,
        startingtimemonth: String,
        startingtimeyear: String,
        finishingtimemonth: String,
        finishingtimeyear: String,
        description: String,
    }],
    language: [{
        language: String,
        detail: String,
    }],
    selectedApplicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant'
    }],
    selectedRecruiters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter' // Tham chiếu đến mô hình người dùng
    }],
    selectedRecruitments: [{ type: Schema.Types.ObjectId, ref: 'Recruitment' }],
    selected: {
        type: Boolean,
        default: false
    },
    isLocked: { type: Boolean, default: false }
});
const User = mongoose.model('User', userSchema);
export default User;
