import authencationRouter from "./authencation/User/authentication.js";
import notifyRouter from "./notify/notify.js";
import otpRouter from "./authencation/Email/EmailVerificationMessage.js";
import blogRouter from "./blog/blog.js";
import reviewRouter from "./authencation/Review/review.js";
import talentRouter from "./authencation/Applicant/talentpool.js";
import portfolioRouter from "./authencation/profileUser/portfolio/portfolio.js";
import servicesRouter from "./authencation/profileUser/services/services.js"
import templateCvRouter from "./CVBuilder/Template/cvtemplate.js"
import recruitmentRouter from "./authencation/Recruitment/recruitment.js"
import profileUserRouter from "./authencation/profileUser/profileUser.js"
import appliuserRouter from "./authencation/Recruitment/appliuser.js"
import coverletterRouter from "./authencation/profileUser/CV&Coverletter/cv.js"
import companypoolsRouter from "./authencation/Applicant/companypool.js"
import joblistRouter from "./authencation/Applicant/recruitmentpool.js"
import firebaseRouter from "./CVBuilder/Template/upload_firebase.js"
export {
    authencationRouter,
    notifyRouter,
    otpRouter,
    blogRouter,
    reviewRouter,
    talentRouter,
    portfolioRouter,
    servicesRouter,
    templateCvRouter,
    recruitmentRouter,
    profileUserRouter,
    appliuserRouter,
    coverletterRouter,
    companypoolsRouter,
    joblistRouter,
    firebaseRouter
};
