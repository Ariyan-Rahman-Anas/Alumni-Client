 export interface ExperienceI {
        _id?: string;
        title: string;
        employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
        company: string;
        startDate: string;
        endDate?: string | null;
        duration?: string | null;
        current?: boolean;
        location: string;
        workType: "On-site" | "Remote" | "Hybrid";
        skills: string[];
        serialNumber: number;
        createdAt: string;
        updatedAt: string;
}