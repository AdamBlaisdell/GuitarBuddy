import { useState, useEffect } from 'react';

interface Scale {
    root: string;
    name: string;
    notes: string[];
}

const ScaleSelector: React.FC = () => {
    const [selectedRoot, setSelectedRoot] = useState<string>('');
    const [scale, setScale] = useState<Scale | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch scale data whenever selectedRoot changes
    useEffect(() => {
        if (selectedRoot) {
            fetchScale(selectedRoot);
        }
    }, [selectedRoot]);

    const fetchScale = async (root: string) => {
        try {
            const response = await fetch(`/api/Scale?root=${root}`);
            if (!response.ok) {
                if (response.status === 400) {
                    const errorData = await response.json();
                    setError(errorData?.message || "Error fetching scale data");
                } else {
                    throw new Error("Unexpected error");
                }
            } else {
                const data: Scale = await response.json();
                setScale(data);
                setError(null);
            }
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
                    {/* Display notes as a single line of letters */}
                    <p>{scale.notes.join(' ')}</p>
                </div>
            )}
        </div>
    );
};

export default ScaleSelector;
