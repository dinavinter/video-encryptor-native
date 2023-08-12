import FilesStoreProvider from "../db/store/StoreProvider";
import FileSelect from "../components/FileSelect";

export const Dashboard = () => {
    return (
        <div>
            <FilesStoreProvider adapter={"idb"}>
                <FileSelect />
            </FilesStoreProvider>
        </div>
    );
};