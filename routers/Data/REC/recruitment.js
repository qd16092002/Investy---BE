import mongoose from "mongoose";

const Schema = mongoose.Schema;

const recruitmentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    RecruitmentTitle: String,
    Nameofthecompany: String,
    Logoofthecompany: String,
    CompanyIntroduction: String,
    Emailreceiving: String,
    Nameofthejobposition: String,
    Jobcategory: String,
    Specialization: String,
    Location: String,
    Salary: String,
    Workexperience: String,
    Jobdescription: String,
    Requirement: String,
    Remunerationpolicy: String,
    Language: String,
    avtcompany: String,
    RecruitmentDeadline: Date,
    companyType: String,
    companyScale: String,
    businessArea: String,
    poster: String,
    dateupload: {
        type: Date,
        default: Date.now
    },
    appliedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});
const Recruitment = mongoose.model('Recruitment', recruitmentSchema)

export default Recruitment;
