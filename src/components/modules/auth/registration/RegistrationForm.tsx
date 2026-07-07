// "use client";

// import { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Controller, FormProvider } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { RiArrowRightLine } from "react-icons/ri";

// import DatePickerSingle from "@/components/shared/DatePickerSingle";
// import ImageUploadField from "@/components/shared/ImageUploadField";
// import InputField from "@/components/shared/InputField";
// import PasswordField from "@/components/shared/PasswordField";
// import PrimaryButton from "@/components/shared/PrimaryButton";
// import SingleSelect from "@/components/shared/SingleSelect";
// import TextAreaBox from "@/components/shared/TextAreaBox";
// import { useFormWithToast } from "@/hooks/useFormWithToast";
// import { useRegisterUserMutation } from "@/redux/apis/authApi";
// import { useGetActiveBatchesQuery } from "@/redux/apis/batchApi";
// import {
//     REGISTRATION_FIELD_ORDER,
//     RegistrationFormValues,
//     registrationSchema,
// } from "./registrationSchema";
// import { constantsData } from "@/constants";
// import { IRegisterPayload } from "@/app/(auth)/auth.types";

// const RegistrationForm = () => {
//     const router = useRouter();
//     const [selectedCountry, setSelectedCountry] = useState("Bangladesh");
//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [imageFile, setImageFile] = useState<File | null>(null);
//     const [alumniProofFile, setAlumniProofFile] = useState<File | null>(null);
//     const [alumniProofError, setAlumniProofError] = useState<string | undefined>();

//     const [registerUser, { isLoading }] = useRegisterUserMutation();
//     const { data: batchData, isFetching: batchesLoading } = useGetActiveBatchesQuery();

//     const methods = useFormWithToast<RegistrationFormValues>(
//         {
//             resolver: zodResolver(registrationSchema),
//             defaultValues: {
//                 name: "",
//                 email: "",
//                 batch: "",
//                 section: "",
//                 bloodGroup: "",
//                 dob: "",
//                 phone: "",
//                 currentAddress: "",
//                 permanentAddress: "",
//                 workplace: "",
//                 position: "",
//                 password: "",
//                 confirmPassword: "",
//             },
//         },
//         { fieldOrder: REGISTRATION_FIELD_ORDER }
//     );

//     const {
//         register,
//         control,
//         handleSubmit,
//         setValue,
//         reset,
//         formState: { errors },
//     } = methods;

//     const normalizedPhone = phoneNumber.replace(/\D/g, "");
//     const selectedEntry = useMemo(
//         () => constantsData.COUNTRY_CODES.find((c) => c.country === selectedCountry),
//         [selectedCountry]
//     );
//     const dialCode = selectedEntry?.code ?? "+880";
//     const combinedPhone = `${dialCode}${normalizedPhone}`;
//     const countryCodeOptions = useMemo(
//         () => constantsData.COUNTRY_CODES.map((c) => ({ ...c, value: c.country })),
//         []
//     );

//     const batchOptions = (batchData?.data ?? []).map((b) => ({
//         label: String(b.year),
//         value: String(b.year),
//     }));

//     const bloodGroupOptions = useMemo(
//         () => constantsData.BLOOD_GROUPS.map((group) => ({ label: group, value: group })),
//         []
//     );

//     // const sectionOptions = useMemo(() => constantsData.SECTIONS, []);
//     const sectionOptions = Object.values(constantsData.SECTIONS).map((section) => ({ label: section, value: section }));

//     const onSubmit = async (data: RegistrationFormValues) => {
//         if (!alumniProofFile) {
//             setAlumniProofError("Alumni proof image is required");
//             toast.error("Please upload your alumni proof to proceed with registration.");
//             return;
//         }
//         setAlumniProofError(undefined);

//         const payload: IRegisterPayload = {
//             name: data.name,
//             email: data.email,
//             phone: combinedPhone,
//             country: selectedCountry,
//             batch: Number(data.batch),
//             section: data.section,
//             bloodGroup: data.bloodGroup,
//             dob: data.dob,
//             currentAddress: data.currentAddress,
//             permanentAddress: data.permanentAddress,
//             workplace: data.workplace || undefined,
//             position: data.position || undefined,
//             password: data.password,
//         };

//         try {
//             const result = await registerUser({ payload, image: imageFile, alumniProof: alumniProofFile }).unwrap();
//             toast.success(result.message);
//             reset();
//             setSelectedCountry("Bangladesh");
//             setPhoneNumber("");
//             setImageFile(null);
//             setAlumniProofFile(null);
//             setAlumniProofError(undefined);
//             router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
//         } catch {}
//     };

//     return (
//         <FormProvider {...methods}>
//             <form
//                 className="mt-7 space-y-4"
//                 onSubmit={handleSubmit(onSubmit)}
//                 noValidate
//             >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <ImageUploadField
//                         value={imageFile}
//                         onChange={setImageFile}
//                         label="Profile Image"
//                         helperText="JPG, PNG or WEBP — square or portrait photo works best"
//                     />

//                     <ImageUploadField
//                         value={alumniProofFile}
//                         onChange={(file) => {
//                             setAlumniProofFile(file);
//                             if (file) setAlumniProofError(undefined);
//                         }}
//                         label="Alumni Proof"
//                         helperText="Upload your student ID, certificate, Testimonial, Marks sheet or any proof of alumni status (JPG, PNG or WEBP)"
//                         error={alumniProofError}
//                         required
//                     />
//                 </div>

//                 <InputField
//                     {...register("name")}
//                     id="reg-name"
//                     label="Full Name"
//                     placeholder="Your full name"
//                     error={errors.name?.message}
//                     required
//                 />

//                 <div className="grid gap-4 md:grid-cols-2">
//                     <InputField
//                         {...register("email")}
//                         id="reg-email"
//                         type="email"
//                         label="Email Address"
//                         placeholder="you@example.com"
//                         error={errors.email?.message}
//                         required
//                     />

//                     <div className="flex flex-col gap-1.5">
//                         <label
//                             className={`block text-xs ${errors.phone ? "text-danger" : "text-primary2-800 dark:text-gunmetal-300"}`}
//                         >
//                             Phone Number<span className="text-danger">*</span>
//                         </label>
//                         <div className="space-y-1.5">
//                             <div className="grid gap-2 grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
//                                 <SingleSelect
//                                     id="reg-country-code"
//                                     value={selectedCountry}
//                                     onValueChange={(val) => {
//                                         setSelectedCountry(val);
//                                         const entry = constantsData.COUNTRY_CODES.find((c) => c.country === val);
//                                         const code = entry?.code ?? "+880";
//                                         setValue("phone", `${code}${normalizedPhone}`);
//                                     }}
//                                     options={countryCodeOptions}
//                                     placeholder="Code"
//                                     searchPlaceholder="Search country"
//                                     searchable
//                                     error={errors.phone ? true : undefined}
//                                 />

//                                 <InputField
//                                     id="reg-phone"
//                                     type="tel"
//                                     inputMode="numeric"
//                                     value={phoneNumber}
//                                     onChange={(e) => {
//                                         const next = e.target.value;
//                                         setPhoneNumber(next);
//                                         setValue("phone", `${dialCode}${next.replace(/\D/g, "")}`);
//                                     }}
//                                     placeholder="1XXXXXXXXX"
//                                     error={errors.phone?.message}
//                                     isShowErrorMessage={false}
//                                 />
//                             </div>
//                             {errors.phone && (
//                                 <p className="text-danger text-xs">{errors.phone.message}</p>
//                             )}
//                         </div>
//                     </div>
//                 </div>


//                 <div className="grid gap-4 sm:grid-cols-2">
//                     <Controller
//                         name="batch"
//                         control={control}
//                         render={({ field }) => (
//                             <SingleSelect
//                                 id="reg-batch"
//                                 label="Batch Year"
//                                 value={field.value || ""}
//                                 onValueChange={field.onChange}
//                                 options={batchOptions}
//                                 placeholder="Select your batch"
//                                 searchPlaceholder="Search batch year"
//                                 error={errors.batch?.message}
//                                 isLoading={batchesLoading}
//                                 required
//                             />
//                         )}
//                     />

//                     <Controller
//                         name="section"
//                         control={control}
//                         render={({ field }) => (
//                             <SingleSelect
//                                 id="reg-section"
//                                 label="Group" //section
//                                 value={field.value || ""}
//                                 onValueChange={field.onChange}
//                                 options={sectionOptions}
//                                 placeholder="Select your group"
//                                 searchable={false}
//                                 error={errors.section?.message}
//                                 required
//                             />
//                         )}
//                     />
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                     <Controller
//                         name="bloodGroup"
//                         control={control}
//                         render={({ field }) => (
//                             <SingleSelect
//                                 id="reg-blood-group"
//                                 label="Blood Group"
//                                 value={field.value || ""}
//                                 onValueChange={field.onChange}
//                                 options={bloodGroupOptions}
//                                 placeholder="Select blood group"
//                                 error={errors.bloodGroup?.message}
//                                 required
//                             />
//                         )}
//                     />

//                     <Controller
//                         name="dob"
//                         control={control}
//                         render={({ field }) => (
//                             <DatePickerSingle
//                                 id="reg-dob"
//                                 label="Date of Birth"
//                                 value={field.value}
//                                 onChange={field.onChange}
//                                 error={errors.dob?.message}
//                                 required
//                             />
//                         )}
//                     />
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                     <TextAreaBox
//                         {...register("currentAddress")}
//                         id="reg-current-address"
//                         label="Current Address"
//                         placeholder="Your current residential address"
//                         error={errors.currentAddress?.message}
//                         required
//                     />
//                     <TextAreaBox
//                         {...register("permanentAddress")}
//                         id="reg-permanent-address"
//                         label="Permanent Address"
//                         placeholder="Your permanent home address"
//                         error={errors.permanentAddress?.message}
//                         required
//                     />
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                     <InputField
//                         {...register("workplace")}
//                         id="reg-workplace"
//                         label="Workplace"
//                         placeholder="School, company or organization"
//                     />
//                     <InputField
//                         {...register("position")}
//                         id="reg-position"
//                         label="Position / Role"
//                         placeholder="Your current role or title"
//                     />
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                     <Controller
//                         name="password"
//                         control={control}
//                         render={({ field }) => (
//                             <PasswordField
//                                 id="reg-password"
//                                 name={field.name}
//                                 label="Password"
//                                 value={field.value}
//                                 onBlur={field.onBlur}
//                                 onChange={field.onChange}
//                                 error={errors.password?.message}
//                                 required
//                             />
//                         )}
//                     />
//                     <Controller
//                         name="confirmPassword"
//                         control={control}
//                         render={({ field }) => (
//                             <PasswordField
//                                 id="reg-confirm-password"
//                                 name={field.name}
//                                 label="Confirm Password"
//                                 value={field.value}
//                                 onBlur={field.onBlur}
//                                 onChange={field.onChange}
//                                 error={errors.confirmPassword?.message}
//                                 required
//                             />
//                         )}
//                     />
//                 </div>

//                 <div
//                     className="rounded-2xl border px-4 py-3 text-sm bg-primary2-50 dark:bg-gunmetal-600 text-gunmetal-300">
//                     <strong>Note:</strong> After registration, your account stays pending until admin approval and email
//                     verification are completed.
//                 </div>

//                 <div className="w-full sm:w-fit mx-auto">
//                     <PrimaryButton
//                         type="submit"
//                         title="Submit Registration"
//                         icon2={<RiArrowRightLine />}
//                         iconSide2="right"
//                         isFullWidth
//                         isLoading={isLoading}
//                         loadingTitle="Submitting..."
//                     />
//                 </div>
//             </form>
//         </FormProvider>
//     );
// };
// export default RegistrationForm;










"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
    RiArrowRightLine,
    RiArrowLeftLine,
    RiUserLine,
    RiGraduationCapLine,
    RiMapPinLine,
    RiShieldCheckLine,
} from "react-icons/ri";

import DatePickerSingle from "@/components/shared/DatePickerSingle";
import ImageUploadField from "@/components/shared/ImageUploadField";
import InputField from "@/components/shared/InputField";
import PasswordField from "@/components/shared/PasswordField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import SingleSelect from "@/components/shared/SingleSelect";
import TextAreaBox from "@/components/shared/TextAreaBox";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import { useRegisterUserMutation } from "@/redux/apis/authApi";
import { useGetActiveBatchesQuery } from "@/redux/apis/batchApi";
import {
    REGISTRATION_FIELD_ORDER,
    RegistrationFormValues,
    registrationSchema,
} from "./registrationSchema";
import { constantsData } from "@/constants";
import { IRegisterPayload } from "@/app/(auth)/auth.types";
import RegistrationStepper, { StepMeta } from "./RegistrationStepper";

interface StepConfig extends StepMeta {
    fields: (keyof RegistrationFormValues)[];
}

const STEPS: StepConfig[] = [
    {
        id: 0,
        title: "Personal Info",
        subtitle: "Let's start with who you are.",
        icon: <RiUserLine className="h-5 w-5" />,
        fields: ["name", "email", "phone"],
    },
    {
        id: 1,
        title: "Academic & Health",
        subtitle: "Your batch, group and emergency health info.",
        icon: <RiGraduationCapLine className="h-5 w-5" />,
        fields: ["batch", "section", "bloodGroup", "dob"],
    },
    {
        id: 2,
        title: "Address & Career",
        subtitle: "Where you live and what you do now.",
        icon: <RiMapPinLine className="h-5 w-5" />,
        fields: ["currentAddress", "permanentAddress"],
    },
    {
        id: 3,
        title: "Documents & Security",
        subtitle: "Verify your identity and secure your account.",
        icon: <RiShieldCheckLine className="h-5 w-5" />,
        fields: ["password", "confirmPassword"],
    },
];

const TOTAL_STEPS = STEPS.length;

const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

const RegistrationForm = () => {
    const router = useRouter();
    const formTopRef = useRef<HTMLDivElement>(null);

    const [currentStep, setCurrentStep] = useState(0);
    const [furthestStep, setFurthestStep] = useState(0);
    const [direction, setDirection] = useState(1);

    const [selectedCountry, setSelectedCountry] = useState("Bangladesh");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [alumniProofFile, setAlumniProofFile] = useState<File | null>(null);
    const [alumniProofError, setAlumniProofError] = useState<string | undefined>();

    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const { data: batchData, isFetching: batchesLoading } = useGetActiveBatchesQuery();

    const methods = useFormWithToast<RegistrationFormValues>(
        {
            resolver: zodResolver(registrationSchema),
            mode: "onTouched",
            defaultValues: {
                name: "",
                email: "",
                batch: "",
                section: "",
                bloodGroup: "",
                dob: "",
                phone: "",
                currentAddress: "",
                permanentAddress: "",
                workplace: "",
                position: "",
                password: "",
                confirmPassword: "",
            },
        },
        { fieldOrder: REGISTRATION_FIELD_ORDER }
    );

    const {
        register,
        control,
        handleSubmit,
        trigger,
        setValue,
        reset,
        formState: { errors },
    } = methods;

    const normalizedPhone = phoneNumber.replace(/\D/g, "");
    const selectedEntry = useMemo(
        () => constantsData.COUNTRY_CODES.find((c) => c.country === selectedCountry),
        [selectedCountry]
    );
    const dialCode = selectedEntry?.code ?? "+880";
    const combinedPhone = `${dialCode}${normalizedPhone}`;
    const countryCodeOptions = useMemo(
        () => constantsData.COUNTRY_CODES.map((c) => ({ ...c, value: c.country })),
        []
    );

    const batchOptions = (batchData?.data ?? []).map((b) => ({
        label: String(b.year),
        value: String(b.year),
    }));

    const bloodGroupOptions = useMemo(
        () => constantsData.BLOOD_GROUPS.map((group) => ({ label: group, value: group })),
        []
    );

    const sectionOptions = Object.values(constantsData.SECTIONS).map((section) => ({
        label: section,
        value: section,
    }));

    // Scroll to top of the form whenever the step changes — important on mobile
    // where the previous step's content may have scrolled the page down.
    useEffect(() => {
        formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [currentStep]);

    const goToStep = (stepId: number) => {
        if (stepId > furthestStep) return; // can't skip ahead, only revisit
        setDirection(stepId > currentStep ? 1 : -1);
        setCurrentStep(stepId);
    };

    const goNext = async () => {
        const stepFields = STEPS[currentStep].fields;
        const isValid = await trigger(stepFields, { shouldFocus: true });

        if (!isValid) {
            toast.error("Please complete the required fields before continuing.");
            return;
        }

        const next = currentStep + 1;
        setDirection(1);
        setFurthestStep((prev) => Math.max(prev, next));
        setCurrentStep(next);
    };

    const goBack = () => {
        setDirection(-1);
        setCurrentStep((s) => Math.max(0, s - 1));
    };

    const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key !== "Enter") return;
        const target = e.target as HTMLElement;
        // Allow natural newline / multi-line behaviour inside textareas.
        if (target.tagName === "TEXTAREA") return;

        e.preventDefault();
        if (currentStep < TOTAL_STEPS - 1) {
            goNext();
        } else {
            handleSubmit(onSubmit)();
        }
    };

    const onSubmit = async (data: RegistrationFormValues) => {
        if (!alumniProofFile) {
            setAlumniProofError("Alumni proof image is required");
            toast.error("Please upload your alumni proof to proceed with registration.");
            return;
        }
        setAlumniProofError(undefined);

        const payload: IRegisterPayload = {
            name: data.name,
            email: data.email,
            phone: combinedPhone,
            country: selectedCountry,
            batch: Number(data.batch),
            section: data.section,
            bloodGroup: data.bloodGroup,
            dob: data.dob,
            currentAddress: data.currentAddress,
            permanentAddress: data.permanentAddress,
            workplace: data.workplace || undefined,
            position: data.position || undefined,
            password: data.password,
        };

        try {
            const result = await registerUser({ payload, image: imageFile, alumniProof: alumniProofFile }).unwrap();
            toast.success(result.message);
            reset();
            setSelectedCountry("Bangladesh");
            setPhoneNumber("");
            setImageFile(null);
            setAlumniProofFile(null);
            setAlumniProofError(undefined);
            setCurrentStep(0);
            setFurthestStep(0);
            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        } catch { }
    };

    const isLastStep = currentStep === TOTAL_STEPS - 1;

    return (
        <FormProvider {...methods}>
            <div ref={formTopRef} />
            <RegistrationStepper
                steps={STEPS}
                currentStep={currentStep}
                furthestStep={furthestStep}
                onStepClick={goToStep}
            />

            <form className="mt-2" onSubmit={handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown} noValidate>
                <div className="mb-5">
                    <h3 className="text-lg font-bold text-primary2-900 dark:text-gunmetal-100">
                        {STEPS[currentStep].title}
                    </h3>
                    <p className="text-sm text-gunmetal-300">{STEPS[currentStep].subtitle}</p>
                </div>

                <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="space-y-4"
                    >
                        {/* Step 0 — Personal Info */}
                        {currentStep === 0 && (
                            <>
                                <InputField
                                    {...register("name")}
                                    id="reg-name"
                                    label="Full Name"
                                    placeholder="Your full name"
                                    error={errors.name?.message}
                                    required
                                />

                                <InputField
                                    {...register("email")}
                                    id="reg-email"
                                    type="email"
                                    label="Email Address"
                                    placeholder="you@example.com"
                                    error={errors.email?.message}
                                    required
                                />

                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className={`block text-xs ${errors.phone ? "text-danger" : "text-primary2-800 dark:text-gunmetal-300"
                                            }`}
                                    >
                                        Phone Number<span className="text-danger">*</span>
                                    </label>
                                    <div className="space-y-1.5">
                                        <div className="grid gap-2 grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                                            <SingleSelect
                                                id="reg-country-code"
                                                value={selectedCountry}
                                                onValueChange={(val) => {
                                                    setSelectedCountry(val);
                                                    const entry = constantsData.COUNTRY_CODES.find(
                                                        (c) => c.country === val
                                                    );
                                                    const code = entry?.code ?? "+880";
                                                    setValue("phone", `${code}${normalizedPhone}`, {
                                                        shouldValidate: true,
                                                    });
                                                }}
                                                options={countryCodeOptions}
                                                placeholder="Code"
                                                searchPlaceholder="Search country"
                                                searchable
                                                error={errors.phone ? true : undefined}
                                            />

                                            <InputField
                                                id="reg-phone"
                                                type="tel"
                                                inputMode="numeric"
                                                value={phoneNumber}
                                                onChange={(e) => {
                                                    const next = e.target.value;
                                                    setPhoneNumber(next);
                                                    setValue("phone", `${dialCode}${next.replace(/\D/g, "")}`, {
                                                        shouldValidate: true,
                                                    });
                                                }}
                                                placeholder="1XXXXXXXXX"
                                                error={errors.phone?.message}
                                                isShowErrorMessage={false}
                                            />
                                        </div>
                                        {errors.phone && <p className="text-danger text-xs">{errors.phone.message}</p>}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 1 — Academic & Health */}
                        {currentStep === 1 && (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Controller
                                        name="batch"
                                        control={control}
                                        render={({ field }) => (
                                            <SingleSelect
                                                id="reg-batch"
                                                label="Batch Year"
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                options={batchOptions}
                                                placeholder="Select your batch"
                                                searchPlaceholder="Search batch year"
                                                error={errors.batch?.message}
                                                isLoading={batchesLoading}
                                                required
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="section"
                                        control={control}
                                        render={({ field }) => (
                                            <SingleSelect
                                                id="reg-section"
                                                label="Group"
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                options={sectionOptions}
                                                placeholder="Select your group"
                                                searchable={false}
                                                error={errors.section?.message}
                                                required
                                            />
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Controller
                                        name="bloodGroup"
                                        control={control}
                                        render={({ field }) => (
                                            <SingleSelect
                                                id="reg-blood-group"
                                                label="Blood Group"
                                                value={field.value || ""}
                                                onValueChange={field.onChange}
                                                options={bloodGroupOptions}
                                                placeholder="Select blood group"
                                                error={errors.bloodGroup?.message}
                                                required
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="dob"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePickerSingle
                                                id="reg-dob"
                                                label="Date of Birth"
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.dob?.message}
                                                required
                                            />
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        {/* Step 2 — Address & Career */}
                        {currentStep === 2 && (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <TextAreaBox
                                        {...register("currentAddress")}
                                        id="reg-current-address"
                                        label="Current Address"
                                        placeholder="Your current residential address"
                                        error={errors.currentAddress?.message}
                                        required
                                    />
                                    <TextAreaBox
                                        {...register("permanentAddress")}
                                        id="reg-permanent-address"
                                        label="Permanent Address"
                                        placeholder="Your permanent home address"
                                        error={errors.permanentAddress?.message}
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <InputField
                                        {...register("workplace")}
                                        id="reg-workplace"
                                        label="Workplace"
                                        placeholder="School, company or organization"
                                    />
                                    <InputField
                                        {...register("position")}
                                        id="reg-position"
                                        label="Position / Role"
                                        placeholder="Your current role or title"
                                    />
                                </div>
                            </>
                        )}

                        {/* Step 3 — Documents & Security */}
                        {currentStep === 3 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ImageUploadField
                                        value={imageFile}
                                        onChange={setImageFile}
                                        label="Profile Image"
                                        helperText="JPG, PNG or WEBP — square or portrait photo works best"
                                    />

                                    <ImageUploadField
                                        value={alumniProofFile}
                                        onChange={(file) => {
                                            setAlumniProofFile(file);
                                            if (file) setAlumniProofError(undefined);
                                        }}
                                        label="Alumni Proof"
                                        helperText="Student ID, certificate, testimonial, marks sheet or any proof of alumni status"
                                        error={alumniProofError}
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <PasswordField
                                                id="reg-password"
                                                name={field.name}
                                                label="Password"
                                                value={field.value}
                                                onBlur={field.onBlur}
                                                onChange={field.onChange}
                                                error={errors.password?.message}
                                                required
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="confirmPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <PasswordField
                                                id="reg-confirm-password"
                                                name={field.name}
                                                label="Confirm Password"
                                                value={field.value}
                                                onBlur={field.onBlur}
                                                onChange={field.onChange}
                                                error={errors.confirmPassword?.message}
                                                required
                                            />
                                        )}
                                    />
                                </div>

                                <div className="rounded-2xl border px-4 py-3 text-sm bg-primary2-50 dark:bg-gunmetal-600 text-gunmetal-300">
                                    <strong>Note:</strong> After registration, your account stays pending until admin
                                    approval and email verification are completed.
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-7 flex items-center gap-3">
                    {currentStep > 0 && (
                        <button
                            type="button"
                            onClick={goBack}
                            className="inline-flex items-center gap-1.5 rounded-full border border-primary2-100 dark:border-gunmetal-500 px-5 py-2.5 text-sm font-semibold text-primary2-900 dark:text-gunmetal-200 transition-colors hover:bg-primary2-50 dark:hover:bg-gunmetal-700"
                        >
                            <RiArrowLeftLine />
                            Back
                        </button>
                    )}

                    <div className="flex-1">
                        {isLastStep ? (
                            <PrimaryButton
                                type="submit"
                                title="Submit Registration"
                                icon2={<RiArrowRightLine />}
                                iconSide2="right"
                                isFullWidth
                                isLoading={isLoading}
                                loadingTitle="Submitting..."
                            />
                        ) : (
                            <PrimaryButton
                                type="button"
                                title="Continue"
                                icon2={<RiArrowRightLine />}
                                iconSide2="right"
                                isFullWidth
                                onClick={goNext}
                            />
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};
export default RegistrationForm;