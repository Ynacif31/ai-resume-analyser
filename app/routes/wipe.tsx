import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { useAuthGuard } from "~/hooks/use-auth-guard";

export const loader = () => {
    if (import.meta.env.PROD) {
        throw new Response('Not Found', { status: 404 });
    }
    return null;
};

const WipeApp = () => {
    useAuthGuard();
    const { auth, fs, kv } = usePuterStore();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        try {
            const loadedFiles = (await fs.readDir("./")) as FSItem[];
            setFiles(loadedFiles || []);
        } catch (err) {
            console.error('Failed to load files:', err);
        }
    };

    useEffect(() => {
        loadFiles();
    }, [fs]);

    const handleDelete = async () => {
        try {
            for (const file of files) {
                await fs.delete(file.path);
            }
            await kv.flush();
            loadFiles();
        } catch (err) {
            console.error('Failed to delete files:', err);
        }
    };

    return (
        <div>
            Authenticated as: {auth.user?.username}
            <div>Existing files:</div>
            <div className="flex flex-col gap-4">
                {files.map((file) => (
                    <div key={file.id} className="flex flex-row gap-4">
                        <p>{file.name}</p>
                    </div>
                ))}
            </div>
            <div>
                <button
                    className="primary-gradient text-white px-4 py-2 rounded-md cursor-pointer hover:primary-gradient-hover transition-colors"
                    onClick={() => handleDelete()}
                >
                    Wipe App Data
                </button>
            </div>
        </div>
    );
};

export default WipeApp;