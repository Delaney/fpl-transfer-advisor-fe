"use client";

import { useState } from "react";

interface Recommendation {
    out: string;
    in: string;
    cost: string;
}

interface AIRecommendation {
    recommendations: string;
}

export default function RecommendationForm() {
    const [teamId, setTeamId] = useState("");
    const [cookie, setCookie] = useState("");
    const [mode, setMode] = useState("single");
    const [recommendation, setRecommendation] = useState<Recommendation[] | null>(null);
    const [aiRecommendation, setAIRecommendation] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchSimpleRecommendation = async () => {
        setLoading(true);
        setError(null);
        clearRecommendations();
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + `simple-analysis-${mode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ teamId, cookie }),
            });

            if (!response.ok) throw new Error("Failed to fetch recommendations");

            const data: Recommendation[] = await response.json();
            setRecommendation(data);
        } catch (err) {
            setError("Error fetching recommendations.");
        } finally {
            setLoading(false);
        }
    };

    const handleFetchAIRecommendation = async () => {
        setLoading(true);
        setError(null);
        clearRecommendations();
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ teamId, cookie }),
            });

            if (!response.ok) throw new Error("Failed to fetch AI recommendations");

            const data: AIRecommendation = await response.json();
            setAIRecommendation(data.recommendations);
        } catch (err) {
            setError("Error fetching AI recommendations.");
        } finally {
            setLoading(false);
        }
    };

    const clearRecommendations = () => {
        setRecommendation(null);
        setAIRecommendation(null);
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto text-black">
            <h2 className="text-xl font-bold mb-4">FPL Transfer Advisor</h2>

            <div className="mb-4">
                <label className="block text-sm font-semibold">Team ID</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold">Cookie</label>
                <textarea
                    className="w-full p-2 border rounded"
                    value={cookie}
                    onChange={(e) => setCookie(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Mode</label>
                <div className="flex flex-col gap-1">
                    <label>
                        <input
                            type="radio"
                            name="mode"
                            value="single"
                            checked={mode === "single"}
                            onChange={(e) => setMode(e.target.value)}
                            className="mr-2"
                        />
                        Single
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mode"
                            value="multiple"
                            checked={mode === "multiple"}
                            onChange={(e) => setMode(e.target.value)}
                            className="mr-2"
                        />
                        Multiple
                    </label>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleFetchSimpleRecommendation}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Simple Recommendation
                </button>
                <button
                    onClick={handleFetchAIRecommendation}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    AI Recommendation
                </button>
            </div>

            {loading && <p className="mt-4">Loading...</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {recommendation && (
                <div className="mt-4">
                    <h3 className="font-semibold">Simple Recommendations:</h3>
                    <ul className="list-disc ml-5">
                        {recommendation.map((rec, index) => (
                            <li key={index}>
                                <strong>Out:</strong> {rec.out}, <strong>In:</strong> {rec.in}, <strong>Cost:</strong> {rec.cost}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {aiRecommendation && (
                <div className="mt-4">
                    <h3 className="font-semibold">AI Recommendations:</h3>
                    <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap break-words overflow-hidden">{aiRecommendation}</pre>
                </div>
            )}
        </div>
    );
}