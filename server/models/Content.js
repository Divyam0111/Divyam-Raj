import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  settings: {
    admin_email: { type: String, default: "" },
    admin_password: { type: String, default: "" },
    template: { type: String, default: "modern-dark" }
  },
  hero: {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    cta_text: { type: String, default: "" },
    resume_text: { type: String, default: "" },
    bg_image: { type: String, default: "" },
    profile_image: { type: String, default: "" }
  },
  about: {
    title: { type: String, default: "" },
    p1: { type: String, default: "" },
    p2: { type: String, default: "" },
    p3: { type: String, default: "" }
  },
  experience: [{
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    period: { type: String, default: "" },
    logo: { type: String, default: "" },
    description: { type: String, default: "" }
  }],
  portfolio: [{
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    image_url: { type: String, default: "" }
  }],
  skills: {
    design: [String],
    frontend: [String],
    tools: [String],
    soft_skills: [String]
  },
  contact: {
    title: { type: String, default: "" },
    heading: { type: String, default: "" },
    description: { type: String, default: "" },
    email: { type: String, default: "" }
  }
}, { timestamps: true });

const Content = mongoose.model('Content', contentSchema);
export default Content;
