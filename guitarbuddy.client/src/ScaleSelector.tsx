import { useState } from 'react';

interface Scale {
    root: string;
    name: string;
    notes: string[]; // Ensure this is an array, even if empty
}

const ScaleSelector: React.FC = () => {
    const [selectedRoot, setSelectedRoot] = useState<string>('');
    const [selectedScale, setSelectedScale] = useState<string>('');
    const [scale, setScale] = useState<Scale | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Function to fetch the scale
    const fetchScale = async (root: string, scale: string) => {
        setLoading(true);
        setError(null); // Reset error before fetching

        try {
            const encodedRoot = encodeURIComponent(root);
            const encodedScale = encodeURIComponent(scale);
            const response = await fetch(import.meta.env.VITE_API_URL + `Scale?root=${encodedRoot}&scale=${encodedScale}`);

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData?.message || 'Error fetching scale data');
                setScale(null);
                return;
            }
                                console.log(import.meta.env.VITE_API_URL);
            const data: Scale = await response.json();
            console.log(data.notes);
            setScale({ ...data, notes: data.notes || [] });
        } catch (err) {
            console.error('Error fetching scale data:', err);
            setError('Error fetching scale data');
            setScale(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Select a Root and Scale</h2>

            <div>
                <label>Root:</label><br />
                <select value={selectedRoot} onChange={(e) => setSelectedRoot(e.target.value)}>
                    <option disabled value="">-- select --</option>
                    <option value="C">C</option>
                    <option value="C#">C#</option>
                    <option value="D">D</option>
                    <option value="D#">D#</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="F#">F#</option>
                    <option value="G">G</option>
                    <option value="G#">G#</option>
                    <option value="A">A</option>
                    <option value="A#">A#</option>
                    <option value="B">B</option>
                    <option value="B#">B#</option>
                    <option value="Db">Db</option>
                    <option value="Eb">Eb</option>
                    <option value="Gb">Gb</option>
                    <option value="Ab">Ab</option>
                    <option value="Bb">Bb</option>
                </select>
            </div>

            <div>
                <label>Scale:</label><br />
                <select value={selectedScale} onChange={(e) => setSelectedScale(e.target.value)}>
                    <option disabled value="">-- select --</option>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                    <option value="melodic_minor">Melodic Minor</option>
                    <option value="harmonic_minor">Harmonic Minor</option>
                    <option value="major_blues">Major Blues</option>
                    <option value="minor_blues">Minor Blues</option>
                    <option value="pentatonic_major">Pentatonic Major</option>
                    <option value="pentatonic_minor">Pentatonic Minor</option>
                    <option value="pentatonic_blues">Pentatonic Blues</option>
                    <option value="chromatic">Chromatic</option>
                </select>
            </div>

            {/* Button to trigger fetching the scale */}
            <button
                onClick={() => {

                    if (selectedRoot && selectedScale) {
                        fetchScale(selectedRoot, selectedScale);
                    } else {
                        setError("Please select both root and scale.");
                    }
                }}
            >
                Get Scale
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {scale ? (
                <div>
                    <h4>{scale.root} {scale.name} Scale</h4>
                    <p>{scale.notes && scale.notes.length > 0 ? scale.notes.join(' ') : 'No notes available'}</p>
                </div>
            ) : (
                <p>No scale data available</p>
            )}
        </div>
    );
};

export default ScaleSelector;

