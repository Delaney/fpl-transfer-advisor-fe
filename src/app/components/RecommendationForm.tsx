"use client";

import { useState } from "react";
import Image from "next/image";

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

    const buttonsDisabled = !teamId.length || !cookie.length;

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
            console.error(err);
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
            console.error(err);
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
            <h2 className="text-center text-xl font-bold mb-4">FPL Transfer Advisor</h2>

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

            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={handleFetchSimpleRecommendation}
                    className="btn bg-black text-white rounded-full rounded px-5 py-2 disabled:bg-gray-300"
                    disabled={buttonsDisabled}
                >
                    Simple Recommendation
                </button>
                <button
                    onClick={handleFetchAIRecommendation}
                    className="btn bg-black text-white rounded-full rounded px-5 py-2 disabled:bg-gray-300"
                    disabled={buttonsDisabled}
                >
                    AI Recommendation
                </button>
            </div>

            {loading &&
                <div className="flex justify-center">
                    <Image
                        className=""
                        src="/spinner.svg"
                        alt="Loading"
                        width={100}
                        height={100}
                        priority
                    />
                </div>
            }
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {recommendation && (
                <>
                    <hr className="my-3" />
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
                </>
            )}

            {aiRecommendation && (
                <>
                    <hr className="my-3" />
                    <div className="mt-4">
                        <h3 className="font-semibold">AI Recommendations:</h3>
                        <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap break-words overflow-hidden">{aiRecommendation}</pre>
                    </div>
                </>
            )}
        </div>
    );
}