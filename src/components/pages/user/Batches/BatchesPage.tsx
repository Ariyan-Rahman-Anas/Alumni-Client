import BatchPageHead from "@/components/modules/user/batches/BatchPageHead";
import BatchPageUsersWithSearchFilter from "@/components/modules/user/batches/BatchPageUsersWithSearchFilter";

const BatchesPage = () => {
    return (
        <div>
            {/* ═══ HERO */}
            <BatchPageHead />

            {/* ═══ DIRECTORY  */}
            <BatchPageUsersWithSearchFilter />
        </div>
    );
};
export default BatchesPage;
