import { useState } from 'react';  // Removed useEffect since it's not needed

interface Scale {
    root: string;
    name: string;
    notes: string[];
}

const ScaleSelector: React.FC = () => {
    const [selectedRoot, setSelectedRoot] = useState<string>("");
    const [scale, setScale] = useState<Scale | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchScale = async (root: string) => {
        try {
            const response = await fetch(`/scale?root=${root}`);
            if (!response.ok) {
                throw new Error("Failed to fetch scale");
            }
            const data: Scale = await response.json();
            setScale(data);
            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Error fetching scale data:", err.message);
                setError("Error fetching scale data");
            } else {
                console.error("Unknown error:", err);
                setError("An unknown error occurred");
            }
            setScale(null);
        }
    };

    const handleRootChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const root = event.target.value;
        setSelectedRoot(root);
        fetchScale(root);
    };

    return (
        <div>
            <h3>Select a Root Note</h3>
            <select value={selectedRoot} onChange={handleRootChange}>
                <option disabled value="">
                    -- select a note --
                </option>
                <option value="G">G Major</option>
                <option value="A">A Major</option>
            </select>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {scale && (
                <div>
                    <h4>
                        {scale.root} {scale.name} Scale
                    </h4>
                    <ul>
                        {scale.notes.map((note, index) => (
                            <li key={index}>{note}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ScaleSelector;
