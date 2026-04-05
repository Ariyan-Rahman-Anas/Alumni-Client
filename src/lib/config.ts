const ServerUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const ResumeUrl = process.env.NEXT_PUBLIC_RESUME_URL;
const FormUrl = process.env.NEXT_PUBLIC_FORM_URL;

export const API_CONFIG = {
    base_url: ServerUrl,
    resume_url: ResumeUrl,
    form_url: FormUrl,
};