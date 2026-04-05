import { baseApi } from "./baseApi";

const skillsApi = baseApi.injectEndpoints({
    endpoints:builder=>({
        createSkill : builder.mutation({
            query:(skillData)=>({
                url:"/skills/create",
                method:"POST",
                body:skillData
            }),
            invalidatesTags:["skills"]
        }),
        getAllSkills:builder.query({
            query:()=>({url:"/skills/list"}),
            providesTags:["skills"]
        }),
        editSkill:builder.mutation({
            query:({id, data})=>({
                url:`/skills/edit/${id}`,
                method:"PATCH",
                body:data
            }),
            invalidatesTags:["skills"]
        }),
        deleteSkill:builder.mutation({
            query:(id)=>({
                url:`/skills/delete/${id}`,
                method:"DELETE"
            }),
            invalidatesTags:["skills"]
        })
    })
})

export const{
    useCreateSkillMutation,
    useGetAllSkillsQuery,
    useEditSkillMutation,
    useDeleteSkillMutation
} = skillsApi